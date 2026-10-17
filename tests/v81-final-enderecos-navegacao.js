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

same('Rua A, 100','Rua A, 100','Rua+número sem unidade podem agrupar');
same('Rua A, 100, Apto 10','Rua A, 100, APARTAMENTO 10','AP/APTO/APARTAMENTO normalizam');
diff('Rua A, 100, Apto 10','Rua A, 100, Apto 20','apartamentos diferentes ficam separados');
diff('Rua A, 100, Bloco 1, Apto 10','Rua A, 100, Bloco 2, Apto 10','blocos diferentes ficam separados');
diff('Rua A, 100, Casa 1','Rua A, 100, Casa 2','casas diferentes ficam separadas');
diff('Rua A, 100','Rua A, 100, Apto 10','unidade presente só em uma fica separada');
same('Av. Rudge, 417','Avenida Rudge, 417','Av. e Avenida são equivalentes');
same('Rua José da Silva, 50','R. Jose Silva, 50','acentos/preposições e R./Rua normalizam');
diff('R Ancara, 105, Bloco 1, Apartamento 501','R Ancara, 105, Bloco 2, Apartamento 1208','caso real 119/120 gera DUAS paradas');
same('R Ancara, 105, Bloco 1, Apartamento 501','Rua Ancara, 105, BL 1, APTO 501','variações equivalentes de bloco/apto geram UMA parada');
diff('Rua A, 100, Torre A','Rua A, 100, Torre B','torres diferentes ficam separadas');
diff('Rua A, 100, Sala 31','Rua A, 100, Sala 32','salas diferentes ficam separadas');
diff('Rua A, 100, Loja 1','Rua A, 100, Loja 2','lojas diferentes ficam separadas');
diff('Rua A, 100, Unidade 4','Rua A, 100, Unidade 5','unidades diferentes ficam separadas');
diff('Rua A, 100, Conjunto 12','Rua A, 100, CJ 13','conjuntos diferentes ficam separados');
diff('Rua A, 100, 3º Andar','Rua A, 100, 4º Andar','andares diferentes ficam separados');
diff('Rua A, 100, Fundos','Rua A, 100','fundos diferencia da unidade principal');
ok(A.decomporEnderecoFisicoPdfV71('Rua A, 100, Apto').complementoSeguro === false,'unidade incompleta é marcada como insegura');

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
ok(paint.get('road-primary|line-opacity') === 1,'estilo ativo aumenta contraste das vias');
ok(paint.get('road-label|text-color') === '#24333f','nomes das ruas recebem contraste de navegação');
ok(layout.get('road-label|visibility') === 'visible','labels de ruas ficam explicitamente visíveis no modo ativo');
MC.restaurarEstiloMapaOverview(mockMap);
ok(paint.get('road-primary|line-color') === '#ddd' && paint.get('road-primary|line-opacity') === 0.7,'overview restaura pintura original do mapa');

