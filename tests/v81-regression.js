'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
function ok(cond, msg){ if(!cond) throw new Error(msg); console.log('OK  '+msg); }
function sha(p){ return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); }

// 1) Áreas proibidas continuam byte a byte iguais à V80.
const BASELINE_HASHES = {
  'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
  'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
  'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610',
  'js/importacao/xlsx.js':'fdf359975e1282ed8aa28b5ae97dfbb21c1d82645355a40e5dc5f52029fb25fc',
  'js/importacao/fluxo-importacao.js':'f48b8826553a8431e320fa254c4c490c32742ebc00e3b8ac4b5bb9948121eae1',
  'js/mapa/geocodificacao.js':'dfb1f3b6f6dfca7fdc709ca0d65dfb73e821778abb0176a5b71a8819cd58e7db',
  'cloudflare/geocodificacao-worker.js':'8720b5be1c699465add8cb1d27f8279454c02c4c276948a1889fbf9d81b64a9e',
  'cloudflare/admin-gateway-worker.js':'38b71dafed9706049fc211b5a5b43ece35d7335257e16d3c47072a88aa0c3df2'
};
Object.entries(BASELINE_HASHES).forEach(([rel,hash]) => ok(sha(path.join(ROOT,rel)) === hash, `sem regressão byte a byte: ${rel}`));

// 2) Compatibilidade real das funções de expiração existentes no app.js.
const appSource = fs.readFileSync(path.join(ROOT,'js/app.js'),'utf8');
const begin = appSource.indexOf('    const ADMIN_DAY = 86400000;');
const endMarker = '    function contaTemAcessoAtivo(u, now = Date.now()) {';
const funcStart = appSource.indexOf(endMarker, begin);
function blockEnd(src, start){
  let i=src.indexOf('{',start), depth=0, inStr=null, esc=false;
  for(;i<src.length;i++){
    const c=src[i];
    if(inStr){ if(esc){esc=false;continue;} if(c==='\\'){esc=true;continue;} if(c===inStr)inStr=null; continue; }
    if(c==='"'||c==="'"||c==='`'){inStr=c;continue;}
    if(c==='{')depth++; else if(c==='}' && --depth===0)return i+1;
  }
  throw new Error('fim de função não encontrado');
}
const funcEnd=blockEnd(appSource,funcStart);
let helper=appSource.slice(begin,funcEnd).replace(/^    /gm,'');
helper += '\nthis.__expiry={adminExpiry,adminVitalicio,contaTemAcessoAtivo,ADMIN_DAY};';
const expiryCtx={Date, console}; vm.createContext(expiryCtx); vm.runInContext(helper,expiryCtx);
const E=expiryCtx.__expiry; const now=Date.UTC(2026,9,17,12,0,0);
ok(E.contaTemAcessoAtivo({expiraEm:now+86400000},now)===true,'mensal ativa por milissegundos');
ok(E.contaTemAcessoAtivo({plano:'Trimestral',expiraEm:now+60*86400000},now)===true,'trimestral ativa');
ok(E.contaTemAcessoAtivo({plano:'Teste grátis',expiraEm:now+2*86400000},now)===true,'teste ativo');
ok(E.contaTemAcessoAtivo({expiraEm:{toMillis:()=>now+86400000}},now)===true,'Firestore Timestamp com toMillis');
ok(E.contaTemAcessoAtivo({expiraEm:Math.floor((now+86400000)/1000)},now)===true,'expiraEm em segundos');
ok(E.contaTemAcessoAtivo({expiraEm:{seconds:Math.floor((now+86400000)/1000)}},now)===true,'Timestamp serializado');
ok(E.contaTemAcessoAtivo({expiraEm:new Date(now+86400000).toISOString()},now)===true,'data ISO');
ok(E.contaTemAcessoAtivo({ativo:true},now)===true,'conta antiga ativo:true');
ok(E.contaTemAcessoAtivo({vitalicio:true},now)===true,'vitalícia');
ok(E.contaTemAcessoAtivo({expiraEm:now-1},now)===false,'expirada de verdade');
ok(E.contaTemAcessoAtivo({bloqueado:true,vitalicio:true},now)===false,'bloqueada continua bloqueada');
ok(/mostrarRenovacao\(zap, expiracaoConfirmada = false\)[\s\S]*estadoAcessoAtual !== 'expirado'/.test(appSource),'renovação protegida por expiração confirmada');
ok(/get\(\{ source: 'server' \}\)/.test(appSource),'confirmação explícita usa Firestore servidor');
ok(/onAuthStateChanged[\s\S]*iniciarMonitoramentoSessao\(zapSalvoInicial\)/.test(appSource),'sessão Firebase restaurada inicia monitoramento sem exigir novo login');

