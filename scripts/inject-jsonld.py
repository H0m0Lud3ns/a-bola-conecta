#!/usr/bin/env python3
"""
Injeta blocos JSON-LD do projects/dist/ no deploy/source/, antes do </head>.
Idempotente: se a pagina ja tem application/ld+json, nao duplica.
"""
from pathlib import Path
import re
import sys

PROJ_DIST = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/projects/a-bola-conecta/source/repo/dist")
DEPLOY = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/deploy/a-bola-conecta-vercel/source")

# Mapeamento: page_path relativo (vazio = raiz) -> (source_relative, deploy_relative)
PAGES = [
    ("", "index.html", "index.html"),
    ("blog/", "blog/index.html", "blog/index.html"),
    ("contato/", "contato/index.html", "contato/index.html"),
    ("metodologia/", "metodologia/index.html", "metodologia/index.html"),
    ("servicos/", "servicos/index.html", "servicos/index.html"),
    ("sobre/", "sobre/index.html", "sobre/index.html"),
    ("copa-2026/", "copa-2026/index.html", "copa-2026/index.html"),
    ("documentario/", "documentario/index.html", "documentario/index.html"),
]

LD_RE = re.compile(r'<script type="application/ld\+json">.*?</script>', re.DOTALL)


def extract_block(html):
    m = LD_RE.search(html)
    if not m:
        return None
    return m.group(0)


def main() -> int:
    applied = 0
    skipped = 0
    missing = 0
    for page_label, src_rel, dep_rel in PAGES:
        src_path = PROJ_DIST / src_rel
        dep_path = DEPLOY / dep_rel
        if not src_path.exists():
            print(f"MISSING source: {src_rel}", file=sys.stderr)
            missing += 1
            continue
        if not dep_path.exists():
            print(f"MISSING target: {dep_rel}", file=sys.stderr)
            missing += 1
            continue
        src_html = src_path.read_text(encoding="utf-8")
        dep_html = dep_path.read_text(encoding="utf-8")
        block = extract_block(src_html)
        if not block:
            print(f"NO JSON-LD in source: {src_rel}", file=sys.stderr)
            missing += 1
            continue
        # idempotencia: ja tem JSON-LD?
        if 'application/ld+json' in dep_html:
            print(f"SKIP (ja tem JSON-LD): {dep_rel}")
            skipped += 1
            continue
        # injeta antes do </head>
        if "</head>" not in dep_html:
            print(f"WARN no </head>: {dep_rel}", file=sys.stderr)
            continue
        new_html = dep_html.replace("</head>", f"{block}\n  </head>", 1)
        dep_path.write_text(new_html, encoding="utf-8")
        print(f"APPLIED: {dep_rel} (+{len(block)} chars)")
        applied += 1
    print(f"\nApplied: {applied}, Skipped: {skipped}, Missing: {missing}")
    return 0


if __name__ == "__main__":
    sys.exit(main())