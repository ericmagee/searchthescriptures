const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// C3: CHALLENGER ROUND 3, LINK ROUND. Body built by API family; model from model_config by seat.
const FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek'];
const bodyFor=(fam,model,tok,sys,msgs)=>{
 if(fam==='anthropic')return {model,max_tokens:tok,system:[{type:'text',text:sys,cache_control:{type:'ephemeral',ttl:'1h'}}],messages:msgs};
 if(fam==='gemini')return {systemInstruction:{parts:[{text:sys}]},contents:msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:tok}};
 const m=[{role:'system',content:sys},...msgs];
 if(fam==='openai')return {model,max_completion_tokens:tok,messages:m};
 // ORDER J (BB-6200): glm debates at reasoning effort medium, as qwen does; at max it returned no text (ODV1-26217 C1, ODV1-26238 C3).
 if(fam==='openrouter')return {model,max_tokens:tok,reasoning:{effort:/^(?:qwen\/|z-ai\/glm-)/.test(model)?'medium':'max'},messages:m};
 return {model,max_tokens:tok,messages:m};};
const I=$('Init with Guards').first().json;const R=$('Resolve Seats').first().json;
const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);if(idx<0)throw new Error('ORACLE_DEBATE_V1: no call path for family '+seat.fam+RT);return {fam:seat.fam,fam_idx:idx,model:seat.model,body:bodyFor(seat.fam,seat.model,seat.tok,sys,msgs)};};
// PRESSED-WITNESS LEDGER (BB-6620, P2D BB-6632): computed from the transcript by code, not by a model. Same rule for both seats.
const PWL=(()=>{
 const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
 const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',mic:'Micah',hab:'Habakkuk',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John',rev:'Revelation','1chron':'1 Chronicles','2chron':'2 Chronicles',hag:'Haggai'});
 const verses=(c,v,tail)=>{const out=[+v];let last=+v;for(const m of String(tail||'').matchAll(/([–—-]|,)\s?(\d{1,3})(?!\d|:)/g)){const n=+m[2];if(m[1]===','){out.push(n);last=n;}else{for(let x=last+1;x<=n&&x-last<=12;x++)out.push(x);last=n;}}return out.map(x=>c+':'+x);};
 const TAIL='((?:\\s?[–—-]\\s?\\d{1,3}(?![\\d:])|\\s?,\\s?\\d{1,3}(?![\\d:]|\\s+[A-Z]))*)';
 // Every verse a text names. Book-named ("Luke 2:33, 41") carry their book; bare ("(1:34)", "2:41") inherit the nearest book named before them in the same text, if any.
 const refs=t=>{const T=String(t||'');const out=[];const RE=new RegExp('(?<![A-Za-z0-9:])(?:((?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\.?\\s)?(\\d{1,3}):(\\d{1,3})'+TAIL,'g');let lastBook=null;
  for(const m of T.matchAll(RE)){let b=m[1]?BK[key(m[1])]:null;if(m[1]&&!b){const w=m[1].split(/\s/).pop();b=BK[key(w)]||null;}
   if(b)lastBook=b;const tail=String(m[4]||'');const parts=tail.split(',');const rng=parts[0];
   const head=verses(m[2],m[3],rng);out.push({book:b,cv:head[0],cvs:head,label:m[2]+':'+m[3]+rng.replace(/\s/g,''),ctx:b||lastBook});
   for(const c of parts.slice(1)){const mm=c.match(/(\d{1,3})(\s?[–—-]\s?\d{1,3})?/);if(!mm)continue;const vv=verses(m[2],mm[1],mm[2]||'');out.push({book:b,cv:vv[0],cvs:vv,label:m[2]+':'+mm[1]+(mm[2]||'').replace(/\s/g,''),ctx:b||lastBook});}}return out;};
 // 6643 (b): each answering reference is filed by chapter:verse, with the book it names explicitly, or as bare when it names none.
 const namedIn=t=>{const s=new Map();for(const r of refs(t))for(const cv of r.cvs){if(!s.has(cv))s.set(cv,{books:new Set(),bare:false,inh:new Set()});const f=s.get(cv);if(r.book)f.books.add(r.book);else{f.bare=true;if(r.ctx)f.inh.add(r.ctx);}}return s;};
 // Named (BB-6685): the same book names that chapter:verse explicitly; or a bare reference to it inherits that book (the last book named before it); or it appears bare and no reference names it under another book; or the pressed reference itself has no book.
 const isNamed=(N,bk,cv)=>{const f=N.get(cv);if(!f)return false;if(!bk||f.books.has(bk)||f.inh.has(bk))return true;return f.bare&&f.books.size===0;};
 const lastHead=(t,re)=>{let i=-1;for(const m of String(t||'').matchAll(re))i=m.index;return i;};
 const items=t=>String(t||'').split(/\n(?=\s*\**\s*\d+[.)]\s)/).filter(x=>/^\s*\**\s*\d+[.)]\s/.test(x));
 const side=(pressing,answering,headRe)=>{const i=lastHead(pressing,headRe);if(i<0)return {list:false,premises:[]};
  const list=String(pressing).slice(i);const N=namedIn(answering);
  const premises=items(list).map((x,k)=>{const lk=(x.match(/LINK\s+(\d+|none)\b/i)||[])[1]||null;const seen=new Set();const notNamed=[];let named=0;
   for(const r of refs(x)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;seen.add(label);
    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;else notNamed.push(label);}
   return {n:k+1,link:lk,verses:seen.size,named,notNamed};});
  return {list:true,premises};};
 const LF=String.fromCharCode(10);
 const DEF_RE=/UNSUPPORTED-L4 PREMISES/gi, CH_RE=/CHALLENGER.S UNSUPPORTED-L4 PREMISES/gi;
 const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE),challenger:side(F.cr3,F.dr3,CH_RE)});
 const sideLines=(s,label)=>{if(!s.list)return [label+': no closing premise list found.'];
  return [label+':'].concat(s.premises.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': '+p.verses+' verse(s) carried; '+p.named+' named; NOT NAMED: '+(p.notNamed.length?p.notNamed.join(', '):'none')));};
 const judgeBlock=F=>{let L;try{L=ledger(F);}catch(e){return 'PRESSED-WITNESS LEDGER: not available this run; count witnesses as the rule says.';}
  return ['PRESSED-WITNESS LEDGER -- computed by the system from the transcript text, not by a model, by one rule for both sides. SCOPE: the verses carried by each numbered premise of the list that closes [DR2] (pressed against the defender) and of the CHALLENGER\'S UNSUPPORTED-L4 PREMISES list that closes [CR3] (pressed against the challenger), and whether the answering link round names each verse anywhere. Verses carried by the closing premise lists only; a witness pressed elsewhere in the rounds is still the judge\'s to count. Not read by this ledger: ranges longer than 12 verses, references written with v., slash forms such as 24:16/43, and chapter-only references.']
   .concat(sideLines(L.defender,'AGAINST THE DEFENDER, answered in [CR3]'),sideLines(L.challenger,'AGAINST THE CHALLENGER, answered in [DR3]'),
   ['A verse marked NOT NAMED is unanswered by the rule; a verse marked NAMED may still be unanswered, and the judge decides that.']).join(LF);};
 const roundBlock=(pressing,re)=>{let s;try{s=side(pressing,'',re);}catch(e){return '';}
  if(!s.list||!s.premises.length)return '';
  return ['VERSES EACH PREMISE ABOVE CARRIES -- computed by the system from the list, not by a model:'].concat(s.premises.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': '+(p.notNamed.length?p.notNamed.join(', '):'(no verse reference)'))).join(LF);};
 return {ledger,judgeBlock,roundBlock,DEF_RE,CH_RE};})();

