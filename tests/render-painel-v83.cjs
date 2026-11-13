'use strict';
const assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
(async()=>{
 const index=read('index.html');
 const paths=[...index.matchAll(/<link rel="stylesheet" href="(css\/[^"?]+)/g)].map(m=>m[1]);
 const styles=paths.map(p=>read(p)).join('\n');
 const a=index.indexOf('<div class="nav-maneuver-card">');
 const b=index.indexOf('<div id="navRouteEta"',a);
 assert.ok(a>=0&&b>a,'Painel real não localizado no HTML');
 const panel=index.slice(a,b);
 fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
   for(const width of [360,412]){
     const page=await browser.newPage({viewport:{width,height:800},deviceScaleFactor:1,isMobile:true,hasTouch:true});
     await page.setContent('<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+styles+'</style></head><body data-pemato-nav-mode="navigation-active"><main id="moduloNavegacao" class="pemato-module navigation-module" style="display:block"><div class="navigation-shell"><div class="navigation-map-wrap" style="height:100vh;background:#edf1f5">'+panel+'</div></div></main></body></html>');
     await page.evaluate(()=>{
       document.getElementById('navManeuverIcon').innerHTML='<svg viewBox="0 0 64 64"><path d="M18 54V38c0-10 7-17 17-17h16M40 10l11 11-11 11" stroke="currentColor" stroke-width="6" fill="none"/></svg>';
       document.getElementById('navManeuverText').textContent='Vire à direita';
       document.getElementById('navManeuverDistance').textContent='238 m';
       document.getElementById('navManeuverStreet').textContent='Rua Doutor Brasílio Machado';
     });
     const result=await page.evaluate(()=>{
       const c=document.querySelector('.nav-maneuver-card'), d=document.querySelector('#navManeuverDistance'), s=document.querySelector('#navManeuverStreet');
       const style=getComputedStyle(c),sd=getComputedStyle(d),ss=getComputedStyle(s);
       return {panelColor:style.backgroundColor,distanceColor:sd.color,streetColor:ss.color,cardWidth:c.getBoundingClientRect().width,screenWidth:innerWidth,streetClipped:s.scrollHeight>s.clientHeight+3 || s.scrollWidth>s.clientWidth+3};
     });
     assert.equal(result.panelColor,'rgb(13, 27, 42)','O painel não está escuro em '+width+'px');
     assert.equal(result.distanceColor,'rgb(255, 255, 255)','A distância não está branca em '+width+'px');
     assert.equal(result.streetColor,'rgb(159, 220, 255)','A rua não está azul-clara em '+width+'px');
     assert.ok(!result.streetClipped,'Nome da rua cortado em '+width+'px');
     assert.ok(result.cardWidth<=width+1,'Painel sai da tela em '+width+'px');
     await page.screenshot({path:path.join(root,'artifacts', 'painel-v83-'+width+'px.png'),fullPage:false});
     console.log('APROVADO Android '+width+'px:',result);
     await page.close();
   }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
