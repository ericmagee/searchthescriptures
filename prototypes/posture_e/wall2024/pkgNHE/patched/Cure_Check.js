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
// pkgKFR (W3 queue item 2; reader phase 2 swap 1): KF_LINE is the shared reader's FORCED form (reader/readLines.cjs, embedded verbatim below).
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
P.RETRACTED=s=>{const m=s.match(new RegExp('^RETRACTED\\s*:\\s*(?:K-[A-Z]+\\d*\\s+)?'+PAIR,'i')); /* spec 16.1: optional rule id before the pair */return m?{pair:m[1]+' vs '+m[2],reason:s.slice(m[0].length).replace(new RegExp('^\\s*(?:'+SEP+'|:)\\s*'),'').trim()}:(/^RETRACTED\s*:/i.test(s)?{why:'RETRACTED: no pair',code:'RETRACTED_NO_PAIR'}:null);};
P['NOT PRESSED']=s=>{const m=s.match(/^NOT PRESSED\s*:\s*(.+?)(?:\s*(?:--|\u2014|\u2013)\s*(.*))?$/i);return m?{verse:m[1].trim(),reason:(m[2]||'').trim()}:null;};
P.PRESSED=s=>{if(!/^PRESSED\s*:/i.test(s))return null;const r=s.replace(/^PRESSED\s*:\s*/i,'');                 // two live forms (W1 2373 b1)
 let p=r.match(new RegExp('^'+PAIR+'\\s*\\|\\s*\\[((?:CR|DR)[1-4])\\]\\s*\\|\\s*["\\u201c](.+)["\\u201d]$','i'));if(p)return {kind:'cure',sep:'|',pair:p[1]+' vs '+p[2],round:p[3].toUpperCase(),quote:p[4]}; /* spec 16.2: the cure prompt's | form */
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
P.SHORT=s=>{const m=s.match(/^SHORT\s*:\s*(.*)$/i);if(!m)return null;const p=m[1].match(new RegExp('^'+PAIR+'\\s*\\|\\s*\\[((?:CR|DR)[1-4])\\]\\s*\\|\\s*["\\u201c](.+?)["\\u201d]\\s*\\|\\s*(\\S.{9,})$','i')); /* spec 16.2: the cure prompt's | form */
 return p?{text:m[1],pair:p[1]+' vs '+p[2],round:p[3].toUpperCase(),quote:p[4],why:p[5]}:{text:m[1]};};
P.REPLY=s=>{const m=s.match(/^(?:(SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*([SG])\s*(\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(!m)return null; // pkgSBP id variants
 const to=m[5]!=null?m[5].trim():null;return {kind:(m[1]||(m[2].toUpperCase()==='G'?'GATE':'SENDBACK')).toUpperCase(),id:m[2].toUpperCase()+m[3],answer:/^KEEP$/i.test(m[4])?'KEEP':'CHANGE',to,toRow:to?readLine(to.replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1')):null,sentence:(m[6]||'').trim()};};
// W3 spec 8.3 and 10: PREMISE <k> [is] [:] STATUS [TAG] [-- : ,] [REASON]; the engine's own 'premise k ruled X:' label is removed first. Label any case, status upper case.
P.PREMISE=s=>{const t=s.replace(/^premise\s+\d+\s+ruled\s+[A-Z ]+?\s*:\s*(?=premise\b)/i,'');const m=t.match(new RegExp('^premise\\s+(\\d+)\\s*(?:is\\s+)?:?\\s*(UNEXHIBITED|CONCEDED|NOT VOID|VOID|SPARED|COUNTED)\\b(?:\\s*'+TAG+')?\\s*(?:'+SEP+'|:|,)?\\s*','i'));if(!m)return null;
 if(m[2]!==m[2].toUpperCase())return {why:'PREMISE: status word not upper case',code:'PREMISE_STATUS_NOT_UPPER_CASE'};return {premise:+m[1],status:m[2],tag:m[3]?+m[3]:null,reason:t.slice(m[0].length).trim(),engineLabel:t!==s};};
const ORDER=['REPLY','FORCED','CORRECTED RESULT','CORRECTED COUNT','CORRECTED STANDING','RETRACTED','NOT PRESSED','PRESSED','COLLISION','ANSWER CHECK','KEYSTONE','RESULT','CLAUSE','STANDING','CONCEDED','PREMISE','RULING','RULING PART','CHAIN MARK','LINK STATE','CITATION CHECK','OUT-OF-ROUND','STATEMENT','SHORT','HEADING'];
// W3 spec 7 G12: RESTATED wraps any of these forms; the inner text is parsed as that form. G3: a form-labelled line that fails gets MALFORMED_<FORM> (detail keeps the reason code).
const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT'];
function readLine(line){const norm=normLine(line);if(!norm)return {form:null,why:'empty',code:'EMPTY',norm};
 const rs=norm.match(/^RESTATED\s*:\s*/i);if(rs){const r=readLine(norm.slice(rs[0].length).replace(/^C(\d+)(\s+[vV][sS]\.?\s+)D(\d+)\b/,'D$3$2C$1')); /* spec 16.3: reversed pair inside RESTATED only */if(r.form&&RESTATABLE.includes(r.form))return {form:r.form,f:Object.assign({},r.f,{restated:true}),norm};
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
function __kfM(s){const l=String(s==null?'':s);const r=__RL.readLine(l);if(!r||r.form!=='FORCED'||!r.f||!r.f.pair||r.f.restated)return null;const f=r.f;const m=[l,f.pair,f.meansRound,f.means,f.answerRound,f.answer,f.fails];m.index=0;m.input=l;return m;}
const KF_LINE={test:s=>!!__kfM(s),[Symbol.match]:s=>__kfM(s),toString:()=>'KF_LINE (readLines FORCED)'};
const KF_GROUND=/\bforced\b|\bcannot\s+take\b|\bcan(?:no|')t\s+(?:take|fit|bear)\b|\bdoes\s+not\s+fit\b|\bruling\s+396\b|\b396\b/i;
// pkgACR (W3 ruling, Wall 2410): K-F finds a quotation with quote marks and list breaks normalised on both sides; a quote that joins
// adjacent list items is found; one that skips words is not (ciFound as before, after the list marks at line starts are removed).
const __kfLB=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/(^|\n)[ \t]*(?:[-*\u2022>]|\d+[.)])[ \t]+/g,'$1');
const kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t));
function kfLines(text,R){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const forced=new Set();
 for(const raw of T.split('\n')){const l=raw.trim();if(!/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(l))continue;const m=l.match(KF_LINE);
  if(!m){const id=(l.match(/D\d+\s+vs\.?\s+C\d+/i)||['FORCED'])[0].replace(/\s+vs\.?\s+/i,' vs ');items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:'malformed'});
   marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+': the FORCED line is not in the form FORCED: D<i> vs C<j> -- MEANS [<round>]: "<...>" -- ANSWER [<round>]: "<...>" -- FAILS: "<...>". LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');continue;}
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');forced.add(id+'|'+(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER'));const bad=[];
  if(typeof R[m[2].toUpperCase()]!=='string'||!kfFound(m[3],R[m[2].toUpperCase()]))bad.push('the MEANS quotation is not in ['+m[2].toUpperCase()+']');
  if(typeof R[m[4].toUpperCase()]!=='string'||!kfFound(m[5],R[m[4].toUpperCase()]))bad.push('the ANSWER quotation is not in ['+m[4].toUpperCase()+']');
  if(typeof R[m[4].toUpperCase()]!=='string'||!kfFound(m[6],R[m[4].toUpperCase()]))bad.push('the FAILS quotation is not in ['+m[4].toUpperCase()+']');
  if(!bad.length)continue;items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:bad.join('; ')});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+': '+bad.join('; ')+' (ruling 396: the meaning weighed is the one the debaters exhibit; the judge supplies none of its own). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}
 for(const raw of T.split('\n')){const l=raw.trim();const m=l.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\s+vs\.?\s+C(\d+)\b/i);if(!m)continue;if(!/LINK\s+BROKEN/.test(l))continue;
  const g=(l.match(/\bGROUND\s*:(.*)$/i)||[null,l])[1];if(!KF_GROUND.test(g))continue;const id='D'+m[1]+' vs C'+m[2];{const sd=(l.match(/\b(DEFENDER|CHALLENGER)\s+LINK\s+BROKEN/i)||[])[1];if(sd?forced.has(id+'|'+sd.toUpperCase()):[...forced].some(z=>z.startsWith(id+'|')))continue;} /* pkgKS */if(items.some(x=>x.link===id))continue;
  items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:'no FORCED line'});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+' grades a link BROKEN as forced with no FORCED line quoting the MEANS sentence, the answer and the layer that fails (ruling 396). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}
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
const __CURE396=" FORCED LINK (ruling 411): a K-G4 item on a link you graded BROKEN because the link cannot take the witness's meaning, though the holding side answered it, is cured by one FORCED line for that item, its three quotations standing in the rounds named. FORCED LINK (md_notes_rulings 396): a link that cannot take a proven witness's meaning is forced and breaks; the meaning weighed is the one the debaters exhibit, and you supply none of your own; that no witness states the point in its own words is never a ground, for either side. PROVEN PRESS (md_notes_rulings 398): a witness is a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is not a witness. K-P (you counted a premise UNEXHIBITED, or graded a link BROKEN as left unanswered, on a press the ledger marks UNPROVEN, not a witness, ruling 398): cure a count with CORRECTED COUNT for that side without that premise and the CORRECTED STANDING that count makes true; cure a BROKEN line with RETRACTED for it and one CORRECTED RESULT, or one RESTATED line that is not graded LINK BROKEN or that rests on a proven press. K-F (a FORCED line whose quotations do not each stand in the round named, or a link graded BROKEN as forced with no FORCED line): cure it with one FORCED line for the item, FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<the MEANS sentence with its layers>\" -- ANSWER [<round>]: \"<the holding side's answer>\" -- FAILS: \"<the layer of that answer that fails>\", each quotation word for word in the round it names, or with RETRACTED for the line and one CORRECTED RESULT, or one RESTATED line not graded LINK BROKEN. K-R (a press proven by reference with no REFERENCE line, or a REFERENCE line whose quotations the rounds do not hold): cure it with one REFERENCE line: REFERENCE: <the press's reference> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- \"<the referenced block's stated meaning>\" / \"<the press's MEANS sentence>\". K-L2 (an [L2] of your own, in a COLLISION POINTS line, whose word stands in no verse that line cites): cure it with RETRACTED for the line and one CORRECTED RESULT, or one RESTATED line whose [L2] words each stand in a verse it cites, or that drops the [L2]. ";
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
// BB-6904 (b), portion 3: DEBATE RULE VIOLATION, rule B on the judge's own BROKEN lines. A line graded DEFENDER LINK BROKEN or
// CHALLENGER LINK BROKEN must exhibit, on the line itself, two lower layers of different kinds (6903): [L1] with quoted words, [L2] with
// a source word (own script, transliteration marks, or a Strong's number; 6926; the Latin range narrowed to transliteration letters, 6936),
// [L3] with a named reference. A tag after "no", "without", "lacks" or "not" never counts. K-G1 (6892): a BROKEN line resting on a
// witness left unanswered while that side's stated conceded count is 0. K-G3 (6934): a side graded SELF-SUPPORTED while any of its
// links is graded BROKEN. K-G2: an absent CITATION CHECK line on text from a prompt that asks for it, recorded only. The counter is
// kb.cjs (git 29caa5c), names prefixed. Lines are chosen the extractor's way: a "D<n> vs" collision entry whose first grade is DEFENDER
// or CHALLENGER LINK BROKEN. No grade is changed; each violation is a review line (6890 AMEND 2).
// judge_fix6 H8 (run 32293: the K-LB check added in judge_fix5 fired falsely on every seat and removed a correct judge, GLM): THE ENFORCER STATUS
// TABLE, the one place a rule's status is set (lib/status.js; the patch copies this block unchanged into every node that counts or reports items).
// LIVE: an item left UNCURED counts in drv_uncured, and a seat with drv_uncured above 0 is removed for an alternate, as before.
// TRIAL: the rule's marks are written to the seat's text, the review notes and the enforcer log, and its items are sent to the judge's cure for a
// RESPONSE; an item left UNCURED is reported as such but never counts in drv_uncured, so it never removes a seat, and a TRIAL item never raises
// the count another item's cure must reach. A rule not in the table is LIVE. A new check enters as TRIAL and becomes LIVE only by an edit here,
// after it has proved itself on stored text. C4-RENUM and C4-PRESS (the close-round numbering and press checks) make notes, never items.
const KW_NH=true; /* pkgKW (d): NOT HELD quoting the flagged sentence answers a K-W item */
const ENF_STATUS={'K-B':'LIVE','K-C':'LIVE','K-G1':'LIVE','K-G3':'LIVE','K-G4':'LIVE','K-G6':'LIVE','K-G7':'LIVE','K-G8':'LIVE','K-N':'LIVE','K-S':'LIVE','K-SC':'LIVE',
 'K-LB':'TRIAL','K-G9':'TRIAL','K-G10':'TRIAL','K-G11':'TRIAL','K-V':'LIVE','K-S2':'TRIAL','K-LXX':'TRIAL','K-P':'TRIAL','K-F':'LIVE','K-R':'TRIAL','K-L2':'TRIAL','K-W':'LIVE','K-S3':'LIVE','C4-RENUM':'TRIAL','C4-PRESS':'TRIAL','K-CON':'LIVE','K-CMT':'LIVE','K-CMTL':'TRIAL','K-RUL':'TRIAL','K-KJV':'TRIAL','K-AG':'TRIAL'};
const enfStatus=r=>ENF_STATUS[String(r||'')]==='TRIAL'?'TRIAL':'LIVE';
const enfLive=x=>enfStatus(x&&x.rule)==='LIVE';
// WALL-2024 silence count (Eric 2026-11-05 21:18 CST, reply 2185): an item of ANY rule, TRIAL included, with NO WRITTEN RESPONSE (flagged silent by
// cureVerdicts) counts in drv_uncured like a LIVE item, so it removes a panel seat and keeps an alternate from being seated. A written response
// that fails a TRIAL rule's form is still recorded only.
const enfSilent=x=>!!(x&&x.silent===true);
const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&(enfLive(x)||enfSilent(x))).length;
const enfTrialWhy=(x,why)=>enfLive(x)?why:(enfSilent(x)?'TRIAL rule, NO WRITTEN RESPONSE: counts in drv_uncured like a LIVE item (silence count)':'TRIAL rule (recorded and answered; it removes no seat)')+(why?': '+why:'');
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
// BB-8327 D1 and D2 (WALL-1908 as amended; his word at BB-8342): the chain-stating net, K-C. Source: e8327/s_net.js.
const NET_STATE=[
 /\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert)s?\b/i,
 /\bin\s+(?:its|their)\s+own\s+words\s+(?:state|name|assert|deny)s?\s+no\b/i,
 /\bnot\s+stated\b/i,
 /\bunstated\b/i,
 /\b(?:never|neither|nor)\s+(?:names?|states?)\b/i,
 /\bnone\s+of\s+(?:those|them|these|the)\b[^;.]*?\b(?:states?|names?)\b/i,
 /\bno\s+(?:verse|witness|row|passage)s?\s+(?:\S+\s+){0,3}?(?:states?|names?)\b/i,
 // run 32605 (Grok D5: "neither row's own words state that Joseph begat the child"): Commitment 3's banned ground, "no witness's own words state it".
 /\b(?:no|neither|nor)\s+(?:\S+\s+){0,2}?(?:verse|witness|row|passage|text)(?:['\u2019]s|s)?\s+own\s+words\s+(?:\S+\s+){0,2}?(?:states?|names?|says?)\b/i,
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
 const hit=NET_STATE.find(rx=>rx.test(cl));if(!hit)continue;const pre=cl.slice(0,cl.search(hit));if(NET_REPORT.test(pre)||NET_CONC.test(pre))continue;if(netPrecept(c0,drvGround(String(text||''),null)))continue; /* ruling 421; ruling 422 */return true;}return false;}
