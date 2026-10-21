// ORACLE_DEBATE_V1 (BB-4607). Init Seats: mints the run token FIRST, then validates the seat
// configuration. Every refusal throws with run_token= in the message, so the Error Handler row carries it (K7).
const j=$input.first().json;const b=(j&&j.body&&typeof j.body==='object')?j.body:j;
// REGRADE (operator ruling 2026-10-09): a body carrying regrade_run_token re-judges the panel of that saved run and keeps its token.
const RG=(b.regrade_run_token===undefined||b.regrade_run_token===null)?null:String(b.regrade_run_token).trim();
if(RG!==null&&!/^ODV1-\d+-[a-z0-9]{8}$/.test(RG))throw new Error('ORACLE_DEBATE_V1 Init refused: regrade_run_token "'+RG+'" is not an ODV1 run token.');
// DRY REPLAY (operator ruling, Worker_A3 thread, 2026-10-10): regrade_dry re-judges a saved run and writes NO judgment, NO outcome and NO
// Drive file; the three results go to debate_replay_judgments only. rulebook 'draft' (the WALL-0788 wording) is allowed only in a dry regrade.
const DRY=b.regrade_dry===true;const RB=(b.rulebook===undefined||b.rulebook===null)?'current':String(b.rulebook).trim().toLowerCase();
const TOK=RG||('ODV1-'+String($execution.id)+'-'+Math.random().toString(36).slice(2,10));const RT=' run_token='+TOK;
$execution.customData.set('run_token',TOK);$execution.customData.set('variant','ORACLE_DEBATE_V1');if(RG)$execution.customData.set('regrade','true');if(DRY){$execution.customData.set('dry','true');$execution.customData.set('rulebook',RB);}
const fail=m=>{throw new Error('ORACLE_DEBATE_V1 Init refused: '+m+RT);};
if(b.regrade_dry!==undefined&&b.regrade_dry!==null&&typeof b.regrade_dry!=='boolean')fail('regrade_dry must be true or false.');
if(DRY&&!RG)fail('regrade_dry needs regrade_run_token.');
if(RB!=='current'&&RB!=='draft'&&RB!=='chain')fail('rulebook "'+RB+'" is not current, draft or chain.');
if(RB!=='current'&&!DRY)fail('the '+RB+' rulebook runs only in a dry regrade.');
if(b.topic===undefined||b.topic===null||String(b.topic).trim()==='')fail('topic missing or empty.');
// Engine -> API family and model_config seat. claude resolves from the claude_synthesis row, as in W1.
const ENG={claude:{fam:'anthropic',mc:'claude_synthesis'},chatgpt:{fam:'openai',mc:'chatgpt'},gemini:{fam:'gemini',mc:'gemini'},grok:{fam:'grok',mc:'grok'},mimo:{fam:'mimo',mc:'mimo'},glm:{fam:'openrouter',mc:'glm'},qwen:{fam:'openrouter',mc:'qwen'},deepseek:{fam:'deepseek',mc:'deepseek_debate'}};
const seat=k=>{const s=b[k];if(!s||typeof s!=='object')fail(k+' seat missing; expected {engine, profile}.');
 const e=String(s.engine||'').trim().toLowerCase();const p=String(s.profile||'').trim().toLowerCase();
 if(!ENG[e])fail(k+' engine "'+e+'" is not one of ['+Object.keys(ENG).join(', ')+'].');
 if(p!=='oracle'&&p!=='plain')fail(k+' profile "'+p+'" is neither oracle nor plain.');
 return {engine:e,profile:p,fam:ENG[e].fam,mc_seat:ENG[e].mc};};
