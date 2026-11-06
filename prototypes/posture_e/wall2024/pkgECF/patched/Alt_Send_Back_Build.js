// WALL-2024 package B (operator 2026-11-05: the agreement shown back before every decision; B1 amended to the walker form, W3 2121).
// The seat's own acceptance reply is read from the head exchange of its own conversation (the assistant turn after "POSTURE FOR
// ACCEPTANCE" or "POSTURE RETURNED") and shown back at the END of the final user message. The system message and the head exchange,
// the cached prefix, are not touched. A body with no accepted exchange is left as it is.
const __AGR_TXT=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';
function __agrTail(msgs){if(!Array.isArray(msgs))return '';let acc=null;
 for(let i=0;i+1<msgs.length;i++){const m=msgs[i],r=msgs[i+1];if(!m||!r)continue;const ut=m.role==='user'?__AGR_TXT(m.content!==undefined?m.content:m.parts):'';
  if(/^POSTURE (FOR ACCEPTANCE|RETURNED)/.test(ut)&&(r.role==='assistant'||r.role==='model'))acc=__AGR_TXT(r.content!==undefined?r.content:r.parts);}
 if(!acc||!acc.trim())return '';
 return '\n\nTHE AGREEMENT YOU ACCEPTED, shown back before this decision. Your own words when you accepted the posture:\n'+acc.trim().split('\n').map(l=>'> '+l).join('\n')
  +'\nEach contested grade you write (BROKEN, FORCED, MISSES, VOID, UNPROVEN) names the commitment it applies, as "(Commitment N)".\nThe reply form given above is unchanged; answer in it.';}
