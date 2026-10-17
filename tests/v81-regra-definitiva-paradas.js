'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(ROOT,'js/app.js'),'utf8');
const ok=(c,m)=>{if(!c)throw new Error(m);console.log('OK  '+m)};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
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
const hs=app.indexOf('    function removerAcentosPdfV71');
const he=app.indexOf('    function agruparItensEmLinhasPdfV71',hs);
let code=functionBlock(app,'normalizarCodigoPacoteBr')+'\n'+app.slice(hs,he).replace(/^    /gm,'')+'\n'+functionBlock(app,'reconstruirEntregasOriginaisV81')+'\nthis.H={decomporEnderecoFisicoPdfV71,chaveFisicaPdfV71,reconstruirEntregasOriginaisV81};';
const ctx={console};vm.createContext(ctx);vm.runInContext(code,ctx);const H=ctx.H;
const BR=n=>`BR${String(n).padStart(12,'0')}A`;

// Número principal nunca é substituído por apartamento/unidade.
let d=H.decomporEnderecoFisicoPdfV71('Avenida Y, 5350, Torre 4 Apto 1507');
ok(d.numero==='5350','número principal 5350 não vira torre/apto 1507');
d=H.decomporEnderecoFisicoPdfV71('Rua Z, 451, Apartamento 714');
ok(d.numero==='451','número principal 451 não vira apartamento 714');
ok(H.chaveFisicaPdfV71('Rua Z, 451, Apartamento 714')===H.chaveFisicaPdfV71('Rua Z, 451, Apto 999'),'complemento não altera a chave física');
ok(!H.chaveFisicaPdfV71('Rua Enta, Alto da Mooca, São Paulo, 03195-010'),'CEP não é interpretado como número principal');
ok(!H.chaveFisicaPdfV71('Rua X, S/N, Apto 501'),'S/N não cria chave compartilhável');

function avaliar(nome,total,groups){
  const porEntrega=new Map();
  for(const [addr,ids] of groups){
    ids.forEach((id,j)=>porEntrega.set(id, typeof addr==='function'?addr(id,j):addr));
  }
  const regs=[];
  for(let i=1;i<=total;i++){
    const endereco=porEntrega.get(i)||`Rua Única ${i}, ${10000+i}`;
    regs.push({numeroParada:i,numeroOriginalPdf:i,origemLeitura:'deterministico-v73',endereco,codigos:[BR(i)],_indice:i-1});
  }
  const entregas=H.reconstruirEntregasOriginaisV81(regs);
  const fisicas=new Map();
  for(const e of entregas){if(!fisicas.has(e.chaveFisica))fisicas.set(e.chaveFisica,[]);fisicas.get(e.chaveFisica).push(e)}
  const multiplas=[...fisicas.values()].filter(g=>g.reduce((n,e)=>n+e.codigos.length,0)>1);
  const pacMulti=multiplas.reduce((n,g)=>n+g.reduce((s,e)=>s+e.codigos.length,0),0);
  const brs=entregas.flatMap(e=>e.codigos);
  ok(entregas.length===total,`${nome}: ${total} entregas do PDF preservadas`);
  ok(brs.length===total && new Set(brs).size===total,`${nome}: nenhum BR perdido ou duplicado`);
  return {entregas,fisicas,multiplas,pacMulti};
}

const spokeGroups=[
  [(id,j)=>`Rua Leais Paulistanos, 525, ${j?'Apto 902':'Bloco 1 Apto 101'}`,[10,11]],
  [(id,j)=>`Avenida dos Estados, 5350, Torre ${j+1} Apto ${1100+j}`,[34,35,36]],
  [(id,j)=>`Avenida Varsóvia, 850, Apto ${201+j}`,[53,54]],
  [(id,j)=>`Avenida João Pessoa, 873, Bloco ${j+1} Apto ${501+j}`,[69,70,71,72,73]],
  [(id,j)=>`Rua do Centro, 1377, Sala ${10+j}`,[90,91]],
  [(id,j)=>`Rua Eleutério, 171, Apto ${701+j}`,[98,99,100,101,102]],
  [(id,j)=>`Rua Ancara, 105, Bloco ${j?1:3}, Apto ${j?501:903}`,[119,120]],
  [(id,j)=>j===0?'Rua Ancara, 100':`Rua Ancara, 100, Torre ${j} Apto ${1103+j}`,[121,122,123]]
];
const sp=avaliar('Spoke sintético de aceitação',123,spokeGroups);
ok(sp.fisicas.size===107,'Spoke: 107 paradas físicas');
ok(sp.multiplas.length===8,'Spoke: 8 paradas múltiplas');
ok(sp.pacMulti===24,'Spoke: 24 pacotes nas paradas múltiplas');
const key105=H.chaveFisicaPdfV71('Rua Ancara, 105');
const key100=H.chaveFisicaPdfV71('Rua Ancara, 100');
ok((sp.fisicas.get(key105)||[]).length===2,'Spoke: Ancara 105 = 1 parada / 2 pacotes');
ok((sp.fisicas.get(key100)||[]).length===3,'Spoke: Ancara 100 = 1 parada / 3 pacotes');

