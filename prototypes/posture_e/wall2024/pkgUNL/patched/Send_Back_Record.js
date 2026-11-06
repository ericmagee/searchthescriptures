// pkgABS (W3 ruling, Wall 2024, 2026-11-06; Commitment 3, ruling 421): a grade that rests on an absence. An E-ANS line graded MEETS, or an E-HOLD
// line graded STANDS or UNDERDETERMINED, whose answer words are an absence or a non-denial ("does not deny", "names no", "both retained") and that
// quotes no positive fit (a counted [L1]: a verse quoted with its reference under an [L1] tag, standing in the KJV verse) is raised. The text read is
// the ANSWER quote and the judge's MEETS quote (E-ANS), or the whole line (E-HOLD). A line with an absence phrase and a counted [L1] is not raised.
// Cure (Send Back Record): CHANGE TO MISSES or FAILS (E-ANS); CHANGE TO a BROKEN or FORCED line that passes the layer check (pkgECL); or a CHANGE TO
// whose line quotes a counted [L1] positive fit and no longer rests on the absence alone. A KEEP does not cure. Uses ECL (pkgECL) for the [L1] count.
const ABS=(()=>{
 const AB=/\b(?:do(?:es)?\s+not|did\s+not|doesn['’]t|didn['’]t|never)\s+(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject)\b|\bnames?\s+no\b|\bstates?\s+no\b|\bsays?\s+nothing\b|\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?|says?|names?|denies|deny|excludes?)\b|\bis\s+silent\b|\bboth\s+(?:are\s+)?(?:retained|accommodated|kept|stand|preserved)\b|\bare\s+both\s+(?:retained|accommodated|kept|preserved)\b|\baccommodat\w+\b|\b(?:remains?|is|are)\s+compatible\b|\bnot\s+inconsistent\b|\bleaves?\s+(?:room|open)\b/i;
 const WD=/\bI\s+(?:drop|withdraw|narrow)\b|\bnarrow\s+accordingly\b/i;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"');
 const AQ=/ANSWER:\s*["“'‘]([\s\S]*?)["”'’]\s*--\s*(MEETS|MISSES|FAILS)\b\s*(?:--\s*([\s\S]*))?$/i;
 // the text an item's grade rests on
 function text(id){const L=N(id&&id.flagged_line);if(id.rule==='E-ANS'){const m=L.match(AQ);return m?(m[1]+' '+(m[3]||'')):L;}return L;}
 function absence(t){const m=String(t||'').match(AB);return m?m[0]:null;}
 function fit(t,ctx){try{const c=ECL.check('FORCED -- GROUND: '+N(t),ctx||{});return c.l1;}catch(e){return 'NONE';}}
 // applies to E-ANS MEETS and E-HOLD STANDS/UNDERDETERMINED; returns {raise, absence, fit, why}
 function check(id,ctx){const g=String(id&&id.grade||'').toUpperCase();
  if(!((id.rule==='E-ANS'&&g==='MEETS')||(id.rule==='E-HOLD'&&(g==='STANDS'||g==='UNDERDETERMINED'))))return {applies:false,raise:false};
  const t=text(id);const a=absence(t);if(!a)return {applies:true,raise:false,absence:null};
  if(WD.test(t))return {applies:true,raise:false,absence:a,withdrawn:true,why:'the answer drops or narrows its own claim (a withdrawal, K-W), not a meeting by absence'};
  const f=fit(t,ctx);if(f==='COUNTED')return {applies:true,raise:false,absence:a,fit:f,why:'absence phrase "'+a+'" with a counted [L1] positive fit'};
  return {applies:true,raise:true,absence:a,fit:f,why:id.rule+' '+g+' rests on an absence or non-denial ("'+a+'") and quotes no counted [L1] positive fit'+(f!=='NONE'?' ([L1] '+f+')':'')};}
 // the cure of a send-back answer a = {ans, to, why}
 function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');
  if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a grade resting on an absence (pkgABS, Commitment 3, ruling 421)');const to=N(a.to);
  if(it.rule==='E-ANS'&&/--\s*(?:MISSES|FAILS)\b/i.test(to))return R(true,'CHANGE TO grades MISSES (pkgABS)');
  if(/^\s*RETRACTED\b/i.test(to))return R(true,'CHANGE TO RETRACTED (pkgABS)');
  if(/\b(?:BROKEN|FORCED)\b/.test(to)){const c=ECL.check(to,ctx||{});if(c.applies&&!c.faults.length)return R(true,'CHANGE TO a break with its layers (pkgABS): '+c.why);return R(false,'CHANGE TO a break that fails the layer check (pkgABS): '+c.why);}
  const f=fit(it.rule==='E-ANS'?(to.match(AQ)?(to.match(AQ)[1]+' '+(to.match(AQ)[3]||'')):to):to,ctx);if(f==='COUNTED')return R(true,'CHANGE TO quotes a counted [L1] positive fit (pkgABS)');
  return R(false,'CHANGE TO quotes no counted [L1] positive fit and is not regraded MISSES, BROKEN or FORCED (pkgABS)'+(f!=='NONE'?' ([L1] '+f+')':''));}
 // a verse quoted beside its reference without an [L1] tag, standing in the KJV verse: reported beside a raise, never a bar to it
 const QP=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?[^"“”'‘\n\[]{0,40}?(?:"([^"“”]{6,400})"|“([^"“”]{6,400})”|'([^'\n]{6,400}?)'(?![a-z])|‘([^’\n]{6,400})’)/g;
 function quoted(t,ctx){const idx={};for(const r of (ctx&&ctx.rows)||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;const out=[];
  for(const p of String(t||'').matchAll(QP)){const q=p[5]||p[6]||p[7]||p[8];const v1=+p[3],v2=+(p[4]||p[3]);const parts=[];for(let v=v1;v<=v2;v++){const x=idx[p[1]+' '+p[2]+':'+v];if(x)parts.push(x);}
   const ref=p[1]+' '+p[2]+':'+v1+(v2!==v1?'-'+v2:'');if(parts.length!==v2-v1+1){out.push({ref,q,status:'UNVERIFIABLE'});continue;}const k=parts.join(' ');out.push({ref,q,status:kkjvIsVerseQuote(q,k)&&kkjvStands(q,k)?'STANDS':'NOT IN VERSE'});}
  return out;}
 return {check,cure,absence,text,fit,quoted};})();

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
 // beta code (original_words, Greek, as the table writes it: c chi, x xi) to a plain transliteration
 const BETA={a:'a',b:'b',g:'g',d:'d',e:'e',z:'z',h:'e',q:'th',i:'i',k:'k',l:'l',m:'m',n:'n',x:'x',o:'o',p:'p',r:'r',s:'s',v:'s',t:'t',u:'u',f:'ph',c:'ch',y:'ps',w:'o'};
 const beta2lat=s=>String(s||'').toLowerCase().split('').map(c=>BETA[c]!=null?BETA[c]:c).join('');
 // Greek script to a plain transliteration (accents stripped first)
 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};
 const grk2lat=s=>strip(s).toLowerCase().split('').map(c=>GRK[c]!=null?GRK[c]:c).join('');
 const isGrk=s=>/[Ͱ-Ͽἀ-῿]/.test(s),isHeb=s=>/[֐-׿]/.test(s);
 // one normal form for every Latin transliteration (debater, lexicon, original_words after beta2lat)
 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');return t;};
 const skel=t=>t.replace(/[aeiou]/g,'');
 // a function word, by its morph code (the [L2] sheet leaves these out; the check still reads every word): Greek T (article), CONJ, COND,
 // PREP, PRT, INJ, and the pronouns P, R, C, D, K, I, X, Q, F, S; Hebrew (TAHOT, H + segments): the word's own segment (the last that is not a
 // suffix S...) a particle T..., a conjunction C/c, a preposition R or a pronoun P.
 const isFunc=r=>{const m=String(r&&r.morph||'').trim();if(!m)return false;if(/^H/.test(m)){const sg=m.slice(1).split(/[\/\s]/).filter(x=>x&&!/^S/.test(x));const main=sg[sg.length-1]||'';return /^[TCRPc]/.test(main);}
  return /^(?:T|CONJ|COND|PREP|PRT|INJ|P|R|C|D|K|I|X|Q|F|S)$/.test(m.split(/[\s-]/)[0]);};
 const hebScript=s=>strip(s).replace(/[^א-ת]/g,'');
 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];
 // the forms a written word may take: itself, its parts after a hyphen or slash, and with one Hebrew prefix stripped
 const variants=w=>{const out=new Set();const raw=String(w||'');const parts=raw.split(/[-\/]/).filter(Boolean);
  const add=x=>{const n=norm(x);if(n.length>=2){out.add(n);if(/^h[aeiou]/.test(n))out.add(n.slice(1));}};add(raw);if(parts.length>1){add(parts[parts.length-1]);add(parts.join(''));}
  for(const n of [...out])for(const p of PREF)if(n.startsWith(p)&&n.length-p.length>=3)out.add(n.slice(p.length));return [...out];};
 const ed1=(a,b)=>{if(a===b)return true;if(Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;
  return a.slice(i+1)===b.slice(i+1)||a.slice(i)===b.slice(i+1)||a.slice(i+1)===b.slice(i);};
 // ---------- reading the rounds ----------
 const vkey=(b,c,v)=>b+' '+c+':'+v;
 const refsIn=t=>{const out=[];try{for(const k of REFP.keys(String(t||''),{scoped:true,cap:12}))out.push(k.key);}catch(e){}return [...new Set(out)];};
 const apocIn=t=>{const out=[];APOC.lastIndex=0;let m;while((m=APOC.exec(String(t||''))))out.push(m[1].replace(/\s+/g,' ')+' '+m[2]+':'+m[3]);return [...new Set(out)];};
 // the block that holds position i: the LINK block or numbered premise item, otherwise the paragraph; with no verse in it, the paragraph before
 function blockAt(T,i){const t=String(T||'');const H=[...t.matchAll(/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b[^\n]*|\**\s*\d+[.)]\s+(?:LINK\b)?[^\n]*|#{1,4}\s[^\n]*|UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES[^\n]*|CHALLENGER.{0,2}S\s+UNSUPPORTED[^\n]*)$/gmi)].map(m=>m.index);
  let a=0,b=t.length;for(const h of H){if(h<=i)a=h;else{b=h;break;}}
  const linkHead=/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b|\**\s*\d+[.)]\s)/i.test(t.slice(a,a+40));
  if(!linkHead){const pa=t.lastIndexOf('\n\n',i);const pb=t.indexOf('\n\n',i);const A=Math.max(a,pa<0?0:pa),B=Math.min(b,pb<0?t.length:pb);
   let blk=t.slice(A,B);const opens=/^[\s>*_#-]*(?:\d+[.)]\s*)?[*_]*\s*$/.test(t.slice(A,i));if((opens||(!refsIn(blk).length&&!apocIn(blk).length))&&A>0){const pp=t.lastIndexOf('\n\n',A-1);blk=t.slice(Math.max(a,pp<0?0:pp),B);}return blk;}
  return t.slice(a,b);}
 // the source words an [L2] tag names
 const W_IT=/(?:^|[^*\w])[*_]([^*_\n]{2,60}?)[*_](?![*\w])/g;
 function tagWords(seg){const s=String(seg||'');const out=[];const seen=new Set();const add=(w,kind)=>{const k=kind+'|'+String(w).toLowerCase();if(seen.has(k))return;seen.add(k);out.push({w:String(w),kind});};
  for(const m of s.matchAll(/\b([GH])0*(\d{1,5})\b/g))add(m[1]+m[2],'strongs');
  for(const m of s.matchAll(/[Ͱ-Ͽἀ-῿]+/g))add(m[0],'greek');
  for(const m of s.matchAll(/[֐-׿\/]+/g)){const x=m[0].replace(/\//g,'');if(x)add(x,'hebrew');}
  const latin=w=>{const x=String(w).replace(/^[\s"“”'‘’(]+|[\s"“”'‘’),.;:!?]+$/g,'');if(!x||/\d/.test(x)||isGrk(x)||isHeb(x))return;
   for(const p of x.split(/\s+/)){const q=p.replace(/^[^A-Za-zÀ-ɏḀ-ỿʼʻ']+|[^A-Za-zÀ-ɏḀ-ỿʼʻ']+$/g,'');if(q.length<2||STOP.has(strip(q).toLowerCase()))continue;add(q,'latin');}};
  for(const m of s.matchAll(W_IT))latin(m[1]);
  // a run of lowercase words written just before "(meaning)": the words back to punctuation, a capital or an English word
  const other=out.length>0||W_IT.test(s);W_IT.lastIndex=0;
  for(const m of s.matchAll(/\(\s*["“'‘]?[a-z]/g)){if(/[*_]\s*$/.test(s.slice(0,m.index)))continue;const before=s.slice(0,m.index).replace(/[*_]+/g,'');const toks=before.split(/(\s+)/);const run=[];
   for(let k=toks.length-1;k>=0;k--){const tk=toks[k];if(/^\s+$/.test(tk)||tk==='')continue;const c=tk.replace(/["“”'‘’]/g,'');
    if(/[,;:.!?)\]]$/.test(c)&&run.length)break;const q=c.replace(/[,;:.!?)\]]+$/,'');if(!q||/^[A-Z]/.test(q)||/\d/.test(q)||isGrk(q)||isHeb(q)||STOP.has(strip(q).toLowerCase())||!/^[a-zà-ɏḀ-ỿʼʻ'’-]+$/.test(q))break;run.unshift(q);if(/[,;:.!?]$/.test(c))break;}
   if(run.length&&(!other||run.some(q=>/[à-ɏḀ-ỿʼʻ']/.test(q))))latin(run.join(' '));}
  // words with marks of a transliteration (macrons, accents), anywhere in the tag
  for(const m of s.matchAll(/(?<![\wÀ-ɏḀ-ỿ])[a-z]*[āēīōūâêîôûáéíóúàèìòùʼʻ][a-zà-ɏḀ-ỿʼʻ']*/g))latin(m[0]);
  // a Hebrew word written with its prefix and a hyphen (ha-almah)
  for(const m of s.matchAll(/(?<![\w-])(?:ha|he|ve|va|be|ba|le|la|ke|ka|mi|me|she|u)-[a-zà-ɏḀ-ỿʼʻ']{3,20}(?![\w-])/g))latin(m[0]);
  // a single quoted lowercase word, when nothing else was found ('Luke 3:23's "enomizeto"')
  if(!out.length)for(const m of s.matchAll(/["“]([a-zà-ɏḀ-ỿʼʻ'-]{3,24})["”]/g))latin(m[1]);
  return out;}
 // every [L2] tag of the rounds ([[side, round, text], ...]), with its words and the verses its block cites
 function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   let wds=tagWords(seg);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));const w2=tagWords(seg2);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);const own=refsIn(seg);const __ls=t.lastIndexOf('\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\n',i));const __line=t.slice(__ls,__le);const __press=/--\s*MEANS\s*:/.test(t.slice(__ls,i)); /* s429 F4: a press line's [L2] is read against that line's verses */const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
   out.push({side,round,at:i,seg:seg.replace(/\s+/g,' ').trim().slice(0,300),words:wds,verses:vs,apoc:ap});}}
  return out;}
 // ---------- matching ----------
 // OW: original_words rows {book,chapter,verse,strongs_number,transliteration,original_script}; LEX: lexicon rows; READ: set of verse keys read
 function index(OW,LEX){const V={};for(const r of OW||[]){if(!r||!r.book)continue;const k=vkey(r.book,r.chapter,r.verse);(V[k]=V[k]||[]).push(r);}
  const X={};for(const r of LEX||[])if(r&&r.strongs_number)X[r.strongs_number]=r;return {V,X};}
 const numOf=s=>{const m=String(s||'').match(/^([GH])0*(\d+)/);return m?m[1]+m[2]:null;};
 function matchWord(wd,cands,IX){const nums=new Set(cands.map(r=>numOf(r.strongs_number)).filter(Boolean));
  if(wd.kind==='strongs')return nums.has(wd.w)?{ok:true,num:wd.w,route:'number'}:{ok:false};
  if(wd.kind==='greek'){const g=norm(grk2lat(wd.w));for(const r of cands){if(!/^G/.test(r.strongs_number||''))continue;if(norm(beta2lat(r.transliteration))===g)return {ok:true,num:numOf(r.strongs_number),route:'inflected'};
    const L=IX.X[numOf(r.strongs_number)];if(L&&norm(grk2lat(L.original_script))===g)return {ok:true,num:numOf(r.strongs_number),route:'dictionary'};}
   for(const r of cands){if(!/^G/.test(r.strongs_number||''))continue;const f=norm(beta2lat(r.transliteration));if(g.length>=5&&f.length>=5&&ed1(g,f))return {ok:true,num:numOf(r.strongs_number),route:'inflected (one letter)'};}return {ok:false};}
  if(wd.kind==='hebrew'){const h=hebScript(wd.w);if(h.length<2)return {ok:false};for(const r of cands){if(!/^H/.test(r.strongs_number||''))continue;const segs=String(r.original_script||'').split('/').map(hebScript).filter(Boolean);
    if(segs.includes(h)||segs.join('')===h)return {ok:true,num:numOf(r.strongs_number),route:'inflected'};const L=IX.X[numOf(r.strongs_number)];if(L&&hebScript(L.original_script)===h)return {ok:true,num:numOf(r.strongs_number),route:'dictionary'};}return {ok:false};}
  const V=variants(wd.w);if(!V.length)return {ok:false};
  const forms=[];for(const r of cands){const n=numOf(r.strongs_number);if(!n)continue;const L=IX.X[n];
   if(L)for(const x of variants(L.transliteration))forms.push({f:x,n,route:'dictionary',heb:n[0]==='H'});
   const it=n[0]==='G'?beta2lat(r.transliteration):String(r.transliteration||'');for(const x of variants(it))forms.push({f:x,n,route:'inflected',heb:n[0]==='H'});}
  for(const v of V)for(const f of forms)if(f.f===v)return {ok:true,num:f.n,route:f.route};
  for(const v of V)for(const f of forms)if(f.heb&&skel(v).length>=3&&skel(v)===skel(f.f))return {ok:true,num:f.n,route:f.route+' (consonants)'};
  for(const v of V)for(const f of forms)if(v.length>=6&&f.f.length>=6&&ed1(v,f.f))return {ok:true,num:f.n,route:f.route+' (one letter)'};
  return {ok:false};}
 function check(TG,OW,LEX,READ){const IX=index(OW,LEX);const RD=new Set(READ||Object.keys(IX.V));
  return (TG||[]).map(t=>{const vs=t.verses||[];const read=vs.filter(k=>RD.has(k));const cands=[].concat(...read.map(k=>IX.V[k]||[]));
   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null};});
   let status,why;
   if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length&&t.apoc&&t.apoc.length){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+'): the original-words table holds the 66 books only';}
   else if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length){status='NOT COUNTED';why='its block cites no verse';}
   else if(ws.every(w=>w.ok)){status='COUNTED';why=ws.map(w=>w.w+' = '+w.num).join(', ');}
   else if(read.length<vs.length){status='UNVERIFIABLE';why='the words of '+vs.filter(k=>!RD.has(k)).join(', ')+' were not read this run';}
   else if(t.apoc&&t.apoc.length&&!ws.some(w=>w.ok)){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+')';}
   else{status='NOT COUNTED';why='not in the cited verse: '+ws.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+vs.join(', ')+')';}
   return {...t,words:ws,status,why};});}
 // ---------- counts ----------
  function countClaims(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/(?<![:\d]\s?)\b(\d{1,4})\s+(verses?|tokens?|rows?|times|occurrences?|instances?)\b/gi)){if(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s*$/.test(t.slice(Math.max(0,m.index-20),m.index)))continue;const pre=t.slice(Math.max(0,m.index-90),m.index);
   const after=t.slice(m.index,m.index+80);if(!/\[L2\]|\b[GH]\d{1,5}\b|[Ͱ-Ͽἀ-῿֐-׿]|[*_][a-zà-ɏḀ-ỿ]/.test(pre+after))continue;
   const num=(pre.match(/\b([GH])0*(\d{1,5})\b(?![\s\S]*\b[GH]\d)/)||[]);let subj=num.length?num[1]+num[2]:null,word=null;
   if(!subj){const ws=tagWords(pre.slice(-70));const w=ws.filter(x=>x.kind!=='strongs').pop();if(w)word=w;}
   if(!subj&&!word)continue;const u=m[2].toLowerCase();
   out.push({side,round,at:m.index,n:+m[1],unit:/^verse/.test(u)?'verses':/^token/.test(u)?'tokens':null,said:m[0],subj,word,text:t.slice(Math.max(0,m.index-60),m.index+m[0].length).replace(/\s+/g,' ').trim()});}}
  return out;}
 // CR: original_words rows {book,chapter,verse,strongs_number} for the numbers claimed (all their occurrences); CAPPED: true when the read hit its row cap
 function countCheck(CL,CR,capped,TGres){const by={};if(CR&&!Array.isArray(CR)){for(const [n,x] of Object.entries(CR))by[n]={v:{size:x.verses},t:x.tokens};}else for(const r of CR||[]){const n=numOf(r.strongs_number);if(!n)continue;(by[n]=by[n]||{v:new Set(),t:0});by[n].t++;by[n].v.add(vkey(r.book,r.chapter,r.verse));}
  const wordNum={};for(const t of TGres||[])for(const w of t.words||[])if(w.ok&&w.num)wordNum[norm(w.w)]=w.num;
  return (CL||[]).map(c=>{const n=c.subj||(c.word?wordNum[norm(c.word.w)]||null:null);if(!n)return {...c,num:null,status:'UNVERIFIABLE',why:'the word could not be matched to a Strong\'s number'};
   const b=by[n];if(!b)return {...c,num:n,status:capped?'UNVERIFIABLE':'DIFFERS FROM THE RECORD (0 verses, 0 tokens)',why:capped?'the count was not read':null};
   if(capped&&b.t>=1000)return {...c,num:n,status:'UNVERIFIABLE',why:'over the row cap'};
   const nv=b.v.size,nt=b.t;const ok=c.unit==='verses'?c.n===nv:c.unit==='tokens'?c.n===nt:(c.n===nv||c.n===nt);
   return {...c,num:n,verses:nv,tokens:nt,status:ok?(c.unit?'MATCHES THE RECORD':'MATCHES THE RECORD (unit not named)'):'DIFFERS FROM THE RECORD ('+nv+' verses, '+nt+' tokens)'+(c.unit?'':' (unit not named)')};});}
 // ---------- requests (the read plans) ----------
 // the original_words rows of the verses keys (66 books; others return none), one request per batch of PER verses (each within URL_MAX
 // characters and well under the read's 1,000-row limit): every verse is read, none is left off for a cap.
 function wordsUrls(keys,o){const PER=(o&&o.per)||20;const URL_MAX=7000;const B=SB+'original_words?select=book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph&order=book,chapter,verse,word_position&limit=1000';
  const ks=[...new Set((keys||[]).filter(k=>/^(.+) (\d+):(\d+)$/.test(String(k))))];const out=[];
  const mk=b=>{const G=new Map();for(const k of b){const m=String(k).match(/^(.+) (\d+):(\d+)$/);const g=m[1]+'|'+m[2];if(!G.has(g))G.set(g,[]);G.get(g).push(+m[3]);}
   const conds=[...G].map(([g,vs])=>{const [bk,c]=g.split('|');return 'and(book.eq."'+bk+'",chapter.eq.'+c+',verse.in.('+[...new Set(vs)].sort((x,y)=>x-y).join(',')+'))';});return B+'&or='+encodeURIComponent('('+conds.join(',')+')');};
  let cur=[];for(const k of ks){const t=cur.concat([k]);if(cur.length&&(t.length>PER||mk(t).length>URL_MAX)){out.push({url:mk(cur),keys:cur});cur=[k];}else cur=t;}if(cur.length)out.push({url:mk(cur),keys:cur});return out;}
 // kept for one-request callers: the first batch
 function wordsUrl(keys,o){const U=wordsUrls(keys,o);return {url:U.length?U[0].url:SB+'original_words?select=book&id=eq.-1',read:U.length?U[0].keys:[],off:[].concat(...U.slice(1).map(x=>x.keys))};}
 // the lexicon rows of the Strong's numbers of the words read, in batches of 250 numbers; o.sheet: leave out the function words (sheet only), gloss read
 function lexUrls(OW,o){const sheet=!!(o&&o.sheet);const byN={};for(const r of OW||[]){const n=numOf(r&&r.strongs_number);if(!n||/^H9\d{3}$/.test(n)||n==='G0')continue;(byN[n]=byN[n]||[]).push(r);}
  const S=Object.keys(byN).filter(n=>!sheet||!byN[n].every(isFunc));const cols='strongs_number,original_script,transliteration'+(sheet?',anchor_gloss':'');const out=[];
  for(let i=0;i<S.length;i+=250)out.push(SB+'lexicon_words?select='+cols+'&limit=1000&strongs_number=in.('+S.slice(i,i+250).join(',')+')');return out;}
 function lexUrl(OW){const U=lexUrls(OW,{sheet:true});return U.length?U[0]:SB+'lexicon_words?select=strongs_number&strongs_number=in.(NONE)';}
 function countsUrl(nums){const S=[...new Set((nums||[]).filter(Boolean))].slice(0,40);return SB+'original_words?select=book,chapter,verse,strongs_number&limit=1000&strongs_number=in.('+(S.length?S.join(','):'NONE')+')';}
 // ---------- the [L2] sheet (both debaters, rounds 2 to 4; not the judges) ----------
 // one row per distinct Strong's number in the verses read (pressed verses first, then the verses cited, in order of first citation), the
 // function words left out: the dictionary form, the number and the lexicon gloss quoted whole; capped at CAPC characters, every number left off listed.
 function sheet(OW,LEX,P){const IX=index(OW,LEX);const order=(P&&(P.l2_req||P.l2_read))||[];const seen=new Set();const rows=[],left=[],nolex=[];let ch=0,fw=0;const CAPC=26000;
  const byN={};for(const r of OW||[]){const n=numOf(r&&r.strongs_number);if(n)(byN[n]=byN[n]||[]).push(r);}
  const got=new Set(Object.keys(IX.V));const unread=order.filter(k=>!got.has(k));
  for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n))continue;seen.add(n);if(byN[n].every(isFunc)){fw++;continue;}const L=IX.X[n];if(!L){if(!/^H9\d{3}$/.test(n)&&n!=='G0')nolex.push(n);continue;}
   const line=n+' '+String(L.original_script||'').trim()+' '+String(L.transliteration||'').trim()+': '+String(L.anchor_gloss||'');if(ch+line.length>CAPC){left.push(n);continue;}rows.push(line);ch+=line.length;}
  if(!order.length)return '';
  const tail=[].concat(unread.length?['verses read with no rows (Apocrypha, no such verse, or the read failed): '+unread.join(', ')]:[],left.length?['numbers over the sheet cap of '+CAPC+' characters: '+left.join(', ')]:[],nolex.length?['numbers the lexicon does not hold: '+nolex.join(', ')]:[]);
  return '[L2] SHEET -- read by the system from the record\'s original-words table (original_words: the Greek of the TR, Scrivener 1894; the Hebrew of the Leningrad codex) and its lexicon (lexicon_words), for every verse cited so far in this debate (the verses pressed under PRESSED WITH first), served alike to both sides: one row per Strong\'s number, with the dictionary form and the lexicon gloss quoted whole; '+fw+' function words (articles, conjunctions, prepositions, particles, pronouns) are left out. An [L2] counts only when its word is in a verse its own block cites: name the word by its dictionary form, its transliteration or its Strong\'s number, with its meaning. A count of occurrences names its unit (verses or tokens).\n'+(rows.length?rows.join('\n'):'(no original-words row could be read this round)')+(tail.length?'\nLEFT OFF THE [L2] SHEET: '+tail.join('; ')+'.':'');}
 // the verse order of the sheet: the verses under PRESSED WITH first, then every verse cited, in order of first citation
 function sheetPlan(texts,keys){const pw=[];for(const t of texts||[]){const s=String(t||'');for(const m of s.matchAll(/PRESSED WITH\s*:/gi)){let seg=s.slice(m.index);const b=seg.search(/\n\s*\n|\n\s*\**\s*\d+[.)]\s/);if(b>=0)seg=seg.slice(0,b);for(const k of refsIn(seg))if(!pw.includes(k))pw.push(k);}}
  const order=pw.concat((keys||[]).filter(k=>!pw.includes(k)));return {l2_req:order,l2_urls:wordsUrls(order).map(x=>x.url)};}
 return {tags,tagWords,check,countClaims,countCheck,wordsUrl,wordsUrls,lexUrl,lexUrls,isFunc,countsUrl,sheet,sheetPlan,norm,variants,beta2lat,grk2lat,blockAt,refsIn,apocIn,numOf,index,matchWord};})();

function kkjvRows(){try{const g=(typeof $==='function')?$:null;return g?g('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book):[];}catch(e){return [];}}
function kkjvFold(s){return String(s==null?'':s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
// margin notes, both forms: [key: or, ...] and (key: Gr. ...) (2172 rule 1)
function kkjvNoMargin(s){return String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');}
function kkjvUnGloss(s,cited){const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=kkjvFold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});}
// text after a trailing ellipsis that is not in the verse is an engine cut and is dropped (2172 rule 2)
function kkjvSegs(q,cited){let p=String(kkjvNoMargin(q)).split(/\.\.\.|…/);const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';
 if(p.length>1){const last=kkjvFold(kkjvUnGloss(p[p.length-1],cited));if(last&&!cv.includes(' '+last+' '))p=p.slice(0,-1);}return p.map(x=>kkjvFold(kkjvUnGloss(x,cited))).filter(Boolean);}
// a quote is a verse quote only when at least half its words are in the verse; otherwise it quotes something else, such as a round (2172 rule 3)
function kkjvIsVerseQuote(q,cited){const vw=new Set(kkjvFold(kkjvNoMargin(cited)).split(' '));const qw=kkjvSegs(q,cited).join(' ').split(' ').filter(Boolean);return qw.length>0&&qw.filter(w=>vw.has(w)).length/qw.length>=0.5;}
function kkjvStands(q,cited){if(!cited)return false;const segs=kkjvSegs(q,cited);if(!segs.length)return false;
 const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;}

// pkgECL (W3 Wall 2547, Eric 2026-11-06): the layer check on a judge's break line (E-COL, ENFORCED; Commitment 13). A FORCED line, or a LINK BROKEN
// line that does not rest on an unanswered press, gives its grounds in layers: a counted [L1] (a verse quoted with its reference under an [L1] tag,
// standing in the KJV verse as the record serves it, "Cited Verses"), and, when the ground turns on a word's meaning, a counted [L2] (the word stands
// in a verse the line cites: the [L2] tag check, L2C, on "L2 Words" and "L2 Lexicon"). The ANSWER and FAILS quotes are the answer's words, not grounds.
// A verse or word the run did not read is UNVERIFIABLE and raises nothing.
const ECL=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
 const PAIR=new RegExp(REF.source+'[^"“”\\n\\[]{0,40}?["“]([^"“”]{6,400})["”]','g');
 const MW=/\b(?:means|meaning|meant|sense|signif(?:y|ies|ied|ying)|denot(?:e|es|ed|ing)|the word|lexic\w*|connot\w*|defin\w*|translat\w*|render(?:s|ed|ing)?|Greek|Hebrew)\b/i;
 const UNANS=/\b(?:unanswered|not answered|no answer|never answered|not named)\b|\(\s*Commitment\s+5\s*\)/i;
 const RANK={COUNTED:3,UNVERIFIABLE:2,'NOT COUNTED':1,NONE:0};
 // the judge's own grounds: the line without its ANSWER and FAILS quotes (a FORCED line's GROUND follows its FAILS quote)
 const ground=l=>String(l||'').replace(/\\+"/g,'"').replace(/--\s*ANSWER\s*\[[^\]]*\]\s*:[\s\S]*?(?=--\s*GROUND\s*:|$)/i,' ');
 function l1(g,rows){const idx={};for(const r of rows||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;
  const out=[];const T=[...g.matchAll(/\[L([1-4])\]/g)];
  T.forEach((m,k)=>{if(m[1]!=='1')return;const a=m.index+4,b=k+1<T.length?T[k+1].index:g.length,pa=k>0?T[k-1].index+4:0;
   const before=g.slice(Math.max(pa,m.index-600),m.index);const bs=[...before.matchAll(PAIR)];let p=bs.length?bs[bs.length-1]:null;
   if(p&&before.slice(p.index+p[0].length).replace(/[\s;,.:)]+/g,'').length)p=null; /* the form <reference> "<words>" [L1]: the quote closes just before the tag */
   if(!p){const as=[...g.slice(a,Math.min(b,a+700)).matchAll(PAIR)];p=as.length&&as[0].index<=6?as[0]:null;} /* the form [L1] <reference> "<words>" */
   if(!p){out.push({status:'NOT COUNTED',why:'an [L1] tag with no verse quoted beside its reference'});return;}
   const bk=p[1],ch=+p[2],v1=+p[3],v2=+(p[4]||p[3]),q=p[5];const ref=bk+' '+ch+':'+v1+(v2!==v1?'-'+v2:'');const parts=[];
   for(let v=v1;v<=v2;v++){const t=idx[bk+' '+ch+':'+v];if(t)parts.push(t);}
   if(parts.length!==v2-v1+1){out.push({status:'UNVERIFIABLE',ref,why:ref+' was not read this run'});return;}
   const kjv=parts.join(' ');out.push(kkjvIsVerseQuote(q,kjv)&&kkjvStands(q,kjv)?{status:'COUNTED',ref,why:ref+' "'+q.slice(0,80)+'"'}:{status:'NOT COUNTED',ref,why:ref+' "'+q.slice(0,80)+'" does not stand in the KJV verse'});});
  return out;}
 function l2(g,ow,lex){const TG=L2C.tags([['JUDGE','J',g]]);if(!TG.length)return [];
  return L2C.check(TG,ow||[],lex||[]).filter(t=>t.status!=='IGNORED').map(t=>({status:t.status,why:String(t.seg||'').slice(0,60)+': '+t.status+' ('+t.why+')'}));}
 function check(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const forced=/^\s*FORCED\b/i.test(L);ctx=ctx||{};
  if(!forced&&!/LINK BROKEN/.test(L))return {applies:false,faults:[],why:'not a FORCED or LINK BROKEN line'};
  if(!forced&&UNANS.test(L))return {applies:false,faults:[],why:'rests on an unanswered press (ruling 392), not on meaning'};
  const g=ground(L);const a=l1(g,ctx.rows),b=l2(g,ctx.ow,ctx.lex);const best=xs=>xs.reduce((m,x)=>RANK[x.status]>RANK[m]?x.status:m,'NONE');const s1=best(a),s2=best(b);
  const meaning=/\[L2\]/.test(g)||MW.test(g.replace(/\bMEANS\s*(?:\[[^\]]*\])?\s*:/g,' '));const faults=[];
  if(s1==='NONE')faults.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(s1==='NOT COUNTED')faults.push('no counted [L1]: '+a.map(x=>x.why).join('; '));
  if(meaning&&s2==='NONE')faults.push('the ground turns on a word\'s meaning and carries no [L2]');else if(meaning&&s2==='NOT COUNTED')faults.push('the ground turns on a word\'s meaning and no [L2] is counted: '+b.map(x=>x.why).join('; '));
  return {applies:true,forced,l1:s1,l2:s2,meaning,faults,why:faults.length?faults.join(' | '):'layers counted: [L1] '+s1+(meaning?'; [L2] '+s2:'')};}
 function ctxLive(){const g=n=>{try{return $(n).isExecuted?$(n).all().map(i=>i.json):[];}catch(e){return [];}};
  return {rows:g('Cited Verses').filter(r=>r&&r.book),ow:g('L2 Words').filter(r=>r&&r.book),lex:g('L2 Lexicon').filter(r=>r&&r.strongs_number)};}
 return {check,ground,ctxLive};})();
// pkgUND (W3 Wall ruling after 2566; Eric 2026-11-06 "the results seem to have gotten worse"): two ENFORCED send-back items, both side-neutral.
// (1) E-UNG, missing collision grades: a defender link that a premise of the list closing [DR2] presses takes a graded "D<i> vs C<j>" line
//     (DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED, or WITHDRAWN). A "D<i>: STANDS" line alone does not grade a pressed link.
// (2) E-HOLD on an UNDERDETERMINED line the enforcer says is BROKEN: sent back ENFORCED. Cured by CHANGE TO RETRACTED, a regrade (a BROKEN
//     regrade with its counted layers, pkgECL), or CHANGE TO the UNDERDETERMINED line with a counted [L1] (the verse words both readings rest on)
//     and what the record leaves open. A KEEP does not cure it. The enforcer never overrules the judge: the judge may keep UNDERDETERMINED by
//     giving its grounds.
// pkgUNL (33149, W1's own pkgUND fault): a premise of the [DR2] list presses the link its own "LINK <n>:" label names, not the link of its
//  position (33149: premise 1 is LINK 6, premise 5 is LINK 3). A premise with no LINK label names no link and raises nothing. The open-point test
//  also reads "leaves that role disputed", "dispute its implications", "unsettled" (33149 chatgpt, two CHANGE TO lines refused on wording).
// Uses ECL (pkgECL, same library) for the [L1] count: a verse the run did not read is UNVERIFIABLE and counts as given (raises nothing).
const UND=(()=>{
 const rounds=ptext=>{const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
  const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;out[x.k]=t.slice(x.e,end);});return out;};
 // the premises of the list that closes [DR2] (the list against the defender); each presses the defender link its "LINK <n>:" label names (pkgUNL)
 function pressed(ptext){const t=rounds(ptext).DR2||'';let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  const by=new Map();its.forEach((x,k)=>{const m=x.match(/^\s*\**\s*(?:(\d+)[.)]\s*\**\s*)?LINK\s+(\d+|none)\s*\**\s*:/i);if(!m||/none/i.test(m[2]))return;const n=+m[2],p=m[1]?+m[1]:k+1;
   const e=by.get(n)||{n,premises:[],head:x.replace(/\s+/g,' ').trim().slice(0,160)};e.premises.push(p);by.set(n,e);});
  return [...by.values()].sort((a,b)=>a.n-b.n).map(e=>({n:e.n,premises:e.premises,head:e.head}));}
 const GR=/^[\s>*_-]*D(\d+)\s+vs\.?\s+C(\d+)\b[^\n]{0,200}?:\s*\**\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)/gmi;
 const WD=/^[\s>*_-]*D(\d+)\s*:\s*\**\s*WITHDRAWN\b/gmi;
 function graded(text){const g=new Map();const T=String(text||'');for(const m of T.matchAll(GR))g.set(+m[1],(g.get(+m[1])||[]).concat(m[3].toUpperCase()));for(const m of T.matchAll(WD))g.set(+m[1],['WITHDRAWN']);return g;}
 const ownLine=(text,n)=>{const l=String(text||'').split('\n').find(x=>new RegExp('^[\\s>*_-]*D'+n+'\\s*:').test(x));return l?l.trim():'';};
 // the pressed defender links this judge left without a graded collision line
 function missing(ptext,text){const P=pressed(ptext);if(!P.length)return [];const g=graded(text);return P.filter(p=>!g.has(p.n)).map(p=>({n:p.n,ps:p.premises.join(', '),premise:p.head,line:ownLine(text,p.n)}));}
 const OPEN=/\b(?:leaves?\s+(?:\w+\s+){0,3}(?:open|disputed|undecided|unsettled|unresolved|contested|in\s+dispute)|leaves?\s+(?:\w+\s+){1,4}to\s+(?:the\s+)?other|disputed?|disputes|in\s+dispute|unsettled|unresolved|contested|left\s+open|open\s+(?:question|point|whether)|(?:does|do|did)\s+not\s+(?:decide|settle|determine|say|state|show|fix)|neither\s+(?:reading|side|one)|both\s+readings|either\s+reading|consistent\s+with\s+both|agrees?\s+with\s+both|fits?\s+both|undecided|silent\s+(?:on|about|as\s+to)|not\s+stated)\b/i;
 // an UNDERDETERMINED line that gives its grounds: a counted [L1] and what the record leaves open
 function undOk(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const f=[];
  const c=ECL.check('FORCED: X -- GROUND: '+L,ctx);if(c.l1==='NONE')f.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(c.l1==='NOT COUNTED')f.push('no counted [L1] (the quoted words do not stand in the verse named)');
  if(!OPEN.test(L))f.push('the line does not state what the record leaves open (for example: "the record leaves open whether ...", "both readings agree with ...")');
  return {ok:!f.length,l1:c.l1,faults:f,why:f.length?f.join(' | '):'[L1] '+c.l1+'; states what the record leaves open'};}
 const isUndBroken=x=>x&&x.rule==='E-HOLD'&&/UNDERDETERMINED/.test(String(x.flagged_line||x.line||''))&&/\(right:\s*BROKEN\)/i.test(String(x.cure_reason||x.reason||''));
 const CURE_UNG=n=>'MISSING COLLISION GRADE (E-UNG, ENFORCED, pkgUND): the challenger presses D'+n+' in the list that closes [DR2], and your COLLISION POINTS has no graded D'+n+' vs C<j> line. A "D'+n+': STANDS" line does not grade a pressed link. CHANGE TO the graded line: D'+n+' vs C<j> (<verse>): DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED -- <one clause of why> -- GROUND: <a BROKEN grade in its layers (Commitment 13); an UNDERDETERMINED grade with [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open>. Any grade may be chosen; the grade is yours. A KEEP does not cure this item.';
 const CURE_UND='UNDERDETERMINED GIVES ITS GROUNDS (E-HOLD on UNDERDETERMINED, ENFORCED, pkgUND): the enforcer reads this line as BROKEN; the decision stays yours. Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13, or a STANDS line that quotes the answer\'s positive fit, [CR<n>] "<the answer\'s words>", with [L1] <reference> "<KJV words>"), or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line with, after GROUND:, [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open (for example: "the record leaves open whether ..."). A KEEP does not cure this item.';
 const FIT=/\[(?:CR|DR)[1-4]\][^"“\n]{0,60}["“][^"”]{6,}["”]|\bANSWER\b[^"“\n]{0,40}["“][^"”]{6,}["”]/;
 const GRADED1=n=>new RegExp('\\bD'+n+'\\s+vs\\.?\\s+C\\d+\\b[^\\n]{0,200}?:\\s*\\**\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)','i');
 // the cure of one item from the judge's send-back answer a = {ans:'KEEP'|'CHANGE'|'NO ANSWER', to}
 function cure(it,a,ctx){const res=(c,why)=>({status:c?'CURED':'UNCURED',why});a=a||{ans:'NO ANSWER'};const to=String(a.to||'').replace(/\\+"/g,'"').trim();
  if(a.ans!=='CHANGE')return res(false,(a.ans==='KEEP'?'a KEEP does not cure this item':'no answer')+' (pkgUND)');
  if(/^\s*RETRACTED\b/i.test(to))return res(it.rule!=='E-UNG','CHANGE TO RETRACTED'+(it.rule==='E-UNG'?' does not grade a pressed link':''));
  if(it.rule==='E-UNG'){const n=+(String(it.item||'').match(/\bD(\d+)\b/)||[])[1];const m=to.match(GRADED1(n));if(!m)return res(false,'the CHANGE TO has no graded D'+n+' vs C<j> line');
   const gr=m[1].toUpperCase();if(/BROKEN/.test(gr)){const c=ECL.check(to,ctx);return res(!c.faults.length,'graded '+gr+(c.faults.length?'; the layer check fails: '+c.why:'; '+c.why));}
   if(gr==='UNDERDETERMINED'){const u=undOk(to,ctx);return res(u.ok,'graded UNDERDETERMINED; '+u.why);}return res(true,'graded '+gr);}
  // E-HOLD on an UNDERDETERMINED line
  if(/\bUNDERDETERMINED\b/.test(to)){const u=undOk(to,ctx);return res(u.ok,'kept UNDERDETERMINED; '+u.why);}
  if(/\bLINK BROKEN\b/.test(to)||/^\s*FORCED\b/i.test(to)){const c=ECL.check(to,ctx);return res(!c.faults.length,'regraded BROKEN; '+c.why);}
  if(/\b(?:STANDS|MEETS)\b/.test(to)){const c=ECL.check('FORCED: X -- GROUND: '+to,ctx);const fit=FIT.test(to); /* W3: a STANDS or MEETS regrade quotes the answer's positive fit with a counted [L1] */
   const f=[];if(c.l1==='NONE')f.push('no [L1]');else if(c.l1==='NOT COUNTED')f.push('no counted [L1]');if(!fit)f.push('no quote of the answer\'s fit (the answer\'s own words with its round, e.g. [CR3] "<words>")');
   return res(!f.length,'regraded '+(/\bMEETS\b/.test(to)?'MEETS':'STANDS')+(f.length?'; '+f.join(' | '):'; [L1] '+c.l1+', quotes the answer\'s fit'));}
  return res(false,'the CHANGE TO neither regrades the line, retracts it, nor keeps UNDERDETERMINED with its grounds');}
 return {rounds,pressed,graded,missing,undOk,isUndBroken,cure,CURE_UNG,CURE_UND};})();


// pkgSBX: the shared line reader (reader/readLines.cjs sha 3c0bdf1f9cd7fb3f), as in the library nodes
const __RL=(function(){const module={exports:{}};const exports=module.exports;
// readLines (W3 line_form_spec.md, phase 1: shadow only, no caller uses it yet).
// readLine(line) -> {form, f:{...fields}, norm} or {form:null, why}. readLines(text) -> rows, one per non-empty line, with its line number.
// Grade words are upper-case and case-sensitive (spec 0.6); labels (vs, GROUND, Commitment, MEANS, ANSWER, FAILS) are case-insensitive.
const SEP='(?:--|\\u2014|\\u2013)';                       // spec 0.5: "--", em dash, en dash
const PAIR='(D\\d+)\\s+[vV][sS]\\.?\\s+(C\\d+)';            // spec 1: D<i> vs C<j>, "vs." allowed
const RND='\\[{0,2}\\s*((?:CR|DR)[1-4]|(?:Defender|Challenger)\\s*R(?:ound)?\\s*[1-4])\\s*\\]{0,2}'; // W3 spec 8.2: [Defender Rn] = CRn, [Challenger Rn] = DRn
const rnd=x=>{const u=String(x).toUpperCase().replace(/\s+/g,'');const w=u.match(/^(DEFENDER|CHALLENGER)R(?:OUND)?(\d)$/);return w?(w[1]==='DEFENDER'?'CR':'DR')+w[2]:u;};        // [CR3], CR3, [[CR3]] (KF_LINE accepts the double bracket)
const TAG='\\(\\s*[Cc]ommitment\\s+(\\d+)\\s*\\)';
const COL_GRADE='DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN';
const RES_TAG='BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1';
const STAND='SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED|FORFEIT(?:ED)?';

// spec 0: normalisation of one stored text (unescape once) and of one line (markdown, list mark, spaces)
// spec 0.1 for a stored judgment: a panel row is a JSON object whose "reasoning" (or "reason") holds the judge's lines; a malformed object still
// gives its reasoning (as cureJText); otherwise the text is the single judge's, before its AUDIT lines.
function judgeText(raw){const s=String(raw==null?'':s0(raw));const a=s.indexOf('{');if(a>=0&&/"reason(?:ing)?"\s*:/.test(s)){try{const o=JSON.parse(s.slice(a,s.lastIndexOf('}')+1));if(o&&typeof o.reasoning==='string')return {text:o.reasoning,src:'json'};if(o&&typeof o.reason==='string')return {text:o.reason,src:'json'};}catch(e){}
  const m=s.slice(a).match(/"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}/);if(m)return {text:m[1].replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\\\\/g,'\\'),src:'json-malformed'};}
 const i=s.indexOf('\n\n[AUDIT');return {text:unescapeOnce(i<0?s:s.slice(0,i)),src:'plain'};}
function s0(x){return typeof x==='string'?x:JSON.stringify(x);}
function unescapeOnce(t){t=String(t==null?'':t);if(!/\n/.test(t)&&/\\n/.test(t))t=t.replace(/\\n/g,'\n');return t.replace(/\\"/g,'"');}
// W3 spec 7 G1: after the single unescape for the storage kind, every remaining backslash is an escaping artefact and is removed. norm() is the one
// normalisation every matcher (the gate's line matching included) calls.
function normLine(l){return String(l==null?'':l).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022>]|\d+[.)])\s*/,'').replace(/[ \t]+/g,' ').trim();}
// spec 1 QUOTE: opens with " “ or ', may hold other quotes, ends at the last closing mark before the next field separator or the end
function quoteAt(s,next){const m=s.match(/^\s*:?\s*(["\u201c'])/);if(!m)return null;const body=s.slice(m[0].length);
 // with a next-field label (ANSWER, FAILS) the quote runs to that field, so a quote holding " -- " or inner quotes is read whole (33021 gemini, 33020 grok)
 let sep=-1;if(next){const k=body.search(new RegExp('\\s'+SEP+'\\s*'+next+'\\b','i'));if(k>=0)sep=k;}if(sep<0)sep=body.search(new RegExp('\\s'+SEP+'\\s'));const seg=sep<0?body:body.slice(0,sep);const close=Math.max(seg.lastIndexOf('"'),seg.lastIndexOf('\u201d'),m[1]==="'"?seg.lastIndexOf("'"):-1);
 if(close<0)return null;return {q:seg.slice(0,close),rest:body.slice(close+1)};}

const P={};
P.FORCED=s=>{const m=s.match(new RegExp('^FORCED\\s*(?:'+TAG+')?\\s*:\\s*'+PAIR+'(?:\\s*'+TAG.replace('(\\d+)','(\\d+)')+')?\\s*'+SEP+'\\s*MEANS\\s*'+RND+'\\s*:?','i'));if(!m)return null; /* W3 spec 11: the tag may also follow the pair */
 const f={tag:m[1]?+m[1]:(m[4]?+m[4]:null),pair:m[2]+' vs '+m[3],meansRound:rnd(m[5])};let r=s.slice(m[0].length);let q=quoteAt(r,'ANSWER');if(!q)return {why:'FORCED: MEANS has no quotation',code:'FORCED_MEANS_HAS_NO_QUOTATION'};f.means=q.q;r=q.rest.replace(/^\s*\([^\n]*?\)/,'');
 let a=r.match(new RegExp('^\\s*'+SEP+'\\s*ANSWER\\s*'+RND+'\\s*:?','i'));if(!a)return {why:'FORCED: no ANSWER <round> after MEANS',code:'FORCED_NO_ANSWER_ROUND_AFTER_MEANS'};f.answerRound=rnd(a[1]);r=r.slice(a[0].length);q=quoteAt(r,'FAILS');if(!q)return {why:'FORCED: ANSWER has no quotation',code:'FORCED_ANSWER_HAS_NO_QUOTATION'};f.answer=q.q;r=q.rest.replace(/^\s*\([^\n]*?\)/,'');
 a=r.match(new RegExp('^\\s*'+SEP+'\\s*FAILS\\s*:?','i'));if(!a)return {why:'FORCED: no FAILS after ANSWER',code:'FORCED_NO_FAILS_AFTER_ANSWER'};r=r.slice(a[0].length);q=quoteAt(r);if(!q)return {why:'FORCED: FAILS has no quotation',code:'FORCED_FAILS_HAS_NO_QUOTATION'};f.fails=q.q;f.tail=q.rest.trim();
 f.breaks=f.meansRound.startsWith('CR')?'CHALLENGER':'DEFENDER';return f;};                     // KS: MEANS [CR] breaks the challenger
P.COLLISION=s=>{const m=s.match(new RegExp('^(RESTATED\\s*:\\s*)?'+PAIR+'\\b'));if(!m)return null;let r=s.slice(m[0].length);
 const f={restated:!!m[1],pair:m[2]+' vs '+m[3]};const v=r.match(/^\s*\(([^)\n]*)\)/);if(v){f.verse=v[1].trim();r=r.slice(v[0].length);}
 const c=r.match(/^[^:\n(]*:/);if(!c)return {why:'COLLISION: no ":" after the pair (CP2)',code:'COLLISION_NO_COLON_AFTER_THE_PAIR_CP2'};const pre=c[0].slice(0,-1).trim();if(pre)f.text=pre;r=r.slice(c[0].length);
 const g=r.match(new RegExp('^\\s*('+COL_GRADE+')\\b'));if(!g){const lc=r.match(new RegExp('^\\s*('+COL_GRADE+')\\b','i'));return lc?{why:'COLLISION: grade word not upper case (CP2)',code:'COLLISION_GRADE_NOT_UPPER_CASE_CP2'}:{why:'COLLISION: no grade word after ":"',code:'COLLISION_NO_GRADE_WORD'};}
 f.grade=g[1];r=r.slice(g[0].length);const t=r.match(new RegExp('^\\s*'+TAG));if(t){f.tag=+t[1];r=r.slice(t[0].length);}
 const gi=r.search(/\bGROUND\s*:/i);if(gi>=0){f.ground=r.slice(gi).replace(/^GROUND\s*:\s*/i,'').trim();r=r.slice(0,gi);}f.reason=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').replace(new RegExp('\\s*'+SEP+'\\s*$'),'').trim();return f;};
P['ANSWER CHECK']=s=>{const m=s.match(new RegExp('^ANSWER CHECK\\s*:\\s*(.+?)\\s*'+SEP+'\\s*(?:(\\[[^\\]\\n]*\\](?:\\s*(?:[,/;]|and)\\s*\\[[^\\]\\n]*\\])*)|((?:CR|DR)[1-4](?:\\s*[,/;]\\s*(?:CR|DR)[1-4])*))\\s*'+SEP+'\\s*','i'));if(!m)return /^ANSWER CHECK\s*:/i.test(s)?{why:'ANSWER CHECK: no <verse> -- <round> head',code:'ANSWER_CHECK_NO_VERSE_ROUND_HEAD'}:null;
 const rr=(m[2]!=null?m[2].replace(/\]\s*(?:[,/;]|and)\s*\[/gi,', ').replace(/^\[|\]$/g,''):m[3]).trim(); /* one bracket, or several ([CR3], [CR4]) */const rounds=[];for(const x of rr.split(/\s*[,/;]\s*|\s+and\s+/i)){let y=x.trim().toUpperCase();const w=y.match(/^(DEFENDER|CHALLENGER)\s*R(?:OUND)?\s*(\d)$/);if(w)y=(w[1]==='DEFENDER'?'CR':'DR')+w[2];if(/^(CR|DR)[1-4]$/.test(y))rounds.push(y);}
 const f={verse:m[1].trim(),roundRaw:rr,rounds};if(!rounds.length)f.roundNone=true;                                  let r=s.slice(m[0].length); // [ledger], [NONE] (33014): no round
 const fld=(k)=>{const a=r.match(new RegExp('^'+k+'\\s*:?','i'));if(!a)return undefined;r=r.slice(a[0].length);const q=quoteAt(r,k==='MEANS'?'ANSWER':'(?:MEETS|MISSES|FAILS|UNPROVEN)');let v;
  if(q){v=q.q;const t=q.rest.search(new RegExp('\\s'+SEP+'\\s'));f[k.toLowerCase()+'Note']=(t<0?q.rest:q.rest.slice(0,t)).trim()||undefined;r=t<0?'':q.rest.slice(t);}   // text after the quote, before the next field (33025 grok)
  else{const t=r.search(new RegExp('\\s'+SEP+'\\s'));v=(t<0?r:r.slice(0,t)).trim();f[k.toLowerCase()+'Bare']=true;r=t<0?'':r.slice(t);}            // MEANS: NONE (33025 chatgpt)
  r=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'');return v;};
 const mv=fld('MEANS');if(mv!==undefined)f.means=mv;const av=fld('ANSWER');if(av!==undefined)f.answer=av;
 const g=r.match(/^(MEETS|MISSES|FAILS|UNPROVEN)\b/);if(!g){const lc=r.match(/^(MEETS|MISSES|FAILS|UNPROVEN)\b/i);return lc?{why:'ANSWER CHECK: grade word not upper case',code:'ANSWER_CHECK_GRADE_NOT_UPPER_CASE'}:{why:'ANSWER CHECK: no MEETS, MISSES, FAILS or UNPROVEN after the answer',code:'ANSWER_CHECK_NO_GRADE_WORD'};}
 f.grade=g[1];f.gradeRead=g[1]==='FAILS'?'MISSES':g[1];r=r.slice(g[0].length);const t=r.match(new RegExp('^\\s*'+TAG));if(t){f.tag=+t[1];r=r.slice(t[0].length);}f.tail=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim();return f;};
P.KEYSTONE=s=>{const m=s.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|\u2013|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/);if(!m)return /^KEYSTONE\s*:/i.test(s)?{why:'KEYSTONE: no D<i> and STANDS, BROKEN or WITHDRAWN',code:'KEYSTONE_NO_D_I_AND_STANDS_BROKEN_OR_WITHDRAWN'}:null;
 const r=s.slice(m[0].length);return {link:m[1],grade:m[2],tag:m[3]?+m[3]:null,reason:r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim(),derived:/derived by the engine/i.test(r)};};
P.RESULT=s=>{const m=s.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)\b/);if(!m)return /^RESULT\s*:/i.test(s)?{why:'RESULT: no DEFENDER WINS, CHALLENGER WINS or UNDERDETERMINED',code:'RESULT_NO_DEFENDER_WINS_CHALLENGER_WINS_OR_UNDERDETERMINED'}:null;return {result:m[1],reason:s.slice(m[0].length).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim()};};
P['CORRECTED RESULT']=s=>{const m=s.match(new RegExp('^CORRECTED RESULT\\s*:\\s*('+RES_TAG+')(?:\\s*(?:--|\\u2014|\\u2013|:|;|,|\\()([\\s\\S]*))?$','i'));if(!m)return /^CORRECTED RESULT\s*:/i.test(s)?{why:'CORRECTED RESULT: no tag',code:'CORRECTED_RESULT_NO_TAG'}:null;return {tag:m[1].toUpperCase(),reason:(m[2]||'').trim()};}; // pkgCR: case-insensitive tag, as live
P['CORRECTED COUNT']=s=>{const m=s.match(/^CORRECTED COUNT\s*:\s*(DEFENDER|CHALLENGER)\s+(\d+)/i);return m?{side:m[1].toUpperCase(),n:+m[2]}:(/^CORRECTED COUNT\s*:/i.test(s)?{why:'CORRECTED COUNT: no <SIDE> <n>',code:'CORRECTED_COUNT_NO_SIDE_N'}:null);};
P['CORRECTED STANDING']=s=>{const m=s.match(new RegExp('^CORRECTED STANDING\\s*:\\s*(DEFENDER|CHALLENGER)\\s+('+STAND+')','i'));return m?{side:m[1].toUpperCase(),standing:m[2].toUpperCase()}:(/^CORRECTED STANDING\s*:/i.test(s)?{why:'CORRECTED STANDING: no <SIDE> <standing>',code:'CORRECTED_STANDING_NO_SIDE_STANDING'}:null);};
P.RETRACTED=s=>{const m=s.match(new RegExp('^RETRACTED\\s*:\\s*'+PAIR,'i'));return m?{pair:m[1]+' vs '+m[2],reason:s.slice(m[0].length).replace(new RegExp('^\\s*(?:'+SEP+'|:)\\s*'),'').trim()}:(/^RETRACTED\s*:/i.test(s)?{why:'RETRACTED: no pair',code:'RETRACTED_NO_PAIR'}:null);};
P['NOT PRESSED']=s=>{const m=s.match(/^NOT PRESSED\s*:\s*(.+?)(?:\s*(?:--|\u2014|\u2013)\s*(.*))?$/i);return m?{verse:m[1].trim(),reason:(m[2]||'').trim()}:null;};
P.PRESSED=s=>{if(!/^PRESSED\s*:/i.test(s))return null;const r=s.replace(/^PRESSED\s*:\s*/i,'');                 // two live forms (W1 2373 b1)
 let m=r.match(new RegExp('^'+PAIR+'\\s*'+SEP+'\\s*'+RND+'\\s*'+SEP+'\\s*'));if(m){const q=quoteAt(r.slice(m[0].length));return {kind:'cure',pair:m[1]+' vs '+m[2],round:m[3].toUpperCase(),quote:q?q.q:null};}
 m=r.match(new RegExp('^(.+?)\\s*'+SEP+'\\s*'+RND+'\\s*'+SEP+'\\s*'));if(m){const q=quoteAt(r.slice(m[0].length));const st=q?(q.rest.match(new RegExp('^\\s*'+SEP+'\\s*(UNANSWERED|ANSWERED IN\\s*'+RND+')'))||[]):[];
  return {kind:'ledger',verse:m[1].trim(),round:m[2].toUpperCase(),quote:q?q.q:null,state:st[1]?(st[1].startsWith('UNANSWERED')?'UNANSWERED':'ANSWERED'):null,answeredIn:st[2]?st[2].toUpperCase():null};}
 return {kind:'other',text:r};};
P.STANDING=s=>{const m=s.match(new RegExp('^(DEFENSE|CHALLENGE) STANDING\\s*:\\s*('+STAND+')\\b','i'));if(!m)return /^(DEFENSE|CHALLENGE) STANDING\s*:/i.test(s)?{why:'STANDING: no standing word',code:'STANDING_NO_STANDING_WORD'}:null;
 const L=s.match(/\bL\s*=\s*(\d+)/i),c=s.match(/\bc\s*=\s*(\d+)/i);return {side:m[1].toUpperCase(),standing:m[2].toUpperCase(),L:L?+L[1]:null,c:c?+c[1]:null};};
P.CONCEDED=s=>{const m=s.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)\b/i);if(!m)return /^(CHALLENGER )?CONCEDED LINKS\s*:/i.test(s)?{why:'CONCEDED: no count',code:'CONCEDED_NO_COUNT'}:null;
 const ent=[...s.slice(m[0].length).matchAll(/premise\s+(\d+)\s+(?:is\s+)?(UNEXHIBITED|CONCEDED|VOID|SPARED)/gi)].map(x=>({premise:+x[1],state:x[2].toUpperCase()}));return {side:/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:+m[2],entries:ent};};
P.CLAUSE=s=>{const m=s.match(/^CLAUSE\s*:\s*(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)?/i);if(!m)return null;const g=k=>{const x=s.match(new RegExp('\\b'+k+'\\s*=\\s*(\\d+)','i'));return x?+x[1]:null;};return {tag:m[1]?m[1].toUpperCase():null,n:g('n'),w:g('w'),k:g('k')};};
P.RULING=s=>{const m=s.match(new RegExp('^RULING\\s*(?:'+SEP+'|:)\\s*(.+?)\\s*'+SEP+'\\s*(.+)$','i'));return m?{subject:m[1].trim(),grade:m[2].trim()}:(/^RULING\b/i.test(s)?{why:'RULING: no subject and grade',code:'RULING_NO_SUBJECT_AND_GRADE'}:null);};
P['OUT-OF-ROUND']=s=>{const m=s.match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?\s*((?:CR|DR)\d)\s*\]?\s*\|\s*(.*)$/i);if(!m)return null;const t=m[3].match(/\s*(?:--\s*)?(COUNTED|TOUCHES NO LINK)\b\s*(?:--\s*)?(.*)$/);
 let sen=(t?m[3].slice(0,t.index):m[3]).trim();let why=t?t[2].trim():'';if(!t){const d=sen.match(/\s+(?:--|\u2014|\u2013)\s+/);if(d){why=sen.slice(d.index+d[0].length).trim();sen=sen.slice(0,d.index).trim();}} /* spec 0.5: an untagged row's sentence ends at the first field separator */
 return {side:m[1].toUpperCase(),round:m[2].toUpperCase(),sentence:sen,tag:t?t[1]:null,why};};
