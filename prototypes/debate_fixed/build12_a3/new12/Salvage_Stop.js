// ORDER D (BB-6036): the salvage path ends here, so the run is still marked failed and the Error Handler still files debate_errors.
const F=$('Failure Salvage').first().json;let rec='not attempted (the save itself failed)';if(!F.save_failed){const r=($('Salvage Save').first().json)||{};rec=(r.recorded===true&&r.id)?('saved, id '+r.id+(r.existing?' (existing row)':'')):('NOT saved: '+JSON.stringify(r).slice(0,200));}
let drv='NOT saved';try{const g=$('Save Incomplete to Drive').first().json||{};drv=g.id?('saved, file '+g.id):('NOT saved: '+JSON.stringify(g).slice(0,200));}catch(x){drv='NOT saved';}
throw new Error('ORACLE_DEBATE_V1: call failed at node "'+F.failed_node+'": '+String(F.failed_msg).slice(0,300)+' | partial row: '+rec+' | Drive: '+drv+' run_token='+F.run_token);
