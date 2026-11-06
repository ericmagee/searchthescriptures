// pkgACR test (W3 queue item 2, part 2: the ANSWER CHECK readers, and the K-F quotation ruling of Wall 2410). Run from wall2024/: node pkgACR/test_ACR.cjs
// Lists every behaviour change against pkgKFR (the base): kagRow and the gate line key on every corpus ANSWER CHECK line, selfLines421 and
// kfLines on every corpus text, the whole-node cure replay, and the gate fixtures.
const fs=require('fs');const crypto=require('crypto');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n);}};
const plan=JSON.parse(rd('pkgACR/plan_ACR.json'));
T('22 nodes: base (pkgKFR) and final shas match the plan',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd('pkgKFR/patched/'+n.file))===n.base_sha&&sha(rd('pkgACR/patched/'+n.file))===n.final_sha));
T('every node parses',plan.nodes.every(n=>{try{new Function('$','$input',rd('pkgACR/patched/'+n.file));return true;}catch(e){console.log(e.message);return false;}}));
T('pkgKFR and pkgRU: every non-KF_LINE byte equal (pkgKFR built on graded pkgRU)',plan.nodes.every(n=>{const a=rd('pkgRU/patched/'+n.file),b=rd('pkgKFR/patched/'+n.file);const i=a.indexOf('\nconst KF_LINE=');const j=a.indexOf('\n',i+1);return b.startsWith(a.slice(0,i))&&b.endsWith(a.slice(j));}));
const lib=p=>{const AM=rd(p+'/patched/Alternate_Merge.js');return new Function('$','$input',AM.slice(0,AM.indexOf("const AM=$('Alternate Merge Seat')"))+'\nreturn {kagRow,selfLines421,gateLineFor2024,kfLines,gateItems2024,gateCure2024,ciRounds,gatePromptText2024,drvLinks,sbApply2024};')(()=>{throw 0},null);};
const O=lib('pkgKFR'),N=lib('pkgACR');
const C=rd('corpus/texts.jsonl').split('\n').filter(Boolean).map(l=>JSON.parse(l));
// 1. kagRow and the gate line key on every distinct ANSWER CHECK line
const seen=new Set();const kd=[],gd0=[];let nA=0;
for(const o of C){const t=o.jtext!=null?o.jtext:o.text;for(const raw of String(t).split('\n')){const l=raw.trim();if(!/ANSWER CHECK\s*:/i.test(l))continue;if(seen.has(l))continue;seen.add(l);nA++;
 const a=O.kagRow(l),b=N.kagRow(l);const sa=a&&JSON.stringify([a.verse,a.rk,a.none,a.grade]),sb=b&&JSON.stringify([b.verse,b.rk,b.none,b.grade]);if(sa!==sb)kd.push({o,l,sa,sb});
 const ga=O.gateLineFor2024({lines:['X',l]},l),gb=N.gateLineFor2024({lines:['X',l]},l);if(ga!==gb)gd0.push({o,l,ga,gb});}}
