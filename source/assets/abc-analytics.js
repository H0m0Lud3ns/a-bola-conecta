(function () {
  var measurementId = 'G-CB5CLYNX8H';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (!document.querySelector('script[data-abc-ga4-loader]')) {
    var loader = document.createElement('script');
    loader.async = true;
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    loader.setAttribute('data-abc-ga4-loader', 'true');
    document.head.appendChild(loader);
  }

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true,
    page_title: document.title,
    page_path: window.location.pathname + window.location.hash
  });

  function track(eventName, params) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({
      site_section: 'a_bola_conecta',
      page_path: window.location.pathname + window.location.hash,
      page_title: document.title
    }, params || {}));
  }

  function closestLink(target) {
    return target && target.closest ? target.closest('a, button') : null;
  }

  document.addEventListener('click', function (event) {
    var el = closestLink(event.target);
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    var path = href.split('?')[0].split('#')[0];
    var eventParams = { link_url: href, link_text: text };

    if (/copa-2026\/baixar|download|guia|pdf/i.test(href + ' ' + text)) {
      track('guide_download_click', eventParams);
    }

    if (/copa-2026\/fichas|fichas online/i.test(href + ' ' + text)) {
      track('copa_fichas_click', eventParams);
    }

    if (/apoie|pix|apoiar|support/i.test(href + ' ' + text)) {
      track('support_click', eventParams);
    }

    if (/camisa-abya-yala|camisa|manto|loja|shirt/i.test(href + ' ' + text)) {
      track('shirt_interest_click', eventParams);
    }

    if (/patrocinio|patrocinar|parceir|sponsor|cota/i.test(href + ' ' + text)) {
      track('sponsor_click', eventParams);
    }

    if (/wa\.me|whatsapp|mailto:|contato|contact/i.test(href + ' ' + text)) {
      track('contact_click', eventParams);
    }

    if (path && path !== href) {
      track('internal_link_click', eventParams);
    }
  }, true);

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.tagName || form.tagName.toLowerCase() !== 'form') return;
    track('lead_submit', {
      form_id: form.getAttribute('id') || form.getAttribute('data-form-id') || form.getAttribute('name') || 'unknown',
      lead_type: (form.querySelector('[name="lead_type"]') || {}).value || form.getAttribute('data-lead-type') || 'unknown'
    });
  }, true);



  window.addEventListener('hashchange', function () {
    track('hash_navigation', { hash: window.location.hash || '#inicio' });
  });

  var seenSections = new Set();
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || !entry.target.id || seenSections.has(entry.target.id)) return;
        seenSections.add(entry.target.id);
        track('section_view', { section_id: entry.target.id });
      });
    }, { threshold: 0.45 });
    document.querySelectorAll('main section[id]').forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  window.abcTrack = track;
})();
