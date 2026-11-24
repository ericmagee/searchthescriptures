// ASK 588 (W4): node code for the question round. Each export is the body after the common prelude.
const ASK_BUILD=`try{
const S=$('Init Seats').first().json;
if(S.question_trial!==true)throw new Error('the question round is off for this run');
const PB=$('Panel Build').first().json;
const ASK='=== QUESTION ROUND - BEFORE YOU JUDGE ===\\nDo not judge yet. Before you judge, you put one question to each debater, under this commitment:\\n\\n'+QR_C8+'\\n\\nYou choose the passage and the form; the program writes the question, in one of these forms:\\n1. MEANING: the program asks "What does \\"<term>\\" in this passage mean?". Give "term": a word or step copied from your quotation.\\n2. FIT: the program asks "How does this passage fit <verse>?". Give "verse": one verse reference that your quotation names.'+(QR_AGREE?'\\n3. AGREE, only when a debater\\'s closing round contradicts its own earlier round: the program asks "How do these two passages agree?". Give "round" as the closing round, "quote" as the closing words, and "earlier_round" and "earlier_quote" as the earlier words.':'')+'\\n\\nRules, checked by the program before your questions are sent: each quotation is copied word for word from the round you name; the term stands in your quotation; the verse is named in your quotation; no verse that debater has not cited. A question that fails is returned to you once. The defender\\'s rounds are CR1, CR2, CR3, CR4; the challenger\\'s rounds are DR1, DR2, DR3, DR4. All three judges will read all six questions and answers before they judge.'+(QR_AGREE?'\\n\\nWatch the closing rounds for contradictions. If a debater\\'s closing round contradicts its own earlier round, your question to that debater uses AGREE; otherwise use MEANING or FIT.':'')+'\\n\\nReply with JSON only, in this form:\\n{"defender":{"round":"CR3","quote":"<exact words from that round>","form":"MEANING","term":"<a word or step from the quotation>"},"challenger":{"round":"DR3","quote":"<exact words from that round>","form":"FIT","verse":"<one verse the quotation names>"}}';
const addUser=(body,text)=>{const b=JSON.parse(JSON.stringify(body));const m=b.messages;if(!Array.isArray(m)||!m.length)throw new Error('a judge body has no messages');
 m.push({role:'assistant',content:'I will not judge yet. I will first put one question to each debater.'});m.push({role:'user',content:text});m.push({role:'system',content:'QUESTION ROUND: this reply is only the JSON of two questions. Do not write a judgment, a verdict or any verdict field in this reply; the judgment comes in a later turn.'});
 delete b.response_format;return b;};
if(!Array.isArray(PB.judges)||PB.judges.length!==3)throw new Error('Panel Build has '+(PB.judges||[]).length+' judges, expected 3');
return PB.judges.map((j,i)=>{if(j.fam!=='openrouter')throw new Error('seat '+j.seat+' is '+j.fam+'; the question round routes only OpenRouter judge seats');
 return {json:{i,seat:j.seat,body:addUser(j.body,ASK)}};});
}catch(e){return [{json:{qr_skip:qrErr('QR Ask Build',e)}}];}`;

