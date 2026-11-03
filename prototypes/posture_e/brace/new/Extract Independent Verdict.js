// ======== judge_fix9 (PROVEN_STRUCTURE_DRAFT_v2; rulings 396-402): shared libraries ========
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
 function classify(e,R,pressRound,l2bad){if(!e.means)return {cls:'UNPROVEN',why:e.form?'its MEANS sentence is missing or too short':'no MEANS sentence (the reference and quotation alone are [L1] only)'};
  const L2=e.l2.filter(x=>x.ok&&!(l2bad&&l2bad(x.text)));const L3=e.l3.filter(x=>x.ok);
  if(L2.length||L3.length)return {cls:'PROVEN',why:'[L1]+'+(L2.length?'[L2] '+L2[0].word:'')+(L2.length&&L3.length?'+':'')+(L3.length?'[L3] '+L3[0].ref:'')};
  if(e.round){const c=refCheck(e.keys,e.round,R,pressRound);return c.ok?{cls:'PROVEN BY REFERENCE',why:c.why,round:e.round,block:c.block}:{cls:'UNPROVEN',why:c.why};}
  const bad=e.l2.filter(x=>x.ok&&l2bad&&l2bad(x.text));
  return {cls:'UNPROVEN',why:bad.length?'its [L2] is NOT COUNTED by the [L2] check':(e.l2.length||e.l3.length)?'its [L2] or [L3] is not in the form (a word with its meaning; a verse with its reference and quotation)':'no [L2] or [L3] layer and no PROVEN IN reference'};}
 // a premise's PRESSED WITH: segment, read whole: the first 8 distinct verses (ruling 393), each with the class of the entry that carries it
 function premise(seg,R,pressRound,l2bad,cap){const CAP=cap||8;const E=entries(seg);const out=[];const seen=new Set();const over=[];
  for(const e of E){const c=classify(e,R,pressRound,l2bad);for(const k of e.keys){if(seen.has(k))continue;if(seen.size>=CAP){if(!over.includes(k))over.push(k);continue;}seen.add(k);out.push({key:k,cls:c.cls,why:c.why,round:c.round||null,means:e.means,text:e.text.slice(0,600),block:c.block||null});}}
  return {verses:out,over,proven:out.filter(x=>x.cls!=='UNPROVEN').map(x=>x.key),unproven:out.filter(x=>x.cls==='UNPROVEN').map(x=>x.key),byRef:out.filter(x=>x.cls==='PROVEN BY REFERENCE')};}
 const RND=F=>({CR1:F.cr1,DR1:F.gr1,CR2:F.cr2,DR2:F.gr2,CR3:F.cr3,DR3:F.dr3,CR4:F.cr4,DR4:F.dr4});
 // the [L2] check (Quote Report) as a test on a press's [L2] text: true when that tag is NOT COUNTED
 const l2bad=res=>{const N=x=>String(x||'').toLowerCase().replace(/[^a-z\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,'').slice(0,40);const bad=(res||[]).filter(t=>t&&t.status==='NOT COUNTED'&&(t.round==='DR2'||t.round==='CR3')).map(t=>N(t.seg)).filter(x=>x.length>=6);return bad.length?(txt=>{const k=N(txt);return k.length>=6&&bad.some(b=>b.startsWith(k.slice(0,Math.min(k.length,b.length)))||k.startsWith(b));}):null;};
 return {entries,parse,classify,refCheck,premise,blockAt,foot,RND,ORD,l2bad};})();
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
 function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   let wds=tagWords(seg);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));const w2=tagWords(seg2);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);const own=refsIn(seg);const vs=[...new Set(own.concat(refsIn(blk)))];const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
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
let PRS_L2BAD=null;
// judge_fix9 S1, S3, S4, S6: the new TRIAL checks of the judges' text (ENF_STATUS TRIAL: logged and answered in the cure; they remove no seat).
//  K-P (S6, ruling 398): a seat counts a premise UNEXHIBITED on a press the ledger marks UNPROVEN, or grades a link BROKEN resting, as unanswered,
//      on such a press (raised inside drvPressWith and drvBrokenPW, where K-G10 and K-G11 now count proven presses only); and K-G1/K-G4 are not
//      raised on a BROKEN line whose unanswered verses are all unproven presses (prsUnprovenOnly; K-P reads that line).
//  K-F (S1, ruling 396): a FORCED line whose three quotations (the pressing side's MEANS sentence with its layers, the holding side's answer, the
//      layer of the answer that fails) do not each stand in the round named; a malformed FORCED line; a LINK BROKEN line that rests on a forced link
//      (forced, cannot take, does not fit, ruling 396) with no FORCED line for its item.
//  K-R (S3, ruling 399): a press the ledger marks PROVEN BY REFERENCE with no REFERENCE line naming its verse, or a REFERENCE line whose first
//      quotation the referenced round does not hold or whose second is not the press's MEANS sentence.
//  K-L2 (S4): an [L2] of the seat's own, in a COLLISION POINTS line, whose word is in no verse that line cites (the [L2] check, original_words).
const PRS_CTX={R:null};
// the [L2] check rows of this run (Quote Report), read without naming the node accessor in a library line
function l2Data(){try{const g=(typeof $==='function')?$:null;return g?(g('Quote Report').first().json.l2_data||null):null;}catch(e){return null;}}
// K-G1 and K-G4 are not raised on a BROKEN line whose unanswered verses are all presses the ledger marks UNPROVEN
function prsUnprovenOnly(line,side){try{const R=PRS_CTX.R;if(!R)return false;const PL=pwList(R,side);if(!PL)return false;const T=String(line||'').replace(/[*_`]+/g,'');
 const U=pwUnans(T);if(!U.length)return false;const P=new Set(),A=new Set();PL.forEach(p=>{p.keys.forEach(k=>P.add(k));(p.all||p.keys).forEach(k=>A.add(k));});
 return !U.some(k=>P.has(k))&&U.some(k=>A.has(k));}catch(e){return false;}}
const KF_LINE=/^\s*(?:[-•]|\d+[.)])?\s*FORCED\s*:\s*(D\d+\s+vs\.?\s+C\d+)\s*(?:--|—|–)\s*MEANS\s*\[{0,2}\s*((?:CR|DR)[1-4])\s*\]{0,2}\s*:?\s*["“](.+?)["”](?:\s*\([^\n]*?\))?\s*(?:--|—|–)\s*ANSWER\s*\[{0,2}\s*((?:CR|DR)[1-4])\s*\]{0,2}\s*:?\s*["“](.+?)["”](?:\s*\([^\n]*?\))?\s*(?:--|—|–)\s*FAILS\s*:?\s*["“](.+?)["”](?:\s*(?:--|—|–|\(|;|,|:)[^\n]*)?\s*\.?\s*$/i; /* judge_fix10 K-F reader: [[CR3]], a (layers) note after a quotation, and a reason after FAILS are read (ruling 411) */
const KF_GROUND=/\bforced\b|\bcannot\s+take\b|\bcan(?:no|')t\s+(?:take|fit|bear)\b|\bdoes\s+not\s+fit\b|\bruling\s+396\b|\b396\b/i;
function kfLines(text,R){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const forced=new Set();
 for(const raw of T.split('\n')){const l=raw.trim();if(!/^(?:[-•]|\d+[.)])?\s*FORCED\s*:/i.test(l))continue;const m=l.match(KF_LINE);
  if(!m){const id=(l.match(/D\d+\s+vs\.?\s+C\d+/i)||['FORCED'])[0].replace(/\s+vs\.?\s+/i,' vs ');items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:'malformed'});
   marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+': the FORCED line is not in the form FORCED: D<i> vs C<j> -- MEANS [<round>]: "<...>" -- ANSWER [<round>]: "<...>" -- FAILS: "<...>". TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');continue;}
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');forced.add(id);const bad=[];
  if(typeof R[m[2].toUpperCase()]!=='string'||!ciFound(m[3],R[m[2].toUpperCase()]))bad.push('the MEANS quotation is not in ['+m[2].toUpperCase()+']');
  if(typeof R[m[4].toUpperCase()]!=='string'||!ciFound(m[5],R[m[4].toUpperCase()]))bad.push('the ANSWER quotation is not in ['+m[4].toUpperCase()+']');
  if(typeof R[m[4].toUpperCase()]!=='string'||!ciFound(m[6],R[m[4].toUpperCase()]))bad.push('the FAILS quotation is not in ['+m[4].toUpperCase()+']');
  if(!bad.length)continue;items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:bad.join('; ')});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+': '+bad.join('; ')+' (ruling 396: the meaning weighed is the one the debaters exhibit; the judge supplies none of its own). TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 for(const raw of T.split('\n')){const l=raw.trim();const m=l.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\s+vs\.?\s+C(\d+)\b/i);if(!m)continue;if(!/LINK\s+BROKEN/.test(l))continue;
  const g=(l.match(/\bGROUND\s*:(.*)$/i)||[null,l])[1];if(!KF_GROUND.test(g))continue;const id='D'+m[1]+' vs C'+m[2];if(forced.has(id)||items.some(x=>x.link===id))continue;
  items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:'no FORCED line'});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+' grades a link BROKEN as forced with no FORCED line quoting the MEANS sentence, the answer and the layer that fails (ruling 396). TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
const KR_LINE=/^\s*(?:[-•]|\d+[.)])?\s*REFERENCE\s*:\s*(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*(CONFIRMED|NOT CONFIRMED)\s*(?:--|—|–)\s*["“](.+?)["”]\s*\/\s*["“](.+?)["”]\s*\.?\s*$/i;
function krLines(text,R){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const lines=T.split('\n').map(x=>x.trim()).filter(l=>/^(?:[-•]|\d+[.)])?\s*REFERENCE\s*:/i.test(l));
 for(const side of ['DEFENDER','CHALLENGER']){const PL=pwList(R,side);if(!PL)continue;
  for(const p of PL)for(const v of (p.cls||[]).filter(c=>c.cls==='PROVEN BY REFERENCE')){const id=side+' premise '+p.n;if(items.some(y=>y.link===id))continue;const own=lines.filter(l=>ciKeys(l).has(v.key));
   if(!own.length){items.push({rule:'K-R',side,link:id,key:v.key,premise:p.n,line:'premise '+p.n+': '+v.key+' is PROVEN BY REFERENCE (PROVEN IN ['+v.round+']) and has no REFERENCE line',means:v.means,round:v.round,why:'no REFERENCE line'});
    marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-R) -- '+id+': '+v.key+' is proven by reference to ['+v.round+'] and the seat wrote no REFERENCE line confirming or refusing the meaning (ruling 399). TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');continue;}
   const m=own[0].match(KR_LINE);const bad=[];
   if(!m)bad.push('the REFERENCE line is not in the form REFERENCE: <press> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- "<block meaning>" / "<MEANS sentence>"');
   else{const rk=m[2].toUpperCase();if(rk!==v.round)bad.push('it names ['+rk+'], the press names ['+v.round+']');if(typeof R[rk]!=='string'||!ciFound(m[4],R[rk]))bad.push('its first quotation is not in ['+rk+']');if(!v.means||!ciFound(m[5],v.means))bad.push('its second quotation is not the press\'s MEANS sentence');}
   if(!bad.length)continue;items.push({rule:'K-R',side,link:id,key:v.key,premise:p.n,line:own[0].slice(0,600),means:v.means,round:v.round,why:bad.join('; ')});
   marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-R) -- '+id+': '+v.key+': '+bad.join('; ')+'. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}
 return {items,marks};}
// K-L2: the seat's own [L2], read per COLLISION POINTS line; the words read are the run's [L2] check rows (Quote Report)
function kl2Lines(text,L2D){const items=[],marks=[];if(!L2D||!Array.isArray(L2D.ow)||typeof L2C==='undefined')return {items,marks};
 const T=String(text||'').replace(/\\n/g,'\n');const rounds=[];T.split('\n').forEach((l,i)=>{if(/\[L2\]/.test(l)&&/^\s*(?:[-•]|\d+[.)])?\s*[*_]*\s*D\d+\s+vs\.?\s+C\d+/i.test(l))rounds.push(['JUDGE','line '+(i+1),l]);});
 if(!rounds.length)return {items,marks};const R=L2C.check(L2C.tags(rounds),L2D.ow,L2D.lex,L2D.read);
 for(const t of R){if(t.status!=='NOT COUNTED')continue;const id=(t.seg.match(/D\d+\s+vs\.?\s+C\d+/i)||[null])[0]||(rounds.find(r=>r[1]===t.round)[2].match(/D\d+\s+vs\.?\s+C\d+/i)||['L2'])[0];const lk=String(id).replace(/\s+vs\.?\s+/i,' vs ');
  if(items.some(x=>x.link===lk))continue;items.push({rule:'K-L2',side:'BOTH',link:lk,line:rounds.find(r=>r[1]===t.round)[2].trim().slice(0,600),why:t.why});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-L2) -- '+lk+': an [L2] of the seat\'s own ground is NOT COUNTED ('+t.why.replace(/[\[\]]/g,'')+'); a NOT COUNTED [L2] voids that ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
// ======== end judge_fix9 libraries ========
let raw=$input.first().json?.choices?.[0]?.message?.content||'UNKNOWN';const raw0=raw;const prev=$('Build Independent Verdict').first().json;
// HARDENED v3 (2026-07-28, Eric-ruled): v2 = word-boundary matching + fail-closed UNKNOWN + DEFENSE/CHALLENGE STANDING parsing.
// v3 adds UNICODE-HYPHEN TOLERANCE. A judge that writes SELF-SUPPORTED with U+2011 (non-breaking hyphen) or any
// U+2010-U+2015 / U+2212 dash scored UNGRADED under v2 even though the line was present and correct. Proven live
// 2026-07-28 on the W1 ChatGPT self-test (DeepSeek judge, defense_standing=UNGRADED against a correct SELF-SUPPORTED line).
// v4 (2026-07-28, Eric-ruled, BB-0036/BB-0037): mask CHALLENGER CONCEDED LINKS before the defender CONCEDED LINKS parse
// (substring collision, fail-silent mis-attribution). Proven by 136-row zero-diff offline replay before deploy.
// v5 (2026-07-28, Eric-ruled): gated fail-loud markers — a graded STANDING with a missing CONCEDED LINKS integer now
// appends a REVIEW marker instead of passing silently. Gated on the standing so legitimately integer-free formats stay quiet.
// v6 (2026-07-30, Eric-ruled): MARKDOWN-EMPHASIS TOLERANCE. A judge that writes "**DEFENSE STANDING:** SELF-SUPPORTED"
// scored UNGRADED under v5 against a line that was present and correct -- the separator class admits whitespace, colons
// and every unicode dash but not asterisks. Proven live 2026-07-30 on Claude vs ChatGPT (exec 17929, DeepSeek judge):
// both standings UNGRADED and both integers null while the judge text held SELF-SUPPORTED/1 and PROP-DEPENDENT/2.
// Emphasis is stripped from the PARSING copy only; raw is saved verbatim. Same failure class as the v3 unicode-hyphen bug.
// v7 (2026-07-30, Eric-ruled): LINE-ANCHORED LABELS. The anchor words also occur in the judge's own prose
// ("the defender expressly conceded Links 1-4 and 6"), and v6 took the FIRST match anywhere, so prose beat the
// labelled line. Proven live 2026-07-30 on Grok Defends: stored conceded_links=1 while the label line read 5 --
// a COLLAPSED defense recorded as conceding one link. Also found retroactively on a 2026-07-26 row (stored 4,
// label 2), so it corrupts in BOTH directions. The v5 fail-loud gate stayed silent because a standing was graded
// AND an integer was found -- just the wrong integer. FIX: prefer a match anchored to line start (the label is
// always its own line; prose never is); fall back to the old unanchored match ONLY if no anchored label exists,
// and when that fallback fires, say so loudly. Measured over all 174 stored verdicts: 104 hold a line-anchored
// label, ZERO hold a prose-only match, so anchoring loses no row that parses today.
const D='[\\s‐-―−-]';
const upper=raw.toUpperCase().replace(/[*_`]+/g,'');
// v8 A1 (BB-3442 step 5): mask a line-anchored CLAUSE line BEFORE the verdict scan. \bBROKEN\b matches
// inside BROKEN-1, so today the verdict word only wins by being on line 1. Masking removes the order dependency.
const upperV=upper.replace(/(^|\n)[ \t]*CLAUSE[^\n]*/g,'$1XCLAUSELINEX');const head=upperV.slice(0,200);const pos=(w)=>{const m=head.match(new RegExp('\\b'+w+'\\b'));return m?m.index:Infinity;};const pB=pos('BROKEN'),pP=pos('PARTIAL'),pH=pos('HELD');let verdict;if(raw==='UNKNOWN'){verdict='UNKNOWN';}else if(pB!==Infinity||pP!==Infinity||pH!==Infinity){verdict=(pB<=pP&&pB<=pH)?'BROKEN':(pP<=pH)?'PARTIAL':'HELD';}else{const vm=upperV.match(new RegExp('VERDICT[\\s:'+D.slice(3,-1)+']*\\b(HELD|PARTIAL|BROKEN)\\b'));verdict=vm?vm[1]:'UNKNOWN';}
if(verdict==='UNKNOWN'){raw+='\n\n[EXTRACTOR v3: NO PARSEABLE VERDICT - verdict_tag=UNKNOWN (fail-closed). REVIEW THIS ROW.]';}
if($input.first().json?.choices?.[0]?.finish_reason==='length'){raw+='\n\n[TRUNCATED: finish_reason=length -- raise max_tokens. REVIEW THIS ROW.]';}
const STAND='(SELF'+D+'SUPPORTED|PROP'+D+'DEPENDENT|COLLAPSED)';const SEP='[\\s:'+D.slice(3,-1)+']*?';
const norm=(s)=>s.replace(/[\s‐-―−]/,'-');
// v8 A2: standings are LINE-ANCHORED with a loud unanchored fallback -- v7's shape, which fixed this
// class for the integers and left the standings open. Measured: 6 of 256 stored verdicts carry a standing
// mid-line, 0 in label form, so the gap is real but has never fired live.
const anchStand=(label)=>{const l=upper.match(new RegExp('(^|\\n)[ \\t]*'+label+'\\s+STANDING'+SEP+STAND));if(l)return{v:norm(l[2]),fb:false};const a=upper.match(new RegExp(label+'\\s+STANDING'+SEP+STAND));return a?{v:norm(a[1]),fb:true}:{v:'UNGRADED',fb:false};};const dsR=anchStand('DEFENSE');let defense_standing=dsR.v;if(dsR.fb){raw+='\n\n[EXTRACTOR v14: DEFENSE STANDING TAKEN FROM PROSE, NO LINE-ANCHORED LABEL. REVIEW THIS ROW.]';}
const upperD=upper.replace(/CHALLENGER\s+CONCEDED\s+LINKS/g,'XCHALLENGERCONCEDEDLINKSX');const clLine=upperD.match(new RegExp('(^|\\n)[ \\t]*CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));const clAny=upperD.match(new RegExp('CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));let conceded_links=clLine?parseInt(clLine[2],10):(clAny?parseInt(clAny[1],10):null);const clFellBack=(!clLine&&!!clAny);
if(defense_standing==='UNGRADED'){raw+='\n\n[EXTRACTOR: NO DEFENSE STANDING LINE FOUND - defense_standing=UNGRADED. REVIEW THIS ROW.]';}
if(defense_standing!=='UNGRADED'&&conceded_links===null){raw+='\n\n[EXTRACTOR: DEFENSE STANDING PRESENT BUT NO CONCEDED LINKS INTEGER - conceded_links=null. REVIEW THIS ROW.]';}
const csR=anchStand('CHALLENGE');let challenge_standing=csR.v;if(csR.fb){raw+='\n\n[EXTRACTOR v14: CHALLENGE STANDING TAKEN FROM PROSE, NO LINE-ANCHORED LABEL. REVIEW THIS ROW.]';}
const cclLine=upper.match(new RegExp('(^|\\n)[ \\t]*CHALLENGER\\s+CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));const cclAny=upper.match(new RegExp('CHALLENGER\\s+CONCEDED\\s+LINKS'+SEP+'([0-9]+)'));let challenger_conceded_links=cclLine?parseInt(cclLine[2],10):(cclAny?parseInt(cclAny[1],10):null);const cclFellBack=(!cclLine&&!!cclAny);
if(challenge_standing==='UNGRADED'){raw+='\n\n[EXTRACTOR: NO CHALLENGE STANDING LINE FOUND - challenge_standing=UNGRADED. REVIEW THIS ROW.]';}
if(challenge_standing!=='UNGRADED'&&challenger_conceded_links===null){raw+='\n\n[EXTRACTOR: CHALLENGE STANDING PRESENT BUT NO CHALLENGER CONCEDED LINKS INTEGER - challenger_conceded_links=null. REVIEW THIS ROW.]';}
if(clFellBack){raw+='\n\n[EXTRACTOR v7: CONCEDED LINKS INTEGER TAKEN FROM MID-SENTENCE PROSE, NO LINE-ANCHORED LABEL FOUND. REVIEW THIS ROW.]';}
// K3 (advisor ruling, binding): STANDING COUNT. The W1 standing line carries "L=<n> c=<n>" after the standing word. Where both parse and the
// standing the judge gave disagrees with the count (COLLAPSED iff 2c > L, a tie is NOT COLLAPSED), write a review line. A grade is never rewritten.
// Where the count-given defense standing would change the clause the judge's own counts give, the clause check below rejects through rej().
// If L or c does not parse (older text, or the placeholder echoed), nothing is written.
const K3=(()=>{const g=(label,given)=>{if(given==='UNGRADED')return null;const m=upper.match(new RegExp('(^|\\n)[ \\t]*'+label+'\\s+STANDING'+SEP+STAND+'([^\\n]*)'))||upper.match(new RegExp(label+'\\s+STANDING'+SEP+STAND+'([^\\n]*)'));if(!m)return null;
  const q=m[m.length-1].match(/^[\s:,;.(‐-―−-]*L\s*=\s*([0-9]+)[\s,;]*C\s*=\s*([0-9]+)(?![0-9])/);if(!q)return null;const L=parseInt(q[1],10),c=parseInt(q[2],10);const calc=(2*c>L)?'COLLAPSED':'not COLLAPSED';
  return ((given==='COLLAPSED')!==(2*c>L))?{given,L,c,calc}:null;};return {d:g('DEFENSE',defense_standing),c:g('CHALLENGE',challenge_standing)};})();
if(K3.d){raw+='\n\n[EXTRACTOR v18: STANDING COUNT -- DEFENSE STANDING '+K3.d.given+' but L='+K3.d.L+' c='+K3.d.c+' gives '+K3.d.calc+'. REVIEW THIS ROW.]';}
if(K3.c){raw+='\n\n[EXTRACTOR v18: STANDING COUNT -- CHALLENGE STANDING '+K3.c.given+' but L='+K3.c.L+' c='+K3.c.c+' gives '+K3.c.calc+'. REVIEW THIS ROW.]';}
if(cclFellBack){raw+='\n\n[EXTRACTOR v7: CHALLENGER CONCEDED LINKS INTEGER TAKEN FROM MID-SENTENCE PROSE, NO LINE-ANCHORED LABEL FOUND. REVIEW THIS ROW.]';}
// v8 A3: the new lines, all line-anchored.
const clauseLineM=upper.match(new RegExp('(^|\\n)([ \\t]*CLAUSE'+SEP+'(?:BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)[^\\n]*)'));
const clauseLine=clauseLineM?clauseLineM[2]:null;
const clauseM=clauseLine?clauseLine.match(new RegExp('CLAUSE'+SEP+'(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)')):null;
const clause=clauseM?clauseM[1]:null;const fam=clause?clause.split('-')[0]:null;
// v14 (BB-3442 step 8a): n/w/k is read from the CLAUSE LINE ITSELF. Unanchored it was the v7
// prose-beats-label class on the newest field, and it corrupted BOTH ways: a legal BROKEN-1 whose
// Line 1 prose said k=0 drew two false ILLEGAL markers, and an illegal PARTIAL-1 with w=0 passed
// silently when prose supplied w=1. The triple feeds the recompute, so a wrong one defeats it.
const NWK=/N\s*=\s*([0-9]+)\s+W\s*=\s*([0-9]+)\s+K\s*=\s*([0-9]+)/;
let nwk=clauseLine?clauseLine.match(NWK):null;let nwkFellBack=false;
if(!nwk){const a=upper.match(NWK);if(a){nwk=a;nwkFellBack=true;}}
const n=nwk?parseInt(nwk[1],10):null,w=nwk?parseInt(nwk[2],10):null,k=nwk?parseInt(nwk[3],10):null;
if(nwkFellBack){raw+='\n\n[EXTRACTOR v14: n/w/k TAKEN FROM PROSE, NOT FROM THE CLAUSE LINE. REVIEW THIS ROW.]';}
const resultM=upper.match(new RegExp('(^|\\n)[ \\t]*RESULT'+SEP+'(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)'));
const verdict_result=resultM?resultM[2]:null;
// v10 N1b (BB-3499): COLLISION POINTS is the LAST output line, so a block-boundary match ran to end of text
// and counted closing prose. A grade now counts only on a line that is itself a collision entry.
const collisionsPresent=/(^|\n)[ \t]*COLLISION POINTS/.test(upper);
// v12 B1 (BB-3507): the entry filter now tolerates a LIST PREFIX and "VS." -- measured at my hand, 5 of 31
// stored DeepSeek verdicts carry list-prefixed lines and 3 already write VS. with a period, while 0 bullet a
// label. Without this the filter fails in BOTH directions: a bulleted illegal row passes silently and a
// bulleted legal one is falsely rejected.
const collLines=upper.split('\n').filter(L=>/^[ \t]*(?:[-•]|\d+[.)])?[ \t]*D\d+\s+VS\.?\s+C\d+\b/.test(L)||/^[ \t]*COLLISION POINTS[ \t]*:?[ \t]*(?:[-•]|\d+[.)])?[ \t]*D\d+\s+VS\.?\s+C\d+\b/.test(L));
// v18 AUDIT LAYER (BB-4490 step 1, rulings BB-4503 Q1 A): the per-link record is the judge's own COLLISION POINTS
// section, read entry by entry. One state per declared link D1..Dn: WITHDRAWN, BROKEN (DEFENDER LINK BROKEN), or STANDS
// (STANDS, UNDERDETERMINED or CHALLENGER LINK BROKEN). It reads the entry shapes the v12 line filter dropped --
// "D5: D5 vs C6 (...)" and "D3: vs C5 (...)" -- which made v17 count 0 broken and mark a false ILLEGAL on two stored rows.
const colSec=(()=>{const L=upper.split('\n');const i=L.findIndex(x=>/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS\b/.test(x));if(i<0)return null;const out=[];const f=L[i].replace(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS[ \t]*:?/,'');if(f.trim())out.push(f);for(let j=i+1;j<L.length;j++){const x=L[j];if(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?(CITATION CHECK|OUT-OF-ROUND CONCESSIONS|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CONCEDED LINKS|CHALLENGER CONCEDED LINKS|LINK AUDIT)\b/.test(x))break;if(/^[ \t]*\[(EXTRACTOR|REVIEW|TRUNCATED|AUDIT)/.test(x))break;out.push(x);}return out;})();
const colMap={};const colUnparsed=[];let chBroken=0;const colWB=new Set(); // BB-8634 S4-X: links on a WITHDRAWN AFTER AN UNANSWERED WITNESS line
if(colSec){for(const x0 of colSec){const x=x0.trim();if(!x)continue;const m=x.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m){colUnparsed.push(x.slice(0,60));continue;}const rest=m[2];if(/WITHDRAWN AFTER AN UNANSWERED WITNESS/.test(rest))colWB.add(+m[1]);let st=null;if(/^VS\.?\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);st=g?g[1]:null;}else{const g=rest.match(/^(WITHDRAWN|STANDS)\b/);st=g?g[1]:null;}if(!st){colUnparsed.push(x.slice(0,60));continue;}if(st==='CHALLENGER LINK BROKEN')chBroken++;(colMap[+m[1]]=colMap[+m[1]]||[]).push(st);}}
const colState=(i)=>{const a=colMap[i];if(!a)return null;const w=a.includes('WITHDRAWN'),b=a.includes('DEFENDER LINK BROKEN');return (w&&b)?'CONFLICT':w?'WITHDRAWN':b?'BROKEN':'STANDS';};
const colIds=Object.keys(colMap).map(Number).sort((a,b)=>a-b);
const dw=colIds.filter(i=>colState(i)==='WITHDRAWN'||colWB.has(i)).length; /* S4-X: such a link is withdrawn (in w) and graded at its collision (in k when BROKEN) */const dk=colIds.filter(i=>colState(i)==='BROKEN').length;
const defBroken=dk;
// v8 A4: fail loud, GATED on the new format, so pre-v8 rows stay silent by construction.
const newFormat=!!(clause||verdict_result||collisionsPresent||nwk);
if(newFormat){
 if(!clause){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO CLAUSE LINE - clause=null. REVIEW THIS ROW.]';}
 if(!verdict_result){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO RESULT LINE - result=null. REVIEW THIS ROW.]';}
 if(!nwk){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO n/w/k TRIPLE. REVIEW THIS ROW.]';}
 if(!collisionsPresent){raw+='\n\n[EXTRACTOR v14: NEW FORMAT PRESENT BUT NO COLLISION POINTS LINE. REVIEW THIS ROW.]';}
}
// v8 A5: illegal-output rejection, eight predicates. 6-8 were added on BB-3485 D2, which found that
// Line 1 HELD with CLAUSE PARTIAL-1 -- this order's own disease -- passed the first five untouched.
// The row is still stored; rejection MARKS it and never discards evidence.
let verdict_rejected=false;const rej=(m)=>{verdict_rejected=true;raw+='\n\n[EXTRACTOR v14 ILLEGAL: '+m+' REVIEW THIS ROW.]';};
if(defense_standing==='SELF-SUPPORTED'&&defBroken>0){rej('DEFENSE SELF-SUPPORTED WITH '+defBroken+' DEFENDER LINK BROKEN.');}
if(challenge_standing==='SELF-SUPPORTED'&&chBroken>0){rej('CHALLENGE SELF-SUPPORTED WITH '+chBroken+' CHALLENGER LINK BROKEN.');}
if(defense_standing==='SELF-SUPPORTED'&&challenge_standing==='SELF-SUPPORTED'&&(defBroken+chBroken)>0){rej('MUTUAL SELF-SUPPORTED OVER A COLLISION GRADED BROKEN.');}
// v9 N3 (BB-3493): RECOMPUTE the clause from the judge's own n/w/k and standing, first match wins, and
// compare. One predicate subsumes the two ad-hoc checks and catches PARTIAL-1 with k>=1 and BROKEN-2
// that fails 2w>n, both of which passed before.
// v15 (BB-4005/4009): KEYSTONE, CHAIN COUNT and SELF-REPORT. n is the DEFENDER'S declared-chain count (D4);
// the challenger's listed count is recorded beside it and NEVER compared to n (BB-3975).
// v16 E3 (BB-4012, A3): a judge echoing the template line verbatim -- KEYSTONE: D6 -- WITHDRAWN |
// BROKEN | STANDS -- read as WITHDRAWN and forced BROKEN-2 on the recompute. It must read as NO
// KEYSTONE LINE and fire loud instead.
// v17 F1 (BB-4016, A3): v16 did that with a POSITIVE terminator set -- line end, period, dash --
// which then rejected a CR, a semicolon, a comma and an open paren after a present and correct
// state, 4 of 4, and the CR case contradicted the CR tolerance settled at BB-3984. A3's negative
// form is taken, with two enumerators added: the echo also appears with slashes and with OR.
// 16 of 16 at my hand, the four F1 shapes and three echo forms among them.
const KSM=upper.match(new RegExp('(^|\\n)[ \\t]*KEYSTONE'+SEP+'D([0-9]+)'+SEP+'(WITHDRAWN|BROKEN|STANDS)(?![A-Z0-9])(?![ \\t]*(?:\\||/|OR[ \\t]))'));
const keystone_link=KSM?parseInt(KSM[2],10):null;
const keystone_state=KSM?KSM[3]:null;
if(!KSM){raw+='\n\n[EXTRACTOR v15: NEW FORMAT PRESENT BUT NO KEYSTONE LINE - keystone=null. REVIEW THIS ROW.]';}
else{
 if(n!==null&&keystone_link!==n){raw+='\n\n[EXTRACTOR v15: KEYSTONE NAMES D'+keystone_link+' BUT CLAUSE n='+n+'. REVIEW THIS ROW.]';}
 const ownM=upper.match(new RegExp('(^|\\n)[ \\t]*D'+keystone_link+SEP+'(WITHDRAWN|STANDS)'));
 const own=ownM?ownM[2]:null;
 if(own&&keystone_state!=='BROKEN'&&keystone_state!==own){raw+='\n\n[EXTRACTOR v15: KEYSTONE SAYS '+keystone_state+' BUT D'+keystone_link+' ITSELF SAYS '+own+'. REVIEW THIS ROW.]';}
 // v16 E3 (BB-4012, A3): BROKEN was exempt from every check, so a keystone graded BROKEN with k=0
 // and its own D<n> entry reading STANDS raised nothing at all. BROKEN must now be EARNED on the
 // COLLISION POINTS lines and must agree with k.
 if(keystone_state==='BROKEN'){
  const kb=(colState(keystone_link)==='BROKEN');
  if(!kb){raw+='\n\n[EXTRACTOR v16: KEYSTONE SAYS BROKEN BUT NO COLLISION LINE GRADES D'+keystone_link+' DEFENDER LINK BROKEN. REVIEW THIS ROW.]';}
  if(k===0){raw+='\n\n[EXTRACTOR v16: KEYSTONE SAYS BROKEN BUT THE CLAUSE LINE SAYS k=0. REVIEW THIS ROW.]';}
 }
}
// CHAIN COUNT, by the closed instrument (BB-3969/3980/3984): dashes mapped, LAST anchored heading line, sequence run.
// ORDER (BB-6755): a chain line may also be written with a dash after its number ("D1 -", "1 -"; dashes are folded first).
const chainCount=(t)=>{if(typeof t!=='string')return null;const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(/^\s*#*\s*\**\s*DECLARED CHAIN\s*:?\s*\**\s*(?:-{1,3}[^\n]*)?:?\s*$/i.test(L[i]))hi=i;}
 if(hi<0)return null;let c=0;
 for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}
 return c;};
const chain_count=chainCount(prev&&prev.cr1);
const chain_lines=(()=>{const t=prev&&prev.cr1;if(typeof t!=='string')return [];const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(/^\s*#*\s*\**\s*DECLARED CHAIN\s*:?\s*\**\s*(?:-{1,3}[^\n]*)?:?\s*$/i.test(L[i]))hi=i;}
 if(hi<0)return [];const out=[];let c=0;
 for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1){c++;out.push(L[i].slice(0,60));}else break;}
 return out;})();
// N CHECK (BB-3975): judge's n against CHAIN COUNT only. Fires on NULL either side or divergence.
if(n===null||chain_count===null||n!==chain_count){raw+='\n\n[EXTRACTOR v15: N CHECK - CLAUSE n='+n+' AGAINST DECLARED CHAIN COUNT '+chain_count+'. REVIEW THIS ROW.]';}
// SELF-REPORT CHECK (BB-3975): the challenger's PREMISE COUNT against its OWN list. Never compared to n.
// v16 E1 (BB-4012, A3): $ without the m flag is END OF STRING, so a trailing newline, a CRLF,
// a blank line or one line of prose after the count read premise_count=null and fired the marker
// on a CLEAN row -- 3 of 3 in A3's harness and 6 of 8 in mine. Anchor per line with a lookahead
// and take the LAST match, so an instruction echoed earlier in the text cannot win.
const PCRE=/(^|\n)[ \t]*PREMISE COUNT[ \t:]*([0-9]+)[ \t\r]*(?=\n|$)/g;
const pcSrc=(typeof prev.gr2==='string'?prev.gr2:'').toUpperCase().replace(/[*_`]+/g,'');
let pcM=null;{let m;PCRE.lastIndex=0;while((m=PCRE.exec(pcSrc))!==null){pcM=m;if(m.index===PCRE.lastIndex)PCRE.lastIndex++;}}
const premise_count=pcM?parseInt(pcM[2],10):null;
// The challenger's OWN list, counted by the same closed instrument, so PREMISE COUNT can be checked against it.
const seqCount=(t,head)=>{if(typeof t!=='string')return null;const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(head.test(L[i]))hi=i;}
 if(hi<0)return null;let c=0;
 for(let i=hi+1;i<L.length;i++){if(/^\s*(?:#+\s*)?\**\s*PREMISE COUNT/i.test(L[i]))break; /* BB-8634 N1: the list ends at PREMISE COUNT */ const m=L[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m){if(/^(?:#+\s*)?\**\s*LINK\s+(?:\d+|none)\s*:/i.test(L[i]))c++;continue;}if(parseInt(m[1],10)===c+1)c++;else break;} // BB-8634 S1: a LINK n: line counts as the next item
 return c;};
const premise_sequence=seqCount(prev&&prev.gr2,/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i);
// v16 E5 (BB-4012, A3): BB-3969/3975 print the COUNTED LINES for BOTH counts on every grade. I
// printed the chain and not the premises, so the self-report finding could not be read back.
const seqLines=(t,head)=>{if(typeof t!=='string')return [];const L=t.replace(/[‐-―−]/g,'-').split('\n');let hi=-1;
 for(let i=0;i<L.length;i++){if(head.test(L[i]))hi=i;}
 if(hi<0)return [];const out=[];let c=0;
 for(let i=hi+1;i<L.length;i++){if(/^\s*(?:#+\s*)?\**\s*PREMISE COUNT/i.test(L[i]))break; /* BB-8634 N1: the list ends at PREMISE COUNT */ const m=L[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m){if(/^(?:#+\s*)?\**\s*LINK\s+(?:\d+|none)\s*:/i.test(L[i])){c++;out.push(L[i].slice(0,60));}continue;}if(parseInt(m[1],10)===c+1){c++;out.push(L[i].slice(0,60));}else break;} // BB-8634 S1
 return out;};
const premise_lines=seqLines(prev&&prev.gr2,/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i);
if(premise_count===null){raw+='\n\n[EXTRACTOR v15: NO PREMISE COUNT LINE - premise_count=null. REVIEW THIS ROW.]';}
// SELF-REPORT CHECK: challenger-internal only. A mismatch is a self-report finding, NEVER an n fault.
if(premise_count!==null&&premise_sequence!==null&&premise_count!==premise_sequence){raw+='\n\n[EXTRACTOR v15: SELF-REPORT - PREMISE COUNT '+premise_count+' AGAINST THE CHALLENGERS OWN LIST OF '+premise_sequence+'. REVIEW THIS ROW.]';}
raw+='\n\n[EXTRACTOR v15 COUNTED LINES, CHAIN ('+chain_count+'): '+chain_lines.join(' | ')+']';
raw+='\n\n[EXTRACTOR v16 COUNTED LINES, PREMISES ('+premise_sequence+'): '+premise_lines.join(' | ')+']';
if(clause&&n!==null&&w!==null&&k!==null){
 const expect=(k>=1)?'BROKEN-1':((2*w>n||keystone_state==='WITHDRAWN')?'BROKEN-2':((w>=1)?'PARTIAL-1':((defense_standing==='COLLAPSED')?'PARTIAL-2':'HELD-1')));
 if(clause!==expect){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS n='+n+' w='+w+' k='+k+' ds='+defense_standing+', WHICH GIVE '+expect+'.');}
}
// A5.6 LINE 1 AGAINST CLAUSE -- the order's own disease.
if(clause&&verdict!=='UNKNOWN'&&verdict!==fam){rej('LINE 1 '+verdict+' AGAINST CLAUSE '+clause+'.');}
// A5.7 RESULT AGAINST THE VERDICT.
if(verdict_result){
 if(verdict==='BROKEN'&&verdict_result!=='CHALLENGER WINS'){rej('BROKEN WITH RESULT '+verdict_result+'.');}
 if(verdict==='PARTIAL'&&verdict_result!=='UNDERDETERMINED'){rej('PARTIAL WITH RESULT '+verdict_result+'.');}
 if(verdict==='HELD'&&verdict_result==='CHALLENGER WINS'){rej('HELD WITH RESULT CHALLENGER WINS.');}
 // v9 N2 (BB-3493): HELD gives DEFENDER WINS only where the challenger is not SELF-SUPPORTED or a collision
 // is graded CHALLENGER LINK BROKEN. Everything else is UNDERDETERMINED. This was unchecked.
 if(verdict==='HELD'&&verdict_result==='DEFENDER WINS'&&challenge_standing==='SELF-SUPPORTED'&&chBroken===0){rej('HELD WITH RESULT DEFENDER WINS WHILE THE CHALLENGER IS SELF-SUPPORTED AND NO CHALLENGER LINK IS BROKEN.');}
}
// A5.8 STATED k AGAINST THE COLLISION LINE'S OWN COUNT.
if(k!==null&&collisionsPresent&&k!==defBroken){rej('STATED k='+k+' AGAINST '+defBroken+' DEFENDER LINK BROKEN ON COLLISION POINTS.');}
// v13 A (BB-3506, which VACATED BB-3500 ruling 1): NO new key is emitted at all. The live CHECK
// debate_results_outcome_d5_vocabulary accepts only NULL, DEFENDER PREVAILS, CHALLENGER PREVAILS,
// DEFENDER PREVAILS, WEAKENED and UNGRADED - REVIEW, verified at my hand, so writing a RESULT verbatim
// would fail the insert and cost the whole debate row. RESULT, CLAUSE, n, w, k and every rejection all
// ride in independent_verdict_raw, which the flow stores whole and the step-8 derivation quotes.
// v18 AUDIT LAYER, continued (BB-4490 step 1). Coverage and cross-check of the COLLISION POINTS map against the CLAUSE line.
if(colSec){
 if(n!==null){for(let i=1;i<=n;i++){if(!colMap[i]){raw+='\n\n[AUDIT v18: COLLISION POINTS CARRIES NO ENTRY FOR D'+i+' OF n='+n+'. REVIEW THIS ROW.]';}}
  const extra=colIds.filter(i=>i>n);if(extra.length){raw+='\n\n[AUDIT v18: COLLISION POINTS NAMES D'+extra.join(', D')+' BEYOND n='+n+'. REVIEW THIS ROW.]';}}
 for(const i of colIds){if(colState(i)==='CONFLICT'){raw+='\n\n[AUDIT v18: D'+i+' IS BOTH WITHDRAWN AND DEFENDER LINK BROKEN ON COLLISION POINTS. REVIEW THIS ROW.]';}}
 for(const u of colUnparsed){raw+='\n\n[AUDIT v18: COLLISION POINTS ENTRY NOT READ: "'+u+'". REVIEW THIS ROW.]';}
 if(w!==null&&dw!==w){raw+='\n\n[AUDIT v18: CLAUSE w='+w+' BUT COLLISION POINTS WITHDRAWS '+dw+'. REVIEW THIS ROW.]';}
}
raw+='\n\n[AUDIT v18 COLLISION MAP: '+(colSec?colIds.map(i=>'D'+i+'='+colState(i)+(colWB.has(i)?'(WITHDRAWN AFTER WITNESS)':'')).join(' ')+' | w='+dw+' k='+dk:'NO COLLISION POINTS SECTION')+']';
// CONCEDED COUNTS DERIVED FROM THE ITEMIZATION (WO-17 form on W1's clause scheme). Each item of the CONCEDED LINKS /
// CHALLENGER CONCEDED LINKS line that carries a tag -- CONCEDED (stated|conditional) or UNEXHIBITED (...) -- counts the
// links it names ("LINKs 3, 4, and 6" counts three; "LINK none" counts one each time). An item tagged VOID counts for
// neither side. v19 (BB-4890, fix A1): the judge's stated integer is stored; an itemized count that differs is named
// in a flag. C<n>, D<n> and LINK <n> name the same link number and count once per item (ruling BB-4934 Q5). Where no tag parses and the
// judge stated a positive integer, the stated value is kept and the gap is flagged.
const itemIds=(it)=>{const ids=[];let m;const r1=/\b(?:D|C|LR)(\d+[A-Z]?)\b/g;while((m=r1.exec(it))!==null)ids.push('L'+m[1]);
 const r2=/\bLINKS?\s+((?:\d+[A-Z]?|NONE)(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*(?:\d+[A-Z]?))*)/g;
 while((m=r2.exec(it))!==null){const body=m[1];if(/^NONE/.test(body)){ids.push('NONE#'+ids.length);continue;}
  const parts=body.split(/\s*(?:,\s*AND|,|AND)\s*/);for(const p of parts){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push('L'+q);}else if(p.trim())ids.push('L'+p.trim());}}
 const u=new Set(ids.filter(x=>!/^NONE#/.test(x)));return u.size+ids.filter(x=>/^NONE#/.test(x)).length;};
const TAGC=/\bCONCEDED\s*\(?\s*(?:STATED|CONDITIONAL)\b|\bUNEXHIBITED\s*\(/;
const deriveConc=(line)=>{if(line===null)return null;let nC=0,nV=0,tags=0;for(const it of line.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,2}\s+VOID\b/.test(it);const isT=TAGC.test(it);if(!isV&&!isT)continue;tags++;const c=Math.max(1,itemIds(it));if(isV)nV+=c;else nC+=c;}return {nC,nV,tags};};
const concLine=(src,lab)=>{const m=src.match(new RegExp('(^|\\n)[ \\t]*'+lab+SEP+'(?:[0-9]+)?([^\\n]*)'));return m?m[2]:null;};
const dDef=deriveConc(concLine(upperD,'CONCEDED\\s+LINKS'));const dCh=deriveConc(concLine(upper,'CHALLENGER\\s+CONCEDED\\s+LINKS'));
let defVoid=dDef?dDef.nV:0,chVoid=dCh?dCh.nV:0;
const applyConc=(d,stated,side)=>{if(!d)return stated;if(d.tags===0){if(stated!==null&&stated>0){raw+='\n\n[AUDIT v18: '+side+' CONCEDED '+stated+' STATED BUT NO TAGGED ITEM PARSED; STATED VALUE KEPT. REVIEW THIS ROW.]';return stated;}return (stated===null)?null:0;}if(stated!==null&&stated!==d.nC){raw+='\n\n[AUDIT v19: '+side+' CONCEDED ITEMIZATION COUNTS '+d.nC+' BUT JUDGE STATED '+stated+'. STATED VALUE STORED. REVIEW THIS ROW.]';return stated;}return d.nC;};
conceded_links=applyConc(dDef,conceded_links,'DEFENDER');challenger_conceded_links=applyConc(dCh,challenger_conceded_links,'CHALLENGER');
// v19 item 7 (BB-4890, ruling BB-4934 Q4): a SELF-SUPPORTED standing with conceded links above 0 contradicts the rubric
// (links conceded or unexhibited make a defense PROP-DEPENDENT). Flagged through rej: the judgment is kept, the row is contested.
if(defense_standing==='SELF-SUPPORTED'&&conceded_links>0){rej('DEFENSE SELF-SUPPORTED WITH '+conceded_links+' CONCEDED LINKS.');}
if(challenge_standing==='SELF-SUPPORTED'&&challenger_conceded_links>0){rej('CHALLENGE SELF-SUPPORTED WITH '+challenger_conceded_links+' CHALLENGER CONCEDED LINKS.');}
if(defVoid||chVoid){raw+='\n\n[AUDIT v18 VOID: defender '+defVoid+', challenger '+chVoid+' (excluded from both counts)]';}
// v20 K2 (fault F9(b), advisor ruling, binding): WITHDRAWN MISSED. A judge printed "D<k>: STANDS" (or KEYSTONE: D<k> -- STANDS)
// while the defender's link round [CR3] states LINK <k>: CONCEDED. The code never rewrites the grade: it writes a review line,
// and where the missed withdrawals would change the clause the judge's own counts give, it rejects through rej() as line 172 does.
// LINK <k> in [CR3] is the declared chain link D<k> (D3 Build: "the chain-link number written on that premise's line, not its
// position in the list"); k runs 1..n, n = the DECLARED CHAIN count. Pre-protocol rows answered by list position (LINK 1..m in
// order, no [premise p], a label multiset the challenger's UNSUPPORTED-L4 PREMISES list does not carry); those are mapped through
// that list's own LINK labels. A link [CR3] both concedes and supports is a SPLIT LINK (own line, no rejection); a link the judge
// names VOID in its CONCEDED LINKS itemization (D<n>, LINK <n>, or premise <p> through the list) gets no line.
const K2=(()=>{const DM=(s)=>String(s||'').replace(/[‐-―−]/g,'-');
 const gL=DM(prev&&prev.gr2).split('\n');let gh=-1;for(let i=0;i<gL.length;i++){if(/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i.test(gL[i]))gh=i;}
 const labs=[];if(gh>=0){let c=0;for(let i=gh+1;i<gL.length;i++){if(/^\s*(?:#+\s*)?\**\s*PREMISE COUNT/i.test(gL[i]))break;const m=gL[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m){const lk=gL[i].replace(/[*_`]+/g,'').match(/^(?:#+\s*)?\s*LINK\s+([0-9]+|NONE)\s*:/i);if(lk){c++;labs.push(lk[1].toUpperCase());}continue;} /* BB-8634 S1 in K2 (8684, 8687): an unnumbered LINK n: line is the next item; the list ends at PREMISE COUNT (N1) */if(parseInt(m[1],10)!==c+1)break;c++;const lm=gL[i].replace(/[*_`]+/g,'').match(/^(?:#+\s*)?[0-9]+\.\s*LINK\s*([0-9]+|NONE)\b/i);labs.push(lm?lm[1].toUpperCase():null);}}
 const ent=[];const seen=new Set();
 for(const x of DM(prev&&prev.cr3).replace(/[*_`]+/g,'').toUpperCase().split('\n')){if(/^[ \t#>]*CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES[ \t:]*$/.test(x))break;
  const m=x.match(/^[ \t#>•-]*LINK[ \t]+([0-9]+|NONE)[ \t]*(?:\[[ \t]*PREMISE[ \t]*([0-9]+)[ \t]*\])?[ \t]*:?[ \t]*(SUPPORTED|CONCEDED)\b/);if(!m)continue;
  const key=m[1]+'#'+(m[2]||'');if(seen.has(key+'#'+m[3]))continue;seen.add(key+'#'+m[3]);ent.push({lab:m[1],p:m[2]?+m[2]:null,st:m[3],key});}
 const keys=[...new Set(ent.map(e=>e.key))];const kl=keys.map(x=>x.split('#')[0]);const ms=(a)=>a.slice().sort().join(',');
 const pmode=ent.length>0&&ent.every(e=>e.p===null)&&keys.length===labs.length&&kl.every((x,i)=>x===String(i+1))&&labs.every(x=>x!==null)&&ms(labs)!==ms(kl);
 if(pmode){for(const e of ent){e.lab=labs[+e.lab-1];}}
 const conc=new Set(ent.filter(e=>e.st==='CONCEDED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));const sup=new Set(ent.filter(e=>e.st==='SUPPORTED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));
 const vIds=new Set();const cl=concLine(upperD,'CONCEDED\\s+LINKS');
 if(cl!==null){for(const it of cl.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,2}\s+VOID\b/.test(it);if(!isV)continue;
  let m;const r1=/\b(?:D|C|LR)(\d+)\b/g;while((m=r1.exec(it))!==null)vIds.add(+m[1]);
  const r2=/\b(LINKS?|PREMISES?)\s+(\d+(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*\d+)*)/g;
  while((m=r2.exec(it))!==null){const ids=[];for(const p of m[2].split(/\s*(?:,\s*AND|,|AND)\s*/)){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push(q);}else if(/^\d+$/.test(p.trim()))ids.push(+p.trim());}
   for(const q of ids){if(/^PREMISE/.test(m[1])){const lb=labs[q-1];if(lb&&/^[0-9]+$/.test(lb))vIds.add(+lb);}else vIds.add(q);}}}}
 const nD=(chain_count!==null)?chain_count:n;const stands=(i)=>{if(colWB.has(i))return false;const s=colState(i);return s==='STANDS'||(s===null&&keystone_link===i&&keystone_state==='STANDS');};
 const miss=[],seq=[];if(nD!==null){for(let i=1;i<=nD;i++){if(!conc.has(i)||!stands(i)||vIds.has(i))continue;if(sup.has(i))seq.push([i,1]);else{miss.push(i);seq.push([i,0]);}}}
 return {miss,seq};})();
for(const [i,sp] of K2.seq){raw+=sp?'\n\n[EXTRACTOR v18: SPLIT LINK D'+i+' -- CR3 concedes and supports premises mapped to it. REVIEW THIS ROW.]':'\n\n[EXTRACTOR v18: WITHDRAWN MISSED D'+i+' -- CR3 states LINK '+i+': CONCEDED; the judge marks it STANDS. REVIEW THIS ROW.]';}
if(K2.miss.length&&clause&&n!==null&&w!==null&&k!==null){
 const E=(ww,ks)=>(k>=1)?'BROKEN-1':((2*ww>n||ks==='WITHDRAWN')?'BROKEN-2':((ww>=1)?'PARTIAL-1':((defense_standing==='COLLAPSED')?'PARTIAL-2':'HELD-1')));
 const ks2=(keystone_state==='STANDS'&&K2.miss.includes(keystone_link))?'WITHDRAWN':keystone_state;const e1=E(w,keystone_state),e2=E(w+K2.miss.length,ks2);
 if(e2!==e1&&clause!==e2){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS WITH THE WITHDRAWALS CR3 STATES AND THE JUDGE MISSED (D'+K2.miss.join(', D')+'): n='+n+' w='+w+'+'+K2.miss.length+' k='+k+' keystone='+ks2+' ds='+defense_standing+', WHICH GIVE '+e2+'.');}
 // P2D v6a item 2 (BB-8136): the conceded link counts; the verdict is the clause recomputed from the judge's own counts.
 if(e2!==e1){const w2=e2.split('-')[0];if(w2!==verdict){raw+='\n\n[AUDIT v22: WITHDRAWAL COUNTED -- D'+K2.miss.join(', D')+' stated CONCEDED in CR3 and marked STANDS by the judge, counted withdrawn: gives '+e2+'; ORIGINAL: '+verdict+'; COUNTED: '+w2+']';verdict=w2;}}
}
// K3 clause check (advisor ruling on BB-6002, option b): the count-given defense standing is tested on the K2-adjusted counts (w plus the
// withdrawals K2 found, and its keystone), so one row names one target clause. Placed after K2, which it reads.
if(K3.d&&clause&&n!==null&&w!==null&&k!==null){const wa=w+K2.miss.length,ksa=(keystone_state==='STANDS'&&K2.miss.includes(keystone_link))?'WITHDRAWN':keystone_state;
 const EK=(ds)=>(k>=1)?'BROKEN-1':((2*wa>n||ksa==='WITHDRAWN')?'BROKEN-2':((wa>=1)?'PARTIAL-1':((ds==='COLLAPSED')?'PARTIAL-2':'HELD-1')));const ecK=EK(K3.d.calc);
 if(ecK!==EK(defense_standing)&&clause!==ecK){rej('CLAUSE '+clause+' AGAINST ITS OWN COUNTS WITH THE DEFENSE STANDING ITS L AND c GIVE (L='+K3.d.L+' c='+K3.d.c+' ds='+K3.d.calc+') n='+n+' w='+wa+' k='+k+' keystone='+ksa+', WHICH GIVE '+ecK+'.');}
}
// WO-6 OUT-OF-ROUND CONCESSIONS and WO-7 CHALLENGER CHAIN MARK, ported from the reference (3QGx 2140f650) onto the judge text
// as received. A missing section is a flag only when the judge prompt that produced the text asked for it (audit_prompt
// W1-A1, rulings BB-4503 Q3); on older text it is recorded without a flag.
const asked=(prev&&(prev.audit_prompt==='W1-A1'||prev.audit_prompt==='ODV1-A1'||prev.audit_prompt==='ODV1-A2'));
const askedD=(prev&&prev.audit_prompt==='ODV1-A2');
const src0=raw0.replace(/[*_`]+/g,'');
const oorSec=src0.match(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?OUT-OF-ROUND CONCESSIONS[ \t]*:?[ \t]*\n?([\s\S]*?)(?=\n[ \t]*(?:#+[ \t]*|[-•][ \t]*)?(?:DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|CITATION CHECK|COLLISION POINTS)\b|(?![\s\S]))/im);
let out_of_round_concessions=null,out_of_round_detail=null;
if(oorSec){const b=(oorSec[1]||'').trim();if(/^NONE\b/i.test(b)){out_of_round_concessions=0;}else{const ls=b.split('\n').map(s=>s.replace(/^[-•\s]+/,'').trim()).filter(s=>s.length>0);const form=ls.filter(s=>/^(DEFENDER|CHALLENGER)[ \t]*\|/i.test(s));const off=ls.filter(s=>!/^(DEFENDER|CHALLENGER)[ \t]*\|/i.test(s));out_of_round_concessions=form.length;out_of_round_detail=form.length?form.join('\n'):null;for(const s of off){raw+='\n\n[AUDIT v18: OUT-OF-ROUND LINE NOT IN THE ASKED FORM, NOT COUNTED: "'+s.slice(0,60)+'". REVIEW THIS ROW.]';}}}
if(out_of_round_concessions===null){raw+=asked?'\n\n[AUDIT v18: OUT-OF-ROUND CONCESSIONS SECTION ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\n\n[AUDIT v18: OUT-OF-ROUND CONCESSIONS not asked by the prompt that produced this text; null recorded, no flag.]';}
// ORDER (BB-6819): the top mark is FOOTED (was FORGED). Old raw text still reads: FORGED is stored as FOOTED.
const ccmM=src0.match(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CHALLENGER CHAIN MARK[ \t]*:?[ \t]*(FOOTED|FORGED|STRAINED|SLACK)\b/im);
let challenger_chain_mark=ccmM?ccmM[1].toUpperCase():null;
if(challenger_chain_mark==='FORGED')challenger_chain_mark='FOOTED';
// ORDER (BB-6839, BB-6843): the defender's chain takes the same mark, read by the same rule; its absent line is flagged as the challenger's is,
// but only on text from a prompt that asks for it (audit_prompt ODV1-A2, the J6 prompt); older text records it without a flag.
const dcmM=src0.match(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?DEFENDER CHAIN MARK[ \t]*:?[ \t]*(FOOTED|FORGED|STRAINED|SLACK)\b/im);
let defender_chain_mark=dcmM?dcmM[1].toUpperCase():null;
if(defender_chain_mark==='FORGED')defender_chain_mark='FOOTED';
if(challenger_chain_mark===null){raw+=asked?'\n\n[AUDIT v18: CHALLENGER CHAIN MARK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\n\n[AUDIT v18: CHALLENGER CHAIN MARK not asked by the prompt that produced this text; null recorded, no flag.]';}
if(defender_chain_mark===null){raw+=askedD?'\n\n[AUDIT v20: DEFENDER CHAIN MARK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT. REVIEW THIS ROW.]':'\n\n[AUDIT v20: DEFENDER CHAIN MARK not asked by the prompt that produced this text; null recorded, no flag.]';}
// BB-6904 (b), portion 3: DEBATE RULE VIOLATION, rule B on the judge's own BROKEN lines. A line graded DEFENDER LINK BROKEN or
// CHALLENGER LINK BROKEN must exhibit, on the line itself, two lower layers of different kinds (6903): [L1] with quoted words, [L2] with
// a source word (own script, transliteration marks, or a Strong's number; 6926; the Latin range narrowed to transliteration letters, 6936),
// [L3] with a named reference. A tag after "no", "without", "lacks" or "not" never counts. K-G1 (6892): a BROKEN line resting on a
// witness left unanswered while that side's stated conceded count is 0. K-G3 (6934): a side graded SELF-SUPPORTED while any of its
// links is graded BROKEN. K-G2: an absent CITATION CHECK line on text from a prompt that asks for it, recorded only. The counter is
// kb.cjs (git 29caa5c), names prefixed. Lines are chosen the extractor's way: a "D<n> vs" collision entry whose first grade is DEFENDER
// or CHALLENGER LINK BROKEN. No grade is changed; each violation is a review line (6890 AMEND 2).
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
// judge_fix6 H8 (run 32293: the K-LB check added in judge_fix5 fired falsely on every seat and removed a correct judge, GLM): THE ENFORCER STATUS
// TABLE, the one place a rule's status is set (lib/status.js; the patch copies this block unchanged into every node that counts or reports items).
// LIVE: an item left UNCURED counts in drv_uncured, and a seat with drv_uncured above 0 is removed for an alternate, as before.
// TRIAL: the rule's marks are written to the seat's text, the review notes and the enforcer log, and its items are sent to the judge's cure for a
// RESPONSE; an item left UNCURED is reported as such but never counts in drv_uncured, so it never removes a seat, and a TRIAL item never raises
// the count another item's cure must reach. A rule not in the table is LIVE. A new check enters as TRIAL and becomes LIVE only by an edit here,
// after it has proved itself on stored text. C4-RENUM and C4-PRESS (the close-round numbering and press checks) make notes, never items.
const ENF_STATUS={'K-B':'LIVE','K-C':'LIVE','K-G1':'LIVE','K-G3':'LIVE','K-G4':'LIVE','K-G6':'LIVE','K-G7':'LIVE','K-G8':'LIVE','K-N':'LIVE','K-S':'LIVE','K-SC':'LIVE',
 'K-LB':'TRIAL','K-G9':'TRIAL','K-G10':'TRIAL','K-G11':'TRIAL','K-V':'TRIAL','K-S2':'TRIAL','K-LXX':'TRIAL','K-P':'TRIAL','K-F':'TRIAL','K-R':'TRIAL','K-L2':'TRIAL','C4-RENUM':'TRIAL','C4-PRESS':'TRIAL'};
const enfStatus=r=>ENF_STATUS[String(r||'')]==='TRIAL'?'TRIAL':'LIVE';
const enfLive=x=>enfStatus(x&&x.rule)==='LIVE';
const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&enfLive(x)).length;
const enfTrialWhy=(x,why)=>enfLive(x)?why:'TRIAL rule (recorded and answered; it removes no seat)'+(why?': '+why:'');
const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_REF_END=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}(?:\s?[-–]\s?\d{1,3})?[\s*_]*$/; // BB-7994 step 6b: a reference written just before its [L3] tag ("Job 15:14 [L3]") names the reference
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/; // BB-6926 option A: own script (Hebrew, Greek), transliteration marks, or a Strong's number; no italic alternative
// judge_fix6 H2 (run 32293: GLM's statements quoted the KJV in single marks, 'And he said unto me ...', and the single judge nested a quotation in
// another, "1 Chronicles 28:6 "And he said ... father.""): a quotation is double marks or single marks, each closed by its own kind of mark; a
// mark inside a word (Joseph's, Father's) never opens or closes one (BB-6898 D1), and a closing mark may stand before another mark (a nested quotation).
const DRV_QUOTE=/(?:^|[\s(\[{"“'‘:,;—–-])(?:["“][^"”\n]{4,}?["”]|['‘][^\n]{4,}?['’])(?=$|[\s.,;:!?)\]}"”'’—–-])/;
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
// judge_fix3 A1 (run 32255, DeepSeek D5 vs C2: "[L2] sperma, seed", "[L2] genomenou (made, come to be)", "[L2] ek sou (out of you)" were refused,
// and the seat was not counted): an [L2] tag counts when it sits on a source-language word written in plain letters with its English meaning
// beside it, in parentheses or after a comma, colon, "=" or "meaning". The word stands directly after the tag, or directly before it with
// its meaning ("ek (out of) [L2]", run 32255 Qwen). An English word is never a transliteration (stop list); script, marks and Strong's numbers count as before.
// judge_fix6 H1 (run 32293: "[L2] John 1:13 "Which were born ..." ... Romans 1:3 adds kata sarka (according to flesh)" and "[L2] The loins-word of
// Acts 2:30 (osphys, loins) ..." were read as no source word, because the plain-letter word did not stand first): the word with its meaning
// counts ANYWHERE in the tag's text: a plain-letter word followed by its meaning in parentheses ("kata sarka (according to flesh)"), or a word
// and its meaning together in parentheses after a comma ("(osphys, loins)"). The meaning starts with a small letter and holds no verse number.
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const DRV_TL_AFTER=/^\s*[*_]*\s*(?:(?:Greek|Hebrew|Aramaic)\s+)?[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*(?:\(\s*[^()\n]{2,80}\)|,\s*["“]?[a-z]|:\s*["“]?[a-z]|=\s*["“]?[a-z]|\s+(?:meaning|means|i\.e\.)\b)/;
const DRV_TL_BEFORE=/(?:^|[\s(,;])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*[^()\n]{2,80}\)\s*$/;
const DRV_TL_ANY=/(?:^|[\s(,;:"“'‘])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const DRV_TL_PAIR=/\(\s*[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*,\s*([a-z][a-z'’ -]{1,40}?)\s*\)/g;
const drvTranslit=(rest,before)=>{const ok=m=>{if(!m)return false;const w=m[1].split(/\s+/);while(w.length&&DRV_TL_STOP.test(w[0]))w.shift();return w.length>0&&!DRV_TL_STOP.test(w[w.length-1]);};
 const gl=m=>!/\d|^(?:see|cf|compare|or|i\.e)\b/i.test(String(m[2]||''));const any=rx=>[...String(rest||'').matchAll(rx)].some(m=>ok(m)&&gl(m));
 return ok(String(rest||'').match(DRV_TL_AFTER))||ok(String(before||'').match(DRV_TL_BEFORE))||any(DRV_TL_ANY)||any(DRV_TL_PAIR);};
// judge_fix6 H1: ONE layer reader, drvLayers, for rule B's K-B, the link-round check K-LB and every cure check (drvKinds is drvLayers). Each tag
// [L1], [L2] or [L3] (or a joined "[L1]/[L2]", "[L1] and [L2]") is read from its end to the next layer tag or a blank line, whichever comes first;
// a tag after "no", "without", "lacks" or "not" never counts. [L1] needs KJV words in quotation marks (double or single); [L2] a source word (its
// script, transliteration marks, a Strong's number, or plain letters with the English meaning beside it, anywhere in the tag's text); [L3] a
// reference by book, chapter and verse (in the text, or written just before the tag). It returns the layer kinds met, sorted.
function drvLayers(text){return lbFoot(text,true);} /* judge_fix8 R5, ruling 400: the layer kinds of a line or block, read by FOOTING LAYERS (lib/lbfoot.js) */
function drvLayersByTag(text){const t=String(text==null?'':text).replace(/\*\*/g,'').replace(/__/g,'');const re=/\[L([1-3])\](?:\s*(?:\/|and|,)?\s*\[L([1-3])\])*/g;const at=[];let m;
 while((m=re.exec(t)))at.push({i:m.index,e:m.index+m[0].length,ts:[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1])});const met=new Set();
 at.forEach(x=>{if(DRV_NEG.test(t.slice(Math.max(0,x.i-30),x.i)))return;const tail=t.slice(x.e);let end=tail.search(/\[L[1-4]\]|\n\s*\n/);end=end<0?t.length:x.e+end;
  const rest=t.slice(x.e,end);
  for(const ty of x.ts){if(ty==='1'&&DRV_QUOTE.test(rest))met.add('L1');if(ty==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest,t.slice(Math.max(0,x.i-60),x.i))))met.add('L2');
   if(ty==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(t.slice(Math.max(0,x.i-40),x.i))))met.add('L3');}});
 return [...met].sort();}
// The older name, kept for any caller: the kinds met (distinct) or their number.
function drvExhibits(line,needQuote,formC,distinct){const k=drvLayers(line);return distinct?k:k.length;}
const drvKinds=(line)=>drvLayers(line);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
// P2D v6a item 1b (BB-8136): K-S, a STANDS or UNDERDETERMINED line whose ground is that a single verse does not state a link or its
// contrary, naming no later round ([CR2], [CR3], [DR1], [DR2], [DR3]) that answered the witness. Sent to the cure to be regraded on the answered test.
const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;
const DRV_ANS=/[\[(](?:CR[2-4]|DR[1-3])\b/i; /* judge_fix3 B3: [CR4], the defender's close, answers; [DR4] answers nothing new */ // judge_fix2 R2: [DR1] answers a press made in [CR1]
// BB-8172 C2 (B): a round named without a bracket after in, at, by or from ("answered in CR3") counts as named, for the K-S2 mark only.
const DRV_BARE=/\b(?:in|at|by|from)\s+(?:CR[2-4]|DR[1-3])\b/i; /* judge_fix3 B3 */ // judge_fix2 R2 // a round named as answering ("answered in CR3"), never a label such as "Challenger-DR1/DR2" (642)
// BB-8172 C2 (A): K-U, a STANDS or UNDERDETERMINED line that itself says a witness went unnamed or unanswered (8193, the 7 MARK lines).
// Positive forms only; a form counts only when the clause before it (since the last ; . or --) holds no negator, so "no witness ...
// was left unanswered" and "neither reading was left unanswered" are not marked (8193, the 14 NO MARK lines).
const DRV_UNANS=[/\b(?:was|were|is|are)\s+(?:left\s+)?(?:not\s+named|unnamed|unanswered|not\s+answered)\b/gi,/,\s*not\s+named\b/gi,/\bleft\s+(?:\S+\s+){1,8}?unnamed\b/gi,/\bunanswered\s+(?:[1-3]\s+)?[A-Z][a-z]+\s+\d+:\d+/g,/\bthe\s+unanswered\s+[a-z]+/gi];
const DRV_UNEG=/\b(?:no|neither|nor|not|never|without|cannot)\b/i;
function drvUnans(line){for(const rx of DRV_UNANS){rx.lastIndex=0;let m;while((m=rx.exec(line))){const pre=line.slice(0,m.index);
  const cl=pre.split(/;|\.(?=\s)|--|—/).pop();if(!DRV_UNEG.test(cl))return m[0];}}return null;}
// THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: per premise, both sides. A premise line of the PRESSED-WITNESS LEDGER sent
// to this judge that marks a verse NOT NAMED, and that the judge's CONCEDED LINKS (defender) or CHALLENGER CONCEDED LINKS (challenger) line
// does not count as CONCEDED or UNEXHIBITED (by "premise n", or "LINK m"), is one item. No ledger or no count line in the text: no item.
function drvPromptText(body){try{const b=body||{};const out=[];if(b.systemInstruction&&b.systemInstruction.parts)b.systemInstruction.parts.forEach(p=>out.push(String(p.text||'')));
 // judge_fix3 A4 (run 32255: no K-G6 on Gemini or Qwen; their K-C cure prompts read "CHALLENGER CHAIN: not found in the prompt"): __orc marks the
 // system message of google/ and qwen/ models for caching as [{type:'text',text,cache_control}]; JSON.stringify of that array turned every line
 // break into the two characters \\n, so the ledger's premise lines and the chain were never found. The text parts are read as text.
 (b.messages||[]).filter((m,i,a)=>{const tx=x=>typeof x==='string'?x:Array.isArray(x)?x.map(p=>p&&p.text||'').join(''):'';const H=/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/;if(m&&m.role==='user')return !H.test(tx(m.content));if(m&&m.role==='assistant'){const p=a[i-1];return !(p&&p.role==='user'&&H.test(tx(p.content)));}return true;}).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:JSON.stringify(p)));else out.push(JSON.stringify(c));});(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
// THE DEBATE FIXED (BB-7397, DoD 9 as typed fields, BB-7455): the panel judge's own JSON fields counted_premises_defender and
// counted_premises_challenger, each an array of ledger premise numbers. Missing or null: ABSENT. Anything but an array of integers >= 1:
// INVALID, the raw value kept for the mark; so is a number above the count of that side's ledger premises (BB-7457 F-range). No text of the judge's prose is read for the set. Where a field is ABSENT or INVALID the checks
// by number fall back to the stated count (A): an item only at a count of 0. The single judge returns no fields, so it is always (A).
function drvLedgerN(ptext,side){if(typeof ptext!=='string')return null;const i=drvLabAt(ptext,'DEFENDER',0);const j=i<0?-1:drvLabAt(ptext,'CHALLENGER',i);
 const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);if(i<0||j<0||k<0)return null;const n=(side==='DEFENDER'?ptext.slice(i,j):ptext.slice(j,k)).split('\n').filter(l=>/^\s*premise \d+/.test(l)).length;return n||null;}
function drvCPA(val,max){if(val===undefined||val===null)return {present:false,why:'absent'};
 if(!Array.isArray(val)||!val.every(x=>Number.isInteger(x)&&x>=1&&(!max||x<=max))){let r;try{r=JSON.stringify(val);}catch(e){r=String(val);}return {present:false,why:'invalid',raw:String(r).slice(0,200)};}
 return {present:true,set:new Set(val),line:JSON.stringify(val)};}
// The ledger's own map from a defender link to the premises graded against it ("A challenger premise written LINK i: is graded against Di"):
// LINK m -> the premise numbers written "(LINK m)". No LINK label in the ledger: null, and premise n stands for D<n>.
function drvLinkMap(ptext){if(typeof ptext!=='string')return null;const i=drvLabAt(ptext,'DEFENDER',0);const j=i<0?-1:drvLabAt(ptext,'CHALLENGER',i);
 if(i<0||j<0)return null;const M={};let any=false;for(const l of ptext.slice(i,j).split('\n')){const m=l.trim().match(/^premise (\d+) \(LINK (\d+)\)/);if(m){any=true;(M[+m[2]]=M[+m[2]]||[]).push(+m[1]);}}
 return any?M:null;}
const drvCountLine=(T,side)=>{const m=T.match(side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*$/im:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*$/im);return m?m[0]:null;};
// DoD 7 (BB-7420) K-G7: a COLLISION POINTS line graded DEFENDER LINK BROKEN on D<n> whose premise n (or LINK n) the same judge's CONCEDED LINKS
// line does not count. No word test. Not raised where K-G1 already raised the link. The challenger count numbers premises from the defender's
// list, not by C<j> (BB-7430, option (c)): a CHALLENGER LINK BROKEN line is raised only when CHALLENGER CONCEDED LINKS is 0 and the line reads an
// unanswered witness (DRV_WORDS7). LIMIT: with the challenger count above 0, an uncounted challenger premise is not checked by number and is not
// raised. L and the standing are read from the judge's own STANDING lines.
const DRV_WORDS7=/\b(?:unanswered|not answered|unnamed|not named|never named|none named|neither named|unaddressed|unexhibited)\b/i;
function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext,CPV){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const T=text.replace(/[*_`]+/g,'');
 const cl=drvCountLine(T,'DEFENDER');const lm=T.match(/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const L=drvLedgerN(ptext,'DEFENDER')||(lm?+lm[1]:null);
 const cm=T.match(/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/im);const LC=drvLedgerN(ptext,'CHALLENGER')||(cm?+cm[1]:null);
 // DoD 9 (BB-7455): each side's counted_premises field; ABSENT or INVALID is written to the row; a valid array whose size differs from its count is K-G8.
 const LK=drvLinkMap(ptext);const CP={DEFENDER:drvCPA(CPV&&CPV.DEFENDER,drvLedgerN(ptext,'DEFENDER')),CHALLENGER:drvCPA(CPV&&CPV.CHALLENGER,drvLedgerN(ptext,'CHALLENGER'))};
 for(const sd of ['DEFENDER','CHALLENGER']){const cp=CP[sd],sc=sd==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present){marks.push('[AUDIT v21: COUNTED PREMISES '+sd+' FIELD '+(cp.why==='invalid'?'INVALID: '+String(cp.raw||'').replace(/\[/g,'(').replace(/\]/g,')'):'ABSENT')+' -- the checks by number fall back to the stated count (A).]');continue;}
  if(typeof sc==='number'&&cp.set.size!==sc){items.push({rule:'K-G8',side:sd,link:sd+' COUNTED PREMISES',line:cp.line,premise:null,conc:cp.set.size,st:sd==='DEFENDER'?dStand:cStand,L:sd==='DEFENDER'?L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G8) -- counted_premises_'+sd.toLowerCase()+' lists '+cp.set.size+' premise(s) while the count is '+sc+'. REVIEW THIS ROW.]');}}
 const dBase=CP.DEFENDER.present?CP.DEFENDER.set.size:dConc;const cZero=cConc===0;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');const n=+m[1];
  if((prior||[]).some(x=>x.rule==='K-G1'&&x.link===id))continue;
  if(g[1]==='CHALLENGER LINK BROKEN'){if(!cZero||!DRV_WORDS7.test(line))continue;
   items.push({rule:'K-G7',side:'CHALLENGER',link:id,line,premise:null,conc:cConc,st:cStand,L:LC});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' CHALLENGER LINK BROKEN for a pressed witness (under PRESSED WITH, ruling 392) left unanswered while CHALLENGER CONCEDED LINKS is 0. REVIEW THIS ROW.]');continue;}
  if(typeof dConc!=='number')continue;const ps=LK?(LK[n]||[]):[n];const viaA=!CP.DEFENDER.present||!ps.length;
  if(viaA){if(dConc!==0)continue;}else if(ps.some(q=>CP.DEFENDER.set.has(q)))continue;
  items.push({rule:'K-G7',side:'DEFENDER',link:id,line,premise:ps.length?ps[0]:null,conc:dBase,st:dStand,L});
  marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G7) -- '+id+' DEFENDER LINK BROKEN while '+(viaA?'CONCEDED LINKS is 0':'counted_premises_defender does not list premise '+ps.join(' or '))+'. REVIEW THIS ROW.]');}
 return {items,marks};}
// judge_fix7 J2 (run 32302, enforcer rows 97, 98 and 108, 109: ChatGPT and Sol ruled challenger premises 1, 4 and 5 VOID; K-G6 marked premise 4
// and K-G9 marked the verses pressed under it, and ChatGPT's cure then counted the VOID premises 1 and 4, COLLAPSED 4 from PROP-DEPENDENT 2):
// K-G6 and K-G9 never mark a premise the seat ruled VOID (lbVoid, as K-LB). For K-G9 a verse belongs to the listed premise(s) whose line carries
// it, or whose line holds the ruling's quotation; a verse of no listed premise is still marked. The items carry the seat's VOID premises and the
// list, so the cure check never lets a count include a VOID premise.
function ciPlist(R,side){const t=String((side==='CHALLENGER'?R.CR3:R.DR2)||'');const re=side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
 let i=-1;for(const m of t.matchAll(re))i=m.index;if(i<0)return [];const list=t.slice(i);
 const its=list.split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>({n:k+1,keys:[...ciKeys(x)],text:x}));}
function ciVoidOf(x,PL,VD){const K=x.keys||ciKeys(x.ref);const ps=PL.filter(p=>p.keys.some(k=>K.has(k))||(x.q&&ciFound(x.q,p.text))).map(p=>p.n);return ps.length>0&&ps.every(j=>VD.has(j));}
const lbVoidList=v=>({all:!!v.all,set:[...v.set]});
function drvLedger(text,ptext,dConc,cConc,dStand,cStand,CPV){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const i=drvLabAt(ptext,'DEFENDER',0);const j=i<0?-1:drvLabAt(ptext,'CHALLENGER',i);const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);
 if(i<0||j<0||k<0)return {items,marks};
 const prem=s=>s.split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l));const LG={DEFENDER:prem(ptext.slice(i,j)),CHALLENGER:prem(ptext.slice(j,k))};
 const T=text.replace(/[*_`]+/g,'');
 const countLine=side=>drvCountLine(T,side);
 const VD={DEFENDER:lbVoid(text,'DEFENDER'),CHALLENGER:lbVoid(text,'CHALLENGER')}; // judge_fix7 J2: the premises the seat ruled VOID

 for(const side of ['DEFENDER','CHALLENGER']){const cp=drvCPA(CPV&&CPV[side],drvLedgerN(ptext,side));const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present&&sc!==0)continue;
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(cp.present&&cp.set.has(+m[1]))continue;
   if(VD[side].has(+m[1]))continue; // judge_fix7 J2: a premise the seat ruled VOID counts for neither side and is never marked
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length,void:lbVoidList(VD[side])});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G6) -- '+id+(m[2]?' (LINK '+m[2]+')':'')+': the PRESSED-WITNESS LEDGER marks '+m[3].trim()+' NOT NAMED and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it. REVIEW THIS ROW.]');}}
 return {items,marks};}
// judge_fix5 G2 (run 32284: the ledger's line "cited in [CR1], [CR2] or [CR3] and not named in a later round of the challenger (42 of 92)" was
// ruled on by one judge only: ChatGPT counted challenger premises 4 and 5 UNEXHIBITED for Luke 3:31, Gemini and GLM said nothing of the line,
// and the panel outcome turned on it; rulings 372 and 373): every judge rules on every verse each "cited in" line lists, one line per verse,
//   PRESSED: <book chapter:verse> -- [<pressing round>] -- "<the pressing sentence, quoted>" -- UNANSWERED
//   PRESSED: <book chapter:verse> -- [<pressing round>] -- "<the pressing sentence, quoted>" -- ANSWERED IN [<round>]
//   NOT PRESSED: <book chapter:verse>
// K-G9 marks a side when (a) a listed verse has no valid ruling (no line, a quotation not found in the round named, a round that does not press
// that side, or ANSWERED IN a round that does not name the verse: an answer counts only by book, chapter and verse, ruling 376), or (b) a verse
// ruled PRESSED and UNANSWERED is not counted: under ruling 372 the premise is UNEXHIBITED and counts, so the side's count must be at least 1 and
// its CONCEDED LINKS (or CHALLENGER CONCEDED LINKS) line must name the verse. The cure follows the mark-and-cure pattern (RESPONSE required).
// judge_fix6 H5 (run 32293: Gemini, ChatGPT, GLM and the single judge wrote NOT PRESSED for Luke 1:27 and Matthew 1:22 with no reason, and the
// outcome turned on those rulings): a NOT PRESSED ruling gives its reason in one clause after the reference,
//   NOT PRESSED: <book chapter:verse> -- <reason, e.g. quoted for the defender's own chain, not against a link or listed premise of the challenger>
// (or after a semicolon, a colon, a comma, in parentheses, or as a "because ..." clause); a NOT PRESSED with no reason of three words or more
// is not a valid ruling (cure: the line with its reason, or PRESSED), and with RESPONSE as for every item. When a side passes, the seat's text
// carries "K-G9 PASS: n verses ruled", so the record shows the check ran. K-G9 is a TRIAL rule (ENF_STATUS): it removes no seat.
const CI_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const CI_ANS={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};
const CI_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const ciQ=s=>String(s==null?'':s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\s+/g,' ').trim();
const ciFound=(q,txt)=>{const T=ciQ(txt);const ps=String(q).split(/\.{3}|…/).map(x=>ciQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));};
const ciKeys=s=>new Set(REFP.keys(String(s||''),{scoped:true,cap:12}).map(k=>k.key));
// The two "cited in" lines of the PRESSED-WITNESS LEDGER in the judge's prompt: the verses listed against each side.
function ciLedger(ptext){const out={};const t=String(ptext||'');
 for(const m of t.matchAll(/^cited in [^\n]*?not named in a later round of the (defender|challenger)[^\n]*?\((\d+) of (\d+)\):\s*([^\n]*)$/gmi)){const side=m[1].toUpperCase();if(out[side])continue;
  const list=/^none\s*$/i.test(m[4].trim())?[]:m[4].split(/,\s+(?=(?:[1-3]\s)?[A-Z])/).map(x=>x.trim()).filter(Boolean);out[side]={n:+m[2],total:+m[3],labels:list,line:m[0]};}
 return out;}
// The rounds as the judge was sent them ("=== [CR2] ... ===" sections of the prompt).
function ciRounds(ptext){const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7; /* judge_fix7 J5 */out[x.k]=t.slice(x.e,end);});return out;}
// The ruling lines in a text (a judgment's reasoning or a cure reply).
const CI_LINE=/^\s*(?:[-*•>]|\d+[.)])?\s*(NOT PRESSED|PRESSED)\s*:\s*(.+)$/i;
const CI_PRESSED=/^(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*["“](.+)["”]\s*(?:--|—|–)\s*(UNANSWERED|ANSWERED\s+IN\s*\[?\s*((?:CR|DR)[1-4])\s*\]?)\s*\.?$/i;
function ciForm(kind,rest){if(/^NOT PRESSED$/i.test(kind))return /^[^|]*\d+:\d+[^|]*$/.test(rest)&&!/\bvs\.?\s+C\d/i.test(rest);return CI_PRESSED.test(rest);}
// The reference part of a NOT PRESSED line and the reason after it.
function ciNP(rest){const s=String(rest||'');const ps=REFP.parse(s,{scoped:true}).filter(r=>r.at===REFP.parse(s,{scoped:true})[0].at);let end=ps.length?Math.max(...ps.map(r=>r.end)):0;
 const ref=s.slice(0,end).replace(/[.\s]+$/,'').trim();const why=s.slice(end).replace(/^\s*\)?\s*(?:--|—|–|-|;|:|,|\()?\s*/,'').replace(/\)?[\s.]*$/,'').trim();return {ref:ref||s.replace(/[.\s]+$/,''),why};}
