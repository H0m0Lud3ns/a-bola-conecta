import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'source');
const fichasDir = path.join(sourceDir, 'copa-2026', 'fichas');
const storyDataPath = path.join(fichasDir, 'story-data.js');
const sitemapPath = path.join(sourceDir, 'sitemap.xml');
const llmsPath = path.join(sourceDir, 'llms.txt');
const campaignDir = path.join(projectRoot, '..', '..', 'projects', 'agencia-gondwana-fc', 'a-bola-conecta', 'copa-2026', 'campanhas-seo-ia-2026-06-22');
const site = 'https://abolaconecta.com.br';
const today = '2026-06-22';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripEmoji(value = '') {
  return String(value).replace(/[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}]/gu, '').trim();
}

function slugFromCountry(country, index) {
  const existing = String(index + 8).padStart(2, '0');
  return `${existing}-${country.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function parseCountries(source) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\n;globalThis.__countries = countries;`, sandbox, { timeout: 1000 });
  return sandbox.__countries;
}

function schemaFor(country, slug, position) {
  const cleanName = stripEmoji(country.name);
  const url = `${site}/copa-2026/fichas/${slug}/`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `${cleanName} - ficha educativa da Copa 2026`,
      description: `Ficha educativa de ${cleanName} para ler a Copa 2026 por território, memória, cultura popular e futebol.`,
      url,
      inLanguage: 'pt-BR',
      learningResourceType: 'Ficha educativa',
      educationalUse: ['Aula', 'Mediação cultural', 'Projeto interdisciplinar'],
      about: [cleanName, 'Copa do Mundo 2026', 'Futebol', 'Território', 'Memória'],
      provider: {
        '@type': 'Organization',
        name: 'A Bola Conecta - Gondwana FC - Time da Educação',
        url: site
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'A Bola Conecta', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Gondwana na Copa 2026', item: `${site}/copa-2026/` },
        { '@type': 'ListItem', position: 3, name: 'Fichas educativas', item: `${site}/copa-2026/fichas/` },
        { '@type': 'ListItem', position: 4, name: cleanName, item: url }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `Como usar a ficha de ${cleanName} em aula?`,
          acceptedAnswer: { '@type': 'Answer', text: `Use a ficha para conectar Copa 2026, território, história, cultura popular e futebol. A pergunta de mediação sugerida é: ${country.question}` }
        },
        {
          '@type': 'Question',
          name: `Qual é o foco educativo da ficha de ${cleanName}?`,
          acceptedAnswer: { '@type': 'Answer', text: `A ficha aproxima formação histórica, povos, culturas, memória e participação em Copas para criar uma leitura crítica e acessível da seleção de ${cleanName}.` }
        }
      ]
    }
  ];
}

