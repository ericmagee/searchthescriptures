// pkgSGR replay: runs the enforcer Build stubs (live s141 vs the parent) on every stored export; lists every E-SYN item whose list changes,
// and checks that every other item and the ids are unchanged.
const fs=require('fs');const SP=process.argv[2];
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load(process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s141.json'),B=load(SP);const PA=parts(A),PB=parts(B);
const ch=Object.keys(PB.M).filter(e=>reb(PA,e)!==reb(PB,e));console.log('stubs changed:',ch.map(e=>e+' '+(reb(PB,e).length-reb(PA,e).length)));
const run=async(rd,src,node)=>{const mk=name=>{const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=(A.nodes.find(n=>n.name===name)||{});return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
 const r=rd[node];const sn=r[0].source&&r[0].source[0]&&r[0].source[0].previousNode;const inp=mk(sn);const $input={all:()=>inp.all(),first:()=>inp.first(),item:inp.first()};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')(mk,$input);};
const lst=t=>{const i=t.indexOf("GIVE GROUND (withdraw, drop, grant, concede, narrow):\n");const j=t.indexOf('\nANSWER ID:',i);return i<0?null:t.slice(i+55,j).split('\n').filter(Boolean);};
const strs=o=>typeof o==='string'?[o]:o&&typeof o==='object'?Object.values(o).flatMap(strs):[];
const syn=items=>items.flatMap(i=>{const t=strs(i.json).join('\n');const out=[];for(const m of t.matchAll(/ITEM (Y\d+) \(E-SYN[^\n]*\nTHE SENTENCE: ([^\n]*)\n[\s\S]*?\nANSWER ID: Y\d+\.1/g))out.push({id:m[1],sent:m[2],list:lst(m[0]),hdr:m[0].slice(0,80)});return out;});
(async()=>{const W='/mnt/project-files/wall2024/';let tot={items:0,changed:0,added:0,removed:0,errs:0};
 for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const rd=JSON.parse(fs.readFileSync(W+f,'utf8')).data.resultData.runData;
  for(const node of ch.filter(e=>rd[e])){let o,n;try{o=await run(rd,reb(PA,node),node);n=await run(rd,reb(PB,node),node);}catch(e){console.log(f,node,'ERROR',e.message);tot.errs++;continue;}
   const stored=rd[node][0].data.main.flat().map(x=>x.json);const eq=JSON.stringify(o.map(i=>i.json))===JSON.stringify(stored);
   const so=strs(o.map(i=>i.json)).join('\n').replace(/ITEM Y\d+ \(E-SYN[\s\S]*?ANSWER ID: Y\d+\.1/g,'#').replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'T'),sn=strs(n.map(i=>i.json)).join('\n').replace(/ITEM Y\d+ \(E-SYN[\s\S]*?ANSWER ID: Y\d+\.1/g,'#').replace(/\d{4}-\d\d-\d\dT[\d:.]+Z/g,'T');
   if(so!==sn&&process.env.DBG){let i=0;while(so[i]===sn[i])i++;console.log('   DIFF@',i,JSON.stringify(so.slice(i-150,i+150)),'\n   NEW',JSON.stringify(sn.slice(i-150,i+150)));}const yo=syn(o),yn=syn(n);const gNew=new Function('N',PB.Lb[3163]+PB.Lb[3164]+';return giveUp;')(s=>String(s).toLowerCase());const IDS=x=>JSON.stringify(x.flatMap(i=>i.json.ids||[]).map(z=>JSON.stringify(z)).sort());const nC=x=>x.flatMap(i=>i.json.calls||[]).length;console.log(f.slice(2,7),node.padEnd(28),'old replay = stored',eq,'| non-E-SYN text equal',so===sn,'| item ids equal',IDS(o)===IDS(n),'| calls',nC(o),nC(n),'| call chars',strs(o.map(i=>i.json.body)).join('').length,'->',strs(n.map(i=>i.json.body)).join('').length,'| E-SYN items',yo.length,yn.length);tot.dch=(tot.dch||0)+strs(n.map(i=>i.json.body)).join('').length-strs(o.map(i=>i.json.body)).join('').length;
   for(let k=0;k<yo.length;k++){tot.items++;const a=yo[k].list||[],b=(yn[k]||{}).list||[];if(JSON.stringify(a)===JSON.stringify(b))continue;tot.changed++;
    console.log('  ',yo[k].id,'|',yo[k].sent.slice(0,150));for(const x of b.filter(x=>!a.includes(x))){tot.added++;console.log('     + ',x.slice(0,230));}const sd=/about the defender/.test(yo[k].hdr)?'D':'C';for(const x of a.filter(x=>!b.includes(x))){const still=!!gNew(x,'',sd);if(still)tot.capped=(tot.capped||0)+1;else tot.removed++;console.log(still?'     ~ ':'     - ',x.slice(0,230));}}}}
 console.log('TOTAL',JSON.stringify(tot));})();
// debug export: DBG=<export> prints first difference outside E-SYN items
