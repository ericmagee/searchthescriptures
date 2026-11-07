// pkgKSP replay: the 5 KSC nodes, base vs patched, on every saved run from 33218 (incl. 33411). Prints each differing node run with the E-KSC items gained/lost.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s46.json';const plan=JSON.parse(rd('pkgKSP/patched.plan.json'));const nm=f=>f.replace(/\.js$/,'').replace(/_/g,' ');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^33[2-9]\d\d_Panel_Cure_Check\.json$/.test(f)).map(f=>f.slice(0,5)))].sort();
const run=(R,src,IN)=>{try{return Promise.resolve(harness(R)('return (async()=>{'+src+'\n})()',IN)).then(r=>'OUT '+JSON.stringify(r),e=>'ERR '+String(e&&e.message||e));}catch(e){return Promise.resolve('ERR '+String(e&&e.message||e));}};
const ksc=s=>(s.match(/E-KSC[^"\\]{0,60}/g)||[]).length;
(async()=>{let n=0,same=0;for(const R of runs)for(const f of Object.keys(plan)){let IN;try{IN=feeder(F,nm(f))[0];}catch(e){IN=feeder('/mnt/project-files/wall2024/fetchback_live_s45.json',nm(f))[0];}
 const a=await run(R,rd('pkgKSP/base_s46/'+f),IN),b=await run(R,rd('pkgKSP/patched/'+f),IN);n++;if(a===b){same++;continue;}
 let k=0;while(k<a.length&&a[k]===b[k])k++;console.log(R+' '+nm(f)+': differs; E-KSC mentions base '+ksc(a)+', patched '+ksc(b)+(a.startsWith('ERR')||b.startsWith('ERR')?' | '+a.slice(0,120)+' | '+b.slice(0,120):'')+'\n   base:    '+a.slice(Math.max(0,k-200),k+160)+'\n   patched: '+b.slice(Math.max(0,k-200),k+160));}
 console.log(runs.length+' runs x '+Object.keys(plan).length+' nodes = '+n+' node runs; identical '+same+', differ '+(n-same));})();
