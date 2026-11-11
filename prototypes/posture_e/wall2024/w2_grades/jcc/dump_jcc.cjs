// W2 study: Judge Contradiction / Close Enforcer records on stored executions
const fs=require('fs');const W='/mnt/project-files/wall2024/';
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f))){let d;try{d=JSON.parse(fs.readFileSync(W+f,'utf8'));}catch(e){console.log(f,'unreadable');continue;}
 const rd=(d.data&&d.data.resultData&&d.data.resultData.runData)||(d.resultData&&d.resultData.runData)||d.runData||(d.data&&d.data.runData);if(!rd){console.log(f,'no runData',Object.keys(d).slice(0,5));continue;}
 for(const n of ['Judge Contradiction Record','Close Enforcer Record']){const r=rd[n];if(!r){console.log(f,n,'not run');continue;}const j=r[0].data.main[0][0].json;const k=n.startsWith('Judge')?'jcc':'cec';const x=j[k]||j;
  console.log(f,n,'keys',Object.keys(x).join(','));console.log('  confirmed',JSON.stringify(x.confirmed||null).slice(0,600));}}
