// DRY REPLAY: the run ends here. No judgment, no outcome, no Drive file.
const S=$('Init Seats').first().json;const r=$input.first().json||{};
if(r.recorded!==true||r.n!==3)throw new Error('ORACLE_DEBATE_V1 DRY regrade: the replay write did not record 3 rows: '+JSON.stringify(r).slice(0,300)+' run_token='+S.run_token);
$execution.customData.set('replay','recorded 3 ('+S.rulebook+')');
return [{json:{run_token:S.run_token,rulebook:S.rulebook,replay_ids:r.ids}}];
