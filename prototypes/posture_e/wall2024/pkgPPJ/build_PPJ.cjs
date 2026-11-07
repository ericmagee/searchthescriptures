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
const out=[];
for(const k of [1,2,3]){const jd=(PB.judges||[])[k-1]||{};const ix=k===1?jd.jidx0:jd.jidx;const L=k===1?P1:P23;const provider=L[ix];
 if(!provider)throw new Error('FAIL-CLOSED: pkgPPJ judge '+k+' route index '+ix+' has no provider');
 let body=qt ? $('QR Merge').first().json.judges[k-1].body : PB.judges[k-1].body;
 if(provider==='openrouter')body=ORF[k](body);
 out.push({json:{ppj_slot:k,ppj_provider:provider,seat:jd.seat,api_model:PB.judges[k-1].api_model,conv_id:"odv1-" + $execution.id,body}});}
return out;`;
// 4. the 16 same-name Code nodes
const TAKE=(k,p)=>`// pkgPPJ (W1, 11-07): judge ${k} (${p}) was called by Panel Judges Parallel together with the other two judges.
// This node hands out slot ${k}'s reply exactly as the old HTTP node gave it, so every reader of "${'Panel Judge '+k+' '+p}" is unchanged.
const K=${k},P=${JSON.stringify(p)};const it=$('Panel Judges Parallel').all();const j=(it[K-1]&&it[K-1].json)||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
let out;
if(j.error&&j.ppj_slot==null){const e=pe(j.error);e.message='pkgPPJ transport (Panel Judge Call webhook): '+e.message;e.ppj_transport=true;out={error:e};}
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
// 5. the main-workflow wiring and new nodes
const r1=node('Panel Judge 1 Route');const uid=s=>{const x=crypto.createHash('md5').update('pkgPPJ:'+s).digest('hex');return x.slice(0,8)+'-'+x.slice(8,12)+'-'+x.slice(12,16)+'-'+x.slice(16,20)+'-'+x.slice(20,32);};
const wiring={add:[
 {id:uid('prep'),name:'Panel Judges Prep',type:'n8n-nodes-base.code',typeVersion:2,onError:'stopWorkflow',position:[r1.position[0]-440,r1.position[1]],parameters:{jsCode:'(from patched/Panel_Judges_Prep.js)'}},
 {id:uid('par'),name:'Panel Judges Parallel',type:'n8n-nodes-base.httpRequest',typeVersion:4.3,onError:'continueRegularOutput',position:[r1.position[0]-220,r1.position[1]],
  credentials:{httpHeaderAuth:{id:'<PPJ webhook header-auth credential id>',name:'<PPJ webhook header-auth credential name>'}},
  parameters:{method:'POST',url:'<production URL of the WALL-2024 Panel Judge Call webhook>',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendBody:true,specifyBody:'json',jsonBody:'={{ $json }}',options:{timeout:960000}}}],
 replace_type:'each of the 16 nodes in plan_PPJ.json "replace" becomes type n8n-nodes-base.code typeVersion 2, parameters {jsCode: patched/<file>}; keep its name, id, position and onError continueRegularOutput; drop credentials',
 connections:{
  'QR Trial?':{output:1,from:'Panel Judge 1 Route',to:'Panel Judges Prep'},
  'QR Merge':{output:0,from:'Panel Judge 1 Route',to:'Panel Judges Prep'},
  'Panel Judges Prep':{output:0,to:'Panel Judges Parallel'},
  'Panel Judges Parallel':{output:0,to:'Panel Judge 1 Route'}}};
plan.connections=wiring.connections;
fs.writeFileSync('pkgPPJ/patched.wiring.json',JSON.stringify(wiring,null,1));
// 6. the new webhook workflow
const sub=[],con={};let x=0;const pos=()=>[x+=240,300];
const WRAP=`// pkgPPJ (W1, 11-07): answer the main workflow with the provider reply for this seat slot.
// A provider HTTP error item ({error: <reason>}) is passed on with its message, description and status as plain fields,
// because an Error's message does not survive JSON. Panel Check reads e.message / e.description and httpCode / status / statusCode.
const q=$('Panel Judge Call').first().json.body||{};const j=$json||{};
const pe=e=>{const o={message:String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e)))};if(e&&typeof e==='object'){for(const f of Object.keys(e))if(e[f]!=null&&typeof e[f]!=='object'&&!(f in o))o[f]=e[f];for(const f of ['name','description','httpCode','status','statusCode','code'])if(e[f]!=null&&typeof e[f]!=='object')o[f]=e[f];}return o;};
const response=j.error?Object.assign({},j,{error:pe(j.error)}):j;
return [{json:{ppj_slot:q.ppj_slot,ppj_provider:q.ppj_provider,response}}];`;
fs.writeFileSync('pkgPPJ/patched/Panel_Judge_Call_Wrap.js',WRAP);plan.sub_wrap=h(WRAP);
sub.push({id:uid('wh'),name:'Panel Judge Call',type:'n8n-nodes-base.webhook',typeVersion:2,position:pos(),webhookId:uid('whid'),
 credentials:{httpHeaderAuth:{id:'<PPJ webhook header-auth credential id>',name:'<PPJ webhook header-auth credential name>'}},
 parameters:{httpMethod:'POST',path:'wall2024-panel-judge-call',authentication:'headerAuth',responseMode:'responseNode',options:{}}});
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
sub.push({id:uid('resp'),name:'Respond',type:'n8n-nodes-base.respondToWebhook',typeVersion:1.1,position:[1200,300],parameters:{respondWith:'firstIncomingItem',options:{}}});
con['Wrap']={main:[[{node:'Respond',type:'main',index:0}]]};
const SW={name:'WALL-2024 Panel Judge Call',nodes:sub,connections:con,settings:{executionOrder:'v1',callerPolicy:'workflowsFromSameOwner'}};
fs.writeFileSync('pkgPPJ/patched/Panel_Judge_Call.workflow.json',JSON.stringify(SW,null,1));plan.sub_workflow=h(JSON.stringify(SW));
fs.writeFileSync('pkgPPJ/plan_PPJ.json',JSON.stringify(plan,null,1));
console.log('Prep',plan.add['Panel Judges Prep'],'| replaced',Object.keys(plan.replace).length,'| sub-workflow nodes',sub.length,plan.sub_workflow);