const ciReasoned=w=>(String(w||'').match(/[A-Za-z]{2,}/g)||[]).length>=3;
function ciRulings(text){const out=[];const T=String(text||'').replace(/\\n/g,'\n');
 for(const raw of T.split('\n')){const l=raw.replace(/\*\*/g,'').replace(/`/g,'').trim();const m=l.match(CI_LINE);if(!m)continue;const kind=m[1].toUpperCase().replace(/\s+/g,' ');const rest=m[2].trim();
  if(kind==='NOT PRESSED'){if(!ciForm(kind,rest))continue;const np=ciNP(rest);out.push({kind,keys:ciKeys(np.ref),ref:np.ref,reason:np.why,line:l});continue;}
  const p=rest.match(CI_PRESSED);if(!p)continue;const ans=/^UNANSWERED$/i.test(p[4])?'UNANSWERED':'ANSWERED';
  out.push({kind,keys:ciKeys(p[1]),ref:p[1].trim(),round:p[2].toUpperCase(),q:p[3],ans,ansRound:p[5]?p[5].toUpperCase():null,line:l});}
 return out;}
// Whether one ruling is valid against the rounds R: its pressing round presses that side and holds the quotation; ANSWERED IN names a later round
// of the holding side that names the verse by book, chapter and verse.
function ciValid(x,side,R){if(x.kind==='NOT PRESSED')return ciReasoned(x.reason)?{ok:true}:{ok:false,why:'NOT PRESSED gives no reason'};
 if(!CI_PRESS[side].includes(x.round))return {ok:false,why:'['+x.round+'] does not press the '+side.toLowerCase()};
 if(typeof R[x.round]!=='string')return {ok:false,why:'the text of ['+x.round+'] could not be read'};
 if(!ciFound(x.q,R[x.round]))return {ok:false,why:'the quotation is not found in ['+x.round+']'};
 if(x.ans==='ANSWERED'){const a=x.ansRound;if(!CI_ANS[side].includes(a)||CI_ORD.indexOf(a)<=CI_ORD.indexOf(x.round))return {ok:false,why:'ANSWERED IN ['+a+'] is not a later round of the '+side.toLowerCase()};
  const K=ciKeys(R[a]);if(![...x.keys].some(k=>K.has(k)))return {ok:false,why:'ANSWERED IN ['+a+'], which does not name '+x.ref+' by book, chapter and verse (ruling 376)'};}
 return {ok:true};}
// The count section of a side: its CONCEDED LINKS (or CHALLENGER CONCEDED LINKS) line and the item lines under it.
function ciCountSection(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const L=T.split('\n');const head=side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:/i:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:/i;
 const STOP=/^[ \t>#-]*(?:CHALLENGE STANDING|DEFENSE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|COLLISION POINTS|CITATION CHECK|OUT-OF-ROUND|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|CITED-IN RULINGS|NOT PRESSED|PRESSED|REASONING|VERDICT)\b/i;
 const i=L.findIndex(l=>head.test(l));if(i<0)return null;const out=[L[i]];for(const l of L.slice(i+1)){if(STOP.test(l))break;out.push(l);}return out.join('\n');}
// The check, on one judgment: items (one K-G9 per side at most) and marks.
function drvCited(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const LG=ciLedger(ptext);if(!LG.DEFENDER&&!LG.CHALLENGER){marks.push('[AUDIT v26: K-G9 PASS: 0 verses ruled -- the prompt holds no cited-in line of the ledger; TRIAL rule]');return {items,marks};}const R=ciRounds(ptext);const RU=ciRulings(text);const pass=[];
 for(const side of ['DEFENDER','CHALLENGER']){const lg=LG[side];const conc=side==='DEFENDER'?dConc:cConc;const st=side==='DEFENDER'?dStand:cStand;
  const VD=lbVoid(text,side);const PL=ciPlist(R,side);const onVoid=z=>ciVoidOf(z,PL,VD); // judge_fix7 J2
  const missing=[],why=[];const mine=RU.filter(x=>x.kind==='NOT PRESSED'||CI_PRESS[side].includes(x.round)||(lg&&lg.labels.some(l=>[...ciKeys(l)].some(k=>x.keys.has(k)))));
  if(lg)for(const lab of lg.labels){const K=ciKeys(lab);if(onVoid({ref:lab,keys:K}))continue; /* judge_fix7 J2: a verse of a VOID premise needs no ruling */const rs=mine.filter(x=>[...x.keys].some(k=>K.has(k)));if(!rs.length){missing.push(lab);continue;}
   const bad=rs.map(x=>({x,v:ciValid(x,side,R)})).filter(z=>!z.v.ok);if(bad.length===rs.length){missing.push(lab);why.push(lab+': '+bad[0].v.why);}}
  const pu=RU.filter(x=>x.kind==='PRESSED'&&x.ans==='UNANSWERED'&&CI_PRESS[side].includes(x.round)&&ciValid(x,side,R).ok);
  const cs=ciCountSection(text,side);const CK=cs?ciKeys(cs):new Set();const uncounted=pu.filter(x=>!onVoid(x)).filter(x=>typeof conc!=='number'||conc<1||![...x.keys].some(k=>CK.has(k))).map(x=>x.ref); /* judge_fix7 J2: not a verse of a VOID premise */
  if(!missing.length&&!uncounted.length){if(lg)pass.push({side,n:lg.labels.length});continue;}
  const line=(missing.length?'the ledger lists '+lg.labels.length+' verse(s) cited against the '+side.toLowerCase()+' and not named in a later round of it; no valid ruling for '+missing.length+': '+missing.join(', ')+(why.length?' ('+why.join('; ')+')':''):'')+(missing.length&&uncounted.length?'; ':'')+(uncounted.length?'ruled PRESSED and UNANSWERED but not counted in '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+': '+[...new Set(uncounted)].join(', '):'');
  items.push({rule:'K-G9',side,link:side+' CITED-IN',line,missing,uncounted:[...new Set(uncounted)],conc:typeof conc==='number'?conc:0,st,L:(LN&&LN[side])||null,void:lbVoidList(VD),plist:PL.map(p=>({n:p.n,keys:p.keys}))});
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G9) -- '+side+' CITED-IN: '+line.replace(/[\[\]]/g,'')+'. Ruling 372: a pressed witness left unanswered makes the premise UNEXHIBITED and counts; a NOT PRESSED ruling gives its reason in one clause. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 if(pass.length)marks.push('[AUDIT v26: K-G9 PASS: '+pass.reduce((a,p)=>a+p.n,0)+' verses ruled -- '+pass.map(p=>p.side+' CITED-IN '+p.n).join('; ')+'; TRIAL rule]');
 return {items,marks};}
// judge_fix8 K2 (md_notes_rulings 392, the operator: "a press must have a premise behind it; a verse pressed without one isn't a witness"):
// a pressed witness is a verse carried under PRESSED WITH: beside a numbered premise of the list against that side (against the defender: the
// list that closes [DR2]; against the challenger: the CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3]). The ledger's "cited in"
// verses are not witnesses, so K-G9 (a ruling on every cited-in verse) is retired. K-G10 (TRIAL, ENF_STATUS) marks a seat that counts a premise
// UNEXHIBITED on a verse no listed premise of that side's list carries under PRESSED WITH: (runs 32284 ChatGPT, Luke 3:31; 32293 Sol, Luke 1:27
// and Matthew 1:22). It reads the seat's count section (CONCEDED LINKS or CHALLENGER CONCEDED LINKS and the item lines under it), one segment
// per premise named there; a segment tagged UNEXHIBITED on a witness ground (unanswered, unnamed, pressed, witness, no later answer, ruling
// 372) names as its witnesses the verses of the clauses that say a verse was left unanswered and are not footing clauses (exhibit, footing, a
// layer tag, quotations, prior layers). A premise is marked only when every witness it is counted on is carried under no PRESSED WITH: and its
// segment states no footing ground as well (fewer than two layers, only [L1], no footing): a premise also counted on a true witness, or on its
// footing, is counted rightly (run 32302 GLM, premise 4: Luke 3:31 under PRESSED WITH, Matthew 1:1 not). A premise the seat ruled VOID is skipped. Cure: a CORRECTED COUNT without the premise (and the standing that count makes true), or a STATEMENT
// for the item quoting the PRESSED WITH: line that carries the verse.
// judge_fix8 R13 (the operator, md_notes_rulings 393): a listed premise carries at most 8 pressed verses under PRESSED WITH:, both sides; the
// verses after the 8th (in the order written) are not witnesses (ruling 392 applies to them) and the system lists them as over the cap.
const PW_CAP=8;
const PW_ROUND={DEFENDER:'DR2',CHALLENGER:'CR3'};
const pwHead=side=>side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
// The listed premises against a side, each with its PRESSED WITH: segment (to the item's end or its first blank line) and the verses it carries.
function pwList(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);let seg=j<0?'':x.slice(j);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);
  const body=seg.replace(/^PRESSED WITH\s*:\s*/i,'');const none=/^[\s*_]*none\b/i.test(body);
  const K=none||j<0?[]:[...ciKeys(body)]; /* judge_fix8 R13 (md_notes_rulings 393): at most PW_CAP pressed verses per premise; a verse beyond the cap is not a witness */
  /* judge_fix9 S3 (rulings 398, 399): keys are the proven presses (PROVEN, PROVEN BY REFERENCE); all, every press within the cap; cls, the parse */
  const P=(none||j<0||typeof PRS==='undefined')?null:PRS.premise(seg,R,PW_ROUND[side],(typeof PRS_L2BAD!=='undefined'?PRS_L2BAD:null));const H=P?[...P.verses.map(v=>v.key),...P.over]:K; /* fix set 10 (cap): count the verse at the head of each PRESSED WITH entry, not every reference in it */const all=new Set(H.slice(0,PW_CAP));
  const pv=P?new Set(P.verses.filter(v=>v.cls!=='UNPROVEN').map(v=>v.key)):all;
  return {n:k+1,has:j>=0,seg:none?'':seg,keys:new Set([...all].filter(z=>pv.has(z))),all,unproven:[...all].filter(z=>!pv.has(z)),cls:P?P.verses:[],over:H.slice(PW_CAP)};});}
const PW_SEG=/(^|\n|[;.]\s+|--\s*|—\s*|:\s+)(?:[-•>]\s*)?(?:\d+[.)]\s*)?[*_]*\s*premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\b(?:\s*\(LINK\s+(?:\d+|none)\))?[*_]*(?=\s*(?:is\b|are\b|:|--|—|\(|UNEXHIBITED|CONCEDED|VOID|SUPPORTED|SPARED|STANDS|NOT\b))/gi;
const PW_WIT=/unanswer|unnamed|not named|no later|pressed|witness|ruling 372|\b372\b/i;
const PW_FOOT=/\bexhibit|\bfooting\b|\[L[1-3]\]|\bquotations\b|prior layers?/i;
const PW_UNANS=/unanswer|unnamed|not named|no later|not answered|receives no|\bleft\b|leaving|names or answers|without (?:an |any )?answer/i;
const PW_FOOTGROUND=/fewer than two|exhibits? only|only \[L[1-3]\]|no (?:layer )?footing|inadequate footing|one layer kind|single layer/i;
// The seat's premise segments of one side's count section that rest UNEXHIBITED on a witness, with the verses each names as its witness.
function pwSegments(text,side){const cs=ciCountSection(text,side);if(!cs)return [];const at=[];let m;PW_SEG.lastIndex=0;
 while((m=PW_SEG.exec(cs)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
 return at.map((x,k)=>{const seg=cs.slice(x.i,k+1<at.length?at[k+1].i:cs.length);const wit=/UNEXHIBITED/.test(seg)&&PW_WIT.test(seg);
  const cl=seg.split(/;\s+|,\s+(?:and|but|while|whereas)\s+|(?<=[.!?]["”'’)]?)\s+(?=[\[("“A-Z])|\s+and\s+(?=(?:it\s+|that\s+block\s+|the\s+block\s+|only\s+)?(?:exhibit|offer|show|rest|give)s?\b)|\s+but\s+(?=(?:it\s+|only\s+)?exhibit)/);
  const keys=new Set();if(wit)for(const c of cl){if(PW_FOOT.test(c)||!PW_UNANS.test(c))continue;for(const k0 of ciKeys(c))keys.add(k0);}
  return {ns:x.ns,seg:seg.trim(),wit,foot:PW_FOOTGROUND.test(seg),keys:[...keys]};});}
// judge_fix8 K5 (1) (ruling 392 at the COLLISION POINTS; run 32293 Sol, "D3 vs C2 ... CHALLENGER LINK BROKEN ... GROUND: ... and [DR3] leaves
// Luke 1:27 unanswered"): a pressed witness left unanswered is a BROKEN ground only when a listed premise carries it under PRESSED WITH:. K-G11
// (TRIAL) marks a collision line graded DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN when (a) every verse the line says was left unanswered
// (read from its clauses that say so and are not footing clauses, as K-G10 reads a count) is carried under no PRESSED WITH: of the list against
// the broken side, and (b) the line has no other unanswered ground: every verse it names that the list does carry under PRESSED WITH: is named
// in a later round of the broken side (the round after the first pressing round that names it). Cure: RETRACTED for the line with one CORRECTED
// RESULT, or a RESTATED line that is not graded LINK BROKEN, or a RESTATED LINK BROKEN line that names, as left unanswered, a verse the list
// carries under PRESSED WITH:.
const PW_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const PW_PRESSR={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const PW_ANSR={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};
const pwClauses=s=>String(s||'').split(/;\s+|,\s+(?:and|but|while|whereas)\s+|(?<=[.!?]["”'’)]?)\s+(?=[\[("“A-Z])|\s+and\s+(?=(?:it\s+|that\s+block\s+|the\s+block\s+|only\s+)?(?:exhibit|offer|show|rest|give)s?\b)|\s+but\s+(?=(?:it\s+|only\s+)?exhibit)/);
const pwUnans=s=>{const K=new Set();for(const c of pwClauses(s)){if(PW_FOOT.test(c)||!PW_UNANS.test(c))continue;for(const k of ciKeys(c))K.add(k);}return [...K];};
// a verse the list carries is answered when a round of the broken side after the first pressing round that names it names it
function pwAnswered(k,side,R){const pr=PW_PRESSR[side].filter(r=>typeof R[r]==='string'&&ciKeys(R[r]).has(k));if(!pr.length)return false;const first=Math.min(...pr.map(r=>PW_ORD.indexOf(r)));
 return PW_ANSR[side].some(r=>PW_ORD.indexOf(r)>first&&typeof R[r]==='string'&&ciKeys(R[r]).has(k));}
function drvBrokenPW(text,R){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const seen=new Set();const PWS={};
 for(const raw of T.split('\n')){const l=raw.trim();const m=l.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\s+vs\.?\s+C(\d+)\b/i);if(!m)continue;const g=(l.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1];
  if(!g||g==='UNDERDETERMINED')continue;const side=g.split(' ')[0];const id='D'+m[1]+' vs C'+m[2];if(seen.has(id+side))continue;seen.add(id+side);
  if(!PWS[side]){const PL=pwList(R,side);PWS[side]=PL?new Set(PL.flatMap(p=>[...p.keys])):null;PWS[side+'A']=PL?new Set(PL.flatMap(p=>[...(p.all||p.keys)])):null;}const PW=PWS[side];if(!PW)continue;const PA=PWS[side+'A']||PW; /* judge_fix9 S3 */
  const U=pwUnans(l);if(!U.length||U.some(k=>PW.has(k)))continue;
  const other=[...ciKeys(l)].filter(k=>PW.has(k)&&!pwAnswered(k,side,R));if(other.length)continue;
  const named=[...ciKeys(l)].filter(k=>PW.has(k));
  const kp=U.some(k=>PA.has(k)); /* judge_fix9 S6: K-P, a BROKEN line resting on presses the ledger marks UNPROVEN (ruling 398) */
  items.push({rule:kp?'K-P':'K-G11',side,link:id,line:l.slice(0,600),verses:U,pwNamed:named,pwk:[...PW]});
  if(kp){marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-P) -- '+id+' '+g+' rests, as unanswered, only on '+U.join(', ')+', presses the ledger marks UNPROVEN or carries under no PRESSED WITH; ruling 398: only a proven press is a witness, and an unproven press left unanswered is no BROKEN ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');continue;}
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G11) -- '+id+' '+g+' rests, as unanswered, only on '+U.join(', ')+', which no premise of the list against the '+side.toLowerCase()+' (the list that closes '+PW_ROUND[side]+') carries under PRESSED WITH'+(named.length?'; the verses of the line that list carries ('+named.join(', ')+') are each named in a later '+side.toLowerCase()+' round':'')+'. Ruling 392: a verse pressed without a premise is no BROKEN ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
// judge_fix8 K6 (run 32306: ChatGPT ruled 11 of 12 listed premises VOID, e.g. "premise 6 is VOID because its [CR1] quote excludes Joseph's
// seed, not seed altogether", "premise 3 is VOID because its [CR1] quote says legal fatherhood, not a register-name"; no check read a VOID
// ruling). K-V (TRIAL): every premise a seat rules VOID for a charge stronger than its quote must, in that ruling, quote the charge words that go
// beyond the quote and name the kind (a negation, a universal, or a claim the words of the quote do not make). The ruling is read from the
// seat's count section and standing line, one segment per premise named (as K-G10 reads them). A quoted phrase counts as charge words when it
// stands in that premise's item of the list against that side, outside the item's quoted passages (the verbatim quote and any KJV words) and
// outside its PRESSED WITH: segment. A ruling that the premise has no verbatim quote (the other VOID ground) needs no charge words. A ruling
// without them is marked. Cure: the premise regraded in a RESTATED count line (SUPPORTED, NARROWED, or counted, with CORRECTED COUNT and STANDING
// when counted), or a STATEMENT for the item quoting the charge words and naming the kind.
const KV_KIND=/\bnegations?\b|\bnegative\b|\buniversals?\b|\bclaim\b[^.;]{0,60}\b(?:quote|quotation)\b[^.;]{0,40}\b(?:do(?:es)?\s+not|never)\s+make|\bclaim\b[^.;]{0,30}\bnot\s+(?:made|in)\b[^.;]{0,20}\b(?:quote|quotation)\b/i;
const KV_NOQ=/\bno\s+verbatim\s+quot|\bnot\s+(?:found\s+)?verbatim\b|\bquot(?:e|ation)\s+(?:is\s+)?not\s+found\b|\bwithout\s+a\s+verbatim\s+quot/i;
const kvNorm=s=>String(s==null?'':s).toLowerCase().replace(/[“”"‘’'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const kvQuotes=s=>{const t=String(s||'');const out=[];for(const m of t.matchAll(/["“]([^"”\n]{1,240})["”]/g))out.push(m[1]);for(const m of t.matchAll(/(?:^|[\s(\[:;,])['‘]([^'’\n]{2,160})['’](?=$|[\s.,;:!?)\]])/g))out.push(m[1]);return out.map(q=>q.trim()).filter(q=>kvNorm(q).length>=2);};
// the charge text of each listed premise against a side: the item before PRESSED WITH:, its quoted passages removed
function kvCharges(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=j<0?x:x.slice(0,j);const ch=pre.replace(/["“][^"”]*["”]/g,' | ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 | ');return {n:k+1,charge:' '+kvNorm(ch)+' '};});}
// the VOID rulings of one side: segments of the count section and the standing line that rule premises VOID
function kvSegments(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const cs=ciCountSection(T,side)||'';const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const out=[];for(const src of [cs,st]){if(!src)continue;const at=[];let m;PW_SEG.lastIndex=0;while((m=PW_SEG.exec(src)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
  at.forEach((x,k)=>{const seg=src.slice(x.i,k+1<at.length?at[k+1].i:src.length);if(!/\bVOID\b/.test(seg)||/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(seg))return; /* as lbVoid reads a denial */out.push({ns:x.ns,seg:seg.trim()});});}
 return out;}
// judge_fix8 R7 (run 32306, Worker_E A7, Worker_G1 #1): the universal test, computed in code and served to the judges as a pre-check: a negation or
// universal word in a premise's charge that none of its quoted passages holds (only, never, all, none, no, not, every, always, alone, nothing,
// nowhere, neither, nor, without, cannot, any, reversed, excludes). A VOID ruling also passes K-V when it names such a word of that premise, quoted
// ("only") or in capitals (ONLY) or after "the word", "adds" or "universal"/"negation" -- the word that makes the charge stronger.
const KV_UNI=/^(?:only|never|all|none|no|not|every|always|alone|nothing|nowhere|neither|nor|without|cannot|any|reversed|excludes?|excluded)$/;
function kvUni(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return [];
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=(j<0?x:x.slice(0,j)).replace(/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i,'');const qs=kvQuotes(pre).map(kvNorm);const qw=new Set(qs.join(' ').split(' '));
  const ch=kvNorm(pre.replace(/["“][^"”]*["”]/g,' ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 '));const w=[...new Set(ch.split(' ').filter(x=>KV_UNI.test(x)&&!qw.has(x)))];return {n:k+1,words:w};});}
function kvNames(seg,words){const S=String(seg);return (words||[]).find(w=>{const st=w.replace(/(?:ed|es|s)$/,'');const loose=!/^(?:no|not|any|all|nor)$/.test(w); /* a common word counts only quoted, in capitals or after adds/the word */
 return new RegExp('["“\'‘]'+w+'["”\'’]|\\b'+w.toUpperCase()+'\\b|\\b(?:the\\s+word|adds?|added|universal|negation)\\s+["“\'‘]?'+w+'\\b','').test(S)||(loose&&new RegExp('\\b'+st+'[a-z]{0,3}\\b','i').test(S));})||null;}
function kvRulingOk(seg,n,CH,UNI){if(KV_NOQ.test(seg))return {ok:true,why:'no verbatim quote'};const kind=KV_KIND.test(seg);const c=(CH||[]).find(p=>p.n===n);
 const q=c?kvQuotes(seg).find(q=>c.charge.includes(' '+kvNorm(q)+' ')):null;if(kind&&q)return {ok:true,kind,q};const u=(UNI||[]).find(p=>p.n===n);const w=u?kvNames(seg,u.words):null;
 return w?{ok:true,kind:true,q:w,why:'names the word '+w}:{ok:false,kind,q:q||null};}
function drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);let read=0;
 for(const side of ['DEFENDER','CHALLENGER']){const CH=kvCharges(R,side);if(!CH)continue;const UNI=kvUni(R,side);const done=new Set();
  for(const sg of kvSegments(text,side))for(const n of sg.ns){if(done.has(n)||n>CH.length)continue;done.add(n);read++;const v=kvRulingOk(sg.seg,n,CH,UNI);if(v.ok)continue;
   const id=side+' premise '+n;const miss=(v.q?'':'quotes no charge words of premise '+n+' that go beyond its quote')+(!v.q&&!v.kind?' and ':'')+(v.kind?'':'names no kind (a negation, a universal, or a claim the words of the quote do not make)');
   items.push({rule:'K-V',side,link:id,premise:n,line:'premise '+n+' ruled VOID: '+sg.seg.replace(/\s+/g,' ').slice(0,400)+' -- the ruling '+miss,conc:side==='DEFENDER'?dConc:cConc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||CH.length});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-V) -- '+id+': ruled VOID, but the ruling '+miss+(()=>{const u=UNI.find(p=>p.n===n);return u&&u.words.length?' The system\'s universal test found in its charge, not in its quote: '+u.words.join(', ').toUpperCase()+'.':' The system\'s universal test found no negation or universal word in its charge that its quote lacks.';})()+' A charge is VOID as stronger than its quote only when it asserts what the quote does not; the ruling names the word that makes it stronger (as the universal test lists it) or quotes those charge words and names the kind. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}
 if(!items.length&&read)marks.push('[AUDIT v26: K-V PASS: '+read+' VOID ruling'+(read===1?'':'s')+' read; each quotes the charge words and names the kind; TRIAL rule]');
 return {items,marks};}
// judge_fix8 R11 (run 32306, Worker_E B1, Worker_G1 #8: the defender's round 1 rested "overshadow" on "the Greek Old Testament ... (Exodus
// 40:35)"; GLM and ChatGPT named it; Gemini wrote "No citation errors or Septuagint references occurred"). lxxScan reads the debaters' rounds for a
// sentence that rests a reading on the Septuagint (Septuagint, LXX, the Greek Old Testament or Greek translation) beside a verse reference and
// does not itself refuse it as footing. The scan is served to the judges with the pre-check; K-LXX (TRIAL) marks a judge whose text says no
// Septuagint reading or reference occurred while the scan found one. Cure: a STATEMENT for the item naming the Septuagint (or LXX, or the Greek
// Old Testament) with the round and words of the round quoted, or a RESTATED CITATION CHECK line that names it.
const LXX_RX=/\bSeptuagint\b|\bLXX\b|\bGreek\s+Old\s+Testament\b|\bGreek\s+(?:translation|version)\s+of\s+the\s+(?:Old\s+Testament|Hebrew)\b/i;
const LXX_REFUSE=/\bnot\s+(?:the\s+Hebrew|footing|a\s+KJV)|\bis\s+not\b|\brefus|\bno\s+weight\b|\bstrik|\bwithdr[ae]w|\bnot\s+(?:rest|stand)|\bcannot\b|\bnever\b/i;
function lxxScan(R){const out=[];for(const rk of ['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4']){const t=String((R&&R[rk])||'');if(!t)continue;
  for(const s0 of t.replace(/[*_]+/g,'').split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const s=s0.trim();if(!LXX_RX.test(s)||LXX_REFUSE.test(s))continue;const ref=(s.match(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/)||[])[0];if(!ref)continue;
   out.push({round:rk,ref,s:s.replace(/\s+/g,' ').slice(0,200)});}}
 return out;}
function lxxLine(R){const L=lxxScan(R);return 'SEPTUAGINT SCAN (computed by the system, not by a model): '+(L.length?L.map(x=>'['+x.round+'] rests a reading on the Greek Old Testament at '+x.ref+': "'+x.s.replace(/"/g,"'")+'"').join('; ')+'. A Septuagint reading is a citation error for either side: name it at the citation check.':'no round rests a reading on the Septuagint.');}
const LXX_DENY=/\bno\b[^.\n]{0,60}\b(?:Septuagint|LXX)\b[^.\n]{0,60}\b(?:occurred|occur|found|appear(?:ed|s)?|made|cited|used|references?|readings?)\b|\b(?:Septuagint|LXX)\b[^.\n]{0,40}\b(?:none|not\s+(?:cited|used|found|occur))\b|\bno\s+(?:Septuagint|LXX)\b/i;
function drvLxx(text,ptext){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const L=lxxScan(ciRounds(ptext));if(!L.length)return {items,marks};
 const T=netUnwrap(text).replace(/[*_`]+/g,'');const m=T.match(LXX_DENY);if(!m)return {items,marks};const side=/^C/.test(L[0].round)?'DEFENDER':'CHALLENGER';
 const line=(T.split('\n').find(l=>LXX_DENY.test(l))||m[0]).trim();
 items.push({rule:'K-LXX',side,link:'CITATION CHECK',line,lxx:L});
 marks.push('[AUDIT v27: DEBATE RULE VIOLATION (K-LXX) -- CITATION CHECK: the text says no Septuagint reading occurred ("'+m[0].replace(/[\[\]"]/g,'').slice(0,120)+'"), but the system scan found '+L.map(x=>'['+x.round+'] at '+x.ref).join(', ')+'. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');
 return {items,marks};}
function drvPressWith(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};
 const R=ciRounds(ptext);let read=0;
 for(const side of ['DEFENDER','CHALLENGER']){const conc=side==='DEFENDER'?dConc:cConc;if(typeof conc!=='number'||conc<1)continue;
  const PL=pwList(R,side);if(!PL)continue;const PW=new Set();PL.forEach(p=>p.keys.forEach(k=>PW.add(k)));const PA=new Set();PL.forEach(p=>(p.all||p.keys).forEach(k=>PA.add(k)));const VD=lbVoid(text,side); /* judge_fix9 S3: PW proven, PA every press */
  for(const sg of pwSegments(text,side)){if(!sg.wit)continue;read++;const bad=sg.keys.filter(k=>!PW.has(k));if(!bad.length||bad.length<sg.keys.length||sg.foot)continue;
   for(const n of sg.ns){if(VD.all||VD.set.has(n))continue;const id=side+' premise '+n;if(items.some(y=>y.link===id))continue;
    const kp=bad.some(k=>PA.has(k)); /* judge_fix9 S6: K-P, a premise counted on a press the ledger marks UNPROVEN (ruling 398) */
    items.push({rule:kp?'K-P':'K-G10',side,link:id,premise:n,line:'premise '+n+': counted UNEXHIBITED on '+bad.join(', ')+(kp?', which the ledger marks UNPROVEN, not a witness (ruling 398); ':', which no premise of the list that closes ['+PW_ROUND[side]+'] carries under PRESSED WITH; ')+'the count reads: '+sg.seg.replace(/\s+/g,' ').slice(0,360),verses:bad,conc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||PL.length,void:lbVoidList(VD),
     pw:PL.filter(p=>p.has).map(p=>({n:p.n,seg:p.seg.slice(0,1500)}))});
    if(kp)marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-P) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', a press the ledger marks UNPROVEN: it carries no MEANS sentence with an [L2] or [L3] and no checked PROVEN IN reference. Ruling 398: only a proven press is a witness. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');else
    marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G10) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', which no premise of the list against the '+side.toLowerCase()+' (the list that closes '+PW_ROUND[side]+') carries under PRESSED WITH. Ruling 392: a press must have a premise behind it; a verse pressed without one is not a witness, and leaving it unanswered never counts. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}}
 const pass=!items.length; // judge_fix8 K5 (1): the collision check K-G11 (lib/kg11.js) runs in the same call
 {const B=drvBrokenPW(text,R);B.items.forEach(x=>items.push(x));B.marks.forEach(x=>marks.push(x));}
 {const V=drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN);V.items.forEach(x=>items.push(x));V.marks.forEach(x=>marks.push(x));} // judge_fix8 K6: K-V (lib/kv.js)
 {const X=drvLxx(text,ptext);X.items.forEach(x=>items.push(x));X.marks.forEach(x=>marks.push(x));} // judge_fix8 R11: K-LXX (lib/klxx.js)
 {const F9=kfLines(text,R);F9.items.forEach(x=>items.push(x));F9.marks.forEach(x=>marks.push(x));} // judge_fix9 S1: K-F (lib/kfr.js)
 {const R9=krLines(text,R);R9.items.forEach(x=>items.push(x));R9.marks.forEach(x=>marks.push(x));} // judge_fix9 S3: K-R
 {const X9=kl2Lines(text,l2Data());X9.items.forEach(x=>items.push(x));X9.marks.forEach(x=>marks.push(x));} // judge_fix9 S4: K-L2
 if(pass)marks.push('[AUDIT v26: K-G10 PASS: '+read+' UNEXHIBITED witness ground'+(read===1?'':'s')+' read; every witness named is carried under a listed premise\'s PRESSED WITH; TRIAL rule]');
 return {items,marks};}
