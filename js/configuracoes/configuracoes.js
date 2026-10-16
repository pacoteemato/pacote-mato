(function iniciarConfiguracoes(global) {
  'use strict';

  const KEY = 'pemato_config_v2';
  let autoSaveTimer = null;
  let aplicacaoPendente = Promise.resolve();

  const DEFAULTS = {
    navegacao: 'pacote_emato',
    veiculo: 'carro',
    tempoParadaSegundos: 0,
    tempoParadaPersonalizado: false,
    pontoInicial: null,
    retornarAoInicio: false,
    obrigatoriasConfirmadas: false,
    camposObrigatorios: { navegacao: false, veiculo: false, tempoParada: false }
  };

  function $(id) { return document.getElementById(id); }

  function clone(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch (_) { return obj; }
  }

  function obter() {
    try {
      const salvo = JSON.parse(localStorage.getItem(KEY) || '{}');
      const dados = salvo && typeof salvo === 'object' ? salvo : {};
      const cfg = Object.assign({}, DEFAULTS, dados);
      cfg.camposObrigatorios = Object.assign({}, DEFAULTS.camposObrigatorios, dados.camposObrigatorios || {});
      if (dados.tempoParadaPersonalizado !== true) {
        cfg.tempoParadaSegundos = 0;
        cfg.tempoParadaPersonalizado = false;
      }
      cfg.pontoInicial = null;
      return cfg;
    } catch (_) {
      return clone(DEFAULTS);
    }
  }

  function salvar(parcial) {
    const anterior = obter();
    const cfg = Object.assign({}, anterior, parcial || {});
    cfg.camposObrigatorios = Object.assign({}, anterior.camposObrigatorios || DEFAULTS.camposObrigatorios, parcial?.camposObrigatorios || {});
    const campos = Object.keys(parcial || {}).filter(k => JSON.stringify(anterior[k]) !== JSON.stringify(cfg[k]));
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (_) {}
    renderizar();
    aplicacaoPendente = aplicacaoPendente
      .then(() => global.PacoteEMatoRoteirizacao?.aplicarConfiguracoesNaRota?.({ ...cfg, camposAlterados: campos }))
      .catch(erro => { status($('settingsAutosaveStatus'), erro.message || 'Não foi possível aplicar à rota.', 'error'); });
    try { global.dispatchEvent(new CustomEvent('pemato:config:update', { detail: cfg })); } catch (_) {}
    return cfg;
  }

  function status(el, texto, tipo) {
    if (!el) return;
    el.textContent = texto || '';
    if (tipo) el.dataset.status = tipo;
    else delete el.dataset.status;
  }

  function obrigatoriasConcluidas() {
    return obter().obrigatoriasConfirmadas === true;
  }

  function camposObrigatoriosTocados() {
    const cfg = obter();
    return Object.assign({}, DEFAULTS.camposObrigatorios, cfg.camposObrigatorios || {});
  }

  function marcouTudoObrigatorio() {
    const flags = camposObrigatoriosTocados();
    return flags.navegacao === true && flags.veiculo === true && flags.tempoParada === true;
  }

  function marcarCampoObrigatorio(campo) {
    if (!campo) return obter();
    const cfg = obter();
    const flags = Object.assign({}, DEFAULTS.camposObrigatorios, cfg.camposObrigatorios || {});
    if (flags[campo] === true) return cfg;
    flags[campo] = true;
    return salvar({ camposObrigatorios: flags });
  }

  function renderizarObrigatorias() {
    const cfg = obter();
    const flags = Object.assign({}, DEFAULTS.camposObrigatorios, cfg.camposObrigatorios || {});
    const mapa = {
      settingsRequiredNav: flags.navegacao === true,
      settingsRequiredVehicle: flags.veiculo === true,
      settingsRequiredStopTime: flags.tempoParada === true
    };
    Object.entries(mapa).forEach(([id, done]) => {
      const el = $(id);
      if (el) el.classList.toggle('is-done', done === true);
    });
    const btn = $('settingsConfirmRequiredBtn');
    const txt = $('settingsRequiredText');
    const info = $('settingsRequiredStatus');
    const pronto = marcouTudoObrigatorio();
    if (cfg.obrigatoriasConfirmadas === true) {
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Configurações obrigatórias confirmadas';
      }
      if (txt) txt.textContent = 'Configurações obrigatórias já confirmadas. Alterações futuras continuam sendo salvas automaticamente.';
      status(info, 'Preferências obrigatórias liberadas.', 'ok');
      return;
    }
    if (btn) {
      btn.disabled = !pronto;
      btn.textContent = 'Confirmar configurações obrigatórias';
    }
    if (txt) txt.textContent = 'Revise a navegação, o tipo de veículo e o tempo na parada. Você pode deixar o tempo em 0 se não quiser somar atendimento.';
    if (pronto) status(info, 'Agora confirme para liberar a otimização e a navegação.', 'warning');
    else status(info, 'Toque nos 3 campos acima e depois confirme.', 'warning');
  }

  function renderizar() {
    const cfg = obter();
    if ($('settingsNavigation')) $('settingsNavigation').value = cfg.navegacao;
    if ($('settingsVehicle')) $('settingsVehicle').value = cfg.veiculo;
    if ($('settingsStopMinutes')) $('settingsStopMinutes').value = String(Math.round(Number(cfg.tempoParadaSegundos || 0) / 60));
    if ($('settingsReturnStart')) $('settingsReturnStart').checked = cfg.retornarAoInicio === true;
    renderizarObrigatorias();
  }

  async function validarEnderecoPartida() {
    const input = $('settingsStartPoint');
    const texto = String(input?.value || '').trim();
    if (!texto) return status($('settingsStartStatus'), 'Informe um endereço antes de validar.', 'warning');
    const btn = $('settingsGeocodeStartBtn');
    if (btn) btn.disabled = true;
    status($('settingsStartStatus'), 'Validando endereço...', null);
    try {
      if (!global.PacoteEMatoGeocodificacao) throw new Error('Módulo de geocodificação não carregado.');
      const p = await global.PacoteEMatoGeocodificacao.geocodificarEnderecoLivre(texto);
      if (p.statusGeocodificacao === 'nao_configurado') throw new Error('Validação por endereço indisponível nesta versão sem o serviço externo. Use a localização atual.');
      if (p.statusGeocodificacao !== 'ok') throw new Error('O endereço não pôde ser localizado com confiança. Revise o endereço e tente novamente.');
      const pontoInicial = { tipo: 'endereco', descricao: texto, lat: p.latitude, lon: p.longitude, status: 'ok' };
      salvar({ pontoInicial });
      status($('settingsStartStatus'), `Ponto validado: ${texto}`, 'ok');
    } catch (erro) {
      status($('settingsStartStatus'), erro?.message || 'Falha ao validar o ponto de partida.', 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function usarGpsPartida() {
    if (!navigator.geolocation) return status($('settingsStartStatus'), 'Geolocalização não disponível neste navegador.', 'error');
    const btn = $('settingsUseGpsStartBtn');
    if (btn) btn.disabled = true;
    status($('settingsStartStatus'), 'Obtendo sua localização...', null);
    navigator.geolocation.getCurrentPosition(pos => {
      const pontoInicial = {
        tipo: 'gps',
        descricao: 'Minha localização',
        lat: Number(pos.coords.latitude),
        lon: Number(pos.coords.longitude),
        status: 'ok'
      };
      salvar({ pontoInicial });
      if ($('settingsStartPoint')) $('settingsStartPoint').value = pontoInicial.descricao;
      status($('settingsStartStatus'), 'Localização atual salva como ponto de partida.', 'ok');
      if (btn) btn.disabled = false;
    }, erro => {
      status($('settingsStartStatus'), erro?.message || 'Não foi possível acessar sua localização.', 'error');
      if (btn) btn.disabled = false;
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 });
  }

  function limparPonto() {
    salvar({ pontoInicial: null });
    if ($('settingsStartPoint')) $('settingsStartPoint').value = '';
    status($('settingsStartStatus'), 'Ponto de partida removido.', 'warning');
  }

  async function testarWorker() {
    const input = $('settingsWorkerUrl');
    const base = String(input?.value || '').trim().replace(/\/+$/, '');
    if (!base) return status($('settingsWorkerStatus'), 'Informe a URL do Worker.', 'warning');
    global.PacoteEMatoMapaConfig?.configurarWorkerBaseUrl?.(base);
    const btn = $('settingsWorkerTestBtn');
    if (btn) btn.disabled = true;
    status($('settingsWorkerStatus'), 'Testando conexão com o Worker...', null);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(`${base}/health`, { method: 'GET', credentials: 'omit', signal: controller.signal });
      clearTimeout(timer);
      let data = null;
      try { data = await response.json(); } catch (_) {}
      if (!response.ok || !data?.ok) throw new Error(data?.error || `Worker respondeu HTTP ${response.status}.`);
      if (data.providerConfigured === false) throw new Error('Worker publicado, mas o secret GEOAPIFY_API_KEY ainda não está configurado.');
      status($('settingsWorkerStatus'), 'Worker conectado e provedor de rota configurado.', 'ok');
    } catch (erro) {
      status($('settingsWorkerStatus'), erro?.name === 'AbortError' ? 'Tempo limite ao conectar ao Worker.' : (erro?.message || 'Não foi possível conectar ao Worker.'), 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function salvarFormulario(opcoes) {
    const atual = obter();
    const navegacao = $('settingsNavigation')?.value || 'pacote_emato';
    const veiculo = $('settingsVehicle')?.value || 'carro';
    const tempoParadaSegundos = Math.max(0, Number($('settingsStopMinutes')?.value || 0) * 60);
    const retornarAoInicio = $('settingsReturnStart')?.checked === true;

    const cfg = salvar({
      navegacao,
      veiculo,
      tempoParadaSegundos,
      tempoParadaPersonalizado: opcoes?.tempoParadaAlterado === true ? true : atual.tempoParadaPersonalizado === true,
      retornarAoInicio,
      pontoInicial: null
    });
    const hint = $('settingsAutosaveStatus');
    if (hint) {
      hint.textContent = 'Alterações salvas automaticamente.';
      hint.dataset.status = 'ok';
    }
    if (opcoes?.notificar === true && typeof global.notificar === 'function') {
      global.notificar('Configurações salvas e aplicadas à rota ativa.');
    }
    return cfg;
  }

  async function confirmarObrigatorias() {
    salvarFormulario({ notificar: false, tempoParadaAlterado: true });
    if (!marcouTudoObrigatorio()) {
      renderizarObrigatorias();
      global.notificar?.('Toque em navegação, veículo e tempo na parada antes de confirmar.');
      return false;
    }
    salvar({ obrigatoriasConfirmadas: true });
    status($('settingsRequiredStatus'), 'Preferências obrigatórias confirmadas com sucesso.', 'ok');
    global.notificar?.('Configurações obrigatórias liberadas. Agora você pode otimizar e iniciar a rota.');
    return true;
  }

  async function garantirObrigatorias() {
    // V62: estas opções são recomendações operacionais.
    // O motorista pode otimizar/iniciar sem alterar valores já válidos.
    return true;
  }

  function agendarAutoSave(delay) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => salvarFormulario({ notificar: false }), Number(delay || 250));
  }

  function bind() {
    $('settingsSaveBtn')?.addEventListener('click', () => salvarFormulario({ notificar: true }));
    $('settingsConfirmRequiredBtn')?.addEventListener('click', confirmarObrigatorias);

    const nav = $('settingsNavigation');
    const veic = $('settingsVehicle');
    const tempo = $('settingsStopMinutes');

    const revisarSelect = (el, campo) => {
      if (!el) return;
      const marcar = () => marcarCampoObrigatorio(campo);
      el.addEventListener('pointerdown', marcar, { passive: true });
      el.addEventListener('focus', marcar);
      el.addEventListener('change', () => {
        marcar();
        salvarFormulario({ notificar: false });
      });
    };

    revisarSelect(nav, 'navegacao');
    revisarSelect(veic, 'veiculo');

    if (tempo) {
      const marcarTempo = () => marcarCampoObrigatorio('tempoParada');
      tempo.addEventListener('pointerdown', marcarTempo, { passive: true });
      tempo.addEventListener('focus', marcarTempo);
      tempo.addEventListener('input', () => {
        marcarTempo();
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(() => salvarFormulario({ notificar: false, tempoParadaAlterado: true }), 350);
      });
      tempo.addEventListener('blur', () => {
        marcarTempo();
        salvarFormulario({ notificar: false, tempoParadaAlterado: true });
      });
    }
    $('settingsReturnStart')?.addEventListener('change', () => salvarFormulario({ notificar: false }));

    renderizar();
    const hint = $('settingsAutosaveStatus');
    if (hint) hint.textContent = 'Salvamento automático ativo.';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();

  global.PacoteEMatoConfiguracoes = Object.freeze({
    aguardarAplicacao: () => aplicacaoPendente,
    obter,
    salvar,
    renderizar,
    validarEnderecoPartida,
    testarWorker,
    usarGpsPartida,
    limparPonto,
    obrigatoriasConcluidas,
    garantirObrigatorias,
    marcarCampoObrigatorio,
    confirmarObrigatorias
  });
})(window);
