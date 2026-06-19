const DEFAULT_NOTIFY_EMAIL = 'contato.gondwana@gmail.com';
const DESTINATION_TIMEOUT_MS = 5000;
const ALLOWED_ORIGINS = new Set([
  'https://abolaconecta.com.br',
  'https://www.abolaconecta.com.br',
  'https://sebas-ai.infraqualia.com',
]);

const json = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const clean = (value, max = 500) => String(value || '').trim().slice(0, max);
const env = (name, max = 1000) => clean(process.env[name], max);

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

const getFields = (body) => (body.fields && typeof body.fields === 'object' ? body.fields : body);

const normalizeLead = (body, req) => {
  const fields = getFields(body);
  const formId = clean(body.form_id || body.formId || fields.form_id || fields.formId || 'a-bola-conecta-general', 120);
  const contact = clean(fields.contact || fields.contato, 220);
  const contactIsEmail = isEmail(contact);
  const messageParts = [
    fields.mensagem || fields.message || fields.comentario || fields.notes,
    fields.valor ? `valor_pix=${fields.valor}` : '',
    fields.dataPix ? `data_pix=${fields.dataPix}` : '',
    fields.publicacao ? `publicacao=${fields.publicacao}` : '',
    fields.nomePublico ? `nome_publico=${fields.nomePublico}` : '',
    fields.comunidadeTime ? `comunidade_time_educacao=${fields.comunidadeTime}` : '',
  ].filter(Boolean);

  return {
    source: 'a-bola-conecta',
    form_id: formId,
    campaign: clean(body.campaign || body.utm_campaign || fields.utm_campaign || 'a-bola-conecta', 160),
    page: clean(body.page || body.url || fields.page || req.headers.referer, 800),
    contact_name: clean(fields.nome || fields.name || fields.nombre || fields.contact_name || fields.contact, 180),
    email: clean(fields.email || (contactIsEmail ? contact : ''), 220).toLowerCase(),
    phone: clean(fields.telefone || fields.whatsapp || fields.phone || (!contactIsEmail ? contact : ''), 120),
    organization: clean(fields.instituicao || fields.institucion || fields.organization || fields.empresa || fields.nomePublico, 220),
    role: clean(fields.profissao || fields.cargo || fields.role, 180),
    city: clean(fields.cidade || fields.city || fields.comuna, 180),
    country: clean(fields.pais || fields.country || 'Brasil', 120),
    interest: clean(fields.interesse || fields.interest || fields.need || fields.tipo || formId, 220),
    message: clean(messageParts.join(' | '), 2000),
    utm_source: clean(body.utm_source || fields.utm_source, 120),
    utm_medium: clean(body.utm_medium || fields.utm_medium, 120),
    utm_campaign: clean(body.utm_campaign || fields.utm_campaign, 160),
    utm_content: clean(body.utm_content || fields.utm_content, 160),
    stage: clean(fields.status || body.status || 'novo', 80),
    owner: 'Gondwana FC',
    priority: formId.includes('contato') || formId.includes('institu') ? 'alta' : 'normal',
    consent: Boolean(fields.consent || fields.consentimento || fields.comunidadeTime || fields.email),
    internal_notify_email: env('INTERNAL_NOTIFY_EMAIL', 220) || DEFAULT_NOTIFY_EMAIL,
    user_agent: clean(req.headers['user-agent'], 500),
    created_at: new Date().toISOString(),
  };
};

const validateLead = (lead) => {
  const errors = [];
  if (!lead.contact_name) errors.push('contact_name');
  if (!lead.email || !isEmail(lead.email)) errors.push('email');
  if (!lead.form_id) errors.push('form_id');
  return errors;
};

const destinationConfig = () => ({
  crmEndpoint: env('CRM_ENDPOINT', 800),
  crmApiKey: env('CRM_API_KEY', 500),
  leadsWebhookUrl: env('LEADS_WEBHOOK_URL', 800),
  leadsWebhookSecret: env('LEADS_WEBHOOK_SECRET', 500),
  sheetsWebhookUrl: env('LEADS_SHEETS_WEBHOOK_URL', 800),
  resendApiKey: env('RESEND_API_KEY', 500),
  emailTo: env('LEADS_EMAIL_TO', 500) || env('INTERNAL_NOTIFY_EMAIL', 220) || DEFAULT_NOTIFY_EMAIL,
  emailFrom: env('LEADS_EMAIL_FROM', 500),
});

const activeDestinations = (config = destinationConfig()) => {
  const destinations = [];
  if (config.crmEndpoint) destinations.push('crm');
  if (config.leadsWebhookUrl) destinations.push('webhook');
  if (config.sheetsWebhookUrl) destinations.push('sheets');
  if (config.resendApiKey && config.emailTo && config.emailFrom) destinations.push('email');
  return destinations;
};

const dryRunEnabled = () => {
  const explicit = env('LEADS_DRY_RUN', 20) || env('DRY_RUN', 20);
  if (explicit) return explicit.toLowerCase() !== 'false';
  return activeDestinations().length === 0;
};

const withTimeout = async (run, label) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`${label}_timeout`)), DESTINATION_TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

