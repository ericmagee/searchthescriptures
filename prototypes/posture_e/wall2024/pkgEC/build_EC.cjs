// pkgEC (W3 2333; built by W2). Run from wall2024/: node pkgEC/build_EC.cjs
// E-COL grouped collision lines across judges by their first 160 normalized characters (key=N(l).slice(0,160)) and kept the first judge's line
// for the group. In run 33020 chatgpt's and grok's FORCED D1 vs C2 lines agreed for 255 characters and differed in FAILS, so grok was sent back
// on chatgpt's line (S11, not applied) and the enforcer ruled on chatgpt's FAILS for grok. Fix: the group key is the seat and the whole line, so
// each judge's E-COL item carries that judge's own line. Base: pkgFC/patched (6bffc3f), which carries both enforcer builds.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const A=" const key=N(l).slice(0,160);let g=CG.find(x=>x.key===key);";
const B=" const key=j.seat+'|'+N(l);let g=CG.find(x=>x.key===key); /* pkgEC (W3 2333): seat and whole line, so no judge is sent another judge's line (run 33020 grok S11) */";
const plan={base:'pkgFC/patched (6bffc3f)',nodes:[]};
for(const n of ['Judge_Enforcer_Build','Alt_Judge_Enforcer_Build']){const b=rd('pkgFC/patched/'+n+'.js');const c=b.split(A).length-1;if(c!==1)throw new Error(n+': anchor count '+c);
 const s=b.split(A).join(B);fs.writeFileSync('pkgEC/patched/'+n+'.js',s);plan.nodes.push({file:n+'.js',name:n.replace(/_/g,' '),base_sha:sha(b),final_sha:sha(s)});}
fs.writeFileSync('pkgEC/plan_EC.json',JSON.stringify(plan,null,1));plan.nodes.forEach(x=>console.log(x.name+' '+x.base_sha+' -> '+x.final_sha));
