# Manifesto - transferencia A Bola Conecta

## Objetivo

Preparar a transferencia do site A Bola Conecta para `abolaconecta.com.br`, com codigo e documentacao no GitHub `H0m0Lud3ns/a-bola-conecta`.

## Arquivos de documentacao criados

- `docs/transferencia-abolaconecta-com-br.md`

## Estado tecnico

- Pacote local: `deploy/a-bola-conecta-vercel/`
- Remoto Git configurado: `https://github.com/H0m0Lud3ns/a-bola-conecta.git`
- Build validado localmente:

```bash
npm run build
npm run check
```

- Resultado: `CHECK OK: dist pronto para preview Vercel isolado`.

## Confirmado por Sebastian

1. Repo canonico: `H0m0Lud3ns/a-bola-conecta`.
2. Hosting final: Vercel.
3. Acesso DNS de `abolaconecta.com.br`: Sebastian.
4. `contato`, `apoie` e `loja`: atualizados na nova versao.

## Pendencias antes de publicar

1. Revisar mudancas locais pendentes no pacote antes de qualquer commit de conteudo.
2. Confirmar projeto Vercel ou criar projeto com credenciais corretas.
3. Definir apex/www para `abolaconecta.com.br`.
4. Liberar indexacao somente no build final aprovado.
5. Aprovar janela de cutover e plano de rollback.

## Comando sugerido para revisar status

```bash
cd deploy/a-bola-conecta-vercel
git status --short
npm run build
npm run check
```

## Observacao

Nenhuma acao de DNS, Cloudflare, Vercel real ou push foi executada nesta etapa.
