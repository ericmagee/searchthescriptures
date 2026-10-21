// R5 wrong-if (revision 3): a qualify run's replay rows must be the qualified model's own rulings. For each exec_id group
// (one execution; a debate's run_token is shared by every run on that debate, BB-7095):
// exactly 3 rows, every row's judge_api_model equals that run's qualify id and its judge_seat starts with that alternate's seat key.
// Fires on any other model (the panel's own judges stored because the alternate was refused or skipped), a NULL model, a wrong
// row count, or no rows. Usage: node qualify_wrongif.cjs <rows.json> ; rows: [{exec_id, run_token, qualify, judge_api_model, judge_seat}],
// qualify taken from each execution's run body (the table has no qualify column)
const SEAT={'minimax/minimax-m3.1-flash':'alt_minimax31','minimax/minimax-m3':'alt_minimax3'};
const rows=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const g={};rows.forEach(r=>(g[r.exec_id]=g[r.exec_id]||[]).push(r));
const fired=rows.length?[]:['no rows'];
for(const [t,rs] of Object.entries(g)){const q=rs[0].qualify;
 if(rs.length!==3)fired.push(t+': '+rs.length+' rows, not 3');
 for(const r of rs){if(r.judge_api_model!==q)fired.push(t+': row model '+r.judge_api_model+' is not the qualify id '+q);
  else if(!String(r.judge_seat||'').startsWith(SEAT[q]+'_q'))fired.push(t+': seat '+r.judge_seat+' is not '+SEAT[q]+'_qN');}}
console.log(fired.length?'FIRED: '+fired.join(' | '):'SILENT ('+Object.keys(g).length+' execution(s))');
