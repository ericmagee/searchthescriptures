const fs=require('fs');
const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').toLowerCase().replace(/[‘’]/g,"'").replace(/'s\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const VP4N0=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const OLD=eval('(()=>{'+fs.readFileSync(__dirname+'/old_vp524.js','utf8')+';return vp524Verses;})()');
const NEW=eval('(()=>{'+fs.readFileSync(__dirname+'/new_vp524.js','utf8')+';return vp524Verses;})()');
const R=f=>fs.readFileSync(__dirname+'/../inputs/'+f+'.txt','utf8');
const keeps=JSON.parse(fs.readFileSync(__dirname+'/../inputs/keeps43103.json','utf8'));
for(const [lab,F] of [['OLD',OLD],['NEW',NEW]]){
 const L={CHALLENGER:F([R('cr1'),R('cr2'),R('cr3')]).map(v=>v.w),DEFENDER:F([R('dr1'),R('dr2'),R('dr3')]).map(v=>v.w)};
 for(const k of keeps){const V=' '+L[k.side].map(N).join(' | ')+' ';const qs=[...String(k.why).matchAll(/["“]([^"”]{2,})["”]/g)].map(m=>m[1]);
  const hit=qs.find(q=>{const n=N(q);return n.split(' ').length>=4&&V.includes(' '+n+' ');});
  console.log(lab,k.id,k.seat,k.item,hit?'CURED: "'+hit.slice(0,70)+'"':'UNCURED');}}
