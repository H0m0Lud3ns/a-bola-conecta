/* inject-home.js
 * Snippet de festivais para o home de abolaconecta.com.br
 *
 * Funciona em dois modos:
 *
 * 1) INTEGRADO: o script tenta inserir a galeria de festivais
 *    imediatamente apos o hero / manifesto do React.
 *    Se o React monta normalmente, este snippet aparece
 *    visualmente como uma "banda de credibilidade" entre o
 *    manifesto e os "Caminhos para conectar".
 *
 * 2) FALLBACK: se o React nao carregar (JS desabilitado,
 *    bundle quebrado, slow network), o mesmo snippet aparece
 *    ao final do <body>, antes dos scripts de servico.
 *    Garante que pelo menos a prova social basica
 *    fique visivel.
 *
 * O React, quando estiver ativo, vai inserir <main> dentro de
 * <div id="root">. Quando o React termina de montar,
 * identificamos o final do bloco Manifesto / Hero e injetamos
 * o snippet logo apos.
 */

(function() {
  // Configuracao: lista de festivais com paths das imagens
  // Path base: relativo a raiz do site. Como o site serve de
  // /a-bola-conecta/, ajustamos os caminhos para funcionarem
  // tanto na home quanto em subpastas.
  var FESTIVAIS = [
    {
      id: 'curta-se',
      nome: 'Curta-se',
      meta: '23ª edição · Prêmio Melhor Trailer · Sergipe',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/23-curta-se-festival-sergipe-premio-melhor-trailer.png',
      isPremio: true
    },
    {
      id: 'cinefoot',
      nome: 'CINEFOOT',
      meta: '2021 · Seleção Oficial · Rio de Janeiro',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/cinefoot-2021.png'
    },
    {
      id: 'fiacine',
      nome: 'FIA CINE',
      meta: '9ª edição · Seleção Oficial · Brasil',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/9-fiacine-festival-ibero-americano.png'
    },
    {
      id: 'lisbon',
      nome: 'Lisbon Sport Film Festival',
      meta: '4ª edição · 2022 · Seleção Oficial · Lisboa',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/4-lisbon-sport-film-festival-2022.png'
    },
    {
      id: 'ubuntu',
      nome: 'Festival Ubuntu',
      meta: '3ª edição · 2022 · Seleção Oficial · Brasil',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/3-festival-ubuntu-2022.png'
    },
    {
      id: 'cinema-negro',
      nome: 'Cinema Negro em Ação',
      meta: '3ª edição · 2022 · Seleção Oficial · Rio de Janeiro',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/3-cinema-negro-em-acao-2022.png'
    },
    {
      id: 'elas',
      nome: 'Elas nas Telas',
      meta: '2025 · Seleção Oficial · Belém, Pará',
      logo: '/a-bola-conecta/documentario/assets/festivais/web/festival-elas-nas-telas-belem-2025.png'
    }
  ];

  function buildSnip() {
    var section = document.createElement('section');
    section.className = 'home-festivais-strip';
    section.setAttribute('aria-label', 'Premiações e exibições do documentário');
    section.innerHTML = [
      '<div class="home-festivais-inner">',
      '  <p class="home-festivais-label">Exibido e premiado em festivais no Brasil e no exterior</p>',
      '  <div class="home-festivais-track">',
      FESTIVAIS.map(function(f) {
        return [
          '    <a class="home-festivais-card' + (f.isPremio ? ' is-premio' : '') + '"',
          '       href="/a-bola-conecta/festivais/"',
          '       title="' + f.nome + ' · ' + f.meta + '">',
          '      <img src="' + f.logo + '" alt="' + f.nome + ' - ' + f.meta + '" loading="lazy" />',
          '      ' + (f.isPremio ? '<span class="home-festivais-estrela" aria-hidden="true">★</span>' : ''),
          '    </a>'
        ].join('\n');
      }).join('\n'),
      '  </div>',
      '  <a class="home-festivais-cta" href="/a-bola-conecta/festivais/">',
      '    Ver trajetória completa',
      '    <span aria-hidden="true">→</span>',
      '  </a>',
      '</div>'
    ].join('\n');
    return section;
  }

  function injectCSS() {
    if (document.getElementById('home-festivais-css')) return;
    var style = document.createElement('style');
    style.id = 'home-festivais-css';
    style.textContent = [
      '.home-festivais-strip{',
      '  background:rgba(255,255,255,.03);',
      '  border-top:1px solid rgba(245,158,11,.18);',
      '  border-bottom:1px solid rgba(245,158,11,.18);',
      '  padding:28px 0 24px;',
      '  margin:0;',
      '  position:relative;',
      '  overflow:hidden;',
      '  font-family:Montserrat,Inter,Arial,sans-serif',
      '}',
      '.home-festivais-inner{',
      '  max-width:1280px;',
      '  margin:0 auto;',
      '  padding:0 24px;',
      '  text-align:center',
      '}',
      '.home-festivais-label{',
      '  font-size:11px;',
      '  font-weight:700;',
      '  letter-spacing:.18em;',
      '  text-transform:uppercase;',
      '  color:rgba(248,237,210,.65);',
      '  margin:0 0 18px',
      '}',
      '.home-festivais-track{',
      '  display:flex;',
      '  flex-wrap:wrap;',
      '  justify-content:center;',
      '  align-items:center;',
      '  gap:28px;',
      '  margin-bottom:18px',
      '}',
      '.home-festivais-card{',
      '  position:relative;',
      '  width:78px;',
      '  height:78px;',
      '  background:transparent;',
      '  border-radius:8px;',
      '  padding:2px;',
      '  text-decoration:none;',
      '  filter:invert(1) brightness(0.95);',
      '  opacity:.85;',
      '  transition:opacity .2s ease,transform .2s ease',
      '}',
      '.home-festivais-card:hover{',
      '  opacity:1;',
      '  transform:translateY(-2px)',
      '}',
      '.home-festivais-card img{',
      '  width:100%;',
      '  height:100%;',
      '  object-fit:contain;',
      '  display:block',
      '}',
      '.home-festivais-card.is-premio{',
      '  filter:invert(1) brightness(1) drop-shadow(0 0 6px rgba(245,158,11,.5));',
      '  opacity:1',
      '}',
      '.home-festivais-estrela{',
      '  position:absolute;',
      '  top:-4px;',
      '  right:-4px;',
      '  color:hsl(45,96%,58%);',
      '  font-size:14px;',
      '  text-shadow:0 1px 4px rgba(0,0,0,.5)',
      '}',
      '.home-festivais-cta{',
      '  display:inline-block;',
      '  margin-top:8px;',
      '  padding:10px 20px;',
      '  background:hsl(45,96%,58%);',
      '  color:hsl(28,18%,10%);',
      '  border-radius:999px;',
      '  font-weight:700;',
      '  font-size:13px;',
      '  text-decoration:none;',
      '  letter-spacing:.02em;',
      '  transition:transform .2s ease,box-shadow .2s ease',
      '}',
      '.home-festivais-cta:hover{',
      '  transform:translateY(-1px);',
      '  box-shadow:0 6px 18px rgba(245,158,11,.35)',
      '}',
      '@media(max-width:640px){',
      '  .home-festivais-track{',
      '    gap:14px',
      '  }',
      '  .home-festivais-card{',
      '    width:58px;',
      '    height:58px',
      '  }',
      '  .home-festivais-cta{',
      '    font-size:12px;',
      '    padding:8px 16px',
      '  }',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function tryIntegrate() {
    // Procura o final do hero/manifesto do React.
    // O React normalmente envolve o conteudo em <main> dentro de #root.
    // Vamos tentar identificar o final do bloco "Manifesto Gondwana"
    // e inserir a faixa de festivais logo apos.

    var root = document.getElementById('root');
    if (!root) return false;

    // Estrategia 1: procurar por um h2 com texto Manifesto ou similar
    var headings = root.querySelectorAll('h2, h3');
    var targetAfter = null;
    headings.forEach(function(h) {
      var txt = (h.textContent || '').toLowerCase();
      if (txt.indexOf('manifesto') !== -1 || txt.indexOf('jornada ancestral') !== -1) {
        // Pega o pai do heading e sobe ate achar uma section ou o pai direto
        var parent = h.closest('section') || h.parentElement;
        if (parent) targetAfter = parent;
      }
    });

    // Estrategia 2: pegar o ultimo elemento filho de <main>
    if (!targetAfter) {
      var main = root.querySelector('main') || root;
      if (main && main.children.length > 0) {
        // Pegar o primeiro filho como referencia (provavelmente o hero)
        targetAfter = main.children[0];
      }
    }

    if (targetAfter && targetAfter.parentNode) {
      var snip = buildSnip();
      targetAfter.parentNode.insertBefore(snip, targetAfter.nextSibling);
      return true;
    }

    return false;
  }

  function fallbackInject() {
    // Insere no final do body se React nao estiver presente
    var root = document.getElementById('root');
    if (!root || root.children.length === 0) {
      injectCSS();
      document.body.appendChild(buildSnip());
    }
  }

  function init() {
    injectCSS();

    // Tentar integrar logo de cara (algumas secoes do React podem
    // ja estar renderizadas no SSR ou em carregamento rapido)
    if (!tryIntegrate()) {
      // Se nao rolou, garantir fallback visivel
      fallbackInject();
    }

    // Tentar integrar apos delays diferentes (React renderiza
    // progressivamente em SPAs)
    var attempts = [500, 1200, 2500, 4000];
    attempts.forEach(function(delay) {
      setTimeout(function() {
        // So tenta se ainda nao foi integrado
        if (!document.querySelector('.home-festivais-strip[data-mode="integrated"]')) {
          var snip = buildSnip();
          snip.setAttribute('data-mode', 'integrated');
          if (tryIntegrateWith(snip)) {
            // Remove o fallback se existir
            var fallback = document.querySelector('.home-festivais-strip:not([data-mode])');
            if (fallback) fallback.remove();
          }
        }
      }, delay);
    });
  }

  function tryIntegrateWith(snip) {
    var root = document.getElementById('root');
    if (!root) return false;

    var headings = root.querySelectorAll('h2, h3');
    var targetAfter = null;
    headings.forEach(function(h) {
      var txt = (h.textContent || '').toLowerCase();
      if (txt.indexOf('manifesto') !== -1 || txt.indexOf('jornada ancestral') !== -1) {
        var parent = h.closest('section') || h.parentElement;
        if (parent && parent.parentNode) targetAfter = parent;
      }
    });

    if (!targetAfter) {
      var main = root.querySelector('main') || root;
      if (main && main.children.length > 0) {
        targetAfter = main.children[0];
      }
    }

    if (targetAfter && targetAfter.parentNode) {
      targetAfter.parentNode.insertBefore(snip, targetAfter.nextSibling);
      return true;
    }

    return false;
  }

  // Iniciar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();