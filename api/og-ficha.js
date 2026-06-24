// Edge Function: OG image (1200x630) para fichas Copa 2026
// v3 - layout centrado vertical (safe area cuadrada WhatsApp) + ortografia portuguesa correta
// v2026-06-24-1655 - sem fetch externo, sem fonts custom (usa defaults de Satori)
// Manual de marca Gondwana FC aplicado: paleta Grafite/Areia/Ouro/Azul

export const config = {
  runtime: 'edge',
};

// Dados dos 48 paises classificados para a Copa do Mundo 2026
// Fonte oficial FIFA. Ortografia em portugues do Brasil com acentos corretos.
const COUNTRIES = {
  // CONMEBOL (6)
  ar: { name: 'Argentina' },
  br: { name: 'Brasil' },
  uy: { name: 'Uruguai' },
  co: { name: 'Colômbia' },
  ec: { name: 'Equador' },
  py: { name: 'Paraguai' },
  // UEFA (16)
  de: { name: 'Alemanha' },
  fr: { name: 'França' },
  'gb-eng': { name: 'Inglaterra' },
  es: { name: 'Espanha' },
  pt: { name: 'Portugal' },
  be: { name: 'Bélgica' },
  nl: { name: 'Países Baixos' },
  hr: { name: 'Croácia' },
  ch: { name: 'Suíça' },
  at: { name: 'Áustria' },
  no: { name: 'Noruega' },
  'gb-sct': { name: 'Escócia' },
  ba: { name: 'Bósnia e Herzegovina' },
  cz: { name: 'Tchéquia' },
  tr: { name: 'Turquia' },
  se: { name: 'Suécia' },
  // CAF (9)
  ma: { name: 'Marrocos' },
  sn: { name: 'Senegal' },
  eg: { name: 'Egito' },
  ci: { name: 'Costa do Marfim' },
  dz: { name: 'Argélia' },
  za: { name: 'África do Sul' },
  tn: { name: 'Tunísia' },
  gh: { name: 'Gana' },
  cv: { name: 'Cabo Verde' },
  // AFC (8)
  jp: { name: 'Japão' },
  kr: { name: 'Coreia do Sul' },
  ir: { name: 'Irã' },
  au: { name: 'Austrália' },
  sa: { name: 'Arábia Saudita' },
  qa: { name: 'Catar' },
  jo: { name: 'Jordânia' },
  uz: { name: 'Uzbequistão' },
  // CONCACAF (6)
  us: { name: 'Estados Unidos' },
  mx: { name: 'México' },
  ca: { name: 'Canadá' },
  pa: { name: 'Panamá' },
  ht: { name: 'Haiti' },
  cw: { name: 'Curaçau' },
  // OFC (1)
  nz: { name: 'Nova Zelândia' },
  // Repescagem intercontinental (2)
  cd: { name: 'República Democrática do Congo' },
  iq: { name: 'Iraque' },
};

// Emoji bandeira por codigo de pais
const FLAGS = {
  br: '🇧🇷', ar: '🇦🇷', uy: '🇺🇾', co: '🇨🇴', ec: '🇪🇨', py: '🇵🇾',
  za: '🇿🇦', gh: '🇬🇭', sn: '🇸🇳', eg: '🇪🇬', ma: '🇲🇦', dz: '🇩🇿',
  tn: '🇹🇳', ci: '🇨🇮', cd: '🇨🇩', au: '🇦🇺', nz: '🇳🇿', sa: '🇸🇦',
  qa: '🇶🇦', jo: '🇯🇴', iq: '🇮🇶', us: '🇺🇸', mx: '🇲🇽', ca: '🇨🇦',
  jp: '🇯🇵', ir: '🇮🇷', kr: '🇰🇷', uz: '🇺🇿', cv: '🇨🇻',
  'gb-eng': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fr: '🇫🇷', es: '🇪🇸', de: '🇩🇪', pt: '🇵🇹',
  nl: '🇳🇱', be: '🇧🇪', hr: '🇭🇷', ch: '🇨🇭', at: '🇦🇹',
  'gb-sct': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', no: '🇳🇴', ba: '🇧🇦', se: '🇸🇪', tr: '🇹🇷',
  cz: '🇨🇿', pa: '🇵🇦', cw: '🇨🇼', ht: '🇭🇹',
};

export default async function handler(req) {
  try {
    const { ImageResponse } = await import('@vercel/og');
    const url = new URL(req.url);
    const paisParam = (url.searchParams.get('pais') || '').toLowerCase().trim();
    const country = paisParam && Object.prototype.hasOwnProperty.call(COUNTRIES, paisParam) ? COUNTRIES[paisParam] : null;

    const countryName = country ? country.name : 'Copa do Mundo 2026';
    const flag = country ? (FLAGS[paisParam] || '🌍') : '🌎';

    // Tamanho do titulo se adapta ao comprimento do nome
    const nameLength = countryName.length;
    let titleSize = 110;
    if (nameLength > 10) titleSize = 88;
    if (nameLength > 15) titleSize = 64;
    if (nameLength > 19) titleSize = 52;
    if (nameLength > 25) titleSize = 42;

    // Paleta oficial do manual de marca Gondwana FC v2
    const COLORS = {
      grafiteVivo: '#11130F',
      areiaEscola: '#F6EDD7',
      ouroBola: '#F2C230',
      azulProfundo: '#17243A',
    };

    // Layout v3: conteudo centrado verticalmente (safe area 630x630 para WhatsApp)
    // Tudo o que importa vive no centro do banner, sem perder-se no recorte quadrado.
    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #17243A 0%, #11130F 100%)',
            padding: '60px',
            fontFamily: 'sans-serif',
            gap: '20px',
          },
          children: [
            // 1. MARCA GONDWANA FC (chico, no topo)
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 22,
                        fontWeight: 900,
                        color: COLORS.areiaEscola,
                        letterSpacing: '5px',
                        lineHeight: 1,
                      },
                      children: 'GONDWANA FC',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 11,
                        color: COLORS.ouroBola,
                        letterSpacing: '3px',
                        marginTop: 4,
                        fontWeight: 700,
                      },
                      children: 'TIME DA EDUCAÇÃO',
                    },
                  },
                ],
              },
            },
            // 2. BANDEIRA GRANDE centrada
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 200,
                  lineHeight: 1,
                },
                children: flag,
              },
            },
            // 3. NOME DO PAIS (tamanho adaptativo)
            {
              type: 'div',
              props: {
                style: {
                  fontSize: titleSize,
                  fontWeight: 900,
                  color: COLORS.areiaEscola,
                  lineHeight: 0.95,
                  letterSpacing: '-2px',
                  textAlign: 'center',
                  maxWidth: '90%',
                },
                children: countryName,
              },
            },
            // 4. CONTEXTO: Copa do Mundo 2026 + URL
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '8px',
                  gap: '6px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 18,
                        color: COLORS.areiaEscola,
                        letterSpacing: '6px',
                        fontWeight: 700,
                        opacity: 0.85,
                      },
                      children: 'COPA DO MUNDO 2026',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 16,
                        color: COLORS.areiaEscola,
                        opacity: 0.75,
                        letterSpacing: '1px',
                      },
                      children: 'abolaconecta.com.br/copa-2026',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      { width: 1200, height: 630 }
    );
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack,
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
