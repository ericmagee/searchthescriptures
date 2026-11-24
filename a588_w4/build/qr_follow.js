// ASK 588 D7 (W4): the one continuation (follow-up) pass, behind its own switch qr_follow. Operator's choice 06:01Z 11-24 "One continuation pass"; ruling 514/515.
// Each export is node code placed after the 588 prelude (PRE) and QF_COMMON.
const QF_COMMON=`
/* D7: the first pass's questions and answers, and the block text, as QR Merge writes them */
const qrSafe=s=>String(s==null?'':s).split('\\n').map(l=>/^\\s*(?:===\\s*)?\\[(?:CR|DR)[1-4]/i.test(l)||/^\\s*===/.test(l)?'> '+l:l).join('\\n');
function qrQA(Q,F,dd,cd,n0,form){const ans=new Map();[dd,cd].forEach(d=>((d&&d.answers)||[]).forEach(a=>ans.set(a.k,a.raw)));
 return Q.map((q,k)=>{const raw=ans.get(k);const a=raw?qrText(raw):null;const own=new Set(qrRefs(qrSideText(F,q.side)));const nv=a?qrRefs(a).filter(r=>!own.has(r)):[];
  return {n:n0+k+1,judge:q.judge,side:q.side,form:form||q.form,round:q.round,quote:q.quote,earlier_round:q.earlier_round||null,earlier_quote:q.earlier_quote||null,question:q.question,answer:a,new_verses:nv,finish:qrFinish(raw),route:q.route,error:raw&&raw.error?String(raw.error.message||JSON.stringify(raw.error)).slice(0,300):null,...(q.of?{of:q.of}:{})};});}
function qrLine(x){return 'Q'+x.n+' -- judge '+x.judge+' to the '+x.side+', '+(x.of?'FOLLOW-UP to Q'+x.of:x.earlier_quote?'CONTRADICTION QUESTION, quoting ['+x.earlier_round+']: "'+qrSafe(x.earlier_quote)+'" and ['+x.round+']: "'+qrSafe(x.quote)+'"':'quoting ['+x.round+']: "'+qrSafe(x.quote)+'"')+'\\nQuestion: '+x.question+'\\nAnswer: '+(x.answer==null?'(no answer)':qrSafe(x.answer))+(x.new_verses.length?'\\n[NEW VERSE, NOT COUNTED: '+x.new_verses.join(', ')+']':'');}
function qrTXT(qa,fu){return '=== QUESTION ROUND ===\\n'+QR_C8+'\\n\\nBefore you judge, the judges asked the questions below and the debaters answered. '+QR_ANSWERS+' Material beyond the quoted passage, and any verse marked NEW VERSE, NOT COUNTED, is disregarded. A question that quotes two passages of one debater is a contradiction question: the answer does not withdraw either passage; the closing enforcer confirms whether it is a contradiction, and the contradiction rule then applies.'+(fu&&fu.length?' A FOLLOW-UP asks again for the part of an earlier question that its answer left open; it is read with that question and its passage, under the same rule.':'')+'\\n\\n'+qa.concat(fu||[]).map(qrLine).join('\\n\\n')+'\\n=== END QUESTION ROUND ===';}
const QR_AT='DEBATE TRANSCRIPT\\n\\n=== [';
function qrAdd(body,TXT){const ins=u=>{const k=String(u).indexOf(QR_AT);if(k<0)throw new Error('a judge body holds no transcript anchor');return u.slice(0,k)+TXT+'\\n\\n'+u.slice(k);};
 const b=JSON.parse(JSON.stringify(body));const m=b.messages;if(!Array.isArray(m))throw new Error('a judge body has no messages');for(let i=m.length-1;i>=0;i--){const x=m[i];if(!x||x.role!=='user')continue;if(typeof x.content==='string'){x.content=ins(x.content);return b;}if(Array.isArray(x.content)){const p=x.content.find(p=>p&&typeof p.text==='string'&&p.text.includes(QR_AT));if(!p)throw new Error('a judge body holds no transcript anchor');p.text=ins(p.text);return b;}}throw new Error('a judge body has no user message');}
function qrRoutes(){let RGR=null;try{if($('Regrade Row').isExecuted)RGR=$('Regrade Row').first().json;}catch(e){RGR=null;}
 const aid=m=>String(m||'').slice(10).replace(/\\./g,'-');const ROUTE={};for(const side of ['defender','challenger']){let r;
 if(RGR){const m=side==='defender'?RGR.defender_model:RGR.challenger_model;r=!m?{route:'skip',why:'the saved row names no '+side+' model'}:/^anthropic\\//.test(m)?{route:'anthropic',model:aid(m)}:{route:'openrouter',model:m};}
 else{const RS=$('Resolve Seats').first().json;const x=RS&&RS[side];r=!x?{route:'skip',why:'no '+side+' seat'}:x.fam==='anthropic'?{route:'anthropic',model:x.direct_model||aid(x.model)}:x.fam==='openrouter'?{route:'openrouter',model:x.model}:{route:'skip',why:'the '+side+' seat is of family '+x.fam+', which the question round does not route'};}
 ROUTE[side]=r;}return ROUTE;}
/* the first pass, read back from its own nodes */
function qrPass1(){const Q=$('QR Final').all().map(x=>x.json);const sk=qrSkipOf(Q);if(sk)throw new Error('the first pass skipped: '+sk);const F=qrRounds();
 const qa=qrQA(Q,F,$('QR Answer D Done').first().json,$('QR Answer C Done').first().json,0);return {Q,F,qa};}
/* a follow-up names a question already put to that debater, and copies the words of that question or its passage that the answer left open */
function qfCheck(f,side,qa){if(Array.isArray(f))return {faults:['more than one follow-up for one debater; at most one is allowed']};if(f==null||(typeof f==='string'&&/^\\s*none\\s*$/i.test(f))||(typeof f==='object'&&qrEmpty(f.q)&&qrEmpty(f.open)))return {none:true,faults:[]};
 if(Array.isArray(f))return {faults:['more than one follow-up for one debater; at most one is allowed']};
 if(typeof f!=='object')return {faults:['the follow-up is neither NONE nor an object']};const fl=[];
 const n=parseInt(String(f.q||'').replace(/[^0-9]/g,''),10);const x=qa.find(z=>z.n===n);
 if(!x)fl.push('Q'+(isNaN(n)?String(f.q):n)+' does not exist');else if(x.side!==side)fl.push('Q'+n+' was put to the '+x.side+', not the '+side);else if(x.answer==null)fl.push('Q'+n+' has no answer to follow up');else if(x.of)fl.push('Q'+n+' is itself a follow-up');
 const o=qrNorm(f.open);if(o.length<8)fl.push('the open words are missing or under 8 characters');else if(x&&!qrNorm(x.question+' '+x.quote+' '+(x.earlier_quote||'')).includes(o))fl.push('the open words are not found word for word in Q'+n+' or its quoted passage');
 return {faults:fl,n,x};}
const qfQuestion=(n,open)=>'Your answer to Q'+n+' did not answer: "'+String(open).trim()+'". Please explain that part.';
`;