// judge_fix5 G13 (operator, on "is a link-round block with only one valid layer UNEXHIBITED or SUPPORTED?": "what makes any other round count?";
// the burden rule: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them; fewer floats and carries
// zero weight): K-LB, rule B's test applied to the link-round blocks. Each LINK block of [DR3] (the challenger's answer to premise j of the
// defender's list) and of [CR3] before its own list (the defender's answer to premise j of the challenger's [DR2] list) that is not CONCEDED is
// read for the layer kinds it exhibits. A block with fewer than two kinds is UNEXHIBITED. K-LB marks it when the judge's count does not count
// that premise (by counted_premises when the panel field is valid; else only at a count of 0, as K-G6). Cure: count it (CORRECTED COUNT and
// STANDING), or a STATEMENT for the item that quotes words of the block and itself exhibits two layer kinds from it.
// judge_fix6 H1 (run 32293: all ten K-LB marks were false, and GLM was removed on two of them): the block's kinds are read by drvLayers, the one
// layer reader rule B's K-B and the cure checks use (a plain-letter source word with its meaning counts anywhere in an [L2] tag's text); a
// premise the seat ruled VOID is never marked (a VOID premise enters no count, whatever its block shows: ChatGPT's six and Sol's 4 and 6 in
// 32293); K-LB is a TRIAL rule (ENF_STATUS), so an uncured K-LB item never removes a seat.
const lbKinds=block=>lbFoot(block); /* judge_fix8 R5: the block's footing (FOOTING LAYERS), not its tags */
function lbBlocks(t,stopRe){let s=String(t||'');if(stopRe){const c=s.search(stopRe);if(c>=0)s=s.slice(0,c);}const H=[...s.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];
 return H.map((h,i)=>({j:i+1,n:+h[1],head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim(),text:s.slice(h.index,i+1<H.length?H[i+1].index:s.length)}));}
