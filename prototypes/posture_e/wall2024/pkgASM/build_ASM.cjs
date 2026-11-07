// pkgASM build: on pkgUNXA/patched (22 nodes). Run from wall2024/ after pkgUNXA's build: node pkgASM/build_ASM.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const {patchASM}=require('./patch_asm.cjs');
const P=JSON.parse(fs.readFileSync('pkgUNXA/plan_UNXA.json','utf8'));for(const d of ['patched','base'])fs.mkdirSync('pkgASM/'+d,{recursive:true});const plan={base:'pkgUNXA/patched',nodes:[]};
for(const n of P.nodes){const s0=fs.readFileSync('pkgUNXA/patched/'+n.file,'utf8');if(sha(s0)!==n.final_sha)throw new Error(n.name+': not the pkgUNXA final');const r=patchASM(s0,n.edits.includes('cure'));
 new Function('$','$input','$json','$execution',r.code);fs.writeFileSync('pkgASM/base/'+n.file,s0);fs.writeFileSync('pkgASM/patched/'+n.file,r.code);plan.nodes.push({name:n.name,file:n.file,base_sha:sha(s0),final_sha:sha(r.code),cure:r.cure});
 console.log(n.name.padEnd(28),sha(s0),'->',sha(r.code),r.cure?'lib,kunxLines,cure':'lib,kunxLines');}
fs.writeFileSync('pkgASM/plan_ASM.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
