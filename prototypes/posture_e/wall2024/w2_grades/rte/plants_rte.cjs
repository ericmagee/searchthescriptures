// W2 grade of pkgRTE rev 1: plants against live s116 and RTE library (part RT reader, part EJ line match)
const fs=require('fs');
const lib=p=>{const w=JSON.parse(fs.readFileSync(p));const W=(w.data||w).workflow||(w.data||w);const c=W.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');return JSON.parse(c.slice(a,b));};
const D='/mnt/project-files/wall2024/';const LB=lib(D+'fetchback_live_s116.json'),LR=lib(D+'parent_s116_RTE.json');
// load all top-level functions so ri5Rt2024/ri5Rd2024 resolve
const env=L=>new Function(L.slice(240,329).join("\n")+"\n"+L[337]+"\n"+L[338]+"\n"+L[341]+"\nreturn {ri5Rt2024};")();
const nrm=s=>String(s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
const reOf=l=>{const m=l.match(/ri5Rt2024\(nrm\(to\),(\/.*?\/i)\)/);return eval(m[1]);};
const EB=env(LB),ER=env(LR);const reB=reOf(LB[1627]),reR=reOf(LR[1627]);
const reB2=reOf(LB[1629]),reR2=reOf(LR[1629]);console.log('RT regex equal on both lines:',String(reR)===String(reR2),String(reB)===String(reB2));
const P=[
'RETRACTED: D1 vs C3','RETRACTED: D1 vs C3.',
'RETRACTED: D1 vs C3 -- the forced-link ruling is withdrawn','RETRACTED: D1 vs C3 — withdrawn','RETRACTED: D1 vs C3 – withdrawn',
'RETRACTED: D1 vs C3 -- NOT RETRACTED','RETRACTED: D1 vs C3 -- the ruling stands','RETRACTED: D1 vs C3 -- I keep it','RETRACTED: D1 vs C3 -- it remains',
'RETRACTED: D1 vs C3 -- I do not retract this ruling','RETRACTED: D1 vs C3 -- the break is upheld','RETRACTED: D1 vs C3 -- maintained','RETRACTED: D1 vs C3 -- not withdrawing it','RETRACTED: D1 vs C3 -- still standing',
'RETRACTED: D1 vs C3 - withdrawn','RETRACTED: D1 vs C3; withdrawn','RETRACTED: D1 vs C3 (withdrawn)','RETRACTED: D1 vs C3 -- withdrawn; D2 vs C4 also',
'**RETRACTED:** D1 vs C3 -- withdrawn','RETRACTED: D1 vs. C3 -- withdrawn','RETRACTED D1 vs C3 -- withdrawn','RETRACTED: D1 vs C3 --'];
const r=(E,re,s)=>{const m=E.ri5Rt2024(nrm(s),re);return m?m[1]+' VS '+m[2]:'-';};
for(const s of P)console.log((r(EB,reB,s)+'   ').slice(0,10),(r(ER,reR,s)+'   ').slice(0,10),JSON.stringify(s));
// part EJ
const ecC=(L,cc)=>new Function('__cc',L[3090]+'\nreturn __ecC;')(cc);
const cc=new Set(['DEFENDER 1','CHALLENGER 4']);const B=ecC(LB,cc),R=ecC(LR,cc);
const Q=['D1 vs C3 (Matthew 1:18; Luke 1:35): DEFENDER LINK BROKEN','D1 vs C3: DEFENDER LINK BROKEN','D1 vs C3 (Matthew 1:18 (KJV)): DEFENDER LINK BROKEN',
'D1 vs C3 (Matthew 1:18): defender link broken','- D1 vs C3 (Matthew 1:18): DEFENDER LINK BROKEN','**D1 vs C3** (Matthew 1:18): DEFENDER LINK BROKEN',
'D2 vs C3 (x): DEFENDER LINK BROKEN','D1 vs C3 (x): CHALLENGER LINK BROKEN','D2 vs C4 (x): CHALLENGER LINK BROKEN','D1 vs C3 (x): UNDERDETERMINED',
'D1 vs C3 (x): DEFENDER LINK BROKEN [AUDIT: LINK 1 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER]','D2 vs C3 (x): DEFENDER LINK BROKEN [AUDIT: LINK 1 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER]',
'D1 vs C3 (x): DEFENDER LINK BROKEN -- withdrawn on reread','D1 vs C3 (x): DEFENDER LINK BROKENNESS'];
console.log('\nEJ live | RTE | line');for(const q of Q)console.log((B(q)||'-').padEnd(10),(R(q)||'-').padEnd(10),JSON.stringify(q));
