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
const ENG={claude:{fam:'openrouter',mc:'claude_synthesis'},chatgpt:{fam:'openrouter',mc:'chatgpt'},gemini:{fam:'openrouter',mc:'gemini'},grok:{fam:'openrouter',mc:'grok'},mimo:{fam:'openrouter',mc:'mimo'},haiku:{fam:'openrouter',mc:'haiku'},opus:{fam:'openrouter',mc:'opus'}, /* judge_fix7 J6: the Oracle seat from now on (model_config row opus, anthropic/claude-opus-5.5) */glm:{fam:'openrouter',mc:'glm'},qwen:{fam:'openrouter',mc:'qwen'},deepseek:{fam:'deepseek',mc:'deepseek_debate'}};
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
// judge_fix3 A2 (operator, 2026-11-02: "You are authorized to add any model needed during this fix"): with qwen removed the alternate pool was
// empty in every pairing; sol (GPT-6.1 Sol, openai/gpt-6.1-sol, chosen from the operator's ranking; model_config row in sql/a2_sol_alternate.sql)
// is added LAST, so the panel, the single judge and the reserve never change; it serves only as an alternate (free.slice(4)). Its family
// (openai) is dropped by Resolve Seats when ChatGPT debates (BB-6993).
const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];
const seated={};seated[D.engine]=true;seated[C.engine]=true;
// judge_fix5 G12 (operator, 2026-11-02: "remove deepseek from panel"; md_notes_rulings 366: "... leave it as the enforcer"): DeepSeek sits on no panel
// slot, reserve or alternate. The single judge, the synthesis and the diagnostic stay the first free seat of ORDER (DeepSeek unless it debates);
// the panel, the reserve and the alternates come from the panel order, ORDER without DeepSeek.
// judge_fix5 G12 correction (md_notes_rulings 362: a model over the time limit is removed "as debater and judge"): qwen sits on no panel either.
// sol (ruling 378, the operator's rank-3 choice) then fills the panel, reserve or alternate place its ORDER position gives it; a seat of the same
// family as a debater (sol and chatgpt, both openai) is skipped here, as Resolve Seats would refuse it.
const NOT_PANEL=['deepseek','qwen'];const FAM_PANEL={chatgpt:'openai',sol:'openai'};const dfam=[FAM_PANEL[D.engine],FAM_PANEL[C.engine]].filter(Boolean);
const free=ORDER.filter(s=>!seated[s]);const pfree=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));const panel_order=pfree.slice(0,3);
if(panel_order.length!==3)fail('the derived panel is '+panel_order.length+' seat(s) ['+panel_order.join(', ')+']; the roster is exactly three.');
const panel_expected=panel_order.slice().sort();
// PANEL FALLBACK (BB-5685, BB-5693): the reserve is the next free seat after the three. The test inputs run only in a dry
// regrade and drive the substitution path on demand: test_fail_seat marks one panel seat failed; test_fail_reserve also fails
// the reserve (the second failure); test_no_fallback makes the run behave as the fallback switched off.
// judge_fix3 A2 (operator rule: "any model that can't response in the required time will be removed"; the call limit is 900 s): qwen's
// alternate calls took 981.7 s (32228), 1,194.6 s and 985.2 s (32255). It is removed from the reserve and from the alternate pool. Where qwen
// would have been the reserve, the run has no reserve (the added model, sol, serves as an alternate only).
const JUDGE_TIME_REMOVED=['qwen'];
const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0)?pfree[3]:null; // judge_fix5 G12
const TFS=(b.test_fail_seat===undefined||b.test_fail_seat===null||b.test_fail_seat==='')?null:String(b.test_fail_seat).trim().toLowerCase();
['test_fail_reserve','test_no_fallback'].forEach(k=>{if(b[k]!==undefined&&b[k]!==null&&typeof b[k]!=='boolean')fail(k+' must be true or false.');});
const TFR=b.test_fail_reserve===true;const TNF=b.test_no_fallback===true;
if((TFS!==null||TFR||TNF)&&!DRY)fail('test_fail_seat, test_fail_reserve and test_no_fallback run only in a dry regrade.');
if(TFS!==null&&panel_order.indexOf(TFS)===-1)fail('test_fail_seat "'+TFS+'" is not one of the panel ['+panel_order.join(', ')+'].');
if((TFR||TNF)&&TFS===null)fail('test_fail_reserve and test_no_fallback need test_fail_seat.');
// ALTERNATES (BB-6904 g; 7126, 7127): the alternates are the flow's own reserve judges: the seats free after the panel reserve whose
// engine family is openrouter (the family the alternate call serves), in ORDER; one per removed seat, two at most, under the guards
// already built. MiniMax is out of this publish (7126); ALT_MODELS stays only for the dry qualify path (qualify_alternate).
const ALT_MODELS={alt_minimax31:{api_model:'minimax/minimax-m3.1-flash',family:'minimax',max_tokens:64000},alt_minimax3:{api_model:'minimax/minimax-m3',family:'minimax',max_tokens:64000}};
const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter',sol:'openrouter'}; // judge_fix3 A2
const ALT_ORDER=pfree.slice(4).filter( /* judge_fix5 G12 */s=>JFAM_I[s]==='openrouter'&&s!=='grok'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0); // judge_fix3 A2
const QA=(b.qualify_alternate===undefined||b.qualify_alternate===null||b.qualify_alternate==='')?null:String(b.qualify_alternate).trim().toLowerCase();
if(QA!==null&&!DRY)fail('qualify_alternate runs only in a dry regrade.');
if(QA!==null&&!Object.keys(ALT_MODELS).some(k=>ALT_MODELS[k].api_model===QA))fail('qualify_alternate "'+QA+'" is not one of ['+Object.keys(ALT_MODELS).map(k=>ALT_MODELS[k].api_model).join(', ')+'].');
// TOPIC FENCE (WALL-0788 replies 823-837): a launch the operator overrode carries a one-use override id; Topic Fence consumes it.
const FO=(b.fence_override_id===undefined||b.fence_override_id===null||b.fence_override_id==='')?null:String(b.fence_override_id).trim();
if(FO!==null&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(FO))fail('fence_override_id "'+FO.slice(0,60)+'" is not an override id.');
const q=(b.queue_id===undefined||b.queue_id===null)?null:b.queue_id;
$execution.customData.set('defender',D.engine+'/'+D.profile);$execution.customData.set('challenger',C.engine+'/'+C.profile);
return [{json:{run_token:TOK,variant:'ORACLE_DEBATE_V1',topic:b.topic,defender:D,challenger:C,dpos,cpos,panel_order,panel_expected,panel_reserve,test_fail_seat:TFS,test_fail_reserve:TFR,test_no_fallback:TNF,alt_order:ALT_ORDER,alt_models:ALT_MODELS,qualify_alternate:QA,single_judge:free[0],queue_id:q,fence_override_id:FO,regrade:!!RG,dry:DRY,rulebook:RB,sd:new Date().toISOString().split('T')[0],t0:new Date().toISOString()}}];

