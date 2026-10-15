(function iniciarAppShell(global) {
  'use strict';

  const CHAVE_UI = 'pemato_ui_resume_v1';
  const modulos = ['roteirizacao', 'bipagem', 'operacoes-pacotes', 'navegacao', 'historico', 'configuracoes'];
  const IDS_CAMADAS_RETORNO = [
    'routingActionsBackdrop','routingBipagemChooserBackdrop','routingPackagesChooserBackdrop','navPackagesChooserBackdrop',
    'routeImportMappingModal','routingOptimizationReviewBackdrop','routeStopEditorModal','routeReoptDecisionModal',
    'navCompletionBackdrop','routingRefineBackdrop','navRouteActionsBackdrop','routeHistoryDetailModal'
  ];
  let iniciando = true;

  function $(id) { return document.getElementById(id); }

  function idModulo(nome) {
    return {
      roteirizacao: 'moduloRoteirizacao',
      bipagem: 'moduloBipagem',
      'operacoes-pacotes': 'moduloOperacoesPacotes',
      navegacao: 'moduloNavegacao',
      historico: 'moduloHistorico',
      configuracoes: 'moduloConfiguracoes'
    }[nome];
  }

  function fecharSidebar() {
    const sb = $('sidebar');
    const ov = $('overlay');
    sb?.classList.remove('active');
    if (ov) ov.style.display = 'none';
  }

  function fecharDialogosAbertos() {
    document.querySelectorAll('.pemato-dialog-backdrop').forEach(el => {
      const btn = el.querySelector('.pemato-dialog-cancel, .pemato-dialog-confirm');
      if (btn) btn.click();
      else el.remove();
    });
  }

  function liberarTravasVisuais() {
    try {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      ['modal-open', 'no-scroll', 'overflow-hidden', 'sheet-open'].forEach(cls => {
        document.body.classList.remove(cls);
        document.documentElement.classList.remove(cls);
      });
      IDS_CAMADAS_RETORNO.forEach(id => {
        const el = $(id);
        if (el) el.style.display = 'none';
      });
      fecharDialogosAbertos();
      $('routingWorkspace')?.classList.remove('is-draw-mode');
      const importFlow = $('routeImportFlow');
      if (importFlow) importFlow.classList.remove('is-open');
    } catch (_) {}
  }

  function registrarRetornoInterno(tag) {
    try {
      global.history.pushState({ pematoInterno: true, tag: tag || 'camada', em: Date.now() }, '', global.location.href);
    } catch (_) {}
  }

  function camadaVisivel(id) {
    const el = $(id);
    if (!el) return false;
    return String(el.style.display || '').toLowerCase() !== 'none' && String(el.style.display || '').trim() !== '';
  }

  function existeRetornoContextual() {
    if ($('sidebar')?.classList.contains('active')) return true;
    if (document.querySelector('.pemato-dialog-backdrop')) return true;
    if ($('routeImportFlow')?.classList.contains('is-open')) return true;
    return IDS_CAMADAS_RETORNO.some(camadaVisivel);
  }

  async function tratarRetornoInterno() {
    if ($('sidebar')?.classList.contains('active')) {
      fecharSidebar();
      return true;
    }
    const dialogo = document.querySelector('.pemato-dialog-backdrop');
    if (dialogo) {
      const btn = dialogo.querySelector('.pemato-dialog-cancel, .pemato-dialog-confirm');
      if (btn) btn.click();
      else dialogo.remove();
      return true;
    }
    if (existeRetornoContextual()) {
      liberarTravasVisuais();
      return true;
    }
    const atual = document.body.dataset.pematoModule || global.appState?.ui?.moduloAtual || 'roteirizacao';
    if (atual && atual !== 'roteirizacao') {
      await abrirModulo('roteirizacao', { registrarHistorico: false });
      return true;
    }
    return false;
  }

  async function abrirModulo(nome, opcoes) {
    if (document.body.dataset.pematoModule === 'navegacao' && nome !== 'navegacao') await global.PacoteEMatoNavegacao?.persistirSelecao?.({ motivo: 'troca_modulo' });
    await global.PacoteEMatoConfiguracoes?.aguardarAplicacao?.();
    if (nome === 'inicio') nome = 'roteirizacao';
    if (!modulos.includes(nome)) nome = 'roteirizacao';
    if (nome === 'navegacao') {
      const rotaParaNavegar = await global.PacoteEMatoRotaStore?.obterRotaAtiva?.();
      if (rotaParaNavegar?.precisaRecalculo) {
        global.notificar?.('A rota foi alterada. Recalcule o trajeto antes de abrir a navegação.');
        nome = 'roteirizacao';
      }
    }
    if (!iniciando && document.body.dataset.pematoModule === nome) { fecharSidebar(); return; }
    const anteriorRegistrado = document.body.dataset.pematoModule || global.appState?.ui?.moduloAtual || 'roteirizacao';
    if (!iniciando && opcoes?.registrarHistorico !== false && nome !== 'roteirizacao' && anteriorRegistrado !== nome) {
      registrarRetornoInterno('modulo:' + nome);
    }
    liberarTravasVisuais();
    const anterior = anteriorRegistrado;
    if (anterior === 'navegacao' && nome !== 'navegacao') global.PacoteEMatoNavegacao?.pausar?.();
    if (anterior === 'operacoes-pacotes' && nome !== 'operacoes-pacotes') { try { await global.finalizarCameraHardware?.(); } catch (_) {} }
    if (anterior === 'roteirizacao' && nome !== 'roteirizacao') {
      global.PacoteEMatoMapa?.encerrarSelecaoDesenho?.({ limpar: true });
      const draw = $('routingDrawToolbar');
      if (draw) draw.style.display = 'none';
    }

    document.body.dataset.pematoModule = nome;
    modulos.forEach(m => {
      const el = $(idModulo(m));
      if (el) el.style.display = m === nome ? '' : 'none';
      document.querySelectorAll(`[data-pemato-nav="${m}"]`).forEach(btn => btn.classList.toggle('active', m === nome));
    });
    if (global.appState?.ui) global.appState.ui.moduloAtual = nome;
    salvarEstadoUI();
    fecharSidebar();
    if (nome !== 'navegacao') liberarTravasVisuais();

    if (nome === 'roteirizacao') {
      await global.PacoteEMatoRoteirizacao?.carregarRotaAtiva?.();
      setTimeout(() => global.PacoteEMatoMapa?.renderizar({ fit: true }), 100);
    } else if (nome === 'bipagem') {
      global.PacoteEMatoBipagemArea?.abrir?.('scanner');
      if (opcoes?.usarRotaAtiva === true) await global.PacoteEMatoBipagemBridge?.prepararRotaAtivaParaBipagem?.({ iniciarScanner: true });
    } else if (nome === 'operacoes-pacotes') {
      // A tela e o scanner desta operação são controlados pelo módulo de Adicionar/Remover pacotes.
    } else if (nome === 'historico') {
      global.PacoteEMatoHistorico?.renderizar?.();
    } else if (nome === 'configuracoes') {
      global.PacoteEMatoConfiguracoes?.renderizar?.();
    } else if (nome === 'navegacao') {
      const rota = await global.PacoteEMatoRotaStore?.obterRotaAtiva?.();
      if (rota?.geometria) global.PacoteEMatoNavegacao?.iniciar?.(rota);
    }
  }

  function formatarDistancia(m) {
    const n = Number(m);
    return Number.isFinite(n) ? `${(n / 1000).toFixed(1).replace('.', ',')} km` : '—';
  }

  function formatarTempo(s) {
    const min = Math.max(0, Math.round(Number(s || 0) / 60));
    if (!Number.isFinite(min)) return '—';
    return min >= 60 ? `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}` : `${min} min`;
  }

  async function atualizarInicio() {
    const rota = await global.PacoteEMatoRotaStore?.obterRotaAtiva?.();
    const card = $('homeActiveRouteCard');
    const empty = $('homeNoRoute');
    if (!rota) {
      if (card) card.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (card) card.style.display = 'block';
    if (empty) empty.style.display = 'none';
    if ($('homeRouteName')) $('homeRouteName').textContent = rota.nome || 'Rota ativa';
    if ($('homeRouteStatus')) $('homeRouteStatus').textContent = rota.rotaOtimizada ? 'Otimizada' : 'Em planejamento';
    if ($('homeRouteStops')) $('homeRouteStops').textContent = String(rota.paradas.length);
    if ($('homeRouteDistance')) $('homeRouteDistance').textContent = formatarDistancia(rota.distanciaTotalMetros);
    if ($('homeRouteTime')) $('homeRouteTime').textContent = formatarTempo(rota.duracaoTotalSegundos);
    const delivered = rota.paradas.filter(p => ['entregue', 'concluida'].includes(p.statusEntrega)).length;
    if ($('homeRouteProgress')) $('homeRouteProgress').textContent = `${delivered} de ${rota.paradas.length}`;
    const packages = rota.paradas.reduce((sum, p) => sum + (p.pacotes?.length || 0), 0);
    if ($('homeRoutePackages')) $('homeRoutePackages').textContent = String(packages);
  }

  function salvarEstadoUI() {
    try {
      const dados = {
        modulo: document.body.dataset.pematoModule || 'roteirizacao',
        painel: document.getElementById('routingBottomSheet')?.dataset?.state || null,
        atualizadoEm: Date.now()
      };
      sessionStorage.setItem(CHAVE_UI, JSON.stringify(dados));
      localStorage.setItem(CHAVE_UI, JSON.stringify(dados));
    } catch (_) {}
  }

  function recuperarEstadoUI() {
    try {
      const raw = sessionStorage.getItem(CHAVE_UI) || localStorage.getItem(CHAVE_UI);
      const d = JSON.parse(raw || 'null');
      let modulo = d?.modulo === 'inicio' ? 'roteirizacao' : d?.modulo;
      if (modulo === 'operacoes-pacotes') modulo = 'roteirizacao';
      return modulo && modulos.includes(modulo) ? modulo : null;
    } catch (_) {
      return null;
    }
  }

  async function bind() {
    document.querySelectorAll('[data-pemato-nav]').forEach(btn => {
      btn.addEventListener('click', () => abrirModulo(btn.dataset.pematoNav));
    });
    global.addEventListener('pemato:rota:salva', atualizarInicio);
    global.addEventListener('pemato:rota:ativa-limpa', atualizarInicio);
    global.addEventListener('pagehide', salvarEstadoUI);
    global.addEventListener('popstate', () => { tratarRetornoInterno().catch?.(() => {}); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) salvarEstadoUI();
      else global.dispatchEvent(new CustomEvent('pemato:resume'));
    });
    global.addEventListener('pageshow', () => global.dispatchEvent(new CustomEvent('pemato:resume')));

    try { await global.PacoteEMatoSessao?.restaurar?.(); } catch (_) {}
    const restaurado = recuperarEstadoUI();
    const desejado = restaurado || (global.appState?.ui?.moduloAtual === 'inicio' ? 'roteirizacao' : global.appState?.ui?.moduloAtual) || 'roteirizacao';
    await abrirModulo(desejado, { registrarHistorico: false });
    iniciando = false;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { bind(); }, { once: true });
  else bind();

  global.PacoteEMatoAppShell = Object.freeze({
    abrirModulo,
    atualizarInicio,
    fecharSidebar,
    liberarTravasVisuais,
    registrarRetornoInterno,
    tratarRetornoInterno
  });
})(window);
