const fs=require('fs');const res={};
for(const fn of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+fn,'utf8')).data.resultData.runData;const seen=new Set();
 for(const n of ['Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record'])if(rd[n])for(const r of (rd[n][0].data.main.flat()[0].json.enf428_rows||[])){if(r.rule!=='E-PREM'||!/^ENFORCER (AGREE|DISAGREE)/.test(r.cure_reason||''))continue;const k=r.seat+r.flagged_line+r.item;if(seen.has(k))continue;seen.add(k);
  const p=r.prompt_sent||'';const it=(r.item||'');const pn=(it.match(/(\d+)\s*$/)||[])[1];const id=(p.match(/ITEM P\d+[^\n]*/g)||[]);
  // find the premise block text in the item for this premise
  const m=p.match(new RegExp('PREMISE '+pn+'[^\\n]*\\n([^\\n]*)','i'));const charge=(m?m[0]:'');const assumes=/ASSUMES\s*:/.test(charge);const dis=/^ENFORCER DISAGREE/.test(r.cure_reason);const rv=/right: VOID/.test(r.cure_reason);
  const key=(assumes?'ASSUMES':'other')+'|'+(dis?(rv?'DISAGREE->VOID':'DISAGREE other'):'AGREE');res[key]=(res[key]||0)+1;if(assumes&&rv)console.log(fn.slice(2,7),r.seat,it,'|',charge.slice(0,160).replace(/\n/g,' '));}}
console.log(res);
