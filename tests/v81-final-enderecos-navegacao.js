'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
function ok(cond, msg) { if (!cond) throw new Error(msg); console.log('OK  ' + msg); }
function sha(file) { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function functionBlock(src, name) {
  const start = src.indexOf(`    function ${name}(`);
  if (start < 0) throw new Error(`função não encontrada: ${name}`);
  let i = src.indexOf('{', start), depth = 0, quote = null, esc = false, line = false, block = false;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (line) { if (c === '\n') line = false; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; i++; } continue; }
    if (quote) { if (esc) { esc = false; continue; } if (c === '\\') { esc = true; continue; } if (c === quote) quote = null; continue; }
    if (c === '/' && n === '/') { line = true; i++; continue; }
    if (c === '/' && n === '*') { block = true; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i + 1).replace(/^    /gm, '');
  }
  throw new Error(`fim não encontrado: ${name}`);
}

// 1) Identidade física conservadora — executa as funções reais do app.js.
const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const helpersStart = app.indexOf('    function removerAcentosPdfV71');
const helpersEnd = app.indexOf('    function agruparItensEmLinhasPdfV71', helpersStart);
if (helpersStart < 0 || helpersEnd < 0) throw new Error('bloco de helpers V71/V81 de endereço não encontrado');
let helpers = app.slice(helpersStart, helpersEnd).replace(/^    /gm, '');
helpers += '\nthis.__addr={decomporEnderecoFisicoPdfV71,chaveFisicaPdfV71,extrairUnidadeEnderecoPdfV81};';
const addrCtx = { console }; vm.createContext(addrCtx); vm.runInContext(helpers, addrCtx);
const A = addrCtx.__addr;
const key = s => A.chaveFisicaPdfV71(s);
const same = (a,b,msg) => ok(key(a) && key(a) === key(b), msg);
const diff = (a,b,msg) => ok(key(a) && key(b) && key(a) !== key(b), msg);

same('Rua A, 100','Rua A, 100','Rua+número iguais agrupam');
same('Rua A, 100, Apto 10','Rua A, 100, APARTAMENTO 20','apartamento diferente NÃO separa parada física');
same('Rua A, 100, Bloco 1, Apto 10','Rua A, 100, Bloco 2, Apto 99','bloco/apto diferentes NÃO separam parada física');
same('Rua A, 100, Casa 1','Rua A, 100, Casa 2','casa interna diferente NÃO separa parada física');
same('Rua A, 100','Rua A, 100, Apto 10','presença de complemento não muda a parada física');
same('Av. Rudge, 417','Avenida Rudge, 417','Av. e Avenida são equivalentes');
same('Rua José da Silva, 50','R. Jose Silva, 50','acentos/preposições e R./Rua normalizam');
same('R Ancara, 105, Bloco 1, Apartamento 501','Rua Ancara, 105, Bloco 2, Apartamento 1208','Ancara 105 agrupa apesar de bloco/apto diferentes');
same('Rua A, 100, Torre A','Rua A, 100, Torre B','torre diferente NÃO separa parada física');
same('Rua A, 100, Sala 31','Rua A, 100, Sala 32','sala diferente NÃO separa parada física');
same('Rua A, 100, Loja 1','Rua A, 100, Loja 2','loja diferente NÃO separa parada física');
same('Rua A, 100, Unidade 4','Rua A, 100, Unidade 5','unidade diferente NÃO separa parada física');
same('Rua A, 100, Conjunto 12','Rua A, 100, CJ 13','conjunto diferente NÃO separa parada física');
same('Rua A, 100, 3º Andar','Rua A, 100, 4º Andar','andar diferente NÃO separa parada física');
same('Rua A, 100, Fundos','Rua A, 100','fundos NÃO separa parada física');
diff('Rua A, 100, Apto 10','Rua A, 101, Apto 10','número principal diferente separa');
diff('Rua A, 100','Rua B, 100','logradouro diferente separa');
ok(!key('Rua A, Apto 100'),'sem número principal seguro não cria chave física');
ok(A.decomporEnderecoFisicoPdfV71('Rua A, 100, Apto').complementoSeguro === false,'complemento incompleto continua armazenado como dado informativo');

