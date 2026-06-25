/**
 * cards-cta-overlay.js
 * Roda apos o bundle principal. Adiciona hrefs aos 3 CTAs
 * dos cards de publico.
 *
 * v2 (2026-06-24): texto do card "Para empresas" mudou
 * - Antes: 'Sinergias para colaboradores'
 * - Agora: match em 'Patrocine cultura' (overlay tambem tenta match em 'Sinergias' para retrocompat)
 */
(function () {
  'use strict';

  var MAP = [
    { match: 'solu\u00e7\u00f5es educativas', alt: 'material educativo', href: '/servicos/', key: 'educator' },
    { match: 'Falar sobre parceria',         alt: 'propostas B2B',     href: '/contato/',  key: 'company'   },
    { match: 'Apoiar agora',                 alt: 'comunidade aberta', href: '/comunidade/', key: 'supporter' }
  ];

  function applyOverlay() {
    var found = Array.from(document.querySelectorAll('*')).filter(function (el) {
      var text = (el.textContent || '').trim();
      var direct = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3;
      return direct && MAP.some(function (m) {
        return text.indexOf(m.match) >= 0 || (m.alt && text.indexOf(m.alt) >= 0);
      });
    });

    found.forEach(function (el) {
      var text = (el.textContent || '').trim();
      var entry = MAP.find(function (m) {
        return text.indexOf(m.match) >= 0 || (m.alt && text.indexOf(m.alt) >= 0);
      });
      if (!entry) return;
      if (el.closest('a[data-overlay-cta]')) return;

      var clickable = el.closest('a, button') || el;
      if (clickable.tagName === 'A') {
        clickable.setAttribute('href', entry.href);
      } else {
        var a = document.createElement('a');
        a.href = entry.href;
        a.setAttribute('data-overlay-cta', entry.key);
        while (clickable.firstChild) a.appendChild(clickable.firstChild);
        clickable.parentNode.replaceChild(a, clickable);
      }
      var anchor = clickable.tagName === 'A' ? clickable : a;
      anchor.setAttribute('data-overlay-cta', entry.key);
    });
  }

  function boot() {
    var tries = 0;
    function tick() {
      tries++;
      applyOverlay();
      if (tries < 30) setTimeout(tick, 200);
    }
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
