'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
 try{
  for(const width of [360,412]){
   const page=await browser.newPage({viewport:{width,height:800},isMobile:true,hasTouch:true});
   const css=['css/style.css','css/app-shell.css','css/theme-v15.css','css/navegacao.css'].map(read).join('\n');
   await page.setContent('<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head>'+
   '<body data-pemato-nav-mode="navigation-active" data-pemato-module="navegacao"><main class="pemato-module navigation-module" style="display:block">'+
   '<div class="navigation-shell"><div class="navigation-map-wrap" style="background:#e3e9ed"><div class="nav-map-controls"><button id="navFollowBtn">Recentralizar</button></div></div>'+
   '<aside class="navigation-panel is-collapsed" data-internal="true">'+
   '<section class="nav-next-card"><strong>PARADA 01</strong><h3>Rua das Flores, 123</h3></section>'+
   '<div class="nav-delivery-actions"><button id="navNavigateBtn">Navegar</button><button id="navNotDeliveredBtn" class="pemato-danger">Não entregue</button>'+
   '<button id="navDeliveredBtn" class="pemato-primary">Entregue</button></div></aside></div></main></body></html>');
   const state=await page.evaluate(()=>{
    const red=document.getElementById('navNotDeliveredBtn'),green=document.getElementById('navDeliveredBtn');
    const r=red.getBoundingClientRect(),g=green.getBoundingClientRect();
    return {redBackground:getComputedStyle(red).backgroundColor,redText:getComputedStyle(red).color,
      greenBackground:getComputedStyle(green).backgroundColor,greenText:getComputedStyle(green).color,
      redWidth:r.width,greenWidth:g.width,redClipped:red.scrollWidth>red.clientWidth+1,
      redText: red.textContent, screen:innerWidth};
   });
   assert.equal(state.redBackground,'rgb(220, 38, 38)','Vermelho');
   assert.equal(state.greenBackground,'rgb(5, 150, 105)','Verde');
   assert.equal(state.greenText,'rgb(255, 255, 255)','Texto do Entregue');
   assert.equal(state.redClipped,false,'Texto Não entregue cortado em '+width);
   // A cor da fonte é inspecionada separadamente: a propriedade redText acima contém o rótulo.
   const textColor=await page.evaluate(()=>getComputedStyle(document.getElementById('navNotDeliveredBtn')).color);
   assert.equal(textColor,'rgb(255, 255, 255)','Não entregue invisível em '+width);
   assert.ok(state.redWidth>width*.40&&state.greenWidth>width*.40,'Botões não ocupam duas metades da tela em '+width);
   assert.ok(Math.abs(state.redWidth-state.greenWidth)<3,'Botões com larguras diferentes em '+width);
   const layout=await page.evaluate(()=>getComputedStyle(document.querySelector('.nav-delivery-actions')).gridTemplateColumns.split(' ').length);
   assert.equal(layout,2,'Tema antigo ainda força três colunas');
   await page.screenshot({path:path.join(root,'artifacts','botoes-v84-'+width+'px.png')});
   const finished=await page.evaluate(()=>{
    document.body.dataset.pematoRouteFinished='true';
    return {panel:getComputedStyle(document.querySelector('.navigation-panel')).display,
      follow:getComputedStyle(document.getElementById('navFollowBtn')).display};
   });
   assert.equal(finished.panel,'none','Painel não some após conclusão');
   assert.notEqual(finished.follow,'none','Recentralização some após conclusão');
   console.log('APROVADO botões '+width+'px',JSON.stringify({...state,redColor:textColor,finished}));
   await page.close();
  }
 } finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