// The premises a seat rules VOID for one side, read from that side's count section (CONCEDED LINKS or CHALLENGER CONCEDED LINKS and the lines
// under it) and its standing line (DEFENSE STANDING or CHALLENGE STANDING): "Premise 4 is VOID", "Premises 1 and 5 are VOID"; with no number,
// "each", "all", "every", "both" or "the six charges" beside VOID rules every premise VOID. "not VOID" and "no premise is VOID" rule nothing.
function lbVoid(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const out=new Set();let all=false;
 const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const sec=(ciCountSection(T,side)||'')+'\n'+st;
 for(const s of sec.split(/(?<=[.;])\s+|\n/)){if(!/\bVOID\b/.test(s))continue;if(/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(s))continue;
  const ns=[...s.matchAll(/\bPremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi)] /* judge_fix7 J2: serial comma */.flatMap(m=>m[1].match(/\d+/g).map(Number));
  if(ns.length)ns.forEach(n=>out.add(n));else if(/\b(?:each|all|every|both|the\s+(?:six|five|four|three|two|\d+)\s+(?:charges|premises|links))\b/i.test(s))all=true;}
 return {all,set:out,has:j=>all||out.has(j)};}
function drvBlocks(text,ptext,dConc,cConc,dStand,cStand,CPV,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);
 const S={CHALLENGER:lbBlocks(R.DR3),DEFENDER:lbBlocks(R.CR3,/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i)};
 for(const side of ['DEFENDER','CHALLENGER']){const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;const cp=drvCPA(CPV&&CPV[side],LN&&LN[side]);if(!cp.present&&sc!==0)continue;const VD=lbVoid(text,side);
  for(const b of S[side]){if(/:\s*\**\s*CONCEDED\b/i.test(b.head)||/^LINK\s+\d+[^:\n]*:\s*\**\s*CONCEDED\b/i.test(b.head))continue;const k=lbKinds(b.text);if(k.length>=2)continue;
   if(cp.present&&cp.set.has(b.j))continue;if(VD.has(b.j))continue;const id=side+' premise '+b.j;
   items.push({rule:'K-LB',side,link:id,premise:b.j,line:'['+(side==='CHALLENGER'?'DR3':'CR3')+'] '+b.head.slice(0,160)+' -- exhibits '+(k.length?k.join(' and '):'no layer kind')+'; fewer than two prior layers',kinds:k,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||null,void:lbVoidList(VD)});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-LB) -- '+id+': the link-round block ('+(side==='CHALLENGER'?'DR3':'CR3')+' LINK '+b.n+') exhibits '+(k.length?k.join(' and '):'no layer kind')+', fewer than two prior layers (the burden rule), and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it as UNEXHIBITED or rule it VOID. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}
 return {items,marks};}
