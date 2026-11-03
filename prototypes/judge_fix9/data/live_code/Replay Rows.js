// DRY REPLAY (operator ruling, Worker_A3 thread, 2026-10-10): the three judgments of a dry regrade go to debate_replay_judgments only.
const S=$('Init Seats').first().json;const P=S.accept_probe===true?null:$('Alternate Merge').first().json; /* judge_fix8 P3: the probe ends before the panel */const RT=' run_token='+S.run_token;
if(S.dry!==true)throw new Error('FAIL-CLOSED: Replay Rows reached on a run that is not a dry regrade.'+RT);
// judge_fix8 P: each row of a posture-protocol test carries its record after the judge's text (no schema change: the table's rulebook and
// verdict_tag columns are closed sets), fenced so the readers of the JSON and of the [AUDIT lines are not touched.
const __MODE=S.posture===true?'posture':S.accept_probe===true?'accept_probe':null;
const __REC=o=>'\n\n=== REPLAY RECORD (judge_fix8 P; written by the system, not the judge) ===\n'+JSON.stringify(o)+'\n=== END REPLAY RECORD ===';
const __ACC=s=>s?{status:s.status,role:s.role,api_model:s.api_model,first_status:s.first_status,faults:s.faults,return_status:s.return_status,return_faults:s.return_faults,lines:s.lines,first_text:s.first_text,return_text:s.return_text}:null;
if(__MODE==='accept_probe'){const A=$('Accept Final').first().json.acc;const RG=$('Regrade Load').first().json;const pan=A.seats.filter(x=>x.role==='panel');
 if(pan.length!==3)throw new Error('FAIL-CLOSED: Replay Rows (acceptance probe) found '+pan.length+' panel seats, expected 3.'+RT);const others=A.seats.filter(x=>x.role!=='panel').map(x=>({seat:x.seat,...__ACC(x)}));
 const rows=pan.map(x=>({debate_id:RG.debate_id,judge_seat:x.seat,judge_api_model:x.api_model,verdict_tag:null,defense_standing:null,challenge_standing:null,conceded_links:null,challenger_conceded_links:null,finish_reason:null,
  verdict_raw:'ACCEPTANCE PROBE (judge_fix8 P3): the acceptance turn only; no debate was judged. STATUS: '+x.status+'.\n\n'+(x.first_text||'(no reply)')+(x.return_text!=null?'\n\n--- returned once ---\n\n'+x.return_text:'')+__REC({mode:'accept_probe',seat:x.seat,acceptance:__ACC(x),reserve_and_alternates:others}),
  run_token:S.run_token,rulebook:S.rulebook,exec_id:String($execution.id),result_line:null,exclusivity_line:null}));
 return [{json:{body:JSON.stringify({p_rows:rows})}}];}
let __AF=null;try{if(__MODE==='posture')__AF=$('Accept Final').first().json.acc;}catch(e){__AF=null;}
const rows=P.bodies.map(b=>{const p=JSON.parse(b).payload;const raw=String(p.verdict_raw||'');
 const m=raw.match(/RESULT:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/);const x=raw.match(/EXCLUSIVITY:\s*D[^\n\\]*/);
 const rec=__MODE==='posture'?{mode:'posture',acceptance:__ACC(((__AF&&__AF.seats)||[]).find(x=>x.seat===p.judge_seat))}:null;
 return {...p,verdict_raw:rec?String(p.verdict_raw||'')+__REC(rec):p.verdict_raw,run_token:S.run_token,rulebook:S.rulebook,exec_id:String($execution.id),result_line:m?m[1]:null,exclusivity_line:x?x[0].slice(0,300):null};});
if(rows.length!==3)throw new Error('FAIL-CLOSED: Replay Rows built '+rows.length+' rows, expected 3.'+RT);
return [{json:{body:JSON.stringify({p_rows:rows})}}];
