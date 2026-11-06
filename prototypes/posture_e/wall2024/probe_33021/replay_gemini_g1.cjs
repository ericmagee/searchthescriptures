// Run 33021 gemini gate G1 (RULE K-G4 D1 vs C1) on the live library then (pkgCR, a895b1eb) and on pkgKF. Reply from debate_enforcer_log 6863.
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const X=JSON.parse(rd('probe_33021/fixture_33021.json'));
const REP='GATE: G1 || CHANGE TO: D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together, which can agree with the finding preceding the taking of Matthew 1:24. || In [DR3], the challenger explains that "before they came together" means before the taking of 1:24, which can agree with the finding preceding the taking.';
const mk=f=>{const AM=rd(f);return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateCure2024,gateItems2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024,gateRead2024,sbLabel};')(()=>{throw new Error('offline');},null);};
for(const p of process.argv.slice(2)){const L=mk(p+'/patched/Alternate_Merge.js');const b=X.bodies.find(b=>b.seat==='gemini');const its=X.sb_items.filter(x=>x.seat==='gemini'&&x.rule!=='E-GATE');
 const j=X.PB.judges.find(q=>q.seat==='gemini');const PT=L.gatePromptText2024(j.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const R=L.gateItems2024('gemini',b.verdict_raw,b.fields,its,ctx);const c=L.gateCure2024('gemini',b.verdict_raw,b.fields,its,R.items,REP,ctx);
 console.log('==',p,'items',R.items.map(g=>g.gid+' '+g.kind+' '+g.key).join(' | '));c.res.forEach(r=>console.log('  ',r.gid,r.cured?'CURED':'UNCURED','--',r.why));console.log('  uncured',c.uncured,'fresh',JSON.stringify(c.fresh||[]).slice(0,400));
 if(!R.items.length)continue; console.log('  label of CHANGE TO:',L.sbLabel('D1: STANDS -- GROUND: x'),' label of flagged:',L.sbLabel(R.items[0].lines[0]));
 const t2=(c.R2&&c.R2.text)||'';console.log('  corrected text D1 lines:\n'+t2.split('\n').filter(l=>/D1\b|KEYSTONE|CLAUSE|RESULT|COUNT|STANDING/.test(l)).map(l=>'    > '+l.slice(0,230)).join('\n'));
 console.log('  stored text D1 lines:\n'+String(b.verdict_raw).replace(/\\n/g,'\n').split('\n').filter(l=>/^\s*(?:[-•]\s*)?D1\b/.test(l)).map(l=>'    > '+l.slice(0,230)).join('\n'));}
{const L=mk('pkgCR/patched/Alternate_Merge.js');const b=X.bodies.find(b=>b.seat==='gemini');const its=X.sb_items.filter(x=>x.seat==='gemini'&&x.rule!=='E-GATE');const g=X.sb_items.find(x=>x.seat==='gemini'&&x.sid==='G1');
 const j=X.PB.judges.find(q=>q.seat==='gemini');const PT=L.gatePromptText2024(j.body);const R=L.ciRounds(PT);
 const show=(n,t)=>{console.log('-- '+n);String(t).replace(/\\n/g,'\n').split('\n').filter(l=>/D1\b|C1\b|KEYSTONE|CLAUSE|RESULT:|CONCEDED LINKS|STANDING:/.test(l)&&!/^\[AUDIT/.test(l.trim())).forEach(l=>console.log('   > '+l.slice(0,300)));};
 const A1=L.sbApply2024('gemini',b.verdict_raw,b.fields,its,R);show('after send-back (S1..S10)',A1.text);
 const A2=L.sbApply2024('gemini',b.verdict_raw,b.fields,its.concat([g]),R);show('after send-back + gate G1',A2.text);console.log('fields',JSON.stringify(A2.fields),'items',JSON.stringify(A2.items).slice(0,300));}