// A clause that reports what a side itself stated or granted is that side's statement, not the judge's ground.
const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b|\b(?:conceding|concedes|admitting|admits|granting|grants)\b/i; // judge_fix2 FIX 4: a side's concession reported with -ing or -s (32212 DeepSeek CHAIN MARK)
// 1909 (b): a clause that answers a side's own claim that a named verse says what it does not ("the challenger reads Matthew 1:16
// as saying that Joseph begat Jesus, but the verse does not state that") is the judge answering an overclaim, not the stating test.
const NET_CLAIM=/\b(?:challenger|defender)\s+(?:reads|read|claims|claimed|says|said|argues|argued|takes|took|holds|asserts|asserted|presses|pressed)\b[^;]{0,160}?\b(?:as\s+(?:saying|stating|meaning)|to\s+(?:say|state|mean))\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+|\bscripture\b|\bnowhere\b|\bno\s+(?:exhibit|passage|text)s?\b|\ba\s+single\s+(?:\S+\s+)?(?:text|verse|witness|row|passage)\b/i; // judge_fix2 FIX 4: Scripture as a whole, "nowhere", "a single text" (the /i is new; every earlier alternative is lower case or a verse form)
// ruling 421 (Commitment 3 as reworded): a clause whose subject is scripture read as a whole ("scripture", "the scriptures", "precept upon precept") and whose
// line exhibits the scripture it rests on (a verse or a layer tag; one verse or many, no count: ruling 422) is the admitted reading "scripture, read precept upon precept, does not give [the fact]", not the stating ground.
const NET_PRECEPT=/\b(?:scriptures?|precept\s+upon\s+precept)\b/i;const netRefs=s=>(String(s||'').match(/\b(?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+/g)||[]).length;
const netFoot=s=>/\b(?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+/.test(String(s||''))||/\[L[1-3]\]/.test(String(s||''));const netPrecept=(cl,line)=>NET_PRECEPT.test(cl)&&(netFoot(cl)||netFoot(line)); /* ruling 422: footing shown, never a count of verses */
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
   const hit=NET_STATE.find(rx=>rx.test(cl));const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at))||(NET_CLAIM.test(cl.slice(0,at))&&!NET_PLURAL.test(cl)))continue;if(netPrecept(cl0,drvGround(line,DL)))continue; /* ruling 421; ruling 422: footing read in the judge's ground, not the collision header */ // 1909 (b) spares an overclaim about one named verse only (A3, BB-8352)
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
// ruling 421 (B7; consolidated 32643 problem 7): a premise counted UNEXHIBITED on a verse while the same judge's ANSWER CHECK for that verse, on an answer
// of the side that holds the premise ([CR] rounds for CONCEDED LINKS, [DR] rounds for CHALLENGER CONCEDED LINKS), reads MEETS and no line of that side for it reads
// MISSES or FAILS. A mark for review only; it removes no seat.
// ruling 421 (#1, K-W, TRIAL): each sentence of a side's own round 2, 3 or 4 that withdraws or grants footing ("I do not claim", "I no longer claim",
// "I withdraw", "I grant", "I concede", "I drop"), against the link heading it stands under. The judge answers each: STANDS WITHOUT IT because <layer>, or CONCEDED.
function kwLines421(text,R){const items=[],marks=[];if(!R)return {items,marks};const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/gi;
 for(const [side,rks] of [['DEFENDER',['CR2','CR3','CR4']],['CHALLENGER',['DR2','DR3','DR4']]]){let n=0;
  for(const rk of rks){const t=String(R[rk]||'').replace(/[*_`]+/g,'');if(!t)continue;
   for(const m of t.matchAll(RX)){if(n>=10)break;const pre=t.slice(0,m.index);{const ls=pre.lastIndexOf('\n')+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);if((/^\s*#/.test(ln)&&!/[.!?]["\u201d']?\s*$/.test(ln))||((bf.match(/["\u201c\u201d]/g)||[]).length%2===1)||/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length))){n++;continue;}} /* pkgKW (a) quoted, (b) heading, (c) negated: not a withdrawal; the number is kept */const hd=[...pre.matchAll(/(?:^|\n)[ \t>#-]*((?:LINK\s*\d+|[DC]\d+)\b[^\n:]{0,40}):/gi)].pop();const lab=hd?hd[1].replace(/\s+/g,' ').trim().slice(0,30):'no link heading';
    const s=t.slice(m.index).split(/(?<=[.!?])\s|\n/)[0].slice(0,220).trim();n++;const id=side+' '+rk+' '+lab+' #'+n;
    items.push({rule:'K-W',side,link:id,line:'['+rk+'] '+lab+': "'+s+'"'});
    marks.push('[AUDIT v30: WITHDRAWAL TO ANSWER (K-W; ruling 421) -- '+id+': "'+s.replace(/[\[\]"]/g,'')+'"; the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}}
 {const P=wpLines2024(R);P.items.forEach(x=>items.push(x));P.marks.forEach(x=>marks.push(x));const Q=kconLines2024(text,P.items);Q.items.forEach(x=>items.push(x));Q.marks.forEach(x=>marks.push(x));const Z=kcmtLines2024(text);Z.items.forEach(x=>items.push(x));Z.marks.forEach(x=>marks.push(x));} // WALL-2024 check 2 (TRIAL, on K-W); package A: K-CON (Commitment 10, TRIAL)
 return {items,marks};}
// WALL-2024 check 2 (withdrawn-premise flag, narrow form; wpf.cjs cb3019c, run 1 eb2bd0f, S1/S2 c63e754; W2 cross-check).
// Rides on K-W (ruling 421, TRIAL): it removes no seat, changes no count, and ruling 445 keeps K-W out of send-backs.
// A side's own later mind-verb claim, same actor, same verse, shared object stem, after that side withdrew it.
function wpLines2024(R){const items=[],marks=[];if(!R)return {items,marks};
 const MIND=/\b(thought|think|thinks|thinking|believed|believe|believes|supposed|suppose|supposes|knew|know|knows|knowing|known|accounted|account|counted|esteemed|reckoned|considered|took|take|takes|taken)\b/gi;
 const TK=/^(took|take|takes|taken)$/i,NEG=/\b(not|no|never|nor|none|without|neither)\b/i,WD=/\bI\s+(drop|withdraw|retract|concede|abandon)\b/i;
 const NAMES=/\b(Joseph|Mary|Elisabeth|Zacharias|Adam|Eve|Jacob|Abraham|David|Herod|Jesus|Heli|Cain|Abel|Seth|Noah)\b/g,REF=/\b((?:[1-3]\s)?[A-Z][a-z]+)\s+(\d+):(\d+)/g;
 const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did own same one i me my we us our thou thee thy ye you your'.split(' '));
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z\s']/g,' '),stem=w=>w.replace(/'s$/,'').slice(0,5);
 const inQ=(l,i)=>((l.slice(0,i).match(/["“”]/g)||[]).length%2)===1;
 const refs=l=>{const s=new Set();let m;REF.lastIndex=0;while((m=REF.exec(l)))s.add(m[1]+' '+m[2]+':'+m[3]);return s;};
 const objW=a=>norm(a.split(/[,;.]|\band\b/i)[0]).split(/\s+/).filter(w=>w&&!STOP.has(w)&&w.length>=3).map(stem);
 const sents=l=>l.split(/(?<=[.!?])\s+/);
 const mc=t=>{const o=[];let x;MIND.lastIndex=0;while((x=MIND.exec(t))){const v=x[1],b=t.slice(0,x.index),a=t.slice(x.index+v.length);
  if(TK.test(v)&&!/^\s+.{0,40}?\bto be\b/i.test(a))continue;if(NEG.test(b.trim().split(/\s+/).slice(-3).join(' ')))continue;if(/\bof\s*$/i.test(b))continue;if(inQ(t,x.index))continue;
  o.push({v,i:x.index,obj:objW(a)});}return o;};
 for(const [side,rks] of [['DEFENDER',['CR1','CR2','CR3','CR4']],['CHALLENGER',['DR1','DR2','DR3','DR4']]]){let n=0;
  rks.forEach((rk,ri)=>{for(const line of String(R[rk]||'').split('\n'))for(const s of sents(line)){const m=s.match(WD);if(!m||inQ(s,m.index))continue;const cl=s.slice(m.index+m[0].length);
   for(const c of mc(cl)){const nm=cl.slice(0,c.i).match(NAMES)||[];if(!nm.length)continue;const actor=nm[nm.length-1],wv=refs(line);
    for(const rk2 of rks.slice(ri+1))for(const l2 of String(R[rk2]||'').split('\n')){if(!new RegExp('\\b'+actor+'\\b').test(l2))continue;const lv=refs(l2);const sv=[...wv].filter(v=>lv.has(v));if(!sv.length)continue;
     for(const s2 of sents(l2))for(const c2 of mc(s2)){const sh=c2.obj.filter(o=>c.obj.includes(o));if(!sh.length||n>=10)continue;n++;
      const ws=s.trim().slice(0,200),ls=s2.trim().slice(0,200),id=side+' '+rk2+' withdrawn in '+rk+' #'+n;
      items.push({rule:'K-W',side,link:id,line:'['+rk2+'] reasserts what ['+rk+'] withdrew ('+actor+', '+sv.join(', ')+'): "'+ls+'" after "'+ws+'"'});
      marks.push('[AUDIT v31: WITHDRAWN PREMISE REASSERTED (K-W; WALL-2024 check 2) -- '+id+': ['+rk+'] "'+ws.replace(/[\[\]"]/g,'')+'"; ['+rk2+'] "'+ls.replace(/[\[\]"]/g,'')+'" ('+actor+', '+sv.join(', ')+', shared: '+sh.join(', ')+'); the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}}}});}
 return {items,marks};}
// WALL-2024 package A, K-CON (Commitment 10, TRIAL): each WITHDRAWN PREMISE REASSERTED mark (K-W, AUDIT v31, check 2) must be captured
// in the judge's own text: a CONTRADICTION line, a NOT HELD line, or a REASSERTED IN line that quotes the later sentence (6 or more
// consecutive words of it). A mark not captured is recorded against the seat. It removes no seat and changes no count.
// WALL-2024 package B, K-CMT (TRIAL): a contested grade (BROKEN, FORCED, MISSES, VOID, UNPROVEN) in the judge's reasoning that names no
// "(Commitment N)". One item per judgment, counting the lines, with up to five shown. It removes no seat and changes no count.
// K-CMT precision (W3 ruling, WALL-2024 reply 2216): only the judge's own contested grade lines count. Not counted: the engine's
// RESULT ... recomputed line; the CLAUSE formula line (its own form check reads it); DEFENSE / CHALLENGE STANDING lines; ruling-card lines (RULING / CLAIM / NAMED BY /
// RULE / APPLIED; K-RUL reads the card); grade words inside quotation marks (ANSWER CHECK MEANS/ANSWER quotes, quoted reasons);
// a grade word in a negation ("None is VOID", "No premise is VOID", "not VOID"); in an ANSWER CHECK line, any word but its verdict slot
// (the grade after ANSWER, e.g. MISSES). "Commitments 3 and 7" names a commitment.
function kcmtGrade2024(l){if(/^\[AUDIT\b/.test(l))return false;const h=l.replace(/^[-*•>\s]+/,'').replace(/^\*\*/,'');
 if(/^RESULT\s*:.*\brecomputed\b/i.test(h))return false;if(/^CLAUSE\s*:/i.test(h))return false;if(/^SUPERSEDED BY CURE\s*:/i.test(h)||/^RESULT\s*:.*\bderived after the send-back\b/i.test(h))return false; /* pkgKCMT (c): engine-written lines (W3 2216) */if(/^(?:DEFENSE|CHALLENGE)\s+STANDING\s*:/i.test(h))return false; /* a standing is graded by its standing word; a VOID in it counts rulings made on the CONCEDED LINKS line */
 if(/^(?:RULING\s*(?:--|—|–|:)|CLAIM\s*:|NAMED BY\s*:|RULE\s*:|APPLIED\s*:)/i.test(h))return false;
 if(/\bCommitments?\s*\d+/i.test(h))return false;
 let t=h.replace(/"[^"]*"|“[^”]*”/g,' ');
 if(/^ANSWER CHECK\s*:/i.test(h)){const a=t.lastIndexOf('ANSWER:');const sg=(a<0?'':t.slice(a)).split(/\s(?:--|—|–)\s/);t=sg.length>1?sg[1]:'';} /* an ANSWER CHECK grades by its verdict slot after ANSWER; a trailing "premise N is VOID" points to a VOID ruled elsewhere */
 t=t.replace(/\b(?:none|no\s+\w+(?:\s+\w+)?)\s+(?:(?:is|are|was|were)\s+)?(?:counted\s+as\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/gi,' ').replace(/\bnot\s+(?:(?:graded|counted|ruled|held)\s+)?(?:(?:DEFENDER|CHALLENGER)\s+)?(?:LINK\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/gi,' '); /* pkgKCMT (c): "not graded DEFENDER LINK BROKEN" negates (32998, 33021 grok KEYSTONE ... STANDS) */
 return /\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/.test(t);}
function kcmtlSeg2024(text,k){for(const s of String(text||'').split(/;|\n/)){const m=s.match(/^\s*lines?\s+((?:\d+\s*(?:,|and|&)?\s*)+)\s*(?::|--|\u2014|\u2013|-)\s*([\s\S]*)$/i);if(m&&(m[1].match(/\d+/g)||[]).map(Number).includes(k))return s.trim();}return null;} /* pkgKCL (c): the segment of a shared K-CMTL RESPONSE for line k */
function rechk2024(rp,RD){const out=[];const one=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();const has=RD&&['CR1','CR2','CR3','CR4','DR1','DR2','DR3','DR4'].some(k=>typeof RD[k]==='string');
 const pairOf=l=>{const m=one(l).match(/^(?:[-\u2022]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);return m?(m[1]+' vs '+m[2]).toUpperCase():null;};
 for(const [o0,n0,id0] of (rp||[])){const O=String(o0==null?'':o0).split('\n').map(one).filter(Boolean),N=String(n0==null?'':n0).split('\n').map(one).filter(Boolean);const OS=new Set(O);
  for(const l of N){if(OS.has(l)||/^\[AUDIT\b/.test(l))continue;
   if(kcmtGrade2024(l))out.push({id:id0||null,rule:'K-CMT',line:l,orig:O.join(' / '),old:O.some(x=>kcmtGrade2024(x)),why:'a contested grade line that names no Commitment N'});
   const pk=pairOf(l);if(pk){if(!has){out.push({id:id0||null,rule:'K-F',line:l,orig:O.join(' / '),old:null,why:'not re-checked: no rounds'});continue;}const it=kfLines(l,RD).items;
    if(it.length){const oi=O.filter(x=>pairOf(x)===pk);out.push({id:id0||null,rule:'K-F',line:l,orig:O.join(' / '),old:oi.some(x=>kfLines(x,RD).items.length>0),why:it[0].why});}}}}
 return out;} /* pkgRCK (W3 2493): K-RECHK, the K-CMT and K-F re-check of the changed lines */
function rechkRounds2024(seat){try{const PB=$('Panel Build').first().json;const J=PB.judges||[];const j=J.find(q=>q.seat===seat)||J.find(q=>q&&q.body);return j&&j.body?cureRounds(j.body):null;}catch(e){return null;}}
function kcmtLines2024(text){const items=[],marks=[];if(typeof text!=='string'||!text.trim())return {items,marks};
 let T=text;{const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T=j.reasoning;}catch(e){}}}
 const L=T.split('\n').map(l=>l.trim()).filter(l=>l&&kcmtGrade2024(l));
 if(!L.length)return {items,marks};
 items.push({rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:L.length+' contested grade line'+(L.length===1?'':'s')+' name no commitment (answer each with its Commitment N, or NOT A GRADE); first: '+L.slice(0,5).map(l=>'"'+l.slice(0,160)+'"').join('; ')});
 L.forEach((l,k)=>items.push({rule:'K-CMTL',side:'JUDGE',link:'line '+(k+1),line:'"'+l.slice(0,400)+'" -- this contested grade line names no commitment. TRIAL rule: answer it with RESPONSE: K-CMTL line '+(k+1)+' | (Commitment N), the commitment the grade applies, or NOT A GRADE where the line carries a grade word but grades nothing.'+(k===0&&L.length>1?' Several lines may share one RESPONSE, each line with its own answer, for example: RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 4: NOT A GRADE.':'')})); /* pkgKCL (a), (b): per-line items, TRIAL (W3 2437, 2481) */
 marks.push('[AUDIT v33: GRADE WITHOUT ITS COMMITMENT (K-CMT) -- '+L.length+' contested grade line'+(L.length===1?'':'s')+' name no "(Commitment N)"; first: '+L.slice(0,3).map(l=>l.replace(/[\[\]"]/g,'').slice(0,120)).join(' / ')+'; the judge answers each line with its (Commitment N), or NOT A GRADE where the line carries a grade word but grades nothing. LIVE rule: left unanswered after the cure, it removes the seat; a Commitment N or NOT A GRADE on its RESPONSE or STATEMENT line answers it.]');
 return {items,marks};}
// WALL-2024 Commitment 11, K-RUL (TRIAL; ruling card, /mnt/project-files/w3/ruling_card_draft.md, operator go 2026-11-05 19:37 CST).
// Every deciding ruling needs a ruling card (RULING / CLAIM / NAMED BY / RULE / APPLIED). Deciding rulings: each number in
// counted_premises_defender and counted_premises_challenger; the KEYSTONE line; each "D<i> vs C<j> (refs): <grade>" line graded DEFENDER LINK
// BROKEN, CHALLENGER LINK BROKEN or WITHDRAWN; each RESTATED D/C line. A ruling with no card, an incomplete card, a NAMED BY quote not in the
// record, a NAMED BY: NONE under a breaking grade, or a RULE quote that differs from the seat's accepted line is one item. It removes no seat.
const __KRUL_HEADS=["Commitment 1. The record is the only evidence.", "Commitment 2. I repair nothing.", "Commitment 3. Meaning, not words.", "Commitment 4. One standard for both sides.", "Commitment 5. Silence is not neutral.", "Commitment 6. I void only by quoting.", "Commitment 7. I judge; I do not only count.", "Commitment 8. The method is Isaiah 28:10.", "Commitment 9. I answer in the form each request gives.", "Commitment 10. I capture contradictions.", "Commitment 11. I show every ruling that decides.", "Commitment 12. I judge by the 1611 KJV alone."];
function krulTx(c){return typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';}
function krulAcc(body){try{const b=body||{};const A=(b.messages||[]).map(m=>({role:m&&m.role,t:krulTx(m&&m.content)}));
  (b.contents||[]).forEach(c=>A.push({role:c&&c.role==='model'?'assistant':(c&&c.role),t:(c&&c.parts||[]).map(p=>p&&typeof p.text==='string'?p.text:'').join('')}));
  let acc=null;for(let i=1;i<A.length;i++){if(A[i].role==='assistant'&&A[i-1].role==='user'&&/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/.test(A[i-1].t))acc=A[i].t;}return acc;}catch(e){return null;}}
function krulOwn(acc){const out={};if(typeof acc!=='string')return out;const st=l=>String(l).replace(/^[\s>#*_\-•]+/,'').replace(/[\s*_]+$/,'').trim();const L=acc.split('\n').map(st);
 __KRUL_HEADS.forEach((h,k)=>{const at=L.findIndex(l=>l.startsWith(h));if(at<0)return;let own=L[at].slice(h.length).replace(/^[\s:\-–—*_]+/,'').trim();
  if(!own){for(let i=at+1;i<L.length;i++){if(!L[i])continue;if(/^Commitment\s*\d/i.test(L[i])||L[i].includes('I ACCEPT'))break;own=L[i];break;}}if(own)out[k+1]=own;});return out;}
function krulNorm(s){return String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/\[[lr]\d\]/g,' ').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,' ').replace(/\s+/g,' ').trim();}
function krulFound(q,src){const parts=String(q||'').split(/\.\.\.|\u2026/).map(krulNorm).filter(p=>p.split(' ').length>=2);if(!parts.length)return false;const S=' '+krulNorm(src)+' ';return parts.every(p=>S.includes(' '+p+' '));}
function krulText(text){let T=String(text||'');let J=null;const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){J=null;}}return {T:T.replace(/\n\n\[AUDIT v[\s\S]*$/,''),J};}
function krulRulings(T,CP){const out=[];const seen=new Set();const add=(id,side)=>{if(!seen.has(id)){seen.add(id);out.push({id,side});}};
 for(const side of ['DEFENDER','CHALLENGER'])for(const n of ((CP&&Array.isArray(CP[side]))?CP[side]:[]))add(side+' premise '+n,side);
 const L=T.split('\n');{const kl=L.find(l=>/^\s*[-*•]?\s*\**KEYSTONE\s*:/.test(l));if(kl){add('keystone','JUDGE');const km=kl.match(/KEYSTONE\s*:\s*\**\s*(D\d+)\b/i);const ke=out.find(u=>u.id==='keystone');if(km&&ke)ke.ks=km[1].toUpperCase();}} /* K-RUL fix: the keystone's link id */
 for(const l of L){let m=l.match(/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b/);if(m)add(m[1]+' vs '+m[2],'JUDGE');
  m=l.match(/^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/);if(m)add(m[1]+' vs '+m[2],'JUDGE');}
 return out;}
function krulCards(T){const L=[];String(T||'').split('\n').map(l=>l.replace(/[*`]+/g,'').trim()).forEach(l=>{const m=l.match(/(?:^|\|\s*)((?:[-\u2022]\s*)?RULING\s*(?:--|\u2014|\u2013|:)[\s\S]*)$/);if(m&&/\bCLAIM\s*:/.test(m[1])&&/\bNAMED BY\s*:/.test(m[1])){m[1].split(/\s+(?=(?:CLAIM|NAMED BY|RULE|APPLIED)\s*:)/).forEach(p=>L.push(p.trim()));}else L.push(l);});const cards=[];
 for(let i=0;i<L.length;i++){const m=L[i].match(/^(?:[-•]\s*)?RULING\s*(?:--|—|–|:)\s*(.*)$/i);if(!m)continue;const segs=m[1].split(/\s+(?:--|—|–)\s+/);const c={head:L[i],target:segs[0]||'',grade:(segs.length>1?segs[segs.length-1]:'').trim().replace(/[.;,]+$/,''),f:{}}; /* pkgRU (a): a one-line card's grade ends with a stop */
  for(let k=i+1;k<L.length&&k<=i+8;k++){if(/^(?:[-•]\s*)?RULING\s*(?:--|—|–|:)/i.test(L[k]))break;const f=L[k].match(/^(?:[-•]\s*)?(CLAIM|NAMED BY|RULE|APPLIED)\s*:\s*(.*)$/i);if(f&&!(f[1].toUpperCase() in c.f))c.f[f[1].toUpperCase()]=f[2].trim();}
  cards.push(c);}
 return cards;}
function krulMatch(c,id,ctx){const t=c.target;const X=ctx||{};if(id==='keystone'){if(/\bkeystone\b/i.test(t))return true;const lone=String(t).trim().match(/^(D\d+)\s*$/i);return !!lone&&(!X.ks||lone[1].toUpperCase()===X.ks);} /* K-RUL fix: a keystone card may name the link by its id */
 {const pm=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(pm&&!/\b(DEFENDER|CHALLENGER)\b/i.test(t)&&new RegExp('\\bpremise\\s*'+pm[2]+'\\b','i').test(t)&&X.ps&&Array.isArray(X.ps[pm[2]])&&X.ps[pm[2]].length===1&&X.ps[pm[2]][0]===pm[1])return true;} /* K-RUL fix: a premise card with no side word, when only one side has that premise */
 let m=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(m)return new RegExp('\\b'+m[1]+'\\b','i').test(t)&&new RegExp('\\bpremise\\s*'+m[2]+'\\b','i').test(t);
 m=id.match(/^(D\d+) vs (C\d+)$/);if(m){if(new RegExp('\\b'+m[1]+'\\s*vs\\.?\\s*'+m[2]+'\\b','i').test(t))return true;for(const g of String(t).matchAll(/((?:\bD\d+\s*(?:,\s*(?:and\s+)?|\s+and\s+|\s*&\s*))+D\d+)\s*vs\.?\s*(C\d+)\b/gi)){if(g[2].toUpperCase()===m[2].toUpperCase()&&(g[1].match(/D\d+/gi)||[]).some(d=>d.toUpperCase()===m[1].toUpperCase()))return true;}} /* pkgR2 (run 32980 chatgpt): a combined card lists several D links against one C */return false;}
const KRUL_BAD=/^(?:UNEXHIBITED|VOID|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|BROKEN)\b/i;
// pkgR2 (run 32980 chatgpt): the quotes of a NAMED BY line, in double or single quotes. A single-quoted span opens after a start, space or
// opening mark and closes before an end, space or punctuation, so an apostrophe inside a word is not a mark; a double-quoted span inside it
// is part of it. Double-quoted spans outside every single-quoted span are read as before.
function krulQs(nb){const s=String(nb||'');const out=[];const used=[];const dq=[...s.matchAll(/["\u201c]([^"\u201d]{3,})["\u201d]/g)].map(m=>[m.index,m.index+m[0].length]); /* pkgRU (b) */
 for(const m of s.matchAll(/(^|[\s(\[;:,])['\u2018]((?:[^'\u2018\u2019]|['\u2019](?=[A-Za-z]))+?)['\u2019](?=$|[\s.,;:!?)\]])/g)){const a=m.index+m[1].length;const e=a+m[0].length-m[1].length;if(dq.some(([x,y])=>a>x&&e<y))continue; /* pkgRU (b): a single-quoted word inside a double-quoted quote is part of it */used.push([a,e]);if(m[2].trim().length>=3)out.push(m[2]);}
 for(const m of s.matchAll(/["\u201c]([^"\u201d]{3,})["\u201d]/g)){if(!used.some(([a,b])=>m.index>=a&&m.index<b))out.push(m[1]);}
 return out;}
function krulCheckCard(c,SRC,own){if(!c)return 'no ruling card';const miss=['CLAIM','NAMED BY','RULE','APPLIED'].filter(k=>!c.f[k]);if(miss.length)return 'the card has no '+miss.join(', ')+' line';
 const nb=c.f['NAMED BY'];if(/^NONE\b/i.test(nb)){if(KRUL_BAD.test(c.grade.toUpperCase()))return 'NAMED BY: NONE, so the ruling cannot rest on that meaning, yet it is graded '+c.grade;}
 else{const qs=krulQs(nb);if(!qs.length)return 'the NAMED BY line quotes nothing';const bad=qs.find(q=>!krulFound(q,SRC));if(bad)return 'the NAMED BY quote "'+bad.slice(0,120)+'" does not stand in the record';}
 const r=c.f['RULE'].match(/Commitment\s*(\d+)\s*(?:--|—|–|:)?\s*(?:["\u201c]([^"\u201d]+)["\u201d]|['\u2018](.+)['\u2019]\s*\.?\s*$)/i);if(r&&r[2]==null)r[2]=r[3]; /* pkgR2: a single-quoted RULE quote (run 32980 chatgpt) */if(!r)return 'the RULE line is not in the form Commitment <N> -- "<your accepted line>"';
 if(own&&own[+r[1]]&&krulNorm(own[+r[1]])!==krulNorm(r[2]))return 'the RULE quote differs from your accepted line for Commitment '+r[1]+' ("'+own[+r[1]].slice(0,120)+'")';
 return null;}
function krulLines2024(text,R,CP,ACC,PT){const items=[],marks=[];if(typeof text!=='string'||!text.trim())return {items,marks};const X=krulText(text);
 const cp=CP||(X.J?{DEFENDER:X.J.counted_premises_defender,CHALLENGER:X.J.counted_premises_challenger}:null);const RUL=krulRulings(X.T,cp);if(!RUL.length)return {items,marks};
 const cards=krulCards(X.T);const own=krulOwn(ACC);const SRC=Object.values(R||{}).filter(v=>typeof v==='string').join('\n')+'\n'+String(PT||'');
 const KX={ks:(RUL.find(u=>u.id==='keystone')||{}).ks||null,ps:{}};RUL.forEach(u=>{const m=u.id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(m)(KX.ps[m[2]]=KX.ps[m[2]]||[]).push(m[1]);}); /* K-RUL fix: match context */
 for(const u of RUL){const c=cards.find(c=>krulMatch(c,u.id,KX));const why=krulCheckCard(c,SRC,own);if(!why)continue;
  items.push({rule:'K-RUL',side:u.side,link:u.id,ruling:u.id,krul_ctx:KX,line:'deciding ruling '+u.id+': '+why+'; answer with the five-line card (RULING, CLAIM, NAMED BY, RULE, APPLIED)'});
  marks.push('[AUDIT v34: RULING WITHOUT A VALID CARD (K-RUL; Commitment 11) -- '+u.id+': '+why.replace(/[\[\]"]/g,'')+'. TRIAL rule: it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
// cure (form only, TRIAL): K-CON by a capture line quoting 6 consecutive words of the flagged sentence; K-CMT by a RESPONSE naming a commitment
// or NOT A GRADE; K-RUL by a valid card for the ruling in the cure reply.
// pkgKCR (W1, Wall 2252 B and E): a cure line may carry its K-CON answer after a label: "RESPONSE: <item> | NOT HELD -- ..." or "STATEMENT: NOT HELD -- ...".
function kconUnlabel(l){return String(l==null?'':l).replace(/^\s*(?:[-•*>]\s*)?\**\s*(?:RESPONSE\**\s*:[^|\n]*\|\s*|STATEMENT\**\s*:\s*)\**\s*/i,'');}
/* pkgNHQ (W3 2500): the full flagged sentence(s) from the round, for the NOT HELD quote tests of K-S3, K-W and K-CON (run 33060 row 7881: the item line is cut) */
function nhqFull(line,rounds){const L=String(line||'');const R=rounds||{};const Nr=s=>String(s||'').replace(/\\"/g,'"').replace(/[\u201c\u201d\u2018\u2019"]/g,"'").replace(/[*_`]+/g,'').replace(/\s+/g,' ');const out=[];
 const re=/(?:\[([CD]R\d)\]|\b([CD]R\d)\s*:)[^"\[\]]{0,80}?"/g;let m;while((m=re.exec(L))){const rk=m[1]||m[2];const a=m.index+m[0].length;const b=L.indexOf('"',a);let q=Nr(b<0?L.slice(a):L.slice(a,b)).replace(/\s*(?:\.\.\.|\u2026)\s*$/,'').trim();
  if(b>=0)re.lastIndex=b+1;const t=Nr(R[rk]);if(!t||q.length<12)continue;const k=q.slice(0,60);const p=t.indexOf(k);if(p<0)continue;
  const from=p+Math.max(q.length-1,0);const e=t.slice(from).search(/(?<!\.)[.!?](?!\.)(?=["')\]]*(?:\s|$))/); /* pkgNHE: an ellipsis is not a sentence end */const full=t.slice(p,e<0?Math.min(t.length,p+1500):from+e+1).slice(0,1500);if(full.length>=q.length)out.push(full);}
 return out;}
function krulCure(x,replyText,rounds,respText){const T=krulText(replyText).T; /* K-RUL fix: a JSON-bodied cure reply (sol, 32949) is read by its reasoning lines, for K-RUL, K-CMT and K-CON alike */
 if(x.rule==='K-RUL'){const c=krulCards(T).find(c=>krulMatch(c,x.ruling||x.link,x.krul_ctx||null));const why=krulCheckCard(c,Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n'),null);return why?{st:'UNCURED',why}:{st:'CURED',why:'a valid ruling card for '+(x.ruling||x.link),line:c.head};}
 if(x.rule==='K-CMT'||x.rule==='K-CMTL'){const rp=String(respText||'');if(/\bCommitments?\s*\d+/i.test(rp)||/\bNOT A GRADE\b/.test(rp))return {st:'CURED',why:'the response names the commitment, or NOT A GRADE',line:rp};return {st:'UNCURED',why:rp?'the RESPONSE names no Commitment N and no NOT A GRADE':'no written response'};}
 if(x.rule==='K-CON'){const qs=[...String(x.line||'').matchAll(/"([^"]{12,})"/g)].map(m=>m[1]).concat(nhqFull(x.line,rounds)); /* pkgNHQ */ /* any quoted sentence of the item, EARLIER or LATER (W2, reply 2160) */
  const runs=[];for(const q of qs){const w=krulNorm(q).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));}
  const ln=T.split('\n').find(l0=>{const l=kconUnlabel(l0);return /^\s*(?:[-•*]\s*)?\**(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+krulNorm(l)+' ').includes(' '+r+' '));});
  return ln?{st:'CURED',why:'captured with a quote of the flagged sentence',line:ln.trim()}:{st:'UNCURED',why:'no CONTRADICTION, NOT HELD or REASSERTED IN line quotes the flagged sentence'};}
 return null;}

// a RESTATED D/C line written in a cure reply, under any rule, needs a valid card in that reply (W3, reply 2157; R7). One recorded K-RUL row
// per such line (TRIAL, UNCURED, recorded only); a line already answered by a K-RUL item of this cure is not counted twice.
function krulRestated(items,reply,rounds){const out=[];const T=krulText(reply&&reply.ok?reply.text:'').T;if(!T)return out;
 const covered=new Set((items||[]).filter(x=>x&&x.rule==='K-RUL').map(x=>x.ruling||x.link));const cards=krulCards(T);const SRC=Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n');const seen=new Set();
 for(const l of T.split('\n')){const m=l.replace(/[*`]+/g,'').match(/^\s*(?:[-•]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);if(!m)continue;const id=m[1].toUpperCase()+' vs '+m[2].toUpperCase();if(covered.has(id)||seen.has(id))continue;seen.add(id);
  const why=krulCheckCard(cards.find(c=>krulMatch(c,id)),SRC,null);if(!why)continue;
  out.push({rule:'K-RUL',side:'JUDGE',link:id+' (restated in the cure)',ruling:id,line:'restated line '+id+' in the cure reply: '+why,judge_statement:null,response:null,status:'UNCURED',why:'TRIAL, recorded only: the cure reply restated '+id+' without a valid ruling card ('+why+')',statement:l.trim().slice(0,400),kinds:[]});}
 return out;}
// ======== WALL-2024 Commitment 12 (K-KJV, TRIAL; W3 kjv_only_draft.md, approved for offline build 2026-11-05 20:29 CST; rulings WALL-2024 2172) ========
// A judge's own verse quote ("Book C:V" followed at once by a quoted span) is compared with that verse as this run read it (Cited Verses).
// Case, punctuation, the KJV's [italics] and its margin notes do not count. A verse the run did not read is listed NOT CHECKED, never an item.
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
function kkjvText(text){let T=String(text||'');const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){}}return T.replace(/\n\n\[AUDIT v[\s\S]*$/,'');}
const KKJV_REF=/\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;
const KKJV_Q=/^[\s,:;(\-–—]{0,6}(?:\[L1\]\s*)?["“]([^"“”]{6,400})["”]/;
const KKJV_VER=/\b(RSV|NRSV|NIV|ESV|NASB|NKJV|NLT|Septuagint|LXX)\b/;
function kkjvPairs(T){const out=[];const A=new RegExp(KKJV_REF.source,'g');let m;
 while((m=A.exec(T))){const q=KKJV_Q.exec(T.slice(A.lastIndex,A.lastIndex+500));if(q&&kkjvFold(q[1]).split(' ').filter(Boolean).length>=3)out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3]),q:q[1]});}
 return out;}
// {items, marks, report}: an item for each verse quote that does not stand in its verse; the report lists NOT CHECKED quotes, non-verse quotes and other-version names.
function kkjvLines2024(text,ROWS){const items=[],marks=[],report=[];const T=kkjvText(text);if(!T.trim())return {items,marks,report,not_checked:0};
 const idx={};(ROWS||[]).forEach(r=>{idx[r.book+'|'+r.chapter+'|'+r.verse]=r.text;});let nc=0;
 for(const p of kkjvPairs(T)){const ref=p.book+' '+p.ch+':'+p.v1+(p.v2!==p.v1?'-'+p.v2:'');const parts=[];for(let v=p.v1;v<=p.v2;v++){const t=idx[p.book+'|'+p.ch+'|'+v];if(t)parts.push(t);}
  if(parts.length!==p.v2-p.v1+1){nc++;report.push('NOT CHECKED (the verse was not read this run): '+ref+' "'+p.q.slice(0,120)+'"');continue;}
  const kjv=parts.join(' ');if(!kkjvIsVerseQuote(p.q,kjv)){report.push('NOT A VERSE QUOTE (fewer than half its words are in '+ref+'): "'+p.q.slice(0,120)+'"');continue;}
  if(kkjvStands(p.q,kjv))continue;if(items.some(x=>x.ref===ref&&x.q===p.q))continue;
  const kt=kkjvNoMargin(kjv).replace(/\s+/g,' ').trim();
  items.push({rule:'K-KJV',side:'JUDGE',link:'KJV QUOTE '+ref,ref,q:p.q,kjv:kt,line:'['+ref+'] your quote "'+p.q+'" is not in the words of the 1611 KJV. The KJV reads: "'+kt+'". Quote the KJV words, or withdraw the ruling that rests on your wording (Commitment 12).'});
  marks.push('[AUDIT v33: QUOTE NOT IN THE KJV (K-KJV; Commitment 12; TRIAL) -- '+ref+' -- quoted "'+p.q.slice(0,160)+'"]');}
 T.split('\n').forEach(l=>{if(KKJV_VER.test(l))report.push('OTHER VERSION NAMED (listed only): '+l.trim().slice(0,200));});
 return {items,marks,report,not_checked:nc};}
// cure verdict: CURED when the reply quotes six consecutive words of the KJV verse (all of it if shorter), or withdraws the ruling naming the reference.
// ======== WALL-2024 K-AG (TRIAL; W3 2279 ask 3, ruling 2283; built by W2) ========
// An ANSWER CHECK line is graded MEETS or MISSES. FAILS is read as MISSES, and UNPROVEN marks a press that is not a witness. K-AG raises an
// item for a grade the reader cannot map (any other word, or no grade), and for an ANSWER: NONE row graded MEETS (no answer cannot meet a
// press). ANSWER: NONE graded MISSES, FAILS or UNPROVEN is consistent and raises nothing. A TRIAL form item: a K-AG item left without a written
// response counts under the silence rule; a written answer that fails the form is recorded only.
const KAG_OK=['MEETS','MISSES','FAILS','UNPROVEN'];
function kagNorm(s){return String(s==null?'':s).toUpperCase().replace(/[^A-Z0-9:;]+/g,' ').replace(/\s+/g,' ').trim();}
// One ANSWER CHECK line read loosely: its verse, its round list, whether its ANSWER is NONE, and the grade word after the ANSWER. A quoted
// ANSWER closes at the first closing mark followed by "--"; an apostrophe inside a word is never followed by "--", so it is not read as the close.
// pkgACR: the shared reader's ANSWER CHECK form for one line (null unless the line itself is an ANSWER CHECK line the reader reads)
function __acRead(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated?r.f:null;}catch(e){return null;}}
function kagRow(l){const f=__acRead(l);if(f&&f.answer!==undefined){ /* a line with no ANSWER field stays unread by K-AG, as before */const s=String(l||'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022>]|\d+[.)])?\s*/,'').trim(); /* pkgACR */
 return {verse:f.verse,rk:f.roundRaw,none:!!(f.answerBare&&/^NONE\b/i.test(String(f.answer||''))),grade:String(f.grade||'').toUpperCase(),line:s};}return kagRow0(l);}
function kagRow0(l){const s=String(l||'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-•>]|\d+[.)])?\s*/,'').trim();if(!/^ANSWER CHECK\s*:/i.test(s))return null;
 const a=s.search(/--\s*ANSWER\s*:/i);if(a<0)return null;
 const verse=((s.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--/i)||[])[1]||'').trim();const rk=((s.match(/--\s*\[([^\]]*)\]\s*--/)||[])[1]||'').trim();
 const rest=s.slice(a).replace(/^--\s*ANSWER\s*:\s*/i,'');let none=false,after=null;
 if(/^NONE\b/i.test(rest)){none=true;const k=rest.indexOf('--');after=k<0?'':rest.slice(k);}
 else if(/^["'“‘]/.test(rest)){const m=rest.slice(1).match(/["'”’]\s*(?=--)/);after=m?rest.slice(1+m.index+m[0].length):'';}
 else{const k=rest.indexOf('--');after=k<0?'':rest.slice(k);}
 const g=(String(after||'').match(/^--\s*\(?([A-Za-z][A-Za-z-]*)/)||[])[1]||'';
 return {verse,rk,none,grade:g.toUpperCase(),line:s};}
function kagLines2024(text){const items=[],marks=[],report={rows:0,grades:{},none:{}};const T=String(kkjvText(text)||'').replace(/\\n/g,'\n');if(!T.trim())return {items,marks,report};
 for(const l of T.split('\n')){const r=kagRow(l);if(!r)continue;report.rows++;const gk=r.grade||'(none)';report.grades[gk]=(report.grades[gk]||0)+1;if(r.none)report.none[gk]=(report.none[gk]||0)+1;
  const bad=!KAG_OK.includes(r.grade);const noneMeets=r.none&&r.grade==='MEETS';if(!bad&&!noneMeets)continue;
  const link='ANSWER CHECK '+r.verse+(r.rk?' ('+r.rk.replace(/\s*[;,]\s*/g,'; ')+')':'');if(items.some(x=>x.link===link&&x.grade===r.grade&&x.none===r.none))continue;
  const what=noneMeets?'grades MEETS where the ANSWER is NONE; no answer cannot meet a press':(r.grade?'grades the answer "'+r.grade+'", which is not a grade the rules name':'gives no grade after the ANSWER');
  items.push({rule:'K-AG',side:'JUDGE',link,verse:r.verse,rk:r.rk,grade:r.grade,none:r.none,
   line:'['+link+'] your ANSWER CHECK line '+what+'. Write the line again with '+(r.none?'MISSES':'MEETS or MISSES')+' as its grade (UNPROVEN if the press has no MEANS sentence), or write NOT HELD with your reason. Your line: '+r.line.slice(0,600)});
  marks.push('[AUDIT v41: ANSWER CHECK GRADE (K-AG; TRIAL) -- '+link+' -- '+(noneMeets?'ANSWER NONE graded MEETS':'grade '+(r.grade||'missing')+' is not MEETS or MISSES')+']');}
 return {items,marks,report};}
// The cure: a line of the reply (or the item's RESPONSE) that writes the ANSWER CHECK on the same verse again with a grade the rules name
// (MISSES, FAILS or UNPROVEN where the ANSWER is NONE), or NOT HELD on the item's RESPONSE line.
function kagCure(x,reply,resp){if(!x||x.rule!=='K-AG')return null;
 if(/\bNOT HELD\b/i.test(String(resp||'')))return {st:'CURED',why:'TRIAL rule (K-AG): NOT HELD written on the item\'s RESPONSE line',line:null};
 const V=kagNorm(x.verse);
 for(const l of String(reply||'').split('\n').concat([String(resp||'')])){const r=kagRow(l);if(!r||kagNorm(r.verse)!==V)continue;if(x.rk&&r.rk&&kagNorm(r.rk)!==kagNorm(x.rk))continue;
  if(['MISSES','FAILS','UNPROVEN'].includes(r.grade)||(r.grade==='MEETS'&&!r.none))return {st:'CURED',why:'TRIAL rule (K-AG): the line is written again graded '+r.grade,line:r.line.slice(0,1500)};}
 return {st:'UNCURED',why:'TRIAL rule (recorded and answered; it removes no seat): the reply writes no ANSWER CHECK line on '+x.verse+' graded '+(x.none?'MISSES':'MEETS or MISSES')+', and no NOT HELD',line:null};}
function kkjvCure(x,reply){if(!x||x.rule!=='K-KJV')return null;const R=String(reply||'');const ref=String(x.ref||'');
 const w=kkjvFold(x.kjv).split(' ').filter(Boolean);const F=' '+kkjvFold(R)+' ';const n=Math.min(6,w.length);let six=false;
 for(let i=0;n&&i+n<=w.length&&!six;i++)if(F.includes(' '+w.slice(i,i+n).join(' ')+' '))six=true;
 const wd=!!ref&&R.split('\n').some(l=>/\bWITHDRAW(N)?\b/i.test(l)&&l.includes(ref));
 if(six)return {st:'CURED',why:'TRIAL rule (Commitment 12): the reply quotes the KJV words of '+ref,line:null};
 if(wd)return {st:'CURED',why:'TRIAL rule (Commitment 12): the reply withdraws the ruling on '+ref,line:null};
 return {st:'UNCURED',why:'TRIAL rule (recorded and answered; it removes no seat): the reply neither quotes the KJV words of '+ref+' nor withdraws the ruling',line:null};}
function kconLines2024(text,wpItems){const items=[],marks=[];if(typeof text!=='string'||!text.trim()||!wpItems||!wpItems.length)return {items,marks};
 let T=text;{const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T=j.reasoning;}catch(e){}}}
 const nw=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
 const lines=T.replace(/[*_`]+/g,'').split('\n').filter(l=>/^\s*(?:[-•>]|\d+[.)])?\s*(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b|CONTRADICTIONS:\s*NONE FOUND)/i.test(l));
 const none=lines.some(l=>/CONTRADICTIONS:\s*NONE FOUND/i.test(l));
 for(const x of wpItems){const m=String(x.line||'').match(/^\[(\w+)\][^"]*"([^"]*)"/);if(!m)continue;const rk=m[1],w=nw(m[2]);
  const runs=[];for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));
  const cap=lines.some(l=>{if(/CONTRADICTIONS:\s*NONE FOUND/i.test(l))return false;const lw=' '+nw(l).join(' ')+' ';return runs.some(r=>lw.includes(' '+r+' '));});
  if(cap)continue;const id=x.link||'';
  items.push({rule:'K-CON',side:x.side,link:id,line:'['+rk+'] '+(none?'CONTRADICTIONS: NONE FOUND was written, but ':'')+'the engine marked a withdrawn premise reasserted, and no CONTRADICTION, NOT HELD or REASSERTED IN line of this judge quotes it: "'+m[2].slice(0,200)+'"'});
  marks.push('[AUDIT v32: CONTRADICTION NOT CAPTURED (K-CON; Commitment 10) -- '+id+': '+(none?'NONE FOUND written where the engine found one; ':'')+'"'+m[2].replace(/[\[\]"]/g,'').slice(0,200)+'"; the judge answers CONTRADICTION, NOT HELD with a quote, or REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}
 return {items,marks};}
function selfLines421(text){let T0=String(text||'');{const s=T0.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T0=j.reasoning;}catch(e){}}}const T=T0.replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/[*_`]+/g,'');const ref=s=>String(s).replace(/\s+/g,' ').trim().toLowerCase();
 const RX=/\b((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)/g;const AC={CR:{},DR:{}};
 for(const raw of T.split('\n')){const f=__acRead(raw);if(f){const v=String(f.verse).match(/^((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)/);if(!v||!/^(MEETS|MISSES|FAILS)$/.test(f.grade))continue;const k=ref(v[1]);for(const rd of new Set(f.rounds.map(x=>x.slice(0,2))))(AC[rd][k]=AC[rd][k]||[]).push(f.grade);continue;} /* pkgACR: the reader, every listed round (G6) */
  if(/^\s*(?:[-\u2022]\s*)?ANSWER CHECK\s*:/i.test(raw)&&__RL.readLine(raw).form==null){const m=raw.trim().match(/^(?:[-\u2022]\s*)?ANSWER CHECK\s*:\s*((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)[^\n]*?\[\s*(CR|DR)\d\s*\][^\n]*?--\s*(MEETS|MISSES|FAILS)\b/);if(!m)continue;const k=ref(m[1]);(AC[m[2]][k]=AC[m[2]][k]||[]).push(m[3]);}} /* a line the reader refuses: read as before */
 const out=[];for(const raw of T.split('\n')){const l=raw.trim();const h=l.match(/^(?:[-\u2022]\s*)?(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:(.*)$/i);if(!h)continue;const side=/^CHALLENGER/i.test(h[1])?'CHALLENGER':'DEFENDER';const ac=AC[side==='CHALLENGER'?'DR':'CR'];
  for(const seg of h[2].split(/(?=\bpremise\s+\d+)/i)){const pm=seg.match(/^premise\s+(\d+)/i);if(!pm||!/\bUNEXHIBITED\b/i.test(seg))continue;
   for(const r of new Set([...seg.matchAll(RX)].map(x=>ref(x[1])))){const g=ac[r];if(g&&g.length&&g.every(x=>x==='MEETS'))out.push('[AUDIT v30: SELF-CONTRADICTION (B7; ruling 421) -- '+side+' premise '+pm[1]+' is counted UNEXHIBITED on '+r.replace(/\b[a-z]/g,c=>c.toUpperCase())+' while this judge\'s ANSWER CHECK for that verse, on the '+side.toLowerCase()+'\'s answer, reads MEETS. REVIEW THIS ROW.]');}}}
 return out;}
const knNarrow=it=>it.tag==='CONCEDED'&&it.quotes.length>0&&it.quotes.every(q=>KN_NARROW.test(q)&&!KN_SURR.test(q));
function orcLines(text){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const i=T.search(/OUT-OF-ROUND CONCESSIONS/i);if(i<0)return [];const out=[];for(const raw of T.slice(i).split('\n').slice(1)){const l=raw.trim();if(/^(?:DEFENDER|CHALLENGER)\s+CHAIN\s+MARK/i.test(l))break;const m=l.match(/^(?:[-\u2022]\s*)?(DEFENDER|CHALLENGER)\s*\|\s*\[?\s*(CR4|DR4)\s*\]?\s*\|\s*(.+)$/i);if(!m)continue;if(/\bCOUNTED\W*$/i.test(m[3].trim()))continue;out.push(m[1].toUpperCase()+' '+m[2].toUpperCase()+': '+m[3].trim().slice(0,160));}return out;}
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
function __kfHas(text,id,side){try{if(typeof KF_LINE==='undefined')return false;const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');return T.split('\n').some(l=>{const m=l.trim().match(KF_LINE);return !!m&&m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase()===String(id).toUpperCase()&&(!side||(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')===String(side).toUpperCase());});}catch(e){return false;}} /* pkgKS: the side the FORCED line breaks, read from its MEANS round */
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
  else if(__kfHas(text,id,side)){marks.push('[AUDIT v29: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' is graded as a forced link with a FORCED line (ruling 411: a link may fail by meaning though the witness was answered); K-F reads its quotations.]');} /* ruling 411 */
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
 {let __k3=0;for(const n of orcLines(text)){__k3++;items.push({rule:'K-S3',side:/^CHALLENGER/i.test(n)?'CHALLENGER':'DEFENDER',link:'S3 '+String(n).split(' ').slice(0,2).join(' ')+' #'+__k3,line:String(n).slice(0,400)}); /* ruling 421 (#4, B5): a TRIAL cure item */marks.push('[AUDIT v29: CLOSE-ROUND CONCESSION NOT MARKED COUNTED (S3; ruling 412) -- '+n.replace(/[\[\]]/g,'')+'; a close-round concession of a declared link or a listed premise enters the counts and its line ends COUNTED. LIVE cure item K-S3 (ruling 421): COUNTED, or TOUCHES NO LINK with its reason; left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}} for(const m421 of selfLines421(text))marks.push(m421); /* ruling 421 (B7) */ for(const n of knLines(text)){items.push({rule:'K-N',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-N) -- '+n.item+' counts premise '+n.premise+' CONCEDED (stated) on words that narrow a limb; a limb the link round narrows counts in its narrowed form, and a narrowing is not a concession. REVIEW THIS ROW.]');}
 for(const n of scLines(text,DL)){items.push({rule:'K-SC',side:n.side,link:n.item,line:n.line,premise:n.premise});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-SC) -- '+n.item+' STANDS while '+(n.own?'its own line says the defender conceded':'CONCEDED LINKS counts premise '+n.premise+' (filed under that link) '+(n.tag==='CONCEDED'?'CONCEDED (stated)':'UNEXHIBITED'))+'; a link counted conceded does not stand. REVIEW THIS ROW.]');}
 for(const n of netLines(text,null,DL)){items.push({rule:'K-C',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- '+n.item+' sets aside '+(n.side==='BOTH'?'both chains':'the '+n.side.toLowerCase()+"'s chain")+' on the ground that no one verse in it states the link or its contrary in its own words; the chain is weighed as a whole. REVIEW THIS ROW.]');}
 {const kc=new Set(items.filter(x=>x.rule==='K-C').map(x=>String(x.link).toUpperCase()));const k2=ks2Lines(text,kc);k2.items.forEach(x=>items.push(x));k2.marks.forEach(x=>marks.push(x));} // judge_fix8 R6: K-S2 (TRIAL, lib/ks2.js)
 return {items,marks};}

// BB-6904 (c), portion 4: the cure call. One extra call per violating seat: its own flagged items, the rule, and a FIXED ANSWER FORM
// (BB-6952). The check reads only lines in that form; prose in the reply is recorded in the report and never read for a cure, so there is
// no negation to parse: a link not on a RETRACTED line is not retracted, and a malformed line cures nothing. A RESTATED line is run through
// the same K-B counter (drvKinds, git 0b3cbac). A missing line, a failed or unparsed call leaves the item UNCURED (6945 AMEND 3). No grade,
// count or outcome is changed here (portion 5, the operator's choice).
const CURE_FAMS=['deepseek','openai','gemini','grok','mimo','openrouter']; // Cure Route output order; covers all six (6913 note 2)
const CURE_RULE="DEBATE RULE VIOLATION. After you answered, the system checked every COLLISION POINTS line you graded DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN. "
 +"Each such line must exhibit, on the line itself or on the line directly under it, at least two lower layers of DIFFERENT kinds, read by FOOTING LAYERS (md_notes_rulings 400). FOOTING LAYERS (judge_fix8; the definition the system link-round check uses; md_notes_rulings 400: L3 is supporting verse(s) for L1): a quoted KJV verse given with its book, chapter and verse is [L1], whether or not it is tagged; a named Hebrew or Greek word given with its meaning is [L2]; any other verse quoted with its book, chapter and verse after that [L1] verse, as its support, is [L3], whether or not it is tagged, the same chapter included. A reference with no quotation adds no layer. A tag alone makes no layer, and relabelling a verse in a judgment does not change what the block shows. The lines below do not. For each one, either cure it with one RESTATED line: that collision line again, "
 +"beginning with its link, with the same grade and the two layers exhibited on it; or answer in prose why it stands (recorded; prose cures nothing). "
 +"Do not change any other line, grade or count. A line that is not cured leaves the violation standing, and this judgment is then not counted.";
const CURE_RULE_G="COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. WITNESS (md_notes_rulings 392, 398): in every item below a witness is a verse a listed premise carries under PRESSED WITH: (the list that closes [DR2] against the defender, the list that closes [CR3] against the challenger) as a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is not a witness; a verse under no PRESSED WITH: line is not a witness, and left unanswered it is no BROKEN ground and is never counted. "
 +"K-G1 (a conceded count of 0 beside a link you graded BROKEN on a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered): cure it either with CORRECTED COUNT for that side, "
 +"the number at least the number of that side's K-G1 links, together with, for each such link, a PRESSED line quoting the words of the earlier round "
 +"that pressed the witness (against the defender: [DR1] or [DR2]; against the challenger: [CR1], [CR2] or [CR3]); or with RETRACTED for that link. "
 +"K-G4 (any other link you graded BROKEN on a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered): cure it with a PRESSED line quoting the words of the earlier round that "
 +"pressed the witness (rounds as for K-G1), or with RETRACTED for that link. "
 +"For a K-G1 link whose cited verse any later round of the side that holds the link names ([CR2], [CR3] or [CR4] against the defender, [DR1], [DR2] or [DR3] against the challenger, each after the pressing round), add a SHORT line "
 +"quoting the words of that round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. "
 +"For a K-G4 link the system searches every later round of the side that holds the link ([CR2], [CR3] or [CR4] against the defender; [DR1], [DR2] or [DR3] against the challenger, each after the pressing round) for each pressed witness your line and your PRESSED quotation name, each witness on its own; a witness one of those rounds names was answered. The BROKEN grade is unanswered-false when every witness the line rests on as unanswered was answered: those its GROUND names, or all of them when the GROUND names none. It is then cured by RETRACTED or, where the link cannot take the witness's meaning though the witness was answered, by one FORCED line for the item (ruling 411; md_notes_rulings 419); a meaning break is not retracted for being answered. A BROKEN line whose GROUND names no pressed witness left unanswered rests on meaning: RETRACTED does not cure it, and only one FORCED line does (ruling 421). While one of them is named in no later round, the grade stands (judge_fix7 J1). K-W (ruling 421: a side withdrew or granted, in its own round, footing of a link it keeps): first name the fact the withdrawn sentence carried for the link (a descent, a source, a time, a person); if the side still claims that fact anywhere in the link, answer STANDS WITHOUT IT because <that fact> is carried by <the layer, [L1], [L2] or [L3], quoted, that carries that same fact in its own words>; if no layer the side gives carries it, or the side no longer claims it and the link needed it, answer CONCEDED (ruling 428; run 32677: Galatians 4:4 'made of a woman' does not carry 'the seed of David according to the flesh'). K-S3 (rulings 412 and 421: a close-round concession your count does not mark COUNTED): answer in the RESPONSE line with COUNTED, correcting your count, or with TOUCHES NO LINK: <one line naming why it touches no declared link or listed premise>. K-W is a TRIAL rule: an item left unanswered removes no seat. K-S3 is a LIVE rule: an item left unanswered after the cure removes the seat; NOT HELD: <reason> on the RESPONSE line that quotes at least 6 words in a row of the flagged sentence (all of it if the sentence is shorter), or TOUCHES NO LINK: <reason> on the RESPONSE or the STATEMENT line, answers it. "
 +"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, "
 +"PROP-DEPENDENT or COLLAPSED, or with one RETRACTED line for each BROKEN link of that side. "
 +"K-G6 (a premise listed against a side that the PRESSED-WITNESS LEDGER marks NOT NAMED (a verse the premise carries under PRESSED WITH:, md_notes_rulings 392), which your CONCEDED LINKS or CHALLENGER CONCEDED LINKS "
 +"does not count): the rule you were given reads \"A verse marked NOT NAMED is unanswered by the rule\" and \"A premise whose pressed witness goes "
 +"unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings\". Cure it either by counting it: CORRECTED COUNT for that side, "
 +"your count plus every K-G6 premise of that side you do not answer by statement, with CORRECTED STANDING for that side that the count makes true "
 +"(PROP-DEPENDENT or COLLAPSED, as you judge the side's case); or by a STATEMENT for that premise "
 +"that quotes, word for word, the words of the transcript that show the verse is not a pressed witness of that premise. "
 +" K-G10 (your CONCEDED LINKS or CHALLENGER CONCEDED LINKS counts a premise UNEXHIBITED on a verse that no premise of the list against that side carries under PRESSED WITH: -- the list that closes [DR2] against the defender, the CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3] against the challenger): md_notes_rulings 392 reads \"a press must have a premise behind it; a verse pressed without one isn't a witness\"; a verse on a \"cited in\" line of the ledger, or pressed in prose against a link, is not a witness, and leaving it unanswered never counts. Cure it either with CORRECTED COUNT for that side that no longer counts the premise on that verse (your count less every such premise you do not answer by statement), with the CORRECTED STANDING that count makes true (SELF-SUPPORTED at 0 unless a link of that side stands graded BROKEN; PROP-DEPENDENT or COLLAPSED, as you judge the side's case); or with a STATEMENT for the item that quotes, word for word and with its book, chapter and verse, the PRESSED WITH: line that carries the verse.  K-G11 (a COLLISION POINTS line you graded LINK BROKEN that rests, as unanswered, only on verses that no premise of the list against that side carries under PRESSED WITH:, while every verse of the line that the list does carry is named in a later round of that side): under md_notes_rulings 392 such a verse is no BROKEN ground. Cure it with RETRACTED for that line and one CORRECTED RESULT, the reason naming the round and the verse; or with one RESTATED line for it that is not graded LINK BROKEN; or with one RESTATED LINK BROKEN line that names, as left unanswered, a verse the list carries under PRESSED WITH:.  K-V (a premise you ruled VOID as charged beyond its quote, where your ruling quotes no words of the charge that go beyond the quote, or names no kind): a charge is stronger than its quote only when it asserts what the quote does not, a negation, a universal (all, none, only, never), or a claim the words of the quote do not make. Cure it with a STATEMENT for the item that names the word that makes the charge stronger, as the pre-check UNIVERSAL TEST lists it, or that quotes, word for word, the charge words that go beyond the quote and names the kind; or by regrading the premise in one RESTATED line for that count (SUPPORTED or NARROWED; or counted UNEXHIBITED or CONCEDED, with CORRECTED COUNT and the CORRECTED STANDING that count makes true). K-S2 (a collision line, or your reasoning line, that rests in any GROUND clause on the retired single-verse ground in another form: no witness states it in its own words, none states that, states no ...): that a verse or witness does not state the point in its own words is never a ground (DG-61). Cure it as K-C: one RESTATED line for the item that drops that ground and weighs the chains on their footing (two layer kinds), or a RETRACTED line with one CORRECTED RESULT.  K-LXX (your text says no Septuagint reading or reference occurred, but the system scan found a round that rests a reading on the Greek Old Testament): cure it with a STATEMENT for the item that names the Septuagint reading and the round that rests on it, quoting that round, or with one RESTATED CITATION CHECK line that names it. "+__CURE396+" K-LB (a link-round block of [CR3] or [DR3] that exhibits fewer than two prior layer kinds, which your count does not count; the burden rule is the same in every round: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them): cure it by counting it, CORRECTED COUNT for that side, your count plus every such premise, with its CORRECTED STANDING; or by a STATEMENT for the item that quotes the block's own words and exhibits, on that line, the two layer kinds the block itself shows, read by FOOTING LAYERS; a tag you add, or a verse you relabel, does not change the block. FOOTING LAYERS (judge_fix8; the definition the system link-round check uses; md_notes_rulings 400: L3 is supporting verse(s) for L1): a quoted KJV verse given with its book, chapter and verse is [L1], whether or not it is tagged; a named Hebrew or Greek word given with its meaning is [L2]; any other verse quoted with its book, chapter and verse after that [L1] verse, as its support, is [L3], whether or not it is tagged, the same chapter included. A reference with no quotation adds no layer. A tag alone makes no layer, and relabelling a verse in a judgment does not change what the block shows. "
 +"K-G7 (a COLLISION POINTS line you graded DEFENDER LINK BROKEN on D<n> while your CONCEDED LINKS does not count premise n): a link is BROKEN "
 +"only for a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered, and a premise whose witness goes unanswered is counted. Cure it either by counting it: CORRECTED COUNT "
 +"for DEFENDER, your count plus every such premise and every K-G6 premise of that side, with the CORRECTED STANDING that count makes true; "
 +"or by regrading it: a RETRACTED line for that link and exactly one CORRECTED RESULT. The same holds for a CHALLENGER LINK BROKEN line for "
 +"a pressed witness under PRESSED WITH: left unanswered while your CHALLENGER CONCEDED LINKS is 0: CORRECTED COUNT for CHALLENGER, or RETRACTED and one CORRECTED RESULT. "
 +"K-G8 (your counted_premises array for a side lists a different number of premises than that side's count): CORRECTED COUNT for that side equal to the number of premises your array lists plus every K-G6 or K-G7 premise of that side, with the CORRECTED STANDING that count makes true. K-S (a link marked STANDS, or a collision graded UNDERDETERMINED, whose ground is that a verse does not state a link or its contrary, with no round named that answered the witness): A link marked STANDS, or a collision graded UNDERDETERMINED, against a pressed witness the other side exhibited (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) names in the same line the round that answered that witness. A pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered is a BROKEN ground; a verse under no PRESSED WITH: line, left unanswered, is no BROKEN ground. That a single verse does not state a link or its contrary is never a ground for STANDS or UNDERDETERMINED, for either side. Cure it with one RESTATED line for that link (D<n> vs C<m>, or D<n> for a STANDS line), regraded: it names the round that answered the witness ([CR2], [CR3] or [CR4] for a defender link, [DR1], [DR2] or [DR3] for a challenger link), or it grades the line LINK BROKEN, with exactly one CORRECTED RESULT. "
 +"K-C (a line that sets aside a chained premise, or a side's rows read together, on the ground that no one verse in them states the link or its contrary in its own words; the item quotes the line and the chain it set aside): that is never a ground, for the rows are weighed together, line upon line. If the ground you drop was the only ground your RESULT gave for its winner, your cure also writes a CORRECTED RESULT that names a new ground from the exhibited chains, or reads UNDERDETERMINED (run 32677: a restated RESULT kept its winner with no ground). "
 +"Cure it with one RESTATED line for the item that grades it on the chain as a whole: it drops that ground and names the footing of the chain it weighed, exhibiting at least two kinds of layer, each tagged as the layer rule reads: [L1] with the KJV words quoted; [L2] with the Hebrew or Greek word in its own script, with its transliteration marks, with its Strong's number, or in plain letters with its English meaning beside it (\"[L2] genomenou (made)\", \"[L2] sperma, seed\"), the tag directly before the word; [L3] with the cross-reference named. A tag that stands on no such word is not counted. Name rounds in brackets ([CR3], [DR2]); a round named without brackets is not read. A verse counts as footing, as a witness or as an answer only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV (operator ruling 3; a quotation may be part of a verse; paraphrased or misquoted words do not count); an answer in substance without the reference named does not count. "
 +"A restated line that keeps the ground is not a cure, and an uncured K-C line is not counted (K-C UNCURED). "
 +"K-N (a CONCEDED LINKS or CHALLENGER CONCEDED LINKS item tagged CONCEDED (stated) on words that narrow a limb, such as \"I drop any claim that\"): a link is CONCEDED (stated) only when the block surrenders the link itself; a block that drops a limb and keeps the link in a narrowed form is not a concession: grade the narrowed link on the footing left after the narrowing: where the kept words still assert what its own side gave up, the narrowed link is UNEXHIBITED. "
 +"Cure it with one RESTATED line for that count line that no longer counts the narrowing as a concession. "
 +"K-SC (a link you graded STANDS while your own line says the defender conceded it, or while your CONCEDED LINKS counts the premise filed under it CONCEDED (stated)): a link counted conceded does not stand. Cure it with one RESTATED line for that link (D<n> or D<n> vs C<m>) that does not grade it STANDS; "
 +"or with one RESTATED CONCEDED LINKS line that no longer counts that premise; or with a STATEMENT for the item that names the round ([CR3], [CR4] or [DR3]) and quotes its words that show the link stands.";
const CURE_FORM="ANSWER FORM. Write each cure as one line of its own, beginning with its keyword in capitals exactly as shown:\n"
 +"RESTATED: <the full collision line, beginning D<n> vs C<m>>\n"
 +"RESTATED: <for a K-C item on a REASONING, RESULT, KEYSTONE, STANDING, CONCEDED or CHAIN MARK line, or a K-N item on a CONCEDED line: that label, a colon, then the whole regraded sentence>\n"
 +"RETRACTED: D<n> vs C<m>\n"
 +"CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>\n"
 +"CORRECTED COUNT: <DEFENDER or CHALLENGER> <number>\n"
 +"CORRECTED STANDING: <DEFENDER or CHALLENGER> <SELF-SUPPORTED, PROP-DEPENDENT or COLLAPSED>\n"
 +"PRESSED: D<n> vs C<m> | [<round>] | \"<the words of that round, quoted exactly>\"\n"
 +"SHORT: D<n> vs C<m> | [<answering round>] | \"<the words of that round, quoted exactly>\" | <why they do not overturn the link>\n"
 +"STATEMENT: <the flagged item, as labelled above> | <in your own words, why the line stands as you graded it, or what you corrected and why>\n"
 +"RETRACTED: D<n> vs C<m> retracts your BROKEN grade on that line; a retracted line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A BROKEN line you retract is regraded in the same reply: UNDERDETERMINED only with the round that answered each witness named; a pressed witness under PRESSED WITH: left unanswered keeps the line BROKEN in the corrected form; a verse under no PRESSED WITH: line does not (md_notes_rulings 392). A retraction counts only beside one CORRECTED RESULT line: your CLAUSE tag as it stands after your retractions, and that result is the one counted. A STATEMENT line never retracts anything. A judge that retracts a BROKEN line writes the reason in one sentence; a retraction of every BROKEN line that flips the verdict with no reason stated is not a cure, and that judge is not counted. A reason for a retraction names what in the rounds makes the retracted line wrong: the round, and the words or the verse it rests on. A sentence that names only the flag, the rule or the cure it performs is not a reason.\n"
 +"Write one STATEMENT line for every flagged item, cured or not; it is recorded beside the item. Instead of a cure line you may state why the line stands: "
 +"the statement is run through the same check as the cure. For a layer item it must exhibit two different kinds of layer; for a K-G1 or K-G4 "
 +"item it must name the round that pressed the witness and quote that round's words; for a K-G1 item, where a later round of the side that holds the link names the verse, it must also quote "
 +"that round's own answer; a K-G4 item whose pressed witness a later round of that side names is not cured by any statement. For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. For a K-G10 item it must quote the PRESSED WITH: line that carries the verse, with its book, chapter and verse. Cured if it passes; else the violation stands. "
 +"RESPONSE: <the flagged item, as labelled above> | <in your own words: whether you accept the mark and why, or why the mark is wrong, naming the round and quoting its words>. Write one RESPONSE line for every flagged item, in addition to the cure line it needs; an item with no RESPONSE line is not cured, whatever else the reply holds. "
 +"Only these lines are read. A link not on a RETRACTED line is not retracted. A line not in this form cures nothing. Any other text is recorded only. An item you leave without a RESPONSE line counts against your seat, under every rule, as an unanswered item of a live rule does, and your seat may be replaced. If you hold an item wrong, write NOT HELD with your reason. That is an answer. Write it on that item's RESPONSE line: RESPONSE: <the flagged item, as labelled above> | NOT HELD: <your reason>. A TRIAL item (its mark says TRIAL rule) asks only for its own form: write that form, or NOT HELD. A TRIAL item never asks you to retract or regrade a line, and it is not a reason to change any grade; retract or regrade a line only for a reason from the rounds. For a K-RUL item, write the card; a missing card is not a reason to change the grade. Every RESTATED line you write is a deciding ruling (Commitment 11): under it, in this reply, write its five-line card, one field to a line: RULING -- <the subject of the RESTATED line, e.g. D2 vs C3> -- <the grade>, CLAIM:, NAMED BY:, RULE:, APPLIED:. A RESTATED line without its card raises a K-RUL item. For a K-CON item, a NOT HELD line must quote the flagged sentence, at least six words in a row, or the item stays uncured. For a K-W item, a NOT HELD line must quote the flagged sentence, at least six words in a row of what follows its verb (all of it when shorter), or the item stays uncured.";
const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-P'||x.rule==='K-F'||x.rule==='K-R'||x.rule==='K-L2'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-CON'||x.rule==='K-CMT'||x.rule==='K-CMTL'||x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?x.rule+' '+x.link:'K-G3 '+x.side);
// pkgG4W (W3 2294): does a K-G4 line claim a pressed witness left unanswered? DRV_WORDS on the line as before, or a plain-words phrase in its
// GROUND clause with the quoted record words taken out (2294 (a): never in the grade line's own quotations).
function g4Unans2024(line){const s=String(line||'');if(DRV_WORDS.test(s))return true;const i=s.search(/\bGROUND\s*:/i);if(i<0)return false;
 const g=s.slice(i).replace(/"[^"]*"|\u201c[^\u201d]*\u201d|(^|[\s(\[])['\u2018](?:[^'\u2018\u2019]|['\u2019](?=[A-Za-z]))*?['\u2019](?=$|[\s.,;:!?)\]])/g,'$1 ');
 return /\b(?:did not answer|does not answer|not been answered|no answer|receives no answer|gave no answer|left without answer)\b/i.test(g);}
// pkgG4L (W3 2291): the class of a K-G4 item and its one cure, printed on the item. Same test as the cure check (ruling 421).
function g4Label2024(x){return g4Unans2024(x.line)
 ?' [UNANSWERED-WITNESS BREAK: your GROUND says a pressed witness was left unanswered. If a later round of that side names the witness, it was answered: cure it with RETRACTED: D<n> vs C<m> and exactly one CORRECTED RESULT line for your whole reply (CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>, a reason may follow after " -- "), or with one FORCED line where the link still cannot take the witness\'s meaning. Otherwise cure it with a PRESSED line quoting the round that pressed it.]'
 :' [MEANING BREAK: your GROUND names no pressed witness left unanswered, so this break rests on meaning. Only one FORCED line cures it. RETRACTED does not cure it: a retraction leaves the item uncured, and an uncured K-G4 item counts against your seat (LIVE rule).]';}
function cureAsk(items,broken){const kb=items.filter(x=>x.rule==='K-B'),kg=items.filter(x=>x.rule!=='K-B');let t='';
 if(kb.length)t+=CURE_RULE+'\n\nFLAGGED LINES:\n'+kb.map(x=>x.link+': '+String(x.line||'').trim()).join('\n');
 if(kg.length)t+=(t?'\n\n':'')+CURE_RULE_G+'\n\nFLAGGED ITEMS:\n'+kg.map(x=>cureLabel(x)+': '+((x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-P'||x.rule==='K-F'||x.rule==='K-R'||x.rule==='K-L2'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-CON'||x.rule==='K-CMT'||x.rule==='K-CMTL'||x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?String(x.line||'').trim()+(x.rule==='K-C'&&x.chain?'\n  '+x.chain:'')+(x.rule==='K-G4'?g4Label2024(x):''):x.side+' STANDING SELF-SUPPORTED while these '+x.side+' links are graded BROKEN: '+((broken||{})[x.side]||[]).join(', '))).join('\n');
 return t+'\n\n'+CURE_FORM;}
// The BROKEN links of each side on the judge's own lines, selected as drvCheck selects them (portion 3).
function cureBroken(text){const out={DEFENDER:[],CHALLENGER:[]};if(typeof text!=='string')return out;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');out[g[1].split(' ')[0]].push(id);}
 return out;}
// Append the judge's own answer and the cure request to the judge's own request body, per family envelope.
function cureBody(fam,body,answer,ask){const b=JSON.parse(JSON.stringify(body));
 if(fam==='gemini'){b.contents=(b.contents||[]).concat([{role:'model',parts:[{text:answer}]},{role:'user',parts:[{text:ask}]}]);return b;}
 b.messages=(b.messages||[]).concat([{role:'assistant',content:answer},{role:'user',content:ask}]);
 if(b.response_format)delete b.response_format; // a JSON-only reserve (qwen) must be free to answer in lines
 return b;}
// One reply envelope to text, never throwing: chat form, Gemini form, or a failure named.
function cureText(j){
 if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&Array.isArray(j.candidates)&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {ok:true,text:t,finish:j.candidates[0].finishReason||null};}
 const why=(j&&j.error)?('error: '+String(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error))).slice(0,160)):('unrecognised reply, keys ['+Object.keys(j||{}).join(',')+']');
 return {ok:false,text:null,why};}
// The round texts the judge was shown, read from its own request body. Each transcript block opens with its label on a line of its own, in
// either live form: single judge "[CR1]" or "[CR3 -- LINK ROUND ...]"; panel "=== [CR1] DEFENDER R1 ===" (BB-6951 defect 2). A block runs to
// the next; [DR3] ends at the counting rule (single) or at the end of the text (panel).
function cureRounds(body){const parts=[];const add=c=>{if(typeof c==='string')parts.push(c);else if(Array.isArray(c))c.forEach(p=>{if(p&&typeof p.text==='string')parts.push(p.text);});};
 try{(body.messages||[]).forEach(m=>{if(m&&m.role!=='assistant')add(m.content);});(body.contents||[]).forEach(m=>{if(m&&m.role!=='model')add(m.parts);});}catch(e){}
 const t=parts.join('\n');const re=/^(?:===[ \t]+)?\[(CR1|DR1|CR2|DR2|CR3|DR3|CR4|DR4)(?:\]|[ \t]--[^\n]*\])(?:[^\n]*===)?[ \t]*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\nCOUNTING RULE',x.e);if(c>=0&&c<end)end=c;out[x.k]=t.slice(x.e,end);});
 return out;}
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
  const missing=[],why=[];const mine=RU.filter(x=>x.kind==='NOT PRESSED'||CI_PRESS[side].includes(x.round)||(lg&&lg.labels.some(l=>[...ciKeys(l)].some(k=>x.keys.has(k)))));
  if(lg)for(const lab of lg.labels){const K=ciKeys(lab);const rs=mine.filter(x=>[...x.keys].some(k=>K.has(k)));if(!rs.length){missing.push(lab);continue;}
   const bad=rs.map(x=>({x,v:ciValid(x,side,R)})).filter(z=>!z.v.ok);if(bad.length===rs.length){missing.push(lab);why.push(lab+': '+bad[0].v.why);}}
  const pu=RU.filter(x=>x.kind==='PRESSED'&&x.ans==='UNANSWERED'&&CI_PRESS[side].includes(x.round)&&ciValid(x,side,R).ok);
  const cs=ciCountSection(text,side);const CK=cs?ciKeys(cs):new Set();const uncounted=pu.filter(x=>typeof conc!=='number'||conc<1||![...x.keys].some(k=>CK.has(k))).map(x=>x.ref);
  if(!missing.length&&!uncounted.length){if(lg)pass.push({side,n:lg.labels.length});continue;}
  const line=(missing.length?'the ledger lists '+lg.labels.length+' verse(s) cited against the '+side.toLowerCase()+' and not named in a later round of it; no valid ruling for '+missing.length+': '+missing.join(', ')+(why.length?' ('+why.join('; ')+')':''):'')+(missing.length&&uncounted.length?'; ':'')+(uncounted.length?'ruled PRESSED and UNANSWERED but not counted in '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+': '+[...new Set(uncounted)].join(', '):'');
  items.push({rule:'K-G9',side,link:side+' CITED-IN',line,missing,uncounted:[...new Set(uncounted)],conc:typeof conc==='number'?conc:0,st,L:(LN&&LN[side])||null});
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G9) -- '+side+' CITED-IN: '+line.replace(/[\[\]]/g,'')+'. Ruling 372: a pressed witness left unanswered makes the premise UNEXHIBITED and counts; a NOT PRESSED ruling gives its reason in one clause. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 if(pass.length)marks.push('[AUDIT v26: K-G9 PASS: '+pass.reduce((a,p)=>a+p.n,0)+' verses ruled -- '+pass.map(p=>p.side+' CITED-IN '+p.n).join('; ')+'; TRIAL rule]');
 return {items,marks};}
// The rounds that press a witness against each side (the judge prompt's UNANSWERED WITNESS rule).
const CURE_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const cureQ=s=>String(s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\((l[1-4]|[cd]r[1-4])\)/g,'[$1]').replace(/\s+/g,' ').trim(); // BB-7357: quote marks folded, (Ln) read as [Ln], brackets kept; BB-7397 rev 8 DoD 15: backslash escapes (\" \' \\ \n \t \r) read as the characters they stand for, first
// A quotation is found in a round when every piece of it (split at an ellipsis), stripped of edge punctuation, occurs in that round's text,
// and the pieces hold at least three words.
function cureFound(q,txt){const T=cureQ(txt);const ps=q.split(/\.{3}|…/).map(x=>cureQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);
 return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
// DoD 12 (BB-7397 rev 7, choice (i) BB-7495): a PRESSED line may carry several quotations of the named round, joined as "..." and "..."; a
// quotation not found whole is split at a closing mark, a joiner (and, &, a comma or a semicolon) and an opening mark, and counts when every piece
// is found in that round. A quotation found whole is read as before.
function cureFoundAll(q,txt){if(cureFound(q,txt))return true;const ps=String(q).split(/["”]\s*(?:and|&|,|;)\s*["“]/).map(s=>s.trim()).filter(Boolean);
 return ps.length>1&&ps.every(p=>cureFound(p,txt));}
// The reply in the fixed form (BB-6952). A line is read only when, after trimming and stripping * or ` at its ends, it begins with one of the
// five keywords and a colon; it then must match its form exactly, or it is malformed. Every other line is prose.
const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|NOT PRESSED|PRESSED|SHORT|STATEMENT|RESPONSE)[ \t]*:[ \t]*(.*)$/; // judge_fix2 W1: RESPONSE
const cureId=(d,c)=>'D'+d+' vs C'+c;
// judge_fix2 FIX 3 (run 32212, judgment 885: "D5 vs C5 ..." refused as "no RESTATED line for D5"): the RESTATED lines for an item. The lines whose
// label is the item's own; failing those, for a bare Dn item the collision lines "Dn vs Cm", and for a bare Cn item the lines "Dm vs Cn".
function cureRest(o,x){const V=s=>String(s==null?'':s).toUpperCase().replace(/\s+/g,' ').trim();const L=V(x.link);const ex=o.restated.filter(r=>V(r.link)===L);if(ex.length)return ex;
 // judge_fix4 F3: with no RESTATED line, a RETRACTED line that carries its regrade is the restated line of that collision.
 {const wr=o.withdrawn.filter(w=>w.reason&&V(w.link)===L).map(w=>({link:w.link,grade:w.regrade||'UNDERDETERMINED',text:w.link+' '+w.reason,line:w.line,retraction:true}));if(wr.length)return wr.slice(0,1);}
 const m=L.match(/^([DC])(\d+)$/);if(!m)return ex;return o.restated.filter(r=>{const k=V(r.link).match(/^D(\d+) VS C(\d+)$/);return !!k&&(m[1]==='D'?k[1]===m[2]:k[2]===m[2]);});}
// A reply that is one JSON object (a panel judge keeps its answer form) is read through its reasoning, reason or answer string.
const cureUnwrap=t=>{try{const j=JSON.parse(String(t).trim().replace(/^```(?:json)?\s*|\s*```$/g,''));if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return t;};
function cureLines(text){text=cureUnwrap(text);const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[],cited:[]};
 /* pkgCK (reader phase 2, CURE_KEY; W3 spec sections 2, 7 G12, 0.6): each keyed line is read with the shared reader (__RL.readLine) and mapped to the
    fields the cure checks read. Spec 16 (W3 2469; reader fd852d4): the rule id before the RETRACTED pair, the cure
    prompt's PRESSED and SHORT forms with "|", and a reversed C vs D inside RESTATED are read by the reader; the old round sets stay in this caller.
    NOT PRESSED and the ledger PRESSED stay on ciForm (their own reader). */
 const LAB=/^(KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*[:\-–—]+\s*/i;
 const pid=p=>{const m=String(p||'').match(/^D(\d+)\s+vs\.?\s+C(\d+)$/i);return m?cureId(m[1],m[2]):null;};
 for(const raw of String(text||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;const k=l.match(CURE_KEY);if(!k){o.prose.push(l);continue;}
  const r=k[2].trim();let m;
  if(k[1]==='RETRACTED'){const R=__RL.readLine(l);const rest=R.form==='RETRACTED'?String(R.f.reason||''):'';
   if(R.form==='RETRACTED'&&!/\bLINK\s+BROKEN\b/i.test(rest.replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,'').replace(/\b(?:(?:DEFENDER|CHALLENGER)\s+)?LINK\s+BROKEN\s+(?:grade|ruling|mark|label|line|verdict)s?\b/ig,''))){
    const g=(rest.match(/\b(UNDERDETERMINED|STANDS)\b/)||[])[1]||null; /* spec 0.6: the regrade word is upper case */
    o.withdrawn.push({link:pid(R.f.pair),line:l,regrade:g,reason:rest.replace(/^\([^)]*\)\s*/,'').replace(/^(?:--|—|-|:)\s*/,'').replace(/^(?:re)?grade[sd]?\s+(?:to\s+)?(?:UNDERDETERMINED|STANDS)\s*(?:--|—|-|:)?\s*/i,'').trim()||null});}
   else o.malformed.push(l);continue;}
  if((k[1]==='PRESSED'||k[1]==='NOT PRESSED')&&ciForm(k[1],r)){for(const z of ciRulings(l))o.cited.push(z);continue;} // judge_fix5 G2: a K-G9 ruling line (ciForm reader, unchanged)
  const R=__RL.readLine(l);const f=R.f||{};
  if(k[1]==='PRESSED'&&R.form==='PRESSED'&&f.kind==='cure'&&f.sep==='|'&&/^(DR1|DR2|CR1|CR2|CR3)$/.test(f.round)){o.pressed.push({link:pid(f.pair),round:f.round,q:f.quote,line:l});continue;} /* spec 16.2; the old round set */
  if(k[1]==='SHORT'&&R.form==='SHORT'&&f.pair&&/^(CR2|CR3|CR4|DR1|DR2|DR3)$/.test(f.round)){o.short.push({link:pid(f.pair),round:f.round,q:f.quote,why:f.why,line:l});continue;} /* spec 16.2; the old round set */
  if(k[1]==='CORRECTED RESULT'&&R.form==='CORRECTED RESULT'){o.result.push({tag:f.tag,word:f.tag.split('-')[0],line:l});continue;}
  if(k[1]==='CORRECTED COUNT'&&R.form==='CORRECTED COUNT'){o.count.push({side:f.side,n:f.n,line:l});continue;}
  if(k[1]==='CORRECTED STANDING'&&R.form==='CORRECTED STANDING'){o.standing.push({side:f.side,st:f.standing,line:l});continue;}
  if((k[1]==='STATEMENT'||k[1]==='RESPONSE')&&R.form==='STATEMENT'&&f.item&&String(f.text||'').trim()){const at=r.indexOf('|');(k[1]==='STATEMENT'?o.statement:o.response).push({label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l});continue;}
  if(k[1]==='RESTATED'&&R.form&&f.restated){
   if(R.form==='COLLISION'){o.restated.push({link:pid(f.pair),grade:f.grade,text:r,line:l});continue;}
   if(R.form==='LINK STATE'){o.restated.push({link:String(f.link).toUpperCase(),grade:/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)$/.test(f.grade)?f.grade:null,text:r,line:l});continue;}
   if((m=r.match(LAB))){o.restated.push({link:m[1].toUpperCase(),grade:null,text:r.slice(m[0].length),line:l});continue;} // BB-8327 D1: a restated KEYSTONE, RESULT, STANDING, CONCEDED or CHAIN MARK line
  }
  o.malformed.push(l);}
 return o;}
// judge_fix4 F3 (run 32266: the table quoted GLM's first malformed line, "RETRACTED: D1 vs C6", under nearly every item): a malformed line is an
// item's own when, after its keyword and an optional rule name, it opens with that item's label (for K-G3, "<SIDE> STANDING").
function cureOwn(l,x){const b=String(l).replace(/^[A-Z ]+:\s*/,'').replace(/^K-[A-Z]+\d*\s+/i,'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 const lab=x.rule==='K-G3'?String(x.side||'')+' STANDING':String(x.link||'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 return !!lab&&b.startsWith(lab)&&!/[0-9A-Z]/.test(b.charAt(lab.length));}
// Judge each item against the fixed-form lines (6904 c; 6946; 6952).
// K-B: exactly one RESTATED line for the link; its grade (the first after the link, as drvCheck finds it) is that side's LINK BROKEN; the line
// passes the K-B counter (two kinds). K-G1: RETRACTED for the link; or one CORRECTED COUNT for that side at least the number of that side's
// K-G1 links, and a PRESSED line for the link whose round presses that side (defender [DR1], [DR2]; challenger [CR1]-[CR3], 6950) and whose
// quotation is found in that round's text. K-G3: one CORRECTED STANDING for that side other than SELF-SUPPORTED; or a RETRACTED line for every
// BROKEN link of that side (none readable: UNCURED, 6949). Two differing lines for one count or standing, or two restatements: UNCURED.
// BB-6904 rev 8 K-G5: verse references in a text, each with its position: a book (capitalised word, first three letters; 1-3 prefix kept;
// Mt Mk Lk Jn Ex Ro read as Matthew Mark Luke John Exodus Romans), chapter:verse, a range (at most 30 verses), comma lists ("1:16, 1:18",
// "1:16,18,20"); a bare chapter:verse with no book before it takes the last book named ("Matthew 1:19 ... 1:25").
const CURE_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
// judge_fix4 F6 (run 32266: "(1:24)" in [CR2] was read as naming Matthew 1:24): with scoped, a bare chapter:verse takes the last book named only when
// no sentence ends between that book's reference and it (ruling 376: book, chapter and verse stated).
const CURE_SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
function cureRefs(t,scoped){return REFP.keys(t,{scoped:!!scoped,cap:30}).map(k=>({key:k.key,pos:k.pos}));} // judge_fix5 G5: REFP, the one reference parser
// The verses of a line's first parentheses that the link round names, each with the link round's answer to it: the text from 300 characters
// before each naming to 1,200 after, kept inside the LINK block that holds the naming (7194 defect 1: a whole block let an unrelated sentence cure).
// BB-7397 rev 9 DoD 19: w widens each window by w characters on each side, inside the LINK block; left and right hold the two margins alone,
// so a quotation found in the widened text and in neither margin alone overlaps the window. w 0 is the window as before.
function cureNamed(line,LR,w){w=w>0?w:0;const p=String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/);if(!p)return [];const want=new Set(cureRefs(p[1]).map(r=>r.key));if(!want.size)return [];
 const heads=[];const hr=/^[ \t>*#_-]*LINK\s+\d+/gmi;let h;while((h=hr.exec(LR)))heads.push(h.index);
 const span=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}const lo=Math.max(a,pos-300),hi=Math.min(b,pos+1200);return {t:LR.slice(Math.max(a,lo-w),Math.min(b,hi+w)),l:LR.slice(Math.max(a,lo-w),lo),r:LR.slice(hi,Math.min(b,hi+w))};};
 const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(span(r.pos));
 return Object.keys(by).map(k=>({ref:k,blocks:by[k].map(x=>x.t),left:by[k].map(x=>x.l),right:by[k].map(x=>x.r)}));}
// BB-7397 rev 8 DoD 18 (rulings 105; the test of 7564 item 1): a RETRACTED line counts only beside a reason, a STATEMENT or prose line of the
// reply that names the same link, a round ([CR1]-[DR3]) and words in quotation marks (3+ words) or a verse. Placement is free; a line that
// names only the flag, the rule or the cure carries none of these and is no reason. Returns the links (upper case) that have a reason.
// Amendment 3 (7571, Worker_E's 7570): the flagged item's own words are the flag, not a reason. A STATEMENT is tested after its bar only, and
// from every carrier the text of a flagged item's line (flags: the items' lines; whitespace and emphasis folded) is removed before the test.
function cureReasoned(o,flags){const U=s=>String(s).toUpperCase();const out=new Set();
 const fold=s=>String(s||'').replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
 const F=[...new Set((flags||[]).map(fold).filter(Boolean))].sort((a,b)=>b.length-a.length);
 const strip=s=>{let t=fold(s);for(const f of F)t=t.split(f).join(' ');return t.replace(/\s+/g,' ').trim();};
 const carriers=o.statement.map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})).concat(o.prose.map(p=>{const t=strip(p);return {name:t,body:t};})).concat(o.withdrawn.filter(w=>w.reason).map(w=>({name:w.link+' '+strip(w.reason),body:strip(w.reason)}))); /* judge_fix4 F3: a RETRACTED line carries its own reason */
 for(const w of o.withdrawn){const m=String(w.link).match(/^D(\d+) vs C(\d+)$/);if(!m)continue;const re=new RegExp('\\bD'+m[1]+'\\s+vs\\.?\\s+C'+m[2]+'\\b','i');
  if(carriers.some(c=>re.test(c.name)&&/[\[(]?\b[CD]R[1-4]\b/i.test(c.body)&&(/["“][^"”]*\S\s+\S+\s+\S[^"”]*["”]/.test(c.body)||cureRefs(c.body).length>0)))out.add(U(w.link));}
 return out;}
// checker_fix FIX 2 (runs 32194 B2, 32212 B2): K-G4 searches, for each PRESSED witness the BROKEN line names, every later round of the side
// that holds the link (order CR1 DR1 CR2 DR2 CR3 DR3; CR = defender, DR = challenger). The pressed witnesses: the verses the line names that
// the quoted pressing words also name; failing that, the verses the line names outside its anchor parentheses that the pressing round names;
// failing that, the verses the line names outside its anchor. The line's anchor verse is never searched for its own sake (32212 ChatGPT).
// Returns each later naming found: {ref, round, pos}. Any naming makes the BROKEN grade unanswered-false.
function kg4Witnesses(line,q,pressText){const L=new Set(cureRefs(line).map(r=>r.key));const Q=[...new Set(cureRefs(q).map(r=>r.key))].filter(k=>L.has(k));if(Q.length)return Q;
 const an=new Set(cureRefs((String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/)||[0,''])[1]).map(r=>r.key));const B0=[...L].filter(k=>!an.has(k));
 const P=new Set(cureRefs(pressText||'').map(r=>r.key));if(!B0.length){const AP=[...an].filter(k=>P.has(k));if(AP.length)return AP;} /* pkgGK (d), W3 2306: a line that names no witness outside its anchor takes the anchor verses the pressing round names */const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}
function kg4Answered(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];const out=[];const seen=new Set();
 for(const p of presses){const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of kg4Witnesses(line,p.q,R[p.round]))for(const k of later){if(typeof R[k]!=='string'||seen.has(w+'|'+k))continue;const h=cureRefs(R[k],true).find(r=>r.key===w); /* judge_fix4 F6 */if(h){seen.add(w+'|'+k);out.push({ref:w,round:k,pos:h.pos});}}}
 return out;}
const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');
// judge_fix7 J1 (run 32302, enforcer row 92: GLM's "D6 vs C4" BROKEN grade rested on Luke 3:31, which no later challenger round names; it was
// refused as unanswered-false because Matthew 1:12 and Jeremiah 22:30, also named in the line and in the pressing quotation, were answered in
// [DR3]): K-G4 judges each pressed witness on its own. The witnesses the line rests on as unanswered are the pressed witnesses (kg4Witnesses)
// that its GROUND names, or every pressed witness when the GROUND names none of them. The grade is unanswered-false only when each of those is
// named in a later round of the side that holds the link; while one is named in none, the grade stands, and the cure line names it.
function kg4Split(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];
 const g=String(line||'').match(/\bGROUND\s*:([\s\S]*)$/i);const G=g?new Set(cureRefs(g[1]).map(r=>r.key)):null;const rests=[],answered=[],open=[];
 for(const p of presses){const W=kg4Witnesses(line,p.q,R[p.round]);const Wg=G?W.filter(k=>G.has(k)):[];const use=Wg.length?Wg:W;const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of use){if(rests.includes(w))continue;rests.push(w);const hs=[];for(const k of later){if(typeof R[k]!=='string')continue;const h=cureRefs(R[k],true).find(r=>r.key===w);if(h)hs.push({ref:w,round:k,pos:h.pos});}
   if(hs.length)answered.push(...hs);else open.push(w);}}
 return {rests,answered,open,ground:!!(G&&rests.some(k=>G.has(k)))};}
const kg4Why=(ks,side,head)=>head+'; '+(ks.open.length?'the pressed witness '+ks.open.join(', ')+' '+(ks.open.length>1?'is each':'is')+' named in no later '+side.toLowerCase()+' round, so the grade stands'+(ks.answered.length?' (answered, and not the ground: '+kg4Txt(ks.answered)+')':''):'no pressed witness is read from the line');
// judge_fix7 J2/J3: VOID premises in the cure check. x.void is the set of the side's premises the seat ruled VOID in its judgment (lbVoid, carried
// on the K-G6, K-G9 and K-LB items); a cure's STATEMENT for the item may re-rule premises VOID ("premise 4 ... VOID", "their charges are VOID:
// premise 4 ...; premise 1 ..."). A VOID premise counts for neither side (section 8), so no corrected count may count one: the count of a side
// is at most L less its VOID premises. x.plist holds the side's listed premises (number and the verse keys each carries) for K-G9.
function cvStmtVoid(t){const out=new Set();let all=false;for(const s of String(t||'').replace(/[*_`]+/g,'').split(/(?<=[.!?])\s+|\n/)){if(!/\bVOID\b/.test(s))continue;
  if(/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b/i.test(s))continue;
  const ns=[...s.matchAll(/\bpremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi)].flatMap(m=>m[1].match(/\d+/g).map(Number));if(ns.length)ns.forEach(n=>out.add(n));else if(/\b(?:each|all|every|both)\b/i.test(s))all=true;}
 return {all,set:out};}
const cvSet=v=>new Set(v&&Array.isArray(v.set)?v.set:[]);
const cvCap=x=>{if(!x||!x.L||!x.void)return Infinity;return x.void.all?0:Math.max(0,x.L-[...cvSet(x.void)].filter(j=>j>=1&&j<=x.L).length);};
const cvTxt=x=>x&&x.void?(x.void.all?'every premise':'premise'+(cvSet(x.void).size>1?'s ':' ')+[...cvSet(x.void)].sort((a,b)=>a-b).join(', ')):'';
const cvPrem=(x,ref)=>{const K=ciKeys(ref);return (x.plist||[]).filter(p=>(p.keys||[]).some(k=>K.has(k))).map(p=>p.n);};
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
const PW_FOOT=/\bexhibit|\bfooting\b|\[L[1-3]\]|\bquotations\b|prior layers?/i;
const PW_UNANS=/unanswer|unnamed|not named|no later|not answered|receives no|\bleft\b|leaving|names or answers|without (?:an |any )?answer/i;
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
  if(!PWS[side]){const PL=pwList(R,side);PWS[side]=PL?new Set(PL.flatMap(p=>[...p.keys])):null;}const PW=PWS[side];if(!PW)continue;
  const U=pwUnans(l);if(!U.length||U.some(k=>PW.has(k)))continue;
  const other=[...ciKeys(l)].filter(k=>PW.has(k)&&!pwAnswered(k,side,R));if(other.length)continue;
  const named=[...ciKeys(l)].filter(k=>PW.has(k));
  items.push({rule:'K-G11',side,link:id,line:l.slice(0,600),verses:U,pwNamed:named,pwk:[...PW]});
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G11) -- '+id+' '+g+' rests, as unanswered, only on '+U.join(', ')+', which no premise of the list against the '+side.toLowerCase()+' (the list that closes '+PW_ROUND[side]+') carries under PRESSED WITH'+(named.length?'; the verses of the line that list carries ('+named.join(', ')+') are each named in a later '+side.toLowerCase()+' round':'')+'. Ruling 392: a verse pressed without a premise is no BROKEN ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
const PW_SEG=/(^|\n|[;.]\s+|--\s*|—\s*|:\s+)(?:[-•>]\s*)?(?:\d+[.)]\s*)?[*_]*\s*premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\b(?:\s*\(LINK\s+(?:\d+|none)\))?[*_]*(?=\s*(?:is\b|are\b|:|--|—|\(|UNEXHIBITED|CONCEDED|VOID|SUPPORTED|SPARED|STANDS|NOT\b))/gi;
// judge_fix8 K6 (run 32306: ChatGPT ruled 11 of 12 listed premises VOID, e.g. "premise 6 is VOID because its [CR1] quote excludes Joseph's
// seed, not seed altogether", "premise 3 is VOID because its [CR1] quote says legal fatherhood, not a register-name"; no check read a VOID
// ruling). K-V (TRIAL): every premise a seat rules VOID for a charge stronger than its quote must, in that ruling, quote the charge words that go
// beyond the quote and name the kind (a negation, a universal, or a claim the words of the quote do not make). The ruling is read from the
// seat's count section and standing line, one segment per premise named (as K-G10 reads them). A quoted phrase counts as charge words when it
// stands in that premise's item of the list against that side, outside the item's quoted passages (the verbatim quote and any KJV words) and
// outside its PRESSED WITH: segment. A ruling that the premise has no verbatim quote (the other VOID ground) needs no charge words. A ruling
// without them is marked. Cure: the premise regraded in a RESTATED count line (SUPPORTED, NARROWED, or counted, with CORRECTED COUNT and STANDING
// when counted), or a STATEMENT for the item quoting the charge words and naming the kind.
const KV_KIND=/\bnegations?\b|\bnegative\b|\buniversals?\b|\bclaim\b[^.;]{0,60}\b(?:quote|quoted|quotation)\b[^.;]{0,40}\b(?:do(?:es)?\s+not|never)\s+(?:[a-z]+\s+)?make|\bgo(?:es)?\s+beyond\s+(?:the\s+)?(?:quoted?\b|quotation\b|['‘"“])|\bclaim\b[^.;]{0,30}\bnot\s+(?:made|in)\b[^.;]{0,20}\b(?:quote|quoted|quotation)\b/i;
const KV_NOQ=/\bno\s+verbatim\s+quot|\bnot\s+(?:found\s+)?verbatim\b|\bquot(?:e|ation)\s+(?:is\s+)?not\s+found\b|\bwithout\s+a\s+verbatim\s+quot/i;
const kvNorm=s=>String(s==null?'':s).toLowerCase().replace(/[“”"‘’'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const kvQuotes=s=>{const t=String(s||'');const out=[];for(const m of t.matchAll(/["“]([^"”\n]{1,240})["”]/g))out.push(m[1]);for(const m of t.matchAll(/(?:^|[\s(\[:;,])['‘]((?:[^'’\n]|['’](?=[A-Za-z])){2,160}?)['’](?=$|[\s.,;:!?)\]])/g))out.push(m[1]);/* pkgKV (b) */return out.map(q=>q.trim()).filter(q=>kvNorm(q).length>=2);};
// the charge text of each listed premise against a side: the item before PRESSED WITH:, its quoted passages removed
function kvCharges(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=j<0?x:x.slice(0,j);const ch=pre.replace(/["“][^"”]*["”]/g,' | ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 | ');return {n:k+1,charge:' '+kvNorm(ch)+' '};});}
// the VOID rulings of one side: segments of the count section and the standing line that rule premises VOID
function kvpOwn2024(seg,ns,out){try{const S=String(seg);let t=S,m;const RX=/(^|[\s,;(])(premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\s+(?:is|are|was|were)\s+(?:also\s+|ruled\s+|thus\s+)?VOID\b)/gi;
 while((m=RX.exec(S))){const nn=m[3].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0);if(!nn.length||nn.some(n=>(ns||[]).includes(n)))continue;t=t.replace(m[2],' ');out.push({ns:nn,seg:S.slice(m.index+m[1].length).trim()});}
 return t;}catch(e){return String(seg);}} /* pkgKVP (W3 grade_33083): a VOID clause naming another premise is that premise's */
function kvSegments(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const cs=ciCountSection(T,side)||'';const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const out=[];for(const src of [cs,st]){if(!src)continue;const at=[];let m;PW_SEG.lastIndex=0;while((m=PW_SEG.exec(src)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
  at.forEach((x,k)=>{const seg=src.slice(x.i,k+1<at.length?at[k+1].i:src.length);if(!/\bVOID\b/.test(kvpOwn2024(seg,x.ns,out))||((s0=>!/\bVOID\b/.test(s0)&&/\b(?:UNEXHIBITED|SPARED|STANDS|SUPPORTED|CONCEDED|NARROWED|COUNTED)\b/i.test(s0))(seg.split(/(?<=[.!?])\s+/)[0]))/* pkgKV (a) */||/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(seg))return; /* as lbVoid reads a denial */out.push({ns:x.ns,seg:seg.trim()});});}
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
function kvRulingOk(seg,n,CH,UNI){if(KV_NOQ.test(seg))return {ok:true,why:'no verbatim quote'};const kind=KV_KIND.test(seg)||KV_KIND.test(String(seg).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'"));/* pkgKV (c2): a long quotation does not hide the kind */const c=(CH||[]).find(p=>p.n===n);
 const q=c?kvQuotes(seg).find(q=>c.charge.includes(' '+kvNorm(q)+' ')):null;if(kind&&q)return {ok:true,kind,q};const u=(UNI||[]).find(p=>p.n===n);const w=u?kvNames(seg,u.words):null;
 return w?{ok:true,kind:true,q:w,why:'names the word '+w}:{ok:false,kind,q:q||null};}
function drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);let read=0;
 for(const side of ['DEFENDER','CHALLENGER']){const CH=kvCharges(R,side);if(!CH)continue;const UNI=kvUni(R,side);const done=new Set();
  for(const sg of kvSegments(text,side))for(const n of sg.ns){if(done.has(n)||n>CH.length)continue;done.add(n);read++;const v=kvRulingOk(sg.seg,n,CH,UNI);if(v.ok)continue;
   const id=side+' premise '+n;const miss=(v.q?'':'quotes no charge words of premise '+n+' that go beyond its quote')+(!v.q&&!v.kind?' and ':'')+(v.kind?'':'names no kind (a negation, a universal, or a claim the words of the quote do not make)');
   items.push({rule:'K-V',side,link:id,premise:n,line:'premise '+n+' ruled VOID: '+sg.seg.replace(/\s+/g,' ').slice(0,400)+' -- the ruling '+miss,conc:side==='DEFENDER'?dConc:cConc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||CH.length});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-V) -- '+id+': ruled VOID, but the ruling '+miss+(()=>{const u=UNI.find(p=>p.n===n);return u&&u.words.length?' The system\'s universal test found in its charge, not in its quote: '+u.words.join(', ').toUpperCase()+'.':' The system\'s universal test found no negation or universal word in its charge that its quote lacks.';})()+' A charge is VOID as stronger than its quote only when it asserts what the quote does not; the ruling names the word that makes it stronger (as the universal test lists it) or quotes those charge words and names the kind. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}
 if(!items.length&&read)marks.push('[AUDIT v26: K-V PASS: '+read+' VOID ruling'+(read===1?'':'s')+' read; each quotes the charge words and names the kind; LIVE rule]');
 return {items,marks};}
function kcmf2024(v){try{const L=(v||[]).filter(y=>y&&y.rule==='K-CMTL');if(!L.length||L.some(y=>y.status!=='CURED'))return v;
 return v.map(x=>x&&x.rule==='K-CMT'&&x.status==='UNCURED'?{...x,status:'CURED',why:'every contested line is answered on K-CMTL ('+L.length+' line'+(L.length>1?'s':'')+', each naming its commitment or NOT A GRADE); the grouped RESPONSE alone named none (pkgKCMF, W3 grade_33083)'}:x);}catch(e){return v;}} /* pkgKCMF */
function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};
 const nK1={DEFENDER:items.filter(x=>x.rule==='K-G1'&&x.side==='DEFENDER').length,CHALLENGER:items.filter(x=>x.rule==='K-G1'&&x.side==='CHALLENGER').length};
 const rsn=cureReasoned(o,items.map(x=>x.line)); // DoD 18; amendment 3: the items' own lines are no reason
 const wd=new Set(o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))).map(w=>U(w.link)):[]); // BB-7330: a retraction counts only beside exactly one CORRECTED RESULT line
 const rxNoWhy=new Set(o.result.length===1?o.withdrawn.filter(w=>!rsn.has(U(w.link))).map(w=>U(w.link)):[]); // DoD 18: retracted with no reason
 const rxNoRes=new Set(o.result.length!==1?o.withdrawn.map(w=>U(w.link)):[]);
 // ITEM 5: the judge's own STATEMENT for this item: by its link, or for a standing item by its side; the first one written is kept.
 // judge_fix2 W1 (operator, 2026-11-02): every flagged item needs a RESPONSE line in the judge's own words; the label names the item as the
 // FLAGGED ITEMS list labels it (cureLabel), or its link, or for K-G3 the side's STANDING.
 // judge_fix3 A6 (run 32255 enforcer rows 13 and 17: the K-G4 and K-S RESPONSE lines were stored for K-DG8 D1 vs C1 and K-C D6): a RESPONSE line
 // serves an item only when it names the item's own rule, or names no rule; the full label (rule and item) is preferred to the item alone.
  // WALL-2024 cure-label match (W2, 2208 follow-up; 32949 sol): labels compared with case, colons and bars folded to spaces; a match ends at a word edge.
 const NZ=s=>U(s).replace(/[:|]+/g,' ').replace(/\s+/g,' ').trim();const HAS=(L,k)=>{const a=NZ(L),b=NZ(k);if(!b)return false;let i=a.indexOf(b);while(i>=0){if(!/[0-9A-Z]/.test(a.charAt(i+b.length)))return true;i=a.indexOf(b,i+1);}return false;};
const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\bK-[A-Z]+[0-9]*\b/g)||[];return !rs.length||rs.includes(rk);};
  const r=o.response.find(s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?HAS(L,x.link):(L.includes(x.side)&&L.includes('STANDING')));})
   ||(items.filter(y=>y&&y.rule===x.rule).length===1?o.response.find(s=>{const L=NZ(s.label);return (L===rk||L.startsWith(rk+' '))&&ruleOk(U(s.label));}):null); /* the one item of its rule in this cure: a RESPONSE headed by that rule answers it (32949: "RESPONSE: K-CMT | ...") */if(r)return r.text;if(x.rule==='K-CMTL'){const k=+(String(x.link).match(/\d+/)||[0])[0];for(const s of o.response){if(!/^K-CMTL\b/.test(NZ(s.label)))continue;const g=kcmtlSeg2024(s.text,k);if(g)return g;}return null;} /* pkgKCL (c): a shared RESPONSE answers line k by its own segment */if(x.rule==='K-CMT'){const t=o.response.filter(s=>/^K-CMTL\b/.test(NZ(s.label))).map(s=>s.text).join('\n');return t||null;} /* pkgKCL (c): the K-CMTL answers answer the grouped item */return null;};
 const stmtOf=(x)=>{const st=o.statement.find(s=>x.link?HAS(s.label,x.link):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};
 // 6904 (c): a statement is run through the item's own check. Quotations in it (straight or curly marks, 3+ words) and round names ([DR1] etc.).
 const stmtQ=(t)=>[...String(t||'').matchAll(/["“]([^"”]{8,})["”]|(?:^|[\s(\[{:;,—–-])['‘]([^\n]{8,}?)['’](?=$|[\s.,;:!?)\]}"”—–-])/g)].map(m=>m[1]||m[2]); // judge_fix6 H2 (run 32293: GLM's statements quoted in single marks, 'And he said unto me ...', and were refused): double or single marks
 const stmtPress=(x)=>{const t=stmtOf(x);if(!t)return null;for(const rk of CURE_PRESS[x.side]){if(!new RegExp('\\['+rk+'\\]').test(t)||typeof R[rk]!=='string')continue;const q=stmtQ(t).find(q=>cureFound(q,R[rk]));if(q)return {round:rk,q,line:'STATEMENT: '+t};}return null;};
 return kcmf2024(items.map(x=>{const res=(status,why,lines,kinds)=>{const keys=(x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-F'||x.rule==='K-L2'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?[x.link]:(x.rule==='K-G1'||x.rule==='K-G4')?[x.link,x.side]:[x.side].concat((broken||{})[x.side]||[]);
   const bad=status==='UNCURED'?o.malformed.find(l=>cureOwn(l,x)):null; /* judge_fix4 F3: the item's own refused line, never the first one found */
   return {...x,judge_statement:stmtOf(x),response:respOf(x),status,why:(why||'')+(bad?(why?'; ':'')+'malformed line: '+bad.slice(0,160):'')||null,statement:(l=>l&&l.length?l.join(' / '):null)(status==='CURED'&&/^retracted/.test(why||'')&&o.result.length===1?(lines||[]).concat([o.result[0].line]):lines),kinds:kinds||[]};}; // BB-7330: a cure by retraction shows its CORRECTED RESULT line
  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);
  if(!respOf(x)){const z=res('UNCURED','no written response',null);z.silent=!o.malformed.find(l=>cureOwn(l,x));return z;} // WALL-2024 silence count: silent unless the judge wrote a refused line for this item // judge_fix2 W1: no RESPONSE line for the item leaves it UNCURED
  if(x.link&&rxNoRes.has(U(x.link)))return res('UNCURED','RETRACTED without exactly one CORRECTED RESULT line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  if(x.link&&rxNoWhy.has(U(x.link)))return res('UNCURED','RETRACTED with no reason naming the round and its words or verse (rulings 105)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  // BB-6904 rev 8 K-G5 (operational_doc 27 class 1): the verses of the line's parentheses that the answering link round names; for those a
  // SHORT line must quote that link round's own answer: words found near its naming of the verse (cureNamed: 300 characters before to 1,200
  // after, inside its LINK block). References are read by cureRefs (lists, ranges, short book names, inherited book).
  // BB-6904 rev 12 (7374, 7377): the answer is read from any later round of the side that holds the link, its round 2 or its link round,
  // that comes after the round named as pressing the witness (order CR1 DR1 CR2 DR2 CR3 DR3).
  const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const ansK=pr=>(x.side==='DEFENDER'?['CR2','CR3','CR4']:['DR1','DR2','DR3']).filter( /* judge_fix2 R2 */k=>!pr||ORD.indexOf(k)>ORD.indexOf(pr));
  const namedIn=pr=>(x.rule==='K-G1'||x.rule==='K-G4')?ansK(pr).filter(k=>typeof R[k]==='string'&&R[k]).map(k=>({k,n:cureNamed(x.line,R[k])})).filter(z=>z.n.length):[];
  const nmTxt=pr=>namedIn(pr).map(z=>'['+z.k+'] '+z.n.map(n=>n.ref).join(', ')).join('; ');
  // A quotation is the answer only in that round's own words: it is not also found in a round of the other side before it (a verse's own
  // words, quoted by both sides, never count as the answer).
  const ownQ=(q,k)=>!(x.side==='DEFENDER'?['DR1','DR2','DR3','DR4']:['CR1','CR2','CR3','CR4']).some(o2=>ORD.indexOf(o2)<ORD.indexOf(k)&&typeof R[o2]==='string'&&cureFound(q,R[o2]));
  // BB-7397 rev 9 DoD 19: a quotation counts when it overlaps a window: found in the window widened by twice its length and 40 characters,
  // and in neither margin alone (a second occurrence inside a margin makes the test refuse, never accept).
  const inWin=(q,z)=>cureNamed(x.line,R[z.k],2*String(q).length+40).some(n=>n.blocks.some((b,i)=>cureFound(q,b)&&!cureFound(q,n.left[i])&&!cureFound(q,n.right[i])));
  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&inWin(s.q,z)))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&inWin(q,z)));};
  if(x.rule==='K-G4'){const __mb421=!g4Unans2024(x.line); /* ruling 421: a BROKEN line whose ground names no witness left unanswered rests on meaning */if(wd.has(U(x.link))&&!__mb421)return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   {const fz=(typeof KF_LINE==='undefined'||!reply||!reply.ok)?[]:String(cureUnwrap(reply.text)).split('\n').map(l=>l.trim().replace(/[*_`]+/g,'')).filter(l=>{const m=l.match(KF_LINE);return !!m&&U(m[1].replace(/\s+vs\.?\s+/i,' vs '))===U(x.link)&&(!x.side||(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')===U(x.side));});if(fz.length)return res('CURED','forced link: a FORCED line for '+x.link+' (ruling 411); K-F reads its quotations',fz);} /* ruling 411 */
   if(__mb421&&wd.has(U(x.link)))return res('UNCURED','retracted, but the BROKEN grade rests on meaning: its GROUND names no pressed witness left unanswered; a meaning break is cured only by a FORCED line, never by a retraction (ruling 421)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const sl=o.short.filter(s=>U(s.link)===U(x.link)).map(s=>s.line);const lines=ps.map(p=>p.line).concat(sl);
   // checker_fix FIX 2: the pressing sentence is still quoted and found; then each pressed witness is searched in every later round of the
   // side that holds the link (kg4Answered), not the line's anchor verse; a later naming makes the grade unanswered-false (a SHORT line no longer cures it).
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it, for '+x.link,lines);
    const ks=kg4Split(x.side,x.line,[sp],R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered),lines.concat([sp.line])); // judge_fix7 J1
    return res('CURED',kg4Why(ks,x.side,'statement passes the check: quotation found in '+sp.round),lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hits=ok.filter(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hits.length)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   const ks=kg4Split(x.side,x.line,hits,R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered),lines); // judge_fix7 J1
   return res('CURED',kg4Why(ks,x.side,'pressed: quotation found in '+hits.map(p=>p.round).join(', ')),lines);}
  if(x.rule==='K-B'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));const rs=cureRest(o,x);
   if(!rs.length){const st=stmtOf(x);if(!st)return res('UNCURED','no RESTATED line and no statement for '+x.link,null);const sk=drvKinds(st);
    return res(sk.length>=2?'CURED':'UNCURED',sk.length>=2?'statement passes K-B':'statement exhibits '+sk.length+' layer kind'+(sk.length===1?'':'s')+'; the violation stands',['STATEMENT: '+st],sk);}if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const k=drvKinds(rs[0].text);if(rs[0].grade!==x.side+' LINK BROKEN')return res('UNCURED','statement does not keep the grade '+x.side+' LINK BROKEN'+(rs[0].grade?' (it reads '+rs[0].grade+')':''),[rs[0].line],k);
   return res(k.length>=2?'CURED':'UNCURED',k.length>=2?null:'statement exhibits '+k.length+' layer kind'+(k.length===1?'':'s'),[rs[0].line],k);}
  if(x.rule==='K-G1'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const lines=cs.map(c=>c.line).concat(ps.map(p=>p.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and no RETRACTED line for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<nK1[x.side])return res('UNCURED','corrected count '+ns[0]+' is below '+nK1[x.side],lines);
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line and no statement that names a pressing round and quotes it, for '+x.link,lines);
    if(!shortOk(sp.round))return res('UNCURED','the later round '+nmTxt(sp.round)+'; neither a SHORT line nor the statement quotes its answer',lines.concat([sp.line]));
    return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; statement passes the check: quotation found in '+sp.round,lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase()+' (it must be '+CURE_PRESS[x.side].map(k=>'['+k+']').join(', ')+')',lines);
   const hit=ok.find(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));
   if(hit&&!shortOk(hit.round))return res('UNCURED','the later round '+nmTxt(hit.round)+'; no SHORT line quoting its answer',lines);
   if(hit)return res('CURED','corrected: '+x.side+' COUNT '+ns[0]+'; quotation found in '+hit.round,lines);
   return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);}
  if(x.rule==='K-G3'){const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,ss.map(s=>s.line));
   if(sv.length===1&&sv[0]!=='SELF-SUPPORTED')return res('CURED','corrected: '+x.side+' STANDING '+sv[0],ss.map(s=>s.line));
   const need=((broken||{})[x.side]||[]).map(U);const wl=o.withdrawn.filter(w=>need.includes(U(w.link))).map(w=>w.line);
   if(!need.length)return res('UNCURED','the BROKEN links of '+x.side+' could not be read from the judgment',ss.map(s=>s.line).concat(wl));
   const miss=need.filter(l=>!wd.has(l));if(!wl.length&&!ss.length)return res('UNCURED','no CORRECTED STANDING for '+x.side+' and no RETRACTED line',null);
   if(miss.length)return res('UNCURED',(sv[0]==='SELF-SUPPORTED'?'standing kept SELF-SUPPORTED; ':'')+(miss.some(l=>rxNoRes.has(l))?'RETRACTED without exactly one CORRECTED RESULT line; ':'')+(miss.some(l=>rxNoWhy.has(l))?'RETRACTED with no reason naming the round and its words or verse (rulings 105); ':'')+'no counted RETRACTED line for '+miss.join(', '),ss.map(s=>s.line).concat(wl));
   return res('CURED','retracted: '+need.join(', '),wl);}
  // THE DEBATE FIXED (BB-7397, DoD 3, binding note BB-7409) K-G6: a premise the ledger marks NOT NAMED that the judge's count does not
  // count. Cured by a statement quoting the transcript, or by a CORRECTED COUNT at least the original count plus the side's K-G6 premises
  // not answered by statement, with the CORRECTED STANDING that count makes true (COLLAPSED when 2c > L, else PROP-DEPENDENT).
  // DoD 7 (BB-7420) K-G7: a DEFENDER LINK BROKEN line on a premise the judge's count leaves uncounted. K-G6 and K-G7 share one count: the
  // side's count plus the union of its K-G6 premises not cured by statement and its K-G7 premises not retracted. K-G7 is also cured by a
  // RETRACTED line for the link beside exactly one CORRECTED RESULT (the seat is then counted on that result, cureCorrected).
  const sq=y=>{const q=stmtQ(stmtOf(y));return Object.keys(R).find(k=>typeof R[k]==='string'&&q.some(z=>cureFound(z,R[k])))||null;};
  const lbStated=y=>{const st=stmtOf(y);const rk=y.side==='CHALLENGER'?'DR3':'CR3';return !!st&&drvKinds(st).length>=2&&typeof R[rk]==='string'&&stmtQ(st).some(q=>cureFound(q,R[rk]));};
  const kNeed=(sd,self)=>{const ps=new Set();for(const y of items){if(y.side!==sd)continue;
   if(y.rule==='K-G6'&&!sq(y))ps.add('P'+(String(y.link).match(/(\d+)\s*$/)||[0,y.link])[1]);if(y.rule==='K-G7'&&!wd.has(U(y.link)))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));if(y.rule==='K-LB'&&y.premise!=null&&(y===self||enfLive(y))&&!lbStated(y))ps.add('P'+y.premise); /* judge_fix5 G13; judge_fix6 H8: a TRIAL item, or one cured by statement, raises no other item's count */}return ps.size;};
  const kCount=(x,none)=>{const needN=(x.conc||0)+kNeed(x.side,x);
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and '+none+' for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);
   if(ns[0]>cvCap(x))return res('UNCURED','corrected count '+ns[0]+' counts a premise the seat ruled VOID ('+cvTxt(x)+' of '+x.L+'; a VOID premise counts for neither side, so the count is at most '+cvCap(x)+')',lines); // judge_fix7 J2
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT'); /* trim A3: PROP-DEPENDENT or COLLAPSED is the judge's choice */const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines.concat(respOf(x)?['RESPONSE: '+respOf(x)]:[]));}; /* judge_fix8 R4: the item's own answer stands beside the count it shares */
  if(x.rule==='K-G6'){if(o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))return kCount(x,'no statement quoting the transcript');const rk=sq(x);if(rk)return res('CURED','statement quotes the transcript ('+rk+')',['STATEMENT: '+stmtOf(x)]);
   return kCount(x,'no statement quoting the transcript');}
  if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}
  // DoD 9 K-G8: the side's counted_premises array and its count differ; cured by the count the line and the side's K-G6/K-G7 premises make.
  // judge_fix5 G2 K-G9: every listed verse needs a valid ruling line in the reply (the original's valid rulings do not cure the item); a verse ruled
  // PRESSED and UNANSWERED, or one the original ruled so and did not count, must be counted (ruling 372), unless re-ruled NOT PRESSED or ANSWERED IN.
  if(x.rule==='K-G9'){const RU=o.cited||[];const lines=RU.map(z=>z.line).slice(0,30);const ok9=z=>ciValid(z,x.side,R).ok;const hit=(ref,zs)=>{const K=ciKeys(ref);return zs.filter(z=>[...z.keys].some(k=>K.has(k)));};
   const miss=(x.missing||[]).filter(lab=>!hit(lab,RU).some(ok9));
   if(miss.length)return res('UNCURED','no valid ruling line in the reply for '+miss.length+' listed verse(s): '+miss.slice(0,12).join(', ')+(miss.length>12?', ...':''),lines);
   const pu=RU.filter(z=>z.kind==='PRESSED'&&z.ans==='UNANSWERED'&&CI_PRESS[x.side].includes(z.round)&&ok9(z)).map(z=>z.ref);
   const still=(x.uncounted||[]).filter(ref=>!hit(ref,RU).some(z=>ok9(z)&&(z.kind==='NOT PRESSED'||z.ans==='ANSWERED')));const need0=[...new Set(pu.concat(still))];
   // judge_fix7 J2/J3 (run 32302, enforcer row 109: Sol re-ruled the charges of the pressed verses VOID and was refused for giving no CORRECTED
   // COUNT): a verse of a listed premise the seat ruled VOID, or that the STATEMENT re-rules VOID (premises named VOID, the transcript quoted),
   // is not counted; a verse of no listed premise is excused only by such a re-ruling.
   const st9=stmtOf(x);const rv=cvStmtVoid(st9);const rr=(rv.all||rv.set.size>0)&&!!sq(x);const V9=new Set([...cvSet(x.void)].concat(rr?[...rv.set]:[]));const vall=!!(x.void&&x.void.all)||(rr&&rv.all);
   const vOf=ref=>{const ps=cvPrem(x,ref);return ps.length?(vall||ps.every(j=>V9.has(j))):rr;};const exc=need0.filter(vOf);const need=need0.filter(r=>!vOf(r));
   if(!need.length&&exc.length)return res('CURED','VOID: '+exc.join(', ')+' '+(exc.length>1?'were':'was')+' pressed only under premises ruled VOID ('+(vall?'every premise':[...V9].sort((a,b)=>a-b).join(', '))+(rr?'; re-ruled in the STATEMENT, which quotes the transcript':'')+'); a VOID premise counts for neither side',lines.concat(st9?['STATEMENT: '+st9]:[]));
   if(!need.length)return res('CURED','every listed verse ruled; none PRESSED and UNANSWERED',lines);
   const lab9=x.side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';const rc=o.restated.filter(r=>r.link===lab9);const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];
   const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const ls=lines.concat(cs.map(c=>c.line),ss.map(s=>s.line),rc.map(r=>r.line));
   const named=rc.length===1&&need.every(ref=>{const K=ciKeys(rc[0].text);return [...ciKeys(ref)].some(k=>K.has(k));});const lead=rc.length===1?(rc[0].text.match(/^\s*(\d+)\b/)||[])[1]:null;
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,ls);const n9=ns.length===1?ns[0]:(lead!=null?+lead:null);
   if(n9==null)return res('UNCURED','ruled PRESSED and UNANSWERED ('+need.join(', ')+'), but no CORRECTED COUNT for '+x.side+' (ruling 372: the premise is UNEXHIBITED and counts)',ls);
   const needN=Math.max(1,(x.conc||0)+(named?0:1))+kNeed(x.side,x);if(n9<needN)return res('UNCURED','corrected count '+n9+' is below '+needN+' (ruled PRESSED and UNANSWERED: '+need.join(', ')+')',ls);
   if(n9>cvCap(x))return res('UNCURED','corrected count '+n9+' counts a premise the seat ruled VOID ('+cvTxt(x)+' of '+x.L+'; a VOID premise counts for neither side, so the count is at most '+cvCap(x)+')',ls); // judge_fix7 J2
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,ls);const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT'); /* trim A3 */const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+n9+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),ls);
   return res('CURED','counted under ruling 372: '+x.side+' COUNT '+n9+', STANDING '+want+(named?'; restated count names '+need.join(', '):''),ls);}
  // judge_fix8 K5 (1) K-G11 (TRIAL; ruling 392 at the COLLISION POINTS): a LINK BROKEN line resting, as unanswered, only on verses under no
  // PRESSED WITH:. Cured by RETRACTED for the line (beside one CORRECTED RESULT, with its reason), by a RESTATED line not graded LINK BROKEN, or
  // by a RESTATED LINK BROKEN line naming, as left unanswered, a verse the list against that side carries under PRESSED WITH:.
  if(x.rule==='K-G11'||(x.rule==='K-P'&&x.premise==null)){ /* judge_fix9 S6: K-P on a BROKEN line */if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   if(rs.length){const P=new Set(x.pwk||[]);const un=pwUnans(rs[0].text).filter(k=>P.has(k));if(un.length)return res('CURED','restated LINK BROKEN on a pressed witness under PRESSED WITH: '+un.join(', '),[rs[0].line]);
    return res('UNCURED','the restated line still rests, as unanswered, on no verse a listed premise carries under PRESSED WITH (ruling 392)',[rs[0].line]);}
   return res('UNCURED','no RETRACTED or RESTATED line for '+x.link+'; it rests, as unanswered, only on '+(x.verses||[]).join(', ')+', under no PRESSED WITH (ruling 392)',null);}
  // judge_fix8 K6 K-V (TRIAL): a VOID ruling that quotes no charge words beyond the quote, or names no kind. Cured by a STATEMENT for the item
  // that does both (the charge read from the list in the rounds), or by a RESTATED count line for the side whose segment for the premise no longer
  // rules it VOID: SUPPORTED or NARROWED, or counted (UNEXHIBITED or CONCEDED) with a CORRECTED COUNT above the seat's count and the standing that
  // count makes true.
  if(x.rule==='K-V'){const CH=kvCharges(R,x.side);const UNI=kvUni(R,x.side);const st=stmtOf(x);
   if(st&&CH){const v=kvRulingOk(st,x.premise,CH,UNI);if(v.ok)return res('CURED','statement quotes the charge words ('+(v.q||v.why)+') and names the kind',['STATEMENT: '+st]);}
   const lab=x.side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';const rc=o.restated.filter(r=>r.link===lab);
   if(rc.length===1){const sg=kvSegments(lab+': '+rc[0].text,x.side).find(z=>z.ns.includes(x.premise));
    if(!sg){const T=rc[0].text;const re=new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+x.premise+'\\b[^.;]{0,160}','i');const m=T.match(re);const seg=m?m[0]:'';
     if(/\b(?:SUPPORTED|NARROWED|SPARED|STANDS)\b/i.test(seg)&&!/\b(?:UNEXHIBITED|CONCEDED)\b/.test(seg))return res('CURED','regraded in the restated count: '+seg.slice(0,120),[rc[0].line]);
     if(/\b(?:UNEXHIBITED|CONCEDED)\b/.test(seg)){const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const ls=[rc[0].line].concat(cs.map(c=>c.line),ss.map(s=>s.line));
      if(ns.length!==1||ns[0]<=(x.conc||0))return res('UNCURED','the restated count counts premise '+x.premise+' but no single CORRECTED COUNT above '+(x.conc||0)+' for '+x.side,ls);
      const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT'); /* trim A3: PROP-DEPENDENT or COLLAPSED is the judge's choice */const got=sv.length===1?sv[0]:(x.st||null);if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),ls);
      return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,ls);}
     return res('UNCURED','the restated count does not grade premise '+x.premise,[rc[0].line]);}
    const v=kvRulingOk(sg.seg,x.premise,CH,UNI);if(v.ok)return res('CURED','the restated VOID ruling quotes the charge words ('+(v.q||v.why)+') and names the kind',[rc[0].line]);
    return res('UNCURED','the restated count still rules premise '+x.premise+' VOID without the charge words and the kind',[rc[0].line]);}
   return res('UNCURED','no STATEMENT quoting the charge words and naming the kind, and no RESTATED '+lab+' line regrading premise '+x.premise,null);}
  // judge_fix8 K2 K-G10 (TRIAL; md_notes_rulings 392): the seat counted a premise UNEXHIBITED on a verse no listed premise carries under
  // PRESSED WITH:. Cured (a) by a STATEMENT for the item quoting the PRESSED WITH: line that carries the verse: a quotation that stands in a
  // PRESSED WITH: segment of the list against that side ([DR2] against the defender, [CR3] against the challenger, read from the rounds, or from
  // the item when the rounds are not to hand) and names the verse by book, chapter and verse; or (b) by a CORRECTED COUNT for the side that no
  // longer counts the side's K-G10 premises not cured by statement (at most the seat's count less their number), with the standing that count
  // makes true (SELF-SUPPORTED at 0 unless a link of that side stands graded BROKEN after the reply's retractions, PROP-DEPENDENT, or COLLAPSED when 2c > L).
  if(x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)){const pr=x.side==='DEFENDER'?'DR2':'CR3'; /* judge_fix9 S6: K-P on a count */
   const segs=y=>{const L=typeof pwList==='function'?pwList(R,y.side):null;return L&&L.some(p=>p.has)?L.filter(p=>p.has).map(p=>p.seg):(y.pw||[]).map(p=>p.seg);};
   const stated=y=>{const st=stmtOf(y);if(!st)return null;const qs=stmtQ(st);const S=segs(y);
    for(const v of (y.verses||[])){const K=ciKeys(v);const q=qs.find(q=>[...ciKeys(q)].some(k=>K.has(k))&&S.some(s=>cureFound(q,s)&&[...ciKeys(s)].some(k=>K.has(k))));if(!q)return null;}
    return st;};
   const st0=x.rule==='K-P'?null:stated(x);if(st0)return res('CURED','statement quotes the PRESSED WITH line ('+pr+') that carries '+(x.verses||[]).join(', '),['STATEMENT: '+st0]);
   const open=new Set(items.filter(y=>((y.rule==='K-G10'&&!stated(y))||(y.rule==='K-P'&&y.premise!=null))&&y.side===x.side).map(y=>y.premise));const cap=Math.max(0,(x.conc||0)-open.size);
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and no STATEMENT quoting the PRESSED WITH line ('+pr+') that carries '+(x.verses||[]).join(', ')+' (ruling 392: a verse pressed without a premise is not a witness)',lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]>cap)return res('UNCURED','corrected count '+ns[0]+' still counts '+(open.size>1?'premises':'premise')+' '+[...open].join(', ')+' on a verse no listed premise carries under PRESSED WITH (the count is at most '+cap+')',lines);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const brk=((broken||{})[x.side]||[]).filter(l=>!wd.has(U(l))).length>0; /* judge_fix8 K5: a line retracted in this reply is not BROKEN */const want=ns[0]===0?(brk?'PROP-DEPENDENT':'SELF-SUPPORTED'):((x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT');const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','recounted under ruling 392: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);}
  // judge_fix8 R11 K-LXX (TRIAL): a STATEMENT for the item naming the Septuagint reading with the round it names and words of that round quoted,
  // or one RESTATED CITATION CHECK line that names it.
  // judge_fix9 S1 K-F (TRIAL; ruling 396): cured by RETRACTED for the line (with one CORRECTED RESULT), by a RESTATED line not graded LINK
  // BROKEN, or by one FORCED line for the item whose three quotations stand in the rounds it names (MEANS in its round, ANSWER and FAILS in the
  // answer's round).
  if(x.rule==='K-F'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   const fl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i.test(l)&&U(l).replace(/\s+VS\.?\s+/g,' VS ').includes(U(x.link).replace(/\s+VS\s+/g,' VS ')));
   if(!fl.length)return res('UNCURED','no FORCED line for '+x.link+', no RETRACTED line and no RESTATED line regrading it',null);
   const chk=kfLines(fl[0],R);if(chk.items.length)return res('UNCURED','the FORCED line does not hold: '+chk.items[0].why,[fl[0]]);
   return res('CURED','the FORCED line quotes the MEANS sentence, the answer and the failing layer, each in the round it names',[fl[0]]);}
  // judge_fix9 S3 K-R (TRIAL; ruling 399): cured by one REFERENCE line for the press whose first quotation stands in the round the press names and
  // whose second is the press's MEANS sentence (CONFIRMED or NOT CONFIRMED, the seat's own call).
  if(x.rule==='K-R'){const key=String(x.key||'');
   const rl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\s*)?REFERENCE\s*:/i.test(l)&&ciKeys(l).has(key));
   if(!rl.length)return res('UNCURED','no REFERENCE line for '+key,null);const m=rl[0].replace(/[*_`]+/g,'').match(KR_LINE);
   if(!m)return res('UNCURED','the REFERENCE line is not in the form',[rl[0]]);const rk=m[2].toUpperCase();
   if(rk!==x.round)return res('UNCURED','the REFERENCE line names ['+rk+']; the press names ['+x.round+']',[rl[0]]);
   if(typeof R[rk]!=='string'||!ciFound(m[4],R[rk]))return res('UNCURED','its first quotation is not in ['+rk+']',[rl[0]]);
   if(!x.means||!ciFound(m[5],x.means))return res('UNCURED','its second quotation is not the press\'s MEANS sentence',[rl[0]]);
   return res('CURED','REFERENCE '+m[3].toUpperCase()+' with both meanings quoted',[rl[0]]);}
  // judge_fix9 S4 K-L2 (TRIAL): cured by RETRACTED for the line, or by one RESTATED line for it whose [L2] words each stand in a verse the line
  // cites (or that drops the [L2]).
  // ruling 421 (#1 K-W, #4 K-S3; TRIAL): the code checks the answer's form; the substance goes to the enforcer.
  if(x.rule==='K-W'){const rp=respOf(x)||'',sp=stmtOf(x)||''; /* pkgW (WALL-2024 2213): run 32973, chatgpt and sol wrote the form on the STATEMENT line and NOT HELD on the RESPONSE line */const kwSt=t=>/\bSTANDS\s+WITHOUT\s+IT\s+because\b/i.test(t)&&/\[L[1-3]\]/.test(t);const kwCo=t=>/(?:^|[.;!?]\s+|:\s+)\**CONCEDED\**(?!\s+LINKS?\b)\s*(?::|;|\.|--|\u2014|$)/.test(String(t)); /* pkgQ (WALL-2024 2224, 2226): CONCEDED is the uppercase form word at a sentence start (start of text, or after . ; ! ? :), then : ; . -- or the end; never conceded in prose, never CONCEDED LINKS */const kwRe=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|\u2014)?\s*["\u201c][^"\u201d]{6,}["\u201d]/i.test(t);for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t)continue;if(kwSt(t))return res('CURED','answered: the link stands without the withdrawn footing, on the layer named'+w,[t]);if(kwCo(t))return res('CURED','answered: the link is conceded'+w,[t]);if(kwRe(t))return res('CURED','answered: the withdrawn footing is reasserted in a later round, with its quote'+w,[t]);}if(KW_NH){const nw=s=>String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]+/g,' ').trim().split(' ').filter(Boolean);const q=String(x.line||'');const a=q.indexOf('"'),b=q.lastIndexOf('"');const fs0=a>=0&&b>a?q.slice(a+1,b):q;const body=nw(fs0.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,''));const __rn=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));const runs=__rn(body).concat(...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,''))))); /* pkgNHQ: the line's own runs, plus those of the full sentences from the round */for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t||!/^\s*NOT\s+HELD\b/i.test(t))continue;const T=' '+nw(t).join(' ')+' ';if(runs.some(r=>r&&T.includes(' '+r+' ')))return res('CURED','answered: NOT HELD, with a reason that quotes the flagged sentence (pkgKW)'+w,[t]);}}return res('UNCURED','neither the RESPONSE nor the STATEMENT line says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED, REASSERTED IN <round> "<quote>", or NOT HELD with a reason that quotes the flagged sentence',rp?[rp]:(sp?[sp]:null));}
  if(x.rule==='K-S3'){const rp=respOf(x)||'';if(/\bCOUNTED\b/.test(rp))return res('CURED','answered: the close concession is counted',[rp]);const m=rp.match(/\bTOUCHES\s+NO\s+LINK\b\s*:?\s*(.*)$/i);if(m&&m[1].split(/\s+/).filter(Boolean).length>=5)return res('CURED','answered: it touches no declared link or listed premise, with its reason',[rp]);
   {const sp=stmtOf(x)||'';const ms=sp.match(/\bTOUCHES\s+NO\s+LINK\b\s*:?\s*(.*)$/i);if(ms&&ms[1].split(/\s+/).filter(Boolean).length>=5)return res('CURED','answered on the STATEMENT line: it touches no declared link or listed premise, with its reason (pkgKS3)',['STATEMENT: '+sp].concat(rp?[rp]:[]));
    const mn=rp.match(/^\s*NOT\s+HELD\b\s*(?:as\b[^:]*)?:?\s*(.*)$/i);
    const fl=String(x.line||'').replace(/^\s*\w+\s+[CD]R\d+\s*:\s*/i,''),fq=fl.match(/^\s*"(.*?)"\s*--/),fw=krulNorm(fq?fq[1]:fl).split(' ').filter(Boolean),fn=Math.min(6,fw.length),RN=' '+krulNorm(rp)+' ';let quoted=false;for(let i=0;fn&&i+fn<=fw.length&&!quoted;i++)quoted=RN.includes(' '+fw.slice(i,i+fn).join(' ')+' ');
    /* pkgNHQ: also the full sentence from the round */if(!quoted)for(const __f of nhqFull(x.line,R)){const __w=krulNorm(__f).split(' ').filter(Boolean),__n=Math.min(6,__w.length);for(let i=0;__n&&i+__n<=__w.length&&!quoted;i++)quoted=RN.includes(' '+__w.slice(i,i+__n).join(' ')+' ');}
    if(mn&&mn[1].split(/\s+/).filter(Boolean).length>=5&&quoted)return res('CURED','answered NOT HELD with its reason, quoting the flagged sentence (6 words in a row, or all of it if shorter): the sentence is not a countable concession (pkgKS3)',[rp]);} /* pkgKS3 (a); W3: a NOT HELD quotes 6 words in a row of the flagged sentence, as K-CON */return res('UNCURED','the RESPONSE neither counts the close concession (COUNTED) nor says TOUCHES NO LINK: <why>',rp?[rp]:null);}
  if(x.rule==='K-L2'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(!rs.length)return res('UNCURED','no RESTATED or RETRACTED line for '+x.link,null);
   const L2D=l2Data();
   const k=L2D?kl2Lines(String(rs[0].line).replace(/^RESTATED\s*:\s*/i,''),L2D):{items:[]};if(k.items.length)return res('UNCURED','the restated line still carries an [L2] NOT COUNTED ('+k.items[0].why+')',[rs[0].line]);
   return res('CURED','restated: every [L2] of the line stands in a verse it cites, or none is left',[rs[0].line]);}
  if(x.rule==='K-LXX'){const st=stmtOf(x);const rx=/\bSeptuagint\b|\bLXX\b|\bGreek\s+Old\s+Testament\b/i;
   const rl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').find(l=>/^[\s*`]*RESTATED\s*:\s*CITATION CHECK\b/i.test(l)&&rx.test(l));
   if(rl)return res('CURED','the restated CITATION CHECK line names the Septuagint reading',[rl.trim()]);
   if(st&&rx.test(st)){const rk=(st.match(/\[(CR[1-4]|DR[1-4])\]/)||[])[1];const q=rk&&typeof R[rk]==='string'?stmtQ(st).find(q=>cureFound(q,R[rk])):null;
    if(q)return res('CURED','statement names the Septuagint reading and quotes ['+rk+']',['STATEMENT: '+st]);return res('UNCURED','the STATEMENT names the Septuagint reading but quotes no words of the round it names',['STATEMENT: '+st]);}
   return res('UNCURED','no STATEMENT naming the Septuagint reading with its round quoted, and no RESTATED CITATION CHECK line naming it',null);}
  // judge_fix5 G13 K-LB: counted (the K-G6 count, K-LB premises joined), or a statement that quotes the block's round and exhibits two layer kinds.
  // judge_fix6 H2 (run 32293, enforcer row 81: the single judge's premise 4 statement was refused as "no statement quoting [DR3] with two layer
  // kinds", though it quoted the block; the layer reader had read [L3] only): a refused statement names the step that refused it.
  if(x.rule==='K-LB'){const st=stmtOf(x);const rk=x.side==='CHALLENGER'?'DR3':'CR3';let step='step 1 (statement): no STATEMENT line for the item';
   const notC=/\bnot\s+counted\b|\bmark\s+is\s+wrong\b|\bshould\s+not\s+be\s+counted\b/i.test(String(respOf(x)||'')+' '+String(st||'')); /* judge_fix8 R4: the item's own answer, not another premise's count */
   if(st&&(notC||!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))){const k=lbFoot(lbBlockText(R[rk],x.premise),true); /* judge_fix8 R5: the block's own words, read by FOOTING LAYERS; the judge's tags and relabelling do not count */const qs=stmtQ(st);const hit=typeof R[rk]==='string'&&qs.some(q=>cureFound(q,R[rk]));
    if(k.length>=2&&hit)return res('CURED','statement quotes ['+rk+'] and the block, read by FOOTING LAYERS, exhibits '+k.join(' and '),['STATEMENT: '+st],k);
    step=!qs.length?'step 2 (quotation): the STATEMENT quotes no words in quotation marks':!hit?'step 2 (quotation): no quotation in the STATEMENT stands in ['+rk+']':'step 3 (layer kinds): the block, read by FOOTING LAYERS, exhibits '+(k.length?k.join(' and ')+' only':'no layer kind')+', fewer than two; a tag or relabelling in the STATEMENT does not change the block';
    if(notC)return res('UNCURED','the item\'s own answer says the premise is not counted, and the STATEMENT was refused at '+step,['STATEMENT: '+st],k);}
   else if(st)step='step 1 (statement): a CORRECTED COUNT was given, so the count is checked instead';
   return kCount(x,'the STATEMENT was refused at '+step);}
  if(x.rule==='K-G8')return kCount(x,'no other cure');
  // P2D v6a item 1b: K-S is cured by one RESTATED line for the link that names an answering round, or that grades it LINK BROKEN beside one CORRECTED RESULT.
  if(x.rule==='K-S'){const rs=cureRest(o,x);
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(/LINK BROKEN$/.test(rs[0].grade||'')){if(o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded LINK BROKEN',[rs[0].line,o.result[0].line]);}
   if(!DRV_ANS.test(rs[0].text))return res('UNCURED','the restated line names no round that answered the witness',[rs[0].line]);
   return res('CURED','regraded: answering round named',[rs[0].line]);}
  // BB-8327 D1: K-C is cured by one RESTATED line for the item that drops the stating ground and names the chain footing (two layer kinds); a regrade to LINK BROKEN needs one CORRECTED RESULT.
  // judge_fix7 J3 (run 32302, enforcer row 107: Sol retracted "D3 vs C3" under a counted RETRACTED line, restated it UNDERDETERMINED on a weighing
  // ground, and gave the chain footing ([L1] Matthew 1:25, [L2] synerchomai, [L3] Genesis 4:1) in its K-C STATEMENT; the check read the restated line
  // only, found no layer tag and left the item UNCURED): the grade the K-C item marked is withdrawn when the line is retracted (and, if restated, the
  // restated line drops the stating ground); otherwise the footing may stand in the item's STATEMENT, which must itself drop the stating ground.
  if(x.rule==='K-C'||x.rule==='K-S2'){const KEEP=x.rule==='K-S2'?ks2Keeps:netKeeps; /* judge_fix8 R6 */const rs=cureRest(o,x);
   if(!rs.length&&wd.has(U(x.link)))return res('CURED','retracted under a counted RETRACTED line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(KEEP(rs[0].text))return res('UNCURED','the restated line keeps the ground that a verse does not state the link',[rs[0].line]); // checker_fix FIX 1: masked as netLines masks
   const k=drvKinds(rs[0].text);if(k.length<2){const st=stmtOf(x);const sk=st&&!KEEP(st)?drvKinds(st):[];
    if(wd.has(U(x.link))&&!/LINK BROKEN$/.test(rs[0].grade||''))return res('CURED','retracted under a counted RETRACTED line and restated '+(rs[0].grade||'')+' without the stating ground',[rs[0].line].concat(st?['STATEMENT: '+st]:[]),sk.length?sk:k); // judge_fix7 J3
    if(sk.length>=2)return res('CURED','the restated line drops the stating ground; the chain footing is exhibited in the STATEMENT ('+sk.join(' and ')+')',[rs[0].line,'STATEMENT: '+st],sk); // judge_fix7 J3
    return res('UNCURED','the restated line names no chain footing: it exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(st?', and the STATEMENT '+(sk.length?'exhibits '+sk.length:'keeps the stating ground or exhibits fewer than two'):''),[rs[0].line],k);}
   if(/LINK BROKEN$/.test(rs[0].grade||'')&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line],k);
   return res('CURED',null,[rs[0].line],k);}
  // judge_fix2 E1, E4: K-N and K-K are cured by one RESTATED line for the item that its own test no longer marks (judge_fix4 F2: K-DG8 removed).
  if(x.rule==='K-N'||x.rule==='K-K'){const rs=cureRest(o,x);const test=x.rule==='K-N'?knLines:kkLines;
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const txt=/^D\d+/i.test(x.link)?rs[0].text:x.link+': '+rs[0].text;
   if(test(txt).length)return res('UNCURED','the restated line keeps what '+x.rule+' marks',[rs[0].line]);
   return res('CURED','restated',[rs[0].line]);}
  // judge_fix2 E2: K-SC is cured by a RESTATED line for the link that is not STANDS, by a RESTATED CONCEDED LINKS line that no longer counts the
  // premise, or by a STATEMENT that names a round and quotes words found in that round.
  if(x.rule==='K-SC'){const rs=cureRest(o,x);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&rs[0].grade!=='STANDS'){if(/LINK BROKEN$/.test(rs[0].grade)&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded '+rs[0].grade,[rs[0].line]);}
   const rc=o.restated.filter(r=>r.link==='CONCEDED LINKS');if(x.premise!=null&&rc.length===1&&!cntItems('CONCEDED LINKS: '+rc[0].text).some(i=>i.link===x.premise&&(i.tag==='UNEXHIBITED'||(i.tag==='CONCEDED'&&!knNarrow(i)))))return res('CURED','the restated count no longer counts premise '+x.premise,[rc[0].line]);
   const st=stmtOf(x);if(st){const rk=['CR1','CR2','CR3','CR4','DR1','DR2','DR3'].find(k=>new RegExp('\['+k+'\]').test(st)&&typeof R[k]==='string'&&stmtQ(st).some(q=>cureFound(q,R[k])));if(rk)return res('CURED','statement names '+rk+' and quotes it',['STATEMENT: '+st]);}
   return res('UNCURED',rs.length?'the restated line still grades '+x.link+' STANDS, and no statement names a round and quotes it':'no regrade, no restated count and no statement naming a round and quoting it, for '+x.link,rs.length?[rs[0].line]:null);}
  {const ag=kagCure(x,reply&&reply.ok?reply.text:'',respOf(x));if(ag)return res(ag.st,ag.why,ag.line?[ag.line]:null);} // K-AG (TRIAL; W3 2279, 2283)
  {const kk=kkjvCure(x,reply&&reply.ok?reply.text:'');if(kk)return res(kk.st,kk.why,kk.line?[kk.line]:null);} // K-KJV (TRIAL; Commitment 12)
  {const kr=krulCure(x,reply&&reply.ok?reply.text:'',R,x.rule==='K-CMTL'?(respOf(x)+'\n'+(stmtOf(x)||'')):(x.rule==='K-CMT'?(respOf(x)?respOf(x)+'\n'+(stmtOf(x)||(items.filter(y=>y&&y.rule==='K-CMT').length===1?(o.statement.find(s=>{const L=NZ(s.label);return L==='K-CMT'||L.startsWith('K-CMT ');})||{}).text:'')||''):null):null)) /* pkgKCMT (a): the STATEMENT line too, once a RESPONSE is written */;if(kr)return res(kr.st,kr.why,kr.line?[kr.line]:null);} // K-CON, K-CMT, K-RUL (TRIAL; form only; WALL-2024 reply 2150)
  return res('UNCURED','unknown rule',null);}).concat(krulRestated(items,reply,R))); /* pkgKCMF */ // R7 (W3, reply 2157): RESTATED lines of the cure reply need a card
}
// BB-7330 (option 2, the operator's "2" at 14:51 CDT): where a RETRACTED line cured an item, the seat is counted on its one CORRECTED RESULT.
function cureCorrected(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');if(o.result.length!==1)return null;
 if(!(v||[]).some(x=>x.status==='CURED'&&/^(?:retracted|regraded LINK BROKEN)/.test(x.why||'')))return null;const rsn=cureReasoned(o,(v||[]).map(x=>x.line));return {tag:o.result[0].tag,word:o.result[0].word,links:[...new Set(o.withdrawn.filter(w=>rsn.has(String(w.link).toUpperCase())).map(w=>w.link))]};}
// THE DEBATE FIXED (BB-7397, DoD 5, BB-7406): a cure's CORRECTED STANDING and CORRECTED COUNT for a side with a CURED count or standing item
// (K-G1, K-G3, K-G6, K-G7) are written to the row's columns; the original is kept in the judge's text by an AUDIT line.
function cureSet(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');const out={};
 // BB-7417 defect 3: a side is written only when every count or standing item of that side is CURED, and not when each is a K-G6
 // statement cure (no count was checked).
 for(const side of ['DEFENDER','CHALLENGER']){const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)||(x.rule==='K-V'&&x.status==='CURED'&&/^counted/.test(String(x.why||'')))||x.rule==='K-LB'));
  if(!ks.length||ks.some(x=>x.status!=='CURED')||ks.every(x=>((x.rule==='K-G6'||x.rule==='K-LB')&&/^statement/.test(String(x.why||'')))||(x.rule==='K-G9'&&/^every listed verse ruled/.test(String(x.why||'')))||(x.rule==='K-G10'&&/^statement/.test(String(x.why||'')))||(x.rule==='K-V'&&!/^counted/.test(String(x.why||'')))) /* judge_fix8 K2, K6 */)continue;
  const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];const sv=[...new Set(o.standing.filter(s=>s.side===side).map(s=>s.st))];
  if(ns.length===1||sv.length===1)out[side]={n:ns.length===1?ns[0]:null,st:sv.length===1?sv[0]:null};}
 return Object.keys(out).length?out:null;}
