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
const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]];
const re=/((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}|\s?,\s?\d{1,3})*)[^“”"\n]{0,30}(?:\n>?\s*)?[“"]([^”"]{12,400})[”"]/g;
// item 3 (BB-4890): also a quotation written BEFORE its reference, the reference following at once in parentheses or after a
// dash. A quote already paired by the reference-then-quote pattern is never paired a second time (its span is recorded).
const rq=/[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*(?:\(\s*|[–—-][ \t]*\**[ \t]*)((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}|\s?,\s?\d{1,3})*)/g;
// BB-5773: a quote that opens its own line and is followed by a layer tag and its reference ("..." [L3] Ezekiel 37:24) is the same form.
const rqL=/(?<=(?:^|\n)[ \t>*•-]*)[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*\[L[1-4]\][ \t]*\**[ \t]*((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}|\s?,\s?\d{1,3})*)/g;
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
const QN=s=>String(s).replace(/\*+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/…|\.\.\./g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const PROSE=rounds.map(x=>QN(String(x[2]||'').replace(/[“"][^”"\n]{1,400}[”"]/g,' | ')));
const OPP=(ri,q)=>{const n=QN(q).replace(/^[\s.,;:!?'"]+|[\s.,;:!?'"]+$/g,'');return n.length>=12&&rounds.some((x,j)=>j<ri&&x[0]!==rounds[ri][0]&&PROSE[j].includes(n));};
const RF=new RegExp('^'+re.source.slice(0,re.source.indexOf('[^“”"\\n]{0,30}')));
for(const [ri,[side,round,text]] of rounds.entries()){const t=String(text||'');let m;re.lastIndex=0;const spans=new Set();
 const claimed=new Set();for(const R of [rq,rqL]){R.lastIndex=0;while((m=R.exec(t))!==null){if(BK[key(m[2])])claimed.add(m.index);}}
 while((m=re.exec(t))!==null){const book=BK[key(m[1])];if(!book)continue;
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
  const vs=[+m[3],...((m[4]||'').match(/\d{1,3}/g)||[]).map(Number)];const v1=Math.min(...vs),v2=Math.max(...vs);
  const quote=m[5].replace(/…|\.\.\./g,' ').replace(/\*+/g,'').trim();const ref=book+' '+m[2]+':'+m[3]+(m[4]||'').replace(/\s/g,'');
  const k2=side+'|'+round+'|'+ref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  // Nearer reference (operator-approved 2026-10-13, ruling 4): a chapter:verse reference standing between this reference and the quote,
  // or a bracketed reference right after the quote, is kept as alt; Quote Compare tries it only when the first reference fails.
  const qs=m.index+m[0].length-1-m[5].length;const AR=/(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
  const pr=[...t.slice(m.index,qs).matchAll(AR)];let am=pr.length>1?pr[1]:null;
  if(!am){const pm=t.slice(m.index+m[0].length).match(/^\s*\((?:vv?\.?\s*)?(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/);if(pm)am=pm;}
  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}
  items.push({ref,book,chapter:+m[2],v1,v2,quote,side,round,alt,cite_form:cf});}
 for(const R of [rq,rqL]){R.lastIndex=0;
 while((m=R.exec(t))!==null){if(spans.has(m.index))continue;const book=BK[key(m[2])];if(!book)continue;
  const ls=t.lastIndexOf('\n',m.index)+1;if(/^[ \t>]*(?:[-*•]|\d+[.)])?[ \t]*\**[ \t]*\[L2\]/.test(t.slice(ls,m.index)))continue;
  const vs=[+m[4],...((m[5]||'').match(/\d{1,3}/g)||[]).map(Number)];const v1=Math.min(...vs),v2=Math.max(...vs);
  const quote=m[1].replace(/…|\.\.\./g,' ').replace(/\*+/g,'').trim();const ref=book+' '+m[3]+':'+m[4]+(m[5]||'').replace(/\s/g,'');
  const k2=side+'|'+round+'|'+ref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  items.push({ref,book,chapter:+m[3],v1,v2,quote,side,round,order:'quote-first',cite_form:!/\d/.test(m[1])&&!OPP(ri,m[1])});}}}
const groups=[...new Set([...items.map(i=>i.book+'|'+i.chapter+'|'+i.v1+'|'+i.v2),...items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+i.alt.verse)])].slice(0,90); // primaries first, then alt verses
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const url=groups.length?BASE+'&limit=1000&or='+encodeURIComponent('('+groups.map(g=>{const [b,c,a,z]=g.split('|');return 'and(book.eq."'+b+'",chapter.eq.'+c+',verse.gte.'+a+',verse.lte.'+z+')';}).join(',')+')'):BASE+'&id=eq.-1';
return [{json:{items:items.slice(0,300),scanned:items.length,url_cited:url}}];
