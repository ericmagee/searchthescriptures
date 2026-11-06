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
// Uses ECL (pkgECL, same library) for the [L1] count: a verse the run did not read is UNVERIFIABLE and counts as given (raises nothing).
const UND=(()=>{
 const rounds=ptext=>{const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
  const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;out[x.k]=t.slice(x.e,end);});return out;};
 // the premises of the list that closes [DR2] (the list against the defender), numbered as the K-V and K-G readers number them
 function pressed(ptext){const t=rounds(ptext).DR2||'';let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  const __seenL=new Set();return its.map((x,k)=>{const lk=x.match(/^\s*\**\s*(?:\d+[.)]\s*)?\**\s*LINK\s+(\d+)\b/i);return {n:lk?+lk[1]:k+1,p:k+1,none:/^\s*\**\s*(?:\d+[.)]\s*)?\**\s*LINK\s+none/i.test(x),head:x.replace(/\s+/g,' ').trim().slice(0,160)};}).filter(x=>!x.none&&!__seenL.has(x.n)&&__seenL.add(x.n));} /* pkgUNP: a premise presses the link it names (LINK k -> D<k>), once */
 const GR=/^[\s>*_-]*D(\d+)\s+vs\.?\s+C(\d+)\b[^\n]{0,200}?:\s*\**\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)/gmi;
 const WD=/^[\s>*_-]*D(\d+)\s*:\s*\**\s*WITHDRAWN\b/gmi;
 function graded(text){const g=new Map();const T=String(text||'');for(const m of T.matchAll(GR))g.set(+m[1],(g.get(+m[1])||[]).concat(m[3].toUpperCase()));for(const m of T.matchAll(WD))g.set(+m[1],['WITHDRAWN']);return g;}
 const ownLine=(text,n)=>{const l=String(text||'').split('\n').find(x=>new RegExp('^[\\s>*_-]*D'+n+'\\s*:').test(x));return l?l.trim():'';};
 // the pressed defender links this judge left without a graded collision line
 function missing(ptext,text){const P=pressed(ptext);if(!P.length)return [];const g=graded(text);return P.filter(p=>!g.has(p.n)).map(p=>({n:p.n,p:p.p||p.n,premise:p.head,line:ownLine(text,p.n)}));}
 const OPEN=/\b(?:leaves?\s+(?:\w+\s+){0,3}open|left\s+open|open\s+(?:question|point|whether)|(?:does|do|did)\s+not\s+(?:decide|settle|determine|say|state|show|fix)|neither\s+(?:reading|side|one)|both\s+readings|either\s+reading|consistent\s+with\s+both|agrees?\s+with\s+both|fits?\s+both|undecided|silent\s+(?:on|about|as\s+to)|not\s+stated)\b/i;
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


// WALL-2024 package B (operator 2026-11-05: the agreement shown back before every decision; B1 amended to the walker form, W3 2121).
// The seat's own acceptance reply is read from the head exchange of its own conversation (the assistant turn after "POSTURE FOR
// ACCEPTANCE" or "POSTURE RETURNED") and shown back at the END of the final user message. The system message and the head exchange,
// the cached prefix, are not touched. A body with no accepted exchange is left as it is.
const __AGR_TXT=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';
function __agrTail(msgs){if(!Array.isArray(msgs))return '';let acc=null;
 for(let i=0;i+1<msgs.length;i++){const m=msgs[i],r=msgs[i+1];if(!m||!r)continue;const ut=m.role==='user'?__AGR_TXT(m.content!==undefined?m.content:m.parts):'';
  if(/^POSTURE (FOR ACCEPTANCE|RETURNED)/.test(ut)&&(r.role==='assistant'||r.role==='model'))acc=__AGR_TXT(r.content!==undefined?r.content:r.parts);}
 if(!acc||!acc.trim())return '';
 return '\n\nTHE AGREEMENT YOU ACCEPTED, shown back before this decision. Your own words when you accepted the posture:\n'+acc.trim().split('\n').map(l=>'> '+l).join('\n')
  +'\nEach contested grade you write (BROKEN, FORCED, MISSES, VOID, UNPROVEN) names the commitment it applies, as "(Commitment N)".\nThe reply form given above is unchanged; answer in it.';}
