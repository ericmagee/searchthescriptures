const fs=require('fs');const W='/mnt/project-files/wall2024/';
for(const id of ['34299','34626','34703','34726','34780']){const d=JSON.parse(fs.readFileSync(W+'ex'+id+'_full.json','utf8'));const rd=(d.data&&d.data.resultData&&d.data.resultData.runData)||(d.resultData&&d.resultData.runData);
 for(const n of ['Judge Contradiction Record','Close Enforcer Record']){const r=rd[n];if(!r)continue;const j=r[0].data.main[0][0].json;const x=j.jcc||j.cec;
  console.log('\n#',id,n,'| model',x.model,'| skipped',JSON.stringify(x.skipped),'| none',JSON.stringify(x.none).slice(0,100),'| no_answer',JSON.stringify(x.no_answer).slice(0,100),'| errors',JSON.stringify(x.errors).slice(0,100));
  for(const row of (x.rows||[]))console.log('  ROW',JSON.stringify(row).slice(0,700));}}
