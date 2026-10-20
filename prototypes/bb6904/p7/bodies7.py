# BB-6904 (g), step 7: the Code-node bodies and patches of the alternate path. Built on 5B (p5b/out) and portion 4 (p4).
# Text per ALTERNATES.txt (passed 6983, ruled 6981/6984). Draft only.

# Init Seats: the permanent alternates (hard-coded, 6997), MiniMax never debates, qualify_alternate (dry only). No G1 switch: G1 is
# by family, fixed (6993), and the family table is model_config.family, read by Resolve Seats.
INIT_MM_ANCHOR = "const D=seat('defender');const C=seat('challenger');"
INIT_MM_ADD = r"""// MiniMax never debates (BB-6997): its models are the permanent alternates. A hard refusal, both seats alike.
if([b.defender,b.challenger].some(x=>x&&typeof x==='object'&&/minimax/i.test(String(x.engine||''))))fail('MiniMax never debates (BB-6997): its models are the permanent alternates.');
"""
INIT_ANCHOR = "if((TFR||TNF)&&TFS===null)fail('test_fail_reserve and test_no_fallback need test_fail_seat.');"
INIT_ADD = r"""
// ALTERNATES (BB-6904 g, step 7; ruled 6997, 6998 item 3). The two MiniMax models are the permanent alternates, hard-coded, at
// maximum effort. ALT_POOL is their order, set here at publish from the qualify results (fewer uncured violations first; a tie goes
// to M3.1 Flash, 6988); a model that fails qualification is left out of ALT_POOL until fixed. qualify_alternate (dry only) takes one
// of the two ids and seats it in every panel seat of the run (6983 note 1: G3 not applied there; Record Alternates not reached).
const ALT_MODELS={alt_minimax31:{api_model:'minimax/minimax-m3.1-flash',family:'minimax'},alt_minimax3:{api_model:'minimax/minimax-m3',family:'minimax'}};
const ALT_POOL=['alt_minimax31','alt_minimax3'];
const QA=(b.qualify_alternate===undefined||b.qualify_alternate===null||b.qualify_alternate==='')?null:String(b.qualify_alternate).trim().toLowerCase();
if(QA!==null&&!DRY)fail('qualify_alternate runs only in a dry regrade.');
if(QA!==null&&!Object.keys(ALT_MODELS).some(k=>ALT_MODELS[k].api_model===QA))fail('qualify_alternate "'+QA+'" is not one of ['+Object.keys(ALT_MODELS).map(k=>ALT_MODELS[k].api_model).join(', ')+'].');"""
INIT_RET_OLD = "test_no_fallback:TNF,"
INIT_RET_NEW = "test_no_fallback:TNF,alt_pool:ALT_POOL,alt_models:ALT_MODELS,qualify_alternate:QA,"

# Resolve Seats: the family rule over every judge, the reserve and the alternates, from model_config.family (6993: one table).
RS_RES_OLD = "const reserve=(S.panel_reserve&&"
RS_RES_NEW = "const reserve0=(S.panel_reserve&&"
RS_ANCHOR = "// GUARDS and TENSIONS exactly as W1 Init"
RS_ADD = r"""// FAMILIES (BB-6993; 6998 item 4): model_config.family is the one family table, read here and by odv1_record_panel_alternates. No
// judge, reserve or alternate sits on a debate in which a model of its own family debates: a judge fails the run closed, the reserve
// is dropped, an alternate is skipped. A seat whose row has no family fails closed. Claude never judges Claude (6995).
const famOf=k=>{const x=M[k];const f=x&&x.family?String(x.family).trim().toLowerCase():'';if(!f)fail('seat "'+k+'" has no family in model_config (BB-6993).');return f;};
const debFam=[famOf(D.mc_seat),famOf(C.mc_seat)];
S.panel_order.forEach(k=>{if(debFam.indexOf(famOf(k))>=0)fail('judge seat "'+k+'" is of family '+famOf(k)+', which debates in this debate (BB-6993).');});
if(S.single_judge&&debFam.indexOf(famOf(S.single_judge))>=0)fail('single judge seat "'+S.single_judge+'" is of family '+famOf(S.single_judge)+', which debates in this debate (BB-6993).');
const reserve=(reserve0&&debFam.indexOf(famOf(reserve0.seat))<0)?reserve0:null;
// ALTERNATES (step 7): the permanent alternates from Init Seats' constants, in ALT_POOL order (6997: not read from model_config).
const AM=S.alt_models||{};const alternates=(S.alt_pool||[]).filter(k=>AM[k]).map(k=>({seat:k,fam:'openrouter',api_model:AM[k].api_model,max_tokens:32000,family:AM[k].family})).filter(a=>debFam.indexOf(a.family)<0);
const debaters=[D,C].map((x,i)=>({engine:x.engine,model:x.model,family:debFam[i]}));
"""
RS_RET_OLD = "judges,reserve,gt,tt,gl:gsrc.length}}];"
RS_RET_NEW = "judges,reserve,alternates,debaters,gt,tt,gl:gsrc.length}}];"

