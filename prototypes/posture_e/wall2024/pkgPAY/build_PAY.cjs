// pkgPAY (Eric's approved efficiency item 2: smaller payloads between nodes). Run from wall2024/: node pkgPAY/build_PAY.cjs
// Base: pkgKCMT/patched (W3 order: pkgKV, pkgKCMT, pkgPAY). Only the 5 cure Normalize nodes change (Panel Cure Normalize 1-3, Alternate Cure Normalize, Cure Normalize).
// A Normalize node passed the whole request body of its cure call forward (about 257 KB a seat on run 33040). After the call, the only reader
// of that body is enfRows (Panel Cure Check, Alternate Merge Seat, Cure Check), and it reads one thing: enfPrompt(body), the last user message,
// which is stored as prompt_sent. The Normalize node now forwards a slim body that holds only that message, so enfPrompt returns the same string.
// Every other field of cure (items, rounds, broken, seat, model, ...) is forwarded as before. Format Markdown reads the full body from the
// Build nodes, which are unchanged. When enfPrompt cannot read the body, the body is forwarded whole, as before.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgKCMT/patched';const OUT=process.env.OUT||'pkgPAY';
const A="return {json:{cure:src||(it.json&&it.json.cure)||null,reply}};";
const B="return {json:{cure:(c=>{if(!c||!c.body)return c;const p=enfPrompt(c.body);return p==null?c:Object.assign({},c,{body:{messages:[{role:'user',content:p}]}});})(src||(it.json&&it.json.cure)||null),reply}}; /* pkgPAY: forward only the prompt of the request body (enfRows reads only that) */";
const plan={base:BASE,nodes:[]};fs.mkdirSync(OUT+'/patched',{recursive:true});
for(const f of fs.readdirSync(BASE).sort()){const b=fs.readFileSync(BASE+'/'+f,'utf8');let t=b;const ed=[];const k=t.split(A).length-1;
 if(k){if(k!==1||!t.includes('function enfPrompt'))throw new Error(f);t=t.replace(A,()=>B);ed.push('Normalize forwards the prompt only');}
 new Function('$','$input','$json',t);fs.writeFileSync(OUT+'/patched/'+f,t);plan.nodes.push({file:f,name:f.replace(/\.js$/,'').replace(/_/g,' '),base_sha:sha(b),final_sha:sha(t),edits:ed});}
fs.writeFileSync(OUT+'/plan_PAY.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes; edited '+plan.nodes.filter(n=>n.edits.length).map(n=>n.file).join(', '));
