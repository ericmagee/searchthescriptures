// W3 combined replay: every library node, every saved run, base strip vs new strip (full sources), live s61 feeders.
// Usage (from wall2024/): node pkgLIB/w3_combined_replay.cjs <baseStripDir> <newStripDir>
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const [A,B]=process.argv.slice(2);const F='/mnt/project-files/wall2024/fetchback_live_s61.json';
const files=fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js'));
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Cure_Check\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const norm=s=>s.replace(/"(at|ms|elapsed_ms|started_at|now)":\s*("[^"]*"|\d+)/g,'"$1":0');
(async()=>{const byNode={};let n=0,same=0,both=0;
for(const f of files){const name=f.replace(/\.js$/,'').replace(/_/g,' ');let IN;try{IN=feeder(F,name)[0];}catch(e){console.log('NO FEEDER '+name);continue;}
 const a0=fs.readFileSync(A+'/patched/'+f,'utf8'),b0=fs.readFileSync(B+'/patched/'+f,'utf8');
 for(const R of runs){n++;const run=async src=>{try{const r=await Promise.resolve(harness(R)('return (async()=>{'+src+'\n})()',IN));return 'OUT '+norm(JSON.stringify(r));}catch(e){return 'ERR '+String(e&&e.message||e).slice(0,120);}};
  if(a0===b0){same++;continue;}const a=await run(a0),b=await run(b0);if(a===b){same++;continue;}
  if(a.startsWith('ERR')&&b.startsWith('ERR')){both++;continue;}
  (byNode[name]=byNode[name]||[]).push(R+(a.startsWith('ERR')?'(base ERR)':'')+(b.startsWith('ERR')?'(NEW ERR '+b.slice(4,60)+')':''));}}
for(const k of Object.keys(byNode))console.log(k+': '+byNode[k].length+' runs: '+byNode[k].join(' '));
console.log('node runs '+n+', identical '+same+', both-error '+both);})();
