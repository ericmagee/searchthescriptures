// claude_direct harness (offline; no API call). Runs the changed nodes as n8n does (runner.cjs) on run 32284's stored rounds and the ACTIVE
// model_config rows (data/model_config_active.json, read by SELECT on 2026-11-02), and prints what the direct Claude requests carry.
const fs=require('fs');const T=require('./runner.cjs');const D=T.D;
let bad=0,n=0;const ok=(name,c,info)=>{n++;if(!c)bad++;console.log((c?'ok   ':'FAIL ')+name+(info!==undefined?' :: '+(typeof info==='string'?info:JSON.stringify(info)):''));};
const r84=JSON.parse(fs.readFileSync(D+'data/run32284.json','utf8'));const MC=JSON.parse(fs.readFileSync(D+'data/model_config_active.json','utf8'));
const OUT=[];const say=s=>{OUT.push(s);};
// ---------- the seats: Resolve Seats (base and new) ----------
const initSeats=(def,ch)=>({run_token:'ODV1-T',defender:def,challenger:ch,panel_order:['chatgpt','gemini','glm'],panel_reserve:'grok',single_judge:'sol',alt_order:[],dpos:'the standard reading',cpos:"the record's reading"});
const CLAUDE={engine:'claude',profile:'plain',fam:'openrouter',mc_seat:'claude_synthesis'};const MIMO={engine:'mimo',profile:'oracle',fam:'openrouter',mc_seat:'mimo'};
const HAIKU={engine:'haiku',profile:'plain',fam:'openrouter',mc_seat:'haiku'};
const resolve=(v,def,ch,rows)=>T.runNode(v,'Resolve Seats',{'Init Seats':initSeats(def,ch),'Fetch Models':rows||MC,'Fetch Drift Guards':[],'Fetch Tensions':[]})[0].json;
const withModel=(seat,api)=>MC.map(r=>r.seat===seat?{...r,api_model:api}:r);
console.log('== Resolve Seats: the route by model (any debater whose api_model starts with "anthropic/")');
{const b=resolve('base',CLAUDE,MIMO),x=resolve('new',CLAUDE,MIMO);
 ok('base: claude defender on openrouter',b.defender.fam==='openrouter');
 ok('new: claude defender on anthropic, direct id claude-sonnet-5-5, tok 64000',x.defender.fam==='anthropic'&&x.defender.direct_model==='claude-sonnet-5-5'&&x.defender.tok===64000&&x.defender.model==='anthropic/claude-sonnet-5.5',x.defender);
 ok('new: mimo challenger unchanged',JSON.stringify(x.challenger)===JSON.stringify(b.challenger));
 const keep=k=>JSON.stringify({...x,defender:null})===JSON.stringify({...b,defender:null});ok('new: every other Resolve output equal to base',keep());}
const MODELS=[['anthropic/claude-sonnet-5.5','claude-sonnet-5-5'],['anthropic/claude-opus-5.5','claude-opus-5-5'],['anthropic/claude-fable-5.1','claude-fable-5-1'],['anthropic/claude-haiku-5.5','claude-haiku-5-5']];
for(const [api,id] of MODELS){const x=resolve('new',CLAUDE,MIMO,withModel('claude_synthesis',api));ok('model_config switch only: claude_synthesis = '+api+' -> fam anthropic, '+id,x.defender.fam==='anthropic'&&x.defender.direct_model===id&&x.defender.tok===64000);}
{const rows=MC.concat([{seat:'haiku',api_model:'anthropic/claude-haiku-5.5',family:'anthropic',max_tokens:64000,active:true}]);
 const x=resolve('new',MIMO,HAIKU,rows);ok('prepared haiku engine (seat haiku) as challenger -> fam anthropic, claude-haiku-5-5; mimo defender unchanged',x.challenger.fam==='anthropic'&&x.challenger.direct_model==='claude-haiku-5-5'&&x.defender.fam==='openrouter');}
