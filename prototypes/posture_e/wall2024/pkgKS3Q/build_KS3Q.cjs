// pkgKS3Q (W1, 11-08; ruling Wall 3239 on 33731 grok G2): the gate's K re-read (gateNewK2024) keyed K-S3 items by position (#n),
// so a gate change that adds or moves a concession row made an already-answered quote look NEW. K-S3 is now keyed by side and the
// quoted sentence. A K-S3 item stays new only when neither its position key nor its sentence (quotes, escapes and spacing removed) was
// in the pre-change text, so the change can only drop items the old keying raised. Every other rule is unchanged.
// Usage (from wall2024/): node pkgKS3Q/build_KS3Q.cjs [base strip, default pkgLIB/strip_A2R] [out strip, default pkgLIB/strip_A2R_KS3Q]
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const BASE=process.argv[2]||'pkgLIB/strip_A2R';const OUT=process.argv[3]||'pkgLIB/strip_A2R_KS3Q';
const A="const k0=new Set(a.map(key));const seen=new Set();const items=[];for(const x of b){const k=key(x);if(k0.has(k)||seen.has(k))continue;seen.add(k);";
const B="const __q3=x=>x.rule==='K-S3'?'K-S3|'+(x.side||'')+'|'+String(x.line==null?'':x.line).replace(/^\\s*(?:DEFENDER|CHALLENGER)\\b[^:]*:\\s*/i,'').replace(/[\\\\\"'\\u2018\\u2019\\u201c\\u201d`*_]+/g,'').replace(/\\s+/g,' ').trim().toUpperCase():null; /* pkgKS3Q: a K-S3 row whose sentence the pre-change text already held is not new, whatever its position */\n const k0=new Set(a.map(key));const q0=new Set(a.map(__q3).filter(Boolean));const seen=new Set();const items=[];for(const x of b){const k=key(x);if(k0.has(k)||seen.has(k))continue;const q=__q3(x);if(q&&q0.has(q))continue;seen.add(k);";
fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,out:OUT,patched:[],copied:[]};
for(const f of fs.readdirSync(BASE+'/patched').filter(f=>f.endsWith('.js'))){const s=fs.readFileSync(BASE+'/patched/'+f,'utf8');const k=s.split(A).length-1;
 if(k>1)throw new Error(f+': anchor x'+k);const t=k?s.replace(A,()=>B):s;fs.writeFileSync(OUT+'/patched/'+f,t);
 (k?plan.patched:plan.copied).push({file:f,base_sha:sha(s),sha:sha(t)});}
fs.writeFileSync('pkgKS3Q/plan_KS3Q'+(OUT.endsWith('strip_A2R_KS3Q')?'':'_'+OUT.split('/').pop())+'.json',JSON.stringify(plan,null,1));
console.log('patched',plan.patched.length,'copied',plan.copied.length);