const PV=PWL.roundBlock($('D3 Extract').first().json.raw,PWL.CH_RE);
const sys=I.csys;const msgs=[{role:'user',content:'SUBJECT: '+I.topic+'\n\nYou pressed the challenge. The defender\'s LINK ROUND reply follows; it ends with a section titled CHALLENGER\'S UNSUPPORTED-L4 PREMISES -- a numbered list of load-bearing [L4] inferences YOUR case relies on that float free of the prior layers:\n\n'+$('D3 Extract').first().json.raw+(PV?'\n\n'+PV:'')+'\n\nLINK ROUND -- exhibit-or-concede. For EACH numbered premise in the CHALLENGER\'S UNSUPPORTED-L4 PREMISES list, answer in exactly one of two forms: LINK n: SUPPORTED -- exhibit its layer footing: at least two of: the [L1] verse, the [L2] lexical ground, the [L3] cross-reference the inference rests on, and the chain from that footing to the premise; or LINK n: CONCEDED -- it floats free. Two exhibited prior layers is the floor. A built chain is SUPPORTED when its links are shown; fewer than two exhibited layers is scored CONCEDED. Re-asserting the inference without exhibiting its footing is scored CONCEDED. No other moves are admissible -- re-seating belonged to earlier rounds; here you exhibit the footing already built or you concede.'}];
return [{json:{run_token:TOK,round:'C3',call:call(R.challenger,sys,msgs)}}];
