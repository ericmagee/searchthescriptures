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
 // each close label with the text it is given: a definition list ("D1 <words>, D2 <words>, ...", three or more) or a block headed by the label.
 // judge_fix6 H3 (run 32293: "C5, C6 -- SUPPORTED" was read as C5 and cut together with the next heading): a block runs to the end of its
 // paragraph and stops at the next heading or label line; a line that heads two labels at once ("C5, C6", "D2 and D3", "C1-C6") is skipped.
 const MULTI=/^[ \t>#*_-]*\**\s*[DC]\d+\**\s*(?:,|and\b|&|\/|[-–—]\s*\**[DC]?\d)\s*\**\s*[DC]?\d/i;
 const closeLabels=(t,sd)=>{const T=String(t||'');const out=[];const L=sd;
  const lists=[...T.matchAll(new RegExp('(?:^|[:;.]\\s+)((?:\\**'+L+'\\d+\\**\\s+[^,;\\n]{4,160}?(?:,\\s*(?:and\\s+)?|;\\s*|\\.\\s*$|\\.(?=\\s)|$)){3,})','gm'))];
  for(const m of lists)for(const x of m[1].matchAll(new RegExp('\\**'+L+'(\\d+)\\**\\s+([^,;\\n]{4,160}?)(?=,\\s*(?:and\\s+)?\\**'+L+'\\d|;|\\.\\s|\\.$|$)','g')))if(!/^(?:vs\b|and\b|[-–—]|to\b|through\b)/i.test(x[2]))out.push({n:+x[1],text:x[2],from:'list'});
  const H=[...T.matchAll(new RegExp('^[ \\t>#*_-]*'+L+'(\\d+)\\b[^\\n]*','gm'))].filter(h=>!/^\s*[^\n]*\bvs\.?\s/i.test(h[0])&&!/ANSWER\s*:/i.test(h[0])&&!MULTI.test(h[0]));
  H.forEach(h=>{if(out.some(o=>o.n===+h[1]))return;const from=h.index+h[0].length;const tail=T.slice(from);
   let e=tail.search(/\n\s*\n|\n[ \t]*#{1,6}\s|\n[ \t>*_-]*\**\s*[DC]\d+\b|\n[ \t>*_-]*\**\s*ANSWER\s*:/);e=e<0?tail.length:e;out.push({n:+h[1],text:T.slice(h.index,from+Math.min(e,2500)),from:'block'});});
  return out;};
 // judge_fix6 H3 (run 32293: both closes kept the declared numbers, and the check fired on both: "D4 ... matches declared D6 better than
 // declared D4", where the label quoted Isaiah 7:14 and Matthew 1:23, the words of its own declared D4): a label maps to a DIFFERENT link only
 // when it shares no verse and no distinctive word with its own (declared link n, or [DR3] LINK block n) and shares at least three points
 // (a verse counts two) with another. A distinctive word is one that stands in at most a third of the links (topic words such as "Joseph"
 // stand in every link and prove nothing). A better score elsewhere is not enough.
 const mismatch=(labels,targets,lab,tlab)=>{const out=[];const TG=targets.map(x=>({k:x.k,w:stems(x.text),v:vkeys(x.text)}));const df={};TG.forEach(x=>x.w.forEach(w=>{df[w]=(df[w]||0)+1;}));
  const lim=Math.max(1,Math.floor(TG.length/3));const dist=w=>(df[w]||0)<=lim;
  const sc=(a,b)=>{let n=0;for(const x of a.w)if(b.w.has(x)&&dist(x))n++;for(const x of a.v)if(b.v.has(x))n+=2;return n;};
  for(const c of labels){const a={w:stems(c.text),v:vkeys(c.text)};const own=TG.find(x=>x.k===c.n);if(!own)continue;const os=sc(a,own);if(os>0)continue;
   const best=TG.filter(x=>x.k!==c.n).map(x=>({k:x.k,s:sc(a,x)})).sort((p,q)=>q.s-p.s)[0];
   if(best&&best.s>=3)out.push(lab+c.n+' ("'+String(c.text).replace(/\s+/g,' ').replace(/[\[\]"*_#]/g,'').trim().slice(0,70)+'") shares no verse and no distinctive word with '+tlab+c.n+' and matches '+tlab+best.k+' (score '+best.s+')');}
  return out;};
 const renum=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const out=[];
  const rm=t.match(RENUM);if(rm&&/\b[DC]\d+\b/.test(t.slice(Math.max(0,rm.index-200),rm.index+400))){const a=Math.max(0,t.lastIndexOf('\n',rm.index)+1);out.push('it states a numbering of its own ("'+t.slice(Math.max(a,rm.index-40),rm.index+120).replace(/\s+/g,' ').replace(/[\[\]"]/g,'').trim()+'")');}
  const nd=nDecl(F),nc=nLink(F);const hd=[...new Set([...t.matchAll(/\bD(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nd&&x>nd);const hc=[...new Set([...t.matchAll(/\bC(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nc&&x>nc);
  if(hd.length)out.push('D'+hd.join(', D')+' above the '+nd+' declared links');if(hc.length)out.push('C'+hc.join(', C')+' above the '+nc+' LINK blocks of [DR3]');
  try{const DL=dlinks(F).map(x=>({k:x.n,text:x.text}));if(DL.length)mismatch(closeLabels(t,'D'),DL,'D','declared D').forEach(x=>out.push(x));
   const CB=cblocks(F).map(x=>({k:x.j,text:x.text}));if(CB.length&&sd==='C')mismatch(closeLabels(t,'C'),CB,'C','[DR3] LINK block C').forEach(x=>out.push(x));}catch(e){}
  return out;};
 const noteR=(F,sd)=>{const r=renum(F,sd);return r.length?'\n\n[CLOSE-ROUND NUMBERING CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR4':'DR4')+'] does not keep the declared numbering (a TRIAL check): '+r.join('; ')+'. Grade by the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks; the close round\'s numbering does not govern.]':'';};
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
  ['ground conceded heading',/^#{1,4}\s*(?:ground|points?|links?)\s+(?:the\s+)?(?:challenger|defender)\s+(?:conceded|granted|dropped)\b/i],
  // judge_fix6 H4 (run 32293: "Not one of them says what D6 says", "is not stated by any verse the defender has shown" went unmarked)
  ['refused',/\brefused\b|\brefutes?\b|\brefuted\b/i],['fails',/\bfail(?:s|ed)?\b/i],
  ['does not stand',/\b(?:does|do|did)\s+not\s+(?:stand|hold|carry|follow|touch|show|name|state|say|reach|bear)\b|\bcannot\s+(?:stand|hold|carry|bear)\b|\bis\s+not\s+(?:stated|shown|written)\s+(?:by|in)\b/i],
  ['inference not stated',/\binferences?\b[^.]{0,80}\b(?:not|never)\s+(?:state|stated|say|said|written)\b/i],
  ['concedes',/\bconced(?:es|ed)\b|\bgrant(?:s|ed)\b|\badmit(?:s|ted)\b/i],
  ['breaks',/\b(?:breaks?|broke|collapses?|collapsed)\b/i],
  ['none of them',/\bnot\s+one\s+of\b|\bnone\s+of\s+(?:them|these|those|its|his|her|their)\b/i]];
 const press=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const O=sd==='D'?'C':'D';
  const other=sd==='D'?/\bchallenger(?:['’]s)?\b|\bC\d+\b/i:/\bdefen(?:der|ce|se)(?:['’]s)?\b|\bD\d+\b/i;const ownL=new RegExp('\\b'+sd+'\\d+\\b'),othL=new RegExp('\\b'+O+'\\d+\\b');
  // a sentence that only reports the other side's own words: "The defender grants enomizeto (was supposed) carries no verdict by lexicon alone."
  // (the defender's close: "I do not claim enomizeto (was supposed) carries a verdict by lexicon alone"): after its reporting verb, its words of
  // four letters or more stand in that order inside one sentence of the other side's rounds, within three times their number of words.
  const QW=x=>String(x).toLowerCase().replace(/[^a-z\u00c0-\u024f\u1e00-\u1eff ]+/g,' ').split(/\s+/).filter(w=>w.length>=4&&!/^(?:that|this|with|from|have|been)$/.test(w));
  const OS=(sd==='D'?[F.gr1,F.gr2,F.dr3,F.dr4]:[F.cr1,F.cr2,F.cr3,F.cr4]).map(x=>String(x||'').replace(/[*_]+/g,'')).join('\n').split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length);
  const said=q=>q.length>=2&&OS.some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}if(k===q.length&&e-st+1<=3*q.length)return true;}return false;});
  const REPORT=/^(?:[DC]\d+\W+)?(?:the\s+)?(?:defender|challenger)(?:['’]s)?\s+(?:grants|granted|says|said|holds|held|states|stated|writes|wrote|narrows|narrowed|answers|answered|concedes|conceded|admits|admitted|drops|dropped|files|filed|claims|claimed|reads|read)\b/i;
  const report=s=>{if(!REPORT.test(s)||/[—–]|\s--\s|;|\bbut\b|\byet\b|\bso\b/i.test(s))return false;return said(QW(s.replace(REPORT,'')));};
  const ownOnly=s0=>{const s=s0.replace(new RegExp('^[\\s>*_-]*'+O+'\\d+\\b[.:)]?\\s*'),'');return !other.test(s)&&(/^(?:I|My|We|Our)\b/.test(s)||ownL.test(s)&&!othL.test(s)||/^(?:Answered|See|Below)\b/i.test(s));};
  const headOther=h=>!/\b(?:my|our)\b/i.test(h)&&(other.test(h)||/\b(?:chain|keystone|links?|case)\b/i.test(h)&&/\b(?:not|no|fails?|cannot|against|why)\b/i.test(h));
  const out=[];const seen=new Set();let scope=null;
  const add=(s0,why)=>{const s=s0.replace(/\*+/g,'').replace(/\s+/g,' ').trim();if(s.length<12)return;const c=s.slice(0,220);if(seen.has(c))return;seen.add(c);out.push({why,s:c});};
  for(const p0 of t.split(/\n[ \t]*\n/)){let L=p0.split('\n');while(L.length&&/^[ \t]*#{1,6}\s/.test(L[0])){scope=headOther(L[0].replace(/^[ \t]*#+\s*/,''))?'heading "'+L[0].replace(/^[ \t]*#+\s*/,'').replace(/[*_]+/g,'').trim().slice(0,60)+'"':null;L=L.slice(1);}
   const p=L.join('\n').trim();if(!p)continue;if(/^[ \t>*_-]*\**\s*ANSWER\s*:/i.test(p))continue; // an answer to a witness pressed against this side is not a press
   const lead=p.replace(/^[ \t>*_#-]+/,'').match(/^\**\s*([DC])(\d+)\b/);const bold=p.match(/^[ \t>_-]*\*\*([^*\n]{4,160})\*\*/);
   const ps=lead?(lead[1]===O?'under '+lead[1]+lead[2]:'own'):(bold&&headOther(bold[1]))?'under the lead "'+bold[1].trim().slice(0,60)+'"':scope;
   for(const s0 of p.split(/\n|(?<=[.!?])["”'’)\]]*\s+(?=["“(\[*_]*[A-Z])/)){const s=s0.replace(/\*+/g,'').replace(/^[ \t>_-]+/,'').trim();if(s.length<12)continue;
    if(report(s))continue;const g=GRADE.find(([k,rx])=>rx.test(s));
    if(g&&(other.test(s)||g[0]==='inference graded')){add(s,g[0]);continue;}
    if(ps&&ps!=='own'&&!ownOnly(s))add(s,ps);}}
  return out;};
 const noteP=(F,sd)=>{const p=press(F,sd);return p.length?'\n\n[CLOSE-ROUND GRADING CHECK -- computed by the system, not by a model; a TRIAL check: ['+(sd==='D'?'CR4':'DR4')+'] holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links. A close round presses nothing (ruling 377): each is DISREGARDED, not a ground for any grade or count: '+p.map((x,i)=>'('+(i+1)+') "'+x.s.replace(/[\[\]"]/g,'')+'"').join(' ')+']':'';};
 return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP};})();
// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// C4: CHALLENGER ROUND 4, CLOSE ROUND (judge_fix3 B1; operator ruling: "will allow the challenger final words on his position (not allowed
// to press in this round)"). Built, called and checked as C3 is: same seat, system prompt, cache markers, OpenRouter session id (__orc) and
// body per family; no reasoning or effort field.
// claude_direct H2/H3 (operator 2026-11-02, cache diagnostics): the direct Anthropic body. __AID maps the stored OpenRouter id to the direct
// model id ("anthropic/claude-sonnet-5.5" -> "claude-sonnet-5-5"). __DIAGPREV: the seat's previous Claude response id in this run, read from
// the output of that seat's latest executed "<round> Call anthropic" node before this round; null on the seat's first Claude call.
const __RND='C4';const __AID=m=>{const x=String(m||'');return /^anthropic\//.test(x)?x.slice(10).replace(/\./g,'-'):x;};const __AOK=id=>/^claude-(?:opus|sonnet|haiku|fable|mythos)-\d+(?:-\d+)?$/.test(String(id||''));const __AIDV=m=>{const id=__AID(m);if(!__AOK(id))throw new Error('VALIDATION: '+__RND+' the model "'+m+'" maps to the direct Anthropic id "'+id+'", which is not a known form; no call made.'+RT);return id;};
const __DIAGPREV=sd=>{const n=+__RND[1];const top=sd===__RND[0]?n-1:(sd==='D'?n:n-1);for(let k=top;k>=1;k--){let o=null;try{const p=$(sd+k+' Call anthropic');if(!p||!p.isExecuted)continue;o=p.first().json;}catch(e){continue;}if(o&&typeof o.id==='string'&&/^msg_/.test(o.id))return o.id;}return null;};
let __DPREV=null;
const FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek'];
// cachefix: Claude cache markers. System split at the DEFENSE DISCIPLINE block (D3 sends the instructions without it); last message marked.
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
// PRESSED-WITNESS LEDGER (BB-6620, P2D BB-6632): computed from the transcript by code, not by a model. Same rule for both seats.
const PWL=(()=>{
 const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
 const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',mic:'Micah',hab:'Habakkuk',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John',rev:'Revelation','1chron':'1 Chronicles','2chron':'2 Chronicles',hag:'Haggai'});
 // BB-8508 (c): KJV chapter lengths (kjv_verses, 66 books); a verse past its chapter's end is not a verse and is dropped.
 const CHL=(()=>{const o={};'Luke=80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53|Jeremiah=19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34|Zechariah=21,13,10,14,11,15,14,23,17,12,17,14,9,21|Malachi=14,17,18,6|Matthew=25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20|Psalms=6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6|Judges=36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25|Mark=45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20|Ruth=22,23,18,22|1 Samuel=28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13|Exodus=22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38|1 Chronicles=54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30|2 Chronicles=17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23|Leviticus=17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34|Revelation=20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21|2 Kings=18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30|Deuteronomy=46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12|Genesis=31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26|2 Corinthians=24,17,18,18,21,18,16,24,15,18,33,21,14|Proverbs=33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31|1 Kings=53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53|Galatians=24,21,29,31,26,18|John=51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25|Job=22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17|Romans=32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27|Ephesians=23,22,21,32,33,24|Acts=26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31|Ecclesiastes=18,26,22,16,20,12,29,17,18,20,10,14|Philippians=30,30,21,23|Colossians=29,23,25,18|1 Thessalonians=10,20,13,18,28|1 Corinthians=31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24|2 Thessalonians=12,17,18|Song of Solomon=17,17,11,16,16,13,13,14|Joshua=18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33|1 Timothy=20,15,16,16,25,21|Isaiah=31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24|2 Timothy=18,26,17,22|Titus=16,15,15|Daniel=21,49,30,37,31,28,28,27,27,21,45,13|Philemon=25|Hebrews=14,18,19,16,14,20,28,13,28,39,40,29,25|Hosea=11,23,5,19,15,11,16,14,17,15,12,14,16,9|Numbers=54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13|Joel=20,32,21|Ezra=11,70,13,24,17,22,28,36,15,44|Amos=15,16,15,13,27,14,17,14,15|Obadiah=21|Jonah=17,10,10,11|Micah=16,13,12,13,15,16,20|Nehemiah=11,20,32,23,19,19,73,18,38,39,36,47,31|2 Samuel=27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25|Nahum=15,13,19|Habakkuk=17,20,19|Zephaniah=18,15,20|Haggai=15,23|Lamentations=22,22,66,22,22|Esther=22,23,15,17,14,14,10,17,32,3|Ezekiel=28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35|James=27,26,18,17,20|1 Peter=25,25,22,19,14|2 Peter=21,22,18|1 John=10,29,24,21,21|2 John=13|3 John=14|Jude=25'.split('|').forEach(x=>{const p=x.split('=');o[p[0]]=p[1].split(',').map(Number);});return o;})();
 const isVerse=(bk,cv)=>{const L=bk?CHL[bk]:null;if(!L)return true;const a=String(cv).split(':');const n=L[+a[0]-1];return !!n&&+a[1]>=1&&+a[1]<=n;};
 const verses=(c,v,tail)=>{const out=[+v];let last=+v;for(const m of String(tail||'').matchAll(/([–—-]|,)\s?(\d{1,3})(?!\d|:)/g)){const n=+m[2];if(m[1]===','){out.push(n);last=n;}else{for(let x=last+1;x<=n&&x-last<=12;x++)out.push(x);last=n;}}return out.map(x=>c+':'+x);};
 const TAIL='((?:\\s?[–—-]\\s?\\d{1,3}(?!\\d|:\\d)|\\s?,\\s?\\d{1,3}(?!\\d|:\\d|\\s+[A-Z]))*)';/* BB-8508 (a): a range or list followed by a colon ('Matthew 1:24-25:') reads whole */
 // Every verse a text names. Book-named ("Luke 2:33, 41") carry their book; bare ("(1:34)", "2:41") inherit the nearest book named before them in the same text, if any.
 // judge_fix4 F6 (run 32266: "(1:24)" in [CR2], with no book, was read as naming Matthew 1:24; ruling 376): scoped, a bare reference takes the last
 // book named only when no sentence ends between them; an answering text is read scoped (namedIn), a pressing list as before.
 const refs=(t,scoped)=>REFP.parse(t,{scoped:!!scoped}).map(r=>{const cvs=verses(r.c,r.v1,r.v2>r.v1?'-'+r.v2:'');return {book:r.book,cv:cvs[0],cvs,label:r.label,ctx:r.ctx};}).map(r=>({...r,cvs:r.cvs.filter(cv=>isVerse(r.book||r.ctx,cv))})).filter(r=>r.cvs.length).map(r=>({...r,cv:r.cvs[0]})); // judge_fix5 G5: REFP, the one reference parser
 // 6643 (b): each answering reference is filed by chapter:verse, with the book it names explicitly, or as bare when it names none.
 const namedIn=t=>{const s=new Map();for(const r of refs(t,true))for(const cv of r.cvs){if(!s.has(cv))s.set(cv,{books:new Set(),bare:false,inh:new Set()});const f=s.get(cv);if(r.book)f.books.add(r.book);else{f.bare=true;if(r.ctx)f.inh.add(r.ctx);}}return s;};
 // Named (BB-6685): the same book names that chapter:verse explicitly; or a bare reference to it inherits that book (the last book named before it); or it appears bare and no reference names it under another book; or the pressed reference itself has no book.
 const isNamed=(N,bk,cv)=>{const f=N.get(cv);if(!f)return false;if(!bk||f.books.has(bk)||f.inh.has(bk))return true;return false;}; // judge_fix4 F6: a reference with no book named in its sentence names no verse
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
 // judge_fix4 F6: a sentence end (the scoped reader of refs).
 const PSENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
 const DEF_RE=/UNSUPPORTED-L4 PREMISES/gi, CH_RE=/CHALLENGER.S UNSUPPORTED-L4 PREMISES/gi;
 const ledger=F=>({defender:side(F.gr2,F.cr3,DEF_RE),challenger:side(F.cr3,F.dr3,CH_RE),dCited:citedNotNamed([['[DR1]',F.gr1],['[DR2]',F.gr2]],F.cr3),cCited:citedNotNamed([['[CR1]',F.cr1],['[CR2]',F.cr2],['[CR3]',F.cr3]],F.dr3)});
 const sideLines=(s,label)=>{if(!s.list)return [label+': no closing premise list found.'];
  return [label+':'].concat(s.premises.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': '+(p.verses===0?'no verse carried; the judge reads this premise from the transcript':p.verses+' verse(s) carried; '+p.named+' named; NOT NAMED: '+(p.notNamed.length?p.notNamed.join(', '):'none'))));};
 const judgeBlock=F=>{let L;try{L=ledger(F);}catch(e){return 'PRESSED-WITNESS LEDGER: not available this run; count witnesses as the rule says.';}
  return ['PRESSED-WITNESS LEDGER -- computed by the system from the transcript text, not by a model, by one rule for both sides. SCOPE: the verses carried by each numbered premise of the list that closes [DR2] (pressed against the defender) and of the CHALLENGER\'S UNSUPPORTED-L4 PREMISES list that closes [CR3] (pressed against the challenger), and whether the answering link round names each verse anywhere. The line beginning "cited in" under each side lists every verse the opposing side cited in the rounds before that link round that the link round does not name; which of those verses were quoted against a link or a listed premise is the judge\'s to decide. Not read by this ledger: ranges longer than 12 verses, references written with v., slash forms such as 24:16/43, and chapter-only references. A reference to a verse past the end of its chapter in the KJV is dropped; the cited-in line lists only references written with their book.']
   .concat(sideLines(L.defender,'AGAINST THE DEFENDER, answered in [CR3]'),[citedLine(L.dCited,'[DR1] or [DR2]','[CR3]')],sideLines(L.challenger,'AGAINST THE CHALLENGER, answered in [DR3]'),[citedLine(L.cCited,'[CR1], [CR2] or [CR3]','[DR3]')],
   ['A verse marked NOT NAMED is unanswered by the rule; a verse marked NAMED may still be unanswered, and the judge decides that.']).join(LF);};
 const roundBlock=(pressing,re)=>{let s;try{s=side(pressing,'',re);}catch(e){return '';}
  if(!s.list||!s.premises.length)return '';
  return ['VERSES EACH PREMISE ABOVE CARRIES -- computed by the system from the list, not by a model:'].concat(s.premises.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': '+(p.notNamed.length?p.notNamed.join(', '):'(no verse reference)'))).join(LF);};
 // ORDER (A) (BB-6708, ruled BB-6712): every verse the opposing side cited in the rounds before a link round is listed for that link round and counted in the ledger; one rule, both sides; which verse was quoted against a link stays the judge's call.
 // BB-8172 C1 (BB-8209): a bare reference takes the book named last before it in the same text (refs ctx); with none, it is left out.
 // The item carries that book, so the not-named test reads the verse under it.
 const citedLabels=t=>{const out=[];const seen=new Set();for(const r of refs(t)){const bk=r.book;if(!bk)continue;{const g=r.label.match(/:(\d+)\s?[–—-]\s?(\d+)/);if(g&&+g[2]-+g[1]+1>12)continue;}/* BB-8508: a range longer than 12 verses is not read, as the header says; BB-8508 (b): only a reference written with its book is listed; a bare one cannot be bound to its book with certainty (measured: 29662, 29434) */const label=bk+' '+r.label.replace(/[–—]/g,'-');if(seen.has(label))continue;seen.add(label);out.push({label,r:r.book?r:{...r,book:bk}});}return out;};
 const citedRounds=rounds=>{const seen=new Set();return rounds.map(([name,t])=>({name,items:citedLabels(t).filter(x=>{if(seen.has(x.label))return false;seen.add(x.label);return true;})}));};
 const citedBlock=(rounds,who)=>{let rs;try{rs=citedRounds(rounds);}catch(e){return '';}if(!rs.some(x=>x.items.length))return '';
  return ['EVERY VERSE '+who+' CITED BEFORE THIS LINK ROUND -- computed by the system from the transcript, not by a model; each verse is listed under the first round that cites it:'].concat(rs.map(x=>x.name+': '+(x.items.length?x.items.map(i=>i.label).join(', '):'none'))).join(LF);};
 const citedNotNamed=(rounds,answering)=>{const N=namedIn(answering);let total=0;const not=[];for(const x of citedRounds(rounds))for(const i of x.items){total++;if(!i.r.cvs.some(cv=>isNamed(N,i.r.book,cv)))not.push(i.label);}return {total,not};};
 const citedLine=(c,rounds,link)=>'cited in '+rounds+' and not named in '+link+' ('+c.not.length+' of '+c.total+'): '+(c.not.length?c.not.join(', '):'none');
 return {ledger,judgeBlock,roundBlock,citedBlock,DEF_RE,CH_RE,side,citedRounds,namedIn,isNamed};})(); // judge_fix3 B1: side, citedRounds, namedIn and isNamed are read by the close-round list

const RW={gr1:$('C1 Extract').first().json.raw,gr2:$('C2 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw};
// judge_fix3 B1: the verses the challenger itself cited in rounds 1-3 (the ledger's citedRounds), the only verses this round may name.
const OWN=(()=>{try{const rs=PWL.citedRounds([['your round 1',RW.gr1],['your round 2',RW.gr2],['your round 3, the link round',RW.dr3]]);return 'THE VERSES YOU CITED IN YOUR EARLIER ROUNDS -- computed by the system from the transcript, not by a model; this round may name only these:\n'+rs.map(x=>x.name+': '+(x.items.length?x.items.map(i=>i.label).join(', '):'none')).join('\n');}catch(e){return '';}})();

// judge_fix5 G1 (run 32284: the defender's close "I have not seen the text of my round 1 declaration"): the close request carries the defender's
// round 1 DECLARED CHAIN verbatim and the [DR3] C list, both read by code (C4P.declared, C4P.cblocks), with the instruction to keep those numbers.
const G1F={cr1:$('D1 Extract').first().json.raw,dr3:$('C3 Extract').first().json.raw};
const G1DECL=(()=>{try{const d=C4P.declared(G1F);return d?'THE DEFENDER\'S DECLARED CHAIN -- the defender\'s round 1 DECLARED CHAIN, copied verbatim by the system. Name the defender\'s links only by these numbers: D<n> is link n of this list and no other:\n'+d:'';}catch(e){return '';}})();
const G1CL=(()=>{try{const c=C4P.cblocks(G1F);return c.length?'YOUR C NUMBERS -- the LINK blocks of your round 3 link round, in its order, read by the system. Keep these numbers in this round: C<j> is the j-th block and no other; do not renumber or restate your links under new numbers:\n'+c.map(x=>'C'+x.j+' = [DR3] '+x.head.slice(0,220)).join('\n'):'';}catch(e){return '';}})();
const sys=I.csys;const msgs=[{role:'user',content:'SUBJECT: '+I.topic+'\n\nYou pressed the challenge. The defender\'s CLOSE ROUND, its final defense, follows:\n\n'+$('D4 Extract').first().json.raw+(OWN?'\n\n'+OWN:'')+(G1CL?'\n\n'+G1CL:'')+(G1DECL?'\n\n'+G1DECL:'')+'\n\nCLOSE ROUND -- your final words. This is the last round of the debate. Give your final words on your own position, '+$('Init Seats').first().json.cpos+' of the topic, from the case you have already made. NO NEW PRESS: in this round you may NOT press any new witness or premise against the defender -- no verse your earlier rounds did not cite, no new premise, no new charge. A verse reference you name here that none of your earlier rounds names is a new press: the system marks it NOT COUNTED for the judges and records it. You may restate, narrow (NARROWED TO: <the limb you keep>) or concede (CONCEDED) your own links, under the numbers your link round gave them (C1..Cm as its LINK blocks; D1..Dn as the defender\'s round 1 DECLARED CHAIN): do not renumber (the system flags a close round that does); this round answers nothing new. Cite every verse by book, chapter and verse and quote it exactly in the KJV.'}];
// judge_fix5 G11: the VERSE SHEET, read by "C4 Verse Sheet" (kjv_verses), appended to the last user message.
const __SHT=(()=>{try{const P=$('D4 Extract').first().json;let rows=[];try{rows=$('C4 Verse Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){rows=[];}return SHEET.text(rows,{sheet_req:P['sheet_req']||[],sheet_off_url:P['sheet_off_url']||[]},'the KJV text of every verse cited so far in this debate, by either side, in the order first cited.');}catch(e){return '';}})();
if(__SHT){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__SHT};break;}}}
return [{json:{run_token:TOK,round:'C4',call:call(R.challenger,sys,msgs)}}];
