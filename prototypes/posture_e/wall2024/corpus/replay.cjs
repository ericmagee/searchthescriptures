// Gate-stage replay of every corpus fixture under one or more packages. Run from wall2024/: node corpus/replay.cjs pkgCL pkgKY ...
// Each package dir must hold patched/Alternate_Merge.js. For every run (main panel and alternate) and seat with gate items,
// prints items, uncured count and per-item result, and checks each labelled seat against corpus/labels.json (W3's grades).
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');
const mk=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks};')(()=>{throw 0},null);};
const LAB=JSON.parse(rd('corpus/labels.json'));const pk=process.argv.slice(2);if(!pk.length){console.log('usage: node corpus/replay.cjs <pkgDir>...');process.exit(1);}
const runs=fs.readdirSync('corpus').filter(f=>/^fix_\d+\.json$/.test(f)).map(f=>f.slice(4,9)).sort();
const out=[];const sum={};
for(const p of pk){const L=mk(p);sum[p]={match:0,mismatch:[],unlabelled:0};
 for(const run of runs){const X0=JSON.parse(rd('corpus/fix_'+run+'.json'));
  for(const [panel,X] of [['main',X0],['alt',X0.alt]]){if(!X||!X.bodies)continue;
   for(const b of X.bodies){const seat=b.seat;const its=(X.sb_items||[]).filter(x=>x.seat===seat&&x.rule!=='E-GATE');const J=(X.PB&&X.PB.judges||[]).find(q=>q.seat===seat);if(!its.length||!J){continue;}
    const PT=L.gatePromptText2024(J.body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
    const R=L.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const rep=(X.gate_replies||{})[seat];
    const c=R.items.length?(rep?L.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:R.items.filter(i=>i.live).length,noreply:true}):{res:[],uncured:0};
    const lab=LAB[run]&&LAB[run][seat]&&LAB[run][seat].stage==='gate'?LAB[run][seat]:null;const removed=c.uncured>0;
    let verdict='-';if(lab&&lab.removed!==null){const ok=lab.removed===removed&&(lab.uncured==null||lab.uncured===c.uncured);verdict=ok?'MATCH':'MISMATCH';if(ok)sum[p].match++;else sum[p].mismatch.push(run+' '+seat);}else sum[p].unlabelled++;
    out.push(p+' '+run+' '+panel+' '+seat+': items '+R.items.length+', uncured '+c.uncured+(c.noreply?' (no gate reply)':'')+' -> '+(removed?'REMOVED':'kept')+(lab?' | W3: '+(lab.removed===null?'open':lab.removed?'removed':'kept')+(lab.uncured!=null?' ('+lab.uncured+')':'')+' '+verdict:''));
    for(const x of c.res)out.push('     '+x.gid+' '+(x.cured?'CURED':'UNCURED')+' -- '+String(x.why||'').slice(0,140));}}}}
out.push('');for(const p of pk)out.push(p+': W3-labelled gate seats MATCH '+sum[p].match+', MISMATCH '+sum[p].mismatch.length+(sum[p].mismatch.length?' ('+sum[p].mismatch.join(', ')+')':'')+'; seats with items and no gate label '+sum[p].unlabelled);
out.push('Not replayed here: 33006 (no node data), cure-stage removals (33014 chatgpt, 33025 gemini).');
console.log(out.join('\n'));