function cureSetApply(p,cs,seat){const F={DEFENDER:['defense_standing','conceded_links'],CHALLENGER:['challenge_standing','challenger_conceded_links']};const lines=[];
 for(const side of Object.keys(cs||{})){const fs=F[side][0],fn=F[side][1],c=cs[side];const was=(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn]);
  if(c.st)p[fs]=c.st;if(c.n!=null)p[fn]=c.n;
  lines.push('[AUDIT v21: CORRECTED STANDING -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; ORIGINAL: '+was+'; COUNTED: '+(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn])+']');}
 return lines;}
// THE DEBATE FIXED rev 7, DoD 10 record half (ruled BB-7508 (i)): BB-7417 defect 3 stands, so a side whose count or standing items are not
// all CURED is not written; when the reply holds one CORRECTED COUNT for that side, one AUDIT line records the count and the items not cured.
function cureCountHeld(reply,v,cs,seat){const o=cureLines(reply&&reply.ok?reply.text:'');const lines=[];
 for(const side of ['DEFENDER','CHALLENGER']){if(cs&&cs[side])continue;const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];if(ns.length!==1)continue;
  const nc=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)||x.rule==='K-LB')&&x.status!=='CURED');if(!nc.length)continue;
  lines.push('[AUDIT v21: CORRECTED COUNT NOT WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; CORRECTED COUNT: '+ns[0]+'; NOT CURED: '+cureSafe(nc.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; written only when every count or standing item of the side is CURED (BB-7417)]');}
 return lines;}