# Alternate Needed? (IF): a seat left with uncured items after the cure path, or a qualify run.
ALT_NEED = "={{ ($json.bodies||[]).some(b=>{try{return (JSON.parse(b).payload.drv_uncured||0)>0;}catch(e){return false;}}) || !!$('Init Seats').first().json.qualify_alternate }}"

ALT_BUILD = r"""
// One item per seat that needs an alternate, in panel order; each item either carries a call or a skip with its reason.
const PP=$input.first().json;const P=$('Panel Build').first().json;const S=$('Init Seats').first().json;const RS=$('Resolve Seats').first().json;
let R=null;try{if($('Reserve Build').isExecuted)R=$('Reserve Build').first().json;}catch(e){R=null;}
const QA=S.dry===true&&S.qualify_alternate?S.qualify_alternate:null;
const pool=(RS.alternates||[]);const deb=(RS.debaters||[]);
const pay=PP.bodies.map(b=>JSON.parse(b).payload);
const used=[];const out=[];
pay.forEach((p,i)=>{if(!QA&&!((p.drv_uncured||0)>0))return;
 const sum=(PP.summary||[])[i]||{};const src=(sum.substitute&&R)?R:(P.judges||[])[i];
 const base={idx:i,removed_seat:p.judge_seat,removed_api_model:p.judge_api_model,qualify:!!QA};
 const why=a=>{if(deb.some(d=>d.model===a.api_model||d.family===a.family))return 'G1 (family, 6993): '+a.family+' debates in this debate';
  if(a.api_model===p.judge_api_model)return 'G2: '+a.api_model+' is the model of the seat it replaces';
  if(!QA&&pay.some(q=>q.judge_api_model===a.api_model))return 'G3: '+a.api_model+' already sits on this panel';
  if(!QA&&used.indexOf(a.api_model)>=0)return 'G3: '+a.api_model+' already sits as the other alternate';return null;};
 // A qualify run seats the named one of the two constants (6988, 6997).
 const AM=S.alt_models||{};const qk=QA?Object.keys(AM).find(k=>AM[k].api_model===QA):null;
 const cand=QA?(qk?[{seat:qk,fam:'openrouter',api_model:AM[qk].api_model,max_tokens:32000,family:AM[qk].family}]:[]):pool;const reasons=[];let a=null;
 for(const c of cand){const w=why(c);if(w){reasons.push(c.seat+' '+w);continue;}a=c;break;}
 if(!a){out.push({json:{alt:{...base,skip:'no pool model passes the guards'+(reasons.length?': '+reasons.join('; '):(cand.length?'':' (the pool is empty)'))}}});return;}
 let SYS=null,user=null;try{const b0=src.body;if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[0].parts[0].text;}else{SYS=b0.messages[0].content;user=b0.messages[1].content;}}catch(e){SYS=null;}
 if(typeof SYS!=='string'||typeof user!=='string'||!SYS||!user){out.push({json:{alt:{...base,skip:'the removed seat\'s rulebook and transcript could not be read'}}});return;}
 used.push(a.api_model);
 // A fresh read: the removed seat's own system and user text only; never its answer, report lines or cure exchange (6904 g).
 const body={model:a.api_model,max_tokens:a.max_tokens,reasoning:{effort:'max'},messages:[{role:'system',content:SYS},{role:'user',content:user}]};
 out.push({json:{alt:{...base,seat:QA?a.seat+'_q'+(i+1):a.seat,pool_seat:a.seat,api_model:a.api_model,max_tokens:a.max_tokens,body}}});});
// Either every item is a call or there is one skip item (an IF routes per item, so a mix would fire both branches and run the
// join twice); every item carries the skips, which Alternate Merge records.
const calls=out.filter(x=>!x.json.alt.skip),skips=out.filter(x=>x.json.alt.skip).map(x=>x.json.alt);
if(calls.length)return calls.map(x=>({json:{...x.json,skips}}));
return [{json:{alt:{idx:null,skip:skips.length?'no seat has an alternate':'no seat needs an alternate'},skips}}];
"""

# Alternate Calls? (IF): any item with a call. True -> Alternate Call openrouter; false -> Alternate Merge (skips recorded there).
ALT_CALLS = "={{ !$json.alt.skip }}"

