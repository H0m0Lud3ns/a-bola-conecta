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

## Estado atual

NO-GO para DNS ate fechar:

- destino e teste real de `contato` e `apoie`;
- decisao de loja: vitrine, pre-venda ou checkout;
- SEO final por rota;
- plano de rollback com Lovable vivo por 72h.

