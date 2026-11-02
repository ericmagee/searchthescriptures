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
 const req=texts=>{const seen=new Set();const out=[];for(const t of texts)for(const k of REFP.keys(String(t||''),{scoped:true,cap:12})){if(seen.has(k.key))continue;seen.add(k.key);const m=k.key.match(/^(.+) (\d+):(\d+)$/);if(m)out.push({book:m[1],c:+m[2],v:+m[3],key:k.key});}return out;};
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
// judge_fix3 B1: D4 Extract, the defender's close round; read, refusal and truncation checks as D3 Extract.
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const readEnv=(fam,d)=>{let text=null,trunc=false,u={};
 if(fam==='anthropic'){text=((d.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n'))||null;trunc=d.stop_reason==='max_tokens';const x=d.usage||{};u={input_tokens:x.input_tokens||0,output_tokens:x.output_tokens||0,cache_creation_input_tokens:x.cache_creation_input_tokens||0,cache_read_input_tokens:x.cache_read_input_tokens||0};}
 else if(fam==='gemini'){const c=(d.candidates||[])[0]||{};text=(((c.content||{}).parts||[]).filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join(''))||null;trunc=c.finishReason==='MAX_TOKENS';const x=d.usageMetadata||{};u={input_tokens:x.promptTokenCount||0,output_tokens:(Number(x.candidatesTokenCount)||0)+(Number(x.thoughtsTokenCount)||0),cache_creation_input_tokens:0,cache_read_input_tokens:x.cachedContentTokenCount||0};}
 else{const c=(d.choices||[])[0]||{};text=(c.message&&c.message.content)||null;trunc=(c.finish_reason==='length'||c.finish_reason==='model_context_window_exceeded');const x=d.usage||{};u={input_tokens:x.prompt_tokens||0,output_tokens:x.completion_tokens||0,cache_creation_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cache_write_tokens)||0,cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||x.prompt_cache_hit_tokens||0};}
 return {text,trunc,u};};
const B=$('D4 Build').first().json.call;const e=readEnv(B.fam,$input.first().json||{});
// ORDER (BB-6755): a provider refusal is a failed call, not a round: it throws, and the error output takes it to Failure Salvage as a no-text reply does.
const RF=(()=>{const d=$input.first().json||{};if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal':null;const GB=['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY','IMAGE_PROHIBITED_CONTENT'];if(B.fam==='gemini'){const pf=d.promptFeedback||{};if(pf.blockReason)return 'promptFeedback.blockReason='+pf.blockReason;const f=((d.candidates||[])[0]||{}).finishReason;return GB.includes(f)?'finishReason='+f:null;}const c=(d.choices||[])[0]||{};if(c.finish_reason==='content_filter')return 'finish_reason=content_filter';if(c.native_finish_reason==='content_filter'||c.native_finish_reason==='refusal'||GB.includes(c.native_finish_reason))return 'native_finish_reason='+c.native_finish_reason;if(c.message&&typeof c.message.refusal==='string'&&c.message.refusal.trim()!=='')return 'message.refusal: '+c.message.refusal.trim().slice(0,200);return null;})();
const RFT=(e.text&&/^\s*The request was rejected because it was considered high risk\.?\s*$/i.test(e.text))?'reply text is the provider rejection "'+String(e.text).trim().slice(0,80)+'"':null; // BB-6904 rev 8: 27177
if(RF||RFT)throw new Error('VALIDATION: D4 (DEFENDER, '+B.fam+' '+B.model+') refused by the provider: '+(RF||RFT)+'; output_tokens='+e.u.output_tokens+'. A refusal is not a debate round.'+RT);
 // ORDER J (BB-6200): a no-text reply names what the provider reported, so the cause is on the record.
if(!e.text||String(e.text).trim()===''){const d0=$input.first().json||{};const c0=(d0.choices||[])[0]||{};const g0=(d0.candidates||[])[0]||{};const x0=d0.usage||{};const fin=d0.stop_reason||g0.finishReason||c0.finish_reason||null;const rt=(x0.completion_tokens_details&&x0.completion_tokens_details.reasoning_tokens)||(d0.usageMetadata&&d0.usageMetadata.thoughtsTokenCount)||0;const rc=(c0.message&&typeof c0.message.reasoning==='string')?c0.message.reasoning.length:0;const er=d0.error?String(d0.error.message||JSON.stringify(d0.error)).slice(0,200):null;throw new Error('VALIDATION: D4 (DEFENDER, '+B.fam+' '+B.model+') returned no text: finish_reason='+fin+'; output_tokens='+e.u.output_tokens+'; reasoning_tokens='+rt+'; reasoning_chars='+rc+(er?'; error='+er:'')+'.'+RT);}
let raw=e.text;if(e.trunc){raw+='\n\n[TRUNCATED: the provider reported the token limit -- raise max_tokens]';}
const I=$('Init with Guards').first().json;const labelled=I.lab.D+' -- ROUND 4, CLOSE ROUND\n\n'+raw;
// judge_fix4 F5: verses new in the defender's close, and a close that renumbers, recorded on this item (the judges see the same lists, recomputed from the rounds).
let new_in_close=[],renumbered=[],graded=[];try{const F4={cr1:$('D1 Extract').first().json.raw,gr1:$('C1 Extract').first().json.raw,cr2:$('D2 Extract').first().json.raw,gr2:$('C2 Extract').first().json.raw,cr3:$('D3 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw,cr4:raw};new_in_close=C4P.ofD(F4);renumbered=C4P.renum(F4,'D');graded=C4P.press(F4,'D').map(x=>x.s);}catch(x){new_in_close=[];renumbered=[];graded=[];} // judge_fix5 G3
return [{json:{run_token:TOK,round:'D4',raw,labelled,usage:e.u,fam:B.fam,model:B.model,new_in_close,renumbered,graded,...SHEET.plan([$('D1 Extract').first().json.raw,$('C1 Extract').first().json.raw,$('D2 Extract').first().json.raw,$('C2 Extract').first().json.raw,$('D3 Extract').first().json.raw,$('C3 Extract').first().json.raw,raw])}}]; // judge_fix5 G11: the C4 verse sheet
