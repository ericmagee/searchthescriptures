// pkgERT (W2, 11-07; lane 1 DeepSeek fix for the run after 33490; spec W3 grade_33482 / Wall 2978). Run 33482: "Enforcer Call deepseek" (the K-W / K-S3
// DeepSeek check, one item) came back {"error":"aborted"} after 61 s with no retry, so its 67 checks were NO VERDICT.
// Fix: node settings only, matching Judge Enforcer Call deepseek: retryOnFail true, maxTries 3, waitBetweenTries 10000, on "Enforcer Call deepseek" and
// "Anticheat Call deepseek". onError (continueRegularOutput), parameters and credentials unchanged. No code change.
// Why a node retry works with onError continueRegularOutput (n8n 2.15.1 packages/core/src/execution-engine/workflow-execute.ts lines 1680-1702):
// after runNode, the engine sets nodeFailed = runNodeData.data[0][0].json.error !== undefined and re-runs the node (sleep waitBetweenTries) while it is
// set and tries remain. The HTTP node returns a failed request as {error} (HttpRequestV3.node.ts ~796-830), so item 0's error triggers the retry.
// Limit: only item 0 is looked at. Enforcer Call sends 1 item (every saved run), so it is fully covered; Anticheat Call sends 4-5 items, so an error on
// item 0 re-sends all of them, and an error on a later item alone is not retried.
// Base: live s50. Run from wall2024/: node pkgERT/build_ERT.cjs  -> pkgERT/patched.nodes.json (the two whole node objects as they should be written)
const fs=require('fs'),crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s50.json','utf8'));const SET={retryOnFail:true,maxTries:3,waitBetweenTries:10000};
const out={base:'fetchback_live_s50',settings:SET,nodes:[]};
for(const nm of ['Enforcer Call deepseek','Anticheat Call deepseek']){const n=W.nodes.find(z=>z.name===nm);if(!n)throw new Error('missing '+nm);if(n.retryOnFail)throw new Error(nm+' already retries');
 const p={...n,...SET};out.nodes.push({name:nm,id:n.id,before_sha:sha(JSON.stringify(n)),after_sha:sha(JSON.stringify(p)),node:p});console.log(nm,sha(JSON.stringify(n)),'->',sha(JSON.stringify(p)));}
fs.writeFileSync(__dirname+'/patched.nodes.json',JSON.stringify(out,null,1));
