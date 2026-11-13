(function iniciarHistoricoRotas(global) {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function formatarDistancia(m) {
    const n = Number(m);
    return Number.isFinite(n) ? `${(n / 1000).toFixed(1).replace('.', ',')} km` : '—';
  }

  function formatarTempo(s) {
    const min = Math.max(0, Math.round(Number(s || 0) / 60));
    if (!Number.isFinite(min)) return '—';
    if (min < 60) return `${min} min`;
    return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
  }

  function textoStatus(p) {
    if (p?.statusEntrega === 'nao_entregue') return 'Não entregue';
    if (['entregue','concluida'].includes(String(p?.statusEntrega || ''))) return 'Entregue';
    return 'Pendente';
  }

  function datasDoFiltro() {
    const tipo = $('historyFilter')?.value || 'semana';
    const hoje = new Date();
    let inicio = null;
    let fim = null;
    if (tipo === 'semana') {
      const day = (hoje.getDay() + 6) % 7;
      const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - day);
      inicio = d.toISOString().slice(0, 10);
      fim = hoje.toISOString().slice(0, 10);
    } else if (tipo === 'data') {
      const d = $('historyDate')?.value;
      inicio = d || null;
      fim = d || null;
    } else if (tipo === 'periodo') {
      inicio = $('historyStart')?.value || null;
      fim = $('historyEnd')?.value || null;
    }
    return { inicio, fim };
  }

  function criarLinha(label, value) {
    const div = document.createElement('div');
    div.className = 'history-detail-row';
    const a = document.createElement('span'); a.textContent = label;
    const b = document.createElement('strong'); b.textContent = value;
    div.append(a, b);
    return div;
  }

  function prepararRotaParaCorrecao(rotaEntrada, paradaId) {
    const rota = global.PacoteEMatoRotaStore?.normalizarRota
      ? global.PacoteEMatoRotaStore.normalizarRota(rotaEntrada)
      : JSON.parse(JSON.stringify(rotaEntrada || {}));
    const alvo = (rota.paradas || []).find(p => String(p.id) === String(paradaId));
    if (!alvo) return null;
    if (!['entregue','concluida','nao_entregue'].includes(String(alvo.statusEntrega || ''))) return null;

    alvo.statusEntrega = 'pendente';
    alvo.entregueEm = null;
    alvo.naoEntregueEm = null;
    alvo.motivoNaoEntrega = '';
    alvo.observacaoNaoEntrega = '';
    alvo.statusAtualizadoEm = Date.now();
    alvo.alteradoEm = Date.now();

    rota.status = 'ativa';
    rota.concluidoEm = null;
    rota.conclusaoPendente = false;
    rota.paradaSelecionadaId = alvo.id;
    rota.proximaParadaId = alvo.id;
    rota.alteradoEm = Date.now();
    // Intencionalmente não toca em ordem, pacotes, coordenadas, geometria, instruções
    // nem marca precisaRecalculo. A correção histórica não reotimiza a rota.
    return rota;
  }

  async function corrigirStatusRotaConcluida(rotaId, paradaId) {
    const store = global.PacoteEMatoRotaStore;
    const rota = await store?.obterRota?.(rotaId);
    if (!rota) return false;
    const alvo = (rota.paradas || []).find(p => String(p.id) === String(paradaId));
    if (!alvo || !['entregue','concluida','nao_entregue'].includes(String(alvo.statusEntrega || ''))) return false;

    const ativa = await store?.obterRotaAtiva?.();
    const complemento = ativa && String(ativa.id) !== String(rota.id)
      ? ' A rota que está aberta agora continuará salva no Histórico.'
      : '';
    const ok = await global.PacoteEMatoDialog?.confirmar?.({
      titulo: 'Reabrir rota para correção?',
      mensagem: `A parada “${alvo.enderecoOriginal || 'selecionada'}” voltará para Pendente. A mesma rota será reaberta sem mudar a ordem, os pacotes ou a otimização.${complemento}`,
      confirmar: 'Reabrir e corrigir',
      cancelar: 'Cancelar'
    });
    if (ok === false) return false;

    const corrigida = prepararRotaParaCorrecao(rota, paradaId);
    if (!corrigida) return false;
    await store.salvarRota(corrigida, { ativa: true, exigirPersistenciaLocal: true });
    try {
      await global.PacoteEMatoSessao?.persistirAgora?.({
        motivo: 'historico_corrigir_status',
        rotaAtivaId: corrigida.id,
        moduloAtual: 'roteirizacao',
        paradaSelecionadaId: String(paradaId),
        proximaParadaId: String(paradaId)
      });
    } catch (_) {}
    if ($('routeHistoryDetailModal')) $('routeHistoryDetailModal').style.display = 'none';
    await global.PacoteEMatoAppShell?.abrirModulo?.('roteirizacao');
    global.notificar?.('Rota reaberta. Somente a parada escolhida voltou para Pendente.');
    return true;
  }


  // Reexecução deliberada: mantém o mesmo ID e guarda um retrato imutável dos
  // resultados anteriores no próprio registro, antes de zerar os status.
  function prepararRotaParaRepeticao(rotaOriginal) {
    const store=global.PacoteEMatoRotaStore;
    const rota=store?.normalizarRota ? store.normalizarRota(rotaOriginal)
      : JSON.parse(JSON.stringify(rotaOriginal||{}));
    if (rota.status !== 'concluida') return null;
    const concluidaEm=rota.concluidoEm || Date.now();
    const snapshot={
      concluidoEm:concluidaEm,
      iniciadoEm:rota.iniciadoEm||null,
      status:'concluida',
      ordem:[...(rota.ordem||[])],
      paradas:(rota.paradas||[]).map(p=>({
        id:p.id,enderecoOriginal:p.enderecoOriginal,
        statusEntrega:p.statusEntrega,entregueEm:p.entregueEm||null,
        naoEntregueEm:p.naoEntregueEm||null,motivoNaoEntrega:p.motivoNaoEntrega||'',
        observacaoNaoEntrega:p.observacaoNaoEntrega||'',observacaoEntrega:p.observacaoEntrega||''
      }))
    };
    rota.historicoExecucoes=[...(rota.historicoExecucoes||[]),snapshot];
    rota.historicoReaberturas=[...(rota.historicoReaberturas||[]),{em:Date.now(),conclusaoAnteriorEm:concluidaEm}];
    rota.paradas=(rota.paradas||[]).map(p=>({
      ...p,statusEntrega:'pendente',entregueEm:null,naoEntregueEm:null,
      motivoNaoEntrega:'',observacaoNaoEntrega:'',observacaoEntrega:'',
      statusAtualizadoEm:Date.now()
    }));
    rota.status='planejamento';
    rota.iniciadoEm=null;
    rota.concluidoEm=null;
    rota.conclusaoPendente=false;
    rota.pontoFinalConcluidoEm=null;
    rota.distanciaPercorridaMetros=0;
    rota.paradaSelecionadaId=rota.ordem?.[0]||rota.paradas?.[0]?.id||null;
    rota.proximaParadaId=rota.paradaSelecionadaId;
    rota.alteradoEm=Date.now();
    return rota;
  }

  let desfazendoConclusao=false;
  async function desfazerConclusaoRota(id) {
    if (desfazendoConclusao) return false;
    const store=global.PacoteEMatoRotaStore;
    const atual=await store?.obterRota?.(id);
    if (!atual||atual.status!=='concluida') return false;
    const ok=await global.PacoteEMatoDialog?.confirmar?.({
      titulo:'DESEJA DESFAZER A CONCLUSÃO DESTA ROTA?',
      mensagem:'Essa rota voltará a ficar disponível para ser realizada novamente.',
      confirmar:'Confirmar desfazer',cancelar:'Cancelar'
    });
    if (ok!==true) return false;
    desfazendoConclusao=true;
    try {
      // Releitura após confirmação evita reaplicar em uma rota já reaberta.
      const confirmada=await store.obterRota(id);
      const disponivel=confirmada&&prepararRotaParaRepeticao(confirmada);
      if (!disponivel) return false;
      await store.salvarRota(disponivel,{ativa:false,exigirPersistenciaLocal:true});
      const salva=await store.obterRota(id);
      if(!salva||salva.status==='concluida'||salva.paradas.some(p=>p.statusEntrega!=='pendente')) throw new Error('Reabertura não confirmada no armazenamento');
      if($('routeHistoryDetailModal'))$('routeHistoryDetailModal').style.display='none';
      await renderizar();
      global.notificar?.('Rota disponível novamente. Inicie-a manualmente quando quiser.');
      return true;
    } catch(erro) {
      console.warn('Pacote É Mato: falha ao desfazer conclusão',erro);
      global.notificar?.('Não foi possível confirmar a reabertura. A rota deve ser revisada no Histórico.');
      return false;
    } finally { desfazendoConclusao=false; }
  }

  function criarParadaDetalhe(rota, p, indice) {
    const item = document.createElement('article');
    item.className = 'history-stop-item history-stop-item-v81';
    item.dataset.status = String(p.statusEntrega || 'pendente');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'history-stop-toggle';
    const numero = Number(p.ordemOtimizada || 0) || (indice + 1);
    const title = document.createElement('strong');
    title.textContent = `${numero}. ${p.enderecoOriginal || 'Endereço'}`;
    const status = document.createElement('span');
    status.textContent = textoStatus(p);
    toggle.append(title, status);

    const detail = document.createElement('div');
    detail.className = 'history-stop-expanded';
    detail.hidden = true;
    detail.append(
      criarLinha('Número', String(numero)),
      criarLinha('Endereço', p.enderecoOriginal || '—'),
      criarLinha('Status', textoStatus(p)),
      criarLinha('Observação', String(p.observacao || p.complemento || '—'))
    );
    if (p.statusEntrega === 'nao_entregue') detail.appendChild(criarLinha('Motivo', String(p.motivoNaoEntrega || p.observacaoNaoEntrega || 'Não informado')));
    if (p.observacaoEntrega) detail.appendChild(criarLinha('Nota da entrega', String(p.observacaoEntrega)));


    toggle.addEventListener('click', () => {
      detail.hidden = !detail.hidden;
      toggle.setAttribute('aria-expanded', detail.hidden ? 'false' : 'true');
    });
    toggle.setAttribute('aria-expanded', 'false');
    item.append(toggle, detail);
    return item;
  }

  async function abrirDetalhes(id) {
    const rota = await global.PacoteEMatoRotaStore.obterRota(id);
    if (!rota) return;
    const modal = $('routeHistoryDetailModal');
    const body = $('routeHistoryDetailBody');
    if (!modal || !body) return;
    body.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = rota.nome || 'Rota';
    body.append(
      title,
      criarLinha('Data', rota.data || '—'),
      criarLinha('Situação', rota.status==='concluida'?'Concluída':(rota.status==='planejamento'?'Disponível':rota.status)),
      criarLinha('Conclusão', rota.concluidoEm?new Date(rota.concluidoEm).toLocaleString('pt-BR'):'—'),
      criarLinha('Paradas', String(rota.paradas.length)),
      criarLinha('Distância', formatarDistancia(rota.distanciaTotalMetros)),
      criarLinha('Direção', formatarTempo(rota.duracaoDirecaoSegundos)),
      criarLinha('Tempo total', formatarTempo(rota.duracaoTotalSegundos)),
      criarLinha('Entregues', String(rota.paradas.filter(p => ['entregue','concluida'].includes(p.statusEntrega)).length)),
      criarLinha('Não entregues', String(rota.paradas.filter(p => p.statusEntrega === 'nao_entregue').length))
    );
    const stops = document.createElement('div');
    stops.className = 'history-stop-list';
    const porId = new Map((rota.paradas || []).map(p => [String(p.id), p]));
    const ordenadas = (rota.ordem || []).map(idParada => porId.get(String(idParada))).filter(Boolean);
    (rota.paradas || []).forEach(p => { if (!ordenadas.includes(p)) ordenadas.push(p); });
    ordenadas.forEach((p, indice) => stops.appendChild(criarParadaDetalhe(rota, p, indice)));
    body.appendChild(stops);
    const execucoes=Array.isArray(rota.historicoExecucoes)?rota.historicoExecucoes:[];
    if(execucoes.length){
      const historicoTitulo=document.createElement('h4');
      historicoTitulo.textContent='Execuções anteriores (auditoria)';
      body.appendChild(historicoTitulo);
      execucoes.forEach((execucao,i)=>{
        const bloco=document.createElement('details');
        const titulo=document.createElement('summary');
        titulo.textContent=`Execução ${i+1} — ${new Date(execucao.concluidoEm||Date.now()).toLocaleString('pt-BR')}`;
        bloco.appendChild(titulo);
        const lista=document.createElement('div');lista.className='history-stop-list';
        const porIdAnterior=new Map((execucao.paradas||[]).map(p=>[String(p.id),p]));
        const anteriores=(execucao.ordem||[]).map(id=>porIdAnterior.get(String(id))).filter(Boolean);
        (execucao.paradas||[]).forEach(p=>{if(!anteriores.includes(p))anteriores.push(p);});
        anteriores.forEach((p,k)=>lista.appendChild(criarParadaDetalhe(rota,p,k)));
        bloco.appendChild(lista);body.appendChild(bloco);
      });
    }
    if(rota.status==='concluida'){
      const desfazer=document.createElement('button');
      desfazer.type='button';desfazer.className='pemato-danger history-undo-conclusion';
      desfazer.textContent='DESFAZER';
      desfazer.addEventListener('click',()=>desfazerConclusaoRota(rota.id));
      body.appendChild(desfazer);
    }
    modal.style.display = 'flex';
  }

  async function abrirNoMapa(id) {
    const rota=await global.PacoteEMatoRotaStore?.obterRota?.(id);
    if(!rota) return;
    if(rota.status==='concluida'||rota.status==='arquivada') {
      // Consultar concluída nunca muda a rota ativa.
      await abrirDetalhes(id);return;
    }
    const ativa=await global.PacoteEMatoRotaStore?.obterRotaAtiva?.();
    if(ativa&&String(ativa.id)!==String(rota.id)){
      const ok=await global.PacoteEMatoDialog?.confirmar?.({
        titulo:'Abrir rota disponível?',mensagem:'A rota atual continuará salva. Deseja abrir a rota selecionada para iniciá-la quando quiser?',
        confirmar:'Abrir rota',cancelar:'Cancelar'
      });
      if(ok!==true)return;
    }
    const carregada=await global.PacoteEMatoRotaStore?.ativarRotaExistente?.(rota.id);
    if(!carregada)return;
    await global.PacoteEMatoAppShell?.abrirModulo?.('roteirizacao');
  }

  async function renderizar() {
    const container = $('historyRoutesList');
    if (!container || !global.PacoteEMatoRotaStore) return;
    const { inicio, fim } = datasDoFiltro();
    const rotas = await global.PacoteEMatoRotaStore.listarRotas({ dataInicio: inicio, dataFim: fim });
    container.replaceChildren();
    if (!rotas.length) {
      const empty = document.createElement('div');
      empty.className = 'history-empty';
      empty.textContent = 'Nenhuma rota encontrada para este período.';
      container.appendChild(empty);
      return;
    }
    rotas.forEach(rota => {
      const card = document.createElement('article');
      card.className = 'history-route-card-v2';
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'history-route-open';
      open.addEventListener('click', () => abrirDetalhes(rota.id));
      const top = document.createElement('div');
      top.className = 'history-route-top';
      const name = document.createElement('strong');
      name.textContent = rota.nome || 'Rota';
      const date = document.createElement('span');
      date.textContent = rota.data ? new Date(rota.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
      top.append(name, date);
      const meta = document.createElement('div');
      meta.className = 'history-route-meta';
      const delivered = rota.paradas.filter(p => ['entregue','concluida'].includes(p.statusEntrega)).length;
      const failed = rota.paradas.filter(p => p.statusEntrega === 'nao_entregue').length;
      meta.textContent = `${rota.status==='concluida'?'Concluída':rota.status==='planejamento'?'Disponível':'Em andamento'} · ${rota.paradas.length} paradas · ${formatarDistancia(rota.distanciaTotalMetros)} · ${delivered} entregues · ${failed} não entregues`;
      open.append(top, meta);
      const actions = document.createElement('div');
      actions.className = 'history-route-actions';
      const mapBtn = document.createElement('button');
      mapBtn.type = 'button'; mapBtn.className = 'pemato-primary'; mapBtn.textContent = rota.status==='concluida'?'Consultar conclusão':'Abrir rota disponível';
      mapBtn.addEventListener('click', () => rota.status==='concluida'?abrirDetalhes(rota.id):abrirNoMapa(rota.id));
      const detailBtn = document.createElement('button');
      detailBtn.type = 'button'; detailBtn.className = 'pemato-secondary'; detailBtn.textContent = 'Ver detalhes';
      detailBtn.addEventListener('click', () => abrirDetalhes(rota.id));
      actions.append(mapBtn, detailBtn);
      card.append(open, actions);
      container.appendChild(card);
    });
  }

  function bind() {
    ['historyFilter','historyDate','historyStart','historyEnd'].forEach(id => $(id)?.addEventListener('change', renderizar));
    $('historyRefreshBtn')?.addEventListener('click', renderizar);
    $('historyLegacyBtn')?.addEventListener('click', () => {
      if (typeof global.abrirModalHistorico === 'function') global.abrirModalHistorico();
    });
    $('routeHistoryDetailClose')?.addEventListener('click', () => { if ($('routeHistoryDetailModal')) $('routeHistoryDetailModal').style.display = 'none'; });
    global.addEventListener('pemato:rota:salva', renderizar);
    renderizar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once: true });
  else bind();

  global.PacoteEMatoHistorico = Object.freeze({ renderizar, abrirDetalhes, abrirNoMapa, desfazerConclusaoRota, prepararRotaParaRepeticao });
})(window);
