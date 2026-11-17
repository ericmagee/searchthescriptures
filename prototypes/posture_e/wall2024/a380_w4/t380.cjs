// ASK 380 harness: full Format Markdown render, live vs target, over stored rows (pop.json) and plants.
const fs=require('fs');
const code=w=>JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;
const mk=c=>new Function('$','$input','require','$execution','$workflow',c);
const run=(f,d)=>{const M={'Get Row':[d.r],'Get Judgments':(d.J||[]),'Get Verse':[{text:''}]};const $=nm=>{if(nm in M)return {isExecuted:true,first:()=>({json:M[nm][0]}),all:()=>M[nm].map(json=>({json}))};return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};};
 const o=f($,{all:()=>[{json:d.r}],first:()=>({json:d.r})},require,{id:'0',customData:{set(){},get(){}}},{id:'x'});return o[0].json.md;};
const OLD=mk(code(process.argv[2])),NEW=mk(code(process.argv[3]));const pop=JSON.parse(fs.readFileSync(process.argv[4]));
let err=[],res=[];
for(const d0 of pop){const d=JSON.parse(JSON.stringify(d0));d.J=(d.J||[]).map(j=>({...j,verdict_raw:j.verdict_raw||''}));d.r.drv_removed=d.r.drv_removed||null;
 let a,b;try{a=run(OLD,d);}catch(e){err.push(['old',d.r.run_token,e.message]);continue;}try{b=run(NEW,d);}catch(e){err.push(['new',d.r.run_token,e.message]);continue;}res.push({tok:d.r.run_token,a,b,d});}
fs.writeFileSync(process.argv[5]||'res380.json',JSON.stringify(res));
console.log('rendered',res.length,'errors',err.length,JSON.stringify(err.slice(0,5)));