const pdf91Groups=[
  [(id,j)=>`Rua General Júlio Marcondes Salgado, 303, Apto ${j?709:1603}`,[4,5]],
  ['R Mário de Andrade, 16',[11,12]],
  ['Avenida General Olímpio da Silveira, 386',[13,14]],
  ['Rua Doutor Albuquerque Lins, 634, Apto 45',[25,26]],
  ['Avenida Angélica, 634, Apt 1804',[34,35,36]],
  ['R Martim Francisco, 107, Apartamento 64',[38,39,40,41]],
  ['Alameda Glete, 1049',[42,43]],
  ['Avenida São João, 1833',[44,45]],
  ['Rua João Monteiro, 58, Ap 1004',[47,48]],
  [(id,j)=>`Alameda Barão de Limeira, 1380, ${j?'Apartamento 24 edifício Saip':'Apto 11'}`,[56,57]],
  [(id,j)=>`Rua Sousa Lima, 86, ${j?'Portaria':'Apto 503'}`,[70,71]],
  [(id,j)=>`Rua Doutor Sérgio Meira, 230, ${j===2?'Bloco 1 Apto 142':'Apto 103 Bloco 03'}`,[73,74,75]],
  [(id,j)=>`Rua do Bosque, 980, ${j?'Apto 166 Bloco A':'Torre C Apto 86'}`,[78,79]],
  [(id,j)=>`Rua do Bosque, 804, ${j?'Ap 118 torre 2':'203 torre 2'}`,[80,81]],
  [(id,j)=>`Rua Anhangüera, 451, Apto ${[2503,714,2111][j]}`,[84,85,86]],
  [(id,j)=>`Rua Doutor Ribeiro de Almeida, 88, Apto ${j?51:181} Bloco A`,[87,88]],
  ['Rua dos Americanos, 220',[90,91]],
  [(id,j)=>j===0?'Avenida Rudge, 485':`Avenida Rudge, 485, Apto ${j===1?620:1213}`,[93,94,95]]
];
const p91=avaliar('PDF 91 sintético de aceitação',102,pdf91Groups);
ok(p91.fisicas.size===78,'PDF 91: 78 paradas físicas');
ok(p91.multiplas.length===18,'PDF 91: 18 paradas múltiplas');
ok(p91.pacMulti===42,'PDF 91: 42 pacotes nas paradas múltiplas');
ok((p91.fisicas.get(H.chaveFisicaPdfV71('Rua Anhangüera, 451'))||[]).length===3,'PDF 91: Anhangüera 451 = 1 parada / 3 pacotes');
ok((p91.fisicas.get(H.chaveFisicaPdfV71('Avenida Rudge, 485'))||[]).length===3,'PDF 91: Avenida Rudge 485 = 1 parada / 3 pacotes');
ok((p91.fisicas.get(H.chaveFisicaPdfV71('Rua Doutor Sérgio Meira, 230'))||[]).length===3,'PDF 91: Dr Sérgio Meira 230 = 1 parada / 3 pacotes');
ok((p91.fisicas.get(H.chaveFisicaPdfV71('Rua Martim Francisco, 107'))||[]).length===4,'PDF 91: Martim Francisco 107 = 1 parada / 4 pacotes');

// Scanner/Bipagem continuam intactos e individualizados.
const protectedHashes={
 'js/bipagem/bipagem-area.js':'8254623dc75a4620a81f95baba39f07bbf9392c950e4810ea9bf043f6894ff7a',
 'js/bipagem/operacoes-pacotes.js':'c6b1bbb874055323efa833ac8bfcac26e13dff91812fe89d28491af26de688a1',
 'js/bipagem/rota-ativa-bridge.js':'6eda7298a85a1b4a89a7f5ef3de34874bd8fa304dcb35030a8086b330fd82610'
};
for(const [rel,h] of Object.entries(protectedHashes)) ok(sha(path.join(ROOT,rel))===h,'Bipagem intacta: '+rel);
const proc=functionBlock(app,'processarCodigo');
ok(/pacotesBipados\.add\(identificado\)/.test(proc),'bipar um BR marca somente o identificado');
ok(!/listaParada\.forEach[\s\S]*pacotesBipados\.add/.test(proc),'bipar um pacote não bipa os outros da parada');
console.log('\nREGRA DEFINITIVA DE PARADAS — ACEITAÇÃO CONCLUÍDA.');
