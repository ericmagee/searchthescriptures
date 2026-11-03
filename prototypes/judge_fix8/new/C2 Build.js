// judge_fix5 G5 (run 32284: the new-in-close check read "Luke 21:26, 35" as naming Luke 21:26 only and marked Luke 21:35 NEW IN CLOSE; the
// citation scan read "Isaiah 7:11, 7:14" as "Isaiah 7:11,7"): ONE reference parser, REFP, for every check (the ledger, the close-round checks,
// the citation scan, K-G4, K-G6, K-G9 and the C-label record). A reference is "Book c:v", with a range ("c:v-w") and a comma list after it: a
// bare verse number after a full reference in the same list takes that book and chapter ("Luke 21:26, 35" is Luke 21:26 and Luke 21:35); a
// comma list of full chapter:verse references is several references of that book ("Isaiah 7:11, 7:14" is Isaiah 7:11 and Isaiah 7:14). A
// reference with no book takes the last book named before it (ctx); scoped, only when no sentence ends between them (ruling 376). Each node keeps
// its own reading rules on top (range caps, verse-past-chapter drops) through a thin adapter.
const REFP=(()=>{const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',songofsongs:'Song of Solomon',canticles:'Song of Solomon',revelations:'Revelation',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges',jdg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles','1chron':'1 Chronicles','2chron':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',eccles:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',obad:'Obadiah',mic:'Micah',nah:'Nahum',hab:'Habakkuk',zeph:'Zephaniah',hag:'Haggai',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',tit:'Titus',phlm:'Philemon',philem:'Philemon',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John','2jn':'2 John','3jn':'3 John',rev:'Revelation'});
 const book=x=>{if(!x)return null;let b=BK[key(x)];if(!b){const w=String(x).split(/\s/).pop();b=BK[key(w)]||null;}return b;};
 const HEAD=/(?<![A-Za-z0-9:])(?:((?:[1-3]\s)?[A-Z][A-Za-z]+(?:\s(?:of\s)?[A-Z][A-Za-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
 const RNG=/^\s?[–—-]\s?(\d{1,3})(?!\d|:\d)/, FULL=/^\s?,\s?(\d{1,3}):(\d{1,3})(?!\d)/, BARE=/^\s?,\s?(\d{1,3})(?!\d|:\d|\s+[A-Z])/;
 const SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
 // parse(t,{scoped}): every reference, in order: {book (written with it, or the list head's), ctx (the book it takes when written without one),
 // c, v1, v2, at (start of its list head), pos (its own start), label ('c:v' or 'c:v-w'), head (true for the list head)}.
 const parse=(t,o)=>{const T=String(t||'');const sc=!!(o&&o.scoped);const out=[];
  const PO=[...T.matchAll(/(?<![A-Za-z0-9])((?:[1-3]\s)?[A-Z][A-Za-z]+)['’]s\b/g)].map(x=>({at:x.index,b:BK[key(x[1])]||null})).filter(x=>x.b);let pi=0,lastBook=null,lastAt=-1;
  HEAD.lastIndex=0;let m;while((m=HEAD.exec(T))){const b=book(m[1]);
   while(pi<PO.length&&PO[pi].at<m.index){if(PO[pi].at>lastAt){lastBook=PO[pi].b;lastAt=PO[pi].at;}pi++;}
   const ctx=b||((sc&&(lastAt<0||SENT.test(T.slice(lastAt,m.index))))?null:lastBook);if(b){lastBook=b;lastAt=m.index;}
   let c=+m[2];const items=[{book:b,ctx,c,v1:+m[3],v2:+m[3],at:m.index,pos:m.index+(m[1]?m[1].length+1:0),head:true}];let i=m.index+m[0].length,x;
   for(;;){const rest=T.slice(i);
    if((x=rest.match(RNG))){const it=items[items.length-1];const z=+x[1];if(z>it.v2)it.v2=z;i+=x[0].length;continue;}
    if((x=rest.match(FULL))){c=+x[1];items.push({book:b,ctx,c,v1:+x[2],v2:+x[2],at:m.index,pos:i+x[0].search(/\d/),head:false});i+=x[0].length;continue;}
    if((x=rest.match(BARE))){items.push({book:b,ctx,c,v1:+x[1],v2:+x[1],at:m.index,pos:i+x[0].search(/\d/),head:false});i+=x[0].length;continue;}
    break;}
   HEAD.lastIndex=i;items.forEach(it=>{it.label=it.c+':'+it.v1+(it.v2>it.v1?'-'+it.v2:'');it.end=i;out.push(it);});}
  return out;};
 // keys(t,{scoped,cap}): "Book c:v" for every verse named, each reference's book or ctx; a range longer than cap verses keeps its first verse only.
 const keys=(t,o)=>{const cap=(o&&o.cap)||30;const out=[];for(const r of parse(t,o)){const b=r.book||r.ctx;if(!b)continue;const z=r.v2-r.v1>cap?r.v1:r.v2;for(let v=r.v1;v<=z;v++)out.push({key:b+' '+r.c+':'+v,pos:r.at,ref:b+' '+r.label});}return out;};
 return {parse,keys,book,BK,BOOKS};})();
// judge_fix5 G11 (operator: "if they have to pull from our source ... why is the spelling changing"; until now no debater was given KJV text):
// the VERSE SHEET. Before D2, C2, D3, C3, D4 and C4 the KJV text of every verse either side has cited so far (REFP, scoped; a range of more than
// 12 verses gives its first verse only) is read from kjv_verses in ONE request (the node "<round> Verse Sheet"), built here as Citation Scan builds
// its read: one condition per book and chapter (verse.in.(...)), conditions added in the order of first citation while the URL stays within
// 7,000 characters; a verse past that is left off and listed. The Build node prints the rows as stored (bracketed italics and margin notes kept),
// in the order of first citation, capped at SHEET_CAP_VERSES verses and SHEET_CAP_CHARS characters of verse text; every verse left off is listed.
// Round 1 has no sheet of verses cited; the Oracle seat's round 1 gets the verses its served rows name (Init with Guards), and the sheet says so.
const SHEET=(()=>{const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';const URL_MAX=7000;const CAP_V=150,CAP_C=24000;
 const req=texts=>{const seen=new Set();const out=[];for(const t of texts)for(const k of REFP.keys(String(t||''),{scoped:true,cap:12})){if(seen.has(k.key))continue;seen.add(k.key);const m=k.key.match(/^(.+) (\d+):(\d+)$/);if(m)out.push({book:m[1],c:+m[2],v:+m[3],key:k.key});}
  /* judge_fix8 R12 (guard DG-18: never quote Psalm 2:7 without its three NT occasions): a sheet that serves Psalms 2:7 or Acts 13:33 serves Acts 13:33, Hebrews 1:5 and Hebrews 5:5 with it */
  if(seen.has('Psalms 2:7')||seen.has('Acts 13:33'))for(const k of ['Acts 13:33','Hebrews 1:5','Hebrews 5:5']){if(seen.has(k))continue;seen.add(k);const m=k.match(/^(.+) (\d+):(\d+)$/);out.push({book:m[1],c:+m[2],v:+m[3],key:k});}
  return out;};
 const url=ws=>{const G=new Map();for(const w of ws){const g=w.book+'|'+w.c;if(!G.has(g))G.set(g,[]);G.get(g).push(w.v);}
  const conds=[];const off=[];let ulen=BASE.length+'&limit=1000&or='.length+6;
  for(const [g,vs] of G){const [b,c]=g.split('|');const cnd='and(book.eq."'+b+'",chapter.eq.'+c+',verse.in.('+[...new Set(vs)].sort((x,y)=>x-y).join(',')+'))';const add=encodeURIComponent(cnd+',').length;
   if(ulen+add>URL_MAX){vs.forEach(v=>off.push(b+' '+c+':'+v));continue;}ulen+=add;conds.push(cnd);}
  return {url:conds.length?BASE+'&limit=1000&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1',off};};
 const plan=texts=>{const r=req(texts);const u=url(r);return {sheet_url:u.url,sheet_req:r.map(x=>x.key),sheet_off_url:u.off};};
 // the sheet text from the rows read; head names what the sheet holds (round 1: the served rows; later: verses cited so far)
 const text=(rows,P,head)=>{const idx={};(rows||[]).forEach(r=>{if(r&&r.book&&r.chapter!=null&&r.verse!=null)idx[r.book+' '+r.chapter+':'+r.verse]=String(r.text||'');});
  const keys=(P&&P.sheet_req)||[];const offU=new Set((P&&P.sheet_off_url)||[]);const lines=[],cap=[],miss=[];let n=0,ch=0;
  for(const k of keys){if(offU.has(k))continue;const t=idx[k];if(t==null){miss.push(k);continue;}if(n>=CAP_V||ch+t.length>CAP_C){cap.push(k);continue;}lines.push(k+' '+t);n++;ch+=t.length;}
  if(!keys.length)return '';const left=[].concat(offU.size?['not read (request size): '+[...offU].join(', ')]:[],cap.length?['over the cap of '+CAP_V+' verses or '+CAP_C+' characters: '+cap.join(', ')]:[],miss.length?['not in the KJV table as cited (no such verse, or the read failed): '+miss.join(', ')]:[]);
  return 'VERSE SHEET -- '+head+' Read by the system from the record\'s KJV table (kjv_verses), as stored: words in [brackets] are the KJV\'s italics or its margin notes. Quote only from this sheet, or from a verse you name with its full reference (book, chapter and verse) and quote exactly in the KJV.\n'+(lines.length?lines.join('\n'):'(no verse text could be read this round)')+(left.length?'\nLEFT OFF THE SHEET: '+left.join('; ')+'.':'');};
 return {req,url,plan,text,CAP_V,CAP_C};})();
// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// C2: CHALLENGER ROUND 2, CLOSING AND PREMISE LIST. Body built by API family; model from model_config by seat.
// claude_direct H2/H3 (operator 2026-11-02, cache diagnostics): the direct Anthropic body. __AID maps the stored OpenRouter id to the direct
// model id ("anthropic/claude-sonnet-5.5" -> "claude-sonnet-5-5"). __DIAGPREV: the seat's previous Claude response id in this run, read from
// the output of that seat's latest executed "<round> Call anthropic" node before this round; null on the seat's first Claude call.
const __RND='C2';const __AID=m=>{const x=String(m||'');return /^anthropic\//.test(x)?x.slice(10).replace(/\./g,'-'):x;};const __AOK=id=>/^claude-(?:opus|sonnet|haiku|fable|mythos)-\d+(?:-\d+)?$/.test(String(id||''));const __AIDV=m=>{const id=__AID(m);if(!__AOK(id))throw new Error('VALIDATION: '+__RND+' the model "'+m+'" maps to the direct Anthropic id "'+id+'", which is not a known form; no call made.'+RT);return id;};
const __DIAGPREV=sd=>{const n=+__RND[1];const top=sd===__RND[0]?n-1:(sd==='D'?n:n-1);for(let k=top;k>=1;k--){let o=null;try{const p=$(sd+k+' Call anthropic');if(!p||!p.isExecuted)continue;o=p.first().json;}catch(e){continue;}if(o&&typeof o.id==='string'&&/^msg_/.test(o.id))return o.id;}return null;};
let __DPREV=null;
const FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek'];
// cachefix: Claude cache markers. System split at the DEFENSE DISCIPLINE block (D3 sends the instructions without it); last message marked.
// judge_fix7 J4: no system holds that block now (it sits at the end of the D1 and D2 user turn), so each seat's system is one block, the same
// in every round; with the last-message marker a request carries two cache_control breakpoints (the limit is four), all with the 1-hour TTL.
const __cc={type:'ephemeral',ttl:'1h'};const __sysB=s=>{const i=s.indexOf('\n\n=== DEFENSE DISCIPLINE');return i>0?[{type:'text',text:s.slice(0,i),cache_control:__cc},{type:'text',text:s.slice(i),cache_control:__cc}]:[{type:'text',text:s,cache_control:__cc}];};
const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);
const bodyFor=(fam,model,tok,sys,msgs)=>{
 if(fam==='anthropic')return {model:__AIDV(model),max_tokens:tok,system:__sysB(sys),messages:__mk(msgs),diagnostics:{previous_message_id:__DPREV}};
 if(fam==='gemini')return {systemInstruction:{parts:[{text:sys}]},contents:msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:tok}};
 const m=[{role:'system',content:sys},...msgs];
 if(fam==='openai')return {model,max_completion_tokens:tok,messages:m};
 // ORDER J (BB-6200): glm debates at reasoning effort medium, as qwen does; at max it returned no text (ODV1-26217 C1, ODV1-26238 C3).
 // BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).
 // BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).
 if(fam==='openrouter'&&/^anthropic\//.test(model))return {model,max_tokens:tok,messages:[{role:'system',content:__sysB(sys)},...__mk(msgs)]};  if(fam==='openrouter'&&/^(?:x-ai|xiaomi)\//.test(model))return {model,max_tokens:tok,messages:m};  if(fam==='openrouter'&&/^google\//.test(model))return {model,max_tokens:tok,messages:m};
 if(fam==='openrouter'&&/^openai\//.test(model))return {model,max_tokens:tok,messages:m};
 if(fam==='openrouter')return {model,max_tokens:tok,messages:m};
 return {model,max_tokens:tok,messages:m};};
const I=$('Init with Guards').first().json;const R=$('Resolve Seats').first().json;
const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);__DPREV=seat.fam==='anthropic'?__DIAGPREV(seat===R.defender?'D':'C'):null;if(idx<0)throw new Error('ORACLE_DEBATE_V1: no call path for family '+seat.fam+RT);return {fam:seat.fam,fam_idx:idx,model:seat.model,body:__orc(bodyFor(seat.fam,seat.model,seat.tok,sys,msgs),seat.fam,seat.model,TOK+':'+(seat===R.defender?'defender':'challenger')),...(seat.fam==='anthropic'?{diag_prev:__DPREV}:{})};};
const sys=I.csys;const msgs=[{role:'user',content:(()=>{let o=null;try{o=$('C1 Build').first().json.opening_user;}catch(e){o=null;}return typeof o==='string'&&o?o:'DEBATE TOPIC: '+I.topic+'\n\nThe defender opened:\n\n'+$('D1 Extract').first().json.raw+'\n\nChallenge this. Verse-level precision.';})()}, /* judge_fix7 J4 (b): C1's opening message as sent, verse sheet included */{role:'assistant',content:$('C1 Extract').first().json.raw},{role:'user',content:'The defender responded:\n\n'+$('D2 Extract').first().json.raw+'\n\nFinal round. Close your challenge. Then END your response with a section titled exactly UNSUPPORTED-L4 PREMISES -- a numbered list (max 6) of the load-bearing [L4] inferences the DEFENDER\'s case relies on that were NOT exhibited through the prior layers (they float free of [L1]-[L3]). EACH NUMBERED LINE, AFTER ITS NUMBER, BEGINS WITH THE DECLARED CHAIN LINK IT ATTACKS, written exactly as LINK n: , where n is the number of that link in the defender\'s DECLARED CHAIN section; then name the inference and the defender claim it props. If a premise you name maps to NO declared link, write LINK none: and name it anyway -- it is judged, and an undeclared load-bearing premise counts against the defender\'s standing, but it is not counted in the chain length. EVERY premise must carry a verbatim quote of the defender\'s own words from the defender\'s earlier rounds -- the exact string, copied, not paraphrased -- and the premise may charge only what that quote says. After the quote, write PRESSED WITH: and every verse you pressed against that claim in your rounds, this one included, each by reference with its KJV words as you quoted them; write PRESSED WITH: none if you pressed none. Every verse you pressed against the defender\'s case in your rounds, this one included, is named on one of these numbered lines, beside the premise it was pressed against; a verse pressed without the PRESSED WITH: line of a listed premise is not a witness and is not weighed as one (operator ruling 392: a press must have a premise behind it). PRESSED WITH: carries at most 8 verses for one premise (operator ruling 393): a verse after the 8th is not a witness and is not weighed, so carry the 8 that bear most. The verbatim quote of each listed premise is a whole claim sentence of the defender, copied from its first word to its full stop, never a fragment of one. A pressed verse is a witness you carry, not a charge: it never widens what the premise charges. If you cannot quote the defender stating it, it is not the defender\'s premise and must not be listed. No commentary after the list. THEN, on its OWN LINE immediately after the list and nothing after it, write exactly: PREMISE COUNT: <number>, where <number> is how many premises you just listed. This is YOUR count of YOUR OWN list -- it is not the defender\'s chain length and it is never that number.'}];
// judge_fix5 G11: the VERSE SHEET, read by "C2 Verse Sheet" (kjv_verses), appended to the last user message.
const __SHT=(()=>{try{const P=$('D2 Extract').first().json;let rows=[];try{rows=$('C2 Verse Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){rows=[];}return SHEET.text(rows,{sheet_req:P['sheet_req']||[],sheet_off_url:P['sheet_off_url']||[]},'the KJV text of every verse cited so far in this debate, by either side, in the order first cited.');}catch(e){return '';}})();
if(__SHT){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__SHT};break;}}}
return [{json:{run_token:TOK,round:'C2',call:call(R.challenger,sys,msgs)}}];
