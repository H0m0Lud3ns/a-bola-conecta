const DEFAULT_NOTIFY_EMAIL = 'contato.gondwana@gmail.com';
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

const hasValue = (value) => clean(value, 500).length > 0;

const classifyLeadType = (formId, fields = {}) => {
  const id = String(formId || '').toLowerCase();
  if (id.includes('store-shirt') || id.includes('camisa') || fields.tipo === 'store_shirt') return 'store_shirt';
  if (id.includes('apoie') || id.includes('apoio') || id.includes('pix') || hasValue(fields.valor) || hasValue(fields.valorOutro) || hasValue(fields.dataPix)) return 'support_pix';
  if (id.includes('download') || id.includes('ebook') || id.includes('guia') || id.includes('pdf')) return 'download';
  if (id.includes('comunidade') || hasValue(fields.comunidadeTime) || hasValue(fields.nomePublico)) return 'community';
  if (id.includes('contato') || id.includes('parceria') || id.includes('institu')) return 'partnership';
  return 'contact';
};

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

  const leadType = classifyLeadType(formId, fields);
  const consent = Boolean(fields.consent || fields.consentimento || fields.comunidadeTime || fields.email);
  const contactRecord = {
    name: clean(fields.nome || fields.name || fields.nombre || fields.contact_name || fields.contact, 180),
    email: clean(fields.email || (contactIsEmail ? contact : ''), 220).toLowerCase(),
    phone: clean(fields.telefone || fields.whatsapp || fields.phone || (!contactIsEmail ? contact : ''), 120),
    organization: clean(fields.instituicao || fields.institucion || fields.organization || fields.empresa || fields.nomePublico, 220),
    role: clean(fields.profissao || fields.cargo || fields.role || fields.perfil, 180),
    city: clean(fields.cidade || fields.city || fields.comuna, 180),
    country: clean(fields.pais || fields.country || 'Brasil', 120),
  };
  const tracking = {
    page: clean(body.page || body.url || fields.page || req.headers.referer, 800),
    utm_source: clean(body.utm_source || fields.utm_source, 120),
    utm_medium: clean(body.utm_medium || fields.utm_medium, 120),
    utm_campaign: clean(body.utm_campaign || fields.utm_campaign, 160),
    utm_content: clean(body.utm_content || fields.utm_content, 160),
    user_agent: clean(req.headers['user-agent'], 500),
  };

  return {
    source: 'a-bola-conecta',
    lead_type: leadType,
    form_id: formId,
    campaign: clean(body.campaign || body.utm_campaign || fields.utm_campaign || 'a-bola-conecta', 160),
    page: tracking.page,
    contact_name: contactRecord.name,
    email: contactRecord.email,
    phone: contactRecord.phone,
    organization: contactRecord.organization,
    role: contactRecord.role,
    city: contactRecord.city,
    country: contactRecord.country,
    interest: clean(fields.interesse || fields.interest || fields.need || fields.tipo || formId, 220),
    message: clean(messageParts.join(' | '), 2000),
    utm_source: tracking.utm_source,
    utm_medium: tracking.utm_medium,
    utm_campaign: tracking.utm_campaign,
    utm_content: tracking.utm_content,
    stage: clean(fields.status || body.status || 'novo', 80),
    owner: 'Gondwana FC',
    priority: formId.includes('contato') || formId.includes('institu') ? 'alta' : 'normal',
    consent,
    contact: contactRecord,
    download: leadType === 'download' ? {
      material: clean(fields.material || fields.guia || fields.pdf || 'gondwana-na-copa-pdf', 180),
      intended_use: clean(fields.uso || fields.intencao_uso || fields.message || fields.mensagem, 700),
      release_policy: 'immediate_after_form_submit',
    } : null,
    support_pix: leadType === 'support_pix' ? {
      value_informed: clean(fields.valor || fields.valor_informado, 80),
      custom_value: clean(fields.valorOutro || fields.valor_outro, 80),
      pix_date_informed: clean(fields.dataPix || fields.data_pix || fields.data, 80),
      pix_name_informed: clean(fields.nomePix || fields.nome_pix || fields.nome, 180),
      purpose: clean(fields.finalidade || fields.interesse || 'apoio-circulacao-educativa', 220),
      reconciliation_status: 'recebido_formulario',
      receipt_requested: Boolean(fields.comprovante || fields.nota || fields.recibo),
    } : null,
    community: leadType === 'community' ? {
      wants_community: true,
      participation_type: clean(fields.comunidadeTime || fields.tipo || fields.interesse, 220),
      public_name: clean(fields.nomePublico || fields.nome_publico, 180),
      publication_consent: Boolean(fields.publicacao || fields.autorizacaoMural),
    } : null,
    compliance: {
      consent_communication: consent,
      privacy_policy_accepted: Boolean(fields.consent || fields.consentimento),
      legal_basis: consent ? 'consentimento' : 'interesse_legitimo_minimo_operacional',
      financial_reconciliation_required: leadType === 'support_pix',
      notes: leadType === 'support_pix' ? 'Nao emitir comprovante automaticamente. Conciliar Pix e validar fluxo fiscal/contabil antes de qualquer emissao.' : '',
    },
    tracking,
    raw_fields: fields,
    internal_notify_email: clean(process.env.INTERNAL_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL, 220),
    user_agent: tracking.user_agent,
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
  googleSheetsId: env('GOOGLE_SHEETS_ID', 200),
  googleSheetsRange: env('GOOGLE_SHEETS_RANGE', 200) || 'Leads!A:O',
  googleClientId: env('GOOGLE_CLIENT_ID', 500),
  googleClientSecret: env('GOOGLE_CLIENT_SECRET', 500),
  googleRefreshToken: env('GOOGLE_REFRESH_TOKEN', 2000),
  resendApiKey: env('RESEND_API_KEY', 500),
  emailTo: env('LEADS_EMAIL_TO', 500) || env('INTERNAL_NOTIFY_EMAIL', 220) || DEFAULT_NOTIFY_EMAIL,
  emailFrom: env('LEADS_EMAIL_FROM', 500),
});

