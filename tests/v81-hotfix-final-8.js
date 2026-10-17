const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const ok=(c,m)=>{if(!c)throw new Error(m);console.log('OK  '+m)};
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

// 1) Áreas congeladas da base FINAL 7.
const frozen={
 'js/app.js':'d6ab8b187c5544add3c34ef466745e2dcd268e784c4a5f2fea2a4d6369eea738',
 'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
 'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
 'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610',
 'js/importacao/fluxo-importacao.js':'f48b8826553a8431e320fa254c4c490c32742ebc00e3b8ac4b5bb9948121eae1',
 'js/importacao/xlsx.js':'fdf359975e1282ed8aa28b5ae97dfbb21c1d82645355a40e5dc5f52029fb25fc',
 'js/roteirizacao/roteirizacao.js':'b5f80a0fc471d8297c0cd326b944f3eff2f3156d36237e52e0919fc3ed8f91f4',
 'js/roteirizacao/servico-rota.js':'34586159a64f55d870c4034e4f61fd658dc757e716a56485c9dfc12560651c5b',
 'js/historico/historico-rotas.js':'3c17acda127ec15af43a75c37138976304d147b2a14b2afaa262b838cb6eff03',
 'js/mapa/config.js':'9db53c13f943d17c3c0ec5832e936cd5f5fab35bae3a8f086358010498267424',
 'js/mapa/mapa.js':'1860ed94d53bca19b3a9d6b3756eb4db168c5c3008753809910586fdd575e0e2',
 'css/navegacao.css':'7ab6fc1bed418969d74fc6eacea545ea74115121f483bb46c686dc129dafea48'
};
for(const [rel,h] of Object.entries(frozen)) ok(sha(path.join(ROOT,rel))===h,'FINAL 7 congelado intacto: '+rel);

const nav=fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
const voiceSrc=fs.readFileSync(path.join(ROOT,'js/navegacao/voz-navegacao.js'),'utf8');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');

