let PF = null; try { if ($('Panel Failure Note').isExecuted) PF = $('Panel Failure Note').first().json; } catch (e) { PF = null; }
// The transcript is saved in both places; the run is still marked failed so the panel failure shows in the execution list.
if (PF) throw new Error('ORACLE_DEBATE_V1: panel stage failed at node "' + PF.failed_node + '"; transcript saved to the database and to Drive with the failure noted. ' + String(PF.failed_msg).slice(0, 300) + ' run_token=' + $('Init Seats').first().json.run_token);
return $input.all();
