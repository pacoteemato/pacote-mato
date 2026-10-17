(function iniciarVozNavegacaoPacoteEMato(global) {
  'use strict';

  const STORAGE_KEY = 'pemato_nav_voice_enabled_v81';
  const falasExecutadas = new Set();
  let ativa = true;
  let desbloqueada = false;
  let instructionIdAtual = '';
  let ultimaChave = '';
  let ultimaFalaEm = 0;
  let utteranceAtual = null;
  let vozPreferida = null;
  let ultimoTexto = '';
  let ultimoStatus = 'idle';

  function disponivel() {
    return !!(global.speechSynthesis && global.SpeechSynthesisUtterance);
  }

  function carregarPreferencia() {
    try {
      const salvo = global.localStorage?.getItem(STORAGE_KEY);
      if (salvo === '0') ativa = false;
      if (salvo === '1') ativa = true;
    } catch (_) {}
    return ativa;
  }

  function persistirPreferencia() {
    try { global.localStorage?.setItem(STORAGE_KEY, ativa ? '1' : '0'); } catch (_) {}
  }

  function escolherVoz() {
    if (!disponivel()) return null;
    const vozes = global.speechSynthesis.getVoices?.() || [];
    vozPreferida = vozes.find(v => String(v.lang || '').toLowerCase() === 'pt-br')
      || vozes.find(v => String(v.lang || '').toLowerCase().startsWith('pt-br'))
      || vozes.find(v => String(v.lang || '').toLowerCase().startsWith('pt'))
      || null;
    return vozPreferida;
  }

  function atualizarDiagnostico(extra) {
    global.diagnosticoNavegacaoVozV81 = Object.assign(global.diagnosticoNavegacaoVozV81 || {}, {
      instructionId: instructionIdAtual || null,
      faseFalando: ultimoStatus,
      fraseTTS: ultimoTexto,
      vozAtiva: ativa,
      ttsDesbloqueado: desbloqueada,
      speechSynthesisDisponivel: disponivel(),
      voiceLang: vozPreferida?.lang || null,
      ultimaChaveFala: ultimaChave || null,
      ultimaFalaEm: ultimaFalaEm || null
    }, extra || {});
  }

  function inicializar() {
    carregarPreferencia();
    escolherVoz();
    try {
      global.speechSynthesis?.addEventListener?.('voiceschanged', escolherVoz);
    } catch (_) {}
    atualizarDiagnostico({faseFalando:'initialized'});
    return ativa;
  }

  function desbloquear() {
    escolherVoz();
    if (!disponivel() || desbloqueada) {
      desbloqueada = disponivel() ? true : desbloqueada;
      atualizarDiagnostico({faseFalando:desbloqueada?'ready':'unavailable'});
      return desbloqueada;
    }
    try {
      // Chamado somente após gesto explícito (Navegar / iniciar rota).
      // O utterance silencioso inicializa engines de TTS que exigem interação no WebView.
      const u = new global.SpeechSynthesisUtterance(' ');
      u.lang = 'pt-BR';
      u.rate = 1;
      u.pitch = 1;
      u.volume = 0;
      const v = escolherVoz(); if (v) u.voice = v;
      global.speechSynthesis.speak(u);
      desbloqueada = true;
      atualizarDiagnostico({faseFalando:'ready'});
      return true;
    } catch (_) {
      atualizarDiagnostico({faseFalando:'unlock-error'});
      return false;
    }
  }

  function estaAtiva() { return ativa; }

  function definirAtiva(valor) {
    ativa = valor !== false;
    persistirPreferencia();
    if (!ativa) {
      try { global.speechSynthesis?.cancel?.(); } catch (_) {}
      utteranceAtual = null;
      ultimoStatus = 'muted';
    } else {
      ultimoStatus = 'ready';
    }
    atualizarDiagnostico();
    return ativa;
  }

  function definirInstrucaoAtual(id) {
    instructionIdAtual = String(id || '');
    atualizarDiagnostico();
  }

  function chaveFala(instructionId, fase) {
    return `${String(instructionId || 'sem-instrucao')}|${String(fase || 'agora')}`;
  }

  function falarInstrucaoNavegacao({instructionId, fase, texto, urgente=false, minIntervaloMs=1800} = {}) {
    const id = String(instructionId || '');
    const frase = String(texto || '').trim();
    const faseNorm = String(fase || 'agora');
    const chave = chaveFala(id, faseNorm);
    const agora = Date.now();

    if (!ativa || !disponivel() || !frase) return false;
    if (id && instructionIdAtual && id !== instructionIdAtual && !id.startsWith('stop:') && !id.startsWith('route:')) return false;
    if (falasExecutadas.has(chave)) return false;
    if (agora - ultimaFalaEm < Number(minIntervaloMs || 0)) return false;

    try {
      // Não cancelar a cada posição GPS. Somente uma instrução urgente diferente
      // pode substituir a frase ainda em andamento.
      if (global.speechSynthesis.speaking) {
        if (!urgente) return false;
        if (ultimaChave && ultimaChave !== chave) global.speechSynthesis.cancel?.();
      }

      const u = new global.SpeechSynthesisUtterance(frase);
      u.lang = 'pt-BR';
      u.rate = 1.02;
      u.pitch = 1.0;
      u.volume = 1.0;
      const v = escolherVoz(); if (v) u.voice = v;
      u.onstart = () => { ultimoStatus = faseNorm; atualizarDiagnostico(); };
      u.onend = () => { if (utteranceAtual === u) utteranceAtual = null; ultimoStatus = 'idle'; atualizarDiagnostico(); };
      u.onerror = () => { if (utteranceAtual === u) utteranceAtual = null; ultimoStatus = 'error'; atualizarDiagnostico(); };

      falasExecutadas.add(chave);
      ultimaChave = chave;
      ultimaFalaEm = agora;
      ultimoTexto = frase;
      utteranceAtual = u;
      ultimoStatus = faseNorm;
      global.speechSynthesis.speak(u);
      atualizarDiagnostico();
      return true;
    } catch (_) {
      ultimoStatus = 'error';
      atualizarDiagnostico();
      return false;
    }
  }

  function limparEstado({cancelar=true} = {}) {
    falasExecutadas.clear();
    instructionIdAtual = '';
    ultimaChave = '';
    ultimaFalaEm = 0;
    ultimoTexto = '';
    ultimoStatus = 'idle';
    utteranceAtual = null;
    if (cancelar) {
      try { global.speechSynthesis?.cancel?.(); } catch (_) {}
    }
    atualizarDiagnostico();
  }

  function diagnostico() {
    atualizarDiagnostico();
    return Object.assign({}, global.diagnosticoNavegacaoVozV81 || {});
  }

  inicializar();

  global.PacoteEMatoVozNavegacao = Object.freeze({
    inicializar,
    desbloquear,
    disponivel,
    estaAtiva,
    definirAtiva,
    definirInstrucaoAtual,
    falarInstrucaoNavegacao,
    limparEstado,
    diagnostico
  });
})(window);
