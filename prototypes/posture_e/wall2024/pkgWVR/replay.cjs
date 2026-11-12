// node replay.cjs <base.json> <new.json> <F.json>...  runs Close Enforcer Build on stored rounds; reports new candidates and prompt growth
const fs=require('fs');const node=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode;
const run=(code,F)=>{const $=nm=>({first:()=>({json:nm==='Init Seats'?{run_token:F.t}:nm==='Resolve Seats'?{deepseek:{api_model:'ds'}}:F}),isExecuted:false});return new Function('$',code)($);};
const [,,A0,B0,...Fs]=process.argv;const A=node(A0),B=node(B0);let tot=0,calls=0,runs=0,same=0;const seen=new Set();
for(const f of Fs)for(const F of JSON.parse(fs.readFileSync(f))){if(seen.has(F.t))continue;seen.add(F.t);runs++;const a=run(A,F),b=run(B,F);
 for(let i=0;i<b.length;i++){calls++;const ua=a[i].json.body?a[i].json.body.messages[1].content:'',ub=b[i].json.body?b[i].json.body.messages[1].content:'';const ca=(a[i].json.cands||[]).length,cb=(b[i].json.cands||[]).length;
  tot+=ub.length-ua.length;if(ua===ub){same++;continue;}console.log(F.t.slice(5,10),b[i].json.side,'cands',ca,'->',cb,'+chars',ub.length-ua.length);
  for(const c of (b[i].json.cands||[]).filter(c=>/pkgWVR/.test(c.by)))console.log('   ',c.id,'LINK',c.n,c.earlier_round,JSON.stringify(c.earlier_q.slice(0,70)),'->',JSON.stringify(c.closing_q.slice(0,90)));}}
console.log({runs,calls,unchanged_calls:same,added_chars:tot});
