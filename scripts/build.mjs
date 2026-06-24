import { cp, mkdir, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'source');
const distDir = path.join(projectRoot, 'dist');
const siteDomain = process.env.ABOLA_SITE_DOMAIN || 'https://www.abolaconecta.com.br';
const allowIndex = process.env.ABOLA_ALLOW_INDEX !== '0';
const cacheVersion = process.env.ABOLA_CACHE_VERSION || '20260623-social-previews';

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
  ['la-pelota-conecta/index.html', `${siteDomain}/la-pelota-conecta/`],
  ['faq/index.html', `${siteDomain}/faq`],
  ['mapa-do-site/index.html', `${siteDomain}/mapa-do-site`],
  ['privacidade/index.html', `${siteDomain}/privacidade`],
  ['copa-2026/index.html', `${siteDomain}/copa-2026/`],
  ['copa-2026/fichas/index.html', `${siteDomain}/copa-2026/fichas/`],
  ['copa-2026/baixar/index.html', `${siteDomain}/copa-2026/baixar/`],
  ['copa-2026/camisa-abya-yala/index.html', `${siteDomain}/copa-2026/camisa-abya-yala/`],
  ['copa-2026/ebook-consolidado/index.html', `${siteDomain}/copa-2026/ebook-consolidado/`],
  ['copa-2026/ebook-educadores-v1/index.html', `${siteDomain}/copa-2026/ebook-educadores-v1/`],
]);

const socialDefaults = {
  siteName: 'A Bola Conecta',
  locale: 'pt_BR',
  type: 'website',
  title: 'A Bola Conecta | Documentario, futebol e educacao',
  description: 'Documentario, metodologia ABC e experiencias educativas que conectam futebol, cultura, territorio, Africa e Brasil.',
  image: '/assets/social-preview/og-a-bola-conecta.jpg',
  imageAlt: 'A Bola Conecta - documentario, futebol e educacao',
};

