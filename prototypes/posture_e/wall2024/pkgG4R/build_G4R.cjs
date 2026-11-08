// pkgG4R build (W2, 11-08). Library layer on pkgLIB/strip_R1B (live s56..s58 = LIB v15_R1B). Run from wall2024/: node pkgG4R/build_G4R.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const SRC='pkgLIB/strip_R1B/patched/',DST='pkgLIB/strip_G4R/patched/';fs.mkdirSync(DST,{recursive:true});
const FN=fs.readFileSync('pkgG4R/g4r.js','utf8').trim();
const A1='function kg4Witnesses(line,q,pressText){const L=new Set(cureRefs(line).map(r=>r.key));const Q=[...new Set(cureRefs(q).map(r=>r.key))].filter(k=>L.has(k));if(Q.length)return Q;';
const B1=A1+'{const H=kg4RowHead2024(q,pressText).filter(k=>L.has(k));if(H.length)return H;} /* pkgG4R: the PRESSED WITH row\'s own verse */';
const A2="for(const x of NK.items)items.push({kind:'RULE '+x.rule,src:'K re-read',key:x.key,why:x.why,lines:x.lines,";
const B2="for(const x of NK.items)items.push({kind:'RULE '+x.rule,src:'K re-read',key:x.key,why:x.why+(x.rule==='K-G4'?g4GateNote2024(x,ctx):''),lines:x.lines,";
const plan={base:'pkgLIB/strip_R1B (LIB v15_R1B, live s56-s58)',nodes:{}};
const once=(s,a)=>s.split(a).length===2;
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')).sort()){const s0=fs.readFileSync(SRC+f,'utf8');let s=s0;
 if(s0.includes(A1)){if(!once(s0,A1))throw new Error(f+' A1');s=s.replace(A1,()=>FN+'\n'+B1);}
 if(s0.includes(A2)){if(!once(s0,A2)||!s0.includes(A1))throw new Error(f+' A2');s=s.replace(A2,()=>B2);}
 if(s!==s0){new Function('$','$input',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
 fs.writeFileSync(DST+f,s);}
fs.writeFileSync('pkgG4R/plan_G4R.json',JSON.stringify(plan,null,1));console.log(Object.keys(plan.nodes).length,'nodes',plan.nodes);
