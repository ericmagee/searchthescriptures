// ASK 524/525 C2 duplicate guard: synthetic cases on 41418's stored rounds; no model call.
// A: the defender's round 3 list gains item 7 quoting the same challenger words as round 2's first STEP, WITH an ASSUMES line -> no duplicate is added.
// B: the same item 7 WITHOUT an ASSUMES line -> the round 2 item takes number 7 (not 91) and is not record-only.
const fs=require('fs');const [,,engF,...parts]=process.argv;
const rd={};for(const p of parts){const d=JSON.parse(fs.readFileSync(p,'utf8'));const f=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const v of Object.values(o)){const r=f(v);if(r)return r;}}return null;};Object.assign(rd,f(d)||{});}
const out=n=>{const r=rd[n];return r?r[0].data.main[0].map(x=>x.json):null;};
const e=JSON.parse(fs.readFileSync(engF,'utf8'));let code=e.nodes.find(n=>n.name==='Assume Check Build').parameters.jsCode;if(process.env.MUT){const g='if(hit&&have.has(hit.n))continue;';if(code.split(g).length!==2)throw new Error('guard not found');code=code.replace(g,'');} /* MUT=1 removes the guard, to show the check can fail */
const Q="\"'seed of David according to the flesh' is satisfied by flesh from Mary, who is of David's line\"";
const run=extra=>{const F={...out('Final Output')[0]};F.cr3=F.cr3.replace(/\s*$/,'\n'+extra+'\n');
 const $=n=>{const a=n==='Final Output'?[F]:out(n);return {isExecuted:!!a,first:()=>({json:a?a[0]:undefined})};};
 return new Function('$',code)($)[0].json.prem.filter(p=>p.side==='CHALLENGER').map(p=>({n:p.n,link:p.link,r2:!!p.r2,assumes:p.assumes}));};
const A=run('7. '+Q+'\nSTEP: Mary carries the seed -- ASSUMES: Mary is of David\'s line -- ROWS GIVE: Luke 1:27 "a man whose name was Joseph, of the house of David"\nPRESSED WITH: none');
const B=run('7. '+Q+'\nPRESSED WITH: none');
const N=run('');
console.log(JSON.stringify({none:N,A_with_assumes:A,B_without_assumes:B}));
const ok=N.filter(p=>p.n===91).length===1&&A.filter(p=>/Mary is of David/.test(p.assumes)).length===1&&A.some(p=>p.n===7&&!p.r2)&&!A.some(p=>p.n===91&&/Mary is of David/.test(p.assumes))&&B.some(p=>p.n===7&&!p.r2&&/Mary is of David/.test(p.assumes))&&!B.some(p=>p.n===91&&/Mary is of David/.test(p.assumes));
console.log('C2 duplicate guard:',ok?'PASS':'FAIL');