function cureSupHead(raw,o,n){let s=String(raw||'');const H=/SUPERSEDED BY CURE: verdict [A-Z-]+ to [A-Z-]+; see the cure lines below(?:\\n|\n)/;const enc=x=>JSON.stringify(String(x)).slice(1,-1);const hd=(o&&n&&o!==n)?'SUPERSEDED BY CURE: verdict '+o+' to '+n+'; see the cure lines below':null;const t=s.trimStart();if(t[0]==='{'){const a=s.indexOf('{');const b=rcObjEnd(s,a);if(b<0)return s;let j=s.slice(a,b).replace(H,'');if(hd)j=j.replace(/("reasoning"\s*:\s*")/,m=>m+enc(hd+'\n'));return s.slice(0,a)+j+s.slice(b);}s=s.replace(H,'');return hd?hd+'\n'+s:s;} // WALL-2134 Part 2c (W2; W3 2177)
const cureCorrLine=(seat,orig,c)=>'[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+orig+'; COUNTED: '+c.word+' ('+c.tag+'); RETRACTED: '+c.links.join(', ')+']';
const cureSafe=s=>String(s).replace(/\[/g,'(').replace(/\]/g,')').replace(/;(\s*(?:SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT):)/g,',$1');
// judge_fix4 F1 (run 32266: DeepSeek retracted "D6 vs C4 (Matthew 1:25): CHALLENGER LINK BROKEN", the only ground of its CHALLENGE STANDING
// PROP-DEPENDENT and its RESULT DEFENDER WINS, and neither was recomputed; GLM likewise). After a cure that retracts or regrades a collision line,
// or corrects a count, the seat's counts, standings, verdict and RESULT are recomputed from the cured lines by the rulebook's own definitions
// (engine_manual v85 section 8): STANDINGS (SELF-SUPPORTED requires a count of 0; PROP-DEPENDENT at 1 or more, or while a link of that side is
// graded BROKEN (K-G3); COLLAPSED when 2c > L), VERDICT DEFINITIONS (first match: BROKEN-1 k >= 1; BROKEN-2 2w > n or the keystone WITHDRAWN;
// PARTIAL-1 w >= 1; PARTIAL-2 DEFENSE STANDING COLLAPSED; HELD-1), RESULT (BROKEN gives CHALLENGER WINS; HELD gives DEFENDER WINS only if the
// challenge is not SELF-SUPPORTED or a collision stands graded CHALLENGER LINK BROKEN; every other case UNDERDETERMINED). The values are written
// to the seat's fields and its stored text (the RESULT, STANDING, count, CLAUSE and retracted or regraded collision lines are replaced); the
// original values and lines stay in one AUDIT line. Applied before the panel outcome is derived; the single judge's record too.
function rcObjEnd(t,a){let d=0,q=false;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return i+1;}return -1;}
// The judgment's own text: a panel row's "reasoning" (the JSON object that opens the row), or the single judge's text before its AUDIT lines.
function cureJText(raw,panel){const s=String(raw||'');if(!panel){const i=s.indexOf('\n\n[AUDIT');return i<0?s:s.slice(0,i);}
 const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){try{const o=JSON.parse(s.slice(a,b));if(o&&typeof o.reasoning==='string')return o.reasoning;if(o&&typeof o.reason==='string')return o.reason;}catch(e){}
  /* ruling 421 (run 32661, Gemini): a malformed object (an unescaped quote in a judge's line) still carries its reasoning; read it out and unescape it, so its lines split */
  const m=s.slice(a,b).match(/"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}\s*$/);if(m)return m[1].replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\\\\/g,'\\');}return cureUnwrap(s);}
function rcLines(text){const out={col:[],clause:null,key:null,result:null,st:{},cn:{},wdn:0};
 for(const raw of String(text||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const u=l.toUpperCase();if(!l)continue;
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(m){const r=__RL.readLine(raw);const ok=r.form==='COLLISION'&&!(r.f&&r.f.restated);out.col.push(ok?{link:m[1]+' vs '+m[2],grade:r.f.grade,raw}:{link:m[1]+' vs '+m[2],grade:null,raw,unread:r.detail||r.code||'NO_LINE_FORM'});continue;} /* pkgRC (W3 spec 10): the shared reader; STANDS and WITHDRAWN are read; a refused line has grade null and never counts as not broken */
  if(/^(?:[-•]|\d+[.)])?\s*D\d+\s*:?\s*(?:--|—|-|:)?\s*WITHDRAWN\b/.test(u))out.wdn++;
  if(/^CLAUSE\s*:/.test(u)){if(!out.clause)out.clause={raw,u};continue;}if(/^KEYSTONE\s*:/.test(u)){if(!out.key)out.key={raw,u};continue;}if(/^RESULT\s*:/.test(u)){if(!out.result)out.result={raw,u};continue;}
  const s=u.match(/^(DEFENSE|CHALLENGE) STANDING\s*:/);if(s){if(!out.st[s[1]])out.st[s[1]]={raw,u};continue;}
  const c=u.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/);if(c&&!out.cn[c[1]])out.cn[c[1]]={raw,u};}
 out.col=out.col.filter(z=>z.grade||!out.col.some(y=>y.grade&&y.link===z.link)); /* pkgRC, spec 14: a note on a pair with a read collision line is skipped */
 return out;}
const rcOne=s=>String(s||'').replace(/\s+/g,' ').trim();
const rcCut=s=>{s=rcOne(s);return s.length>300?s.slice(0,297)+'...':s;};
// F: the seat's current fields {verdict_tag, defense_standing, conceded_links, challenge_standing, challenger_conceded_links}. Returns null when
// the cure retracted, regraded or recounted nothing; else the recomputed fields, RESULT word, CLAUSE tag, line replacements and the AUDIT line.
function cureRecompute(seat,text,F,items,v,reply){const o=cureLines(reply&&reply.ok?reply.text:'');const U=s=>String(s==null?'':s).toUpperCase();const P=rcLines(text);
 const rsn=cureReasoned(o,(items||[]).map(x=>x.line));const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))):[];
 const trig=[];const rp=[];const same=[];const col=P.col.map(c=>({...c}));const done=new Set();
 for(const w of wd){const c=col.find(z=>U(z.link)===U(w.link));if(!c||done.has(U(c.link)))continue;done.add(U(c.link));
  const rs=o.restated.find(r=>U(r.link)===U(w.link)&&r.grade&&!/LINK BROKEN$/.test(r.grade));const g=rs?rs.grade:(w.regrade||'UNDERDETERMINED');
  const nl=rs?rs.text:(w.link+((c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]?' '+(c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]:'')+': '+g+' -- retracted in the cure'+(w.reason?' -- '+w.reason:''));
  trig.push('RETRACTED '+w.link+' ('+(c.grade||'?')+' to '+g+')');c.grade=g;rp.push([c.raw,nl,'RETRACTED '+w.link]);}
 for(const x of (v||[]).filter(y=>y.status==='CURED'&&/^D\d+ vs C\d+$/i.test(String(y.link||'')))){const c=col.find(z=>U(z.link)===U(x.link));if(!c||done.has(U(c.link)))continue;
  const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length!==1||!rs[0].grade||rs[0].grade==='STANDS')continue;
  if(rs[0].grade===c.grade){done.add(U(c.link));same.push([c.raw,rs[0].text]);continue;} /* judge_fix8 R4: same grade, the restated line written in place */done.add(U(c.link));
  trig.push('RESTATED '+x.link+' ('+(c.grade||'?')+' to '+rs[0].grade+')');c.grade=rs[0].grade;rp.push([c.raw,rs[0].text,'RESTATED '+x.link]);}
 const cs=cureSet(reply,v);const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnew={};
 for(const sd of ['DEFENDER','CHALLENGER']){let n=null,from=null;
  const rc=o.restated.filter(r=>r.link===lab[sd]);const ok=(v||[]).some(x=>x.status==='CURED'&&(U(x.link)===lab[sd]||(x.rule==='K-SC'&&/restated count/.test(String(x.why||'')))||(x.rule==='K-G9'&&x.side===sd&&/restated count names/.test(String(x.why||'')))));
  if(rc.length===1&&ok){const lead=rc[0].text.match(/^\s*(\d+)\b/);n=lead?+lead[1]:new Set(cntItems(lab[sd]+': '+rc[0].text).filter(i=>i.tag==='CONCEDED'||i.tag==='UNEXHIBITED').map(i=>i.n)).size;from=rc[0].text;}
  if(cs&&cs[sd]&&cs[sd].n!=null){n=cs[sd].n;from=null;trig.push('CORRECTED COUNT '+sd+' '+n);} /* a cured CORRECTED COUNT is a trigger even when already written to the fields */
  if(n!=null&&n!==cnt[sd]){trig.push('COUNT '+sd+' '+cnt[sd]+' to '+n);cnew[sd]={n,from};}}
 // ruling 421 (KB-0030, "A tie is not a HELD"): no collision line graded BROKEN for either side, the standings equal and the counts equal, and a RESULT that names a winner: the RESULT is UNDERDETERMINED.
 const __r0421=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const __tie421=(cl,a1,a2,n1,n2,r)=>!cl.some(z=>!z.grade)&&!cl.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&a1===a2&&n1===n2&&(r==='DEFENDER WINS'||r==='CHALLENGER WINS'); /* KB-0030: no collision broken either way (none written counts too: run 32661 Gemini wrote only "Dn: STANDS"), equal standings, equal counts */
 if(!trig.length&&__tie421(col,F.defense_standing,F.challenge_standing,F.conceded_links,F.challenger_conceded_links,__r0421))trig.push('TIE (KB-0030)');
 if(!trig.length){if(!same.length)return null; /* judge_fix8 R4: only restated lines of the same grade: written in place, the fields unchanged */
  return {fields:{verdict_tag:F.verdict_tag,defense_standing:F.defense_standing,conceded_links:F.conceded_links,challenge_standing:F.challenge_standing,challenger_conceded_links:F.challenger_conceded_links},result:null,result0:null,tag:null,trig:[],rp:same,retracted:[],
   audit:'[AUDIT v27: RESTATED LINES WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+same.length+' collision line(s) restated in the cure with the same grade are written in place of the originals; the fields are unchanged]'};}
 rp.push(...same);
 const c={DEFENDER:cnew.DEFENDER?cnew.DEFENDER.n:cnt.DEFENDER,CHALLENGER:cnew.CHALLENGER?cnew.CHALLENGER.n:cnt.CHALLENGER};
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};const unk=col.filter(z=>!z.grade);if(unk.length)trig.push('UNREAD '+unk.map(z=>z.link+' ('+z.unread+')').join(', ')); /* pkgRC */
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const L=Lof(k),n=c[sd];if(typeof n!=='number')return orig;
  if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk.length?orig:'SELF-SUPPORTED'; /* trim A3: the judge's own standing is kept; a side with a counted or broken link is not SELF-SUPPORTED */};
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const held=k<1&&unk.length>0;const tag=held?'UNREAD':k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=held?(F.verdict_tag||null):tag.split('-')[0]; /* pkgRC: held = no broken line read and one unread, so nothing is derived */
 const res=held?(P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null):(__x=>{if(__tie421(col,dst,cst,c.DEFENDER,c.CHALLENGER,__x)){if(trig.indexOf('TIE (KB-0030)')<0)trig.push('TIE (KB-0030)');return 'UNDERDETERMINED';}return __x;})(word==='BROKEN'?'CHALLENGER WINS':(()=>{const r0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;return (r0&&r0!=='CHALLENGER WINS')?r0:'UNDERDETERMINED';})()); /* ruling 421: the tie rule */ /* trim A2: the judge's own RESULT is kept unless the cure leaves BROKEN or its CHALLENGER WINS no longer has a BROKEN verdict */
 const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const why='recomputed after the cure from the cured lines ('+trig.join('; ')+')';
 if(P.result&&res!==res0)rp.push([P.result.raw,'RESULT: '+res+' -- '+why+': '+tag+', CHALLENGE STANDING '+cst+', '+(brk.CHALLENGER?brk.CHALLENGER+' collision line(s) stand graded CHALLENGER LINK BROKEN':'no collision line stands graded CHALLENGER LINK BROKEN')+'.']);
 for(const [sd,k2,st,st0] of [['DEFENDER','DEFENSE',dst,F.defense_standing],['CHALLENGER','CHALLENGE',cst,F.challenge_standing]]){const x=P.st[k2];
  const tv=x?(x.u.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1]:null,tc=x?(x.u.match(/\bC\s*=\s*(\d+)/)||[])[1]:null; /* judge_fix8 R4: the line as the judge wrote it, not only the fields (run 32306 GLM) */
  if(x&&(st!==st0||c[sd]!==cnt[sd]||(tv&&tv!==st)||(tc!=null&&+tc!==c[sd])))rp.push([x.raw,k2+' STANDING: '+st+' -- L='+(Lof(k2)!=null?Lof(k2):'?')+' c='+c[sd]+' -- '+why+'.']);
  const y=P.cn[lab[sd]];const yc=y?(y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/)||[])[1]:null;if(y&&(cnew[sd]||(yc!=null&&+yc!==c[sd])))rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd]&&cnew[sd].from?' -- '+cnew[sd].from.replace(/^\s*\d+\s*(?:--|—|-|:)?\s*/,''):'')+'.']);}
 if(!held&&P.clause&&!new RegExp('^CLAUSE\\s*:\\s*'+tag+'\\b').test(P.clause.u))rp.push([P.clause.raw,P.clause.raw.replace(/^(\s*[*_]*CLAUSE[*_]*\s*:\s*[*_]*)(?:[A-Z]+-\d)?/i,'$1'+tag+' ').replace(/\bk\s*=\s*\d+/i,'k='+k)]);
 const fields={verdict_tag:word,defense_standing:dst,conceded_links:c.DEFENDER,challenge_standing:cst,challenger_conceded_links:c.CHALLENGER};
 const f=(t,d,dc,s2,cc,r)=>t+', DEFENSE '+d+' '+dc+', CHALLENGE '+s2+' '+cc+', RESULT '+(r||'none');
 const audit='[AUDIT v25: RECOMPUTED AFTER CURE -- '+(seat?'SEAT: '+seat+'; ':'')+'TRIGGER: '+cureSafe(trig.join(', '))+'; ORIGINAL: '+f(F.verdict_tag,F.defense_standing,F.conceded_links,F.challenge_standing,F.challenger_conceded_links,res0)
  +'; RECOMPUTED: '+f(word+' ('+tag+')',dst,c.DEFENDER,cst,c.CHALLENGER,res)+'; RULE: engine_manual v85 section 8, STANDINGS, RESULT and VERDICT DEFINITIONS'
  +(rp.length?'; ORIGINAL LINES: '+cureSafe(rp.map(r=>rcCut(r[0])).join(' / ')).replace(/\bRESULT\s*:/g,'RESULT --').replace(/\{/g,'(').replace(/\}/g,')'):'')+']';
 // ruling 421 (B6; A3 run 32643: Grok's cure counted a premise and counted_premises kept [6]): each premise an item cured by counting names joins that side's
 // counted_premises; cureRewrite writes the set into the panel row's JSON.
 // A3 on run 32643: a premise the judge itself ruled VOID counts for neither side; it is never added, and the count that included it is named.
 const __cpVoid=(sd,n)=>{const L=[P.cn[lab[sd]],P.st[sd==='DEFENDER'?'DEFENSE':'CHALLENGE']].filter(Boolean).map(z=>z.u).join(' ');return new RegExp('PREMISE\\s+'+n+'\\b[^;.]{0,60}?\\bVOID\\b').test(L);};const __cpSkip=[];
 const __cpAdd={DEFENDER:[],CHALLENGER:[]};(v||[]).forEach(x=>{if(x&&x.status==='CURED'&&/^counted\b/.test(String(x.why||''))&&__cpAdd[x.side]&&Number.isInteger(x.premise)&&x.premise>=1&&__cpAdd[x.side].indexOf(x.premise)<0){if(__cpVoid(x.side,x.premise)){__cpSkip.push(x.side+' '+x.premise);return;}__cpAdd[x.side].push(x.premise);}});
 const __cpT=['DEFENDER','CHALLENGER'].filter(sd=>__cpAdd[sd].length).map(sd=>sd+' '+__cpAdd[sd].join(', ')).join('; ')+(__cpSkip.length?' NOT ADDED, the judge ruled it VOID, so the count that includes it counts a void premise: '+__cpSkip.join(', '):'');
 return {fields,result:res,result0:res0,tag,trig,rp,audit:__cpT?audit.replace(/\]$/,'; COUNTED PREMISES (B6): '+__cpT+']'):audit,retracted:wd.map(x=>x.link),cpAdd:__cpAdd};}
