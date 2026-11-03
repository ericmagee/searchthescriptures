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
 // judge_fix8 R1 (run 32306, Worker_E A1, Worker_G1 #6: the check disregarded 23 defender close sentences, among them its quotations of
 // Matthew 1:18-20 for its own link and its grants, and the challenger's restatement of its own rows): a close sentence is marked only when it
 // (a) states a grade or verdict of the other side's link (CONCEDED, BROKEN, UNEXHIBITED, fails, is circular, does not carry ...), naming that
 // side or one of its links in the same sentence, or (b) stands in a new list or press against it (a premise list heading, a PRESSED WITH: line,
 // and every sentence under such a heading). Never: a plain verse quotation for the side's own link, the side's own concession or grant, a
 // report of the other side's own words, or a side's restatement of its own rows. The marks under a heading or a link label alone are gone.
 const press=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];
  const other=sd==='D'?/\bchallenger(?:['’]s)?\b|\bC\d+\b/i:/\bdefen(?:der|ce|se)(?:['’]s)?\b|\bD\d+\b/i;
  const QW=x=>String(x).toLowerCase().replace(/[^a-z\u00c0-\u024f\u1e00-\u1eff ]+/g,' ').split(/\s+/).filter(w=>w.length>=4&&!/^(?:that|this|with|from|have|been)$/.test(w));
  const OS=(sd==='D'?[F.gr1,F.gr2,F.dr3,F.dr4]:[F.cr1,F.cr2,F.cr3,F.cr4]).map(x=>String(x||'').replace(/[*_]+/g,'')).join('\n').split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length);
  const said=q=>q.length>=2&&OS.some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}if(k===q.length&&e-st+1<=3*q.length)return true;}return false;});
  const REPORT=/^(?:[DC]\d+\W+)?(?:the\s+)?(?:defender|challenger)(?:['’]s)?\s+(?:grants|granted|says|said|holds|held|states|stated|writes|wrote|narrows|narrowed|answers|answered|concedes|conceded|admits|admitted|drops|dropped|files|filed|claims|claimed|reads|read)\b/i;
  const report=s=>{if(!REPORT.test(s)||/[—–]|\s--\s|;|\bbut\b|\byet\b|\bso\b/i.test(s))return false;return said(QW(s.replace(REPORT,'')));};
  // the side's own grant or concession, never a grade of the other side
  const OWN=/^(?:I|We)\s+(?:grant|concede|accept|withdraw|drop|narrow|do\s+not\s+(?:argue|claim|press|rest))\b|\b(?:I|we)\s+(?:grant|concede|accept|withdraw|drop)\b|\bis\s+accepted\b|^(?:Granted|Conceded)\b/i;
  const VERD=[['own measure',/\b(?:by|on|in)\s+(?:the\s+)?(?:challenger|defender|defence|defense)['’]s\s+own\s+(?:measure|reading|terms|words|account|admission|rows?)\b/i],
   ['no reading offered',/\b(?:offered|offers|gave|gives|has|had|left|leaves)\s+no\s+(?:reading|answer|footing|row|reply|response|account|ground)\b/i],
   ['concession claimed',/\b(?:(?:the\s+)?(?:challenger|defender)(?:['’]s\s+own\s+(?:answer|reading|round|close))?|\b[CD]\d+)\s+(?:has\s+|had\s+)?(?:conced(?:es|ed)|grant(?:s|ed)|admit(?:s|ted)|dropp(?:ed)|drops|abandon(?:s|ed)|gave\s+up|gives\s+up)\b/i],
   ['link graded',/\b[CD]\d+(?:\s*(?:,|and|&)\s*[CD]\d+)*\s+(?:is|are|was|were|stands?|lies)\s+(?:refused|broken|refuted|false|unfooted|unsupported|unexhibited|void|collapsed|defeated|overturned|unanswered|circular|conceded|withdrawn|floating)\b/i],
   ['grade word',/\b(?:CONCEDED|BROKEN|UNEXHIBITED|UNSUPPORTED|VOID|COLLAPSED)\b/],
   ['inference graded',/\b(?:stands?|rests?)\s+on\s+(?:an?\s+)?inferences?\b[^.]{0,60}\b(?:do(?:es)?\s+not|never|no)\b/i],
   ['left unanswered',/\b(?:left|leaves)\s+[^.]{0,80}\bunanswered\b/i],
   ['refused',/\brefused\b|\brefutes?\b|\brefuted\b/i],['fails',/\bfail(?:s|ed)?\b/i],['circular',/\bcircular\b|\bbegs\s+the\s+question\b/i],
   ['does not carry',/\b(?:does|do|did)\s+not\s+(?:stand|hold|carry|follow|reach|bear)\b|\bcannot\s+(?:stand|hold|carry|bear)\b|\bis\s+not\s+(?:stated|shown|written)\s+(?:by|in)\b/i],
   ['breaks',/\b(?:breaks?|broke|collapses?|collapsed)\b/i],['floats',/\bfloats?\b|\bunfooted\b/i]];
  // (b) a new list or press: a premise list heading, or a PRESSED WITH: line
  const LISTH=/\bUNSUPPORTED-?\s*\[?L4\]?\s*PREMISES\b|\bPREMISES?\s+(?:LIST|AGAINST)\b|\bPREMISE\s+COUNT\s*:/i;const PW=/\bPRESSED\s+WITH\s*:/i;
  const out=[];const seen=new Set();let list=null;
  const add=(s0,why)=>{const s=s0.replace(/\*+/g,'').replace(/\s+/g,' ').trim();if(s.length<12)return;const c=s.slice(0,220);if(seen.has(c))return;seen.add(c);out.push({why,s:c});};
  for(const p0 of t.split(/\n[ \t]*\n/)){let L=p0.split('\n');while(L.length&&/^[ \t]*#{1,6}\s/.test(L[0])){const h=L[0].replace(/^[ \t]*#+\s*/,'').replace(/[*_]+/g,'').trim();list=LISTH.test(h)?'new premise list "'+h.slice(0,60)+'"':null;L=L.slice(1);}
   const p=L.join('\n').trim();if(!p)continue;if(/^[ \t>*_-]*\**\s*ANSWER\s*:/i.test(p))continue; // an answer to a witness pressed against this side is not a press
   const bold=p.match(/^[ \t>_-]*\*\*([^*\n]{4,160})\*\*/);if(bold&&LISTH.test(bold[1]))list='new premise list "'+bold[1].trim().slice(0,60)+'"';else if(LISTH.test(p.split('\n')[0])&&p.split('\n')[0].length<160)list='new premise list "'+p.split('\n')[0].replace(/[*_#]+/g,'').trim().slice(0,60)+'"';
   for(const s0 of p.split(/\n|(?<=[.!?])["”'’)\]]*\s+(?=["“(\[*_]*[A-Z])/)){const s=s0.replace(/\*+/g,'').replace(/^[ \t>_-]+/,'').trim();if(s.length<12)continue;
    if(list){add(s,list);continue;}if(PW.test(s)){add(s,'PRESSED WITH line');continue;}
    if(report(s)||OWN.test(s))continue;if(!other.test(s))continue;const g=VERD.find(([k,rx])=>rx.test(s)&&(k!=='concession claimed'||/\b[CD]\d+\b|\b(?:link|chain|premise|ground|point|case)s?\b/i.test(s)));if(g)add(s,g[0]);}} // a concession claimed of a link, chain, ground or point; not a report of a granted reading
  return out;};
 // judge_fix8 R2 (run 32306: the judges were sent 34 sentences under the challenger's close, the transcript printed 37, because each node read
 // the check from a different set of rounds): the check is computed once, in Build Synthesis, from every round; stored in review_notes by Build
 // Save Body (one AUDIT v27 line per close, its sentences in full); and printed from the stored result for the judges and in the transcript.
 const noteL=(p,sd)=>p&&p.length?'\n\n[CLOSE-ROUND GRADING CHECK -- computed by the system, not by a model; a TRIAL check: ['+(sd==='D'?'CR4':'DR4')+'] holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links. A close round presses nothing (ruling 377): each is DISREGARDED, not a ground for any grade or count: '+p.map((x,i)=>'('+(i+1)+') "'+String(x).replace(/[\[\]"]/g,'')+'"').join(' ')+']':'';
 const noteP=(F,sd,stored)=>noteL(Array.isArray(stored)?stored:press(F,sd).map(x=>x.s),sd);
 const all=F=>({D:F&&F.cr4?press(F,'D').map(x=>x.s):[],C:F&&F.dr4?press(F,'C').map(x=>x.s):[]});
 const storeLine=(p,sd)=>'[AUDIT v27: CLOSE-ROUND GRADING CHECK ('+sd+'4) -- STORED, computed once from every round; a TRIAL check: the '+(sd==='D'?'defender':'challenger')+'\'s close round holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links; each is marked DISREGARDED for the judges'+(p.length?': '+p.map((x,i)=>'('+(i+1)+') "'+String(x).replace(/[\[\]"]/g,'')+'"').join(' ')+'. REVIEW THIS ROW.]':'.]');
 const stored=(notes,sd)=>{const m=String(notes||'').match(new RegExp('\\[AUDIT v27: CLOSE-ROUND GRADING CHECK \\('+sd+'4\\) -- STORED[^\\]]*?holds (\\d+) sentence\\(s\\)[^\\]]*\\]'));if(!m)return null;
  const p=[...m[0].matchAll(/\((\d+)\) "([^"]*)"/g)].map(x=>x[2]);return p.length===+m[1]?p:null;};
 return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,all,storeLine,stored};})();
const r = $('Get Row').first().json;
const J = $('Get Judgments').all().map(i => i.json).filter(j => j && j.judge_seat);
const v = $('Get Verse').first().json;
if (!r || !r.id) throw new Error('No debate_results row for this run_token.');
const ALTN0 = { alt_minimax31: 'MiniMax M3.1 Flash', alt_minimax3: 'MiniMax M3' }; // the alternates' names, as ALTN below (head line of a removed seat, DoD 25)
const NAME = {claude:'Claude',chatgpt:'ChatGPT',gemini:'Gemini',grok:'Grok',mimo:'MiMo',haiku:'Claude Haiku',opus:'Claude Opus',glm:'GLM',qwen:'Qwen',deepseek:'DeepSeek'};
const nm = e => NAME[e] || e || '?';
const ORDER = ['deepseek','gemini','glm','chatgpt','mimo','qwen','grok'];
J.sort((a,b) => ORDER.indexOf(a.judge_seat) - ORDER.indexOf(b.judge_seat));
const oracleSeat = r.defender_profile === 'oracle' ? 'defender' : (r.challenger_profile === 'oracle' ? 'challenger' : null);
const REC = "the record's reading", STD = 'the standard reading';
const dpos = oracleSeat === 'challenger' ? STD : REC;
const cpos = oracleSeat === 'challenger' ? REC : STD;
// Each verdict word grades the defender's chain (engine_manual, the line-1 grade); the label names that side (ORDER M, P5).
const VSIDE = " (a grade of the defender's chain: " + nm(r.defender_engine) + ", arguing " + dpos + ")";
const prof = p => p === 'oracle' ? 'as The Oracle, with the TRUTH framework and the record' : 'plain, without the framework or the record';
const cnt = n => n == null ? 'not counted' : (n === 1 ? '1 link conceded' : n + ' links conceded');
const misrouted = (r.defender_engine === 'mimo' && /\//.test(r.defender_model || '') && !/^xiaomi\//.test(r.defender_model || '')) || (r.challenger_engine === 'mimo' && /\//.test(r.challenger_model || '') && !/^xiaomi\//.test(r.challenger_model || ''));
let verse = String(v.text || '').replace(/\s*\[[^\]]*:\s*or,[^\]]*\]\s*$/, '').replace(/\[([^\]]+)\]/g, '*$1*').trim();
const date = String(r.created_at || '').slice(0, 10);
// Single judge (also the synthesis analyst): the first engine not seated, never assumed to be DeepSeek.
let SJ = null; try { SJ = $('Init Seats').first().json.single_judge; } catch (e) { SJ = null; }
const jm = String(r.judge_model || '').toLowerCase();
const SJN = SJ ? nm(SJ) : (/^gemini/.test(jm) ? 'Gemini' : /(^|\/)grok/.test(jm) ? 'Grok' : /^(gpt|chatgpt|o\d)/.test(jm) ? 'ChatGPT' : /deepseek/.test(jm) ? 'DeepSeek' : /mimo/.test(jm) ? 'MiMo' : /glm/.test(jm) ? 'GLM' : /qwen/.test(jm) ? 'Qwen' : '?');
// Reader cleanup (operator order 2026-10-04, Worker_C findings BB-4821 items 1-4).
const demote = x => String(x == null ? '' : x).replace(/^(#{1,6})(?=\s)/gm, h => '#'.repeat(Math.min(6, h.length + 2)));
const noMarkers = x => String(x == null ? '' : x).replace(/^[ \t]*\[(?:EXTRACTOR|AUDIT)\b[^\n]*\][ \t]*$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
// Guards named for the reader (BB-5809 F2, ruling BB-5811 Q1): each DG-number becomes the guard's drift_guards subject, cut at its first ' — ', '; ' or '. ' and at 80 characters, with the number kept in parentheses; in every section.
const GD = {}; try { $('Get Guards').all().forEach(i => { const g = i.json; if (g && g.rule_num != null) GD[g.rule_num] = g.subject; }); } catch (e) { }
const gshort = x => { let y = String(x || '').split(/ — |; |\. /)[0].replace(/[\s.,;:]+$/, '').replace(/^"([^"]*)"$/, '$1').replace(/"/g, "'"); if (y.length > 80) y = y.slice(0, 80).replace(/\s+\S*$/, '') + '...'; return y; };
const gq = n => '"' + gshort(GD[n]) + '"';
const gone = n => GD[n] != null ? 'guard ' + gq(n) + ' (DG-' + n + ')' : 'guard DG-' + n;
const glist = (g, poss) => { const ns = g.match(/\d+/g) || []; if (poss && ns.length === 1) return GD[ns[0]] != null ? gq(ns[0]) + ' guard' + poss + ' (DG-' + ns[0] + ')' : 'guard DG-' + ns[0] + poss; const p = ns.map((n, i) => i ? gone(n).replace(/^guard /, '') : gone(n)); return p.length < 2 ? p.join('') : p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1]; };
const cap = (y, off, str) => (off === 0 || /(^|[.!?]\s+|\n[ \t>*_-]*)$/.test(str.slice(Math.max(0, off - 6), off))) ? y.charAt(0).toUpperCase() + y.slice(1) : y;
// The author's own article and modifier are kept ("a full DG-60 violation" reads "a full guard ... violation"); a number with no article of its own prints the guard's name alone, nothing added (operator ruling "option 1", BB-5836).
const nameOnly = (g, poss) => { const ns = g.match(/\d+/g) || []; if (poss && ns.length === 1) return GD[ns[0]] != null ? gq(ns[0]) + ' guard' + poss + ' (DG-' + ns[0] + ')' : 'DG-' + ns[0] + poss; const one = n => GD[n] != null ? gq(n) + ' (DG-' + n + ')' : 'DG-' + n; const p = ns.map(one); return p.length < 2 ? p.join('') : p.slice(0, -1).join(', ') + ' and ' + p[p.length - 1]; };
const nameGuards = x => String(x == null ? '' : x).replace(/\b(?:(an?|the)(\s+(?:full\s+)?))?(DG-\d+(?:\s*\/\s*DG-\d+)*)(['’]s)?/gi, (m, art, mod, g, poss, off, str) => !art ? nameOnly(g, poss) : cap((/^an$/i.test(art) ? art.charAt(0) : art) + mod + glist(g, poss).replace(/^guard (?=.* and )/, 'guards '), off, str));
// The single judge's diagnostic follows the synthesis behind a marker line (BB-5809 F3); it is printed as its own section, and its [GR1]/[GR2] (the challenger's rounds) read as [DR1]/[DR2] (F6, ruling Q2).
const DIAG_MARK = '--- ORACLE_DEBATE_V1 BROKEN DIAGNOSTIC ---';
const synthParts = x => { let y = String(x == null ? '' : x); const k = y.indexOf('--- ORACLE_DEBATE_V1 CONFIRMATION ---'); if (k > -1) y = y.slice(0, k); const d = y.indexOf(DIAG_MARK); return d > -1 ? [y.slice(0, d), y.slice(d + DIAG_MARK.length)] : [y, null]; };
const synthClean = x => demote(nameGuards(noMarkers(x))).trim();
// The diagnostic model's own tags ([VERDICT], [ACTION], [TENSION], [TENSION-ROW / PRIMARY]; ODV1-25502, 25581, 25634, 25804, 25907) are dropped and the sentence kept:
// an emphasised tag with its emphasis, a tag ending a sentence with the space before it, any other with the space after it. Every other bracket ([L1], [DR1], [CR3], [DG-60], verse margins) stays.
const noDiagTags = x => String(x).replace(/(\*\*|__)\[(?:VERDICT|ACTION|TENSION(?:-ROW[ \t]*\/[ \t]*[A-Z][A-Z ]*[A-Z])?)\]\1[ \t]*/g, '').replace(/[ \t]+\[(?:VERDICT|ACTION|TENSION(?:-ROW[ \t]*\/[ \t]*[A-Z][A-Z ]*[A-Z])?)\](?=[.,;:!?)]|[ \t]*$)/gm, '').replace(/\[(?:VERDICT|ACTION|TENSION(?:-ROW[ \t]*\/[ \t]*[A-Z][A-Z ]*[A-Z])?)\][ \t]*/g, '');
const diagClean = x => synthClean(noDiagTags(String(x).replace(/\[GR([1-3])\]/g, '[DR$1]').replace(/\bGR([1-3])\b/g, 'DR$1')));
// Link-round forfeit (operator-approved 2026-10-04): count the premise list each side filed against the other.
const listCount=(text,re)=>{const s=String(text||'');const g=new RegExp(re.source,'gi');let m,last=-1;while((m=g.exec(s))!==null)last=m.index+m[0].length;if(last<0)return {n:0,missing:true};const tail=s.slice(last);const pc=tail.match(/PREMISE COUNT:\s*\**\s*(\d+)/i);if(pc)return {n:+pc[1],missing:false};return {n:(tail.match(/^\s*[*_]*\s*\d+[.)]\s+\S/gm)||[]).length,missing:false};};
const d={gr2:r.engine_r2,cr3:r.engine_r3};
const vsDef=listCount(d.gr2,/UNSUPPORTED-L4 PREMISES/);const vsCh=listCount(d.cr3,/CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES/);const FF=[];
if(vsDef.n===0)FF.push('**Link round forfeited by the challenger:** the challenger listed no claims against the defender, so the defender had nothing to answer in its link round. That round carries no information, and the defender cannot be marked COLLAPSED for it.');
if(vsCh.n===0)FF.push('**Link round forfeited by the defender:** the defender listed no claims against the challenger, so the challenger had nothing to answer in its link round. That round carries no information about the challenger.');

const ONE_RULEBOOK = String(r.created_at || '') >= '2026-10-04T00:33';
const RULES = ONE_RULEBOOK ? '**One rulebook.** Every panel judgment applies these same rules.\n\n' : '**Note on this run.** It ran before 4 October 2026, 00:33 UTC. The single judge applied the rules above; the three panel judges were given only the three verdict words and graded by their own judgment, without these counting rules. From that time on, all four judges apply the same rules.\n\n';
// ORDER I (BB-6182, ruling BB-6185 (a)): worked text keyed "reason", not "reasoning" (ODV1-26257, debate_judgments 708), is read under "reason" here and in panelText.
// A panel verdict whose reasoning carries unescaped quotation marks fails JSON.parse (ODV1-25869 Gemini, BB-5827); its six fields, in their fixed order with the reasoning last, are then read by position.
const looseVerdict = s => { const m = String(s).match(/^\{\s*"verdict_tag"\s*:\s*"(\w+)"\s*,\s*"defense_standing"\s*:\s*"([^"]*)"\s*,\s*"challenge_standing"\s*:\s*"([^"]*)"\s*,\s*"conceded_links"\s*:\s*(\d+|null)\s*,\s*"challenger_conceded_links"\s*:\s*(\d+|null)\s*,\s*"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}$/); if (!m) return null; const num = x => x === 'null' ? null : +x; return { verdict_tag: m[1], defense_standing: m[2], challenge_standing: m[3], conceded_links: num(m[4]), challenger_conceded_links: num(m[5]), reasoning: m[6].replace(/\\(n|t|"|\\)/g, (q, c) => c === 'n' ? '\n' : c === 't' ? '\t' : c) }; };
// BB-7397 rev 8 DoD 17: the Verdict and standing lines show the judgment as counted (the stored row's columns, after any cure); where the
// judge's own text differs, its own value is named beside it.
// BB-7397 rev 9 DoD 21: a judgment whose cure changed its verdict (its CORRECTED RESULT line, ORIGINAL not COUNTED) prints the counted clause
// first, then its own RESULT, CLAUSE and KEYSTONE lines, quoted, under one line saying they are its text before the cure.
const curedTo = raw => { const m = String(raw || '').match(/\[AUDIT v21: CORRECTED RESULT -- SEAT: [^;\]]*; ORIGINAL: (\w+); COUNTED: (\w+) \(((?:BROKEN|PARTIAL|HELD)-\d)\)(?:; RETRACTED: ([^\]]*))?\]/); return m && m[1] !== m[2] ? { orig: m[1], counted: m[2], code: m[3], retracted: (m[4] || '').trim() } : null; };
const beforeCure = (txt, c) => { if (!c) return txt; const L = String(txt).split('\n'); const own = /^[ \t*_]*(RESULT|CLAUSE|KEYSTONE)[ \t*_]*:/; const at = L.findIndex(l => own.test(l)); if (at < 0) return txt;
  const mine = L.filter(l => own.test(l)), rest = L.filter(l => !own.test(l)); const head = rest.slice(0, at), tail = rest.slice(at);
  return head.concat(['CLAUSE: ' + c.code + " -- counted after the judge's cure" + (c.retracted ? '; retracted: ' + c.retracted : ''), '', "The judge's own lines before its cure, not counted:", ''], mine.map(l => '> ' + l.trim()), [''], tail).join('\n'); };
// judge_fix8 R4 (run 32306: GLM's printed judgment kept DEFENSE STANDING: SELF-SUPPORTED -- L=6 c=0 and four collision lines in their first form after
// the cure): the cure writes each corrected line in place and keeps the original on an AUDIT v27 SUPERSEDED LINE; the original prints below it.
const superOf = raw => [...String(raw || '').matchAll(/\[AUDIT v27: SUPERSEDED LINE -- (?:SEAT: [^;\]]*; )?LABEL: ([^;\]]*); ORIGINAL: ([^\]]*?) ; END\]/g)].map(m => ({ label: m[1].trim().toUpperCase(), orig: m[2].replace(/\((CR[1-4]|DR[1-4]|L[1-4])\)/g, '[$1]') }));
const superApply = (txt, raw) => { const S = superOf(raw); if (!S.length) return txt; const used = new Set(); const out = [];
  for (const l of String(txt).split('\n')) { out.push(l); const u = l.replace(/[*_`]+/g, '').replace(/^\s*(?:[-•]|\d+[.)])?\s*/, '').replace(/\s+VS\.?\s+/i, ' VS ').toUpperCase(); const k = S.findIndex((x, i) => !used.has(i) && u.startsWith(x.label)); if (k < 0) continue; used.add(k);
    out[out.length - 1] = l + ' *(corrected by the cure)*'; out.push('', '> *Superseded by the cure (the judge\'s line before it):* ' + S[k].orig.replace(/\s+/g, ' '), ''); }
  return out.join('\n'); };
const panelText = (raw, j) => { let o = null; const a = String(raw || '').indexOf('{'), b = String(raw || '').lastIndexOf('}'); try { if (a > -1 && b > a) o = JSON.parse(String(raw).slice(a, b + 1)); } catch (e) { o = looseVerdict(String(raw).slice(a, b + 1)); }
  if (!o || typeof o !== 'object' || !o.verdict_tag) return raw ? demote(nameGuards(noMarkers(raw))) : '(no text recorded)';
  const cv = k => (j && j[k] != null && j[k] !== '') ? j[k] : o[k]; const num = x => (x == null || x === '') ? null : +x;
  const wrote = (k, f) => { const a = cv(k), b = o[k]; return (f ? f(a) !== f(b) : a !== b) ? ' (counted after its cure; the judge wrote ' + (b == null ? 'none' : b) + ')' : ''; };
  return '**Verdict:** ' + cv('verdict_tag') + VSIDE + wrote('verdict_tag') + '\n\n**Defense standing:** ' + (cv('defense_standing') || '?') + ', ' + cnt(num(cv('conceded_links'))) + wrote('defense_standing') + wrote('conceded_links', num) + '\n\n**Challenge standing:** ' + (cv('challenge_standing') || '?') + ', ' + cnt(num(cv('challenger_conceded_links'))) + wrote('challenge_standing') + wrote('challenger_conceded_links', num) + '\n\n' + demote(nameGuards(noMarkers(superApply(beforeCure((o.reasoning == null && o.reason != null ? o.reason : o.reasoning) || '(no reasoning given)', curedTo(raw)), raw)))); };
// judge_fix5 G4 (run 32284: DeepSeek's seat went to the reserve and nothing said why): one line naming the seat, the reason (error, timeout, empty
// reply, unreadable, refused) and the reserve; the HTTP status where the node exposes it (on an error) and the reply text length.
const g4Line=(sb,N)=>{if(!sb||!sb.failed_seat)return null;N=N||(x=>x);const d=String(sb.detail||'');const why=sb.reason||(sb.failure_kind==='timeout'?'timeout':sb.failure_kind==='refused'?'refused':sb.failure_kind==='error'?'error':/returned no JSON object\. First 200 chars:\s*$/.test(d)?'empty reply':'unreadable');
 const ex=[];if(why==='empty reply'||why==='error')ex.push(sb.http_status!=null?'HTTP status '+sb.http_status:'HTTP status not exposed by the node');if(sb.body_chars!=null)ex.push('reply text '+sb.body_chars+' characters');else if(why==='empty reply')ex.push('reply text 0 characters');if(sb.retried)ex.push('the call was repeated once on its empty reply');
 return 'Reserve seated: panel seat '+N(sb.failed_seat)+' gave no usable judgment ('+why+(ex.length?'; '+ex.join('; '):'')+'); the reserve '+N(sb.substitute)+' judged in its place.';};
let t = '# TRUTH App Debate\n\n';
// Panel failure notice and run time (operator order 2026-10-08, Worker_A3 thread).
let PF = null; try { if ($('Panel Failure Note').isExecuted) PF = $('Panel Failure Note').first().json; } catch (e) { PF = null; }
if (PF) t += '> **RUN INCOMPLETE: the panel stage failed.** It stopped at node "' + PF.failed_node + '": ' + PF.failed_msg + '\n>\n> The debate rounds and the synthesis below are complete and saved. The panel verdict is missing or partial.\n\n';
const ct = x => x.toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
const runTime = () => { let s = null; try { s = $('Init Seats').first().json.t0; } catch (e) { s = null; } const end = new Date(); if (!s) return '**Run time:** not recorded (the run started before the start time was kept).'; const ms = end - new Date(s); const m = Math.floor(ms / 60000), sec = Math.round((ms % 60000) / 1000); let rg = false; try { rg = $('Init Seats').first().json.regrade === true; } catch (e) { rg = false; } if (rg) return '**Run time:** not kept for the original run. The panel stage failed on that run and was re-judged on ' + ct(new Date(s)) + '; the re-judging took ' + m + ' min ' + sec + ' s.'; return '**Run time:** ' + m + ' min ' + sec + ' s (started ' + ct(new Date(s)) + ', transcript written ' + ct(end) + ').'; };
// judge_fix5 G8 (Worker_E A7: "Verdict of the debate: HELD" above "Outcome: UNDERDETERMINED" read as a contradiction): the outcome first, with one
// plain line, computed from the row's fields, when the panel verdict and the outcome differ.
{const pv=r.panel_verdict,oc=r.outcome,sp=r.panel_split?' ('+r.panel_split+')':'';const MAPV={HELD:'DEFENDER PREVAILS',PARTIAL:'DEFENDER PREVAILS, WEAKENED',BROKEN:'CHALLENGER PREVAILS'};
 const W=['no','one','two','three','four','five'];const nw=x=>W[x]||String(x);const ud=(Array.isArray(r.underdetermined_seats)?r.underdetermined_seats:[]).filter(x=>/:RESULT$/.test(String(x))).length;
 let why='';if(oc&&!(pv&&MAPV[pv]===oc)){const held=pv==='HELD'?"The defender's chain held"+sp:pv==='PARTIAL'?"The defender's chain held, weakened"+sp:pv==='BROKEN'?"The defender's chain was broken"+sp:pv?'The panel reached no majority verdict'+sp:'The panel did not finish';
  why=oc==='UNDERDETERMINED'?held+"; the challenger's chain also stood for "+nw(ud)+' judge'+(ud===1?'':'s')+', so the question is left open.':r.citation_block?held+', but '+String(r.citation_block).replace(/\.$/,'')+'; the outcome goes to review.':/REVIEW/.test(oc)?held+'; the outcome goes to review.':held+'; the outcome is '+oc+'.';}
 t += '**Outcome:** ' + (oc || 'not recorded') + (why ? '. ' + why : '') + '\n\n';}
t += '**Topic:** ' + r.topic + '\n\n';
t += '**Defender:** ' + nm(r.defender_engine) + ' (' + (r.defender_model || 'model not recorded') + '), ' + prof(r.defender_profile) + ', arguing ' + dpos + '.\n\n';
t += '**Challenger:** ' + nm(r.challenger_engine) + ' (' + (r.challenger_model || 'model not recorded') + '), ' + prof(r.challenger_profile) + ', arguing ' + cpos + '.\n\n';
if (misrouted) t += '**Note:** MiMo ran through OpenRouter on this run (mis-routed).\n\n';
t += '**Judges:**\n\n';
// THE DEBATE FIXED (BB-7397, DoD 1): the panel's verdict is the debate's verdict; the single judge is a SECOND OPINION, its word read from its
// own stored text (a CORRECTED RESULT line first), never from framework_verdict, which now carries the panel's verdict.
const SJV = (() => { const s = String(r.independent_verdict_raw || ''); const c = s.match(/\[AUDIT v21: CORRECTED RESULT -- [^\]]*COUNTED: (HELD|PARTIAL|BROKEN)\b/); if (c) return c[1]; const m = s.replace(/[*_`#>\s]+/g, ' ').trim().match(/^"?\{?[^A-Z]*?\b(HELD|PARTIAL|BROKEN)\b/); return m ? m[1] : null; })();
t += '- Verdict of the debate: ' + (r.panel_verdict ? '**' + r.panel_verdict + '** (the panel)' : '**UNGRADED** (the panel did not finish)') + VSIDE + '\n';
// THE DEBATE FIXED rev 7, DoD 10 (c) (his 1, BB-7504: readers never see the second opinion): each counted seat's verdict with its reason, the
// sentence of its own RESULT line; a seat not in judged_by says so. The single judge's reading is kept in the stored row only.
const seatReason = raw => { const m = String(raw || '').replace(/\\n/g, '\n').match(/RESULT[ \t*_]*:[ \t*_]*(?:DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)[ \t*_]*(?:--|—|–)[ \t]*([^\n"]+)/); return m ? m[1].replace(/\\"/g, '"').trim() : null; };
const COUNTED = Array.isArray(r.judged_by) ? r.judged_by : null;
// BB-7397 rev 9 DoD 25: the head and the panel sections number the judges as the section "What the judges were sent" does: by seat in Panel
// Build's order (without it, the ORDER list). A seat removed for violations not cured keeps its number and is named; the alternate seated
// for it is "Panel judge N, alternate"; a reserve judge is "Panel judge N, reserve for <seat>". A judgment no seat claims follows, numbered on.
const SEATS = (() => { const DR = Array.isArray(r.drv_removed) ? r.drv_removed : []; let pb = null; try { pb = $('Panel Build').first().json; } catch (e) { pb = null; }
  let order = pb && Array.isArray(pb.judges) ? pb.judges.map(x => x && x.seat).filter(Boolean) : null;
  if (!order || !order.length) order = J.map(j => j.judge_seat).concat(DR.map(x => x.seat)).filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const SB = r.panel_substitution && r.panel_substitution.failed_seat ? r.panel_substitution : null; const out = [], used = new Set(); let n = 0;
  order.forEach(seat => { n++; const x = DR.find(d => d.seat === seat); const j = J.find(q => q.judge_seat === seat && !used.has(q));
    if (x) { out.push({ removed: x, n }); const a = J.find(q => q.judge_seat === x.replaced_by && !used.has(q)); if (a) { used.add(a); out.push({ j: a, n, tag: ', alternate' }); } }
    else if (j) { used.add(j); out.push({ j, n, tag: '' }); }
    else if (SB && SB.failed_seat === seat) { const q = J.find(z => z.judge_seat === SB.substitute && !used.has(z)); if (q) { used.add(q); out.push({ j: q, n, tag: ', reserve for ' + nm(seat) }); } } });
  J.forEach(q => { if (!used.has(q)) { n++; used.add(q); out.push({ j: q, n, tag: '' }); } }); return out; })();
SEATS.forEach(e => { if (e.removed) { const x = e.removed; t += '- Panel judge ' + e.n + ': ' + nm(x.seat) + ' (' + (x.api_model || '') + '): **' + (x.verdict_tag || '?') + '**' + VSIDE + ' (removed: ' + (x.drv_uncured || 0) + ' debate rule violation(s) not cured; not counted; ' + (ALTN0[x.replaced_by] || nm(x.replaced_by)) + ' sat in its place)\n'; return; }
  const j = e.j; const why = curedTo(j.verdict_raw) ? null : seatReason(j.verdict_raw); const counted = !COUNTED || COUNTED.includes(j.judge_seat); t += '- Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): **' + (j.verdict_tag || '?') + '**' + VSIDE + (counted ? '' : ' (not counted)') + (why ? '. Reason: ' + why : '') + '\n'; });
if (!J.length) t += '- No panel judgments recorded\n';
t += '- Panel result: **' + (r.panel_verdict || '?') + '**' + (r.panel_split ? ' (' + r.panel_split + ')' : '') + VSIDE + '\n';
{const gl=g4Line(r.panel_substitution,nm);if(gl)t += '- ' + gl + '\n';} // judge_fix5 G4
t += '\n';
// DEBATE RULE VIOLATIONS (BB-6904 e, step 6): one row per report line the cure check stored in a judge's text (single judge:
// independent_verdict_raw; panel: verdict_raw), read back by its fixed fields. The judge texts above drop these lines (noMarkers).
// DRV_EFFECT states what the report does to the outcome: the operator's ruling on 6904 (d), option 2 (BB-6965).
const DRV_EFFECT = 'A panel judge with any violation not cured is not counted in the panel result; if fewer than two panel judges are counted, the result is ungraded and goes to review.';
const DRV_RULE = { 'K-B': 'Two kinds of layer (K-B)', 'K-G1': 'Conceded count (K-G1)', 'K-G3': 'Standing (K-G3)', 'K-G4': 'Pressing sentence (K-G4)', 'K-G6': 'Unanswered premise not counted (K-G6)', 'K-G7': 'BROKEN on a premise the count leaves out (K-G7)', 'K-G8': 'Counted premises list differs from the count (K-G8)', 'K-G10': 'Premise counted on a verse no listed premise carries under PRESSED WITH (K-G10)', 'K-G11': 'BROKEN on a verse no listed premise carries under PRESSED WITH (K-G11)', 'K-V': 'VOID ruling without the charge words or the kind (K-V)', 'K-S2': 'Single-verse ground in another form (K-S2)', 'K-LXX': 'Septuagint reading said not to occur (K-LXX)', 'K-G9': 'Cited-in line not ruled, or a pressed and unanswered verse not counted (K-G9)', 'K-LB': 'Link-round block with fewer than two layers not counted (K-LB)' };
const drvCell = x => String(x == null ? '' : x).replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
const drvRead = (who, raw) => { const rows = []; let prose = false;
  for (const ln of String(raw || '').split('\n')) { const l = ln.trim(); const m = l.match(/^\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- (.*)\]$/);
    if (m) { const p = m[1].split(/(?:^|; )(SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT): /); const o = { who }; for (let i = 1; i < p.length; i += 2) o[p[i]] = p[i + 1]; if (o.ITEM && o.RESULT) rows.push(o); continue; }
    if (/^\[AUDIT v21: DEBATE RULE VIOLATION REPLY -- /.test(l)) prose = true; }
  return { rows, prose }; };
// A panel seat removed for an uncured violation (drv_removed) keeps its report lines here, labelled removed (BB-7154 finding 1).
const DRV = J.map(j => drvRead('Panel judge ' + nm(j.judge_seat), j.verdict_raw)).concat((Array.isArray(r.drv_removed) ? r.drv_removed : []).map(x => drvRead('Panel judge (removed): ' + nm(x.seat), x.verdict_raw)));
const DRVR = [].concat(...DRV.map(x => x.rows));
// The cure's corrected standing and conceded count, per judge and side, printed beside the stored values in the Result table
// (BB-7154 finding 2, BB-7157). Only CURED rows correct. From BB-7406 (DoD 5) the stored columns carry the correction too; the judge's
// own answer is kept in its text by an AUDIT v21 CORRECTED STANDING line.
const COR = {}; DRVR.filter(x => x.RESULT === 'CURED').forEach(x => { const s = String(x.STATEMENT || ''); const k = x.who;
  let m = s.match(/CORRECTED STANDING: (DEFENDER|CHALLENGER) ([A-Z-]+)/); if (m) { (COR[k + '|' + m[1]] = COR[k + '|' + m[1]] || {}).st = m[2]; }
  m = s.match(/CORRECTED COUNT: (DEFENDER|CHALLENGER) (\d+)/); if (m) { (COR[k + '|' + m[1]] = COR[k + '|' + m[1]] || {}).n = +m[2]; } });
const cor = (who, side) => { const c = COR[who + '|' + side]; if (!c) return ''; const p = []; if (c.st) p.push(c.st); if (c.n != null) p.push(c.n + ' conceded'); return ' (corrected by the cure: ' + p.join(', ') + ')'; };
t += '## Result\n\n| | |\n|---|---|\n';
t += '| Outcome | ' + (r.outcome || 'not recorded') + ' |\n';
// Panel standings by seat, and review flags from review_notes (operator-approved 2026-10-13, BB-5678).
J.forEach(j => { const w = 'Panel judge ' + nm(j.judge_seat); t += '| ' + w + ' | defense ' + (j.defense_standing || 'UNGRADED') + ', ' + cnt(j.conceded_links) + cor(w, 'DEFENDER') + '; challenge ' + (j.challenge_standing || 'UNGRADED') + ', ' + cnt(j.challenger_conceded_links) + cor(w, 'CHALLENGER') + ' |\n'; });
// Panel judges' review flags (BB-5809 F5): the flag a panel row carries after its JSON. A flag whose item that seat's cure REPORT line reads
// CURED is printed as cured, not for review (THE DEBATE FIXED rev 7, DoD 13). The single judge's flags stay in the row (DoD 10 (c)).
const flagKey = x => { let m = x.match(/\((K-S|K-S2|K-LXX|K-C|K-N|K-SC|K-K|K-DG8)\) -- (D\d+(?: vs C\d+)?|REASONING|CITATION CHECK|KEYSTONE|RESULT|(?:DEFENSE|CHALLENGE) STANDING|(?:DEFENDER|CHALLENGER) CHAIN MARK|(?:CHALLENGER )?CONCEDED LINKS)(?=[ ;:.,\]]|$)/); if (m) return m[1] + '|' + m[2].toUpperCase(); m = x.match(/\((K-G\d+)\) -- (D\d+ vs C\d+)/); /* judge_fix8 K5: K-G11 */ if (m) return m[1] + '|' + m[2].toUpperCase(); m = x.match(/\((K-G3)\) -- (DEFENSE|CHALLENGE) STANDING/); if (m) return 'K-G3|' + (m[2] === 'DEFENSE' ? 'DEFENDER' : 'CHALLENGER') + ' STANDING';
  m = x.match(/\((K-G6|K-G10|K-V)\) -- ((?:DEFENDER|CHALLENGER) premise \d+)/); if (m) return m[1] + '|' + m[2].toUpperCase(); /* judge_fix8 K2: K-G10 */ m = x.match(/\((K-G9)\) -- ((?:DEFENDER|CHALLENGER) CITED-IN)/); if (m) return 'K-G9|' + m[2].toUpperCase(); m = x.match(/\((K-LB)\) -- ((?:DEFENDER|CHALLENGER) premise \d+)/); if (m) return 'K-LB|' + m[2].toUpperCase(); m = x.match(/\((K-G8)\) -- counted_premises_(defender|challenger)/); if (m) return 'K-G8|' + m[2].toUpperCase() + ' COUNTED PREMISES';
  m = x.match(/VIOLATION -- (D\d+ vs C\d+) /); if (m) return 'K-B|' + m[1].toUpperCase(); return null; };
const curedSet = raw => { const c = new Set(); drvRead('', raw).rows.forEach(o => { if (o.RESULT === 'CURED') c.add(String(o.RULE).trim() + '|' + String(o.ITEM).trim().toUpperCase()); }); return c; };
J.forEach(j => { const cs = curedSet(j.verdict_raw); (String(j.verdict_raw || '').match(/\[(?:EXTRACTOR|AUDIT) v\d+[^\]\n]*REVIEW THIS ROW[^\]\n]*\]/g) || []).filter(x => !/single judge/i.test(x)).forEach(x => { const k = flagKey(x); const cured = k && cs.has(k); t += '| ' + (cured ? 'Cured flag' : 'Review flag') + ' (panel judge ' + nm(j.judge_seat) + ') | ' + (cured ? x.slice(1, -1).replace(/REVIEW THIS ROW\.?/, 'CURED by the seat\'s cure reply; recorded, not for review.') : x.slice(1, -1)).replace(/\|/g, '\\|') + ' |\n'; }); }); // a flag that compares a seat with the single judge (SAME-MODEL DIVERGENCE) stays in the judgment row only (DoD 10 (c))
// BB-7397 rev 9 DoD 26 (2): a collision label off the guide's [DR3] order, recorded by Panel Payloads or Alternate Payloads; not a violation, not counted.
J.forEach(j => { String(j.verdict_raw || '').split('\n').forEach(l => { const m = l.trim().match(/^\[AUDIT v21: C-LABEL OFF THE GUIDE -- (.*)\]$/); if (m) t += '| C-label off the guide (panel judge ' + nm(j.judge_seat) + ') | ' + m[1].replace(/\|/g, '\\|') + ' |\n'; }); });
{const gl=g4Line(r.panel_substitution,nm);if(gl)t += '| Reserve | ' + gl.replace(/\|/g,'\\|') + ' |\n';} // judge_fix5 G4
t += '| Run | ' + (r.run_token || '') + ', ' + date + ' |\n\n';
FF.forEach(x => { t += x + '\n\n'; });
// Citation check against the KJV (item 9): printed from the Quote Report step when it ran.
let QRd = null; try { QRd = $('Quote Report').first().json; } catch (e) { QRd = null; }
if (QRd && !QRd.unavailable && Array.isArray(QRd.items)) {
  const bad = QRd.items.filter(i => i.status && !/^MATCHES\b/.test(i.status) && i.status !== 'NOT CHECKED'); // judge_fix4 F7: MATCHES (MARGIN) is a match
  const plain = st => /^WORDS ARE AT /.test(st) ? 'the words are at ' + st.slice(13) : /^WORDING DIFFERS FROM /.test(st) ? 'the wording differs from ' + st.slice(21) : /^WORDING NOT FOUND IN /.test(st) ? 'this wording is not in ' + st.slice(21) : 'the cited verse does not exist';
  t += '## Citation check\n\nEvery quotation given with a verse reference was checked against the KJV text: ' + QRd.checked + ' checked, ' + QRd.matches + ' match the verse cited, ' + bad.length + (bad.length === 1 ? ' does not' : ' do not') + (QRd.not_checked ? ', ' + QRd.not_checked + ' too short to check' : '') + '.\n\n';
  bad.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': cited ' + i.ref + ' for "' + String(i.quote).slice(0, 200) + '": ' + plain(i.status) + '.\n'; });
  if (bad.length) t += '\n';
  // Nearer reference shown (2026-10-13, WALL-0966 1262 and 1264; part of the quote-checker fix, ruling 4): a match made on the nearer reference written beside the quotation is listed, with the first reference.
  const rb = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from && !i.after_first);
  if (rb.length) { t += rb.length + (rb.length === 1 ? ' match was' : ' matches were') + ' made on a nearer reference written beside the quotation, after the first reference before it did not match:\n\n'; rb.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': "' + String(i.quote).slice(0, 200) + '" matches ' + i.ref + ' (first reference before it: ' + i.rebound_from + ').\n'; }); t += '\n'; }
  // BB-8172 C1 (BB-8209): the reference written after a quotation is scored first; a match made on the reference before it is listed.
  const ra = QRd.items.filter(i => i.status === 'MATCHES' && i.rebound_from && i.after_first);
  if (ra.length) { t += ra.length + (ra.length === 1 ? ' match was' : ' matches were') + ' made on the reference before the quotation, after the reference written after it did not match:\n\n'; ra.forEach(i => { t += '- ' + (i.side === 'DEFENDER' ? 'Defender' : 'Challenger') + ', round ' + String(i.round).replace(/^R/, '') + ': "' + String(i.quote).slice(0, 200) + '" matches ' + i.ref + ' (reference after it: ' + i.rebound_from + ').\n'; }); t += '\n'; }
}
if (DRVR.length) {
  const nc = DRVR.filter(x => x.RESULT === 'CURED').length;
  t += '## Debate rule violations\n\n**Rule B.** A link a judge grades BROKEN must show, on its own line, at least two different kinds of lower layer: [L1] the first KJV verse quoted with its reference (tagged or not), [L2] the Hebrew or Greek word in its own script, with its transliteration marks, with its Strong\'s number, or in plain letters with its English meaning beside it; or [L3] any other verse quoted with its reference after it, as its support (operator ruling 400); a tag alone makes no layer. A judge whose line did not, or whose counts or standings disagreed with its own BROKEN lines, was asked once to cure it in a fixed form, and the cure was checked by the same count.\n\n';
  t += '**Effect on the verdict.** ' + DRV_EFFECT + '\n\n';
  t += DRVR.length + (DRVR.length === 1 ? ' violation' : ' violations') + ': ' + nc + ' cured, ' + (DRVR.length - nc) + ' not cured.\n\n';
  t += '| Judge | Item | Rule | Result | Original line | Cure statement, or why not cured | Judge\'s own statement |\n|---|---|---|---|---|---|---|\n';
  DRVR.forEach(x => { const last = x.RESULT === 'CURED' ? (x.STATEMENT || x.WHY || '') : ((x.STATEMENT ? x.STATEMENT + ' -- ' : '') + (x.WHY ? 'Not cured: ' + x.WHY + '.' : 'Not cured.')) // BB-7397 rev 9 DoD 24: ' -- ' sets the reason off;
    t += '| ' + drvCell(x.who) + ' | ' + drvCell(x.ITEM) + ' | ' + drvCell(DRV_RULE[x.RULE] || x.RULE) + ' | **' + drvCell(x.RESULT) + '**' + (x.KINDS ? ' (' + drvCell(x.KINDS) + ')' : '') + ' | ' + drvCell(x.LINE || '') + ' | ' + drvCell(last) + ' | ' + drvCell(x['JUDGE STATEMENT'] || 'not recorded') + ' |\n'; });
  t += '\n';
  const PR = DRV.filter(x => x.prose).map(x => x.rows.length ? x.rows[0].who : null).filter(Boolean);
  if (PR.length) t += 'The reply of ' + PR.join(', ') + ' also held prose. It is recorded in the stored row and was not read for a cure.\n\n';
}
// ALTERNATES (BB-6904 g, step 7): a seat not counted for an uncured violation, and the alternate that sat (stored drv_removed).
const ALTN={alt_minimax31:'MiniMax M3.1 Flash',alt_minimax3:'MiniMax M3'}; // names for the alternates' seat ids (7014 note 4)
const DRM=Array.isArray(r.drv_removed)?r.drv_removed:[];
// BB-7397 rev 8 DoD 16: every alternate tried, from the AUDIT ALTERNATE TRIED lines of the stored judgments and of drv_removed.
const TRIED=[];J.concat(DRM).forEach(j=>String(j.verdict_raw||'').split('\n').forEach(l=>{const m=l.trim().match(/^\[AUDIT v21: ALTERNATE TRIED -- SEAT: ([^;]+); ALTERNATE: ([^;]+); MODEL: ([^;]+); RESULT: ([A-Z ]+?)(?:; WHY: (.*))?\]$/);if(m)TRIED.push({seat:m[1],alt:m[2],model:m[3],result:m[4],why:m[5]||''});}));
if(DRM.length||TRIED.length){t += '## Alternate judges\n\n';DRM.forEach(x=>{t += '- ' + nm(x.seat) + ' was not counted (' + (x.drv_uncured||0) + ' debate rule violation(s) not cured); ' + (ALTN[x.replaced_by]||nm(x.replaced_by)) + ' (' + String(x.replaced_by_model||'') + ') sat in its place.\n';});
 TRIED.forEach(x=>{t += '- ' + nm(x.seat) + ': alternate ' + (x.alt==='none'?'none':(ALTN[x.alt]||nm(x.alt)) + ' (' + x.model + ')') + ' tried, ' + x.result + (x.why ? ': ' + x.why : '') + '.\n';});t += '\n';}
t += '---\n\n';
t += '## How to read this debate\n\n**The method.** Isaiah 28:10 (KJV): "' + verse + '" The case is not one verse; it is verses laid on verses until the point stands. That is how these debates are built and how they are judged.\n\n';
t += '- **[L1] The KJV verse:** the verse itself, quoted exactly.\n- **[L2] Source language:** the Hebrew or Greek behind the English.\n- **[L3] Cross-reference:** what the rest of scripture says.\n- **[L4] Inference:** a conclusion the debater draws from at least two prior layers.\n\n';
t += "**How the case is judged.** To win, the challenger must break the defender's chain, the linked argument the defender builds for the topic. Defeating one isolated verse or term does not break the chain. A chain breaks in one of two ways: the challenger shows from the text that a link is false (a cited verse says the opposite and the defender has no answer), or the defender takes down enough of its own links.\n\n";
t += "**The link round.** The challenger ends its second round, and the defender ends its link round (round 3), by listing up to six of the other side's inferences that it says have no footing. Each side then answers every item on the list against it: SUPPORTED, showing the verses and layers it rests on, or CONCEDED, admitting it has no footing. Only these answers are counted; everything else is argument.\n\n";
t += "**Labels in the judges' texts.** [CR1], [CR2] and [CR3] are the defender's rounds 1 to 3; [DR1], [DR2] and [DR3] are the challenger's. D1, D2 and so on are the links of the defender's declared chain, in its own order; C1, C2 and so on are the claims the defender listed against the challenger, in the order the challenger answered them in [DR3].\n\n";
t += "**How each judge reaches a verdict.** The rules are applied in this order, and the first that fits decides.\n\n- **BROKEN:** the challenger refuted at least one of the defender's declared links from the text, or the defender withdrew more than half of the links it declared, or withdrew its conclusion link (the last link of its chain).\n- **PARTIAL:** the defender withdrew at least one declared link, or its defense standing is COLLAPSED.\n- **HELD:** none of the above.\n\n" + RULES + nameGuards("**What else decides a link.** The judges' rulebook adds seven rules, quoted here in its own words.\n\n- **UNEXHIBITED.** A link is graded UNEXHIBITED (no footing offered or fewer than two prior layers exhibited, or a pressed witness left unanswered) \"when the block asserted the link and offered no layer footing at all or exhibited fewer than two prior layers (the burden rule, the same in every round: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them; fewer floats and carries zero weight), or when a witness pressed against that premise, a verse carried under PRESSED WITH: in the list against that side, was left unanswered\"; it counts as conceded.\n- **AN UNANSWERED PRESSED WITNESS (operator rulings 372 and 392).** \"A premise whose pressed witness goes unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings.\" A non-response is never neutral: a side could otherwise win by not responding. But \"a press must have a premise behind it; a verse pressed without one isn't a witness\" (ruling 392): only a verse carried under PRESSED WITH: beside a numbered premise of the other side's list is a pressed witness. A verse cited elsewhere, on the ledger's \"cited in\" line or pressed in prose against a link, is not a witness, and leaving it unanswered never counts; the \"cited in\" line is for information only.\n- **CONCEDED (stated).** A link is graded CONCEDED (stated) \"when the block itself states the surrender, only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link\".\n- **VERSE CITATION (operator ruling 3).** \"A verse counts as evidence, as footing, as a witness or as an answer only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count\"; an answer in substance without the reference named does not count, and a quotation the citation check marks NOT COUNTED is not counted.\n- **CLOSE ROUNDS.** Round 4 gives each side a close: the defender's close answers witnesses still pressed against its chain and counts as a later defender round; the challenger's close is its final words, answers nothing new and may not press, and a verse it names that its earlier rounds never named is marked NOT COUNTED. The defender's close counts only as an answer to a witness already pressed: a verse it names that no earlier round of either side names is marked NEW IN CLOSE, NOT COUNTED, and a sentence in it that grades or presses against a challenger link is disregarded. Both closes keep the declared D numbers and the round-3 C numbers; a close that renumbers is flagged.\n- **VOID.** A premise \"listed without a verbatim quote, or charged in terms stronger than its quote, is VOID -- it counts for neither side, and a CONCEDED answer to a void premise is NOT a concession\". It adds: \"A charge is stronger than its quote only when it asserts what the quote does not: a negation, a universal (all, none, only, never), or a claim the quote's own words do not make. Dropping, reordering or paraphrasing the quote's words is not stronger. A limb the link round narrows counts in its narrowed form.\" and \"A premise's quote is checked against every earlier round of the opponent; it is verbatim if found in any of them, and the judge names that round.\"\n- **KEYSTONE.** The keystone is \"the LAST declared link, Dn, which is the conclusion link\": \"WITHDRAWN if it is withdrawn or conceded\". A withdrawn keystone is a withdrawn conclusion link, so the verdict is BROKEN.\n\n");
t += '**What the standings mean.** Both sides are graded the same way, from their link-round answers.\n\n- **SELF-SUPPORTED:** every listed claim shows the layers it stands on (each inference shows at least two prior layers).\n- **PROP-DEPENDENT:** some listed claims were conceded or stood without showing their layers, but not more than half. Those claims do not count.\n- **COLLAPSED:** more than half of the claims the other side listed against it were conceded or left without footing. Exactly half is not COLLAPSED.\n\n---\n\n';
const D = nm(r.defender_engine), C = nm(r.challenger_engine);
const __FR={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4,dr4:r.challenger_r4}; /* judge_fix8 R2: every round */
const __CGF=sd=>{const p=C4P.stored(r.review_notes,sd);if(p)return p;try{if($('Build Synthesis').isExecuted){const g=$('Build Synthesis').first().json.close_graded;if(g&&Array.isArray(g[sd]))return g[sd];}}catch(e){}return null;}; /* the stored result, as the judges were sent it */
const rounds = [['Round 1 - Defender (' + D + ')', r.claude_r1], ['Round 1 - Challenger (' + C + ')', r.engine_r1], ['Round 2 - Defender (' + D + ')', r.claude_r2], ['Round 2 - Challenger (' + C + ')', r.engine_r2], ['Round 3 - Defender (' + D + '): link round', r.engine_r3], ['Round 3 - Challenger (' + C + '): link round', r.challenger_r3]].concat(r.defender_r4 ? [['Round 4 - Defender (' + D + '): close round', r.defender_r4 + C4P.noteD({cr1: r.claude_r1, gr1: r.engine_r1, cr2: r.claude_r2, gr2: r.engine_r2, cr3: r.engine_r3, dr3: r.challenger_r3, cr4: r.defender_r4}) + C4P.noteR({cr1: r.claude_r1, dr3: r.challenger_r3, cr4: r.defender_r4},'D')+C4P.noteP(__FR,'D',__CGF('D'))]] : [], r.challenger_r4 ? [['Round 4 - Challenger (' + C + '): close round (no new press)', r.challenger_r4 + C4P.note({gr1: r.engine_r1, gr2: r.engine_r2, dr3: r.challenger_r3, dr4: r.challenger_r4}) + C4P.noteR({cr1: r.claude_r1, dr3: r.challenger_r3, dr4: r.challenger_r4},'C')+C4P.noteP(__FR,'C',__CGF('C'))]] : []); // judge_fix3 B3
rounds.forEach(x => { t += '## ' + x[0] + '\n\n' + (x[1] ? demote(nameGuards(x[1])) : '(not recorded)') + '\n\n---\n\n'; });
const SP = synthParts(r.synthesis);
t += '## Synthesis\n\n**Analyst:** ' + SJN + ', gives no verdict\n\n' + (r.synthesis ? synthClean(SP[0]) : '(not recorded)') + '\n\n';
// judge_fix4 F9 (run 32266, Worker_G1 finding 9): the synthesis checks S-A to S-E, recorded in review_notes by Build Save Body, printed here so a reader
// of the document sees which synthesis sentences the system flagged.
{ const SC = [...String(r.review_notes || '').matchAll(/\[AUDIT v\d+: SYNTHESIS CHECK \((S-[A-F])\) -- ([\s\S]*?)\. REVIEW THIS ROW\.\]/g)];
  t += '**Synthesis checks** (computed by the system, not by a model; each flags a synthesis sentence for review and changes no verdict): ' + (SC.length ? '\n\n' + SC.map(m => '- **' + m[1] + '.** ' + m[2].replace(/\s+/g, ' ').trim()).join('\n') : 'none flagged.') + '\n\n---\n\n'; }
SEATS.filter(e => e.j).forEach(e => { const j = e.j; t += '## Panel judge ' + e.n + e.tag + ': ' + nm(j.judge_seat) + ' (' + (j.judge_api_model || '') + '): ' + (j.verdict_tag || '?') + VSIDE + '\n\n' + panelText(j.verdict_raw, j) + '\n\n---\n\n'; });
t += (PF ? '*Debate incomplete: the panel stage failed (see the notice at the top).*' : '*Debate complete.*') + '\n\n' + runTime() + '\n';
// ITEM 8 (BB-7224, shape BB-7234): WHAT THE JUDGES WERE SENT. Each distinct text sent to a judge in this run is printed once, verbatim,
// under a heading that names every seat and call that received it and gives the md5 of the text (its messages joined in order, UTF-8).
// Each cure call prints the judge's re-sent answer and the cure request verbatim and names the text it followed. Appended; nothing above moves.
const MD5 = (str) => {
  const s = unescape(encodeURIComponent(String(str))); const n = s.length; const w = [];
  for (let i = 0; i < n; i++) w[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
  w[n >> 2] |= 0x80 << ((n % 4) * 8); const L = (((n + 8) >> 6) + 1) * 16; for (let i = 0; i < L; i++) w[i] = w[i] | 0; w[L - 2] = n * 8;
  const K = [], R = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) | 0;
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  for (let o = 0; o < L; o += 16) {
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; } else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; } else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const t = d; d = c; c = b; const x = (a + f + K[i] + w[o + g]) | 0; const r = R[(i >> 4) * 4 + (i % 4)];
      b = (b + ((x << r) | (x >>> (32 - r)))) | 0; a = t;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }
  return [a0, b0, c0, d0].map(v => { let h = ''; for (let i = 0; i < 4; i++) h += ((v >>> (i * 8)) & 255).toString(16).padStart(2, '0'); return h; }).join('');
};
const sentMsgs = (b) => {
  if (!b || typeof b !== 'object') return null; const out = [];
  if (b.systemInstruction || b.contents) {
    if (b.systemInstruction) out.push({ role: 'system', text: (b.systemInstruction.parts || []).map(p => p.text || '').join('') });
    (b.contents || []).forEach(c => out.push({ role: c.role || 'user', text: (c.parts || []).map(p => p.text || '').join('') }));
    return out;
  }
  if (typeof b.system === 'string') out.push({ role: 'system', text: b.system });
  else if (Array.isArray(b.system)) out.push({ role: 'system', text: b.system.map(x => x.text || '').join('') });
  (b.messages || []).forEach(m => out.push({ role: m.role, text: typeof m.content === 'string' ? m.content : (Array.isArray(m.content) ? m.content.map(x => x.text || '').join('') : '') }));
  return out;
};
const SENT_ERR = [];
// BB-7397 rev 9 DoD 23: a read that gave no text is named by its node only; the error text stays out of the report.
const fromNode = (name, f) => { try { const r = f($(name)); if (r == null || (Array.isArray(r) && !r.length)) SENT_ERR.push(name); return r; } catch (e) { SENT_ERR.push(name); return null; } };
const SENT = (() => {
  const calls = [], cures = [];
  const pb = fromNode('Panel Build', x => x.first(0).json);
  if (pb && Array.isArray(pb.judges)) pb.judges.forEach((j, i) => calls.push({ who: 'panel judge ' + (i + 1) + ' ' + nm(j.seat) + ' (' + (j.api_model || '') + ')', m: sentMsgs(j.body) }));
  (fromNode('Reserve Build', x => x.all(0).map(i => i.json)) || []).forEach(j => { if (j && j.body) calls.push({ who: 'reserve judge ' + nm(j.seat) + ' (' + (j.api_model || '') + ')', m: sentMsgs(j.body) }); });
  (fromNode('Alternate Build', x => x.all().map(i => i.json.alt)) || []).forEach(a => { if (a && a.body && !a.skip) calls.push({ who: 'alternate judge ' + nm(a.pool_seat || a.seat) + ' (' + (a.api_model || '') + ') ' + (DRM.some(x => x.replaced_by === a.seat && x.seat === a.removed_seat) ? 'seated for ' + nm(a.removed_seat) : 'sent as alternate for ' + nm(a.removed_seat) + ', not seated'), m: sentMsgs(a.body) }); }); // BB-7397 rev 8 DoD 17
  // Each cure call's reply, read from the Normalize node that follows its build (THE DEBATE FIXED rev 7, DoD 13), matched by caller and seat.
  const REPLY = {}; ['Panel Cure Normalize 1', 'Panel Cure Normalize 2', 'Panel Cure Normalize 3', 'Alternate Cure Normalize'].forEach(n => { try { if (!$(n).isExecuted) return; $(n).all().forEach(i => { const c = i.json && i.json.cure; if (c && c.seat) REPLY[(c.who || '') + '|' + c.seat] = i.json.reply || null; }); } catch (e) { } });
  ['Panel Cure Build 1', 'Panel Cure Build 2', 'Panel Cure Build 3', 'Alternate Cure Build'].forEach(n => {
    (fromNode(n, x => x.all().map(i => i.json.cure)) || []).forEach(c => { if (c && c.body && !c.skip) cures.push({ who: 'Cure call, ' + (c.who === 'alternate' ? 'alternate ' : '') + nm(c.seat) + ' (' + (c.model || '') + ')', m: sentMsgs(c.body), reply: REPLY[(c.who || '') + '|' + c.seat] }); });
  });
  return { calls, cures };
})();
const sentFence = (s) => { let n = 3; (String(s).match(/`{3,}/g) || []).forEach(r => { if (r.length >= n) n = r.length + 1; }); const f = '`'.repeat(n); return f + 'text\n' + s + '\n' + f; };
const sentBlock = (m) => m.map(x => '**' + x.role + ' message** (' + x.text.length + ' characters)\n\n' + sentFence(x.text) + '\n\n').join('');
let s8 = '## What the judges were sent\n\nEvery text the system sent to a judge in this debate, verbatim. Each distinct text is printed once; its heading names every seat and call that received it and gives the md5 of the text (its messages joined in order, UTF-8). A cure call re-sends its judge\'s text with the judge\'s answer and the cure request; those two are printed in full under the cure call, which names the text it followed.\n\n';
const SG = [];
SENT.calls.forEach(c => { if (!c.m) return; const h = MD5(c.m.map(x => x.text).join('')); let g = SG.find(x => x.h === h); if (!g) { g = { h, m: c.m, who: [] }; SG.push(g); } g.who.push(c.who); });
if (SENT_ERR.length) s8 += '*Reads that gave no text:* ' + SENT_ERR.join('; ') + '.\n\n';
if (!SG.length && !SENT.cures.length) s8 += '*Not available: the texts sent to the judges are not in this run.*\n\n';
SG.forEach((g, i) => { s8 += '### Text ' + (i + 1) + ', md5 ' + g.h + '\n\nSent to: ' + g.who.join('; ') + '.\n\n' + sentBlock(g.m); });
SENT.cures.forEach(c => {
  let k = -1, g = null;
  for (let n = c.m.length; n > 0 && !g; n--) { const h = MD5(c.m.slice(0, n).map(x => x.text).join('')); g = SG.find(x => x.h === h) || null; if (g) k = n; }
  s8 += '### ' + c.who + '\n\n';
  if (g) s8 += 'Followed the ' + g.h + ' text above (Text ' + (SG.indexOf(g) + 1) + '), then:\n\n' + sentBlock(c.m.slice(k));
  else s8 += 'md5 ' + MD5(c.m.map(x => x.text).join('')) + '; its opening matches no text above, so the whole call is printed:\n\n' + sentBlock(c.m);
  s8 += (c.reply && c.reply.ok && typeof c.reply.text === 'string') ? '**reply to the cure request** (' + c.reply.text.length + ' characters)\n\n' + sentFence(c.reply.text) + '\n\n' : '*No reply was read: ' + ((c.reply && c.reply.why) || 'the reply was not found') + '.*\n\n';
});
t += '\n---\n\n' + s8;
const fileName = (PF ? 'INCOMPLETE - ' : '') + 'Debate [' + D + ' v ' + C + '] - ' + r.topic + ' - ' + date + '.md';
return [{ json: { fileName, md: t, chars: t.length, judges: J.length, run_token: r.run_token } }];

