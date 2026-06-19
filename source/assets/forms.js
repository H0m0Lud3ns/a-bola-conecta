(() => {
  const params = new URLSearchParams(window.location.search);
  const fallbackKey = 'abc_leads_fallback';

  const defaultEndpoint = () => {
    const configured = window.GONDWANA_CONFIG?.leadsEndpoint;
    if (configured) return configured;
    if (window.location.hostname.endsWith('abolaconecta.com.br')) return '/api/leads';
    return '';
  };

  const readForm = (form) => {
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries());
    return {
      source: 'a-bola-conecta',
      form_id: form.dataset.formId || form.id || 'a-bola-conecta-form',
      campaign: form.dataset.campaign || params.get('utm_campaign') || 'a-bola-conecta',
      page: window.location.href,
      utm_source: params.get('utm_source') || 'direct',
      utm_medium: params.get('utm_medium') || 'site',
      utm_campaign: params.get('utm_campaign') || form.dataset.campaign || 'a-bola-conecta',
      utm_content: params.get('utm_content') || '',
      fields,
      timestamp: new Date().toISOString(),
    };
  };

  const saveFallback = (payload) => {
    const current = JSON.parse(localStorage.getItem(fallbackKey) || '[]');
    current.push(payload);
    localStorage.setItem(fallbackKey, JSON.stringify(current));
  };

  const setStatus = (form, state, text) => {
    const target = form.querySelector('[data-form-status]') || document.getElementById(form.dataset.statusId || '');
    if (!target) return;
    target.className = `form-status ${state || ''}`.trim();
    target.textContent = text;
  };

  document.querySelectorAll('form[data-abc-lead]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const endpoint = defaultEndpoint();
      const payload = readForm(form);
      setStatus(form, '', 'Registrando...');

      try {
        if (!endpoint) throw new Error('endpoint_nao_configurado');
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!result.ok) throw new Error(result.error || 'erro_crm');
        setStatus(form, 'ok', form.dataset.successMessage || 'Registro enviado.');
        form.reset();
      } catch (error) {
        saveFallback(payload);
        setStatus(form, 'error', form.dataset.errorMessage || 'Não conseguimos enviar agora. O registro ficou salvo neste navegador.');
      }
    });
  });
})();
