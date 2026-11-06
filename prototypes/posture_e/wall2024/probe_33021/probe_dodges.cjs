// Ways a gate CHANGE TO on a collision item (33021 gemini G1, RULE K-G4 D1 vs C1) can clear the item without leaving a grade for the pair.
// Run from wall2024/: node probe_33021/probe_dodges.cjs <pkg>
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const X=JSON.parse(rd('probe_33021/fixture_33021.json'));const p=process.argv[2]||'pkgKF';
const AM=rd(p+'/patched/Alternate_Merge.js');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw new Error('offline');},null);
const b=X.bodies.find(b=>b.seat==='gemini');const its=X.sb_items.filter(x=>x.seat==='gemini'&&x.rule!=='E-GATE');const j=X.PB.judges.find(q=>q.seat==='gemini');const PT=L.gatePromptText2024(j.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
const G=L.gateItems2024('gemini',b.verdict_raw,b.fields,its,ctx).items;const g0=X.sb_items.find(x=>x.seat==='gemini'&&x.sid==='G1');
const pair=t=>String(t).replace(/\\n/g,'\n').split('\n').map(l=>l.replace(/[*_`]+/g,'').trim()).filter(l=>/^(?:[-•]|\d+[.)])?\s*D1\s+vs\.?\s+C1\b/i.test(l));
const V={
 'A as live: D1: STANDS':'D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together.',
 'B other pair label (D1 vs C2)':'D1 vs C2 (Matthew 1:18): UNDERDETERMINED -- the parties exhibit different readings. GROUND: [DR3] reads "came together" as the taking.',
 'C same label, no grade word':'D1 vs C1 (Matthew 1:18): NOTED -- the challenger reads "came together" as the taking.',
 'D ruling card line only':'RULING -- D1 vs C1 -- UNDERDETERMINED',
 'E KEYSTONE line':'KEYSTONE: D5 -- STANDS',
 'F same label, STANDS':'D1 vs C1 (Matthew 1:18): STANDS -- GROUND: answered in [CR4].',
 'G proper regrade (control)':'D1 vs C1 (Matthew 1:18): UNDERDETERMINED -- [DR3] reads "came together" as the taking. GROUND: the parties exhibit different readings of Matthew 1:18.',
};
for(const [k,to] of Object.entries(V)){const rep='GATE: G1 || CHANGE TO: '+to+' || reason';const c=L.gateCure2024('gemini',b.verdict_raw,b.fields,its,G,rep,ctx);
 const A=L.sbApply2024('gemini',b.verdict_raw,b.fields,its.concat([{...g0,to}]),ctx.R);const pl=pair(A.text);
 console.log(k.padEnd(34),c.res[0].cured?'CURED  ':'UNCURED','| D1 vs C1 lines after: '+pl.length+(pl.length?' ('+pl.map(l=>l.slice(0,70)).join(' / ')+')':'')+' | '+c.res[0].why.slice(0,110));}
