(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const API = String(window.PEMATO_ADMIN_GATEWAY_URL || '').replace(/\/+$/,'');
  const SESSION_KEY = 'pemato_admin_session_v2';
  const EMAIL_KEY = 'pemato_admin_email_v2';
  const EXPIRY_KEY = 'pemato_admin_expira_v2';
  let token = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem('pemato_admin_session_v1') || '';
  let ownerEmail = localStorage.getItem(EMAIL_KEY) || sessionStorage.getItem('pemato_admin_email_v1') || '';
  let tokenExpiraEm = Number(localStorage.getItem(EXPIRY_KEY) || 0);
  let usuarios = [], pagamentos = [];
  let clientFilter = 'todos';
  const DAY = 86400000;

  const CATEGORY_ORDER = ['mensal','trimestral','semanal','teste','vitalicio','expirados','bloqueados','outros'];
  const CATEGORY_LABEL = {
    mensal:'Mensal', trimestral:'Trimestral', semanal:'Semanal', teste:'Teste grátis',
    vitalicio:'Vitalícios', expirados:'Expirados', bloqueados:'Bloqueados', outros:'Outros acessos'
  };

  function toast(msg){ const el=$('toast'); el.textContent=msg; el.hidden=false; clearTimeout(toast.t); toast.t=setTimeout(()=>el.hidden=true,2600); }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function expiry(u){
    const v=u?.expiraEm??u?.fimAcesso??u?.expiration??0;
    if(v?.toMillis)return v.toMillis();
    if(v?.seconds)return Number(v.seconds)*1000;
    const n=Number(v); if(Number.isFinite(n)&&n>0)return n<1e12?n*1000:n;
    const d=Date.parse(v||''); if(Number.isFinite(d))return d;
    const days=Number(u?.duracaoDias||0), start=Number(u?.ativadoEm||u?.criadoEm||0);
    return days>0&&start>0 ? start+(days*DAY) : 0;
  }
  function vitalicio(u){return u?.vitalicio===true || /vital[ií]cio/i.test(String(u?.plano||'')) || Number(u?.duracaoDias||0)>=3600;}
  function ativo(u){
    if(u?.bloqueado)return false;
    if(vitalicio(u))return true;
    const exp=expiry(u);
    if(exp>0)return exp>Date.now();
    return u?.ativo===true;
  }
  function status(u){if(u?.bloqueado)return 'Bloqueado'; if(vitalicio(u))return 'Vitalício'; if(ativo(u))return 'Ativo'; return 'Expirado';}
  function planCategory(u){
    if(vitalicio(u))return 'vitalicio';
    if(u?.tipo==='teste'||/teste|gr[aá]tis|trial/i.test(String(u?.plano||'')))return 'teste';
    const name=String(u?.plano||'').toLowerCase(), days=Number(u?.duracaoDias||0);
    if(/trimestr|3\s*mes|90\s*d/i.test(name)||days===90||days===93)return 'trimestral';
    if(/semanal|7\s*d/i.test(name)||days===7)return 'semanal';
    if(/mensal|1\s*m[eê]s|30\s*d/i.test(name)||days===30||days===33)return 'mensal';
    return 'outros';
  }
  function clientCategory(u){
    if(u?.bloqueado===true)return 'bloqueados';
    if(!ativo(u))return 'expirados';
    return planCategory(u);
  }
  function planLabel(u){
    const p=planCategory(u);
    if(p==='outros')return String(u?.plano||u?.tipo||'Acesso personalizado');
    if(p==='vitalicio')return 'Vitalício';
    return CATEGORY_LABEL[p]||String(u?.plano||u?.tipo||'Acesso');
  }
  function daysInfo(u){
    if(u?.bloqueado===true)return {text:'Acesso bloqueado',cls:'blocked'};
    if(vitalicio(u))return {text:'Sem vencimento',cls:'lifetime'};
    const exp=expiry(u), now=Date.now();
    if(!exp)return {text:ativo(u)?'Ativo · sem vencimento cadastrado':'Expirado · sem data cadastrada',cls:ativo(u)?'active':'expired'};
    if(exp>now){
      const d=Math.max(1,Math.ceil((exp-now)/DAY));
      return {text:`${d} ${d===1?'dia restante':'dias restantes'}`,cls:d<=7?'warning':'active'};
    }
    const d=Math.floor((now-exp)/DAY);
    return {text:d<1?'Expirou hoje':`Expirou há ${d} ${d===1?'dia':'dias'}`,cls:'expired'};
  }
  function expiryLabel(u){
    if(vitalicio(u))return 'Sem prazo de vencimento';
    const e=expiry(u);
    return e ? `Vence em ${new Date(e).toLocaleDateString('pt-BR')}` : 'Sem vencimento cadastrado';
  }
  function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function requireApi(){ if(!API){ $('loginError').hidden=false; $('loginError').textContent='Gateway administrativo ainda não configurado. Edite admin/config.js após publicar o Worker seguro.'; return false;} return true; }
  async function req(path,opt={}){
    if(!requireApi()) throw new Error('Gateway não configurado');
    const headers={...(opt.headers||{})}; if(token) headers.Authorization=`Bearer ${token}`; if(opt.body&&!headers['Content-Type'])headers['Content-Type']='application/json';
    const r=await fetch(`${API}${path}`,{...opt,headers,cache:'no-store'}); let d={}; try{d=await r.json();}catch(_){ }
    if(r.status===401){logout(false); throw new Error('Sessão expirada. Entre novamente.');}
    if(!r.ok||d.sucesso===false||d.ok===false)throw new Error(d.erro||d.error||`Falha (${r.status})`); return d;
  }
  async function login(email,pin){
    const d=await req('/admin/login',{method:'POST',body:JSON.stringify({email,pin})});
    token=d.token||d.adminToken||'';
    if(!token) throw new Error('O Worker aceitou o login, mas não retornou a sessão administrativa.');
    ownerEmail=d.email||email;
    tokenExpiraEm=Number(d.expiraEm||(Date.now()+12*60*60*1000));
    localStorage.setItem(SESSION_KEY,token); localStorage.setItem(EMAIL_KEY,ownerEmail); localStorage.setItem(EXPIRY_KEY,String(tokenExpiraEm));
    sessionStorage.removeItem('pemato_admin_session_v1'); sessionStorage.removeItem('pemato_admin_email_v1');
    showApp(); await refresh();
  }
  function logout(reload=true){
    token=''; ownerEmail=''; tokenExpiraEm=0;
    localStorage.removeItem(SESSION_KEY); localStorage.removeItem(EMAIL_KEY); localStorage.removeItem(EXPIRY_KEY);
    sessionStorage.removeItem('pemato_admin_session_v1'); sessionStorage.removeItem('pemato_admin_email_v1');
    if(reload)location.reload();
  }
  function showApp(){ $('loginView').hidden=true;$('appView').hidden=false;$('ownerIdentity').textContent=ownerEmail; }
  function showLogin(){ $('loginView').hidden=false;$('appView').hidden=true; }

  async function refresh(){
    try{
      const [u,p]=await Promise.all([req('/api/admin/usuarios'),req('/api/admin/pagamentos')]);
      usuarios=Array.isArray(u.usuarios)?u.usuarios:(Array.isArray(u)?u:[]);
      pagamentos=Array.isArray(p.pagamentos)?p.pagamentos:[];
      renderAll(); toast('Dados atualizados');
    }catch(e){toast(e.message);}
  }
  function renderAll(){
    const ativos=usuarios.filter(ativo), exp=usuarios.filter(u=>!u.bloqueado&&!ativo(u)), bloq=usuarios.filter(u=>u.bloqueado), vit=usuarios.filter(vitalicio);
    $('metricTotal').textContent=usuarios.length; $('metricAtivos').textContent=ativos.length; $('metricExpirados').textContent=exp.length;
    $('metricBloqueados').textContent=bloq.length; $('metricVitalicios').textContent=vit.length;
    $('metricRevenue').textContent=money(pagamentos.reduce((s,p)=>s+Number(p.valor||p.amount||0),0));
    renderCategoryCounts(); renderClients(); renderRecent(); renderPayments();
  }
  function renderCategoryCounts(){
    const counts={todos:usuarios.length,mensal:0,trimestral:0,semanal:0,teste:0,vitalicio:0,expirados:0,bloqueados:0,outros:0};
    usuarios.forEach(u=>{const c=clientCategory(u); counts[c]=(counts[c]||0)+1;});
    const ids={todos:'countTodos',mensal:'countMensal',trimestral:'countTrimestral',semanal:'countSemanal',teste:'countTeste',vitalicio:'countVitalicio',expirados:'countExpirados',bloqueados:'countBloqueados'};
    Object.entries(ids).forEach(([k,id])=>{if($(id))$(id).textContent=counts[k]||0;});
  }
  function clientHtml(u){
    const id=String(u.whatsapp||u.id||''), em=String(u.email||''), st=status(u), d=daysInfo(u), cat=clientCategory(u);
    return `<article class="client" data-category="${esc(cat)}"><div class="client-main"><div class="client-title-row"><strong>${esc(id||em||'Conta')}</strong><span class="plan-badge plan-${esc(planCategory(u))}">${esc(planLabel(u))}</span></div><span>${esc(em||'E-mail não cadastrado')}</span><div class="client-time ${esc(d.cls)}"><strong>${esc(d.text)}</strong><small>${esc(expiryLabel(u))}</small></div><span class="badge ${u.bloqueado?'blocked':cat==='expirados'?'expired':''}">${esc(st)}</span></div><div class="client-actions"><button data-client="${esc(id)}">Gerenciar</button></div></article>`;
  }
  function queryMatches(u){
    const q=String($('clientSearch')?.value||'').toLowerCase().trim();
    if(!q)return true;
    return `${u.whatsapp||u.id||''} ${u.email||''} ${u.plano||''} ${u.tipo||''}`.toLowerCase().includes(q);
  }
  function filtered(){return usuarios.filter(u=>queryMatches(u)&&(clientFilter==='todos'||clientCategory(u)===clientFilter));}
  function renderClients(){
    const list=filtered();
    const root=$('clientsList');
    if(!list.length){root.innerHTML='<p class="muted">Nenhuma conta encontrada nesta categoria.</p>';return;}
    const groups={}; CATEGORY_ORDER.forEach(k=>groups[k]=[]); list.forEach(u=>(groups[clientCategory(u)]||(groups[clientCategory(u)]=[])).push(u));
    const keys=clientFilter==='todos'?CATEGORY_ORDER:[clientFilter];
    root.innerHTML=keys.filter(k=>groups[k]?.length).map(k=>{
      const items=groups[k].slice().sort((a,b)=>{
        if(k==='expirados')return expiry(b)-expiry(a);
        if(k==='vitalicio')return String(a.whatsapp||a.id||'').localeCompare(String(b.whatsapp||b.id||''));
        return expiry(a)-expiry(b);
      });
      return `<section class="client-group group-${esc(k)}"><header><div><span class="eyebrow">${esc(CATEGORY_LABEL[k]||k)}</span><h4>${esc(CATEGORY_LABEL[k]||k)}</h4></div><strong>${items.length}</strong></header><div class="client-list">${items.map(clientHtml).join('')}</div></section>`;
    }).join('');
    bindClientButtons(root);
  }
  function renderRecent(){
    const ordered=usuarios.slice().sort((a,b)=>(Number(b.atualizadoEm||b.criadoEm||0)-Number(a.atualizadoEm||a.criadoEm||0))).slice(0,6);
    $('recentClients').innerHTML=ordered.map(clientHtml).join('')||'<p class="muted">Nenhuma conta encontrada.</p>'; bindClientButtons($('recentClients'));
  }
  function renderPayments(){$('paymentsList').innerHTML=pagamentos.map(p=>`<article class="payment"><div><strong>${esc(p.whatsapp||p.email||'Pagamento')}</strong><small>${esc(p.plano||'')} · ${esc(p.data||p.createdAt||'')}</small></div><strong>${money(p.valor||p.amount)}</strong></article>`).join('')||'<p class="muted">Nenhum pagamento registrado.</p>';}
  function bindClientButtons(root){root.querySelectorAll('[data-client]').forEach(b=>b.onclick=()=>openClient(b.dataset.client));}
  function openClient(id){
    const u=usuarios.find(x=>String(x.whatsapp||x.id||'')===String(id)); if(!u)return;
    const d=daysInfo(u);
    $('modalTitle').textContent=u.whatsapp||u.email||'Gerenciar conta';
    $('modalBody').innerHTML=`<div class="modal-grid"><div class="modal-account-summary"><strong>${esc(planLabel(u))}</strong><span class="client-time ${esc(d.cls)}">${esc(d.text)}</span><small>${esc(expiryLabel(u))}</small></div><p class="muted">${esc(u.email||'Sem e-mail')}<br>${esc(status(u))}</p><label>Adicionar/remover dias<input id="mDays" type="number" value="30" min="-3650" max="3650"></label><div class="modal-actions"><button id="mAdjust" class="primary">Aplicar dias</button><button id="mReset" class="ghost">Resetar aparelho</button><button id="mBlock" class="ghost">${u.bloqueado?'Desbloquear':'Bloquear'}</button><button id="mDelete" class="ghost danger">Excluir conta</button></div></div>`;
    $('modal').hidden=false;
    $('mAdjust').onclick=()=>clientAction('/api/admin/ajustar-dias',{whatsapp:id,dias:Number($('mDays').value||0)});
    $('mReset').onclick=()=>clientAction('/api/admin/resetar-aparelho',{whatsapp:id});
    $('mBlock').onclick=()=>clientAction('/api/admin/bloqueio',{whatsapp:id,bloqueado:!u.bloqueado});
    $('mDelete').onclick=async()=>{const b=$('mDelete');if(b.dataset.confirmDelete!=='1'){b.dataset.confirmDelete='1';b.textContent='Clique novamente para excluir';setTimeout(()=>{if(b&&b.dataset.confirmDelete==='1'){delete b.dataset.confirmDelete;b.textContent='Excluir conta';}},5000);return;}delete b.dataset.confirmDelete;await clientAction('/api/admin/excluir-usuario',{whatsapp:id});};
  }
  async function clientAction(path,body){try{await req(path,{method:'POST',body:JSON.stringify(body)});$('modal').hidden=true;await refresh();}catch(e){toast(e.message);}}
  function switchView(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));document.querySelectorAll('.sidebar nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('pageTitle').textContent={dashboard:'Dashboard',clientes:'Clientes',pagamentos:'Pagamentos',comunicados:'Comunicados',seguranca:'Segurança'}[name]||name;document.querySelector('.sidebar').classList.remove('open');}
  function setClientFilter(value){clientFilter=value||'todos';document.querySelectorAll('[data-client-filter]').forEach(b=>b.classList.toggle('active',b.dataset.clientFilter===clientFilter));renderClients();}

  $('loginForm').addEventListener('submit',async e=>{e.preventDefault();$('loginError').hidden=true;const btn=$('loginBtn');btn.disabled=true;try{await login($('ownerEmail').value.trim(),$('ownerPin').value.trim());$('ownerPin').value='';}catch(err){$('loginError').hidden=false;$('loginError').textContent=err.message;}finally{btn.disabled=false;}});
  $('logoutBtn').onclick=()=>logout(); $('refreshBtn').onclick=refresh; $('menuBtn').onclick=()=>document.querySelector('.sidebar').classList.toggle('open'); $('modalClose').onclick=()=>$('modal').hidden=true; $('modal').onclick=e=>{if(e.target===$('modal'))$('modal').hidden=true;};
  document.querySelectorAll('.sidebar nav button').forEach(b=>b.onclick=()=>switchView(b.dataset.view)); document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>switchView(b.dataset.go));
  $('clientSearch').oninput=renderClients; document.querySelectorAll('[data-client-filter]').forEach(b=>b.onclick=()=>setClientFilter(b.dataset.clientFilter));
  $('broadcastSend').onclick=async()=>{try{const mensagem=$('broadcastText').value.trim();if(!mensagem)throw new Error('Digite a mensagem do comunicado.');await req('/api/admin/broadcast',{method:'POST',body:JSON.stringify({ativo:true,mensagem,horas:Number($('broadcastHours').value)})});toast('Comunicado publicado');}catch(e){toast(e.message);}};
  $('broadcastClear').onclick=async()=>{try{await req('/api/admin/broadcast',{method:'POST',body:JSON.stringify({ativo:false,mensagem:'',horas:0})});$('broadcastText').value='';toast('Comunicado removido');}catch(e){toast(e.message);}};

  (async()=>{
    if(tokenExpiraEm&&tokenExpiraEm<=Date.now()){logout(false);showLogin();return;}
    if(!token){showLogin();return;}
    try{
      if(!requireApi())return;
      const d=await req('/session/check'); ownerEmail=d.email||ownerEmail; tokenExpiraEm=Number(d.expiraEm||tokenExpiraEm||0);
      localStorage.setItem(SESSION_KEY,token); localStorage.setItem(EMAIL_KEY,ownerEmail); if(tokenExpiraEm)localStorage.setItem(EXPIRY_KEY,String(tokenExpiraEm));
      sessionStorage.removeItem('pemato_admin_session_v1'); sessionStorage.removeItem('pemato_admin_email_v1'); showApp(); await refresh();
    }catch(_){showLogin();}
  })();
})();
