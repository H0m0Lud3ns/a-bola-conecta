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

Fase segura preparada em `api/leads.js`.

- Email interno confirmado: `contato.gondwana@gmail.com`.
- `DRY_RUN=true` por padrao. Nesse modo a function valida e registra o payload no log, mas nao envia email real nem grava CRM real.
- `CRM_ENDPOINT` e `CRM_API_KEY` ficam vazios ate existir um destino de CRM confirmado.
- O formulario publico atual de comunidade/apoio Pix usa `form_id=comunidade-apoio-pix` e, no dominio final `abolaconecta.com.br`, tentara enviar para `/api/leads`.
- No dominio estatico `sebas-ai.infraqualia.com`, sem endpoint API, o formulario preserva o fallback local no navegador.

### Pendiente: Supabase

Sebastian ainda nao confirmou se A Bola Conecta usara Supabase novo ou existente. Recomendacao operacional: usar Supabase novo/proprio para A Bola Conecta, separado de SportsCoLab e de outros CRMs, para evitar mistura de dados, permissoes e historico comercial.

Antes de producao, falta definir:

- projeto Supabase de A Bola Conecta;
- tabela canonica de leads;
- politicas de acesso;
- responsavel por operar o CRM;
- se o endpoint final sera Supabase direto, um CRM Gondwana existente ou outro backend.

### Teste dry-run

```bash
curl -s -X POST http://127.0.0.1:30300/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"form_id":"comunidade-apoio-pix","fields":{"nome":"Teste Gondwana","email":"teste@example.com","mensagem":"dry-run"}}'
```

Checklist para producao:

- confirmar destino real do CRM;
- configurar `CRM_ENDPOINT` e, se necessario, `CRM_API_KEY`;
- decidir Supabase novo/proprio ou backend existente;
- manter primeiro envio real supervisionado;
- somente depois trocar `DRY_RUN=false`.

## Estado atual

NO-GO para DNS ate fechar:

- teste real de leads em `dry-run` e depois envio supervisionado;
- decisao sobre Supabase novo/proprio para A Bola Conecta;
- decisao de loja: vitrine, pre-venda ou checkout;
- SEO final por rota;
- plano de rollback com Lovable vivo por 72h.
abolaconecta

