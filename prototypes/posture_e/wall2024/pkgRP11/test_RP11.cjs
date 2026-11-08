// pkgRP11 test: each Judge Enforcer Build node, base vs patched, on every saved run; every output difference listed.
// Probe: how often the reader decided (counter on __ri11 hits) and that eaxHold's item key is read as no ANSWER CHECK form.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s65.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{c?ok++:bad++;log((c?'OK   ':'FAIL ')+m);};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
for(const N of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const A=W.nodes.find(n=>n.name===N).parameters.jsCode,B=fs.readFileSync('pkgRP11/patched/'+N.replace(/ /g,'_')+'.js','utf8');
 const P=B.replace("const __ri11=l=>{try{","globalThis.__ri11n=globalThis.__ri11n||0;const __ri11=l=>{const __x=__ri11q(l);if(__x)globalThis.__ri11n++;return __x;};const __ri11q=l=>{try{");
 const fd=feeder(F,N);const runs=fs.readdirSync(D).filter(f=>new RegExp('^\\d+_'+N.replace(/ /g,'_')+'\\.json$').test(f)).map(f=>f.split('_')[0]).sort();
 let n=0,same=0,err=0,hits=0;const diffs=[];
 for(const R of runs){let a,b;try{a=harness(R)(A,fd[0]);}catch(e){err++;log('   '+N+' '+R+': base throws ('+e.message.slice(0,80)+'), skipped');continue;}
  try{b=harness(R)(B,fd[0]);}catch(e){T(false,N+' '+R+': patched throws '+e.message);continue;}n++;
  globalThis.__ri11n=0;try{harness(R)(P,fd[0]);}catch(e){}hits+=globalThis.__ri11n||0;
  if(st(a)===st(b)){same++;continue;}
  const ia=(a[0]&&a[0].json&&a[0].json.ids)||[],ib=(b[0]&&b[0].json&&b[0].json.ids)||[];const k=x=>x.seat+'|'+x.rule+'|'+String(x.flagged_line||x.item).slice(0,120);
  const ka=new Set(ia.map(k)),kb=new Set(ib.map(k));diffs.push(R+': ids '+ka.size+' -> '+kb.size+'; added '+[...kb].filter(x=>!ka.has(x)).join(' || ')+'; removed '+[...ka].filter(x=>!kb.has(x)).join(' || '));}
 log(N+' (feeder '+fd.join(',')+'): '+n+' runs replayed, '+same+' byte-equal, '+diffs.length+' differ, '+err+' base-throw skipped; reader decided '+hits+' ANSWER CHECK reads');diffs.forEach(d=>log('   DIFF '+d));
 T(n>=10,N+': replay ran on '+n+' runs');T(hits>0,N+': reader path taken');}
// eaxHold probe: the engine's item key is not a judge line
{const B=fs.readFileSync('pkgRP11/patched/Judge_Enforcer_Build.js','utf8');const i=B.indexOf('const __RL=');const END='return module.exports;})();';const j=B.indexOf(END,i)+END.length;
 const RL=new Function(B.slice(i,j)+';return __RL;')();const r=RL.readLine('ANSWER CHECK Exodus 6:23 [CR3]');
 T(!(r&&r.form==='ANSWER CHECK'&&r.f&&r.f.grade),'eaxHold item key "ANSWER CHECK Exodus 6:23 [CR3]" is not read as an ANSWER CHECK line (form '+(r&&r.form)+'): no swap there');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRP11/test_RP11.txt',out.join('\n')+'\n');
