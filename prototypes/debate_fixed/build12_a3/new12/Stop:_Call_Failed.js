const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// Every HTTP node's error output ends here, so a provider or database failure after Init carries the run token.
const e=($input.first().json||{}).error;const msg=(e&&(e.message||e.description))?String(e.message||'')+' '+String(e.description||''):JSON.stringify(e||{});
let node='unknown';try{node=$prevNode.name;}catch(x){}
throw new Error('ORACLE_DEBATE_V1: call failed at node "'+node+'": '+msg.slice(0,400)+RT);
