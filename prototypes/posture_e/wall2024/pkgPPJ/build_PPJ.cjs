// pkgPPJ (W1, 11-07; Eric approved 13:57 CST): Panel Judges 1-3 called at the same time instead of one after another.
// n8n runs one node at a time, so three branches would still run in turn. One HTTP Request node with 3 items does send all
// items at once (n8n-nodes-base HttpRequestV3: Promise.allSettled over the items) and returns them in item order.
// The keys stay in n8n credentials: each item goes to a small webhook workflow "WALL-2024 Panel Judge Call" that routes by
// provider to the same provider HTTP nodes (same credentials, URL, timeout, grok conv-id) and answers with the reply.
// In the main workflow the 16 provider judge nodes become Code nodes with the SAME names that hand out their slot's reply,
// so every downstream reader (Panel Check, Panel Payloads, Panel Tokens, Alternate Payloads, Shared Library, openrouter xAI
// maps) is unchanged. The DeepSeek empty-reply retry (Panel Judge 1 Empty? -> deepseek retry) is unchanged.
// Base: live s47 (fetchback_live_s47.json). s48 (ESS Retry Builds, L1Q2, LIB v10) touches none of these nodes.
// Run from wall2024/: node pkgPPJ/build_PPJ.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const F=process.env.BASE||'/mnt/project-files/wall2024/fetchback_live_s47.json';const W=JSON.parse(fs.readFileSync(F,'utf8'));
const node=n=>{const x=W.nodes.find(z=>z.name===n);if(!x)throw new Error('missing node '+n);return x;};
const P1=['deepseek','openai','gemini','grok','mimo','openrouter'],P23=['openai','gemini','grok','mimo','openrouter'];
const provs=k=>k===1?P1:P23;
// 1. the live route order must be what Prep assumes
for(const k of [1,2,3]){const got=(W.connections['Panel Judge '+k+' Route'].main||[]).map(a=>(a||[]).map(x=>x.node).join('|'));
 const want=provs(k).map(p=>'Panel Judge '+k+' '+p);if(JSON.stringify(got)!==JSON.stringify(want))throw new Error('route order changed for judge '+k+': '+got.join(','));}
// 2. the three openrouter body transforms, taken verbatim from the live expressions
const BASE=k=>")($('Init Seats').first().json.question_trial === true ? $('QR Merge').first().json.judges["+(k-1)+"].body : $('Panel Build').first().json.judges["+(k-1)+"].body) }}";
const ORF={};for(const k of [1,2,3]){const s=node('Panel Judge '+k+' openrouter').parameters.jsonBody;if(!s.startsWith('={{ (__b=>{'))throw new Error('openrouter '+k+' head');
 const i=s.indexOf(")($('Init Seats')");if(s.slice(i)!==BASE(k))throw new Error('openrouter '+k+' tail');ORF[k]=s.slice(4,i+1);}
// every other provider node must still be the plain body expression this package assumes
for(const k of [1,2,3])for(const p of provs(k)){if(p==='openrouter')continue;const n=node('Panel Judge '+k+' '+p);const want='={{ '+BASE(k).slice(2,-4)+' }}';
 if(n.parameters.jsonBody!==want)throw new Error(n.name+' jsonBody changed');if(n.type!=='n8n-nodes-base.httpRequest')throw new Error(n.name+' type');}
