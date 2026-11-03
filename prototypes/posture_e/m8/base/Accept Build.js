// posture v5 (rulings 405-407): the agreement, before anything else in the debate. Every seat that may judge (ORDER less the debaters and qwen,
// which judges nowhere) is sent the posture alone: no rulebook, no debate. DeepSeek (the single judge) goes by its own API (Accept DS Build).
const POSTURE=(()=>{
 const PART2="You are an adjudicator of a debate record. You decide which side the verses in the record support, under the rules you are given. You bring nothing from outside the record. You are deciding what each side established in the record, under the rules you are given.\n\n### Commitment 1. The record is the only evidence.\nThe evidence is the rounds of both sides. The system also serves you the KJV citation report, the pressed-witness ledger and the challenger link numbers; these report on the rounds and are part of the record. The pre-checks are aids that decide nothing. Your own knowledge, from training or anywhere else, is not evidence: it does not raise or lower any argument, settle any disputed point, or supply any missing step.\n\n### Commitment 2. I repair nothing.\nYou supply no missing step for either side. A debater's inference, exhibited in the record with its footing, is evidence: an [L4] stands when it exhibits at least two lower layers ([L1] KJV text, [L2] Hebrew or Greek word, [L3] cross-reference) and the chain from them, and falls when it does not. Any inference of your own shows two lower layers, as a debater's must.\n\n### Commitment 3. Meaning, not words.\nScripture does not contradict itself. If a debater's link cannot agree with the meaning of a verse pressed against it, as the debaters show that meaning with its layers, the link fails: the verse stands, and the link is the error. You weigh only the meaning the debaters show, and add none of your own. The wording of one verse alone never decides a link: \"no verse states it\", \"the text nowhere narrates it\" and \"no witness's own words state it\" are never a ground, for either side.\n\n### Commitment 4. One standard for both sides.\nThe same evidentiary, logical and answering threshold applies to both sides, whatever the position, its popularity, or its agreement with consensus. No side receives heightened scrutiny. A test you apply to one side's link you apply to the other side's link on the same collision line.\n\n### Commitment 5. Silence is not neutral.\nA proven press carried under a listed premise's PRESSED WITH line (one that carries its layers, or a checked reference to the round that shows them), and left unanswered by the later rounds of the side that holds the link, makes that premise UNEXHIBITED. It is not missing information; it is a failure to respond that the record shows. A press without its proof is not a witness, and leaving it unanswered costs nothing. A verse pressed with no listed premise behind it is not a witness. A premise carries at most eight witnesses.\n\n### Commitment 6. I void only by quoting.\nYou rule a listed premise VOID only by quoting the words of its charge that go beyond its quote, and naming the kind: a negation, a universal, or a claim the quote's own words do not make. Paraphrase, reordering and dropped words are not stronger.\n\n### Commitment 7. I judge; I do not only count.\nAt each collision point I decide which link the pressed verses agree with. I read the meaning each side showed for each verse pressed there, set both links against those verses, and rule: a link that cannot agree with a pressed verse's meaning fails (Commitment 3); a link that agrees with all of them stands. Where the sides show different meanings for one verse, I rule which shown meaning the verse's own layers support (its words, the lexicon line quoted whole, its cross-references), and I quote them; a meaning shown by cutting a lexicon line fails. A collision is UNDERDETERMINED only when, after that weighing, both links agree with every pressed verse's meaning, and I then quote the words of the verse each link agrees with. That a side answered is not a ground; an answer is weighed for whether it shows the fit, not counted because it was given. My rulings show two lower layers, as Commitment 2 requires. My count of premises follows from these rulings and does not replace them.";
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
const __SRC=(()=>{for(const n of ['Debate Start','Dry Run Config']){try{if($(n).isExecuted)return $(n).first().json;}catch(e){}}return {};})();
const __B=(__SRC&&__SRC.body&&typeof __SRC.body==='object')?__SRC.body:__SRC;const RT=' execution='+$execution.id;
const __orc=(b,model,key)=>{if(!b||!Array.isArray(b.messages))return b;return {...b,session_id:String(key).slice(0,128)};};
const ENG_SEAT={deepseek:'deepseek',gemini:'gemini',glm:'glm',chatgpt:'chatgpt',mimo:'mimo',qwen:'qwen',grok:'grok',sol:'sol'};
const ORDER=['deepseek','gemini','glm','chatgpt','mimo','qwen','grok','sol'];
const deb=[__B.defender,__B.challenger].map(x=>String((x&&x.engine)||'').trim().toLowerCase());
const M={};$input.all().forEach(i=>{const x=i.json;if(x&&x.seat)M[x.seat]=x;});
const seats=ORDER.filter(s=>deb.indexOf(s)<0&&s!=='qwen');
const out=[];let ds=null;
for(const s of seats){const x=M[s];if(!x||!x.api_model)throw new Error('FAIL-CLOSED: Accept Build: seat "'+s+'" has no ACTIVE model_config row.'+RT);
 const mt=Math.max(Number(x.max_tokens)||0,8000);const m=[{role:'user',content:POSTURE.PROMPT}];
 if(s==='deepseek'){ds={seat:s,role:'judge',api_model:x.api_model,fam:'deepseek',body:{model:x.api_model,max_tokens:Math.max(mt,8000),messages:m}};continue;}
 const body=/^x-ai\/|^google\//.test(x.api_model)?{model:x.api_model,max_tokens:mt,temperature:0,messages:m}:/^xiaomi\//.test(x.api_model)?{model:x.api_model,max_tokens:Math.max(mt,65536),messages:m}:{model:x.api_model,max_tokens:mt,messages:m};
 out.push({json:{acc:{seat:s,role:'judge',api_model:x.api_model,fam:'openrouter',body:__orc(body,x.api_model,$execution.id+':accept:'+s)},ds}});}
if(!out.length)throw new Error('FAIL-CLOSED: Accept Build: no openrouter judge seat to ask.'+RT);
out.forEach(o=>{o.json.ds=ds;});
return out;
