'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
  fs.mkdirSync(path.join(root,'artifacts'),{recursive:true});
  try{
    const page=await browser.newPage({viewport:{width:412,height:915},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css" rel="stylesheet"></head><body style="margin:0"><div id="map" style="position:absolute;inset:0"></div></body></html>');
    await page.addScriptTag({url:'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js'});
    await page.addScriptTag({content:read('js/mapa/config.js')});
    assert.ok(await page.evaluate(()=>!!window.maplibregl&&!!window.PacoteEMatoMapaConfig));
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.evaluate(()=>{
      const map=new maplibregl.Map({
        container:'map',style:window.PEMATO_MAP_CONFIG.mapStyleUrl,
        center:[-46.629,-23.553],zoom:16.5,pitch:0,bearing:0,
        antialias:true,interactive:false,preserveDrawingBuffer:true
      });
      window.__mapForTest=map;
      window.__mapStyleReady=false;
      map.on('load',()=>{
        window.PacoteEMatoMapaConfig.aplicarEstiloNavegacaoAtiva(map);
        window.__mapStyleReady=true;
      });
    });
    await page.waitForFunction(()=>window.__mapStyleReady===true,{timeout:45000});
    await page.waitForTimeout(5000);
    const info=await page.evaluate(()=>{
      const map=window.__mapForTest;
      return {loaded:map.loaded(),style:map.getStyle().name||'',layers:map.getStyle().layers.length,roadLayers:map.getStyle().layers.filter(l=>l.type==='line'&&/transportation|road|street/i.test(l.id+' '+(l['source-layer']||''))).length};
    });
    assert.ok(info.roadLayers>0,'Mapa vetorial sem ruas: '+JSON.stringify(info));
    assert.equal(errors.length,0,'Erros no console: '+errors.join(' | '));
    await page.screenshot({path:path.join(root,'artifacts','cartografia-v83-2d.png')});
    await page.evaluate(()=>window.__mapForTest.easeTo({pitch:56,duration:0}));
    await page.waitForTimeout(1200);
    await page.screenshot({path:path.join(root,'artifacts','cartografia-v83-3d.png')});
    console.log('APROVADO cartografia vetorial em Chromium',JSON.stringify(info));
    await page.close();
  }finally{await browser.close();}
})().catch(err=>{console.error('FALHOU cartografia visual',err);process.exitCode=1;});
