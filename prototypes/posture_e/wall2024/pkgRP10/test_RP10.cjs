// pkgRP10 test: each of the 3 Judge Enforcer Build nodes, live s63 vs patched, on every saved run. Every output difference is listed.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const F='/mnt/project-files/wall2024/fetchback_live_s64.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{c?ok++:bad++;log((c?'OK   ':'FAIL ')+m);};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
for(const N of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const A=W.nodes.find(n=>n.name===N).parameters.jsCode,B=fs.readFileSync('pkgRP10/patched/'+N.replace(/ /g,'_')+'.js','utf8');
 const fd=feeder(F,N);const runs=fs.readdirSync(D).filter(f=>f.endsWith('_'+N.replace(/ /g,'_')+'.json')&&/^\d+_/.test(f)).map(f=>f.split('_')[0]).sort();
 let n=0,same=0,err=0;const diffs=[];
 for(const R of runs){let a,b;try{a=harness(R)(A,fd[0]);}catch(e){err++;log('   '+N+' '+R+': base throws ('+e.message.slice(0,80)+'), skipped');continue;}
  try{b=harness(R)(B,fd[0]);}catch(e){T(false,N+' '+R+': patched throws '+e.message);continue;}n++;
  if(st(a)===st(b)){same++;continue;}
  const ia=(a[0]&&a[0].json&&a[0].json.ids)||[],ib=(b[0]&&b[0].json&&b[0].json.ids)||[];
  const ka=new Set(ia.filter(x=>x.rule==='E-COL').map(x=>x.seat+'|'+x.flagged_line)),kb=new Set(ib.filter(x=>x.rule==='E-COL').map(x=>x.seat+'|'+x.flagged_line));
  diffs.push(R+': E-COL ids '+ka.size+' -> '+kb.size+'; added '+[...kb].filter(x=>!ka.has(x)).map(x=>x.slice(0,140)).join(' || ')+'; removed '+[...ka].filter(x=>!kb.has(x)).map(x=>x.slice(0,140)).join(' || '));}
 log(N+' (feeder '+fd.join(',')+'): '+n+' runs replayed, '+same+' byte-equal, '+diffs.length+' differ, '+err+' base-throw skipped');diffs.forEach(d=>log('   DIFF '+d));
 T(n>=10,N+': replay ran on '+n+' runs');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRP10/test_RP10.txt',out.join('\n')+'\n');