P.STATEMENT=s=>{const m=s.match(/^(STATEMENT|RESPONSE)\s*:\s*(.*)$/i);if(!m)return null;const p=m[2].split(/\s*\|\s*/);return {which:m[1].toUpperCase(),item:p.length>1?p[0]:null,text:p.length>1?p.slice(1).join(' | '):p[0]};};
P['LINK STATE']=s=>{const m=s.match(new RegExp('^(D\\d+)\\s*:?\\s*(?:--|\\u2014|\\u2013|-|:)?\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|BROKEN|WITHDRAWN)\\b(?:\\s*'+TAG+')?'));if(!m)return null;const r=s.slice(m[0].length); /* W3 spec 10: LINK STATE D<i>: GRADE [TAG] [-- REASON] */const gi=r.search(/\bGROUND\s*:/i);
 return {link:m[1],grade:m[2],ground:gi>=0?r.slice(gi).replace(/^GROUND\s*:\s*/i,'').trim():'',reason:(gi>=0?r.slice(0,gi):r).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').replace(new RegExp('\\s*'+SEP+'\\s*$'),'').trim()};}; // rcLines counts "D<i>: WITHDRAWN"; SB_FORM accepts "D<i>:" and "D<i> --"
P['RULING PART']=s=>{const m=s.match(/^(CLAIM|NAMED BY|RULE|APPLIED)\s*:\s*(.*)$/i);return m?{part:m[1].toUpperCase(),text:m[2].trim()}:null;}; // krulLines reads the four parts under a RULING
P['CHAIN MARK']=s=>{const m=s.match(/^(DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*([A-Z][A-Z-]*)\b/i);return m?{side:m[1].toUpperCase(),mark:m[2].toUpperCase(),reason:s.slice(m[0].length).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim()}:null;};
P['CITATION CHECK']=s=>{const m=s.match(/^(?:#+\s*)?CITATION CHECK\b\s*:?\s*(.*)$/i);return m?{text:m[1]}:null;};
P.HEADING=s=>{const m=s.match(/^#*\s*([A-Z][A-Z \-/()]{3,60}):\s*$/);return m?{heading:m[1].trim()}:null;};
P.SHORT=s=>{const m=s.match(/^SHORT\s*:\s*(.*)$/i);return m?{text:m[1]}:null;};
P.REPLY=s=>{const m=s.match(/^(?:(SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*([SG])\s*(\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(!m)return null; // pkgSBP id variants
 const to=m[5]!=null?m[5].trim():null;return {kind:(m[1]||(m[2].toUpperCase()==='G'?'GATE':'SENDBACK')).toUpperCase(),id:m[2].toUpperCase()+m[3],answer:/^KEEP$/i.test(m[4])?'KEEP':'CHANGE',to,toRow:to?readLine(to.replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1')):null,sentence:(m[6]||'').trim()};};
// W3 spec 8.3 and 10: PREMISE <k> [is] [:] STATUS [TAG] [-- : ,] [REASON]; the engine's own 'premise k ruled X:' label is removed first. Label any case, status upper case.
P.PREMISE=s=>{const t=s.replace(/^premise\s+\d+\s+ruled\s+[A-Z ]+?\s*:\s*(?=premise\b)/i,'');const m=t.match(new RegExp('^premise\\s+(\\d+)\\s*(?:is\\s+)?:?\\s*(UNEXHIBITED|CONCEDED|NOT VOID|VOID|SPARED|COUNTED)\\b(?:\\s*'+TAG+')?\\s*(?:'+SEP+'|:|,)?\\s*','i'));if(!m)return null;
 if(m[2]!==m[2].toUpperCase())return {why:'PREMISE: status word not upper case',code:'PREMISE_STATUS_NOT_UPPER_CASE'};return {premise:+m[1],status:m[2],tag:m[3]?+m[3]:null,reason:t.slice(m[0].length).trim(),engineLabel:t!==s};};
const ORDER=['REPLY','FORCED','CORRECTED RESULT','CORRECTED COUNT','CORRECTED STANDING','RETRACTED','NOT PRESSED','PRESSED','COLLISION','ANSWER CHECK','KEYSTONE','RESULT','CLAUSE','STANDING','CONCEDED','PREMISE','RULING','RULING PART','CHAIN MARK','LINK STATE','CITATION CHECK','OUT-OF-ROUND','STATEMENT','SHORT','HEADING'];
// W3 spec 7 G12: RESTATED wraps any of these forms; the inner text is parsed as that form. G3: a form-labelled line that fails gets MALFORMED_<FORM> (detail keeps the reason code).
const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT'];
function readLine(line){const norm=normLine(line);if(!norm)return {form:null,why:'empty',code:'EMPTY',norm};
 const rs=norm.match(/^RESTATED\s*:\s*/i);if(rs){const r=readLine(norm.slice(rs[0].length));if(r.form&&RESTATABLE.includes(r.form))return {form:r.form,f:Object.assign({},r.f,{restated:true}),norm};
  if(r.form==null&&r.tried&&RESTATABLE.includes(r.tried))return Object.assign({},r,{norm});return {form:null,tried:'RESTATED',why:'RESTATED wraps no spec form',code:'NOT_A_FORM',norm};}
 for(const k of ORDER){const f=P[k](norm);if(!f)continue;if(f.code)return {form:null,tried:k,why:f.why,code:'MALFORMED_'+k.replace(/[^A-Z]+/g,'_'),detail:f.code,norm};return {form:k,f,norm};}
 {const lab=[[/^FORCED\b/i,'FORCED'],[/^D\d+\s+vs\.?\s+C\d+\b/i,'COLLISION'],[/^ANSWER CHECK\s*:/i,'ANSWER CHECK'],[/^KEYSTONE\s*:/i,'KEYSTONE']].find(([r])=>r.test(norm));
  if(lab)return {form:null,tried:lab[1],why:lab[1]+' label, line does not parse',code:'MALFORMED_'+lab[1].replace(/[^A-Z]+/g,'_'),detail:'NO_PARSE',norm};} /* W3 spec 7 G3 */
 return {form:null,why:'no line form',code:'NO_LINE_FORM',norm};}
// W2 interface: n is the 0-based index in text.split('\n') of the unescaped text; {n, form, fields} or {n, form:null, why, code}. code is the stable refusal code (W3 2377 follow-up); why is prose only.
// readLines(jtext): jtext is the judge text as the engine reads it (cureJText(raw,true) for a verdict, the stored text for a reply); it is NOT unescaped again (spec 0.1, 32973). readStored(raw) applies judgeText first.
function readStored(raw){return readLines(judgeText(raw).text);}
function readLines(text){return String(text==null?'':text).split('\n').map((l,i)=>{const r=readLine(l);return r.form?{n:i,form:r.form,fields:r.f,norm:r.norm}:{n:i,form:null,why:r.why,code:r.code,detail:r.detail||null,tried:r.tried||null,norm:r.norm};}).filter(r=>r.code!=='EMPTY');}
module.exports={norm:normLine,readLine,readLines,readStored,judgeText,normLine,unescapeOnce,quoteAt,FORMS:ORDER};

return module.exports;})();
function __sbxRL(l){try{return __RL.readLine(String(l==null?'':l));}catch(e){return {form:null};}}
// ruling 428, the send-back half: reads each judge's SENDBACK lines and records one debate_enforcer_log row (kind send_back) per item: the
// judge's line, the enforcer's reason, and the judge's answer (KEEP or CHANGE TO, with its sentence). The judge keeps the decision. NOT BUILT
// here: a CHANGE does not yet recompute the judge's counts or result; it is recorded and printed in the run document.
const PASS=$('Judge Enforcer Record').first().json;
const B=$('Send Back Build').all().map(x=>x.json);const first=B[0]||{};const T=new Date().toISOString();
const ns=(first.sb_not_sent||[]).map(x=>({run_token:null,seat:x.seat,seat_role:'panel',judge_model:null,kind:'send_back',rule:x.rule,item:x.item||null,flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));
if(first.sb_skip)return [{json:{...PASS,sendback:{skipped:true,why:first.sb_why||'',not_sent:ns.length,tally:{}},sb_rows:ns,sb_items:[]}}];
const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];const SIL={}; /* pkgSBS: seat -> silent S numbers */const ECF={};const UNDF={};const ABSM={}; /* pkgABS: seat -> uncured absence items */ /* pkgUND: seat -> uncured E-UNG and E-HOLD-UND items */ /* pkgECF: seat -> uncured E-COL items */
function psGrades(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,'$1 ')
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig; /* the clause's grade is its first grade word (a later "counted" or "VOID" in the prose does not regrade it) */
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ');W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}
// pkgEC2 (W3 Wall 2446): the LIVE cure reading for E-ANS and E-PREM send-backs. Record-only until W3 promotes the rules.
function enf428Cure(it,a,R,named){ /* named: the premise numbers of every E-PREM item the seat was sent on the same flagged line (pkgPS); default the item's own */
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
 const side=k=>/^CR/i.test(k)?'C':/^DR/i.test(k)?'D':null;const has=(k,q)=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return !!t&&t.includes(' '+N(q)+' ');};
 const six=(why,ks)=>{const w=N(why).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ks.some(k=>has(k,r)))return r;}return null;};
 const res=(c,why)=>({status:c?'CURED':'UNCURED',why});if(!a||a.ans==='NO ANSWER')return res(false,'no answer to the send-back');
 const AC=/ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4](?:\s*[;,]\s*(?:CR|DR)[1-4])*)\]\s*--\s*MEANS:\s*["'“‘]([\s\S]*?)["'”’]\s*--\s*ANSWER:\s*["'“‘]([\s\S]*)["'”’]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 const pieces=s=>String(s).split(/["'”’]\s*;\s*["'“‘]|\.{3}|…/).map(x=>x.trim()).filter(x=>N(x).split(' ').length>=3);
 if(it.rule==='E-ANS'){const f=String(it.line||'').replace(/\\+"/g,'"').match(AC);if(!f)return res(false,'the flagged line is not read as an ANSWER CHECK line');const fs=side(f[2]);const SR=Object.keys(R||{}).filter(k=>side(k)===fs);
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the answering side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the answering side\'s rounds');}
  const t=String(a.to||'').replace(/\\+"/g,'"').match(AC);if(!t)return res(false,'the CHANGE TO is not an ANSWER CHECK line');if(N(t[1])!==N(f[1]))return res(false,'the CHANGE TO names another verse ('+t[1]+')');
  if(/^(MISSES|FAILS)$/i.test(t[5]))return res(true,'CHANGE TO grades MISSES');const ks=t[2].split(/\s*[;,]\s*/).map(k=>k.toUpperCase());
  if(ks.some(k=>side(k)!==fs))return res(false,'the CHANGE TO moves the answer to the other side\'s round');const ps=pieces(t[4]);if(!ps.length)return res(false,'the CHANGE TO quotes no answer of 3 or more words');
  const miss=ps.filter(p=>!ks.some(k=>has(k,p)));if(miss.length)return res(false,'the CHANGE TO answer is not found word for word in ['+ks.join('; ')+']: "'+miss[0].slice(0,120)+'"');
  const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta))return res(false,'the CHANGE TO MEETS quotes the flagged answer again (or a shorter cut of it)');
  return res(true,'CHANGE TO MEETS with a fuller answer found in ['+ks.join('; ')+']');}
 if(it.rule==='E-PREM'){const m=String(it.item||'').match(/against the (defender|challenger)\s+(\d+)/i);if(!m)return res(false,'the item names no premise');const n=+m[2];const fs=/^d/i.test(m[1])?'C':'D'; /* the defender's premise is answered in the defender's rounds (CR) */
  const right=(String(it.reason||'').match(/\(right:\s*([A-Z ]+?)\)/)||[])[1]||null;const SR=Object.keys(R||{}).filter(k=>side(k)===fs);const ALL=Object.keys(R||{}).filter(k=>side(k));
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the side\'s rounds');}
  const to=String(a.to||'');let g=null;const P=typeof psGrades==='function'?psGrades(to):null;if(P&&(n in P.g))g=P.g[n];
  if(!g){const z=to.match(new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+n+'\\b[^.;]{0,80}?\\b(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\b','i'));if(z){const k=z[1].toUpperCase();g=k==='VOID'?'VOID':/UNEXHIBITED|CONCEDED|COUNTED/.test(k)?'COUNTED':'SPARED';}}
  if(!g)return res(false,'the CHANGE TO gives premise '+n+' no grade the engine reads');
  {const Q=typeof psGrades==='function'?psGrades(it.line):null;if(P&&Q){const nm=named&&named.size?named:new Set([n]);const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]&&!nm.has(k));
   if(out.length||P.side!==Q.side||(P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>nm.size))return res(false,'the CHANGE TO regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count or side')+' beyond its items (pkgPS refuses it)');}}const want=right&&/VOID/.test(right)?'VOID':right&&/COUNTED|UNEXHIBITED|CONCEDED/.test(right)?'COUNTED':right?'SPARED':null;
  if(want&&g!==want)return res(false,'the CHANGE TO grades premise '+n+' '+g+', not the enforcer\'s '+want);
  const qs=[...to.matchAll(/["“]([^"”]{8,240})["”]/g)].map(x=>x[1]).filter(q=>N(q).split(' ').length>=3);const miss=qs.filter(q=>!ALL.some(k=>has(k,q)));
  if(miss.length)return res(false,'a quote in the CHANGE TO is not found in any round: "'+miss[0].slice(0,120)+'"');return res(true,'CHANGE TO grades premise '+n+' '+g+(qs.length?', its quotes found in the rounds':''));}
 if(it.rule==='E-COL'){if(it.ecl&&Array.isArray(it.ecl.faults)&&it.ecl.faults.length){ /* pkgECL (W3 2547): a layer fault cures only by a CHANGE TO */
  if(a.ans!=='CHANGE')return res(false,'a KEEP does not cure a layer fault (pkgECL, Commitment 13): '+it.ecl.why);const __to=String(a.to||'').replace(/\\+"/g,'"');
  if(/^\s*RETRACTED\b/i.test(__to))return res(true,'CHANGE TO RETRACTED (pkgECL)');if(!/\b(?:BROKEN|FORCED)\b/.test(__to))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED (pkgECL)');
  const __c=ECL.check(__to,ECL.ctxLive());if(__c.faults.length)return res(false,'CHANGE TO still fails the layer check (pkgECL): '+__c.why);if(!it.ecl.ds)return res(true,'CHANGE TO carries its layers (pkgECL): '+__c.why);}
const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i)||String(it.item||'').match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i));
  const am=L.match(/ANSWER\s*\[\s*(?:([CD])R|(Defender|Challenger))/i);const fs=am?(am[1]?am[1].toUpperCase():(/^d/i.test(am[2])?'C':'D')):/CHALLENGER LINK BROKEN/.test(L)?'D':/DEFENDER LINK BROKEN/.test(L)?'C':null; /* pkgECF: the answering side; its rounds are CR (defender) or DR (challenger) */
  if(!fs)return res(false,'the line names no answering side');const FORC=/^\s*FORCED\b/i.test(L);const ps=fs==='C'?'D':'C';
  /* pkgECF2 (W3 2540): a round split into its own words and its quoted rows (text inside quotation marks) */
  const QR=/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g;const own=k=>String(R&&R[k]||'').replace(/[*_\x60]+/g,'').replace(QR,' | ');const rows=k=>(String(R&&R[k]||'').replace(/[*_\x60]+/g,'').match(QR)||[]).join(' | ');
  const hasIn=(txt,q)=>(' '+N(txt)+' ').includes(' '+q+' ');const run6=(s,txts,not)=>{const w=N(s).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(not&&(' '+not+' ').includes(' '+r+' '))continue;if(txts.some(t=>hasIn(t,r)))return r;}return null;};
  const KS=Object.keys(R||{}).filter(k=>side(k));const ANSF=KS.filter(k=>side(k)===fs).map(k=>String(R[k]||'')),ROWS=KS.map(rows),PRS=KS.filter(k=>side(k)===ps).map(k=>String(R[k]||''));
  const ROWN=' '+ROWS.map(N).join(' | ')+' ';const ownRun=(t)=>{const w=N(t).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ROWN.includes(' '+r+' '))continue;if(ANSF.some(x=>hasIn(x,r)))return r;}return null;}; /* the answer's own words: a run in its rounds that is not inside a quoted row (the FAILS words may carry a quoted phrase) */
  const both=s=>{const t=String(s||'').replace(/\\+"/g,'"');const a1=ownRun(t);if(!a1)return {ok:false,why:'quotes no 6 words in a row of the answering side\'s own words'};const v=run6(t,ROWS,a1);if(!v)return {ok:false,why:'quotes the answering side ("'+a1+'") but no 6 words in a row of the quoted verse it cannot agree with'};return {ok:true,why:'quotes the answer ("'+a1+'") and the verse ("'+v+'")'};};
  const press=s=>{if(FORC||!/\b(?:unanswered|not answered|no answer|left (?:it )?unanswered|never answered)\b/i.test(String(s||'')+' '+L))return null;const r=run6(s,PRS,null);return r?'quotes the unanswered pressing sentence ("'+r+'"), ruling 392':null;};
  if(a.ans==='CHANGE'){const to=String(a.to||'');const pr=pm?new RegExp('\\b'+pm[1]+'\\s*vs\\.?\\s*'+pm[2]+'\\b','i'):null;
   if(!/\b(?:BROKEN|FORCED)\b/.test(to)&&(!pr||pr.test(to)||/^\s*RETRACTED\b/i.test(to)))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED');
   const s=to+' '+(a.why||'');const p=press(s);if(p)return res(true,'CHANGE TO keeps the break and '+p);const b2=both(s);return res(b2.ok,'CHANGE TO keeps the break and '+b2.why);}
  const p=press(a.why);if(p)return res(true,'KEEP that '+p);const b2=both(a.why);return res(b2.ok,'KEEP that '+b2.why);}
 return res(false,'not an E-ANS, E-PREM or E-COL item');}
