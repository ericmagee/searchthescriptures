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
// Citation Scan (operator order 2026-10-04, Worker_C BB-4821 item 9; route ruled at WALL-0661 reply 675).
// Pulls every "Book C:V ... quote" pair from the six rounds and builds one read of the cited verses.
// A reference on a line that opens with [L2] is skipped: its quote marks hold a gloss of the Greek or Hebrew, not KJV wording.
let F=null;try{if($('Regrade Load').isExecuted)F=$('Regrade Load').first().json.f;}catch(e){F=null;}if(!F)F=$('Final Output').first().json; // regrade: rounds from the saved row
const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation|1 Esdras|2 Esdras|Tobit|Judith|Rest of Esther|Wisdom|Sirach (Ecclesiasticus)|Baruch|Letter of Jeremiah|Prayer of Azariah and the Song of the Three Jews|Susanna|Bel and the Dragon|Prayer of Manassah|1 Maccabees|2 Maccabees".split('|');
const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
Object.assign(BK,{psalm:'Psalms',songofsongs:'Song of Solomon',canticles:'Song of Solomon',sirach:'Sirach (Ecclesiasticus)',ecclesiasticus:'Sirach (Ecclesiasticus)',wisdomofsolomon:'Wisdom',revelations:'Revelation'});
// Short book names (BB-5773; ODV1-25804 "Matt 15:24" went unchecked): the standard abbreviations, matched by the same key().
Object.assign(BK,{gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges',jdg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',eccles:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',obad:'Obadiah',mic:'Micah',nah:'Nahum',hab:'Habakkuk',zeph:'Zephaniah',hag:'Haggai',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',tit:'Titus',phlm:'Philemon',philem:'Philemon',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John','2jn':'2 John','3jn':'3 John',rev:'Revelation'});
// BB-8172 C1 (his word 2026-10-29, BB-8209; changes ruling 4 of 2026-10-13): a bare reference ("(1:3)") takes the book named last before it
// in the same round text; with none before it, it is left out.
// Option 2 (BB-8212): a book name in capitals, or with a possessive ("Matthew's own genealogy"), is a book named.
const BREF=/((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][A-Za-z]+(?:\s(?:of\s)?[A-Z][A-Za-z]+)?)(?:\.?\s(\d{1,3}):(\d{1,3})|['’]s\b)/g;
// judge_fix2 FIX 6b (run 32205 "(18:7-8)" read as Ezra; run 32212 "(1:24)" read as Genesis): a bare reference takes its book only from a book
// named earlier in the same sentence and clause (a sentence end, a semicolon or a line break closes it; quoted words are masked when finding
// it). With none, it is left out, unchecked, rather than given the book of another sentence.
const QMASK=new Map();
const clauseAt=(t,pos)=>{t=String(t);let mk=QMASK.get(t);if(mk===undefined){mk=t.replace(/[“"][^”"\n]{0,400}[”"]/g,s=>' '.repeat(s.length));QMASK.set(t,mk);}
 let s=0;const rx=/[.!?]["”’')\]*_]*\s+(?=[A-Z\[*_"“(#>-])|;|\n/g;let x;while((x=rx.exec(mk))!==null&&x.index<pos)s=x.index+x[0].length;return s;};
const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(clauseAt(t,pos),pos).matchAll(BREF)){const k=BK[key(x[1])]||BK[key(String(x[1]).split(/\s/).pop())];if(k)b=k;}return b;};
const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]].concat(F.cr4?[['DEFENDER','R4',F.cr4]]:[],F.dr4?[['CHALLENGER','R4',F.dr4]]:[]); // judge_fix3 B3: the close rounds' quotations are checked too
const re=/((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)[^“”"\n]{0,30}(?:\n>?\s*)?[“"]([^”"]{12,400})[”"]/g;
// item 3 (BB-4890): also a quotation written BEFORE its reference, the reference following at once in parentheses or after a
// dash. A quote already paired by the reference-then-quote pattern is never paired a second time (its span is recorded).
const rq=/[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*(?:\(\s*|[–—-][ \t]*\**[ \t]*)((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)/g;
// BB-5773: a quote that opens its own line and is followed by a layer tag and its reference ("..." [L3] Ezekiel 37:24) is the same form.
// Item 7 (3), WALL-1844: a quotation, then a few words of prose with no quote mark or bracket, then the reference in parentheses
// (ODV1-28689: "I will multiply thy seed" to Hagar (Genesis 16:10)). Prose that denies the verse makes it a phrase, not a citation.
const rqP=/[“"]([^”"]{12,400})[”"](?:[^“”"\n()]{1,30})\(\s*((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)\s*\)/g;
const rqL=/(?<=(?:^|\n)[ \t>*•-]*)[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*\[L[1-4]\][ \t]*\**[ \t]*((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)/g;
// BB-8172 C1: the quote-first forms with a bare reference in parentheses ("..." (1:3); "..." a few words (1:5)); group 2 is empty, so the
// book is lastBook's. Only the parenthesized bare form is read.
const rqB=/[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*\(\s*()(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)\s*\)/g;
const rqBP=/[“"]([^”"]{12,400})[”"](?:[^“”"\n()]{1,30})\(\s*()(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)\s*\)/g;
// ORDER (BB-6827, ruled BB-6828, BB-6830): a quotation is load-bearing when it stands in a LINK block of a link round (R3) under an [L1] tag:
// the block runs from a line that opens "LINK n" to the next such line; the last layer tag before the quote in the block must be [L1].
// Not load-bearing: a block whose status is CONCEDED (a conceded link bears no load), and the UNSUPPORTED-L4 PREMISES list that closes the round.
// Rounds 1 and 2 carry the chain by reference, not by quotation (measured, BB-6827), so only round 3 is read. Same test for both sides.
const LBH=/^[ \t>#*_-]*(?:\d+[.)][ \t]*)?\**[ \t]*LINK[ \t]+(\d+)\b[^\n]*/gim;
const LB=(t,round,pos)=>{const no={link:null,load_bearing:false};if(round!=='R3')return no;
 let h=null,x;LBH.lastIndex=0;while((x=LBH.exec(t))!==null&&x.index<pos)h=x;if(!h)return no;
 if(/(?:^|\n)[ \t>#*_]*(?:[A-Z]+['’]S[ \t]+)?UNSUPPORTED[- ]L4[ \t]+PREMISES/i.test(t.slice(0,pos)))return no;
 const link=+h[1];const st=(h[0].match(/LINK[ \t]+\d+[^:\n]{0,40}:[ \t*_]*([A-Za-z-]+)/i)||[])[1]||'';if(/^CONCEDED$/i.test(st))return {link,load_bearing:false};
 const tags=[...t.slice(h.index,pos).matchAll(/\[L([1-4])\]/g)];return {link,load_bearing:tags.length>0&&tags[tags.length-1][1]==='1'};};
// judge_fix5 G6 (run 32284: the challenger's list carried backslash-escaped quotation marks, \"father.\"): escapes read as the mark they stand for.
rounds.forEach(x=>{x[2]=String(x[2]||'').replace(/\\(["'\\])/g,'$1');});
// judge_fix5 G5 (run 32284: "Isaiah 7:11, 7:14" was read as "Isaiah 7:11,7"): the reference after its head is read by REFP; a comma list of full
// chapter:verse references, or of bare verses, is several parts, each read and matched; a quotation joined from two verses is matched part by part.
const scanParts=(c,v,tail)=>{const ps=REFP.parse('Genesis '+c+':'+v+String(tail||'')).map(r=>({chapter:r.c,v1:r.v1,v2:r.v2}));return ps.length?ps:[{chapter:+c,v1:+v,v2:+v}];};
const items=[];const seen=new Set();
// Reference written after its quote (BB-5773; ODV1-23966, 24566: "..." [L3] Ref, "..." - Ref): when such a quote's nearest earlier reference stands
// across a line break or a sentence end, the reference after the quote takes it; otherwise the earlier reference keeps it, as before. Items keep their order.
// Citation form (BB-5773; ODV1-25804 items 3-6): Quote Report reports a NON-MATCHING quote as a misquote only when it was offered as the verse:
// between the reference and the quote stand citation marks (punctuation, emphasis, [KJV] or [L1]-[L4], KJV, a possessive, a short parenthetical)
// or a colon and at most five words. Prose between them (That is, does not say, as if it said) marks a phrase, not a quotation. Matches are untouched.
const CITE_FORM=g=>{const h=String(g).replace(/\[(?:KJV|L[1-4])\]|\(KJV\)|\bKJV\b/g,'').replace(/\([^()\n]{1,20}\)/,'');
 return /^[\s*_\])>:,–—-]*(?:['’]s)?[\s*_(]*$/.test(h)||/^[\s*_\])]*:\s*(?:\S+\s+){1,5}[\s*_(]*$/.test(h)
  ||/^[\s*_\])]*(?:(?:is|was)\s+)?(?:quoted|cited|puts|says|saith|reads|records|writes|declares)\b[\s,:]*[*_(]*$/.test(h);};
// A quote holding an Arabic numeral is not KJV wording (the KJV text writes numbers in words); a reference the speaker reports as the
// opponent's ("You attribute ... to Romans 9:27") is not the speaker's citation. Either makes a non-matching quote a phrase, as above.
const NOT_CITE=/(?:attribut|misattribut|misquot|you (?:quote|cite|wrote|assign|give))/i;
// The other side's own sentence (ODV1-23845 John 10:16, 23846 Ephesians 2:11-18 and 2:11-19, 25907 Matthew 15:24): a quote whose words stand, outside
// quotation marks, in a round the other side filed BEFORE this round repeats that side's prose, not KJV wording. On either path it is a phrase, as above.
// Item 7 (A), WALL-1864/1865: a quotation's segments, split where it marks words left out.
const SEGS=s=>String(s).split(/…|\.\.\./).map(x=>x.replace(/\*+/g,'').trim()).filter(Boolean);
const QN=s=>String(s).replace(/\*+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/…|\.\.\./g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const PROSE=rounds.map(x=>QN(String(x[2]||'').replace(/[“"][^”"\n]{1,400}[”"]/g,' | ')));
const OPP=(ri,q)=>{const n=QN(q).replace(/^[\s.,;:!?'"]+|[\s.,;:!?'"]+$/g,'');return n.length>=12&&rounds.some((x,j)=>j<ri&&x[0]!==rounds[ri][0]&&PROSE[j].includes(n));};
// DoD 14 (BB-7397 rev 7; the operator's 1, BB-7495): "A quotation of the other side's own words, quoted under the pressing rule, is not a scripture
// citation and is not checked against the KJV text." Tested by the text, not by a cue phrase (BB-7498, ruled BB-7499): opp_words is true when the
// quotation's words, folded as QN folds them and with quote marks removed, occur in an earlier round of the other side, quoted or not; "..." splits
// the quotation into pieces that must occur there in order. Quote Report leaves out such an item only when its status is WORDING NOT FOUND.
const QF=s=>QN(s).replace(/["']/g,'').replace(/\s+/g,' ').trim();
const FULL=rounds.map(x=>QF(String(x[2]||'')));
const OPPW=(ri,raw)=>{const ps=String(raw).split(/…|\.\.\./).map(p=>QF(p).replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g,'')).filter(Boolean);
 if(ps.join(' ').length<12)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;let at=0;for(const p of ps){const k=FULL[j].indexOf(p,at);if(k<0)return false;at=k+p.length;}return true;});};
// BB-7397 rev 9 DoD 22 (rulings 98 extended to a shortened quote): opp_short is true when the quotation's words (folded as QF folds them, at
// least 6) occur in order inside one sentence of an earlier round of the other side, the matched span of that sentence holding at most twice
// the quotation's word count. Quote Report leaves out such an item only when its status is WORDING NOT FOUND.
const QW=s=>QF(s).split(/[^a-z0-9]+/).filter(Boolean);
const SENTW=rounds.map(x=>QF(String(x[2]||'')).split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length));
const OPPS=(ri,raw)=>{const q=QW(String(raw).replace(/…|\.\.\./g,' '));if(q.length<6)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;
  return SENTW[j].some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}
   if(k===q.length&&e-st+1<=2*q.length)return true;}return false;});});};
const RF=new RegExp('^'+re.source.slice(0,re.source.indexOf('[^“”"\\n]{0,30}')));
for(const [ri,[side,round,text]] of rounds.entries()){const t=String(text||'');let m;re.lastIndex=0;const spans=new Set();
 const claimed=new Set();for(const R of [rq,rqL,rqB]){R.lastIndex=0;while((m=R.exec(t))!==null){if(m[2]?BK[key(m[2])]:lastBook(t,m.index))claimed.add(m.index);}}
 while((m=re.exec(t))!==null){const book=BK[key(m[1])];if(!book)continue;
  // Item 7 (3), WALL-1844: a reference closed at once by ")" cites the quotation before it (ODV1-28689 Genesis 16:10, Luke 1:13; WALL-1822 John 6:42).
  {const rc=RF.exec(m[0]);if(rc&&/^[ \t]*\)/.test(m[0].slice(rc[0].length)))continue;}
  {const om0=m.index+m[0].length-m[5].length-2;const rf=RF.exec(m[0]);const gap=rf?t.slice(m.index+rf[0].length,om0):'';
   if(claimed.has(om0)&&/\n|[.!?]["”*_)\]]*\s/.test(gap))continue;var cf=CITE_FORM(gap)&&!/\d/.test(m[5])&&!NOT_CITE.test(t.slice(Math.max(t.lastIndexOf('\n',m.index)+1,m.index-80),m.index))&&!OPP(ri,m[5]);}
  spans.add(m.index+m[0].length-m[5].length-2);
  // Reference inside a quotation (BB-5735, WALL-0966 1392; ODV1-25744 John 11:52): the straight mark found after the reference is that
  // quotation's CLOSING mark when an odd number of straight marks stands before it on its line AND it follows a character, not a space or
  // an opening bracket or emphasis mark (a nested quotation, such as ("precept upon precept"), opens after one and is kept). A capture that
  // begins with a line break is the next line, not a quotation. Either way the pair is skipped. Spans are kept as before.
  {const om=m.index+m[0].length-m[5].length-2;const ol=t.lastIndexOf('\n',om)+1;const pv=om>0?t[om-1]:'\n';
   if((t[om]==='"'&&(t.slice(ol,om).match(/"/g)||[]).length%2===1&&!/[\s(\[*_—–-]/.test(pv))||/^[\r\n]/.test(m[5]))continue;}
  const ls=t.lastIndexOf('\n',m.index)+1;if(/^[ \t>]*(?:[-*•]|\d+[.)])?[ \t]*\**[ \t]*\[L2\]/.test(t.slice(ls,m.index)))continue; // [L2] lines carry source-language glosses, not KJV quotations (run ODV1-24069)
  const PS=scanParts(m[2],m[3],m[4]);const v1=PS[0].v1,v2=PS[0].v2;
  const quote=m[5].replace(/…|\.\.\./g,' ').replace(/\*+/g,'').trim();const segs=SEGS(m[5]);const ref=book+' '+m[2]+':'+m[3]+(m[4]||'').replace(/\s/g,'');
  // BB-8172 C1: in "'quote' (ref)" the reference written right after the quote is scored first (a bare one takes the book named last
  // before it); the reference before the quote, or the nearer one between them as ruling 4 kept it, is the fallback (after_first).
  const pm=t.slice(m.index+m[0].length).match(/^\s*\((?:vv?\.?\s*)?(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/);
  const pb=pm?(pm[1]?BK[key(pm[1])]:lastBook(t,m.index+m[0].length)):null;const fref=pb?pb+' '+pm[2]+':'+pm[3]:ref;
  const k2=side+'|'+round+'|'+fref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  // Nearer reference (operator-approved 2026-10-13, ruling 4): a chapter:verse reference standing between this reference and the quote,
  // or a bracketed reference right after the quote, is kept as alt; Quote Compare tries it only when the first reference fails.
  const qs=m.index+m[0].length-1-m[5].length;const AR=/(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
  const pr=[...t.slice(m.index,qs).matchAll(AR)];let am=pr.length>1?pr[1]:null;
  if(!am){const pm=t.slice(m.index+m[0].length).match(/^\s*\((?:vv?\.?\s*)?(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/);if(pm)am=pm;}
  if(pb){const nb=pr.length>1?(pr[1][1]?BK[key(pr[1][1])]:book):null;
   const fb=nb?{ref:nb+' '+pr[1][2]+':'+pr[1][3],book:nb,chapter:+pr[1][2],verse:+pr[1][3]}:{ref,book,chapter:+m[2],verse:v1,v2};
   items.push({ref:fref,book:pb,chapter:+pm[2],v1:+pm[3],v2:+pm[3],quote,segs,side,round,alt:fb,after_first:true,cite_form:!/\d/.test(m[5])&&!OPP(ri,m[5]),opp_words:OPPW(ri,m[5]),opp_short:OPPS(ri,m[5]),...LB(t,round,m.index+m[0].length-m[5].length-1)});continue;}
  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}
  // judge_fix6 H6 (run 32293 item 22: "And Luke 1:32 gives the throne before the question of Luke 1:34: \"the Lord God shall give unto him the throne
  // of his father David.\"" was given to Luke 1:34, the reference nearest the quotation, and reported WORDS ARE AT Luke 1:32; the fallback looked only
  // between the reference and the quotation): with no other fallback, a reference written earlier in the same sentence, its subject (the last
  // one before the quoted reference that is not itself a citation closed by ")"), is the fallback, tried only when the nearer reference fails (Quote Compare).
  if(!alt){const bk=x=>x?(BK[key(x)]||BK[key(String(x).split(/\s/).pop())]||null):null;const c0=clauseAt(t,m.index),seg=t.slice(c0,m.index);const er=[...seg.matchAll(AR)].filter(x=>bk(x[1])&&!/^[\s*_]*\)/.test(seg.slice(x.index+x[0].length)));
   if(er.length){const e0=er[er.length-1],eb=bk(e0[1]);alt={ref:eb+' '+e0[2]+':'+e0[3],book:eb,chapter:+e0[2],verse:+e0[3],from:'the earlier reference of the same sentence'};}}
  items.push({ref,book,chapter:+m[2],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,alt,cite_form:cf,opp_words:OPPW(ri,m[5]),opp_short:OPPS(ri,m[5]),...LB(t,round,m.index+m[0].length-m[5].length-1)});}
 for(const R of [rq,rqL,rqP,rqB,rqBP]){R.lastIndex=0;
 while((m=R.exec(t))!==null){if(spans.has(m.index))continue;const book=m[2]?BK[key(m[2])]:lastBook(t,m.index);if(!book)continue;
  const ls=t.lastIndexOf('\n',m.index)+1;if(/^[ \t>]*(?:[-*•]|\d+[.)])?[ \t]*\**[ \t]*\[L2\]/.test(t.slice(ls,m.index)))continue;
  const PS=scanParts(m[3],m[4],m[5]);const v1=PS[0].v1,v2=PS[0].v2;
  const quote=m[1].replace(/…|\.\.\./g,' ').replace(/\*+/g,'').trim();const segs=SEGS(m[1]);const ref=book+' '+m[3]+':'+m[4]+(m[5]||'').replace(/\s/g,'');
  const k2=side+'|'+round+'|'+ref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  items.push({ref,book,chapter:+m[3],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,order:'quote-first',cite_form:!/\d/.test(m[1])&&!OPP(ri,m[1])&&!((R===rqP||R===rqBP)&&/\b(?:not|never|nor|no)\b/i.test(m[0].slice(m[1].length+2,m[0].indexOf('(',m[1].length+2)))),opp_words:OPPW(ri,m[1]),opp_short:OPPS(ri,m[1]),...LB(t,round,m.index+1)});}}}
// judge_fix2 FIX 6a (run 32205: 15 real link-round verses; run 32212: Isaiah 8:18; all "CITED VERSE DOES NOT EXIST"): the read held only the first
// 90 verse groups, and the link-round quotations, scanned last, fell past the cut; a verse not read was then reported as not existing. Now one
// condition per book and chapter lists its verses (verse.in.(...)), about half the old length for the same verses; conditions are added in
// order (primaries first, then alt verses) while the URL stays within 7,000 characters, and an item whose chapter was not read is marked
// unread, which Quote Compare reports NOT CHECKED, never DOES NOT EXIST.
const VG={};const vadd=(b,c,a,z)=>{if(!b||!(c>0)||!(a>0))return;const k=b+'|'+c;(VG[k]=VG[k]||new Set());for(let v=a;v<=Math.min(z||a,a+175);v++)VG[k].add(v);};
// judge_fix6 H6 (runs 32266, 32284, 32293: the report stopped at item 295 to 297, inside the defender's close; the scan kept its first 300 items and
// dropped the rest unmarked): the item cap is raised to ITEM_CAP; an item past it is reported NOT CHECKED with that reason, never dropped.
const ITEM_CAP=1000;const items3=items.slice(0,ITEM_CAP);const over=items.slice(ITEM_CAP).map(i=>({...i,over_cap:true}));items3.forEach(i=>(i.parts||[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).forEach(p=>vadd(i.book,p.chapter,p.v1,p.v2)));items3.forEach(i=>{if(i.alt)vadd(i.alt.book,i.alt.chapter,i.alt.verse,i.alt.v2||i.alt.verse);});
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const conds=[];const readK=new Set();let ulen=BASE.length+'&limit=1000&or='.length+6;
for(const [k,s] of Object.entries(VG)){const [b,c]=k.split('|');const cnd='and(book.eq."'+b+'",chapter.eq.'+c+',verse.in.('+[...s].sort((x,y)=>x-y).join(',')+'))';const add=encodeURIComponent(cnd+',').length;if(ulen+add>7000)continue;ulen+=add;conds.push(cnd);readK.add(k);}
const url=conds.length?BASE+'&limit=1000&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1';
return [{json:{items:items3.map(i=>(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))?i:{...i,unread:true}).concat(over),scanned:items.length,item_cap:ITEM_CAP,url_cited:url,chapters_cited:Object.keys(VG).length,chapters_read:conds.length}}];
