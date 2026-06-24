# A Bola Conecta - deploy Vercel isolado

Este pacote prepara o site A Bola Conecta para um projeto Vercel separado de `gondwana-social`.

## Regra

Nao usar login global de Vercel.
Nao executar `vercel login`, `vercel link`, `vercel switch` ou `vercel logout`.
Nao criar `.vercel/project.json` manualmente com dados inventados.

Deploy real somente depois de Sebastian/Ivan confirmar:

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `projectName`
- repo GitHub canonico
- estrategia de dominio `abolaconecta.com.br`

## Build local

```bash
cd deploy/a-bola-conecta-vercel
npm run build
npm run check
```

Por seguranca, o build bloqueia indexacao por padrao.

Para gerar a versao final indexavel, usar somente no pre-cutover aprovado:

```bash
ABOLA_ALLOW_INDEX=1 npm run build
npm run check
```

## Fonte

O build copia de:

```text
public/a-bola-conecta/
```

E gera:

```text
deploy/a-bola-conecta-vercel/dist/
```

Durante o build, caminhos de assets saem de `/a-bola-conecta/assets/...` para `/assets/...`, preparando o site para rodar no dominio raiz.

## Leads / CRM

A entrada canonica de leads e `api/leads.js`. Os formularios publicos em `abolaconecta.com.br` enviam para `/api/leads`.

A function valida `contact_name`, `email` e `form_id`, normaliza os campos e pode encaminhar o mesmo lead para destinos reais por variaveis de ambiente. Todos os destinos sao opcionais: se uma variavel nao existir, aquele destino e ignorado.

### Destinos suportados

- Email via Resend:
  - `RESEND_API_KEY`
  - `LEADS_EMAIL_FROM`
  - `LEADS_EMAIL_TO`
- Webhook generico:
  - `LEADS_WEBHOOK_URL`
  - `LEADS_WEBHOOK_SECRET` opcional, enviado como header `X-Webhook-Secret`
- Google Sheet via Apps Script ou outro receptor de planilha:
  - `LEADS_SHEETS_WEBHOOK_URL`
- CRM/backend futuro:
  - `CRM_ENDPOINT`
  - `CRM_API_KEY` opcional, enviado como `Authorization: Bearer ...`
- Controle de teste:
  - `LEADS_DRY_RUN=true|false`
  - `DRY_RUN=true|false` continua aceito por compatibilidade
  - Se nenhuma saida real estiver configurada, a function fica em dry-run automaticamente

Email interno padrao: `contato.gondwana@gmail.com`.

### Payload normalizado

A function preserva campos planos antigos para compatibilidade, mas agora tambem entrega blocos separados para operacao responsavel:

- `lead_type`: `download`, `support_pix`, `community`, `partnership` ou `contact`;
- `contact`: dados da pessoa/instituicao;
- `download`: material e intencao de uso quando o formulario for de PDF/guia;
- `support_pix`: valor informado, data Pix e status de conciliacao quando o formulario for de apoio;
- `community`: preferencias de participacao;
- `compliance`: consentimento, aceite de privacidade e alerta de conciliacao financeira;
- `raw_fields`: campos originais enviados pelo formulario.

```json
{
  "source": "a-bola-conecta",
  "lead_type": "download",
  "form_id": "copa-2026-ebook",
  "campaign": "copa-2026-selecoes-gondwana",
  "page": "https://www.abolaconecta.com.br/copa-2026",
  "contact_name": "Nome",
  "email": "nome@example.com",
  "phone": "",
  "organization": "Escola ou instituicao",
  "role": "educador",
  "city": "Sao Paulo",
  "country": "Brasil",
  "interest": "copa-2026-ebook",
  "message": "Como pretende usar o guia",
  "utm_source": "direct",
  "utm_medium": "site",
  "utm_campaign": "copa-2026-selecoes-gondwana",
  "utm_content": "",
  "stage": "novo",
  "owner": "Gondwana FC",
  "priority": "normal",
  "consent": true,
  "contact": { "name": "Nome", "email": "nome@example.com" },
  "download": { "material": "gondwana-na-copa-pdf", "intended_use": "aula", "release_policy": "immediate_after_form_submit" },
  "support_pix": null,
  "community": null,
  "compliance": {
    "consent_communication": true,
    "privacy_policy_accepted": true,
    "legal_basis": "consentimento",
    "financial_reconciliation_required": false
  },
  "internal_notify_email": "contato.gondwana@gmail.com",
  "created_at": "2026-06-19T20:00:00.000Z"
}
```

### Teste dry-run

```bash
curl -s -X POST http://127.0.0.1:30300/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"form_id":"comunidade-apoio-pix","fields":{"nome":"Teste Gondwana","email":"teste@example.com","mensagem":"dry-run"}}'
```

Checklist para producao:

- configurar ao menos um destino real, idealmente `RESEND_API_KEY`, `LEADS_EMAIL_FROM`, `LEADS_EMAIL_TO` e `LEADS_SHEETS_WEBHOOK_URL`;
- fazer primeiro envio real supervisionado;
- usar `LEADS_DRY_RUN=false` somente quando o destino responder corretamente;
- manter `CRM_ENDPOINT` reservado para CRM futuro, se necessario.

## Estado atual

NO-GO para DNS ate fechar:

- teste real de leads em `dry-run` e depois envio supervisionado;
- decisao sobre Supabase novo/proprio para A Bola Conecta;
- decisao de loja: vitrine, pre-venda ou checkout;
- SEO final por rota;
- plano de rollback com Lovable vivo por 72h.
abolaconecta

