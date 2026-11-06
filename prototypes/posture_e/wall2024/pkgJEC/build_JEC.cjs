// pkgJEC (W2 Wall 2514; run 33060): enforcer call reliability. Run from wall2024/: node pkgJEC/build_JEC.cjs
// (a) Judge Enforcer Record and Alt Judge Enforcer Record: reply_error was errors[ci], but errors lists only the failed calls, so every label
//     shifted (33060: call 1 succeeded yet its rows read "call 2: no reply"; call 3's rows had none). Now each call's error is kept by its index.
//     An empty content string is an error too ("call N: empty content"; 32791, 32905, 32985, 33006, 33021 lost a call that way, unlabelled),
//     and a failure with no message names the reply's keys instead of "unknown". The enf428.errors summary is unchanged in form.
// (b) Judge Enforcer Build and Alt Judge Enforcer Build: CALL_CHARS 60000 -> 40000 (MAX_CALLS 8). Every empty or failed call so far was 60K+ chars.
// Bases: Record from pkgCM/base (Judge) and pkgALT/patched (Alt), the last repo copies (the live-test thread checks their shas against live);
//        Build from pkgEF/patched (graded PASS, next-gap write).
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const OUT='pkgJEC';
const RA="const R=$input.all().map(x=>x.json);const V={};const errors=[];\nR.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){errors.push('call '+(i+1)+': no reply ('+String(r.error&&r.error.message||r.message||'unknown').slice(0,120)+')');return;}";
const RB="const R=$input.all().map(x=>x.json);const V={};const errors=[];const errAt={}; /* pkgJEC (a): each call's own error, by its index (33060: the labels shifted) */\nR.forEach((r,i)=>{let txt='';try{txt=String(r.choices[0].message.content||'');}catch(e){const w='call '+(i+1)+': no reply ('+String(r&&r.error&&(r.error.message||JSON.stringify(r.error))||r&&r.message||('no message; reply keys: '+(Object.keys(r||{}).slice(0,8).join(',')||'none'))).slice(0,160)+')';errAt[i]=w;errors.push(w);return;}\n if(!txt.trim()){const w='call '+(i+1)+': empty content'+(r.choices[0].finish_reason?' (finish_reason '+r.choices[0].finish_reason+')':'');errAt[i]=w;errors.push(w);return;}";
const E_REC=[[RA,RB],["reply_error:errors[ci]||null","reply_error:errAt[ci]||null"]];
const E_BLD=[["const CALL_CHARS=60000,MAX_CALLS=8;","const CALL_CHARS=40000,MAX_CALLS=8; /* pkgJEC (b): was 60000; every empty or failed enforcer call so far was a 60K+ prompt */"]];
const jobs=[['pkgCM/base','Judge_Enforcer_Record.js',E_REC],['pkgALT/patched','Alt_Judge_Enforcer_Record.js',E_REC],['pkgEF/patched','Judge_Enforcer_Build.js',E_BLD],['pkgEF/patched','Alt_Judge_Enforcer_Build.js',E_BLD]];
fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={nodes:[]};
for(const [base,file,E] of jobs){const s0=fs.readFileSync(base+'/'+file,'utf8');let s=s0;for(const [a,b] of E){const n=s.split(a).length-1;if(n!==1)throw new Error(file+': anchor found '+n+' times: '+a.slice(0,60));s=s.replace(a,()=>b);}
 fs.writeFileSync(OUT+'/patched/'+file,s);plan.nodes.push({base,file,base_sha:sha(s0),final_sha:sha(s),edits:E.length});console.log(file.padEnd(30),base.padEnd(16),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/plan_JEC.json',JSON.stringify(plan,null,1));
