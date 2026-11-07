// pkgKWT replay: each of the 19 K-W nodes, pkgLIB v6 full source vs pkgKWT, on every saved run from 33218 (incl. 33411); prints each differing node run.
// Prints each node run whose output differs, with the first differing text, so every change can be checked by eye.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s45.json';const plan=JSON.parse(rd('pkgKWT/patched.plan.json'));const nm=f=>f.replace(/\.js$/,'').replace(/_/g,' ');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33[2-9]\d\d_Panel_Cure_Check\.json$/.test(f)).map(f=>f.slice(0,5)))].sort();
const run=(R,src,IN)=>{try{return Promise.resolve(harness(R)('return (async()=>{'+src+'\n})()',IN)).then(r=>'OUT '+JSON.stringify(r),e=>'ERR '+String(e&&e.message||e));}catch(e){return Promise.resolve('ERR '+String(e&&e.message||e));}};
(async()=>{let n=0,same=0;const dif=[];for(const R of runs)for(const f of Object.keys(plan)){const IN=feeder(F,nm(f))[0];
 const a=await run(R,rd('pkgKWT/base_v6/'+f),IN),b=await run(R,rd('pkgKWT/patched/'+f),IN);n++;if(a===b){same++;continue;}
 let k=0;while(k<a.length&&a[k]===b[k])k++;dif.push(R+' '+nm(f)+': differs at '+k+'\n   base:    '+a.slice(Math.max(0,k-160),k+140)+'\n   patched: '+b.slice(Math.max(0,k-160),k+140));}
 dif.forEach(x=>console.log(x));console.log(runs.length+' runs ('+runs.join(' ')+') x '+Object.keys(plan).length+' nodes = '+n+' node runs; identical '+same+', differ '+(n-same));})();
