// QUESTION ROUND TRIAL (md_notes_rulings 413, 415): shared helpers, inlined into each QR node at build time.
const QR_C8="Commitment 8. I ask only for explanation.\nA question I put to a debater quotes a passage from that debater's own earlier round and asks it to explain that passage further: what a word, a step or a cited verse there means, or how the passage fits the verse it names. I do not ask a debater to defend its link, to answer the other side, to meet a verse or argument it did not touch, or to choose between positions, and I do not put the other side's case to it. The answer explains the quoted passage and is read with the round it came from; anything beyond that passage, and any verse not already cited, is disregarded.";
const QR_SIDE={defender:['CR1','CR2','CR3','CR4'],challenger:['DR1','DR2','DR3','DR4']};
const QR_KEY={CR1:'cr1',DR1:'gr1',CR2:'cr2',DR2:'gr2',CR3:'cr3',DR3:'dr3',CR4:'cr4',DR4:'dr4'};
const QR_REF=/(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?\.?\s\d{1,3}:\d{1,3}/g;
const qrNorm=s=>String(s||'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[*_]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const qrRefs=s=>[...new Set((String(s||'').match(QR_REF)||[]).map(r=>r.replace(/\.\s/,' ').replace(/^Psalm\s/,'Psalms ')))];
const qrSideText=(F,side)=>QR_SIDE[side].map(k=>String(F[QR_KEY[k]]||'')).join('\n');
const QR_FRAME=/\b(?:defend(?:s|ed|ing)?|respond(?:s|ed|ing)?\s+to|the\s+challenger\s+argues|the\s+defender\s+argues)\b/i;
function qrParse(t){const s=String(t||'');const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a<0||b<a)return null;try{return JSON.parse(s.slice(a,b+1));}catch(e){return null;}}
function qrText(j){try{if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message)return String(j.choices[0].message.content||'');}catch(e){}return null;}
// the three program checks of ruling 415, for one question
function qrCheck(q,side,F){const f=[];if(!q||typeof q!=='object')return ['no question object'];
 const rd=String(q.round||'').toUpperCase().replace(/[\[\]\s]/g,'');if(!QR_SIDE[side].includes(rd))f.push('round "'+q.round+'" is not one of that debater\'s rounds ('+QR_SIDE[side].join(', ')+')');
 const quote=qrNorm(q.quote);if(quote.length<8)f.push('quotation missing or under 8 characters');
 else if(QR_SIDE[side].includes(rd)&&!qrNorm(F[QR_KEY[rd]]).includes(quote))f.push('the quotation is not found word for word in '+rd);
 const own=new Set(qrRefs(qrSideText(F,side)));const nv=qrRefs((q.question||'')+' '+(q.quote||'')).filter(r=>!own.has(r));if(nv.length)f.push('verse(s) that debater has not cited: '+nv.join(', '));
 const fr=String(q.question||'').match(QR_FRAME);if(fr)f.push('framing words: "'+fr[0]+'"');
 if(String(q.question||'').trim().length<10)f.push('question missing');return f;}

// QR Ask Build (TRIAL, rulings 413 and 415): each panel judge, in its own conversation, writes one question to each debater before it judges.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;
if(S.question_trial!==true||S.dry!==true)throw new Error('FAIL-CLOSED: QR Ask Build reached outside a dry question-round trial.'+RT);
const PB=$('Panel Build').first().json;
const ASK='=== QUESTION ROUND (TRIAL) - BEFORE YOU JUDGE ===\nDo not judge yet. Before you judge, you put one question to each debater, under this commitment:\n\n'+QR_C8+'\n\nRules, checked by the program before your questions are sent: the quotation is copied word for word from the round you name; the question names no verse that debater has not cited; the question does not contain "defend", "respond to", "the challenger argues" or "the defender argues". A question that fails is returned to you once. The defender\'s rounds are CR1, CR2, CR3, CR4; the challenger\'s rounds are DR1, DR2, DR3, DR4. All three judges will read all six questions and answers before they judge.\n\nReply with JSON only, in this form:\n{"defender":{"round":"CR3","quote":"<exact words from that round>","question":"<one question>"},"challenger":{"round":"DR3","quote":"<exact words from that round>","question":"<one question>"}}';
const addUser=(body,text)=>{const b=JSON.parse(JSON.stringify(body));const m=b.messages;if(!Array.isArray(m)||!m.length)throw new Error('FAIL-CLOSED: QR Ask Build: a judge body has no messages.'+RT);
 const last=m[m.length-1];if(last.role==='user'){if(typeof last.content==='string')last.content+='\n\n'+text;else if(Array.isArray(last.content))last.content.push({type:'text',text});else last.content=text;}else m.push({role:'user',content:text});
 delete b.response_format;return b;};
if(!Array.isArray(PB.judges)||PB.judges.length!==3)throw new Error('FAIL-CLOSED: QR Ask Build: Panel Build has '+(PB.judges||[]).length+' judges, expected 3.'+RT);
return PB.judges.map((j,i)=>{if(j.fam!=='openrouter')throw new Error('FAIL-CLOSED: QR trial routes only OpenRouter seats; seat '+j.seat+' is '+j.fam+'.'+RT);
 return {json:{i,seat:j.seat,body:addUser(j.body,ASK)}};});
