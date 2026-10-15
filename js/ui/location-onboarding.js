(function iniciarOnboardingLocalizacao(global){
  'use strict';

  const KEY_OK = 'pemato_localizacao_aceita_v61';
  const KEY_LATER_SESSION = 'pemato_localizacao_depois_v61';
  const KEY_BLOCKED_SESSION = 'pemato_localizacao_bloqueada_v61';
  let verificando = false;
  let observador = null;

  function $(id){ return document.getElementById(id); }

  function telaPrincipalLiberada(){
    const bloqueio = $('telaBloqueio');
    if (!bloqueio) return true;
    const st = global.getComputedStyle ? global.getComputedStyle(bloqueio) : null;
    return bloqueio.style.display === 'none' || st?.display === 'none';
  }

  function statusUI(texto, tipo){
    const a = $('locationOnboardingStatus');
    const b = $('settingsLocationStatus');
    [a,b].forEach(el=>{
      if(!el) return;
      el.textContent = texto || '';
      if(tipo) el.dataset.status = tipo; else delete el.dataset.status;
    });
  }

  function tituloConfig(texto){
    const el = $('settingsLocationTitle');
    if(el) el.textContent = texto;
  }

  function setBotoesBloqueados(bloqueado){
    const principal = $('locationOnboardingEnable');
    const config = $('settingsLocationBtn');
    const later = $('locationOnboardingLater');
    if (principal) {
      principal.disabled = false;
      principal.textContent = bloqueado ? 'Tentar novamente' : 'Ativar localização';
    }
    if (config) {
      config.disabled = false;
      config.textContent = bloqueado ? 'Tentar novamente' : 'Ativar localização';
    }
    if (later) later.textContent = bloqueado ? 'Continuar sem localização' : 'Agora não';
  }

  function abrir(){
    const el = $('locationOnboardingBackdrop');
    if(el) el.style.display = 'flex';
  }

  function fechar(){
    const el = $('locationOnboardingBackdrop');
    if(el) el.style.display = 'none';
  }

  async function estadoPermissao(){
    try { return await global.PacoteEMatoLocalizacaoAtual?.permissao?.() || 'desconhecida'; }
    catch(_){ return 'desconhecida'; }
  }

  async function atualizarStatus(){
    const p = await estadoPermissao();
    if(p === 'granted'){
      tituloConfig('Localização permitida');
      statusUI('O Pacote É Mato pode usar sua posição durante a rota.', 'ok');
      setBotoesBloqueados(false);
      try{
        localStorage.setItem(KEY_OK,'1');
        sessionStorage.removeItem(KEY_BLOCKED_SESSION);
      }catch(_){}
      return p;
    }
    if(p === 'denied'){
      tituloConfig('Localização bloqueada pelo Android/WebView');
      statusUI('A permissão nativa está bloqueada nesta versão do app. Você pode continuar sem localização e ativar isso quando o WebView Android for atualizado.', 'error');
      setBotoesBloqueados(true);
      try{ sessionStorage.setItem(KEY_BLOCKED_SESSION,'1'); }catch(_){}
      return p;
    }
    tituloConfig('Localização ainda não autorizada');
    statusUI('Toque em Ativar localização para solicitar a permissão ao aparelho.', 'warning');
    setBotoesBloqueados(false);
    return p;
  }

  async function solicitar(){
    if(verificando) return false;
    verificando = true;
    const botoes = [$('locationOnboardingEnable'), $('settingsLocationBtn')].filter(Boolean);
    botoes.forEach(b=>b.disabled=true);
    tituloConfig('Solicitando localização...');
    statusUI('Aguardando a resposta do Android/WebView.', 'warning');
    try{
      const pos = await global.PacoteEMatoLocalizacaoAtual?.obter?.({forcar:true});
      if(!pos) throw new Error('O aparelho não retornou uma posição válida.');
      try{
        localStorage.setItem(KEY_OK,'1');
        sessionStorage.removeItem(KEY_LATER_SESSION);
        sessionStorage.removeItem(KEY_BLOCKED_SESSION);
      }catch(_){}
      tituloConfig('Localização permitida');
      statusUI('Localização ativada com sucesso.', 'ok');
      setBotoesBloqueados(false);
      global.notificar?.('Localização ativada.');
      setTimeout(fechar, 350);
      return true;
    }catch(erro){
      const code = String(erro?.code || '');
      if(code === 'GEO_NEGADA'){
        tituloConfig('Localização bloqueada pelo Android/WebView');
        statusUI('O app tentou pedir a localização, mas o WebView não liberou a permissão nativa. Você não precisa ficar tocando novamente: continue sem localização por enquanto.', 'error');
        setBotoesBloqueados(true);
        try{ sessionStorage.setItem(KEY_BLOCKED_SESSION,'1'); }catch(_){}
      }else if(code === 'CONTEXTO_INSEGURO'){
        tituloConfig('Localização indisponível');
        statusUI('A localização exige uma conexão segura HTTPS.', 'error');
      }else{
        tituloConfig('Não foi possível ativar');
        statusUI(erro?.message || 'Não foi possível obter a localização agora.', 'error');
      }
      return false;
    }finally{
      verificando=false;
      botoes.forEach(b=>b.disabled=false);
    }
  }

  async function talvezMostrarPrimeiraVez(){
    if(!telaPrincipalLiberada()) return;
    const p = await atualizarStatus();
    if(p === 'granted') return;
    try{
      if(localStorage.getItem(KEY_OK)==='1') return;
      if(sessionStorage.getItem(KEY_LATER_SESSION)==='1') return;
      if(sessionStorage.getItem(KEY_BLOCKED_SESSION)==='1') return;
    }catch(_){}
    abrir();
  }

  function continuarSemLocalizacao(){
    try{ sessionStorage.setItem(KEY_LATER_SESSION,'1'); }catch(_){}
    fechar();
  }

  function bind(){
    $('locationOnboardingEnable')?.addEventListener('click', solicitar);
    $('settingsLocationBtn')?.addEventListener('click', solicitar);
    $('locationOnboardingLater')?.addEventListener('click', continuarSemLocalizacao);

    global.addEventListener('pemato:localizacao-atual', atualizarStatus);
    global.addEventListener('pemato:resume', atualizarStatus);
    document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) atualizarStatus(); });

    atualizarStatus();
    talvezMostrarPrimeiraVez();
    observador = setInterval(()=>{
      if(telaPrincipalLiberada()){
        clearInterval(observador);
        observador=null;
        setTimeout(talvezMostrarPrimeiraVez, 350);
      }
    }, 500);
    setTimeout(()=>{ if(observador){clearInterval(observador);observador=null;} }, 120000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', bind, {once:true});
  else bind();

  global.PacoteEMatoLocalizacaoUI = Object.freeze({ solicitar, atualizarStatus, abrir, fechar, continuarSemLocalizacao });
})(window);
