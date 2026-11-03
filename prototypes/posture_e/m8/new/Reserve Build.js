// posture Commitment 8 (operator 2026-11-03): THE METHOD stands at the top of the final judging request of every judge body this builder returns.
const __METHOD_TOP="THE METHOD (Isaiah 28:10), the framework of this debate and of your judgment:\nThe method. Isaiah 28:10 (KJV): \"For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little:\" The case is not one verse; it is verses laid on verses until the point stands. That is how these debates are built and how they are judged.\n- [L1] The KJV verse: the verse itself, quoted exactly.\n- [L2] Source language: the Hebrew or Greek behind the English.\n- [L3] Cross-reference: what the rest of scripture says.\n- [L4] Inference: a conclusion the debater draws from at least two prior layers.\nHow the case is judged. To win, the challenger must break the defender's chain, the linked argument the defender builds for the topic. Defeating one isolated verse or term does not break the chain. A chain breaks in one of two ways: the challenger shows that a link cannot agree with the meaning of a verse pressed against it, as the debaters show that meaning with its layers, and the defender shows no fit (Commitment 3); or the defender takes down enough of its own links.\n\n";
const __MT=(items)=>{const seen=new WeakSet();const walk=(o,d)=>{if(!o||typeof o!=='object'||d>7||seen.has(o))return;seen.add(o);if(Array.isArray(o.messages)&&typeof o.model==='string'){const m=o.messages;for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'){const c=m[i].content;if(typeof c==='string'){if(!c.startsWith('THE METHOD (Isaiah 28:10)'))m[i].content=__METHOD_TOP+c;}else if(Array.isArray(c)){if(!(c[0]&&String(c[0].text||'').startsWith('THE METHOD (Isaiah 28:10)')))c.unshift({type:'text',text:__METHOD_TOP});}break;}}}for(const k of Object.keys(o))walk(o[k],d+1);};(items||[]).forEach(it=>walk(it&&it.json,0));return items;};
const __R=await (async()=>{
// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// PANEL FALLBACK (BB-5693 S3): builds the reserve judge's call from the failed slot's own call, so the reserve gets the same
// rulebook and transcript. The per-family body shapes are those of Panel Build's judge builder, copied, not changed.
const P=$('Panel Build').first().json;const RS=$('Resolve Seats').first().json;const SUB=$('Panel Check').first().json.sub;
if(!SUB||!RS.reserve)throw new Error('FAIL-CLOSED: Reserve Build reached without a substitution or a reserve seat.'+RT);
const src=P.judges[SUB.slot];if(!src||!src.body)throw new Error('FAIL-CLOSED: Reserve Build found no call for panel slot '+(SUB.slot+1)+'.'+RT);
const b0=src.body;let SYS,user;
// judge_fix8 P2: the transcript is the slot's last user turn (in a posture regrade the slot's acceptance exchange comes before it)
if(b0.systemInstruction){SYS=b0.systemInstruction.parts[0].text;user=b0.contents[b0.contents.length-1].parts[0].text;}
else{SYS=b0.messages[0].content;user=b0.messages[b0.messages.length-1].content;}
if(typeof SYS!=='string'||typeof user!=='string'||!SYS||!user)throw new Error('FAIL-CLOSED: Reserve Build could not read the rulebook and transcript from slot '+(SUB.slot+1)+'.'+RT);
const JIDX0={deepseek:0,openai:1,gemini:2,grok:3,mimo:4,openrouter:5};
const j={...RS.reserve,max_tokens:Math.max(Number(RS.reserve.max_tokens)||0,8000)};let body;
// judge_fix8 P2, P3 (JUDGE_POSTURE_DRAFT_v4 Parts 1-3): the acceptance turn, its code check, the return, the quote-back at a cure, and the
// posture answer form. POSTURE.PART2 is v4 Part 2 word for word (test/unitP.cjs compares it with the draft file). Nothing here grades a debate.
const POSTURE=(()=>{
 const PART2="You are an adjudicator of a debate record. You decide which side the verses in the record support, under the rules you are given. You bring nothing from outside the record. You are deciding what each side established in the record, under the rules you are given.\n\n### Commitment 1. The record is the only evidence.\nThe evidence is the rounds of both sides. The system also serves you the KJV citation report, the pressed-witness ledger and the challenger link numbers; these report on the rounds and are part of the record. The pre-checks are aids that decide nothing. Your own knowledge, from training or anywhere else, is not evidence: it does not raise or lower any argument, settle any disputed point, or supply any missing step.\n\n### Commitment 2. I repair nothing.\nYou supply no missing step for either side. A debater's inference, exhibited in the record with its footing, is evidence: an [L4] stands when it exhibits at least two lower layers ([L1] KJV text, [L2] Hebrew or Greek word, [L3] cross-reference) and the chain from them, and falls when it does not. Any inference of your own shows two lower layers, as a debater's must.\n\n### Commitment 3. Meaning, not words.\nScripture does not contradict itself. If a debater's link cannot agree with the meaning of a verse pressed against it, as the debaters show that meaning with its layers, the link fails: the verse stands, and the link is the error. You weigh only the meaning the debaters show, and add none of your own. The wording of one verse alone never decides a link: \"no verse states it\", \"the text nowhere narrates it\" and \"no witness's own words state it\" are never a ground, for either side.\n\n### Commitment 4. One standard for both sides.\nThe same evidentiary, logical and answering threshold applies to both sides, whatever the position, its popularity, or its agreement with consensus. No side receives heightened scrutiny. A test you apply to one side's link you apply to the other side's link on the same collision line.\n\n### Commitment 5. Silence is not neutral.\nA proven press carried under a listed premise's PRESSED WITH line (one that carries its layers, or a checked reference to the round that shows them), and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED. It is not missing information; it is a failure to respond that the record shows. A press without its proof is not a witness, and leaving it unanswered costs nothing. A verse pressed with no listed premise behind it is not a witness. A premise carries at most eight witnesses.\n\n### Commitment 6. I void only by quoting.\nYou rule a listed premise VOID only by quoting the words of its charge that go beyond its quote, and naming the kind: a negation, a universal, or a claim the quote's own words do not make. Paraphrase, reordering and dropped words are not stronger.\n\n### Commitment 7. I judge; I do not only count.\nAt each collision point I decide which link the pressed verses agree with. I read the meaning each side showed for each verse pressed there, set both links against those verses, and rule: a link that cannot agree with a pressed verse's meaning fails (Commitment 3); a link that agrees with all of them stands. Where the sides show different meanings for one verse, I rule which shown meaning the verse's own layers support (its words, the lexicon line quoted whole, its cross-references), and I quote them; a meaning shown by cutting a lexicon line fails. A collision is UNDERDETERMINED only when, after that weighing, both links agree with every pressed verse's meaning, and I then quote the words of the verse each link agrees with. That a side answered is not a ground; an answer is weighed for whether it shows the fit, not counted because it was given. My rulings show two lower layers, as Commitment 2 requires. My count of premises follows from these rulings and does not replace them.\n\n### Commitment 8. The method is Isaiah 28:10.\nThe method. Isaiah 28:10 (KJV): \"For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little:\" The case is not one verse; it is verses laid on verses until the point stands. That is how these debates are built and how they are judged.\n- [L1] The KJV verse: the verse itself, quoted exactly.\n- [L2] Source language: the Hebrew or Greek behind the English.\n- [L3] Cross-reference: what the rest of scripture says.\n- [L4] Inference: a conclusion the debater draws from at least two prior layers.\nHow the case is judged. To win, the challenger must break the defender's chain, the linked argument the defender builds for the topic. Defeating one isolated verse or term does not break the chain. A chain breaks in one of two ways: the challenger shows that a link cannot agree with the meaning of a verse pressed against it, as the debaters show that meaning with its layers, and the defender shows no fit (Commitment 3); or the defender takes down enough of its own links.";
 const HEADS=[...PART2.matchAll(/^### (Commitment \d\. [^\n]+)$/gm)].map(m=>m[1]);
 const LINE='I ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
 const FORM='Reply with each commitment\'s heading above, copied verbatim (for example "'+HEADS[0]+'"), each followed by one line in your own words; then the line: '+LINE;
 const PROMPT='POSTURE FOR ACCEPTANCE\n\n'+PART2+'\n\n'+FORM;
 const RET=f=>'POSTURE RETURNED (once)\n\nYour reply is returned once. Fault'+(f.length===1?'':'s')+': '+f.join('; ')+'.\n\n'+FORM;
 // v4 Part 3, the answer form in posture mode only (SILENCE, SAME TEST); the panel writes them inside "reasoning"
 const ANSWER='POSTURE ANSWER FORM (this judgment). Each judgment carries two checkable lines blocks, after the collision points (in "reasoning"):\nSILENCE: <each pressed witness you counted unanswered: verse, premise, rounds searched>\nSAME TEST: <each test you applied on a collision line: "test T on D<i>; on C<j>: <result>">\nSILENCE is checked against the ledger. SAME TEST is checked for a test applied to one link of a collision line and not to the other.';
 const strip=l=>String(l).replace(/^[\s>#*_\-•]+/,'').replace(/[\s*_]+$/,'').trim();
 const REFUSE=/\b(?:I\s+(?:can(?:no|')t|cannot|won't|will\s+not|am\s+(?:not\s+able|unable)|'m\s+(?:not\s+able|unable)|must\s+decline|decline)|not\s+comfortable|unable\s+to\s+(?:accept|agree|commit))\b/i;
 const HEDGE=/\b(?:however|but\s+I|with\s+(?:the\s+|one\s+|a\s+)?(?:reservation|caveat|qualification)s?|provided\s+that|to\s+the\s+extent|reserve\s+the\s+right|cannot\s+(?:fully|entirely|guarantee)|subject\s+to|where\s+possible|as\s+far\s+as\s+(?:I\s+can|possible))\b/i;
 // the code check (v4 Part 1, step 3): every heading verbatim, the acceptance line verbatim; the own-words lines kept, not graded
 function check(text){const t=String(text==null?'':text);if(!t.trim())return {status:'REFUSE',faults:['empty reply'],lines:{},accept_line:false};
  const L=t.split('\n').map(strip);const used=new Set();const faults=[];const lines={};
  HEADS.forEach((h,k)=>{const n=k+1;const at=L.findIndex(l=>l.startsWith(h));
   if(at<0){const alt=L.findIndex(l=>new RegExp('^Commitment\\s*'+n+'\\b','i').test(l));faults.push('heading '+n+(alt<0?' missing':' altered ("'+L[alt].slice(0,80)+'")'));if(alt>=0)used.add(alt);return;}
   used.add(at);let own=L[at].slice(h.length).replace(/^[\s:\-–—*_]+/,'').trim();
   if(!own){for(let i=at+1;i<L.length;i++){if(!L[i])continue;if(/^Commitment\s*\d/i.test(L[i])||L[i].includes('I ACCEPT'))break;own=L[i];used.add(i);break;}}else used.add(at);
   lines[n]=own||null;});
  const al=L.findIndex(l=>l===LINE);let accept_line=al>=0;if(al>=0)used.add(al);
  if(al<0){const alt=L.findIndex(l=>/\bI\s+ACCEPT\b/i.test(l));faults.push('acceptance line '+(alt<0?'missing':'altered ("'+L[alt].slice(0,80)+'")'));if(alt>=0)used.add(alt);
   if(alt<0&&REFUSE.test(t))return {status:'REFUSE',faults,lines,accept_line:false};}
  if(faults.length)return {status:'FAULT',faults,lines,accept_line};
  const extra=L.filter((l,i)=>l&&!used.has(i)).join(' ');
  return {status:HEDGE.test(extra)?'HEDGE':'ACCEPT',faults:[],lines,accept_line,extra:extra.slice(0,400)||null};}
 // the reply envelope of a chat call, or the failure named
 function env(j){if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
  if(j&&j.error){const e=j.error;return {ok:false,why:String(typeof e==='string'?e:(e.message||e.description||JSON.stringify(e))).slice(0,300)};}
  return {ok:false,why:'no reply text ('+Object.keys(j||{}).join(',')+')'};}
 // the final status of a seat after at most one return (v4 Part 1, steps 4 and 5): the seat sits whatever it is
 const PLACED=['ACCEPT','HEDGE','ACCEPT_ON_RETURN','HEDGE_ON_RETURN'];
 function final(first,second){if(!first)return 'ERROR';if(first.status!=='FAULT')return first.status;if(!second)return 'FAULT_RECORDED';
  return second.status==='ACCEPT'?'ACCEPT_ON_RETURN':second.status==='HEDGE'?'HEDGE_ON_RETURN':second.status==='FAULT'?'FAULT_RECORDED':second.status;}
 // the accepted exchange placed at the head of the judging conversation (chat form; Gemini form for a gemini family body)
 function head(a,gem){if(!a||PLACED.indexOf(a.status)<0||!Array.isArray(a.exchange))return [];
  return gem?a.exchange.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})):a.exchange.map(m=>({role:m.role,content:m.content}));}
 // the commitment a flagged rule breaks (v4 Part 5); a rule not listed there gets no quote-back
 const RULE_C={'K-LXX':1,'K-LB':2,'K-C':3,'K-S':3,'K-S2':3,'SAME TEST':4,'K-G1':5,'K-G4':5,'K-G6':5,'K-G7':5,'K-G10':5,'K-G11':5,'K-U':5,'SILENCE':5,'K-V':6};
 // the cure quote-back (v4 Part 1, step 6): "You accepted: <its words>. Your line: <the line>." per item whose commitment the seat accepted
 function quote(items,a){if(!a||PLACED.indexOf(a.status)<0||!a.lines)return '';const out=[];
  for(const x of (items||[])){const c=RULE_C[x&&x.rule];if(!c||!a.lines[c])continue;const ln=String(x.line||'').replace(/\s+/g,' ').trim();if(!ln)continue;
   out.push('- '+(x.link?x.link+' ':'')+'('+x.rule+', commitment '+c+'): You accepted: "'+a.lines[c]+'". Your line: "'+ln.slice(0,600)+'".');}
  return out.length?'\n\nTHE POSTURE YOU ACCEPTED, QUOTED BACK (your own words at the acceptance turn, beside the line the item flags):\n'+out.join('\n'):'';}
 // the posture head is never read as the debate record (the checkers' prompt text skips it)
 const isHead=(a,i)=>{const m=a[i];if(!m)return false;const tx=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):'';
  if(m.role==='user')return /^POSTURE (?:FOR ACCEPTANCE|RETURNED)/.test(tx(m.content));if(m.role==='assistant'){const p=a[i-1];return !!p&&p.role==='user'&&/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/.test(tx(p.content));}return false;};
 return {PART2,HEADS,LINE,FORM,PROMPT,RET,ANSWER,check,env,final,head,quote,isHead,PLACED,RULE_C};})();
const __RA=(()=>{if($('Init Seats').first().json.posture!==true)return null;const A=$('Accept Final').first().json.acc;return (A.seats||[]).find(x=>x.seat===j.seat)||{status:'ERROR',lines:{}};})(); // judge_fix8 P2: the reserve's own acceptance
const __RH=gem=>__RA?POSTURE.head(__RA,gem):[];
if(j.fam==='gemini')body={systemInstruction:{parts:[{text:SYS}]},contents:__RH(true).concat([{role:'user',parts:[{text:user}]}]),generationConfig:{maxOutputTokens:j.max_tokens,temperature:0}};
else{const m=[{role:'system',content:SYS}].concat(__RH(false),[{role:'user',content:user}]);
 // deepseek judge cap (BB-5700 step 5): its reasoning spent the whole 32,000 before answering (ODV1-25720; ODV1-25744 also returned empty content, cause not read); 65,536 passed at judge size (exec 25745).
 if(j.fam==='deepseek')body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),temperature:0,messages:m};
 else if(j.fam==='grok')body={model:j.api_model,max_tokens:j.max_tokens,temperature:0,messages:m};
 else if(j.fam==='openai')body={model:j.api_model,max_completion_tokens:j.max_tokens,messages:m};
 // openrouter reserves, per seat, exactly the bodies that passed at judge size (BB-5693 rev 6; WALL-0966 1360-1361): glm at reasoning effort
 // medium (effort max spent the whole cap in reasoning, at 32k and at 65,536); qwen at effort max with JSON output (without it, prose).
 // BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).
 // BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).
 else if(j.fam==='openrouter'&&/^x-ai\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens,temperature:0,messages:m};  else if(j.fam==='openrouter'&&/^xiaomi\//.test(j.api_model))body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),messages:m};  else if(j.fam==='openrouter'&&/^google\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens,temperature:0,messages:m};
 else if(j.fam==='openrouter'&&/^openai\//.test(j.api_model))body={model:j.api_model,max_tokens:j.max_tokens,messages:m};
 else if(j.fam==='openrouter'&&j.seat==='glm')body={model:j.api_model,max_tokens:j.max_tokens,messages:m};
 // BB-8510 S3: qwen as reserve or alternate at effort medium, max_tokens max(mt*2,8000); at effort max, 32,000 it returned content null (29912).
 else if(j.fam==='openrouter'&&j.seat==='qwen')body={model:j.api_model,max_tokens:j.max_tokens,messages:m,response_format:{type:'json_object'}};
 else if(j.fam==='openrouter')body={model:j.api_model,max_tokens:j.max_tokens,messages:m};
 // mimo judge (BB-5700 step 8a): thinking disabled. With thinking on, max_tokens 65,536 did not answer within the 900 s limit (exec 25738) and max_completion_tokens 32,000 took 645 s; disabled answered in 57 s (exec 25753).
 else if(j.fam==='mimo')body={model:j.api_model,max_tokens:Math.max(j.max_tokens,65536),messages:m};
 else body={model:j.api_model,max_tokens:j.max_tokens,messages:m};}
const jidx0=(j.fam in JIDX0)?JIDX0[j.fam]:-1;if(jidx0<0)throw new Error('FAIL-CLOSED: reserve seat "'+j.seat+'" family "'+j.fam+'" has no route.'+RT);
return [{json:{run_token:TOK,seat:j.seat,fam:j.fam,jidx0,api_model:j.api_model,body:__orc(body,j.fam,j.api_model,TOK+':reserve:'+j.seat),...(__RA?{posture:{status:__RA.status,placed:!!__RA.placed,lines:__RA.lines||{}}}:{})}}];

})();
return __MT(__R);
