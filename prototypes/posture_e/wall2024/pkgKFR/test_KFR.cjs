// pkgKFR test (W3 queue item 2, swap 1: KF_LINE -> readLines FORCED). Run from wall2024/: node pkgKFR/test_KFR.cjs
// Lists every behaviour change against pkgRU (the base): line reads, K-F items on every corpus text, the whole-node cure replay, and the gate.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgKFR/plan_KFR.json'));
T('22 nodes: base (pkgRU) and final shas match the plan; reader sha matches',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgRU/patched/'+n.file))===n.base_sha&&sha(rd('pkgKFR/patched/'+n.file))===n.final_sha)&&sha(rd('reader/readLines.cjs'))===plan.reader_sha);
T('every node parses',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgKFR/patched/'+n.file));return true;}catch(e){console.log(e.message);return false;}}));
const lib=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {KF_LINE,kfLines,cureJText,gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgRU'),N=lib('pkgKFR');
// 1. every corpus line that starts with FORCED (after list and markdown marks): old KF_LINE vs new
const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l));
const lineDiff=[];let nF=0;const seen=new Set();
for(const o of C){const t=o.jtext!=null?o.jtext:o.text;for(const raw of String(t).split('\n')){const l=raw.trim().replace(/[*_`]+/g,'');if(!/^(?:[-•]|\d+[.)])?\s*FORCED\b/i.test(l))continue;if(seen.has(l))continue;seen.add(l);nF++;
 const a=l.match(O.KF_LINE),b=l.match(N.KF_LINE);const A=a?[a[1].replace(/\s+vs\.?\s+/i,' vs '),a[2].toUpperCase(),a[3],a[4].toUpperCase(),a[5],a[6]]:null,B=b?[b[1],b[2],b[3],b[4],b[5],b[6]]:null;
 if(JSON.stringify(A)!==JSON.stringify(B))lineDiff.push({run:o.run,seat:o.seat,src:o.src,l,A,B});}}
const kind=d=>!d.A?'NEW READ':!d.B?'NO LONGER READ':d.A[5]!==d.B[5]&&d.A.slice(0,5).join()===d.B.slice(0,5).join()?'FAILS longer':'FIELDS differ';
const nb=x=>JSON.stringify(x).replace(/\\+/g,'');const kind0=kind;const kind2=d=>kind0(d)==='FIELDS differ'&&nb(d.A)===nb(d.B)?'backslashes only (the reader strips them, spec 7 norm)':kind0(d);
const byK={};lineDiff.forEach(d=>{(byK[kind2(d)]=byK[kind2(d)]||[]).push(d);});
console.log('   distinct FORCED-labelled corpus lines: '+nF+'; read differently: '+lineDiff.length+' ('+Object.entries(byK).map(([k,v])=>k+' '+v.length).join(', ')+')');
for(const [k,v] of Object.entries(byK)){if(/^backslashes/.test(k))continue;console.log('   == '+k);v.forEach(d=>console.log('     '+d.run+' '+d.seat+' '+d.src+': '+d.l.slice(0,150)+(k==='FAILS longer'?'\n        FAILS old: '+JSON.stringify(d.A[5]).slice(0,120)+'\n        FAILS new: '+JSON.stringify(d.B[5]).slice(0,160):k==='FIELDS differ'?'\n        old: '+JSON.stringify(d.A).slice(0,200)+'\n        new: '+JSON.stringify(d.B).slice(0,200):'')));}
T('no FORCED line read by KF_LINE is lost by the reader',!(byK['NO LONGER READ']||[]).length);
// 2. K-F items (kfLines) on every panel/alternate judgment text and cure reply in the corpus: old vs new
const FX={'32998':'pkgGD/fixture_32998.json','33014':'pkgKF/fixture_33014.json','33020':'pkgGD/probe_33020/fixture_33020.json','33021':'probe_33021/fixture_33021.json','33025':'probe_33025/fixture_33025.json','33040':'corpus/fix_33040.json'};
const RC={};const roundsOf=run=>{if(run in RC)return RC[run];let R=null;try{const X=JSON.parse(rd(FX[run]));const j=X.PB.judges.find(q=>q&&q.body);R=O.ciRounds(O.gatePromptText2024(j.body));}catch(e){R=null;}return RC[run]=R;};
const kfDiff=[];let nT=0,nR=0;
for(const o of C){if(!/^(verdict_final|verdict_gate|alt_verdict_gate|cure_reply|alternate_reply|gate_reply|sendback_reply)$/.test(o.src))continue;const R0=roundsOf(o.run);if(!R0)continue;nT++;const t=o.jtext!=null?o.jtext:o.text;
 let a,b;try{a=O.kfLines(t,R0);}catch(e){a={items:[{err:e.message}]};}try{b=N.kfLines(t,R0);}catch(e){b={items:[{err:e.message}]};}
 const sa=JSON.stringify((a.items||[]).map(x=>[x.rule,x.link,x.why||x.kind||''])),sb=JSON.stringify((b.items||[]).map(x=>[x.rule,x.link,x.why||x.kind||'']));if(sa!==sb)kfDiff.push(o.run+' '+o.seat+' '+o.src+'\n        old: '+sa.slice(0,300)+'\n        new: '+sb.slice(0,300));}
console.log('   kfLines with the run\'s rounds on '+nT+' texts (runs with a fixture): '+kfDiff.length+' differ');kfDiff.forEach(x=>console.log('     '+x));
// 3. whole-node cure replay (W2 harness) base vs patched
const {execSync}=require('child_process');const cr=p=>execSync('node corpus/replay_cure_node.cjs '+p,{encoding:'utf8',maxBuffer:1<<26});
const co=cr('pkgRU'),cn=cr('pkgKFR');const dl=s=>s.split('\n').filter(l=>/^  \d/.test(l));const sum=s=>(s.match(/: (\d+) of (\d+) cure rows/)||[]).slice(1).join('/');
const dO=new Set(dl(co)),dN=dl(cn);const newD=dN.filter(l=>!dO.has(l)),goneD=[...dO].filter(l=>!dN.includes(l));
console.log('   cure replay vs stored: pkgRU '+sum(co)+', pkgKFR '+sum(cn)+'\n   rows that change pkgRU -> pkgKFR:'+(newD.length?'\n     + '+newD.join('\n     + '):' none')+(goneD.length?'\n     - '+goneD.join('\n     - '):''));
const lv=s=>s.split('\n').filter(l=>/LIVE uncured/.test(l));const lo=lv(co),ln=lv(cn);const lvD=ln.filter((l,i)=>l.replace(/^pkgKFR/,'')!==String(lo[i]||'').replace(/^pkgRU/,''));
console.log('   seats whose LIVE uncured count changes: '+(lvD.length?lvD.join(' | '):'none'));
// 4. gate fixtures base vs patched
const RUNS=[['32998','pkgGD/fixture_32998.json',null],['33014','pkgKF/fixture_33014.json',null],['33020','pkgGD/probe_33020/fixture_33020.json',null],['33021','probe_33021/fixture_33021.json','R21'],['33025','probe_33025/fixture_33025.json','probe_33025/gate_replies.json'],['33040','corpus/fix_33040.json',null]];
const REP21={gemini:'GATE: G1 || CHANGE TO: D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together, which can agree with the finding preceding the taking of Matthew 1:24. || In [DR3], the challenger explains that "before they came together" means before the taking of 1:24, which can agree with the finding preceding the taking.'};
const run=(L,X,seat,rep)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!its.length)return null;const PT=L.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const A=L.sbApply2024(seat,b.verdict_raw,b.fields,its,ctx.R);const R=L.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const c=rep&&R.items.length?L.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};return JSON.stringify([A&&A.applied,R.items.map(g=>g.gid+' '+g.kind+' '+g.key),c.res.map(x=>x.gid+' '+x.cured+' '+x.why),c.uncured]);};
const gd=[];let gs=0;for(const [name,f,rp] of RUNS){const X0=JSON.parse(rd(f));const REP=rp==='R21'?REP21:rp?JSON.parse(rd(rp)):null;for(const X of [X0,X0.alt].filter(x=>x&&x.bodies&&x.bodies.length))for(const b of X.bodies){const rep=(REP||X.gate_replies||{})[b.seat];const a=run(O,X,b.seat,rep);if(a===null)continue;gs++;const n=run(N,X,b.seat,rep);if(a!==n)gd.push(name+' '+b.seat+'\n        old: '+a.slice(0,300)+'\n        new: '+n.slice(0,300));}}
console.log('   gate: '+gs+' fixture seats; '+gd.length+' differ');gd.forEach(x=>console.log('     '+x));
// units: the forms W3 ruled in
const u=s=>s.match(N.KF_LINE);
T('unit: tag after the pair (spec 11)',!!u('FORCED: D1 vs C1 (Commitment 3) -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "c"')&&!'FORCED: D1 vs C1 (Commitment 3) -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "c"'.match(O.KF_LINE));
T('unit: [Defender R3] reads as CR3 (spec 8.2)',(u('FORCED: D1 vs C1 -- MEANS [Defender R3]: "a" -- ANSWER [Challenger R3]: "b" -- FAILS: "c"')||[])[2]==='CR3');
T('unit: a MEANS quote holding " -- " ends at the ANSWER label (spec 8 rule 1)',(u('FORCED: D2 vs C3 -- MEANS [CR3]: "the row denies -- [L2] word | [L3] Genesis 4:1 "Adam knew Eve"" -- ANSWER [DR3]: "b" -- FAILS: "c"')||[])[3]==='the row denies -- [L2] word | [L3] Genesis 4:1 "Adam knew Eve"');
T('unit: a RESTATED FORCED line is not a FORCED line here (as before)',!u('RESTATED: FORCED: D1 vs C1 -- MEANS [CR3]: "a" -- ANSWER [DR3]: "b" -- FAILS: "c"'));
T('unit: a non-FORCED line is refused',!u('D1 vs C1 (Matthew 1:18): STANDS')&&!N.KF_LINE.test('ANSWER CHECK: Matthew 1:18 -- [CR3] -- MEANS: "a" -- ANSWER: "b" -- MEETS'));
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
