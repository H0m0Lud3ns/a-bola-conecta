import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const requiredFiles = [
  'index.html',
  'documentario/index.html',
  'sobre/index.html',
  'servicos/index.html',
  'comunidade/index.html',
  'blog/index.html',
  'contato/index.html',
  'apoie/index.html',
  'faq/index.html',
  'mapa-do-site/index.html',
  'privacidade/index.html',
  'copa-2026/index.html',
  'copa-2026/fichas/index.html',
  'copa-2026/fichas/app.js',
  'copa-2026/fichas/story-data.js',
  'copa-2026/fichas/styles.css',
  'copa-2026/baixar/index.html',
  'copa-2026/camisa-abya-yala/index.html',
  'copa-2026/assets/selecoes-gondwana-consolidado.pdf',
  'gondwana-time-educacao/assets/confianca/revista-cpf-sesc.jpg',
  'gondwana-time-educacao/copa-de-gondwana/fichas-paises/assets/mapa-gondwana-gdcg-ufrj-184ma-5200-full.jpg',
  'gondwana-time-educacao/copa-de-gondwana/fichas-paises/assets/mapa-mundi-atual-ibge-proporcoes-reais.jpg',
  'gondwana-time-educacao/copa-de-gondwana/fichas-paises/research-data.js',
  'gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-escuro.svg',
  'assets/index--0QhvKt1.css',
  'assets/index-Bc6DgKrQ-crm-api-leads1.js',
  'assets/nav-guard.js',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
];

const missing = requiredFiles.filter((file) => !existsSync(path.join(distDir, file)));
if (missing.length) {
  console.error('Arquivos faltantes:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const htmlFiles = requiredFiles.filter((file) => file.endsWith('.html'));
const htmlErrors = [];
for (const file of htmlFiles) {
  const html = readFileSync(path.join(distDir, file), 'utf8');
  if (html.includes('/a-bola-conecta/')) htmlErrors.push(`${file}: link ainda aponta para subpasta /a-bola-conecta/`);
  if (html.includes('/a-bola-conecta/assets/')) htmlErrors.push(`${file}: asset ainda aponta para subpasta`);
  if (html.includes('sebas-ai.infraqualia.com/a-bola-conecta')) htmlErrors.push(`${file}: referencia absoluta ao staging`);
  if (!html.includes('rel="canonical"')) htmlErrors.push(`${file}: canonical ausente`);
  if (!html.includes('property="og:title"')) htmlErrors.push(`${file}: og:title ausente`);
  if (!html.includes('property="og:description"')) htmlErrors.push(`${file}: og:description ausente`);
  if (!html.includes('property="og:image"')) htmlErrors.push(`${file}: og:image ausente`);
  if (!html.includes('name="twitter:card" content="summary_large_image"')) htmlErrors.push(`${file}: twitter card ausente`);
  if (html.includes('id="root"') && !html.includes('index-Bc6DgKrQ-crm-api-leads1.js')) {
    htmlErrors.push(`${file}: bundle de leads atual nao carregado`);
  }
  if (!['comunidade/index.html', 'apoie/index.html'].includes(file) && !html.includes('/assets/nav-guard.js?v=20260623-social-previews')) {
    htmlErrors.push(`${file}: nav-guard ausente ou sem versao atual`);
  }
}

const copaHtml = readFileSync(path.join(distDir, 'copa-2026/index.html'), 'utf8');
if (!copaHtml.includes('/assets/abc-analytics.js')) htmlErrors.push('copa-2026/index.html: analytics ausente');
if (!copaHtml.includes('application/ld+json')) htmlErrors.push('copa-2026/index.html: JSON-LD ausente');
if (!copaHtml.includes('href="/llms.txt"')) htmlErrors.push('copa-2026/index.html: llms.txt nao referenciado');

const sitemap = readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8');
if (sitemap.includes('abolaconecta.com.br/comunidade')) htmlErrors.push('sitemap.xml: comunidade antiga ainda indexavel');
if (sitemap.includes('abolaconecta.com.br/apoie')) htmlErrors.push('sitemap.xml: apoie antigo ainda indexavel');

const robots = readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
if (robots.includes('Disallow: /')) htmlErrors.push('robots.txt: indexacao bloqueada em producao');
for (const file of htmlFiles) {
  const html = readFileSync(path.join(distDir, file), 'utf8');
  if (html.includes('noindex')) htmlErrors.push(`${file}: noindex presente em producao`);
}

const activeBundlePath = path.join(distDir, 'assets/index-Bc6DgKrQ-crm-api-leads1.js');
const activeBundle = readFileSync(activeBundlePath, 'utf8');
if (!activeBundle.includes('/api/leads')) htmlErrors.push('bundle ativo: /api/leads ausente');
if (activeBundle.includes('script.google.com')) htmlErrors.push('bundle ativo: referencia antiga a script.google.com');
if (!activeBundle.includes('copa-2026/#contribuir')) htmlErrors.push('bundle ativo: copa-2026/#contribuir ausente');
if (!activeBundle.includes('copa-2026/camisa-abya-yala/')) htmlErrors.push('bundle ativo: link da camisa ausente no menu');
if (activeBundle.includes('abolaconecta.com.br/comunidade')) htmlErrors.push('bundle ativo: link absoluto antigo para comunidade');
if (activeBundle.includes('/a-bola-conecta/')) htmlErrors.push('bundle ativo: link ainda aponta para subpasta /a-bola-conecta/');

const navGuard = readFileSync(path.join(distDir, 'assets/nav-guard.js'), 'utf8');
if (!navGuard.includes("/copa-2026/#contribuir")) htmlErrors.push('nav-guard: destino atual ausente');
if (!navGuard.includes('MutationObserver')) htmlErrors.push('nav-guard: observer anti-cache ausente');

const vercelConfig = readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8');
for (const requiredSnippet of [
  'no-store, max-age=0, must-revalidate',
  'max-age=60, must-revalidate',
  '"/comunidade"',
  '"/apoie"',
  '"/copa-2026/#contribuir"',
]) {
  if (!vercelConfig.includes(requiredSnippet)) htmlErrors.push(`vercel.json: regra ausente ${requiredSnippet}`);
}

for (const file of ['copa-2026/index.html', 'index.html']) {
  const html = readFileSync(path.join(distDir, file), 'utf8');
  if (html.includes('/assets/-logo')) htmlErrors.push(`${file}: logo quebrado por rewrite agressivo`);
}

const fichasHtml = readFileSync(path.join(distDir, 'copa-2026/fichas/index.html'), 'utf8');
for (const requiredRef of [
  '/copa-2026/fichas/styles.css',
  '/copa-2026/fichas/story-data.js',
  '/copa-2026/fichas/app.js',
  '/gondwana-time-educacao/copa-de-gondwana/fichas-paises/research-data.js',
]) {
  if (!fichasHtml.includes(requiredRef)) htmlErrors.push(`fichas/index.html: referencia absoluta ausente ${requiredRef}`);
}

if (htmlErrors.length) {
  console.error('Erros de HTML/bundle:');
  for (const error of htmlErrors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('CHECK OK: dist pronto para preview Vercel isolado.');
console.log('Nota: DNS continua NO-GO ate fechar leads, loja e SEO final.');
