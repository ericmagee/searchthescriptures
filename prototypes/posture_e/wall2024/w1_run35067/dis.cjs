// W1 run 35067: the E-ANS DISAGREE rows, matched to their item by pressed verse, round and seat; whether the item carried FULL and OTHER LINES (record only).
const fs=require('fs');const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;
const r=rd['Judge Enforcer Record'][0].data.main[0][0].json;
const st=rd['Judge Enforcer Build'][0].data.main[0].map(x=>x.json);const items=[];for(const c of st){const b=c.body.messages.map(x=>x.content).join('\n');for(const t of b.split(/(?=ITEM [A-Z]+\d+ \()/))if(/^ITEM B\d+ \(E-ANS/.test(t))items.push(t);}
for(const row of r.enf428_rows.filter(x=>x.rule==='E-ANS'&&/^ENFORCER DISAGREE/.test(x.cure_reason||''))){const m=row.item.match(/ANSWER CHECK (.+) \[([A-Z]+\d)\]$/);
 const hits=items.filter(t=>t.includes('PRESSED VERSE: '+m[1]+'\n')&&t.includes('this in ['+m[2]+']')&&new RegExp('\\('+row.seat+'\\): '+row.response_line.slice(0,30).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).test(t));
 for(const t of hits)console.log(row.seat,t.match(/^ITEM (B\d+)/)[1],row.item,'| FULL',/THE ANSWER IN FULL/.test(t),'| OTHER LINES',/THE SIDE'S OTHER LINES/.test(t),'| judge',row.response_line.split(' ')[0],'-> right',row.cure_reason.match(/right: ([A-Z ]+)\)/)[1]);
 if(!hits.length)console.log(row.seat,'NO ITEM MATCH',row.item);}
