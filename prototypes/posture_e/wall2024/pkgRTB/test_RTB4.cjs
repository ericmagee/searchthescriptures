// pkgRTB family 4 test (K-G11 / K-P). Run from wall2024/: node pkgRTB/test_RTB4.cjs [dest strip=pkgLIB/strip_RTB4]
// 1 Conformance against the engine's own code:
//   a the K-G11 and K-P asks and the line mark carry the same restated-line rule (one PU render);
//   b the engine's restated LINK BROKEN cure tests the line's unanswered verses against x.pwk, and pwk is the proven set (p.keys; PA = p.all
//     marks UNPROVEN), so the rule must say PROVEN; the count mark's cure matches the count branch (CORRECTED COUNT + CORRECTED STANDING);
//   c the engine's own pwUnans, run on an example restated line, finds the verse it names as left unanswered, and finds none in a "rests on" line;
//   d no old copy is left; every render appears as often as the tally says.
// 2 Replay: every changed library node (base strip vs dest strip) on every saved run is byte-equal once each render is put back.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const {PU,RX}=require('./rule_table.cjs');let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const plan=JSON.parse(fs.readFileSync('pkgRTB/plan_RTB4.json','utf8'));const SUBS=require('./build_RTB4_subs.cjs')();
const A=plan.library.base,B=(process.argv[2]||'pkgLIB/strip_RTB4').replace(/\/$/,'')+'/patched/';
const CB=fs.readFileSync(B+'Panel_Cure_Build_1.js','utf8'),PP=fs.readFileSync(B+'Panel_Payloads.js','utf8');
// 1a
T(CB.includes(PU.render.kg11())&&CB.includes(PU.render.kp())&&PP.includes(PU.render.markLine())&&[PU.render.kg11(),PU.render.kp(),PU.render.markLine()].every(x=>x.includes(PU.restated)&&x.includes(PU.notBroken)),'K-G11 ask, K-P ask and line mark carry one restated-line rule: '+PU.restated);
T(PU.render.markLine().includes(RX.render.clause('that line')),'line mark carries the family 2 RETRACTED clause');
// 1b
T(/if\(x\.rule==='K-G11'\|\|\(x\.rule==='K-P'&&x\.premise==null\)\)\{/.test(CB)&&CB.includes("const P=new Set(x.pwk||[]);const un=pwUnans(rs[0].text).filter(k=>P.has(k));"),'engine: one branch for K-G11 and line-form K-P; restated LINK BROKEN cures only on pwUnans ∩ pwk');
T(PP.includes("PWS[side]=PL?new Set(PL.flatMap(p=>[...p.keys])):null;PWS[side+'A']=PL?new Set(PL.flatMap(p=>[...(p.all||p.keys)])):null;")&&PP.includes("const kp=U.some(k=>PA.has(k));")&&PP.includes("pwk:[...PW]"),'engine: pwk is the proven set (p.keys); a verse only in p.all raises K-P (UNPROVEN), so the rule says PROVEN');
T(/if\(x\.rule==='K-G10'\|\|\(x\.rule==='K-P'&&x\.premise!=null\)\)/.test(CB)&&CB.includes("no CORRECTED COUNT for '+x.side")&&CB.includes("two differing CORRECTED STANDING lines")&&PU.render.markCount().includes('CORRECTED COUNT')&&PU.render.markCount().includes('CORRECTED STANDING'),'count mark cure = count branch (CORRECTED COUNT, CORRECTED STANDING)');
// 1c run the engine's own pwUnans (hoisted from the patched Panel Cure Build, run in the harness on a saved run)
const C1=async()=>{const ex=JSON.stringify(['D2 vs C1: CHALLENGER LINK BROKEN -- the challenger leaves Isaiah 7:14 unanswered','D2 vs C1: CHALLENGER LINK BROKEN -- the line rests on the proven press of Isaiah 7:14']);
 let r=null;try{const j=CB.indexOf('function pwAnswered(');r=await harness('33798')('return (async()=>{'+CB.slice(0,j)+'\nreturn '+ex+'.map(l=>pwUnans(l));\n'+CB.slice(j)+'\n})()',feeder('/mnt/project-files/wall2024/fetchback_live_s61.json','Panel Cure Build 1')[0]);}catch(e){log('     run: '+String(e.message||e).slice(0,120));}
 T(r&&r[0].length>0&&r[1].length===0,'engine pwUnans: a line naming the verse as left unanswered gives '+JSON.stringify(r&&r[0])+'; a "rests on a proven press" line gives '+JSON.stringify(r&&r[1]));};
// 1d
const files=fs.readdirSync(B).map(f=>B+f);const cnt=(s,t)=>s.split(t).length-1;const all=SUBS.library;
{let left=0;for(const p of files){const s=fs.readFileSync(p,'utf8');for(const [t,o] of all)if(s.includes(o)){left++;log('     old copy left: '+p+' :: '+t);}}
 T(left===0,'no old copy left in '+files.length+' files');
 const have={};for(const [t,,nw] of all)have[t]=files.reduce((a,p)=>a+cnt(fs.readFileSync(p,'utf8'),nw),0);
 T(all.every(([t])=>have[t]===plan.tally[t]),'render counts '+JSON.stringify(have)+' = tally '+JSON.stringify(plan.tally));}
// 2 replay
const PAIRS=all.map(([t,o,n])=>[n,o]);
const enc=s=>JSON.stringify(s).slice(1,-1);const back=s=>{for(const [n,o] of PAIRS)for(const [x,y] of [[enc(enc(n)),enc(enc(o))],[enc(n),enc(o)],[n,o]])s=s.split(x).join(y);return s;};
const canon=s=>s.replace(/\\+"/g,'"');const norm=s=>s.replace(/"(at|ms|elapsed_ms|started_at|now)":\s*("[^"]*"|\d+)/g,'"$1":0');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d{5}_/.test(f)).map(f=>f.split('_')[0]))].sort();
const run=async(src,Rn,IN)=>{try{return 'OUT '+norm(JSON.stringify(await Promise.resolve(harness(Rn)('return (async()=>{'+src+'\n})()',IN))));}catch(e){return 'ERR '+String(e&&e.message||e).slice(0,120);}};
(async()=>{await C1();let R=0,E=0,X=0;
 for(const f of Object.keys(plan.library.nodes)){const n=f.replace(/\.js$/,'').replace(/_/g,' ');let IN;try{IN=feeder('/mnt/project-files/wall2024/fetchback_live_s61.json',n)[0];}catch(e){log('SKIP '+n+': no feeder');continue;}
  const a0=fs.readFileSync(A+f,'utf8'),b0=fs.readFileSync(B+f,'utf8');let ran=0,eq=0,txt=0,diff=[];
  for(const Rn of runs){const a=await run(a0,Rn,IN),b=await run(b0,Rn,IN);if(a.startsWith('ERR')&&b.startsWith('ERR')&&a===b)continue;ran++;if(a===b){eq++;continue;}const bb=back(b);if(bb===a||canon(bb)===canon(a)){txt++;continue;}diff.push(Rn);}
  R+=ran;E+=eq;X+=txt;T(!diff.length,n+': '+ran+' runs, '+eq+' byte-equal, '+txt+' differ only in rule text'+(diff.length?', OTHER CHANGE in '+diff.join(' '):''));}
 log('replay: '+R+' node runs, '+E+' byte-equal, '+X+' differ only in rule text');
 log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRTB/test_RTB4.txt',out.join('\n')+'\n');})();
