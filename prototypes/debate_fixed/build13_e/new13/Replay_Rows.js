// DRY REPLAY (operator ruling, Worker_A3 thread, 2026-10-10): the three judgments of a dry regrade go to debate_replay_judgments only.
const S=$('Init Seats').first().json;const P=$('Alternate Merge').first().json;const RT=' run_token='+S.run_token;
if(S.dry!==true)throw new Error('FAIL-CLOSED: Replay Rows reached on a run that is not a dry regrade.'+RT);
const rows=P.bodies.map(b=>{const p=JSON.parse(b).payload;const raw=String(p.verdict_raw||'');
 const m=raw.match(/RESULT:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/);const x=raw.match(/EXCLUSIVITY:\s*D[^\n\\]*/);
 return {...p,run_token:S.run_token,rulebook:S.rulebook,exec_id:String($execution.id),result_line:m?m[1]:null,exclusivity_line:x?x[0].slice(0,300):null};});
if(rows.length!==3)throw new Error('FAIL-CLOSED: Replay Rows built '+rows.length+' rows, expected 3.'+RT);
return [{json:{body:JSON.stringify({p_rows:rows})}}];
