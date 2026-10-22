// DRY REPLAY: terminal stop for a failed dry regrade. No judgment, outcome or Drive write follows.
const S=$('Init Seats').first().json;const PF=$('Panel Failure Note').first().json;
throw new Error('ORACLE_DEBATE_V1 DRY regrade failed at node "'+PF.failed_node+'"; no judgment or Drive write. '+String(PF.failed_msg).slice(0,300)+' run_token='+S.run_token);
