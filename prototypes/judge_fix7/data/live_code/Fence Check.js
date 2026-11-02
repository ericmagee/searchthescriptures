// TOPIC FENCE (WALL-0788 replies 823-837): fail closed. The run continues only when the gate answered ok:true;
// a fenced topic without a valid one-use override, a gate error, or no answer stops the run here with the run token.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const r=$input.first().json||{};
if(r.ok!==true){const m=(typeof r.message==='string'&&r.message)?r.message:('the fence check gave no answer: '+JSON.stringify(r).slice(0,300));throw new Error('ORACLE_DEBATE_V1 topic fence: '+m+RT);}
if(r.fenced===true)$execution.customData.set('fence_override','used');
return [{json:{...S,fence:{fenced:r.fenced===true,override_reason:(typeof r.override_reason==='string')?r.override_reason:null}}}];
