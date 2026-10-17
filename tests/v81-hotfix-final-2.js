'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const ok=(c,m)=>{if(!c) throw new Error(m); console.log('OK  '+m)};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const hashText=t=>crypto.createHash('sha256').update(t).digest('hex');

// 1) REGRA DEFINITIVA FINAL 3: agrupamento físico mudou por decisão explícita.
// Bipagem e otimização continuam protegidas por hash; complementos deixam de decidir parada.
const app=fs.readFileSync(path.join(ROOT,'js/app.js'),'utf8');
const protectedHashes={
 'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
 'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
 'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610',
 'js/roteirizacao/roteirizacao.js':'b5f80a0fc471d8297c0cd326b944f3eff2f3156d36237e52e0919fc3ed8f91f4'
};
for(const [rel,h] of Object.entries(protectedHashes)) ok(sha(path.join(ROOT,rel))===h,'hash protegido: '+rel);
ok(/const chave = chaveBase;/.test(app),'chave física ignora apartamento/bloco/torre e usa somente a base');
ok(/detalhesEntregasPorEndereco/.test(app),'complementos continuam preservados para exibição');
ok(!/const chave = `\$\{chaveBase\}\|u:/.test(app),'não existe mais unidade anexada à chave física');

// 2) Mapa clean real contra um mock de layers Liberty-like.
const config=fs.readFileSync(path.join(ROOT,'js/mapa/config.js'),'utf8');
const layers=[
 {id:'background',type:'background'},
 {id:'water',type:'fill','source-layer':'water'},
 {id:'park',type:'fill','source-layer':'park'},
 {id:'building',type:'fill','source-layer':'building'},
 {id:'road-residential',type:'line','source-layer':'transportation'},
 {id:'road-primary',type:'line','source-layer':'primary'},
 {id:'road-label',type:'symbol','source-layer':'transportation_name'},
 {id:'road-shield',type:'symbol','source-layer':'highway_ref'},
 {id:'place-neighbourhood',type:'symbol','source-layer':'place'},
 {id:'poi-restaurant',type:'symbol','source-layer':'poi'}
];
const paint=new Map(), layout=new Map();
const map={getStyle:()=>({layers}),getLayer:id=>layers.find(x=>x.id===id),setPaintProperty:(i,k,v)=>paint.set(i+'|'+k,v),getPaintProperty:(i,k)=>paint.get(i+'|'+k),setLayoutProperty:(i,k,v)=>layout.set(i+'|'+k,v),getLayoutProperty:(i,k)=>layout.get(i+'|'+k)};
const cc={window:null,localStorage:{removeItem(){}},CustomEvent:function(){},console};cc.window=cc;vm.createContext(cc);vm.runInContext(config,cc);
const C=cc.PacoteEMatoMapaConfig;
ok(C.aplicarEstiloMapaClean(map,{navegacaoAtiva:false})===true,'aplicarEstiloMapaClean aplica no overview');
ok(paint.get('background|background-color')==='#f3f5f6','fundo clean claro');
ok(paint.get('water|fill-color')==='#e2f0f5','água suave');
ok(paint.get('park|fill-color')==='#edf3ed','parque desaturado');
ok(paint.get('road-label|text-color')==='#303b42' && layout.get('road-label|visibility')==='visible','road labels legíveis e preservados');
ok(layout.get('poi-restaurant|visibility')==='none','POI comercial ocultado');
ok(Number(paint.get('road-shield|text-opacity'))<=0.28,'road shield reduzido');
const widthOverview=JSON.stringify(paint.get('road-primary|line-width'));
C.aplicarEstiloNavegacaoAtiva(map);
ok(paint.get('background|background-color')==='#f3f5f6','navigation-active usa o mesmo mapa base clean');
ok(JSON.stringify(paint.get('road-primary|line-width'))!==widthOverview,'navigation-active reforça moderadamente a via sem trocar identidade');
C.restaurarEstiloMapaOverview(map);
ok(paint.get('background|background-color')==='#f3f5f6','retorno ao overview não restaura mapa colorido');

// 3) Geoapify multi-leg: índices locais reiniciam; globais seguem a geometria achatada 100/70/80.
const svcSrc=fs.readFileSync(path.join(ROOT,'js/roteirizacao/servico-rota.js'),'utf8');
const sc={window:null,console,AbortController,setTimeout,clearTimeout};sc.window=sc;vm.createContext(sc);vm.runInContext(svcSrc,sc);
const S=sc.PacoteEMatoServicoRota;
const line=n=>Array.from({length:n},(_,i)=>[i*0.00001,0]);
const feature={type:'Feature',geometry:{type:'MultiLineString',coordinates:[line(100),line(70),line(80)]},properties:{legs:[
 {steps:[{from_index:10,to_index:20,instruction:{type:'Straight',streets:['Rua 0']}}]},
 {steps:[{from_index:10,to_index:20,instruction:{type:'Right',streets:['Rua 1']}}]},
 {steps:[{from_index:10,to_index:20,instruction:{type:'SlightLeft',streets:['Rua 2']}}]}
]}};
const inst=S.extrairInstrucoes(feature);
ok(inst.length===3,'multi-leg extrai três instruções');
ok(inst[0].globalFromIndex===10 && inst[0].globalToIndex===20,'leg 0 mantém offset 0');
ok(inst[1].fromIndexLeg===10 && inst[1].globalFromIndex===110 && inst[1].globalToIndex===120,'leg 1 soma offset 100');
ok(inst[2].fromIndexLeg===10 && inst[2].globalFromIndex===180 && inst[2].globalToIndex===190,'leg 2 soma offsets 100+70');
ok(inst.map(x=>x.street_name).join('|')==='Rua 0|Rua 1|Rua 2','ruas continuam associadas à leg correta');

// 4) Renderer de manobras reais CamelCase.
const nav=fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
const a=nav.indexOf('  function tipoGeoapifyNormalizado(inst)'); const b=nav.indexOf('  function svgManobra(tipo)',a);
const mc={};vm.createContext(mc);vm.runInContext(nav.slice(a,b).replace(/^  /gm,'')+'\nthis.M=tipoVisualManobra;this.exit=valorSaidaRotatoria;',mc);
const expected={StartAt:'reta',StartAtRight:'direita',StartAtLeft:'esquerda',Straight:'reta',SlightRight:'leve_direita',Right:'direita',SharpRight:'acentuada_direita',TurnAroundRight:'retorno',TurnAroundLeft:'retorno',SharpLeft:'acentuada_esquerda',Left:'esquerda',SlightLeft:'leve_esquerda',ExitRight:'direita',ExitLeft:'esquerda',StayRight:'leve_direita',StayLeft:'leve_esquerda',Merge:'reta',MergeRight:'leve_direita',MergeLeft:'leve_esquerda',DestinationReached:'chegada',DestinationReachedRight:'chegada',DestinationReachedLeft:'chegada'};
for(const [t,e] of Object.entries(expected)) ok(mc.M({type:t})===e,'tipo real '+t+' -> '+e);
ok(mc.M({type:'Roundabout'})==='rotatoria','rotatória sem saída não inventa saída');
ok(mc.M({type:'Roundabout',roundabout_exit:['3']})==='rotatoria_saida' && mc.exit({roundabout_exit:['3']})===3,'rotatória aceita roundabout_exit array real');
ok(/indiceGlobalInstrucao\(inst, 'to'\)/.test(nav) && /globalFromIndex/.test(nav),'GPS/painel preferem índices globais');
ok(/nearestOperacional=nearestOnRoute\(ultimaPosicao,\{visual:false\}\)/.test(nav),'GPS bruto mantém nearest operacional separado');
ok(/nearestVisual=nearestOnRoute\(ultimaPosicao,\{visual:true\}\)/.test(nav),'map matching visual usa trilha separada');
ok(/ultimoIndiceVisualRota/.test(nav) && /anterior - 35/.test(nav) && /anterior \+ 220/.test(nav),'map matching visual prioriza janela ao redor do progresso');
ok(/if \(!mapa \|\| !mapReady \|\| navegacaoInternaAtiva\(\)\) return;[\s\S]*fitBounds/.test(nav),'fitBounds de overview possui guard contra navigation-active');

// 5) Sessão: estado único e persistência LOCAL.
ok(/Auth\.Persistence\.LOCAL/.test(app),'Firebase Auth usa persistência LOCAL');
ok(/BOOTING:'booting'.*CHECKING:'checking'.*ACTIVE:'active'.*EXPIRED:'expired'.*BLOCKED:'blocked'.*OFFLINE:'offline-error'.*SIGNED_OUT:'signed-out'/s.test(app),'authAccessState possui todos os estados exclusivos');
ok(/authAccessState !== AUTH_ACCESS_STATES\.EXPIRED\) return false/.test(app),'mostrarRenovacao só abre no estado expired confirmado');
ok(/get\(\{ source: 'server' \}\)/.test(app),'expiração/acesso usam confirmação atual do servidor');
ok(/where\('authUid', '==', user\.uid\)/.test(app),'currentUser pode recuperar vínculo por UID');
ok(/auth\.onAuthStateChanged\(user => \{ restaurarSessaoFirebase\(user\); \}\)/.test(app),'onAuthStateChanged restaura sessão automaticamente');
ok(!/beforeunload[\s\S]{0,300}signOut\(/.test(app),'fechar/recarregar não possui signOut automático próximo de beforeunload');

console.log('\nHOTFIX FINAL 2 — testes estruturais/automatizados concluídos.');
