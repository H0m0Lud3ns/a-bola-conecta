// Inject a harmonized topbar (header + nav) into static pages that don't have one.
// Designed for the 48 fichas + Copa 2026 secondary pages + /metodologia.

import fs from 'fs';
import path from 'path';

const ROOT = '/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/deploy/a-bola-conecta-vercel/source';

const TOPBAR_HTML = `<header class="topbar">
  <div class="topbar-inner">
    <a href="/" class="topbar-logo" aria-label="A Bola Conecta — início">
      <img src="/gondwana-fc-logo/svg/oficiais/logo-gondwana-fc-fundo-claro.svg" alt="Gondwana FC — Time da Educação" />
    </a>
    <nav class="topbar-nav" aria-label="Navegação principal">
      <a href="/">Início</a>
      <a href="/documentario/">Documentário</a>
      <a href="/metodologia/">Metodologia ABC</a>
      <a href="/copa-2026/">Copa 2026</a>
      <a href="/copa-2026/fichas/">Fichas</a>
      <a href="/sobre/">Sobre</a>
      <a href="/contato/">Contato</a>
      <a href="/copa-2026/#contribuir" class="cta-nav">Apoiar</a>
    </nav>
  </div>
</header>

`;

const TOPBAR_CSS = `.topbar{position:sticky;top:0;z-index:50;background:rgba(17,19,15,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(242,194,48,.14)}.topbar-inner{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;max-width:1200px;margin:0 auto;gap:16px}.topbar-logo img{height:38px;width:auto;display:block}.topbar-nav{display:flex;gap:18px;align-items:center;font-family:Manrope,Arial,sans-serif;font-weight:600;font-size:14px;letter-spacing:.02em;flex-wrap:wrap}.topbar-nav a{color:var(--areia);text-decoration:none;padding:6px 2px;position:relative;transition:color .2s}.topbar-nav a:hover{color:var(--ouro)}.topbar-nav a.cta-nav{background:var(--ouro);color:var(--grafite);padding:8px 16px;border-radius:6px;font-weight:800;white-space:nowrap}.topbar-nav a.cta-nav:hover{color:var(--grafite);background:#ffce3d}@media(max-width:760px){.topbar-inner{padding:12px 16px;flex-wrap:wrap}.topbar-logo img{height:32px}.topbar-nav{gap:12px;font-size:13px;width:100%;justify-content:flex-start}.topbar-nav a.cta-nav{padding:6px 12px}}
`;

// Páginas a procesar
const TARGETS = [
  // /metodologia
  { file: path.join(ROOT, 'metodologia/index.html'), type: 'standalone' },
  // Copa 2026 secondary
  { file: path.join(ROOT, 'copa-2026/fichas/index.html'), type: 'carousel' },
  { file: path.join(ROOT, 'copa-2026/baixar/index.html'), type: 'copa-secondary' },
  { file: path.join(ROOT, 'copa-2026/camisa-abya-yala/index.html'), type: 'copa-secondary' },
  { file: path.join(ROOT, 'copa-2026/ebook-consolidado/index.html'), type: 'copa-secondary' },
  { file: path.join(ROOT, 'copa-2026/ebook-educadores-v1/index.html'), type: 'copa-secondary' },
  { file: path.join(ROOT, 'copa-2026/sobre-para-ia/index.html'), type: 'copa-secondary' },
];

// Fichas
const fichasDir = path.join(ROOT, 'copa-2026/fichas');
const fichas = fs.readdirSync(fichasDir).filter(n => /^\d+-/.test(n));
for (const slug of fichas) {
  TARGETS.push({ file: path.join(fichasDir, slug, 'index.html'), type: 'ficha' });
}

console.log(`Total páginas a procesar: ${TARGETS.length}`);

let processed = 0;
let skipped = 0;

for (const target of TARGETS) {
  if (!fs.existsSync(target.file)) {
    console.log(`  SKIP (no existe): ${target.file}`);
    skipped++;
    continue;
  }

  let content = fs.readFileSync(target.file, 'utf8');

  // Skip si ya tiene topbar
  if (content.includes('class="topbar"')) {
    console.log(`  SKIP (ya tiene topbar): ${target.file.replace(ROOT, '')}`);
    skipped++;
    continue;
  }

  // 1. Inyectar el CSS del topbar dentro del <style>
  if (content.includes('<style>')) {
    content = content.replace('<style>', '<style>' + TOPBAR_CSS);
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', '<style>' + TOPBAR_CSS + '</style>\n</head>');
  }

  // 2. Inyectar el HTML del topbar justo después de <body>
  content = content.replace('<body>', '<body>\n' + TOPBAR_HTML);

  fs.writeFileSync(target.file, content);
  processed++;
}

console.log(`\nProcesadas: ${processed}`);
console.log(`Saltadas: ${skipped}`);