// BB-8327 D1 and D2 (WALL-1908 as amended; his word at BB-8342): the chain-stating net, K-C. Source: e8327/s_net.js.
const NET_STATE=[
 /\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert)s?\b/i,
 /\bin\s+(?:its|their)\s+own\s+words\s+(?:state|name|assert|deny)s?\s+no\b/i,
 /\bnot\s+stated\b/i,
 /\bunstated\b/i,
 /\b(?:never|neither|nor)\s+(?:names?|states?)\b/i,
 /\bnone\s+of\s+(?:those|them|these|the)\b[^;.]*?\b(?:states?|names?)\b/i,
 /\bno\s+(?:verse|witness|row|passage)s?\s+(?:\S+\s+){0,3}?(?:states?|names?)\b/i,
 /\bnames?\s+no\b/i,
 /\bnames?\b[^;.]{0,60}?\b(?:rather\s+than|not)\b[^;.]{0,30}?\bbegett/i,
 /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i,
 // judge_fix2 FIX 4 (run 32212, judgment 886): "Scripture nowhere states that ..." (RESULT) and "without a single biblical text stating that ..." (CHAIN MARK).
 /\bnowhere\s+(?:states?|names?|says)\b/i,
 // judge_fix2 E7 (run 32212: DeepSeek D6 "no exhibit anywhere says Joseph begat Jesus"; Gemini D6 "No passage in the text states").
 /\bno\s+(?:exhibit|passage|text)s?\s+(?:\S+\s+){0,4}?(?:says?|states?)\b/i,
 /\bwithout\s+(?:a\s+single|any|one)\s+(?:\S+\s+){0,2}?(?:text|verse|witness|row|passage)s?\s+(?:stating|naming|that\s+states?)\b/i];
