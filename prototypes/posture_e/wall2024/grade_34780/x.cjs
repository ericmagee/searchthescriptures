const fs=require('fs');const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34780_full.json','utf8'));const d=ex.data||ex;const r=d.resultData.runData;
const out=n=>{const runs=r[n];if(!runs)return null;const l=runs[runs.length-1];return l&&l.data&&l.data.main&&l.data.main[0]?l.data.main[0].map(x=>x.json):null;};
module.exports={r,out,d};
if(require.main===module){console.log('status',d.status||ex.status,'finished',d.stoppedAt||ex.stoppedAt,'nodes run',Object.keys(r).length,'lastNode',d.resultData.lastNodeExecuted,'error',d.resultData.error?JSON.stringify(d.resultData.error).slice(0,300):'none');
 const names=Object.keys(r);const pick=names.filter(n=>/Alternate|Alt |R2 |Gate|Send Back|Enforcer|Contradiction|QR |Outcome|Verdict|Final|Panel|Single|SJ |Save|Regrade/i.test(n));console.log(pick.map(n=>n+'('+r[n].length+')').join(', '));}
