// Run 33020 gate replay on the live library at the time (pkgGDUP, 17984adf). Run from wall2024/: node pkgGD/probe_33020/replay_gate.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const FX=JSON.parse(rd('pkgGD/probe_33020/fixture_33020.json'));
const AM=rd('pkgGDUP/patched/Alternate_Merge.js');const M=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw new Error('offline');},null);
for(const b of FX.bodies){const its=FX.sb_items.filter(x=>x.seat===b.seat);const j=FX.PB.judges.find(q=>q.seat===b.seat);const PT=M.gatePromptText2024(j.body);const ctx={R:M.ciRounds(PT),DL:M.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const G=M.gateItems2024(b.seat,b.verdict_raw,b.fields,its,ctx).items;const live=(FX.gate_report.find(z=>z.seat===b.seat)||{items:[]}).items;
 const C=M.gateCure2024(b.seat,b.verdict_raw,b.fields,its,G,FX.gate_replies[b.seat]||'',ctx);const lv=FX.gate_live.filter(z=>z.seat===b.seat&&!/^NEW/.test(z.item));
 console.log(b.seat+': items '+G.map(x=>x.gid+' '+x.kind+' ['+x.src+']').join('; ')+' | live '+live.map(x=>x.gid+' '+x.kind).join('; '));
 C.res.forEach((r,i)=>console.log('   '+r.gid+': replay '+(r.cured?'CURED':'UNCURED')+', live '+(lv[i]||{}).cure_status+' -- '+r.why));
 console.log('   uncured counted '+C.uncured+'; raised after the gate answers: '+(C.fresh.map(f=>f.kind+' ('+f.src+')').join('; ')||'none'));}