// 3) Navegação — garantias estruturais da implementação real.
const nav = fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
const html = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const css = fs.readFileSync(path.join(ROOT,'css/navegacao.css'),'utf8');
ok(/modoMapaNavegacao\s*=\s*'overview'/.test(nav) && /'navigation-active'/.test(nav),'existem estados OVERVIEW e NAVIGATION-ACTIVE');
ok(/function definirModoMapa\(/.test(nav) && /aplicarEstiloNavegacaoAtiva/.test(nav) && /restaurarEstiloMapaOverview/.test(nav),'troca de estado aplica/restaura estilo sem recarregar página');
ok(/function enquadrarOverview\(/.test(nav) && /fitBounds/.test(nav),'overview enquadra a rota completa');
ok(/definirModoMapa\('navigation-active'.*persistirSelecao/s.test(nav),'Navegar entra no modo ativo sem recalcular a rota');
const navPrefStart = nav.indexOf('  async function navegarPreferido()');
const navPrefEnd = nav.indexOf('\n  async function iniciar(', navPrefStart);
ok(!/recalcular\s*\(/.test(nav.slice(navPrefStart, navPrefEnd)),'entrada no navigation-active não chama recálculo');
ok(/opcoes\.tolerance = 0/.test(nav),'source de rota não aplica simplificação geométrica adicional');
ok(/SOURCE_ROUTE.*rota\.geometria/s.test(nav),'SOURCE_ROUTE deriva da geometria real salva da rota');
ok(/ultimaPosicaoBruta/.test(nav) && /posicaoVisual/.test(nav) && /alvoVisualDaPosicao/.test(nav),'GPS bruto e posição visual permanecem separados');
ok(/nearest&&nearest\.distance>limite/.test(nav) && /navegacaoInternaAtiva\(\)/.test(nav),'desvio usa nearest da posição bruta somente no modo ativo');
ok(/pitch:interna\?60:0/.test(nav) && /zoomNavegacaoInterna/.test(nav) && /offsetCameraInterna/.test(nav),'câmera ativa usa pitch, zoom dinâmico e offset inferior');
ok(/acentuada_esquerda/.test(nav) && /acentuada_direita/.test(nav) && /rotatoria_entrada/.test(nav) && /rotatoria_saida/.test(nav) && /chegada/.test(nav),'ícones cobrem curvas fortes, rotatória e chegada');
ok(/Fallback neutro/.test(nav),'tipo desconhecido usa direção neutra em vez de inventar');
ok(/navManeuverAfter/.test(html) && /navManeuverNextIcon/.test(html) && /proximaInst/.test(nav),'segunda manobra é exibida quando existe instrução real seguinte');
ok(/navPanelGrabber/.test(html) && /pointermove/.test(nav),'bottom sheet expansível preserva grabber dedicado');
ok(/data-pemato-nav-mode="overview"/.test(css) && /nav-maneuver-card\{display:none/.test(css),'overview oculta painel de manobra de GPS');
ok(/line-opacity':\.36/.test(nav) || /line-opacity':0\.36/.test(nav),'trecho percorrido permanece verde com baixa opacidade');
ok(/distanciaProximaManobra < 120/.test(nav) && /Math\.min\(zoom, 18\.25\)/.test(nav),'câmera abre o enquadramento perto de uma curva/manobra');

// Mapeamento real das manobras: executa a função usada pelo painel, não só regex estrutural.
const manStart = nav.indexOf('  function tipoVisualManobra(inst)');
const manEnd = nav.indexOf('  function indiceInstrucaoAtual(nearest)', manStart);
if (manStart < 0 || manEnd < 0) throw new Error('bloco de manobras não encontrado');
const manCtx = {}; vm.createContext(manCtx);
vm.runInContext(nav.slice(manStart, manEnd).replace(/^  /gm,'') + '\nthis.tipoVisualManobra=tipoVisualManobra;', manCtx);
const M = manCtx.tipoVisualManobra;
ok(M({type:'continue',modifier:'straight'})==='reta','manobra: seguir reto');
ok(M({type:'turn',modifier:'left'})==='esquerda','manobra: esquerda');
ok(M({type:'turn',modifier:'right'})==='direita','manobra: direita');
ok(M({type:'turn',modifier:'slight left'})==='leve_esquerda','manobra: leve esquerda');
ok(M({type:'turn',modifier:'slight right'})==='leve_direita','manobra: leve direita');
ok(M({type:'turn',modifier:'sharp left'})==='acentuada_esquerda','manobra: acentuada esquerda');
ok(M({type:'turn',modifier:'sharp right'})==='acentuada_direita','manobra: acentuada direita');
ok(M({type:'uturn'})==='retorno','manobra: retorno');
ok(M({type:'roundabout',transition_instruction:'Entrar na rotatória'})==='rotatoria_entrada','manobra: entrar na rotatória');
ok(M({type:'roundabout',transition_instruction:'Continue na rotatória'})==='rotatoria','manobra: continuar na rotatória');
ok(M({type:'roundabout',exit_number:3,transition_instruction:'Sair da rotatória'})==='rotatoria_saida','manobra: saída da rotatória');
ok(M({type:'arrival'})==='chegada','manobra: chegada');
ok(M({type:'mystery',modifier:'unknown'})==='reta','manobra desconhecida usa seguir neutro');

// 4) Instruções reais do Geoapify preservadas.
const svc = fs.readFileSync(path.join(ROOT,'js/roteirizacao/servico-rota.js'),'utf8');
for (const field of ['type','modifier','street_name','exit_number','transition_instruction','pre_transition_instruction','distance','time','from_index','to_index']) {
  ok(new RegExp(`\\b${field}\\b`).test(svc),`extrairInstrucoes preserva ${field}`);
}
const worker = fs.readFileSync(path.join(ROOT,'cloudflare/WORKER-HOLY-FROG-V79-AVISOS-MANUTENCAO-COMPLETO.txt'),'utf8');
ok(/details",\s*"instruction_details"/.test(worker),'Worker atual solicita instruction_details ao Geoapify');
ok(/legs:\s*Array\.isArray\(props\.legs\)\s*\?\s*props\.legs/.test(worker),'Worker preserva legs/steps reais do provedor');

// 5) Bipagem/importação: módulos proibidos continuam byte a byte iguais à base V81 recebida.
const baseline = path.resolve(ROOT,'../../pacote_v81_baseline');
for (const rel of ['js/bipagem/bipagem-area.js','js/bipagem/operacoes-pacotes.js','js/bipagem/rota-ativa-bridge.js']) {
  ok(sha(path.join(ROOT,rel)) === sha(path.join(baseline,rel)), `Bipagem sem alteração: ${rel}`);
}
for (const rel of ['js/importacao/fluxo-importacao.js','js/importacao/xlsx.js']) {
  ok(sha(path.join(ROOT,rel)) === sha(path.join(baseline,rel)), `importação preservada byte a byte: ${rel}`);
}
ok(/entregaOriginalPorPacote\[codigo\]\s*=\s*numeroEntregaOriginal/.test(app),'entregaOriginalPorPacote continua recebendo a numeração original do PDF');
ok(/normalizarCodigoPacoteBr/.test(app) && /BR\\d\{12\}/.test(app),'validador de código BR permanece presente');

console.log('\nV81 FINAL — testes de endereços/navegação concluídos.');
