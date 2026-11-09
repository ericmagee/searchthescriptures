const fs=require('fs');const get=f=>{const L=fs.readFileSync(f,'utf8').split('\n');const pick=re=>{const i=L.findIndex(l=>re.test(l));return i};
 const a=pick(/^function lbFoot/),z=L.findIndex((l,i)=>i>a&&/^ return \[\.\.\.met\]\.sort\(\);\}/.test(l));
 const pre=[/^const DRV_SRC=/,/^const DRV_TL_STOP=/,/^const LB_REF=/,/^const LB_TL=/].map(r=>L[pick(r)]).join('\n');
 return new Function(pre+'\n'+L.slice(a,z+1).join('\n')+'\nreturn lbFoot;')();};
module.exports=get;
if(require.main===module){const o=get('pkgLIB/strip_KWI/patched/Cure_Check.js'),n=get('pkgLIB/strip_KBL/patched/Cure_Check.js');
const line=`D2 vs C2 (Matthew 1:18): CHALLENGER LINK BROKEN (Commitment 3) -- the claim that Joseph knew Mary in the espousal and the child is of his loins cannot agree with the finding of the child of the Holy Ghost before they came together, and the answer relocates that "of" to a believers' birth -- GROUND: [L1] Matthew 1:18 "before they came together, she was found with child of the Holy Ghost." | [L2] synerchomai (G4905, cohabit conjugally) | [L3] Matthew 1:20 "for that which is conceived in her is of the Holy Ghost."`;
const T=[line,'[L2] synerchomai (cohabit conjugally, G4905)','[L2] the word (G4905, cohabit)','x "a" y',`[L1] John 3:16 "For God so loved the world" | [L3] Romans 5:8 "God commendeth his love"`];
for(const t of T)console.log(JSON.stringify(o(t,true)),'->',JSON.stringify(n(t,true)),'|',t.slice(0,60));}
