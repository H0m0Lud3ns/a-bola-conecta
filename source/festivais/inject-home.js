/* inject-home.js
 * Carrusel de festivais para o home de abolaconecta.com.br
 *
 * Funciona como faixa de credenciales justo ANTES del
 * "Manifesto Gondwana". Formato carrusel horizontal
 * (scroll-snap CSS) con:
 * - 7 cards blancos (Curta-se destacado)
 * - Tap/click → /festivais/
 * - Scroll horizontal con snap en mobile
 * - Indicador de dot pagination abajo
 * - Autoplay sutil cada 5s (pausa en hover o focus)
 * - Respeta prefers-reduced-motion
 *
 * Si React no monta (JS deshabilitado / bundle roto),
 * el snippet aparece al final del body como fallback.
 */

(function() {
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
    section.setAttribute('role', 'region');

    var cards = FESTIVAIS.map(function(f, idx) {
      var cardClass = 'home-festivais-card';
      if (f.isPremio) cardClass += ' is-premio';
      return [
        '    <a class="' + cardClass + '"',
        '       href="/a-bola-conecta/festivais/#' + f.id + '"',
        '       data-idx="' + idx + '"',
        '       title="' + f.nome + ' · ' + f.meta + '">',
        '      <img src="' + f.logo + '" alt="' + f.nome + ' - ' + f.meta + '" loading="lazy" draggable="false" />',
        '    </a>'
      ].join('\n');
    }).join('\n');

    var dots = FESTIVAIS.map(function(_, idx) {
      return '<button class="home-festivais-dot" data-idx="' + idx + '" aria-label="Ir para card ' + (idx + 1) + '"></button>';
    }).join('');

    section.innerHTML = [
      '<div class="home-festivais-inner">',
      '  <p class="home-festivais-label">Exibido e premiado em festivais no Brasil e no exterior</p>',
      '  <div class="home-festivais-viewport">',
      '    <button class="home-festivais-arrow home-festivais-arrow-prev" aria-label="Anterior">‹</button>',
      '    <div class="home-festivais-track" tabindex="0">',
      cards,
      '    </div>',
      '    <button class="home-festivais-arrow home-festivais-arrow-next" aria-label="Próximo">›</button>',
      '  </div>',
      '  <div class="home-festivais-dots">' + dots + '</div>',
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
      '  background:#ffffff;',
      '  border-top:1px solid rgba(245,158,11,.35);',
      '  border-bottom:1px solid rgba(245,158,11,.35);',
      '  padding:32px 0 28px;',
      '  margin:0;',
      '  position:relative;',
      '  overflow:hidden;',
      '  font-family:Montserrat,Inter,Arial,sans-serif',
      '}',
      '.home-festivais-inner{',
      '  max-width:1280px;',
      '  margin:0 auto;',
      '  padding:0 56px;',
      '  text-align:center;',
      '  position:relative',
      '}',
      '.home-festivais-label{',
      '  font-size:11px;',
      '  font-weight:700;',
      '  letter-spacing:.18em;',
      '  text-transform:uppercase;',
      '  color:hsl(28,18%,15%);',
      '  margin:0 0 20px',
      '}',
      '.home-festivais-viewport{',
      '  position:relative;',
      '  overflow:visible',
      '}',
      '.home-festivais-track{',
      '  display:flex;',
      '  flex-wrap:nowrap;',
      '  justify-content:flex-start;',
      '  align-items:center;',
      '  gap:20px;',
      '  margin-bottom:18px;',
      '  overflow-x:auto;',
      '  overflow-y:hidden;',
      '  scroll-snap-type:x mandatory;',
      '  scroll-behavior:smooth;',
      '  -webkit-overflow-scrolling:touch;',
      '  scrollbar-width:none;',
      '  padding:8px 4px',
      '}',
      '.home-festivais-track::-webkit-scrollbar{',
      '  display:none',
      '}',
      '.home-festivais-card{',
      '  position:relative;',
      '  flex:0 0 auto;',
      '  width:96px;',
      '  height:96px;',
      '  background:#ffffff;',
      '  border-radius:12px;',
      '  padding:8px;',
      '  text-decoration:none;',
      '  box-shadow:0 2px 10px rgba(0,0,0,.1);',
      '  scroll-snap-align:center;',
      '  transition:transform .25s ease,box-shadow .25s ease;',
      '  cursor:pointer',
      '}',
      '.home-festivais-card:hover,.home-festivais-card:focus-visible{',
      '  transform:translateY(-4px) scale(1.06);',
      '  box-shadow:0 10px 24px rgba(245,158,11,.3);',
      '  outline:none',
      '}',
      '.home-festivais-card img{',
      '  width:100%;',
      '  height:100%;',
      '  object-fit:contain;',
      '  display:block;',
      '  pointer-events:none',
      '}',
      '.home-festivais-card.is-premio{',
      '  width:112px;',
      '  height:112px;',
      '  border:2px solid hsl(45,96%,58%);',
      '  box-shadow:0 4px 16px rgba(245,158,11,.4),0 0 0 4px rgba(245,158,11,.15)',
      '}',
      '.home-festivais-arrow{',
      '  position:absolute;',
      '  top:50%;',
      '  transform:translateY(-50%);',
      '  width:36px;',
      '  height:36px;',
      '  border-radius:50%;',
      '  border:1px solid rgba(245,158,11,.4);',
      '  background:#ffffff;',
      '  color:hsl(28,18%,15%);',
      '  font-size:20px;',
      '  font-weight:700;',
      '  line-height:1;',
      '  cursor:pointer;',
      '  z-index:2;',
      '  box-shadow:0 2px 8px rgba(0,0,0,.1);',
      '  transition:background .2s ease,transform .2s ease',
      '}',
      '.home-festivais-arrow:hover{',
      '  background:hsl(45,96%,58%);',
      '  color:hsl(28,18%,10%)',
      '}',
      '.home-festivais-arrow-prev{ left:8px }',
      '.home-festivais-arrow-next{ right:8px }',
      '.home-festivais-dots{',
      '  display:flex;',
      '  justify-content:center;',
      '  gap:6px;',
      '  margin-bottom:14px',
      '}',
      '.home-festivais-dot{',
      '  width:7px;',
      '  height:7px;',
      '  border-radius:50%;',
      '  border:0;',
      '  padding:0;',
      '  background:rgba(28,18,15,.2);',
      '  cursor:pointer;',
      '  transition:background .2s ease,transform .2s ease',
      '}',
      '.home-festivais-dot.is-active{',
      '  background:hsl(45,96%,58%);',
      '  transform:scale(1.3)',
      '}',
      '.home-festivais-cta{',
      '  display:inline-block;',
      '  margin-top:6px;',
      '  padding:11px 22px;',
      '  background:hsl(45,96%,58%);',
      '  color:hsl(28,18%,10%);',
      '  border-radius:999px;',
      '  font-weight:700;',
      '  font-size:13px;',
      '  text-decoration:none;',
      '  letter-spacing:.02em;',
      '  transition:transform .2s ease,box-shadow .2s ease;',
      '  box-shadow:0 4px 12px rgba(245,158,11,.3)',
      '}',
      '.home-festivais-cta:hover{',
      '  transform:translateY(-2px);',
      '  box-shadow:0 8px 22px rgba(245,158,11,.45)',
      '}',
      '@media(max-width:768px){',
      '  .home-festivais-strip{',
      '    padding:24px 0 22px',
      '  }',
      '  .home-festivais-inner{',
      '    padding:0 16px',
      '  }',
      '  .home-festivais-track{',
      '    gap:14px;',
      '    padding:6px 4px',
      '  }',
      '  .home-festivais-card{',
      '    width:80px;',
      '    height:80px;',
      '    padding:6px',
      '  }',
      '  .home-festivais-card.is-premio{',
      '    width:92px;',
      '    height:92px',
      '  }',
      '  .home-festivais-arrow{',
      '    display:none',
      '  }',
      '  .home-festivais-cta{',
      '    font-size:12px;',
      '    padding:10px 18px',
      '  }',
      '  .home-festivais-dots{',
      '    gap:5px',
      '  }',
      '  .home-festivais-dot{',
      '    width:6px;',
      '    height:6px',
      '  }',
      '}',
      '@media(prefers-reduced-motion:reduce){',
      '  .home-festivais-card,.home-festivais-cta,.home-festivais-dot,.home-festivais-track{',
      '    transition:none',
      '  }',
      '  .home-festivais-track{',
      '    scroll-behavior:auto',
      '  }',
      '  .home-festivais-card:hover{',
      '    transform:none',
      '  }',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function tryIntegrate() {
    var root = document.getElementById('root');
    if (!root) return false;

    // Estrategia: insertar ANTES de la seccion que contiene
    // "Manifesto Gondwana". En el bundle actual, ese texto
    // vive en un eyebrow (no en h2), asi que buscamos en
    // cualquier nodo que contenga la palabra 'manifesto'.
    var manifestoSection = null;
    var candidates = root.querySelectorAll('main *');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      // Solo elementos con texto directo corto (eyebrow/label)
      if (el.children.length > 0) continue;
      var txt = (el.textContent || '').toLowerCase().trim();
      if (txt === 'manifesto gondwana' || txt.indexOf('manifesto') === 0) {
        manifestoSection = el.closest('section') || el.parentElement;
        break;
      }
    }

    // Fallback: buscar en h2/h3 por si en otra version
    // el texto vive ahi
    if (!manifestoSection) {
      var headings = root.querySelectorAll('h2, h3');
      for (var j = 0; j < headings.length; j++) {
        var h = headings[j];
        var htxt = (h.textContent || '').toLowerCase();
        if (htxt.indexOf('manifesto') !== -1) {
          manifestoSection = h.closest('section') || h.parentElement;
          break;
        }
      }
    }

    if (manifestoSection && manifestoSection.parentNode) {
      var snip = buildSnip();
      // Insertar ANTES del Manifiesto, no despues
      manifestoSection.parentNode.insertBefore(snip, manifestoSection);
      return true;
    }

    return false;
  }

  function wireInteractions(snip) {
    var track = snip.querySelector('.home-festivais-track');
    var prevBtn = snip.querySelector('.home-festivais-arrow-prev');
    var nextBtn = snip.querySelector('.home-festivais-arrow-next');
    var dots = snip.querySelectorAll('.home-festivais-dot');
    var cards = snip.querySelectorAll('.home-festivais-card');

    function getCardStep() {
      if (!cards.length) return 120;
      var first = cards[0];
      var second = cards[1] || first;
      return second.offsetLeft - first.offsetLeft || first.offsetWidth + 20;
    }

    function scrollByCards(dir) {
      var step = getCardStep();
      track.scrollBy({ left: dir * step, behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { scrollByCards(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { scrollByCards(1); });

    function updateActiveDot() {
      if (!track || !dots.length) return;
      var scrollLeft = track.scrollLeft;
      var trackWidth = track.clientWidth;
      var center = scrollLeft + trackWidth / 2;
      var activeIdx = 0;
      var minDist = Infinity;
      cards.forEach(function(c, i) {
        var cardCenter = c.offsetLeft + c.offsetWidth / 2;
        var dist = Math.abs(cardCenter - center);
        if (dist < minDist) {
          minDist = dist;
          activeIdx = i;
        }
      });
      dots.forEach(function(d, i) {
        d.classList.toggle('is-active', i === activeIdx);
      });
    }

    if (track) {
      var scrollRaf = null;
      track.addEventListener('scroll', function() {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(function() {
          updateActiveDot();
          scrollRaf = null;
        });
      });
      updateActiveDot();
    }

    dots.forEach(function(dot, idx) {
      dot.addEventListener('click', function() {
        var target = cards[idx];
        if (target) {
          track.scrollTo({
            left: target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2,
            behavior: 'smooth'
          });
        }
      });
    });

    // Autoplay sutil: avanza 1 card cada 5s, pausa en hover/focus
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      var autoplayInterval = null;
      function startAutoplay() {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(function() {
          var maxScroll = track.scrollWidth - track.clientWidth;
          if (track.scrollLeft >= maxScroll - 5) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollByCards(1);
          }
        }, 5000);
      }
      function stopAutoplay() {
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
        }
      }
      snip.addEventListener('mouseenter', stopAutoplay);
      snip.addEventListener('mouseleave', startAutoplay);
      snip.addEventListener('focusin', stopAutoplay);
      snip.addEventListener('focusout', startAutoplay);
      startAutoplay();
    }
  }

  function fallbackInject() {
    var root = document.getElementById('root');
    if (!root || root.children.length === 0) {
      injectCSS();
      var snip = buildSnip();
      document.body.appendChild(snip);
      wireInteractions(snip);
    }
  }

  function init() {
    injectCSS();

    if (tryIntegrate()) {
      var snip = document.querySelector('.home-festivais-strip');
      if (snip) wireInteractions(snip);
      return;
    }

    fallbackInject();
  }

  // Esperar a React renderizar antes de buscar el Manifiesto
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      setTimeout(fn, 0);
    }
  }

  // Tentar varias veces por si React renderiza tarde
  ready(function() {
    var attempts = 0;
    function attempt() {
      attempts++;
      if (tryIntegrate()) {
        var snip = document.querySelector('.home-festivais-strip');
        if (snip) wireInteractions(snip);
        return;
      }
      if (attempts < 8) {
        setTimeout(attempt, 600);
      } else {
        fallbackInject();
      }
    }
    attempt();
  });
})();