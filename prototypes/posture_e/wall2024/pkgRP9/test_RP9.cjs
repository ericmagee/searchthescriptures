// pkgRP9 test: each Judge Enforcer Build node, base (pkgRP11/patched) vs patched, on every saved run; every output difference listed with the
// FORCED line behind it. Probe: how often the reader decided a FORCED read (counter on __ri9).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
(async()=>{const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s64.json';const BASE=(process.argv[3]||'pkgRP11/patched').replace(/\/$/,'')+'/';
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{c?ok++:bad++;log((c?'OK   ':'FAIL ')+m);};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);
for(const N of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const f=N.replace(/ /g,'_')+'.js';const A=fs.readFileSync(BASE+f,'utf8'),B=fs.readFileSync('pkgRP9/patched/'+f,'utf8');
 const P=B.replace("const __ri9=l=>{try{","globalThis.__ri9n=globalThis.__ri9n||0;const __ri9=l=>{const __x=__ri9q(l);if(__x)globalThis.__ri9n++;return __x;};const __ri9q=l=>{try{");
 if(P===B)throw new Error('probe anchor');
 const fd=feeder(F,N);const runs=fs.readdirSync(D).filter(x=>new RegExp('^\\d+_'+N.replace(/ /g,'_')+'\\.json$').test(x)).map(x=>x.split('_')[0]).sort();
 let n=0,same=0,err=0,hits=0;const diffs=[];
 for(const R of runs){let a,b;try{a=await harness(R)(A,fd[0]);}catch(e){err++;log('   '+N+' '+R+': base throws ('+e.message.slice(0,80)+'), skipped');continue;}
  try{b=await harness(R)(B,fd[0]);}catch(e){T(false,N+' '+R+': patched throws '+e.message);continue;}n++;
  globalThis.__ri9n=0;try{await harness(R)(P,fd[0]);}catch(e){}hits+=globalThis.__ri9n||0;
  const sa=st(a),sb=st(b);if(sa===sb){same++;continue;}
  let i=0;while(sa[i]===sb[i])i++;diffs.push(R+' at '+i+'\n      base: '+sa.slice(Math.max(0,i-200),i+250)+'\n      new : '+sb.slice(Math.max(0,i-200),i+250));}
 log(N+' (feeder '+fd.join(',')+'): '+n+' runs replayed, '+same+' byte-equal, '+diffs.length+' differ, '+err+' base-throw skipped; reader decided '+hits+' FORCED reads');diffs.forEach(d=>log('   DIFF '+d));
 T(n>=10,N+': replay ran on '+n+' runs');T(hits>0,N+': reader path taken');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRP9/test_RP9.txt',out.join('\n')+'\n');})();
