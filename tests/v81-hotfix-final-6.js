'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const ok=(c,m)=>{if(!c)throw new Error(m);console.log('OK  '+m)};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// 1) Áreas congeladas da base HOTFIX FINAL 5.
const protectedHashes={
 'js/app.js':'d6ab8b187c5544add3c34ef466745e2dcd268e784c4a5f2fea2a4d6369eea738',
 'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
 'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
 'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610',
 'js/roteirizacao/roteirizacao.js':'b5f80a0fc471d8297c0cd326b944f3eff2f3156d36237e52e0919fc3ed8f91f4',
 'js/importacao/xlsx.js':'fdf359975e1282ed8aa28b5ae97dfbb21c1d82645355a40e5dc5f52029fb25fc',
 'js/importacao/fluxo-importacao.js':'f48b8826553a8431e320fa254c4c490c32742ebc00e3b8ac4b5bb9948121eae1'
};
for(const [rel,h] of Object.entries(protectedHashes)) ok(sha(path.join(ROOT,rel))===h,'área congelada intacta: '+rel);

const nav=fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
const markerStart=nav.indexOf('  function garantirImagemBalao()');
const markerEnd=nav.indexOf('\n  function prepararIconesParadasV12',markerStart);
const markerHash=crypto.createHash('sha256').update(nav.slice(markerStart,markerEnd)).digest('hex');
ok(markerHash==='59d4c5e1eca9458b7053c67f3abf2ef95615ea59adb5a2a643df77191318ab2f','marcador HOTFIX FINAL 5 preservado sem redesenho');

// 2) Mapa com hierarquia de vias e paleta mais clara.
const config=fs.readFileSync(path.join(ROOT,'js/mapa/config.js'),'utf8');
const layers=[
 {id:'background',type:'background'},
 {id:'water',type:'fill','source-layer':'water'},
 {id:'park',type:'fill','source-layer':'park'},
 {id:'road-residential',type:'line','source-layer':'residential'},
 {id:'road-tertiary',type:'line','source-layer':'tertiary'},
 {id:'road-secondary',type:'line','source-layer':'secondary'},
 {id:'road-primary',type:'line','source-layer':'primary'},
 {id:'road-motorway',type:'line','source-layer':'motorway'},
 {id:'road-label',type:'symbol','source-layer':'transportation_name'},
 {id:'road-shield',type:'symbol','source-layer':'highway_ref'},
 {id:'poi-shop',type:'symbol','source-layer':'poi'}
];
const paint=new Map(),layout=new Map();
const map={getStyle:()=>({layers}),getLayer:id=>layers.find(l=>l.id===id),setPaintProperty:(i,k,v)=>paint.set(i+'|'+k,v),setLayoutProperty:(i,k,v)=>layout.set(i+'|'+k,v)};
const ctx={window:null,localStorage:{removeItem(){}},CustomEvent:function(){},console};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(config,ctx);
ctx.PacoteEMatoMapaConfig.aplicarEstiloMapaClean(map,{navegacaoAtiva:false});
ok(paint.get('background|background-color')==='#f7f8f7','fundo off-white');
ok(paint.get('road-residential|line-color')==='#ffffff','rua local praticamente branca');
ok(paint.get('road-tertiary|line-color')!==paint.get('road-secondary|line-color'),'tertiary e secondary possuem hierarquia de cor');
ok(paint.get('road-primary|line-color')!==paint.get('road-motorway|line-color'),'primary e motorway possuem hierarquia de cor');
ok(paint.get('park|fill-color')==='#edf5ed','parques suaves');
ok(paint.get('water|fill-color')==='#e5f2f7','água suave');
ok(paint.get('road-label|text-color')==='#2f3438'&&layout.get('road-label|visibility')==='visible','road labels escuros e preservados');
ok(layout.get('poi-shop|visibility')==='none','POIs comerciais continuam reduzidos');
ok(Number(paint.get('road-shield|text-opacity'))<=0.28,'road shields continuam discretos');

// 3) Renderer real de tipos/phrases/SVGs.
const a=nav.indexOf('  function tipoGeoapifyNormalizado(inst)');
const b=nav.indexOf('  function indiceGlobalInstrucao(inst, campo)',a);
const mctx={window:null};mctx.window=mctx;vm.createContext(mctx);
vm.runInContext(nav.slice(a,b).replace(/^  /gm,'')+'\nthis.M=tipoVisualManobra;this.S=svgManobra;this.F=fraseManobra;this.N=tipoGeoapifyNormalizado;this.E=valorSaidaRotatoria;',mctx);
const expected={
 Straight:'reta',Right:'direita',Left:'esquerda',SlightRight:'leve_direita',SlightLeft:'leve_esquerda',
 SharpRight:'acentuada_direita',SharpLeft:'acentuada_esquerda',TurnAroundRight:'retorno_direita',TurnAroundLeft:'retorno_esquerda',
 ExitRight:'saida_direita',ExitLeft:'saida_esquerda',StayRight:'leve_direita',StayLeft:'leve_esquerda',MergeRight:'leve_direita',MergeLeft:'leve_esquerda',DestinationReached:'chegada'
};
for(const [type,visual] of Object.entries(expected)) ok(mctx.M({type})===visual,`${type} -> ${visual}`);
ok(mctx.N({type:'SlightRight'})==='slight right','CamelCase SlightRight normalizado');
ok(mctx.N({type:'TurnAroundLeft'})==='turn around left','CamelCase TurnAroundLeft normalizado');
ok(mctx.M({type:'Roundabout'})==='rotatoria','Roundabout sem saída não inventa saída');
ok(mctx.M({type:'Roundabout',roundabout_exit:3})==='rotatoria_saida','Roundabout com saída real usa SVG de saída');
for(const visual of ['reta','direita','esquerda','leve_direita','leve_esquerda','acentuada_direita','acentuada_esquerda','retorno_direita','retorno_esquerda','rotatoria','rotatoria_saida','chegada']){
 const svg=mctx.S(visual); ok(/^<svg/.test(svg)&&/<path/.test(svg)&&!svg.includes('□'),'SVG visível sem placeholder: '+visual);
}
ok(mctx.F({type:'Right',streets:['Rua do Oratório']},{comRua:true,pontuar:true})==='Vire à direita na Rua do Oratório.','frase Right + rua');
ok(mctx.F({type:'Left',streets:['Rua Ancara']},{comRua:true,pontuar:true})==='Vire à esquerda na Rua Ancara.','frase Left + rua');
ok(mctx.F({type:'Straight',streets:['Avenida X']},{comRua:true,pontuar:true})==='Continue em frente pela Avenida X.','frase Straight + rua');
ok(mctx.F({type:'TurnAroundRight'},{comRua:true,pontuar:true})==='Faça o retorno.','frase retorno');
ok(mctx.F({type:'Roundabout',roundabout_exit:3,streets:['Avenida X']},{comRua:true,pontuar:true})==='Na rotatória, pegue a 3ª saída para Avenida X.','frase rotatória com saída real');
ok(mctx.F({type:'DestinationReached'},{comRua:true,pontuar:true})==='Você chegou ao destino.','frase chegada');

