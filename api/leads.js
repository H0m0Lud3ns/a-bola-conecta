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
    internal_notify_email: clean(process.env.INTERNAL_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL, 220),
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

const dryRunEnabled = () => String(process.env.DRY_RUN || 'true').toLowerCase() !== 'false';

const forwardToCrm = async (lead) => {
  const endpoint = clean(process.env.CRM_ENDPOINT, 800);
  if (!endpoint) return { skipped: true, reason: 'missing_crm_endpoint' };

  const headers = { 'Content-Type': 'application/json' };
  const apiKey = clean(process.env.CRM_API_KEY, 500);
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ source: 'a-bola-conecta', formId: lead.form_id, fields: lead }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`crm_forward_failed:${response.status}:${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : { ok: true };
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
        notification: { skipped: true, reason: 'dry_run_no_real_email', to: lead.internal_notify_email },
      });
    }

    const crm = await forwardToCrm(lead);
    return json(res, 201, { ok: true, dry_run: false, lead, crm });
  } catch (error) {
    return json(res, 500, { ok: false, error: 'lead_handler_failed', detail: String(error.message || error).slice(0, 700) });
  }
};
