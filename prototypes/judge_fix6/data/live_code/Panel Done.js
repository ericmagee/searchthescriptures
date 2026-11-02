const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// From the runner KXoI9 I8, plus the derive result. A failure here leaves the saved row ungraded; regrade path: the
// panel runner KXoI9Jz6R4qTJfIK pinned to this debate_id (stays disarmed until ruled), or derive_debate_outcome again.
const P=$('Alternate Merge').first().json;const S=$('Init Seats').first().json;const out=[];
['Write Judgment 1','Write Judgment 2','Write Judgment 3'].forEach((n,i)=>{const it=$(n).all();if(!it||it.length!==1)throw new Error('FAIL-CLOSED: '+n+' returned '+(it?it.length:0)+' items.'+RT);const r=it[0].json;
 if(!r||r.recorded!==true)throw new Error('FAIL-CLOSED: '+n+' recorded is not true: '+JSON.stringify(r).slice(0,300)+RT);
 if(r.operation!=='inserted')throw new Error('FAIL-CLOSED: '+n+' operation is "'+r.operation+'", not "inserted".'+RT);
 if(r.truncated!==false)throw new Error('FAIL-CLOSED: '+n+' truncated is '+JSON.stringify(r.truncated)+'; the write guard quarantined it.'+RT);
 out.push({seat:P.summary[i].seat,id:r.id});});
// PANEL FALLBACK (BB-5693): the substitution record must have been accepted before the judgments were written.
let RSB=null;try{RSB=$('Record Substitution').first().json;}catch(e){RSB=null;}
if(!RSB||RSB.ok!==true)throw new Error('FAIL-CLOSED: Record Substitution did not return ok: '+JSON.stringify(RSB).slice(0,300)+RT);
if(P.substitution&&RSB.written!==true)throw new Error('FAIL-CLOSED: a substitution was made but Record Substitution did not write it.'+RT);
// ALTERNATES (step 7): the seating record must have been accepted before the judgments were written.
let RAL=null;try{RAL=$('Record Alternates').first().json;}catch(e){RAL=null;}
if(!RAL||RAL.ok!==true)throw new Error('FAIL-CLOSED: Record Alternates did not return ok: '+JSON.stringify(RAL).slice(0,300)+RT);
if((P.alternates_seated||[]).length&&RAL.written!==true)throw new Error('FAIL-CLOSED: alternates were seated but Record Alternates did not write them.'+RT);
const d=$input.first().json||{};
if(d.written!==true)throw new Error('ORACLE_DEBATE_V1: derive_debate_outcome did not write: '+String(d.reason||JSON.stringify(d)).slice(0,300)+RT);
const jb=(d.judged_by||[]).slice().sort().join(',');const pe=P.panel_effective.slice().sort().join(',');
if(jb!==pe)throw new Error('ORACLE_DEBATE_V1: judged_by ['+jb+'] differs from panel_expected ['+pe+'].'+RT);
$execution.customData.set('outcome',String(d.outcome));
return [{json:{run_token:TOK,debate_id:P.debate_id,judgments:out,outcome:d.outcome,panel_verdict:d.panel_verdict,panel_split:d.panel_split,judged_by:d.judged_by,panel_expected:P.panel_effective,substitution:P.substitution}}];
