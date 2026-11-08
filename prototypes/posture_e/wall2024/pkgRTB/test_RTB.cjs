// pkgRTB test (D50 K-W). Run from wall2024/: node pkgRTB/test_RTB.cjs
// 1 Conformance: each table example passes its own cure reader and no other; no node keeps an old hand-kept K-W copy; every node holds the
//   table's render. 2 Replay: every library node (strip_RCD vs strip_RTB) and every prompt node (base vs pkgRTB/patched) on every saved run;
//   the outputs must be byte-equal once each rendered K-W string is put back to its old text (so only the K-W text moves; no cure or item changes).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const {KW}=require('./rule_table.cjs');let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{if(c){ok++;log('OK   '+m);}else{bad++;log('FAIL '+m);}};
const plan=JSON.parse(fs.readFileSync('pkgRTB/plan_RTB.json','utf8'));const A='pkgLIB/strip_RCD/patched/',B='pkgLIB/strip_RTB/patched/';
// 1a readers, taken from the library source itself
const L=fs.readFileSync(B+'Panel_Cure_Build_1.js','utf8');const grab=k=>{const m=L.match(new RegExp('const '+k+'=(t=>[\\s\\S]*?\\.test\\((?:String\\(t\\)|t)\\));'));if(!m)throw new Error('reader '+k+' not found');return eval(m[1]);};
const R={kwSt:grab('kwSt'),kwCo:grab('kwCo'),kwRe:grab('kwRe'),KW_NH:t=>/^\s*NOT\s+HELD\b/i.test(t)&&/"[^"]{6,}"/.test(t)};
for(const f of KW.forms){const hits=Object.entries(R).filter(([k,fn])=>fn(f.example)).map(([k])=>k);T(hits.length===1&&hits[0]===f.reader,'form '+f.id+': example read by '+(hits.join(', ')||'none')+' (want '+f.reader+' only)');}
// 1b copies
const OLDS=['in one of three forms: STANDS WITHOUT IT','CONCEDED, or NOT HELD with a reason that quotes it','K-W is a TRIAL rule','REASSERTED IN <round> "<quote>"; or NOT HELD with a reason.'];
const files=[...fs.readdirSync(B).map(f=>B+f),...fs.readdirSync('pkgRTB/patched').map(f=>'pkgRTB/patched/'+f)];let left=0;for(const p of files){const s=fs.readFileSync(p,'utf8');for(const o of OLDS)if(s.includes(o)){left++;log('     old copy left: '+p+' :: '+o);}}
T(left===0,'no hand-kept K-W copy left in '+files.length+' files');
const cnt=(s,t)=>s.split(t).length-1;const want={agreement:0,audit:0,cureAsk:0,stake:0,enforcer:0};let have={agreement:0,audit:0,cureAsk:0,stake:0,enforcer:0};
for(const p of files){const s=fs.readFileSync(p,'utf8');have.agreement+=cnt(s,KW.render.agreement());have.audit+=cnt(s,KW.render.audit());have.cureAsk+=cnt(s,KW.render.cureAskTail());have.stake+=cnt(s,KW.stake(plan.library.kw_status));have.enforcer+=cnt(s,KW.render.enforcer());}
T(JSON.stringify(have)===JSON.stringify(plan.tally,Object.keys(have)),'rendered copies '+JSON.stringify(have)+' = build tally '+JSON.stringify(plan.tally));
// 2 replay
const rt=s=>s.replace(/\\"/g,'"').replace(/\\'/g,"'");const PAIRS=[[KW.render.agreement(),'For every withdrawal or concession the engine puts to me (K-W), I answer in one of three forms: STANDS WITHOUT IT because <layer>; CONCEDED; or REASSERTED IN <round> \\"<quote>\\", when a later round rests on what was withdrawn.'],
 [KW.render.audit(),'the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter).'],[KW.render.cureAskTail(),''],[KW.stake(plan.library.kw_status),'K-W is a TRIAL rule: an item left unanswered removes no seat.'],
 [KW.render.enforcer(),'STANDS WITHOUT IT because <a layer>; CONCEDED; REASSERTED IN <round> "<quote>"; or NOT HELD with a reason.']].map(([n,o])=>[rt(n),rt(o)]);
const enc=s=>JSON.stringify(s).slice(1,-1);const back=s=>{for(const [n,o] of PAIRS)for(const [x,y] of [[n,o],[enc(n),enc(o)],[enc(enc(n)),enc(enc(o))]])s=s.split(x).join(y);return s;};
const norm=s=>s.replace(/"(at|ms|elapsed_ms|started_at|now)":\s*("[^"]*"|\d+)/g,'"$1":0');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d{5}_/.test(f)).map(f=>f.split('_')[0]))].sort();
const run=async(src,Rn,IN)=>{try{return 'OUT '+norm(JSON.stringify(await Promise.resolve(harness(Rn)('return (async()=>{'+src+'\n})()',IN))));}catch(e){return 'ERR '+String(e&&e.message||e).slice(0,120);}};
(async()=>{const jobs=[];for(const f of Object.keys(plan.library.nodes))jobs.push([f.replace(/\.js$/,'').replace(/_/g,' '),fs.readFileSync(A+f,'utf8'),fs.readFileSync(B+f,'utf8'),'/mnt/project-files/wall2024/fetchback_live_s61.json']);
 const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s64.json','utf8'));
 for(const [n,p] of Object.entries(plan.prompt.nodes)){const b=p.base==='fetchback_live_s64'?W.nodes.find(x=>x.name===n).parameters.jsCode:fs.readFileSync(p.base+n.replace(/ /g,'_')+'.js','utf8');jobs.push([n,b,fs.readFileSync('pkgRTB/patched/'+n.replace(/ /g,'_')+'.js','utf8'),'/mnt/project-files/wall2024/fetchback_live_s64.json']);}
 for(const [n,a0,b0,F] of jobs){let IN;try{IN=feeder(F,n)[0];}catch(e){log('SKIP '+n+': no feeder');continue;}const rs=runs.filter(r=>fs.existsSync(D+r+'_'+n.replace(/ /g,'_')+'.json')||true);
  let ran=0,eq=0,txt=0,diff=[];for(const Rn of runs){const a=await run(a0,Rn,IN),b=await run(b0,Rn,IN);if(a.startsWith('ERR')&&b.startsWith('ERR')&&a===b)continue;ran++;if(a===b){eq++;continue;}if(back(b)===a){txt++;continue;}diff.push(Rn);}
  T(!diff.length,n+': '+ran+' runs, '+eq+' byte-equal, '+txt+' differ only in K-W text'+(diff.length?', OTHER CHANGE in '+diff.join(' '):''));}
 log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRTB/test_RTB.txt',out.join('\n')+'\n');})();
