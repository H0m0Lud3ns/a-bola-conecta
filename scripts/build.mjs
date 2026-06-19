import { cp, mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'source');
const distDir = path.join(projectRoot, 'dist');
const siteDomain = process.env.ABOLA_SITE_DOMAIN || 'https://abolaconecta.com.br';
const allowIndex = process.env.ABOLA_ALLOW_INDEX === '1';

if (!existsSync(sourceDir)) {
  throw new Error(`Fonte nao encontrada: ${sourceDir}`);
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(sourceDir, distDir, { recursive: true });

const routeCanonicals = new Map([
  ['index.html', `${siteDomain}/`],
  ['documentario/index.html', `${siteDomain}/documentario`],
  ['sobre/index.html', `${siteDomain}/sobre`],
  ['servicos/index.html', `${siteDomain}/servicos`],
  ['comunidade/index.html', `${siteDomain}/comunidade`],
  ['loja/index.html', `${siteDomain}/loja`],
  ['blog/index.html', `${siteDomain}/blog`],
  ['contato/index.html', `${siteDomain}/contato`],
  ['apoie/index.html', `${siteDomain}/apoie`],
  ['faq/index.html', `${siteDomain}/faq`],
  ['mapa-do-site/index.html', `${siteDomain}/mapa-do-site`],
  ['privacidade/index.html', `${siteDomain}/privacidade`],
  ['copa-2026/index.html', `${siteDomain}/copa-2026/`],
  ['copa-2026/fichas/index.html', `${siteDomain}/copa-2026/fichas/`],
  ['copa-2026/baixar/index.html', `${siteDomain}/copa-2026/baixar/`],
  ['copa-2026/ebook-consolidado/index.html', `${siteDomain}/copa-2026/ebook-consolidado/`],
  ['copa-2026/ebook-educadores-v1/index.html', `${siteDomain}/copa-2026/ebook-educadores-v1/`],
]);

const referencedAssets = new Set();
const htmlFiles = [];
const textFiles = [];
const textExtensions = new Set(['.html', '.js', '.css', '.xml', '.txt', '.json', '.webmanifest']);

async function collectTextFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectTextFiles(absolutePath);
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      const relativePath = path.relative(distDir, absolutePath);
      textFiles.push(relativePath);
      if (entry.name.endsWith('.html')) htmlFiles.push(relativePath);
    }
  }
}

function canonicalFor(relativePath) {
  if (routeCanonicals.has(relativePath)) return routeCanonicals.get(relativePath);
  if (relativePath === 'index.html') return `${siteDomain}/`;
  if (!relativePath.endsWith('/index.html')) return null;
  return `${siteDomain}/${relativePath.replace(/\/index\.html$/, '/')}`;
}

function trackReferencedAssets(html) {
  for (const match of html.matchAll(/(?:src|href)="\/?(assets\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    referencedAssets.add(match[1]);
  }
}

await collectTextFiles(distDir);

function rewriteForRoot(content) {
  return content
    .replaceAll('https://sebas-ai.infraqualia.com/a-bola-conecta', siteDomain)
    .replaceAll('/a-bola-conecta/', '/')
    .replaceAll('/a-bola-conecta', '/');
}

for (const relativePath of textFiles) {
  const file = path.join(distDir, relativePath);
  let content = await readFile(file, 'utf8');
  content = rewriteForRoot(content);
  await writeFile(file, content);
}

for (const relativePath of htmlFiles) {
  const canonical = canonicalFor(relativePath);
  const file = path.join(distDir, relativePath);
  let html = await readFile(file, 'utf8');
  if (canonical) {
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href="[^"]*" ?\/?>/, `<link rel="canonical" href="${canonical}" />`);
    } else {
      html = html.replace('</head>', `    <link rel="canonical" href="${canonical}" />
  </head>`);
    }
  }

  trackReferencedAssets(html);

  if (allowIndex) {
    html = html.replace(/\n\s*<meta name="robots" content="noindex,nofollow" ?\/?>/, '');
  } else if (!html.includes('name="robots"')) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
  }

  await writeFile(file, html);
}

const assetsDir = path.join(distDir, 'assets');
if (existsSync(assetsDir)) {
  for (const asset of await readdir(assetsDir)) {
    const relativeAsset = `assets/${asset}`;
    const isGeneratedJs = asset.endsWith('.js') && asset.startsWith('index-');
    if (isGeneratedJs && !referencedAssets.has(relativeAsset)) {
      await rm(path.join(assetsDir, asset), { force: true });
    }
  }
}

const robotsPath = path.join(distDir, 'robots.txt');
const robots = allowIndex
  ? `User-agent: *\nAllow: /\n\nSitemap: ${siteDomain}/sitemap.xml\n`
  : `User-agent: *\nDisallow: /\n\nSitemap: ${siteDomain}/sitemap.xml\n`;
await writeFile(robotsPath, robots);

const sitemapPath = path.join(distDir, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  let sitemap = await readFile(sitemapPath, 'utf8');
  sitemap = sitemap.replaceAll('https://abolaconecta.com.br', siteDomain);
  await writeFile(sitemapPath, sitemap);
}

console.log(`Build pronto em ${distDir}`);
console.log(`Indexacao: ${allowIndex ? 'permitida' : 'bloqueada por seguranca'}`);
