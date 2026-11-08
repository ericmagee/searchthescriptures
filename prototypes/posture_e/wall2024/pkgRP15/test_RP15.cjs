// pkgRP15 test: Format Markdown and Build Save Body, base vs patched, on every saved run; every output difference listed.
// Probe: how often the reader decided (counter on __rl15 calls).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s66.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
let ok=0,bad=0;const out=[];const log=s=>{out.push(s);console.log(s);};const T=(c,m)=>{c?ok++:bad++;log((c?'OK   ':'FAIL ')+m);};
const st=x=>JSON.stringify(x,(k,v)=>k==='at'?undefined:v);const fn=n=>n.replace(/[ ?]/g,'_');
for(const N of ['Format Markdown','Build Save Body']){
 const A=W.nodes.find(n=>n.name===N).parameters.jsCode,B=fs.readFileSync('pkgRP15/patched/'+fn(N)+'.js','utf8');
 const P=B.split("const __rl15=l=>{").join("globalThis.__rl15n=globalThis.__rl15n||0;const __rl15=l=>{const __x=__rl15q(l);if(__x)globalThis.__rl15n++;return __x;};const __rl15q=l=>{");
 let fd;try{fd=feeder(F,N);}catch(e){T(false,N+': no feeder '+e.message);continue;}
 const runs=fs.readdirSync(D).filter(f=>new RegExp('^\\d+_'+fn(N)+'\\.json$').test(f)).map(f=>f.split('_')[0]).sort();
 let n=0,same=0,err=0,hits=0;const diffs=[];
 for(const R of runs){let a,b;try{a=harness(R)(A,fd[0]);}catch(e){err++;continue;}
  try{b=harness(R)(B,fd[0]);}catch(e){T(false,N+' '+R+': patched throws '+e.message);continue;}n++;
  globalThis.__rl15n=0;try{harness(R)(P,fd[0]);}catch(e){}hits+=globalThis.__rl15n||0;
  if(st(a)===st(b)){same++;continue;}const sa=st(a),sb=st(b);let k=0;while(sa[k]===sb[k])k++;diffs.push(R+': at '+k+'\n      A: '+sa.slice(Math.max(0,k-160),k+160)+'\n      B: '+sb.slice(Math.max(0,k-160),k+160));}
 log(N+' (feeder '+fd.join(',')+'): '+n+' runs replayed, '+same+' byte-equal, '+diffs.length+' differ, '+err+' base-throw skipped; reader read '+hits+' lines');diffs.forEach(d=>log('   DIFF '+d));
 T(n>=10,N+': replay ran on '+n+' runs');if(/^Alt /.test(N)&&hits===0)log('     '+N+': the reader path was not reached on the saved runs (no case with a fanned-out bare id); the patch text is the same as the main node, which is exercised');else T(hits>0,N+': reader path taken');}
log('TOTAL '+ok+' OK, '+bad+' FAIL');fs.writeFileSync('pkgRP15/test_RP15.txt',out.join('\n')+'\n');
