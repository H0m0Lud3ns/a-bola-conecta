/**
 * A Bola Conecta - Placements de marketing
 * Se inyecta después de que React renderiza el sitio
 * Agrega: Top Banner, Instagram CTA, Editorial Rectangle, Support Rail, End Cards, Mobile Sticky
 */
(function () {
  'use strict';

  var ASSETS = '/a-bola-conecta/assets/';
  var COMUNIDADE_URL = '/a-bola-conecta/comunidade/';

  // Esperar a que React renderice
  function waitForReact(callback) {
    if (document.querySelector('#root main')) {
      callback();
    } else {
      setTimeout(function () { waitForReact(callback); }, 300);
    }
  }

  function createEl(tag, className, html) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
  }

  // === PLACEMENT: Top Banner ===
  function injectTopBanner() {
    var main = document.querySelector('#root main');
    if (!main || document.getElementById('abc-top-banner')) return;

    var section = createEl('section', 'abc-placement abc-top-banner-wrap', '');
    section.id = 'abc-top-banner';

    section.innerHTML =
      '<div class="abc-p-label"><span>Exibição do filme</span></div>' +
      '<div class="abc-top-banner">' +
        '<img src="' + ASSETS + 'cartaz-digital-gondwana-a-bola-conecta.jpg" alt="Cartaz A Bola Conecta">' +
        '<div class="abc-top-banner-copy">' +
          '<h3>O filme já está em campo.</h3>' +
          '<p>Assista A Bola Conecta e ajude uma história de futebol, África e Brasil a circular.</p>' +
          '<a class="abc-btn abc-btn-gold" href="' + COMUNIDADE_URL + '">Ver filme</a>' +
        '</div>' +
      '</div>';

    // Insertar después del primer section (hero)
    var firstSection = main.querySelector('section');
    if (firstSection && firstSection.nextSibling) {
      main.insertBefore(section, firstSection.nextSibling);
    } else {
      main.appendChild(section);
    }
  }

  // === PLACEMENT: Instagram CTA ===
  function injectInstagramCTA() {
    var main = document.querySelector('#root main');
    if (!main || document.getElementById('abc-ig-cta')) return;

    var existingIg = document.querySelector('a[aria-label="Instagram"]');
    if (existingIg) {
      // Mejorar el botón existente
      existingIg.style.cssText = 'background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)!important;box-shadow:0 4px 24px rgba(131,58,180,.45)!important;transform:scale(1.08);border:none!important;color:#fff!important';
      existingIg.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.15)';
        this.style.boxShadow = '0 8px 32px rgba(131,58,180,.6)!important';
      });
      existingIg.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1.08)';
        this.style.boxShadow = '0 4px 24px rgba(131,58,180,.45)!important';
      });
    }

    // Crear sección CTA Instagram después del hero
    var section = createEl('section', 'abc-placement abc-ig-section', '');
    section.id = 'abc-ig-cta';

    section.innerHTML =
      '<div class="abc-ig-card">' +
        '<div class="abc-ig-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>' +
            '<circle cx="12" cy="12" r="5"/>' +
            '<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>' +
          '</svg>' +
        '</div>' +
        '<div class="abc-ig-copy">' +
          '<span class="abc-ig-tag">Gondwana FC - Time da Educação</span>' +
          '<h2>@gondwana.fc</h2>' +
          '<p>Siga o Time da Educação para acompanhar a produção, lançamentos de fichas, exibições e behind the scenes.</p>' +
          '<a class="abc-btn abc-btn-gold" href="https://instagram.com/gondwana.fc" target="_blank" rel="noopener noreferrer">Seguir no Instagram</a>' +
        '</div>' +
      '</div>';

    // Buscar la sección de documentario para insertar después
    var sections = main.querySelectorAll('section');
    var inserted = false;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].querySelector('iframe[src*="youtube"]')) {
        if (sections[i].nextSibling) {
          main.insertBefore(section, sections[i].nextSibling);
        } else {
          main.appendChild(section);
        }
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      var hero = main.querySelector('section');
      if (hero && hero.nextSibling) {
        main.insertBefore(section, hero.nextSibling);
      }
    }
  }

  // === PLACEMENT: Mobile Sticky ===
  function injectMobileSticky() {
    if (document.getElementById('abc-mobile-sticky')) return;
    if (window.innerWidth > 700) return; // Solo mobile

    var sticky = createEl('div', 'abc-mobile-sticky', '');
    sticky.id = 'abc-mobile-sticky';

    var texts = [
      ['Assista A Bola Conecta', 'Ver filme'],
      ['Leve para sua escola', 'Propor'],
      ['Apoie o cinema independente', 'Apoiar']
    ];

    sticky.innerHTML =
      '<strong id="abc-sticky-text">' + texts[0][0] + '</strong>' +
      '<a id="abc-sticky-cta" href="' + COMUNIDADE_URL + '">' + texts[0][1] + '</a>';

    document.body.appendChild(sticky);

    var idx = 0;
    setInterval(function () {
      idx = (idx + 1) % texts.length;
      var t = document.getElementById('abc-sticky-text');
      var c = document.getElementById('abc-sticky-cta');
      if (t) t.textContent = texts[idx][0];
      if (c) c.textContent = texts[idx][1];
    }, 3000);
  }

  // === Init ===
  waitForReact(function () {
    injectTopBanner();
    injectInstagramCTA();
    setTimeout(injectMobileSticky, 2000);

    // Re-inyectar si React re-renderiza (SPA navigation)
    var lastUrl = location.href;
    new MutationObserver(function () {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(function () {
          injectTopBanner();
          injectInstagramCTA();
          injectMobileSticky();
        }, 500);
      }
    }).observe(document, { subtree: true, childList: true });
  });
})();
