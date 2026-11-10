// W2: Gate Record (or another node) of given fetch-backs on the stored node outputs of a run in inputs/ (no execution export needed). Prints drv per seat and the GUB, GCCN and GCP tags.
// usage: node gate_inputs.cjs <run> "<node>" "<input node>" <fetchback>...
const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');const D='/mnt/project-files/wall2024/inputs/';const [,,RUN,NODE,PREV,...FB]=process.argv;
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const code=(W,n)=>{const lib=W.nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const s=W.nodes.find(x=>x.name===n).parameters.jsCode;let i=s.indexOf('\nreturn await new Function(');if(i<0)return s;return new Function('$',s.slice(0,i)+'\nreturn __S;')(()=>({params:{jsCode:lib}}));};
const files=new Set(fs.readdirSync(D));const raw=n=>{const k=RUN+'_'+n.replace(/ /g,'_')+'.json';if(!files.has(k))return null;const d=JSON.parse(fs.readFileSync(D+k,'utf8'));const r=Array.isArray(d)?d[d.length-1]:d;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const dv=j=>(j.bodies||[]).map(s=>{const p=JSON.parse(s).payload;return p.judge_seat+':'+p.drv_uncured}).join(' ');
const tags=j=>(j.bodies||[]).flatMap(s=>{const p=JSON.parse(s).payload;return (String(p.verdict_raw).match(process.env.TAGRX?new RegExp(process.env.TAGRX,"g"):/\[AUDIT v52:[^\]]*\]|[^\n]*send-back count comes off[^\n]*|[^\n]*pkgGUB[^\n]*/g)||[]).map(x=>p.judge_seat+': '+x.slice(0,240))});
(async()=>{const st=raw(NODE);console.log(RUN,NODE,'\n  stored:',dv(st[0].json));const inp=raw(PREV)||[];
 for(const f of FB){const c=code(Ld(f),NODE);const mk=name=>{const it=raw(name);if(it===null){const no=()=>{throw new Error('unexecuted '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),params:{}};};
  const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  try{const o=(await new AF('$','$input','$json','$execution',c)(RM.gate(RM.needs(c),mk),$input,inp[0]&&inp[0].json,{id:RUN}))[0].json;const t=tags(o);console.log('  '+f.replace(/.*fetchback_live_/,'').replace('.json','')+':',dv(o)+(t.length?'\n     '+t.join('\n     '):''));}
  catch(e){console.log('  '+f.replace(/.*fetchback_live_/,'')+': ERR',String(e.message).slice(0,200));}}})();