// 2) Rota percorrida: uma única divisão alimenta route/progress/status.
ok(/function aplicarDivisaoVisualRota\(/.test(nav),'existe divisão visual única da rota');
ok(/setSource\(SOURCE_PROGRESS,[\s\S]*setSource\(SOURCE_ROUTE,[\s\S]*setSource\(SOURCE_ROUTE_STATUS/.test(nav),'progress, route e route-status usam a mesma divisão');
ok(/status-proxima-recortado-v81/.test(nav),'SOURCE_ROUTE_STATUS proxima é recortado no snapped point');
ok(/diagnosticoRotaVisualV81/.test(nav)&&/routeStatusFutureCoordinates/.test(nav)&&/routeStatusPastCoordinates/.test(nav),'diagnóstico de rota visual contém passado/futuro/status');
ok(/'passado',0\.07/.test(nav)&&/LAYER_PROGRESS[\s\S]*?'line-opacity':\.20/.test(nav),'nenhuma layer passada usa verde/opacity forte');

// Teste da função real de divisão em 0/25/50/75/95%.
let navInstrumentado=nav.replace('global.PacoteEMatoNavegacao=Object.freeze({',`global.__PEMATO_TEST8={
 setRota:r=>{rota=r;},
 setMode:m=>{modoMapaNavegacao=m;},
 setMap:m=>{mapa=m;mapReady=true;},
 split:divisaoVisualDaRota,
 apply:aplicarDivisaoVisualRota
};\nglobal.PacoteEMatoNavegacao=Object.freeze({`);
const sources={};
for(const id of ['pemato-nav-route','pemato-nav-route-status','pemato-nav-progress','pemato-nav-driver','pemato-nav-maneuver-overlay','pemato-nav-all-stops']){
 sources[id]={data:null,setData(d){this.data=d;}};
}
const mapMock={
 getSource:id=>sources[id]||null,getLayer:()=>({}),hasImage:()=>true,getStyle:()=>({layers:[]}),
 on(){},getCanvas:()=>({style:{}}),setPaintProperty(){},setLayoutProperty(){},addLayer(){},addSource(){},addImage(){}
};
const nctx={window:null,console,document:{readyState:'loading',body:{dataset:{pematoModule:'navegacao'}},getElementById:()=>null,querySelector:()=>null,addEventListener(){}},navigator:{userAgent:'Android wv'},matchMedia:()=>({matches:true}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},setTimeout:()=>1,clearTimeout(){},addEventListener(){},PacoteEMatoConfiguracoes:{obter:()=>({navegacao:'pacote_emato'})},PacoteEMatoServicoRota:{geometriaValida:g=>!!g&&g.type==='LineString'&&Array.isArray(g.coordinates)&&g.coordinates.length>=2},PacoteEMatoMarcadores:{segmentosStatusDaRota:r=>[{type:'Feature',properties:{status:'proxima'},geometry:r.geometria}]}};
nctx.window=nctx;vm.createContext(nctx);vm.runInContext(navInstrumentado,nctx);
const T=nctx.__PEMATO_TEST8;
const coords=Array.from({length:101},(_,i)=>[-46.6+i*0.0001,-23.55]);
T.setRota({geometria:{type:'LineString',coordinates:coords},instrucoes:[{type:'Right',globalToIndex:90}]});
T.setMode('navigation-active');T.setMap(mapMock);
for(const pct of [0,25,50,75,95]){
 const idx=pct;const nearest={index:idx,t:0,point:coords[idx]};
 const d=T.split(nearest);ok(Math.abs(d.progressFraction-pct/100)<0.000001,`progresso ${pct}% usa fração correta`);
 ok(d.futuros[0][0]===coords[idx][0]&&d.passados[d.passados.length-1][0]===coords[idx][0],`progresso ${pct}% não cria gap entre passado/futuro`);
 ok(T.apply(nearest)===true,`progresso ${pct}% aplicado às sources reais`);
 const route=sources['pemato-nav-route'].data.features[0]?.geometry?.coordinates||[];
 const progress=sources['pemato-nav-progress'].data.features[0]?.geometry?.coordinates||[];
 const status=sources['pemato-nav-route-status'].data.features||[];
 const statusFuture=status.find(f=>f.properties.status==='proxima')?.geometry?.coordinates||[];
 ok(route.length===0||route[0][0]===coords[idx][0],`SOURCE_ROUTE ${pct}% começa no snapped point`);
 ok(progress.length===0||progress[progress.length-1][0]===coords[idx][0],`SOURCE_PROGRESS ${pct}% termina no snapped point`);
 ok(statusFuture.length===0||statusFuture[0][0]===coords[idx][0],`SOURCE_ROUTE_STATUS ${pct}% não recoloca verde antes do motorista`);
}

// 3) Voz GPS: guard central e comportamento de escopo.
function criarVoiceCtx({swallow=false}={}){
 const spoken=[];const store=new Map();const timers=[];let voices=[{lang:'pt-BR',name:'PT BR',default:true}];let voicesChanged=null;let speakCount=0;
 function U(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;this.volume=1;this.voice=null;}
 const synth={speaking:false,getVoices:()=>voices,speak(u){speakCount++;spoken.push(u.text);if(swallow)return;this.speaking=true;u.onstart?.();this.speaking=false;u.onend?.();},cancel(){this.speaking=false;},resume(){},addEventListener(ev,cb){if(ev==='voiceschanged')voicesChanged=cb;}};
 const document={hidden:false,body:{dataset:{pematoModule:'navegacao'}},addEventListener(){}};
 const ctx={window:null,console,SpeechSynthesisUtterance:U,speechSynthesis:synth,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},document,navigator:{userAgent:'Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit Version/4.0 Chrome/120 Mobile Safari/537.36'},setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length;},clearTimeout:()=>{}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(voiceSrc,ctx);
 return {ctx,V:ctx.PacoteEMatoVozNavegacao,spoken,store,timers,synth,getSpeakCount:()=>speakCount,setVoices:v=>{voices=v;voicesChanged?.();}};
}
const v=criarVoiceCtx();let c={navigationMode:'overview',navegacaoInternaAtiva:false,vozNavegacaoAtiva:true,temInstrucaoValida:true,modulo:'navegacao',provider:'pacote_emato'};
v.V.configurarContexto(()=>c);v.V.definirInstrucaoAtual('0:1:10:right');
ok(v.V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'agora',texto:'Vire à direita.',minIntervaloMs:0})===false&&v.spoken.length===0,'overview + voz habilitada = 0 frases GPS');
c={...c,navigationMode:'navigation-active',navegacaoInternaAtiva:true,modulo:'bipagem'};
ok(v.V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'agora',texto:'Vire à direita.',minIntervaloMs:0})===false&&v.spoken.length===0,'Bipagem = 0 frases GPS');
c={...c,modulo:'navegacao',provider:'waze'};
ok(v.V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'agora',texto:'Vire à direita.',minIntervaloMs:0})===false&&v.spoken.length===0,'Waze/Maps externo = 0 voz GPS Pacote É Mato');
c={...c,provider:'pacote_emato'};
ok(v.V.podeFalarNavegacao()===true,'guard central libera somente navegação interna ativa');
ok(v.V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'agora',texto:'Vire à direita.',minIntervaloMs:0})===true,'navegação interna ativa aceita TTS');
ok(v.spoken.includes('Vire à direita.'),'frase GPS chega ao speechSynthesis em navegação interna');
// Confirmação audível somente ao ativar dentro da navegação.
v.V.definirAtiva(false);v.V.definirAtiva(true);ok(v.V.desbloquear({confirmar:true})===true,'ativação de voz dispara teste audível dentro da navegação');
ok(v.spoken.includes('Voz de navegação ativada.'),'confirmação audível usa frase exigida');
// Saída da navegação bloqueia imediatamente novas falas.
c={...c,navigationMode:'overview',navegacaoInternaAtiva:false};
ok(v.V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'perto',texto:'Em 100 metros, vire à direita.',minIntervaloMs:0})===false,'sair navigation-active encerra novas falas GPS');

