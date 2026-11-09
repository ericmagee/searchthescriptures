// ORACLE_DEBATE_V1 (BB-4607). Init Seats: mints the run token FIRST, then validates the seat
// configuration. Every refusal throws with run_token= in the message, so the Error Handler row carries it (K7).
const j0=$input.first().json;const AGR=(j0&&j0.acc&&Array.isArray(j0.acc.seats))?j0.acc:null;const j=AGR?j0.src:j0;const b=(j&&j.body&&typeof j.body==='object')?j.body:j;
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
// ruling 421 (operator, 2026-11-04: "remove deepseek as a judge and debator and make it a default enforcer"): DeepSeek never debates. A hard refusal, both seats alike.
if([b.defender,b.challenger].some(x=>x&&typeof x==='object'&&/deepseek/i.test(String(x.engine||''))))fail('DeepSeek never debates (ruling 421): it is the enforcer.');
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
const ORDER0=['chatgpt','sol','mimo','luna','qwen']; /* pkgJGR (Eric 21:10Z 11-08): gemini and grok judge no more; mimo (xiaomi/mimo-v2.6-pro) is the third panel seat (Eric 07:14Z 11-09, after the qwen flash check failed) */ /* pkgJGR rev 4 (Eric 07:27Z 11-09): luna judges only when a panel seat debates; never the reserve */ // 2026-11-06 (operator: "yes, remove GLM"): GLM judges no more, not even as alternate (33060: 1,276 s, all 131,072 tokens as reasoning, no reply, as in 32500) // ruling 421 (2026-11-04): DeepSeek judges no more (no panel, reserve, alternate or single judge seat); it is the enforcer. // 2026-11-03 (operator: "you can remove minimax from the judge list"): MiniMax M3.1 Flash judges no more (32510: all 64,000 tokens spent as reasoning, no reply); Grok takes the third panel place by the order of ruling 289 // 2026-11-03 (operator: "replace with minimax/minimax-m3.1-flash"): GLM judges no more (32500: 1,290 s, all 131,072 tokens, no judgment); MiniMax M3.1 Flash takes its place // 2026-11-03 (operator: "replace the mimo reserve ... bring back DeepSeek"): mimo judges no more (its reserve calls spent the whole 65,536-token limit in 32471 and 32482)
// posture v5 (rulings 405-407): every judge accepts the posture before the debate is judged; a judge that refuses or fails the agreement twice
// does not judge. The agreement ran before this node (Accept Build .. Accept Final); a seat not placed there is dropped from the order, so the
// panel, the reserve, the alternates and the single judge are all seats that accepted. One rule for all judges.
if(!AGR)throw new Error('ORACLE_DEBATE_V1 Init refused: the judges\' agreement did not run (Accept Final).'+RT);
const __AOK=new Set(AGR.seats.filter(x=>x.placed).map(x=>x.seat));const __AASKED=new Set(AGR.seats.map(x=>x.seat));
const AGREE_OUT=ORDER0.filter(s=>__AASKED.has(s)&&!__AOK.has(s));
const ORDER=ORDER0.filter(s=>!__AASKED.has(s)||__AOK.has(s));
const seated={};seated[D.engine]=true;seated[C.engine]=true;
// judge_fix5 G12 (operator, 2026-11-02: "remove deepseek from panel"; md_notes_rulings 366: "... leave it as the enforcer"): DeepSeek sits on no panel
// slot, reserve or alternate. The single judge, the synthesis and the diagnostic stay the first free seat of ORDER (DeepSeek unless it debates);
// the panel, the reserve and the alternates come from the panel order, ORDER without DeepSeek.
// judge_fix5 G12 correction (md_notes_rulings 362: a model over the time limit is removed "as debater and judge"): qwen sits on no panel either.
// sol (ruling 378, the operator's rank-3 choice) then fills the panel, reserve or alternate place its ORDER position gives it; a seat of the same
// family as a debater (sol and chatgpt, both openai) is skipped here, as Resolve Seats would refuse it.
const NOT_PANEL=['deepseek','qwen'];const FAM_PANEL={chatgpt:'openai',sol:'openai',luna:'openai'};const dfam=[FAM_PANEL[D.engine],FAM_PANEL[C.engine]].filter(Boolean);
const free=ORDER.filter(s=>!seated[s]);/* pkgJFL (W3 2632 part 3; Eric 17:21 CST): a seat whose model has 6 runs of one fault kind in the judge fault ledger (model_config_jfl.jfl_move) moves from the panel to the alternates: it goes to the end of the panel order, so it takes no panel place and is not the reserve while three unmoved seats remain */
const JFL_MOVED=(()=>{try{return new Set($('Accept Models').all().map(i=>i.json).filter(x=>x&&x.seat&&x.jfl_move===true).map(x=>x.seat));}catch(e){return new Set();}})();
const pfree0=free.filter(s=>NOT_PANEL.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0));const pfree=pfree0.filter(s=>!JFL_MOVED.has(s)).concat(pfree0.filter(s=>JFL_MOVED.has(s)));const panel_order=pfree.slice(0,3);
if(panel_order.length!==3)fail('NOT GRADED: the derived panel is '+panel_order.length+' seat(s) ['+panel_order.join(', ')+']; the roster is exactly three'+(AGREE_OUT.length?' (did not accept the posture: '+AGREE_OUT.join(', ')+')':'')+'.');
const panel_expected=panel_order.slice().sort();
// PANEL FALLBACK (BB-5685, BB-5693): the reserve is the next free seat after the three. The test inputs run only in a dry
// regrade and drive the substitution path on demand: test_fail_seat marks one panel seat failed; test_fail_reserve also fails
// the reserve (the second failure); test_no_fallback makes the run behave as the fallback switched off.
// judge_fix3 A2 (operator rule: "any model that can't response in the required time will be removed"; the call limit is 900 s): qwen's
// alternate calls took 981.7 s (32228), 1,194.6 s and 985.2 s (32255). It is removed from the reserve and from the alternate pool. Where qwen
// would have been the reserve, the run has no reserve (the added model, sol, serves as an alternate only).
const JUDGE_TIME_REMOVED=['qwen'];
const panel_reserve=(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0&&pfree[3]!=='luna'&&!JFL_MOVED.has(pfree[3]))?pfree[3]:null; // ruling 421: DeepSeek is no longer the reserve; the reserve is the next free panel seat after the three // 2026-11-03: DeepSeek is the reserve when it does not debate (operator: "bring back DeepSeek"); judge_fix5 G12 otherwise
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
const JFAM_I={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',alt_minimax31:'openrouter',qwen:'openrouter',sol:'openrouter',luna:'openrouter'}; // judge_fix3 A2
const ALT_ORDER=pfree.slice(3).filter( /* ruling 421: the reserve may also serve as an alternate; Alternate Build's G3 refuses it when it already sits on the panel as the reserve */  /* 2026-11-03 (journal 2057): every free panel seat after the three panel places that is not the reserve; slice(4) assumed the reserve sat at pfree[3] and left the pool empty once DeepSeek became the reserve */ /* judge_fix5 G12 *//* pkgGRA (Eric 00:03Z 11-07): grok may serve as an alternate */s=>JFAM_I[s]==='openrouter'&&s!=='mimo'&&JUDGE_TIME_REMOVED.indexOf(s)<0); // judge_fix3 A2
const QA=(b.qualify_alternate===undefined||b.qualify_alternate===null||b.qualify_alternate==='')?null:String(b.qualify_alternate).trim().toLowerCase();
if(QA!==null&&!DRY)fail('qualify_alternate runs only in a dry regrade.');
if(QA!==null&&!Object.keys(ALT_MODELS).some(k=>ALT_MODELS[k].api_model===QA))fail('qualify_alternate "'+QA+'" is not one of ['+Object.keys(ALT_MODELS).map(k=>ALT_MODELS[k].api_model).join(', ')+'].');
// TOPIC FENCE (WALL-0788 replies 823-837): a launch the operator overrode carries a one-use override id; Topic Fence consumes it.
const FO=(b.fence_override_id===undefined||b.fence_override_id===null||b.fence_override_id==='')?null:String(b.fence_override_id).trim();
if(FO!==null&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(FO))fail('fence_override_id "'+FO.slice(0,60)+'" is not an override id.');
// judge_fix8 P (JUDGE_POSTURE_DRAFT_v4 Part 7): the posture test instruments. posture (P2: the acceptance turn and the posture answer form),
// accept_probe (P3: the acceptance turn alone). Each runs only in a dry regrade on the current rulebook, one at a time, and with no other test
// input; absent, the run is unchanged.
['posture','accept_probe'].forEach(k=>{if(b[k]!==undefined&&b[k]!==null&&typeof b[k]!=='boolean')fail(k+' must be true or false.');});
// QUESTION ROUND TRIAL (md_notes_rulings 413, 415): question_trial runs only in a dry regrade; absent, the run is unchanged.
if(b.question_trial!==undefined&&b.question_trial!==null&&typeof b.question_trial!=='boolean')fail('question_trial must be true or false.');if(b.question_trial===true&&!DRY)fail('question_trial runs only in a dry regrade (md_notes_rulings 413).');
// posture v5: the posture runs on every debate, live or regrade; the old test switches are gone.
const PPO=true,PAP=false;if(b.accept_probe===true)fail('accept_probe is retired: the agreement runs on every debate (posture v5).');
$execution.customData.set('posture_accept',AGR.seats.map(x=>x.seat+':'+x.status).join(','));
const q=(b.queue_id===undefined||b.queue_id===null)?null:b.queue_id;
$execution.customData.set('defender',D.engine+'/'+D.profile);$execution.customData.set('challenger',C.engine+'/'+C.profile);
return [{json:{run_token:TOK,variant:'ORACLE_DEBATE_V1',topic:b.topic,defender:D,challenger:C,dpos,cpos,panel_order,panel_expected,panel_reserve,test_fail_seat:TFS,test_fail_reserve:TFR,test_no_fallback:TNF,alt_order:ALT_ORDER,alt_models:ALT_MODELS,qualify_alternate:QA,single_judge:(free.filter(s=>JUDGE_TIME_REMOVED.indexOf(s)<0&&!(FAM_PANEL[s]&&dfam.indexOf(FAM_PANEL[s])>=0))[0]||null), /* ruling 421: the first free seat that may judge; DeepSeek no longer */agreement_out:AGREE_OUT,jfl_moved:[...JFL_MOVED],queue_id:q,fence_override_id:FO,regrade:!!RG,dry:DRY,rulebook:RB,...(PPO?{posture:true}:{}),...(PAP?{accept_probe:true}:{}),...(b.question_trial===true?{question_trial:true}:{}),sd:new Date().toISOString().split('T')[0],t0:new Date().toISOString()}}];