const F_BUILD=`try{
const S=$('Init Seats').first().json;if(S.qr_follow!==true)throw new Error('the follow-up pass is off for this run');
const {qa}=qrPass1();if(!qa.some(x=>x.answer!=null))throw new Error('no first-pass answer came back');
const PB=$('Panel Build').first().json;const TXT=qrTXT(qa,[]);
if(!Array.isArray(PB.judges)||PB.judges.length!==3)throw new Error('Panel Build has '+(PB.judges||[]).length+' judges, expected 3');
const ASK=seat=>'=== FOLLOW-UP - BEFORE YOU JUDGE ===\\nDo not judge yet. You are judge '+seat+'. You have read the questions and answers of the QUESTION ROUND above. You may put at most one follow-up to each debater, on a question already put to that debater (by you or by another judge), when its answer left part of that question unanswered. A follow-up does not count as your one question.\\n\\n'+QR_C8+'\\n\\nGive "q" as the number of that question (for example "Q2"), and "open" as the words, copied word for word from that question or from the passage it quotes, that the answer left unanswered. The program writes the follow-up: Your answer to Q<n> did not answer: "<open>". Please explain that part. If the answers to a debater were full, give "NONE" for that debater.\\n\\nReply with JSON only, in this form:\\n{"defender":{"q":"Q1","open":"<words copied from Q1 or its passage>"},"challenger":"NONE"}';
return PB.judges.map((j,i)=>{if(j.fam!=='openrouter')throw new Error('seat '+j.seat+' is '+j.fam+'; the follow-up pass routes only OpenRouter judge seats');
 const b=qrAdd(j.body,TXT);b.messages.push({role:'assistant',content:'I will not judge yet. I will first decide whether any answer needs a follow-up.'});b.messages.push({role:'user',content:ASK(j.seat)});b.messages.push({role:'system',content:'FOLLOW-UP: this reply is only the JSON of at most two follow-ups. Do not write a judgment, a verdict or any verdict field in this reply; the judgment comes in a later turn.'});delete b.response_format;
 return {json:{i,seat:j.seat,body:b}};});
}catch(e){return [{json:{qr_skip:qrErr('QR Follow Build',e),body:qrOK(qrModel())}}];}`;

