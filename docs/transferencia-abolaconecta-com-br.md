# Transferencia para abolaconecta.com.br

Documento operacional para mover o site A Bola Conecta do ambiente de revisao em Infraqualia para o dominio canonico `abolaconecta.com.br`.

## Estado atual

- Decisao confirmada por Sebastian: usar GitHub `H0m0Lud3ns/a-bola-conecta` como repo canonico.
- Decisao confirmada por Sebastian: usar Vercel como hosting final.
- Decisao confirmada por Sebastian: Sebastian tem acesso DNS ao dominio `abolaconecta.com.br`.
- Estado de produto informado por Sebastian: `contato`, `apoie` e `loja` foram atualizados na nova versao.
- Recomendacao SEO: manter previews como `noindex`; liberar indexacao somente no build final aprovado para o dominio canonico.

- Site em revisao Infraqualia: `https://sebas-ai.infraqualia.com/a-bola-conecta/`
- Pacote de deploy isolado: `deploy/a-bola-conecta-vercel/`
- Repo GitHub configurado localmente: `https://github.com/H0m0Lud3ns/a-bola-conecta.git`
- Build local validado com:

```bash
npm run build
npm run check
```

Resultado atual: `CHECK OK: dist pronto para preview Vercel isolado`.

## Principio de transferencia

Nao vamos apontar o dominio antes de o site estar pronto, versionado, testado e com rollback claro.

A transferencia deve separar quatro camadas:

1. Codigo fonte e documentacao no GitHub.
2. Build estatico testavel em ambiente de preview.
3. Hosting definitivo.
4. DNS do dominio `abolaconecta.com.br`.

## Opcao recomendada: Vercel com dominio proprio

Esta e a opcao mais limpa porque o pacote ja esta preparado para Vercel.

### Como funcionaria

- O repo `H0m0Lud3ns/a-bola-conecta` fica como fonte canonica.
- A Vercel gera previews por branch/commit.
- O dominio `abolaconecta.com.br` e `www.abolaconecta.com.br` apontam para o projeto Vercel.
- O site roda na raiz do dominio, nao dentro de `/a-bola-conecta/`.

### Pros

- Deploy por GitHub.
- Preview antes de publicar.
- SSL automatico.
- Rollback rapido por deployment anterior.
- `vercel.json` ja existe com headers, redirects e rewrites.

### Contras

- Exige confirmar projeto Vercel correto.
- Exige acesso ao DNS do dominio.
- Precisa decidir quando liberar indexacao.

### Dados necessarios

Antes de qualquer deploy real, confirmar:

```text
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
projectName=
repo GitHub canonico=H0m0Lud3ns/a-bola-conecta
estrategia de dominio=abolaconecta.com.br + www.abolaconecta.com.br
```

Nao usar login global de Vercel. Nao executar `vercel login`, `vercel link`, `vercel switch` ou `vercel logout`.

## Opcao alternativa: manter Infraqualia e apontar dominio

Tambem seria possivel manter o site servido pela infraestrutura atual e apontar `abolaconecta.com.br` para ela.

### Pros

- Menos mudanca de hosting.
- Aproveita o que ja esta online.

### Contras

- Depende de configuracao de infraestrutura compartilhada.
- Exige mexer em DNS/proxy/tunnel, o que nao deve ser feito pelo agente.
- Menos isolado para um projeto com dominio proprio.

### Status

Nao recomendado como primeira opcao. So considerar se Vercel nao for viavel.

## Opcao alternativa: Cloudflare Pages ou Netlify

Outra possibilidade e usar um hosting estatico alternativo.

### Pros

- Bom para sites estaticos.
- SSL automatico.
- Git-based deploy.

### Contras

- O pacote atual ja esta orientado a Vercel.
- Teria que adaptar redirects, rewrites e headers.
- Mais uma decisao de infraestrutura sem necessidade clara.

### Status

Viavel, mas nao e o caminho mais curto.

## Plano de cutover

### 1. Pre-cutover

- Confirmar que `H0m0Lud3ns/a-bola-conecta` e o repo canonico.
- Revisar mudancas locais pendentes antes de qualquer commit.
- Rodar:

```bash
cd deploy/a-bola-conecta-vercel
npm run build
npm run check
```

- Validar rotas principais no preview:

```text
/
/documentario
/sobre
/servicos
/comunidade
/contato
/apoie
/loja
/privacidade
/mapa-do-site
/sitemap.xml
/robots.txt
```

- Validar redirect:

```text
/documental -> /documentario
```

- Confirmar se o site ainda deve bloquear indexacao ou se ja pode ser indexavel.
- Para versao final indexavel, usar somente com aprovacao:

```bash
ABOLA_ALLOW_INDEX=1 npm run build
npm run check
```

### 2. DNS

Esta etapa nao deve ser executada pelo agente sem autorizacao e credenciais corretas.

Solicitar ao responsavel do dominio:

```text
Dominio: abolaconecta.com.br
Apex: abolaconecta.com.br
WWW: www.abolaconecta.com.br
Destino: projeto Vercel confirmado
SSL: automatico pela Vercel
```

Os valores exatos de DNS devem vir da Vercel no momento de adicionar o dominio ao projeto.

### 3. Janela de publicacao

- Escolher uma janela curta, idealmente fora de horario de campanha.
- Congelar alteracoes por 30 a 60 minutos.
- Aplicar DNS.
- Validar HTTPS.
- Validar rotas principais.
- Validar imagem social e sitemap.

### 4. Validacao post-cutover

Rodar verificacoes:

```bash
curl -I https://abolaconecta.com.br/
curl -I https://www.abolaconecta.com.br/
curl -I https://abolaconecta.com.br/documentario
curl -I https://abolaconecta.com.br/documental
curl -I https://abolaconecta.com.br/sitemap.xml
curl -I https://abolaconecta.com.br/robots.txt
```

Conferir manualmente:

- Home carrega sem assets quebrados.
- Navegacao funciona.
- CTA de contato funciona.
- CTA de apoio/loja esta coerente com a decisao comercial.
- Imagem social aparece bem ao compartilhar.

### 5. Rollback

Rollback precisa estar pronto antes do cutover.

Caminhos possiveis:

1. Reverter o DNS para o destino anterior.
2. Reverter para deployment anterior na Vercel.
3. Manter a versao Infraqualia viva por pelo menos 72 horas apos o corte.

Meta de rollback: voltar a uma versao funcional em menos de 5 minutos depois de detectar problema critico.

## Decisoes bloqueantes

Confirmado por Sebastian:

1. Repo canonico: `H0m0Lud3ns/a-bola-conecta`.
2. Hosting final: Vercel.
3. Acesso DNS: Sebastian.
4. `contato`, `apoie` e `loja`: atualizados na nova versao.

Ainda pendente antes do cutover:

1. Confirmar se o dominio usara apex, www ou ambos. Recomendacao: ambos, com `www` redirecionando para apex ou o inverso.
2. Confirmar momento de liberar indexacao no Google. Recomendacao: preview em `noindex`; dominio final aprovado com indexacao liberada.
3. Confirmar `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` e `projectName` do projeto A Bola Conecta.
4. Definir janela de cutover.
5. Validar preview final em desktop e mobile antes de mexer em DNS.

## O que nao fazer

- Nao editar DNS manualmente sem plano.
- Nao mexer em Cloudflare, tunnels, gateway ou configuracao compartilhada.
- Nao usar login global de Vercel.
- Nao publicar versao indexavel sem aprovacao.
- Nao misturar commits de conteudo com commits de infraestrutura sem descricao clara.
