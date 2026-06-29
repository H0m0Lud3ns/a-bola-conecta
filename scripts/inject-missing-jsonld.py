#!/usr/bin/env python3
"""
Injeta JSON-LD em 3 paginas que ficaram sem durante o sync:
- /imprensa/  -> WebPage + BreadcrumbList
- /festivais/ -> CollectionPage + BreadcrumbList
- /time-da-educacao/ -> AboutPage + BreadcrumbList
Idempotente: se ja tem JSON-LD, nao duplica.
"""
import re
import sys
from pathlib import Path

DEPLOY = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/deploy/a-bola-conecta-vercel/source")
DOMAIN = "https://www.abolaconecta.com.br"

PAGES = [
    {
        "path": "imprensa/index.html",
        "schema_type": "WebPage",
        "name": "Sala de Imprensa | A Bola Conecta",
        "description": "Sala de imprensa do A Bola Conecta: releases, fotos oficiais, kit de midia, logomarcas e contatos para jornalistas, marcas e produtores.",
        "breadcrumbs": ["Inicio", "Imprensa"],
        "url": f"{DOMAIN}/imprensa",
    },
    {
        "path": "festivais/index.html",
        "schema_type": "CollectionPage",
        "name": "Premiacoes e exibicoes | A Bola Conecta",
        "description": "Trajetoria do doc A Bola Conecta em festivais, mostras e espacos academicos no Brasil e no exterior: Curta-se, CINEFOOT, FIA CINE, Lisbon Sport Film, Ubuntu, Cinema Negro em Acao, Elas nas Telas Belem.",
        "breadcrumbs": ["Inicio", "Festivais"],
        "url": f"{DOMAIN}/festivais",
    },
    {
        "path": "time-da-educacao/index.html",
        "schema_type": "AboutPage",
        "name": "Time da Educacao | Gondwana FC",
        "description": "O Time da Educacao do Gondwana FC: futebol, ancestralidade africana, cultura afro-brasileira e Lei 10.639 em sala de aula.",
        "breadcrumbs": ["Inicio", "Time da Educacao"],
        "url": f"{DOMAIN}/time-da-educacao",
    },
]


def build_jsonld(page: dict) -> str:
    bc = page["breadcrumbs"]
    items = []
    for i, name in enumerate(bc):
        url = DOMAIN + "/" if i == 0 else page["url"]
        items.append(
            f'      {{\n        "@type": "ListItem",\n        "position": {i + 1},\n        "name": "{name}",\n        "item": "{url}"\n      }}'
        )
    bc_block = ",\n".join(items)

    block = f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@graph": [
    {{
      "@type": "{page['schema_type']}",
      "@id": "{page['url']}#webpage",
      "url": "{page['url']}",
      "name": "{page['name']}",
      "description": "{page['description']}",
      "inLanguage": "pt-BR",
      "isPartOf": {{
        "@type": "WebSite",
        "name": "A Bola Conecta",
        "url": "{DOMAIN}/"
      }}
    }},
    {{
      "@type": "BreadcrumbList",
      "itemListElement": [
{bc_block}
      ]
    }}
  ]
}}
</script>
'''
    return block


applied = 0
skipped = 0
for page in PAGES:
    target = DEPLOY / page["path"]
    if not target.exists():
        print(f"MISSING: {page['path']}")
        continue
    html = target.read_text(encoding="utf-8")
    if "application/ld+json" in html:
        print(f"SKIP (ja tem): {page['path']}")
        skipped += 1
        continue
    block = build_jsonld(page)
    if "</head>" not in html:
        print(f"WARN no </head>: {page['path']}")
        continue
    new_html = html.replace("</head>", block + "  </head>", 1)
    target.write_text(new_html, encoding="utf-8")
    print(f"APPLIED: {page['path']}")
    applied += 1

print(f"\nApplied: {applied}, Skipped: {skipped}")
sys.exit(0)