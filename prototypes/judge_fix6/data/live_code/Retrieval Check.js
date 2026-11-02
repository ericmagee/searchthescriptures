const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// BB-4617 Q3 / BB-4668 G1: a retrieval ERROR stops the run here, before any engine call, when a seat is The Oracle.
// The retrieval node keeps W1's own setting (continueRegularOutput, alwaysOutputData), so its error arrives as an item.
const S=$('Init Seats').first().json;const items=$input.all().map(i=>i.json);const er=items.find(x=>x&&x.error);
let msg=null;if(er){const e=er.error;msg=(e&&(e.message||e.description))?String(e.message||e.description).slice(0,300):JSON.stringify(e).slice(0,300);}
if(er&&(S.defender.profile==='oracle'||S.challenger.profile==='oracle'))throw new Error('ORACLE_DEBATE_V1: held-conclusion retrieval (debate_arsenal) failed on a run with an Oracle seat; stopped before any engine call. '+msg+RT);
return [{json:{run_token:TOK,retrieval_error:msg,rows:items.filter(x=>x&&x.id!==undefined).length}}];
