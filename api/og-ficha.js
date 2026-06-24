// Edge Function: generates dynamic OG images (1200x630) for Copa 2026 fichas
// Uses @vercel/og (Satori) which is available in the Vercel runtime

// Minimal country data (code -> { name, region })
const COUNTRIES = {
  br: { name: 'Brasil', region: 'America do Sul' },
  ar: { name: 'Argentina', region: 'America do Sul' },
  uy: { name: 'Uruguai', region: 'America do Sul' },
  co: { name: 'Colombia', region: 'America do Sul' },
  ec: { name: 'Equador', region: 'America do Sul' },
  py: { name: 'Paraguai', region: 'America do Sul' },
  za: { name: 'Africa do Sul', region: 'Africa' },
  gh: { name: 'Gana', region: 'Africa' },
  sn: { name: 'Senegal', region: 'Africa' },
  eg: { name: 'Egito', region: 'Africa' },
  ma: { name: 'Marrocos', region: 'Africa' },
  dz: { name: 'Argelia', region: 'Africa' },
  tn: { name: 'Tunisia', region: 'Africa' },
  ci: { name: 'Costa do Marfim', region: 'Africa' },
  cd: { name: 'Republica Democratica do Congo', region: 'Africa' },
  au: { name: 'Australia', region: 'Oceania' },
  nz: { name: 'Nova Zelandia', region: 'Oceania' },
  sa: { name: 'Arabia Saudita', region: 'Peninsula Arabica' },
  qa: { name: 'Catar', region: 'Peninsula Arabica' },
  jo: { name: 'Jordania', region: 'Levante' },
  iq: { name: 'Iraque', region: 'Mesopotamia' },
  us: { name: 'Estados Unidos', region: 'America do Norte' },
  mx: { name: 'Mexico', region: 'America do Norte' },
  ca: { name: 'Canada', region: 'America do Norte' },
  jp: { name: 'Japao', region: 'Leste Asiatico' },
  ir: { name: 'Ira', region: 'Asia Ocidental' },
  kr: { name: 'Coreia do Sul', region: 'Leste Asiatico' },
  uz: { name: 'Uzbequistao', region: 'Asia Central' },
  cv: { name: 'Cabo Verde', region: 'Africa Atlantica' },
  'gb-eng': { name: 'Inglaterra', region: 'Europa' },
  fr: { name: 'Franca', region: 'Europa' },
  es: { name: 'Espanha', region: 'Europa' },
  de: { name: 'Alemanha', region: 'Europa' },
  pt: { name: 'Portugal', region: 'Europa Atlantica' },
  nl: { name: 'Paises Baixos', region: 'Europa' },
  be: { name: 'Belgica', region: 'Europa' },
  hr: { name: 'Croacia', region: 'Europa Balkanica' },
  ch: { name: 'Suica', region: 'Europa Alpina' },
  at: { name: 'Austria', region: 'Europa Central' },
  'gb-sct': { name: 'Escocia', region: 'Europa Atlantica' },
  no: { name: 'Noruega', region: 'Europa Nordica' },
  ba: { name: 'Bosnia e Herzegovina', region: 'Balcanes' },
  se: { name: 'Suecia', region: 'Europa Nordica' },
  tr: { name: 'Turquia', region: 'Anatolia / Europa-Asia' },
  cz: { name: 'Chequia', region: 'Europa Central' },
  pa: { name: 'Panama', region: 'America Central' },
  cw: { name: 'Curacao', region: 'Caribe' },
  ht: { name: 'Haiti', region: 'Caribe' },
};

// Convert ISO 3166-1 alpha-2 code to flag emoji using regional indicator symbols
function codeToFlag(code) {
  // Handle special cases like gb-eng, gb-sct
  const base = code.length > 2 ? code.split('-').pop() : code;
  if (!base || base.length !== 2) return '';
  const codePoints = base.toUpperCase().split('').map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const pais = (url.searchParams.get('pais') || '').toLowerCase().trim();

  const country = pais ? COUNTRIES[pais] : null;
  const flag = country ? codeToFlag(pais) : codeToFlag('br');
  const countryName = country ? country.name : 'Gondwana na Copa';
  const region = country ? country.region : 'Mundial';

  const html = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0E27',
        backgroundImage: 'linear-gradient(135deg, #0A0E27 0%, #1A1F4E 50%, #0D1B3E 100%)',
        fontFamily: 'sans-serif',
        color: '#FFFFFF',
        padding: '60px',
      },
      children: [
        // Top brand bar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#60A5FA',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  },
                  children: 'GONDWANA FC',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '20px',
                    color: '#94A3B8',
                  },
                  children: '|',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '20px',
                    color: '#94A3B8',
                    letterSpacing: '1px',
                  },
                  children: 'Copa 2026',
                },
              },
            ],
          },
        },
        // Flag emoji - big
        {
          type: 'div',
          props: {
            style: {
              fontSize: '180px',
              lineHeight: 1,
              marginBottom: '16px',
            },
            children: flag,
          },
        },
        // Country name - large
        {
          type: 'div',
          props: {
            style: {
              fontSize: '72px',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '12px',
              letterSpacing: '-1px',
            },
            children: countryName,
          },
        },
        // Region tag
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(96, 165, 250, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: '999px',
              padding: '10px 28px',
              fontSize: '24px',
              color: '#93C5FD',
              marginBottom: '24px',
            },
            children: region,
          },
        },
        // Bottom tagline
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '8px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '40px',
                    height: '3px',
                    backgroundColor: '#60A5FA',
                    borderRadius: '2px',
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '26px',
                    color: '#CBD5E1',
                    fontWeight: 500,
                  },
                  children: 'A Bola Conecta',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    width: '40px',
                    height: '3px',
                    backgroundColor: '#60A5FA',
                    borderRadius: '2px',
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  // Use @vercel/og to render
  const { ImageResponse } = await import('@vercel/og');

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
  });
}
