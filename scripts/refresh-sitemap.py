#!/usr/bin/env python3
"""
Atualiza sitemap.xml:
- Atualiza todas as tags <lastmod> para a data de hoje (2026-06-29)
- Adiciona URLs que existem em source/ mas nao estao no sitemap
- Idempotente: se a URL ja existe, so atualiza lastmod
"""
import re
import sys
from pathlib import Path
from datetime import date

SITEMAP = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/deploy/a-bola-conecta-vercel/source/sitemap.xml")
SOURCE = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/deploy/a-bola-conecta-vercel/source")
DOMAIN = "https://www.abolaconecta.com.br"
TODAY = date.today().isoformat()

# Prioridades por tipo de pagina
PRIORITY = {
    "/": "1.0",
    "/imprensa/": "0.92",
    "/festivais/": "0.88",
    "/time-da-educacao/": "0.88",
    "/comunidade/": "0.85",
    "/apoie/": "0.85",
    "/la-pelota-conecta/": "0.85",
}
DEFAULT_PRIORITY = "0.80"
DEFAULT_CHANGEFREQ = "monthly"

# 1) Coletar todas as URLs que existem em source/
existing_urls = set()
for html in SOURCE.rglob("index.html"):
    rel = str(html.relative_to(SOURCE).parent).replace("\\", "/")
    if rel in (".", "/"):
        rel = "/"
    else:
        rel = "/" + rel
        if not rel.endswith("/"):
            rel = rel + "/"
    # Filtrar rotas internas do React build
    if "node_modules" in rel or rel.startswith("/assets/") or "/./" in rel:
        continue
    url = DOMAIN + rel
    if "/./" in url:
        continue
    existing_urls.add(url)

# Adicionar raiz tambem
existing_urls.add(DOMAIN + "/")

# 2) Ler sitemap atual
sitemap = SITEMAP.read_text(encoding="utf-8")

# Coletar URLs ja presentes
url_blocks = re.findall(
    r'<url>\s*<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>\s*<changefreq>([^<]+)</changefreq>\s*<priority>([^<]+)</priority>\s*</url>',
    sitemap,
    re.DOTALL,
)

existing_in_sitemap = {block[0] for block in url_blocks}

# 3) Atualizar lastmod de todas as URLs existentes e regravar
new_blocks = []
for url, _old_lastmod, freq, prio in url_blocks:
    # prioridade custom por URL
    path = url.replace(DOMAIN, "")
    new_prio = PRIORITY.get(path, prio)
    new_blocks.append(
        f"  <url>\n    <loc>{url}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{new_prio}</priority>\n  </url>"
    )

# 4) Adicionar URLs que estao em source/ mas nao no sitemap
added = 0
for url in sorted(existing_urls):
    if url in existing_in_sitemap:
        continue
    path = url.replace(DOMAIN, "")
    prio = PRIORITY.get(path, DEFAULT_PRIORITY)
    freq = "weekly" if path in ("/",) else DEFAULT_CHANGEFREQ
    new_blocks.append(
        f"  <url>\n    <loc>{url}</loc>\n    <lastmod>{TODAY}</lastmod>\n    <changefreq>{freq}</changefreq>\n    <priority>{prio}</priority>\n  </url>"
    )
    print(f"+ {url} (prio={prio})")
    added += 1

# 5) Regravar sitemap
new_sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
new_sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
new_sitemap += "\n".join(new_blocks) + "\n"
new_sitemap += "</urlset>\n"

SITEMAP.write_text(new_sitemap, encoding="utf-8")

total = len(new_blocks)
print(f"\nTotal URLs no sitemap: {total}")
print(f"Adicionadas: {added}")
print(f"Data: {TODAY}")
sys.exit(0)