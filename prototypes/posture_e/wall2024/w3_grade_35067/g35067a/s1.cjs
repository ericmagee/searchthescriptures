const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
console.log(Object.keys(j));
const d=j.data||j; console.log(Object.keys(d));
const top=['id','startedAt','stoppedAt','status','workflowId','mode','finished'];
for(const k of top) if(j[k]!==undefined) console.log(k,j[k]);
console.log(Object.keys(j.workflowData||{}), (j.workflowData||{}).versionId);
const rd=(d.resultData||j.data.resultData).runData; const names=Object.keys(rd);
console.log('nodes',names.length, 'error', JSON.stringify((d.resultData||{}).error||null).slice(0,500));
let tot=0;
for(const n of names){const runs=rd[n];const errs=runs.filter(r=>r.error).length;console.log(n,runs.length,errs?('ERR '+errs):'',runs.reduce((a,r)=>a+(r.executionTime||0),0));}
