'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(ROOT,'js/app.js'),'utf8');
const ok=(c,m)=>{if(!c)throw new Error(m);console.log('OK  '+m)};
function functionBlock(src,name){
  const start=src.indexOf(`    function ${name}(`); if(start<0) throw new Error('função ausente '+name);
  let i=src.indexOf('{',start),d=0,q=null,esc=false,line=false,bc=false;
  for(;i<src.length;i++){const c=src[i],n=src[i+1];
    if(line){if(c==='\n')line=false;continue} if(bc){if(c==='*'&&n==='/'){bc=false;i++}continue}
    if(q){if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c===q)q=null;continue}
    if(c==='/'&&n==='/'){line=true;i++;continue}if(c==='/'&&n==='*'){bc=true;i++;continue}
    if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;else if(c==='}'&&--d===0)return src.slice(start,i+1).replace(/^    /gm,'');
  } throw new Error('fim não encontrado '+name);
}
const shaText=t=>crypto.createHash('sha256').update(t).digest('hex');

// 1) processarCodigo não foi alterado no hotfix de apresentação/voz.
const proc=functionBlock(app,'processarCodigo');
ok(shaText(proc)==='dc7f53dc0494e94b8c492086b75c3f7f29086fef74087004a774764828af628c','processarCodigo permanece byte a byte equivalente ao HOTFIX FINAL 3');
ok(/pacotesBipados\.add\(identificado\)/.test(proc),'Bipagem continua marcando somente o BR identificado');
ok(!/listaParada\.forEach[\s\S]*pacotesBipados\.add/.test(proc),'Bipagem não marca os demais BRs da parada');

// 2) Render real da tela Paradas & Endereços usa ENTREGA original como identidade visual.
const elements={};
for(const id of ['listaParadasModal','contadorTodos','contadorDuplos','rotaModalContagem','resumoMultiplosRota']) elements[id]={innerHTML:'',innerText:'',textContent:''};
const ctxRender={
  console,
  document:{getElementById:id=>elements[id]||(elements[id]={innerHTML:'',innerText:'',textContent:''})},
  mapaRotas:{
    'travessa chicago|56':['BR-Z'],
    'rua ancara|105':['BR-A','BR-B'],
    'rua ancara|100':['BR-C','BR-D','BR-E']
  },
  entregasOriginaisPorEndereco:{
    'travessa chicago|56':[118],
    'rua ancara|105':[119,120],
    'rua ancara|100':[121,122,123]
  },
  paradaFisicaPorEndereco:{'travessa chicago|56':107,'rua ancara|105':108,'rua ancara|100':109},
  stopCorrespondente:{'BR-Z':107,'BR-A':108,'BR-B':108,'BR-C':109,'BR-D':109,'BR-E':109},
  nomeExibicao:{'travessa chicago|56':'Travessa Chicago, 56','rua ancara|105':'Rua Ancara, 105','rua ancara|100':'Rua Ancara, 100'},
  detalhesEntregasPorEndereco:{
    'travessa chicago|56':[{entregaPdf:118,complemento:'',pacotes:['BR-Z']}],
    'rua ancara|105':[
      {entregaPdf:119,complemento:'Bl 3 apto 903',pacotes:['BR-A']},
      {entregaPdf:120,complemento:'Bloco 1 apto 501',pacotes:['BR-B']}
    ],
    'rua ancara|100':[
      {entregaPdf:121,complemento:'',pacotes:['BR-C']},
      {entregaPdf:122,complemento:'Torre 1 Apto 1104',pacotes:['BR-D']},
      {entregaPdf:123,complemento:'Apto 1105',pacotes:['BR-E']}
    ]
  },
  filtroAtualModal:'todos',pdfSemCodigosBipagem:false,todosPacotes:new Set(['BR-Z','BR-A','BR-B','BR-C','BR-D','BR-E']),totalEntregasPdfAtual:6,
  escaparHtmlHistorico:v=>String(v),encodeURIComponent,decodeURIComponent
};
vm.createContext(ctxRender);
vm.runInContext(functionBlock(app,'renderizarListaParadasModal')+'\nthis.renderizarListaParadasModal=renderizarListaParadasModal;',ctxRender);
ctxRender.renderizarListaParadasModal();
const html=elements.listaParadasModal.innerHTML;
ok(html.includes('ENTREGA 118'),'parada simples mostra ENTREGA 118 como identidade principal');
ok(html.includes('ENTREGA 119')&&html.includes('Também: 120'),'Ancara 105 mostra 119 como principal e 120 como também neste local');
ok(html.includes('ENTREGA 121')&&html.includes('Também: 122 · 123'),'Ancara 100 mostra 121 como principal e 122/123 visíveis');
ok(html.includes('2 pacotes neste endereço')&&html.includes('3 pacotes neste endereço'),'múltiplos mostram quantidade de pacotes no endereço');
ok((html.match(/ATENÇÃO/g)||[]).length===2,'ATENÇÃO aparece nas duas paradas com pacotes.length > 1');
ok(!html.includes('PARADA 108')&&!html.includes('PARADA 109'),'índice físico 108/109 não aparece como identidade principal');
ok(!/JUNTAS/i.test(html),'texto JUNTAS não é mais usado como destaque');
ok(html.includes('119 — Bl 3 apto 903')&&html.includes('120 — Bloco 1 apto 501'),'complementos continuam visíveis por entrega');
ok(elements.rotaModalContagem.textContent==='3 paradas físicas • 6 pacotes','resumo mantém contagem física separada dos pacotes');

