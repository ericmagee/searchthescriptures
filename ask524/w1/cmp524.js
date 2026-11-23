// ASK 524/525: run Assume Check Build from two engine JSONs on one run's stored nodes and compare.
const fs=require('fs');const [,,oldF,newF,...parts]=process.argv;
const rd={};for(const p of parts){const d=JSON.parse(fs.readFileSync(p,'utf8'));const f=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const v of Object.values(o)){const r=f(v);if(r)return r;}}return null;};Object.assign(rd,f(d)||{});}
const out=n=>{const r=rd[n];return r?r[0].data.main[0].map(x=>x.json):null;};
const $=n=>{const a=out(n);return {isExecuted:!!a,first:()=>({json:a?a[0]:undefined})};};
const run=f=>{const e=JSON.parse(fs.readFileSync(f,'utf8'));const c=(e.nodes||e.data.nodes).find(n=>n.name==='Assume Check Build').parameters.jsCode;return new Function('$',c)($)[0].json;};
const A=run(oldF),B=run(newF);
const key=p=>[p.side,p.n,p.link,p.assumes,p.block].join('|');
const ak=new Set((A.prem||[]).map(key));
const same=(A.prem||[]).every(p=>(B.prem||[]).some(q=>key(q)===key(p)));
const added=(B.prem||[]).filter(p=>!ak.has(key(p)));
const um=t=>t&&t.body?t.body.messages[1].content:'';
console.log(JSON.stringify({old_n:(A.prem||[]).length,new_n:(B.prem||[]).length,old_kept_same:same,
 added:added.map(p=>({side:p.side,n:p.n,link:p.link,r2:!!p.r2,assumes:p.assumes})),
 prompt_old:um(A).length,prompt_new:um(B).length,
 case_def:(B.prem||[]).find(p=>p.side==='DEFENDER')?.case_quotes.length??null,case_ch:(B.prem||[]).find(p=>p.side==='CHALLENGER')?.case_quotes.length??null},null,1));
if(process.env.DUMP)fs.writeFileSync(process.env.DUMP,um(B));
