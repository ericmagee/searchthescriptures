// ruling 428 (md_notes_rulings 428: "approved, build it and run live test... and we'll reassess"): the enforcer at every judging seat, steps 1 and 2.
// E-ANS: each ANSWER CHECK line a panel judge wrote (a pressed verse, its MEANS, the answering side's ANSWER, the judge's MEETS or MISSES).
// E-VOID: each VOID ruling a panel judge wrote on a listed premise, read against that premise's own list entry.
// One DeepSeek reading per item, checked against the judges' grades. RECORD-ONLY TRIAL: rows go to debate_enforcer_log (kind enforcer_check);
// nothing is sent back to a judge and no seat or count moves until a rule passes its known case. Identical presses graded by several judges are
// one item, so each press is read once.
const PCC=$('Panel Cure Check').first().json;const S=$('Init Seats').first().json;let RS=null;try{RS=$('Resolve Seats').first().json;}catch(e){RS=null;}
const PASS=$input.first().json; // Enforcer Record's output, passed on unchanged by Judge Enforcer Record
const ds=RS&&RS.deepseek&&RS.deepseek.api_model?RS.deepseek:null;
const skip=why=>[{json:{je_skip:true,why,items:[]}}];
if(!ds)return skip('no DeepSeek model_config row');
let R=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){R=c.rounds;break;}}}catch(e){}if(R)break;}
if(!R){try{const RG=$('Regrade Load').isExecuted?$('Regrade Load').first().json.f:$('Final Output').first().json;R={CR1:RG.cr1,CR2:RG.cr2,CR3:RG.cr3,CR4:RG.cr4,DR1:RG.gr1,DR2:RG.gr2,DR3:RG.dr3,DR4:RG.dr4};}catch(e){R=null;}}
const textOf=raw=>String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const judges=[];for(const s of (PCC.bodies||[])){try{const p=(typeof s==='string'?JSON.parse(s):s).payload||{};judges.push({seat:p.judge_seat||'?',t:textOf(p.verdict_raw)});}catch(e){}}
if(!judges.length)return skip('no panel judgment text');
const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
// E-ANS items
const AC=/^ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4])\]\s*--\s*MEANS:\s*"([\s\S]*?)"\s*--\s*ANSWER:\s*"([\s\S]*)"\s*--\s*(MEETS|MISSES)\b\s*(?:--\s*([\s\S]*))?$/;
const AG=[];
for(const j of judges)for(const l0 of j.t.split('\n')){const l=l0.replace(/^[\s*\-•]+/,'');if(!/^ANSWER CHECK:/.test(l))continue;const m=l.match(AC);if(!m)continue;
 if(/^NONE\b/i.test(m[3].trim()))continue; /* an unproven press is no witness; nothing to grade */
 const key=N(m[1])+'|'+m[2]+'|'+N(m[4]).slice(0,140);let g=AG.find(x=>x.key===key);if(!g){g={key,verse:m[1].trim(),rk:m[2],means:m[3],answer:m[4],grades:[]};AG.push(g);}
 g.grades.push({seat:j.seat,grade:m[5],why:(m[6]||'').trim(),line:l});}
// E-VOID items: a judge's sentence naming a premise VOID, read against that premise's list entry
const lastAfter=(t,re)=>{t=String(t||'');let i=-1;for(const m of t.matchAll(re))i=m.index;return i<0?'':t.slice(i);};
const LIST={D:lastAfter(R&&R.DR2,/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi),C:lastAfter(R&&R.CR3,/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi)};
const entry=(sd,n)=>{const t=LIST[sd];if(!t)return null;const parts=t.split(/\n(?=\s*(?:\*\*)?\s*\d{1,2}[.)]\s)/);for(const p of parts){const m=p.match(/^\s*(?:\*\*)?\s*(\d{1,2})[.)]\s/);if(m&&+m[1]===n)return p.trim();}return null;};
const VG=[];
for(const j of judges)for(const l of j.t.split('\n')){const sd=/^\s*CHALLENGER CONCEDED LINKS\b/.test(l)?'C':/^\s*CONCEDED LINKS\b/.test(l)?'D':null;if(!sd)continue;
 for(const s of l.split(/(?<=[.;])\s+(?=[A-Z])/)){const m=s.match(/\b[Pp]remise\s+(\d{1,2})\b[^.;]{0,20}\bVOID\b/);if(!m)continue;const n=+m[1];const k=sd+'|'+n;let g=VG.find(x=>x.k===k);
  if(!g){g={k,side:sd,n,entry:entry(sd,n),rulings:[]};VG.push(g);}g.rulings.push({seat:j.seat,line:s.trim()});}}
