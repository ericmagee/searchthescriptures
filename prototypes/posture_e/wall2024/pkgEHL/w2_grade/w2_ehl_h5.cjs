// W2 H5: what Judge Enforcer Retry Build (unchanged) does with one and with two headless lines in a 34108 call, live s108 code.
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');const {rebuild}=require('../../pkgLIB/unpack.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};const L=Ld('/mnt/project-files/wall2024/fetchback_live_s108.json');
const code=n=>L.nodes.find(x=>x.name===n).parameters.jsCode;const LIB=code('Shared Library');const src=n=>{const c=code(n);return /^\/\/ pkgLIB stub/.test(c)?rebuild(c,LIB):c;};
const sv=n=>{const f=D+'34108_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const go=async over=>{const c=src('Judge Enforcer Retry Build');const s=n=>over[n]!==undefined?over[n]:sv(n);const inp=s('Judge Enforcer Call deepseek');
 const mk=name=>{if(name==='Shared Library')return {isExecuted:true,params:{jsCode:LIB}};const it=s(name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
 const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
 const o=await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0].json,{id:'34108'});return o.map(x=>x.json).filter(x=>x&&(x.jer_retry||x.esr_retry||x.retry||x.body)).map(x=>(x.why||x.jer_why||x.esr_why||'')+' ids '+((x.ids||[]).map(i=>i.id).join(','))).join(' | ')||'no retry ('+JSON.stringify(o.map(x=>Object.keys(x.json))).slice(0,120)+')';};
(async()=>{const C0=sv('Judge Enforcer Call deepseek');const t=C0[0].json.choices[0].message.content;const ls=t.split('\n').filter(l=>/^ENFORCER: B\d+\.\d+ --/.test(l));
 for(const k of [0,1,2]){const C=cl(C0);let x=t;for(let i=0;i<k;i++)x=x.replace(ls[i],ls[i].replace(/^ENFORCER:\s*/,''));C[0].json.choices[0].message.content=x;console.log(k+' headless line(s) in call 1: '+await go({'Judge Enforcer Call deepseek':C}));}})();