const __AGR_SB=(items)=>{const seen=new WeakSet();const walk=(o,d)=>{if(!o||typeof o!=='object'||d>7||seen.has(o))return;seen.add(o);
 if(Array.isArray(o.messages)&&typeof o.model==='string'){const m=o.messages;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'){const c=m[i].content;if(typeof c==='string'){if(!c.includes('THE AGREEMENT YOU ACCEPTED, shown back'))m[i].content=c+tail;}else if(Array.isArray(c)){if(!c.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))c.push({type:'text',text:tail});}break;}}}}
 else if(Array.isArray(o.contents)&&o.systemInstruction){const m=o.contents;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'&&Array.isArray(m[i].parts)){if(!m[i].parts.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))m[i].parts.push({text:tail});break;}}}}
 for(const k of Object.keys(o))walk(o[k],d+1);};(items||[]).forEach(it=>walk(it&&it.json,0));return items;};
// ruling 428, the send-back half (journal 2078: the record half was built in s428a and s429; this half was approved and not built). Every line
// an enforcer DISAGREES with (E-ANS, E-VOID, E-COL of ruling 428 and the later enforcer rules; never a withdrawal row, K-W, ruling 445) goes back once to the panel
// judge that wrote it, in that judge's own conversation, with the enforcer's quoted reason. The judge keeps the decision: KEEP or CHANGE, with
// one sentence quoting the debate words that decide it. Both are recorded (Send Back Record). Transport limit, not a rule: at most 60 items per
// judge; an item past that is recorded NOT SENT, never dropped silently. A judge whose call family is not openrouter is recorded NOT SENT.
const PASS=$input.first().json; // Judge Enforcer Record's output, passed on unchanged
let PB=null;try{PB=$('Alt Seated').first().json;}catch(e){PB=null;}
let PCC=null;try{PCC=$('Alt Seated').first().json;}catch(e){PCC=null;}
let E421=[];try{if($('Alt Seated').isExecuted)E421=$('Alt Seated').first().json.enf421_rows||[];}catch(e){E421=[];}
const E428=PASS.enf428_rows||[];
const skip=(why,ns)=>[{json:{...PASS,sb_skip:true,sb_why:why,sb_not_sent:ns||[]}}];
const dis=[].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate'&&x.rule!=='K-W'&&x.rule!=='K-CON' /* package A/B: K-CON is TRIAL and not sent back (W1, W3, 2026-11-05);  ruling 445: "withdrawals will not be included in send-backs" */&&/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(String(x.cure_reason||'')) /* s432: a NO ANSWER row is a reported violation too */);
if(!dis.length)return skip('no enforcer reported a violation in a panel judge line');
if(!PB||!Array.isArray(PB.judges))return skip('the panel judges\' requests could not be read',dis.map(x=>({seat:x.seat,rule:x.rule,item:x.item,why:'panel requests not read'})));
const textOf=raw=>String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const said={};for(const s of ((PCC&&PCC.bodies)||[])){try{const p=(typeof s==='string'?JSON.parse(s):s).payload||{};said[p.judge_seat]=textOf(p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();}catch(e){}}
const why=x=>String(x.cure_reason||'').replace(/^ENFORCER (?:DISAGREE|NO ANSWER)\s*:?\s*/,'').replace(/\s*\((?:judge cure [A-Z]+; )?(?:RECORD-ONLY )?TRIAL[^)]*\)\s*$/,'').trim();
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const MAX=60;const bySeat=new Map();for(const x of dis){if(!bySeat.has(x.seat))bySeat.set(x.seat,[]);bySeat.get(x.seat).push(x);}
const out=[];const not_sent=[];
for(const [seat,list] of bySeat){const j=PB.judges.find(q=>q.seat===seat);
 if(!j||!j.body||!Array.isArray(j.body.messages)){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'no panel request for this seat'}));continue;}
 if(j.fam!=='openrouter'){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'call family '+j.fam+' has no send-back route'}));continue;}
 if(!said[seat]){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'the judge\'s own judgment text could not be read'}));continue;}
 const items=list.slice(0,MAX).map((x,k)=>({sid:'S'+(k+1),rule:x.rule,item:x.item||'',line:x.flagged_line||x.response_line||'',reason:why(x),src:x}));
 list.slice(MAX).forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'over the '+MAX+'-item transport limit'}));
 // pkgCM (c) (W3 2394; run 33040 chatgpt S19, S20): an E-HOLD item that proposes BROKEN states the gate's rule for a BROKEN grade, so the
 // send-back never asks for a grade the gate then charges. Record-only as before.
 const hold421=i=>{if(i.rule!=='E-HOLD'||!/\(right:\s*BROKEN\)/i.test(String((i.src&&i.src.cure_reason)||i.reason||'')))return '';const pm=String(i.item||'').match(/\b(D\d+\s+vs\.?\s+C\d+)\b/i);const pr=pm?pm[1].replace(/\s+vs\.?\s+/i,' vs '):'D<i> vs C<j>';
  return '\nTHE RULE FOR A BROKEN GRADE (the gate checks it, K-G4): if the answering side answered the witness, the link can break only by meaning, and that break counts only with a FORCED line for the pair (ruling 421): FORCED: '+pr+' -- MEANS [<round>]: "<the pressing sentence, quoted>" -- ANSWER [<round>]: "<the answer, quoted>" -- FAILS: "<the words that cannot agree, quoted>". If the witness was left unanswered, the BROKEN line must quote the pressing sentence and name its round (ruling 392). A CHANGE TO here replaces only this line and cannot add the FORCED line.';};
 const __ecfR=i=>i.rule!=='E-COL'?'':'\nTHE RULE (E-COL, ENFORCED, pkgECF): a collision line breaks a link by meaning only when the answer\'s own words cannot agree with the meaning pressed; a rival reading of a contested word, footed by the answer\'s own layers, is not a break. To keep the line, KEEP it with a sentence that quotes at least 6 words in a row of the answering side\'s round that the meaning cannot agree with (or, for a line resting on an unanswered press, the pressing sentence with its round, ruling 392). Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded (UNDERDETERMINED or STANDS). An item left without either counts against your seat.';
 const msg='An enforcer has read some of your lines against the debate record and reports a violation in each. Its reasons are quoted below. You keep the decision. For each item, KEEP your line or CHANGE it, and give one sentence that quotes the debate\'s own words that decide it. Bring nothing from outside the record.\n\n'
  +items.map(i=>'ITEM '+i.sid+' ('+i.rule+(i.item?', '+cut(i.item,200):'')+'):\nYOUR LINE: '+cut(i.line,1500)+'\nTHE ENFORCER: '+cut(i.reason,900)+hold421(i)+__ecfR(i)).join('\n\n')
  +'\n\nThis reply is not a judgment and is not JSON: write plain lines only.\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\nSENDBACK: <item id> || KEEP || <one sentence quoting the words that decide it>\nSENDBACK: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>';
 // xAI (operator, option A): for an x-ai/ seat, the judge's reply exactly as Grok wrote it, so the conversation is only appended to and the
// wrapper can hand its reasoning back; chosen only when it reads, as said[] is read, to the same text. Otherwise said[seat] as before.
let asst=said[seat];if(/^x-ai\//.test(String(j.api_model||j.body.model||''))){const XN=['Alternate Call openrouter','Alternate Cure Call openrouter','Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter','Panel Reserve openrouter','Panel Cure Call 1 openrouter','Panel Cure Call 2 openrouter','Panel Cure Call 3 openrouter'];const rd=t=>textOf(t).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();for(const xn of XN){let xa=[];try{if(!$(xn).isExecuted)continue;xa=$(xn).all();}catch(xe){continue;}for(const xi of xa){const xj=(xi&&xi.json)||{};const xc=xj.choices&&xj.choices[0]&&xj.choices[0].message&&xj.choices[0].message.content;if(/^x-ai\//.test(String(xj.model||''))&&typeof xc==='string'&&rd(xc)===said[seat])asst=xc;}}}
const body={...j.body,messages:[...j.body.messages,{role:'assistant',content:asst},{role:'user',content:msg+__agrTail(j.body.messages)}]};
 out.push({json:{sb_skip:false,seat,api_model:j.api_model,run_token:PB.run_token||null,items:items.map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line,reason:i.reason})),msg,body}});}
if(!out.length)return skip('no disagreement could be sent',not_sent);
out[0].json.sb_not_sent=not_sent;return out;