const CHECK=`try{
const A=$('QR Ask Build').all().map(x=>x.json);const sk=qrSkipOf(A);if(sk)return [{json:{qr_skip:sk}}];
const F=qrRounds();const R=$input.all().map(x=>x.json);
if(R.length!==A.length)throw new Error(R.length+' replies for '+A.length+' asks');
const __Q=A.map((a,i)=>qrParse(qrText(R[i])));const __ct=q=>!!(q&&typeof q==='object'&&qrForm(q)==='AGREE'&&!qrEmpty(q.earlier_quote));
const __in=(o,i)=>{o=qrNorm(o);i=qrNorm(i);return i.length>=8&&o.includes(i);};
const __ok=__Q.map(o=>['defender','challenger'].every(s=>!qrCheck(o&&o[s],s,F).length));const __RD=[];A.forEach((a,i)=>{const r={};for(const side of ['defender','challenger']){const q=__Q[i]&&__Q[i][side];if(!__ct(q)||qrCheck(q,side,F).length)continue;for(let j=0;j<i;j++){const p=__Q[j]&&__Q[j][side];if(__ok[j]&&!__RD[j][side]&&__ct(p)&&qrRd(p.round)===qrRd(q.round)&&qrRd(p.earlier_round)===qrRd(q.earlier_round)&&__in(p.earlier_quote,q.earlier_quote)&&__in(p.quote,q.quote)){r[side]={of:A[j].seat,earlier:qrRd(q.earlier_round),closing:qrRd(q.round)};break;}}}__RD.push(r);});
return A.map((a,i)=>{const t=qrText(R[i]);const o=qrParse(t);const out={i,seat:a.seat,first_text:t,qs:{},faults:{}};let bad=[];
 for(const side of ['defender','challenger']){const q=o&&o[side];const f=qrCheck(q,side,F);out.qs[side]=q||null;out.faults[side]=f;if(f.length)bad.push(side+': '+f.join('; '));}
 if(!o)bad=['the reply is not JSON in the form asked'];
 const rd=__RD[i],rs=Object.keys(rd);const RET='=== QUESTION ROUND: RETURNED ONCE ===\\n'+(bad.length?'Your questions are returned once. Faults: '+bad.join(' | ')+'.\\n':'')+rs.map(s=>'Another judge already asks the '+s+' about the contradiction between '+rd[s].earlier+' and '+rd[s].closing+'. If you see a different contradiction in that debater\\'s closing round, ask about it instead; if you see none, keep your question.\\n').join('')+'Reply again with JSON only, in the same form, both questions.';
 const body=JSON.parse(JSON.stringify(a.body));if(bad.length||rs.length){body.messages.push({role:'assistant',content:t||'(no reply)'});body.messages.push({role:'user',content:RET});}
 else{body.messages=[{role:'user',content:'Reply with the single word OK.'}];body.max_tokens=16;}
 return {json:{...out,retry:bad.length>0||rs.length>0,why:bad,redirect:rd,body}};});
}catch(e){return [{json:{qr_skip:qrErr('QR Check',e)}}];}`;