# Alternate Payloads: Panel Payloads' helpers (its code before "const bodies=[]", portion 3 + 5B) with a driver that never throws:
# an unreadable or out-of-set answer leaves that seat uncounted (6904 g), it does not fail the run.
ALT_PAY_DRIVER = r"""
const ALTB=$('Alternate Build').all().map(x=>x.json.alt).filter(a=>a&&!a.skip);
const callOut=$input.all().map(x=>x.json);
const out=ALTB.map((a,k)=>{const raw=callOut[k];const res={alt:a,ok:false,why:null,body:null,summary:null,drv:[]};
 try{if(!raw)throw new Error('no call output');if(raw.error){const e=raw.error;throw new Error('call failed: '+String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e))).slice(0,200));}
  const env=envelope(a.seat,raw);const v=verdict(a.seat,env.text);
  if(TAGS.indexOf(v.verdict_tag)===-1)throw new Error('verdict_tag "'+v.verdict_tag+'" outside the closed set');
  if(STAND.indexOf(v.defense_standing)===-1)throw new Error('defense_standing "'+v.defense_standing+'" outside the closed set');
  if(STAND.indexOf(v.challenge_standing)===-1)throw new Error('challenge_standing "'+v.challenge_standing+'" outside the closed set');
  const p={debate_id:P.debate_id,judge_seat:a.seat,judge_api_model:a.api_model,verdict_raw:env.text,verdict_tag:v.verdict_tag,defense_standing:v.defense_standing,challenge_standing:v.challenge_standing,conceded_links:intOrFail(a.seat,'conceded_links',v.conceded_links),challenger_conceded_links:intOrFail(a.seat,'challenger_conceded_links',v.challenger_conceded_links),finish_reason:env.finish};
  const marks=[];if(p.defense_standing==='SELF-SUPPORTED'&&p.conceded_links>0)marks.push('[AUDIT v1: DEFENSE SELF-SUPPORTED WITH '+p.conceded_links+' CONCEDED LINKS. REVIEW THIS ROW.]');
  if(p.challenge_standing==='SELF-SUPPORTED'&&p.challenger_conceded_links>0)marks.push('[AUDIT v1: CHALLENGE SELF-SUPPORTED WITH '+p.challenger_conceded_links+' CHALLENGER CONCEDED LINKS. REVIEW THIS ROW.]');
  const offKey=v.reasoning==null&&v.reason!=null;const WT=offKey?v.reason:v.reasoning;
  for(const x of k2Marks(WT))marks.push(x);for(const x of k3Marks(WT,p.defense_standing,p.challenge_standing))marks.push(x);
  if(offKey)marks.push('[AUDIT v1: WORKED TEXT KEYED "reason", NOT "reasoning"; READ UNDER "reason". REVIEW THIS ROW.]');
  for(const x of sameModelMarks(p,WT))marks.push(x);
  let drvAsk=false;try{drvAsk=JSON.stringify(a.body||{}).includes('CITATION CHECK');}catch(e){drvAsk=false;}
  const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk);for(const x of DRV.marks)marks.push(x);
  p.drv_uncured=DRV.items.length; // 5B fail-closed: the cure check below lowers it
  marks.push('[AUDIT v21: ALTERNATE JUDGE -- SEAT: '+a.seat+'; REPLACES: '+a.removed_seat+'; MODEL: '+a.api_model+(a.qualify?'; QUALIFY RUN':'')+']');
  p.verdict_raw=p.verdict_raw+'\n\n'+marks.join('\n');
  res.ok=true;res.body=JSON.stringify({payload:p});res.drv=DRV.items;res.summary={seat:a.seat,node:'Alternate Call openrouter',api_model:a.api_model,verdict_tag:p.verdict_tag,raw_chars:env.text.length,finish_reason:p.finish_reason,flags:marks.length,drv:DRV.items,substitute:false,alternate_of:a.removed_seat};}
 catch(e){res.why=String(e.message||e).replace(/^FAIL-CLOSED:\s*/,'').slice(0,300);}
 return {json:res};});
return out.length?out:[{json:{alt:null,ok:false,why:'no alternate call'}}];
"""

# Alternate Cure Needed? (IF): an alternate answered and carries items.
ALT_CURE_NEED = "={{ $('Alternate Payloads').all().some(x=>x.json.ok&&(x.json.drv||[]).length>0) }}"

# Alternate Cure Build (AMEND 4, 6980): the alternate's own request (Alternate Build) and its own answer, the same cure ask.
ALT_CURE_BUILD = r"""
const out=[];
$('Alternate Payloads').all().map(x=>x.json).forEach((r,k)=>{if(!r.ok||!(r.drv||[]).length)return;const a=r.alt;
 let answer=null,wt=null;try{const vr=JSON.parse(r.body).payload.verdict_raw;const j=vr.indexOf('\n\n[AUDIT v');answer=j>=0?vr.slice(0,j):vr;}catch(e){answer=null;}
 try{const o=JSON.parse(answer);wt=(o.reasoning!=null?o.reasoning:o.reason);}catch(e){wt=answer;}
 if(typeof answer!=='string')return;
 out.push({json:{cure:{who:'alternate',k,idx:a.idx,seat:a.seat,fam:'openrouter',model:a.api_model,items:r.drv,broken:cureBroken(wt),rounds:cureRounds(a.body),body:cureBody('openrouter',a.body,answer,cureAsk(r.drv,cureBroken(wt)))}}});});
if(!out.length)out.push({json:{cure:{who:'alternate',skip:'no alternate to cure',items:[]}}});
return out;
"""

