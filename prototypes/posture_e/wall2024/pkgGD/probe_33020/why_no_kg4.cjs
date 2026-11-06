// Run 33020 grok G2 (W3 2333 ask): why the gate re-read raised no K-G4 on grok's new "D1 vs C2 ... DEFENDER LINK BROKEN" line.
// Run from wall2024/: node pkgGD/probe_33020/why_no_kg4.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const FX=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json'));
const AM=rd('pkgGDUP/patched/Alternate_Merge.js');const M=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,drvCheck,PRS_CTX,prsUnprovenOnly,__kfHas};')(()=>{throw new Error('offline');},null);
const b=FX.bodies.find(x=>x.seat==='grok');const its=FX.sb_items.filter(x=>x.seat==='grok');const j=FX.PB.judges.find(q=>q.seat==='grok');const PT=M.gatePromptText2024(j.body);
const ctx={R:M.ciRounds(PT),DL:M.drvLinks(PT),ask:PT.includes('CITATION CHECK')};const G=M.gateItems2024('grok',b.verdict_raw,b.fields,its,ctx).items;
const C=M.gateCure2024('grok',b.verdict_raw,b.fields,its,G,FX.gate_replies.grok,ctx);const T1=C.R2.T1;
const L=T1.split('\n').filter(l=>/D1 vs C2/.test(l));console.log('grok corrected text, lines naming D1 vs C2:');L.forEach(l=>console.log('   '+l.slice(0,260)));
M.PRS_CTX.R=ctx.R;const D=M.drvCheck(T1,C.R2.R1.fields.conceded_links,C.R2.R1.fields.challenger_conceded_links,C.R2.R1.fields.defense_standing,C.R2.R1.fields.challenge_standing,!!ctx.ask,ctx.DL);
console.log('drvCheck items on D1 vs C2: '+((D.items||[]).filter(x=>/D1 VS C2/i.test(String(x.link))).map(x=>x.rule).join(', ')||'none'));
console.log('drvCheck marks on D1 vs C2:');(D.marks||[]).filter(m=>/D1 vs C2/i.test(m)).forEach(m=>console.log('   '+m.slice(0,400)));
const bl=L.find(l=>/LINK BROKEN/.test(l));console.log('__kfHas(text, "D1 vs C2"): '+M.__kfHas(T1,'D1 vs C2')+'; prsUnprovenOnly(line, DEFENDER): '+(bl?M.prsUnprovenOnly(bl,'DEFENDER'):'n/a'));
