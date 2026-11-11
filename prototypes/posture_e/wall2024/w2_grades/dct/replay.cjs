// W2 grade of pkgDCT: replay every Code node that ran in each stored export, live s126 effective source vs pkgDCT effective source; outputs must be byte-equal.
// A node whose live output differs between two live runs is reported as nondeterministic, not as a failure.
const fs=require('fs');const run=require(process.cwd()+'/pkgKSR/run_node.cjs');
const fn=n=>n.replace(/[^A-Za-z0-9]+/g,'_')+'.js';const D='w2_grades/dct/';const g=f=>{let d=JSON.parse(fs.readFileSync(f));d=d.data||d;return d.workflow||d;};
const W=g('/mnt/project-files/wall2024/fetchback_live_s126.json');const code=W.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string'&&n.name!=='Shared Library').map(n=>n.name);
const runs=fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort();
(async()=>{let tot=0,eq=0,diff=[],errBoth=0,errOne=[],nondet=[],changedRun=0;const ran=new Set();const okCh=new Set();
 for(const r of runs){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+r));const rd=(X.data||X).resultData.runData;
  for(const n of code){if(!rd[n])continue;const a=fs.readFileSync(D+'live/'+fn(n),'utf8'),b=fs.readFileSync(D+'trim/'+fn(n),'utf8');tot++;ran.add(n);if(a!==b)changedRun++;
   const S=o=>{if(o&&o.err)return JSON.stringify({err:o.err});return JSON.stringify(o);};const oa=S(await run(a,n,rd)),ob=a===b?oa:S(await run(b,n,rd));
   const ea=oa.startsWith('{"err"'),eb=ob.startsWith('{"err"');
   if(oa===ob){if(ea)errBoth++;else{eq++;if(a!==b)okCh.add(n);}continue;}
   const oa2=S(await run(a,n,rd));if(oa2!==oa){nondet.push(r+' '+n);continue;}
   if(ea!==eb)errOne.push(r+' '+n+' '+(ea?'live':'trim')+' errs: '+(ea?oa:ob).slice(0,160));else diff.push(r+' '+n);}}
 console.log('exports',runs.length,'| replays',tot,'(of them on a changed node',changedRun+')','| equal',eq,'| error in both',errBoth,'| differ',diff.length,'| error in one only',errOne.length,'| live nondeterministic',nondet.length);
 diff.forEach(x=>console.log('  DIFF',x));errOne.forEach(x=>console.log('  ERRONE',x));nondet.forEach(x=>console.log('  NONDET',x));
 const chg=code.filter(n=>fs.readFileSync(D+'live/'+fn(n),'utf8')!==fs.readFileSync(D+'trim/'+fn(n),'utf8'));const onlyErr=chg.filter(n=>ran.has(n)&&!okCh.has(n));console.log('changed nodes',chg.length,'| with at least one equal non-error replay',okCh.size,'| ran but erred in both on every export',onlyErr.length,onlyErr.join(', '));const never=code.filter(n=>!ran.has(n));const neverCh=never.filter(n=>fs.readFileSync(D+'live/'+fn(n),'utf8')!==fs.readFileSync(D+'trim/'+fn(n),'utf8'));console.log('Code nodes with no stored run:',never.length,'| of them changed by the trim:',neverCh.length,neverCh.join(', '));})();