const googleSheetsReady = (config = destinationConfig()) => Boolean(
  config.googleSheetsId
  && config.googleClientId
  && config.googleClientSecret
  && config.googleRefreshToken,
);

const activeDestinations = (config = destinationConfig()) => {
  const destinations = [];
  if (config.crmEndpoint) destinations.push('crm');
  if (config.leadsWebhookUrl) destinations.push('webhook');
  if (config.sheetsWebhookUrl) destinations.push('sheets');
  if (googleSheetsReady(config)) destinations.push('google_sheets');
  if (config.resendApiKey && config.emailTo && config.emailFrom) destinations.push('email');
  return destinations;
};

const dryRunEnabled = () => {
  const explicit = env('LEADS_DRY_RUN', 20) || env('DRY_RUN', 20);
  if (explicit) return explicit.toLowerCase() !== 'false';
  return activeDestinations().length === 0;
};

const postJson = async (url, payload, headers = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`post_failed:${response.status}:${text.slice(0, 500)}`);
  if (!text) return { ok: true };
  try {
    return JSON.parse(text);
  } catch (_) {
    return { ok: true, response: text.slice(0, 500) };
  }
};

const forwardToCrm = async (lead, config = destinationConfig()) => {
  if (!config.crmEndpoint) return { skipped: true, reason: 'missing_crm_endpoint' };
  const headers = config.crmApiKey ? { Authorization: `Bearer ${config.crmApiKey}` } : {};
  return postJson(config.crmEndpoint, { source: 'a-bola-conecta', formId: lead.form_id, fields: lead }, headers);
};

const forwardToWebhook = async (lead, config = destinationConfig()) => {
  if (!config.leadsWebhookUrl) return { skipped: true, reason: 'missing_leads_webhook_url' };
  const headers = config.leadsWebhookSecret ? { 'X-Webhook-Secret': config.leadsWebhookSecret } : {};
  return postJson(config.leadsWebhookUrl, lead, headers);
};

const forwardToSheets = async (lead, config = destinationConfig()) => {
  if (!config.sheetsWebhookUrl) return { skipped: true, reason: 'missing_leads_sheets_webhook_url' };
  return postJson(config.sheetsWebhookUrl, lead);
};

const getGoogleAccessToken = async (config = destinationConfig()) => {
  if (!googleSheetsReady(config)) throw new Error('missing_google_sheets_config');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      refresh_token: config.googleRefreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`google_token_failed:${response.status}:${text.slice(0, 500)}`);
  const data = JSON.parse(text);
  if (!data.access_token) throw new Error('google_token_missing_access_token');
  return data.access_token;
};

const leadToSheetRow = (lead) => [[
  lead.created_at,
  lead.page || lead.form_id || 'a-bola-conecta',
  lead.contact_name,
  lead.email,
  lead.phone,
  lead.organization,
  lead.city,
  lead.country,
  lead.interest,
  lead.message,
  lead.utm_source,
  lead.utm_medium,
  lead.utm_campaign,
  lead.utm_content,
  lead.stage || 'novo',
]];

const appendToGoogleSheets = async (lead, config = destinationConfig()) => {
  if (!googleSheetsReady(config)) return { skipped: true, reason: 'missing_google_sheets_config' };
  const token = await getGoogleAccessToken(config);
  const range = encodeURIComponent(config.googleSheetsRange);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.googleSheetsId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: leadToSheetRow(lead) }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`google_sheets_append_failed:${response.status}:${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : { ok: true };
};

const escapeHtml = (value) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('\"', '&quot;')
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
  `Tipo: ${lead.lead_type || '-'}`,
  `Interesse: ${lead.interest}`,
  `Formulario: ${lead.form_id}`,
  `Conciliação Pix: ${lead.support_pix?.reconciliation_status || '-'}`,
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
  <p><strong>Tipo:</strong> ${escapeHtml(lead.lead_type || '-')}</p>
  <p><strong>Interesse:</strong> ${escapeHtml(lead.interest)}</p>
  <p><strong>Formulario:</strong> ${escapeHtml(lead.form_id)}</p>
  <p><strong>Conciliação Pix:</strong> ${escapeHtml(lead.support_pix?.reconciliation_status || '-')}</p>
  <p><strong>Campanha:</strong> ${escapeHtml(lead.campaign)}</p>
  <p><strong>Pagina:</strong> ${escapeHtml(lead.page)}</p>
  <p><strong>Mensagem:</strong><br>${escapeHtml(lead.message || '-')}</p>
  <p><strong>Data:</strong> ${escapeHtml(lead.created_at)}</p>
`;

const sendLeadEmail = async (lead, config = destinationConfig()) => {
  if (!config.resendApiKey || !config.emailTo || !config.emailFrom) {
    return { skipped: true, reason: 'missing_email_config' };
  }

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
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`resend_failed:${response.status}:${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : { ok: true };
};

const runDestinations = async (lead) => {
  const config = destinationConfig();
  const jobs = [
    ['crm', () => forwardToCrm(lead, config)],
    ['webhook', () => forwardToWebhook(lead, config)],
    ['sheets', () => forwardToSheets(lead, config)],
    ['google_sheets', () => appendToGoogleSheets(lead, config)],
    ['email', () => sendLeadEmail(lead, config)],
  ].filter(([name]) => activeDestinations(config).includes(name));

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
