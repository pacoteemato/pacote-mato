const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const ok=(c,m)=>{if(!c)throw new Error(m);console.log('OK  '+m)};
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

// 1) Áreas congeladas da base FINAL 6.
const frozen={
 'js/app.js':'d6ab8b187c5544add3c34ef466745e2dcd268e784c4a5f2fea2a4d6369eea738',
 'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
 'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
 'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610',
 'js/importacao/fluxo-importacao.js':'f48b8826553a8431e320fa254c4c490c32742ebc00e3b8ac4b5bb9948121eae1',
 'js/importacao/xlsx.js':'fdf359975e1282ed8aa28b5ae97dfbb21c1d82645355a40e5dc5f52029fb25fc',
 'js/roteirizacao/roteirizacao.js':'b5f80a0fc471d8297c0cd326b944f3eff2f3156d36237e52e0919fc3ed8f91f4',
 'js/historico/historico-rotas.js':'3c17acda127ec15af43a75c37138976304d147b2a14b2afaa262b838cb6eff03'
};
for(const [rel,h] of Object.entries(frozen)) ok(sha(path.join(ROOT,rel))===h,'área congelada intacta: '+rel);

// 2) Estilo do mapa refinado.
const config=fs.readFileSync(path.join(ROOT,'js/mapa/config.js'),'utf8');
const layers=[
 {id:'background',type:'background'},
 {id:'water',type:'fill','source-layer':'water'},
 {id:'park',type:'fill','source-layer':'park'},
 {id:'building',type:'fill','source-layer':'building'},
 {id:'road-residential-casing',type:'line','source-layer':'residential'},
 {id:'road-residential',type:'line','source-layer':'residential'},
 {id:'road-tertiary',type:'line','source-layer':'tertiary'},
 {id:'road-secondary',type:'line','source-layer':'secondary'},
 {id:'road-primary',type:'line','source-layer':'primary'},
 {id:'road-motorway',type:'line','source-layer':'motorway'},
 {id:'road-label',type:'symbol','source-layer':'road'},
 {id:'poi-shop',type:'symbol','source-layer':'poi'}
];
const paint=new Map(),layout=new Map();
const map={getStyle:()=>({layers}),getLayer:id=>layers.find(x=>x.id===id),setPaintProperty:(i,k,v)=>paint.set(i+'|'+k,v),getPaintProperty:(i,k)=>paint.get(i+'|'+k),setLayoutProperty:(i,k,v)=>layout.set(i+'|'+k,v),getLayoutProperty:(i,k)=>layout.get(i+'|'+k,v)};
const ctx={window:null,localStorage:{removeItem(){}},CustomEvent:function(){},console};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(config,ctx);
ctx.PacoteEMatoMapaConfig.aplicarEstiloMapaClean(map,{navegacaoAtiva:true});
ok(paint.get('road-residential|line-color')==='#ffffff','rua local mantém interior claro');
ok(paint.get('road-residential-casing|line-color')==='#cfd6d9','rua local recebe casing mais definido');
ok(paint.get('road-primary|line-color')!==paint.get('road-residential|line-color'),'avenida/via principal tem hierarquia de cor');
ok(JSON.stringify(paint.get('road-motorway|line-width'))!==JSON.stringify(paint.get('road-residential|line-width')),'rodovia e rua local têm hierarquia de largura');
ok(Number(paint.get('building|fill-opacity'))>=0.4,'prédios ganham detalhe suave sem dominar');
ok(layout.get('road-label|visibility')==='visible' && Number(paint.get('road-label|text-halo-width'))>=2,'labels de rua ficam visíveis e mais nítidos');
ok(layout.get('poi-shop|visibility')==='none','POIs turísticos/comerciais continuam reduzidos');

// 3) Overlay de manobra no próprio mapa.
const nav=fs.readFileSync(path.join(ROOT,'js/navegacao/navegacao.js'),'utf8');
ok(/SOURCE_MANEUVER\s*=\s*'pemato-nav-maneuver-overlay'/.test(nav),'source dedicado para manobra no mapa');
ok(/LAYER_MANEUVER_ARROW\s*=\s*'pemato-nav-maneuver-arrow'/.test(nav),'layer dedicada para seta de manobra');
ok(/function garantirImagensManobraMapa\(/.test(nav),'ícones próprios da manobra são registrados no MapLibre');
ok(/function pontoAntesDaManobra\(/.test(nav),'posição da seta é calculada pouco antes da conversão');
ok(/function atualizarOverlayManobraMapa\(/.test(nav),'overlay acompanha a instrução atual');
ok(/icon-rotation-alignment':'map'/.test(nav) && /bearing/.test(nav),'seta da curva é alinhada à geometria/rumo da via');
ok(/distanciaAtual>520/.test(nav),'overlay não polui o mapa quando a manobra ainda está distante');
ok(/setSource\(SOURCE_MANEUVER,fc\(\[feature\]\)\)/.test(nav),'apenas uma manobra útil é renderizada por vez');

// 4) Rota passada significativamente apagada.
ok(/LAYER_PROGRESS[\s\S]*?'line-color':'#96a69f'[\s\S]*?'line-opacity':\.20/.test(nav),'trecho percorrido usa cinza-esverdeado e 20% de opacidade');
ok(/'passado','#96a69f'/.test(nav) && /'passado',0\.07/.test(nav),'segmentos de status passados ficam ainda mais apagados no FINAL 8');
ok(/function aplicarDivisaoVisualRota\(/.test(nav) && /setSource\(SOURCE_ROUTE_STATUS/.test(nav),'uma única divisão de progresso recorta rota e status no navigation-active');
ok(/desenharRota\(\); \/\/ restaura a geometria completa no overview/.test(nav),'overview restaura a rota completa após sair do GPS');

// 5) Novo indicador do motorista, visual only.
ok(/HOTFIX FINAL 7: ponteiro próprio de navegação premium/.test(nav),'novo ponteiro premium implementado');
ok(/canvas'\); a\.width = 72; a\.height = 72/.test(nav),'indicador usa canvas de alta definição');
ok(/icon-rotate':\['coalesce',\['get','heading'\],0\]/.test(nav),'rotação continua usando headingVisual já suavizado');
ok(/properties:\{heading:Number\.isFinite\(Number\(headingVisual\)\)/.test(nav),'source do motorista continua recebendo headingVisual');

console.log('\nV81 HOTFIX FINAL 7 — REFINO VISUAL ACEITO.');