// 2) Mapa — executa config real contra um MapLibre mínimo simulado.
const configSource = fs.readFileSync(path.join(ROOT,'js/mapa/config.js'),'utf8');
const layers = [
  {id:'background',type:'background'},
  {id:'road-primary',type:'line','source-layer':'transportation'},
  {id:'road-label',type:'symbol','source-layer':'transportation_name'},
  {id:'place-city',type:'symbol','source-layer':'place'},
  {id:'poi-shop',type:'symbol','source-layer':'poi'}
];
const paint = new Map([
  ['background|background-color','#fafafa'],['road-primary|line-color','#ddd'],['road-primary|line-opacity',0.7],
  ['road-label|text-color','#777'],['road-label|text-halo-color','#fff'],['road-label|text-halo-width',1],['road-label|text-halo-blur',0],['road-label|text-opacity',0.8],
  ['place-city|text-color','#888'],['place-city|text-halo-color','#fff'],['place-city|text-halo-width',1],['place-city|text-halo-blur',0],['place-city|text-opacity',0.8]
]);
const layout = new Map([['road-label|visibility','visible'],['place-city|visibility','visible'],['poi-shop|visibility','visible']]);
const mockMap = {
  getStyle(){return {layers}}, getLayer(id){return layers.find(l=>l.id===id)},
  getPaintProperty(id,p){return paint.get(`${id}|${p}`)}, setPaintProperty(id,p,v){paint.set(`${id}|${p}`,v)},
  getLayoutProperty(id,p){return layout.get(`${id}|${p}`)}, setLayoutProperty(id,p,v){layout.set(`${id}|${p}`,v)}
};
const configCtx = { window:null, localStorage:{removeItem(){}}, CustomEvent:function(){}, console }; configCtx.window=configCtx;
vm.createContext(configCtx); vm.runInContext(configSource, configCtx);
const MC = configCtx.PacoteEMatoMapaConfig;
MC.limparPontosInteresse(mockMap);
ok(layout.get('road-label|visibility') === 'visible','limparPontosInteresse preserva labels de vias');
ok(layout.get('place-city|visibility') === 'visible','limparPontosInteresse preserva place/city');
ok(layout.get('poi-shop|visibility') === 'none','POI não essencial continua reduzido');
MC.aplicarEstiloNavegacaoAtiva(mockMap);
ok(paint.get('road-primary|line-opacity') === 1,'estilo ativo mantém vias em contraste total');
ok(paint.get('road-label|text-color') === '#303b42','nomes das ruas recebem contraste clean de navegação');
ok(layout.get('road-label|visibility') === 'visible','labels de ruas ficam explicitamente visíveis no modo ativo');
const corViaAtiva=paint.get('road-primary|line-color');
MC.restaurarEstiloMapaOverview(mockMap);
ok(paint.get('background|background-color') === '#f3f5f6','overview permanece no mesmo mapa base clean');
ok(paint.get('road-primary|line-color') === corViaAtiva && paint.get('road-primary|line-opacity') === 1,'overview preserva identidade clean das vias em vez de voltar ao Liberty colorido');

