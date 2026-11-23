const fs=require('fs');const [,,engF,...parts]=process.argv;
const eng=JSON.parse(fs.readFileSync(engF,'utf8'));const nodes=eng.nodes||eng.data.nodes;const code=nodes.find(n=>n.name==='Assume Check Build').parameters.jsCode;
const rd={};for(const p of parts){const d=JSON.parse(fs.readFileSync(p,'utf8'));const f=o=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const v of Object.values(o)){const r=f(v);if(r)return r;}}return null;};Object.assign(rd,f(d)||{});}
const out=n=>{const r=rd[n];return r?r[0].data.main[0].map(x=>x.json):null;};
const $=n=>{const a=out(n);return {isExecuted:!!a,first:()=>({json:a?a[0]:undefined})};};
const mine=new Function('$',code)($)[0].json;const live=out('Assume Check Build')[0];
const pick=o=>JSON.stringify((o.prem||[]).map(p=>[p.side,p.n,p.link,p.assumes,p.block,p.quotes]));
console.log('prem equal:',pick(mine)===pick(live),'| user prompt equal:',JSON.stringify(mine.body.messages)===JSON.stringify(live.body.messages));