let __RD=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if($(n).isExecuted)for(const it of $(n).all()){const c=it.json&&it.json.cure;if(c&&c.rounds){__RD=c.rounds;break;}}}catch(e){}if(__RD)break;} /* pkgEC2: the rounds, read as Judge Enforcer Build reads them */
B.forEach((b,ci)=>{let txt='',err=null;try{txt=String(R[ci].choices[0].message.content||'');}catch(e){err=String((R[ci]&&R[ci].error&&(R[ci].error.message||R[ci].error))||'no reply').slice(0,200);errors.push(b.seat+': '+err);}
 /* WALL-1963 reply 1965 DEFECT 1: a judge whose system message demands strict JSON may wrap its lines in a JSON string (run 32725, Panel Cure
  Call 2), so escaped line breaks and quotes are undone first and a SENDBACK line is read wherever it starts in a line. */
 const J=/^\s*[{\[]/.test(txt);const A={};const T2=txt.replace(/\\n/g,'\n').replace(/\\"/g,'"');for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();/* WALL-2024 2243 A (run 32980: gemini wrote "SENDBACK: ITEM S1 || ..." on all 17 items, and every one was logged NO ANSWER): the id may
   follow "ITEM" or "#", the colon may be missing, and the S and its number may be spaced; KEEP and CHANGE TO in any case; a CHANGE TO with no closing "|| reason" is read to the end of
   its line (32980 gemini S1 to S7, S11, S12, S14 to S17). */
  {const r=__sbxRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='SENDBACK'){const id=r.f.id; /* pkgSBX: the reader decides whether the line is a SENDBACK answer, its id and KEEP or CHANGE */
   const m0=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);const same=m0&&m0[1].replace(/\s+/g,'').toUpperCase()===id&&(/^KEEP$/i.test(m0[2].trim())?'KEEP':'CHANGE')===r.f.answer;
   /* the payload and sentence keep the judge's own characters when the old pattern reads the same id and answer (the reader's spec-0 normalisation strips backslashes) */
   if(!A[id])A[id]=same?{ans:r.f.answer,to:(m0[3]||'').trim(),why:(J?String(m0[4]||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(m0[4]||'')).trim(),line:l}:{ans:r.f.answer,to:String(r.f.to||'').trim(),why:(J?String(r.f.sentence||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(r.f.sentence||'')).trim(),line:l};continue;}}
  const m=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(m){m[1]=m[1].replace(/\s+/g,'');m[4]=m[4]||'';}
  if(m&&!A[m[1].toUpperCase()])A[m[1].toUpperCase()]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?m[4].replace(/"\s*,?\s*[}\]]*\s*$/,''):m[4]).trim(),line:l};}
 (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;
  let __ec=null;if(it.rule==='E-ANS'||it.rule==='E-PREM'||it.rule==='E-COL'){try{const nm=it.rule==='E-PREM'?new Set((b.items||[]).filter(y=>y.rule==='E-PREM'&&String(y.line)===String(it.line)).map(y=>+((String(y.item||'').match(/(\d+)\s*$/)||[])[1]))):null;
   __ec=__RD?enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason,ecl:it.ecl||null},a||{ans:'NO ANSWER'},__RD,nm):{status:'UNREAD',why:'no rounds found in the Panel Cure Normalize nodes'};}catch(e){__ec={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgEC2 (W3 2446): record-only */
  if(it.abs){try{const __ac=ABS.cure(it,a||{ans:'NO ANSWER'},ECL.ctxLive());__ec=__ec?{status:__ac.status,why:__ac.why+' | record-only reading: '+__ec.status+' -- '+__ec.why}:__ac;}catch(e){__ec={status:'UNREAD',why:'absence cure reading error: '+String(e&&e.message||e).slice(0,160)};}} /* pkgABS: ENFORCED */
  const named=!a&&!err&&new RegExp('\\bS\\s*'+String(it.sid).replace(/^S/i,'')+'(?!\\d)').test(T2);const silent=!a&&!err&&!named;if(silent)(SIL[b.seat]=SIL[b.seat]||[]).push(it.sid); /* pkgSBS (W3 2274): silence counts; a written but unread answer does not */
  shown.push({seat:b.seat,sid:it.sid,rule:it.rule,item:it.item,line:it.line,reason:it.reason,ans,to:a?a.to:'',why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item')});
  rows.push({run_token:b.run_token,seat:b.seat,seat_role:'panel',judge_model:b.api_model,kind:'send_back',rule:it.rule,item:it.item||null,flagged_line:String(it.line).slice(0,1500),
   prompt_sent:k===0?b.msg:null,full_reply:k===0?(txt||null):null,reply_error:err,response_line:a?a.line.slice(0,1500):null,cure_status:null,
   cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)'+(silent?' | SILENT: no written answer; counted in drv_uncured (silence rule, WALL-2024 2274)':named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':'')+(__ec?(it.abs?' | CURE (ABSENCE CHECK ENFORCED, pkgABS): ':it.rule==='E-COL'?' | CURE (E-COL ENFORCED, pkgECF): ':' | CURE (record-only until promoted): ')+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});
  if(it.rule==='E-COL'&&__ec&&__ec.status!=='CURED'&&!silent&&!err){(ECF[b.seat]=ECF[b.seat]||[]).push(it.sid+' ('+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgECF (C): an UNCURED E-COL answer counts; silence is counted already (pkgSBS) */
  else if(it.rule==='E-COL'&&__ec&&__ec.status==='CURED')rows[rows.length-1].cure_status='CURED';
  if(it.rule==='E-UNG'||it.und){let __u;try{__u=UND.cure(it,a||{ans:'NO ANSWER'},ECL.ctxLive());}catch(e){__u={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};} /* pkgUND (ENFORCED) */
   rows[rows.length-1].cure_reason+=' | CURE (pkgUND, ENFORCED): '+__u.status+' -- '+String(__u.why).slice(0,400);
   if(__u.status==='UNCURED'&&!silent&&!err){(UNDF[b.seat]=UNDF[b.seat]||[]).push(it.sid+' ('+it.rule+(it.rule==='E-UNG'?'':' on UNDERDETERMINED')+' '+String(it.item||'').slice(0,60)+': '+String(__u.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
   else if(__u.status==='CURED')rows[rows.length-1].cure_status='CURED';}
  if(it.abs&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(ABSM[b.seat]=ABSM[b.seat]||[]).push(it.sid+' ('+it.rule+' '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';} /* pkgABS: an UNCURED absence item counts once (not again when pkgUND counted it); silence is counted already (pkgSBS) */
  else if(it.abs&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';});});
let bodies=null,anySil=false;const silent_counted=[];const ecol_counted=[];const und_counted=[];const abs_counted=[];
/* pkgECF (C): each seat's uncured E-COL answers are added to its drv_uncured, as silence is */
if(Object.keys(ECF).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();
 for(const [seat,its] of Object.entries(ECF)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;ecol_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}} /* pkgSBS: add each seat's silent items to its drv_uncured, as Gate Record does for uncured gate items */
/* pkgUND: each seat's uncured E-UNG and E-HOLD-UND answers are added to its drv_uncured */
if(Object.keys(UNDF).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(UNDF)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;und_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
/* pkgABS: each seat's uncured absence items are added to its drv_uncured, as E-COL's are */
if(Object.keys(ABSM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(ABSM)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;abs_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v43: ABSENCE GRADE UNCURED (pkgABS; Commitment 3, ruling 421) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(SIL).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,sids] of Object.entries(SIL)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+sids.length;anySil=true;silent_counted.push({seat,items:sids});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v40: SEND-BACK SILENCE -- SEAT: '+seat+'; ITEMS: '+sids.join(', ')+'; no written answer to '+(sids.length===1?'this send-back item':'these send-back items')+'; counted in drv_uncured (silence rule, WALL-2024 2274). REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
return [{json:{...PASS,...(bodies?{bodies}:{}),alt_needed:!!PASS.alt_needed||anySil,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted,ecol_counted,und_counted,abs_counted},sb_rows:rows,sb_items:shown}}];
