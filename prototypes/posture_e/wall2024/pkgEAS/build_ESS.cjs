// pkgESS (W1, 11-07): pkgESR also retries a SHORT reply. 33430 call 5: 26 items sent (24 E-PREM, E-RES, E-SYN); DeepSeek stopped normally
// (finish_reason "stop") after 1 line, so 25 checks were NO VERDICT and the retry never fired (it fired only on no reply, error, empty or length).
// Now a reply with 2 or more fewer ENFORCER lines than the call's item ids is split into two halves and sent once more, the same as a failed call.
// Only the two Retry Build nodes change; the Record already merges any retried call by esr_of. Base: live s47. Run from wall2024/: node pkgESS/build_ESS.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const R=[["const why=r=>{","const why=(r,b)=>{"],
 ["if(!String((c.message&&c.message.content)||'').trim())return 'empty content';return null;};","if(!String((c.message&&c.message.content)||'').trim())return 'empty content';\n {const txt=String((c.message&&c.message.content)||'');const n=(txt.match(/^[ \\t>*_`-]*ENFORCER\\s*:/gim)||[]).length;const want=(b&&Array.isArray(b.ids))?b.ids.length:0;if(want>=2&&want-n>=2)return 'short reply: '+n+' ENFORCER line(s) for '+want+' item ids (finish_reason '+(c.finish_reason||'none')+')';} /* pkgESS: 33430 call 5, 1 line for 26 items */\n return null;};"],
 ["const w=why(R[i]);","const w=why(R[i],b);"],
 ["// pkgESR (rulings item 9): each enforcer call that came back with no reply, an empty reply, an error or finish_reason \"length\" is split","// pkgESR (rulings item 9) + pkgESS (short reply): each enforcer call that came back with no reply, an empty reply, an error, finish_reason \"length\", or 2+ fewer ENFORCER lines than item ids, is split"]];
const plan={};for(const f of fs.readdirSync('pkgESS/base_s47')){let s=fs.readFileSync('pkgESS/base_s47/'+f,'utf8');const s0=s;
 for(const [a,b] of R){const c=s.split(a).length-1;if(c!==1)throw new Error(f+': '+c+' x '+a.slice(0,60));s=s.replace(a,()=>b);}
 fs.writeFileSync('pkgESS/patched/'+f,s);plan[f]={base:h(s0),patched:h(s)};console.log(f.padEnd(34),h(s0),'->',h(s));}
fs.writeFileSync('pkgESS/patched.plan.json',JSON.stringify(plan,null,1));