const FINAL=`try{
const C=$('QR Check').all().map(x=>x.json);const sk=qrSkipOf(C);if(sk)return [{json:{qr_skip:sk}}];
const F=qrRounds();const R=$input.all().map(x=>x.json);
let RGR=null;try{if($('Regrade Row').isExecuted)RGR=$('Regrade Row').first().json;}catch(e){RGR=null;}
const aid=m=>String(m||'').slice(10).replace(/\\./g,'-');
/* ASK 588 D4: the answer comes from the debater's own seat model by its own route, as seatModel routes it (anthropic/ ids go direct) */
const ROUTE={};for(const side of ['defender','challenger']){let r;
 if(RGR){const m=side==='defender'?RGR.defender_model:RGR.challenger_model;r=!m?{route:'skip',why:'the saved row names no '+side+' model'}:/^anthropic\\//.test(m)?{route:'anthropic',model:aid(m)}:{route:'openrouter',model:m};}
 else{const RS=$('Resolve Seats').first().json;const x=RS&&RS[side];r=!x?{route:'skip',why:'no '+side+' seat'}:x.fam==='anthropic'?{route:'anthropic',model:x.direct_model||aid(x.model)}:x.fam==='openrouter'?{route:'openrouter',model:x.model}:{route:'skip',why:'the '+side+' seat is of family '+x.fam+', which the question round does not route'};}
 ROUTE[side]=r;}
const SYS=side=>'You are the '+side.toUpperCase()+' in a finished debate. A judge asks you to explain a passage from your own earlier round. Explain only that passage: what a word, a step or a cited verse there means, or how the passage fits the verse it names. Do not defend your link, answer the other side, add an argument, or cite a verse you did not already cite: any such material is disregarded. If the judge quotes two of your passages, explain how they agree; you cannot withdraw or change either one here. Answer in at most 250 words.';
const rec=[];const items=[];
C.forEach((c,i)=>{let qs=c.qs,faults=c.faults,second=null;
 const RD=c.redirect||{},KF={};if(c.retry){second=qrText(R[i]);const o=qrParse(second);qs={};faults={};for(const side of ['defender','challenger']){const q=o&&o[side];qs[side]=q||null;faults[side]=qrCheck(q,side,F);if(!c.faults[side].length&&(RD[side]?faults[side].length:!(c.why||[]).length)){qs[side]=c.qs[side];faults[side]=[];KF[side]=true;}}}
 for(const side of ['defender','challenger']){const q=qs[side];const ok=faults[side].length===0;const form=ok?qrForm(q):null;const question=ok?qrQuestion(q):null;
  rec.push({judge:c.seat,side,round:q&&q.round,form:q&&q.form,term:q&&q.term||null,verse:q&&q.verse||null,quote:q&&q.quote,earlier_round:(q&&q.earlier_round)||null,earlier_quote:(q&&q.earlier_quote)||null,question,status:ok?(c.retry&&!KF[side]?'PASSED ON RETURN':'PASSED'):'DROPPED',redirect:RD[side]||null,...(RD[side]&&KF[side]?{redirect_note:'redirect reply failed, first kept'}:{}),faults:faults[side],first_faults:c.faults[side],...(ok?{}:{first_reply:String(c.first_text==null?'(none)':c.first_text).slice(0,2000),second_reply:second==null?null:String(second).slice(0,2000)})});
  if(!ok)continue;const rd=qrRd(q.round);const ag=form==='AGREE';const er=ag?qrRd(q.earlier_round):null;
  const rounds=QR_SIDE[side].filter(k=>F[QR_KEY[k]]).map(k=>'['+k+']\\n'+F[QR_KEY[k]]).join('\\n\\n');
  const U='YOUR ROUNDS IN THIS DEBATE:\\n\\n'+rounds+'\\n\\n=== A JUDGE\\'S QUESTION ===\\n'+(ag?'The judge quotes your earlier round '+er+': "'+q.earlier_quote+'"\\nand your closing round '+rd+': "'+q.quote+'"':'The judge quotes your round '+rd+': "'+q.quote+'"')+'\\nQuestion: '+question;
  const rt=ROUTE[side];const body=rt.route==='anthropic'?{model:rt.model,max_tokens:4000,system:SYS(side),messages:[{role:'user',content:U}]}:rt.route==='openrouter'?{model:rt.model,max_tokens:4000,messages:[{role:'system',content:SYS(side)},{role:'user',content:U}]}:null;
  items.push({json:{judge:c.seat,side,round:rd,form,quote:q.quote,earlier_round:er,earlier_quote:ag?q.earlier_quote:null,question,route:rt.route,route_why:rt.why||null,model:rt.model||null,body}});}});
if(!items.length)return [{json:{qr_skip:'QR Final: no question passed the checks',record:rec}}];
items[0].json.record=rec;return items;
}catch(e){return [{json:{qr_skip:qrErr('QR Final',e)}}];}`;

const ANS_BUILD=side=>`try{
const Q=$('QR Final').all().map(x=>x.json);const sk=qrSkipOf(Q);if(sk)return [{json:{route:'skip',side:'${side}',why:sk}}];
const D=[];Q.forEach((q,k)=>{if(q.side==='${side}')D.push({q,k});});
if(!D.length)return [{json:{route:'skip',side:'${side}',why:'no ${side} question passed the checks'}}];
const r=D[0].q.route;if(D.some(x=>x.q.route!==r))throw new Error('the ${side} questions name more than one route');
if(r!=='anthropic'&&r!=='openrouter')return [{json:{route:'skip',side:'${side}',why:D[0].q.route_why||'no route'}}];
return D.map(x=>({json:{route:r,side:'${side}',k:x.k,body:x.q.body}}));
}catch(e){return [{json:{route:'skip',side:'${side}',why:qrErr('QR Answer ${side==='defender'?'D':'C'} Build',e)}}];}`;

const ANS_DONE=(side,build)=>`try{
const B=$('${build}').all().map(x=>x.json);const R=$input.all().map(x=>x.json);
if(!B.length||B[0].route==='skip')return [{json:{side:'${side}',answers:[],skip:(B[0]&&B[0].why)||'skipped'}}];
if(R.length!==B.length)return [{json:{side:'${side}',answers:[],skip:R.length+' replies for '+B.length+' ${side} questions'}}];
return [{json:{side:'${side}',route:B[0].route,answers:B.map((b,i)=>({k:b.k,raw:R[i]||null}))}}];
}catch(e){return [{json:{side:'${side}',answers:[],skip:qrErr('QR Answer ${side==='defender'?'D':'C'} Done',e)}}];}`;

