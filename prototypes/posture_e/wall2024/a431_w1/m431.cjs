// ASK 431 measure (W1): replay the L2 chain (a430_w1/chain430.cjs, cached REST reads) on the stored runs, live L2 Count Plan against the ASK 431 patch.
// Usage (from the folder holding debates.json and cache.json): node <repo>/a431_w1/m431.cjs <live fetch-back.json> > ../a431_w1/m431_out.txt
// FAIL: tags or any e340 field differs. Every run whose judges' gloss output (json.gloss, from __GLOSS) changes is listed with old and new in full, for the hand read (plan C2, C4).
const fs=require('fs');const {replay,save,net}=require('../a430_w1/chain430.cjs');const P=require('./p431.cjs');
let live=JSON.parse(fs.readFileSync(process.argv[2]));live=live.workflow||live.data||live;const L=live.nodes.find(n=>n.name==='L2 Count Plan').parameters.jsCode;const T=P(L);
const D=JSON.parse(fs.readFileSync('debates.json')).filter(r=>!process.env.ONLY||new RegExp(process.env.ONLY).test(r.run_token));
const tot={runs:0,errors:0,runs_changed:0,fail:0};const fails=[],out=[];
for(const r of D){let A,B;try{A=replay(live,r);B=replay(live,r,{'L2 Count Plan':T});}catch(e){tot.errors++;fails.push(r.run_token+' ERROR '+e.message);continue;}tot.runs++;
 const a=A['L2 Count Plan'][0].json,b=B['L2 Count Plan'][0].json;const f=m=>{tot.fail++;fails.push(r.run_token+' FAIL '+m);};
 for(const k of new Set([...Object.keys(a),...Object.keys(b)]))if(k!=='gloss'&&JSON.stringify(a[k])!==JSON.stringify(b[k]))f(k+' differs');
 if(JSON.stringify(a.gloss)!==JSON.stringify(b.gloss)){tot.runs_changed++;out.push('=== '+r.run_token+'\nOLD '+JSON.stringify(a.gloss)+'\nNEW '+JSON.stringify(b.gloss));}}
save();console.log(JSON.stringify(tot),'net',net());fails.forEach(l=>console.log(l));console.log('--- RUNS WHOSE JUDGE GLOSS OUTPUT CHANGES ('+out.length+')');out.forEach(l=>console.log(l));