const kk=d=>!d.sa?'NEW READ':!d.sb?'NO LONGER READ':JSON.parse(d.sa)[3]!==JSON.parse(d.sb)[3]?'GRADE differs':JSON.parse(d.sa)[2]!==JSON.parse(d.sb)[2]?'NONE differs':'verse or round text differs';
const byK={};kd.forEach(d=>{(byK[kk(d)]=byK[kk(d)]||[]).push(d);});
console.log('   distinct ANSWER CHECK lines: '+nA+'; kagRow reads differently: '+kd.length+' ('+Object.entries(byK).map(([k,v])=>k+' '+v.length).join(', ')+')');
for(const [k,v] of Object.entries(byK)){console.log('   == '+k);v.slice(0,40).forEach(d=>console.log('     '+d.o.run+' '+d.o.seat+' '+d.o.src+': '+d.l.slice(0,140)+'\n        old: '+d.sa+'\n        new: '+d.sb));if(v.length>40)console.log('     ... '+(v.length-40)+' more');}
T('kagRow: no line read before is lost; no new line read; a grade changes only from none to a grade word (false K-AG items removed)',!(byK['NO LONGER READ']||[]).length&&!(byK['NEW READ']||[]).length&&(byK['GRADE differs']||[]).every(d=>JSON.parse(d.sa)[3]===''&&/^(MEETS|MISSES|FAILS|UNPROVEN)$/.test(JSON.parse(d.sb)[3])));
console.log('   gate line key (an ANSWER CHECK CHANGE finds its own line): '+gd0.length+' lines differ');gd0.slice(0,10).forEach(d=>console.log('     '+d.o.run+' '+d.o.seat+': '+d.l.slice(0,120)+' :: old '+String(d.ga).slice(0,30)+' new '+String(d.gb).slice(0,30)));
T('gate line key: every ANSWER CHECK line still finds itself',gd0.every(d=>d.gb===d.l));
// 2. selfLines421 and kfLines on every text
const FX={'32998':'pkgGD/fixture_32998.json','33014':'pkgKF/fixture_33014.json','33020':'pkgGD/probe_33020/fixture_33020.json','33021':'probe_33021/fixture_33021.json','33025':'probe_33025/fixture_33025.json','33040':'corpus/fix_33040.json'};
const RC={};const roundsOf=run=>{if(run in RC)return RC[run];let R=null;try{const X=JSON.parse(rd(FX[run]));const j=X.PB.judges.find(q=>q&&q.body);R=O.ciRounds(O.gatePromptText2024(j.body));}catch(e){R=null;}return RC[run]=R;};
const sd=[],fd=[];let nS=0,nK=0;
for(const o of C){if(!/^(verdict_final|verdict_gate|alt_verdict_gate|cure_reply|alternate_reply|gate_reply|sendback_reply)$/.test(o.src))continue;const t=o.jtext!=null?o.jtext:o.text;nS++;
 const a=JSON.stringify(O.selfLines421(t)),b=JSON.stringify(N.selfLines421(t));if(a!==b)sd.push(o.run+' '+o.seat+' '+o.src+'\n        old: '+a.slice(0,400)+'\n        new: '+b.slice(0,400));
 const R=roundsOf(o.run);if(!R)continue;nK++;const x=JSON.stringify(O.kfLines(t,R).items.map(z=>[z.link,z.why])),y=JSON.stringify(N.kfLines(t,R).items.map(z=>[z.link,z.why]));if(x!==y)fd.push(o.run+' '+o.seat+' '+o.src+'\n        old: '+x.slice(0,300)+'\n        new: '+y.slice(0,300));}
console.log('   selfLines421 (B7 marks) on '+nS+' texts: '+sd.length+' differ');sd.forEach(x=>console.log('     '+x));
console.log('   kfLines (K-F, TRIAL) with the run\'s rounds on '+nK+' texts: '+fd.length+' differ');fd.forEach(x=>console.log('     '+x));
// 3. whole-node cure replay
const {execSync}=require('child_process');const cr=p=>execSync('node corpus/replay_cure_node.cjs '+p,{encoding:'utf8',maxBuffer:1<<26});
const co=cr('pkgKFR'),cn=cr('pkgACR');const dl=s=>s.split('\n').filter(l=>/^  \d/.test(l));const sum=s=>(s.match(/: (\d+) of (\d+) cure rows/)||[]).slice(1).join('/');
const dO=new Set(dl(co)),dN=dl(cn);const newD=dN.filter(l=>!dO.has(l)),goneD=[...dO].filter(l=>!dN.includes(l));
console.log('   cure replay vs stored: pkgKFR '+sum(co)+', pkgACR '+sum(cn)+'\n   rows that change pkgKFR -> pkgACR:'+(newD.length?'\n     + '+newD.join('\n     + '):' none')+(goneD.length?'\n     - '+goneD.join('\n     - '):''));
const lv=s=>s.split('\n').filter(l=>/LIVE uncured/.test(l));const lo=lv(co),ln=lv(cn);const lvD=ln.filter((l,i)=>l.replace(/^pkgACR/,'')!==String(lo[i]||'').replace(/^pkgKFR/,''));
console.log('   seats whose LIVE uncured count changes: '+(lvD.length?lvD.join(' | '):'none'));
T('no seat\'s LIVE uncured count changes in the cure replay',!lvD.length);
// 4. gate fixtures
const RUNS=[['32998','pkgGD/fixture_32998.json',null],['33014','pkgKF/fixture_33014.json',null],['33020','pkgGD/probe_33020/fixture_33020.json',null],['33021','probe_33021/fixture_33021.json','R21'],['33025','probe_33025/fixture_33025.json','probe_33025/gate_replies.json'],['33040','corpus/fix_33040.json',null]];
const REP21={gemini:'GATE: G1 || CHANGE TO: D1: STANDS -- GROUND: Answered in [CR4]; Matthew 1:18 dates the finding before they came together, which can agree with the finding preceding the taking of Matthew 1:24. || In [DR3], the challenger explains that "before they came together" means before the taking of 1:24, which can agree with the finding preceding the taking.'};
const run=(L,X,seat,rep)=>{const b=X.bodies.find(b=>b.seat===seat);const its=X.sb_items.filter(x=>x.seat===seat&&x.rule!=='E-GATE');if(!its.length)return null;const PT=L.gatePromptText2024(X.PB.judges.find(q=>q.seat===seat).body);const ctx={R:L.ciRounds(PT),DL:L.drvLinks(PT),ask:PT.includes('CITATION CHECK')};
 const A=L.sbApply2024(seat,b.verdict_raw,b.fields,its,ctx.R);const R=L.gateItems2024(seat,b.verdict_raw,b.fields,its,ctx);const c=rep&&R.items.length?L.gateCure2024(seat,b.verdict_raw,b.fields,its,R.items,rep,ctx):{res:[],uncured:0};return JSON.stringify([A&&A.applied,R.items.map(g=>g.gid+' '+g.kind+' '+g.key),c.res.map(x=>x.gid+' '+x.cured+' '+x.why),c.uncured]);};
