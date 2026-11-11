const K=JSON.parse(require('fs').readFileSync('keep.json','utf8'));const T=(s,n)=>String(s==null?'':s).replace(/\s+/g,' ').slice(0,n);
for(const [nm,key] of [['Judge Enforcer Record','enf428'],['Alt Judge Enforcer Record','enf428']]){const o=K[nm][0][key];console.log(nm,Object.keys(o).join(','),JSON.stringify(o.tally||'').slice(0,700));
 const rows=o.rows||o.items||[];console.log(' rows',rows.length,rows[0]?Object.keys(rows[0]).join(','):'');
 for(const r of rows){if(!/E-PREM/.test(r.rule||r.kind||'')||!/DISAGREE/i.test(JSON.stringify(r).slice(0,5000)))continue;const v=r.verdict||r.answer||'';if(!/DISAGREE/i.test(String(v)))continue;console.log('##',r.seat,T(r.item,150),'\n LINE:',T(r.line||r.flagged_line,600),'\n ENF:',T(r.why||r.sentence||r.reason||r.reply,900));}}