const __AGR_SB=(items)=>{const seen=new WeakSet();const walk=(o,d)=>{if(!o||typeof o!=='object'||d>7||seen.has(o))return;seen.add(o);
 if(Array.isArray(o.messages)&&typeof o.model==='string'){const m=o.messages;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'){const c=m[i].content;if(typeof c==='string'){if(!c.includes('THE AGREEMENT YOU ACCEPTED, shown back'))m[i].content=c+tail;}else if(Array.isArray(c)){if(!c.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))c.push({type:'text',text:tail});}break;}}}}
 else if(Array.isArray(o.contents)&&o.systemInstruction){const m=o.contents;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'&&Array.isArray(m[i].parts)){if(!m[i].parts.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))m[i].parts.push({text:tail});break;}}}}
 for(const k of Object.keys(o))walk(o[k],d+1);};(items||[]).forEach(it=>walk(it&&it.json,0));return items;};
// ruling 428, the send-back half (journal 2078: the record half was built in s428a and s429; this half was approved and not built). Every line
// an enforcer DISAGREES with (E-ANS, E-VOID, E-COL of ruling 428 and the later enforcer rules; never a withdrawal row, K-W, ruling 445) goes back once to the panel
// judge that wrote it, in that judge's own conversation, with the enforcer's quoted reason. The judge keeps the decision: KEEP or CHANGE, with
// one sentence quoting the debate words that decide it. Both are recorded (Send Back Record). Transport limit, not a rule: at most 60 items per
// judge; an item past that is recorded NOT SENT, never dropped silently. A judge whose call family is not openrouter is recorded NOT SENT.
const PASS=$input.first().json; // Judge Enforcer Record's output, passed on unchanged
let PB=null;try{PB=$('Panel Build').first().json;}catch(e){PB=null;}
let PCC=null;try{PCC=$('Panel Cure Check').first().json;}catch(e){PCC=null;}
let E421=[];try{if($('Enforcer Record').isExecuted)E421=$('Enforcer Record').first().json.enf421_rows||[];}catch(e){E421=[];}
const E428=PASS.enf428_rows||[];
const skip=(why,ns)=>[{json:{...PASS,sb_skip:true,sb_why:why,sb_not_sent:ns||[]}}];
const dis=[].concat(E421,E428).filter(x=>x&&x.seat_role==='panel'&&x.rule!=='K-W'&&x.rule!=='K-CON' /* package A/B: K-CON is TRIAL and not sent back (W1, W3, 2026-11-05);  ruling 445: "withdrawals will not be included in send-backs" */&&/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(String(x.cure_reason||'')) /* s432: a NO ANSWER row is a reported violation too */);
/* pkgECL (W3 2547): the layer check on every E-COL line, ENFORCED: a fault is sent back even when the enforcer agreed */
try{const __ctx=ECL.ctxLive();const __seen=new Set();for(const __it of $('Judge Enforcer Build').all())for(const __x of ((__it.json&&__it.json.ids)||[])){if(!__x||__x.rule!=='E-COL')continue;const __k=__x.seat+'|'+__x.flagged_line;if(__seen.has(__k))continue;__seen.add(__k);
 const __c=ECL.check(__x.flagged_line,__ctx);if(!__c.faults.length)continue;const __d=dis.find(y=>y.rule==='E-COL'&&y.seat===__x.seat&&String(y.flagged_line||'')===String(__x.flagged_line||''));
 if(__d){__d.ecl={...__c,ds:true};__d.cure_reason=String(__d.cure_reason||'')+' | LAYER CHECK (pkgECL, Commitment 13): '+__c.why;}
 else dis.push({seat:__x.seat,seat_role:'panel',rule:'E-COL',item:__x.item,flagged_line:__x.flagged_line,response_line:__x.response_line,cure_reason:'ENFORCER DISAGREE: LAYER CHECK (pkgECL, Commitment 13): '+__c.why,ecl:{...__c,ds:false}});}}catch(e){}
/* pkgUND (E-UNG, E-HOLD on UNDERDETERMINED; ENFORCED) */
try{for(const __x of dis)if(UND.isUndBroken(__x)){__x.und={kind:'E-HOLD-UND'};__x.cure_reason=String(__x.cure_reason||'')+' | '+UND.CURE_UND;}
 const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='panel').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;
  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;
  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n');
  const __t=__tx(__p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');
  for(const __m of UND.missing(__pt,__t))dis.push({seat:__p.judge_seat,seat_role:'panel',rule:'E-UNG',item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+(__m.p||__m.n)+')',flagged_line:__m.line||('(no COLLISION POINTS line for D'+__m.n+')'),response_line:__m.line||'',cure_reason:'ENFORCER DISAGREE: '+UND.CURE_UNG(__m.n)+' THE PREMISE: '+__m.premise,und:{kind:'E-UNG',n:__m.n}});}}catch(e){}
/* pkgABS (W3 ruling; Commitment 3, ruling 421): a MEETS, STANDS or UNDERDETERMINED grade resting on an absence, ENFORCED: sent back even when the enforcer agreed */
try{const __ctx=ECL.ctxLive();const __seen=new Set();for(const __it of $('Judge Enforcer Build').all())for(const __x of ((__it.json&&__it.json.ids)||[])){if(!__x||(__x.rule!=='E-ANS'&&__x.rule!=='E-HOLD'))continue;const __k=__x.rule+'|'+__x.seat+'|'+__x.flagged_line;if(__seen.has(__k))continue;__seen.add(__k);
 const __c=ABS.check(__x,__ctx);if(!__c.raise)continue;const __d=dis.find(y=>y.rule===__x.rule&&y.seat===__x.seat&&String(y.flagged_line||'')===String(__x.flagged_line||''));
 if(__d){__d.abs={...__c,ds:true};__d.cure_reason=String(__d.cure_reason||'')+' | ABSENCE CHECK (pkgABS): '+__c.why;}
 else dis.push({seat:__x.seat,seat_role:'panel',rule:__x.rule,item:__x.item,flagged_line:__x.flagged_line,response_line:__x.response_line,cure_reason:'ENFORCER DISAGREE: ABSENCE CHECK (pkgABS): '+__c.why,abs:{...__c,ds:false}});}}catch(e){}
if(!dis.length)return skip('no enforcer reported a violation in a panel judge line');
if(!PB||!Array.isArray(PB.judges))return skip('the panel judges\' requests could not be read',dis.map(x=>({seat:x.seat,rule:x.rule,item:x.item,why:'panel requests not read'})));
const textOf=raw=>String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const said={};for(const s of ((PCC&&PCC.bodies)||[])){try{const p=(typeof s==='string'?JSON.parse(s):s).payload||{};said[p.judge_seat]=textOf(p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();}catch(e){}}
const why=x=>String(x.cure_reason||'').replace(/^ENFORCER (?:DISAGREE|NO ANSWER)\s*:?\s*/,'').replace(/\s*\((?:judge cure [A-Z]+; )?(?:RECORD-ONLY )?TRIAL[^)]*\)\s*$/,'').trim();
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const MAX=60;const bySeat=new Map();for(const x of dis){if(!bySeat.has(x.seat))bySeat.set(x.seat,[]);bySeat.get(x.seat).push(x);}
const out=[];const not_sent=[];
for(const [seat,list] of bySeat){const j=PB.judges.find(q=>q.seat===seat);
 if(!j||!j.body||!Array.isArray(j.body.messages)){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'no panel request for this seat'}));continue;}
 if(j.fam!=='openrouter'){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'call family '+j.fam+' has no send-back route'}));continue;}
 if(!said[seat]){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'the judge\'s own judgment text could not be read'}));continue;}
 const items=list.slice(0,MAX).map((x,k)=>({sid:'S'+(k+1),rule:x.rule,item:x.item||'',line:x.flagged_line||x.response_line||'',reason:why(x),ecl:x.ecl||null,und:x.und||null,abs:x.abs||null,src:x}));
 list.slice(MAX).forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'over the '+MAX+'-item transport limit'}));
 // pkgCM (c) (W3 2394; run 33040 chatgpt S19, S20): an E-HOLD item that proposes BROKEN states the gate's rule for a BROKEN grade, so the
 // send-back never asks for a grade the gate then charges. Record-only as before.
 const hold421=i=>{if(i.rule!=='E-HOLD'||!/\(right:\s*BROKEN\)/i.test(String((i.src&&i.src.cure_reason)||i.reason||'')))return '';const pm=String(i.item||'').match(/\b(D\d+\s+vs\.?\s+C\d+)\b/i);const pr=pm?pm[1].replace(/\s+vs\.?\s+/i,' vs '):'D<i> vs C<j>';
  return '\nTHE RULE FOR A BROKEN GRADE (the gate checks it, K-G4): if the answering side answered the witness, the link can break only by meaning, and that break counts only with a FORCED line for the pair (ruling 421): FORCED: '+pr+' -- MEANS [<round>]: "<the pressing sentence, quoted>" -- ANSWER [<round>]: "<the answer, quoted>" -- FAILS: "<the words that cannot agree, quoted>". If the witness was left unanswered, the BROKEN line must quote the pressing sentence and name its round (ruling 392). A CHANGE TO here replaces only this line and cannot add the FORCED line.';};
 const __undR=i=>!i.und?'':'\nTHE COLLISION RULE (pkgUND, ENFORCED): '+(i.rule==='E-UNG'?UND.CURE_UNG(i.und.n):UND.CURE_UND);