# Alternate Merge: the alternates that passed take their seats; every removed ruling is kept for drv_removed; the panel item goes on
# in Panel Payloads' shape, so Write Judgment, Derive Outcome, Panel Done, Replay Rows and Record Substitution read it unchanged.
ALT_MERGE = r"""
const PP=$('Panel Cure Check').first().json;const S=$('Init Seats').first().json;
let AP=[],CN=[];
try{if($('Alternate Payloads').isExecuted)AP=$('Alternate Payloads').all().map(x=>x.json).filter(x=>x&&x.alt);}catch(e){AP=[];}
try{if($('Alternate Cure Normalize').isExecuted)CN=$('Alternate Cure Normalize').all().map(x=>x.json);}catch(e){CN=[];}
const bodies=PP.bodies.slice();const summary=(PP.summary||[]).map(s=>({...s}));const removed=[];const tried=[];const seated=[];const at=new Date().toISOString();
let SK=[];try{if($('Alternate Build').isExecuted)SK=$('Alternate Build').first().json.skips||[];}catch(e){SK=[];}
SK.forEach(a=>tried.push({removed_seat:a.removed_seat,alternate:null,result:'NOT SEATED',why:a.skip}));
AP.forEach((r,k)=>{const a=r.alt;if(!r.ok){tried.push({removed_seat:a.removed_seat,alternate:a.seat,api_model:a.api_model,result:'NOT SEATED',why:r.why});return;}
 const b=JSON.parse(r.body);let v=[];
 if((r.drv||[]).length){const c=CN.find(x=>x.cure&&x.cure.who==='alternate'&&x.cure.k===k)||null;
  v=cureVerdicts(r.drv,c?c.reply:{ok:false,why:'no cure call was made for this alternate'},c&&c.cure?c.cure.broken:null,c&&c.cure?c.cure.rounds:null);
  b.payload.drv_uncured=v.filter(x=>x.status!=='CURED').length;b.payload.verdict_raw=b.payload.verdict_raw+'\n'+cureReport(a.seat,v).concat(cureProse(a.seat,c?c.reply:null)).join('\n');}
 const ok=a.qualify||b.payload.drv_uncured===0;
 if(!ok){tried.push({removed_seat:a.removed_seat,alternate:a.seat,api_model:a.api_model,result:'NOT SEATED',why:b.payload.drv_uncured+' uncured item(s)',verdict_raw:b.payload.verdict_raw});return;}
 const old=JSON.parse(bodies[a.idx]).payload;
 removed.push({seat:old.judge_seat,api_model:old.judge_api_model,verdict_tag:old.verdict_tag,defense_standing:old.defense_standing,challenge_standing:old.challenge_standing,drv_uncured:old.drv_uncured,verdict_raw:old.verdict_raw,replaced_by:a.seat,replaced_by_model:a.api_model,at});
 bodies[a.idx]=JSON.stringify(b);summary[a.idx]={...r.summary,cure:v.map(x=>({rule:x.rule,side:x.side,link:x.link,status:x.status,kinds:x.kinds,why:x.why}))};
 seated.push({removed_seat:old.judge_seat,alternate_seat:a.seat,alternate_api_model:a.api_model});
 tried.push({removed_seat:a.removed_seat,alternate:a.seat,api_model:a.api_model,result:'SEATED'});});
const panel_effective=summary.map(x=>x.seat).sort();
return [{json:{...PP,bodies,summary,panel_effective,alternates_seated:S.qualify_alternate?[]:seated,drv_removed:S.qualify_alternate?[]:removed,alternates_tried:tried,qualify_alternate:S.qualify_alternate||null}}];
"""

# Panel Done: Record Alternates must have accepted the seating before the judgments were written.
PD_ANCHOR = "const d=$input.first().json||{};"
PD_ADD = r"""// ALTERNATES (step 7): the seating record must have been accepted before the judgments were written.
let RAL=null;try{RAL=$('Record Alternates').first().json;}catch(e){RAL=null;}
if(!RAL||RAL.ok!==true)throw new Error('FAIL-CLOSED: Record Alternates did not return ok: '+JSON.stringify(RAL).slice(0,300)+RT);
if((P.alternates_seated||[]).length&&RAL.written!==true)throw new Error('FAIL-CLOSED: alternates were seated but Record Alternates did not write them.'+RT);
"""
