// pkgJRE (W3 ruling after Wall 2522): STAGED FALLBACK ONLY. Written only if a run after the gap still times out an enforcer call at 40K (pkgJEC).
// Judge Enforcer Build and Alt Judge Enforcer Build: the DeepSeek body gains reasoning_effort:'low' (thinking stays at its default, on).
// Before any write: (1) the provider probe (pkgJRE/probe_JRE.cjs) shows deepseek-flash accepts the field and reasons less;
// (2) pkgJRE/replay_JRE.cjs on 33040 shows every E-* verdict change against the logged 33040 verdicts. Both need the DeepSeek key (DEEPSEEK_KEY).
// Run from wall2024/: node pkgJRE/build_JRE.cjs. Base pkgJEC/patched.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const BASE=process.env.BASE||'pkgJEC/patched';const OUT='pkgJRE';
const A="max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,";
const B="max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,reasoning_effort:'low',/* pkgJRE: staged fallback for the 300 s body timeout */";
fs.mkdirSync(OUT+'/patched',{recursive:true});const plan={base:BASE,nodes:[]};
for(const f of ['Judge_Enforcer_Build.js','Alt_Judge_Enforcer_Build.js']){const s0=fs.readFileSync(BASE+'/'+f,'utf8');const n=s0.split(A).length-1;if(n!==1)throw new Error(f+': anchor '+n);const s=s0.replace(A,()=>B);
 fs.writeFileSync(OUT+'/patched/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});console.log(f.padEnd(30),sha(s0),'->',sha(s));}
fs.writeFileSync(OUT+'/plan_JRE.json',JSON.stringify(plan,null,1));