// 4) Falha de speak: não marca como falado antes de onstart + watchdog/retry limitado.
const bad=criarVoiceCtx({swallow:true});let bc={navigationMode:'navigation-active',navegacaoInternaAtiva:true,vozNavegacaoAtiva:true,temInstrucaoValida:true,modulo:'navegacao',provider:'pacote_emato'};
bad.V.configurarContexto(()=>bc);bad.V.definirInstrucaoAtual('1:2:20:left');
ok(bad.V.falarInstrucaoNavegacao({instructionId:'1:2:20:left',fase:'agora',texto:'Vire à esquerda.',minIntervaloMs:0})===true,'speak engolido inicia tentativa sem marcar sucesso');
let guard=0;while(bad.timers.length&&guard++<12){const t=bad.timers.shift();t.fn();}
const dBad=bad.V.diagnostico();
ok(bad.getSpeakCount()===3,'watchdog limita retry Android a 3 tentativas');
ok(dBad.lastError==='TTS_START_TIMEOUT'&&dBad.lastStart==null,'sem onstart fica TTS_START_TIMEOUT e não simula READY');
ok(bad.V.falarInstrucaoNavegacao({instructionId:'1:2:20:left',fase:'agora',texto:'Vire à esquerda.',minIntervaloMs:0})===false,'após 3 falhas a mesma fase não entra em loop infinito');
ok(/u\.onstart\s*=\s*\(\)\s*=>\s*\{[^]*?falasExecutadas\.add\(chave\)/.test(voiceSrc),'falha sem onstart não entra em falasExecutadas');

// 5) Voices podem carregar depois.
const late=criarVoiceCtx();late.setVoices([]);let lc={navigationMode:'navigation-active',navegacaoInternaAtiva:true,vozNavegacaoAtiva:true,temInstrucaoValida:true,modulo:'navegacao',provider:'pacote_emato'};late.V.configurarContexto(()=>lc);
ok(late.V.diagnostico().voicesCount===0,'getVoices vazio inicialmente é aceito');
late.setVoices([{lang:'pt-BR',name:'Android PT BR',default:true}]);
ok(late.V.diagnostico().selectedVoice?.lang==='pt-BR','voiceschanged seleciona pt-BR quando chega depois');

// 6) Integração estática/cache-buster/diagnósticos.
ok(/function podeFalarNavegacao\(/.test(voiceSrc),'guard central podeFalarNavegacao existe');
ok(/u\.onstart\s*=\s*\(\)\s*=>\s*\{[^]*?falasExecutadas\.add\(chave\)/.test(voiceSrc),'fase só é marcada falada dentro de onstart');
ok(/TTS_START_TIMEOUT/.test(voiceSrc)&&/MAX_RETRY\s*=\s*3/.test(voiceSrc),'watchdog e máximo 3 tentativas implementados');
ok(/voiceschanged/.test(voiceSrc),'voiceschanged tratado para Android');
ok(/pemato_nav_voice_enabled_v81/.test(voiceSrc),'preferência da voz GPS permanece separada');
ok(/voz-navegacao\.js\?v=20261017-v81-hotfix-final-8/.test(html),'cache-buster da voz atualizado para FINAL 8');
ok(/navegacao\.js\?v=20261017-v81-hotfix-final-8/.test(html),'cache-buster da navegação atualizado para FINAL 8');
ok(/moduloVozNavegacao\(\)\?\.limparEstado\?\.\(\{cancelar:true\}\)/.test(nav),'saída/externo possui cancelamento do TTS GPS');
ok(/desbloquear\?\.\(\{confirmar:true\}\)/.test(nav),'botão Voz ativa solicita confirmação audível somente no GPS interno');

console.log('\nV81 HOTFIX FINAL 8 — ROTA PERCORRIDA + VOZ INTERNA ACEITOS.');
