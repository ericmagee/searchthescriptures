// ASK 630 + ASK 631 build (W4), one stack on the panel-failure path. node b630.cjs base_eng.json out_target.json
// 630: Panel Failure Mark (RPC odv1_mark_panel_incomplete) marks the row with its cause (live, non-regrade).
// 631: Panel Failure Rows gathers what the failed panel holds; Failure Enforcer Log writes the enforcer rows
//      (record_enforcer_log, the same body form as Write Enforcer Log); Failure Judgments stores judge replies
//      with text in odv1_panel_incomplete_judgments, never counted.
// Chain: Dry Failed? (false) -> Panel Failure Mark -> Panel Failure Rows -> Failure Enforcer Log -> Failure Judgments -> Panel Tokens.
const fs=require('fs');const crypto=require('crypto');
const [,,BASE,OUT]=process.argv;const W=JSON.parse(fs.readFileSync(BASE,'utf8'));
const node=n=>{const x=W.nodes.find(y=>y.name===n);if(!x)throw new Error('no node '+n);return x;};
const NEW=['Panel Failure Mark','Panel Failure Rows','Failure Enforcer Log','Failure Judgments'];
NEW.forEach(n=>{if(W.nodes.some(y=>y.name===n))throw new Error('node exists: '+n);});
const uid=n=>{const h=crypto.createHash('md5').update('ASK630/631 '+n).digest('hex');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20,32);};
const WT=node('Write Tokens'),WEL=node('Write Enforcer Log');
const SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/';
const http=(name,fn,body,pos,tries)=>({parameters:{method:'POST',url:SB+fn,authentication:'predefinedCredentialType',nodeCredentialType:'supabaseApi',sendBody:true,specifyBody:'json',jsonBody:body,options:{}},
 id:uid(name),name,type:'n8n-nodes-base.httpRequest',typeVersion:4.3,retryOnFail:true,maxTries:tries,waitBetweenTries:3000,onError:'continueRegularOutput',position:pos,credentials:JSON.parse(JSON.stringify(WT.credentials))});
// 630
const MARK=http('Panel Failure Mark','odv1_mark_panel_incomplete',
"={{ { p_run_token: $('Init Seats').first().json.run_token, p_node: $('Panel Failure Note').first().json.failed_node, p_msg: $('Panel Failure Note').first().json.failed_msg, p_skip: $('Init Seats').first().json.regrade === true } }}",[12900,700],3);
// 631
const ROWS={parameters:{jsCode:[
"/* ASK 631: what a failed panel already holds, gathered for storing. Nothing here is counted. */",
"const ran=n=>{try{return $(n).isExecuted;}catch(e){return false;}}; /* ASK 631: the lookup form of Alternate Merge's __cecL */",
"const S=$('Init Seats').first().json;const PF=$('Panel Failure Note').first().json; /* ASK 631 */",
"const debate_id=ran('Check Save')?($('Check Save').first().json.debate_id||null):null; /* ASK 631 */",
"const done=n=>ran(n)&&PF.failed_node!==n; /* ASK 631: a node succeeded when it ran and is not the node that failed (the chain stops at the first failure) */",
"const enforcer_log=done('Write Enforcer Log')?[]:ran('Alternate Merge')?($('Alternate Merge').first().json.enforcer_log||[]):[['Close Enforcer Record','cec_log'],['Judge Contradiction Record','jcc_log'],['Assume Check Record','acx_log']].flatMap(([n,k])=>ran(n)?($(n).first().json[k]||[]):[]); /* ASK 631: never twice; the normal path's set when Alternate Merge ran */",
"const J=ran('Resolve Seats')?($('Resolve Seats').first().json.judges||[]):[];const RES=ran('Resolve Seats')?($('Resolve Seats').first().json.reserve||null):null; /* ASK 631 */",
"const judgments=[]; /* ASK 631 */",
"const take=(n,slot,seat)=>{if(!ran(n))return;const j=$(n).first().json||{};const c0=Array.isArray(j.choices)?j.choices[0]:null;const t=c0&&c0.message?c0.message.content:null;if(typeof t!=='string'||!t.trim())return;const u=j.usage||{};judgments.push({slot,judge_seat:seat?seat.seat:null,judge_api_model:seat?seat.api_model:(j.model||null),finish_reason:c0.finish_reason==null?null:String(c0.finish_reason),completion_tokens:u.completion_tokens==null?null:Number(u.completion_tokens),reply_text:t});}; /* ASK 631: a reply with judgment text only */",
"[1,2,3].forEach(k=>{if(!done('Write Judgment '+k))take('Panel Judge '+k+' openrouter',k,J[k-1]);}); /* ASK 631: each slot whose own Write Judgment did not succeed */",
"if(!done('Write Judgment 1'))take('Panel Reserve openrouter',null,RES); /* ASK 631: the reserve has no panel slot (slot null); stored only when no judgment was written */",
"return [{json:{debate_id,run_token:S.run_token,failed_node:PF.failed_node,enforcer_log,judgments}}]; /* ASK 631 */"
].join('\n')},id:uid('Panel Failure Rows'),name:'Panel Failure Rows',type:'n8n-nodes-base.code',typeVersion:2,onError:'continueRegularOutput',position:[13120,700]}; // a fault here never stops the tokens, the transcript or the error raise
const welBody=WEL.parameters.jsonBody;const SRC="$('Alternate Merge').first().json";
if(welBody.split(SRC).length!==2)throw new Error('Write Enforcer Log body source not found once');
const FEL=http('Failure Enforcer Log','record_enforcer_log',welBody.replace(SRC,()=>"$('Panel Failure Rows').first().json"),[13340,700],5);
const FJ=http('Failure Judgments','odv1_record_incomplete_panel',
"={{ { p_debate_id: $('Panel Failure Rows').first().json.debate_id, p_run_token: $('Panel Failure Rows').first().json.run_token, p_failed_node: $('Panel Failure Rows').first().json.failed_node, p_rows: $('Panel Failure Rows').first().json.judgments } }}",[13560,700],5);
W.nodes.push(MARK,ROWS,FEL,FJ);
// connections: Dry Failed? output 1 (false) was Panel Tokens
const C=W.connections;const df=C['Dry Failed?'].main;
if(!(df[1]&&df[1].length===1&&df[1][0].node==='Panel Tokens'))throw new Error('Dry Failed? false is not Panel Tokens alone: '+JSON.stringify(df[1]));
df[1]=[{node:'Panel Failure Mark',type:'main',index:0}];
const link=(a,b)=>{C[a]={main:[[{node:b,type:'main',index:0}]]};};
link('Panel Failure Mark','Panel Failure Rows');link('Panel Failure Rows','Failure Enforcer Log');link('Failure Enforcer Log','Failure Judgments');link('Failure Judgments','Panel Tokens');
fs.writeFileSync(OUT,JSON.stringify(W));console.log('wrote',OUT,'nodes',W.nodes.length);
