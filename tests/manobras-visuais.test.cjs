'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const nav=read('js/navegacao/navegacao.js'),map=read('js/mapa/config.js'),html=read('index.html');
new Function(nav);new Function(map);
assert.doesNotMatch(nav,/pemato-nav-direction-chevron|atualizarSetasSentidoRota|SOURCE_DIRECTION/,'Setas genéricas nos trechos retos devem desaparecer');
assert.match(nav,/LAYER_MANEUVER_PATH_CASE/);
assert.match(nav,/LAYER_MANEUVER_PATH/);
assert.match(nav,/SOURCE_MANEUVER_PATH/);
assert.match(nav,/atualizarOverlayManobraMapa\(inst, nearest\)/);
assert.match(nav,/setSource\(SOURCE_MANEUVER_PATH,fc\(geometria\?/);
assert.match(nav,/if\(!manobraImportanteNoMapa\(tipo\)\)\{limpar\(\);return;\}/);
assert.match(nav,/desenharIconeManobraMapa\(tipo\)/);
for(const tipo of ['esquerda','direita','retorno_esquerda','retorno_direita','rotatoria','rotatoria_saida','saida_esquerda','saida_direita']){
 assert.ok(nav.includes(tipo+':'),'Ícone de '+tipo+' ausente');
}
assert.ok(html.includes('id="navPerspectiveBtn"'));
assert.ok(html.includes('id="navVoiceBtn"'));
assert.ok(html.includes('id="navFollowBtn"'));
assert.ok(html.includes('id="navDeliverBtn"') || html.includes('id="navMarkDeliveredBtn"') || html.includes('Entregue'));
assert.match(nav,/function acompanharCamera/);
assert.match(nav,/function atualizarInstrucao/);
assert.match(nav,/function definirAcompanhamento/);
assert.match(map,/coresViaClean\(via, false, navegacaoAtiva\)/);
assert.match(map,/navegacaoAtiva \? '#f1f3f5'/);
const start=nav.indexOf('  function trechoRealDaManobra('),end=nav.indexOf('  function atualizarOverlayManobraMapa(',start);
assert.ok(start>0&&end>start);
const haver=(a,b)=>{
 const R=6371000, rad=Math.PI/180;
 const lat1=a[1]*rad,lat2=b[1]*rad,da=(b[1]-a[1])*rad,db=(b[0]-a[0])*rad;
 return 2*R*Math.asin(Math.min(1,Math.sqrt(Math.sin(da/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(db/2)**2)));
};
const recortar=new Function('haversine',nav.slice(start,end)+';return trechoRealDaManobra;')(haver);
const direita=[[-46.630,-23.550],[-46.6296,-23.550],[-46.6296,-23.5504]];
const esquerda=[[-46.630,-23.550],[-46.6296,-23.550],[-46.6296,-23.5496]];
for(const [nome,coords] of [['direita',direita],['esquerda',esquerda]]){
 const g=recortar(coords,1,30,30);
 assert.equal(g.type,'LineString',nome);
 assert.equal(g.coordinates.length,3,nome);
 assert.deepEqual(g.coordinates[1],coords[1],'curva deve coincidir com a rua real: '+nome);
}
assert.equal(recortar(direita,0),null,'índice inválido não inventa curva');
console.log('PASSOU: sem setas retas, curva real à direita/esquerda, retornos e rotatória, sincronia com painel, mapa com contraste, controles preservados.');