const items=[];let gi=0;
for(const g of AG){gi++;const ids=g.grades.map((x,k)=>({id:'B'+gi+'.'+(k+1),rule:'E-ANS',seat:x.seat,grade:x.grade,item:'ANSWER CHECK '+g.verse+' ['+g.rk+']',flagged_line:x.line.slice(0,1500),response_line:x.grade+(x.why?' -- '+x.why:'')}));
 items.push({ids,text:'ITEM B'+gi+' (E-ANS; the answering side wrote this in ['+g.rk+']):\nPRESSED VERSE: '+cut(g.verse,200)+'\nWHAT THE PRESS SAYS THE VERSE MEANS: "'+cut(g.means,700)+'"\nTHE ANSWER: "'+cut(g.answer,1200)+'"\nTHE JUDGES\' GRADES:\n'+ids.map((x,k)=>'- '+x.id+' ('+x.seat+'): '+cut(x.response_line,400)).join('\n')});}
let vi=0;
for(const g of VG){vi++;const ids=g.rulings.map((x,k)=>({id:'V'+vi+'.'+(k+1),rule:'E-VOID',seat:x.seat,grade:'VOID',item:(g.side==='D'?'premise listed against the defender':'premise listed against the challenger')+' '+g.n,flagged_line:x.line.slice(0,1500),response_line:x.line.slice(0,700)}));
 items.push({ids,text:'ITEM V'+vi+' (E-VOID, '+(g.side==='D'?'a premise the challenger listed against the defender':'a premise the defender listed against the challenger')+', number '+g.n+'):\nTHE LIST ENTRY: '+(g.entry?cut(g.entry,2200):'(the list entry was not found)')+'\nTHE JUDGES\' VOID RULINGS:\n'+ids.map(x=>'- '+x.id+' ('+x.seat+'): '+cut(x.response_line,500)).join('\n')});}
if(!items.length)return skip('no ANSWER CHECK line and no VOID ruling was read');
const SYS='You are the enforcer of a debate panel. You check the judges\' written grades against the debate words quoted to you. You bring nothing from outside the record: no doctrine, no training knowledge, no reading of your own. You do not judge the debate.';
const RULES='RULE E-ANS (an answer to a pressed verse). Decide FIRST what the right grade is: MEETS only when the answer shows, in its own words, how the verse fits the answering side\'s case, or why the stated meaning does not follow from what the verse says. MISSES when the answer rests on an absence (it says only that the verse, or the other side, names no, states no, does not name, gives no, or is silent on something) without a fit of its own, or when it does not address the stated meaning. Then for each judge\'s grade: AGREE when it matches the right grade, DISAGREE when it does not.\n'
 +'RULE E-VOID (a listed premise ruled VOID). A premise is VOID only when its charge says the opponent\'s quoted words state something they do not state (a negation, a universal, or another claim beyond the quote). Read only the words the charge says the quote states; a clause describing what the premise props, or the objection it serves, is not part of the charge. AGREE with the VOID ruling when the charge goes beyond its quote; DISAGREE when it does not.\n'
 +'Reply with exactly one line per judge id, and nothing else, in this form:\nENFORCER: <judge id> -- AGREE | DISAGREE | NO ANSWER -- RIGHT: MEETS | MISSES | VOID | NOT VOID -- <one sentence that quotes the words that decide it>';
const CALL_CHARS=60000,MAX_CALLS=8;const calls=[[]];let used=0;const not_checked=[];
for(const it of items){const sz=it.text.length+50;if(used+sz>CALL_CHARS&&calls[calls.length-1].length){if(calls.length>=MAX_CALLS){not_checked.push(...it.ids.map(x=>x.id));continue;}calls.push([]);used=0;}calls[calls.length-1].push(it);used+=sz;}
return calls.filter(c=>c.length).map((c,ci)=>({json:{je_skip:false,call:ci+1,calls:calls.length,model:ds.api_model,run_token:S.run_token,not_checked,
 ids:c.flatMap(x=>x.ids),body:{model:ds.api_model,max_tokens:Math.max(Number(ds.max_tokens)||0,16000),temperature:0,messages:[{role:'system',content:SYS},{role:'user',content:RULES+'\n\n'+c.map(x=>x.text).join('\n\n')}]},
 counts:{ans_items:AG.length,ans_grades:AG.reduce((a,g)=>a+g.grades.length,0),void_items:VG.length,void_rulings:VG.reduce((a,g)=>a+g.rulings.length,0)}}}));
