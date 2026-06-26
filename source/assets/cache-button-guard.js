// Keeps legacy cached CTA buttons aligned without touching the main navigation.
(function () {
  var target = '/copa-2026/#contribuir';
  var legacyPattern = /\/(a-bola-conecta\/)?(comunidade|apoie)(\/|#|\?|$)/;

  function isLegacyUrl(value) {
    return typeof value === 'string' && legacyPattern.test(value);
  }

  function isNavigationLink(link) {
    return !!(link && link.closest && link.closest('header, nav'));
  }

  function normalizeHref(link) {
    var href = link.getAttribute('href') || link.href;
    if (!isLegacyUrl(href)) return href;
    return target;
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
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link || !isLegacyUrl(link.getAttribute('href') || link.href)) return;
    event.preventDefault();
    window.location.assign(target);
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
    // React re-renderiza após boot; rodar varreduras extras em janelas críticas
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
