// R5 wrong-if, revision 5 (BB-7120 item 3): per execution (exec_id), exactly 3 rows. A row is a SEATED result when its model is that
// run's qualify id and its seat is <altkey>_qN. A row that is the panel's own body is a CUT-OFF result only when the run's
// alternates_tried (supplied by the reader of the run) records that seat NOT SEATED with finish_reason "length". Anything else fires:
// a row with no such record, a NOT SEATED record for another reason, a NULL model, a wrong row count, no rows.
// Usage: node qualify_wrongif5.cjs <input.json>
// input: {rows:[{exec_id, qualify, judge_api_model, judge_seat}], tried:[{exec_id, removed_seat, result, finish_reason}]}
const SEAT={'minimax/minimax-m3.1-flash':'alt_minimax31','minimax/minimax-m3':'alt_minimax3'};
const I=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const rows=I.rows||[],tried=I.tried||[];const g={};
rows.forEach(r=>(g[r.exec_id]=g[r.exec_id]||[]).push(r));
const fired=rows.length?[]:['no rows'];const out=[];
for(const [e,rs] of Object.entries(g)){const q=rs[0].qualify;let seated=0,cut=0;
 if(rs.length!==3)fired.push(e+': '+rs.length+' rows, not 3');
 for(const r of rs){
  if(r.judge_api_model===q&&String(r.judge_seat||'').startsWith(SEAT[q]+'_q')){seated++;continue;}
  if(r.judge_api_model===q){fired.push(e+': seat '+r.judge_seat+' is not '+SEAT[q]+'_qN');continue;}
  const t=tried.find(x=>x.exec_id===e&&x.removed_seat===r.judge_seat&&x.result==='NOT SEATED');
  if(r.judge_api_model&&t&&t.finish_reason==='length'){cut++;continue;}
  fired.push(e+': row model '+r.judge_api_model+' (seat '+r.judge_seat+') is not '+q+(t?' and its NOT SEATED record is finish_reason '+t.finish_reason+', not length':' and no NOT SEATED record covers it'));}
 out.push(e+': seated '+seated+', cut off '+cut);}
console.log(fired.length?'FIRED: '+fired.join(' | '):'SILENT ('+out.join('; ')+')');
