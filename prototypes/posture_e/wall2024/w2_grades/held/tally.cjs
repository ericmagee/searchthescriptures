const fs=require('fs');
for(const id of '34299 34626 34703 34726 34780'.split(' ')){const d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+id+'_full.json','utf8'));const rd=(d.data||d).resultData.runData;const r=rd['Judge Enforcer Record'];if(!r){console.log(id,'none');continue;}const j=r[0].data.main[0][0].json;
 const t=j.enf428&&j.enf428.tally||{};console.log(id,'E-COL',JSON.stringify(t['E-COL']),'| E-HOLD',JSON.stringify(t['E-HOLD']),'| verdicts',(j.summary||[]).map(s=>s.seat+':'+s.verdict_tag).join(' '));}
