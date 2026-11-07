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
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
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
// pkgPMR (B5): a bare reference after a quotation keeps, as its alt, the same chapter:verse in the book named in plain words in its clause
const __PMX=new Set(['John','James','Jude','Mark','Timothy','Titus','Philemon']);const __PMW=/(?<![A-Za-z0-9])((?:[1-3]\s)?[A-Z][a-z]+(?:\s(?:of\s)?[A-Z][a-z]+)?)(?![A-Za-z0-9])(?!\.?\s*\d{1,3}:\d)/g;
const __pmrAlt=(t,m,book)=>{const st=clauseAt(t,m.index);const mk=QMASK.get(String(t))||String(t);let nb=null;for(const x of mk.slice(st,m.index+m[0].length).matchAll(__PMW)){const i=BOOKS.indexOf(x[1]);if(i>=0&&i<66&&!__PMX.has(x[1]))nb=x[1];}
 return nb&&nb!==book?{alt:{ref:nb+' '+m[3]+':'+m[4],book:nb,chapter:+m[3],verse:+m[4],from:'the book named in the prose beside the bare reference'}}:{};};
const rounds=[['DEFENDER','R1',F.cr1],['CHALLENGER','R1',F.gr1],['DEFENDER','R2',F.cr2],['CHALLENGER','R2',F.gr2],['DEFENDER','R3',F.cr3],['CHALLENGER','R3',F.dr3]].concat(F.cr4?[['DEFENDER','R4',F.cr4]]:[],F.dr4?[['CHALLENGER','R4',F.dr4]]:[]).concat(F.synthesis?[['SYNTHESIS','S',F.synthesis]]:[]); // judge_fix9 S5: the synthesis's quotations are checked too // judge_fix3 B3: the close rounds' quotations are checked too
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
const SEGS=s=>String(s).split(/(?:…|\.\.\.)(?!:)/).map(x=>x.replace(/\*+/g,'').trim()).filter(Boolean);
const QN=s=>String(s).replace(/\*+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/(?:…|\.\.\.)(?!:)/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const PROSE=rounds.map(x=>QN(String(x[2]||'').replace(/[“"][^”"\n]{1,400}[”"]/g,' | ')));
const OPP=(ri,q)=>{const n=QN(q).replace(/^[\s.,;:!?'"]+|[\s.,;:!?'"]+$/g,'');return n.length>=12&&rounds.some((x,j)=>j<ri&&x[0]!==rounds[ri][0]&&PROSE[j].includes(n));};
// DoD 14 (BB-7397 rev 7; the operator's 1, BB-7495): "A quotation of the other side's own words, quoted under the pressing rule, is not a scripture
// citation and is not checked against the KJV text." Tested by the text, not by a cue phrase (BB-7498, ruled BB-7499): opp_words is true when the
// quotation's words, folded as QN folds them and with quote marks removed, occur in an earlier round of the other side, quoted or not; "..." splits
// the quotation into pieces that must occur there in order. Quote Report leaves out such an item only when its status is WORDING NOT FOUND.
const QF=s=>QN(s).replace(/["']/g,'').replace(/\s+/g,' ').trim();
const FULL=rounds.map(x=>QF(String(x[2]||'')));
const OPPW=(ri,raw)=>{const ps=String(raw).split(/(?:…|\.\.\.)(?!:)/).map(p=>QF(p).replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g,'')).filter(Boolean);
 if(ps.join(' ').length<12)return false;
 return rounds.some((x,j)=>{if(j>=ri||x[0]===rounds[ri][0])return false;let at=0;for(const p of ps){const k=FULL[j].indexOf(p,at);if(k<0)return false;at=k+p.length;}return true;});};
// BB-7397 rev 9 DoD 22 (rulings 98 extended to a shortened quote): opp_short is true when the quotation's words (folded as QF folds them, at
// least 6) occur in order inside one sentence of an earlier round of the other side, the matched span of that sentence holding at most twice
// the quotation's word count. Quote Report leaves out such an item only when its status is WORDING NOT FOUND.
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
  const quote=m[5].replace(/(?:…|\.\.\.)(?!:)/g,' ').replace(/\*+/g,'').trim();const segs=SEGS(m[5]);const ref=book+' '+m[2]+':'+m[3]+(m[4]||'').replace(/\s/g,'');
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
  const quote=m[1].replace(/(?:…|\.\.\.)(?!:)/g,' ').replace(/\*+/g,'').trim();const segs=SEGS(m[1]);const ref=book+' '+m[3]+':'+m[4]+(m[5]||'').replace(/\s/g,'');
  const k2=side+'|'+round+'|'+ref+'|'+quote.toLowerCase();if(seen.has(k2))continue;seen.add(k2);
  items.push({ref,book,chapter:+m[3],v1,v2,...(PS.length>1?{parts:PS}:{}),quote,segs,side,round,order:'quote-first',...(m[2]?{}:__pmrAlt(t,m,book)),cite_form:!/\d/.test(m[1])&&!OPP(ri,m[1])&&!((R===rqP||R===rqBP)&&/\b(?:not|never|nor|no)\b/i.test(m[0].slice(m[1].length+2,m[0].indexOf('(',m[1].length+2)))),opp_words:OPPW(ri,m[1]),opp_short:OPPS(ri,m[1]),...LB(t,round,m.index+1)});}}}
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
// judge_fix9 S4: the [L2] tags of the debaters' rounds, the verses their blocks cite (read by "L2 Words"), and the count claims;
// S5: the synthesis is scanned for a verdict (recorded, never counted)
const __L2T=(()=>{try{const RA=[['DEFENDER','CR1',F.cr1],['CHALLENGER','DR1',F.gr1],['DEFENDER','CR2',F.cr2],['CHALLENGER','DR2',F.gr2],['DEFENDER','CR3',F.cr3],['CHALLENGER','DR3',F.dr3],['DEFENDER','CR4',F.cr4],['CHALLENGER','DR4',F.dr4]].filter(x=>x[2]);
 const TG=L2C.tags(RA);const keys=[...new Set(TG.flatMap(t=>t.verses))];return {l2_tags:TG,l2_urls:L2C.wordsUrls(keys).map(x=>x.url),l2_read:keys,l2_claims:L2C.countClaims(RA)};}catch(e){return {l2_tags:[],l2_urls:[],l2_read:[],l2_claims:[],l2_error:String(e.message||e).slice(0,200)};}})(); // every verse read, in batches (no cap)
const __SYV=(()=>{const t=String(F.synthesis||'');if(!t)return [];const RX=/\b(?:the\s+)?(?:defender|challenger|defen[cs]e)(?:'s\s+(?:case|chain|position))?\s+(?:wins|won|prevails|prevailed|carries|carried|has\s+the\s+stronger|is\s+(?:right|correct|vindicated))\b|\bverdict\s*:|\b(?:the\s+)?(?:defender|challenger)(?:'s\s+(?:case|chain|link))?\s+(?:holds|stands|fails|collapses|is\s+broken)\b|\bwinner\b/gi;const out=[];let m;while((m=RX.exec(t))&&out.length<10)out.push(t.slice(Math.max(0,m.index-60),m.index+m[0].length+40).replace(/\s+/g,' ').trim());return out;})();
return [{json:{...__L2T,synth_verdict:__SYV,items:items3.map(i=>(i.parts||[{chapter:i.chapter}]).every(p=>readK.has(i.book+'|'+p.chapter))?i:{...i,unread:true}).concat(over),scanned:items.length,item_cap:ITEM_CAP,url_cited:url,chapters_cited:Object.keys(VG).length,chapters_read:conds.length}}];
