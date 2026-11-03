// judge_fix9 replay: replay8.cjs of judge_fix8, base = live cb4b94e0 (fix set 8), new = fix set 9 (judge_fix9/new), 'ruled' = new with each
// K-P item answered as ruling 398 asks (a count without the premise counted on an unproven press; a BROKEN line resting on one retracted).
// The stored presses carry a reference and a quotation only, so every stored press parses UNPROVEN by format: the figures measure the old
// format, not the debaters (PROVEN_STRUCTURE_DRAFT_v2 test 3).
// judge_fix8 replay (from judge_fix7's replay7.cjs; runs 32284, 32293, 32302; base = live cfcbb37b (judge_fix7), new = judge_fix8; 'ruled' = new with each
// K-G10 item cured by a CORRECTED COUNT without the premise, the cure the ruling asks for). From judge_fix7: Below: the judge_fix5 header: the checkers, the cure check and the recompute (F1) over the stored judgments of 32212, 32228, 32255 and 32266, base (live
// d9ec1e19) against new. Items = drvCheck + drvLedger (K-G6/K-G8) + drvBroken (K-G7) on a judge prompt rebuilt from the stored rounds (Panel Build's
// ledger, base or new; the close rounds where stored), sent through __orc as the seat's model was. Cure replies: 32255 and 32266, the seat's stored
// full reply (debate_enforcer_log); 32212 and 32228 (before the log), rebuilt from the stored audit report with one RESPONSE line per item added (+R).
// Each seat is then run as Panel Cure Check runs it (cure verdicts, CORRECTED RESULT, CORRECTED COUNT/STANDING, and in new the recompute), from the
// seat's first reply (its stored text without the audit lines), and the panel outcome is derived by the ported database rules.
const fs=require('fs');const L=require('./lib8.cjs');const RL=require('./replay_lib.cjs');const D=L.D;
const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';
const PWL=v=>{const s=fs.readFileSync(D+v+'/Panel Build.js','utf8');const r=s.indexOf('const REFP=(()=>');const e9=s.indexOf('// ======== end judge_fix9 libraries ========');const h9=e9<0?'':s.slice(0,e9);return new Function(h9+'\n'+(r>=0?s.slice(r,s.indexOf(RE_END,r)+RE_END.length):'')+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
const orcS=fs.readFileSync(D+'base/Panel Build.js','utf8').match(/const __orc=[^\n]*/)[0];const __orc=new Function(orcS+';return __orc;')();
const MODEL={deepseek:['deepseek','deepseek-flash'],gemini:['openrouter','google/gemini-3.8-flash'],chatgpt:['openrouter','openai/gpt-6.1-terra'],glm:['openrouter','z-ai/glm-5.3'],qwen:['openrouter','qwen/qwen3.8-max-0902'],sol:['openrouter','openai/gpt-6.1-sol'],single:['deepseek','deepseek-flash']};
const run=n=>{const r=JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));(r.judgments||[]).forEach(j=>{j.seat=j.seat||j.judge_seat;});return r;};
const ELOG={};['32284','32293','32302','32306','32341'].forEach(n=>ELOG[n]=JSON.parse(fs.readFileSync(D+'data/enforcer_log_'+n+'.json','utf8')));
const firstRaw=(raw,panel)=>{const s=String(raw||'');if(!panel){const i=s.indexOf('\n\n[AUDIT');return i<0?s:s.slice(0,i);}const a=s.indexOf('{');let d=0,q=false;for(let i=a;i<s.length;i++){const c=s[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return s.slice(0,i+1);}return s;};
function F_(r){return {cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4||null,dr4:r.challenger_r4||null};}
let OMIT=null;
function items(v,r,seat,J,panel){const F=F_(r);const T=[['[CR1] DEFENDER R1',F.cr1],['[DR1] CHALLENGER R1',F.gr1],['[CR2] DEFENDER R2',F.cr2],['[DR2] CHALLENGER R2',F.gr2],['[CR3] DEFENDER R3 -- LINK ROUND (defender exhibit-or-concede)',F.cr3],['[DR3] CHALLENGER R3 -- LINK ROUND (challenger exhibit-or-concede)',F.dr3]].concat(F.cr4?[['[CR4] DEFENDER R4 -- CLOSE ROUND',F.cr4]]:[],F.dr4?[['[DR4] CHALLENGER R4 -- CLOSE ROUND',F.dr4]]:[]);
 let user='DEBATE TRANSCRIPT';T.forEach(x=>user+='\n\n=== '+x[0]+' ===\n'+x[1]);const [fam,model]=MODEL[seat]||MODEL.deepseek;
 const body=__orc({model,max_tokens:64000,messages:[{role:'system',content:'RULES\n\n'+PWL(v).judgeBlock(F)},{role:'user',content:user}]},fam,model,'replay');
 const C=L.chk(v,panel?'Panel Payloads':'Extract Independent Verdict');const pt=C.drvPromptText(body);const f=J.fields;const CPV=panel?{DEFENDER:f.counted_premises_defender,CHALLENGER:f.counted_premises_challenger}:null;
 if(C.PRS_CTX&&C.ciRounds)C.PRS_CTX.R=C.ciRounds(pt); /* judge_fix9: the rounds the press parse reads (as the node sets them) */
 const d=C.drvCheck(J.text,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,false,C.drvLinks?C.drvLinks(pt):undefined);const it=d.items.slice();
 C.drvLedger(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,CPV).items.forEach(x=>it.push(x));
 C.drvBroken(J.text,f.conceded_links,f.defense_standing,it,f.challenger_conceded_links,f.challenge_standing,pt,CPV).items.forEach(x=>it.push(x));
 if(C.drvCited||C.drvPressWith){const LN={DEFENDER:C.drvLedgerN(pt,'DEFENDER'),CHALLENGER:C.drvLedgerN(pt,'CHALLENGER')};const CI=(C.drvPressWith||C.drvCited)(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,LN);CI.items.forEach(x=>it.push(x));it.pass=CI.marks.filter(m=>/K-G(?:9|10) PASS/.test(m));C.drvBlocks(J.text,pt,f.conceded_links,f.challenger_conceded_links,f.defense_standing,f.challenge_standing,CPV,LN).items.forEach(x=>it.push(x));}
 const out=OMIT?it.filter(x=>!OMIT.includes(x.rule)):it;out.pass=it.pass||[];return out;}
const addR=(rep,its,C)=>rep.ok?{ok:true,text:rep.text+'\n'+its.map(x=>'RESPONSE: '+C.cureLabel(x)+' | I accept the mark; replay line added to test the rest of the check.').join('\n')}:rep;
// one seat, as Panel Cure Check runs it (Cure Check for the single judge)
// judge_fix7: the stored panel JSON carries the fields as the cure set them; the seat's first fields are restored from its CORRECTED STANDING lines.
function seat(v,n,r,seatName,raw,panel,reply0,plusR){const raw0=firstRaw(raw,panel);const J=RL.judgment(raw0,panel);const f=J.fields;
 for(const m of String(raw).matchAll(/\[AUDIT v21: CORRECTED STANDING -- SEAT: ([^;\]]+); SIDE: (DEFENDER|CHALLENGER); ORIGINAL: ([A-Z?-]+), (\d+|\?)/g)){if(m[1]!==seatName)continue;
  if(m[2]==='DEFENDER'){if(m[3]!=='?')f.defense_standing=m[3];if(m[4]!=='?')f.conceded_links=+m[4];}else{if(m[3]!=='?')f.challenge_standing=m[3];if(m[4]!=='?')f.challenger_conceded_links=+m[4];}}
 const it=items(v,r,seatName,J,panel);const C=L.lib(v,'Panel Cure Check');const reply=RULED?ruledReply(plusR?addR(reply0,it,C):reply0,it,C,J):(plusR?addR(reply0,it,C):reply0);
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
const PLAN0={ // the panel slots in order; alt: the alternate tried for a slot when its seat is not counted
 '32212':{slots:['deepseek','gemini','chatgpt']},'32228':{slots:['qwen','gemini','chatgpt']},
 '32255':{slots:['deepseek','gemini','chatgpt'],alt:{deepseek:['qwen',e=>e.find(x=>x.id===21).full_reply]}},
 '32266':{slots:['deepseek','gemini','glm'],raw:{glm:r=>r.drv_removed[0].verdict_raw},alt:{glm:['sol',e=>e.find(x=>x.id===61).full_reply]}},
 '32284':{slots:['chatgpt','gemini','glm']},
 '32293':{slots:['gemini','glm','chatgpt'],raw:{glm:r=>r.drv_removed[0].verdict_raw},alt:{glm:['sol',e=>e.find(x=>x.id===83).full_reply]}},
 '32302':{slots:['gemini','glm','chatgpt'],alt:{glm:['sol',e=>e.find(x=>x.id===105).full_reply]}},
 '32341':{slots:['gemini','glm','chatgpt'],raw:{glm:r=>r.drv_removed[0].verdict_raw},alt:{glm:['sol',e=>e.find(x=>x.id===130).full_reply]}}}; // judge_fix9 F1: live run 32341 on fix set 8 (GLM dropped, Sol substituted) // 32284: DeepSeek's slot was judged by the reserve ChatGPT (empty reply)
const fmt=p=>p?`${p.verdict_tag||'-'} | ${p.defense_standing||'-'} ${p.conceded_links} | ${p.challenge_standing||'-'} ${p.challenger_conceded_links} | ${p.result||'-'} | drv_uncured ${p.drv_uncured}${p.trial_uncured?' (+'+p.trial_uncured+' TRIAL uncured, not counted)':''}`:'-';
module.exports={items,seat,replyOf,run,ELOG,firstRaw,F_};
// 'ruled': each K-G10 item answered as ruling 392 asks: the side's CORRECTED COUNT without the K-G10 premises and the standing it makes true,
// with a RESPONSE line; any other CORRECTED COUNT or STANDING line of that side in the stored reply is replaced. A seat with no stored cure gets these lines only.
const PLAN=PLAN0;
let RULED=false;
// judge_fix8 K5: each K-G11 line is retracted (regraded UNDERDETERMINED) beside one CORRECTED RESULT, the seat's CLAUSE tag after the retraction;
// a K-G10 standing is then computed without the retracted lines.
function ruledReply(rep,it,C,J){const k10=it.filter(x=>x.rule==='K-P'&&x.premise!=null),k11=it.filter(x=>x.rule==='K-P'&&x.premise==null); /* judge_fix9: the K-P items, answered as ruling 398 asks */if(!k10.length&&!k11.length)return rep;let t=rep&&rep.ok?(C.cureUnwrap?C.cureUnwrap(rep.text):rep.text):''; /* a reply stored as a JSON envelope is read as its text */const add=[];
 const br0=C.cureBroken(J.text);const gone=new Set(k11.map(x=>x.link.toUpperCase()));const br={DEFENDER:br0.DEFENDER.filter(l=>!gone.has(l.toUpperCase())),CHALLENGER:br0.CHALLENGER.filter(l=>!gone.has(l.toUpperCase()))};
 if(k11.length){const tag0=(String(J.text).replace(/[*_`]+/g,'').match(/CLAUSE\s*:\s*(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)/)||[])[1]||'HELD-1';const tag=tag0==='BROKEN-1'&&!br.DEFENDER.length?'HELD-1':tag0;
  t=t.split('\n').filter(l=>!/^[*`\s]*CORRECTED RESULT\s*:/i.test(l)).join('\n');
  k11.forEach(x=>{add.push('RETRACTED: '+x.link+' -- regraded UNDERDETERMINED -- the line rests, as unanswered, only on '+x.verses.join(', ')+', which the ledger marks UNPROVEN or no listed premise carries (ruling 398), and '+(x.pwNamed.length?x.pwNamed.join(', ')+' is named in [DR3]':'no verse of that list is left unanswered')+'.');
   add.push('RESPONSE: '+C.cureLabel(x)+' | I accept the mark: '+x.verses.join(', ')+' is an unproven press, so under ruling 398 it is no BROKEN ground.');});add.push('CORRECTED RESULT: '+tag);}

 for(const side of ['DEFENDER','CHALLENGER']){const xs=k10.filter(x=>x.side===side);if(!xs.length)continue;const ps=new Set(xs.map(x=>x.premise));const n=Math.max(0,(xs[0].conc||0)-ps.size);
  const st=n===0?((br[side]||[]).length?'PROP-DEPENDENT':'SELF-SUPPORTED'):((xs[0].L&&2*n>xs[0].L)?'COLLAPSED':'PROP-DEPENDENT');
  t=t.split('\n').filter(l=>!new RegExp('^[*`\\s]*CORRECTED (?:COUNT|STANDING)\\s*:\\s*'+side+'\\b','i').test(l)).join('\n');
  add.push('CORRECTED COUNT: '+side+' '+n,'CORRECTED STANDING: '+side+' '+st);
  xs.forEach(x=>add.push('RESPONSE: '+C.cureLabel(x)+' | I accept the mark: '+x.verses.join(', ')+' is an unproven press, so under ruling 398 it is not a witness; premise '+x.premise+' is no longer counted on it.'));}
 return {ok:true,text:(t?t+'\n':'')+add.join('\n')};}
const res=p=>L.resultWord(p.verdict_raw,p.seat,p.challenge_standing);
const row=(tag,p)=>`${tag.padEnd(5)} ${p.seat.padEnd(8)} ${(p.verdict_tag||'-').padEnd(7)} D ${(p.defense_standing||'-')} ${p.conceded_links} | C ${(p.challenge_standing||'-')} ${p.challenger_conceded_links} | RESULT ${p.result||'-'} | drv_uncured ${p.drv_uncured}${p.trial_uncured?' (+'+p.trial_uncured+' TRIAL)':''}`;
if(require.main===module){
const out=[];const RUNS=process.argv.slice(2).length?process.argv.slice(2):['32284','32293','32302','32306'];
for(const n of RUNS){const r=run(n);const pl=PLAN[n]||{slots:r.judged_by};const plusR=!ELOG[n];
 out.push('\n=== RUN '+n+(plusR?' (replies rebuilt from the stored report, +R)':' (stored cure replies from debate_enforcer_log)'));
 const stored=r.judgments.map(j=>({...j,result:L.resultWord(j.verdict_raw,j.seat,j.challenge_standing)}));
 out.push('STORED rows: '+stored.map(j=>j.seat+' ['+j.verdict_tag+' | D '+j.defense_standing+' '+j.conceded_links+' | C '+j.challenge_standing+' '+j.challenger_conceded_links+' | '+j.result+']').join('; '));
 out.push('STORED outcome (row): '+r.outcome+' | judged_by '+(r.judged_by||[]).join(', '));
 const seats=[...pl.slots];if(pl.alt)for(const k of Object.keys(pl.alt))seats.push(pl.alt[k][0]);
 const P={};
 for(const [v,ru] of [['base',false],['new',false],['new',true]]){RULED=ru;const tag=ru?'ruled':v;P[tag]={};
  for(const s0 of seats){let raw,reply;const alt=pl.alt&&Object.values(pl.alt).find(a=>a[0]===s0);
   if(alt){raw=alt[1](ELOG[n]);const e=ELOG[n].find(x=>x.seat===s0&&x.kind==='cure');reply=e?{ok:true,text:e.full_reply}:{ok:false,why:'no cure call'};}
   else{const j=r.judgments.find(x=>x.seat===s0);raw=pl.raw&&pl.raw[s0]?pl.raw[s0](r):(j?j.verdict_raw:null);if(!raw){out.push(tag+' '+s0+': no stored judgment');continue;}reply=replyOf(n,r,s0,raw,true);}
   const p=seat(v,n,r,s0,raw,true,reply,plusR&&!alt);p.result=res(p);P[tag][s0]=p;}
  const sj=seat(v,n,r,'single',r.independent_verdict_raw,false,replyOf(n,r,'single',r.independent_verdict_raw,false),plusR);sj.result=res(sj);P[tag].single=sj;}
 for(const s0 of seats.concat(['single'])){for(const tag of ['base','new','ruled']){const p=P[tag][s0];if(!p)continue;out.push(row(tag,p));}
  const b=P.base[s0],w=P.new[s0];if(b&&w){const gone=b.items.filter(x=>!w.items.includes(x)),add=w.items.filter(x=>!b.items.includes(x));out.push('      items base: '+(b.items.join(', ')||'none')+'\n      items new : '+(w.items.join(', ')||'none')+(gone.length||add.length?'\n      removed: '+(gone.join(', ')||'none')+' | added: '+(add.join(', ')||'none'):''));}
  const w2=P.new[s0];if(w2&&w2.unc&&w2.unc.length)out.push('      new uncured: '+w2.unc.join('; '));const z=P.ruled[s0];if(z&&z.unc&&z.unc.length)out.push('      ruled uncured: '+z.unc.join('; '));}
 // the panels: the replayed slots (an alternate counted only for a slot whose seat is not counted), and the stored panel
 for(const tag of ['base','new','ruled']){const rows=[];for(const s0 of pl.slots){const p=P[tag][s0];if(!p)continue;const alt=pl.alt&&pl.alt[s0];if(alt&&p.drv_uncured>0&&P[tag][alt[0]]&&P[tag][alt[0]].drv_uncured===0){rows.push(P[tag][alt[0]]);continue;}rows.push(p);}
  const o=L.outcome(rows);out.push(`${tag.toUpperCase()} PANEL (replayed slots): ${rows.map(x=>x.seat).join(', ')} -> ${o.panel}, ${o.outcome} | ${o.words.join(', ')}`);
  if(r.judged_by&&r.judged_by.join()!==rows.map(x=>x.seat).join()){const rs=r.judged_by.map(s0=>P[tag][s0]).filter(Boolean);const o2=L.outcome(rs);out.push(`${tag.toUpperCase()} PANEL (as stored: ${r.judged_by.join(', ')}) -> ${o2.panel}, ${o2.outcome} | ${o2.words.join(', ')}`);}}}
console.log(out.join('\n'));
}
