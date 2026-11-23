// ASK 524/525 replay: runs Assume Check Build (code from an engine JSON) on stored Final Output data, with $() stubbed.
// usage: node replay524.js <engine.json> <part5.json with Final Output> [part with Init Seats/Resolve Seats...]
const fs=require('fs');
const [,,engF,...parts]=process.argv;
const eng=JSON.parse(fs.readFileSync(engF,'utf8'));const nodes=eng.nodes||eng.data.nodes;
const code=nodes.find(n=>n.name==='Assume Check Build').parameters.jsCode;
const rd={};for(const p of parts){const d=JSON.parse(fs.readFileSync(p,'utf8'));const f=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const v of Object.values(o)){const r=f(v);if(r)return r;}}return null;};Object.assign(rd,f(d)||{});}
const out=n=>{const r=rd[n];if(!r)return null;return r[0].data.main[0].map(x=>x.json);};
const $=n=>{const a=out(n);return {isExecuted:!!a,first:()=>({json:a?a[0]:undefined})};};
const fn=new Function('$',code);
const res=fn($)[0].json;
const P=res.prem||[];
console.log(JSON.stringify({skip:res.acx_skip||false,why:res.why||null,n:P.length,prem:P.map(p=>({side:p.side,n:p.n,link:p.link,assumes:p.assumes,answer_round:p.answer_round,block_len:(p.block||'').length,quotes:p.quotes.length}))},null,1));
