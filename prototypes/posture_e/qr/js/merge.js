// QR Merge (TRIAL): the six questions and answers go to all three judges, appended to each judge's own conversation before it judges.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const F=$('Regrade Load').first().json.f;
const Q=$('QR Final').all().map(x=>x.json);const A=$input.all().map(x=>x.json);const PB=$('Panel Build').first().json;
if(A.length!==Q.length)throw new Error('FAIL-CLOSED: QR Merge: '+A.length+' answers for '+Q.length+' questions.'+RT);
const qa=Q.map((q,i)=>{let a=qrText(A[i]);const own=new Set(qrRefs(qrSideText(F,q.side)));const nv=a?qrRefs(a).filter(r=>!own.has(r)):[];
 return {judge:q.judge,side:q.side,round:q.round,quote:q.quote,question:q.question,answer:a,new_verses:nv,finish:(A[i]&&A[i].choices&&A[i].choices[0]&&A[i].choices[0].finish_reason)||null};});
const block=qa.map((x,k)=>'Q'+(k+1)+' -- judge '+x.judge+' to the '+x.side+', quoting ['+x.round+']: "'+x.quote+'"\nQuestion: '+x.question+'\nAnswer ['+(x.side==='defender'?'CR':'DR')+'Q]: '+(x.answer==null?'(no answer)':x.answer)+(x.new_verses.length?'\n[NEW VERSE, NOT COUNTED: '+x.new_verses.join(', ')+']':'')).join('\n\n');
const TXT='=== QUESTION ROUND (TRIAL) ===\n'+QR_C8+'\n\nThe judges asked the questions below and the debaters answered. Each answer explains only the passage it quotes and is read with the round it came from: an answer that gives up ground counts as a concession made in that round; material beyond the quoted passage, and any verse marked NEW VERSE, NOT COUNTED, is disregarded.\n\n'+block+'\n=== END QUESTION ROUND ===';
const add=(body)=>{const b=JSON.parse(JSON.stringify(body));const m=b.messages;const last=m[m.length-1];
 if(last.role==='user'){if(typeof last.content==='string')last.content+='\n\n'+TXT;else if(Array.isArray(last.content))last.content.push({type:'text',text:TXT});}else m.push({role:'user',content:TXT});return b;};
const judges=PB.judges.map(j=>({...j,body:add(j.body)}));
return [{json:{run_token:S.run_token,judges,qa,record:(Q[0]&&Q[0].record)||[],qa_text:TXT}}];
