const fs=require('fs');const {LV,PK,run}=require('./replay_nodes.cjs');const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const inpOf=n=>{const sc=rd[n][0].source[0];return rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];};
(async()=>{const P='R2 Alternate Payloads',Mg='R2 Alternate Merge Seat';const r={};for(const [w,W] of [['l',LV],['p',PK]]){const pp=await run(W,rd,P,inpOf(P));const m=await run(W,rd,Mg,inpOf(Mg),{[P]:wrap(pp)});r[w]=m;console.log(w,m.length,Object.keys(m[0].json).join(','),(m[0].json.enforcer_log||[]).length);}
const el=x=>x[0].json.enforcer_log;const key=x=>x.seat+'|'+x.kind+'|'+x.rule+'|'+x.item+'|'+x.cure_status;const L=new Map();el(r.l).forEach(x=>L.set(key(x),(L.get(key(x))||0)+1));const P2=new Map();el(r.p).forEach(x=>P2.set(key(x),(P2.get(key(x))||0)+1));
for(const [k,v] of L)if((P2.get(k)||0)!==v)console.log('live',v,'pkg',P2.get(k)||0,k);for(const [k,v] of P2)if(!L.has(k))console.log('pkg only',v,k);
console.log('stored len',(rd[Mg][0].data.main[0][0].json.enforcer_log||[]).length);
for(const w of ['l','p']){const s=r[w][0].json;console.log(w,'tried',JSON.stringify(s.alternates_tried).slice(0,700),'seated',JSON.stringify(s.alternates_seated).slice(0,200));}})();