const MERGE=`const __PB=$('Panel Build').first().json;let __rec=[];
try{
const Q=$('QR Final').all().map(x=>x.json);__rec=(Q[0]&&Q[0].record)||[];const sk=qrSkipOf(Q);if(sk)throw new Error(sk);
const F=qrRounds();const S=$('Init Seats').first().json;
const DD=$('QR Answer D Done').first().json,CD=$('QR Answer C Done').first().json;
const ans=new Map();[DD,CD].forEach(d=>((d&&d.answers)||[]).forEach(a=>ans.set(a.k,a.raw)));
const skips=[DD,CD].filter(d=>d&&d.skip).map(d=>d.side+': '+d.skip);
const qa=Q.map((q,k)=>{const raw=ans.get(k);const a=raw?qrText(raw):null;const own=new Set(qrRefs(qrSideText(F,q.side)));const nv=a?qrRefs(a).filter(r=>!own.has(r)):[];
 return {n:k+1,judge:q.judge,side:q.side,form:q.form,round:q.round,quote:q.quote,earlier_round:q.earlier_round||null,earlier_quote:q.earlier_quote||null,question:q.question,answer:a,new_verses:nv,finish:qrFinish(raw),route:q.route,error:raw&&raw.error?String(raw.error.message||JSON.stringify(raw.error)).slice(0,300):null};});
if(!qa.some(x=>x.answer))throw new Error('no answer came back'+(skips.length?' ('+skips.join('; ')+')':''));
/* a line of a question or an answer that reads like a round header is quoted, so no round reader takes it for a round */
const safe=s=>String(s==null?'':s).split('\\n').map(l=>/^\\s*(?:===\\s*)?\\[(?:CR|DR)[1-4]/i.test(l)||/^\\s*===/.test(l)?'> '+l:l).join('\\n');
const block=qa.map(x=>'Q'+x.n+' -- judge '+x.judge+' to the '+x.side+', '+(x.earlier_quote?'CONTRADICTION QUESTION, quoting ['+x.earlier_round+']: "'+safe(x.earlier_quote)+'" and ['+x.round+']: "'+safe(x.quote):'quoting ['+x.round+']: "'+safe(x.quote))+'"\\nQuestion: '+x.question+'\\nAnswer: '+(x.answer==null?'(no answer)':safe(x.answer))+(x.new_verses.length?'\\n[NEW VERSE, NOT COUNTED: '+x.new_verses.join(', ')+']':'')).join('\\n\\n');
const TXT='=== QUESTION ROUND ===\\n'+QR_C8+'\\n\\nBefore you judge, the judges asked the questions below and the debaters answered. '+QR_ANSWERS+' Material beyond the quoted passage, and any verse marked NEW VERSE, NOT COUNTED, is disregarded. A question that quotes two passages of one debater is a contradiction question: the answer does not withdraw either passage; the closing enforcer confirms whether it is a contradiction, and the contradiction rule then applies.\\n\\n'+block+'\\n=== END QUESTION ROUND ===';
/* the block goes before the transcript, so every reader of the rounds reads the same eight rounds */
const AT='DEBATE TRANSCRIPT\\n\\n=== [';
const ins=u=>{const k=String(u).indexOf(AT);if(k<0)throw new Error('a judge body holds no transcript anchor');return u.slice(0,k)+TXT+'\\n\\n'+u.slice(k);};
const add=body=>{const b=JSON.parse(JSON.stringify(body));const m=b.messages;if(!Array.isArray(m))throw new Error('a judge body has no messages');for(let i=m.length-1;i>=0;i--){const x=m[i];if(!x||x.role!=='user')continue;if(typeof x.content==='string'){x.content=ins(x.content);return b;}if(Array.isArray(x.content)){const p=x.content.find(p=>p&&typeof p.text==='string'&&p.text.includes(AT));if(!p)throw new Error('a judge body holds no transcript anchor');p.text=ins(p.text);return b;}}throw new Error('a judge body has no user message');};
const judges=__PB.judges.map(j=>({...j,body:add(j.body)}));
return [{json:{qr_ok:true,run_token:S.run_token,judges,qa,record:__rec,qa_text:TXT,skips}}];
}catch(e){return [{json:{qr_ok:false,qr_skip:qrErr('QR Merge',e),judges:null,qa:[],record:__rec,qa_text:''}}];}`;

module.exports={ASK_BUILD,CHECK,FINAL,ANS_BUILD,ANS_DONE,MERGE};
