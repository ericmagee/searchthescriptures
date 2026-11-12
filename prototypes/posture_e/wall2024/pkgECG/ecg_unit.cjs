// pkgECG unit plants on ecgSplit2024 with a stubbed $ (confirmed sets given per case)
const ld=require('./gdc/lib.cjs');const B=ld(process.argv[2]);const src=B.Lb[B.Lb.length-1];
const mk=(cec,jcc)=>n=>{const m={'Close Enforcer Record':cec&&{json:{cec:{confirmed:cec}}},'Judge Contradiction Record':jcc&&{json:{jcc:{confirmed:jcc}}}}[n];return m?{isExecuted:true,first:()=>m}:{isExecuted:false};};
const F=$=>new Function('$',src+'\nreturn ecgSplit2024;')($);
const D=(s,l)=>({side:s,link:l});
const C=[['P1 K-G4 on a link not confirmed (D1)',[D('DEFENDER',4)],null,{rule:'K-G4',link:'D1 vs C1',line:'D1 vs C1 (Luke 1:27): DEFENDER LINK BROKEN -- x'}],
 ['P2 K-B, CHALLENGER LINK BROKEN on confirmed CHALLENGER 2',[D('CHALLENGER',2)],null,{rule:'K-B',link:'D1 vs C2',line:'D1 vs C2: CHALLENGER LINK BROKEN -- x'}],
 ['P3 markdown bold line, confirmed DEFENDER 3',[D('DEFENDER',3)],null,{rule:'K-G7',link:'D3 vs C1',line:'**D3 vs C1 (Isaiah 7:14)**: DEFENDER LINK BROKEN -- x'}],
 ['P4 K-G1 (out of scope) on confirmed DEFENDER 3',[D('DEFENDER',3)],null,{rule:'K-G1',link:'D3 vs C1',line:'D3 vs C1: DEFENDER LINK BROKEN -- x'}],
 ['P5 only jcc ran, confirmed DEFENDER 3',null,[D('DEFENDER',3)],{rule:'K-G4',link:'D3 vs C1',line:'D3 vs C1: DEFENDER LINK BROKEN -- x'}],
 ['P6 neither record ran',null,null,{rule:'K-G4',link:'D3 vs C1',line:'D3 vs C1: DEFENDER LINK BROKEN -- x'}],
 ['P7 CHALLENGER grade on D4 vs C4 when only DEFENDER 4 is confirmed',[D('DEFENDER',4)],null,{rule:'K-G4',link:'D4 vs C4',line:'D4 vs C4: CHALLENGER LINK BROKEN -- x'}],
 ['P8 STANDS grade on confirmed DEFENDER 4',[D('DEFENDER',4)],null,{rule:'K-G4',link:'D4 vs C4',line:'D4 vs C4: STANDS -- x'}],
 ['P9 FORCED line on confirmed DEFENDER 4',[D('DEFENDER',4)],null,{rule:'K-G7',link:'D4 vs C4',line:'FORCED: D4 vs C4 -- MEANS x'}],
 ['P10 link given as string "4"',[{side:'DEFENDER',link:'4'}],null,{rule:'K-B',link:'D4 vs C2',line:'D4 vs C2 (Luke 2:48): DEFENDER LINK BROKEN -- x'}]];
for(const [k,cec,jcc,it] of C){const r=F(mk(cec,jcc))([it]);console.log(k.padEnd(62),r.ecg.length?'MOVED (not asked)':'kept (asked)');}
