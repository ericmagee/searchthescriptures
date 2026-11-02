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
// judge_fix3 B2 (operator ruling: the challenger's close is "not allowed to press in this round"): any verse reference in [DR4] that no earlier
// challenger round ([DR1]-[DR3]) names is a new press. It is MARKED for the judges as NOT COUNTED (not struck: the transcript the judges read and
// the one published stay word for word the same) and recorded in the review notes. judge_fix5 G5: references are read by REFP, the one parser
// ("Luke 21:26, 35" names Luke 21:35); a range counts as cited before when any verse of it was.
const C4P=(()=>{
 const refs=t=>{const out=[];for(const r of REFP.parse(t,{scoped:true})){const b=r.book||r.ctx;if(!b)continue;const z=Math.max(r.v1,Math.min(r.v2,r.v1+30));const vs=[];for(let x=r.v1;x<=z;x++)vs.push(b+' '+r.c+':'+x);out.push({label:b+' '+r.label,vs});}return out;};
 const fresh=(earlier,c4)=>{const S=new Set();earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>S.add(x))));const seen=new Set();return refs(c4).filter(r=>!r.vs.some(x=>S.has(x))).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));};
 const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],F.dr4):[];
 const note=F=>{const n=of(F);return n.length?'\n\n[CLOSE-ROUND PRESS CHECK -- computed by the system, not by a model: [DR4] names '+n.length+' verse reference(s) that no earlier challenger round names: '+n.join(', ')+'. The close round may not press: each is a NEW PRESS and is NOT COUNTED as evidence, as a witness or as an answer.]':'';};
 // judge_fix4 F5: a verse reference in [CR4] that no earlier round of either side ([CR1]-[DR3]) names is NEW IN CLOSE, NOT COUNTED.
 const ofD=F=>F&&F.cr4?fresh([F.cr1,F.gr1,F.cr2,F.gr2,F.cr3,F.dr3],F.cr4):[];
 const noteD=F=>{const n=ofD(F);return n.length?'\n\n[CLOSE-ROUND NEW-VERSE CHECK -- computed by the system, not by a model: [CR4] names '+n.length+' verse reference(s) that no earlier round of either side names: '+n.join(', ')+'. Each is NEW IN CLOSE, NOT COUNTED: not evidence, footing, witness or answer. Material in [CR4] counts only as an answer to a witness already pressed against the defender; a sentence in [CR4] that grades or presses against a challenger link is disregarded.]':'';};
 // judge_fix5 G1 (run 32284: the defender's close "I have not seen the text of my round 1 declaration, so I take D1-D6 in the order the
 // challenger's blocks answer them: D1 Joseph did not beget the child, D2 ..."; the challenger's close "restate them now under my own numbers";
 // neither was flagged): the DECLARED CHAIN of [CR1] and the LINK blocks of [DR3], read by code; a close is flagged when it states a numbering of
 // its own, names a D or C number above those, or gives a D or C label to a block whose wording and verses match another declared link or
 // another [DR3] LINK block better than its own.
 const declared=F=>{const t=String(F&&F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const a=t.lastIndexOf('\n',i)+1;const L=t.slice(a).split('\n');const out=[L[0]];let on=false,pre=0;
  for(const l of L.slice(1)){const num=/^\s*\**\s*\d+[.)]\s+\S/.test(l);if(num){on=true;out.push(l);continue;}if(!on){if(l.trim()){if(/^\s*#/.test(l)||++pre>3)break;}out.push(l);continue;}
   if(!l.trim()||/^\s+\S/.test(l)||/^\s*[-*•]\s/.test(l)){out.push(l);continue;}break;}
  return out.join('\n').replace(/\s+$/,'');};
 const dlinks=F=>{const t=declared(F);if(!t)return [];const L=[];let cur=null;for(const l of t.split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(.*)$/);if(m){cur={n:+m[1],text:m[2]};L.push(cur);continue;}if(cur&&l.trim())cur.text+=' '+l.trim();}return L;};
 const cblocks=F=>{const t=String(F&&F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index,head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim()});
  return H.map((x,i)=>({j:i+1,n:x.n,head:x.head,text:t.slice(x.at,i+1<H.length?H[i+1].at:t.length)}));};
 const nDecl=F=>{const L=dlinks(F);return L.length?Math.max(...L.map(x=>x.n)):0;};
 const nLink=F=>cblocks(F).length;
 const RENUM=/\b(?:re-?number\w*|I\s+(?:now\s+)?number|number(?:ed|ing)?\s+(?:my|the|its|our|his)\s+(?:chain|links?|premises)|in\s+the\s+order\s+of\s+the\s+link\s+round|under\s+my\s+own\s+numbers?|(?:my|its|our)\s+own\s+number(?:s|ing)|in\s+the\s+order\s+(?:the|my|its|his|their)\s+[^.\n]{0,60}?\b(?:answer(?:s|ed)?|blocks?|list|took)\b|I\s+(?:now\s+)?(?:take|label|restate)\s+(?:them\s+)?[^.\n]{0,30}?\b[DC]1\s*[–—-]\s*[DC]\d|have\s+not\s+seen\s+the\s+text\s+of\s+my\s+(?:round\s+1\s+)?declaration)/i;
 const STOP=new Set('that this these those with from which whom what when where their there than then also into upon such have been were will would shall should could being does each very more most some only link links chain round rounds verse verses text says said stated state states before after because under over about against other another child text rows row stands stand holds hold named names'.split(' '));
 const stems=s=>new Set((String(s).toLowerCase().replace(/[^a-z ]/g,' ').match(/[a-z]{4,}/g)||[]).filter(w=>!STOP.has(w)).map(w=>w.slice(0,5)));
 const vkeys=s=>new Set(REFP.keys(s,{scoped:true,cap:12}).map(k=>k.key));
 const score=(a,b)=>{let n=0;for(const x of a.w)if(b.w.has(x))n++;for(const x of a.v)if(b.v.has(x))n+=2;return n;};
 // each close label with the text it is given: a definition list ("D1 <words>, D2 <words>, ...", three or more) or a block headed by the label
 const closeLabels=(t,sd)=>{const T=String(t||'');const out=[];const L=sd;
  const lists=[...T.matchAll(new RegExp('(?:^|[:;.]\\s+)((?:\\**'+L+'\\d+\\**\\s+[^,;\\n]{4,160}?(?:,\\s*(?:and\\s+)?|;\\s*|\\.\\s*$|\\.(?=\\s)|$)){3,})','gm'))];
  for(const m of lists)for(const x of m[1].matchAll(new RegExp('\\**'+L+'(\\d+)\\**\\s+([^,;\\n]{4,160}?)(?=,\\s*(?:and\\s+)?\\**'+L+'\\d|;|\\.\\s|\\.$|$)','g')))if(!/^(?:vs\b|and\b|[-–—]|to\b|through\b)/i.test(x[2]))out.push({n:+x[1],text:x[2],from:'list'});
  const H=[...T.matchAll(new RegExp('^[ \\t>#*_-]*'+L+'(\\d+)\\b[^\\n]*','gm'))].filter(h=>!/^\s*[^\n]*\bvs\.?\s/i.test(h[0])&&!/ANSWER\s*:/i.test(h[0]));
  H.forEach((h,i)=>{if(out.some(o=>o.n===+h[1]))return;const end=i+1<H.length?H[i+1].index:T.length;const blk=T.slice(h.index,Math.min(end,h.index+2500));out.push({n:+h[1],text:blk,from:'block'});});
  return out;};
 const mismatch=(labels,targets,lab,tlab)=>{const out=[];const TG=targets.map(x=>({k:x.k,w:stems(x.text),v:vkeys(x.text)}));
  for(const c of labels){const a={w:stems(c.text),v:vkeys(c.text)};const own=TG.find(x=>x.k===c.n);const sc=TG.map(x=>({k:x.k,s:score(a,x)})).sort((p,q)=>q.s-p.s);if(!sc.length)continue;const best=sc[0];const os=own?score(a,own):0;
   if(best.k!==c.n&&best.s>=2&&best.s>=os+2)out.push(lab+c.n+' ("'+String(c.text).replace(/\s+/g,' ').replace(/[\[\]"*_#]/g,'').trim().slice(0,70)+'") matches '+tlab+best.k+' better than '+tlab+c.n);}
  return out;};
 const renum=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const out=[];
  const rm=t.match(RENUM);if(rm&&/\b[DC]\d+\b/.test(t.slice(Math.max(0,rm.index-200),rm.index+400))){const a=Math.max(0,t.lastIndexOf('\n',rm.index)+1);out.push('it states a numbering of its own ("'+t.slice(Math.max(a,rm.index-40),rm.index+120).replace(/\s+/g,' ').replace(/[\[\]"]/g,'').trim()+'")');}
  const nd=nDecl(F),nc=nLink(F);const hd=[...new Set([...t.matchAll(/\bD(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nd&&x>nd);const hc=[...new Set([...t.matchAll(/\bC(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nc&&x>nc);
  if(hd.length)out.push('D'+hd.join(', D')+' above the '+nd+' declared links');if(hc.length)out.push('C'+hc.join(', C')+' above the '+nc+' LINK blocks of [DR3]');
  try{const DL=dlinks(F).map(x=>({k:x.n,text:x.text}));if(DL.length)mismatch(closeLabels(t,'D'),DL,'D','declared D').forEach(x=>out.push(x));
   const CB=cblocks(F).map(x=>({k:x.j,text:x.text}));if(CB.length&&sd==='C')mismatch(closeLabels(t,'C'),CB,'C','[DR3] LINK block C').forEach(x=>out.push(x));}catch(e){}
  return out;};
 const noteR=(F,sd)=>{const r=renum(F,sd);return r.length?'\n\n[CLOSE-ROUND NUMBERING CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR4':'DR4')+'] does not keep the declared numbering: '+r.join('; ')+'. Grade by the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks; the close round\'s numbering does not govern.]':'';};
 // judge_fix5 G3 (run 32284: the challenger's close "D1 is refused ...", "The defender's D1, D2, D3 and D4 each stand on an inference the named
 // rows do not state"; the defender's close "By the challenger's own measure ...", "the challenger offered no reading of it"; ruling 377): a
 // sentence in a close round that grades or presses the other side's links is DISREGARDED, listed beside the close for the judges and in the
 // transcript, and recorded by a review line. Read in code: a sentence that names the other side or one of its links and grades it.
 const GRADE=[['own measure',/\b(?:by|on|in)\s+(?:the\s+)?(?:challenger|defender|defence|defense)['’]s\s+own\s+(?:measure|reading|terms|words|account|admission|rows?)\b/i],
  ['no reading offered',/\b(?:challenger|defender|defence|defense)\s+(?:has\s+|had\s+)?(?:offered|offers|gave|gives|has|had|left|leaves)\s+no\s+(?:reading|answer|footing|row|reply|response|account|ground)\b/i],
  ['concession claimed',/\b(?:(?:the\s+)?(?:challenger|defender)|\b[CD]\d+)\s+(?:has\s+|had\s+)?(?:conced(?:es|ed)|grant(?:s|ed)|admit(?:s|ted)|dropp(?:ed)|drops|abandon(?:s|ed)|gave\s+up|gives\s+up)\b/i],
  ['link graded',/\b[CD]\d+(?:\s*(?:,|and|&)\s*[CD]\d+)*\s+(?:is|are|was|were|stands?|lies)\s+(?:refused|broken|refuted|false|unfooted|unsupported|unexhibited|void|collapsed|defeated|overturned|answered|unanswered|fails?)\b/i],
  ['inference graded',/\b(?:each\s+)?(?:stands?|rests?)\s+on\s+(?:an?\s+)?inferences?\b[^.]{0,60}\b(?:do(?:es)?\s+not|never|no)\b/i],
  ['link argued against',/\b[CD]\d+\s+(?:answers|argues|claims|routes|reads|rests)\s+(?:by|that|on)\b|^\s*Against\s+that\b/i],
  ['link left unanswered',/\b(?:left|leaves)\s+[^.]{0,80}\bunanswered\b/i],
  ['ground conceded heading',/^#{1,4}\s*(?:ground|points?|links?)\s+(?:the\s+)?(?:challenger|defender)\s+(?:conceded|granted|dropped)\b/i]];
 const press=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const other=sd==='D'?/\bchallenger\b|\bC\d+\b/i:/\bdefen(?:der|ce|se)\b|\bD\d+\b/i;const out=[];const seen=new Set();
  const body=t.split('\n').filter(l=>!/^\s*\**\s*ANSWER\s*:/i.test(l)).join('\n');
  for(const s0 of body.split(/\n|(?<=[.!?])["”'’)\]]*\s+(?=["“(\[*_]*[A-Z])/)){const s=s0.replace(/\*+/g,'').trim();if(s.length<12)continue;
   const g=GRADE.find(([k,rx])=>rx.test(s));if(!g)continue;if(!other.test(s)&&g[0]!=='inference graded')continue;
   const c=s.replace(/\s+/g,' ').slice(0,220);if(seen.has(c))continue;seen.add(c);out.push({why:g[0],s:c});}
  return out;};
 const noteP=(F,sd)=>{const p=press(F,sd);return p.length?'\n\n[CLOSE-ROUND GRADING CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR4':'DR4')+'] holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links. A close round presses nothing (ruling 377): each is DISREGARDED, not a ground for any grade or count: '+p.map((x,i)=>'('+(i+1)+') "'+x.s.replace(/[\[\]"]/g,'')+'"').join(' ')+']':'';};
 return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP};})();
// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const R=$('Resolve Seats').first().json;const SS=$('Init Seats').first().json;const ORS=[SS.defender&&SS.defender.profile==='oracle'?'DEFENDER':null,SS.challenger&&SS.challenger.profile==='oracle'?'CHALLENGER':null].filter(Boolean);const G3=ORS.length?'3. Drift guard violations by the '+ORS.join(' and ')+' only: the drift guards were given to that seat as The Oracle. A plain seat was never given the drift guards; do not fault a plain seat under any guard. Test that seat\'s GRANTS and CONCESSIONS as well as its claims: a statement a guard lists as FORBIDDEN that the seat granted, accepted at full weight, or conceded, in any round or the link round, is a violation exactly as if the seat had asserted it; quote the seat\'s words and name the guard. ':'3. Neither seat was given the drift guards (both seats are plain): do not assess drift guard violations and do not fault either side under any guard. ';const I=$('Init with Guards').first().json;const mc=R.deepseek;const cr1=$('D1 Extract').first().json.labelled;const gr1=$('C1 Extract').first().json.labelled;const cr2=$('D2 Extract').first().json.labelled;const gr2=$('C2 Extract').first().json.labelled;const cr3=$('D3 Extract').first().json.labelled;const dr3=$('C3 Extract').first().json.labelled;const cr4=$('D4 Extract').first().json.labelled;const dr4=$('C4 Extract').first().json.labelled; /* judge_fix3 B3 */
/* ODV1 step2 (BB-5435/BB-5462/BB-5465): single-judge call routed off hardcoded deepseek via family triad; deepseek branch byte-exact */
const __S2=$('Init Seats').first().json;const __RT2=' run_token='+__S2.run_token;
const __JFAM2={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',qwen:'openrouter'};
const __sj2=__S2.single_judge;const __fam2=__JFAM2[__sj2];
if(!__fam2)throw new Error('ORACLE_DEBATE_V1 Build Synthesis refused: single_judge "'+__sj2+'" has no family map.'+__RT2);
const __M2={};$('Fetch Models').all().forEach(i=>{const x=i.json;if(x&&x.seat)__M2[x.seat]=x;});
const __row2=__M2[__sj2];
if(!__row2||!__row2.api_model)throw new Error('ORACLE_DEBATE_V1 Build Synthesis refused: single_judge "'+__sj2+'" has no ACTIVE model_config row with api_model.'+__RT2);
const __model2=__row2.api_model;const __base2=Math.max(Number(__row2.max_tokens)||0,20000);
const __JIDX2={deepseek:0,openai:1,gemini:2,grok:3,mimo:4,openrouter:5};const __jidx2=__JIDX2[__fam2];
const __out={topic:I.topic,cr1,gr1,cr2,gr2,cr3,dr3,cr4,dr4,gl:I.gl,sd:I.sd,requestBody:{model:mc.api_model,max_tokens:Math.max(mc.max_tokens||0,20000),messages:[{role:'system',content:I.fref},{role:'user',content:'DEBATE COMPLETE\n\n'+I.posline+' The framework is not a combatant: it is the Rules of Engagement and Rules of Interaction, binding BOTH sides.\n\nThis debate was chain-scoped (Isaiah 28:10 rule of engagement): assess both sides by whether they engaged chains as chains or stripped isolated terms.\n\nTOPIC: '+I.topic+'\n\n[DEFENDER R1]\n'+cr1+'\n\n[CHALLENGER R1]\n'+gr1+'\n\n[DEFENDER R2]\n'+cr2+'\n\n[CHALLENGER R2]\n'+gr2+'\n\n[DEFENDER R3 -- LINK ROUND (defender cite-or-concede)]\n'+cr3+'\n\n[CHALLENGER R3 -- LINK ROUND (challenger cite-or-concede)]\n'+dr3+'\n\n[DEFENDER R4 -- CLOSE ROUND (defender final defense)]\n'+cr4+C4P.noteD({cr1,gr1,cr2,gr2,cr3,dr3,cr4})+C4P.noteR({cr1,dr3,cr4},'D')+C4P.noteP({cr1,dr3,cr4},'D')+'\n\n[CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)]\n'+dr4+C4P.note({gr1,gr2,dr3,dr4})+C4P.noteR({cr1,dr3,dr4},'C')+C4P.noteP({cr1,dr3,dr4},'C')+'\n\nSynthesize: 1. What held at L1-L2-L3? List a point here only if no charge in either side\'s lists contests it; a charged point goes under 2 with both sides\' answers, unresolved. 2. Concessions? Include the results of BOTH LINK ROUNDS and BOTH CLOSE ROUNDS: for each link state CITED-WITH-FOOTING, CONCEDED-BY-ITS-OWN-SIDE, NARROWED-BY-ITS-OWN-SIDE (a limb dropped and the link kept is a narrowing, not a concession) or NO-FOOTING-EXHIBITED, on each side; say what the defender\'s close round answered, and quote a side\'s own words for every concession or withdrawal you report. Do NOT use the word "unanswered" anywhere in this analysis: the challenger close round is structurally LAST in this format, so the defender gets no round after it -- that silence is procedural, not a concession, and counts against neither side. The challenger\'s close round may not press: a verse it names that its earlier rounds never named is not counted. A verse counts only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count (operator ruling 3). '+G3+'4. How did the challenger engage, and did the defense hold its ground? 5. Most vulnerable? Do NOT deliver a verdict.'}]}};
const __bf='requestBody';const __b0=__out[__bf];const __sys2=__b0.messages[0].content;const __usr2=__b0.messages[1].content;const __m2=[{role:'system',content:__sys2},{role:'user',content:__usr2}];
let __nb;
if(__fam2==='gemini')__nb={systemInstruction:{parts:[{text:__sys2}]},contents:[{role:'user',parts:[{text:__usr2}]}],generationConfig:{maxOutputTokens:__base2,temperature:0}};
else if(__fam2==='grok')__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2};
else if(__fam2==='openai')__nb={model:__model2,max_completion_tokens:__base2,messages:__m2};
// BB-8403 S3: chatgpt via OpenRouter (openai/) at reasoning effort medium; at max it spent the whole 32,000 in reasoning and returned no text (ODV1-29876 C1). Token budget as its openai branch: max(mt*2,8000).
// BB-8510 S2: gemini via OpenRouter (google/), effort medium; max_tokens and temperature as its former generationConfig (KB-0042, KB-0077).
else if(__fam2==='openrouter'&&/^x-ai\//.test(__model2))__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2}; else if(__fam2==='openrouter'&&/^xiaomi\//.test(__model2))__nb={model:__model2,max_tokens:__base2,messages:__m2}; else if(__fam2==='openrouter'&&/^google\//.test(__model2))__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2};
else if(__fam2==='openrouter'&&/^openai\//.test(__model2))__nb={model:__model2,max_tokens:__base2,messages:__m2};
else if(__fam2==='openrouter')__nb={model:__model2,max_tokens:__base2,messages:__m2};
else __nb={model:__model2,max_tokens:__base2,messages:__m2};
__out[__bf]=__orc(__nb,__fam2,__model2,__S2.run_token+':synthesis:'+__sj2);__out.jidx=__jidx2;__out.judge_model=__model2;
return [{json:__out}];