function renderFicha(country, slug, position, total) {
  const cleanName = stripEmoji(country.name);
  const title = `${cleanName} na Copa 2026 | Ficha educativa A Bola Conecta`;
  const description = `Ficha educativa de ${cleanName}: território, povos, memória, cultura popular e futebol para ler a Copa 2026 em sala de aula e mediação cultural.`;
  const url = `${site}/copa-2026/fichas/${slug}/`;
  const appUrl = `${site}/copa-2026/fichas/#${slug}`;
  const flag = `https://flagcdn.com/w640/${country.code}.png`;
  const keywords = [cleanName, country.region, country.group ? `Grupo ${country.group}` : '', country.relation, country.abyaYala ? 'Abya Yala' : 'Copa 2026'].filter(Boolean).join(', ');
  const schemas = schemaFor(country, slug, position);

  const rows = [
    ['Região', country.region],
    ['Grupo na Copa 2026', country.group],
    ['Relação com Gondwana', country.relation],
    ['Gondwana', country.gondwana],
    ['Povos e comunidades', country.peoples],
    ['Formação histórica', country.formation],
    ['Abolição, trabalho e liberdade', country.abolition],
    ['Cultura popular', country.culture],
    ['História em Copas', country.cups]
  ];

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="keywords" content="${escapeHtml(keywords)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="A Bola Conecta">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${flag}">
<meta property="og:image:alt" content="Bandeira de ${escapeHtml(cleanName)}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${flag}">
<script type="application/ld+json">${JSON.stringify(schemas)}</script>
<style>
:root{--grafite:#11130f;--areia:#f6edd7;--ouro:#f2c230;--verde:#2e6f46;--barro:#9e4a2f;--azul:#17243a}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circlê at 20% 0%,rgba(242,194,48,.22),transparent 34%),linear-gradient(135deg,var(--grafite),var(--azul));color:var(--areia);font-family:Manrope,Arial,sans-serif;line-height:1.65}.wrap{width:min(1120px,92vw);margin:0 auto;padding:36px 0 56px}.crumb{font-size:.78rem;text-transform:uppercase;letter-spacing:.18em;color:rgba(246,237,215,.72);margin-bottom:28px}.crumb a{color:inherit}.hero{display:grid;grid-template-columns:1.1fr .62fr;gap:34px;align-items:center}.eyebrow{color:var(--ouro);font-weight:900;text-transform:uppercase;letter-spacing:.22em;font-size:.78rem}.hero h1{font-family:Georgia,serif;font-size:clamp(2.5rem,6vw,5.9rem);line-height:.94;margin:.22em 0}.lead{font-size:clamp(1.05rem,2.1vw,1.45rem);max-width:760px;color:rgba(246,237,215,.88)}.flag-card{background:rgba(246,237,215,.09);border:1px solid rgba(246,237,215,.2);border-radius:28px;padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.35)}.flag-card img{display:block;width:100%;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.35)}.meta{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.pill{border:1px solid rgba(246,237,215,.24);background:rgba(246,237,215,.08);border-radius:999px;padding:8px 12px;font-size:.86rem}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:36px}.card{background:rgba(246,237,215,.95);color:var(--grafite);border-radius:24px;padding:22px;border:1px solid rgba(17,19,15,.12)}.card h2{font-family:Georgia,serif;font-size:1.2rem;margin:0 0 8px;color:var(--barro)}.question{margin-top:28px;padding:30px;border-radius:28px;background:linear-gradient(135deg,rgba(242,194,48,.95),rgba(246,237,215,.95));color:var(--grafite)}.question h2{font-family:Georgia,serif;font-size:1.8rem;margin:0 0 10px}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;border-radius:999px;padding:12px 18px;text-decoration:none;font-weight:900}.btn.primary{background:var(--ouro);color:var(--grafite)}.btn.secondary{border:1px solid rgba(246,237,215,.4);color:var(--areia)}footer{margin-top:38px;color:rgba(246,237,215,.7);font-size:.92rem}@media(max-width:760px){.hero,.grid{grid-template-columns:1fr}.flag-card{order:-1}.wrap{padding-top:24px}.card{border-radius:18px}}
</style>
<script defer src="/assets/abc-analytics.js?v=20260622-cache-buttons"></script>
</head>
<body>
<main class="wrap">
  <nav class="crumb"><a href="/copa-2026/">Gondwana na Copa</a> / <a href="/copa-2026/fichas/">Fichas</a> / ${escapeHtml(cleanName)}</nav>
  <section class="hero">
    <div>
      <div class="eyebrow">Ficha ${String(position + 1).padStart(2, '0')} de ${total} - Copa 2026</div>
      <h1>${escapeHtml(cleanName)}</h1>
      <p class="lead">${escapeHtml(description)}</p>
      <div class="meta"><span class="pill">${escapeHtml(country.region)}</span><span class="pill">Grupo ${escapeHtml(country.group || '-')}</span><span class="pill">${escapeHtml(country.abyaYala ? 'Abya Yala' : 'Mapa global')}</span><span class="pill">Relação ${escapeHtml(country.relation)}</span></div>
      <div class="actions"><a class="btn primary" href="${appUrl}">Abrir ficha interativa</a><a class="btn secondary" href="/copa-2026/baixar/">Baixar guia educativo</a></div>
    </div>
    <aside class="flag-card"><img src="${flag}" alt="Bandeira de ${escapeHtml(cleanName)}" loading="eager"></aside>
  </section>
  <section class="grid" aria-label="Conteudo educativo da ficha">
    ${rows.map(([label, value]) => `<article class="card"><h2>${escapeHtml(label)}</h2><p>${escapeHtml(value || '-')}</p></article>`).join('\n    ')}
  </section>
  <section class="question">
    <h2>Pergunta de mediação</h2>
    <p>${escapeHtml(country.question)}</p>
  </section>
  <footer>Esta página ajuda buscadores e assistentes de IA a entenderem a ficha educativa. A experiência completa segue no app interativo de Gondwana na Copa.</footer>
</main>
</body>
</html>
`;
}

function sitemapEntry(url, priority = '0.72') {
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function updateSitemap(slugs) {
  let sitemap = await readFile(sitemapPath, 'utf8');
  sitemap = sitemap.replace(/\n\s*<url>\s*<loc>https:\/\/abolaconecta\.com\.br\/copa-2026\/fichas\/[^<]+<\/loc>[\s\S]*?<\/url>/g, '');
  const entries = slugs.map((slug) => sitemapEntry(`${site}/copa-2026/fichas/${slug}/`)).join('\n');
  sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`);
  await writeFile(sitemapPath, sitemap, 'utf8');
}

