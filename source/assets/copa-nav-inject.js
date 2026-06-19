// Inject Copa 2026 nav link into React SPA menus + meta anti-cache
(function () {
  function injectCopaNav() {
    var navs = document.querySelectorAll('header nav');
    navs.forEach(function (nav) {
      if (nav.querySelector('a[href*="copa-2026"]')) return;
      var cont = nav.querySelector('a[href*="/contato"]');
      var a = document.createElement('a');
      a.href = '/a-bola-conecta/copa-2026/';
      a.textContent = 'Copa 2026';
      a.style.cssText =
        'order:99!important;color:#121611!important;background:#d9ff6f!important;' +
        'border:1px solid rgba(217,255,111,.75)!important;' +
        'box-shadow:0 0 22px rgba(217,255,111,.28)!important;' +
        'font-weight:900!important;border-radius:999px;' +
        'padding:8px 14px!important;text-decoration:none!important;' +
        'font-size:14px!important;display:inline-flex!important;align-items:center!important';
      if (cont) {
        cont.parentNode.insertBefore(a, cont.nextSibling);
      } else {
        nav.appendChild(a);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(injectCopaNav, 800);
    });
  } else {
    setTimeout(injectCopaNav, 800);
  }
  setTimeout(injectCopaNav, 2000);
  setTimeout(injectCopaNav, 3500);
})();
