// pkgPNL3 (W2, 11-07 CST; run 33530 fault, W4 Wall 3047). qwen/qwen3.8-flash (panel) and z-ai/glm-5.3-flash (reserve) spent all 64,000
// completion tokens on reasoning and returned no content (finish_reason length). Fix: every judge body for a qwen/ or z-ai/ model asks
// OpenRouter for reasoning effort "low" (about 20% of max_tokens per the OpenRouter reasoning docs), so the verdict has room. effort is the one
// setting accepted by models whose reasoning is mandatory (enabled:false / effort "none" is refused there). Also: xiaomi/ (mimo) gets thinking off
// in Panel Build, the one judge builder that lacked it (BB-5700 step 8a). A body that already carries "reasoning" is left alone.
// The change sits in __orc, the one helper every judge builder passes its body through; cure, send-back, gate and accept-return bodies are deep
// copies of these bodies, so they inherit the field.
// Bases: Panel Build = live s53; Reserve Build = pkgRMT/patched; Accept Build = pkgPNL2/patched; Alternate Build = pkgLIB/strip_KCR2/patched (library).
// Run from wall2024/: node pkgPNL3/build_PNL3.cjs   -> pkgPNL3/patched/*.js, pkgLIB/strip_PNL3/patched (22 files)
const fs=require('fs'),c=require('crypto');const sha=s=>c.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s53.json','utf8'));const ns=(W.data||W).nodes||(W.data||W).workflow.nodes;
const live=n=>ns.find(z=>z.name===n).parameters.jsCode;
const ORC4="const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};";
const ORC4N=ORC4+"if(!o.reasoning&&/^(?:qwen|z-ai)\\//.test(String(model)))o.reasoning={effort:'low'};if(!o.reasoning&&/^xiaomi\\//.test(String(model)))o.reasoning={enabled:false}; /* pkgPNL3: flash judges leave room for the verdict (33530) */";
const ORC3="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;return {...b,session_id:String(key).slice(0,128)};};";
const ORC3N="const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(!o.reasoning&&/^(?:qwen|z-ai)\\//.test(String(model)))o.reasoning={effort:'low'};if(!o.reasoning&&/^xiaomi\\//.test(String(model)))o.reasoning={enabled:false};return o;}; /* pkgPNL3: flash judges leave room for the verdict (33530) */";
const once=(s,a,b,nm)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(nm+': anchor found '+k+' times');return s.replace(a,()=>b);};
const out={};
const job=[['Panel Build',live('Panel Build'),ORC4,ORC4N],['Reserve Build',fs.readFileSync('pkgRMT/patched/Reserve_Build.js','utf8'),ORC4,ORC4N],
 ['Accept Build',fs.readFileSync('pkgPNL2/patched/Accept_Build.js','utf8'),ORC3,ORC3N]];
fs.mkdirSync('pkgPNL3/patched',{recursive:true});fs.mkdirSync('pkgPNL3/base',{recursive:true});
for(const [nm,src,a,b] of job){const p=once(src,a,b,nm);const f=nm.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgPNL3/base/'+f,src);fs.writeFileSync('pkgPNL3/patched/'+f,p);out[nm]={base:sha(src),patched:sha(p)};}
// library layer: copy strip_KCR2 (22 full sources), patch Alternate Build
const LB='pkgLIB/strip_KCR2/patched/',LO='pkgLIB/strip_PNL3/patched/';fs.mkdirSync(LO,{recursive:true});
for(const f of fs.readdirSync(LB).filter(f=>f.endsWith('.js'))){let s=fs.readFileSync(LB+f,'utf8');if(f==='Alternate_Build.js'){const p=once(s,ORC4,ORC4N,'Alternate Build');out['Alternate Build (library)']={base:sha(s),patched:sha(p)};s=p;}fs.writeFileSync(LO+f,s);}
console.log(JSON.stringify(out));
