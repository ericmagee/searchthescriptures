// pkgRMT (W1, 11-08; W3 3017 item 4, gap noted in pkgPNL): Reserve Build sends mimo (xiaomi/ via openrouter) with thinking off, as Alternate Build and Accept Build do.
// Base: live s53 Reserve Build. Run from wall2024/: node pkgRMT/build_RMT.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s53.json','utf8'));const ns=(W.data||W).nodes||(W.data||W).workflow.nodes;
const s0=ns.find(n=>n.name==='Reserve Build').parameters.jsCode;fs.writeFileSync('pkgRMT/base_s53/Reserve_Build.js',s0);
const A="else if(j.fam==='openrouter'&&/^xiaomi\\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),messages:m};";
const B="else if(j.fam==='openrouter'&&/^xiaomi\\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),messages:m,reasoning:{enabled:false}}; /* pkgRMT: thinking off, as Alternate Build and Accept Build */";
if(s0.split(A).length!==2)throw new Error('anchor count '+(s0.split(A).length-1));const s=s0.replace(A,()=>B);new Function('$','$input',s);
fs.writeFileSync('pkgRMT/patched/Reserve_Build.js',s);const plan={'Reserve Build':{base:h(s0),patched:h(s)}};fs.writeFileSync('pkgRMT/plan_RMT.json',JSON.stringify(plan,null,1));console.log(JSON.stringify(plan));
