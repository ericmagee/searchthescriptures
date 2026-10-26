const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const r=$input.first().json||{};if(r.recorded!==true||!r.id)throw new Error('ORACLE_DEBATE_V1: record_debate_row did not return a recorded id: '+JSON.stringify(r).slice(0,300)+RT);
$execution.customData.set('debate_id',String(r.id));return [{json:{run_token:TOK,debate_id:r.id}}];