// The recomputed lines and fields written into the stored text: in a panel row, inside its JSON object (each line JSON-encoded in place, else the
// object re-serialized) with its typed fields; in the single judge's text, before its AUDIT lines. The AUDIT line is appended. When the verdict word
// changes, a CORRECTED RESULT line in the form derive_debate_outcome reads (judgment_result_word) is put first after the object.
function cureRewrite(raw,panel,R,seat,F0){let s=String(raw||'');const enc=x=>JSON.stringify(String(x)).slice(1,-1);
 if(panel){const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){let j=s.slice(a,b);let miss=false;
   for(const [o0,n0] of R.rp){const e=enc(o0);if(j.includes(e))j=j.replace(e,()=>enc(n0));else miss=true;}
   if(miss){try{const ob=JSON.parse(j);let t=typeof ob.reasoning==='string'?ob.reasoning:'';for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);ob.reasoning=t;j=JSON.stringify(ob,null,2);}catch(e){}}
   const F=R.fields;j=j.replace(/("verdict_tag"\s*:\s*")[A-Z]+(")/,'$1'+F.verdict_tag+'$2').replace(/("defense_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.defense_standing+'$2').replace(/("challenge_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.challenge_standing+'$2')
    .replace(/("conceded_links"\s*:\s*)\d+/,'$1'+F.conceded_links).replace(/("challenger_conceded_links"\s*:\s*)\d+/,'$1'+F.challenger_conceded_links);
   if(R.cpAdd)for(const [sd,key] of [['DEFENDER','counted_premises_defender'],['CHALLENGER','counted_premises_challenger']]){const add=R.cpAdd[sd]||[];if(!add.length)continue; /* ruling 421 (B6) */
    const rx=new RegExp('("'+key+'"\\s*:\\s*)\\[([^\\]]*)\\]');const m=j.match(rx);if(!m)continue;const cur=(m[2].match(/\d+/g)||[]).map(Number);const nu=[...new Set(cur.concat(add))].sort((a,b)=>a-b);if(nu.length!==cur.length)j=j.replace(rx,(_,h)=>h+'['+nu.join(',')+']');}
   const cr=(F0&&F0.verdict_tag&&F0.verdict_tag!==F.verdict_tag)?'\n[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+F0.verdict_tag+'; COUNTED: '+F.verdict_tag+' ('+R.tag+'); RETRACTED: '+R.retracted.join(', ')+']':'';
   s=s.slice(0,a)+j+cr+s.slice(b);}}
 else{const i=s.indexOf('\n\n[AUDIT');let t=i<0?s:s.slice(0,i);const rest=i<0?'':s.slice(i);for(const [o0,n0] of R.rp)t=t.replace(o0,()=>n0);s=t+rest;}
 const lab=l=>{const u=rcOne(l).replace(/[*_`]+/g,'').replace(/^(?:[-•]|\d+[.)])?\s*/,'').toUpperCase();const m=u.match(/^(D\d+\s+VS\.?\s+C\d+|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|RESULT|CLAUSE|KEYSTONE)\b/);return m?m[1].replace(/\s+VS\.?\s+/,' VS '):'LINE';};
 const sup=(R.rp||[]).map(([o0,n0])=>'\n[AUDIT v27: SUPERSEDED LINE -- '+(seat?'SEAT: '+seat+'; ':'')+'LABEL: '+lab(n0)+'; ORIGINAL: '+cureSafe(rcOne(o0)).replace(/;\s*END\]/g,', END')+' ; END]').join(''); /* judge_fix8 R4 */
 let rk='';try{const H=rechk2024(R.rp,rechkRounds2024(seat));rk=H.map(h=>'\n[AUDIT v39: K-RECHK -- '+(seat?'SEAT: '+seat+'; ':'')+'CHANGE: '+String(h.id||'change').replace(/;/g,',')+'; RULE: '+h.rule+'; '+(h.old===null?'NOT CHECKED':(h.old?'ALREADY IN THE ORIGINAL':'NEW'))+': '+h.why+'; LINE: '+cureSafe(h.line).slice(0,300)+'; ORIGINAL: '+cureSafe(h.orig).slice(0,300)+'; TRIAL rule, record-only ; END]').join('');}catch(e){rk='\n[AUDIT v39: K-RECHK -- the re-check failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';}
 return s+'\n'+R.audit+sup+rk;} /* pkgRCK: K-RECHK marks after the SUPERSEDED marks */
// Report line (step 6, 6904 e): fixed fields in fixed order, read back by Format Markdown. SEAT (panel only), ITEM, RULE, RESULT, then
// KINDS, WHY, LINE (the judge's original line, cut at 300 characters with "...") and STATEMENT when present; judge text has its brackets made round and any "; KEY:" broken.
// BB-7397 rev 9 DoD 24: STATEMENT and JUDGE STATEMENT above 600 characters are cut at the last space at or before 597, with "...".
function cureCut(s){s=String(s);if(s.length<=600)return s;const k=s.lastIndexOf(' ',597);return s.slice(0,k>0?k:597).replace(/\s+$/,'')+'...';}
// judge_fix2 W2: one row per flagged item for debate_enforcer_log, in full: the cure prompt sent (the last user message of the cure body), the
// full reply, the RESPONSE line, the result and its reason. The audit-line excerpt (cureReport) is kept as it was.
function enfPrompt(body){try{if(body&&Array.isArray(body.messages)){const u=body.messages.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].content:null;return typeof c==='string'?c:JSON.stringify(c);}
 if(body&&Array.isArray(body.contents)){const u=body.contents.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].parts:null;return Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):null;}}catch(e){}return null;}
function enfRows(meta,v,reply,body){const T=new Date().toISOString();const ps=enfPrompt(body);const full=reply&&reply.ok?String(reply.text==null?'':reply.text):null;
 return (v||[]).map(x=>({run_token:meta.run_token||null,seat:meta.seat||null,seat_role:meta.role||null,judge_model:meta.model||null,kind:'cure',rule:x.rule,item:x.rule==='K-G3'?x.side+' STANDING':(x.link||null),
  flagged_line:x.line||null,prompt_sent:ps,full_reply:full,reply_error:reply&&!reply.ok?String(reply.why||'no reply'):(reply?null:'no reply'),response_line:x.response||null,cure_status:x.status,cure_reason:enfTrialWhy(x,x.why)||null,at:T}));} // judge_fix6 H8
function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?'SEAT: '+seat+'; ':'')+'ITEM: '+(x.rule==='K-G3'?x.side+' STANDING':x.link)+'; RULE: '+x.rule+'; RESULT: '+x.status+(x.rule==='K-C'&&x.status!=='CURED'?'; NOT COUNTED (K-C UNCURED)':'')
 +(x.kinds&&x.kinds.length?'; KINDS: '+x.kinds.join(', '):'')+((x.why||!enfLive(x))?'; WHY: '+cureSafe(enfTrialWhy(x,x.why)):'')+(x.line?'; LINE: '+cureSafe((l=>l.length>300?l.slice(0,297)+'...':l)(String(x.line).replace(/\s+/g,' ').trim())):'')
 +(x.statement?'; STATEMENT: '+cureSafe(cureCut(x.statement)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(cureCut(x.judge_statement)):'none written')+']');}
// The prose of the reply, recorded once and never read for a cure (BB-6952). Empty when the reply has no prose or the call failed.
function cureProse(seat,reply){const p=reply&&reply.ok?cureLines(reply.text).prose.join(' ').replace(/\s+/g,' ').trim():'';
 return p?['[AUDIT v21: DEBATE RULE VIOLATION REPLY -- '+(seat?seat+' ':'')+'prose recorded, not read for a cure: '+cureSafe(p.slice(0,600))+']']:[];}

const base=$('Extract Independent Verdict').first().json;let rs=[];try{if($('Cure Normalize').isExecuted)rs=$('Cure Normalize').all().map(x=>x.json);}catch(e){rs=[];}
const all=base.debate_rule_violations||[];if(!all.length)return [{json:{...base,debate_rule_report:[]}}];
const r=rs[0]||null;const v=cureVerdicts(all,r?r.reply:{ok:false,why:'no cure call was made'},r&&r.cure?r.cure.broken:null,r&&r.cure?r.cure.rounds:null);
const __drvU=enfUncured(v);const __sil=v.filter(x=>x&&x.status!=='CURED'&&enfSilent(x)); /* WALL-2024 silence count, single judge (W3 2192) */
const __silL=__sil.length?['[AUDIT v35: SINGLE JUDGE SILENCE COUNT -- drv_uncured '+__drvU+'; NO WRITTEN RESPONSE on '+__sil.length+' item'+(__sil.length===1?'':'s')+': '+cureSafe(__sil.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; the single judge has no alternate, so no seat is removed and no verdict changes. REVIEW THIS ROW.]']:[];
const cc=cureCorrected(r?r.reply:null,v);
const cs=cureSet(r?r.reply:null,v);const B2={defense_standing:base.defense_standing,conceded_links:base.conceded_links,challenge_standing:base.challenge_standing,challenger_conceded_links:base.challenger_conceded_links};const csl=cs?cureSetApply(B2,cs,null):[];
const enforcer_log=enfRows({run_token:$('Init Seats').first().json.run_token,seat:'single',role:'single',model:(r&&r.cure&&r.cure.model)||base.judge_model||null},v,r?r.reply:null,r&&r.cure?r.cure.body:null); // judge_fix2 W2
// judge_fix4 F1: the single judge's record is recomputed from its cured lines too (its text, verdict, standings and counts; it moves no panel verdict).
const F0={verdict_tag:cc?cc.word:base.verdict_tag,defense_standing:cs?B2.defense_standing:base.defense_standing,conceded_links:cs?B2.conceded_links:base.conceded_links,challenge_standing:cs?B2.challenge_standing:base.challenge_standing,challenger_conceded_links:cs?B2.challenger_conceded_links:base.challenger_conceded_links};
const RC=cureRecompute(null,cureJText(base.independent_verdict_raw,false),F0,all,v,r?r.reply:null);
const RAW0=RC?cureRewrite(base.independent_verdict_raw,false,{...RC,audit:''},null,null).replace(/\n$/,''):base.independent_verdict_raw;
return [{json:{...base,enforcer_log,...(cc?{verdict_tag:cc.word}:{}),...(cs?B2:{}),...(RC?RC.fields:{}),recomputed:RC?{trigger:RC.trig,fields:RC.fields,result:RC.result}:null,independent_verdict_raw:cureSupHead(RAW0+'\n\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).concat(csl).concat(cureCountHeld(r?r.reply:null,v,cs,null)).concat(RC?[RC.audit]:[]).concat(__silL).join('\n'),base.verdict_tag,RC&&RC.fields&&RC.fields.verdict_tag?RC.fields.verdict_tag:(cc?cc.word:base.verdict_tag)), /* WALL-2134 Part 2c */drv_uncured:__drvU,debate_rule_report:v.map(x=>({rule:x.rule,side:x.side,link:x.link,status:x.status,kinds:x.kinds,why:x.why,statement:x.statement}))}}];
