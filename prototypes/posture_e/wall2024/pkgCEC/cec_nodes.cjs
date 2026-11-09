// pkgCEC (W1, item A of Wall 3714, wording 3718): the closing contradiction enforcer and the default break.
// The code of the three new Code nodes, the text added to Panel Build and Build Independent Verdict, and the library substitutions.
// The operator's rule (14:31 and 14:42 CST 11-09): a contradiction in the closing round, once confirmed, breaks the chain link by default;
// a withdrawal after the contradiction does not undo it; the withdrawal rules that already stand still stand.

// ---- shared by Build and Record (inlined in each) ----
const COMMON = String.raw`const CEC_RK={CR1:'cr1',CR2:'cr2',CR3:'cr3',CR4:'cr4',DR1:'gr1',DR2:'gr2',DR3:'dr3',DR4:'dr4'};
const CEC_PRE={DEFENDER:'CR',CHALLENGER:'DR'};
const cecN=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_${'`'}\[\]]/g,'').replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
/* a quotation stands when its words are found in the round named (case, quote marks, markdown and punctuation ignored); an ellipsis inside it: every part of five words or more must stand */
const cecStands=(q,T)=>{const x=cecN(q);if(x.split(' ').length<3)return false;if(T.includes(x))return true;const parts=String(q).split(/\.\.\.|…/).map(cecN).filter(p=>p.split(' ').length>=5);return parts.length>1&&parts.every(p=>T.includes(p));};
/* declared links: the defender's DECLARED CHAIN in [CR1] (as Panel Build reads it), the challenger's LINK blocks in [DR3] */
const cecDeclared=F=>{const t=String(F&&F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const a=t.lastIndexOf('\n',i)+1;const L=t.slice(a).split('\n');const out=[L[0]];let on=false,pre=0;
 for(const l of L.slice(1)){const num=/^\s*\**\s*\d+[.)]\s+\S/.test(l);if(num){on=true;out.push(l);continue;}if(!on){if(l.trim()){if(/^\s*#/.test(l)||++pre>3)break;}out.push(l);continue;}
  if(!l.trim()||/^\s+\S/.test(l)||/^\s*[-*•]\s/.test(l)){out.push(l);continue;}break;}
 return out.join('\n').replace(/\s+$/,'');};
const cecDlinks=F=>{const t=cecDeclared(F);if(!t)return [];const L=[];let cur=null;for(const l of t.split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(.*)$/);if(m){cur={n:+m[1],text:m[2]};L.push(cur);continue;}if(cur&&l.trim())cur.text+=' '+l.trim();}return L;};
const cecCblocks=F=>{const t=String(F&&F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index,head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim()});return H.map(x=>({n:x.n,head:x.head}));};
const cecLinks=F=>({DEFENDER:[...new Set(cecDlinks(F).map(x=>x.n))],CHALLENGER:[...new Set(cecCblocks(F).map(x=>x.n))]});
/* item B (W4): the Oracle's OPPONENT'S CONTRADICTIONS section in [DR4]; each line names the defender: X<n> LINK <n> (or PREMISE <n>) | EARLIER [<round>] "<...>" | CLOSING [CR4] "<...>" | <why> */
const cecOracle=F=>{const t=String(F&&F.dr4||'');const i=t.search(/OPPONENT['’]S CONTRADICTIONS\s*:?/i);if(i<0)return [];const out=[];
 for(const l of t.slice(i).split('\n').slice(1,60)){const s=l.replace(/[*_]+/g,'').trim();if(!s)continue;const m=s.match(/^(?:[-•]\s*)?(X\d+)\s+(LINK|PREMISE)\s+(\d+)\s*\|\s*EARLIER\s*\[\s*([CD]R\d)\s*\]\s*["“](.+?)["”]\s*\|\s*CLOSING\s*\[\s*([CD]R\d)\s*\]\s*["“](.+?)["”]\s*(?:\|\s*(.*))?$/i);
  if(m){out.push({id:m[1].toUpperCase(),side:'DEFENDER',by:'the Oracle (OPPONENT\'S CONTRADICTIONS, [DR4])',kind:m[2].toUpperCase(),n:+m[3],earlier_round:m[4].toUpperCase(),earlier_q:m[5],closing_round:m[6].toUpperCase(),closing_q:m[7],why:(m[8]||'').trim()});continue;}
  if(/^#|^[A-Z][A-Z' ]{6,}:/.test(s)&&out.length)break;}
 return out;};
`;

// ---- the enforcer's prompt (A2, with the re-assertion sentence added in rev 1 of the wording; see README) ----
const PROMPT = "You are the closing enforcer. A debater's closing round may not contradict what the same debater stated in its earlier rounds.\n"
 + "Read each side's closing round against that side's own earlier rounds. List every sentence of the closing round that cannot be true together with a sentence the same side stated earlier, and answer every candidate listed below.\n"
 + "A contradiction is two statements of the same side that cannot both be true. A closing sentence that asserts again, as the side's own, what the same side withdrew, dropped or gave up in an earlier round IS a contradiction.\n"
 + "It is NOT a contradiction when the closing sentence: grants, concedes, narrows or withdraws something (those are read under their own rules); states the other side's position or quotes it; answers a press with a further reason that the earlier sentence leaves room for; or differs only in wording.\n"
 + "For each contradiction, quote both sentences word for word, each from the round it stands in, and name the link it belongs to: the link whose block in the closing round holds the closing sentence, or, where the block names no link, the link the earlier sentence supports. The defender's links are the numbers of its DECLARED CHAIN in [CR1]; the challenger's links are the numbers of its LINK blocks in [DR3].\n"
 + "Reply with one line per contradiction and one line per candidate, and nothing else:\n"
 + "CLOSE-CONTRADICTION: <candidate id or NEW> -- <DEFENDER|CHALLENGER> -- LINK <n> -- CONFIRMED | NOT A CONTRADICTION -- EARLIER [<round>] \"<words>\" -- CLOSING [<round 4>] \"<words>\" -- <one sentence: why both cannot be true, or why they can>\n"
 + "If you find no contradiction and there is no candidate, reply with the one line: CLOSE-CONTRADICTION: NONE";

const SYS = 'You check each debater against its own earlier words. You bring nothing from outside the words given to you: no doctrine, no training knowledge, no reading of your own. You do not judge who is right, and you do not judge one side by the other side\'s words.';

const BUILD = String.raw`// pkgCEC (W1, item A of Wall 3714): CLOSE ENFORCER BUILD. One DeepSeek call after both closing rounds and before any judge (single judge and panel).
// It gives the enforcer each side's four rounds in full, each side's declared links, and every candidate already named (item B: the Oracle's
// OPPONENT'S CONTRADICTIONS lines in [DR4]). Close Enforcer Record confirms each answer by code. Nothing here changes a grade.
` + COMMON + String.raw`const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F=null;try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F=null;}
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
const miss=F?['cr1','cr2','cr3','cr4','gr1','gr2','dr3','dr4'].filter(k=>!String(F[k]||'').trim()):['all rounds'];
if(!F||!ds||F&&(!String(F.cr4||'').trim()&&!String(F.dr4||'').trim()))return [{json:{cec_skip:true,why:!F?'no rounds found':!ds?'no DeepSeek model_config row':'no closing round',run_token:S.run_token}}];
const links=cecLinks(F);const cands=cecOracle(F);
const PROMPT=` + JSON.stringify(PROMPT) + String.raw`;
const R=(lab,k)=>'=== ['+lab+'] ===\n'+(String(F[k]||'').trim()||'(no text)');
const lk=sd=>links[sd].length?links[sd].map(n=>(sd==='DEFENDER'?'D':'C')+n+' = LINK '+n).join(', '):'(none read)';
const cl=cands.length?cands.map(c=>c.id+' -- '+c.side+' -- '+c.kind+' '+c.n+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+c.closing_q+'" -- named by '+c.by+(c.why?': '+c.why:'')).join('\n'):'none';
const user=PROMPT+'\n\nCANDIDATES ALREADY NAMED (answer each one by its id):\n'+cl
 +'\n\n######## THE DEFENDER ########\nThe defender\'s links: '+lk('DEFENDER')+' (its DECLARED CHAIN in [CR1]). Its closing round is [CR4].\n\n'+[['CR1','cr1'],['CR2','cr2'],['CR3','cr3'],['CR4 -- THE DEFENDER\'S CLOSING ROUND','cr4']].map(x=>R(x[0],x[1])).join('\n\n')
 +'\n\n######## THE CHALLENGER ########\nThe challenger\'s links: '+lk('CHALLENGER')+' (its LINK blocks in [DR3]). Its closing round is [DR4].\n\n'+[['DR1','gr1'],['DR2','gr2'],['DR3','dr3'],['DR4 -- THE CHALLENGER\'S CLOSING ROUND','dr4']].map(x=>R(x[0],x[1])).join('\n\n');
const body={model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:'` + SYS.replace(/'/g, "\\'") + String.raw`'},{role:'user',content:user}]};
return [{json:{cec_skip:false,body,links,cands,missing_rounds:miss,model:ds.api_model,run_token:S.run_token}}];`;

const RECORD = String.raw`// pkgCEC (W1, item A of Wall 3714): CLOSE ENFORCER RECORD. Reads the enforcer's CLOSE-CONTRADICTION lines and confirms each CONFIRMED line by code:
// both quotations found word for word in the rounds named; the earlier round one of that side's rounds 1 to 3; the closing round that side's round 4;
// the link one of that side's declared links. Any other CONFIRMED line is recorded NOT CONFIRMED (form) and has no effect. A confirmed contradiction
// is shown to every judge (Panel Build, Build Independent Verdict) and breaks its link in every seat's recompute (library: cureRecompute).
` + COMMON + String.raw`const B=$('Close Enforcer Build').first().json;const RT=B.run_token||null;
const log=(o)=>({run_token:RT,seat:'close enforcer',seat_role:'enforcer',judge_model:B.model||null,kind:'enforcer_check',rule:'E-CLOSECON',reply_error:null,cure_status:null,...o});
if(B.cec_skip)return [{json:{cec:{skipped:true,why:B.why||'',confirmed:[],rows:[],no_answer:[],errors:[]},cec_log:[log({item:'SKIPPED',flagged_line:null,prompt_sent:null,full_reply:null,response_line:null,cure_status:'NOT CHECKED',cure_reason:'the closing enforcer did not run: '+(B.why||'unknown'),reply_error:B.why||null})]}}];
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}
let F={};try{F=RGL?RGL.f:$('Final Output').first().json;}catch(e){F={};}
const links=B.links||cecLinks(F);const cands=B.cands||[];const prompt=(((B.body||{}).messages||[])[1]||{}).content||null;
const r=$input.first().json||{};let txt=null,err=null;try{txt=String(r.choices[0].message.content||'');}catch(e){err='no reply ('+String((r.error&&(r.error.message||r.error))||r.message||'unknown').slice(0,200)+')';}
const LN=/^[\s>*_-]*CLOSE-CONTRADICTION\s*:\s*\**\s*(X\d+|NEW\s*\d*)\s*\**\s*--\s*(DEFENDER|CHALLENGER)\s*--\s*LINK\s*(\d+)\s*--\s*(CONFIRMED|NOT A CONTRADICTION)\s*--\s*EARLIER\s*\[?\s*([CD]R\d)\s*\]?\s*["“](.*?)["”]\s*--\s*CLOSING\s*\[?\s*([CD]R\d)\s*\]?\s*["“](.*?)["”]\s*(?:--\s*(.*?))?[\s*_]*$/i;
const rows=[],errors=[];if(err)errors.push(err);let none=false;
for(const line of String(txt||'').split('\n')){const s=line.trim();if(!s)continue;if(/^[\s>*_-]*CLOSE-CONTRADICTION\s*:\s*\**\s*NONE\b/i.test(s)){none=true;continue;}
 const m=s.match(LN);if(!m){if(/CLOSE-CONTRADICTION/i.test(s))rows.push({id:'?',line:s.slice(0,600),answer:'UNREADABLE',status:'NOT CONFIRMED (form)',note:'the line is not in the CLOSE-CONTRADICTION form'});continue;}
 const side=m[2].toUpperCase(),P=CEC_PRE[side];const row={id:m[1].replace(/\s+/g,'').toUpperCase(),side,link:+m[3],answer:m[4].toUpperCase(),earlier_round:m[5].toUpperCase(),earlier_q:m[6],closing_round:m[7].toUpperCase(),closing_q:m[8],why:(m[9]||'').trim(),line:s.slice(0,1200)};
 if(row.answer==='CONFIRMED'){const f=[];
  if(!(row.earlier_round.startsWith(P)&&/[123]$/.test(row.earlier_round)))f.push('the earlier round '+row.earlier_round+' is not one of the '+side.toLowerCase()+'\'s rounds 1 to 3');
  if(row.closing_round!==P+'4')f.push('the closing round '+row.closing_round+' is not the '+side.toLowerCase()+'\'s round 4 ('+P+'4)');
  if(CEC_RK[row.earlier_round]&&!cecStands(row.earlier_q,cecN(F[CEC_RK[row.earlier_round]])))f.push('the earlier quotation is not found word for word in '+row.earlier_round);
  if(CEC_RK[row.closing_round]&&!cecStands(row.closing_q,cecN(F[CEC_RK[row.closing_round]])))f.push('the closing quotation is not found word for word in '+row.closing_round);
  if(!(links[side]||[]).includes(row.link))f.push('LINK '+row.link+' is not one of the '+side.toLowerCase()+'\'s declared links ('+((links[side]||[]).join(', ')||'none read')+')');
  row.status=f.length?'NOT CONFIRMED (form)':'CONFIRMED';if(f.length)row.note=f.join('; ');}
 else row.status='NOT A CONTRADICTION';
 rows.push(row);}
/* one break per side and link: the first confirmed line keeps it; a repeat is recorded */
const seen=new Set();const confirmed=[];for(const x of rows){if(x.status!=='CONFIRMED')continue;const k=x.side+' '+x.link;if(seen.has(k)){x.note='the same link is already broken by an earlier confirmed line';continue;}seen.add(k);
 confirmed.push({id:x.id,side:x.side,link:x.link,earlier_round:x.earlier_round,earlier_q:x.earlier_q,closing_round:x.closing_round,closing_q:x.closing_q,why:x.why});}
const answered=new Set(rows.map(x=>x.id));const no_answer=cands.map(c=>c.id).filter(id=>!answered.has(id));
if(txt!=null&&!rows.length&&!none)errors.push('the reply holds no CLOSE-CONTRADICTION line');
const cec_log=rows.map((x,i)=>log({item:x.id+(x.side?' '+x.side+' LINK '+x.link:''),flagged_line:x.closing_q!=null?x.side+' '+x.closing_round+': "'+x.closing_q+'"':null,prompt_sent:i===0?prompt:'[SAME prompt_sent AS the first E-CLOSECON row]',full_reply:i===0?txt:'[SAME full_reply AS the first E-CLOSECON row]',response_line:x.line,cure_status:x.status,cure_reason:(x.note?x.note+' -- ':'')+(x.why||'')}))
 .concat(no_answer.map(id=>log({item:id,flagged_line:null,prompt_sent:null,full_reply:null,response_line:null,cure_status:'NO ANSWER',cure_reason:'the enforcer did not answer this candidate'})))
 .concat(!rows.length?[log({item:none?'NONE':'NO LINE',flagged_line:null,prompt_sent:prompt,full_reply:txt,response_line:none?'CLOSE-CONTRADICTION: NONE':null,cure_status:none?'NONE FOUND':'NOT CHECKED',cure_reason:errors.join('; ')||null,reply_error:err})]:[]);
return [{json:{cec:{skipped:false,model:B.model||'',confirmed,rows,no_answer,none,errors,links},cec_log}}];`;

// ---- shown to the judges: added after the close-round anti-cheat marks in Panel Build and Build Independent Verdict ----
const SHOW_FN = String.raw`const __CEC=sd=>{try{if(!$('Close Enforcer Record').isExecuted)return '';const C=$('Close Enforcer Record').first().json.cec||{};const SD=sd==='D'?'DEFENDER':'CHALLENGER';const L=(C.confirmed||[]).filter(x=>x&&x.side===SD);if(!L.length)return '';
 return '\n\n[CONFIRMED CLOSING CONTRADICTIONS -- found by the system\'s closing enforcer and confirmed by code, not by a judge (the contradiction rule: a debater that contradicts in its closing round what it stated in its own earlier round has its chain link BROKEN by default; a withdrawal after it does not undo it).'+L.map(x=>'\n- '+SD+' LINK '+x.link+' ('+sd+x.link+'): the closing round ['+x.closing_round+'] says: "'+String(x.closing_q).slice(0,500)+'". The same side said in ['+x.earlier_round+']: "'+String(x.earlier_q).slice(0,500)+'". This link is BROKEN by the contradiction rule; the system sets every collision line of '+sd+x.link+' to '+SD+' LINK BROKEN after you judge.').join('')+'\nGrade every collision line as usual on its arguments, these links included; do not write a grade for the contradiction itself.]';}catch(e){return '';}};
`;

// ---- library: read the confirmed contradictions (no Close Enforcer Record, or none confirmed: []) ----
const LIB_FN = String.raw`function cecBroken2024(){try{const n=$('Close Enforcer Record');if(!n||!n.isExecuted)return [];const j=n.first().json;const L=(j&&j.cec&&j.cec.confirmed)||[];
 return L.filter(x=>x&&(x.side==='DEFENDER'||x.side==='CHALLENGER')&&Number.isInteger(+x.link)&&+x.link>=1).map(x=>({...x,link:+x.link})).sort((a,b)=>(a.side===b.side?a.link-b.link:a.side==='DEFENDER'?-1:1));}catch(e){return [];}} /* pkgCEC */
function cecLine2024(c,x){const q=t=>{t=String(t||'').replace(/\s+/g,' ').trim().replace(/"/g,"'");return t.length>300?t.slice(0,297)+'...':t;};const par=(String(c.raw||'').match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0];
 return c.link+(par?' '+par:'')+': '+x.side+' LINK BROKEN -- [AUDIT: LINK '+x.link+' BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- '+x.side+' -- EARLIER ['+x.earlier_round+'] "'+q(x.earlier_q)+'" -- CLOSING ['+x.closing_round+'] "'+q(x.closing_q)+'"]';} /* pkgCEC */
`;

// inserted in cureRecompute after the RETRACTED and RESTATED loops, before pkgCRG: every collision line of a link broken by a confirmed closing
// contradiction is read as <SIDE> LINK BROKEN, whatever the judge or the cure gave it. A line both sides' breaks reach keeps the defender's break
// (the defender's chain decides the verdict); the challenger's break on it is named in the trigger. A broken link with no collision line still counts.
const LIB_STEP = String.raw` const __cecX={DEFENDER:0,CHALLENGER:0};for(const x of cecBroken2024()){const G=x.side+' LINK BROKEN';const lb=(x.side==='DEFENDER'?'D':'C')+x.link;let hit=0;
  for(const c of col){const m=U(c.link).match(/^D(\d+) VS C(\d+)$/);if(!m||(x.side==='DEFENDER'?'D'+m[1]:'C'+m[2])!==lb)continue;hit++;
   if(c.cec){if(c.cec!==x.side)trig.push('CLOSE-CONTRADICTION '+c.link+' ('+x.side+' break not set: the line already carries the '+c.cec+' break)');continue;}c.cec=x.side;
   if(c.grade===G&&!rp.some(r=>r[0]===c.raw))continue;trig.push('CLOSE-CONTRADICTION '+c.link+' ('+(c.grade||'unread')+' to '+G+')');c.grade=G;done.add(U(c.link));const nl=cecLine2024(c,x);const k=rp.findIndex(r=>r[0]===c.raw);if(k>=0)rp[k]=[c.raw,nl,'CLOSE-CONTRADICTION '+c.link];else rp.push([c.raw,nl,'CLOSE-CONTRADICTION '+c.link]);}
  if(!hit){__cecX[x.side]++;trig.push('CLOSE-CONTRADICTION '+lb+' (no collision line names it; counted as one '+G+')');}} /* pkgCEC */
`;

// the same step in sbApply2024 (the send-back recompute), so a send-back cannot undo the break: a line the send-back left or changed is set
// back to <SIDE> LINK BROKEN through the send-back's own line map (sid CLOSE-CONTRADICTION (pkgCEC)).
const LIB_SB = String.raw`const __cecX={DEFENDER:0,CHALLENGER:0};for(const x of cecBroken2024()){const G=x.side+' LINK BROKEN';const lb=(x.side==='DEFENDER'?'D':'C')+x.link;let hit=0;
  for(const c0 of col){const m=U(c0.link).match(/^D(\d+) VS C(\d+)$/);if(!m||(x.side==='DEFENDER'?'D'+m[1]:'C'+m[2])!==lb)continue;hit++;if(c0.cec)continue;c0.cec=x.side;if(c0.grade===G)continue;
   trig.push('CLOSE-CONTRADICTION '+c0.link+' ('+(c0.grade||'unread')+' to '+G+')');c0.grade=G;const nl=cecLine2024(c0,x);
   const ent=[...map].find(([o,z])=>String(z.to).split('\n').includes(c0.raw));if(ent)ent[1].to=String(ent[1].to).split('\n').map(l=>l===c0.raw?nl:l).join('\n');else if(text.split('\n').includes(c0.raw))map.set(c0.raw,{sid:'CLOSE-CONTRADICTION (pkgCEC)',to:nl,over:[],derived:true});}
  if(!hit){__cecX[x.side]++;trig.push('CLOSE-CONTRADICTION '+lb+' (no collision line names it; counted as one '+G+')');}} /* pkgCEC */
 `;

module.exports = { COMMON, PROMPT, SYS, BUILD, RECORD, SHOW_FN, LIB_FN, LIB_STEP, LIB_SB };
