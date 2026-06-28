// Keeps legacy cached CTA buttons aligned without touching the main navigation.
// Forza full-page navigation para rutas que NO estan registradas en React Router
// (Copa 2026, Camisa Abya Yala, Documentario, fichas individuales, etc.).
// Sin esto, React Router intercepta el click, hace pushState() y renderiza
// el componente 404 porque esas rutas no existen en el bundle SPA.
// Version 2026-06-27 - recuperada do repo de Ivan + ampliada com /documentario
// e outras rotas HTML estatico.
(function () {
  var legacyTarget = '/copa-2026/#contribuir';
  var legacyPattern = /\/(a-bola-conecta\/)?(comunidade|apoie)(\/|#|\?|$)/;

  // Rutas que existem como HTML estatico servido pela Vercel, mas NAO estao
  // registradas no React Router. Quando o usuario clica num link do menu, o
  // React Router intercepta, faz pushState() e renderiza o catch-all 404.
  // Forcamos window.location.assign() para bypass do Router e fazer GET real
  // do arquivo HTML estatico. Assim o SW serve a versao nova (cache miss).
  var staticRoutes = {
    documentario: /^\/documentario\/?$/,
    copa2026: /^\/copa-2026\/?$/,
    copa2026Sub: /^\/copa-2026\/[^/]+\/?$/,
    copa2026Fichas: /^\/copa-2026\/fichas\/?$/,
    copa2026Ficha: /^\/copa-2026\/fichas\/[^/]+\/?$/,
    camisaAbyaYala: /^\/camisa-abya-yala\/?$/,
    festivais: /^\/festivais\/?$/,
    loja: /^\/loja\/?$/,
    metodologia: /^\/metodologia\/?$/,
    imprensa: /^\/imprensa\/?$/,
    equipe: /^\/equipe\/?$/,
    sobre: /^\/sobre\/?$/,
    apoie: /^\/apoie\/?$/,
    blog: /^\/blog\/?$/,
    blogPost: /^\/blog\/[^/]+\/?$/,
    contato: /^\/contato\/?$/,
    comunidade: /^\/comunidade\/?$/,
    mapaDoSite: /^\/mapa-do-site\/?$/,
    faq: /^\/faq\/?$/,
    servicos: /^\/servicos\/?$/,
    gondwanaTimeEducacao: /^\/gondwana-time-educacao(\/.*)?$/,
    gondwanaFc: /^\/gondwana-fc(\/.*)?$/,
  };

  function isLegacyUrl(value) {
    return typeof value === 'string' && legacyPattern.test(value);
  }

  function isStaticRoute(value) {
    if (typeof value !== 'string') return false;
    var path = value.split('?')[0].split('#')[0];
    if (path === '/' || path === '') return false;
    for (var key in staticRoutes) {
      if (staticRoutes[key].test(path)) return true;
    }
    return false;
  }

  function normalizeHref(link) {
    var href = link.getAttribute('href') || link.href;
    if (!isLegacyUrl(href)) return href;
    return legacyTarget;
  }

  function rewriteLegacyLinks(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('a[href]').forEach(function (link) {
      var currentHref = link.getAttribute('href');
      var nextHref = normalizeHref(link);
      if (nextHref !== currentHref) link.setAttribute('href', nextHref);
    });
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented) return;
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    var href = link.getAttribute('href') || link.href || '';
    if (!href) return;

    // Rutas legacy /comunidade/, /apoie/ -> redirigir a /copa-2026/#contribuir
    if (isLegacyUrl(href)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.location.assign(legacyTarget);
      return;
    }

    // Rutas HTML estatico no registradas en React Router -> forzar full nav
    if (isStaticRoute(href)) {
      // Dejar pasar modifier keys (cmd/ctrl/shift/meta) para abrir en nueva pestana
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      window.location.assign(href);
      return;
    }
  }, true);

  function boot() {
    rewriteLegacyLinks(document);
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) rewriteLegacyLinks(node);
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    // React re-renderiza apos boot; rodar varreduras extras em janelas criticas
    [400, 800, 1500, 2500, 4000, 6000, 9000, 12000].forEach(function (delay) {
      setTimeout(function () { rewriteLegacyLinks(document); }, delay);
    });
    // Quando o header aparecer, escutar especificamente
    var checkHeader = setInterval(function () {
      var h = document.querySelector('header');
      if (h) {
        rewriteLegacyLinks(h);
      } else if (document.readyState === 'complete' && performance.now() > 15000) {
        clearInterval(checkHeader);
      }
    }, 500);
    setTimeout(function () { clearInterval(checkHeader); }, 20000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();