const gd=[];let gs=0;for(const [name,f,rp] of RUNS){const X0=JSON.parse(rd(f));const REP=rp==='R21'?REP21:rp?JSON.parse(rd(rp)):null;for(const X of [X0,X0.alt].filter(x=>x&&x.bodies&&x.bodies.length))for(const b of X.bodies){const rep=(REP||X.gate_replies||{})[b.seat];const a=run(O,X,b.seat,rep);if(a===null)continue;gs++;const n=run(N,X,b.seat,rep);if(a!==n)gd.push(name+' '+b.seat+'\n        old: '+a.slice(0,400)+'\n        new: '+n.slice(0,400));}}
console.log('   gate: '+gs+' fixture seats; '+gd.length+' differ');gd.forEach(x=>console.log('     '+x));
// units
const L1='ANSWER CHECK: Matthew 1:18 -- [CR3], [CR4] -- MEANS: "a b c" -- ANSWER: "d e f" -- MEETS';
T('unit: kagRow reads several rounds (G6) with grade MEETS',(N.kagRow(L1)||{}).grade==='MEETS'&&/CR3.*CR4/.test((N.kagRow(L1)||{}).rk));
T('unit: a short line with no MEANS/ANSWER stays unread by kagRow, as before',N.kagRow('ANSWER CHECK: Genesis 24:16 -- [CR3] -- MISSES (Commitment 5)')===null);
T('unit: kagRow ANSWER: NONE is read as none',(N.kagRow('ANSWER CHECK: Luke 1:35 -- [DR3] -- MEANS: "a b c" -- ANSWER: NONE -- MEETS')||{}).none===true);
T('unit: a malformed ANSWER CHECK line is still read by the old reader (grade word lower case)',(N.kagRow('ANSWER CHECK: Luke 1:35 -- [DR3] -- MEANS: "a b c" -- ANSWER: "d e f" -- meets')||{}).grade==='MEETS');
T('unit: selfLines421 counts the second listed round',N.selfLines421('ANSWER CHECK: Matthew 1:18 -- [DR3], [CR4] -- MEANS: "a b c" -- ANSWER: "d e f" -- MEETS\nCONCEDED LINKS: 1 -- premise 2 UNEXHIBITED on Matthew 1:18').length===1&&O.selfLines421('ANSWER CHECK: Matthew 1:18 -- [DR3], [CR4] -- MEANS: "a b c" -- ANSWER: "d e f" -- MEETS\nCONCEDED LINKS: 1 -- premise 2 UNEXHIBITED on Matthew 1:18').length===0);
console.log(ok+' OK, '+bad+' FAIL');process.exit(bad?1:0);
