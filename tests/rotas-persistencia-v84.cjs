'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const html='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Teste V84</title></head><body data-pemato-module="historico">'+
 '<select id="historyFilter"><option value="todos" selected>Todas</option></select>'+
 '<div id="historyRoutesList"></div><section id="routingAvailableRoutes"></section>'+
 '<div id="routeHistoryDetailModal" style="display:none"><div id="routeHistoryDetailBody"></div><button id="routeHistoryDetailClose">Fechar</button></div>'+
 '<script>window.appState={roteirizacao:{},navegacao:{}}; window.__confirm=true;window.__modules=[];'+
 'window.PacoteEMatoDialog={confirmar:async()=>window.__confirm};'+
 'window.PacoteEMatoAppShell={abrirModulo:async m=>window.__modules.push(m)};window.notificar=()=>{};</script>'+
 '<script src="/js/core/rota-store.js"></script><script src="/js/historico/historico-rotas.js"></script></body></html>';
const server=http.createServer((req,res)=>{
 if(req.url==='/'||req.url==='/index.html'){res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});res.end(html);return;}
 const known=['/js/core/rota-store.js','/js/historico/historico-rotas.js'];
 if(!known.includes(req.url)){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type':'text/javascript;charset=utf-8'});
 res.end(fs.readFileSync(path.join(root,req.url.slice(1))));
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errs=[];page.on('pageerror',e=>errs.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  const before=await page.evaluate(async()=>{
   const store=window.PacoteEMatoRotaStore, history=window.PacoteEMatoHistorico;
   const stop=(id,status,address)=>({
    id, enderecoOriginal:address,statusEntrega:status,
    entregueEm:status==='entregue'?1111:null,naoEntregueEm:status==='nao_entregue'?2222:null,
    motivoNaoEntrega:status==='nao_entregue'?'Destinatário ausente':'',
    latitude:-23.55,longitude:-46.63,pacotes:[id+'-BR']
   });
   const options={ativa:false,exigirPersistenciaLocal:true,firestore:false};
   await store.salvarRota(store.criarRota({id:'rota01',nome:'Rota 01',status:'concluida',concluidoEm:1700000000000,ordem:['a','b'],
     paradas:[stop('a','entregue','Rua A, 100'),stop('b','nao_entregue','Rua B, 200')]}),options);
   await store.salvarRota(store.criarRota({id:'rota02',nome:'Rota 02',status:'concluida',concluidoEm:1700000002000,ordem:['c'],
     paradas:[stop('c','entregue','Rua C, 300')]}),options);
   await store.salvarRota(store.criarRota({id:'rota03',nome:'Rota 03',status:'planejamento',ordem:['d'],
     paradas:[stop('d','pendente','Rua D, 400')]}),options);
   await history.renderizar();
   await history.abrirNoMapa('rota01'); // consulta, não ativa
   const afterView=await store.obterRotaAtiva();
   const html=document.getElementById('routeHistoryDetailBody').textContent;
   const forbidden=await store.ativarRotaExistente('rota02');
   return {noActivation:afterView===null,html,forbidden:forbidden===null,modules:window.__modules.slice()};
  });
  assert.ok(before.noActivation,'Consultar conclusão ativou rota');
  assert.ok(before.forbidden,'Store ativou outra rota concluída');
  assert.ok(before.html.includes('Não entregue')&&before.html.includes('Entregue')&&before.html.includes('Rua B, 200'),'Histórico não mostra status e endereços');
  assert.ok(before.html.includes('DESFAZER'),'Falta botão DESFAZER');
  assert.equal(before.modules.length,0,'Consulta abriu módulo de navegação');
  const result=await page.evaluate(async()=>{
    const store=window.PacoteEMatoRotaStore,h=window.PacoteEMatoHistorico;
    window.__confirm=false;
    const cancelled=await h.desfazerConclusaoRota('rota01');
    const afterCancel=await store.obterRota('rota01');
    window.__confirm=true;
    const ok=await h.desfazerConclusaoRota('rota01');
    const [one,two,three,active,all]=await Promise.all([
      store.obterRota('rota01'),store.obterRota('rota02'),store.obterRota('rota03'),
      store.obterRotaAtiva(),store.listarRotas({firestore:false})
    ]);
    await h.renderizarDisponiveis();
    return {cancelled,cancelStillComplete:afterCancel.status==='concluida',ok,
      one,two,three,activeId:active?.id||null,count:all.length,
      availableText:document.getElementById('routingAvailableRoutes').textContent,
      moduleCalls:window.__modules};
  });
  assert.equal(result.cancelled,false);
  assert.equal(result.cancelStillComplete,true);
  assert.equal(result.ok,true);
  assert.equal(result.one.status,'planejamento');
  assert.equal(result.two.status,'concluida');
  assert.equal(result.three.status,'planejamento');
  assert.equal(result.count,3,'Não criar rota duplicada');
  assert.equal(result.activeId,null,'Desfazer não pode iniciar rota');
  assert.ok(result.one.paradas.every(p=>p.statusEntrega==='pendente'));
  assert.equal(result.one.historicoExecucoes.length,1,'Guardar auditoria única');
  assert.deepEqual(result.one.historicoExecucoes[0].paradas.map(p=>p.statusEntrega),['entregue','nao_entregue']);
  assert.equal(result.one.historicoExecucoes[0].paradas[1].motivoNaoEntrega,'Destinatário ausente');
  assert.ok(result.availableText.includes('Rota 01')&&result.availableText.includes('Rota 03'));
  assert.ok(!result.availableText.includes('Rota 02'),'Concluída não deve aparecer em disponíveis');
  assert.equal(result.moduleCalls.length,0);
  await page.reload();
  const reload=await page.evaluate(async()=>{
   const s=window.PacoteEMatoRotaStore,h=window.PacoteEMatoHistorico;
   const [one,two,active,all]=await Promise.all([s.obterRota('rota01'),s.obterRota('rota02'),s.obterRotaAtiva(),s.listarRotas({firestore:false})]);
   await h.abrirNoMapa('rota02'); // apenas consulta
   const still=await s.obterRotaAtiva();
   await h.abrirNoMapa('rota01'); // seleção manual
   const selected=await s.obterRotaAtiva();
   return {one,two,activeId:active?.id||null,stillId:still?.id||null,
     selectedId:selected?.id||null,count:all.length,modules:window.__modules};
  });
  assert.equal(reload.one.status,'planejamento','Status perdeu-se no reload');
  assert.equal(reload.two.status,'concluida','Rota 02 reativada no reload');
  assert.equal(reload.count,3);
  assert.equal(reload.activeId,null);
  assert.equal(reload.stillId,null);
  assert.equal(reload.selectedId,'rota01','Abertura manual não ativa rota disponível');
  assert.ok(!reload.modules.includes('navegacao'),'Abertura manual não deve iniciar navegação');
  assert.equal(reload.one.historicoExecucoes.length,1);
  assert.deepEqual(errs,[],'Erros JS no browser: '+errs.join(' | '));
  console.log('APROVADO V84: IndexedDB real, consulta sem ativação, 3 rotas isoladas, DESFAZER confirmado/cancelado, status e auditoria persistem no reload, sem duplicação.');
  await page.close();
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(err=>{console.error(err);process.exitCode=1;server.close();});
