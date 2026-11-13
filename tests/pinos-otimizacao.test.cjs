'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const mapa=read('js/mapa/mapa.js'),nav=read('js/navegacao/navegacao.js'),srv=read('js/roteirizacao/servico-rota.js');
const snippet=(src,a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,a+' não encontrada');return src.slice(i,j);};
const offsetSource=snippet(mapa,'  function deslocamentoMarcador(indice) {','  function chaveFisicaMarcador');
const offset=new Function('const MathRef=Math;'+offsetSource+';return deslocamentoMarcador;')();
const paradas=[
 {id:'a',latitude:-23.55,longitude:-46.63,statusEntrega:'pendente',pacotes:['BR1']},
 {id:'b',latitude:-23.55,longitude:-46.63,statusEntrega:'pendente',pacotes:['BR2']},
 {id:'c',latitude:-23.55,longitude:-46.63,statusEntrega:'pendente',pacotes:['BR3']}
];
const source=snippet(mapa,'  function stopsGeoJSON() {','  function pointGeoJSON');
const getFeatures=new Function('state','paradas','coordenadaValida','ordem','statusEntrega','idsSelecaoDesenho','idsGruposDesenho','quantidadePacotesDaParada','deslocamentoMarcador','featureCollection',source+';return stopsGeoJSON();');
const result=getFeatures(
 ()=>({paradaSelecionadaId:'b',ordem:['a','b','c']}),
 ()=>paradas,
 p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude),
 p=>({a:1,b:2,c:3})[p.id],
 ()=> 'pendente',new Set(),new Set(),
 p=>p.pacotes.length,offset,features=>({features})
);
assert.equal(result.features.length,3,'Cada entrega deve ter seu próprio pino');
assert.equal(new Set(result.features.map(f=>f.properties.id)).size,3);
assert.equal(new Set(result.features.map(f=>JSON.stringify(f.properties.markerOffset))).size,3,'Pinos sobrepostos devem ser afastados visualmente');
assert.equal(new Set(result.features.map(f=>JSON.stringify(f.geometry.coordinates))).size,1,'Não alterar coordenadas reais');
assert.equal(result.features.find(f=>f.properties.id==='b').properties.selected,1);
assert.doesNotMatch(nav,/id:LAYER_NEXT_HALO/);
assert.doesNotMatch(nav,/id:LAYER_NEXT_LABEL/);
assert.doesNotMatch(nav,/const permitidos = new Set/);
assert.match(nav,/stackIndex,markerOffset:deslocamentoMarcador\(stackIndex\)/);
assert.match(srv,/Refino 2-opt ruas/);
assert.match(srv,/return avaliar\(\[\.\.\.finalizadas,\.\.\.ids\]/);
assert.match(srv,/candidatos.sort\(comparar\)/);
new Function(mapa);new Function(nav);new Function(srv);
console.log('PASSOU: três pinos individuais, offsets exclusivos, coordenadas intactas, destaque extra removido, refino rodoviário e sintaxe.');
