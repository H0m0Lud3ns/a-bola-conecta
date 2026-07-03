/* pix-copy.js
   Botao com class="pix-trigger" abre um dropdown com a chave PIX + botao copiar.
   Sem QR code, sem pagina nova. 1 clique resolve.
   Para usar: adicionar class="pix-trigger" em qualquer botao/elemento clicavel.
   Autor: Agente Sebas-Acevedo-AI | 2026-07-02
*/

(function () {
  'use strict';

  var PIX_KEY = '62.085.700/0001-83';
  var CONTEXT_HTML = 'Sua contribuição sustenta o <strong>documentário</strong>, a <strong>Metodologia ABC</strong>, as <strong>Fichas da Copa 2026</strong> e a circulação educativa de forma aberta, oportunizando o conhecimento nos territórios. <strong>Da Silva &amp; Vásquez Formação e Consultoria</strong> · CNPJ ' + PIX_KEY + '.';

  var LEGAL_TEXT = 'Pessoa jurídica. Contribuição com nota fiscal e recibo formal.';

  var PANEL_ID = 'pix-panel-global';

  function buildPanel() {
    var panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.className = 'pix-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chave PIX para contribuicao');
    panel.innerHTML =
      '<button type="button" class="pix-panel__close" aria-label="Fechar">&times;</button>' +
      '<p class="pix-panel__context">' + CONTEXT_HTML + '</p>' +
      '<div class="pix-panel__key-label">Chave PIX (CNPJ)</div>' +
      '<div class="pix-panel__key-wrap">' +
        '<input class="pix-panel__key" type="text" value="' + PIX_KEY + '" readonly aria-label="Chave PIX" />' +
        '<button type="button" class="pix-panel__copy" data-copy>Copiar</button>' +
      '</div>' +
      '<p class="pix-panel__legal">' + LEGAL_TEXT + '</p>';
    document.body.appendChild(panel);
    return panel;
  }

  function positionPanel(panel, trigger) {
    var rect = trigger.getBoundingClientRect();
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    var panelRect = panel.getBoundingClientRect();
    var top = rect.bottom + scrollY + 8;
    var left = rect.right + scrollX - panelRect.width;
    // Se nao cabe a direita do botao, centraliza
    if (left < 8) {
      left = Math.max(8, rect.left + scrollX - 16);
    }
    // Se passar do viewport, ajusta
    var maxLeft = scrollX + window.innerWidth - panelRect.width - 8;
    if (left > maxLeft) left = maxLeft;
    // Se ainda passar por baixo do viewport, abre pra cima
    if (top + panelRect.height > scrollY + window.innerHeight - 8) {
      top = rect.top + scrollY - panelRect.height - 8;
    }
    panel.style.top = top + 'px';
    panel.style.left = left + 'px';
  }

  var openTrigger = null;

  function close() {
    var panel = document.getElementById(PANEL_ID);
    if (panel) {
      panel.classList.remove('is-open');
      var copyBtn = panel.querySelector('[data-copy]');
      if (copyBtn) {
        copyBtn.classList.remove('is-copied');
        copyBtn.textContent = 'Copiar';
      }
    }
    openTrigger = null;
  }

  function open(trigger) {
    var panel = document.getElementById(PANEL_ID) || buildPanel();
    if (openTrigger && openTrigger !== trigger) close();
    panel.classList.add('is-open');
    positionPanel(panel, trigger);
    openTrigger = trigger;
  }

  function copyKey(panel) {
    var input = panel.querySelector('.pix-panel__key');
    var btn = panel.querySelector('[data-copy]');
    var value = input ? input.value : PIX_KEY;

    function fallback() {
      try {
        input.select();
        input.setSelectionRange(0, value.length);
        var ok = document.execCommand('copy');
        if (ok) showCopied(btn);
        else showError(btn);
      } catch (e) {
        showError(btn);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(
        function () { showCopied(btn); },
        function () { fallback(); }
      );
    } else {
      fallback();
    }
  }

  function showCopied(btn) {
    if (!btn) return;
    btn.classList.add('is-copied');
    btn.textContent = 'Copiado';
    setTimeout(function () {
      btn.classList.remove('is-copied');
      btn.textContent = 'Copiar';
    }, 2200);
  }

  function showError(btn) {
    if (!btn) return;
    btn.textContent = 'Selecione';
    setTimeout(function () {
      btn.textContent = 'Copiar';
    }, 2200);
  }

  // Setup delegado
  function setup() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.pix-trigger');
      var panel = document.getElementById(PANEL_ID);
      if (trigger) {
        e.preventDefault();
        if (openTrigger === trigger && panel && panel.classList.contains('is-open')) {
          close();
        } else {
          open(trigger);
        }
        return;
      }
      if (panel && panel.classList.contains('is-open')) {
        var insidePanel = e.target.closest('#' + PANEL_ID);
        if (!insidePanel) close();
      }
    }, true);

    // Captura cliques dentro do panel (copy, close)
    document.addEventListener('click', function (e) {
      var panel = document.getElementById(PANEL_ID);
      if (!panel) return;
      if (e.target.closest('[data-copy]')) {
        e.preventDefault();
        e.stopPropagation();
        copyKey(panel);
      } else if (e.target.closest('.pix-panel__close')) {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
    });

    // ESC fecha
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    // Reposiciona em scroll/resize
    window.addEventListener('scroll', function () {
      var panel = document.getElementById(PANEL_ID);
      if (panel && panel.classList.contains('is-open') && openTrigger) {
        positionPanel(panel, openTrigger);
      }
    }, { passive: true });
    window.addEventListener('resize', function () {
      var panel = document.getElementById(PANEL_ID);
      if (panel && panel.classList.contains('is-open') && openTrigger) {
        positionPanel(panel, openTrigger);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();