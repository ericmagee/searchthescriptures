// W2 grade of pkgEAD: Send Back Build and Alt Send Back Build of live s112 and of pkgEAD on every stored run in inputs/ (and plants with PLANT=1). Sources rebuilt from the two fetch-backs.
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const code=(W,n)=>{const lib=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const s=W.nodes.find(x=>x.name===n).parameters.jsCode;let i=s.indexOf('\nreturn await new Function(');if(i<0)return s;return new Function('$',s.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));};
const A=Ld('/mnt/project-files/wall2024/fetchback_live_s112.json'),B=Ld(process.env.CAND||'/mnt/project-files/wall2024/parent_s112_EAD.json');
const files=new Set(fs.readdirSync(D));const runs=[...new Set([...files].map(f=>f.split('_')[0]).filter(r=>/^\d+$/.test(r)))].sort();
const raw=(run,n)=>{const k=run+'_'+n.replace(/ /g,'_')+'.json';if(!files.has(k))return null;const d=JSON.parse(fs.readFileSync(D+k,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
async function go(c,run,prev,over){const g=n=>over&&n in over?over[n]:raw(run,n);const inp=g(prev)||[];const mk=name=>{const it=g(name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 try{return (await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:run})).map(x=>x.json);}catch(e){return {ERR:String(e.message||e).slice(0,120)};}}
const strip=o=>JSON.stringify(o.map(j=>{const k={...j};delete k.sb_not_sent;return k;}));
module.exports={go,raw,code,A,B,runs,cl};
if(require.main===module)(async()=>{let tot={runs:0,eq:0,wh:[],other:[],err:0};
 for(const [N,prev] of [['Send Back Build','Judge Enforcer Record'],['Alt Send Back Build','Alt Judge Enforcer Record']]){const ca=code(A,N),cb=code(B,N);
  for(const r of runs){if(!raw(r,prev))continue;const a=await go(ca,r,prev),b=await go(cb,r,prev);if(a.ERR||b.ERR){tot.err++;continue;}tot.runs++;
   if(JSON.stringify(a)===JSON.stringify(b)){tot.eq++;continue;}
   const wh=b.flatMap(j=>(j.sb_not_sent||[]).filter(y=>/pkgEAD/.test(y.why)).map(y=>({seat:y.seat,item:y.item,why:y.why})));
   // remove withheld items from live output and renumber: the rest must be equal in order and text apart from S numbers
   const items=o=>o.filter(j=>!j.sb_skip).map(j=>j.seat+': '+(j.items||[]).map(i=>i.rule+'|'+i.item+'|'+i.line).join(' ## '));
   const ai=a.filter(j=>!j.sb_skip).map(j=>({seat:j.seat,items:(j.items||[]).filter(i=>!wh.some(w=>w.seat===j.seat&&w.item===i.item&&i.rule!=='E-PREM'))})).filter(j=>j.items.length).map(j=>j.seat+': '+j.items.map(i=>i.rule+'|'+i.item+'|'+i.line).join(' ## '));
   const same=JSON.stringify(ai)===JSON.stringify(items(b));wh.forEach(w=>tot.wh.push(r+' '+N+' '+w.seat+' '+w.item));if(!same)tot.other.push(r+' '+N);
   console.log(r,N,'| withheld',wh.map(w=>w.seat+' '+w.item).join('; '),'| rest equal (items, order, text):',same,'| seats live',a.filter(j=>!j.sb_skip).map(j=>j.seat).join(','),'EAD',b.filter(j=>!j.sb_skip).map(j=>j.seat).join(','));}}
 console.log('node runs',tot.runs,'byte-equal',tot.eq,'withheld items',tot.wh.length,'runs with other change',tot.other.length,tot.other.join(', '),'not replayable',tot.err);})();