// 3. Panel Judges Prep (Code): one item per seat slot
const PREP=`// pkgPPJ (W1, 11-07): builds the 3 panel judge calls, one item per seat slot, for Panel Judges Parallel.
// Each item's body is exactly what the live provider node's jsonBody expression gave (openrouter transforms copied verbatim).
// The provider comes from the same route index the Panel Judge N Route switches use (judge 1: jidx0, judges 2-3: jidx).
const P1=${JSON.stringify(P1)},P23=${JSON.stringify(P23)};
const ORF={1:${ORF[1]},
2:${ORF[2]},
3:${ORF[3]}};
const qt=$('Init Seats').first().json.question_trial === true;const PB=$('Panel Build').first().json;
const out=[];const nonce=(()=>{let z='';for(let i=0;i<4;i++)z+=Math.random().toString(36).slice(2,10);return 'ppj-'+$execution.id+'-'+z;})(); /* pkgPPJ v2: the stored replies are found by this nonce */const t0=Date.now();
for(const k of [1,2,3]){const jd=(PB.judges||[])[k-1]||{};const ix=k===1?jd.jidx0:jd.jidx;const L=k===1?P1:P23;const provider=L[ix];
 if(!provider)throw new Error('FAIL-CLOSED: pkgPPJ judge '+k+' route index '+ix+' has no provider');
 let body=qt ? $('QR Merge').first().json.judges[k-1].body : PB.judges[k-1].body;
 if(provider==='openrouter')body=ORF[k](body);
 out.push({json:{ppj_slot:k,ppj_provider:provider,seat:jd.seat,api_model:PB.judges[k-1].api_model,conv_id:"odv1-" + $execution.id,ppj_nonce:nonce,ppj_t0:t0,body}});}
return out;`;
// 4. the 16 same-name Code nodes
const TAKE=(k,p)=>`// pkgPPJ (W1, 11-07): judge ${k} (${p}) was called together with the other two judges; Panel Judges Collect holds the stored replies by seat slot.
// This node hands out slot ${k}'s reply exactly as the old HTTP node gave it, so every reader of "${'Panel Judge '+k+' '+p}" is unchanged.
const K=${k},P=${JSON.stringify(p)};const it=$('Panel Judges Collect').all();const j=((it.find(i=>i&&i.json&&i.json.ppj_slot===K))||{}).json||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
let out;
if(j.error&&!j.response){const e=pe(j.error);e.message='pkgPPJ transport: '+e.message;e.ppj_transport=true;out={error:e};}
else if(j.ppj_slot!==K||j.ppj_provider!==P)out={error:{message:'pkgPPJ: slot '+K+' ('+P+') reply missing or mismatched: got slot '+j.ppj_slot+' ('+j.ppj_provider+')',ppj_transport:true}};
else if(!j.response||typeof j.response!=='object')out={error:{message:'pkgPPJ: slot '+K+' ('+P+') webhook answered without a reply object',ppj_transport:true}};
else out=j.response;
return [{json:out}];`;
fs.mkdirSync('pkgPPJ/patched',{recursive:true});fs.mkdirSync('pkgPPJ/base_s47',{recursive:true});
const plan={base:F.split('/').pop(),replace:{},add:{},connections:{}};
const wr=(f,s)=>{fs.writeFileSync('pkgPPJ/patched/'+f,s);return h(s);};
plan.add['Panel Judges Prep']=wr('Panel_Judges_Prep.js',PREP);
for(const k of [1,2,3])for(const p of provs(k)){const nm='Panel Judge '+k+' '+p;const n=node(nm);const f=nm.replace(/ /g,'_')+'.js';
 fs.writeFileSync('pkgPPJ/base_s47/'+nm.replace(/ /g,'_')+'.json',JSON.stringify(n,null,1));
 plan.replace[nm]={base_json:h(JSON.stringify(n.parameters)),patched_js:wr(f,TAKE(k,p)),file:f};}
