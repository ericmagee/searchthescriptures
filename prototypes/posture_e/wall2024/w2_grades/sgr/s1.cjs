const fs=require('fs');
for(const r of ['33371','33490','33497']){const E=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r+'_full.json','utf8'));const rd=E.data.resultData.runData;
 for(const rec of ['Judge Enforcer Record','Alt Judge Enforcer Record']){if(!rd[rec])continue;const rows=rd[rec][0].data.main.flat()[0].json.enf428_rows||[];
  rows.filter(x=>x.rule==='E-SYN'&&/DISAGREE/.test(x.cure_reason||'')).forEach(x=>{console.log('##',r,rec,x.seat,x.item);console.log('LINE:',(x.flagged_line||'').slice(0,500));console.log('REASON:',(x.cure_reason||'').slice(0,700));
   const p=x.prompt_sent||'';const id=(x.item||'').match(/Y\d+/);const k=p.indexOf('ITEM '+(id?id[0]:'Y'));const t=k>=0?p.slice(k,p.indexOf('ANSWER ID',k)):'';console.log('LIST chars',t.length,'\n',t.slice(0,2500));});}}
