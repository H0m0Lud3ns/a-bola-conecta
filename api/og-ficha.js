// Edge Function: OG image (1200x630) para fichas Copa 2026
// Manual de marca Gondwana FC v2 - sin dependencias externas
// v2026-06-24-1545 - sin fetch externo, sin fonts custom (usa defaults de Satori)

export const config = {
  runtime: 'edge',
};

// Datos de los 48 paises (subset minimo: name + region + question)
const COUNTRIES = {
  br: { name: 'Brasil', region: 'America do Sul', question: 'O que o futebol brasileiro ajuda a enxergar sobre alegria popular, desigualdade, povos indigenas e presenca africana no pais?' },
  ar: { name: 'Argentina', region: 'America do Sul', question: 'O que a camisa argentina pode revelar sobre territorio, migracao, memoria popular e povos invisibilizados?' },
  uy: { name: 'Uruguai', region: 'America do Sul', question: 'Como o Uruguai ajuda a pensar que um pais nao se mede so por tamanho, mas por memoria, vida publica e cultura compartilhada?' },
  co: { name: 'Colombia', region: 'America do Sul', question: 'Como a Colombia mostra que um pais pode ser Andes, Caribe, Amazonia, Pacifico e memoria afro-indigena ao mesmo tempo?' },
  ec: { name: 'Equador', region: 'America do Sul', question: 'O que muda quando olhamos o Equador como costa, serra, Amazonia e Galapagos?' },
  py: { name: 'Paraguai', region: 'America do Sul', question: 'Como uma lingua indigena viva muda o modo de imaginar uma nacao, uma escola e uma selecao?' },
  za: { name: 'Africa do Sul', region: 'Africa', question: 'Como falar de esporte na Africa do Sul sem separar bola, apartheid, resistencia e democracia?' },
  gh: { name: 'Gana', region: 'Africa', question: 'Como Gana ajuda a transformar memoria da diaspora africana em cultura viva, educacao e pertencimento?' },
  sn: { name: 'Senegal', region: 'Africa', question: 'O que o futebol senegales revela sobre oralidade, territorio, diaspora e identidade?' },
  eg: { name: 'Egito', region: 'Africa', question: 'Como o Egito mostra que a Copa tambem passa por milenarios, Nilo e cultura arabe-africana?' },
  ma: { name: 'Marrocos', region: 'Africa', question: 'O que o Marrocos ensina sobre mundo arabe, berber, imigracao e Copa da Africa?' },
  dz: { name: 'Argelia', region: 'Africa', question: 'Como a Argelia ajuda a falar de descolonizacao, mediterraneo e Copa da Africa?' },
  tn: { name: 'Tunisia', region: 'Africa', question: 'O que a Tunisia mostra sobre Cartago, mediterraneo, mundo arabe e football maghrebi?' },
  ci: { name: 'Costa do Marfim', region: 'Africa', question: 'Como a Costa do Marfim revela forca esportiva, multiculturalismo e lingua francesa?' },
  cd: { name: 'Republica Democratica do Congo', region: 'Africa', question: 'O que o Congo RDC mostra sobre deslocamento, riqueza mineral e resistencia cultural?' },
  au: { name: 'Australia', region: 'Oceania', question: 'Como a Australia ajuda a pensar povos aborigenes, multiculturalismo e football?' },
  nz: { name: 'Nova Zelandia', region: 'Oceania', question: 'O que a Nova Zelandia mostra sobre Maori, Pacifico Sul e Copa de futebol?' },
  sa: { name: 'Arabia Saudita', region: 'Asia', question: 'Como a Arabia Saudita mostra que o mundo arabe tambem e futebol, petroleo e cultura?' },
  qa: { name: 'Catar', region: 'Asia', question: 'O que o Catar revela sobre Copa 2022, migracao, calor e geopolitica?' },
  jo: { name: 'Jordania', region: 'Asia', question: 'Como a Jordania ajuda a falar de refugiados, mundo arabe e cultura levantina?' },
  iq: { name: 'Iraque', region: 'Asia', question: 'O que o Iraque mostra sobre Mesopotamia, conflito, reconstrucao e Copa da Asia?' },
  us: { name: 'Estados Unidos', region: 'America do Norte', question: 'Como os EUA revelam imigracao latina, multiculturalismo e crescimento do football?' },
  mx: { name: 'Mexico', region: 'America do Norte', question: 'O que o Mexico ensina sobre Mesoamerica, muralismo, migracao e futebol?' },
  ca: { name: 'Canada', region: 'America do Norte', question: 'Como o Canada mostra multiculturalismo, povos indigenas e football nas Americas?' },
  jp: { name: 'Japao', region: 'Asia', question: 'O que o Japao revela sobre tradicao, tecnologia e crescimento do futebol?' },
  ir: { name: 'Ira', region: 'Asia', question: 'Como o Ira mostra que Copa, geopolitica e cultura podem coexistir em tensao?' },
  kr: { name: 'Coreia do Sul', region: 'Asia', question: 'O que a Coreia do Sul ensina sobre K-culture, futebol e geopolitica?' },
  uz: { name: 'Uzbequistao', region: 'Asia Central', question: 'Como o Uzbequistao ajuda a falar de Rota da Seda, sovietico e Copa da Asia?' },
  cv: { name: 'Cabo Verde', region: 'Africa', question: 'O que Cabo Verde mostra sobre diaspora africana, lingua portuguesa e futebol?' },
  'gb-eng': { name: 'Inglaterra', region: 'Europa', question: 'Como a Inglaterra mostra colonialismo, futebol moderno e Copa do Mundo?' },
  fr: { name: 'Franca', region: 'Europa', question: 'O que a Franca revela sobre Republica, diaspora africana e mundial de futebol?' },
  es: { name: 'Espanha', region: 'Europa', question: 'Como a Espanha mostra multiculturalismo, futebol e memoria ibero-americana?' },
  de: { name: 'Alemanha', region: 'Europa', question: 'O que a Alemanha ensina sobre reconstrucao pos-guerra, multiculturalismo e Copa?' },
  pt: { name: 'Portugal', region: 'Europa', question: 'Como Portugal mostra diaspora, lusofonia e mundial de futebol?' },
  nl: { name: 'Paises Baixos', region: 'Europa', question: 'O que a Holanda revela sobre tolerancia, tolerancia cultural e futebol total?' },
  be: { name: 'Belgica', region: 'Europa', question: 'Como a Belgica mostra bilinguismo, capital europeia e football?' },
  hr: { name: 'Croacia', region: 'Europa', question: 'O que a Croacia revela sobre identidade, conflito dos Balcas e Copa de futebol?' },
  ch: { name: 'Suica', region: 'Europa', question: 'Como a Suica mostra multiliguismo, neutralidade e Copa do Mundo?' },
  at: { name: 'Austria', region: 'Europa', question: 'O que a Austria ensina sobre imperio, Europa Central e football?' },
  'gb-sct': { name: 'Escocia', region: 'Europa', question: 'Como a Escocia mostra identidade constitutiva do Reino Unido e Copa de futebol?' },
  no: { name: 'Noruega', region: 'Europa', question: 'O que a Noruega revela sobre petroleo, povos Sami e football nas Americas?' },
  ba: { name: 'Bosnia e Herzegovina', region: 'Europa', question: 'Como a Bosnia mostra convivencia, guerra, diaspora e football?' },
  se: { name: 'Suecia', region: 'Europa', question: 'O que a Suecia ensina sobre Estado social, povo Sami e football global?' },
  tr: { name: 'Turquia', region: 'Europa-Asia', question: 'Como a Turquia mostra fronteira Europa-Asia, imperio, republica e football?' },
  cz: { name: 'Chequia', region: 'Europa', question: 'O que a Chequia ensina sobre Bohemia, Tchecoslovaquia e memory centro-europeia?' },
  pa: { name: 'Panama', region: 'America Central', question: 'Como o Panama mostra que America Central tambem e ponte, canal e Copa?' },
  cw: { name: 'Curacao', region: 'Caribe', question: 'O que Curacao revela sobre lingua propria, autonomia e football caribenho?' },
  ht: { name: 'Haiti', region: 'Caribe', question: 'Como o Haiti muda a historia quando liberdade negra entra no centro da narrativa?' },
};

