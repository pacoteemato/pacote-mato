'use strict';
const fs=require('fs'); const vm=require('vm'); const path=require('path');
const NEW=path.resolve(__dirname,'../js/roteirizacao/servico-rota.js');
const OLD=path.resolve(__dirname,'fixtures/servico-rota-v80.js');
function assert(c,m){if(!c)throw new Error(m);console.log('OK  '+m);}
function distance(points){let d=0;for(let i=1;i<points.length;i++){const dx=(points[i].lon-points[i-1].lon)*100000,dy=(points[i].lat-points[i-1].lat)*100000;d+=Math.hypot(dx,dy);}return Math.round(d*10);}
function load(file){
  const source=fs.readFileSync(file,'utf8');
  const context={console,setTimeout,clearTimeout,AbortController,window:null};context.window=context;
  context.PEMATO_MAP_CONFIG={optimizeEndpoint:'https://mock/optimize',routeEndpoint:'https://mock/route',routingRequestTimeoutMs:5000,routingMaxPointsPerRequest:12};
  context.PacoteEMatoMarcadores={chaveFisicaMarcador:p=>`c:${Number(p.latitude).toFixed(5)}|${Number(p.longitude).toFixed(5)}`};
  context.fetch=async (url,opt={})=>{
    const body=opt.body?JSON.parse(opt.body):{};
    const lag=(JSON.stringify(body).length%7)+1; await new Promise(r=>setTimeout(r,lag));
    if(url.includes('optimize')){
      let ids=(body.stops||[]).map(s=>String(s.id));
      if(body.type==='short') ids=ids.slice().sort().reverse();
      else if(body.type==='balanced') ids=ids.length>1?[...ids.slice(1),ids[0]]:ids;
      return {ok:true,status:200,json:async()=>({ok:true,orderIds:ids,issues:{unassignedJobs:[]}})};
    }
    const pts=(body.points||[]).map(p=>({lat:Number(p.lat),lon:Number(p.lon)}));
    const d=distance(pts) + (body.type==='balanced'?17:0);
    const t=Math.round(d*0.72 + (body.type==='short'?23:0));
    const legs=[]; for(let i=1;i<pts.length;i++)legs.push({distance:Math.max(1,Math.round(distance([pts[i-1],pts[i]]))),time:10,steps:[]});
    const feature={type:'Feature',geometry:{type:'LineString',coordinates:pts.map(p=>[p.lon,p.lat])},properties:{distance:d,time:t,legs,waypoints:pts}};
    return {ok:true,status:200,json:async()=>({ok:true,provider:'mock',feature})};
  };
  vm.createContext(context);vm.runInContext(source,context,{filename:file});return context.PacoteEMatoServicoRota;
}
function route(pref='short',count=7){const paradas=[];for(let i=0;i<count;i++)paradas.push({id:String(i+1),latitude:-23.55+(i%3)*.003,longitude:-46.64+((i*7)%5)*.002,statusEntrega:'pendente'});return {id:'R',veiculo:'carro',preferenciaRota:pref,pontoInicial:{lat:-23.552,lon:-46.645},pontoFinal:{lat:-23.53,lon:-46.62},retornarAoInicio:false,tempoParadaSegundos:20,paradas,ordem:paradas.map(p=>p.id)};}
(async()=>{
  const oldSvc=load(OLD),newSvc=load(NEW);
  for(const pref of ['short','balanced']){
    for(const count of [3,7,12]){
      const r=route(pref,count);
      const [a,b]=await Promise.all([oldSvc.otimizarComparando(JSON.parse(JSON.stringify(r))),newSvc.otimizarComparando(JSON.parse(JSON.stringify(r)))]);
      assert(JSON.stringify(a.orderIds)===JSON.stringify(b.orderIds),`mesma rota vencedora V80/V81 (${pref}, ${count} paradas)`);
      assert(a.tipo===b.tipo && a.distance===b.distance && a.drivingTime===b.drivingTime,`mesmas métricas/critério (${pref}, ${count} paradas)`);
      const ac=a.comparacao.avaliadas.map(x=>`${x.origem}|${x.tipo}|${x.distancia}|${x.tempo}`).sort();
      const bc=b.comparacao.avaliadas.map(x=>`${x.origem}|${x.tipo}|${x.distancia}|${x.tempo}`).sort();
      assert(JSON.stringify(ac)===JSON.stringify(bc),`mesmo conjunto de candidatos avaliados (${pref}, ${count})`);
    }
  }
  console.log('\nEquivalência do vencedor comprovada com respostas mock idênticas.');
})().catch(e=>{console.error(e);process.exit(1)});
