// ASK 587 option 3 (offline, not written): a counted closing-contradiction break that no collision line names is record-only for the RESULT.
// Base: live engine 7536d7bf (fetch-back of the 587 write) and child a7113b8d. node build587o3.cjs
const fs=require('fs');const {apply,cut}=require('./libpatch.js');
const S=(line,a,b,what)=>({line,a,b,what});
const D1NEW="col:__c400.concat(Array.from({length:__cecX.CHALLENGER||0},()=>({link:'CLOSE-CONTRADICTION (no collision line names it)',grade:'CHALLENGER LINK BROKEN'}))),retracted:__R399});";
const NOTE=" /* ASK 587 option 3: a counted closing-contradiction break that no collision line names is record-only for the RESULT: it is printed, and does not enter rd386 */";
const E=[S(1351,D1NEW,"col:__c400,retracted:__R399});"+NOTE,'O3a v25 recompute: the unnamed break leaves the RESULT input'),
 S(1492,D1NEW+"let res=","col:__c400,retracted:__R399});"+NOTE+"let res=",'O3b gate recompute: the same'),
 S(1286,".concat(__cecU586(s,P.col));const r=rd386(",";const __u587=__cecU586(s,P.col);"+NOTE+"const r=rd386(",'O3c ert386: read, not passed to rd386'),
 S(1286,"+(ret.length?', RETRACTED '+ret.join(', '):'')","+(__u587.length?', RECORD ONLY (not in the RESULT) '+__u587.map(z=>z.link+' '+z.grade).join(', '):'')+(ret.length?', RETRACTED '+ret.join(', '):'')",'O3d ert386: the v61 INPUTS print it as record only'),
 S(1363,"; RESULT INPUTS: counted breaks no collision line names:","; RECORD ONLY, NOT IN THE RESULT: counted breaks no collision line names:",'O3e the v25 line says it is record only')];
for(const [src,out] of [['live587_eng.json','target_engine_587o3.json'],['live587_child.json','target_child_587o3.json']]){const W=JSON.parse(fs.readFileSync(src,'utf8'));const T=JSON.parse(JSON.stringify(W));const r=apply(T,E);fs.writeFileSync(out,JSON.stringify(T));console.log(out,JSON.stringify({newsha:r.newsha,map_touched:(r.map_touched||[]).length}));}