// 4) TTS GPS separado da Bipagem, pt-BR, persistência e antirrepetição.
const voiceSrc=fs.readFileSync(path.join(ROOT,'js/navegacao/voz-navegacao.js'),'utf8');
const spoken=[];let cancels=0;const store=new Map();
function U(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;this.volume=1;this.voice=null;}
const synth={speaking:false,getVoices:()=>[{lang:'pt-BR',name:'PT BR'}],speak(u){this.speaking=true;if(u.onstart)u.onstart();spoken.push({text:u.text,lang:u.lang,rate:u.rate});this.speaking=false;if(u.onend)u.onend();},cancel(){cancels++;this.speaking=false;},addEventListener(){}};
const vctx={window:null,console,SpeechSynthesisUtterance:U,speechSynthesis:synth,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}};vctx.window=vctx;vm.createContext(vctx);vm.runInContext(voiceSrc,vctx);
const V=vctx.PacoteEMatoVozNavegacao;
ok(V.disponivel()===true,'SpeechSynthesis detectado no teste simulado');
V.desbloquear();
V.definirInstrucaoAtual('0:1:10:right');
ok(V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'longe',texto:'Em 300 metros, vire à direita na Rua do Oratório.',minIntervaloMs:0})===true,'TTS fala aviso antecipado');
ok(V.falarInstrucaoNavegacao({instructionId:'0:1:10:right',fase:'longe',texto:'duplicada',minIntervaloMs:0})===false,'TTS não repete mesma fase da mesma instrução');
ok(spoken.some(x=>x.text==='Em 300 metros, vire à direita na Rua do Oratório.'&&x.lang==='pt-BR'),'TTS usa frase de motorista em pt-BR');
ok(V.falarInstrucaoNavegacao({instructionId:'9:9:9:left',fase:'agora',texto:'frase velha',minIntervaloMs:0})===false,'fila descarta instrução que não é mais atual');
V.definirAtiva(false);ok(store.get('pemato_nav_voice_enabled_v81')==='0'&&cancels>=1,'botão Voz ativa pode persistir mudo e cancelar somente ao desligar');
V.definirAtiva(true);ok(store.get('pemato_nav_voice_enabled_v81')==='1','preferência de voz GPS persiste separadamente');

// 5) Integração estrutural: módulo, câmera, diagnóstico, botão e proteção contra fitBounds.
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const css=fs.readFileSync(path.join(ROOT,'css/navegacao.css'),'utf8');
ok(/voz-navegacao\.js/.test(html),'módulo de voz GPS carregado antes da navegação');
ok(/navManeuverIcon/.test(html)&&/navManeuverStreet/.test(html)&&/navManeuverAfter/.test(html),'DOM do painel de manobra contém ícone, frase e segunda manobra');
ok(/\.nav-maneuver-icon svg\{[^}]*width:56px/i.test(css),'SVG principal tem tamanho de navegador');
ok(/\.nav-maneuver-next-icon svg\{[^}]*width:26px/i.test(css),'segunda manobra usa SVG menor');
ok(/zoom = 18\.65/.test(nav)&&/else zoom = 18\.20/.test(nav)&&/pitch:interna\?56:0/.test(nav),'câmera urbana usa zoom 18.2–18.65 e pitch 56°');
ok(/yDesejado=topo\+\(fundo-topo\)\*0\.70/.test(nav),'veículo permanece em aproximadamente 70% da altura útil');
ok(/moduloVozNavegacao\(\)\?\.desbloquear/.test(nav),'TTS é desbloqueado após Navegar > Pacote É Mato');
ok(/diagnosticoManobrasReal/.test(nav)&&/diagnosticoNavegacaoVozV81/.test(nav),'diagnósticos de manobra e voz disponíveis');
ok(/if \(!mapa \|\| !mapReady \|\| navegacaoInternaAtiva\(\)\) return;[\s\S]*fitBounds/.test(nav),'fitBounds geral protegido durante navigation-active');
ok(!/speechSynthesis\.cancel\?\.\(\)[\s\S]{0,160}atualizarInstrucao/.test(nav),'atualização GPS não cancela TTS continuamente');

console.log('\nHOTFIX FINAL 6 — testes estruturais/automatizados concluídos.');
