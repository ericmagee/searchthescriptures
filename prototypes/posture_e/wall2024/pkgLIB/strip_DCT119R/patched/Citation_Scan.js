const L2C=(()=>{
 const SB='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/';
 const APOC=/\b((?:1|2|I|II)\s+(?:Maccabees|Esdras)|Tobit|Judith|Wisdom(?:\s+of\s+Solomon)?|Sirach|Ecclesiasticus|Baruch|Susanna|Bel\s+and\s+the\s+Dragon|Prayer\s+of\s+Manass[eh]+s?|Letter\s+of\s+Jeremiah|Rest\s+of\s+Esther)\.?\s+(\d{1,3}):(\d{1,3})/g;
 const STOP=new Set(('the a an and or of in on at to for with by from as is are was were be been being this that these those it its his her their our your my thy thine '+
  'he she they we you i who whom which what when where how not no nor but if then than so here there same verb noun word words phrase form greek hebrew aramaic '+
  'means meaning mean root used use uses reads read says said gives give names name marks mark carries carry states state stated subject object active passive '+
  'participle tense present perfect aorist imperfect future indicative infinitive imperative genitive dative accusative nominative singular plural feminine '+
  'masculine neuter relative pronoun preposition article clause verse verses row rows also only just both each every one two three first last other another '+
  'same very more most much many some any all none whole lord god jesus christ joseph mary david holy ghost spirit son father man woman child do does did '+
  'not into upon unto under over before after till until has have had will would shall should can could may might must').split(' '));
 const strip=s=>String(s==null?'':s).normalize('NFD').replace(/[̀-֑ͯ-ׇ]/g,'');
 const BETA={a:'a',b:'b',g:'g',d:'d',e:'e',z:'z',h:'e',q:'th',i:'i',k:'k',l:'l',m:'m',n:'n',x:'x',o:'o',p:'p',r:'r',s:'s',v:'s',t:'t',u:'u',f:'ph',c:'ch',y:'ps',w:'o'};
 
 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};
 
 const isGrk=s=>/[Ͱ-Ͽἀ-῿]/.test(s),isHeb=s=>/[֐-׿]/.test(s);
 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');return t;};
 
 
 
 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];
 
 
 
 const refsIn=t=>{const out=[];try{for(const k of REFP.keys(String(t||''),{scoped:true,cap:12}))out.push(k.key);}catch(e){}return [...new Set(out)];};
 const apocIn=t=>{const out=[];APOC.lastIndex=0;let m;while((m=APOC.exec(String(t||''))))out.push(m[1].replace(/\s+/g,' ')+' '+m[2]+':'+m[3]);return [...new Set(out)];};
 function blockAt(T,i){const t=String(T||'');const H=[...t.matchAll(/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b[^\n]*|\**\s*\d+[.)]\s+(?:LINK\b)?[^\n]*|#{1,4}\s[^\n]*|UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES[^\n]*|CHALLENGER.{0,2}S\s+UNSUPPORTED[^\n]*)$/gmi)].map(m=>m.index);
  let a=0,b=t.length;for(const h of H){if(h<=i)a=h;else{b=h;break;}}
  const linkHead=/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b|\**\s*\d+[.)]\s)/i.test(t.slice(a,a+40));
  if(!linkHead){const pa=t.lastIndexOf('\n\n',i);const pb=t.indexOf('\n\n',i);const A=Math.max(a,pa<0?0:pa),B=Math.min(b,pb<0?t.length:pb);
   let blk=t.slice(A,B);const opens=/^[\s>*_#-]*(?:\d+[.)]\s*)?[*_]*\s*$/.test(t.slice(A,i));if((opens||(!refsIn(blk).length&&!apocIn(blk).length))&&A>0){const pp=t.lastIndexOf('\n\n',A-1);blk=t.slice(Math.max(a,pp<0?0:pp),B);}return blk;}
  return t.slice(a,b);}
 const W_IT=/(?:^|[^*\w])[*_]([^*_\n]{2,60}?)[*_](?![*\w])/g;
 function tagWords(seg){const s=String(seg||'');const out=[];const seen=new Set();const add=(w,kind)=>{const k=kind+'|'+String(w).toLowerCase();if(seen.has(k))return;seen.add(k);out.push({w:String(w),kind});};
  for(const m of s.matchAll(/\b([GH])0*(\d{1,5})\b/g))add(m[1]+m[2],'strongs');
  for(const m of s.matchAll(/[Ͱ-Ͽἀ-῿]+/g))add(m[0],'greek');
  for(const m of s.matchAll(/[֐-׿\/]+/g)){const x=m[0].replace(/\//g,'');if(x)add(x,'hebrew');}
  const latin=w=>{const x=String(w).replace(/^[\s"“”'‘’(]+|[\s"“”'‘’),.;:!?]+$/g,'');if(!x||/\d/.test(x)||isGrk(x)||isHeb(x))return;
   for(const p of x.split(/\s+/)){const q=p.replace(/^[^A-Za-zÀ-ɏḀ-ỿʼʻ']+|[^A-Za-zÀ-ɏḀ-ỿʼʻ']+$/g,'');if(q.length<2||STOP.has(strip(q).toLowerCase()))continue;add(q,'latin');}};
  for(const m of s.matchAll(W_IT))latin(m[1]);
  const other=out.length>0||W_IT.test(s);W_IT.lastIndex=0;
  for(const m of s.matchAll(/\(\s*["“'‘]?[a-z]/g)){if(/[*_]\s*$/.test(s.slice(0,m.index)))continue;const before=s.slice(0,m.index).replace(/[*_]+/g,'');const toks=before.split(/(\s+)/);const run=[];
   for(let k=toks.length-1;k>=0;k--){const tk=toks[k];if(/^\s+$/.test(tk)||tk==='')continue;const c=tk.replace(/["“”'‘’]/g,'');
    if(/[,;:.!?)\]]$/.test(c)&&run.length)break;const q=c.replace(/[,;:.!?)\]]+$/,'');if(!q||/^[A-Z]/.test(q)||/\d/.test(q)||isGrk(q)||isHeb(q)||STOP.has(strip(q).toLowerCase())||!/^[a-zà-ɏḀ-ỿʼʻ'’-]+$/.test(q))break;run.unshift(q);if(/[,;:.!?]$/.test(c))break;}
   if(run.length&&(!other||run.some(q=>/[à-ɏḀ-ỿʼʻ']/.test(q))))latin(run.join(' '));}
  for(const m of s.matchAll(/(?<![\wÀ-ɏḀ-ỿ])[a-z]*[āēīōūâêîôûáéíóúàèìòùʼʻ][a-zà-ɏḀ-ỿʼʻ']*/g))latin(m[0]);
  for(const m of s.matchAll(/(?<![\w-])(?:ha|he|ve|va|be|ba|le|la|ke|ka|mi|me|she|u)-[a-zà-ɏḀ-ỿʼʻ']{3,20}(?![\w-])/g))latin(m[0]);
  if(!out.length)for(const m of s.matchAll(/["“]([a-zà-ɏḀ-ỿʼʻ'-]{3,24})["”]/g))latin(m[1]);
  return out;}
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"\u201c\u201d\u2018\u2019'(,:]*$/i;
 const LETTER=/[a-z\u00e0-\u024f\u1e00-\u1eff\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff\u02bc\u02bb]/i;
 function markRoots(seg,wds){const s=String(seg||'');const lo=s.toLowerCase();const R=new Set();
  const occ=w=>{const out=[];const k=String(w.w).toLowerCase();const sm=w.kind==='strongs'?k.match(/^([gh])(\d+)$/):null;
   if(sm){for(const x of s.matchAll(new RegExp('\\b'+sm[1]+'0*'+sm[2]+'\\b','gi')))out.push(x.index);return out;}
   let i=-1;while((i=lo.indexOf(k,i+1))>=0){const b=i>0?lo[i-1]:'',a=lo[i+k.length]||'';if((b&&LETTER.test(b))||(a&&LETTER.test(a)))continue;out.push(i);}return out;};
  const pos=wds.map(occ);
  const rootAt=(i,pass)=>{const pre=s.slice(Math.max(0,i-60),i);if(ROOTPRE.test(pre))return true;if(!pass)return false;
   const m=pre.match(/([^\s(*_"\u201c\u201d]+)[*_"\u201d\u2019]*\s*\(\s*$/);if(!m)return false;const j=i-pre.length+pre.lastIndexOf(m[1]);
   return wds.some((w,k)=>R.has(k)&&pos[k].includes(j));};
  for(let pass=0;pass<2;pass++)wds.forEach((w,k)=>{if(R.has(k)||!pos[k].length)return;if(pos[k].every(i=>rootAt(i,pass)))R.add(k);});
  return wds.map((w,k)=>R.has(k)?{...w,root:true}:w);}
 function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   let wds=tagWords(seg);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));const w2=tagWords(seg2);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);const own=refsIn(seg);const __ls=t.lastIndexOf('\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\n',i));const __line=t.slice(__ls,__le);const __press=/--\s*MEANS\s*:/.test(t.slice(__ls,i));  const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
   wds=markRoots(seg,wds);
   out.push({side,round,at:i,seg:seg.replace(/\s+/g,' ').trim().slice(0,300),words:wds,verses:vs,apoc:ap});}}
  return out;}
 
 
 
 
  function countClaims(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/(?<![:\d]\s?)\b(\d{1,4})\s+(verses?|tokens?|rows?|times|occurrences?|instances?)\b/gi)){if(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s*$/.test(t.slice(Math.max(0,m.index-20),m.index)))continue;const pre=t.slice(Math.max(0,m.index-90),m.index);
   const after=t.slice(m.index,m.index+80);if(!/\[L2\]|\b[GH]\d{1,5}\b|[Ͱ-Ͽἀ-῿֐-׿]|[*_][a-zà-ɏḀ-ỿ]/.test(pre+after))continue;
   const num=(pre.match(/\b([GH])0*(\d{1,5})\b(?![\s\S]*\b[GH]\d)/)||[]);let subj=num.length?num[1]+num[2]:null,word=null;
   if(!subj){const ws=tagWords(pre.slice(-70));const w=ws.filter(x=>x.kind!=='strongs').pop();if(w)word=w;}
   if(!subj&&!word)continue;const u=m[2].toLowerCase();
   out.push({side,round,at:m.index,n:+m[1],unit:/^verse/.test(u)?'verses':/^token/.test(u)?'tokens':null,said:m[0],subj,word,text:t.slice(Math.max(0,m.index-60),m.index+m[0].length).replace(/\s+/g,' ').trim()});}}
  return out;}
 
 function wordsUrls(keys,o){const PER=(o&&o.per)||20;const URL_MAX=7000;const B=SB+'original_words?select=book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph&order=book,chapter,verse,word_position&limit=1000';
  const ks=[...new Set((keys||[]).filter(k=>/^(.+) (\d+):(\d+)$/.test(String(k))))];const out=[];
  const mk=b=>{const G=new Map();for(const k of b){const m=String(k).match(/^(.+) (\d+):(\d+)$/);const g=m[1]+'|'+m[2];if(!G.has(g))G.set(g,[]);G.get(g).push(+m[3]);}
   const conds=[...G].map(([g,vs])=>{const [bk,c]=g.split('|');return 'and(book.eq."'+bk+'",chapter.eq.'+c+',verse.in.('+[...new Set(vs)].sort((x,y)=>x-y).join(',')+'))';});return B+'&or='+encodeURIComponent('('+conds.join(',')+')');};
  let cur=[];for(const k of ks){const t=cur.concat([k]);if(cur.length&&(t.length>PER||mk(t).length>URL_MAX)){out.push({url:mk(cur),keys:cur});cur=[k];}else cur=t;}if(cur.length)out.push({url:mk(cur),keys:cur});return out;}
 
 
 
 
 
 
 return {tags,tagWords,countClaims,wordsUrls,norm,blockAt,refsIn,apocIn,};})();
const REFP=(()=>{const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',songofsongs:'Song of Solomon',canticles:'Song of Solomon',revelations:'Revelation',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges',jdg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles','1chron':'1 Chronicles','2chron':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',eccles:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',obad:'Obadiah',mic:'Micah',nah:'Nahum',hab:'Habakkuk',zeph:'Zephaniah',hag:'Haggai',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',tit:'Titus',phlm:'Philemon',philem:'Philemon',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John','2jn':'2 John','3jn':'3 John',rev:'Revelation'});
 const book=x=>{if(!x)return null;let b=BK[key(x)];if(!b){const w=String(x).split(/\s/).pop();b=BK[key(w)]||null;}return b;};
 const HEAD=/(?<![A-Za-z0-9:])(?:((?:[1-3]\s)?[A-Z][A-Za-z]+(?:\s(?:of\s)?[A-Z][A-Za-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
 const RNG=/^\s?[–—-]\s?(\d{1,3})(?!\d|:\d)/, FULL=/^\s?,\s?(\d{1,3}):(\d{1,3})(?!\d)/, BARE=/^\s?,\s?(\d{1,3})(?!\d|:\d|\s+[A-Z])/;
 const SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
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
 const keys=(t,o)=>{const cap=(o&&o.cap)||30;const out=[];for(const r of parse(t,o)){const b=r.book||r.ctx;if(!b)continue;const z=r.v2-r.v1>cap?r.v1:r.v2;for(let v=r.v1;v<=z;v++)out.push({key:b+' '+r.c+':'+v,pos:r.at,ref:b+' '+r.label});}return out;};
 return {parse,keys,book,BK,BOOKS};})();
let F=null;try{if($('Regrade Load').isExecuted)F=$('Regrade Load').first().json.f;}catch(e){F=null;}if(!F)F=$('Final Output').first().json;
const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation|1 Esdras|2 Esdras|Tobit|Judith|Rest of Esther|Wisdom|Sirach (Ecclesiasticus)|Baruch|Letter of Jeremiah|Prayer of Azariah and the Song of the Three Jews|Susanna|Bel and the Dragon|Prayer of Manassah|1 Maccabees|2 Maccabees".split('|');
const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
Object.assign(BK,{psalm:'Psalms',songofsongs:'Song of Solomon',canticles:'Song of Solomon',sirach:'Sirach (Ecclesiasticus)',ecclesiasticus:'Sirach (Ecclesiasticus)',wisdomofsolomon:'Wisdom',revelations:'Revelation'});
Object.assign(BK,{gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges',jdg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',eccles:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',obad:'Obadiah',mic:'Micah',nah:'Nahum',hab:'Habakkuk',zeph:'Zephaniah',hag:'Haggai',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',tit:'Titus',phlm:'Philemon',philem:'Philemon',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John','2jn':'2 John','3jn':'3 John',rev:'Revelation'});
const BREF=/((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][A-Za-z]+(?:\s(?:of\s)?[A-Z][A-Za-z]+)?)(?:\.?\s(\d{1,3}):(\d{1,3})|['’]s\b)/g;
const QMASK=new Map();
const clauseAt=(t,pos)=>{t=String(t);let mk=QMASK.get(t);if(mk===undefined){mk=t.replace(/[“"][^”"\n]{0,400}[”"]/g,s=>' '.repeat(s.length));QMASK.set(t,mk);}
 let s=0;const rx=/[.!?]["”’')\]*_]*\s+(?=[A-Z\[*_"“(#>-])|;|\n/g;let x;while((x=rx.exec(mk))!==null&&x.index<pos)s=x.index+x[0].length;return s;};
const lastBook=(t,pos)=>{let b=null;for(const x of String(t).slice(clauseAt(t,pos),pos).matchAll(BREF)){const k=BK[key(x[1])]||BK[key(String(x[1]).split(/\s/).pop())];if(k)b=k;}return b;};
const __PMX=new Set(['John','James','Jude','Mark','Timothy','Titus','Philemon']);const __PMW=/(?<![A-Za-z0-9])((?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)(?![A-Za-z0-9])(?!\.?\s*\d{1,3}:\d)/g;
const __pmrAlt=(t,m,book)=>{const st=clauseAt(t,m.index);const mk=QMASK.get(String(t))||String(t);let nb=null;for(const x of mk.slice(st,m.index+m[0].length).matchAll(__PMW)){const i=BOOKS.indexOf(x[1]);if(i>=0&&i<66&&!__PMX.has(x[1]))nb=x[1];}
 return nb&&nb!==book?{alt:{ref:nb+' '+m[3]+':'+m[4],book:nb,chapter:+m[3],verse:+m[4],from:'the book named in the prose beside the bare reference'}}:{};};
const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]].concat(F.cr4?[['DEFENDER','R4',F.cr4]]:[],F.dr4?[['CHALLENGER','R4',F.dr4]]:[]).concat(F.synthesis?[['SYNTHESIS','S',F.synthesis]]:[]);
const re=/((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)[^“”"\n]{0,30}(?:\n>?\s*)?[“"]([^”"]{12,400})[”"]/g;
const rq=/[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*(?:\(\s*|[–—-][ \t]*\**[ \t]*)((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)/g;
const rqP=/[“"]([^”"]{12,400})[”"](?:[^“”"\n()]{1,30})\(\s*((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)\s*\)/g;
const rqL=/(?<=(?:^|\n)[ \t>*•-]*)[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*\[L[1-4]\][ \t]*\**[ \t]*((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)/g;
const rqB=/[“"]([^”"]{12,400})[”"][ \t]*\**[ \t]*\(\s*()(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)\s*\)/g;
const rqBP=/[“"]([^”"]{12,400})[”"](?:[^“”"\n()]{1,30})\(\s*()(\d{1,3}):(\d{1,3})((?:\s?[–—-]\s?\d{1,3}(?!\d|:\d)|\s?,\s?\d{1,3}:\d{1,3}|\s?,\s?\d{1,3}(?![\d:]))*)\s*\)/g;
const LBH=/^[ \t>#*_-]*(?:\d+[.)][ \t]*)?\**[ \t]*LINK[ \t]+(\d+)\b[^\n]*/gim;
const LB=(t,round,pos)=>{const no={link:null,load_bearing:false};if(round!=='R3')return no;
 let h=null,x;LBH.lastIndex=0;while((x=LBH.exec(t))!==null&&x.index<pos)h=x;if(!h)return no;
 if(/(?:^|\n)[ \t>#*_]*(?:[A-Z]+['’]S[ \t]+)?UNSUPPORTED[- ]L4[ \t]+PREMISES/i.test(t.slice(0,pos)))return no;
 const link=+h[1];const st=(h[0].match(/LINK[ \t]+\d+[^:\n]{0,40}:[ \t*_]*([A-Za-z-]+)/i)||[])[1]||'';if(/^CONCEDED$/i.test(st))return {link,load_bearing:false};
 const tags=[...t.slice(h.index,pos).matchAll(/\[L([1-4])\]/g)];return {link,load_bearing:tags.length>0&&tags[tags.length-1][1]==='1'};};
rounds.forEach(x=>{x[2]=String(x[2]||'').replace(/\\(["'\\])/g,'$1');});
const scanParts=(c,v,tail)=>{const ps=REFP.parse('Genesis '+c+':'+v+String(tail||'')).map(r=>({chapter:r.c,v1:r.v1,v2:r.v2}));return ps.length?ps:[{chapter:+c,v1:+v,v2:+v}];};
const items=[];const seen=new Set();
const CITE_FORM=g=>{const h=String(g).replace(/\[(?:KJV|L[1-4])\]|\(KJV\)|\bKJV\b/g,'').replace(/\([^()\n]{1,20}\)/,'');
 return /^[\s*_\])>:,–—-]*(?:['’]s)?[\s*_(]*$/.test(h)||/^[\s*_\])]*:\s*(?:\S+\s+){1,5}[\s*_(]*$/.test(h)
  ||/^[\s*_\])]*(?:(?:is|was)\s+)?(?:quoted|cited|puts|says|saith|reads|records|writes|declares)\b[\s,:]*[*_(]*$/.test(h);};
const NOT_CITE=/(?:attribut|misattribut|misquot|you (?:quote|cite|wrote|assign|give))/i;
const SEGS=s=>String(s).split(/(?:…|\.\.\.)(?!:)/).map(x=>x.replace(/\*+/g,'').trim()).filter(Boolean);
const QN=s=>String(s).replace(/\*+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/(?:…|\.\.\.)(?!:)/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const PROSE=rounds.map(x=>QN(String(x[2]||'').replace(/[“"][^”"\n]{1,400}[”"]/g,' | ')));
const OPP=(ri,q)=>{const n=QN(q).replace(/^[\s.,;:!?'"]+|[\s.,;:!?'"]+$/g,'');return n.length>=12&&rounds.some((x,j)=>j<ri&&x[0]!==rounds[ri][0]&&PROSE[j].includes(n));};
const QF=s=>QN(s).replace(/["']/g,'').replace(/\s+/g,' ').trim();
const FULL=rounds.map(x=>QF(String(x[2]||'')));
const OPPW=(ri,raw)=>{const ps=String(raw).split(/(?:…|\.\.\.)(?!:)/).map(p=>QF(p).replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g,'')).filter(Boolean);
 if(ps.join(' ').length<12)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;let at=0;for(const p of ps){const k=FULL[j].indexOf(p,at);if(k<0)return false;at=k+p.length;}return true;});};
const QW=s=>QF(s).split(/[^a-z0-9]+/).filter(Boolean);
const SENTW=rounds.map(x=>QF(String(x[2]||'')).split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length));
const OPPS=(ri,raw)=>{const q=QW(String(raw).replace(/(?:…|\.\.\.)(?!:)/g,' '));if(q.length<6)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;
  return SENTW[j].some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}
   if(k===q.length&&e-st+1<=2*q.length)return true;}return false;});});};
const RF=new RegExp('^'+re.source.slice(0,re.source.indexOf('[^“”"\\n]{0,30}')));
for(const [ri,[side,round,text]] of rounds.entries()){const t=String(text||'');let m;re.lastIndex=0;const spans=new Set();
 const claimed=new Set();for(const R of [rq,rqL,rqB]){R.lastIndex=0;while((m=R.exec(t))!==null){if(m[2]?BK[key(m[2])]:lastBook(t,m.index))claimed.add(m.index);}}
 while((m=re.exec(t))!==null){const book=BK[key(m[1])];if(!book)continue;
  {const rc=RF.exec(m[0]);if(rc&&/^[ \t]*\)/.test(m[0].slice(rc[0].length)))continue;}
  {const om0=m.index+m[0].length-m[5].length-2;const rf=RF.exec(m[0]);const gap=rf?t.slice(m.index+rf[0].length,om0):'';
   if(claimed.has(om0)&&/\n|[.!?]["”*_)\]]*\s/.test(gap))continue;var cf=CITE_FORM(gap)&&!/\d/.test(m[5])&&!NOT_CITE.test(t.slice(Math.max(t.lastIndexOf('\n',m.index)+1,m.index-80),m.index))&&!OPP(ri,m[5]);}
  spans.add(m.index+m[0].length-m[5].length-2);
  {const om=m.index+m[0].length-m[5].length-2;const ol=t.lastIndexOf('\n',om)+1;const pv=om>0?t[om-1]:'\n';
   if((t[om]==='"'&&(t.slice(ol,om).match(/"/g)||[]).length%2===1&&!/[\s(\[*_—–-]/.test(pv))||/^[\r\n]/.test(m[5]))continue;}
  const ls=t.lastIndexOf('\n',m.index)+1;if(/^[ \t>]*(?:[-*•]|\d+[.)])?[ \t]*\**[ \t]*\[L2\]/.test(t.slice(ls,m.index)))continue;
  const PS=scanParts(m[2],m[3],m[4]);const v1=PS[0].v1,v2=PS[0].v2;
  const quote=m[5].replace(/(?:…|\.\.\.)(?!:)/g,' ').replace(/\*+/g,'').trim();const segs=SEGS(m[5]);const ref=book+' '+m[2]+':'+m[3]+(m[4]||'').replace(/\s/g,'');
  const pm=t.slice(m.index+m[0].length).match(/^\s*\((?:vv?\.?\s*)?(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/);
  const pb=pm?(pm[1]?BK[key(pm[1])]:lastBook(t,m.index+m[0].length)):null;const fref=pb?pb+' '+pm[2]+':'+pm[3]:ref;
  const k2=side+'|'+round+'|'+fref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  const qs=m.index+m[0].length-1-m[5].length;const AR=/(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/g;
  const pr=[...t.slice(m.index,qs).matchAll(AR)];let am=pr.length>1?pr[1]:null;
  if(!am){const pm=t.slice(m.index+m[0].length).match(/^\s*\((?:vv?\.?\s*)?(?:((?<![A-Za-z0-9])(?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)\.?\s)?(\d{1,3}):(\d{1,3})/);if(pm)am=pm;}
  if(pb){const nb=pr.length>1?(pr[1][1]?BK[key(pr[1][1])]:book):null;
   const fb=nb?{ref:nb+' '+pr[1][2]+':'+pr[1][3],book:nb,chapter:+pr[1][2],verse:+pr[1][3]}:{ref,book,chapter:+m[2],verse:v1,v2};
   items.push({ref:fref,book:pb,chapter:+pm[2],v1:+pm[3],v2:+pm[3],quote,segs,side,round,alt:fb,after_first:true,cite_form:!/\d/.test(m[5])&&!OPP(ri,m[5]),opp_words:OPPW(ri,m[5]),opp_short:OPPS(ri,m[5]),...LB(t,round,m.index+m[0].length-m[5].length-1)});continue;}
  let alt=null;if(am){const ab=am[1]?BK[key(am[1])]:book;if(ab)alt={ref:ab+' '+am[2]+':'+am[3],book:ab,chapter:+am[2],verse:+am[3]};}
  if(!alt){const bk=x=>x?(BK[key(x)]||BK[key(String(x).split(/\s/).pop())]||null):null;const c0=clauseAt(t,m.index),seg=t.slice(c0,m.index);const er=[...seg.matchAll(AR)].filter(x=>bk(x[1])&&!/^[\s*_]*\)/.test(seg.slice(x.index+x[0].length)));
   if(er.length){const e0=er[er.length-1],eb=bk(e0[1]);alt={ref:eb+' '+e0[2]+':'+e0[3],book:eb,chapter:+e0[2],verse:+e0[3],from:'the earlier reference of the same sentence'};}}
  items.push({ref,book,chapter:+m[2],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,alt,cite_form:cf,opp_words:OPPW(ri,m[5]),opp_short:OPPS(ri,m[5]),...LB(t,round,m.index+m[0].length-m[5].length-1)});}
 for(const R of [rq,rqL,rqP,rqB,rqBP]){R.lastIndex=0;
 while((m=R.exec(t))!==null){if(spans.has(m.index))continue;const book=m[2]?BK[key(m[2])]:lastBook(t,m.index);if(!book)continue;
  const ls=t.lastIndexOf('\n',m.index)+1;if(/^[ \t>]*(?:[-*•]|\d+[.)])?[ \t]*\**[ \t]*\[L2\]/.test(t.slice(ls,m.index)))continue;
  const PS=scanParts(m[3],m[4],m[5]);const v1=PS[0].v1,v2=PS[0].v2;
  const quote=m[1].replace(/(?:…|\.\.\.)(?!:)/g,' ').replace(/\*+/g,'').trim();const segs=SEGS(m[1]);const ref=book+' '+m[3]+':'+m[4]+(m[5]||'').replace(/\s/g,'');
  const k2=side+'|'+round+'|'+ref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  items.push({ref,book,chapter:+m[3],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,order:'quote-first',...(m[2]?{}:__pmrAlt(t,m,book)),cite_form:!/\d/.test(m[1])&&!OPP(ri,m[1])&&!((R===rqP||R===rqBP)&&/\b(?:not|never|nor|no)\b/i.test(m[0].slice(m[1].length+2,m[0].indexOf('(',m[1].length+2)))),opp_words:OPPW(ri,m[1]),opp_short:OPPS(ri,m[1]),...LB(t,round,m.index+1)});}}}
const VG={};const vadd=(b,c,a,z)=>{if(!b||!(c>0)||!(a>0))return;const k=b+'|'+c;(VG[k]=VG[k]||new Set());for(let v=a;v<=Math.min(z||a,a+175);v++)VG[k].add(v);};
const ITEM_CAP=1000;const items3=items.slice(0,ITEM_CAP);const over=items.slice(ITEM_CAP).map(i=>({...i,over_cap:true}));items3.forEach(i=>(i.parts||[{chapter:i.chapter,v1:i.v1,v2:i.v2}]).forEach(p=>vadd(i.book,p.chapter,p.v1,p.v2)));items3.forEach(i=>{if(i.alt)vadd(i.alt.book,i.alt.chapter,i.alt.verse,i.alt.v2||i.alt.verse);});
const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';
const conds=[];const readK=new Set();let ulen=BASE.length+'&limit=1000&or='.length+6;
for(const [k,s] of Object.entries(VG)){const [b,c]=k.split('|');const cnd='and(book.eq."'+b+'",chapter.eq.'+c+',verse.in.('+[...s].sort((x,y)=>x-y).join(',')+'))';const add=encodeURIComponent(cnd+',').length;if(ulen+add>7000)continue;ulen+=add;conds.push(cnd);readK.add(k);}
const url=conds.length?BASE+'&limit=1000&or='+encodeURIComponent('('+conds.join(',')+')'):BASE+'&id=eq.-1';
const __L2T=(()=>{try{const RA=[['DEFENDER','CR1',F.cr1],['CHALLENGER','DR1',F.gr1],['DEFENDER','CR2',F.cr2],['CHALLENGER','DR2',F.gr2],['DEFENDER','CR3',F.cr3],['CHALLENGER','DR3',F.dr3],['DEFENDER','CR4',F.cr4],['CHALLENGER','DR4',F.dr4]].filter(x=>x[2]);
 const TG=L2C.tags(RA);const keys=[...new Set(TG.flatMap(t=>t.verses))];return {l2_tags:TG,l2_urls:L2C.wordsUrls(keys).map(x=>x.url),l2_read:keys,l2_claims:L2C.countClaims(RA)};}catch(e){return {l2_tags:[],l2_urls:[],l2_read:[],l2_claims:[],l2_error:String(e.message||e).slice(0,200)};}})();
const __SYV=(()=>{const t=String(F.synthesis||'');if(!t)return [];const RX=/\b(?:the\s+)?(?:defender|challenger|defen[cs]e)(?:'s\s+(?:case|chain|position))?\s+(?:wins|won|prevails|prevailed|carries|carried|has\s+the\s+stronger|is\s+(?:right|correct|vindicated))\b|\bverdict\s*:|\b(?:the\s+)?(?:defender|challenger)(?:'s\s+(?:case|chain|link))?\s+(?:holds|stands|fails|collapses|is\s+broken)\b|\bwinner\b/gi;const out=[];let m;while((m=RX.exec(t))&&out.length<10)out.push(t.slice(Math.max(0,m.index-60),m.index+m[0].length+40).replace(/\s+/g,' ').trim());return out;})();
return [{json:{...__L2T,synth_verdict:__SYV,items:items3.map(i=>(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))?i:{...i,unread:true}).concat(over),scanned:items.length,item_cap:ITEM_CAP,url_cited:url,chapters_cited:Object.keys(VG).length,chapters_read:conds.length}}];