const __absR=i=>!i.abs?'':'\nTHE ABSENCE CHECK ('+i.rule+', ENFORCED, pkgABS; Commitment 3, ruling 421): '+i.abs.why+'. An answer meets a press, and a link stands, by a positive fit: the KJV words that show it, quoted with the reference under an [L1] tag ([L1] <reference> "<the KJV words>"). That a verse does not deny, does not name or leaves room for a reading is not a fit, and two readings both retained is not a fit. To keep the grade, CHANGE TO the line with the positive fit quoted under [L1]. Otherwise CHANGE TO the line regraded'+(i.rule==='E-ANS'?' MISSES':' (a BROKEN or FORCED grade gives its layers, Commitment 13)')+'. A KEEP does not cure this item.';
const __eclR=i=>!i.ecl?'':'\nTHE LAYER CHECK (E-COL, ENFORCED, pkgECL; Commitment 13): '+i.ecl.why+'. A break line gives its grounds after GROUND: in layers: [L1] <reference> "<the KJV words the answer cannot agree with>" (counted when the words stand in that verse); [L2] <word> (<Strong\'s number>, <gloss>) when the break turns on a word\'s meaning (counted when the word stands in a verse the line cites); [L3] <reference> "<KJV words>" for any cross-reference relied on. To keep the break, CHANGE TO the line with its counted layers. Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded. A KEEP does not cure this item.';
const __ecfR=i=>i.rule!=='E-COL'?'':'\nTHE RULE (E-COL, ENFORCED, pkgECF): a collision line breaks a link by meaning only when the answer\'s own words cannot agree with the meaning pressed; a rival reading of a contested word, footed by the answer\'s own layers, is not a break. To keep the line, KEEP it with a sentence that quotes both sides of the conflict: at least 6 words in a row of the answering side\'s own words (its FAILS words may be these), and at least 6 words in a row of the verse those words cannot agree with, as a round quotes it (pkgECF2, W3 2540). For a line resting on an unanswered press, say it was left unanswered and quote the pressing sentence, at least 6 words in a row (ruling 392). Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded (UNDERDETERMINED or STANDS). An item left without either counts against your seat.';
 const msg='An enforcer has read some of your lines against the debate record and reports a violation in each. Its reasons are quoted below. You keep the decision. For each item, KEEP your line or CHANGE it, and give one sentence that quotes the debate\'s own words that decide it. Bring nothing from outside the record.\n\n'
  +items.map(i=>'ITEM '+i.sid+' ('+i.rule+(i.item?', '+cut(i.item,200):'')+'):\nYOUR LINE: '+cut(i.line,1500)+'\nTHE ENFORCER: '+cut(i.reason,900)+hold421(i)+__ecfR(i)+__eclR(i)+__undR(i)+__absR(i)).join('\n\n')
  +'\n\nThis reply is not a judgment and is not JSON: write plain lines only.\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\nSENDBACK: <item id> || KEEP || <one sentence quoting the words that decide it>\nSENDBACK: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>';
 // xAI (operator, option A): for an x-ai/ seat, the judge's reply exactly as Grok wrote it, so the conversation is only appended to and the
