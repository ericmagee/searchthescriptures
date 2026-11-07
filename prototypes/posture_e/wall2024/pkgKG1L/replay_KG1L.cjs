// pkgKG1L replay: base (pkgLIB v10 full source) vs patched, for each of the 6 nodes on every saved run that has the node's feeder saved.
// Prints each run whose output changes, with the gate verdict of each seat before and after.
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
const F='/mnt/project-files/wall2024/fetchback_live_s48.json';const plan=JSON.parse(rd('pkgKG1L/patched.plan.json'));const ONLY=process.argv[2];
(async()=>{let n=0,same=0;const ch=[];for(const f of Object.keys(plan)){const node=f.replace(/\.js$/,'').replace(/_/g,' ');const IN=feeder(F,node)[0];
 const runs=[...new Set(fs.readdirSync(D).filter(x=>/^33\d{3}_/.test(x)&&x.endsWith('_'+f.replace(/\.js$/,'')+'.json')).map(x=>x.slice(0,5)))].sort().filter(r=>!ONLY||r===ONLY);
 for(const R of runs){const run=async c=>{try{return JSON.stringify(await harness(R)('return (async()=>{'+c+'\n})()',IN));}catch(e){return 'ERR '+String(e&&e.message||e);}};
  const a=await run(rd('pkgKG1L/base_v10/'+f)),b=await run(rd('pkgKG1L/patched/'+f));n++;if(a===b)same++;else ch.push([R,node,a,b]);}}
 for(const [R,node,a,b] of ch){let i=0;while(a[i]===b[i])i++;console.log('CHANGED '+R+' '+node+' at '+i+'\n  a '+a.slice(Math.max(0,i-150),i+250)+'\n  b '+b.slice(Math.max(0,i-150),i+400));}
 console.log(n+' node runs, identical '+same+', changed '+ch.length);})();
