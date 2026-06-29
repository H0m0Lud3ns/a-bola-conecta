/*!
 * og-route-swap.js
 * Troca og:image / og:title / og:description / og:url conforme a rota do SPA React.
 * Cobrir rotas atuais do site A Bola Conecta. O card default ja esta no <head>
 * via index.html; este script so atualiza quando a URL casa com uma rota conhecida.
 */
(function () {
  'use strict';

  var BASE = 'https://www.abolaconecta.com.br';
  var ASSETS = BASE + '/assets';

  // Mapeamento rota -> { titulo, descricao, imagem, url }
  var ROUTES = {
    '/metodologia': {
      title: 'Metodologia ABC | A Bola Conecta',
      description: 'Educacao, cultura e esporte pelo futebol. A metodologia pedagogica do Time da Educacao Gondwana FC.',
      image: ASSETS + '/og-card-metodologia.png',
      url: BASE + '/metodologia'
    },
    '/servicos': {
      title: 'Servicos | A Bola Conecta',
      description: 'Formacao, consultoria e producao audiovisual esportiva para escolas, federacoes, marcas e projetos sociais.',
      image: ASSETS + '/og-card-servicos.png',
      url: BASE + '/servicos'
    },
    '/documentario': {
      title: 'Documentario A Bola Conta Historia | A Bola Conecta',
      description: 'Serie audiovisual no Museu do Futebol - Sao Paulo. Em producao.',
      image: ASSETS + '/og-card-documentario.png',
      url: BASE + '/documentario'
    },
    '/copa-2026': {
      title: 'Copa 2026 | Camisa pedagogica Time da Educacao',
      description: 'O futebol encontra a educacao. Camisa pedagogica do Time da Educacao Gondwana FC - edicao especial.',
      image: ASSETS + '/og-card-copa-2026.png',
      url: BASE + '/copa-2026'
    },
    '/sobre': {
      title: 'Sobre | A Bola Conecta',
      description: 'O projeto A Bola Conecta e a metodologia ABC que conectam futebol, ancestralidade africana e educacao.',
      image: ASSETS + '/og-card-metodologia.png',
      url: BASE + '/sobre'
    },
    '/contato': {
      title: 'Contato | A Bola Conecta',
      description: 'Fale com a equipe do A Bola Conecta e do Gondwana FC - Time da Educacao.',
      image: ASSETS + '/og-card-servicos.png',
      url: BASE + '/contato'
    },
    '/blog': {
      title: 'Blog | A Bola Conecta',
      description: 'Artigos sobre futebol, educacao, ancestralidade africana e cultura afro-brasileira.',
      image: ASSETS + '/og-card-metodologia.png',
      url: BASE + '/blog'
    }
  };

  function setMeta(prop, content) {
    if (!content) return;
    var sel = 'meta[property="' + prop + '"]';
    var el = document.head.querySelector(sel);
    if (el) {
      el.setAttribute('content', content);
    } else {
      var m = document.createElement('meta');
      m.setAttribute('property', prop);
      m.setAttribute('content', content);
      document.head.appendChild(m);
    }
  }

  function apply(route) {
    var data = ROUTES[route];
    if (!data) return;
    setMeta('og:title', data.title);
    setMeta('og:description', data.description);
    setMeta('og:image', data.image);
    setMeta('og:url', data.url);
    setMeta('og:image:alt', data.title);
    // Twitter
    var twTitle = document.head.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', data.title);
    var twDesc = document.head.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', data.description);
    var twImg = document.head.querySelector('meta[name="twitter:image"]');
    if (twImg) twImg.setAttribute('content', data.image);
    // Title da aba
    document.title = data.title;
  }

  function currentRoute() {
    var p = window.location.pathname || '/';
    // normaliza trailing slash
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }

  function tick() {
    apply(currentRoute());
  }

  // SPA: reage a navegacao do React Router
  var _ps = history.pushState;
  history.pushState = function () {
    var r = _ps.apply(this, arguments);
    window.dispatchEvent(new Event('locationchange'));
    return r;
  };
  var _rs = history.replaceState;
  history.replaceState = function () {
    var r = _rs.apply(this, arguments);
    window.dispatchEvent(new Event('locationchange'));
    return r;
  };
  window.addEventListener('popstate', function () {
    window.dispatchEvent(new Event('locationchange'));
  });
  window.addEventListener('locationchange', tick);

  // Primeiro tick depois do React montar (para nao pisar antes do <head> estar pronto)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick);
  } else {
    // espera 1 frame para o React Router comecar a controlar a URL
    setTimeout(tick, 50);
  }
})();