const routeSocial = new Map([
  ['index.html', {
    title: 'A Bola Conecta | Documentario, futebol e educacao',
    description: 'Documentario, metodologia ABC e experiencias educativas que conectam futebol, cultura, territorio, Africa e Brasil.',
    image: '/assets/social-preview/og-a-bola-conecta.jpg',
    imageAlt: 'A Bola Conecta - documentario, futebol e educacao',
  }],
  ['documentario/index.html', {
    title: 'Documentario A Bola Conecta | Futebol, Africa e Brasil',
    description: 'Conheca o documentario A Bola Conecta e sua proposta educativa entre futebol, ancestralidade africana, cultura afro-brasileira e Lei 10.639.',
    image: '/assets/social-preview/og-a-bola-conecta.jpg',
    imageAlt: 'Preview do documentario A Bola Conecta',
  }],
  ['sobre/index.html', {
    title: 'Sobre A Bola Conecta | Metodologia ABC',
    description: 'Conheca a proposta que une audiovisual, bola e camera para transformar futebol em linguagem educativa, cultural e territorial.',
    image: '/assets/social-preview/og-a-bola-conecta.jpg',
    imageAlt: 'Sobre A Bola Conecta e a Metodologia ABC',
  }],
  ['servicos/index.html', {
    title: 'Servicos educativos | A Bola Conecta',
    description: 'Oficinas, formacoes, mediacao cultural e experiencias educativas com futebol, audiovisual, territorio e cultura popular.',
    image: '/assets/social-preview/og-servicos.jpg',
    imageAlt: 'Servicos educativos A Bola Conecta',
  }],
  ['comunidade/index.html', {
    title: 'Comunidade | A Bola Conecta',
    description: 'Entre no Time da Educacao e acompanhe a circulacao de materiais, encontros e experiencias com futebol, cultura e territorio.',
    image: '/assets/social-preview/og-comunidade.jpg',
    imageAlt: 'Comunidade A Bola Conecta',
  }],
  ['blog/index.html', {
    title: 'Blog | A Bola Conecta',
    description: 'Textos, campanhas e materiais sobre futebol, educacao, cultura, territorio e metodologia ABC.',
    image: '/assets/social-preview/og-a-bola-conecta.jpg',
    imageAlt: 'Blog A Bola Conecta',
  }],
  ['apoie/index.html', {
    title: 'Contribuir para a circulacao | A Bola Conecta',
    description: 'Contribua com valor livre para sustentar pesquisa, producao, tecnologia e circulacao educativa, com registro pela agencia.',
    image: '/assets/social-preview/og-contribuir.jpg',
    imageAlt: 'Contribuir para a circulacao educativa A Bola Conecta',
  }],
  ['la-pelota-conecta/index.html', {
    title: 'La Pelota Conecta | Documental, fútbol y educación latinoamericana',
    description: 'Versión en español latinoamericano para ver el documental, explorar fichas de la Copa 2026 y usar el fútbol como lectura de territorio, memoria y cultura.',
    image: '/assets/social-preview/og-a-bola-conecta.jpg',
    imageAlt: 'La Pelota Conecta - documental, fútbol y educación latinoamericana',
    locale: 'es_419',
  }],
  ['copa-2026/index.html', {
    title: 'Gondwana na Copa 2026 | A Bola Conecta',
    description: 'Fichas, guia e perguntas para ler a Copa pela Terra, pelos povos, pela memoria e pela bola.',
    image: '/assets/social-preview/og-gondwana-na-copa.jpg',
    imageAlt: 'Gondwana na Copa 2026 - campanha educativa',
  }],
  ['copa-2026/fichas/index.html', {
    title: 'Fichas Gondwana na Copa | A Bola Conecta',
    description: '48 selecoes como portas de entrada para territorio, memoria, cultura popular, migracoes, povos e futebol.',
    image: '/api/og-ficha?pais=br',
    imageAlt: 'Fichas educativas Gondwana na Copa',
    imageType: 'image/png',
  }],
  ['copa-2026/baixar/index.html', {
    title: 'Baixar Guia Gondwana na Copa | A Bola Conecta',
    description: 'Baixe o guia educativo de acesso aberto para usar em aula, oficina, projeto social, clube ou roda de conversa.',
    image: '/assets/social-preview/og-baixar-guia.jpg',
    imageAlt: 'Baixar guia educativo Gondwana na Copa',
  }],
  ['copa-2026/camisa-abya-yala/index.html', {
    title: 'Camisa Abya Yala | Gondwana na Copa',
    description: 'Vista a campanha Gondwana na Copa e ajude a circular uma leitura educativa da Copa 2026.',
    image: '/assets/social-preview/og-camisa-abya-yala.jpg',
    imageAlt: 'Camisa Abya Yala da campanha Gondwana na Copa',
  }],
  ['copa-2026/sobre-para-ia/index.html', {
    title: 'Resumo para imprensa e IA | Gondwana na Copa',
    description: 'Resumo estruturado da campanha Gondwana na Copa para jornalistas, buscadores, IA e parceiros institucionais.',
    image: '/assets/social-preview/og-gondwana-na-copa.jpg',
    imageAlt: 'Resumo Gondwana na Copa para imprensa e IA',
  }],
  ['blog/gondwana-na-copa-guia-educativo-copa-2026/index.html', {
    type: 'article',
    title: 'Gondwana na Copa: guia educativo para a Copa 2026',
    description: 'Uma campanha educativa para transformar a Copa 2026 em leitura de mundo, com fichas online e guia em PDF.',
    image: '/assets/social-preview/og-blog-copa.jpg',
    imageAlt: 'Artigo Gondwana na Copa - guia educativo para a Copa 2026',
  }],
  ['blog/faq-gondwana-na-copa-copa-2026/index.html', {
    type: 'article',
    title: 'FAQ Gondwana na Copa | A Bola Conecta',
    description: 'Perguntas e respostas sobre a campanha Gondwana na Copa, fichas educativas, guia e usos pedagogicos.',
    image: '/assets/social-preview/og-gondwana-na-copa.jpg',
    imageAlt: 'FAQ Gondwana na Copa',
  }],
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

function versionLocalAssets(html) {
  return html.replace(/\/(assets\/(?:index-Bc6DgKrQ-crm-api-leads1\.js|abc-analytics\.js|cache-button-guard\.js|copa-nav-inject\.js))(?:\?v=[^"']*)?/g, `/$1?v=${cacheVersion}`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function absoluteUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//.test(value)) return value;
  return `${siteDomain}${value.startsWith('/') ? '' : '/'}${value}`;
}

function upsertTag(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace('</head>', `  ${tag}\n</head>`);
}

function syncSocialMeta(html, relativePath, canonical) {
  const meta = { ...socialDefaults, ...(routeSocial.get(relativePath) || {}) };
  const url = canonical || canonicalFor(relativePath) || `${siteDomain}/`;
  const image = absoluteUrl(meta.image);
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const imageAlt = escapeHtml(meta.imageAlt || meta.title);
  const siteName = escapeHtml(meta.siteName || socialDefaults.siteName);
  const locale = escapeHtml(meta.locale || socialDefaults.locale);
  const type = escapeHtml(meta.type || socialDefaults.type);

  html = upsertTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = upsertTag(html, /<meta name="description" content="[^"]*" ?\/?>/, `<meta name="description" content="${description}" />`);

  const tags = [
    ['property', 'og:type', type],
    ['property', 'og:site_name', siteName],
    ['property', 'og:locale', locale],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['property', 'og:image', image],
    ['property', 'og:image:secure_url', image],
    ['property', 'og:image:type', escapeHtml(meta.imageType || 'image/jpeg')],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['property', 'og:image:alt', imageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
    ['name', 'twitter:image:alt', imageAlt],
  ];

  for (const [attr, key, value] of tags) {
    const escapedValue = escapeHtml(value);
    const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" ?\\/?>`);
    html = upsertTag(html, re, `<meta ${attr}="${key}" content="${escapedValue}" />`);
  }

  return html;
}

function injectCacheButtonGuard(html) {
  if (html.includes('/assets/cache-button-guard.js')) return html;
  return html.replace('</head>', `    <script defer src="/assets/cache-button-guard.js?v=${cacheVersion}"></script>\n  </head>`);
}

await collectTextFiles(distDir);

function rewriteForRoot(content) {
  return content
    .replaceAll('https://sebas-ai.infraqualia.com/a-bola-conecta', siteDomain)
    .replaceAll('/a-bola-conecta/', '/')
    .replaceAll('/a-bola-conecta?', '/?')
    .replaceAll('/a-bola-conecta#', '/#')
    .replace(/\/a-bola-conecta(?=["'`<\s])/g, '/');
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

  html = syncSocialMeta(html, relativePath, canonical);
  html = injectCacheButtonGuard(html);
  html = versionLocalAssets(html);
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
