// pkgSJR (W2, Wall 3696): node code for the single-judge re-ask. Shared by build_SJR.cjs and probe_SJR.cjs.
// SJ Re-ask? (IF): the single judge's reply, as Extract Independent Verdict read it, is unreadable (no verdict, or a chain-mark line absent
// under the ODV1-A2 prompt), the judge is an OpenRouter judge (jidx 5), and it has not been re-asked in this run.
exports.IF_EXPR="={{ (()=>{ if($('SJ Re-ask Build').isExecuted) return false; if($('Build Independent Verdict').first().json.jidx!==5) return false; const j=$json; return (!j.verdict_tag||j.verdict_tag==='UNKNOWN')||(j.audit_prompt==='ODV1-A2'&&(!j.defender_chain_mark||!j.challenger_chain_mark)); })() }}";

// SJ Re-ask Build: the judge's own conversation, its unreadable reply, and one user turn naming what is missing.
exports.BUILD=`// pkgSJR (W2, Wall 3696; run 34108): the single judge's reply could not be read (no verdict, or a chain-mark line absent).
// It is asked once more, in the same conversation, for its complete judgment in the form the prompt asks for.
const E=$input.first().json;const B=$('Build Independent Verdict').first().json;
let answer='';try{answer=String($('Verdict Normalizer').first().json.choices[0].message.content||'');}catch(e){answer='';}
const miss=[];if(!E.verdict_tag||E.verdict_tag==='UNKNOWN')miss.push('no verdict (HELD, PARTIAL or BROKEN)');
if(E.audit_prompt==='ODV1-A2'){if(!E.defender_chain_mark)miss.push('no DEFENDER CHAIN MARK line');if(!E.challenger_chain_mark)miss.push('no CHALLENGER CHAIN MARK line');}
const full=!E.verdict_tag||E.verdict_tag==='UNKNOWN';const mode=full?'full':'marks';
const ask=full?('Your reply above cannot be read as a judgment: it has '+miss.join('; ')+'. A verdict is required; "cannot determine" is not an answer the record can hold. '
 +'Grade from the rounds and the reports you were given, and write your complete judgment again from the start, in exactly the form the first message asks for, with every required line, '
 +'ending with the DEFENDER CHAIN MARK and CHALLENGER CHAIN MARK lines. Where the record leaves a point open, grade it under the rules and say so on that line.')
 :('Your judgment above has '+miss.join('; ')+'. Write only the missing line'+(miss.length===1?'':'s')+', each on its own line, in exactly the form the first message asks for: '
 +'"DEFENDER CHAIN MARK: <FOOTED|STRAINED|SLACK> -- <one clause naming the load-bearing link that decides the mark>." and "CHALLENGER CHAIN MARK: <FOOTED|STRAINED|SLACK> -- <one clause naming the load-bearing link that decides the mark>." '
 +'Do not repeat or change anything else in your judgment.');
const vb=B.verdictBody;const msgs=(vb.messages||[]).concat([{role:'assistant',content:answer.trim()?answer:'(no reply)'},{role:'user',content:ask}]);
return [{json:{...B,verdictBody:{...vb,messages:msgs},sjr:{mode,miss,head:answer.replace(/\\s+/g,' ').trim().slice(0,200),ask}}}];`;

