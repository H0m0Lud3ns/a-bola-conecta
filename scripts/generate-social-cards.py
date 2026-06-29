#!/usr/bin/env python3
"""
Generate social cards 1200x630 (Open Graph) for A Bola Conecta pages.
Uses Playwright headless Chromium to render HTML+CSS and screenshot.
Style: clean institutional dark, official Gondwana FC shield.
"""
import os
import base64
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ASSETS = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/projects/a-bola-conecta/source/repo/source/assets")
OUT_DIR = Path("/Users/ai-ivanpaezmora/.openclaw-clients/workspace-sebas-acevedo-ai/projects/a-bola-conecta/source/repo/source/assets")

# Brand colors from Gondwana FC
COLOR_BG = "#0f1410"          # very dark green-black
COLOR_BG2 = "#161b16"         # subtle gradient
COLOR_GREEN = "#0E7C3A"       # brand green
COLOR_GOLD = "#d4a72c"        # accent gold
COLOR_WHITE = "#ffffff"
COLOR_GRAY = "#b0b8b3"

SHIELD_PATH = ASSETS / "gondwana-fc-logo-oficial.png"

CARDS = [
    {
        "filename": "og-card-metodologia.png",
        "kicker": "METODOLOGIA",
        "headline": "Metodologia",
        "headline2": "ABC",
        "subtitle": "Educação, cultura e esporte pelo futebol.",
        "url": "abolaconecta.com.br/metodologia",
        "tag": "Time da Educação",
    },
    {
        "filename": "og-card-servicos.png",
        "kicker": "SERVIÇOS",
        "headline": "Formação, consultoria",
        "headline2": "& audiovisual esportivo.",
        "subtitle": "Para escolas, federações, marcas e projetos sociais.",
        "url": "abolaconecta.com.br/servicos",
        "tag": "Atendimento institucional",
    },
    {
        "filename": "og-card-documentario.png",
        "kicker": "DOCUMENTÁRIO",
        "headline": "A Bola Conta",
        "headline2": "História.",
        "subtitle": "Série audiovisual no Museu do Futebol — São Paulo.",
        "url": "abolaconecta.com.br/documentario",
        "tag": "Em produção",
    },
    {
        "filename": "og-card-copa-2026.png",
        "kicker": "COPA 2026",
        "headline": "O futebol encontra",
        "headline2": "a educação.",
        "subtitle": "Camisa pedagógica do Time da Educação — edição especial.",
        "url": "abolaconecta.com.br/copa-2026",
        "tag": "Edição limitada",
    },
]


def make_html(card: dict, shield_b64: str) -> str:
    headline_html = card["headline"].replace("\n", "<br>")
    headline2_html = card["headline2"].replace("\n", "<br>")
    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 1200px; height: 630px; overflow: hidden; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    background: linear-gradient(135deg, {COLOR_BG} 0%, {COLOR_BG2} 100%);
    color: {COLOR_WHITE};
    position: relative;
  }}
  .card {{
    width: 1200px;
    height: 630px;
    position: relative;
    padding: 50px 70px 50px 70px;
    display: grid;
    grid-template-columns: 1fr 280px;
    grid-template-rows: auto 1fr auto;
    gap: 0 50px;
  }}

  /* Top bar (only wordmark now) */
  .top {{
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    display: flex;
    align-items: center;
    gap: 22px;
  }}
  .brand {{
    display: flex;
    flex-direction: column;
  }}
  .brand-mark {{
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 3px;
    color: {COLOR_WHITE};
  }}
  .brand-sub {{
    font-size: 13px;
    letter-spacing: 4px;
    color: {COLOR_GRAY};
    text-transform: uppercase;
    font-weight: 600;
    margin-top: 5px;
  }}

  /* Right column: shield as hero on its own */
  .shield-hero {{
    grid-column: 2 / 3;
    grid-row: 1 / 4;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }}
  .shield-hero::before {{
    content: "";
    position: absolute;
    inset: 0% 5% 0% 5%;
    background: radial-gradient(circle at center, rgba(14,124,58,0.40) 0%, rgba(14,124,58,0.12) 45%, transparent 75%);
    border-radius: 50%;
  }}
  .shield-hero img {{
    width: 88%;
    height: auto;
    max-height: 450px;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 14px 40px rgba(0,0,0,0.65)) brightness(1.0);
    margin-left: -30px;
  }}

  /* Big content */
  .content {{
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px 0;
  }}
  .kicker {{
    font-size: 18px;
    letter-spacing: 7px;
    color: {COLOR_GOLD};
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 14px;
  }}
  .headline {{
    font-size: 88px;
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -3px;
    color: {COLOR_WHITE};
    margin-bottom: 4px;
  }}
  .headline .accent-word {{
    color: {COLOR_GREEN};
    font-style: italic;
  }}
  .accent {{
    display: inline-block;
    width: 110px;
    height: 6px;
    background: {COLOR_GOLD};
    margin-bottom: 22px;
  }}
  .subtitle {{
    font-size: 26px;
    font-weight: 500;
    line-height: 1.35;
    color: #e8ece9;
    max-width: 560px;
  }}

  /* Bottom bar */
  .bottom {{
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255,255,255,0.10);
    padding-top: 22px;
  }}
  .url {{
    font-size: 19px;
    font-weight: 700;
    color: {COLOR_WHITE};
    letter-spacing: 0.5px;
  }}
  .tag {{
    font-size: 14px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: {COLOR_GREEN};
    font-weight: 800;
  }}

  /* Decorative corner accent */
  .corner {{
    position: absolute;
    top: 0;
    left: 0;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle at top left, rgba(212,167,44,0.10), transparent 70%);
    pointer-events: none;
  }}
</style>
</head>
<body>
<div class="card">
  <div class="corner"></div>

  <div class="top">
    <div class="brand">
      <div class="brand-mark">GONDWANA FC</div>
      <div class="brand-sub">A bola conecta</div>
    </div>
  </div>

  <div class="shield-hero">
    <img src="data:image/png;base64,{shield_b64}" alt="Gondwana FC">
  </div>

  <div class="content">
    <div class="kicker">{card['kicker']}</div>
    <div class="headline">{headline_html} <span class="accent-word">{headline2_html}</span></div>
    <div class="accent"></div>
    <div class="subtitle">{card['subtitle']}</div>
  </div>

  <div class="bottom">
    <div class="url">{card['url']}</div>
    <div class="tag">Gondwana FC</div>
  </div>
</div>
</body>
</html>
"""


async def main():
    shield_bytes = SHIELD_PATH.read_bytes()
    shield_b64 = base64.b64encode(shield_bytes).decode("ascii")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for card in CARDS:
            ctx = await browser.new_context(viewport={"width": 1200, "height": 630}, device_scale_factor=2)
            page = await ctx.new_page()
            html = make_html(card, shield_b64)
            await page.set_content(html, wait_until="load")
            await page.wait_for_timeout(400)
            out_path = OUT_DIR / card["filename"]
            await page.screenshot(path=str(out_path), full_page=False, type="png", omit_background=False)
            await ctx.close()
            print(f"OK  {out_path.name}  {out_path.stat().st_size//1024} KB")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())