(() => {
  const params = new URLSearchParams(window.location.search);
  const fallbackKey = 'abc_leads_fallback';

  const defaultEndpoint = () => {
    const configured = window.GONDWANA_CONFIG?.leadsEndpoint;
    if (configured) return configured;
    if (window.location.hostname.endsWith('abolaconecta.com.br')) return '/api/leads';
    // Em portais espelho (sebas-ai.infraqualia.com, sebas-acevedo-ai.infraqualia.com, etc)
    // o backend nao existe aqui. Aponta direto para o site de producao, que tem CORS
    // configurado. Se tambem falhar, o fallback 404/405 libera o download.
    return 'https://www.abolaconecta.com.br/api/leads';
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

  const clearFieldErrors = (form) => {
    form.querySelectorAll('[data-field-error]').forEach((el) => {
      el.textContent = '';
      el.classList.remove('is-active');
    });
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  };

  const showFieldError = (input, message) => {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    const errId = input.getAttribute('aria-describedby');
    if (errId) {
      const errEl = document.getElementById(errId);
      if (errEl) {
        errEl.textContent = message;
        errEl.classList.add('is-active');
      }
    }
  };

  const validateForm = (form) => {
    clearFieldErrors(form);
    let firstInvalid = null;
    const nome = form.querySelector('[name="nome"]');
    const email = form.querySelector('[name="email"]');
    const consent = form.querySelector('[name="consent"]');
    if (nome && !nome.value.trim()) {
      showFieldError(nome, 'Diz teu nome pra gente saber quem recebeu o guia.');
      firstInvalid = firstInvalid || nome;
    }
    if (email) {
      if (!email.value.trim()) {
        showFieldError(email, 'Email é obrigatório pra receber o link do PDF.');
        firstInvalid = firstInvalid || email;
      } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Esse email não parece válido. Confere se tem @ e domínio.');
        firstInvalid = firstInvalid || email;
      }
    }
    if (consent && !consent.checked) {
      const consentLabel = consent.closest('label');
      const consentErr = document.getElementById('err-guideConsent');
      if (consentErr) {
        consentErr.textContent = 'Marca a autorização pra gente poder te mandar o guia.';
        consentErr.classList.add('is-active');
      }
      if (consentLabel) consentLabel.classList.add('is-invalid');
      firstInvalid = firstInvalid || consent;
    }
    return firstInvalid;
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

  const renderSuccessDownload = (form, result) => {
    const link = form.dataset.successDownloadUrl;
    if (!link) return;
    const label = form.dataset.successDownloadLabel || 'Baixar PDF';
    const size = form.dataset.successDownloadSize || '';
    const target = form.querySelector('[data-form-status]') || document.getElementById(form.dataset.statusId || '');
    if (!target) return;
    const wrap = document.createElement('div');
    wrap.className = 'form-download';
    const a = document.createElement('a');
    a.className = 'btn btn-accent form-download-btn';
    a.href = link;
    a.setAttribute('download', '');
    a.rel = 'noopener';
    a.textContent = label;
    const meta = document.createElement('p');
    meta.className = 'form-download-meta';
    meta.textContent = size;
    wrap.appendChild(a);
    wrap.appendChild(meta);
    target.appendChild(wrap);
  };

  const flushFallback = async (endpoint) => {
    const raw = localStorage.getItem(fallbackKey);
    if (!raw) return;
    let queue;
    try { queue = JSON.parse(raw); } catch (_) { return; }
    if (!Array.isArray(queue) || queue.length === 0) return;
    const remaining = [];
    for (const payload of queue) {
      try {
        await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } catch (_) {
        remaining.push(payload);
      }
    }
    if (remaining.length) localStorage.setItem(fallbackKey, JSON.stringify(remaining));
    else localStorage.removeItem(fallbackKey);
  };

  document.querySelectorAll('form[data-abc-lead]').forEach((form) => {
    const submit = form.querySelector('button[type="submit"], #copaGuideSubmit') || form.querySelector('button');
    const onSubmit = async (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const firstInvalid = validateForm(form);
      if (firstInvalid) {
        try { firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstInvalid.focus({ preventScroll: true }); } catch (_) {}
        return;
      }
      const endpoint = defaultEndpoint();
      const payload = readForm(form);
      setStatus(form, '', 'Registrando...');

      try {
        if (!endpoint) throw new Error('endpoint_nao_configurado');
        await flushFallback(endpoint);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result || result.ok === false) {
          // Em portais espelho sem backend proprio, libera o download como fallback
          // educacional: o material e aberto, o importante e nao travar a UX.
          const reason = (result && result.error) || `http_${response.status}`;
          if (response.status === 404 || response.status === 405) {
            setStatus(form, 'ok', form.dataset.successMessage || 'Registro enviado.');
            renderSuccessDownload(form, result || {});
            return;
          }
          throw new Error(reason);
        }
        setStatus(form, 'ok', form.dataset.successMessage || 'Registro enviado.');
        renderSuccessDownload(form, result);
        form.reset();
      } catch (error) {
        saveFallback(payload);
        setStatus(form, 'error', form.dataset.errorMessage || 'Não conseguimos enviar agora. O registro ficou salvo neste navegador.');
      }
    };
    form.addEventListener('submit', onSubmit);
    if (submit) submit.addEventListener('click', onSubmit);
  });

  // Reprocessa fila salva quando a rede volta, mesmo sem submit.
  window.addEventListener('online', () => {
    const endpoint = defaultEndpoint();
    if (endpoint) flushFallback(endpoint);
  });
})();
