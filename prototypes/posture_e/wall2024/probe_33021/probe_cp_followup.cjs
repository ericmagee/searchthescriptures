// W2 check for the pkgCP follow-up (W3 2357): WITHDRAWN regrade, lower-case grade, grade after a dash. Real 33021 gemini gate item on <pkg>.
// Run from wall2024/: node probe_33021/probe_cp_followup.cjs <pkg>
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const X=JSON.parse(rd('probe_33021/fixture_33021.json'));const p=process.argv[2]||'pkgCP';
const AM=rd(p+'/patched/Alternate_Merge.js');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw 0},null);
const b=X.bodies.find(b=>b.seat==='gemini');const its=X.sb_items.filter(x=>x.seat==='gemini'&&x.rule!=='E-GATE');const PT=L.gatePromptText2024(X.PB.judges.find(q=>q.seat==='gemini').body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
const G=L.gateItems2024('gemini',b.verdict_raw,b.fields,its,ctx).items;const pair=t=>String(t||'').split('\n').filter(l=>/D1\s+vs\.?\s+C1/i.test(l)&&!/AUDIT|RULING/.test(l)).map(l=>l.trim().slice(0,90));
const BR='Matthew 1:18 establishes that the child was conceived of the Holy Ghost before coming together, which contradicts natural paternity -- GROUND: The text explicitly places the conception of the Holy Ghost prior to any coming together. Matthew 1:18: "When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const V=[
 ['should NOT cure','K1 same BROKEN line, grade lower case','D1 vs C1 (Matthew 1:18): challenger link broken -- '+BR],
 ['should NOT cure','K2 same BROKEN line, grade after a dash','D1 vs C1 (Matthew 1:18) -- CHALLENGER LINK BROKEN -- '+BR],
 ['should NOT cure','K3 control: same BROKEN line unchanged form','D1 vs C1 (Matthew 1:18): CHALLENGER LINK BROKEN -- '+BR],
 ['should cure','W2 text before the colon, STANDS','D1 vs C1 (Matthew 1:18) collision: STANDS -- answered in [CR4].'],
 ['should cure','W1 WITHDRAWN regrade','D1 vs C1 (Matthew 1:18): WITHDRAWN -- the defender withdrew D1 in [CR4].'],
 ['should NOT cure','L1 lower-case grade word','D1 vs C1 (Matthew 1:18): underdetermined -- the parties exhibit different readings. GROUND: [DR3] reads "came together" as the taking.'],
 ['should NOT cure','H1 grade after a dash','D1 vs C1 (Matthew 1:18) -- UNDERDETERMINED -- the parties exhibit different readings.'],
 ['should NOT cure','L2 lower-case grade word only inside prose','D1 vs C1 (Matthew 1:18): NOTED -- the challenger link broken claim is withdrawn by me.'],
 ['should NOT cure','H2 dash, no grade, grade word in prose','D1 vs C1 (Matthew 1:18) -- NOTED; earlier I wrote CHALLENGER LINK BROKEN here.'],
 ['should NOT cure','N1 grade word in the GROUND only','D1 vs C1 (Matthew 1:18): NOTED -- GROUND: not UNDERDETERMINED, not STANDS.'],
 ['should NOT cure','A as live: D1: STANDS','D1: STANDS -- GROUND: x'],
 ['should cure','G control UNDERDETERMINED','D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- [DR3] reads "came together" as the taking. GROUND: the parties exhibit different readings of Matthew 1:18.'],
];
for(const [exp,k,to] of V){const c=L.gateCure2024('gemini',b.verdict_raw,b.fields,its,G,'GATE: G1 || CHANGE TO: '+to+' || r',ctx);const ok=(exp==='should cure')===!!c.res[0].cured;
 console.log((ok?'as expected ':'UNEXPECTED  ')+exp.padEnd(16)+k.padEnd(44)+(c.res[0].cured?'CURED  ':'UNCURED')+' | '+pair(c.R2&&c.R2.T1).join(' / '));}
