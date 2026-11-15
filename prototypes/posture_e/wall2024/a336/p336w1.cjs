// W1 plants P7-P13 (a336_w1/w1_plan336.md) through Citation Scan tags() PRE (s222) and POST (target_336), counted by L2 Count Plan check().
const fs=require('fs');const LD=require('./loadcs.cjs');const PRE=LD('../rdf/fetchback_s222_333_335.json'),POST=LD('target_336.json');const CK=require('../a329/l2c_load.cjs')('target_336.json');
const OD=JSON.parse(fs.readFileSync('data336.json'));const r=JSON.parse(fs.readFileSync('r37510.json'))[0];
const Q18='"Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const Q20='"But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream"';
const L2x='[L2] standing in these rows: sunerchomai (G4905), prin (G4250).';
const P={
 P7:r.claude_r2,
 P8a:'**[L1]** Matthew 1:18 — '+Q18+'\n\n**[L1]** Matthew 1:20 — '+Q20+'\n\n'+L2x,
 P8b:'[L1] **Matthew 1:18** — '+Q18+'\n\n[L1] **Matthew 1:20** — '+Q20+'\n\n'+L2x,
 P9:'[L1] Matthew 1:18 — '+Q18+'\n\nFooting exhibited:\n\n[L1] Matthew 1:20 — '+Q20+'\n\n'+L2x,
 P9b:'[L1] Matthew 1:18 — '+Q18+'\n\n**LISTED PREMISE 1 — LINK 2: SUPPORTED.**\n\n[L1] Matthew 1:20 — '+Q20+'\n\n'+L2x,
 P10:'1. LINK 2: the source.\n\n[L1] Matthew 1:18 — '+Q18+'\n\n[L1] Matthew 1:20 — '+Q20+'\n\n'+L2x,
 P11:'[L1] Matthew 1:18 — '+Q18+'\n\n[L1] Matthew 1:20 — '+Q20+'\n\nMatthew 1:20 '+Q20+' -- MEANS: the source -- [L2] sunerchomai (G4905) | PROVEN IN [CR1]',
 P12a:'[L1] Matthew 1:18 — '+Q18+'\n\n[L1] Matthew 1:20 — '+Q20+'\n\n[L2] in Matthew 1:20: sunerchomai (G4905), prin (G4250).',
 P12b:'[L1] Matthew 1:18 — '+Q18+'\n\n[L1] Matthew 1:20 — '+Q20+'\n\n[L2] sunerchomai (G4905) | [L3] 1 Corinthians 7:5 "come together again"',
 P13:'[L1] Matthew 1:18 — '+Q18+'\n[L1] Matthew 1:20 — '+Q20+'\n\n'+L2x};
const st=(V,t)=>{const tg=V.tags([['DEFENDER','CR2',t]]);const keys=new Set(tg.flatMap(x=>x.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));return CK.check(tg,ow,OD.lex,[...keys]).map(x=>({v:x.verses.join(', '),s:x.status,w:x.words.filter(w=>w.kind==='strongs').map(w=>w.w+(w.ok?'=':'!')).join(' ')}));};
for(const [k,t] of Object.entries(P)){const a=st(PRE,t),b=st(POST,t);const ch=a.map((x,i)=>JSON.stringify(x)!==JSON.stringify(b[i])?i:-1).filter(i=>i>=0);
 if(k==='P7'){console.log('P7: tags',a.length,'changed',ch.length);ch.forEach(i=>console.log('  ['+a[i].v+'] '+a[i].s+' '+a[i].w+'\n  -> ['+b[i].v+'] '+b[i].s+' '+b[i].w));continue;}
 console.log(k+(ch.length?' CHANGED':' unchanged'));b.forEach((x,i)=>console.log('  PRE ['+a[i].v+'] '+a[i].s+' '+a[i].w+'\n  POST ['+x.v+'] '+x.s+' '+x.w));}
