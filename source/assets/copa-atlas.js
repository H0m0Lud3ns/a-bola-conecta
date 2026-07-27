(() => {
  const root = document.getElementById('copaAtlasMap');
  const card = document.getElementById('copaAtlasCard');
  if (!root || !card || !window.d3 || !window.topojson) return;

  const dataUrl = root.dataset.fichasUrl || '/copa-2026/assets/fichas-map.json';
  const mapUrl = root.dataset.mapUrl || 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
  const searchInput = document.getElementById('atlasCountrySearch');
  const searchResults = document.getElementById('atlasSearchResults');
  const filterButtons = Array.from(document.querySelectorAll('[data-atlas-filter]'));
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const countryId = (value) => String(value || '').padStart(3, '0');
  const state = { fichas: [], world: null, filter: 'Todos', selectedSlug: null, zoomTransform: null, lockedSlug: null };
  const zoomLimits = [1, 7];

  const isAmerica = (item) => {
    const region = normalize(item.region);
    return region.includes('america') || region.includes('caribe');
  };

  const isAbyaYala = (item) => isAmerica(item);

  const isLatinAmerica = (item) => {
    const name = normalize(item.name);
    const region = normalize(item.region);
    return region.includes('america do sul')
      || region.includes('america central')
      || region.includes('caribe')
      || name === 'mexico';
  };

  const isCentralAméricaAndCaribbean = (item) => {
    const region = normalize(item.region);
    return region.includes('america central') || region.includes('caribe');
  };

  const isGondwanaTerritory = (item) => {
    const region = normalize(item.region);
    return region.includes('africa')
      || region.includes('america do sul')
      || region.includes('oceania')
      || region.includes('peninsula arabica')
      || region.includes('mesopotamia');
  };

  const matchesFilter = (item) => {
    if (!item || state.filter === 'Todos') return true;
    if (state.filter === 'Abya Yala') return isAbyaYala(item);
    if (state.filter === 'América Latina') return isLatinAmerica(item);
    if (state.filter === 'América Central e Caribe') return isCentralAméricaAndCaribbean(item);
    if (state.filter === 'Gondwana') return isGondwanaTerritory(item);
    return normalize(item.region).includes(normalize(state.filter));
  };

  const setText = (selector, value) => {
    const el = card.querySelector(selector);
    if (el) el.textContent = value || '';
  };

  const activate = (item, options = {}) => {
    if (!item) return;
    if (options.lock) state.lockedSlug = item.slug;
    setText('[data-atlas-name]', item.name);
    setText('[data-atlas-region]', item.region);
    setText('[data-atlas-desc]', item.desc);
    setText('[data-atlas-question]', item.question);
    setText('[data-atlas-status]', item.status || 'Ficha ativa');
    const flag = card.querySelector('[data-atlas-flag]');
    if (flag && item.flagCode) {
      flag.src = `https://flagcdn.com/w80/${item.flagCode}.png`;
      flag.srcset = `https://flagcdn.com/w160/${item.flagCode}.png 2x`;
      flag.alt = `Bandeira de ${item.name}`;
    }
    if (searchResults) searchResults.classList.remove('is-open');
    const cta = card.querySelector('[data-atlas-cta]');
    if (cta) {
      cta.textContent = `Ver ficha de ${item.name}`;
      cta.href = `/copa-2026/fichas/${item.slug}`;
    }
    state.selectedSlug = item.slug;
    root.querySelectorAll('.atlas-pin').forEach((pin) => {
      pin.classList.toggle('is-selected', pin.dataset.slug === item.slug);
    });
  };

  const draw = () => {
    const { fichas, world } = state;
    if (!fichas.length || !world) return;
    root.innerHTML = '';
    root.classList.remove('is-zoomed', 'is-deep-zoom');
    const width = Math.max(root.clientWidth, 320);
    const height = Math.max(root.clientHeight, 360);
    const svg = d3.select(root).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Mapa mundial com marcadores das fichas da Copa 2026');

    const defs = svg.append('defs');
    const clipId = `atlasClip-${Math.round(Math.random() * 100000)}`;
    defs.append('clipPath').attr('id', clipId).append('rect').attr('width', width).attr('height', height);
    const gradient = defs.append('linearGradient').attr('id', 'atlasRouteGradient');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(244,190,50,0)');
    gradient.append('stop').attr('offset', '50%').attr('stop-color', 'rgba(244,190,50,.72)');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(244,190,50,0)');

    const zoomLayer = svg.append('g').attr('clip-path', `url(#${clipId})`);
    const mapLayer = zoomLayer.append('g').attr('class', 'atlas-zoom-layer');
    const projection = d3.geoNaturalEarth1().fitExtent([[18, 24], [width - 18, height - 34]], { type: 'Sphere' });
    const path = d3.geoPath(projection);
    const activeIds = new Set(fichas.map((d) => countryId(d.id)));
    const hotIds = new Set(fichas.filter((d) => d.hot).map((d) => countryId(d.id)));
    const byId = new Map(fichas.map((d) => [countryId(d.id), d]));
    const countries = topojson.feature(world, world.objects.countries).features;


    mapLayer.append('path').datum({ type: 'Sphere' }).attr('class', 'atlas-sphere').attr('d', path);
    mapLayer.append('path').datum(d3.geoGraticule10()).attr('class', 'atlas-graticule').attr('d', path);
    mapLayer.append('path')
      .datum({ type: 'LineString', coordinates: d3.range(-180, 181, 2).map((lon) => [lon, 0]) })
      .attr('class', 'atlas-equator-line')
      .attr('d', path);
    mapLayer.append('path')
      .datum({ type: 'LineString', coordinates: d3.range(-80, 81, 2).map((lat) => [0, lat]) })
      .attr('class', 'atlas-greenwich-line')
      .attr('d', path);
    const equatorPoint = projection([-165, 0]);
    const greenwichPoint = projection([0, -55]);
    if (equatorPoint) {
      mapLayer.append('text').attr('class', 'atlas-reference-label').attr('x', equatorPoint[0]).attr('y', equatorPoint[1] - 6).text('Equador 0°');
    }
    if (greenwichPoint) {
      mapLayer.append('text').attr('class', 'atlas-reference-label').attr('x', greenwichPoint[0] + 6).attr('y', greenwichPoint[1]).text('Greenwich 0°');
    }
    mapLayer.append('g').selectAll('path').data(countries).join('path')
      .attr('class', (d) => {
        const id = countryId(d.id);
        const item = byId.get(id);
        return `atlas-country ${activeIds.has(id) ? 'is-active' : ''} ${hotIds.has(id) ? 'is-hot' : ''} ${item && !matchesFilter(item) ? 'is-muted' : ''}`;
      })
      .attr('d', path)
      .on('pointerenter', (event, d) => {
        const item = byId.get(countryId(d.id));
        if (!item || state.lockedSlug) return;
        activate(item);
      })
      .on('click', (event, d) => {
        const item = byId.get(countryId(d.id));
        if (!item) return;
        activate(item, { lock: true });
      });

    const hint = document.createElement('div');
    hint.className = 'atlas-zoom-hint';
    hint.textContent = 'Use scroll ou pinça para aproximar. Arraste para explorar.';
    root.appendChild(hint);
    const reference = document.createElement('div');
    reference.className = 'atlas-reference';
    reference.innerHTML = '<span class="atlas-reference-note">Projeção Natural Earth 1. Grade geográfica em graus. A escala varia por latitude e zoom.</span>';
    root.appendChild(reference);
    const controls = document.createElement('div');
    controls.className = 'atlas-zoom-controls';
    controls.innerHTML = '<button type="button" data-zoom="in" aria-label="Aproximar mapa">+</button><button type="button" data-zoom="out" aria-label="Afastar mapa">-</button><button type="button" data-zoom="reset" aria-label="Resetar mapa">1x</button>';
    root.appendChild(controls);


    const pinsLayer = mapLayer.append('g').attr('class', 'atlas-pins-layer');
    const pins = pinsLayer.selectAll('g').data(fichas).join('g')
      .attr('class', (d) => `atlas-pin ${d.hot ? 'is-hot' : ''} ${matchesFilter(d) ? '' : 'is-muted'} ${state.selectedSlug === d.slug ? 'is-selected' : ''}`)
      .attr('data-slug', (d) => d.slug)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) => `Ver resumo da ficha ${d.name}`)
      .attr('transform', (d) => `translate(${projection([d.lon, d.lat])})`)
      .on('pointerenter', (event, d) => { if (!state.lockedSlug) activate(d); })
      .on('focus', (event, d) => { if (!state.lockedSlug) activate(d); })
      .on('click', (event, d) => activate(d, { lock: true }))
      .on('keydown', (event, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate(d, { lock: true });
        }
      });

    pins.append('circle').attr('class', 'atlas-pin-ring').attr('r', 8);
    pins.append('circle').attr('class', 'atlas-pin-dot').attr('r', 4.8);
    pins.append('text').attr('class', 'atlas-pin-label').attr('x', 10).attr('y', 4).text((d) => d.name);

    const applyZoomVisuals = (transform) => {
      const k = transform.k || 1;
      state.zoomTransform = transform;
      mapLayer.attr('transform', transform);
      root.classList.toggle('is-zoomed', k >= 1.75);
      root.classList.toggle('is-deep-zoom', k >= 3.25);
      pins.selectAll('.atlas-pin-dot').attr('r', Math.max(3.4, 4.8 / Math.sqrt(k))).attr('stroke-width', Math.max(1.3, 2.2 / Math.sqrt(k)));
      pins.selectAll('.atlas-pin-ring').attr('r', Math.max(6, 8 / Math.sqrt(k))).attr('stroke-width', Math.max(.8, 2 / Math.sqrt(k)));
      pins.selectAll('.atlas-pin-label').attr('x', 9 / Math.sqrt(k)).attr('y', 4 / Math.sqrt(k)).style('font-size', `${Math.max(5.2, 12 / Math.sqrt(k))}px`);
    };

    const zoom = d3.zoom()
      .scaleExtent(zoomLimits)
      .translateExtent([[-width * 1.4, -height * 1.2], [width * 2.4, height * 2.2]])
      .on('zoom', (event) => applyZoomVisuals(event.transform));

    svg.call(zoom);
    svg.on('pointerdown wheel', () => root.classList.add('has-interacted'));
    controls.addEventListener('click', () => root.classList.add('has-interacted'));
    if (state.zoomTransform) {
      svg.call(zoom.transform, state.zoomTransform);
    }

    controls.querySelector('[data-zoom="in"]').addEventListener('click', () => svg.transition().duration(240).call(zoom.scaleBy, 1.65));
    controls.querySelector('[data-zoom="out"]').addEventListener('click', () => svg.transition().duration(240).call(zoom.scaleBy, 1 / 1.65));
    controls.querySelector('[data-zoom="reset"]').addEventListener('click', () => svg.transition().duration(260).call(zoom.transform, d3.zoomIdentity));

    const fallback = fichas.find((d) => matchesFilter(d) && d.hot && d.name === 'Gana') || fichas.find(matchesFilter) || fichas[0];
    activate(fichas.find((d) => d.slug === state.selectedSlug && matchesFilter(d)) || fallback);
  };

  const renderSearchResults = (query) => {
    if (!searchResults) return;
    const term = normalize(query);
    if (!term) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('is-open');
      return;
    }
    const matches = state.fichas
      .filter((item) => matchesFilter(item))
      .filter((item) => normalize(`${item.name} ${item.region} ${isAbyaYala(item) ? 'Abya Yala América Américas' : ''} ${isLatinAmerica(item) ? 'América Latina América Latina' : ''} ${isGondwanaTerritory(item) ? 'Território Gondwana Gondwana' : ''}`).includes(term))
      .slice(0, 8);
    searchResults.innerHTML = '';
    if (!matches.length) {
      const empty = document.createElement('button');
      empty.type = 'button';
      empty.disabled = true;
      empty.innerHTML = '<strong>Nenhum país encontrado</strong><span>Teste outro nome ou abra o catálogo completo.</span>';
      searchResults.appendChild(empty);
      searchResults.classList.add('is-open');
      return;
    }
    matches.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.innerHTML = `<strong>${item.name}</strong><span>${item.region}${isLatinAmerica(item) ? ' - América Latina' : isAbyaYala(item) ? ' - Abya Yala' : ''} - ${item.status || 'Ficha ativa'}</span>`;
      button.addEventListener('click', () => activate(item, { lock: true }));
      searchResults.appendChild(button);
    });
    searchResults.classList.add('is-open');
  };

  const updateFilterCounts = () => {
    filterButtons.forEach((button) => {
      const filter = button.dataset.atlasFilter || 'Todos';
      const base = button.dataset.baseLabel || button.textContent.replace(/\s*\(\d+\)$/, '');
      button.dataset.baseLabel = base;
      const count = state.fichas.filter((item) => {
        const oldFilter = state.filter;
        state.filter = filter;
        const ok = matchesFilter(item);
        state.filter = oldFilter;
        return ok;
      }).length;
      button.textContent = `${base} (${count})`;
    });
  };

  const applyFilter = (filter) => {
    state.filter = filter || 'Todos';
    state.zoomTransform = null;
    state.lockedSlug = null;
    filterButtons.forEach((button) => {
      const active = button.dataset.atlasFilter === state.filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.classList.remove('is-open');
    draw();
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.atlasFilter));
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') searchResults?.classList.remove('is-open');
      if (event.key === 'Enter') {
        const first = searchResults?.querySelector('button:not([disabled])');
        if (first) { event.preventDefault(); first.click(); }
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest?.('.atlas-search')) searchResults?.classList.remove('is-open');
  });

  Promise.all([fetch(dataUrl).then((res) => res.json()), fetch(mapUrl).then((res) => res.json())])
    .then(([fichas, world]) => {
      state.fichas = fichas;
      state.world = world;
      updateFilterCounts();
      const count = card.querySelector('[data-atlas-count]');
      if (count) count.textContent = String(fichas.length);
      draw();
    })
    .catch((error) => {
      console.error('[copa-atlas] mapa não carregou', error);
      root.innerHTML = '<p class="atlas-error"><strong>Mapa em recarga.</strong><span>Não foi possível carregar o atlas neste momento. Atualize a página ou use o catálogo de fichas.</span></p>';
    });

  window.addEventListener('resize', () => {
    clearTimeout(window.__copaAtlasResize);
    window.__copaAtlasResize = setTimeout(draw, 160);
  });
})();