// 5. the main-workflow wiring and new nodes (pkgPPJ v2, W4 2962: no HTTP call is held open; the webhook answers at once and the parent polls)
const r1=node('Panel Judge 1 Route');const uid=s=>{const x=crypto.createHash('md5').update('pkgPPJ:'+s).digest('hex');return x.slice(0,8)+'-'+x.slice(8,12)+'-'+x.slice(12,16)+'-'+x.slice(16,20)+'-'+x.slice(20,32);};
const SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/';const SBC={httpHeaderAuth:{id:'uCS43YOAcWVctNfM',name:'Supabase Anon Key'}};
{const fm=node('Fetch Models');if(JSON.stringify(fm.credentials)!==JSON.stringify(SBC))throw new Error('Supabase credential changed: '+JSON.stringify(fm.credentials));}
const DEADLINE_MS=980000,POLL_S=15;
const COLLECT=`// pkgPPJ v2 (W1, 11-07): the three judge replies, one item per seat slot in slot order, from the rows the Panel Judge Call workflow stored.
// A slot with no stored reply (its dispatch failed, or nothing arrived within ${DEADLINE_MS/1000} s) gets a transport error, which Panel Check treats as a failed judge call.
const P=$('Panel Judges Prep').all().map(i=>i.json);const D=$('Panel Judges Parallel').all().map(i=>i.json||{});
const F=($('Panel Judges Fetch').first().json)||{};const rows=Array.isArray(F.rows)?F.rows:[];const el=Math.round((Date.now()-P[0].ppj_t0)/1000);
const out=P.map((q,i)=>{const r=rows.find(x=>x&&x.slot===q.ppj_slot);let resp=null;try{resp=r&&typeof r.response_text==='string'?JSON.parse(r.response_text):null;}catch(e){resp=null;}
 if(resp&&typeof resp==='object')return {json:{ppj_slot:q.ppj_slot,ppj_provider:r.provider,response:resp}};
 const de=D[i]&&D[i].error;const why=de?'dispatch to the Panel Judge Call webhook failed: '+String((de&&(de.message||de.description))||JSON.stringify(de)).slice(0,200):'no reply stored for slot '+q.ppj_slot+' ('+q.ppj_provider+') after '+el+' s';
 return {json:{ppj_slot:q.ppj_slot,ppj_provider:q.ppj_provider,error:{message:why,ppj_transport:true}}};});
return out;`;
const wiring={add:[
 {id:uid('prep'),name:'Panel Judges Prep',type:'n8n-nodes-base.code',typeVersion:2,onError:'stopWorkflow',position:[r1.position[0]-1320,r1.position[1]],parameters:{jsCode:'(from patched/Panel_Judges_Prep.js)'}},
 {id:uid('par'),name:'Panel Judges Parallel',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,onError:'continueRegularOutput',position:[r1.position[0]-1100,r1.position[1]],
  credentials:{httpHeaderAuth:{id:'<PPJ webhook header-auth credential id>',name:'<PPJ webhook header-auth credential name>'}},
  parameters:{method:'POST',url:'<production URL of the WALL-2024 Panel Judge Call webhook>',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:'={{ $json }}',options:{timeout:60000}}},
 {id:uid('wait'),name:'Panel Judges Wait',type:'n8n-nodes-base.wait',typeVersion:1.1,position:[r1.position[0]-880,r1.position[1]],executeOnce:true,parameters:{amount:POLL_S,unit:'seconds'}},
 {id:uid('poll'),name:'Panel Judges Poll',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,onError:'continueRegularOutput',executeOnce:true,retryOnFail:true,maxTries:3,waitBetweenTries:5000,position:[r1.position[0]-660,r1.position[1]],credentials:SBC,
  parameters:{method:'POST',url:SB+'ppj_status',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:"={{ { payload: { nonce: $('Panel Judges Prep').first().json.ppj_nonce } } }}",options:{timeout:30000}}},
 {id:uid('done'),name:'Panel Judges Done?',type:'n8n-nodes-base.if',typeVersion:2.2,position:[r1.position[0]-440,r1.position[1]],
  parameters:{conditions:{combinator:'and',conditions:[{id:uid('donec'),leftValue:"={{ (() => { const n = Array.isArray($json.slots) ? $json.slots.length : 0; const d = $('Panel Judges Parallel').all().filter(i => i.json && i.json.error).length; return n + d >= 3 || (Date.now() - $('Panel Judges Prep').first().json.ppj_t0) > "+DEADLINE_MS+"; })() }}",operator:{operation:'true',singleValue:true,type:'boolean'},rightValue:''}],options:{caseSensitive:true,leftValue:'',typeValidation:'loose'}},options:{}}},
 {id:uid('fetch'),name:'Panel Judges Fetch',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,onError:'continueRegularOutput',executeOnce:true,retryOnFail:true,maxTries:3,waitBetweenTries:5000,position:[r1.position[0]-220,r1.position[1]-160],credentials:SBC,
  parameters:{method:'POST',url:SB+'ppj_get',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:"={{ { payload: { nonce: $('Panel Judges Prep').first().json.ppj_nonce } } }}",options:{timeout:60000}}},
 {id:uid('collect'),name:'Panel Judges Collect',type:'n8n-nodes-base.code',typeVersion:2,onError:'stopWorkflow',position:[r1.position[0]-110,r1.position[1]+160],parameters:{jsCode:'(from patched/Panel_Judges_Collect.js)'}}],
 replace_type:'each of the 16 nodes in plan_PPJ.json "replace" becomes type n8n-nodes-base.code typeVersion 2, parameters {jsCode: patched/<file>}; keep its name, id, position and onError continueRegularOutput; drop credentials',
 connections:{
  'QR Trial?':{output:1,from:'Panel Judge 1 Route',to:'Panel Judges Prep'},
  'QR Merge':{output:0,from:'Panel Judge 1 Route',to:'Panel Judges Prep'},
  'Panel Judges Prep':{output:0,to:'Panel Judges Parallel'},
  'Panel Judges Parallel':{output:0,to:'Panel Judges Wait'},
  'Panel Judges Wait':{output:0,to:'Panel Judges Poll'},
  'Panel Judges Poll':{output:0,to:'Panel Judges Done?'},
  'Panel Judges Done?':{output0_true:'Panel Judges Fetch',output1_false:'Panel Judges Wait (loop)'},
  'Panel Judges Fetch':{output:0,to:'Panel Judges Collect'},
  'Panel Judges Collect':{output:0,to:'Panel Judge 1 Route'}}};
