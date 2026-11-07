const __L={"C1 Call anthropic":()=>$('C1 Call anthropic'),"C1B Extract":()=>$('C1B Extract'),"C2 Call anthropic":()=>$('C2 Call anthropic'),"C2B Extract":()=>$('C2B Extract'),"C3 Call anthropic":()=>$('C3 Call anthropic'),"C3B Extract":()=>$('C3B Extract'),"C4 Call anthropic":()=>$('C4 Call anthropic'),"D1 Call anthropic":()=>$('D1 Call anthropic'),"D1 Extract":()=>$('D1 Extract'),"D2 Call anthropic":()=>$('D2 Call anthropic'),"D2B Extract":()=>$('D2B Extract'),"D3 Build":()=>$('D3 Build'),"D3 Call anthropic":()=>$('D3 Call anthropic'),"D3B Extract":()=>$('D3B Extract'),"D4 Call anthropic":()=>$('D4 Call anthropic'),"D4 Lexicon Sheet":()=>$('D4 Lexicon Sheet'),"D4 Verse Sheet":()=>$('D4 Verse Sheet'),"D4 Words Sheet":()=>$('D4 Words Sheet'),"Init Seats":()=>$('Init Seats'),"Init with Guards":()=>$('Init with Guards'),"Resolve Seats":()=>$('Resolve Seats')}; /* pkgPTA: literal names only */
// ======== judge_fix9 (PROVEN_STRUCTURE_DRAFT_v2; rulings 396-402): shared libraries ========
// judge_fix9 S4 (PROVEN_STRUCTURE_DRAFT_v2 section 5; Worker_E B2-B4, Worker_G1 D8): the [L2] check and the [L2] sheet, one library (L2C).
// An [L2] tag names a Hebrew or Greek word (script, transliteration or Strong's number). The word is matched to the lexicon's dictionary form
// (lexicon_words.transliteration / original_script), accents and the beta-code letters normalized (q theta, h eta, w omega, v final sigma, c chi,
// x xi, y psi, f phi), Hebrew attached prefixes stripped (ha-, ve-, be-, le-, ke-, mi-, she-; the table's "/" splits); the Strong's number of the
// matched row counts the tag when that number occurs (original_words) in a verse the same block cites. The inflected form of the verse
// (original_words.transliteration) is a second route; a Strong's number written directly is matched by itself. The block is the LINK block or the
// numbered premise item that holds the tag, otherwise its paragraph (the span the footing reader reads). Statuses per tag: COUNTED; NOT COUNTED
// ("not in the cited verse", or "no Hebrew or Greek word named", or "its block cites no verse"); UNVERIFIABLE (an Apocrypha verse: the
// original-words table holds the 66 books only; or the cited verse's words were not read this run); a tag that names no Hebrew or Greek word is
// no [L2] claim and is IGNORED (coordinator, 2026-11-03). Every cited verse is read: the reads are paginated, one request per batch of
// verses, with no verse cap. Counts of occurrences are recomputed from
// original_words in verses and in tokens; a count that matches neither is "DIFFERS FROM THE RECORD (n verses, m tokens)", not "wrong" (the table
// follows one text base per Testament; operational_doc 13). Only the matched words, statuses and counts reach the judges; no gloss does.
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
 // pkgL2R: a word named only as the root of another ("from *nomos*", "from the root X", "derived from G3551") is marked root:true
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"\u201c\u201d\u2018\u2019'(,:]*$/i;
 const LETTER=/[a-z\u00e0-\u024f\u1e00-\u1eff\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff\u02bc\u02bb]/i;
 function markRoots(seg,wds){const s=String(seg||'');const lo=s.toLowerCase();const R=new Set();
  const occ=w=>{const out=[];const k=String(w.w).toLowerCase();const sm=w.kind==='strongs'?k.match(/^([gh])(\d+)$/):null;
   if(sm){for(const x of s.matchAll(new RegExp('\\b'+sm[1]+'0*'+sm[2]+'\\b','gi')))out.push(x.index);return out;}
   let i=-1;while((i=lo.indexOf(k,i+1))>=0){const b=i>0?lo[i-1]:'',a=lo[i+k.length]||'';if((b&&LETTER.test(b))||(a&&LETTER.test(a)))continue;out.push(i);}return out;};
  const pos=wds.map(occ);
  // pass 0: the root phrase stands just before the word; pass 1: a word in parentheses just after a root word ("from *nomos* (G3551)")
  const rootAt=(i,pass)=>{const pre=s.slice(Math.max(0,i-60),i);if(ROOTPRE.test(pre))return true;if(!pass)return false;
   const m=pre.match(/([^\s(*_"\u201c\u201d]+)[*_"\u201d\u2019]*\s*\(\s*$/);if(!m)return false;const j=i-pre.length+pre.lastIndexOf(m[1]);
   return wds.some((w,k)=>R.has(k)&&pos[k].includes(j));};
  for(let pass=0;pass<2;pass++)wds.forEach((w,k)=>{if(R.has(k)||!pos[k].length)return;if(pos[k].every(i=>rootAt(i,pass)))R.add(k);});
  return wds.map((w,k)=>R.has(k)?{...w,root:true}:w);}
 function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));{const __pa=t.slice(i+4,i+12);if(/^\s*[,;.)]/.test(__pa)&&!/\b[GH]0*\d{1,5}\b|[\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]|(?:^|[^*\w])[*_][^*_\n]{2,60}[*_]/.test(seg)){const __ls=t.lastIndexOf('\n',i-1)+1;let __ps=__ls;for(const __m of t.slice(__ls,i).matchAll(/\[L[1-4]\]/g))__ps=__ls+__m.index+4;const __pre=t.slice(Math.max(__ps,i-500),i);if(tagWords(__pre).length)seg=__pre;}} /* pkgL2B (W3 2876): a tag written after its words ([L2], or [L2].) reads the words before it */
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   let wds=tagWords(seg);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));const w2=tagWords(seg2);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);const own=refsIn(seg);const __ls=t.lastIndexOf('\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\n',i));const __line=t.slice(__ls,__le);const __press=/--\s*MEANS\s*:/.test(t.slice(__ls,i)); /* s429 F4: a press line's [L2] is read against that line's verses */const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
   wds=markRoots(seg,wds); /* pkgL2R */
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
   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);const at=m.ok?read.filter(k=>(IX.V[k]||[]).some(r=>numOf(r.strongs_number)===m.num)):[];
    return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null,...(wd.root?{root:true}:{}),...(at.length?{in:at.join(', ')}:{})};});
   const core=ws.some(w=>!w.root)?ws.filter(w=>!w.root):ws; /* pkgL2R: a root the tag names does not decide it */
   let status,why;
   if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length&&t.apoc&&t.apoc.length){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+'): the original-words table holds the 66 books only';}
   else if(!ws.length){status='IGNORED';why='names no Hebrew or Greek word: not an [L2] claim';}
   else if(!vs.length){status='NOT COUNTED';why='its block cites no verse';}
   else if(core.every(w=>w.ok)){status='COUNTED';why=ws.map(w=>w.w+' = '+(w.ok?w.num:'root, not in the cited verse')).join(', ');}
   else if(read.length<vs.length){status='UNVERIFIABLE';why='the words of '+vs.filter(k=>!RD.has(k)).join(', ')+' were not read this run';}
   else if(t.apoc&&t.apoc.length&&!ws.some(w=>w.ok)){status='UNVERIFIABLE';why='Apocrypha ('+t.apoc.join(', ')+')';}
   else{status='NOT COUNTED';why='not in the cited verse: '+core.filter(w=>!w.ok).map(w=>w.w).join(', ')+' (cited: '+vs.join(', ')+')';}
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
// ======== end judge_fix9 libraries ========
// ======== judge_fix9 (PROVEN_STRUCTURE_DRAFT_v2; rulings 396-402): shared libraries ========
// judge_fix9: the footing reader of fix set 8 (lbFoot, R5 as amended by ruling 400), bundled for a node that has none of its own
const PRS_LB=(()=>{const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_GLOSS=/(?:^|[\s(,;:"“'‘])[*_]*([^\s()"“”,;:]{2,24}(?:\s+[^\s()"“”,;:]{2,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');
 if(!full){const c=t.search(/^[ \t>*_#-]*(?:the\s+)?pressed(?:\s+(?:verses|witnesses))?\s*[.:]/im);if(c>0)t=t.slice(0,c);}
 const met=new Set();const src=/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b/i.test(t);let first=null;
 for(const s of t.split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const refs=[...s.matchAll(LB_REF)].map(m=>m[0].replace(/\.\s/,' '));
  const hasQ=/["“][^"”\n]{4,}?["”]|(?:^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/.test(s);

  for(const m of s.matchAll(LB_TL)){const w=m[2];const last=w.split(/\s+/).pop();if(DRV_TL_STOP.test(last)||DRV_TL_STOP.test(w.split(/\s+/)[0]))continue;
   if(DRV_SRC.test(w)||m[1]||src){met.add('L2');break;}}
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(\s*["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*\)/g)){if(m[2].split(/\s+/).some(w=>!DRV_TL_STOP.test(w)&&!/^[A-Z]/.test(w))){met.add('L2');break;}} // an italic source word with its meaning
  if(DRV_SRC.test(s.replace(LB_REF,' ').replace(/["“][^"”]*["”]/g,' '))&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(s))met.add('L2');}
 // each quotation with the reference it carries (written just after it in brackets, or the nearest reference before it): the first verse quoted
 // is [L1]; any other verse quoted after it is [L3] (ruling 400). Quotations in one sentence are read one by one.
 {const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)].map(m=>({a:m.index,b:m.index+m[0].length}));
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}}
 return [...met].sort();}
return lbFoot;})();
// judge_fix9 S3 (rulings 398, 399; PROVEN_STRUCTURE_DRAFT_v2 sections 3 and 4): every press under a listed premise's PRESSED WITH: is parsed,
// not judged, in one fixed form:
//   <reference> "<KJV quote>" -- MEANS: <one sentence> -- <[L2] word (meaning) | [L3] reference "quote"> | PROVEN IN [<round>]
// [L1] is the quoted verse itself. PROVEN: a MEANS sentence and, in place, an [L2] (a word with its meaning in brackets; not one the [L2] check
// marks NOT COUNTED) or an [L3] (another verse, with its reference and a quotation). PROVEN BY REFERENCE: a MEANS sentence and PROVEN IN [<round>],
// checked by code: the round exists and is not later than the round that presses; the verse is quoted there with its reference; and the block
// that quotes it (its LINK block or numbered premise item, otherwise its paragraph) carries two layer kinds by the footing reader of fix set 8
// (ruling 400: the first verse quoted is [L1], any other verse quoted after it is [L3]; a word with its meaning is [L2]). Whether that block
// states the same meaning is the judge's to confirm on a REFERENCE line (K-R). Otherwise UNPROVEN: a bare claim, shown "not a witness (ruling
// 398)"; leaving it unanswered costs the other side nothing. Only the first 8 distinct verses under one premise are read (ruling 393).
const PRS=(()=>{
 const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
 const REF='(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?\\.?\\s\\d{1,3}:\\d{1,3}(?:\\s?[-–]\\s?\\d{1,3})?';
 // an entry opens at a reference followed by its quotation, at the start of the segment, a line or a bullet, or after ";"
 const START=new RegExp('(^|[;\\n]|^\\s*[-*•]|\\n\\s*[-*•])\\s*[*_]*\\s*('+REF+')[*_]*\\s*[:,]?\\s*(?=["“])','g');
 const keysOf=t=>{try{return [...new Set(REFP.keys(String(t||''),{scoped:true,cap:12}).map(k=>k.key))];}catch(e){return [];}};
 const QUOTE=/["“]([^"”\n]{2,}?)["”]/;
 function entries(seg){const s=String(seg||'').replace(/^[\s*_]*PRESSED WITH\s*:\s*/i,'');const at=[];let m;START.lastIndex=0;
  while((m=START.exec(s))){const i=m.index+m[1].length;if(!at.length||i>at[at.length-1])at.push(i);if(START.lastIndex===m.index)START.lastIndex++;}
  if(!at.length){const k=keysOf(s);return k.length?[{text:s.trim(),ref:k[0],keys:k,quote:null,means:null,l2:[],l3:[],round:null,form:false}]:[];}
  return at.map((a,j)=>parse(s.slice(a,j+1<at.length?at[j+1]:s.length).replace(/^[;\s]+|[;\s]+$/g,'')));}
 function parse(e){const t=e.replace(/[*_]+/g,'');const head=t.match(new RegExp('^\\s*[-•]?\\s*('+REF+')'));const ref=head?head[1].replace(/\.\s/,' '):null;const keys=ref?keysOf(ref):[];
  const q=t.match(QUOTE);const mi=t.search(/(?:--|—|–)\s*MEANS\s*:/i);let means=null,rest='';
  if(mi>=0){const after=t.slice(mi).replace(/^(?:--|—|–)\s*MEANS\s*:\s*/i,'');const cut=after.search(/\s(?:--|—|–)\s|\s\|\s/);means=(cut<0?after:after.slice(0,cut)).trim();rest=cut<0?'':after.slice(cut);}
  const l2=[],l3=[];
  for(const x of rest.matchAll(/\[L2\]\s*([^|]+?)(?=\s(?:\||--|—|–)\s|$)/g)){const b=x[1].trim();const w=b.match(/^(.{1,80}?)\s*\(\s*([^()]{2,120})\s*\)/);l2.push({text:b,ok:!!(w&&/[A-Za-zÀ-ɏḀ-ỿͰ-Ͽἀ-῿֐-׿]/.test(w[1])&&/[a-z]/i.test(w[2])),word:w?w[1].trim():null});}
  for(const x of rest.matchAll(/\[L3\]\s*([^|]+?)(?=\s(?:\||--|—|–)\s|$)/g)){const b=x[1].trim();const r=b.match(new RegExp('^('+REF+')'));const qq=b.match(QUOTE);const k=r?keysOf(r[1]):[];l3.push({text:b,ok:!!(r&&qq&&k.length&&!k.every(z=>keys.includes(z))),ref:r?r[1]:null});}
  const pr=rest.match(/PROVEN\s+IN\s*\[?\s*((?:CR|DR)[1-4])\s*\]?/i)||t.match(/PROVEN\s+IN\s*\[?\s*((?:CR|DR)[1-4])\s*\]?/i);
  return {text:e.trim(),ref,keys,quote:q?q[1]:null,means:means&&means.length>=8?means:null,l2,l3,round:pr?pr[1].toUpperCase():null,form:mi>=0};}
 // the block of a round that holds position i: its LINK block or numbered premise item, otherwise its paragraph
 function blockAt(T,i){const t=String(T||'');const H=[...t.matchAll(/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b|\**\s*\d+[.)]\s)[^\n]*$/gmi)].map(m=>m.index);
  let a=-1,b=t.length;for(const h of H){if(h<=i)a=h;else{b=h;break;}}
  const pa=t.lastIndexOf('\n\n',i),pb=t.indexOf('\n\n',i);if(a<0)return t.slice(pa<0?0:pa,pb<0?t.length:pb);
  const end=t.slice(a,b).search(/\n\s*\n\s*(?:#{1,4}\s|[A-Z][A-Z' -]{6,}:?\s*\n)/);return t.slice(a,end<0?b:a+end);}
 // the footing reader (fix set 8 R5, as amended by ruling 400), the checkers' lbFoot when present
 const foot=(b)=>{try{if(typeof lbFoot==='function')return lbFoot(b,true);if(typeof PRS_LB==='function')return PRS_LB(b,true);}catch(e){}return footLocal(b);};
 const footLocal=b=>{const t=String(b||'').replace(/[*_]+/g,'');const met=new Set();
  if(/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b|[Ͱ-Ͽἀ-῿֐-׿]|\b[GH]\d{2,5}\b/.test(t)&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(t))met.add('L2');
  const R=[...t.matchAll(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n]{4,}?["”]/g)].map(m=>({a:m.index,b:m.index+m[0].length}));let first=null;
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}
  return [...met].sort();};
 // PROVEN IN [<round>]: the round exists, is not later than the pressing round, quotes the verse with its reference, in a block of two layer kinds
 function refCheck(keys,rk,R,pressRound){if(!rk)return {ok:false,why:'no PROVEN IN round'};const t=R&&R[rk];
  if(typeof t!=='string'||!t.trim())return {ok:false,why:'PROVEN IN ['+rk+']: no such round in this debate'};
  if(pressRound&&ORD.indexOf(rk)>ORD.indexOf(pressRound))return {ok:false,why:'PROVEN IN ['+rk+']: a round after the press'};
  let ks=[];try{ks=REFP.keys(t,{scoped:true,cap:12});}catch(e){ks=[];}const hits=ks.filter(k=>keys.includes(k.key));
  if(!hits.length)return {ok:false,why:'PROVEN IN ['+rk+']: the verse is not named there'};
  for(const h of hits){const after=t.slice(h.pos,h.pos+160);const before=t.slice(Math.max(0,h.pos-220),h.pos);
   const quoted=/^[^\n"“]{0,40}["“][^"”\n]{4,}["”]/.test(after)||/["”][\s*_]*[(\[]?[\s*_]*$/.test(before);if(!quoted)continue;
   const blk=blockAt(t,h.pos);const k=foot(blk);if(k.length>=2)return {ok:true,why:'PROVEN IN ['+rk+']: quoted there, its block carries '+k.join('+'),block:blk.slice(0,1500),kinds:k};
   return {ok:false,why:'PROVEN IN ['+rk+']: its block carries '+(k.length?k.join('+'):'no layer')+', fewer than two layer kinds',kinds:k};}
  return {ok:false,why:'PROVEN IN ['+rk+']: the verse is named there but not quoted with its reference'};}
 // one entry's class. l2bad(text): true when the [L2] check marks that tag NOT COUNTED
 function classify0(e,R,pressRound,l2bad){if(!e.means)return {cls:'UNPROVEN',why:e.form?'its MEANS sentence is missing or too short':'no MEANS sentence (the reference and quotation alone are [L1] only)'};
  const L2=e.l2.filter(x=>x.ok&&!(l2bad&&l2bad(x.text)));const L3=e.l3.filter(x=>x.ok);
  if(L2.length||L3.length)return {cls:'PROVEN',why:'[L1]+'+(L2.length?'[L2] '+L2[0].word:'')+(L2.length&&L3.length?'+':'')+(L3.length?'[L3] '+L3[0].ref:'')};
  if(e.round){const c=refCheck(e.keys,e.round,R,pressRound);return c.ok?{cls:'PROVEN BY REFERENCE',why:c.why,round:e.round,block:c.block}:{cls:'UNPROVEN',why:c.why};}
  const bad=e.l2.filter(x=>x.ok&&l2bad&&l2bad(x.text));
  return {cls:'UNPROVEN',why:bad.length?'its [L2] is NOT COUNTED by the [L2] check':(e.l2.length||e.l3.length)?'its [L2] or [L3] is not in the form (a word with its meaning; a verse with its reference and quotation)':'no [L2] or [L3] layer and no PROVEN IN reference'};}

 // WALL-2024 floor (position 1): after the form test, a press whose MEANS asserts what a named person
 // believed or knew, with no single layer quote holding a verb of that kind and its object, is UNPROVEN, not a witness (ruling 398).
 const FLOOR=(()=>{const MIND=/\b(thought|think|thinks|thinking|believed|believe|believes|supposed|suppose|supposes|knew|know|knows|knowing|known|accounted|account|counted|esteemed|reckoned|considered|took|take|takes|taken)\b/gi;
 const TOOK_TO_BE=/^(took|take|takes|taken)$/i; // a "take" verb counts only in the form "took ... to be"
 const NEG=/\b(not|no|never|nor|none|without|neither)\b/i;
 const PERSON=/^(he|she|they|him|her|joseph|mary|the husband|the man|a husband|a man|the father|his father|elisabeth|zacharias|adam|eve|jacob|abraham|david|herod|jesus|the child|the wife)$/i;
 const TEXT_SUBJECT=/\b(verse|verses|text|row|rows|record|matthew|luke|mark|john|paul|narrator|law|canon|chapter|gospel|word|line|lexicon|greek|hebrew)\b/i;
 const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did own same one'.split(' '));
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z\s']/g,' ');
 const stem=w=>w.replace(/'s$/,'').slice(0,5);
 function claims(means){ // positive belief claims about a person: [{verb, actor, object}]
  const out=[];const m=String(means||'');let x;MIND.lastIndex=0;
  while((x=MIND.exec(m))){const verb=x[1];const before=m.slice(0,x.index);const after=m.slice(x.index+verb.length);
   if(TOOK_TO_BE.test(verb)&&!/^\s+.{0,40}?\bto be\b/i.test(after))continue;
   const pre=before.trim().split(/\s+/).slice(-3).join(' ');
   if(NEG.test(pre))continue;                                   // polarity: denied, not asserted
   if(/\bof\s*$/i.test(before)||/\b(verb|word|sense)\s+of\s*$/i.test(before))continue; // "a verb of knowing" names a word, asserts nothing
   const subjWords=before.trim().split(/\s+/);const last1=(subjWords.slice(-1)[0]||'').replace(/[^A-Za-z]/g,'');const last2=subjWords.slice(-2).join(' ').replace(/[^A-Za-z ]/g,'');
   let actor=null;if(PERSON.test(last1))actor=last1;else if(PERSON.test(last2))actor=last2;
   if(!actor){const clause=before.split(/[,;:]|\bwhich\b|\bthat\b|\bso\b/i).pop();const w=clause.trim().split(/\s+/).map(z=>z.replace(/[^A-Za-z]/g,''));const p=w.find(z=>PERSON.test(z));if(p&&!TEXT_SUBJECT.test(clause))actor=p;}
   if(!actor)continue;                                          // actor: a person, not a text
   const obj=after.split(/[,;.]|\bso\b|\bwhich\b|\band\b/i)[0];
   const objWords=norm(obj).split(/\s+/).filter(w=>w&&!STOP.has(w)&&w.length>=3&&!/^(be|to)$/.test(w));
   out.push({verb,actor,object:objWords});}
  return out;}
 function layerQuotes(e){const q=[];if(e.quote)q.push({kind:'L1',text:e.quote});
  (e.l2||[]).forEach(x=>q.push({kind:'L2',text:x.text}));
  (e.l3||[]).forEach(x=>{const m=String(x.text).match(/["“]([^"”]+)["”]/);q.push({kind:'L3',text:m?m[1]:x.text});});return q;}
 function held(c,quotes){ // one quote holds a verb of that kind AND every object word (WALL-2024 reply after W2's cross-check:
  // the layer side now applies the same verb rule as the MEANS side: a "take" verb counts only in the form "took ... to be";
  // and where the claim's actor is a proper name, the quote must hold that name or a personal pronoun)
  for(const q of quotes){const t=norm(q.text);let hasVerb=false;let x;MIND.lastIndex=0;
   while((x=MIND.exec(q.text))){const after=q.text.slice(x.index+x[1].length);if(TOOK_TO_BE.test(x[1])&&!/^\s+.{0,40}?\bto be\b/i.test(after))continue;hasVerb=true;break;}
   MIND.lastIndex=0;if(!hasVerb)continue;
   if(/^[A-Z]/.test(c.actor)&&!/^(he|she|they|him|her|the |a )/i.test(c.actor)){const re=new RegExp('\\b('+c.actor+'|he|she|him|her|i|me|thou|thee)\\b','i');if(!re.test(q.text))continue;}
   const words=t.split(/\s+/).map(stem);if(c.object.every(o=>words.includes(stem(o))))return q;}
  return null;}
 function floor(e){const cs=claims(e.means);const fails=[];
  for(const c of cs){const q=held(c,layerQuotes(e));if(!q)fails.push(c);}
  return {claims:cs,fails,cls:fails.length?'UNPROVEN':null};}
 return floor;})();
 function classify(e,R,pressRound,l2bad){const c=classify0(e,R,pressRound,l2bad);if(!c||c.cls==='UNPROVEN')return c;let f=null;try{f=FLOOR(e);}catch(x){f=null;}
  if(f&&f.cls==='UNPROVEN'){const k=f.fails[0];return {...c,cls:'UNPROVEN',why:'its MEANS asserts what '+k.actor+' '+k.verb+' ('+k.object.join(' ')+'), and no single layer quote holds a verb of that kind with those words (WALL-2024 floor)'};}return c;}
 // a premise's PRESSED WITH: segment, read whole: the first 8 distinct verses (ruling 393), each with the class of the entry that carries it
 function premise(seg,R,pressRound,l2bad,cap){const CAP=cap||8;const E=entries(seg);const out=[];const seen=new Set();const over=[];
  for(const e of E){const c=classify(e,R,pressRound,l2bad);for(const k of e.keys){if(seen.has(k))continue;if(seen.size>=CAP){if(!over.includes(k))over.push(k);continue;}seen.add(k);out.push({key:k,cls:c.cls,why:c.why,round:c.round||null,means:e.means,text:e.text.slice(0,600),block:c.block||null});}}
  return {verses:out,over,proven:out.filter(x=>x.cls!=='UNPROVEN').map(x=>x.key),unproven:out.filter(x=>x.cls==='UNPROVEN').map(x=>x.key),byRef:out.filter(x=>x.cls==='PROVEN BY REFERENCE')};}
 const RND=F=>({CR1:F.cr1,DR1:F.gr1,CR2:F.cr2,DR2:F.gr2,CR3:F.cr3,DR3:F.dr3,CR4:F.cr4,DR4:F.dr4});
 // the [L2] check (Quote Report) as a test on a press's [L2] text: true when that tag is NOT COUNTED
 const l2bad=res=>{const N=x=>String(x||'').toLowerCase().replace(/[^a-z\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,'').slice(0,40);const bad=(res||[]).filter(t=>t&&t.status==='NOT COUNTED'&&(t.round==='DR2'||t.round==='CR3')).map(t=>N(t.seg)).filter(x=>x.length>=6);return bad.length?(txt=>{const k=N(txt);return k.length>=6&&bad.some(b=>b.startsWith(k.slice(0,Math.min(k.length,b.length)))||k.startsWith(b));}):null;};
 return {entries,parse,classify,refCheck,premise,blockAt,foot,RND,ORD,l2bad};})();
let PWL_R={};
// ======== end judge_fix9 libraries ========
// judge_fix5 G11 (operator: "if they have to pull from our source ... why is the spelling changing"; until now no debater was given KJV text):
// the VERSE SHEET. Before D2, C2, D3, C3, D4 and C4 the KJV text of every verse either side has cited so far (REFP, scoped; a range of more than
// 12 verses gives its first verse only) is read from kjv_verses in ONE request (the node "<round> Verse Sheet"), built here as Citation Scan builds
// its read: one condition per book and chapter (verse.in.(...)), conditions added in the order of first citation while the URL stays within
// 7,000 characters; a verse past that is left off and listed. The Build node prints the rows as stored (bracketed italics and margin notes kept),
// in the order of first citation, capped at SHEET_CAP_VERSES verses and SHEET_CAP_CHARS characters of verse text; every verse left off is listed.
// Round 1 has no sheet of verses cited; the Oracle seat's round 1 gets the verses its served rows name (Init with Guards), and the sheet says so.
const SHEET=(()=>{const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';const URL_MAX=7000;const CAP_V=150,CAP_C=24000;
 const req=texts=>{const seen=new Set();const out=[];for(const t of texts)for(const k of REFP.keys(String(t||''),{scoped:true,cap:12})){if(seen.has(k.key))continue;seen.add(k.key);const m=k.key.match(/^(.+) (\d+):(\d+)$/);if(m)out.push({book:m[1],c:+m[2],v:+m[3],key:k.key});}
  /* judge_fix8 R12 (guard DG-18: never quote Psalm 2:7 without its three NT occasions): a sheet that serves Psalms 2:7 or Acts 13:33 serves Acts 13:33, Hebrews 1:5 and Hebrews 5:5 with it */
  if(seen.has('Psalms 2:7')||seen.has('Acts 13:33'))for(const k of ['Acts 13:33','Hebrews 1:5','Hebrews 5:5']){if(seen.has(k))continue;seen.add(k);const m=k.match(/^(.+) (\d+):(\d+)$/);out.push({book:m[1],c:+m[2],v:+m[3],key:k});}
  return out;};
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
 const __ogrS=t=>{const T=String(t||'');const i=T.search(/OPPONENT['\u2019]?S GRANTS\s*:/i);if(i<0)return T;const L=T.slice(i).split('\n');const G=/^\s*[-*]?\s*\**\s*G(?:\d+|\+)/;let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\n');return T.slice(0,i)+sec.replace(/["\u201c][^"\u201d\n]*["\u201d]/g,'""')+T.slice(i+sec.length);}; /* pkgOGR (3): the quotations of the OPPONENT'S GRANTS section are the defender's words */const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],__ogrS(F.dr4)):[];
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
  const rm=[...t.matchAll(new RegExp(RENUM.source,RENUM.flags.replace('g','')+'g'))].find(m=>!/\b(?:not|no|never|nor|without)\b[^.\n]{0,40}$/i.test(t.slice(Math.max(0,m.index-60),m.index)))||null; /* s429 F3: "I do not add links or renumber" keeps the numbering */if(rm&&/\b[DC]\d+\b/.test(t.slice(Math.max(0,rm.index-200),rm.index+400))){const a=Math.max(0,t.lastIndexOf('\n',rm.index)+1);out.push('it states a numbering of its own ("'+t.slice(Math.max(a,rm.index-40),rm.index+120).replace(/\s+/g,' ').replace(/[\[\]"]/g,'').trim()+'")');}
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
// cacheall: OpenRouter session id for cache stickiness; Gemini and Qwen system message marked for caching.
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
// D4: DEFENDER ROUND 4, CLOSE ROUND (judge_fix3 B1; operator ruling: "we owe both sides a close-out round. Where the defender get to make his
// final defense of this position ... and that includes pressed premise unanswered"). Built, called and checked as D3 is: same seat, system
// prompt, cache markers, OpenRouter session id (__orc) and body per family; no reasoning or effort field.
// claude_direct H2/H3 (operator 2026-11-02, cache diagnostics): the direct Anthropic body. __AID maps the stored OpenRouter id to the direct
// model id ("anthropic/claude-sonnet-5.5" -> "claude-sonnet-5-5"). __DIAGPREV: the seat's previous Claude response id in this run, read from
// the output of that seat's latest executed "<round> Call anthropic" node before this round; null on the seat's first Claude call.
const __RND='D4';const __AID=m=>{const x=String(m||'');return /^anthropic\//.test(x)?x.slice(10).replace(/\./g,'-'):x;};const __AOK=id=>/^claude-(?:opus|sonnet|haiku|fable|mythos)-\d+(?:-\d+)?$/.test(String(id||''));const __AIDV=m=>{const id=__AID(m);if(!__AOK(id))throw new Error('VALIDATION: '+__RND+' the model "'+m+'" maps to the direct Anthropic id "'+id+'", which is not a known form; no call made.'+RT);return id;};
const __DIAGPREV=sd=>{const n=+__RND[1];const top=sd===__RND[0]?n-1:(sd==='D'?n:n-1);for(let k=top;k>=1;k--){let o=null;try{const p=__L[sd+k+' Call anthropic']();if(!p||!p.isExecuted)continue;o=p.first().json;}catch(e){continue;}if(o&&typeof o.id==='string'&&/^msg_/.test(o.id))return o.id;}return null;};
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
 const items=t=>String(t||'').split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x)); // BB-8634 S1: a list line is a numbered line or a LINK n: / LINK none: line
 const side=(pressing,answering,headRe)=>{const i=lastHead(pressing,headRe);if(i<0)return {list:false,premises:[]};
  const list=String(pressing).slice(i);const N=namedIn(answering);
  const premises=items(list).map((x,k)=>{const lk=(x.match(/LINK\s+(\d+|none)\b/i)||[])[1]||null;const seen=new Set();const notNamed=[];let named=0;
   /* judge_fix8 K7, ruling 392: only the verses under PRESSED WITH: (to the item's end or a blank line) are still pressed */
   const pwi=x.search(/PRESSED WITH\s*:/i);let xw=pwi<0?'':x.slice(pwi);{const b=xw.search(/\n\s*\n/);if(b>=0)xw=xw.slice(0,b);}if(/^PRESSED WITH\s*:\s*[*_]*\s*none\b/i.test(xw))xw='';
   let nk=0;const kk=new Set(); /* judge_fix8 R13 (md_notes_rulings 393): only the first 8 pressed verses of a premise are witnesses */
   const PRSP=(typeof PRS!=='undefined'&&xw)?PRS.premise(xw,PWL_R,headRe===CH_RE?'CR3':'DR2',null):null;const unp=[]; /* judge_fix9 S3 */
   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(seen.has(label))continue;const nw=r.cvs.filter(cv=>!kk.has((r.book||r.ctx||'')+' '+cv));if(nk>=8&&nw.length)continue;nw.forEach(cv=>kk.add((r.book||r.ctx||'')+' '+cv));nk+=nw.length;seen.add(label);
    /* judge_fix9 S3 (ruling 398): an unproven press is not a witness and is not listed as still pressed */
    {const ks=r.cvs.map(cv=>(r.book||r.ctx||'')+' '+cv);if(PRSP&&!ks.some(z=>PRSP.verses.some(v=>v.key===z&&v.cls!=='UNPROVEN'))){unp.push(label);continue;}}
    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;else notNamed.push(label);}
   return {n:k+1,link:lk,verses:seen.size,named,notNamed,unp};});
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

// judge_fix3 B1: what is still unanswered against the defender, computed by the system from the rounds (the ledger code that lists the
// opposing side's cited verses): (a) each premise of the challenger's list that closes round 2 with the verses it carries that neither the
// defender's round 2 nor its link round names. judge_fix8 K3 (ruling 392): part (b), every verse the challenger cited that no later defender
// round names, is dropped: a verse cited under no listed premise is not a witness, so it is no longer listed as still pressed.
const RW={cr1:$('D1 Extract').first().json.raw,gr1:$('C1B Extract').first().json.raw,cr2:$('D2B Extract').first().json.raw,gr2:$('C2B Extract').first().json.raw,cr3:$('D3B Extract').first().json.raw,dr3:$('C3B Extract').first().json.raw};
const OPEN=(()=>{try{const LF=String.fromCharCode(10);const out=[];PWL_R=(typeof PRS!=='undefined'?PRS.RND(RW):{}); /* judge_fix9 S3 */
 const s=PWL.side(RW.gr2,String(RW.cr2||'')+LF+String(RW.cr3||''),PWL.DEF_RE);
 const pl=s.list?s.premises.filter(p=>p.notNamed.length):[];
 out.push('(a) PRESSED PREMISES (the list that closes the challenger\'s round 2), proven presses (md_notes_rulings 398) carried under PRESSED WITH that no defender round after it names:'); // judge_fix8 K7, judge_fix9 S3
 out.push(s.list?(pl.length?pl.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': NOT NAMED: '+p.notNamed.join(', ')).join(LF):'none: every verse those premises carry under PRESSED WITH is named in your round 2 or your link round'):'no premise list was found at the end of the challenger\'s round 2');
 {const up=s.list?s.premises.filter(p=>p.unp&&p.unp.length):[];if(up.length)out.push('(b) UNPROVEN PRESSES, not witnesses (md_notes_rulings 398: no MEANS sentence with an [L2] or [L3], and no checked PROVEN IN reference); leaving them unanswered costs you nothing: '+up.map(p=>'premise '+p.n+': '+p.unp.join(', ')).join('; '));} /* judge_fix9 S3 */
 return 'STILL UNANSWERED AGAINST YOUR CHAIN -- computed by the system from the transcript, not by a model; a verse listed here is unanswered by the rule until a round of yours names it and answers it:'+LF+out.join(LF);}catch(e){return 'STILL UNANSWERED AGAINST YOUR CHAIN: the system could not compute the list this run; answer every witness the challenger pressed that your rounds have not named.';}})();

// judge_fix5 G1 (run 32284: the defender's close "I have not seen the text of my round 1 declaration"): the close request carries the defender's
// round 1 DECLARED CHAIN verbatim and the [DR3] C list, both read by code (C4P.declared, C4P.cblocks), with the instruction to keep those numbers.
const G1F={cr1:$('D1 Extract').first().json.raw,dr3:$('C3B Extract').first().json.raw};
const G1DECL=(()=>{try{const d=C4P.declared(G1F);return d?'YOUR DECLARED CHAIN -- your round 1 DECLARED CHAIN, copied verbatim by the system. Keep these numbers in this round: D<n> is link n of this list and no other link; do not renumber, relabel or reorder the links:\n'+d:'YOUR DECLARED CHAIN: the system found no DECLARED CHAIN heading in your round 1; keep the numbers your round 1 gave its links.';}catch(e){return '';}})();
const G1CL=(()=>{try{const c=C4P.cblocks(G1F);return c.length?'THE C NUMBERS -- the LINK blocks of the challenger\'s round 3 link round, in its order, read by the system; C<j> is the j-th block and no other:\n'+c.map(x=>'C'+x.j+' = [DR3] '+x.head.slice(0,220)).join('\n'):'';}catch(e){return '';}})();
const sys=I.dsys;const msgs=[{role:'user',content:'SUBJECT: '+I.topic+'\n\nYou opened as the DEFENDER, holding '+$('Init Seats').first().json.dpos+' of the topic. The challenger\'s LINK ROUND reply follows; in it the challenger answered your premise list and may have pressed further witnesses against your chain:\n\n'+$('C3B Extract').first().json.raw+'\n\n'+(G1DECL?G1DECL+'\n\n':'')+(G1CL?G1CL+'\n\n':'')+OPEN+'\n\nCLOSE ROUND -- your final defense. This is the defender\'s last round; the challenger\'s close follows it and may not press anything new. Make your final defense of your declared chain D1..Dn, and answer every witness pressed against it that is still unanswered: each verse listed above, and above all those the challenger pressed in its link round. For each, write a line ANSWER: <book chapter:verse> -- D<n> -- then quote that verse exactly in the KJV and show from the text why it does not overturn that link. A witness answered in substance, without its book, chapter and verse named and its words quoted, is not counted as answered. You may keep a link (the footing already exhibited), narrow it (NARROWED TO: <the limb you keep>, with its footing) or concede it (CONCEDED); do not add links or re-seat the chain. Keep the numbering: D1..Dn exactly as your round 1 DECLARED CHAIN numbers them, and C1..Cm as the challenger\'s link round numbers its LINK blocks; do not renumber (the system flags a close round that does). This round defends: do not press new witnesses or premises against the challenger, who has no round to answer them; the judges do not count a press made here. Cite every verse by book, chapter and verse and quote it exactly in the KJV.'}];
// judge_fix5 G11: the VERSE SHEET, read by "D4 Verse Sheet" (kjv_verses), appended to the last user message.
const __SHT=(()=>{try{const P=$('C3B Extract').first().json;let rows=[];try{rows=$('D4 Verse Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){rows=[];}return SHEET.text(rows,{sheet_req:P['sheet_req']||[],sheet_off_url:P['sheet_off_url']||[]},'the KJV text of every verse cited so far in this debate, by either side, in the order first cited.');}catch(e){return '';}})();
if(__SHT){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__SHT};break;}}}
// judge_fix9 S2 (md_notes_rulings 397-400): every critical point carries its layers; appended to the round's last user message.
const __PROVE9="PROVEN STRUCTURE (md_notes_rulings 397 to 400: the layers are the language of this debate). Every critical point you write carries its layers: a declared link, a listed premise's supporting block, a press, an answer to a press, and every [L4]. [L1] is a KJV verse quoted with its book, chapter and verse. [L2] is a Hebrew or Greek word named (its dictionary form, transliteration or Strong's number) with its meaning; it counts only when the word stands in a verse the same block cites. [L3] is any further verse quoted with its reference after the [L1] verse, as its support (ruling 400). [L4] is an inference: it stands only on two lower layer kinds and the chain from them. At a critical point, a statement of what a verse means without its layers is a bare claim and carries no weight. An answer to a press shows, with layers, how the witness's meaning fits your link; restating your link's own footing while passing over the witness is not an answer. The charge sentence of a premise list (that the other side's inference lacks footing) is exempt; the witnesses under it carry the layers. A count of occurrences names its unit, verses or tokens (for example \"H5959: 7 verses\"); the system recomputes it from the record.";
// judge_fix9 S4: the [L2] SHEET (original_words and lexicon_words, read by "D4 Words Sheet" and "D4 Lexicon Sheet"), served to both seats alike; the judges never see it.
const __L2S=(()=>{try{if(typeof L2C==='undefined')return '';const P=$('C3B Extract').first().json;let ow=[],lx=[];try{ow=$('D4 Words Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){ow=[];}try{lx=$('D4 Lexicon Sheet').all().map(i=>i.json).filter(x=>x&&x.strongs_number);}catch(e){lx=[];}return L2C.sheet(ow,lx,P);}catch(e){return '';}})();
{const __X9=[__PROVE9,__L2S].filter(Boolean).join('\n\n');for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__X9};break;}}}
// Z.ai context caching (operator, 2026-11-04: set up according to the vendor): a z-ai/ debater's round continues its own conversation,
// the previous round's messages and its reply, then this round's message unchanged. Any other model, or a missing piece: as before.
const __ZH=(side,prev,seat,ms)=>{if(!(seat&&seat.fam==='openrouter'&&/^z-ai\//.test(String(seat.model||''))))return ms;try{const pb=__L[side+prev+' Build']().first().json.call.body;const raw=__L[side+prev+'B Extract']().first().json.raw; /* pkgBAR */if(!pb||!Array.isArray(pb.messages)||typeof raw!=='string'||!raw)return ms;return pb.messages.filter(m=>m&&m.role!=='system').concat([{role:'assistant',content:raw}],ms);}catch(e){return ms;}};
return [{json:{run_token:TOK,round:'D4',open_list:OPEN,call:call(R.defender,sys,__ZH('D','3',R.defender,msgs))}}];
