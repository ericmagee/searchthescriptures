// pkgECG replay: the three Payloads nodes on all 13 exports, live s148 vs package. Strips the new ecg fields, then compares;
// lists every item moved to ecg and the drv_uncured change per seat.
const fs=require('fs');const {LV,PK,run,mask}=require('./replay_nodes.cjs');
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='ecg'?undefined:v));
const dru=b=>{try{return JSON.parse(b).payload.drv_uncured;}catch(e){return null;}};
(async()=>{let tot=0,eq=0;
for(const f of fs.readdirSync('/mnt/project-files/wall2024').filter(f=>/^ex\d+_full\.json$/.test(f))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')).data.resultData.runData;
 for(const n of ['Panel Payloads','Alternate Payloads','R2 Alternate Payloads']){if(!rd[n])continue;const sc=rd[n][0].source[0];const inp=rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];
  const a=await run(LV,rd,n,inp),b=await run(PK,rd,n,inp);tot++;
  const moved=[];const seats=[];
  if(n==='Panel Payloads'){const A=a[0].json,B=b[0].json;(B.summary||[]).forEach((s,i)=>{(s.ecg||[]).forEach(x=>moved.push(s.seat+' '+x.rule+' '+x.link));const u0=dru(A.bodies[i]),u1=dru(B.bodies[i]);if(u0!==u1)seats.push(s.seat+' drv_uncured '+u0+'->'+u1);});}
  else b.forEach((x,i)=>{const r=x.json;(r.ecg||[]).forEach(y=>moved.push((r.alt&&r.alt.seat)+' '+y.rule+' '+y.link));const u0=a[i].json.body&&dru(a[i].json.body),u1=r.body&&dru(r.body);if(u0!==u1)seats.push((r.alt&&r.alt.seat)+' drv_uncured '+u0+'->'+u1);});
  // equal apart from ecg fields, the moved items and the drv_uncured figure
  const norm=(o,isPkg)=>mask(strip(o)).replace(/\\"drv_uncured\\":\d+/g,'U');
  const same=moved.length?null:(norm(a)===norm(b));if(same)eq++;
  if(!same)console.log(f.slice(2,7),n,'| moved:',moved.length?moved.join('; '):'none','|',seats.join('; ')||'no count change',same===false?'| OTHER DIFF':'');
 }}
console.log('payload node runs',tot,'equal apart from the ecg field',eq);})();