const postJson = async (url, payload, headers = {}, label = 'destination') => withTimeout(async (signal) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
    signal,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${label}_failed:${response.status}:${text.slice(0, 500)}`);
  if (!text) return { ok: true };
  try {
    return JSON.parse(text);
  } catch (_) {
    return { ok: true, response: text.slice(0, 500) };
  }
}, label);

const forwardToCrm = async (lead, config = destinationConfig()) => {
  if (!config.crmEndpoint) return { skipped: true, reason: 'missing_crm_endpoint' };
  const headers = config.crmApiKey ? { Authorization: `Bearer ${config.crmApiKey}` } : {};
  return postJson(config.crmEndpoint, { source: 'a-bola-conecta', formId: lead.form_id, fields: lead }, headers, 'crm');
};

const forwardToWebhook = async (lead, config = destinationConfig()) => {
  if (!config.leadsWebhookUrl) return { skipped: true, reason: 'missing_leads_webhook_url' };
  const headers = config.leadsWebhookSecret ? { 'X-Webhook-Secret': config.leadsWebhookSecret } : {};
  return postJson(config.leadsWebhookUrl, lead, headers, 'webhook');
};

const forwardToSheets = async (lead, config = destinationConfig()) => {
  if (!config.sheetsWebhookUrl) return { skipped: true, reason: 'missing_leads_sheets_webhook_url' };
  return postJson(config.sheetsWebhookUrl, lead, {}, 'sheets');
};

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const leadEmailText = (lead) => [
  'Novo lead A Bola Conecta',
  '',
  `Nome: ${lead.contact_name}`,
  `Email: ${lead.email}`,
  `Telefone: ${lead.phone || '-'}`,
  `Organizacao: ${lead.organization || '-'}`,
  `Cargo/perfil: ${lead.role || '-'}`,
  `Cidade: ${lead.city || '-'}`,
  `Pais: ${lead.country || '-'}`,
  `Interesse: ${lead.interest}`,
  `Formulario: ${lead.form_id}`,
  `Campanha: ${lead.campaign}`,
  `Pagina: ${lead.page}`,
  `UTM source: ${lead.utm_source || '-'}`,
  `UTM medium: ${lead.utm_medium || '-'}`,
  `UTM campaign: ${lead.utm_campaign || '-'}`,
  `Mensagem: ${lead.message || '-'}`,
  `Data: ${lead.created_at}`,
].join('\n');

const leadEmailHtml = (lead) => `
  <h2>Novo lead A Bola Conecta</h2>
  <p><strong>Nome:</strong> ${escapeHtml(lead.contact_name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
  <p><strong>Telefone:</strong> ${escapeHtml(lead.phone || '-')}</p>
  <p><strong>Organizacao:</strong> ${escapeHtml(lead.organization || '-')}</p>
  <p><strong>Cargo/perfil:</strong> ${escapeHtml(lead.role || '-')}</p>
  <p><strong>Cidade:</strong> ${escapeHtml(lead.city || '-')}</p>
  <p><strong>Pais:</strong> ${escapeHtml(lead.country || '-')}</p>
  <p><strong>Interesse:</strong> ${escapeHtml(lead.interest)}</p>
  <p><strong>Formulario:</strong> ${escapeHtml(lead.form_id)}</p>
  <p><strong>Campanha:</strong> ${escapeHtml(lead.campaign)}</p>
  <p><strong>Pagina:</strong> ${escapeHtml(lead.page)}</p>
  <p><strong>Mensagem:</strong><br>${escapeHtml(lead.message || '-')}</p>
  <p><strong>Data:</strong> ${escapeHtml(lead.created_at)}</p>
`;

const sendLeadEmail = async (lead, config = destinationConfig()) => {
  if (!config.resendApiKey || !config.emailTo || !config.emailFrom) {
    return { skipped: true, reason: 'missing_email_config' };
  }

  return withTimeout(async (signal) => {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.emailFrom,
        to: config.emailTo.split(',').map((item) => item.trim()).filter(Boolean),
        reply_to: lead.email,
        subject: `[A Bola Conecta] ${lead.contact_name} - ${lead.interest}`,
        text: leadEmailText(lead),
        html: leadEmailHtml(lead),
      }),
      signal,
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`resend_failed:${response.status}:${text.slice(0, 500)}`);
    return text ? JSON.parse(text) : { ok: true };
  }, 'email');
};

const runDestinations = async (lead) => {
  const config = destinationConfig();
  const enabled = activeDestinations(config);
  const jobs = [
    ['crm', () => forwardToCrm(lead, config)],
    ['webhook', () => forwardToWebhook(lead, config)],
    ['sheets', () => forwardToSheets(lead, config)],
    ['email', () => sendLeadEmail(lead, config)],
  ].filter(([name]) => enabled.includes(name));

  const settled = await Promise.allSettled(jobs.map(([, run]) => run()));
  return settled.map((result, index) => {
    const name = jobs[index][0];
    if (result.status === 'fulfilled') return { name, ok: true, result: result.value };
    console.error(`[a-bola-conecta leads] destination_failed:${name}`, result.reason);
    return { name, ok: false, error: String(result.reason?.message || result.reason).slice(0, 700) };
  });
};

module.exports = async (req, res) => {
  const origin = String(req.headers.origin || '');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.has(origin) ? origin : 'https://abolaconecta.com.br');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method_not_allowed' });

  try {
    const body = await readBody(req);
    if (clean(body.website, 120)) return json(res, 202, { ok: true, ignored: true });

    const lead = normalizeLead(body, req);
    const errors = validateLead(lead);
    if (errors.length) return json(res, 422, { ok: false, error: 'validation_error', fields: errors });

    if (dryRunEnabled()) {
      console.log('[a-bola-conecta leads dry-run]', JSON.stringify(lead));
      return json(res, 200, {
        ok: true,
        dry_run: true,
        lead,
        destinations: activeDestinations(),
        notification: { skipped: true, reason: 'dry_run_or_no_destinations', to: lead.internal_notify_email },
      });
    }

    const destinations = await runDestinations(lead);
    return json(res, 200, { ok: true, dry_run: false, lead, destinations });
  } catch (error) {
    return json(res, 500, { ok: false, error: 'lead_handler_failed', detail: String(error.message || error).slice(0, 700) });
  }
};