function truncate(text, max) {
  if (!text) return '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + '...';
}

export default async function handler(req) {
  try {
    const { ImageResponse } = await import('@vercel/og');
    const url = new URL(req.url);
    const paisParam = (url.searchParams.get('pais') || '').toLowerCase().trim();
    const country = paisParam && Object.prototype.hasOwnProperty.call(COUNTRIES, paisParam) ? COUNTRIES[paisParam] : null;

    const countryName = country ? country.name : 'Gondwana na Copa';
    const region = country ? country.region : 'Copa do Mundo 2026';
    const question = country
      ? truncate(country.question, 200)
      : '48 paises. Um planeta. Futebol como leitura de territorio, povos, memoria e educacao.';

    // Paleta oficial del manual de marca Gondwana FC v2
    const COLORS = {
      grafiteVivo: '#11130F',
      areiaEscola: '#F6EDD7',
      ouroBola: '#F2C230',
      verdeCampo: '#2E6F46',
      barroTerritorio: '#9E4A2F',
      azulProfundo: '#17243A',
    };

    // Layout limpio: gradiente azul + tarjeta central
    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #17243A 0%, #11130F 100%)',
            padding: '60px',
            fontFamily: 'sans-serif',
          },
          children: [
            // Header: marca + badge Copa 2026
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  marginBottom: '50px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 28,
                        fontWeight: 900,
                        color: COLORS.areiaEscola,
                        letterSpacing: '4px',
                      },
                      children: 'GONDWANA FC',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 18,
                        color: COLORS.ouroBola,
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      },
                      children: 'COPA 2026',
                    },
                  },
                ],
              },
            },
            // Centro: nombre del pais + region + pregunta
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'center',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 96,
                        fontWeight: 900,
                        color: COLORS.areiaEscola,
                        lineHeight: 1,
                        marginBottom: 20,
                      },
                      children: countryName,
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 24,
                        color: COLORS.ouroBola,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: 700,
                        marginBottom: 40,
                      },
                      children: region,
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 30,
                        color: COLORS.areiaEscola,
                        lineHeight: 1.4,
                        fontStyle: 'italic',
                        opacity: 0.9,
                        maxWidth: '95%',
                      },
                      children: '"' + question + '"',
                    },
                  },
                ],
              },
            },
            // Footer: URL
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '2px solid ' + COLORS.ouroBola,
                  paddingTop: 24,
                  fontSize: 20,
                  color: COLORS.areiaEscola,
                  opacity: 0.7,
                  letterSpacing: '1px',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { fontWeight: 700, letterSpacing: '3px', fontSize: 16 },
                      children: 'PULSO TIPOGRAFICO',
                    },
                  },
                  {
                    type: 'div',
                    props: { children: 'abolaconecta.com.br/copa-2026' },
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
