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
  'loja/index.html',
  'blog/index.html',
  'contato/index.html',
  'apoie/index.html',
  'faq/index.html',
  'mapa-do-site/index.html',
  'privacidade/index.html',
  'assets/index--0QhvKt1.css',
  'assets/index-Bc6DgKrQ-crm.js',
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
  if (html.includes('/a-bola-conecta/assets/')) htmlErrors.push(`${file}: asset ainda aponta para subpasta`);
  if (!html.includes('rel="canonical"')) htmlErrors.push(`${file}: canonical ausente`);
}

if (htmlErrors.length) {
  console.error('Erros de HTML:');
  for (const error of htmlErrors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('CHECK OK: dist pronto para preview Vercel isolado.');
console.log('Nota: DNS continua NO-GO ate fechar leads, loja e SEO final.');