// 3) Voz: inferência pelo pacote atualmente bipado; fala somente número original + Atenção.
const spoken=[];
class Utterance{constructor(text){this.text=String(text);this.lang='';this.volume=1;this.rate=1;this.pitch=1;this.onstart=null;this.onend=null;this.onerror=null;}}
const synth={speaking:false,pending:false,resume(){},cancel(){},speak(msg){spoken.push(msg.text);msg.onstart&&msg.onstart();msg.onend&&msg.onend();}};
const storage={voz_preferida:'navegacao_feminina',idioma_preferido:'pt'};
const ctxVoice={
  console,
  window:{PacoteEMatoBipagemArea:{vozAtiva:()=>true},speechSynthesis:synth,SpeechSynthesisUtterance:Utterance},
  SpeechSynthesisUtterance:Utterance,
  localStorage:{getItem:k=>storage[k]||null},
  ultimoCodigoBipado:'BR-C',
  mapaRotas:{'rua ancara|100':['BR-C','BR-D','BR-E']},
  carregarVozesSistema:()=>[],selecionarVozDisponivel:()=>null,
  setTimeout:fn=>{fn();return 1;},clearTimeout:()=>{}
};
vm.createContext(ctxVoice);
vm.runInContext(functionBlock(app,'falarParada')+'\nthis.falarParada=falarParada;',ctxVoice);
ctxVoice.falarParada(121,false,null);
ok(spoken.pop()==='121. Atenção.','BR-C / entrega 121 fala exatamente "121. Atenção."');
ctxVoice.ultimoCodigoBipado='BR-D';ctxVoice.falarParada(122,false,null);
ok(spoken.pop()==='122. Atenção.','BR-D / entrega 122 fala exatamente "122. Atenção."');
ctxVoice.ultimoCodigoBipado='BR-E';ctxVoice.falarParada(123,false,null);
ok(spoken.pop()==='123. Atenção.','BR-E / entrega 123 fala exatamente "123. Atenção."');
ctxVoice.mapaRotas={'travessa chicago|56':['BR-Z']};ctxVoice.ultimoCodigoBipado='BR-Z';ctxVoice.falarParada(118,false,null);
ok(spoken.pop()==='118','pacote normal continua falando apenas o número original');

const voiceBlock=functionBlock(app,'falarParada');
ok(!/Mesmo endereço da parada|Same address as stop|Misma dirección que la parada/.test(voiceBlock),'voz não lê outro número de entrega/parada');
const frasesAdicionadas=(voiceBlock.match(/frase \+= [^;]+;/g)||[]).join(' ');
ok(!/apartamento|bloco|quantidade|Mesmo endereço|same address|misma dirección/i.test(frasesAdicionadas),'voz não monta fala com apartamento, bloco, quantidade ou outros números');
ok(/pacotesDaParada\.length > 1/.test(voiceBlock),'ATENÇÃO é determinada por pacotes.length > 1');

console.log('\nNUMERAÇÃO + ALERTA DE MÚLTIPLOS — ACEITAÇÃO CONCLUÍDA.');