// MiniMax never debates (BB-6997): its models are the permanent alternates. A hard refusal, both seats alike.
if([b.defender,b.challenger].some(x=>x&&typeof x==='object'&&/minimax/i.test(String(x.engine||''))))fail('MiniMax never debates (BB-6997): its models are the permanent alternates.');
const D=seat('defender');const C=seat('challenger');
if(D.profile==='oracle'&&C.profile==='oracle')fail('both seats as The Oracle; BB-4671 rules what each seat argues for one Oracle seat or none, not two.');
// Position by profile (BB-4671 Q6 b): The Oracle holds the record's reading from either seat; a plain seat facing it
// holds the standard reading; with no Oracle seated, position follows role as in W1.
const REC="the record's reading",STD='the standard reading';
const dpos=(C.profile==='oracle')?STD:REC;const cpos=(C.profile==='oracle')?REC:STD;
// Judge order (BB-4607; price order for the last three, BB-4662). Panel = first three not seated; single judge,
// synthesis and diagnostic = first not seated. Claude never judges.
const ORDER=['deepseek','gemini','grok','chatgpt','mimo','glm','qwen'];
const seated={};seated[D.engine]=true;seated[C.engine]=true;
const free=ORDER.filter(s=>!seated[s]);const panel_order=free.slice(0,3);
if(panel_order.length!==3)fail('the derived panel is '+panel_order.length+' seat(s) ['+panel_order.join(', ')+']; the roster is exactly three.');
const panel_expected=panel_order.slice().sort();
// PANEL FALLBACK (BB-5685, BB-5693): the reserve is the next free seat after the three. The test inputs run only in a dry
// regrade and drive the substitution path on demand: test_fail_seat marks one panel seat failed; test_fail_reserve also fails
// the reserve (the second failure); test_no_fallback makes the run behave as the fallback switched off.
const panel_reserve=free.length>3?free[3]:null;
const TFS=(b.test_fail_seat===undefined||b.test_fail_seat===null||b.test_fail_seat==='')?null:String(b.test_fail_seat).trim().toLowerCase();
['test_fail_reserve','test_no_fallback'].forEach(k=>{if(b[k]!==undefined&&b[k]!==null&&typeof b[k]!=='boolean')fail(k+' must be true or false.');});
const TFR=b.test_fail_reserve===true;const TNF=b.test_no_fallback===true;
if((TFS!==null||TFR||TNF)&&!DRY)fail('test_fail_seat, test_fail_reserve and test_no_fallback run only in a dry regrade.');
if(TFS!==null&&panel_order.indexOf(TFS)===-1)fail('test_fail_seat "'+TFS+'" is not one of the panel ['+panel_order.join(', ')+'].');
if((TFR||TNF)&&TFS===null)fail('test_fail_reserve and test_no_fallback need test_fail_seat.');
// ALTERNATES (BB-6904 g; 7126): the alternates are the flow's own reserve judges, drawn in reserve order from the seats free after the
// panel, one per removed seat and two at most, under the guards already built. Resolve Seats keeps the seats the openrouter alternate call
// serves. MiniMax is out of this publish (7126); qualify_alternate is refused.
const ALT_ORDER=free.slice(3);
if(!(b.qualify_alternate===undefined||b.qualify_alternate===null||b.qualify_alternate===''))fail('qualify_alternate is not in this publish (BB-7126).');
const QA=null;
// TOPIC FENCE (WALL-0788 replies 823-837): a launch the operator overrode carries a one-use override id; Topic Fence consumes it.
const FO=(b.fence_override_id===undefined||b.fence_override_id===null||b.fence_override_id==='')?null:String(b.fence_override_id).trim();
if(FO!==null&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(FO))fail('fence_override_id "'+FO.slice(0,60)+'" is not an override id.');
const q=(b.queue_id===undefined||b.queue_id===null)?null:b.queue_id;
$execution.customData.set('defender',D.engine+'/'+D.profile);$execution.customData.set('challenger',C.engine+'/'+C.profile);
return [{json:{run_token:TOK,variant:'ORACLE_DEBATE_V1',topic:b.topic,defender:D,challenger:C,dpos,cpos,panel_order,panel_expected,panel_reserve,test_fail_seat:TFS,test_fail_reserve:TFR,test_no_fallback:TNF,alt_order:ALT_ORDER,qualify_alternate:QA,single_judge:free[0],queue_id:q,fence_override_id:FO,regrade:!!RG,dry:DRY,rulebook:RB,sd:new Date().toISOString().split('T')[0],t0:new Date().toISOString()}}];

