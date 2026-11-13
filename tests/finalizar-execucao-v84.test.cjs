'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const code=fs.readFileSync(path.resolve(__dirname,'../js/navegacao/navegacao.js'),'utf8');
const start=code.indexOf('  let finalizandoRota=false;');
const end=code.indexOf('  function revisarResultados()',start);
assert.ok(start>=0&&end>start,'Função finalização não localizada');
const functionCode=code.slice(start,end);
function criarCenario({falha=false,pendente=false}={}){
 const eventos=[],paradas=[
  {id:'entrega1',enderecoOriginal:'Rua A',statusEntrega:'entregue'},
  {id:'entrega2',enderecoOriginal:'Rua B',statusEntrega:pendente?'pendente':'nao_entregue',motivoNaoEntrega:'Ausente'}
 ];
 const original={id:'R01',status:'aguardando_finalizacao',concluidoEm:null,conclusaoPendente:true,paradas};
 let persisted=null;
 const fakeGlobal={
  appState:{navegacao:{ativa:true,modo:'navigation-active',conclusaoPendente:true,paradaExibidaId:'entrega2'}},
  PacoteEMatoRotaStore:{
   salvarRota:async(r,opts)=>{
    eventos.push({tipo:'salvar',opts});
    if(falha){const e=new Error('IndexedDB indisponível');e.code='PERSISTENCIA_LOCAL_FALHOU';throw e;}
    persisted=JSON.parse(JSON.stringify(r));
   },
   obterRota:async()=>JSON.parse(JSON.stringify(persisted)),
   limparRotaAtiva:async()=>eventos.push({tipo:'limparAtiva'})
  },
  PacoteEMatoHistorico:{renderizar:()=>eventos.push({tipo:'atualizarHistorico'})},
  PacoteEMatoAppShell:{abrirModulo:m=>eventos.push({tipo:'abrirModulo',m}),atualizarInicio:()=>{}},
  notificar:msg=>eventos.push({tipo:'notificar',msg})
 };
 const doc={body:{dataset:{}}},mapa=new Map();
 const before=[
  "let rota=JSON.parse(JSON.stringify(original)),ordemPendente=[],cartaoSelecionadoId='entrega2';",
  "let ultimoProgressoVisual=1,ultimoIndiceVisualRota=2,assinaturaParadasV11='x',posicaoAnterior=null,alvoVisual=null,posicaoVisual=null,ultimaPosicao=null,ultimoTimestampGps=0,ultimoIdNota='';",
  "const $=id=>({style:{display:'flex'},textContent:''});",
  "function atualizarPendentes(){ordemPendente=(rota?.paradas||[]).filter(p=>!['entregue','concluida','nao_entregue'].includes(p.statusEntrega));}",
  "function destinoFinalDaRota(){return null;}",
  "function pararGPS(){eventos.push({tipo:'pararGPS'});}",
  "function moduloVozNavegacao(){return {limparEstado:()=>eventos.push({tipo:'limparVoz'})};}",
  "function definirModoMapa(mode){eventos.push({tipo:'modoMapa',mode});}",
  "function setSource(id,data){mapa.set(id,data);eventos.push({tipo:'fonte',id});}",
  "function fc(features){return {type:'FeatureCollection',features:features||[]};}",
  "function atualizarFonteMotoristaVisual(){eventos.push({tipo:'marcadorGPS'});}",
  "function iniciarGPS(){eventos.push({tipo:'iniciarGPS'});}",
  "const SOURCE_ROUTE='rota',SOURCE_ROUTE_STATUS='status',SOURCE_PROGRESS='progresso',SOURCE_MANEUVER='manobra',SOURCE_MANEUVER_PATH='curva',SOURCE_STOPS='paradas',SOURCE_STOPS_SELECTED='selecionadas';"
 ].join('\n');
 const factory=new Function('global','document','original','eventos','mapa',before+'\n'+functionCode+'\nreturn {finalizarRota,estado:()=>({rota,finalizandoRota})};');
 const runtime=factory(fakeGlobal,doc,original,eventos,mapa);
 return {runtime,fakeGlobal,doc,mapa,eventos,persistida:()=>persisted};
}
(async()=>{
 const bom=criarCenario();
 await bom.runtime.finalizarRota();
 assert.equal(bom.persistida().status,'concluida');
 assert.deepEqual(bom.persistida().paradas.map(p=>p.statusEntrega),['entregue','nao_entregue']);
 assert.equal(bom.persistida().paradas[1].motivoNaoEntrega,'Ausente');
 assert.equal(bom.runtime.estado().rota,null);
 assert.equal(bom.doc.body.dataset.pematoRouteFinished,'true');
 assert.equal(bom.fakeGlobal.appState.navegacao.ativa,false);
 assert.ok(bom.eventos.some(e=>e.tipo==='limparAtiva'));
 assert.ok(bom.eventos.some(e=>e.tipo==='modoMapa'&&e.mode==='overview'));
 assert.ok(bom.eventos.some(e=>e.tipo==='iniciarGPS'));
 assert.ok(!bom.eventos.some(e=>e.tipo==='abrirModulo'),'Navegação redirecionou para Histórico');
 assert.equal(bom.mapa.size,7,'Faltaram fontes a limpar');
 for(const data of bom.mapa.values())assert.equal(data.features.length,0,'Rota ainda desenhada');
 await bom.runtime.finalizarRota();
 assert.equal(bom.eventos.filter(e=>e.tipo==='salvar').length,1,'Conclusão duplicada');
 const erro=criarCenario({falha:true});
 await erro.runtime.finalizarRota();
 assert.equal(erro.runtime.estado().rota.status,'aguardando_finalizacao');
 assert.ok(!erro.eventos.some(e=>e.tipo==='limparAtiva'),'Limpou rota sem confirmar gravação');
 assert.ok(!erro.eventos.some(e=>e.tipo==='iniciarGPS'),'Não deve limpar rota sem persistência');
 assert.equal(erro.runtime.estado().finalizandoRota,false,'Travou finalização após erro');
 const incompleta=criarCenario({pendente:true});
 await incompleta.runtime.finalizarRota();
 assert.ok(!incompleta.eventos.some(e=>e.tipo==='salvar'));
 console.log('APROVADO: finalização confirma status, limpa mapa, mantém tela/GPS, não abre Histórico, não duplica e bloqueia erro de gravação.');
})().catch(err=>{console.error(err);process.exitCode=1;});
