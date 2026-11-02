// judge_fix6 replay (from judge_fix5's replay5.cjs; runs 32293, 32284, 32266; base = live 6ff18a54, new = judge_fix6). Below: the judge_fix5 header: the checkers, the cure check and the recompute (F1) over the stored judgments of 32212, 32228, 32255 and 32266, base (live
// d9ec1e19) against new. Items = drvCheck + drvLedger (K-G6/K-G8) + drvBroken (K-G7) on a judge prompt rebuilt from the stored rounds (Panel Build's
// ledger, base or new; the close rounds where stored), sent through __orc as the seat's model was. Cure replies: 32255 and 32266, the seat's stored
// full reply (debate_enforcer_log); 32212 and 32228 (before the log), rebuilt from the stored audit report with one RESPONSE line per item added (+R).
// Each seat is then run as Panel Cure Check runs it (cure verdicts, CORRECTED RESULT, CORRECTED COUNT/STANDING, and in new the recompute), from the
// seat's first reply (its stored text without the audit lines), and the panel outcome is derived by the ported database rules.
const fs=require('fs');const L=require('./lib6.cjs');const RL=require('./replay_lib.cjs');const D=L.D;
const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';
const PWL=v=>{const s=fs.readFileSync(D+v+'/Panel Build.js','utf8');const r=s.indexOf('const REFP=(()=>');return new Function((r>=0?s.slice(r,s.indexOf(RE_END,r)+RE_END.length):'')+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
const orcS=fs.readFileSync(D+'base/Panel Build.js','utf8').match(/const __orc=[^\n]*/)[0];const __orc=new Function(orcS+';return __orc;')();
const MODEL={deepseek:['deepseek','deepseek-flash'],gemini:['openrouter','google/gemini-3.8-flash'],chatgpt:['openrouter','openai/gpt-6.1-terra'],glm:['openrouter','z-ai/glm-5.3'],qwen:['openrouter','qwen/qwen3.8-max-0902'],sol:['openrouter','openai/gpt-6.1-sol'],single:['deepseek','deepseek-flash']};
const run=n=>{const r=JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));(r.judgments||[]).forEach(j=>{j.seat=j.seat||j.judge_seat;});return r;};
const ELOG={};['32266','32284','32293'].forEach(n=>ELOG[n]=JSON.parse(fs.readFileSync(D+'data/enforcer_log_'+n+'.json','utf8')));
const firstRaw=(raw,panel)=>{const s=String(raw||'');if(!panel){const i=s.indexOf('\n\n[AUDIT');return i<0?s:s.slice(0,i);}const a=s.indexOf('{');let d=0,q=false;for(let i=a;i<s.length;i++){const c=s[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return s.slice(0,i+1);}return s;};
function F_(r){return {cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4||null,dr4:r.challenger_r4||null};}
let OMIT=null;
function items(v,r,seat,J,panel){const F=F_(r);const T=[['[CR1] DEFENDER R1',F.cr1],['[DR1] CHALLENGER R1',F.gr1],['[CR2] DEFENDER R2',F.cr2],['[DR2] CHALLENGER R2',F.gr2],['[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)',F.cr3],['[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',F.dr3]].concat(F.cr4?[['[CR4] DEFENDER R4 -- CLOSE ROUND',F.cr4]]:[],F.dr4?[['[DR4] CHALLENGER R4 -- CLOSE ROUND',F.dr4]]:[]);
 let user='DEBATE TRANSCRIPT';T.forEach(x=>user+='\n\n=== '+x[0]+' ===\n'+x[1]);const [fam,model]=MODEL[seat]||MODEL.deepseek;
 const body=__orc({model,max_tokens:64000,messages:[{role:'system',content:'RULES\n\n'+PWL(v).judgeBlock(F)},{role:'user',content:user}]},fam,model,'replay');
 const C=L.chk(v,panel?'Panel Payloads':'Extract Independent Verdict');const pt=C.drvPromptText(body);const f=J.fields;const CPV=panel?{DEFENDER:f.counted_premises_defender,CHALLENGER:f.counted_premises_challenger}:null;
 const d=C.drvCheck(J.text,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,false,C.drvLinks?C.drvLinks(pt):undefined);const it=d.items.slice();
 C.drvLedger(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,CPV).items.forEach(x=>it.push(x));
 C.drvBroken(J.text,f.conceded_links,f.defense_standing,it,f.challenger_conceded_links,f.challenge_standing,pt,CPV).items.forEach(x=>it.push(x));
 if(C.drvCited){const LN={DEFENDER:C.drvLedgerN(pt,'DEFENDER'),CHALLENGER:C.drvLedgerN(pt,'CHALLENGER')};const CI=C.drvCited(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,LN);CI.items.forEach(x=>it.push(x));it.pass=CI.marks.filter(m=>/K-G9 PASS/.test(m));C.drvBlocks(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,CPV,LN).items.forEach(x=>it.push(x));}
 const out=OMIT?it.filter(x=>!OMIT.includes(x.rule)):it;out.pass=it.pass||[];return out;}
const addR=(rep,its,C)=>rep.ok?{ok:true,text:rep.text+'\n'+its.map(x=>'RESPONSE: '+C.cureLabel(x)+' | I accept the mark; replay line added to test the rest of the check.').join('\n')}:rep;
// one seat, as Panel Cure Check runs it (Cure Check for the single judge)
function seat(v,n,r,seatName,raw,panel,reply0,plusR){const raw0=firstRaw(raw,panel);const J=RL.judgment(raw0,panel);const f=J.fields;
 const it=items(v,r,seatName,J,panel);const C=L.lib(v,'Panel Cure Check');const reply=plusR?addR(reply0,it,C):reply0;
 const p={seat:seatName,verdict_tag:f.verdict_tag||(String(J.text).match(/^\s*\**\s*(HELD|PARTIAL|BROKEN)\b/)||[])[1]||null,defense_standing:f.defense_standing,conceded_links:f.conceded_links,challenge_standing:f.challenge_standing,challenger_conceded_links:f.challenger_conceded_links,verdict_raw:raw0};
 if(!panel){const m=String(J.text).replace(/[*_`]+/g,'').match(/^\s*(?:VERDICT\s*:\s*)?(HELD|PARTIAL|BROKEN)\b/m);p.verdict_tag=m?m[1]:null;}
 let vs=[],rc=null;if(it.length){vs=C.cureVerdicts(it,reply,C.cureBroken(J.text),RL.rounds(r));p.verdict_raw+='\n'+C.cureReport(seatName,vs).join('\n');
  const cc=C.cureCorrected(reply,vs);if(cc){p.verdict_raw+='\n'+C.cureCorrLine(seatName,p.verdict_tag,cc);p.verdict_tag=cc.word;}
  const cs=C.cureSet(reply,vs);if(cs)p.verdict_raw+='\n'+C.cureSetApply(p,cs,seatName).join('\n');
  if(C.cureRecompute){const F0={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
   rc=C.cureRecompute(seatName,C.cureJText(p.verdict_raw,panel),F0,it,vs,reply);if(rc){p.verdict_raw=C.cureRewrite(p.verdict_raw,panel,rc,seatName,F0);Object.assign(p,rc.fields);}}}
 const CS=L.lib(v,'Panel Cure Check');p.drv_uncured=CS.enfUncured?CS.enfUncured(vs):vs.filter(x=>x.status!=='CURED').length;p.trial_uncured=vs.filter(x=>x.status!=='CURED').length-p.drv_uncured;p.pass=it.pass;p.items=it.map(x=>x.rule+' '+(x.link||x.side));p.unc=vs.filter(x=>x.status!=='CURED').map(x=>x.rule+' '+(x.link||x.side)+(CS.enfLive&&!CS.enfLive(x)?' [TRIAL]':'')+' ('+String(x.why||'').slice(0,110)+')');p.rc=rc;p.result=L.resultWord(p.verdict_raw,seatName,p.challenge_standing);return p;}
function replyOf(n,r,seatName,raw,panel){if(ELOG[n]){const e=ELOG[n].find(x=>x.seat===seatName&&x.kind==='cure');return e?{ok:true,text:e.full_reply}:{ok:false,why:'no cure call was made for this seat'};}
 const J=RL.judgment(raw,panel);return J.reports.length?RL.reply(J.reports):{ok:false,why:'no cure reply stored'};}
const PLAN={ // the panel slots in order; alt: the alternate tried for a slot when its seat is not counted
 '32212':{slots:['deepseek','gemini','chatgpt']},'32228':{slots:['qwen','gemini','chatgpt']},
 '32255':{slots:['deepseek','gemini','chatgpt'],alt:{deepseek:['qwen',e=>e.find(x=>x.id===21).full_reply]}},
 '32266':{slots:['deepseek','gemini','glm'],raw:{glm:r=>r.drv_removed[0].verdict_raw},alt:{glm:['sol',e=>e.find(x=>x.id===61).full_reply]}},
 '32284':{slots:['chatgpt','gemini','glm']},
 '32293':{slots:['gemini','glm','chatgpt'],raw:{glm:r=>r.drv_removed[0].verdict_raw},alt:{glm:['sol',e=>e.find(x=>x.id===83).full_reply]}}}; // 32284: DeepSeek's slot was judged by the reserve ChatGPT (empty reply)
const fmt=p=>p?`${p.verdict_tag||'-'} | ${p.defense_standing||'-'} ${p.conceded_links} | ${p.challenge_standing||'-'} ${p.challenger_conceded_links} | ${p.result||'-'} | drv_uncured ${p.drv_uncured}${p.trial_uncured?' (+'+p.trial_uncured+' TRIAL uncured, not counted)':''}`:'-';
const out=[];const BI={};
for(const n of ['32293','32284','32266']){const r=run(n);const pl=PLAN[n];const plusR=!ELOG[n];
 out.push('\n=== RUN '+n+(plusR?' (replies rebuilt from the stored report, +R)':' (stored cure replies from debate_enforcer_log)'));
 const stored=r.judgments.map(j=>({...j,result:L.resultWord(j.verdict_raw,j.seat,j.challenge_standing)}));
 out.push('STORED rows: '+stored.map(j=>j.seat+' ['+fmt(j)+']').join('; '));const so=L.outcome(stored);out.push('STORED outcome (ported rules): '+so.panel+' -> '+so.outcome+' | RESULT words '+so.words.join(', ')+' | as stored in the row: see README');
 for(const [v,om] of [['base',null],['new',null]]){OMIT=om;const rows=[];const vl=v+(om?' without '+om.join('/'):'');out.push('-- '+vl);
  for(const s0 of pl.slots){const j=r.judgments.find(x=>x.seat===s0);const raw=pl.raw&&pl.raw[s0]?pl.raw[s0](r):(j?j.verdict_raw:null);if(!raw){out.push(v+' '+s0+': no stored judgment');continue;}
   let p=seat(v,n,r,s0,raw,true,replyOf(n,r,s0,raw,true),plusR);if(v==='base')BI[n+s0]=p.items;else if(!om){const b=BI[n+s0]||[];const gone=b.filter(x=>!p.items.includes(x)),add=p.items.filter(x=>!b.includes(x));if(gone.length||add.length)out.push('     items removed: '+(gone.join(', ')||'none')+' | added: '+(add.join(', ')||'none'));}out.push(`${v.padEnd(4)} ${s0.padEnd(8)} items ${p.items.length}: [${fmt(p)}]`+'\n        items: '+(p.items.join(', ')||'none')+(p.pass&&p.pass.length?'\n        '+p.pass.join(' '):'')+(p.rc?' RECOMPUTED ('+p.rc.trig.join('; ')+')':'')+(p.unc.length?'\n        uncured: '+p.unc.join('; '):''));
   if(p.drv_uncured>0&&pl.alt&&pl.alt[s0]){const [as,get]=pl.alt[s0];const araw=get(ELOG[n]);const e=ELOG[n].find(x=>x.seat===as&&x.kind==='cure');const q=seat(v,n,r,as,araw,true,e?{ok:true,text:e.full_reply}:{ok:false,why:'no cure call'},false);
    out.push(`${v.padEnd(4)}   alternate ${as} for ${s0}, items ${q.items.length}: [${fmt(q)}]`+'\n        items: '+(q.items.join(', ')||'none')+(q.rc?' RECOMPUTED ('+q.rc.trig.join('; ')+')':'')+(q.unc.length?'\n        uncured: '+q.unc.join('; '):''));if(q.drv_uncured===0){rows.push(q);continue;}}
   rows.push(p);}
  const sj=seat(v,n,r,'single',r.independent_verdict_raw,false,replyOf(n,r,'single',r.independent_verdict_raw,false),plusR);if(v==='base')BI[n+'single']=sj.items;else if(!om){const b=BI[n+'single']||[];const gone=b.filter(x=>!sj.items.includes(x)),add=sj.items.filter(x=>!b.includes(x));if(gone.length||add.length)out.push('     single items removed: '+(gone.join(', ')||'none')+' | added: '+(add.join(', ')||'none'));}
  out.push(`${v.padEnd(4)} single   items ${sj.items.length}: [${fmt(sj)}]`+'\n        items: '+(sj.items.join(', ')||'none')+(sj.unc.length?'\n        uncured: '+sj.unc.join('; '):'')+(sj.rc?' RECOMPUTED ('+sj.rc.trig.join('; ')+')':'')+' (no vote)');
  const o=L.outcome(rows);out.push(`${vl.toUpperCase()} PANEL: ${rows.map(x=>x.seat).join(', ')} -> ${o.panel}, ${o.outcome} | RESULT words ${o.words.join(', ')}`);
  if(false){
   // F1 alone, on the panel as stored: each stored row recomputed from its own stored cure (base checkers, so no item set changes)
   const rows2=[];for(const j of r.judgments){const rawS=j.seat==='sol'?ELOG[n].find(x=>x.id===61).full_reply:j.verdict_raw;const e=ELOG[n].find(x=>x.seat===j.seat&&x.kind==='cure');
    const C=L.lib('new','Panel Cure Check');const its=ELOG[n].filter(x=>x.seat===j.seat&&x.kind==='cure').map(x=>({rule:x.rule,link:x.item,side:/CHALLENGER LINK BROKEN/.test(x.flagged_line||'')?'CHALLENGER':(/DEFENDER LINK BROKEN/.test(x.flagged_line||'')?'DEFENDER':'CHALLENGER'),line:x.flagged_line}));
    const p={seat:j.seat,verdict_tag:j.verdict_tag,defense_standing:j.defense_standing,conceded_links:j.conceded_links,challenge_standing:j.challenge_standing,challenger_conceded_links:j.challenger_conceded_links,drv_uncured:j.drv_uncured,verdict_raw:j.verdict_raw};
    if(its.length){const vs=its.map(x=>({...x,status:(ELOG[n].find(y=>y.seat===j.seat&&y.item===x.link&&y.rule===x.rule)||{}).cure_status}));const F0={...p};delete F0.seat;
     const rc=C.cureRecompute(j.seat,C.cureJText(j.verdict_raw,true),F0,its,vs,{ok:true,text:e.full_reply});if(rc){p.verdict_raw=C.cureRewrite(j.verdict_raw,true,rc,j.seat,F0);Object.assign(p,rc.fields);p.rc=rc;}}
    p.result=L.resultWord(p.verdict_raw,p.seat,p.challenge_standing);rows2.push(p);
    out.push(`F1 ON THE STORED PANEL ${j.seat.padEnd(8)}: [${fmt(p)}]`+(p.rc?' RECOMPUTED ('+p.rc.trig.join('; ')+')':' (no cure trigger)'));}
   const o2=L.outcome(rows2);out.push('F1 ON THE STORED PANEL -> '+o2.panel+', '+o2.outcome+' | RESULT words '+o2.words.join(', '));
   const dsk=rows2.find(x=>x.seat==='deepseek');out.push('DeepSeek stored text after the rewrite (lines read by the DB):\n  '+L.lib('new','Panel Cure Check').cureJText(dsk.verdict_raw,true).split('\n').filter(l=>/^(RESULT|CHALLENGE STANDING|D6 vs C4|CLAUSE)/.test(l)).map(l=>l.slice(0,230)).join('\n  ')+'\n  '+dsk.verdict_raw.split('\n').filter(l=>/RECOMPUTED AFTER CURE/.test(l)).map(l=>l.slice(0,600)).join('\n  '));}}}
console.log(out.join('\n'));
