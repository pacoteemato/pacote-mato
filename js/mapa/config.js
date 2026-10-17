(function configurarMapaPacoteEMato(global) {
  'use strict';

  const STORAGE_KEY = 'pemato_worker_base_url';
  const HOLY_FROG_BASE_URL = 'https://holy-frog-272c.joaovitor250p.workers.dev';
  const existente = global.PEMATO_MAP_CONFIG || {};

  function limparBase(url) {
    return String(url || '').trim().replace(/\/+$/, '');
  }

  function limparOverridesAntigos() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      [
        'pemato_geocoding_endpoint',
        'pemato_optimize_endpoint',
        'pemato_route_endpoint',
        'pemato_health_endpoint',
        'pemato_worker_url',
        'workerBaseUrl'
      ].forEach(k => localStorage.removeItem(k));
    } catch (_) {}
  }

  // V66: o sistema usa exclusivamente o holy-frog unificado.
  // Endereços antigos armazenados no aparelho não podem mais sobrescrever o backend oficial.
  limparOverridesAntigos();
  const inicial = HOLY_FROG_BASE_URL;

  const cfg = global.PEMATO_MAP_CONFIG = Object.assign({
    mapStyleUrl: 'https://tiles.openfreemap.org/styles/liberty',
    fallbackMapStyle: {
      version: 8,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [{ id: 'osm-raster', type: 'raster', source: 'osm' }]
    },
    workerBaseUrl: inicial,
    geocodingEndpoint: '',
    optimizeEndpoint: '',
    routeEndpoint: '',
    healthEndpoint: '',
    geocodingProvider: 'geoapify-worker',
    geocodingRequestTimeoutMs: 12000,
    routingRequestTimeoutMs: 45000,
    routingMaxPointsPerRequest: 12,
    geocodingRequestGapMs: 400,
    geocodingCacheTtlMs: 90 * 24 * 60 * 60 * 1000,
    geocodingNegativeCacheTtlMs: 24 * 60 * 60 * 1000,
    geocodingMinConfidence: 0.90,
    geocodingMinStreetConfidence: 0.90,
    initialCenter: [-46.6333, -23.5505],
    initialZoom: 10
  }, existente, { workerBaseUrl: inicial });

  function derivarEndpoints() {
    const b = HOLY_FROG_BASE_URL;
    cfg.workerBaseUrl = b;
    cfg.geocodingEndpoint = `${b}/geocode`;
    cfg.optimizeEndpoint = `${b}/optimize`;
    cfg.routeEndpoint = `${b}/route`;
    cfg.healthEndpoint = `${b}/health`;
    return cfg;
  }

  function limparPontosInteresse(mapa) {
    if (!mapa?.getStyle) return;
    const padrao = /(poi|amenity|hospital|clinic|pharmacy|school|university|college|kindergarten|bus|transit|station|railway|subway|tram|airport|aeroway|shop|store|restaurant|cafe|bar|fast.?food|hotel|motel|lodging|tourism|attraction|museum|theatre|cinema|place.?of.?worship|religion|parking)/i;
    const preservar = /(road|street|highway|motorway|trunk|primary|secondary|tertiary|route|place|city|town|village|neighbourhood|neighborhood|water|boundary)/i;
    (mapa.getStyle()?.layers || []).forEach(layer => {
      if (layer.type !== 'symbol') return;
      const texto = `${layer.id || ''} ${layer['source-layer'] || ''}`;
      if (padrao.test(texto) && !preservar.test(texto)) {
        try { mapa.setLayoutProperty(layer.id, 'visibility', 'none'); } catch (_) {}
      }
    });
  }

  const estiloCleanAplicado = new WeakSet();

  function textoLayer(layer) {
    return `${layer?.id || ''} ${layer?.['source-layer'] || ''}`.toLowerCase();
  }

  function setPaintSeguro(mapa, layer, propriedade, valor) {
    if (!mapa?.getLayer?.(layer?.id)) return;
    try { mapa.setPaintProperty(layer.id, propriedade, valor); } catch (_) {}
  }

  function setLayoutSeguro(mapa, layer, propriedade, valor) {
    if (!mapa?.getLayer?.(layer?.id)) return;
    try { mapa.setLayoutProperty(layer.id, propriedade, valor); } catch (_) {}
  }

  function categoriaVia(txt) {
    if (/(motorway|trunk|freeway)/i.test(txt)) return 'principal';
    if (/(primary|highway)/i.test(txt)) return 'principal';
    if (/(secondary|tertiary)/i.test(txt)) return 'secundaria';
    if (/(residential|living_street|street|road|service|transportation)/i.test(txt)) return 'local';
    return '';
  }

  function larguraViaClean(categoria, casing, navegacaoAtiva) {
    const extra = navegacaoAtiva ? 0.35 : 0;
    const valores = categoria === 'principal'
      ? [10, 1.4, 13, 2.7, 16, 5.0, 19, 8.2]
      : categoria === 'secundaria'
        ? [10, 1.0, 13, 2.1, 16, 3.8, 19, 6.0]
        : [10, 0.75, 13, 1.55, 16, 2.8, 19, 4.5];
    const expr = ['interpolate', ['linear'], ['zoom']];
    for (let i = 0; i < valores.length; i += 2) {
      expr.push(valores[i], valores[i + 1] + extra + (casing ? (categoria === 'principal' ? 1.8 : 1.35) : 0));
    }
    return expr;
  }

  // HOTFIX FINAL 2: identidade base única para OVERVIEW e NAVIGATION-ACTIVE.
  // A classificação usa id + source-layer; nenhum ID específico do Liberty é obrigatório.
  function aplicarEstiloMapaClean(mapa, opcoes = {}) {
    if (!mapa?.getStyle) return false;
    const navegacaoAtiva = opcoes.navegacaoAtiva === true;
    const layers = mapa.getStyle()?.layers || [];

    layers.forEach(layer => {
      if (!layer?.id || /^pemato-/i.test(layer.id)) return;
      const txt = textoLayer(layer);

      if (layer.type === 'background') {
        setPaintSeguro(mapa, layer, 'background-color', '#f3f5f6');
        setPaintSeguro(mapa, layer, 'background-opacity', 1);
        return;
      }

      if (layer.type === 'fill') {
        if (/(water|ocean|lake|river|waterway)/i.test(txt)) {
          setPaintSeguro(mapa, layer, 'fill-color', '#e2f0f5');
          setPaintSeguro(mapa, layer, 'fill-opacity', 0.9);
        } else if (/(park|grass|wood|forest|green|nature|landcover)/i.test(txt)) {
          setPaintSeguro(mapa, layer, 'fill-color', '#edf3ed');
          setPaintSeguro(mapa, layer, 'fill-opacity', 0.68);
        } else if (/(building)/i.test(txt)) {
          setPaintSeguro(mapa, layer, 'fill-color', '#e9edef');
          setPaintSeguro(mapa, layer, 'fill-opacity', 0.38);
          setPaintSeguro(mapa, layer, 'fill-outline-color', '#dde3e6');
        } else if (/(landuse|industrial|commercial|retail|residential-area)/i.test(txt)) {
          setPaintSeguro(mapa, layer, 'fill-color', '#f1f3f3');
          setPaintSeguro(mapa, layer, 'fill-opacity', 0.34);
        }
        return;
      }

      if (layer.type === 'fill-extrusion') {
        setLayoutSeguro(mapa, layer, 'visibility', 'none');
        return;
      }

      if (layer.type === 'line') {
        const via = categoriaVia(txt);
        if (via) {
          const casing = /(casing|outline|border)/i.test(txt);
          const cor = casing
            ? (via === 'principal' ? '#b8c2c8' : '#c9d0d4')
            : (via === 'principal' ? '#cfd6da' : via === 'secundaria' ? '#d7dde1' : '#e0e4e7');
          setPaintSeguro(mapa, layer, 'line-color', cor);
          setPaintSeguro(mapa, layer, 'line-opacity', casing ? 0.95 : 1);
          setPaintSeguro(mapa, layer, 'line-width', larguraViaClean(via, casing, navegacaoAtiva));
          return;
        }
        if (/(boundary|admin)/i.test(txt)) {
          setPaintSeguro(mapa, layer, 'line-color', '#d8dde0');
          setPaintSeguro(mapa, layer, 'line-opacity', 0.45);
        }
        if (/(waterway|river|stream)/i.test(txt)) {
          setPaintSeguro(mapa, layer, 'line-color', '#c9e4ee');
          setPaintSeguro(mapa, layer, 'line-opacity', 0.75);
        }
        return;
      }

      if (layer.type !== 'symbol') return;

      const ehRoadLabel = /(road|street|transportation_name|highway|motorway|trunk|primary|secondary|tertiary|residential)/i.test(txt)
        && !/(shield|route.?number|road.?number|highway.?ref|motorway.?ref)/i.test(txt);
      const ehPlaceLabel = /(place|city|town|village|neighbourhood|neighborhood|suburb)/i.test(txt);
      const ehShield = /(shield|route.?number|road.?number|highway.?ref|motorway.?ref)/i.test(txt);
      const ehPoi = /(poi|amenity|shop|store|restaurant|cafe|bar|fast.?food|tourism|attraction|museum|theatre|cinema|school|college|university|kindergarten|church|place.?of.?worship|religion|hotel|motel|lodging|hospital|clinic|pharmacy|parking)/i.test(txt);

      if (ehRoadLabel) {
        setLayoutSeguro(mapa, layer, 'visibility', 'visible');
        setLayoutSeguro(mapa, layer, 'text-size', ['interpolate', ['linear'], ['zoom'], 11, 10.5, 14, 12.2, 16, navegacaoAtiva ? 14.2 : 13.6, 19, navegacaoAtiva ? 16.2 : 15.4]);
        setPaintSeguro(mapa, layer, 'text-color', '#303b42');
        setPaintSeguro(mapa, layer, 'text-halo-color', '#f7f8f8');
        setPaintSeguro(mapa, layer, 'text-halo-width', navegacaoAtiva ? 1.65 : 1.45);
        setPaintSeguro(mapa, layer, 'text-halo-blur', 0.2);
        setPaintSeguro(mapa, layer, 'text-opacity', 1);
        setPaintSeguro(mapa, layer, 'icon-opacity', 0.38);
        return;
      }

      if (ehPlaceLabel) {
        setLayoutSeguro(mapa, layer, 'visibility', 'visible');
        setPaintSeguro(mapa, layer, 'text-color', '#6b747a');
        setPaintSeguro(mapa, layer, 'text-halo-color', '#f6f7f7');
        setPaintSeguro(mapa, layer, 'text-halo-width', 1.25);
        setPaintSeguro(mapa, layer, 'text-opacity', /neigh|suburb/i.test(txt) ? 0.72 : 0.62);
        setPaintSeguro(mapa, layer, 'icon-opacity', 0.18);
        return;
      }

      if (ehShield) {
        // Road shields continuam possíveis, porém discretos; deixam de competir com a rota.
        setPaintSeguro(mapa, layer, 'text-opacity', navegacaoAtiva ? 0.22 : 0.28);
        setPaintSeguro(mapa, layer, 'icon-opacity', navegacaoAtiva ? 0.16 : 0.22);
        return;
      }

      if (ehPoi) {
        setLayoutSeguro(mapa, layer, 'visibility', 'none');
      }
    });

    estiloCleanAplicado.add(mapa);
    return true;
  }

  function aplicarEstiloNavegacaoAtiva(mapa) {
    return aplicarEstiloMapaClean(mapa, { navegacaoAtiva: true });
  }

  function restaurarEstiloMapaOverview(mapa) {
    // O overview não volta ao Liberty colorido: a identidade clean é permanente.
    return aplicarEstiloMapaClean(mapa, { navegacaoAtiva: false });
  }

  function configurarWorkerBaseUrl() {
    // Mantido por compatibilidade com telas antigas, mas o backend oficial não pode ser trocado.
    limparOverridesAntigos();
    derivarEndpoints();
    try {
      global.dispatchEvent(new CustomEvent('pemato:worker:update', { detail: { workerBaseUrl: HOLY_FROG_BASE_URL } }));
    } catch (_) {}
    return HOLY_FROG_BASE_URL;
  }

  function obterWorkerBaseUrl() {
    return HOLY_FROG_BASE_URL;
  }

  derivarEndpoints();

  function exibirConstrucoes2D(mapa) {
    const camadas = mapa?.getStyle?.()?.layers || [];
    const bases = camadas.filter(l => l['source-layer'] &&
      /building/i.test(l['source-layer']) && ['fill','fill-extrusion'].includes(l.type));
    const fontes = new Map();
    bases.forEach(l => fontes.set(`${l.source}:${l['source-layer']}`, l));
    let indice = 0;
    fontes.forEach(base => {
      const id = `pemato-construcoes-2d-${indice++}`;
      if (mapa.getLayer(id)) return;
      const antes = camadas.find(l => l.source === base.source && l['source-layer'] === base['source-layer'])?.id;
      mapa.addLayer({
        id, type:'fill', source:base.source, 'source-layer':base['source-layer'], minzoom:14,
        layout:{visibility:'visible'},
        paint:{'fill-color':'#f0efed', 'fill-outline-color':'#b5b9bd',
          'fill-opacity':['interpolate',['linear'],['zoom'],14,0.45,16,0.85]}
      }, antes);
      bases.filter(l => l.source === base.source && l['source-layer'] === base['source-layer'])
        .forEach(l => mapa.setLayoutProperty(l.id, 'visibility', 'none'));
    });
  }

  global.PacoteEMatoMapaConfig = Object.freeze({
    exibirConstrucoes2D,
    limparPontosInteresse,
    aplicarEstiloMapaClean,
    aplicarEstiloNavegacaoAtiva,
    restaurarEstiloMapaOverview,
    configurarWorkerBaseUrl,
    obterWorkerBaseUrl,
    derivarEndpoints
  });
})(window);