plan.add['Panel Judges Collect']=wr('Panel_Judges_Collect.js',COLLECT);
plan.connections=wiring.connections;
fs.writeFileSync('pkgPPJ/patched.wiring.json',JSON.stringify(wiring,null,1));
// 6. the new webhook workflow: answers at once (responseMode onReceived), calls the provider, stores the reply through rpc ppj_put
const sub=[],con={};let x=0;const pos=()=>[x+=240,300];
const WRAP=`// pkgPPJ v2 (W1, 11-07): the provider reply for this seat slot, as the payload of rpc ppj_put.
// A provider HTTP error item ({error: <reason>}) is passed on with its message, description and status as plain fields,
// because an Error's message does not survive JSON. Panel Check reads e.message / e.description and httpCode / status / statusCode.
const q=$('Panel Judge Call').first().json.body||{};const j=$json||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of Object.keys(e))if(e[f]!=null&&typeof e[f]!=='object'&&!(f in o))o[f]=e[f];for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
const response=j.error?Object.assign({},j,{error:pe(j.error)}):j;
return [{json:{payload:{nonce:q.ppj_nonce,slot:q.ppj_slot,provider:q.ppj_provider,seat:q.seat||null,response_text:JSON.stringify(response)}}}];`;
fs.writeFileSync('pkgPPJ/patched/Panel_Judge_Call_Wrap.js',WRAP);plan.sub_wrap=h(WRAP);
sub.push({id:uid('wh'),name:'Panel Judge Call',type:'n8n-nodes-base.webhook',typeVersion:2,position:pos(),webhookId:uid('whid'),
 credentials:{httpHeaderAuth:{id:'<PPJ webhook header-auth credential id>',name:'<PPJ webhook header-auth credential name>'}},
 parameters:{httpMethod:'POST',path:'wall2024-panel-judge-call',authentication:'headerAuth',responseMode:'onReceived',options:{}}});
sub.push({id:uid('sw'),name:'Provider Route',type:'n8n-nodes-base.switch',typeVersion:3.2,position:pos(),parameters:{mode:'expression',numberOutputs:6,output:'={{ '+JSON.stringify(P1)+'.indexOf($json.body.ppj_provider) }}'}});
con['Panel Judge Call']={main:[[{node:'Provider Route',type:'main',index:0}]]};con['Provider Route']={main:[]};x=480;
P1.forEach((p,i)=>{const src=node('Panel Judge 1 '+p);const prm=JSON.parse(JSON.stringify(src.parameters));
 prm.jsonBody="={{ $('Panel Judge Call').first().json.body.body }}";
 if(p==='gemini')prm.url="={{ 'https://generativelanguage.googleapis.com/v1beta/models/' + $('Panel Judge Call').first().json.body.api_model + ':generateContent' }}";
 /* any x-grok-conv-id header (grok, and openrouter too) takes the PARENT execution id from the payload; $execution.id here would be the sub-execution's (W3 2953) */
 if(prm.headerParameters&&Array.isArray(prm.headerParameters.parameters))prm.headerParameters={parameters:prm.headerParameters.parameters.map(hp=>hp.name==='x-grok-conv-id'?{name:hp.name,value:"={{ $('Panel Judge Call').first().json.body.conv_id }}"}:hp)};
 if(JSON.stringify(prm).includes('$execution'))throw new Error('Call '+p+' still reads $execution');
 const nm='Call '+p;sub.push({id:uid('c'+p),name:nm,type:src.type,typeVersion:src.typeVersion,onError:'continueRegularOutput',position:[720,60+i*100],credentials:src.credentials,parameters:prm});
 con['Provider Route'].main[i]=[{node:nm,type:'main',index:0}];con[nm]={main:[[{node:'Wrap',type:'main',index:0}]]};});
sub.push({id:uid('wrap'),name:'Wrap',type:'n8n-nodes-base.code',typeVersion:2,onError:'stopWorkflow',position:[960,300],parameters:{jsCode:WRAP}});
sub.push({id:uid('store'),name:'Store Reply',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,retryOnFail:true,maxTries:5,waitBetweenTries:5000,position:[1200,300],credentials:SBC,
 parameters:{method:'POST',url:SB+'ppj_put',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:'={{ $json }}',options:{timeout:60000}}});
con['Wrap']={main:[[{node:'Store Reply',type:'main',index:0}]]};
const SW={name:'WALL-2024 Panel Judge Call',nodes:sub,connections:con,settings:{executionOrder:'v1',callerPolicy:'workflowsFromSameOwner'}};
fs.writeFileSync('pkgPPJ/patched/Panel_Judge_Call.workflow.json',JSON.stringify(SW,null,1));plan.sub_workflow=h(JSON.stringify(SW));
fs.writeFileSync('pkgPPJ/plan_PPJ.json',JSON.stringify(plan,null,1));
console.log('Prep',plan.add['Panel Judges Prep'],'Collect',plan.add['Panel Judges Collect'],'| replaced',Object.keys(plan.replace).length,'| sub-workflow nodes',sub.length,plan.sub_workflow);
