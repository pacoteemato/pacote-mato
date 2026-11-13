'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const nav=fs.readFileSync(path.resolve(__dirname,'../js/navegacao/navegacao.js'),'utf8');
const hist=fs.readFileSync(path.resolve(__dirname,'../js/historico/historico-rotas.js'),'utf8');
const start=nav.indexOf('  function processarPosicao(pos) {'), end=nav.indexOf('  function iniciarGPS()',start);
assert.ok(start>=0&&end>start);
const events=[],gpsLabel={textContent:''};
const pre=[
"let rota=null,ultimoTimestampGps=0,ultimaPosicaoBruta=null,ultimaPosicao=null,posicaoAnterior={lat:-23.55,lon:-46.63,at:1},posicaoVisual=null,alvoVisual=null,velocidadeVisualMs=0,headingVisual=null,seguirPosicao=true;",
"const global={appState:{navegacao:{ativa:false}},PacoteEMatoServicoRota:{}};",
"const $=id=>id==='navGpsStatus'?gpsLabel:null;",
"const coordenadaValida=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;",
"const haversine=()=>20,bearingEntre=()=>90;",
"const atualizarFonteMotoristaVisual=()=>events.push('motorista'),acompanharCamera=()=>events.push('acompanhar');",
"const nearestOnRoute=()=>{throw Error('NÃO: map matching sem rota')};"
].join('\n');
const fn=new Function('events','gpsLabel',pre+'\n'+nav.slice(start,end)+'\nreturn {processarPosicao,estado:()=>({rota,ultimaPosicao,alvoVisual,ultimoTimestampGps})};');
const runtime=fn(events,gpsLabel);
runtime.processarPosicao({timestamp:1000,coords:{latitude:-23.55,longitude:-46.63,accuracy:3,heading:70,speed:5}});
runtime.processarPosicao({timestamp:2000,coords:{latitude:-23.5502,longitude:-46.6301,accuracy:4,heading:75,speed:5}});
const state=runtime.estado();
assert.equal(state.rota,null);
assert.equal(state.ultimaPosicao.lat,-23.5502);
assert.equal(state.alvoVisual.matched,false);
assert.equal(state.ultimoTimestampGps,2000);
assert.deepEqual(events,['motorista','acompanhar','motorista','acompanhar']);
assert.match(gpsLabel.textContent,/Mapa livre · GPS ativo/);
assert.match(nav,/if \(rota && posicaoAnterior/);
assert.match(hist,/PacoteEMatoRoteirizacao\?\.carregarRotaAtiva\?\.\(\)/);
assert.match(hist,/const rotas=todas\.filter\(r=>\['concluida','arquivada'\]\.includes\(r\.status\)\)/);
console.log('APROVADO: GPS sem rota em 2 posições, sem acesso a rota nula; histórico só concluídas e atualização de seleção.');