// 3) Navegação — garantias estruturais da implementação real.
const nav = fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
const html = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const css = fs.readFileSync(path.join(ROOT,'css/navegacao.css'),'utf8');
ok(/modoMapaNavegacao\s*=\s*'overview'/.test(nav) && /'navigation-active'/.test(nav),'existem estados OVERVIEW e NAVIGATION-ACTIVE');
ok(/function definirModoMapa\(/.test(nav) && /aplicarEstiloNavegacaoAtiva/.test(nav) && /aplicarEstiloMapaClean/.test(nav),'troca de estado mantém estilo clean e ativa reforço de navegação sem recarregar página');
ok(/function enquadrarOverview\(/.test(nav) && /fitBounds/.test(nav),'overview enquadra a rota completa');
ok(/definirModoMapa\('navigation-active'.*persistirSelecao/s.test(nav),'Navegar entra no modo ativo sem recalcular a rota');
const navPrefStart = nav.indexOf('  async function navegarPreferido()');
const navPrefEnd = nav.indexOf('\n  async function iniciar(', navPrefStart);
ok(!/recalcular\s*\(/.test(nav.slice(navPrefStart, navPrefEnd)),'entrada no navigation-active não chama recálculo');
ok(/opcoes\.tolerance = 0/.test(nav),'source de rota não aplica simplificação geométrica adicional');
ok(/SOURCE_ROUTE.*rota\.geometria/s.test(nav),'SOURCE_ROUTE deriva da geometria real salva da rota');
ok(/ultimaPosicaoBruta/.test(nav) && /posicaoVisual/.test(nav) && /alvoVisualDaPosicao/.test(nav),'GPS bruto e posição visual permanecem separados');
ok(/nearestOperacional&&nearestOperacional\.distance>limite/.test(nav) && /navegacaoInternaAtiva\(\)/.test(nav),'desvio usa nearest da posição bruta somente no modo ativo');
ok(/pitch:interna\?60:0/.test(nav) && /zoomNavegacaoInterna/.test(nav) && /offsetCameraInterna/.test(nav),'câmera ativa usa pitch, zoom dinâmico e offset inferior');
ok(/acentuada_esquerda/.test(nav) && /acentuada_direita/.test(nav) && /rotatoria_entrada/.test(nav) && /rotatoria_saida/.test(nav) && /chegada/.test(nav),'ícones cobrem curvas fortes, rotatória e chegada');
ok(/navManeuverAfter/.test(html) && /navManeuverNextIcon/.test(html) && /proximaInst/.test(nav),'segunda manobra é exibida quando existe instrução real seguinte');
ok(/navPanelGrabber/.test(html) && /pointermove/.test(nav),'bottom sheet expansível preserva grabber dedicado');
ok(/data-pemato-nav-mode="overview"/.test(css) && /nav-maneuver-card\{display:none/.test(css),'overview oculta painel de manobra de GPS');
ok(/line-opacity':\.36/.test(nav) || /line-opacity':0\.36/.test(nav),'trecho percorrido permanece verde com baixa opacidade');
ok(/distanciaProximaManobra < 120/.test(nav) && /Math\.min\(zoom, 18\.25\)/.test(nav),'câmera abre o enquadramento perto de uma curva/manobra');

// Mapeamento real das manobras: executa a função usada pelo painel, não só regex estrutural.
const manStart = nav.indexOf('  function tipoGeoapifyNormalizado(inst)');
const manEnd = nav.indexOf('  function svgManobra(tipo)', manStart);
if (manStart < 0 || manEnd < 0) throw new Error('bloco de manobras não encontrado');
const manCtx = {}; vm.createContext(manCtx);
vm.runInContext(nav.slice(manStart, manEnd).replace(/^  /gm,'') + '\nthis.tipoVisualManobra=tipoVisualManobra;this.valorSaidaRotatoria=valorSaidaRotatoria;', manCtx);
const M = manCtx.tipoVisualManobra;
const manobrasGeoapify = {
  StartAt:'reta', StartAtRight:'direita', StartAtLeft:'esquerda', Straight:'reta',
  SlightRight:'leve_direita', Right:'direita', SharpRight:'acentuada_direita',
  TurnAroundRight:'retorno', TurnAroundLeft:'retorno', SharpLeft:'acentuada_esquerda',
  Left:'esquerda', SlightLeft:'leve_esquerda', ExitRight:'direita', ExitLeft:'esquerda',
  StayRight:'leve_direita', StayLeft:'leve_esquerda', Merge:'reta', MergeRight:'leve_direita', MergeLeft:'leve_esquerda',
  DestinationReached:'chegada', DestinationReachedRight:'chegada', DestinationReachedLeft:'chegada'
};
for (const [tipo, esperado] of Object.entries(manobrasGeoapify)) ok(M({type:tipo})===esperado,`manobra Geoapify ${tipo}`);
ok(M({type:'Roundabout'})==='rotatoria','Roundabout sem saída real não inventa número');
ok(M({type:'Roundabout',roundabout_exit:['3']})==='rotatoria_saida','Roundabout usa saída real quando fornecida');
ok(M({type:'mystery',modifier:'unknown'})==='reta','manobra desconhecida usa seguir neutro');

// 4) Instruções reais do Geoapify preservadas.
const svc = fs.readFileSync(path.join(ROOT,'js/roteirizacao/servico-rota.js'),'utf8');
for (const field of ['type','modifier','streets','street_name','exitNumber','exit_number','exitRoadName','exitTowards','roundabout_exit','transition_instruction','pre_transition_instruction','post_transition_instruction','distance','time','from_index','to_index','legIndex','fromIndexLeg','toIndexLeg','globalFromIndex','globalToIndex']) {
  ok(new RegExp(`\\b${field}\\b`).test(svc),`extrairInstrucoes preserva ${field}`);
}
const worker = fs.readFileSync(path.join(ROOT,'cloudflare/WORKER-HOLY-FROG-V79-AVISOS-MANUTENCAO-COMPLETO.txt'),'utf8');
ok(/details",\s*"instruction_details"/.test(worker),'Worker atual solicita instruction_details ao Geoapify');
ok(/legs:\s*Array\.isArray\(props\.legs\)\s*\?\s*props\.legs/.test(worker),'Worker preserva legs/steps reais do provedor');

// 5) Bipagem/importação: módulos proibidos continuam byte a byte iguais à base V81 recebida.
const hashesProtegidos = {
  'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
  'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
  'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610',
  'js/importacao/fluxo-importacao.js':'f48b8826553a8431e320fa254c4c490c32742ebc00e3b8ac4b5bb9948121eae1',
  'js/importacao/xlsx.js':'fdf359975e1282ed8aa28b5ae97dfbb21c1d82645355a40e5dc5f52029fb25fc'
};
for (const [rel, hash] of Object.entries(hashesProtegidos)) {
  const tipo = rel.includes('/bipagem/') ? 'Bipagem sem alteração' : 'importação preservada byte a byte';
  ok(sha(path.join(ROOT,rel)) === hash, `${tipo}: ${rel}`);
}
ok(/entregaOriginalPorPacote\[codigo\]\s*=\s*numeroEntregaOriginal/.test(app),'entregaOriginalPorPacote continua recebendo a numeração original do PDF');
ok(/normalizarCodigoPacoteBr/.test(app) && /BR\\d\{12\}/.test(app),'validador de código BR permanece presente');

console.log('\nV81 FINAL — testes de endereços/navegação concluídos.');
