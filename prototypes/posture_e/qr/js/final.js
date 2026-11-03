// QR Final (TRIAL): the questions that pass, first reply or the one return; a question that still fails is dropped and recorded.
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const F=$('Regrade Load').first().json.f;
const C=$('QR Check').all().map(x=>x.json);const R=$input.all().map(x=>x.json);
const RG=$('Regrade Row').first().json;const MODEL={defender:RG.defender_model,challenger:RG.challenger_model};
if(!MODEL.defender||!MODEL.challenger)throw new Error('FAIL-CLOSED: QR Final: the saved row names no debater model.'+RT);
const SYS=side=>'You are the '+side.toUpperCase()+' in a finished debate. A judge asks you to explain a passage from your own earlier round. Explain only that passage: what a word, a step or a cited verse there means, or how the passage fits the verse it names. Do not defend your link, answer the other side, add an argument, or cite a verse you did not already cite: any such material is disregarded. Answer in at most 250 words.';
const rec=[];const items=[];
C.forEach((c,i)=>{let qs=c.qs,faults=c.faults,second=null;
 if(c.retry){second=qrText(R[i]);const o=qrParse(second);qs={};faults={};for(const side of ['defender','challenger']){const q=o&&o[side];qs[side]=q||null;faults[side]=qrCheck(q,side,F);}}
 for(const side of ['defender','challenger']){const q=qs[side];const ok=faults[side].length===0;rec.push({judge:c.seat,side,round:q&&q.round,quote:q&&q.quote,question:q&&q.question,status:ok?(c.retry?'PASSED ON RETURN':'PASSED'):'DROPPED',faults:faults[side],first_faults:c.faults[side]});
  if(!ok)continue;const rd=String(q.round).toUpperCase().replace(/[\[\]\s]/g,'');
  const rounds=QR_SIDE[side].filter(k=>F[QR_KEY[k]]).map(k=>'['+k+']\n'+F[QR_KEY[k]]).join('\n\n');
  items.push({json:{judge:c.seat,side,round:rd,quote:q.quote,question:q.question,body:{model:MODEL[side],max_tokens:4000,messages:[{role:'system',content:SYS(side)},{role:'user',content:'YOUR ROUNDS IN THIS DEBATE:\n\n'+rounds+'\n\n=== A JUDGE\'S QUESTION ===\nThe judge quotes your round '+rd+': "'+q.quote+'"\nQuestion: '+q.question}]}}});}});
if(!items.length)throw new Error('FAIL-CLOSED: QR Final: no question passed the checks.'+RT);
items[0].json.record=rec;return items;
