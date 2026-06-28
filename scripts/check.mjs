import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const sourceDir = path.join(projectRoot, 'source');
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
  'copa-2026/assets/selecoes-gondwana-consolidado.pdf',
  'gondwana-time-educacao/assets/confianca/revista-cpf-sesc.jpg',
  'gondwana-time-educacao/copa-de-gondwana/fichas-paises/assets/mapa-gondwana-gdcg-ufrj-184ma-5200-full.jpg',
  'gondwana-time-educacao/copa-de-gondwana/fichas-paises/assets/mapa-mundi-atual-ibge-proporcoes-reais.jpg',
  'gondwana-time-educacao/copa-de-gondwana/fichas-paises/research-data.js',
  'gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-escuro.svg',
  'assets/index--0QhvKt1.css',
  'assets/index-Bc6DgKrQ-crm-api-leads1.js',
  'robots.txt',
  'sitemap.xml',
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
  if (html.includes('id="root"') && !html.includes('index-Bc6DgKrQ-crm-api-leads1.js')) {
    htmlErrors.push(`${file}: bundle de leads atual nao carregado`);
  }
  // Validar nav-guard inline inyectado pelo build.mjs
  if (!['comunidade/index.html', 'apoie/index.html'].includes(file) && !html.includes('window.__navGuardInstalled')) {
    htmlErrors.push(`${file}: nav-guard inline ausente`);
  }
}

const navGuardSource = readFileSync(path.join(sourceDir, 'assets', 'nav-guard.js'), 'utf8');
if (!navGuardSource.includes('/documentario')) htmlErrors.push('nav-guard.js: rota /documentario ausente');
if (!navGuardSource.includes('MutationObserver')) htmlErrors.push('nav-guard.js: observer anti-cache ausente');
if (!navGuardSource.includes('window.location.assign')) htmlErrors.push('nav-guard.js: location.assign ausente');

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
if (!activeBundle.includes('comunidade/#apoio')) htmlErrors.push('bundle ativo: comunidade/#apoio ausente');
if (activeBundle.includes('/a-bola-conecta/')) htmlErrors.push('bundle ativo: link ainda aponta para subpasta /a-bola-conecta/');

for (const file of ['copa-2026/index.html', 'index.html']) {
  const html = readFileSync(path.join(distDir, file), 'utf8');
  if (html.includes('/assets/-logo')) htmlErrors.push(`${file}: logo quebrado por rewrite agressivo`);

const fichasHtml = readFileSync(path.join(distDir, 'copa-2026/fichas/index.html'), 'utf8');
for (const requiredRef of [
  '/copa-2026/fichas/styles.css',
  '/copa-2026/fichas/story-data.js',
  '/copa-2026/fichas/app.js',
  '/gondwana-time-educacao/copa-de-gondwana/fichas-paises/research-data.js',
]) {
  if (!fichasHtml.includes(requiredRef)) htmlErrors.push(`fichas/index.html: referencia absoluta ausente ${requiredRef}`);
}

}


if (htmlErrors.length) {
  console.error('Erros de HTML/bundle:');
  for (const error of htmlErrors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('CHECK OK: dist pronto para preview Vercel isolado.');
console.log('Nota: DNS continua NO-GO ate fechar leads, loja e SEO final.');