// checker_fix FIX 1 (kc_fix, run 32157 B2; run 32212 B2): the unanswered-witness test is not the stating ground. Before NET_STATE runs,
// a clause is masked: (a) "<round or side> does not name / never names / not named <witness>" and "<round or side> left <witness> unstated",
// "<witness> went unstated in <round>" (NET_ANSWER); (b) words in double quotation marks, which are a round's or a verse's words, not the
// judge's ground (NET_QUOTE). A clause whose hit follows "CONCEDED (stated)" reports the side's own concession (NET_CONC), as NET_REPORT
// does for "conceded that". A stating ground elsewhere in the clause still counts.
const NET_ANSWER=/((?:defen[cs]e|defender|challenger|rounds?|block|reply|answer|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?)((?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?name[sd]?|never\s+names?|not\s+named)(?=[^;.]{0,50}?(?:\d+:\d+|witness|verses?|them|those|rows?))/gi;
// "<witness>, which <round or side> did not name / never names" (the witness before the verb; judgment 872 restated lines).
const NET_ANSWER_R=/(\b(?:which|whom)\s+(?:the\s+)?(?:later\s+)?(?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?\(?[CD]R\d\]?\)?)(?:'s\s+(?:\S+\s+){0,2}?)?\s*)((?:do|does|did)\s+not\s+(?:\S+\s+){0,2}?name[sd]?|never\s+names?)\b/gi;
const NET_ANSWER_U=[/((?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?\b(?:left|leaves|leave)\s+(?:\S+\s+){0,6}?)unstated\b/gi,
 /(\b(?:went|goes|go|was|were|remains?|remained|stays?|stayed)\s+)unstated(?=\s+(?:in|by|at)\s+(?:(?:the\s+)?(?:defen[cs]e|defender|challenger|link\s+round|rounds?)\b|\[?\(?[CD]R\d))/gi];
const NET_QUOTE=/["“][^"”\n]{2,}?["”]/g;
const NET_CONC=/\bCONCEDED\s*\(\s*stated\s*\)/i;
const NET_QUOTE1=/(?<=^|[\s(\[:])'[^'\n]{3,200}?'(?=[\s,.;:)\]]|$)/g; // judge_fix2 E7: a round's words in single quotes (32212 population: j816, j834, j813)
function netMask(cl){let t=String(cl).replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'").replace(NET_ANSWER,'$1[answer-check]').replace(NET_ANSWER_R,'$1[answer-check]');for(const rx of NET_ANSWER_U)t=t.replace(rx,'$1[answer-check]');return t;}
// The K-C cure test of a RESTATED line: true when a clause of it, masked as netLines masks it, still gives the stating ground as the judge's own.
function netKeeps(text){for(const c0 of drvGround(String(text||''),null).split( /* judge_fix4 F4 *//;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
 const hit=NET_STATE.find(rx=>rx.test(cl));if(!hit)continue;const pre=cl.slice(0,cl.search(hit));if(NET_REPORT.test(pre)||NET_CONC.test(pre))continue;return true;}return false;}
// A clause that reports what a side itself stated or granted is that side's statement, not the judge's ground.
const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b|\b(?:conceding|concedes|admitting|admits|granting|grants)\b/i; // judge_fix2 FIX 4: a side's concession reported with -ing or -s (32212 DeepSeek CHAIN MARK)
// 1909 (b): a clause that answers a side's own claim that a named verse says what it does not ("the challenger reads Matthew 1:16
// as saying that Joseph begat Jesus, but the verse does not state that") is the judge answering an overclaim, not the stating test.
const NET_CLAIM=/\b(?:challenger|defender)\s+(?:reads|read|claims|claimed|says|said|argues|argued|takes|took|holds|asserts|asserted|presses|pressed)\b[^;]{0,160}?\b(?:as\s+(?:saying|stating|meaning)|to\s+(?:say|state|mean))\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+|\bscripture\b|\bnowhere\b|\bno\s+(?:exhibit|passage|text)s?\b|\ba\s+single\s+(?:\S+\s+)?(?:text|verse|witness|row|passage)\b/i; // judge_fix2 FIX 4: Scripture as a whole, "nowhere", "a single text" (the /i is new; every earlier alternative is lower case or a verse form)
const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:/; // judge_fix2 FIX 4: the CHAIN MARK lines are read
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|COLLISION POINTS)\b/i;
// The side whose rows are set aside: read from the subject, the words just before the stating ground; else the C side.
function netSide(cl,at){const sub=cl.slice(Math.max(0,at-90),at);if(/\bneither\s+side|\bboth\s+(?:sides|chains)|\beither\s+way\b/i.test(cl))return 'BOTH';
 const d=sub.search(/\bdefender/i),c=sub.search(/\bchallenger/i);if(d<0&&c<0)return 'CHALLENGER';return d>c?'DEFENDER':'CHALLENGER';}
function netUnwrap(text){let t=String(text||'');const s=t.trim();if(s[0]==='{'){const s2=(!/\}\s*$/.test(s)&&/"\s*$/.test(s))?s+'}':s; /* judge_fix10 B */const i=s2.lastIndexOf('}');try{const j=JSON.parse(s2.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;}
function netLines(text,links,DL){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const L=Array.isArray(links)?new Set(links.map(x=>String(x).toUpperCase())):null;
 let inOOR=false,first=true;
 for(const raw of T.split('\n')){const line=raw.trim();if(!line)continue;const u=line.toUpperCase();
  if(/^OUT-OF-ROUND CONCESSIONS\b/.test(u)){inOOR=true;continue;}
  if(inOOR){if(/^(?:DEFENDER|CHALLENGER)\s*\|/.test(u)||/^NONE\b/.test(u))continue;inOOR=false;}
  if(/^(?:DEFENDER|CHALLENGER)\s*\|/.test(u)||line[0]==='['){first=false;continue;}
  let item=null,vs=false;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)(?:\s+VS\.?\s+(C\d+))?\b/);
  const mh=u.match(NET_HEAD);
  if(mc){item=mc[1]+(mc[2]?' vs '+mc[2]:'');vs=!!mc[2]&&(!L||L.has(mc[2]));}
  else if(mh)item=mh[1];
  else if(first)item='REASONING';
  first=false;
  if(!item||NET_SKIP.test(u)||/^(?:DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*FOOTED\b/.test(u))continue; // judge_fix2 FIX 4: a FOOTED chain mark sets nothing aside
  const clauses=drvGround(line,DL).split( /* judge_fix4 F4: the judge's own ground clause, quotes and link wording removed *//;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/);
  for(const cl0 of clauses){const cl=netMask(cl0);if(!NET_STATE.some(rx=>rx.test(cl)))continue;
   const hit=NET_STATE.find(rx=>rx.test(cl));const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at))||(NET_CLAIM.test(cl.slice(0,at))&&!NET_PLURAL.test(cl)))continue; // 1909 (b) spares an overclaim about one named verse only (A3, BB-8352)
   if(!vs&&!NET_PLURAL.test(cl))continue;
   out.push({item,side:item==='DEFENDER CHAIN MARK'?'DEFENDER':item==='CHALLENGER CHAIN MARK'?'CHALLENGER':netSide(cl,at),line});break;}} // judge_fix2 FIX 4: a chain mark names its side
 return out;}
// BB-8327 D1 (q3): the chain a K-C line set aside, quoted from the judge's prompt; both chains on a collision line.
// DEFENDER: the numbered lines under its first "DECLARED CHAIN" heading. CHALLENGER: the premises the ledger lists against it
// ("AGAINST THE CHALLENGER, answered in [DR3]:"), which are the challenger's links as [DR3] answers them. Neither found: said so.
// judge_fix2 R2: the PRESSED-WITNESS LEDGER heading of a side, in whatever answering rounds it names ("answered in [CR3]:" in the link-round
// prompts; "answered in [CR2], [CR3] or [CR4]:" and "answered in [DR1], [DR2] or [DR3]:" in the judge prompt). Position, or -1.
function drvLabAt(t,side,from){const re=new RegExp('AGAINST THE '+side+', answered in [^:\\n]{0,40}:','g');re.lastIndex=from||0;const m=re.exec(String(t));return m?m.index:-1;}
function drvChainOf(ptext,side){const t=String(ptext||'');const cut=s=>{s=s.replace(/[*_`#]+/g,'').replace(/\s+/g,' ').trim();return s.length>110?s.slice(0,107)+'...':s;};
 if(side==='DEFENDER'){const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const L=[];
  for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push('LINK '+m[1]+' -- '+cut(m[2]));continue;}if(L.length&&l.trim())break;}
  return L.length?{where:'DECLARED CHAIN',links:L}:null;}
 const i=drvLabAt(t,'CHALLENGER',0);if(i<0)return null;const k=t.indexOf('A verse marked NOT NAMED',i);
 const L=t.slice(i,k<0?t.length:k).split('\n').map(l=>l.trim()).filter(l=>/^premise \d+/.test(l)).map(l=>{const m=l.match(/^premise (\d+)(?: \(LINK \d+\))?:\s*(.*)$/);return 'C'+m[1]+' -- '+cut(m[2].replace(/\s*NOT NAMED:.*$/,''));});
 return L.length?{where:'LEDGER [DR3]',links:L}:null;}
function drvChains(ptext,x){const sides=(/ vs C\d+$/.test(x.link)||x.side==='BOTH')?['DEFENDER','CHALLENGER']:[x.side||'CHALLENGER'];
 return sides.map(sd=>{const c=drvChainOf(ptext,sd);return sd+' CHAIN'+(c?' ('+c.where+'): '+c.links.join('; '):': not found in the prompt; weigh its links as the rounds give them');}).join(' || ');}
// judge_fix2: the count lines (CONCEDED LINKS, CHALLENGER CONCEDED LINKS), read by K-N and K-SC.
const CNT_HEAD=/^[ \t>#-]*(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/i;
// judge_fix2 E1 (K-N; run 32212, judgment 885): a CONCEDED LINKS item tagged CONCEDED (stated) whose quoted words are a narrowing ("drop any
// claim that", "I do not claim", "no longer claim", "narrow", "only") and not a surrender (I concede, withdraw, surrender, CONCEDED). The rule:
// "A limb the link round narrows counts in its narrowed form." Text only: whether the block keeps the link is read from the quotation.
const KN_NARROW=/\b(?:drop(?:s|ped)?\s+(?:any|the|my|that)\s+(?:\S+\s+){0,2}?(?:claim|form|limb|reading)|no\s+longer\s+(?:claim|hold|assert|rest)|(?:do|does)\s+not\s+(?:claim|assert|need)|narrow\w*|limb\s+(?:is\s+)?dropped|\bonly\b|\balone\b)/i;
const KN_SURR=/\b(?:I\s+concede|concede[sd]?\s+(?:the\s+|this\s+)?link|withdraw\w*|surrender\w*|CONCEDED\b|I\s+yield|I\s+grant\s+the\s+link)/i;
function cntItems(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const h=line.match(CNT_HEAD);if(!h)continue;const label=h[1].toUpperCase();const body=line.slice(h[0].length);
  const qs=[];const masked=body.replace(NET_QUOTE,q=>{qs.push(q);return '"[quote'+(qs.length-1)+']"';});
  for(const p0 of masked.split(/(?=\b[Pp]remises?\s+\d|\bLINK\s+\d+\s*(?:\(|:))/)){const pm=p0.match(/^[Pp]remises?\s+(\d+)(?:\s*\(\s*LINK\s+(\d+)\s*\))?/)||(m2=>m2?[m2[0],m2[2]||m2[1],m2[1]]:null)(p0.match(/^LINK\s+(\d+)\s*(?:\(\s*premise\s+(\d+)\s*\))?/i));if(!pm)continue;
   const quotes=[...p0.matchAll(/"\[quote(\d+)\]"/g)].map(m=>qs[+m[1]]);const one=/^(?:[Pp]remise|LINK)\s/.test(p0);
   const tag=/\bCONCEDED\s*\(\s*stated\s*\)/i.test(p0)?'CONCEDED':(/\bUNEXHIBITED\b/.test(p0)&&!/\b(?:not|never|nor)\s+UNEXHIBITED\b/i.test(p0))?'UNEXHIBITED':(/\bVOID\b/.test(p0)?'VOID':(/\bSUPPORTED\b/.test(p0)?'SUPPORTED':null));
   out.push({label,side:label==='CONCEDED LINKS'?'DEFENDER':'CHALLENGER',n:+pm[1],link:pm[2]?+pm[2]:+pm[1],one,tag,quotes,text:p0.trim(),line});}}
 return out;}
const knNarrow=it=>it.tag==='CONCEDED'&&it.quotes.length>0&&it.quotes.every(q=>KN_NARROW.test(q)&&!KN_SURR.test(q));
function knLines(text){const out=[];const seen=new Set();for(const it of cntItems(text)){if(!it.one||!knNarrow(it)||seen.has(it.label))continue;seen.add(it.label);out.push({item:it.label,side:it.side,line:it.line,premise:it.n});}return out;}
// judge_fix2 E2 (K-SC; run 32212, judgment 885): a defender link graded STANDS ("Dn: STANDS") (a) whose own line says the defender's
// round conceded ("[CR3] LINK 5 conceded that ..."), or (b) while the same judge's CONCEDED LINKS counts, as CONCEDED (stated) (never
// UNEXHIBITED, which the rulebook counts toward c and never toward w), a premise the judge itself files under LINK n ("premise 4 (LINK n)" or "LINK n:"). A narrowing (K-N) is not counted here. A
// premise number is never read as a link number (they differ in runs 32157 and 32205). (b) holds only when the STANDS line says nothing of a
// concession; (a) never when the conceding words belong to the challenger ([DR], "it concedes") or are negated.
const SC_CONC=/(?:\[?\bCR[1-4]\b\]?|\bdefen(?:der|se)(?:'s)?\b)[^;]{0,60}?\b(?<!not\s|never\s)conced(?:ed|es)\b(?!\s+nothing)/i;
function scLines(text,DL){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const its=cntItems(T).filter(it=>it.label==='CONCEDED LINKS'&&it.one&&it.tag==='CONCEDED'&&!knNarrow(it));
 const byLink=it=>/\(\s*LINK\s+\d+\s*\)|^LINK\s+\d+/i.test(it.text);
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.toUpperCase().match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(?:--|—|-|:)?\s*STANDS\b/);if(!m)continue;
  const lq=drvGround(line,DL);const om=lq.match(SC_CONC); /* judge_fix4 F4: the judge's own ground clause */const tail=om?lq.slice(om.index+om[0].length,om.index+om[0].length+120):'';const own=om&&!/\bchallenger|\bDR[1-3]\b|\bit\s+concede|\bnot\b|\bseparate\b/i.test(om[0])&&!/^[^;]{0,25}?\[?DR[1-3]\b/.test(tail)&&!/\b(?:keep(?:s|ing)?|kept|narrow\w*|only|alone)\b/i.test(tail); /* fix 2: a concession of a limb that keeps the link narrowed is a narrowing, and the narrowed link may stand */
  const it=null; /* (b) not wired: a count line's "LINK n" is the pressing list's label, which the population read showed is not always Dn (j734, j676) */
  if(own||it)out.push({item:'D'+m[1],side:'DEFENDER',line,premise:it?it.n:null,tag:it?it.tag:'CONCEDED',own:!!own});}
 return out;}
// judge_fix2 E4 (K-K; run 32212, judgment 887 "KEYSTONE: D6 -- BROKEN -- Christ had no biological father, and Joseph did not beget him."): a
// KEYSTONE line whose reason gives no ground: no verse, no round or link, no layer, and no ground word. It states a conclusion, not a grade's ground.
const KK_GROUND=/\d+:\d+|\[?\b[CD]R[1-4]\b\]?|\bround\b|\bLINK\s+\d|\[L[1-4]\]|\b(?:answered|unanswered|refuted|refutes|withdrawn|withdrew|withdraws|conceded|concedes|pressed|witness\w*|GROUND|because|since|exhibit\w*|footing|premise|chain|verse|row)\b/i;
function kkLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.match(/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i);if(!m)continue;
  const rs=m[3].replace(/^[\s.\-–—:]+/,'').trim();if(rs.split(/\s+/).length>=3&&!KK_GROUND.test(rs))out.push({item:'KEYSTONE',side:'DEFENDER',line});} // a bare grade with no reason is left to the format checks
 return out;}
// judge_fix4 F2 (operator rulings 382 and 383, 2026-11-02: "only 'Debate Oracle' is bound by the guards and the judges grade the text
// (evidence present to them) alone"; "we can not impose our corpus on the judges"): K-DG8, the judge check on Matthew 1:18 and 1:25 read
// against the union, is removed with its cure item and its cure-rule text. Drift guard 8 binds the Oracle debater seat only, and the
// synthesis audits that seat alone (Build Synthesis, section 3).
// judge_fix3 A5: the holder's own concession of the link, named on the BROKEN line (not negated, not "conceded nothing").
function kg4Conceded(line,side){const L=String(line||'').replace(/[*_`]+/g,'');const who=side==='DEFENDER'?'(?:\\[?\\bCR[1-4]\\b\\]?|\\bdefen(?:der|se)(?:\'s)?\\b)':'(?:\\[?\\bDR[1-4]\\b\\]?|\\bchallenger(?:\'s)?\\b)';
 const re=new RegExp(who+'[^;]{0,80}?\\b(?<!not\\s|never\\s|nor\\s)(?:conced(?:ed|es)|withdr(?:ew|awn|aws)|surrender(?:ed|s)|CONCEDED|WITHDRAWN)\\b(?!\\s+(?:nothing|no\\b))','i');return re.test(L);}
// judge_fix4 F4 (run 32266, problems D and E; Worker_E item 3: GLM's KEYSTONE was refused because it quoted the defender's own link "his flesh
// came from Mary alone"; run 32212: the single-verse check matched the defender's quoted concession): the pattern checks K-C, K-S, K-S2, K-U and
// K-SC read only the judge's own ground clause. On a line with GROUND: that is the text after its last GROUND:; on a line without it, the line
// after its label. Quoted text (double quotes, a round's words in single quotes) and the declared link wording (a run of six or more words of a
// DECLARED CHAIN link, read from the judge's prompt) are removed first, so a quotation of either side is never read as the judge's reasoning.
// K-N reads the judge's CONCEDED (stated) tag outside the quotes and tests the quoted words as the side's words (unchanged). The answer-test
// mask (netMask) still runs on the clause; whether the line names an answering round is still read on the whole line.
const GROUND_HEAD=/^(?:[-•]|\d+[.)])?\s*(?:D\d+(?:\s+vs\.?\s+C\d+(?:\s*\/\s*C\d+)*)?(?:\s*\([^)]*\))?|KEYSTONE|RESULT|CLAUSE|REASONING|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:?\s*/i;
function drvUnlink(t,dl){const W=x=>[...String(x).matchAll(/[A-Za-z0-9’']+/g)].map(m=>m[0].toLowerCase().replace(/’/g,"'"));const toks=[...String(t).matchAll(/[A-Za-z0-9’']+/g)];const tw=toks.map(m=>m[0].toLowerCase().replace(/’/g,"'"));const cut=[];
 for(const L of dl||[]){const lw=W(L);if(lw.length<6)continue;const pos=new Map();lw.forEach((w,i)=>{if(!pos.has(w))pos.set(w,[]);pos.get(w).push(i);});
  for(let i=0;i<tw.length;i++){const st=pos.get(tw[i]);if(!st)continue;let best=0;for(const j of st){let k=0;while(i+k<tw.length&&j+k<lw.length&&tw[i+k]===lw[j+k])k++;if(k>best)best=k;}
   if(best>=6){cut.push([toks[i].index,toks[i+best-1].index+toks[i+best-1][0].length]);i+=best-1;}}}
 if(!cut.length)return t;cut.sort((a,b)=>a[0]-b[0]);const mg=[];for(const c of cut){const l=mg[mg.length-1];if(l&&c[0]<=l[1])l[1]=Math.max(l[1],c[1]);else mg.push(c.slice());}
 let s=String(t);for(let k=mg.length-1;k>=0;k--)s=s.slice(0,mg[k][0])+'[link]'+s.slice(mg[k][1]);return s;}
function drvGround(line,dl){let t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];
 if(gs.length){const g=gs[gs.length-1];t=t.slice(g.index+g[0].length);}else t=t.trim().replace(GROUND_HEAD,'');
 t=t.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'");return Array.isArray(dl)&&dl.length?drvUnlink(t,dl):t;}
// The declared links, from the judge's prompt: the numbered lines under its first DECLARED CHAIN heading, each up to its "Footing:".
function drvLinks(ptext){const t=String(ptext||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return [];const L=[];
 for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push(m[2].replace(/\s*Footing\s*:.*$/i,'').replace(/[*_`]+/g,''));continue;}if(L.length&&l.trim()&&!/^\s/.test(l))break;}
 return L;}
// judge_fix8 R6 (run 32306, Worker_E A6, Worker_G1 #4: GLM rested its collision lines and its reasoning line on the retired single-verse ground
// in forms the patterns missed: "no witness's own words state union before the taking", "state no father for this child", "none states that
// the coming-upon ... was not the means", "no exhibited witness states in its own words"; and the K-S2 marks on D1 vs C1 and D6 vs C1 were
// never sent to cure). K-S2 (TRIAL) reads every GROUND clause of a collision line (not only the last) and the reasoning line (the first line),
// quotations and the side's own reported words masked as the K-C net masks them, for the K-C forms, the K-S forms and these: "no (exhibited)
// witness('s own words) state(s)", "none states that", "state(s) no ...", "in its own words". A line K-C already marks is left to K-C. Each hit is
// an item sent to the cure as K-C items are (a RESTATED line that drops the ground, or a retraction); TRIAL: it removes no seat.
const KS2_FORMS=[/\bno\s+(?:\S+\s+){0,2}?witness(?:['’]s|es)?\s+(?:own\s+words\s+)?(?:\S+\s+){0,3}?(?:states?|says?|names?)\b/i,/\bnone\s+(?:of\s+(?:\S+\s+){1,2})?states?\s+that\b/i,
 /\bstates?\s+no\s+(?!round\b|later\b|answer\b)[a-z]+/i,/\bin\s+(?:its|their|his|her)\s+own\s+words\b/i];
function ks2Grounds(line){const t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];if(!gs.length)return [drvGround(line,null)];
 return gs.map((g,k)=>t.slice(g.index+g[0].length,k+1<gs.length?gs[k+1].index:t.length)).map(s=>s.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"));}
function ks2Hit(text){for(const g of (Array.isArray(text)?text:[text]))for(const c0 of String(g).split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
  const hit=KS2_FORMS.concat(NET_STATE,[DRV_STATE]).find(rx=>rx.test(cl));if(!hit)continue;const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at)))continue;return cl.trim();}
 return null;}
// the cure test of a RESTATED line: true when any of its GROUND clauses keeps a K-S2 form
function ks2Keeps(text){return !!ks2Hit(ks2Grounds(text));}
function ks2Lines(text,done){const items=[],marks=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');let first=true;const D=done||new Set();
 for(const raw of T.split('\n')){const line=raw.trim();if(!line)continue;const u=line.toUpperCase();let item=null;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(mc)item=mc[1]+' vs '+mc[2];else if(first&&line[0]!=='['&&line[0]!=='{')item='REASONING';first=false;
  if(!item||D.has(item.toUpperCase()))continue;if(item!=='REASONING'&&!/\b(?:UNDERDETERMINED|STANDS)\b/.test(u))continue; /* a BROKEN line is K-B's and K-G4's */
  const h=ks2Hit(item==='REASONING'?[netMask(line.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"))]:ks2Grounds(line));if(!h)continue;D.add(item.toUpperCase());
  const at=line.search(/GROUND\s*:/i);const side=netSide(h,h.length);
  items.push({rule:'K-S2',side,link:item,line});
  marks.push('[AUDIT v27: DEBATE RULE VIOLATION (K-S2) -- '+item+' rests on the retired single-verse ground ("'+h.replace(/[\[\]"]/g,'').slice(0,160)+'"): that a verse or witness does not state the point in its own words is never a ground (DG-61); the chains are weighed as wholes. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
// judge_fix8 R5 (run 32306, Worker_E A5, Worker_G1 #2: K-LB read tags, not footing. Defender premise 3, [CR3] LINK 4, quoted "as was supposed"
// (Luke 3:23) with [L2] enomizeto (was reckoned) but wrote no [L1] tag, and was marked; premise 6, LINK 5, tags three verses [L1], and Gemini cured
// the mark by calling Matthew 1:12 "[L3]"). The link-round block is read for its footing, by the definition the judges' rulebook states in the
// same words (FOOTING LAYERS): a quoted KJV verse with its reference is [L1], tagged or not; a named Hebrew or Greek word with its meaning is [L2]
// (its own script or transliteration marks with a meaning beside it, or a word with its meaning under an [L2] tag or after the word Greek or
// Hebrew); amended by operator ruling 400 ("L3 is supporting verse(s) for L1"): any other verse quoted with its reference after the first, the same
// chapter included, is [L3], tagged or not (the earlier cross-reference / shared-term test is withdrawn). A tag alone makes no layer. The footing is
// the block before its answers to the pressed verses ("The pressed verses:"), unless full is asked.
const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_GLOSS=/(?:^|[\s(,;:"“'‘])[*_]*([^\s()"“”,;:]{2,24}(?:\s+[^\s()"“”,;:]{2,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
// judge_fix8 R5 as amended by operator ruling 400 (md_notes_rulings 400: "L3 is supporting verse(s) for L1"): the first quoted verse with its
// reference is [L1]; any other verse quoted with its reference after it, as its support, is [L3], tagged or not, the same chapter included. No
// shared-term or comparison-word test. A source word with its meaning is [L2]. A reference with no quotation, or a tag alone, adds nothing.
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
// the j-th LINK block of a link round (the cure reads the block's own words)
function lbBlockText(round,j){const s=String(round||'');const c=s.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);const t=c>=0?s.slice(0,c):s;const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t.slice(h.index,j<H.length?H[j].index:t.length):'';}
function __kfHas(text,id){try{if(typeof KF_LINE==='undefined')return false;const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');return T.split('\n').some(l=>{const m=l.trim().match(KF_LINE);return !!m&&m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase()===String(id).toUpperCase();});}catch(e){return false;}}
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC,DL){ /* judge_fix4 F4: DL, the declared link wording */const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  {const ms=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(ms){const vs=/^VS\.?\s/.test(ms[2]);const gs=vs?((ms[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null):(/^STANDS\b/.test(ms[2])?'STANDS':null);
   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(drvGround(line,DL))&&!DRV_ANS.test(line)){ /* judge_fix4 F4 */const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}
   // BB-8172 C2: marks only, never items, so nothing here reaches the cure, drv_uncured or a grade (8192, 8193).
   if(gs==='UNDERDETERMINED'||gs==='STANDS'){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    if(false&&DRV_STATE.test(drvGround(line,DL))&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2) -- '+sid+' '+gs+' gives as a ground that a verse does not state a link or its contrary, beside '+(DRV_ANS.test(line)?'the round it names':'a round it names without a bracket, which K-S does not read as named')+'; that is never a ground. REVIEW THIS ROW.]');
    const un=drvUnans(drvGround(line,DL));if(un)marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- '+sid+' '+gs+' says a witness went unanswered ("'+un+'"); a pressed witness (a verse a listed premise carries under PRESSED WITH, ruling 392) left unanswered is a BROKEN ground; a verse under no PRESSED WITH line is not. REVIEW THIS ROW.]');}}}
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const side=g[1].split(' ')[0];cnt[side]++;const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
  // BB-7994 step 6b (BB-8044, 8056): the line under a BROKEN line carries its footing when it is not itself a collision, a label line or a concession line (SIDE | round |).
  const nx=String(LS[li+1]||''),nu=nx.toUpperCase().replace(/[*_`]+/g,'').trim();
  const k=(nu&&!/^(?:[-•]|\d+[.)])?\s*[DC]\d+\b/.test(nu)&&!/^[A-Z][A-Z \-]{2,}:/.test(nu)&&!/^(?:DEFENDER|CHALLENGER)\s*\|/.test(nu))?[...new Set([...drvKinds(line),...drvKinds(nx)])].sort():drvKinds(line);
  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line or the line under it. REVIEW THIS ROW.]');}
  const conc=side==='DEFENDER'?dConc:cConc;
  /* judge_fix9 S3 (ruling 398): a BROKEN line whose unanswered verses are all presses the ledger marks UNPROVEN raises no K-G1 or K-G4 (K-P reads it) */
  if(prsUnprovenOnly(line,side)){marks.push('[AUDIT v28: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' rests, as unanswered, only on presses the ledger marks UNPROVEN (ruling 398); K-P reads the line.]');}
  else if(__kfHas(text,id)){marks.push('[AUDIT v29: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' is graded as a forced link with a FORCED line (ruling 411: a link may fail by meaning though the witness was answered); K-F reads its quotations.]');} /* ruling 411 */
  else if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G1) -- '+id+' '+g[1]+' rests on a witness left unanswered (a witness is a verse a listed premise carries under PRESSED WITH, ruling 392) while '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' is 0. REVIEW THIS ROW.]');}
  // BB-6904 rev 8 K-G4: every other LINK BROKEN line answers the pressing-sentence rule too; cured by a PRESSED line whose quotation is
  // found in the named pressing round, or by WITHDRAWN (7176, 7184, 7186).
  // judge_fix3 A5 (run 32228 B2: DeepSeek and the single judge, D5 vs C6 "[CR3] LINK 4 [premise 6] concedes it cannot exhibit ..."): a BROKEN line
  // whose ground is that the side holding the link conceded (or withdrew) it in its own round, and that names no witness unanswered, is the
  // concession rule's case, not K-G4's. The holder of a DEFENDER LINK BROKEN link is the defender ([CR] rounds), of a CHALLENGER LINK BROKEN the challenger.
  else if(!DRV_WORDS.test(line)&&kg4Conceded(line,side)){marks.push('[AUDIT v24: K-G4 NOT RAISED -- '+id+' '+g[1]+' rests on the '+side.toLowerCase()+"'s own concession of the link, not on a witness left unanswered; the concession rule governs it.]");}
  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round, and only for a verse a listed premise carries under PRESSED WITH (ruling 392). REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 // BB-8327 D1 (K-C): a line that sets aside a chained premise, or a side's rows read together, on the ground that no one verse states the link or its contrary (netLines).
 // judge_fix2 E1, E2 (K-N, K-SC): items with a cure, as K-C (judge_fix4 F2: K-DG8 removed). (E4, K-K, is defined but not wired: the prompt's KEYSTONE form asks the judge to name the link's conclusion.)
 for(const n of knLines(text)){items.push({rule:'K-N',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-N) -- '+n.item+' counts premise '+n.premise+' CONCEDED (stated) on words that narrow a limb; a limb the link round narrows counts in its narrowed form, and a narrowing is not a concession. REVIEW THIS ROW.]');}
 for(const n of scLines(text,DL)){items.push({rule:'K-SC',side:n.side,link:n.item,line:n.line,premise:n.premise});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-SC) -- '+n.item+' STANDS while '+(n.own?'its own line says the defender conceded':'CONCEDED LINKS counts premise '+n.premise+' (filed under that link) '+(n.tag==='CONCEDED'?'CONCEDED (stated)':'UNEXHIBITED'))+'; a link counted conceded does not stand. REVIEW THIS ROW.]');}
 for(const n of netLines(text,null,DL)){items.push({rule:'K-C',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- '+n.item+' sets aside '+(n.side==='BOTH'?'both chains':'the '+n.side.toLowerCase()+"'s chain")+' on the ground that no one verse in it states the link or its contrary in its own words; the chain is weighed as a whole. REVIEW THIS ROW.]');}
 {const kc=new Set(items.filter(x=>x.rule==='K-C').map(x=>String(x.link).toUpperCase()));const k2=ks2Lines(text,kc);k2.items.forEach(x=>items.push(x));k2.marks.forEach(x=>marks.push(x));} // judge_fix8 R6: K-S2 (TRIAL, lib/ks2.js)
 return {items,marks};}
PRS_CTX.R=ciRounds(drvPromptText(prev&&prev.verdictBody));PRS_L2BAD=(()=>{try{const q=$('Quote Report').first().json;return q&&q.l2&&Array.isArray(q.l2.tags)?PRS.l2bad(q.l2.tags):null;}catch(e){return null;}})(); /* judge_fix9 S3: the rounds the press parse reads */
const DRV=drvCheck(raw0,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,askedD,drvLinks(drvPromptText(prev&&prev.verdictBody)));for(const x of DRV.marks)raw+='\n\n'+x;
for(const x of DRV.items)if(x.rule==='K-C')x.chain=drvChains(drvPromptText(prev&&prev.verdictBody),x); // BB-8327 D1 (q3)
const DL=drvLedger(raw0,drvPromptText(prev&&prev.verdictBody),conceded_links,challenger_conceded_links,defense_standing,challenge_standing,null);for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)raw+='\n\n'+x;
{const PT=drvPromptText(prev&&prev.verdictBody);const LN={DEFENDER:drvLedgerN(PT,'DEFENDER'),CHALLENGER:drvLedgerN(PT,'CHALLENGER')}; // judge_fix5 G2 (K-G9, retired by judge_fix8 K2: drvPressWith, K-G10), G13 (K-LB)
 const CI=drvPressWith(raw0,PT,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)raw+='\n\n'+x;
 const LB=drvBlocks(raw0,PT,conceded_links,challenger_conceded_links,defense_standing,challenge_standing,null,LN);for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)raw+='\n\n'+x;}
const DB=drvBroken(raw0,conceded_links,defense_standing,DRV.items,challenger_conceded_links,challenge_standing,drvPromptText(prev&&prev.verdictBody),null);for(const x of DB.items)DRV.items.push(x);for(const x of DB.marks)raw+='\n\n'+x;
// FLAG COUNT AND DATA CLASS (rulings BB-4503 Q3). A flag is every marker this extractor appended that ends REVIEW THIS
// ROW, truncation included; a verifier recomputes it from the stored text by counting that phrase after the judge text.
// study iff flags <= 1, no ILLEGAL rejection, a parseable verdict and a judge output not cut at max_tokens; contested
// otherwise (truncation ruled a defect inside item 1, BB-4519).
// BB-8172 F1 (BB-8203): the K-U and K-S2 marks are not counted here, so they move neither audit_flags nor data_class.
// BB-8327 (BB-8351): nor the K-C marks (AUDIT v23); the cure and the alternate seat carry their consequence.
const nflag=(raw.slice(raw0.length).replace(/\[AUDIT v2[23]: DEBATE RULE VIOLATION \((?:K-U|K-S2|K-C|K-N|K-SC|K-K|K-DG8)\)[^\n]*/g,'').match(/REVIEW THIS ROW/g)||[]).length;
const truncated=($input.first().json?.choices?.[0]?.finish_reason==='length');
const data_class=(nflag<=1&&!verdict_rejected&&verdict!=='UNKNOWN'&&!truncated)?'study':'contested';
raw+='\n\n[AUDIT FLAGS: '+nflag+']';

return [{json:{...prev,independent_verdict_raw:raw,verdict_tag:verdict,defense_standing,conceded_links,challenge_standing,challenger_conceded_links,keystone_link,keystone_state,chain_count,premise_count,premise_sequence,out_of_round_concessions,out_of_round_detail,challenger_chain_mark,defender_chain_mark,data_class,audit_flags:nflag,void_links:defVoid,challenger_void_links:chVoid,debate_rule_violations:DRV.items}}];