// SJ Re-ask Pick: the re-ask reply when it holds text, else the first reply; usage is the sum of both calls.
exports.PICK=String.raw`// pkgSJR (W2): takes the re-ask reply when it holds text, else the first reply, and sends it on to Verdict Normalizer and the extractor.
// Token usage is the sum of both calls, so the run's token count keeps the first call.
const r=$input.first().json||{};let o=null;try{o=$('Verdict Normalizer').first().json;}catch(e){o=null;}
const add=(a,b)=>{if(a==null)return b;if(b==null)return a;if(typeof a==='number'&&typeof b==='number')return a+b;
 if(typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){const z={};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))z[k]=add(a[k],b[k]);return z;}return b;};
const t=r&&Array.isArray(r.choices)&&r.choices[0]&&r.choices[0].message?r.choices[0].message.content:null;
let mode='full';try{mode=$('SJ Re-ask Build').first().json.sjr.mode||'full';}catch(e){mode='full';}
if(typeof t==='string'&&t.trim()&&mode==='full')return [{json:{...r,usage:add(o&&o.usage,r.usage),sjr_pick:{used:'reask',finish:r.choices[0].finish_reason||null}}}];
if(typeof t==='string'&&t.trim()&&o&&Array.isArray(o.choices)){const ml=t.replace(/[*_\x60]+/g,'').split('\n').map(s=>s.trim()).filter(s=>/^(?:[-\u2022]\s*)?(DEFENDER|CHALLENGER) CHAIN MARK\s*:/i.test(s)).map(s=>s.replace(/^[-\u2022]\s*/,''));
 if(ml.length){const c0=String(o.choices[0].message&&o.choices[0].message.content||'');const ch=o.choices.map((c,i)=>i?c:{...c,message:{...c.message,content:c0.replace(/\s+$/,'')+'\n\n'+ml.join('\n')}});
  return [{json:{...o,choices:ch,usage:add(o.usage,r.usage),sjr_pick:{used:'marks',lines:ml.length}}}];}}
const e=r&&r.error;const why=e?(typeof e==='string'?e:(e.message||JSON.stringify(e))):(typeof t==='string'&&t.trim()?'the re-ask reply held no CHAIN MARK line':'the re-ask reply held no text');
return [{json:{...(o||{}),usage:add(o&&o.usage,r.usage),sjr_pick:{used:'first',why:String(why).slice(0,200)}}}];`;

// Cure Check: one line inserted after "const base=...": the run row says which seat gave an unreadable opinion and what was done.
exports.CC_ANCHOR="const base=$('Extract Independent Verdict').first().json;let rs=[];try{if($('Cure Normalize').isExecuted)rs=$('Cure Normalize').all().map(x=>x.json);}catch(e){rs=[];}\n";
exports.CC_LINE="{let __sj=null;try{__sj=$('Init Seats').first().json.single_judge||null;}catch(e){__sj=null;}let __rb=null,__rp=null;try{if($('SJ Re-ask Build').isExecuted)__rb=$('SJ Re-ask Build').first().json.sjr||null;}catch(e){__rb=null;}try{if($('SJ Re-ask Pick').isExecuted)__rp=$('SJ Re-ask Pick').first().json.sjr_pick||null;}catch(e){__rp=null;} const __m=[];if(!base.verdict_tag||base.verdict_tag==='UNKNOWN')__m.push('no verdict');if(base.audit_prompt==='ODV1-A2'){if(!base.defender_chain_mark)__m.push('no DEFENDER CHAIN MARK line');if(!base.challenger_chain_mark)__m.push('no CHALLENGER CHAIN MARK line');} const __w='seat '+(__sj||'unknown')+' ('+(base.judge_model||'model unknown')+')';let __l=null; if(__rb)__l='[AUDIT v36: SINGLE JUDGE RE-ASKED (SJR) -- '+__w+'; the first reply was unreadable: '+(__rb.miss||[]).join(', ')+'; it began: '+cureSafe(__rb.head||'')+'; re-ask ('+(__rb.mode==='marks'?'the missing chain-mark lines only':'the complete judgment')+'): '+(__rp&&__rp.used==='reask'?'answered, and the re-ask reply is the one read':__rp&&__rp.used==='marks'?'answered, and its '+__rp.lines+' chain-mark line'+(__rp.lines===1?' is':'s are')+' added to the first reply':'not usable ('+cureSafe((__rp&&__rp.why)||'no reply')+'), so the first reply is read')+'; now: '+(__m.length?'STILL UNREADABLE, '+__m.join(', '):'readable, verdict '+base.verdict_tag+', defender chain mark '+base.defender_chain_mark+', challenger chain mark '+base.challenger_chain_mark)+'. REVIEW THIS ROW.]'; else if(__m.length)__l='[AUDIT v36: SINGLE JUDGE UNREADABLE (SJR) -- '+__w+': '+__m.join(', ')+'; not re-asked ('+(base.jidx!==5?'the re-ask serves OpenRouter judges only':'no re-ask was made in this run')+'). REVIEW THIS ROW.]'; if(__l)base.independent_verdict_raw=String(base.independent_verdict_raw||'')+'\\n\\n'+__l;} /* pkgSJR */\n";
