// pkgRTB family 3 test ("unanswered": the PRESSED cure). Run from wall2024/: node pkgRTB/test_RTB3.cjs
// 1 Conformance, against the library's own reader and checks:
//   a the PR example is read by P.PRESSED as a cure line ("|" form) and its round is one CURE_PRESS allows against the side that holds D2;
//   b the hand-kept K-G1 round list in the cure ask equals CURE_PRESS as rendered by the table;
//   c the RXM word count equals the K-G4 meaning-break check's own threshold (the "<N" in its quotation test);
//   d no old copy is left; every render appears as often as the build tally says.
// 2 Replay: every library node (base strip vs dest strip) and every prompt node (target vs pkgRTB/patched3) on every saved run must be
//   byte-equal once each render is put back to its old text.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const {PR,RXM}=require('./rule_table.cjs');let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const plan=JSON.parse(fs.readFileSync('pkgRTB/plan_RTB3.json','utf8'));PR.bind(plan.cure_press);const SUBS=require('./build_RTB3_subs.cjs')();
const A=plan.library.base,B=(process.argv[2]||'pkgLIB/strip_RTB3').replace(/\/$/,'')+'/patched/';
const L=fs.readFileSync(B+'Panel_Cure_Build_1.js','utf8');
// 1a
{const RL=eval('(function(){'+L.slice(L.indexOf('const __RL=(function(){'),L.indexOf('})();',L.indexOf('const __RL=(function(){'))+5)+';return __RL;})()');
 const r=RL.readLine(PR.example);const f=r&&r.f||{};
 T(r&&r.form==='PRESSED'&&f.kind==='cure'&&f.sep==='|'&&/^D2 vs C1$/i.test(f.pair)&&typeof f.quote==='string'&&f.quote.split(/\s+/).length>=3,'PR example read by P.PRESSED as a cure line: '+JSON.stringify(f));
 const cp=eval('('+L.match(/CURE_PRESS=(\{DEFENDER:\[[^\]]*\],CHALLENGER:\[[^\]]*\]\})/)[1]+')');
 T(cp.DEFENDER.includes(f.round)&&/^(DR1|DR2|CR1|CR2|CR3)$/.test(f.round),'PR example round ['+f.round+'] presses the defender (CURE_PRESS '+JSON.stringify(cp)+') and passes the cureLines round filter');}
// 1b
{const want='(against the defender: '+PR.rounds.DEFENDER.map(x=>'['+x+']').join(' or ')+'; against the challenger: '+PR.rounds.CHALLENGER.slice(0,-1).map(x=>'['+x+']').join(', ')+' or ['+PR.rounds.CHALLENGER.slice(-1)[0]+'])';
 let n=0,m=0;for(const f of fs.readdirSync(B)){const s=fs.readFileSync(B+f,'utf8');if(s.includes('K-G1 (a conceded count of 0')){n++;if(s.includes('that pressed the witness '+want))m++;}}
 T(n>0&&n===m,'K-G1 round list equals CURE_PRESS in '+m+' of '+n+' cure nodes: '+want);}
// 1c
{const k=L.indexOf("if(x.rule==='K-G4')");const seg=L.slice(k,k+3000);const th=(seg.match(/split\(\/\\s\+\/\)\.length<(\d+)\)continue/)||[])[1];
 T(th&&RXM.render.clause().includes(th+' or more words'),'RXM says '+th+' or more words, the K-G4 meaning-break check threshold ('+th+')');}
// 1d
const files=[...fs.readdirSync(B).map(f=>B+f),...fs.readdirSync('pkgRTB/patched3').map(f=>'pkgRTB/patched3/'+f)];
const cnt=(s,t)=>s.split(t).length-1;const all=[...SUBS.library,...SUBS.prompt];const tags=[...new Set(all.map(x=>x[0]))];
{let left=0;for(const p of files){const s=fs.readFileSync(p,'utf8');for(const [t,o,nw] of all)if(!nw.includes(o)&&s.includes(o)){left++;log('     old copy left: '+p+' :: '+t);}
  for(const [t,o,nw] of all)if(nw.includes(o)&&cnt(s,o)!==cnt(s,nw)){left++;log('     old copy left (unextended): '+p+' :: '+t);}}
 T(left===0,'no old copy left in '+files.length+' files');
 const have={};for(const t of tags){const nw=all.find(x=>x[0]===t)[2];have[t]=files.reduce((a,p)=>a+cnt(fs.readFileSync(p,'utf8'),nw),0);}
 T(tags.every(t=>have[t]===plan.tally[t]),'render counts '+JSON.stringify(have)+' = tally '+JSON.stringify(plan.tally));}
// 2 replay
const PAIRS=all.map(([t,o,n])=>[n,o]).filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i);
const enc=s=>JSON.stringify(s).slice(1,-1);const back=s=>{for(const [n,o] of PAIRS)for(const [x,y] of [[enc(enc(n)),enc(enc(o))],[enc(n),enc(o)],[n,o]])s=s.split(x).join(y);return s;};
const canon=s=>s.replace(/\\+"/g,'"');
const norm=s=>s.replace(/"(at|ms|elapsed_ms|started_at|now)":\s*("[^"]*"|\d+)/g,'"$1":0');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d{5}_/.test(f)).map(f=>f.split('_')[0]))].sort();
const run=async(src,Rn,IN)=>{try{return 'OUT '+norm(JSON.stringify(await Promise.resolve(harness(Rn)('return (async()=>{'+src+'\n})()',IN))));}catch(e){return 'ERR '+String(e&&e.message||e).slice(0,120);}};
(async()=>{const jobs=[];for(const f of Object.keys(plan.library.nodes))jobs.push([f.replace(/\.js$/,'').replace(/_/g,' '),fs.readFileSync(A+f,'utf8'),fs.readFileSync(B+f,'utf8'),'/mnt/project-files/wall2024/fetchback_live_s61.json']);
 const W=JSON.parse(fs.readFileSync(plan.prompt.base,'utf8'));
 for(const n of Object.keys(plan.prompt.nodes))jobs.push([n,W.nodes.find(x=>x.name===n).parameters.jsCode,fs.readFileSync('pkgRTB/patched3/'+n.replace(/ /g,'_')+'.js','utf8'),'/mnt/project-files/wall2024/fetchback_live_s64.json']);
 let R=0,E=0,X=0;
 for(const [n,a0,b0,F] of jobs){let IN;try{IN=feeder(F,n)[0];}catch(e){log('SKIP '+n+': no feeder');continue;}
  let ran=0,eq=0,txt=0,diff=[];for(const Rn of runs){const a=await run(a0,Rn,IN),b=await run(b0,Rn,IN);if(a.startsWith('ERR')&&b.startsWith('ERR')&&a===b)continue;ran++;if(a===b){eq++;continue;}const bb=back(b);if(bb===a||canon(bb)===canon(a)){txt++;continue;}diff.push(Rn);}
  R+=ran;E+=eq;X+=txt;T(!diff.length,n+': '+ran+' runs, '+eq+' byte-equal, '+txt+' differ only in rule text'+(diff.length?', OTHER CHANGE in '+diff.join(' '):''));}
 log('replay: '+R+' node runs, '+E+' byte-equal, '+X+' differ only in rule text');
 log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRTB/test_RTB3.txt',out.join('\n')+'\n');})();
