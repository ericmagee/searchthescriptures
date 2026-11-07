// pkgUNXW2 (W3 2747 item 2 follow-up): unxLack also reads "nothing for [L2]" and "[L2] absent / missing / lacking" (no "is"). Two anchors inside unxLack, 19 cure nodes.
// Base: pkgRCK/out (W1's build: live 5a710187 + UNXS + UNXW + RCK 0d3cc45; run `node pkgRCK/build_RCK.cjs` first). Run from wall2024/: node pkgUNXW2/build_UNXW2.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const E=[["(?:no|not|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\\b[^\\[]*$","(?:no|not|nothing|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\\b[^\\[]*$"],
 ["/^\\s*(?:layer\\s+)?(?:is|are)\\s+(?:missing|absent|lacking|","/^\\s*(?:layer\\s+)?(?:(?:is|are)\\s+)?(?:missing|absent|lacking|"]];
const plan={source:'W3 2747 item 2',base:'pkgRCK/out',nodes:[]};fs.mkdirSync('pkgUNXW2/patched',{recursive:true});
for(const f of fs.readdirSync('pkgRCK/out').filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync('pkgRCK/out/'+f,'utf8');if(!s0.includes('function unxLack('))continue;let s=s0;
 for(const [a,b] of E){const c=s.split(a).length-1;if(c!==1)throw new Error(f+' anchor x'+c+': '+a.slice(0,30));s=s.replace(a,()=>b);}
 new Function('$','$input','$json','$execution',s);fs.writeFileSync('pkgUNXW2/patched/'+f,s);plan.nodes.push({file:f,base_sha:sha(s0),final_sha:sha(s)});}
fs.writeFileSync('pkgUNXW2/plan_UNXW2.json',JSON.stringify(plan,null,1));console.log(plan.nodes.length+' nodes');
