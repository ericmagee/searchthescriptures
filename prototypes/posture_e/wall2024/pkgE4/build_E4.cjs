// pkgE4 build (W2): earlier alternate start (Eric approved 12:03 CST 11-07). Run from wall2024/: node pkgE4/build_E4.cjs [live fetch] [Alternate Build stub]
// Output: pkgE4/out/main_nodes_new.json (5 new nodes), main_nodes_patched.json (edited nodes, full), plan_E4.json (connections, shas),
//         subworkflow_early_alternate.json (the sub-workflow), and e4.sql (DB part, separate file).
const fs=require('fs'),cr=require('crypto');const sha=s=>cr.createHash('sha256').update(String(s)).digest('hex').slice(0,12);
const F=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s61.json';const STUB=process.argv[3]||'pkgLIB_v24_RMR/patched/Alternate_Build.js';
const W=JSON.parse(fs.readFileSync(F,'utf8'));const byName=n=>W.nodes.find(x=>x.name===n);const OUT='pkgE4/out/';fs.mkdirSync(OUT,{recursive:true});
const once=(s,a,b,nm)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(nm+': anchor x'+k);return s.replace(a,()=>b);};
// a stable 16-hex hash in plain JS (the Code node has no crypto): two FNV-1a 32 passes with different seeds
const H="const __e4h=s=>{s=String(s);let a=0x811c9dc5,b=0x01000193^0x9e3779b9;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a^=c;a=Math.imul(a,0x01000193)>>>0;b^=c;b=Math.imul(b,0x01000193)>>>0;b^=b>>>13;}return a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');};";
const stub=fs.readFileSync(STUB,'utf8');
const __ACB=byName('Alternate Call openrouter').parameters.jsonBody;const CARRY=__ACB.slice('={{ '.length,__ACB.lastIndexOf('($json.alt.body)'));if(!/^\(__b=>\{/.test(CARRY))throw new Error('carry fn');
const RET="return await new Function('$','$input','return (async()=>{\\n'+__S+'\\n})();')($,$input);";
if(stub.split(RET).length!==2)throw new Error('stub return anchor');
// 1. Early Alternate Build: Alternate Build's own code, fed by Panel Cure Check (candidates = drv_uncured > 0 after the cure); keeps the calls only.
const EAB=stub.replace(RET,()=>H+"\nlet __R0=[];try{__R0=await new Function('$','$input','return (async()=>{\\n'+__S+'\\n})();')($,$input);}catch(e){return [];} /* pkgE4: same build as Alternate Build; any fault starts nothing */\n"
 +"const __tok=$('Init Seats').first().json.run_token;const __ex=String($execution.id);\n"
 +"const __carry="+CARRY+"; /* pkgE4 v2 (W3 3216): Alternate Call openrouter's own body expression, verbatim, so grok's acceptance turn gets its reasoning_details here, where the earlier nodes can be read */\n"
 +"return (__R0||[]).filter(x=>x&&x.json&&x.json.alt&&!x.json.alt.skip&&x.json.alt.body).map(x=>({json:{alt:{...x.json.alt,body_sent:__carry(x.json.alt.body)},early:{run_token:__tok,seat_for:x.json.alt.removed_seat,alt_seat:x.json.alt.seat,api_model:x.json.alt.api_model,payload_sha:__e4h(JSON.stringify(x.json.alt.body)),exec:__ex}}}));");
// 2. Alternate Build: same build, then the early reply is used only when EVERY call has a stored reply for the same seat and the same body.
const AB=stub.replace(RET,()=>H+"\nconst __R0=await new Function('$','$input','return (async()=>{\\n'+__S+'\\n})();')($,{first:()=>$('Alternate Needed?').first(),last:()=>$('Alternate Needed?').last(),all:()=>$('Alternate Needed?').all(),get item(){return $('Alternate Needed?').first();}}); /* pkgE4: Get Early Alternate sits between Alternate Needed? and this node */\n"
 +"let __E=[];try{if($('Get Early Alternate').isExecuted)__E=$('Get Early Alternate').all().map(i=>i.json).filter(e=>e&&typeof e.seat_for==='string');}catch(e){__E=[];} /* the HTTP node splits the returned array into items */\n"
 +"const __C=(__R0||[]).filter(x=>x&&x.json&&x.json.alt&&!x.json.alt.skip&&x.json.alt.body);\n"
 +"const __M=__C.map(x=>{const h=__e4h(JSON.stringify(x.json.alt.body));const r=__E.find(e=>e.seat_for===x.json.alt.removed_seat&&e.payload_sha===h&&e.reply&&!e.error&&Array.isArray(e.reply.choices)&&e.reply.choices.length);return {x,h,r};});\n"
 +"if(!(__M.length>0&&__M.every(m=>m.r)))return __R0; /* all or nothing: otherwise the output is exactly today's and the normal call runs */\n"
 +"return (__R0||[]).map(x=>{const m=__M.find(z=>z.x===x);return m?{json:{...x.json,early_all:true,__early_reply:m.r.reply}}:x;});");
// 3. Early Alternate Reply: hands Alternate Payloads the stored replies in the order of the calls, as Alternate Call openrouter would.
const EAR="// pkgE4: the stored early replies, one per alternate call, in Alternate Build's order (Alternate Payloads pairs $input with Alternate Build by index).\nreturn $input.all().map(x=>({json:x.json.__early_reply}));";
const AC=byName('Alternate Call openrouter');const CRED_SB=byName('Get Row').credentials;
const POS=AC.position,PCC=byName('Panel Cure Check').position;
const newNodes=[
 {name:'Early Alternate Build',type:'n8n-nodes-base.code',typeVersion:2,position:[PCC[0]+220,PCC[1]-400],onError:'continueRegularOutput',parameters:{jsCode:EAB}},
 {name:'Early Alternate Start',type:'n8n-nodes-base.executeWorkflow',typeVersion:1.2,position:[PCC[0]+440,PCC[1]-400],onError:'continueRegularOutput',
  parameters:{source:'database',workflowId:{__rl:true,mode:'id',value:'<EARLY_ALTERNATE_WORKFLOW_ID>'},mode:'each',options:{waitForSubWorkflow:false}}},
 {name:'Get Early Alternate',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,position:[POS[0]-660,POS[1]-200],onError:'continueRegularOutput',alwaysOutputData:true,
  parameters:{method:'POST',url:'https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/get_early_alternate',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:"={{ { p_run_token: $('Init Seats').first().json.run_token } }}",options:{timeout:30000}},credentials:CRED_SB},
 {name:'Early Reply?',type:'n8n-nodes-base.if',typeVersion:2.2,position:[POS[0]-220,POS[1]-200],
  parameters:{conditions:{combinator:'and',conditions:[{id:'early-reply',leftValue:'={{ $json.early_all === true }}',operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}},
 {name:'Early Alternate Reply',type:'n8n-nodes-base.code',typeVersion:2,position:[POS[0],POS[1]-200],parameters:{jsCode:EAR}}];
// 4. name lists: every lookup list and accessor map that names Alternate Call openrouter also names Early Alternate Reply.
const EDITS=[['"Alternate Call openrouter", ','"Alternate Call openrouter", "Early Alternate Reply", '],
 ["\"Alternate Call openrouter\":()=>$('Alternate Call openrouter'),","\"Alternate Call openrouter\":()=>$('Alternate Call openrouter'),\"Early Alternate Reply\":()=>$('Early Alternate Reply'),"],
 ["['Alternate Call openrouter','Alternate Cure Call openrouter']","['Alternate Call openrouter','Early Alternate Reply','Alternate Cure Call openrouter']"],
 ["['Alternate Call openrouter','Alternate Cure Call openrouter','Pane","['Alternate Call openrouter','Early Alternate Reply','Alternate Cure Call openrouter','Pane"]];
const patched=[];const plan={base:F,new_nodes:{},patched_nodes:{},connections:{}};
for(const n of W.nodes){if(n.name==='Alternate Payloads'||n.name==='Shared Library')continue;let p=JSON.stringify(n.parameters);const p0=p;
 for(const [a,b] of EDITS){const aj=JSON.stringify(a).slice(1,-1),bj=JSON.stringify(b).slice(1,-1);p=p.split(aj).join(bj);}
 if(n.name==='Alternate Build'){const q=JSON.parse(p);q.jsCode=AB;p=JSON.stringify(q);}
 if(p!==p0){const q=JSON.parse(p);if(q.jsCode)new Function('$','$input','$execution',q.jsCode.includes('await ')?'return (async()=>{'+q.jsCode+'})()':q.jsCode);
  patched.push({...n,parameters:q});plan.patched_nodes[n.name]={base:sha(JSON.stringify(n.parameters)),patched:sha(p)};}}
for(const n of newNodes){if(n.parameters.jsCode)new Function('$','$input','$execution','return (async()=>{'+n.parameters.jsCode+'})()');plan.new_nodes[n.name]=sha(JSON.stringify(n.parameters));}
plan.connections={
 add:[['Panel Cure Check',0,'Early Alternate Build',0],['Early Alternate Build',0,'Early Alternate Start',0],
  ['Alternate Needed?',0,'Get Early Alternate',0],['Get Early Alternate',0,'Alternate Build',0],
  ['Alternate Calls?',0,'Early Reply?',0],['Early Reply?',0,'Early Alternate Reply',0],['Early Reply?',1,'Alternate Call openrouter',0],['Early Alternate Reply',0,'Alternate Payloads',0]],
 remove:[['Alternate Needed?',0,'Alternate Build',0],['Alternate Calls?',0,'Alternate Call openrouter',0]],
 note:'Early Alternate Build sits ABOVE Enforcer Build on the canvas (executionOrder v1 runs the upper branch of Panel Cure Check first; it returns in seconds and Execute Workflow does not wait).'};
fs.writeFileSync(OUT+'main_nodes_new.json',JSON.stringify(newNodes,null,1));fs.writeFileSync(OUT+'main_nodes_patched.json',JSON.stringify(patched,null,1));
// 5. sub-workflow
const body='={{ $json.alt.body_sent }}'; /* pkgE4 v2: the body is carried and shaped in the main flow (Early Alternate Build) and sent unchanged */
const SUB={name:'WALL-2024 Early Alternate',settings:{executionOrder:'v1',callerPolicy:'workflowsFromSameOwner'},nodes:[
 {name:'Early Alternate In',type:'n8n-nodes-base.executeWorkflowTrigger',typeVersion:1.1,position:[0,0],parameters:{inputSource:'passthrough'}},
 {name:'Early Alternate Call openrouter',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,position:[240,0],onError:'continueRegularOutput',
  parameters:{...AC.parameters,jsonBody:body,headerParameters:{parameters:[{name:'x-grok-conv-id',value:'={{ "odv1-" + $json.early.exec }}'}]}},credentials:AC.credentials},
 {name:'Early Alternate Shape',type:'n8n-nodes-base.code',typeVersion:2,position:[480,0],parameters:{jsCode:
  "// pkgE4: one record per call, in input order; the reply is stored exactly as the call returned it.\nconst IN=$('Early Alternate In').all();const T0=Date.now();\nreturn $input.all().map((x,i)=>{const e=(IN[i]||{json:{}}).json.early||{};const j=x.json||{};const err=j.error?String(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error))).slice(0,500):((Array.isArray(j.choices)&&j.choices.length)?null:'no choices in the reply');\n return {json:{p_run_token:e.run_token||null,p_seat_for:e.seat_for||null,p_alt_seat:e.alt_seat||null,p_api_model:e.api_model||null,p_payload_sha:e.payload_sha||null,p_reply:err?null:j,p_error:err,p_ms:null}};});"}},
 {name:'Record Early Alternate',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,position:[720,0],onError:'continueRegularOutput',
  parameters:{method:'POST',url:'https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/record_early_alternate',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:'={{ $json }}',options:{timeout:30000}},credentials:CRED_SB}],
 connections:{'Early Alternate In':{main:[[{node:'Early Alternate Call openrouter',type:'main',index:0}]]},'Early Alternate Call openrouter':{main:[[{node:'Early Alternate Shape',type:'main',index:0}]]},'Early Alternate Shape':{main:[[{node:'Record Early Alternate',type:'main',index:0}]]}}};
new Function('$','$input','return (async()=>{'+SUB.nodes[2].parameters.jsCode+'})()');
fs.writeFileSync(OUT+'subworkflow_early_alternate.json',JSON.stringify(SUB,null,1));fs.writeFileSync(OUT+'plan_E4.json',JSON.stringify(plan,null,1));
console.log('patched nodes',Object.keys(plan.patched_nodes).length,'; new',Object.keys(plan.new_nodes).length);
