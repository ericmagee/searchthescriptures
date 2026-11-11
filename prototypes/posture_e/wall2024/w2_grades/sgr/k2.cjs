const fs=require('fs');
for(const r of ['33149','33371','33490','34852','35173']){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r+'_full.json','utf8')).data.resultData.runData;
 for(const n of ['Judge Enforcer Record','Alt Judge Enforcer Record']){if(!rd[n])continue;const rows=(rd[n][0].data.main.flat()[0].json.enf428_rows||[]).filter(x=>x.rule==='E-ANS');const p=rows.map(x=>x.prompt_sent||'').join('\n');
  console.log(r,n,'E-ANS rows',rows.length,'| "THE ANSWER IN FULL"',(p.match(/THE ANSWER IN FULL/g)||[]).length,'| "OTHER LINES ON THIS VERSE"',(p.match(/OTHER LINES ON THIS VERSE/g)||[]).length);}}
// 34852 sol Matthew 1:25 item text
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8')).data.resultData.runData;const rows=rd['Judge Enforcer Record'][0].data.main.flat()[0].json.enf428_rows.filter(x=>x.rule==='E-ANS'&&x.seat==='sol'&&/Matthew 1:25 -- \[CR3\]/.test(x.flagged_line||''));
for(const x of rows.slice(0,1)){const p=x.prompt_sent||'';const k=p.indexOf('Matthew 1:25 -- [CR3]');const s=p.lastIndexOf('ITEM ',k);console.log(p.slice(s,s+2500));}
