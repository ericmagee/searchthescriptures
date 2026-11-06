// Run 33025 gate replay (W2). Stored gate replies from debate_enforcer_log (E-GATE rows' full_reply, GATE lines only).
// Run from wall2024/: node probe_33025/replay_gate.cjs pkgKF pkgCP pkgCP2
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const X=JSON.parse(rd('probe_33025/fixture_33025.json'));const REP=JSON.parse(rd('probe_33025/gate_replies.json'));
for(const p of process.argv.slice(2)){const AM=rd(p+'/patched/Alternate_Merge.js');const L=new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw 0},null);
 for(const seat of ['chatgpt','grok']){const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');const PT=L.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
  const R=L.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const c=L.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,REP[seat],ctx);
  console.log('== '+p+' '+seat+': counted '+c.uncured);R.items.forEach((g,i)=>console.log('   '+g.gid+' '+g.kind+' ('+g.src+') lines:'+(g.lines||[]).length+' -> '+(c.res[i].cured?'CURED':'UNCURED')+' -- '+String(c.res[i].why).slice(0,170)));
  (c.fresh||[]).forEach(f=>console.log('   fresh: '+f.kind+' '+(f.src||'')+' '+(f.live?'LIVE':'rec')+' -- '+String(f.why).slice(0,170)));}}