// 3) Histórico: reabrir só a parada escolhida sem alterar ordem/geometria/pacotes.
const histSource=fs.readFileSync(path.join(ROOT,'js/historico/historico-rotas.js'),'utf8');
const documentStub={readyState:'loading',getElementById(){return null;},addEventListener(){}};
const histCtx={window:null,document:documentStub,console,CustomEvent:function(){}}; histCtx.window=histCtx;
histCtx.PacoteEMatoRotaStore={normalizarRota:r=>JSON.parse(JSON.stringify(r))};
histCtx.addEventListener=()=>{}; vm.createContext(histCtx); vm.runInContext(histSource,histCtx);
const sample={id:'R1',status:'concluida',concluidoEm:99,conclusaoPendente:false,ordem:['a','b'],geometria:{type:'LineString',coordinates:[[1,1],[2,2]]},paradas:[{id:'a',statusEntrega:'entregue',pacotes:['PK1'],latitude:1,longitude:1},{id:'b',statusEntrega:'nao_entregue',pacotes:['PK2'],latitude:2,longitude:2,motivoNaoEntrega:'ausente'}]};
const reopened=histCtx.PacoteEMatoHistorico.prepararRotaParaCorrecao(sample,'b');
ok(reopened.id==='R1' && reopened.status==='ativa' && reopened.concluidoEm===null,'mesmo ID e rota reaberta');
ok(JSON.stringify(reopened.ordem)===JSON.stringify(sample.ordem),'ordem otimizada preservada');
ok(JSON.stringify(reopened.geometria)===JSON.stringify(sample.geometria),'geometria preservada');
ok(reopened.paradas[0].statusEntrega==='entregue','outras entregas permanecem concluídas');
ok(reopened.paradas[1].statusEntrega==='pendente' && reopened.paradas[1].pacotes[0]==='PK2','somente parada escolhida volta a pendente e pacote é preservado');

// 4) Navegação: checagens estruturais das garantias V81.
const nav=fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
ok(/maximumAge:0/.test(nav) && /enableHighAccuracy:true/.test(nav),'GPS ativo não aceita posição antiga em cache');
ok(/ultimaPosicaoBruta/.test(nav) && /posicaoVisual/.test(nav) && /alvoVisualDaPosicao/.test(nav),'posição bruta separada da posição visual');
ok(/mapa\.jumpTo\(opcoes\)/.test(nav),'câmera contínua usa jumpTo sem enfileirar easeTo');
ok(/requestAnimationFrame\(frame\)/.test(nav),'interpolação visual usa requestAnimationFrame');
ok(/nearest\.distance>limite/.test(nav),'desvio continua baseado no GPS bruto/nearest real');
ok(!/renderizarTudo\(/.test(nav),'navegação não renderiza o aplicativo inteiro a cada GPS');
ok(/navManeuverIcon/.test(nav) && /svgManobra/.test(nav),'ícones SVG de manobra ligados às instruções');
ok(/navPanelGrabber/.test(nav) && /pointermove/.test(nav),'bottom sheet possui grabber vertical dedicado');
ok(/exigirPersistenciaLocal:true/.test(nav),'finalização exige confirmação de persistência local');

console.log('\nRegressões estáticas/lógicas V81 concluídas.');