const F_FINAL=`try{
const A=$('QR Follow Build').all().map(x=>x.json);const sk=qrSkipOf(A);if(sk)return [{json:{qr_skip:sk}}];
const {F,qa}=qrPass1();const R=$input.all().map(x=>x.json);if(R.length!==A.length)throw new Error(R.length+' replies for '+A.length+' follow-up asks');
const ROUTE=qrRoutes();
const SYS=side=>'You are the '+side.toUpperCase()+' in a finished debate. A judge asked you to explain a passage from your own earlier round, and now asks for the part your answer left open. Explain only that part of that passage. Do not defend your link, answer the other side, add an argument, or cite a verse you did not already cite: any such material is disregarded. You cannot withdraw or change the passage here. Answer in at most 250 words.';
const rec=[],items=[];
A.forEach((a,i)=>{const t=qrText(R[i]);const o=qrParse(t);
 for(const side of ['defender','challenger']){const f=o?o[side]:undefined;const c=o?qfCheck(f,side,qa):{faults:['the reply is not JSON in the form asked']};
  if(c.none){rec.push({pass:'follow',judge:a.seat,side,status:'NONE'});continue;}
  const ok=!c.faults.length;const question=ok?qfQuestion(c.n,f.open):null;
  rec.push({pass:'follow',judge:a.seat,side,of:c.n||null,open:f&&typeof f==='object'?f.open||null:null,question,status:ok?'PASSED':'DROPPED',faults:c.faults,...(ok?{}:{reply:String(t==null?'(none)':t).slice(0,2000)})});
  if(!ok)continue;const x=c.x;
  const rounds=QR_SIDE[side].filter(k=>F[QR_KEY[k]]).map(k=>'['+k+']\\n'+F[QR_KEY[k]]).join('\\n\\n');
  const U='YOUR ROUNDS IN THIS DEBATE:\\n\\n'+rounds+'\\n\\n=== A JUDGE\\'S QUESTION (Q'+x.n+') ===\\n'+(x.earlier_quote?'The judge quoted your earlier round '+x.earlier_round+': "'+x.earlier_quote+'"\\nand your closing round '+x.round+': "'+x.quote+'"':'The judge quoted your round '+x.round+': "'+x.quote+'"')+'\\nQuestion: '+x.question+'\\nYour answer: '+x.answer+'\\n\\n=== THE FOLLOW-UP OF JUDGE '+a.seat+' ===\\n'+question;
  const rt=ROUTE[side];const body=rt.route==='anthropic'?{model:rt.model,max_tokens:4000,system:SYS(side),messages:[{role:'user',content:U}]}:rt.route==='openrouter'?{model:rt.model,max_tokens:4000,messages:[{role:'system',content:SYS(side)},{role:'user',content:U}]}:null;
  items.push({json:{judge:a.seat,side,of:x.n,round:x.round,form:'FOLLOW-UP',quote:f.open,earlier_round:null,earlier_quote:null,question,route:rt.route,route_why:rt.why||null,model:rt.model||null,body}});}});
if(!items.length)return [{json:{qr_skip:'QR Follow Final: no follow-up was asked or none passed the checks',record:rec}}];
items[0].json.record=rec;return items;
}catch(e){return [{json:{qr_skip:qrErr('QR Follow Final',e)}}];}`;

const MERGE2=`const __PB=$('Panel Build').first().json;let __rec=[];
try{
const Q=$('QR Final').all().map(x=>x.json);__rec=(Q[0]&&Q[0].record)||[];const sk=qrSkipOf(Q);if(sk)throw new Error(sk);
const F=qrRounds();const S=$('Init Seats').first().json;
const DD=$('QR Answer D Done').first().json,CD=$('QR Answer C Done').first().json;
const skips=[DD,CD].filter(d=>d&&d.skip).map(d=>d.side+': '+d.skip);
const qa=qrQA(Q,F,DD,CD,0);
if(!qa.some(x=>x.answer))throw new Error('no answer came back'+(skips.length?' ('+skips.join('; ')+')':''));
/* D7: the follow-ups; a fault here keeps the first pass and is recorded */
let fu=[];
if(S.qr_follow===true){try{const FF=$('QR Follow Final');if(!FF||!FF.isExecuted)throw new Error('the follow-up pass did not run');const Q2=FF.all().map(x=>x.json);__rec=__rec.concat((Q2[0]&&Q2[0].record)||[]);const s2=qrSkipOf(Q2);if(s2)throw new Error(s2);
 const D2=$('QR Follow D Done').first().json,C2=$('QR Follow C Done').first().json;[D2,C2].filter(d=>d&&d.skip).forEach(d=>skips.push('follow-up '+d.side+': '+d.skip));
 fu=qrQA(Q2,F,D2,C2,qa.length,'FOLLOW-UP');if(!fu.some(x=>x.answer!=null)){skips.push('follow-up: no follow-up answer came back');fu=[];}}catch(e){skips.push(qrErr('follow-up',e));}}
const TXT=qrTXT(qa,fu);
const judges=__PB.judges.map(j=>({...j,body:qrAdd(j.body,TXT)}));
return [{json:{qr_ok:true,run_token:S.run_token,judges,qa:qa.concat(fu),record:__rec,qa_text:TXT,skips}}];
}catch(e){return [{json:{qr_ok:false,qr_skip:qrErr('QR Merge',e),judges:null,qa:[],record:__rec,qa_text:''}}];}`;

module.exports={QF_COMMON,F_BUILD,F_FINAL,MERGE2};