for(const badApi of ['anthropic/claude-sonnet-5.5:batch','anthropic/claude-3.5-sonnet','anthropic/sonnet']){let e='';try{resolve('new',CLAUDE,MIMO,withModel('claude_synthesis',badApi));}catch(er){e=er.message;}
 ok('fails closed on '+badApi,/VALIDATION: seat "claude_synthesis" api_model "/.test(e)&&e.includes(badApi),e.slice(0,200));}
// ---------- the Build nodes D1..D4 on run 32284 ----------
const F={cr1:r84.claude_r1,gr1:r84.engine_r1,cr2:r84.claude_r2,gr2:r84.engine_r2,cr3:r84.engine_r3,dr3:r84.challenger_r3,cr4:r84.defender_r4,dr4:r84.challenger_r4};
const strip=s=>String(s).replace(/^[^\n]*-- ROUND \d[^\n]*\n\n/,'');// the stored columns are the labelled texts; Extract raw is without the label
const DSYS='You are the DEFENDER in a chain-scoped scripture debate.\n'+'(system instructions as served by Init with Guards; stand-in text for the harness) '.repeat(40);
const IWG={topic:'Did Christ have a biological father?',dsys:DSYS,csys:DSYS.replace('DEFENDER','CHALLENGER'),lab:{D:'DEFENDER (standard reading)',C:"CHALLENGER (record's reading)"},sheet_req:[],sheet_off_url:[],sheet_req_c1:[],sheet_off_url_c1:[]};
const baseMap=RS=>({'Init Seats':initSeats(CLAUDE,MIMO),'Init with Guards':IWG,'Resolve Seats':RS,'D1 Extract':{raw:strip(F.cr1)},'C1 Extract':{raw:strip(F.gr1)},'D2 Extract':{raw:strip(F.cr2)},'C2 Extract':{raw:strip(F.gr2)},'D3 Extract':{raw:strip(F.cr3)},'C3 Extract':{raw:strip(F.dr3)},'D4 Extract':{raw:strip(F.cr4)},
 'D1 Verse Sheet':[{}],'C1 Verse Sheet':[{}],'D2 Verse Sheet':[{}],'C2 Verse Sheet':[{}],'D3 Verse Sheet':[{}],'C3 Verse Sheet':[{}],'D4 Verse Sheet':[{}],'C4 Verse Sheet':[{}]});
const FORBID=/^(thinking|reasoning|effort|reasoning_effort|output_config|include_reasoning|verbosity)$/;
const keysDeep=(o,acc=[])=>{if(o&&typeof o==='object'){for(const k of Object.keys(o)){acc.push(k);keysDeep(o[k],acc);}}return acc;};
const short=b=>JSON.stringify(b,(k,v)=>typeof v==='string'&&v.length>90?v.slice(0,60)+'...['+v.length+' chars]':v,1);
const runBuilds=(v,RS,label,side)=>{const m=baseMap(RS);const ids={};const res={};
 const rounds=side==='D'?['D1','D2','D3','D4']:['C1','C2','C3','C4'];
 for(const r of ['D1','C1','D2','C2','D3','C3','D4','C4']){
  const o=T.runNode(v,r+' Build',m)[0].json;m[r+' Build']=o;res[r]=o;
  if(o.call.fam==='anthropic'){ids[r]='msg_PLACEHOLDER_'+r;m[r+' Call anthropic']={id:ids[r],type:'message'};}}
 return {res,ids,rounds};};
console.log('== Build D1..D4 (run 32284, Claude defending), every model of the switch');
const PRINT={};
for(const [api,id] of MODELS){const RS=resolve('new',CLAUDE,MIMO,withModel('claude_synthesis',api));const {res}=runBuilds('new',RS,api,'D');
 const chain=['D1','D2','D3','D4'].map(r=>res[r].call.body.diagnostics?res[r].call.body.diagnostics.previous_message_id:'(absent)');
 const want=[null,'msg_PLACEHOLDER_D1','msg_PLACEHOLDER_D2','msg_PLACEHOLDER_D3'];
 ok(id+': D1..D4 on the anthropic route (fam_idx 0), model '+id+', max_tokens 64000',['D1','D2','D3','D4'].every(r=>res[r].call.fam==='anthropic'&&res[r].call.fam_idx===0&&res[r].call.body.model===id&&res[r].call.body.max_tokens===64000));
 ok(id+': diagnostics chain null, D1, D2, D3',JSON.stringify(chain)===JSON.stringify(want),chain);
 ok(id+': no thinking/reasoning/effort/output_config field anywhere in D1..D4',['D1','D2','D3','D4'].every(r=>!keysDeep(res[r].call.body).some(k=>FORBID.test(k))));
 ok(id+': no OpenRouter session_id on the direct body',['D1','D2','D3','D4'].every(r=>!('session_id' in res[r].call.body)));
 const cc=r=>{const b=res[r].call.body;const sysOk=Array.isArray(b.system)&&b.system.every(x=>x.cache_control&&x.cache_control.type==='ephemeral'&&x.cache_control.ttl==='1h');const last=b.messages[b.messages.length-1];const lastOk=Array.isArray(last.content)&&last.content.length===1&&last.content[0].cache_control&&last.content[0].cache_control.ttl==='1h';const others=b.messages.slice(0,-1).every(x=>typeof x.content==='string');return sysOk&&lastOk&&others;};
 ok(id+': 1-hour cache markers: every system block, the last message only',['D1','D2','D3','D4'].every(cc),['D1','D2','D3','D4'].map(r=>res[r].call.body.system.length+' system block(s), '+res[r].call.body.messages.length+' message(s)'));
 ok(id+': the challenger (mimo) stays on openrouter, body unchanged from base',(()=>{const b=runBuilds('base',resolve('base',CLAUDE,MIMO),api,'C').res;return ['C1','C2','C3','C4'].every(r=>res[r].call.fam==='openrouter'&&JSON.stringify(res[r].call)===JSON.stringify(b[r].call));})());
 PRINT[id]=res;}
{const res=PRINT['claude-sonnet-5-5'];
 say('REQUEST BODIES, run 32284 inputs, Claude (claude_synthesis = anthropic/claude-sonnet-5.5) defending; long strings cut. POST https://api.anthropic.com/v1/messages via "D<n> Call anthropic".');
 for(const r of ['D1','D2','D3','D4']){const c=res[r].call;say('\n=== '+r+' Build -> call {fam:'+c.fam+', fam_idx:'+c.fam_idx+', model:'+c.model+', diag_prev:'+c.diag_prev+'}\n'+short(c.body));}
 // the cache markers stay exactly as now: the base anthropic branch with the same inputs differs only in model and diagnostics
 const RSb={...resolve('new',CLAUDE,MIMO),};const bres=runBuilds('base',RSb,'','D').res;
 const same=['D1','D2','D3','D4'].every(r=>{const a={...res[r].call.body},b={...bres[r].call.body};delete a.model;delete a.diagnostics;delete b.model;return JSON.stringify(a)===JSON.stringify(b);});
 ok('the anthropic body equals the base anthropic branch except model (mapped) and diagnostics (added): system, markers, messages, max_tokens unchanged',same);
 // the system and messages are the same as the OpenRouter body sent before (content-wise): the prompt does not change with the route
 const or=runBuilds('base',resolve('base',CLAUDE,MIMO),'','D').res;
 const sameText=['D1','D2','D3','D4'].every(r=>{const o=or[r].call.body.messages;const sysTxt=o[0].content.map(x=>x.text).join('');const a=res[r].call.body;return sysTxt===a.system.map(x=>x.text).join('')&&JSON.stringify(o.slice(1))===JSON.stringify(a.messages);});
 ok('the system text and messages equal those of the OpenRouter body the live flow sends today',sameText);}
console.log('== Claude as challenger (C1..C4): the chain is per seat');
{const RS=resolve('new',MIMO,CLAUDE);const {res}=runBuilds('new',RS,'','C');const chain=['C1','C2','C3','C4'].map(r=>res[r].call.body.diagnostics.previous_message_id);
 ok('C1..C4 direct, chain null, C1, C2, C3',JSON.stringify(chain)===JSON.stringify([null,'msg_PLACEHOLDER_C1','msg_PLACEHOLDER_C2','msg_PLACEHOLDER_C3']),chain);
 ok('D1..D4 (mimo) unchanged on openrouter',['D1','D2','D3','D4'].every(r=>res[r].call.fam==='openrouter'&&!res[r].call.body.diagnostics));}
{const m=baseMap({defender:{engine:'claude',fam:'anthropic',model:'anthropic/claude-sonnet-5.5:batch',tok:64000},challenger:{engine:'mimo',fam:'openrouter',model:'xiaomi/mimo-v2.6-pro',tok:64000}});let e='';try{T.runNode('new','D1 Build',m);}catch(er){e=er.message;}
 ok('Build fails closed too on an unknown direct id',/VALIDATION: D1 the model "anthropic\/claude-sonnet-5.5:batch"/.test(e),e.slice(0,160));}
// ---------- Extract on sample direct Anthropic responses ----------
console.log('== Extract on sample direct Anthropic responses');
const ext=(r,resp,prev)=>T.runNode('new',r+' Extract',{'Init Seats':{run_token:'ODV1-T'},[r+' Build']:{call:{fam:'anthropic',fam_idx:0,model:'anthropic/claude-sonnet-5.5',diag_prev:prev||null}},'Init with Guards':{lab:{D:'DEFENDER',C:'CHALLENGER'},sheet_req:[]},
 'D1 Extract':{raw:strip(F.cr1)},'C1 Extract':{raw:strip(F.gr1)},'D2 Extract':{raw:strip(F.cr2)},'C2 Extract':{raw:strip(F.gr2)},'D3 Extract':{raw:strip(F.cr3)},'C3 Extract':{raw:strip(F.dr3)},'D4 Extract':{raw:strip(F.cr4)},'D1 Build':{call:{fam:'anthropic'}}},resp)[0].json;
const msg=(id,text,stop,usage,diag)=>({id,type:'message',role:'assistant',model:'claude-sonnet-5-5',content:text===null?[]:[{type:'text',text}],stop_reason:stop,stop_details:null,usage,...(diag===undefined?{}:{diagnostics:diag})});
const SAMPLES=[];
{const o=ext('D1',msg('msg_01A',strip(F.cr1),'end_turn',{input_tokens:12,cache_creation_input_tokens:20500,cache_read_input_tokens:0,output_tokens:3100},null),null);SAMPLES.push(o.cache_diag);
 ok('D1 normal, first call: text read, whole prompt = 12+20500+0, line says first call',o.raw===strip(F.cr1)&&o.usage.input_tokens===20512&&o.usage.input_uncached_tokens===12&&o.usage.cache_creation_input_tokens===20500&&o.msg_id==='msg_01A'&&/^\[CACHE DIAG D1: cache_miss_reason=null \(first Claude call/.test(o.cache_diag),o.cache_diag);}
{const o=ext('D2',msg('msg_01B',strip(F.cr2),'end_turn',{input_tokens:40,cache_creation_input_tokens:9000,cache_read_input_tokens:20500,output_tokens:2800},null),'msg_01A');SAMPLES.push(o.cache_diag);
 ok('D2 normal, no divergence: read 20500, write 9000',/^\[CACHE DIAG D2: cache_miss_reason=null \(no divergence\); read=20500; write=9000; uncached=40; previous_message_id=msg_01A; message_id=msg_01B\]$/.test(o.cache_diag),o.cache_diag);}
{const o=ext('D3',msg('msg_01C',strip(F.cr3),'end_turn',{input_tokens:42,cache_creation_input_tokens:41850,cache_read_input_tokens:0,output_tokens:210},{cache_miss_reason:{type:'system_changed',cache_missed_input_tokens:41850}}),'msg_01B');SAMPLES.push(o.cache_diag);
 ok('D3 diagnostics system_changed with cache_missed_input_tokens',/cache_miss_reason=system_changed; cache_missed_input_tokens=41850; read=0; write=41850/.test(o.cache_diag),o.cache_diag);}
{const o=ext('D4',msg('msg_01D',strip(F.cr4),'end_turn',{input_tokens:5,cache_creation_input_tokens:0,cache_read_input_tokens:30000,output_tokens:100},{cache_miss_reason:null}),'msg_01C');SAMPLES.push(o.cache_diag);
 ok('D4 pending comparison',/cache_miss_reason=pending/.test(o.cache_diag),o.cache_diag);}
{const o=ext('D2',msg('msg_01E','partial text','max_tokens',{input_tokens:1,cache_creation_input_tokens:0,cache_read_input_tokens:100,output_tokens:64000},{cache_miss_reason:{type:'previous_message_not_found'}}),'msg_01A');SAMPLES.push(o.cache_diag);
 ok('max_tokens: kept with the TRUNCATED marker; previous_message_not_found named',/\[TRUNCATED: the provider reported the token limit/.test(o.raw)&&/cache_miss_reason=previous_message_not_found; read=100/.test(o.cache_diag),o.cache_diag);}
{let e='';try{ext('D2',{...msg('msg_01F',null,'refusal',{input_tokens:3,cache_creation_input_tokens:0,cache_read_input_tokens:0,output_tokens:0},null),stop_details:{type:'refusal',category:'general_harms',explanation:'x'}},'msg_01A');}catch(er){e=er.message;}
 ok('refusal: throws (a failed call, to Failure Salvage) and names the category',/VALIDATION: D2 \(DEFENDER, anthropic anthropic\/claude-sonnet-5\.5\) refused by the provider: stop_reason=refusal \(category general_harms\)/.test(e),e.slice(0,200));}
{let e='';try{ext('D2',msg('msg_01G',null,'end_turn',{input_tokens:3,output_tokens:0},null),'msg_01A');}catch(er){e=er.message;}ok('empty reply: throws with finish_reason',/returned no text: finish_reason=end_turn/.test(e),e.slice(0,140));}
{const o=T.runNode('new','C2 Extract',{'Init Seats':{run_token:'T'},'C2 Build':{call:{fam:'openrouter',model:'xiaomi/mimo-v2.6-pro'}},'Init with Guards':{lab:{D:'D',C:'C'},sheet_req:[]},'D1 Extract':{raw:'a'},'C1 Extract':{raw:'b'},'D2 Extract':{raw:'c'}},{choices:[{message:{content:'x'},finish_reason:'stop'}],usage:{prompt_tokens:900,completion_tokens:50,prompt_tokens_details:{cached_tokens:700,cache_write_tokens:100}}})[0].json;
 ok('OpenRouter Extract unchanged: prompt_tokens as input_tokens, no CACHE DIAG line',o.usage.input_tokens===900&&o.usage.cache_read_input_tokens===700&&o.cache_diag===null,o.usage);}
// ---------- Save Body: the lines into review_notes, the sums ----------
console.log('== Build Save Body: CACHE DIAG lines and the token sums');
{const s=T.src('new','Build Save Body');const a=s.indexOf("['D1','C1','D2','C2','D3','C3','D4','C4'].forEach(r=>{try{const x=$(r+' Extract')");const b=s.indexOf('\n',a);
 const st=T.stub({'D1 Extract':{cache_diag:SAMPLES[0],usage:{}},'C1 Extract':{cache_diag:null},'D2 Extract':{cache_diag:SAMPLES[1]},'D3 Extract':{cache_diag:SAMPLES[2]},'D4 Extract':{cache_diag:SAMPLES[3]}});
 const FF=[];new Function('$','FF',s.slice(a,b))(st,FF);ok('four lines, in round order, no REVIEW THIS ROW flag',FF.length===4&&FF[0].startsWith('[CACHE DIAG D1')&&FF[3].startsWith('[CACHE DIAG D4')&&!FF.some(x=>/REVIEW THIS ROW/.test(x)),FF);
 const sumL=s.slice(s.indexOf("const __A=__R.concat"),s.indexOf("const ti=")+0);ok('Save Body sums usage.input_tokens / cache_* of the round Extracts as before (code unchanged)',T.src('base','Build Save Body').includes("const __U=(n)=>{try{return $(n).first().json.usage||{};}catch(e){return {};}};const __R=['D1','C1','D2','C2','D3','C3','D4','C4'].map(r=>__U(r+' Extract'));"));}
fs.writeFileSync(D+'test/bodies_out.txt',OUT.join('\n')+'\n\nSAMPLE CACHE DIAG LINES (Extract fed sample responses):\n'+SAMPLES.join('\n')+'\n');
console.log('checks',n,'| failures',bad);process.exitCode=bad?1:0;