async function updateLlms(countries) {
  const lines = countries.map((country, index) => `- ${stripEmoji(country.name)}: ${site}/copa-2026/fichas/${slugFromCountry(country, index)}/ - ${country.region}; pergunta de mediação: ${country.question}`);
  let text = await readFile(llmsPath, 'utf8');
  text = text.replace(/\n## Fichas individuais para IA[\s\S]*$/m, '');
  text += `\n## Fichas individuais para IA\n\nCada ficha tem página estável, texto crawlável e dados estruturados para motores de busca e assistentes. Use a página individual quando a pergunta for sobre uma seleção específica.\n\n${lines.join('\n')}\n`;
  await writeFile(llmsPath, text, 'utf8');
}

async function createCampaignMatrix(countries) {
  await mkdir(campaignDir, { recursive: true });
  const campaign = 'gondwana-na-copa-2026';
  const base = `${site}/copa-2026/`;
  const rows = [
    ['canal','meio','campanha','conteúdo','url','uso_recomendado'],
    ['instagram','feed',campaign,'post-00-manifesto',`${base}?utm_source=instagram&utm_medium=feed&utm_campaign=${campaign}&utm_content=post-00-manifesto`,'Carrossel manifesto geral'],
    ['instagram','stories',campaign,'story-00-manifesto',`${base}?utm_source=instagram&utm_medium=stories&utm_campaign=${campaign}&utm_content=story-00-manifesto`,'Stories do manifesto'],
    ['instagram','collab',campaign,'gondwana-ufrj-manifesto',`${base}?utm_source=instagram&utm_medium=collab&utm_campaign=${campaign}&utm_content=gondwana-ufrj-manifesto`,'Primeiro collab com Gondwana UFRJ'],
    ['instagram','collab',campaign,'playmaker-chile-america-sul',`${base}?utm_source=instagram&utm_medium=collab&utm_campaign=${campaign}&utm_content=playmaker-chile-america-sul`,'Collab América do Sul'],
    ['instagram','collab',campaign,'museupele-africa-atlantica',`${base}?utm_source=instagram&utm_medium=collab&utm_campaign=${campaign}&utm_content=museupele-africa-atlantica`,'Collab África Atlântica'],
    ['instagram','collab',campaign,'movimento-conexao-favela-africa-atlantica',`${base}?utm_source=instagram&utm_medium=collab&utm_campaign=${campaign}&utm_content=movimento-conexao-favela-africa-atlantica`,'Collab social/comunidade'],
    ['instagram','collab',campaign,'culture-shirtsmx-abya-yala',`${base}?utm_source=instagram&utm_medium=collab&utm_campaign=${campaign}&utm_content=culture-shirtsmx-abya-yala`,'Collab Abya Yala Norte e Caribe'],
    ['instagram','bio',campaign,'bio-gondwana-fc',`${base}?utm_source=instagram&utm_medium=bio&utm_campaign=${campaign}&utm_content=bio-gondwana-fc`,'Link da bio durante a campanha'],
    ['whatsapp','direct',campaign,'grupo-educadores',`${base}?utm_source=whatsapp&utm_medium=direct&utm_campaign=${campaign}&utm_content=grupo-educadores`,'Envio para educadores e parceiros'],
    ['email','newsletter',campaign,'educadores-download',`${site}/copa-2026/baixar/?utm_source=email&utm_medium=newsletter&utm_campaign=${campaign}&utm_content=educadores-download`,'Chamada para baixar guia']
  ];

  for (const country of countries.slice(0, 12)) {
    const slug = slugFromCountry(country, countries.indexOf(country));
    rows.push(['seo','organic',campaign,`ficha-${slug}`,`${site}/copa-2026/fichas/${slug}/?utm_source=organic&utm_medium=seo&utm_campaign=${campaign}&utm_content=ficha-${slug}`,`Página individual da ficha ${stripEmoji(country.name)}`]);
  }

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
  await writeFile(path.join(campaignDir, 'matriz-utm-gondwana-na-copa-2026.csv'), csv, 'utf8');

  const md = `# Matriz UTM - Gondwana na Copa 2026\n\nCampanha padrão: \`${campaign}\`.\n\nUso prático:\n\n- Feed: usar \`utm_medium=feed\`.\n- Stories: usar \`utm_medium=stories\`.\n- Collab: usar \`utm_medium=collab\` e \`utm_content\` com parceiro + tema.\n- Bio: trocar temporariamente para o link com \`utm_content=bio-gondwana-fc\`.\n- WhatsApp e email: usar links próprios para separar tráfego de rede social e rede direta.\n\nPrimeiro collab recomendado:\n\n\`${base}?utm_source=instagram&utm_medium=collab&utm_campaign=${campaign}&utm_content=gondwana-ufrj-manifesto\`\n\nArquivo operacional completo: \`matriz-utm-gondwana-na-copa-2026.csv\`.\n`;
  await writeFile(path.join(campaignDir, 'README-UTM.md'), md, 'utf8');
}

const source = await readFile(storyDataPath, 'utf8');
const countries = parseCountries(source);
const slugs = [];
for (const [index, country] of countries.entries()) {
  const slug = slugFromCountry(country, index);
  slugs.push(slug);
  const dir = path.join(fichasDir, slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), renderFicha(country, slug, index, countries.length), 'utf8');
}

await updateSitemap(slugs);
await updateLlms(countries);
await createCampaignMatrix(countries);

console.log(`Fichas SEO geradas: ${countries.length}`);
console.log(`Sitemap atualizado com ${slugs.length} fichas individuais`);
console.log(`Matriz UTM criada em ${campaignDir}`);