// wrapper can hand its reasoning back; chosen only when it reads, as said[] is read, to the same text. Otherwise said[seat] as before.
let asst=said[seat];if(/^x-ai\//.test(String(j.api_model||j.body.model||''))){const XN=['Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter','Panel Reserve openrouter','Panel Cure Call 1 openrouter','Panel Cure Call 2 openrouter','Panel Cure Call 3 openrouter'];const rd=t=>textOf(t).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();for(const xn of XN){let xa=[];try{if(!$(xn).isExecuted)continue;xa=$(xn).all();}catch(xe){continue;}for(const xi of xa){const xj=(xi&&xi.json)||{};const xc=xj.choices&&xj.choices[0]&&xj.choices[0].message&&xj.choices[0].message.content;if(/^x-ai\//.test(String(xj.model||''))&&typeof xc==='string'&&rd(xc)===said[seat])asst=xc;}}}
const body={...j.body,messages:[...j.body.messages,{role:'assistant',content:asst},{role:'user',content:msg+__agrTail(j.body.messages)}]};
 out.push({json:{sb_skip:false,seat,api_model:j.api_model,run_token:PB.run_token||null,items:items.map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line,reason:i.reason,ecl:i.ecl||null,und:i.und||null,abs:i.abs||null})),msg,body}});}
if(!out.length)return skip('no disagreement could be sent',not_sent);
out[0].json.sb_not_sent=not_sent;return out;
