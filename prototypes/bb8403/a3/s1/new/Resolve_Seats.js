const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// Models from the ACTIVE model_config rows by seat name; no fallback model (fail closed, as the panel runner H4b).
const S=$('Init Seats').first().json;const fail=m=>{throw new Error('ORACLE_DEBATE_V1 Resolve refused: '+m+RT);};
const M={};$('Fetch Models').all().forEach(i=>{const x=i.json;if(x&&x.seat)M[x.seat]=x;});
const need=k=>{const x=M[k];if(!x)fail('seat "'+k+'" has no ACTIVE model_config row.');if(!x.api_model)fail('seat "'+k+'" has no api_model.');const mt=Number(x.max_tokens)||0;if(mt<=0)fail('seat "'+k+'" has no max_tokens.');return x;};
// Token limit: model_config max_tokens (WALL-0586 628). W1's own floors are kept where W1 applies them:
// anthropic max(mt,6000) as W1's defender; openai max(2mt,8000) as W1's challenger.
const tok=(fam,mt)=>fam==='anthropic'?Math.max(mt,6000):fam==='openai'?Math.max(mt*2,8000):mt;
const seatModel=s=>{const x=need(s.mc_seat);return {...s,model:x.api_model,tok:tok(s.fam,Number(x.max_tokens))};};
const D=seatModel(S.defender);const C=seatModel(S.challenger);
const ds=need('deepseek');
const JFAM={deepseek:'deepseek',gemini:'gemini',grok:'grok',chatgpt:'openrouter',mimo:'mimo',glm:'openrouter',qwen:'openrouter'};
const judges=S.panel_order.map(k=>{const x=need(k);return {seat:k,fam:JFAM[k],api_model:x.api_model,max_tokens:Math.max(Number(x.max_tokens)||0,4000)};});
// PANEL FALLBACK (BB-5693): the reserve judge, built as the three are; none when no seat is free or its model_config row is missing.
const reserve0=(S.panel_reserve&&M[S.panel_reserve]&&M[S.panel_reserve].api_model&&Number(M[S.panel_reserve].max_tokens)>0)?{seat:S.panel_reserve,fam:JFAM[S.panel_reserve],api_model:M[S.panel_reserve].api_model,max_tokens:Math.max(Number(M[S.panel_reserve].max_tokens)||0,4000)}:null;
// FAMILIES (BB-6993; 6998 item 4): model_config.family is the one family table, read here and by odv1_record_panel_alternates. No
// judge, reserve or alternate sits on a debate in which a model of its own family debates: a judge fails the run closed, the reserve
// is dropped, an alternate is skipped. A seat whose row has no family fails closed. Claude never judges Claude (6995).
const famOf=k=>{const x=M[k];const f=x&&x.family?String(x.family).trim().toLowerCase():'';if(!f)fail('seat "'+k+'" has no family in model_config (BB-6993).');return f;};
const debFam=[famOf(D.mc_seat),famOf(C.mc_seat)];
// MiniMax never debates (BB-6997), read here by family from model_config (7014 note 3); Init Seats' engine-name refusal stays as the first fence.
if(debFam.indexOf('minimax')>=0)fail('MiniMax never debates (BB-6997): a debater seat is of family minimax in model_config.');
S.panel_order.forEach(k=>{if(debFam.indexOf(famOf(k))>=0)fail('judge seat "'+k+'" is of family '+famOf(k)+', which debates in this debate (BB-6993).');});
if(S.single_judge&&debFam.indexOf(famOf(S.single_judge))>=0)fail('single judge seat "'+S.single_judge+'" is of family '+famOf(S.single_judge)+', which debates in this debate (BB-6993).');
const reserve=(reserve0&&debFam.indexOf(famOf(reserve0.seat))<0)?reserve0:null;
// ALTERNATES (7126, 7127): Init Seats' alt_order, each read from its ACTIVE model_config row as a judge is (max_tokens at least 4000),
// family by famOf, dropped if its family debates in this debate (6993). No MiniMax.
const alternates=(S.alt_order||[]).filter(k=>JFAM[k]==='openrouter'&&M[k]&&M[k].api_model&&Number(M[k].max_tokens)>0).map(k=>({seat:k,fam:'openrouter',api_model:M[k].api_model,max_tokens:Math.max(Number(M[k].max_tokens)||0,4000),family:famOf(k)})).filter(a=>debFam.indexOf(a.family)<0);
const debaters=[D,C].map((x,i)=>({engine:x.engine,model:x.model,family:debFam[i]}));
// GUARDS and TENSIONS exactly as W1 Init (dedupe by rule_num; the ruled filter).
const gRaw=$('Fetch Drift Guards').all().map(i=>i.json);const gSeen=new Set();const g=[];for(const x of gRaw){if(x&&x.rule_num!==undefined&&!gSeen.has(x.rule_num)){gSeen.add(x.rule_num);g.push(x);}}
const t=$('Fetch Tensions').all().map(i=>i.json).filter(x=>x&&x.item);
const guards=g.filter(x=>x.rule_num<=12||x.priority==='CRITICAL'||x.always_inject===true);const gsrc=guards.length>0?guards:g.slice(0,12);
const gt=gsrc.length>0?'\n\nACTIVE DRIFT GUARDS (full text -- your private instructions, binding on you; never name or number a guard in the debate: argue what it holds, from the text):\n'+gsrc.map(x=>'DG-'+x.rule_num+' ['+(x.priority||'?')+'] '+x.subject+': '+x.rule).join('\n\n'):'';
const tt=t.length>0?'\n\nOPEN TENSIONS:\n'+t.slice(0,10).map(x=>'- '+String(x.item).slice(0,120)+' ['+x.anchor_verse+']').join('\n'):'';
$execution.customData.set('guard_count',String(gsrc.length));
return [{json:{run_token:TOK,defender:D,challenger:C,deepseek:{api_model:ds.api_model,max_tokens:Number(ds.max_tokens)},judges,reserve,alternates,debaters,gt,tt,gl:gsrc.length}}];
