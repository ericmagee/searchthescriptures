// pkgKSCL (W3 2671 (2)): pkgKSC goes LIVE after a TRIAL run with zero false E-KSC items. One edit per KSC copy: `const LIVE=false` -> true.
// With LIVE, an uncured E-KSC item counts once in drv_uncured (Send Back Record, Alt Send Back Record), the AUDIT v48 line says "counted in
// drv_uncured", and the send-back note says ENFORCED. The single judge stays a record-only review line (W3 2665).
// Run from wall2024/: node pkgKSCL/build_KSCL.cjs [in workflow JSON] [out workflow JSON]   (default in: the latest live fetch-back, s12)
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const IN=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s12.json',OUTW=process.argv[3]||'pkgKSCL/out/workflow_KSCL.json';
let w=JSON.parse(fs.readFileSync(IN,'utf8'));w=w.nodes?w:(w.data||w);for(const d of ['patched','base','out'])fs.mkdirSync('pkgKSCL/'+d,{recursive:true});
const A='const KSC=(()=>{const LIVE=false;',B='const KSC=(()=>{const LIVE=true;';
// edit 2 (W1 dry replay for W3 2693): the tag may follow the number after a comma or after "is/was/stays/remains" (33175 gemini "Premise 6 is
// UNEXHIBITED", a true breach the reader missed; 33218 chatgpt "Premise 4, UNEXHIBITED")
const TA='(\\d+)\\s*(?::|--|\u2014|\u2013|-|\\()?\\s*(UNEXHIBITED|CONCEDED|WITHDRAWN)\\b/gi;',TB='(\\d+)\\s*(?::|--|\u2014|\u2013|-|\\(|,)?\\s*(?:(?:is|was|stays|remains)\\s+)?(UNEXHIBITED|CONCEDED|WITHDRAWN)\\b/gi; /* pkgKSCL: ", TAG" and "is TAG" */';const plan={base:IN,nodes:[]};
for(const n of w.nodes){const s0=(n.parameters||{}).jsCode;if(typeof s0!=='string'||!s0.includes('const KSC=(()=>{'))continue;const k=s0.split(A).length-1;if(k!==1)throw new Error(n.name+': LIVE=false found '+k+' times');
 const kt=s0.split(TA).length-1;if(kt!==1)throw new Error(n.name+': TAG found '+kt+' times');const s=s0.replace(A,()=>B).replace(TA,()=>TB);new Function('$','$input','$json','$execution',s);const f=n.name.replace(/ /g,'_')+'.js';fs.writeFileSync('pkgKSCL/base/'+f,s0);fs.writeFileSync('pkgKSCL/patched/'+f,s);n.parameters.jsCode=s;plan.nodes.push({node:n.name,base_sha:sha(s0),final_sha:sha(s)});}
if(plan.nodes.length!==5)throw new Error('expected 5 KSC copies, found '+plan.nodes.length);
fs.writeFileSync(OUTW,JSON.stringify(w));fs.writeFileSync('pkgKSCL/plan_KSCL.json',JSON.stringify(plan,null,1));console.log(plan.nodes.map(p=>p.node.padEnd(28)+p.base_sha+' -> '+p.final_sha).join('\n'));
