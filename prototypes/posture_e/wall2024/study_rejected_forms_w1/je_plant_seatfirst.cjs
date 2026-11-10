// W1 plant: 33442 call 5 (P items, three seats each). Replace its reply with seat-first lines "ENFORCER: <seat> (P3) -- ..." where the three seats
// give different verdicts, and read what the live s108 Judge Enforcer Record records for P3.1, P3.2, P3.3.
const src=require('fs').readFileSync('study_rejected_forms_w1/je_replay.cjs','utf8').replace(/\(async\(\)=>\{for[\s\S]*$/,'');
eval(src+`
(async()=>{const r='33442';const C=cl(saved(r,'Judge Enforcer Call deepseek'));const B=saved(r,'Judge Enforcer Build');const ids=B[4].json.ids.filter(x=>/^P3\\./.test(x.id));
 console.log('P3 items',ids.map(x=>x.id+' '+x.seat+' '+x.rule).join('; '));
 const vs=(process.env.VS||'AGREE,DISAGREE,AGREE').split(',');const lines=ids.map((x,k)=>'ENFORCER: '+x.seat+' (P3) -- '+vs[k]+' -- RIGHT: SPARED -- planted line for '+x.seat+'.');
 const base=C[4].json.choices[0].message.content.split('\\n').filter(l=>!/^\\W*ENFORCER:\\s*P3\\b/.test(l));C[4].json.choices[0].message.content=base.concat(lines).join('\\n');
 cache[r+'|Judge Enforcer Call deepseek']=C;const o=await run(r,'Judge Enforcer Record','Judge Enforcer Call deepseek');const j=o[0].json;

 console.log('planted',lines.join(' | '));console.log('eid',JSON.stringify(j.enf428.eid),'errors',JSON.stringify(j.enf428.errors));
 console.log('E-PREM tally',JSON.stringify(j.enf428.tally['E-PREM']));})();`);
