import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
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
]);

for (const [relativePath, canonical] of routeCanonicals) {
  const file = path.join(distDir, relativePath);
  if (!existsSync(file)) continue;
  let html = await readFile(file, 'utf8');
  html = html.replaceAll('/a-bola-conecta/assets/', '/assets/');
  html = html.replaceAll('/a-bola-conecta/__l5e/', '/__l5e/');
  html = html.replaceAll('/a-bola-conecta/~flock.js', '/~flock.js');
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);

  if (allowIndex) {
    html = html.replace(/\n\s*<meta name="robots" content="noindex,nofollow" \/>/, '');
  } else if (!html.includes('name="robots"')) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex,nofollow" />\n  </head>');
  }

  await writeFile(file, html);
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
