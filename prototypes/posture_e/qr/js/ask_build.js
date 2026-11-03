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
