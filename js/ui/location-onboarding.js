(function iniciarOnboardingLocalizacao(global){
  'use strict';

  const KEY_OK = 'pemato_localizacao_aceita_v60';
  const KEY_LATER_SESSION = 'pemato_localizacao_depois_v60';
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
      try{ localStorage.setItem(KEY_OK,'1'); }catch(_){}
      return p;
    }
    if(p === 'denied'){
      tituloConfig('Localização bloqueada');
      statusUI('A permissão foi bloqueada pelo Android/WebView. Toque em Ativar localização para tentar novamente.', 'error');
      return p;
    }
    tituloConfig('Localização ainda não autorizada');
    statusUI('Toque em Ativar localização para o sistema solicitar a permissão.', 'warning');
    return p;
  }

  async function solicitar(){
    if(verificando) return false;
    verificando = true;
    const botoes = [$('locationOnboardingEnable'), $('settingsLocationBtn')].filter(Boolean);
    botoes.forEach(b=>b.disabled=true);
    tituloConfig('Solicitando localização...');
    statusUI('Aguardando a resposta de permissão do aparelho.', 'warning');
    try{
      const pos = await global.PacoteEMatoLocalizacaoAtual?.obter?.({forcar:true});
      if(!pos) throw new Error('O aparelho não retornou uma posição válida.');
      try{ localStorage.setItem(KEY_OK,'1'); sessionStorage.removeItem(KEY_LATER_SESSION); }catch(_){}
      tituloConfig('Localização permitida');
      statusUI('Localização ativada com sucesso.', 'ok');
      global.notificar?.('Localização ativada.');
      setTimeout(fechar, 450);
      return true;
    }catch(erro){
      const code = String(erro?.code || '');
      if(code === 'GEO_NEGADA'){
        tituloConfig('Localização bloqueada');
        statusUI('O WebView/Android bloqueou a permissão. Quando a versão Android estiver configurada para repassar a permissão, este mesmo botão abrirá a solicitação oficial.', 'error');
      }else if(code === 'CONTEXTO_INSEGURO'){
        tituloConfig('Localização indisponível');
        statusUI('A localização exige uma conexão segura HTTPS.', 'error');
      }else{
        tituloConfig('Não foi possível ativar');
        statusUI(erro?.message || 'Tente novamente em alguns segundos.', 'error');
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
    }catch(_){}
    abrir();
  }

  function bind(){
    $('locationOnboardingEnable')?.addEventListener('click', solicitar);
    $('settingsLocationBtn')?.addEventListener('click', solicitar);
    $('locationOnboardingLater')?.addEventListener('click', ()=>{
      try{ sessionStorage.setItem(KEY_LATER_SESSION,'1'); }catch(_){}
      fechar();
    });

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

  global.PacoteEMatoLocalizacaoUI = Object.freeze({ solicitar, atualizarStatus, abrir, fechar });
})(window);
