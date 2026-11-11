const PRS=(()=>{
 const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
 const REF='(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?\\.?\\s\\d{1,3}:\\d{1,3}(?:\\s?[-–]\\s?\\d{1,3})?';
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
 function blockAt(T,i){const t=String(T||'');const H=[...t.matchAll(/^[ \t>*#_-]*(?:LINK\s+(?:\d+|none)\b|\**\s*\d+[.)]\s)[^\n]*$/gmi)].map(m=>m.index);
  let a=-1,b=t.length;for(const h of H){if(h<=i)a=h;else{b=h;break;}}
  const pa=t.lastIndexOf('\n\n',i),pb=t.indexOf('\n\n',i);if(a<0)return t.slice(pa<0?0:pa,pb<0?t.length:pb);
  const end=t.slice(a,b).search(/\n\s*\n\s*(?:#{1,4}\s|[A-Z][A-Z' -]{6,}:?\s*\n)/);return t.slice(a,end<0?b:a+end);}
 const foot=(b)=>{try{if(typeof lbFoot==='function')return lbFoot(b,true);if(typeof PRS_LB==='function')return PRS_LB(b,true);}catch(e){}return footLocal(b);};
 const footLocal=b=>{const t=String(b||'').replace(/[*_]+/g,'');const met=new Set();
  if(/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b|[Ͱ-Ͽἀ-῿֐-׿]|\b[GH]\d{2,5}\b/.test(t)&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(t))met.add('L2');
  const R=[...t.matchAll(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n]{4,}?["”]/g)].map(m=>({a:m.index,b:m.index+m[0].length}));let first=null;
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}
  return [...met].sort();};
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
 function classify0(e,R,pressRound,l2bad){if(!e.means)return {cls:'UNPROVEN',why:e.form?'its MEANS sentence is missing or too short':'no MEANS sentence (the reference and quotation alone are [L1] only)'};
  const L2=e.l2.filter(x=>x.ok&&!(l2bad&&l2bad(x.text)));const L3=e.l3.filter(x=>x.ok);
  if(L2.length||L3.length)return {cls:'PROVEN',why:'[L1]+'+(L2.length?'[L2] '+L2[0].word:'')+(L2.length&&L3.length?'+':'')+(L3.length?'[L3] '+L3[0].ref:'')};
  if(e.round){const c=refCheck(e.keys,e.round,R,pressRound);return c.ok?{cls:'PROVEN BY REFERENCE',why:c.why,round:e.round,block:c.block}:{cls:'UNPROVEN',why:c.why};}
  const bad=e.l2.filter(x=>x.ok&&l2bad&&l2bad(x.text));
  return {cls:'UNPROVEN',why:bad.length?'its [L2] is NOT COUNTED by the [L2] check':(e.l2.length||e.l3.length)?'its [L2] or [L3] is not in the form (a word with its meaning; a verse with its reference and quotation)':'no [L2] or [L3] layer and no PROVEN IN reference'};}
 const FLOOR=(()=>{const MIND=/\b(thought|think|thinks|thinking|believed|believe|believes|supposed|suppose|supposes|knew|know|knows|knowing|known|accounted|account|counted|esteemed|reckoned|considered|took|take|takes|taken)\b/gi;
 const TOOK_TO_BE=/^(took|take|takes|taken)$/i;
 const NEG=/\b(not|no|never|nor|none|without|neither)\b/i;
 const PERSON=/^(he|she|they|him|her|joseph|mary|the husband|the man|a husband|a man|the father|his father|elisabeth|zacharias|adam|eve|jacob|abraham|david|herod|jesus|the child|the wife)$/i;
 const TEXT_SUBJECT=/\b(verse|verses|text|row|rows|record|matthew|luke|mark|john|paul|narrator|law|canon|chapter|gospel|word|line|lexicon|greek|hebrew)\b/i;
 const STOP=new Set('a an the of to and or but that which who whom this these those his her him he she it its they them their be is was were been being by with for from in on at as so not no into unto upon than then there here what when where whose would should could shall will may might must have has had do does did own same one'.split(' '));
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z\s']/g,' ');
 const stem=w=>w.replace(/'s$/,'').slice(0,5);
 function claims(means){
  const out=[];const m=String(means||'');let x;MIND.lastIndex=0;
  while((x=MIND.exec(m))){const verb=x[1];const before=m.slice(0,x.index);const after=m.slice(x.index+verb.length);
   if(TOOK_TO_BE.test(verb)&&!/^\s+.{0,40}?\bto be\b/i.test(after))continue;
   const pre=before.trim().split(/\s+/).slice(-3).join(' ');
   if(NEG.test(pre))continue;
   if(/\bof\s*$/i.test(before)||/\b(verb|word|sense)\s+of\s*$/i.test(before))continue;
   const subjWords=before.trim().split(/\s+/);const last1=(subjWords.slice(-1)[0]||'').replace(/[^A-Za-z]/g,'');const last2=subjWords.slice(-2).join(' ').replace(/[^A-Za-z ]/g,'');
   let actor=null;if(PERSON.test(last1))actor=last1;else if(PERSON.test(last2))actor=last2;
   if(!actor){const clause=before.split(/[,;:]|\bwhich\b|\bthat\b|\bso\b/i).pop();const w=clause.trim().split(/\s+/).map(z=>z.replace(/[^A-Za-z]/g,''));const p=w.find(z=>PERSON.test(z));if(p&&!TEXT_SUBJECT.test(clause))actor=p;}
   if(!actor)continue;
   const obj=after.split(/[,;.]|\bso\b|\bwhich\b|\band\b/i)[0];
   const objWords=norm(obj).split(/\s+/).filter(w=>w&&!STOP.has(w)&&w.length>=3&&!/^(be|to)$/.test(w));
   out.push({verb,actor,object:objWords});}
  return out;}
 function layerQuotes(e){const q=[];if(e.quote)q.push({kind:'L1',text:e.quote});
  (e.l2||[]).forEach(x=>q.push({kind:'L2',text:x.text}));
  (e.l3||[]).forEach(x=>{const m=String(x.text).match(/["“]([^"”]+)["”]/);q.push({kind:'L3',text:m?m[1]:x.text});});return q;}
 function held(c,quotes){
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
 function premise(seg,R,pressRound,l2bad,cap){const CAP=cap||8;const E=entries(seg);const out=[];const seen=new Set();const over=[];
  for(const e of E){const c=classify(e,R,pressRound,l2bad);for(const k of e.keys){if(seen.has(k))continue;if(seen.size>=CAP){if(!over.includes(k))over.push(k);continue;}seen.add(k);out.push({key:k,cls:c.cls,why:c.why,round:c.round||null,means:e.means,text:e.text.slice(0,600),block:c.block||null});}}
  return {verses:out,over,proven:out.filter(x=>x.cls!=='UNPROVEN').map(x=>x.key),unproven:out.filter(x=>x.cls==='UNPROVEN').map(x=>x.key),byRef:out.filter(x=>x.cls==='PROVEN BY REFERENCE')};}
 const RND=F=>({CR1:F.cr1,DR1:F.gr1,CR2:F.cr2,DR2:F.gr2,CR3:F.cr3,DR3:F.dr3,CR4:F.cr4,DR4:F.dr4});
 const l2bad=res=>{const N=x=>String(x||'').toLowerCase().replace(/[^a-z\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,'').slice(0,40);const bad=(res||[]).filter(t=>t&&t.status==='NOT COUNTED'&&(t.round==='DR2'||t.round==='CR3')).map(t=>N(t.seg)).filter(x=>x.length>=6);return bad.length?(txt=>{const k=N(txt);return k.length>=6&&bad.some(b=>b.startsWith(k.slice(0,Math.min(k.length,b.length)))||k.startsWith(b));}):null;};
 return {entries,parse,classify,refCheck,premise,blockAt,foot,RND,ORD,l2bad};})();
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
 const beta2lat=s=>String(s||'').toLowerCase().split('').map(c=>BETA[c]!=null?BETA[c]:c).join('');
 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};
 const grk2lat=s=>strip(s).toLowerCase().split('').map(c=>GRK[c]!=null?GRK[c]:c).join('');
 const isGrk=s=>/[Ͱ-Ͽἀ-῿]/.test(s),isHeb=s=>/[֐-׿]/.test(s);
 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');return t;};
 const skel=t=>t.replace(/[aeiou]/g,'');
 const isFunc=r=>{const m=String(r&&r.morph||'').trim();if(!m)return false;if(/^H/.test(m)){const sg=m.slice(1).split(/[\/\s]/).filter(x=>x&&!/^S/.test(x));const main=sg[sg.length-1]||'';return /^[TCRPc]/.test(main);}
  return /^(?:T|CONJ|COND|PREP|PRT|INJ|P|R|C|D|K|I|X|Q|F|S)$/.test(m.split(/[\s-]/)[0]);};
 const hebScript=s=>strip(s).replace(/[^א-ת]/g,'');
 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];
 const variants=w=>{const out=new Set();const raw=String(w||'');const parts=raw.split(/[-\/]/).filter(Boolean);
  const add=x=>{const n=norm(x);if(n.length>=2){out.add(n);if(/^h[aeiou]/.test(n))out.add(n.slice(1));}};add(raw);if(parts.length>1){add(parts[parts.length-1]);add(parts.join(''));}
  for(const n of [...out])for(const p of PREF)if(n.startsWith(p)&&n.length-p.length>=3)out.add(n.slice(p.length));return [...out];};
 const ed1=(a,b)=>{if(a===b)return true;if(Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&i<b.length&&a[i]===b[i])i++;
  return a.slice(i+1)===b.slice(i+1)||a.slice(i)===b.slice(i+1)||a.slice(i+1)===b.slice(i);};
 const vkey=(b,c,v)=>b+' '+c+':'+v;
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
   const core=ws.some(w=>!w.root)?ws.filter(w=>!w.root):ws;
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
  function countClaims(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/(?<![:\d]\s?)\b(\d{1,4})\s+(verses?|tokens?|rows?|times|occurrences?|instances?)\b/gi)){if(/(?:[1-3]\s)?[A-Z][a-z]+\.?\s*$/.test(t.slice(Math.max(0,m.index-20),m.index)))continue;const pre=t.slice(Math.max(0,m.index-90),m.index);
   const after=t.slice(m.index,m.index+80);if(!/\[L2\]|\b[GH]\d{1,5}\b|[Ͱ-Ͽἀ-῿֐-׿]|[*_][a-zà-ɏḀ-ỿ]/.test(pre+after))continue;
   const num=(pre.match(/\b([GH])0*(\d{1,5})\b(?![\s\S]*\b[GH]\d)/)||[]);let subj=num.length?num[1]+num[2]:null,word=null;
   if(!subj){const ws=tagWords(pre.slice(-70));const w=ws.filter(x=>x.kind!=='strongs').pop();if(w)word=w;}
   if(!subj&&!word)continue;const u=m[2].toLowerCase();
   out.push({side,round,at:m.index,n:+m[1],unit:/^verse/.test(u)?'verses':/^token/.test(u)?'tokens':null,said:m[0],subj,word,text:t.slice(Math.max(0,m.index-60),m.index+m[0].length).replace(/\s+/g,' ').trim()});}}
  return out;}
 function countCheck(CL,CR,capped,TGres){const by={};if(CR&&!Array.isArray(CR)){for(const [n,x] of Object.entries(CR))by[n]={v:{size:x.verses},t:x.tokens};}else for(const r of CR||[]){const n=numOf(r.strongs_number);if(!n)continue;(by[n]=by[n]||{v:new Set(),t:0});by[n].t++;by[n].v.add(vkey(r.book,r.chapter,r.verse));}
  const wordNum={};for(const t of TGres||[])for(const w of t.words||[])if(w.ok&&w.num)wordNum[norm(w.w)]=w.num;
  return (CL||[]).map(c=>{const n=c.subj||(c.word?wordNum[norm(c.word.w)]||null:null);if(!n)return {...c,num:null,status:'UNVERIFIABLE',why:'the word could not be matched to a Strong\'s number'};
   const b=by[n];if(!b)return {...c,num:n,status:capped?'UNVERIFIABLE':'DIFFERS FROM THE RECORD (0 verses, 0 tokens)',why:capped?'the count was not read':null};
   if(capped&&b.t>=1000)return {...c,num:n,status:'UNVERIFIABLE',why:'over the row cap'};
   const nv=b.v.size,nt=b.t;const ok=c.unit==='verses'?c.n===nv:c.unit==='tokens'?c.n===nt:(c.n===nv||c.n===nt);
   return {...c,num:n,verses:nv,tokens:nt,status:ok?(c.unit?'MATCHES THE RECORD':'MATCHES THE RECORD (unit not named)'):'DIFFERS FROM THE RECORD ('+nv+' verses, '+nt+' tokens)'+(c.unit?'':' (unit not named)')};});}
 function wordsUrls(keys,o){const PER=(o&&o.per)||20;const URL_MAX=7000;const B=SB+'original_words?select=book,chapter,verse,word_position,strongs_number,transliteration,original_script,morph&order=book,chapter,verse,word_position&limit=1000';
  const ks=[...new Set((keys||[]).filter(k=>/^(.+) (\d+):(\d+)$/.test(String(k))))];const out=[];
  const mk=b=>{const G=new Map();for(const k of b){const m=String(k).match(/^(.+) (\d+):(\d+)$/);const g=m[1]+'|'+m[2];if(!G.has(g))G.set(g,[]);G.get(g).push(+m[3]);}
   const conds=[...G].map(([g,vs])=>{const [bk,c]=g.split('|');return 'and(book.eq."'+bk+'",chapter.eq.'+c+',verse.in.('+[...new Set(vs)].sort((x,y)=>x-y).join(',')+'))';});return B+'&or='+encodeURIComponent('('+conds.join(',')+')');};
  let cur=[];for(const k of ks){const t=cur.concat([k]);if(cur.length&&(t.length>PER||mk(t).length>URL_MAX)){out.push({url:mk(cur),keys:cur});cur=[k];}else cur=t;}if(cur.length)out.push({url:mk(cur),keys:cur});return out;}
 function wordsUrl(keys,o){const U=wordsUrls(keys,o);return {url:U.length?U[0].url:SB+'original_words?select=book&id=eq.-1',read:U.length?U[0].keys:[],off:[].concat(...U.slice(1).map(x=>x.keys))};}
 function lexUrls(OW,o){const sheet=!!(o&&o.sheet);const byN={};for(const r of OW||[]){const n=numOf(r&&r.strongs_number);if(!n||/^H9\d{3}$/.test(n)||n==='G0')continue;(byN[n]=byN[n]||[]).push(r);}
  const S=Object.keys(byN).filter(n=>!sheet||!byN[n].every(isFunc));const cols='strongs_number,original_script,transliteration'+(sheet?',anchor_gloss':'');const out=[];
  for(let i=0;i<S.length;i+=250)out.push(SB+'lexicon_words?select='+cols+'&limit=1000&strongs_number=in.('+S.slice(i,i+250).join(',')+')');return out;}
 function lexUrl(OW){const U=lexUrls(OW,{sheet:true});return U.length?U[0]:SB+'lexicon_words?select=strongs_number&strongs_number=in.(NONE)';}
 function countsUrl(nums){const S=[...new Set((nums||[]).filter(Boolean))].slice(0,40);return SB+'original_words?select=book,chapter,verse,strongs_number&limit=1000&strongs_number=in.('+(S.length?S.join(','):'NONE')+')';}
 function sheet(OW,LEX,P){const IX=index(OW,LEX);const order=(P&&(P.l2_req||P.l2_read))||[];const seen=new Set();const rows=[],left=[],nolex=[];let ch=0,fw=0;const CAPC=26000;
  const byN={};for(const r of OW||[]){const n=numOf(r&&r.strongs_number);if(n)(byN[n]=byN[n]||[]).push(r);}
  const got=new Set(Object.keys(IX.V));const unread=order.filter(k=>!got.has(k));
  for(const k of order)for(const r of (IX.V[k]||[])){const n=numOf(r.strongs_number);if(!n||seen.has(n))continue;seen.add(n);if(byN[n].every(isFunc)){fw++;continue;}const L=IX.X[n];if(!L){if(!/^H9\d{3}$/.test(n)&&n!=='G0')nolex.push(n);continue;}
   const line=n+' '+String(L.original_script||'').trim()+' '+String(L.transliteration||'').trim()+': '+String(L.anchor_gloss||'');if(ch+line.length>CAPC){left.push(n);continue;}rows.push(line);ch+=line.length;}
  if(!order.length)return '';
  const tail=[].concat(unread.length?['verses read with no rows (Apocrypha, no such verse, or the read failed): '+unread.join(', ')]:[],left.length?['numbers over the sheet cap of '+CAPC+' characters: '+left.join(', ')]:[],nolex.length?['numbers the lexicon does not hold: '+nolex.join(', ')]:[]);
  return '[L2] SHEET -- read by the system from the record\'s original-words table (original_words: the Greek of the TR, Scrivener 1894; the Hebrew of the Leningrad codex) and its lexicon (lexicon_words), for every verse cited so far in this debate (the verses pressed under PRESSED WITH first), served alike to both sides: one row per Strong\'s number, with the dictionary form and the lexicon gloss quoted whole; '+fw+' function words (articles, conjunctions, prepositions, particles, pronouns) are left out. An [L2] counts only when its word is in a verse its own block cites: name the word by its dictionary form, its transliteration or its Strong\'s number, with its meaning. A count of occurrences names its unit (verses or tokens).\n'+(rows.length?rows.join('\n'):'(no original-words row could be read this round)')+(tail.length?'\nLEFT OFF THE [L2] SHEET: '+tail.join('; ')+'.':'');}
 function sheetPlan(texts,keys){const pw=[];for(const t of texts||[]){const s=String(t||'');for(const m of s.matchAll(/PRESSED WITH\s*:/gi)){let seg=s.slice(m.index);const b=seg.search(/\n\s*\n|\n\s*\**\s*\d+[.)]\s/);if(b>=0)seg=seg.slice(0,b);for(const k of refsIn(seg))if(!pw.includes(k))pw.push(k);}}
  const order=pw.concat((keys||[]).filter(k=>!pw.includes(k)));return {l2_req:order,l2_urls:wordsUrls(order).map(x=>x.url)};}
 return {tags,tagWords,check,countClaims,countCheck,wordsUrl,wordsUrls,lexUrl,lexUrls,isFunc,countsUrl,sheet,sheetPlan,norm,variants,beta2lat,grk2lat,blockAt,refsIn,apocIn,numOf,index,matchWord};})();
let PRS_L2BAD=null;
const PRS_CTX={R:null};
function l2Data(){try{const g=(typeof $==='function')?$:null;return g?(g('Quote Report').first().json.l2_data||null):null;}catch(e){return null;}}

const __RL=(function(){const module={exports:{}};const exports=module.exports;
const SEP='(?:--|\\u2014|\\u2013)';
const PAIR='(D\\d+)\\s+[vV][sS]\\.?\\s+(C\\d+)';
const RND='\\[{0,2}\\s*((?:CR|DR)[1-4]|(?:Defender|Challenger)\\s*R(?:ound)?\\s*[1-4])\\s*\\]{0,2}';
const rnd=x=>{const u=String(x).toUpperCase().replace(/\s+/g,'');const w=u.match(/^(DEFENDER|CHALLENGER)R(?:OUND)?(\d)$/);return w?(w[1]==='DEFENDER'?'CR':'DR')+w[2]:u;};
const TAG='\\(\\s*[Cc]ommitment\\s+(\\d+)\\s*\\)';
const COL_GRADE='DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN';
const RES_TAG='BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1';
const STAND='SELF-SUPPORTED|PROP-DEPENDENT|COLLAPSED|FORFEIT(?:ED)?';
function judgeText(raw){const s=String(raw==null?'':s0(raw));const a=s.indexOf('{');if(a>=0&&/"reason(?:ing)?"\s*:/.test(s)){try{const o=JSON.parse(s.slice(a,s.lastIndexOf('}')+1));if(o&&typeof o.reasoning==='string')return {text:o.reasoning,src:'json'};if(o&&typeof o.reason==='string')return {text:o.reason,src:'json'};}catch(e){}
  const m=s.slice(a).match(/"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}/);if(m)return {text:m[1].replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\\\\/g,'\\'),src:'json-malformed'};}
 const i=s.indexOf('\n\n[AUDIT');return {text:unescapeOnce(i<0?s:s.slice(0,i)),src:'plain'};}
function s0(x){return typeof x==='string'?x:JSON.stringify(x);}
function unescapeOnce(t){t=String(t==null?'':t);if(!/\n/.test(t)&&/\\n/.test(t))t=t.replace(/\\n/g,'\n');return t.replace(/\\"/g,'"');}
function normLine(l){return String(l==null?'':l).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022>]|\d+[.)])\s*/,'').replace(/[ \t]+/g,' ').trim();}
function quoteAt(s,next){const m=s.match(/^\s*:?\s*(["\u201c'])/);if(!m)return null;const body=s.slice(m[0].length);
 let sep=-1;if(next){const k=body.search(new RegExp('\\s'+SEP+'\\s*'+next+'\\b','i'));if(k>=0)sep=k;}if(sep<0)sep=body.search(new RegExp('\\s'+SEP+'\\s'));const seg=sep<0?body:body.slice(0,sep);const close=Math.max(seg.lastIndexOf('"'),seg.lastIndexOf('\u201d'),m[1]==="'"?seg.lastIndexOf("'"):-1);
 if(close<0)return null;return {q:seg.slice(0,close),rest:body.slice(close+1)};}
const P={};
P.FORCED=s=>{const m=s.match(new RegExp('^FORCED\\s*(?:'+TAG+')?\\s*:\\s*'+PAIR+'(?:\\s*'+TAG.replace('(\\d+)','(\\d+)')+')?\\s*'+SEP+'\\s*MEANS\\s*'+RND+'\\s*:?','i'));if(!m)return null;
 const f={tag:m[1]?+m[1]:(m[4]?+m[4]:null),pair:m[2]+' vs '+m[3],meansRound:rnd(m[5])};let r=s.slice(m[0].length);let q=quoteAt(r,'ANSWER');if(!q)return {why:'FORCED: MEANS has no quotation',code:'FORCED_MEANS_HAS_NO_QUOTATION'};f.means=q.q;r=q.rest.replace(/^\s*\([^\n]*?\)/,'');
 let a=r.match(new RegExp('^\\s*'+SEP+'\\s*ANSWER\\s*'+RND+'\\s*:?','i'));if(!a)return {why:'FORCED: no ANSWER <round> after MEANS',code:'FORCED_NO_ANSWER_ROUND_AFTER_MEANS'};f.answerRound=rnd(a[1]);r=r.slice(a[0].length);q=quoteAt(r,'FAILS');if(!q)return {why:'FORCED: ANSWER has no quotation',code:'FORCED_ANSWER_HAS_NO_QUOTATION'};f.answer=q.q;r=q.rest.replace(/^\s*\([^\n]*?\)/,'');
 a=r.match(new RegExp('^\\s*'+SEP+'\\s*FAILS\\s*:?','i'));if(!a)return {why:'FORCED: no FAILS after ANSWER',code:'FORCED_NO_FAILS_AFTER_ANSWER'};r=r.slice(a[0].length);q=quoteAt(r);if(!q)return {why:'FORCED: FAILS has no quotation',code:'FORCED_FAILS_HAS_NO_QUOTATION'};f.fails=q.q;f.tail=q.rest.trim();
 f.breaks=f.meansRound.startsWith('CR')?'CHALLENGER':'DEFENDER';return f;};
P.COLLISION=s=>{const m=s.match(new RegExp('^(RESTATED\\s*:\\s*)?'+PAIR+'\\b'));if(!m)return null;let r=s.slice(m[0].length);
 const f={restated:!!m[1],pair:m[2]+' vs '+m[3]};const v=r.match(/^\s*\(([^)\n]*)\)/);if(v){f.verse=v[1].trim();r=r.slice(v[0].length);}
 const c=r.match(/^[^:\n(]*:/);if(!c)return {why:'COLLISION: no ":" after the pair (CP2)',code:'COLLISION_NO_COLON_AFTER_THE_PAIR_CP2'};const pre=c[0].slice(0,-1).trim();if(pre)f.text=pre;r=r.slice(c[0].length);
 const g=r.match(new RegExp('^\\s*('+COL_GRADE+')\\b'));if(!g){const lc=r.match(new RegExp('^\\s*('+COL_GRADE+')\\b','i'));return lc?{why:'COLLISION: grade word not upper case (CP2)',code:'COLLISION_GRADE_NOT_UPPER_CASE_CP2'}:{why:'COLLISION: no grade word after ":"',code:'COLLISION_NO_GRADE_WORD'};}
 f.grade=g[1];r=r.slice(g[0].length);const t=r.match(new RegExp('^\\s*'+TAG));if(t){f.tag=+t[1];r=r.slice(t[0].length);}
 const gi=r.search(/\bGROUND\s*:/i);if(gi>=0){f.ground=r.slice(gi).replace(/^GROUND\s*:\s*/i,'').trim();r=r.slice(0,gi);}f.reason=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').replace(new RegExp('\\s*'+SEP+'\\s*$'),'').trim();return f;};
P['ANSWER CHECK']=s=>{const m=s.match(new RegExp('^ANSWER CHECK\\s*:\\s*(.+?)\\s*'+SEP+'\\s*(?:(\\[[^\\]\\n]*\\](?:\\s*(?:[,/;]|and)\\s*\\[[^\\]\\n]*\\])*)|((?:CR|DR)[1-4](?:\\s*[,/;]\\s*(?:CR|DR)[1-4])*))\\s*'+SEP+'\\s*','i'));if(!m)return /^ANSWER CHECK\s*:/i.test(s)?{why:'ANSWER CHECK: no <verse> -- <round> head',code:'ANSWER_CHECK_NO_VERSE_ROUND_HEAD'}:null;
 const rr=(m[2]!=null?m[2].replace(/\]\s*(?:[,/;]|and)\s*\[/gi,', ').replace(/^\[|\]$/g,''):m[3]).trim();  const rounds=[];for(const x of rr.split(/\s*[,/;]\s*|\s+and\s+/i)){let y=x.trim().toUpperCase();const w=y.match(/^(DEFENDER|CHALLENGER)\s*R(?:OUND)?\s*(\d)$/);if(w)y=(w[1]==='DEFENDER'?'CR':'DR')+w[2];if(/^(CR|DR)[1-4]$/.test(y))rounds.push(y);}
 const f={verse:m[1].trim(),roundRaw:rr,rounds};if(!rounds.length)f.roundNone=true;                                  let r=s.slice(m[0].length);
 const fld=(k)=>{const a=r.match(new RegExp('^'+k+'\\s*:?','i'));if(!a)return undefined;r=r.slice(a[0].length);const q=quoteAt(r,k==='MEANS'?'ANSWER':'(?:MEETS|MISSES|FAILS|UNPROVEN)');let v;
  if(q){v=q.q;const t=q.rest.search(new RegExp('\\s'+SEP+'\\s'));f[k.toLowerCase()+'Note']=(t<0?q.rest:q.rest.slice(0,t)).trim()||undefined;r=t<0?'':q.rest.slice(t);}
  else{const t=r.search(new RegExp('\\s'+SEP+'\\s'));v=(t<0?r:r.slice(0,t)).trim();f[k.toLowerCase()+'Bare']=true;r=t<0?'':r.slice(t);}
  r=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'');return v;};
 const mv=fld('MEANS');if(mv!==undefined)f.means=mv;const av=fld('ANSWER');if(av!==undefined)f.answer=av;
 const g=r.match(/^(MEETS|MISSES|FAILS|UNPROVEN)\b/);if(!g){const lc=r.match(/^(MEETS|MISSES|FAILS|UNPROVEN)\b/i);return lc?{why:'ANSWER CHECK: grade word not upper case',code:'ANSWER_CHECK_GRADE_NOT_UPPER_CASE'}:{why:'ANSWER CHECK: no MEETS, MISSES, FAILS or UNPROVEN after the answer',code:'ANSWER_CHECK_NO_GRADE_WORD'};}
 f.grade=g[1];f.gradeRead=g[1]==='FAILS'?'MISSES':g[1];r=r.slice(g[0].length);const t=r.match(new RegExp('^\\s*'+TAG));if(t){f.tag=+t[1];r=r.slice(t[0].length);}f.tail=r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim();return f;};
P.KEYSTONE=s=>{const m=s.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|\u2013|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/);if(!m)return /^KEYSTONE\s*:/i.test(s)?{why:'KEYSTONE: no D<i> and STANDS, BROKEN or WITHDRAWN',code:'KEYSTONE_NO_D_I_AND_STANDS_BROKEN_OR_WITHDRAWN'}:null;
 const r=s.slice(m[0].length);return {link:m[1],grade:m[2],tag:m[3]?+m[3]:null,reason:r.replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim(),derived:/derived by the engine/i.test(r)};};
P.RESULT=s=>{const m=s.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)\b/);if(!m)return /^RESULT\s*:/i.test(s)?{why:'RESULT: no DEFENDER WINS, CHALLENGER WINS or UNDERDETERMINED',code:'RESULT_NO_DEFENDER_WINS_CHALLENGER_WINS_OR_UNDERDETERMINED'}:null;return {result:m[1],reason:s.slice(m[0].length).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim()};};
P['CORRECTED RESULT']=s=>{const m=s.match(new RegExp('^CORRECTED RESULT\\s*:\\s*('+RES_TAG+')(?:\\s*(?:--|\\u2014|\\u2013|:|;|,|\\()([\\s\\S]*))?$','i'));if(!m)return /^CORRECTED RESULT\s*:/i.test(s)?{why:'CORRECTED RESULT: no tag',code:'CORRECTED_RESULT_NO_TAG'}:null;return {tag:m[1].toUpperCase(),reason:(m[2]||'').trim()};};
P['CORRECTED COUNT']=s=>{const m=s.match(/^CORRECTED COUNT\s*:\s*(DEFENDER|CHALLENGER)\s+(\d+)/i);return m?{side:m[1].toUpperCase(),n:+m[2]}:(/^CORRECTED COUNT\s*:/i.test(s)?{why:'CORRECTED COUNT: no <SIDE> <n>',code:'CORRECTED_COUNT_NO_SIDE_N'}:null);};
P['CORRECTED STANDING']=s=>{const m=s.match(new RegExp('^CORRECTED STANDING\\s*:\\s*(DEFENDER|CHALLENGER)\\s+('+STAND+')','i'));return m?{side:m[1].toUpperCase(),standing:m[2].toUpperCase()}:(/^CORRECTED STANDING\s*:/i.test(s)?{why:'CORRECTED STANDING: no <SIDE> <standing>',code:'CORRECTED_STANDING_NO_SIDE_STANDING'}:null);};
P.RETRACTED=s=>{const m=s.match(new RegExp('^RETRACTED\\s*:\\s*(?:K-[A-Z]+\\d*\\s+)?'+PAIR,'i'));  return m?{pair:m[1]+' vs '+m[2],reason:s.slice(m[0].length).replace(new RegExp('^\\s*(?:'+SEP+'|:)\\s*'),'').trim()}:(/^RETRACTED\s*:/i.test(s)?{why:'RETRACTED: no pair',code:'RETRACTED_NO_PAIR'}:null);};
P['NOT PRESSED']=s=>{const m=s.match(/^NOT PRESSED\s*:\s*(.+?)(?:\s*(?:--|\u2014|\u2013)\s*(.*))?$/i);return m?{verse:m[1].trim(),reason:(m[2]||'').trim()}:null;};
P.PRESSED=s=>{if(!/^PRESSED\s*:/i.test(s))return null;const r=s.replace(/^PRESSED\s*:\s*/i,'');
 let p=r.match(new RegExp('^'+PAIR+'\\s*\\|\\s*\\[((?:CR|DR)[1-4])\\]\\s*\\|\\s*["\\u201c](.+)["\\u201d]$','i'));if(p)return {kind:'cure',sep:'|',pair:p[1]+' vs '+p[2],round:p[3].toUpperCase(),quote:p[4]};
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
 let sen=(t?m[3].slice(0,t.index):m[3]).trim();let why=t?t[2].trim():'';if(!t){const d=sen.match(/\s+(?:--|\u2014|\u2013)\s+/);if(d){why=sen.slice(d.index+d[0].length).trim();sen=sen.slice(0,d.index).trim();}}
 return {side:m[1].toUpperCase(),round:m[2].toUpperCase(),sentence:sen,tag:t?t[1]:null,why};};
P.STATEMENT=s=>{const m=s.match(/^(STATEMENT|RESPONSE)\s*:\s*(.*)$/i);if(!m)return null;const p=m[2].split(/\s*\|\s*/);return {which:m[1].toUpperCase(),item:p.length>1?p[0]:null,text:p.length>1?p.slice(1).join(' | '):p[0]};};
P['LINK STATE']=s=>{const m=s.match(new RegExp('^(D\\d+)\\s*:?\\s*(?:--|\\u2014|\\u2013|-|:)?\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|BROKEN|WITHDRAWN)\\b(?:\\s*'+TAG+')?'));if(!m)return null;const r=s.slice(m[0].length);  const gi=r.search(/\bGROUND\s*:/i);
 return {link:m[1],grade:m[2],ground:gi>=0?r.slice(gi).replace(/^GROUND\s*:\s*/i,'').trim():'',reason:(gi>=0?r.slice(0,gi):r).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').replace(new RegExp('\\s*'+SEP+'\\s*$'),'').trim()};};
P['RULING PART']=s=>{const m=s.match(/^(CLAIM|NAMED BY|RULE|APPLIED)\s*:\s*(.*)$/i);return m?{part:m[1].toUpperCase(),text:m[2].trim()}:null;};
P['CHAIN MARK']=s=>{const m=s.match(/^(DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*([A-Z][A-Z-]*)\b/i);return m?{side:m[1].toUpperCase(),mark:m[2].toUpperCase(),reason:s.slice(m[0].length).replace(new RegExp('^\\s*'+SEP+'\\s*'),'').trim()}:null;};
P['CITATION CHECK']=s=>{const m=s.match(/^(?:#+\s*)?CITATION CHECK\b\s*:?\s*(.*)$/i);return m?{text:m[1]}:null;};
P.HEADING=s=>{const m=s.match(/^#*\s*([A-Z][A-Z \-/()]{3,60}):\s*$/);return m?{heading:m[1].trim()}:null;};
P.SHORT=s=>{const m=s.match(/^SHORT\s*:\s*(.*)$/i);if(!m)return null;const p=m[1].match(new RegExp('^'+PAIR+'\\s*\\|\\s*\\[((?:CR|DR)[1-4])\\]\\s*\\|\\s*["\\u201c](.+?)["\\u201d]\\s*\\|\\s*(\\S.{9,})$','i'));
 return p?{text:m[1],pair:p[1]+' vs '+p[2],round:p[3].toUpperCase(),quote:p[4],why:p[5]}:{text:m[1]};};
P.REPLY=s=>{const m=s.match(/^(?:(SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*([SG])\s*(\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(!m)return null;
 const to=m[5]!=null?m[5].trim():null;return {kind:(m[1]||(m[2].toUpperCase()==='G'?'GATE':'SENDBACK')).toUpperCase(),id:m[2].toUpperCase()+m[3],answer:/^KEEP$/i.test(m[4])?'KEEP':'CHANGE',to,toRow:to?readLine(to.replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1')):null,sentence:(m[6]||'').trim()};};
P.PREMISE=s=>{const t=s.replace(/^premise\s+\d+\s+ruled\s+[A-Z ]+?\s*:\s*(?=premise\b)/i,'');const m=t.match(new RegExp('^premise\\s+(\\d+)\\s*(?:is\\s+)?:?\\s*(UNEXHIBITED|CONCEDED|NOT VOID|VOID|SPARED|COUNTED)\\b(?:\\s*'+TAG+')?\\s*(?:'+SEP+'|:|,)?\\s*','i'));if(!m)return null;
 if(m[2]!==m[2].toUpperCase())return {why:'PREMISE: status word not upper case',code:'PREMISE_STATUS_NOT_UPPER_CASE'};return {premise:+m[1],status:m[2],tag:m[3]?+m[3]:null,reason:t.slice(m[0].length).trim(),engineLabel:t!==s};};
const ORDER=['REPLY','FORCED','CORRECTED RESULT','CORRECTED COUNT','CORRECTED STANDING','RETRACTED','NOT PRESSED','PRESSED','COLLISION','ANSWER CHECK','KEYSTONE','RESULT','CLAUSE','STANDING','CONCEDED','PREMISE','RULING','RULING PART','CHAIN MARK','LINK STATE','CITATION CHECK','OUT-OF-ROUND','STATEMENT','SHORT','HEADING'];
const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT'];
function readLine(line){const norm=normLine(line);if(!norm)return {form:null,why:'empty',code:'EMPTY',norm};
 const rs=norm.match(/^RESTATED\s*:\s*/i);if(rs){const r=readLine(norm.slice(rs[0].length).replace(/^C(\d+)(\s+[vV][sS]\.?\s+)D(\d+)\b/,'D$3$2C$1'));  if(r.form&&RESTATABLE.includes(r.form))return {form:r.form,f:Object.assign({},r.f,{restated:true}),norm};
  if(r.form==null&&r.tried&&RESTATABLE.includes(r.tried))return Object.assign({},r,{norm});return {form:null,tried:'RESTATED',why:'RESTATED wraps no spec form',code:'NOT_A_FORM',norm};}
 for(const k of ORDER){const f=P[k](norm);if(!f)continue;if(f.code)return {form:null,tried:k,why:f.why,code:'MALFORMED_'+k.replace(/[^A-Z]+/g,'_'),detail:f.code,norm};return {form:k,f,norm};}
 {const lab=[[/^FORCED\b/i,'FORCED'],[/^D\d+\s+vs\.?\s+C\d+\b/i,'COLLISION'],[/^ANSWER CHECK\s*:/i,'ANSWER CHECK'],[/^KEYSTONE\s*:/i,'KEYSTONE']].find(([r])=>r.test(norm));
  if(lab)return {form:null,tried:lab[1],why:lab[1]+' label, line does not parse',code:'MALFORMED_'+lab[1].replace(/[^A-Z]+/g,'_'),detail:'NO_PARSE',norm};}
 return {form:null,why:'no line form',code:'NO_LINE_FORM',norm};}
function readStored(raw){return readLines(judgeText(raw).text);}
function readLines(text){return String(text==null?'':text).split('\n').map((l,i)=>{const r=readLine(l);return r.form?{n:i,form:r.form,fields:r.f,norm:r.norm}:{n:i,form:null,why:r.why,code:r.code,detail:r.detail||null,tried:r.tried||null,norm:r.norm};}).filter(r=>r.code!=='EMPTY');}
module.exports={norm:normLine,readLine,readLines,readStored,judgeText,normLine,unescapeOnce,quoteAt,FORMS:ORDER};
return module.exports;})();
/* pkgRI4 (reader item 4): the reader's FORCED fields for a line (null: no FORCED form, or RESTATED); a FORCED label test, reader first, else the old regex */
function ri4F2024(l){try{const r=__RL.readLine(String(l==null?'':l).trim());if(r&&r.form==='FORCED'&&r.f&&r.f.pair&&!r.f.restated)return r.f;}catch(e){}return null;}
function ri4IsF2024(l,re){return !!ri4F2024(l)||re.test(l);}
/* pkgRI5 (reader item 5): a line's label from the reader (null: no form, a RESTATED line, or a form with no label here); the old regex decides on null */
function ri5Lab2024(l,res){let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}if(!r||!r.form||!r.f||r.f.restated)return null;const f=r.f;
 if(r.form==='COLLISION'&&f.pair)return f.pair.replace(/\s+vs\.?\s+/i,' VS ').toUpperCase();if(r.form==='KEYSTONE')return 'KEYSTONE';if(r.form==='CLAUSE')return 'CLAUSE';
 if(r.form==='CONCEDED'&&f.side)return f.side==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';if(r.form==='STANDING'&&f.side)return f.side+' STANDING';if(res&&r.form==='RESULT')return 'RESULT';return null;}
function ri5Restated2024(l){let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}return r&&r.form==='COLLISION'&&r.f&&r.f.restated&&/^D\d+\s+vs\.?\s+C\d+$/i.test(String(r.f.pair||''))?r.f.pair.match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i):null;}
/* pkgRI5 part B (reader item 5): reader-first field reads for sbApply2024; each returns the old regex's match shape, or the old regex's own result when the reader reads no such form */
function ri5Rd2024(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form&&r.f&&!r.f.restated?r:null;}catch(e){return null;}}
 /* pkgRI5C: no regex, no match */





/* pkgRI5 part C (reader item 5): one reader field of a line, or null when the reader reads no such form (then the old regex decides) */

/* pkgRI6 (reader item 6, KEYSTONE): reader-first reads; each returns the old regex's match shape, or the old regex's result when the reader reads no such form */
function ri6Kk2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='KEYSTONE'&&r.f.link&&['STANDS','BROKEN','WITHDRAWN'].includes(r.f.grade))return [l,String(r.f.link).replace(/^D/i,''),r.f.grade,r.f.reason||''];return String(l==null?'':l).match(re);}


function __kfM(s){const l=String(s==null?'':s);const r=__RL.readLine(l);if(!r||r.form!=='FORCED'||!r.f||!r.f.pair||r.f.restated)return null;const f=r.f;const m=[l,f.pair,f.meansRound,f.means,f.answerRound,f.answer,f.fails];m.index=0;m.input=l;return m;}
const KF_LINE={test:s=>!!__kfM(s),[Symbol.match]:s=>__kfM(s),toString:()=>'KF_LINE (readLines FORCED)'};
const KF_GROUND=/\bforced\b|\bcannot\s+take\b|\bcan(?:no|')t\s+(?:take|fit|bear)\b|\bdoes\s+not\s+fit\b|\bruling\s+396\b|\b396\b/i;
const __kfLB=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/(^|\n)[ \t]*(?:[-*\u2022>]|\d+[.)])[ \t]+/g,'$1');
const __kfIN=s=>__kfLB(s).replace(/(^|\s)\d{1,2}[.)](?=\s|$)/g,'$1');
const kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t))||ciFound(__kfIN(q),__kfIN(t));
function knlNone2024(l){const s=String(l==null?'':l).replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]|\d+[.)])\s*/,'');const m=s.match(/^FORCED(?:\s+(?:LINES?|LINKS?))?(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(.*)$/i);if(!m)return false;let r=m[1].trim(); /* pkgKNL; rev 4 (W1 3790): the FORCED LINES / FORCED LINKS head */
 r=r.replace(/^[-–—:\s]+/,''); /* rev 4: a leading dash */
 /* rev 5 (W3 3831, W4 3829): a closing parenthesis is accepted only when the whole of it is one fixed form; anything else makes the line a checked FORCED line */
 const PAR=/^\s*(?:Commitment\s+\d+|(?:no|none|nothing|not\s+any)(?:\s+(?:of\s+the\s+)?(?:links?|lines?|collisions?|premises?))?(?:\s+(?:is|are))?(?:\s+graded)?(?:\s+(?:forced|broken|link\s+broken|graded(?:\s+(?:forced|broken))?))?)\s*\.?\s*$/i;
 for(let k=0;k<3;k++){const p=r.match(/^(.*?)\s*\(([^()]*)\)\s*\.?\s*$/);if(!p||!p[1].trim())break;if(!PAR.test(p[2]))return false;r=p[1].trim();} /* rev 4: a closing parenthesis that names no link, round or quote and only says nothing is graded */
 r=r.replace(/\s*\.\s*$/,'');
 return /^(?:none|nil|n\/a|no|nothing|zero|0)(?:\s+(?:graded|forced|links?\s+(?:is\s+|are\s+)?(?:graded\s+)?(?:graded|forced)))?$/i.test(r)
  ||/^none\s+of\s+(?:the\s+)?(?:collisions?|collision\s+(?:points?|lines?)|links?|lines?)(?:\s+(?:is|are)\s+(?:graded\s+)?forced)?$/i.test(r)
  ||/^(?:there\s+(?:are|is)\s+)?no\s+(?:forced\s+)?(?:links?|lines?|collisions?|collision\s+(?:points?|lines?))(?:\s+(?:is|are)\s+(?:graded\s+)?forced)?$/i.test(r);} /* rev 3 (W3 3576): an allow-list; rev 4 (W1 3790) adds: none of the collisions/links/lines, there are no forced links, a leading dash, a nothing-graded parenthesis, the FORCED LINES head */
function kfLines(text,R){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const forced=new Set();
 for(const raw of T.split('\n')){const l=raw.trim();if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;if(knlNone2024(l))continue; /* pkgKNL */const m=l.match(KF_LINE);
  if(!m){const id=(l.match(/D\d+\s+vs\.?\s+C\d+/i)||['FORCED'])[0].replace(/\s+vs\.?\s+/i,' vs ');items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:'malformed'});
   marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+': the FORCED line is not in the form FORCED: D<i> vs C<j> -- MEANS [<round>]: "<...>" -- ANSWER [<round>]: "<...>" -- FAILS: "<...>". LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');continue;}
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');forced.add(id+'|'+(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER'));const bad=[];
  if(typeof R[m[2].toUpperCase()]!=='string'||!kfFound(m[3],R[m[2].toUpperCase()]))bad.push('the MEANS quotation is not in ['+m[2].toUpperCase()+']');
  if(typeof R[m[4].toUpperCase()]!=='string'||!kfFound(m[5],R[m[4].toUpperCase()]))bad.push('the ANSWER quotation is not in ['+m[4].toUpperCase()+']');
  if(typeof R[m[4].toUpperCase()]!=='string'||!kfFound(m[6],R[m[4].toUpperCase()]))bad.push('the FAILS quotation is not in ['+m[4].toUpperCase()+']');
  if(!bad.length)continue;items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:bad.join('; ')});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+': '+bad.join('; ')+' (ruling 396: the meaning weighed is the one the debaters exhibit; the judge supplies none of its own). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}
 for(const raw of T.split('\n')){const l=raw.trim();const m=l.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\s+vs\.?\s+C(\d+)\b/i);if(!m)continue;if(!/LINK\s+BROKEN/.test(l))continue;
  const g=(l.match(/\bGROUND\s*:(.*)$/i)||[null,l])[1];if(!KF_GROUND.test(g))continue;const id='D'+m[1]+' vs C'+m[2];{const sd=(l.match(/\b(DEFENDER|CHALLENGER)\s+LINK\s+BROKEN/i)||[])[1];if(sd?forced.has(id+'|'+sd.toUpperCase()):[...forced].some(z=>z.startsWith(id+'|')))continue;}  if(items.some(x=>x.link===id))continue;
  items.push({rule:'K-F',side:'BOTH',link:id,line:l.slice(0,600),why:'no FORCED line'});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-F) -- '+id+' grades a link BROKEN as forced with no FORCED line quoting the MEANS sentence, the answer and the layer that fails (ruling 396). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}
 return {items,marks};}
const KFC_REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?)\.? (\d{1,3}):(\d{1,3})(?:\s?[-–]\s?(\d{1,3}))?/g;
const KFC_CB=/(?:--|—|–)\s*CARRIED\s+BY\s*:\s*["“]([^"”]{3,}?)["”]/i;
function kfcVerse(means,rt){const refs=s=>[...String(s||'').matchAll(new RegExp(KFC_REF.source,'g'))];
 const head=refs(means).find(z=>z.index<=3);let r=head||null;
 if(!r&&typeof rt==='string'){const fm=kkjvFold(means).split(' ').slice(0,12).join(' ');
  const line=fm?__kfLB(rt).replace(/[*_`]+/g,'').split('\n').find(x=>kkjvFold(x).includes(fm)):null;
  if(line){const mi=line.search(/MEANS\s*:/i);const all=refs(line);r=(mi>=0?all.filter(z=>z.index<mi).pop():null)||all[0]||null;}}
 if(!r)return null;return {ref:r[0].replace(/\.\s/,' '),book:r[1],ch:+r[2],v1:+r[3],v2:+(r[4]||r[3])};}
function kfcText(v,rows){if(!v)return null;const parts=[];for(let n=v.v1;n<=v.v2;n++){const x=(rows||[]).find(q=>q&&q.book===v.book&&+q.chapter===v.ch&&+q.verse===n);if(!x)return null;parts.push(x.text);}return parts.join(' ');}
const KFF_Q='["“]([^"“”]{6,600})["”]';
function kffPairs(T){const out=[];const t=String(T||'');const R=new RegExp(KKJV_REF.source,'g');let m;
 while((m=R.exec(t))){const ref={book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3])};
  const after=new RegExp('^[\\s,:;(\\-–—]{0,6}(?:\\[L\\d\\]\\s*)?'+KFF_Q).exec(t.slice(R.lastIndex,R.lastIndex+700));if(after)out.push({...ref,q:after[1]});
  const before=new RegExp(KFF_Q+'[\\s,.;:]{0,3}[(\\[]?\\s*$').exec(t.slice(Math.max(0,m.index-700),m.index));if(before)out.push({...ref,q:before[1]});}
 return out;}
function kffVerse(p,rows){const parts=[];for(let n=p.v1;n<=p.v2;n++){const x=(rows||[]).find(q=>q&&q.book===p.book&&+q.chapter===p.ch&&+q.verse===n);if(!x)return null;parts.push(x.text);}return parts.join(' ');}
function kffLines(text,R,rows0){const items=[],marks=[],report=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');let rows=rows0||null;
 for(const raw of T.split('\n')){const l=raw.trim();if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;const m=l.match(KF_LINE);if(!m)continue;
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');const rk=m[4].toUpperCase();const f=krulNorm(m[6]);
  if(f.split(' ').filter(Boolean).length<4)continue;
  const rt=R&&typeof R[rk]==='string'?__kfLB(R[rk]).replace(/[*_`]+/g,''):null;if(!rt)continue;
  const hit=kffPairs(rt).filter(p=>(' '+krulNorm(p.q)+' ').includes(' '+f+' '));
  if(!hit.length)continue;if(!rows)rows=kkjvRows();let why=null,ref=null;
  for(const p of hit){const r=p.book+' '+p.ch+':'+p.v1+(p.v2!==p.v1?'-'+p.v2:'');const kt=kffVerse(p,rows);
   if(!kt){report.push('NOT CHECKED (the verse was not read this run): '+id+' FAILS "'+m[6].slice(0,120)+'" quoted in ['+rk+'] as '+r);continue;}
   if((' '+krulNorm(kkjvNoMargin(kt))+' ').includes(' '+f+' ')){ref=r;why='its FAILS quotation "'+m[6].slice(0,200)+'" is only the words of '+r+', a verse the answer quotes in ['+rk+']; it shows what the verse says, not what in the answer fails (ruling 411)';break;}}
  if(!why)continue;
  items.push({rule:'K-FF',side:'BOTH',link:id,ref,fails:m[6],why,line:'FORCED line for '+id+': '+why+'. Write the FORCED line again with FAILS: "<the answer\'s own words in ['+rk+'] that fail to show the fit, outside its verse quotations>", or RETRACTED for the link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or RESTATED it not graded LINK BROKEN. Your line: '+l.slice(0,600)});
  marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-FF) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}
 return {items,marks,report};}
function kfcLines(text,R,rows0){const items=[],marks=[],report=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');let rows=rows0||null;
 for(const raw of T.split('\n')){const l=raw.trim();if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;const m=l.match(KF_LINE);if(!m)continue;
  const id=m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase().replace('VS','vs');const rk=m[2].toUpperCase();const v=kfcVerse(m[3],R&&R[rk]);const cb=l.match(KFC_CB);let why=null;
  if(!cb)why='the FORCED line has no CARRIED BY: "<the words of '+(v?v.ref:'the pressed verse')+' that state its MEANS>" (W3 B7)';
  else if(kkjvFold(cb[1]).split(' ').filter(Boolean).length<3)why='its CARRIED BY quotes fewer than three words';
  else{if(!rows)rows=kkjvRows();const kt=kfcText(v,rows);
   if(!v){report.push('NOT CHECKED (the press of '+id+' names no reference the code found): CARRIED BY "'+cb[1].slice(0,120)+'"');continue;}
   if(!kt){report.push('NOT CHECKED (the verse was not read this run): '+v.ref+' CARRIED BY "'+cb[1].slice(0,120)+'"');continue;}
   if(!kkjvStands(cb[1],kt))why='its CARRIED BY words "'+cb[1].slice(0,160)+'" are not in '+v.ref+', which reads: "'+kkjvNoMargin(kt).replace(/\s+/g,' ').trim().slice(0,400)+'"';}
  if(!why)continue;
  items.push({rule:'K-FC',side:'BOTH',link:id,ref:v?v.ref:null,means:m[3],why,line:'FORCED line for '+id+': '+why+'. Write the FORCED line again with CARRIED BY: "<the words of '+(v?v.ref:'the pressed verse')+' that state the MEANS sentence, quoted from the KJV>" between FAILS and GROUND, or RETRACTED for the link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or RESTATED it not graded LINK BROKEN. Your line: '+l.slice(0,600)});
  marks.push('[AUDIT v48: DEBATE RULE VIOLATION (K-FC) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}
 return {items,marks,report};}
const UNX_TAG=/\[?\bL([1-4])\b\]?/g;
const UNX_OTHER=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b|\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bROWS\s+GIVE\b|\bASSUMES\b|\bno\s+(?:quoted\s+)?row\s+gives\b/i;

function unxLack(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));const named=[];
 for(const m of t.matchAll(/\[?\bL([1-4])\b\]?/g)){const pre=t.slice(Math.max(0,m.index-40),m.index).split(/[.;]/).pop();const post=t.slice(m.index+m[0].length,m.index+m[0].length+60).split(/[.;]/)[0];
  if(/\b(?:no|not|nothing|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\b[^\[]*$/i.test(pre)||/^\s*(?:layer\s+)?(?:(?:is|are)\s+)?(?:missing|absent|lacking|not\s+(?:exhibited|shown|given|present|there))\b/i.test(post)||/^[^\[]{0,30}?\b(?:does|do|did|is|are)\s+not\b|^[^\[]{0,30}?\bfails?\b/i.test(post))named.push(m[1]);}
 return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}

const UNX_MW=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const UNX_MRUN=(a0,b0,k0)=>{const a=' '+UNX_MW(a0)+' ',b=UNX_MW(b0);if(!b)return false;if(a.includes(' '+b+' '))return true;const bw=b.split(' ');const k=Math.min(k0,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
const UNX_MGROUND=/\b(?:meet|meets|meeting|met|answer|answers|answering|answered)\b[^.;]{0,80}?\b(?:MEANS|meaning|significance|inference|claim|claimed|press|pressed)\b/i;


const UNXA_HARD=/\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b/i;
const UNXA_ASM=/\bASSUMES\b/;const UNXA_UNA=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b/i;


function unxaAct(cl){const f=String(cl==null?'':cl).replace(/^[\s\S]*?\bASSUMES\b\s*:?/,'').split(/--\s*ROWS\s+GIVE|\bROWS\s+GIVE\b/i)[0];
 const m=f.match(/\b(?:knew|knows?|knoweth|known|knowing|begat|begot|begets?|begotten|begetting|conceived?|conceives|conceiving)\b(?!\s*(?:of|that|as)\b)/i);return m?m[0]:'';}


const KR_LINE=/^\s*(?:[-•]|\d+[.)])?\s*REFERENCE\s*:\s*(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*(CONFIRMED|NOT CONFIRMED)\s*(?:--|—|–)\s*["“](.+?)["”]\s*\/\s*["“](.+?)["”]\s*\.?\s*$/i;

function kl2Lines(text,L2D){const items=[],marks=[];if(!L2D||!Array.isArray(L2D.ow)||typeof L2C==='undefined')return {items,marks};
 const T=String(text||'').replace(/\\n/g,'\n');const rounds=[];T.split('\n').forEach((l,i)=>{if(/\[L2\]/.test(l)&&/^\s*(?:[-•]|\d+[.)])?\s*[*_]*\s*D\d+\s+vs\.?\s+C\d+/i.test(l))rounds.push(['JUDGE','line '+(i+1),l]);});
 if(!rounds.length)return {items,marks};const R=L2C.check(L2C.tags(rounds),L2D.ow,L2D.lex,L2D.read);
 for(const t of R){if(t.status!=='NOT COUNTED')continue;const id=(t.seg.match(/D\d+\s+vs\.?\s+C\d+/i)||[null])[0]||(rounds.find(r=>r[1]===t.round)[2].match(/D\d+\s+vs\.?\s+C\d+/i)||['L2'])[0];const lk=String(id).replace(/\s+vs\.?\s+/i,' vs ');
  if(items.some(x=>x.link===lk))continue;items.push({rule:'K-L2',side:'BOTH',link:lk,line:rounds.find(r=>r[1]===t.round)[2].trim().slice(0,600),why:t.why});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-L2) -- '+lk+': an [L2] of the seat\'s own ground is NOT COUNTED ('+t.why.replace(/[\[\]]/g,'')+'); a NOT COUNTED [L2] voids that ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
const __CURE396=" FORCED LINK (ruling 411): a K-G4 item on a link you graded BROKEN because the link cannot take the witness's meaning, though the holding side answered it, is cured by one FORCED line for that item, its three quotations standing in the rounds named. FORCED LINK (md_notes_rulings 396): a link that cannot take a proven witness's meaning is forced and breaks; the meaning weighed is the one the debaters exhibit, and you supply none of your own; that no witness states the point in its own words is never a ground, for either side. PROVEN PRESS (md_notes_rulings 398): a witness is a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is not a witness. K-P (you counted a premise UNEXHIBITED, or graded a link BROKEN as left unanswered, on a press the ledger marks UNPROVEN, not a witness, ruling 398): cure a count with CORRECTED COUNT for that side without that premise and the CORRECTED STANDING that count makes true; cure a BROKEN line with RETRACTED for it, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or one RESTATED line for it that is not graded LINK BROKEN, or one RESTATED LINK BROKEN line that names, as left unanswered, a verse that the list against that side carries under PRESSED WITH: and the ledger marks PROVEN or PROVEN BY REFERENCE. K-F (a FORCED line whose quotations do not each stand in the round named, or a link graded BROKEN as forced with no FORCED line): cure it with one FORCED line for the item, FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<the MEANS sentence with its layers>\" -- ANSWER [<round>]: \"<the holding side's answer>\" -- FAILS: \"<the layer of that answer that fails>\", each quotation word for word in the round it names, or with RETRACTED for the line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or one RESTATED line not graded LINK BROKEN. K-R (a press proven by reference with no REFERENCE line, or a REFERENCE line whose quotations the rounds do not hold): cure it with one REFERENCE line: REFERENCE: <the press's reference> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- \"<the referenced block's stated meaning>\" / \"<the press's MEANS sentence>\". K-L2 (an [L2] of your own, in a COLLISION POINTS line, whose word stands in no verse that line cites): cure it with RETRACTED for the line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or one RESTATED line whose [L2] words each stand in a verse it cites, or that drops the [L2]. ";
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
const KW_NH=true;
const ENF_STATUS={'K-B':'LIVE','K-C':'LIVE','K-G1':'LIVE','K-G3':'LIVE','K-G4':'LIVE','K-G6':'LIVE','K-G7':'LIVE','K-G8':'LIVE','K-N':'LIVE','K-S':'LIVE','K-SC':'LIVE',
 'K-LB':'TRIAL','K-G9':'TRIAL','K-G10':'TRIAL','K-G11':'TRIAL','K-V':'LIVE','K-S2':'TRIAL','K-LXX':'TRIAL','K-P':'TRIAL','K-F':'LIVE','K-FC':'TRIAL','K-FF':'TRIAL','K-UNX':'TRIAL','K-R':'TRIAL','K-L2':'TRIAL','K-W':'LIVE','K-S3':'LIVE','C4-RENUM':'TRIAL','C4-PRESS':'TRIAL','K-CON':'LIVE','K-CMT':'LIVE','K-CMTL':'TRIAL','K-RUL':'TRIAL','K-KJV':'TRIAL','K-AG':'TRIAL'};
const enfStatus=r=>ENF_STATUS[String(r||'')]==='TRIAL'?'TRIAL':'LIVE';
const enfLive=x=>enfStatus(x&&x.rule)==='LIVE';



const DRV_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
const DRV_REF_END=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}(?:\s?[-–]\s?\d{1,3})?[\s*_]*$/;
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/;
const DRV_QUOTE=/(?:^|[\s(\[{"“'‘:,;—–-])(?:["“][^"”\n]{4,}?["”]|['‘][^\n]{4,}?['’])(?=$|[\s.,;:!?)\]}"”'’—–-])/;
const DRV_NEG=/\b(?:no|without|lacks?|lacking|not)\s+(?:\[L[1-4]\]\s*(?:or|and|\/)\s*)*$/i;
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const DRV_TL_AFTER=/^\s*[*_]*\s*(?:(?:Greek|Hebrew|Aramaic)\s+)?[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*(?:\(\s*[^()\n]{2,80}\)|,\s*["“]?[a-z]|:\s*["“]?[a-z]|=\s*["“]?[a-z]|\s+(?:meaning|means|i\.e\.)\b)/;
const DRV_TL_BEFORE=/(?:^|[\s(,;])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*[^()\n]{2,80}\)\s*$/;
const DRV_TL_ANY=/(?:^|[\s(,;:"“'‘])[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const DRV_TL_PAIR=/\(\s*[*_]*([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})[*_]*\s*,\s*([a-z][a-z'’ -]{1,40}?)\s*\)/g;

function drvLayers(text){return lbFoot(text,true);}


const drvKinds=(line)=>drvLayers(line);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;
const DRV_ANS=/[\[(](?:CR[2-4]|DR[1-3])\b/i;
const DRV_BARE=/\b(?:in|at|by|from)\s+(?:CR[2-4]|DR[1-3])\b/i;
const DRV_UNANS=[/\b(?:was|were|is|are)\s+(?:left\s+)?(?:not\s+named|unnamed|unanswered|not\s+answered)\b/gi,/,\s*not\s+named\b/gi,/\bleft\s+(?:\S+\s+){1,8}?unnamed\b/gi,/\bunanswered\s+(?:[1-3]\s+)?[A-Z][a-z]+\s+\d+:\d+/g,/\bthe\s+unanswered\s+[a-z]+/gi];
const DRV_UNEG=/\b(?:no|neither|nor|not|never|without|cannot)\b/i;

const NET_STATE=[
 /\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert(?:(?<!\b(?:that|this|its|the)\s+(?:\[[CD]R\d\]\s+)?quotation\b[^;.]{0,100}assert)|(?!s?\s+(?:the\s+)?added\b)))s?\b/i,
 /\bin\s+(?:its|their)\s+own\s+words\s+(?:state|name|assert|deny)s?\s+no\b/i,
 /\bnot\s+stated\b/i,
 /\bunstated\b/i,
 /\b(?:never|neither|nor)\s+(?:names?|states?)\b/i,
 /\bnone\s+of\s+(?:those|them|these|the)\b[^;.]*?\b(?:states?|names?)\b/i,
 /\bno\s+(?:verse|witness|row|passage)s?\s+(?:\S+\s+){0,3}?(?:states?|names?)\b/i,
 /\b(?:no|neither|nor)\s+(?:\S+\s+){0,2}?(?:verse|witness|row|passage|text)(?:['\u2019]s|s)?\s+own\s+words\s+(?:\S+\s+){0,2}?(?:states?|names?|says?)\b/i,
 /\bnames?\s+no\b/i,
 /\bnames?\b[^;.]{0,60}?\b(?:rather\s+than|not)\b[^;.]{0,30}?\bbegett/i,
 /\bstating\b[^;.]{0,40}?\bin\s+(?:its|their)\s+own\s+words\b/i,
 /\bnowhere\s+(?:states?|names?|says)\b/i,
 /\bno\s+(?:exhibit|passage|text)s?\s+(?:\S+\s+){0,4}?(?:says?|states?)\b/i,
 /\bwithout\s+(?:a\s+single|any|one)\s+(?:\S+\s+){0,2}?(?:text|verse|witness|row|passage)s?\s+(?:stating|naming|that\s+states?)\b/i];
const NET_ANSWER=/((?:defen[cs]e|defender|challenger|rounds?|block|reply|answer|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?)((?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?name[sd]?|never\s+names?|not\s+named)(?=[^;.]{0,50}?(?:\d+:\d+|witness|verses?|them|those|rows?))/gi;
const NET_ANSWER_R=/(\b(?:which|whom)\s+(?:the\s+)?(?:later\s+)?(?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?\(?[CD]R\d\]?\)?)(?:'s\s+(?:\S+\s+){0,2}?)?\s*)((?:do|does|did)\s+not\s+(?:\S+\s+){0,2}?name[sd]?|never\s+names?)\b/gi;
const NET_ANSWER_U=[/((?:defen[cs]e|defender|challenger|rounds?|block|reply|link\s+round|\[?[CD]R\d\]?|\(?[CD]R\d\)?)[^;.]{0,60}?\b(?:left|leaves|leave)\s+(?:\S+\s+){0,6}?)unstated\b/gi,
 /(\b(?:went|goes|go|was|were|remains?|remained|stays?|stayed)\s+)unstated(?=\s+(?:in|by|at)\s+(?:(?:the\s+)?(?:defen[cs]e|defender|challenger|link\s+round|rounds?)\b|\[?\(?[CD]R\d))/gi];
const NET_QUOTE=/["“][^"”\n]{2,}?["”]/g;
const NET_CONC=/\bCONCEDED\s*\(\s*stated\s*\)/i;
const NET_QUOTE1=/(?<=^|[\s(\[:])'[^'\n]{3,200}?'(?=[\s,.;:)\]]|$)/g;
function netMask(cl){let t=String(cl).replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'").replace(NET_ANSWER,'$1[answer-check]').replace(NET_ANSWER_R,'$1[answer-check]');for(const rx of NET_ANSWER_U)t=t.replace(rx,'$1[answer-check]');return t;}
function netKeeps(text){{const __s=String(text||'').replace(/[*_`]+/g,''),__m=__s.match(/\b(?:contradicted\s+by|cannot\s+agree\s+with)\b/i);if(__m){const __a=__s.slice(__m.index);if(/\[L1\]/.test(__a)&&drvKinds(__a).length>=2)return false;}} /* pkgKCR v2 (W3 3009): a contradiction ground with layers is the line's ground, not the stating phrase */for(const c0 of drvGround(String(text||''),null).split(  /;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
 const hit=NET_STATE.find(rx=>rx.test(cl));if(!hit)continue;const pre=cl.slice(0,cl.search(hit));if(NET_REPORT.test(pre)||NET_CONC.test(pre))continue;if(netPrecept(c0,drvGround(String(text||''),null)))continue;  return true;}return false;}
const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b|\b(?:conceding|concedes|admitting|admits|granting|grants)\b/i;
const NET_CLAIM=/\b(?:challenger|defender)\s+(?:reads|read|claims|claimed|says|said|argues|argued|takes|took|holds|asserts|asserted|presses|pressed)\b[^;]{0,160}?\b(?:as\s+(?:saying|stating|meaning)|to\s+(?:say|state|mean))\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+|\bscripture\b|\bnowhere\b|\bno\s+(?:exhibit|passage|text)s?\b|\ba\s+single\s+(?:\S+\s+)?(?:text|verse|witness|row|passage)\b/i;
const NET_PRECEPT=/\b(?:scriptures?|precept\s+upon\s+precept)\b/i;
const netFoot=s=>/\b(?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+/.test(String(s||''))||/\[L[1-3]\]/.test(String(s||''));const netPrecept=(cl,line)=>NET_PRECEPT.test(cl)&&(netFoot(cl)||netFoot(line));
const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:/;
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|COLLISION POINTS)\b/i;

function netUnwrap(text){let t=String(text||'');const s=t.trim();if(s[0]==='{'){const s2=(!/\}\s*$/.test(s)&&/"\s*$/.test(s))?s+'}':s;  const i=s2.lastIndexOf('}');try{const j=JSON.parse(s2.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;}




const CNT_HEAD=/^[ \t>#-]*(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/i;
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





function kcmtlSeg2024(text,k){for(const s of String(text||'').split(/;|\n/)){const m=s.match(/^\s*lines?\s+((?:\d+\s*(?:,|and|&)?\s*)+)\s*(?::|--|\u2014|\u2013|-)\s*([\s\S]*)$/i);if(m&&(m[1].match(/\d+/g)||[]).map(Number).includes(k))return s.trim();}return null;}



const __KRUL_HEADS=["Commitment 1. The record is the only evidence.", "Commitment 2. I repair nothing.", "Commitment 3. Meaning, not words.", "Commitment 4. One standard for both sides.", "Commitment 5. Silence is not neutral.", "Commitment 6. I void only by quoting.", "Commitment 7. I judge; I do not only count.", "Commitment 8. The method is Isaiah 28:10.", "Commitment 9. I answer in the form each request gives.", "Commitment 10. I capture contradictions.", "Commitment 11. I show every ruling that decides.", "Commitment 12. I judge by the 1611 KJV alone."];



function krulNorm(s){return String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/\[[lr]\d\]/g,' ').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,' ').replace(/\s+/g,' ').trim();}
function krulFound(q,src){const parts=String(q||'').split(/\.\.\.|\u2026/).map(krulNorm).filter(p=>p.split(' ').length>=2);if(!parts.length)return false;const S=' '+krulNorm(src)+' ';return parts.every(p=>S.includes(' '+p+' '));}
function krulText(text){let T=String(text||'');let J=null;const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){J=null;}}return {T:T.replace(/\n\n\[AUDIT v[\s\S]*$/,''),J};}

function krulCards(T){const L=[];String(T||'').split('\n').map(l=>l.replace(/[*`]+/g,'').trim()).forEach(l=>{const m=l.match(/(?:^|\|\s*)((?:[-\u2022]\s*)?RULING\s*(?:--|\u2014|\u2013|:)[\s\S]*)$/);if(m&&/\bCLAIM\s*:/.test(m[1])&&/\bNAMED BY\s*:/.test(m[1])){m[1].split(/\s+(?=(?:CLAIM|NAMED BY|RULE|APPLIED)\s*:)/).forEach(p=>L.push(p.trim()));}else L.push(l);});const cards=[];
 for(let i=0;i<L.length;i++){const m=L[i].match(/^(?:[-•]\s*)?RULING\s*(?:--|—|–|:)\s*(.*)$/i);if(!m)continue;const segs=m[1].split(/\s+(?:--|—|–)\s+/);const c={head:L[i],target:segs[0]||'',grade:(segs.length>1?segs[segs.length-1]:'').trim().replace(/[.;,]+$/,''),f:{}};
  for(let k=i+1;k<L.length&&k<=i+8;k++){if(/^(?:[-•]\s*)?RULING\s*(?:--|—|–|:)/i.test(L[k]))break;const f=L[k].match(/^(?:[-•]\s*)?(CLAIM|NAMED BY|RULE|APPLIED)\s*:\s*(.*)$/i);if(f&&!(f[1].toUpperCase() in c.f))c.f[f[1].toUpperCase()]=f[2].trim();}
  cards.push(c);}
 return cards;}
function krulMatch(c,id,ctx){const t=c.target;const X=ctx||{};if(id==='keystone'){if(/\bkeystone\b/i.test(t))return true;const lone=String(t).trim().match(/^(D\d+)\s*$/i);return !!lone&&(!X.ks||lone[1].toUpperCase()===X.ks);}
 {const pm=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(pm&&!/\b(DEFENDER|CHALLENGER)\b/i.test(t)&&new RegExp('\\bpremise\\s*'+pm[2]+'\\b','i').test(t)&&X.ps&&Array.isArray(X.ps[pm[2]])&&X.ps[pm[2]].length===1&&X.ps[pm[2]][0]===pm[1])return true;}
 let m=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(m)return new RegExp('\\b'+m[1]+'\\b','i').test(t)&&new RegExp('\\bpremise\\s*'+m[2]+'\\b','i').test(t);
 m=id.match(/^(D\d+) vs (C\d+)$/);if(m){if(new RegExp('\\b'+m[1]+'\\s*vs\\.?\\s*'+m[2]+'\\b','i').test(t))return true;for(const g of String(t).matchAll(/((?:\bD\d+\s*(?:,\s*(?:and\s+)?|\s+and\s+|\s*&\s*))+D\d+)\s*vs\.?\s*(C\d+)\b/gi)){if(g[2].toUpperCase()===m[2].toUpperCase()&&(g[1].match(/D\d+/gi)||[]).some(d=>d.toUpperCase()===m[1].toUpperCase()))return true;}}  return false;}
const KRUL_BAD=/^(?:UNEXHIBITED|VOID|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|BROKEN)\b/i;
function krulQs(nb){const s=String(nb||'');const out=[];const used=[];const dq=[...s.matchAll(/["\u201c]([^"\u201d]{3,})["\u201d]/g)].map(m=>[m.index,m.index+m[0].length]);
 for(const m of s.matchAll(/(^|[\s(\[;:,])['\u2018]((?:[^'\u2018\u2019]|['\u2019](?=[A-Za-z]))+?)['\u2019](?=$|[\s.,;:!?)\]])/g)){const a=m.index+m[1].length;const e=a+m[0].length-m[1].length;if(dq.some(([x,y])=>a>x&&e<y))continue;  used.push([a,e]);if(m[2].trim().length>=3)out.push(m[2]);}
 for(const m of s.matchAll(/["\u201c]([^"\u201d]{3,})["\u201d]/g)){if(!used.some(([a,b])=>m.index>=a&&m.index<b))out.push(m[1]);}
 return out;}
function krulCheckCard(c,SRC,own){if(!c)return 'no ruling card';const miss=['CLAIM','NAMED BY','RULE','APPLIED'].filter(k=>!c.f[k]);if(miss.length)return 'the card has no '+miss.join(', ')+' line';
 const nb=c.f['NAMED BY'];if(/^NONE\b/i.test(nb)){if(KRUL_BAD.test(c.grade.toUpperCase()))return 'NAMED BY: NONE, so the ruling cannot rest on that meaning, yet it is graded '+c.grade;}
 else{const qs=krulQs(nb);if(!qs.length)return 'the NAMED BY line quotes nothing';const bad=qs.find(q=>!krulFound(q,SRC));if(bad)return 'the NAMED BY quote "'+bad.slice(0,120)+'" does not stand in the record';}
 const r=c.f['RULE'].match(/Commitment\s*(\d+)\s*(?:--|—|–|:)?\s*(?:["\u201c]([^"\u201d]+)["\u201d]|['\u2018](.+)['\u2019]\s*\.?\s*$)/i);if(r&&r[2]==null)r[2]=r[3];  if(!r)return 'the RULE line is not in the form Commitment <N> -- "<your accepted line>"';
 if(own&&own[+r[1]]&&krulNorm(own[+r[1]])!==krulNorm(r[2]))return 'the RULE quote differs from your accepted line for Commitment '+r[1]+' ("'+own[+r[1]].slice(0,120)+'")';
 return null;}

/* pkgRP8 (reader item 8): a RESPONSE or STATEMENT line as the shared reader reads it gives its answer text; any other line keeps the old read */
function kconUnlabel(l){try{const r=__RL.readLine(String(l==null?'':l).trim());if(r&&r.form==='STATEMENT'&&r.f&&!r.f.restated&&typeof r.f.text==='string'&&r.f.text.trim())return r.f.text;}catch(e){}return kconUnlabel0(l);}
function kconUnlabel0(l){return String(l==null?'':l).replace(/^\s*(?:[-•*>]\s*)?\**\s*(?:RESPONSE\**\s*:[^|\n]*\|\s*|STATEMENT\**\s*:\s*)\**\s*/i,'');}
function nhqFull(line,rounds){const L=String(line||'');const R=rounds||{};const Nr=s=>String(s||'').replace(/\\"/g,'"').replace(/[\u201c\u201d\u2018\u2019"]/g,"'").replace(/[*_`]+/g,'').replace(/\s+/g,' ');const out=[];
 const re=/(?:\[([CD]R\d)\]|\b([CD]R\d)\s*:)[^"\[\]]{0,80}?"/g;let m;while((m=re.exec(L))){const rk=m[1]||m[2];const a=m.index+m[0].length;const b=L.indexOf('"',a);let q=Nr(b<0?L.slice(a):L.slice(a,b)).replace(/\s*(?:\.\.\.|\u2026)\s*$/,'').trim();
  if(b>=0)re.lastIndex=b+1;const t=Nr(R[rk]);if(!t||q.length<12)continue;const k=q.slice(0,60);const p=t.indexOf(k);if(p<0)continue;
  const from=p+Math.max(q.length-1,0);const e=t.slice(from).search(/(?<!\.)[.!?](?!\.)(?=["')\]]*(?:\s|$))/);  const full=t.slice(p,e<0?Math.min(t.length,p+1500):from+e+1).slice(0,1500);if(full.length>=q.length)out.push(full);}
 return out;}
/* pkgXK: among the cards krulMatch ties to item x, the card whose RULING target names the fewest K-RUL items of the build (__XK_ITEMS, set by cureVerdicts); first on a tie */
function xkCard(cards,x){const I=((typeof __XK_ITEMS!=='undefined'&&__XK_ITEMS)||[]).filter(y=>y&&y.rule==='K-RUL');const m=(c,y)=>{try{return krulMatch(c,y.ruling||y.link,y.krul_ctx||null);}catch(e){return false;}};let b=null,bn=Infinity;for(const c of cards){if(!m(c,x))continue;const n=I.length?new Set(I.filter(y=>m(c,y)).map(y=>String(y.ruling||y.link))).size:0;if(n<bn){b=c;bn=n;}}return b||undefined;}
function krulCure(x,replyText,rounds,respText){const T=krulText(replyText).T;
 if(x.rule==='K-RUL'){const c=xkCard(krulCards(T),x); /* pkgXK */const why=krulCheckCard(c,Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n'),null);return why?{st:'UNCURED',why}:{st:'CURED',why:'a valid ruling card for '+(x.ruling||x.link),line:c.head};}
 if(x.rule==='K-CMT'||x.rule==='K-CMTL'){const rp=String(respText||'');if(/\bCommitments?\s*\d+/i.test(rp)||/\bNOT A GRADE\b/.test(rp))return {st:'CURED',why:'the response names the commitment, or NOT A GRADE',line:rp};return {st:'UNCURED',why:rp?'the RESPONSE names no Commitment N and no NOT A GRADE':'no written response'};}
 if(x.rule==='K-CON'){const qs=[...String(x.line||'').matchAll(/"([^"]{12,})"/g)].map(m=>m[1]).concat(nhqFull(x.line,rounds));
  const runs=[];for(const q of qs){const w=krulNorm(q).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));}
  const ln=T.split('\n').find(l0=>{const l=kconUnlabel(l0);return /^\s*(?:[-•*]\s*)?\**(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+krulNorm(l)+' ').includes(' '+r+' '));});
  return ln?{st:'CURED',why:'captured with a quote of the flagged sentence',line:ln.trim()}:{st:'UNCURED',why:'no CONTRADICTION, NOT HELD or REASSERTED IN line quotes the flagged sentence'};}
 return null;}
function krulRestated(items,reply,rounds){const out=[];const T=krulText(reply&&reply.ok?reply.text:'').T;if(!T)return out;
 const covered=new Set((items||[]).filter(x=>x&&x.rule==='K-RUL').map(x=>x.ruling||x.link));const cards=krulCards(T);const SRC=Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n');const seen=new Set();
 for(const l of T.split('\n')){const m=ri5Restated2024(l)||l.replace(/[*`]+/g,'').match(/^\s*(?:[-•]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);if(!m)continue; /* pkgRI5 */const id=m[1].toUpperCase()+' vs '+m[2].toUpperCase();if(covered.has(id)||seen.has(id))continue;seen.add(id);
  const why=krulCheckCard(cards.find(c=>krulMatch(c,id)),SRC,null);if(!why)continue;
  out.push({rule:'K-RUL',side:'JUDGE',link:id+' (restated in the cure)',ruling:id,line:'restated line '+id+' in the cure reply: '+why,judge_statement:null,response:null,status:'UNCURED',why:'TRIAL, recorded only: the cure reply restated '+id+' without a valid ruling card ('+why+')',statement:l.trim().slice(0,400),kinds:[]});}
 return out;}
function kkjvRows(){try{const g=(typeof $==='function')?$:null;return g?g('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book):[];}catch(e){return [];}}
function kkjvFold(s){return String(s==null?'':s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
function kkjvNoMargin(s){return String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');}
function kkjvUnGloss(s,cited){const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=kkjvFold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});}
function kkjvSegs(q,cited){let p=String(kkjvNoMargin(q)).split(/\.\.\.|…/);const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';
 if(p.length>1){const last=kkjvFold(kkjvUnGloss(p[p.length-1],cited));if(last&&!cv.includes(' '+last+' '))p=p.slice(0,-1);}return p.map(x=>kkjvFold(kkjvUnGloss(x,cited))).filter(Boolean);}

function kkjvStands(q,cited){if(!cited)return false;const segs=kkjvSegs(q,cited);if(!segs.length)return false;
 const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;}

const KKJV_REF=/\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;
const KKJV_Q=/^[\s,:;(\-–—]{0,6}(?:\[L1\]\s*)?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z0-9])['‘](?!s\b|\s)((?:[^'‘’\n]|['’](?=[a-z])){6,400}?)['’](?![a-z]))/;
const KKJV_VER=/\b(RSV|NRSV|NIV|ESV|NASB|NKJV|NLT|Septuagint|LXX)\b/;


const KAG_OK=['MEETS','MISSES','FAILS','UNPROVEN'];
function kagNorm(s){return String(s==null?'':s).toUpperCase().replace(/[^A-Z0-9:;]+/g,' ').replace(/\s+/g,' ').trim();}
function __acRead(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form==='ANSWER CHECK'&&r.f&&!r.f.restated?r.f:null;}catch(e){return null;}}
function kagRow(l){const f=__acRead(l);if(f&&f.answer!==undefined){  const s=String(l||'').replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022>]|\d+[.)])?\s*/,'').trim();
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


const knNarrow=it=>it.tag==='CONCEDED'&&it.quotes.length>0&&it.quotes.every(q=>KN_NARROW.test(q)&&!KN_SURR.test(q));

function knLines(text){const out=[];const seen=new Set();for(const it of cntItems(text)){if(!it.one||!knNarrow(it)||seen.has(it.label))continue;seen.add(it.label);out.push({item:it.label,side:it.side,line:it.line,premise:it.n});}return out;}
const SC_CONC=/(?:\[?\bCR[1-4]\b\]?|\bdefen(?:der|se)(?:'s)?\b)[^;]{0,60}?\b(?<!not\s|never\s)conced(?:ed|es)\b(?!\s+nothing)/i;

const KK_GROUND=/\d+:\d+|\[?\b[CD]R[1-4]\b\]?|\bround\b|\bLINK\s+\d|\[L[1-4]\]|\b(?:answered|unanswered|refuted|refutes|withdrawn|withdrew|withdraws|conceded|concedes|pressed|witness\w*|GROUND|because|since|exhibit\w*|footing|premise|chain|verse|row)\b/i;
function kkLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const m=ri6Kk2024(line,/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i); /* pkgRI6 */if(!m)continue;
  const rs=m[3].replace(/^[\s.\-–—:]+/,'').trim();if(rs.split(/\s+/).length>=3&&!KK_GROUND.test(rs))out.push({item:'KEYSTONE',side:'DEFENDER',line});}
 return out;}

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

const KS2_FORMS=[/\bno\s+(?:\S+\s+){0,2}?witness(?:['’]s|es)?\s+(?:own\s+words\s+)?(?:\S+\s+){0,3}?(?:states?|says?|names?)\b/i,/\bnone\s+(?:of\s+(?:\S+\s+){1,2})?states?\s+that\b/i,
 /\bstates?\s+no\s+(?!round\b|later\b|answer\b)[a-z]+/i,/\bin\s+(?:its|their|his|her)\s+own\s+words\b/i];
function ks2Grounds(line){const t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];if(!gs.length)return [drvGround(line,null)];
 return gs.map((g,k)=>t.slice(g.index+g[0].length,k+1<gs.length?gs[k+1].index:t.length)).map(s=>s.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"));}
function ks2Hit(text){for(const g of (Array.isArray(text)?text:[text]))for(const c0 of String(g).split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
  const hit=KS2_FORMS.concat(NET_STATE,[DRV_STATE]).find(rx=>rx.test(cl));if(!hit)continue;const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at)))continue;return cl.trim();}
 return null;}
function ks2Keeps(text){return !!ks2Hit(ks2Grounds(text));}

const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_GLOSS=/(?:^|[\s(,;:"“'‘])[*_]*([^\s()"“”,;:]{2,24}(?:\s+[^\s()"“”,;:]{2,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');t=t.replace(/(?<![A-Za-z])["“]([A-Za-z]{1,3})["”](?![A-Za-z])/g,'‘$1’'); /* pkgKBL */
 if(!full){const c=t.search(/^[ \t>*_#-]*(?:the\s+)?pressed(?:\s+(?:verses|witnesses))?\s*[.:]/im);if(c>0)t=t.slice(0,c);}
 const met=new Set();const src=/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b/i.test(t);let first=null;
 for(const s of t.split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const refs=[...s.matchAll(LB_REF)].map(m=>m[0].replace(/\.\s/,' '));
  const hasQ=/["“][^"”\n]{4,}?["”]|(?:^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/.test(s);
  for(const m of s.matchAll(LB_TL)){const w=m[2];const last=w.split(/\s+/).pop();if(DRV_TL_STOP.test(last)||DRV_TL_STOP.test(w.split(/\s+/)[0]))continue;
   if(DRV_SRC.test(w)||m[1]||src){met.add('L2');break;}}
  for(const m of s.matchAll(/(?:^|[\s(,;:"“'‘\]])([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24})\s*\(\s*(?:[GH]\d{1,5}\s*[,:;]\s*["“'‘]?[a-z][^()\n]{1,80}?|["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*[,;]\s*[GH]\d{1,5})\s*\)/g)){if(!DRV_TL_STOP.test(m[1])){met.add('L2');break;}} /* pkgKBL */
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(\s*["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*\)/g)){if(m[2].split(/\s+/).some(w=>!DRV_TL_STOP.test(w)&&!/^[A-Z]/.test(w))){met.add('L2');break;}}
  if(DRV_SRC.test(s.replace(LB_REF,' ').replace(/["“][^"”]*["”]/g,' '))&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(s))met.add('L2');}
 {const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n|]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)].map(m=>({a:m.index,b:m.index+m[0].length}));
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}}
 return [...met].sort();}
function lbBlockText(round,j){const s=String(round||'');const c=s.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);const t=c>=0?s.slice(0,c):s;const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t.slice(h.index,j<H.length?H[j].index:t.length):'';}


const CURE_FAMS=['deepseek','openai','gemini','grok','mimo','openrouter'];
const CURE_RULE="DEBATE RULE VIOLATION. After you answered, the system checked every COLLISION POINTS line you graded DEFENDER LINK BROKEN or CHALLENGER LINK BROKEN. "
 +"Each such line must exhibit, on the line itself or on the line directly under it, at least two lower layers of DIFFERENT kinds, read by FOOTING LAYERS (md_notes_rulings 400). FOOTING LAYERS (judge_fix8; the definition the system link-round check uses; md_notes_rulings 400: L3 is supporting verse(s) for L1): a quoted KJV verse given with its book, chapter and verse is [L1], whether or not it is tagged; a named Hebrew or Greek word given with its meaning is [L2]; any other verse quoted with its book, chapter and verse after that [L1] verse, as its support, is [L3], whether or not it is tagged, the same chapter included. A reference with no quotation adds no layer. A tag alone makes no layer, and relabelling a verse in a judgment does not change what the block shows. The lines below do not. For each one, either cure it with one RESTATED line: that collision line again, "
 +"beginning with its link, with the same grade and the two layers exhibited on it; or answer in prose why it stands (recorded; prose cures nothing). "
 +"Do not change any other line, grade or count. A line that is not cured leaves the violation standing, and this judgment is then not counted.";
const CURE_RULE_G="COUNT AND STANDING (same rule). Your own numbers must agree with your own COLLISION POINTS lines. WITNESS (md_notes_rulings 392, 398): in every item below a witness is a verse a listed premise carries under PRESSED WITH: (the list that closes [DR2] against the defender, the list that closes [CR3] against the challenger) as a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is not a witness; a verse under no PRESSED WITH: line is not a witness, and left unanswered it is no BROKEN ground and is never counted. "
 +"K-G1 (a conceded count of 0 beside a link you graded BROKEN on a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered): cure it either with CORRECTED COUNT for that side, "
 +"the number at least the number of that side's K-G1 links, together with, for each such link, a PRESSED line quoting the words of the earlier round "
 +"that pressed the witness (against the defender: [DR1] or [DR2]; against the challenger: [CR1], [CR2] or [CR3]); or with RETRACTED for that link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply. "
 +"K-G4 (any other link you graded BROKEN on a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered): cure it with a PRESSED line quoting the words of the earlier round that "
 +"pressed the witness (rounds as for K-G1), or with RETRACTED for that link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply. Where your line names no pressed witness left unanswered, the break rests on meaning (ruling 421): only one FORCED line cures it, or RETRACTED with a reason that quotes 6 or more words, word for word, from a round of the side that holds the link, or names a verse of the line that such a round names. "
 +"For a K-G1 link whose cited verse any later round of the side that holds the link names ([CR2], [CR3] or [CR4] against the defender, [DR1], [DR2] or [DR3] against the challenger, each after the pressing round), add a SHORT line "
 +"quoting the words of that round that answer it and saying from the text why they do not overturn the link; without it the link is not cured. "
 +"For a K-G4 link the system searches every later round of the side that holds the link ([CR2], [CR3] or [CR4] against the defender; [DR1], [DR2] or [DR3] against the challenger, each after the pressing round) for each pressed witness your line and your PRESSED quotation name, each witness on its own; a witness one of those rounds names was answered. The BROKEN grade is unanswered-false when every witness the line rests on as unanswered was answered: those its GROUND names, or all of them when the GROUND names none. It is then cured by RETRACTED for the line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply or, where the link cannot take the witness's meaning though the witness was answered, by one FORCED line for the item (ruling 411; md_notes_rulings 419); a meaning break is not retracted for being answered. A BROKEN line whose GROUND names no pressed witness left unanswered rests on meaning: it is cured by one FORCED line, or by RETRACTED beside a quoted reason the system verifies (6 or more words of the holding side's own answer, word for word from its round, or the verse of the line its later round names; Eric 2026-11-06). While one of them is named in no later round, the grade stands (judge_fix7 J1). K-W (ruling 421: a side withdrew or granted, in its own round, footing of a link it keeps): first name the fact the withdrawn sentence carried for the link (a descent, a source, a time, a person); if the side still claims that fact anywhere in the link, answer STANDS WITHOUT IT because <that fact> is carried by <the layer, [L1], [L2] or [L3], quoted, that carries that same fact in its own words>; if no layer the side gives carries it, or the side no longer claims it and the link needed it, answer CONCEDED (ruling 428; run 32677: Galatians 4:4 'made of a woman' does not carry 'the seed of David according to the flesh'). Where a later round rests on what was withdrawn, answer REASSERTED IN <round> \"<quote>\". Where the sentence withdraws no footing, answer NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter; quote marks inside the sentence do not end the six words: quote across them, leaving them out). K-S3 (rulings 412 and 421: a close-round concession your count does not mark COUNTED): answer in the RESPONSE line with COUNTED, correcting your count, or with TOUCHES NO LINK: <one line naming why it touches no declared link or listed premise>. K-W is a LIVE rule: an item left unanswered after the cure removes the seat. K-S3 is a LIVE rule: an item left unanswered after the cure removes the seat; NOT HELD: <reason> on the RESPONSE line that quotes at least 6 words in a row of the flagged sentence (all of it if the sentence is shorter), or TOUCHES NO LINK: <reason> on the RESPONSE or the STATEMENT line, answers it. "
 +"K-G3 (a standing graded SELF-SUPPORTED while links of that side are graded BROKEN): cure it either with CORRECTED STANDING for that side, "
 +"PROP-DEPENDENT or COLLAPSED, or with RETRACTED for each BROKEN link of that side, each with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply. "
 +"K-G6 (a premise listed against a side that the PRESSED-WITNESS LEDGER marks NOT NAMED (a verse the premise carries under PRESSED WITH:, md_notes_rulings 392), which your CONCEDED LINKS or CHALLENGER CONCEDED LINKS "
 +"does not count): the rule you were given reads \"A verse marked NOT NAMED is unanswered by the rule\" and \"A premise whose pressed witness goes "
 +"unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings\". Cure it either by counting it: CORRECTED COUNT for that side, "
 +"your count plus every K-G6 premise of that side you do not answer by statement, with CORRECTED STANDING for that side that the count makes true "
 +"(PROP-DEPENDENT or COLLAPSED, as you judge the side's case); or by a STATEMENT for that premise "
 +"that quotes, word for word, the words of the transcript that show the verse is not a pressed witness of that premise. "
 +" K-G10 (your CONCEDED LINKS or CHALLENGER CONCEDED LINKS counts a premise UNEXHIBITED on a verse that no premise of the list against that side carries under PRESSED WITH: -- the list that closes [DR2] against the defender, the CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3] against the challenger): md_notes_rulings 392 reads \"a press must have a premise behind it; a verse pressed without one isn't a witness\"; a verse on a \"cited in\" line of the ledger, or pressed in prose against a link, is not a witness, and leaving it unanswered never counts. Cure it either with CORRECTED COUNT for that side that no longer counts the premise on that verse (your count less every such premise you do not answer by statement), with the CORRECTED STANDING that count makes true (SELF-SUPPORTED at 0 unless a link of that side stands graded BROKEN; PROP-DEPENDENT or COLLAPSED, as you judge the side's case); or with a STATEMENT for the item that quotes, word for word and with its book, chapter and verse, the PRESSED WITH: line that carries the verse.  K-G11 (a COLLISION POINTS line you graded LINK BROKEN that rests, as unanswered, only on verses that no premise of the list against that side carries under PRESSED WITH:, while every verse of the line that the list does carry is named in a later round of that side): under md_notes_rulings 392 such a verse is no BROKEN ground. Cure it with RETRACTED for that line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply; or with one RESTATED line for it that is not graded LINK BROKEN; or with one RESTATED LINK BROKEN line that names, as left unanswered, a verse that the list against that side carries under PRESSED WITH: and the ledger marks PROVEN or PROVEN BY REFERENCE.  K-V (a premise you ruled VOID as charged beyond its quote, where your ruling quotes no words of the charge that go beyond the quote, or names no kind): a charge is stronger than its quote only when it asserts what the quote does not, a negation, a universal (all, none, only, never), or a claim the words of the quote do not make. Cure it with a STATEMENT for the item that names the word that makes the charge stronger, as the pre-check UNIVERSAL TEST lists it, or that quotes, word for word, the charge words that go beyond the quote and names the kind; or by regrading the premise in one RESTATED line for that count (SUPPORTED or NARROWED; or counted UNEXHIBITED or CONCEDED, with CORRECTED COUNT and the CORRECTED STANDING that count makes true). K-S2 (a collision line, or your reasoning line, that rests in any GROUND clause on the retired single-verse ground in another form: no witness states it in its own words, none states that, states no ...): that a verse or witness does not state the point in its own words is never a ground (DG-61). Cure it as K-C: one RESTATED line for the item that drops that ground and weighs the chains on their footing (two layer kinds), or RETRACTED for the line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply.  K-LXX (your text says no Septuagint reading or reference occurred, but the system scan found a round that rests a reading on the Greek Old Testament): cure it with a STATEMENT for the item that names the Septuagint reading and the round that rests on it, quoting that round, or with one RESTATED CITATION CHECK line that names it. "+__CURE396+" K-LB (a link-round block of [CR3] or [DR3] that exhibits fewer than two prior layer kinds, which your count does not count; the burden rule is the same in every round: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them): cure it by counting it, CORRECTED COUNT for that side, your count plus every such premise, with its CORRECTED STANDING; or by a STATEMENT for the item that quotes the block's own words and exhibits, on that line, the two layer kinds the block itself shows, read by FOOTING LAYERS; a tag you add, or a verse you relabel, does not change the block. FOOTING LAYERS (judge_fix8; the definition the system link-round check uses; md_notes_rulings 400: L3 is supporting verse(s) for L1): a quoted KJV verse given with its book, chapter and verse is [L1], whether or not it is tagged; a named Hebrew or Greek word given with its meaning is [L2]; any other verse quoted with its book, chapter and verse after that [L1] verse, as its support, is [L3], whether or not it is tagged, the same chapter included. A reference with no quotation adds no layer. A tag alone makes no layer, and relabelling a verse in a judgment does not change what the block shows. "
 +"K-G7 (a COLLISION POINTS line you graded DEFENDER LINK BROKEN on D<n> while your CONCEDED LINKS does not count premise n): a link is BROKEN "
 +"only for a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered, and a premise whose witness goes unanswered is counted. When your line records an answer to the witness (it does not say the witness went unanswered, or a later round of that side names the pressed witness), the break is one of meaning (ruling 421): the premise is not counted, and the only cures are one FORCED line for the pair or RETRACTED for the line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply. Otherwise cure it either by counting it: CORRECTED COUNT "
 +"for DEFENDER, your count plus every such premise and every K-G6 premise of that side, with the CORRECTED STANDING that count makes true; "
 +"or by regrading it: a RETRACTED line for that link and exactly one CORRECTED RESULT. The same holds for a CHALLENGER LINK BROKEN line for "
 +"a pressed witness under PRESSED WITH: left unanswered while your CHALLENGER CONCEDED LINKS is 0: CORRECTED COUNT for CHALLENGER, or RETRACTED for that link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply. "
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
 +"RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets, then its words quoted or the verse it cites>\n"
 +"CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>\n"
 +"CORRECTED COUNT: <DEFENDER or CHALLENGER> <number>\n"
 +"CORRECTED STANDING: <DEFENDER or CHALLENGER> <SELF-SUPPORTED, PROP-DEPENDENT or COLLAPSED>\n"
 +"PRESSED: D<n> vs C<m> | [<the round that pressed the witness>] | \"<its words, quoted exactly>\"\n"
 +"SHORT: D<n> vs C<m> | [<answering round>] | \"<the words of that round, quoted exactly>\" | <why they do not overturn the link>\n"
 +"STATEMENT: <the flagged item, as labelled above> | <in your own words, why the line stands as you graded it, or what you corrected and why>\n"
 +"RETRACTED: D<n> vs C<m> retracts your BROKEN grade on that line; a retracted line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A BROKEN line you retract is regraded in the same reply: UNDERDETERMINED only with the round that answered each witness named; a pressed witness under PRESSED WITH: left unanswered keeps the line BROKEN in the corrected form; a verse under no PRESSED WITH: line does not (md_notes_rulings 392). A retraction counts only beside one CORRECTED RESULT line: your CLAUSE tag as it stands after your retractions, and that result is the one counted. A STATEMENT line never retracts anything. A judge that retracts a BROKEN line writes the reason in one sentence; a retraction of every BROKEN line that flips the verdict with no reason stated is not a cure, and that judge is not counted. A reason for a retraction names what in the rounds makes the retracted line wrong: the round, and the words or the verse it rests on. A sentence that names only the flag, the rule or the cure it performs is not a reason.\n"
 +"Write one STATEMENT line for every flagged item, cured or not; it is recorded beside the item. Instead of a cure line you may state why the line stands: "
 +"the statement is run through the same check as the cure. For a layer item it must exhibit two different kinds of layer; for a K-G1 or K-G4 "
 +"item it must name the round that pressed the witness and quote that round's words; for a K-G1 item, where a later round of the side that holds the link names the verse, it must also quote "
 +"that round's own answer; a K-G4 item whose pressed witness a later round of that side names is not cured by any statement. For a K-G6 item it must quote, word for word, the transcript's words that show the verse is not a pressed witness of that premise. For a K-G10 item it must quote the PRESSED WITH: line that carries the verse, with its book, chapter and verse. Cured if it passes; else the violation stands. "
 +"RESPONSE: <the flagged item, as labelled above> | <in your own words: whether you accept the mark and why, or why the mark is wrong, naming the round and quoting its words>. Write one RESPONSE line for every flagged item, in addition to the cure line it needs; an item with no RESPONSE line is not cured, whatever else the reply holds. "
 +"Only these lines are read. A link not on a RETRACTED line is not retracted. A line not in this form cures nothing. Any other text is recorded only. An item you leave without a RESPONSE line counts against your seat, under every rule, as an unanswered item of a live rule does, and your seat may be replaced. If you hold an item wrong, write NOT HELD with your reason. That is an answer. Write it on that item's RESPONSE line: RESPONSE: <the flagged item, as labelled above> | NOT HELD: <your reason>. A TRIAL item (its mark says TRIAL rule) asks only for its own form: write that form, or NOT HELD. A TRIAL item never asks you to retract or regrade a line, and it is not a reason to change any grade; retract or regrade a line only for a reason from the rounds. For a K-RUL item, write the card; a missing card is not a reason to change the grade. Every RESTATED line you write is a deciding ruling (Commitment 11): under it, in this reply, write its five-line card, one field to a line: RULING -- <the subject of the RESTATED line, e.g. D2 vs C3> -- <the grade>, CLAIM:, NAMED BY:, RULE:, APPLIED:. A RESTATED line without its card raises a K-RUL item. For a K-CON item, a NOT HELD line must quote the flagged sentence, at least six words in a row, or the item stays uncured. For a K-W item, a NOT HELD line must quote the flagged sentence, at least six words in a row of what follows its verb (all of it when shorter; quote marks inside the sentence do not end the six words: quote across them, leaving them out), or the item stays uncured.";
const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-P'||x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-FF'||x.rule==='K-UNX'||x.rule==='K-R'||x.rule==='K-L2'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-CON'||x.rule==='K-CMT'||x.rule==='K-CMTL'||x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?x.rule+' '+x.link:'K-G3 '+x.side);
function g4Unans2024(line){const s=String(line||'');if(DRV_WORDS.test(s))return true;const i=s.search(/\bGROUND\s*:/i);if(i<0)return false;
 const g=s.slice(i).replace(/"[^"]*"|\u201c[^\u201d]*\u201d|(^|[\s(\[])['\u2018](?:[^'\u2018\u2019]|['\u2019](?=[A-Za-z]))*?['\u2019](?=$|[\s.,;:!?)\]])/g,'$1 ');
 return /\b(?:did not answer|does not answer|not been answered|no answer|receives no answer|gave no answer|left without answer)\b/i.test(g);}




/* pkgXK stage B: JSON cure answers. Functions, so they are hoisted wherever cureBody, cureText or fumAsk2024 runs. */

function xkJsonNote(){return "\n\nANSWER FORMAT: return one JSON object with one key, cure_lines: an array holding, in order, every line the request above asks for. Each entry is {\"kind\": \"RESPONSE\" or \"STATEMENT\" or \"OTHER\", \"item\": the item exactly as labelled above (\"\" for OTHER), \"text\": for RESPONSE and STATEMENT what you would write after the | sign, for OTHER the whole line}. A K-RUL card is five OTHER entries (RULING, CLAIM, NAMED BY, RULE, APPLIED, each a whole line) placed right after that item's RESPONSE entry. Write nothing outside the JSON.";}

/* rev 3 (W1 ask, operator approved 18:16Z 11-09): a cut-off cure_lines reply keeps every COMPLETE entry; the cut entry and anything after it are dropped. */
function xkSalvage2024(s){const i=s.indexOf('"cure_lines"');if(i<0)return null;let k=s.indexOf('[',i);if(k<0)return null;k++;const out=[];
 for(;;){while(k<s.length&&/[\s,]/.test(s[k]))k++;if(s[k]!=='{')break;let d=0,q=false,e=false,j=k;for(;j<s.length;j++){const c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'){d--;if(d===0)break;}}
  if(j>=s.length)break;let x;try{x=JSON.parse(s.slice(k,j+1));}catch(err){break;}out.push(x);k=j+1;}
 return out.length?{cure_lines:out}:null;}
function xkJson2024(t){if(typeof t!=='string')return t;const s=t.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');if(!/^\{/.test(s)||s.indexOf('cure_lines')<0)return t;let o=null;if(/\}$/.test(s)){try{o=JSON.parse(s);}catch(e){o=null;}}if(!o)o=xkSalvage2024(s);if(!o)return t;
 if(!o||!Array.isArray(o.cure_lines)||!o.cure_lines.length||!o.cure_lines.every(e=>e&&typeof e==='object'&&typeof e.kind==='string'&&typeof e.text==='string'))return t;
 const one=v=>String(v==null?'':v).replace(/\s*\n\s*/g,' ').trim();
 return o.cure_lines.map(e=>{const k=e.kind.toUpperCase();return (k==='RESPONSE'||k==='STATEMENT')?k+': '+one(e.item)+' | '+one(e.text):one(e.text);}).join('\n');}
function cureText(j){
 if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:xkJson2024(j.choices[0].message.content),finish:j.choices[0].finish_reason||null}; /* pkgXK B */
 if(j&&Array.isArray(j.candidates)&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {ok:true,text:t,finish:j.candidates[0].finishReason||null};}
 const why=(j&&j.error)?('error: '+String(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error))).slice(0,160)):('unrecognised reply, keys ['+Object.keys(j||{}).join(',')+']');
 return {ok:false,text:null,why};}

const CI_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const CI_ANS={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};
const CI_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const ciQ=s=>String(s==null?'':s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\s+/g,' ').trim();
const ciFound=(q,txt)=>{const T=ciQ(txt);const ps=String(q).split(/\.{3}|…/).map(x=>ciQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));};
const ciKeys=s=>new Set(REFP.keys(String(s||''),{scoped:true,cap:12}).map(k=>k.key));


const CI_LINE=/^\s*(?:[-*•>]|\d+[.)])?\s*(NOT PRESSED|PRESSED)\s*:\s*(.+)$/i;
const CI_PRESSED=/^(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*["“](.+)["”]\s*(?:--|—|–)\s*(UNANSWERED|ANSWERED\s+IN\s*\[?\s*((?:CR|DR)[1-4])\s*\]?)\s*\.?$/i;
function ciForm(kind,rest){if(/^NOT PRESSED$/i.test(kind))return /^[^|]*\d+:\d+[^|]*$/.test(rest)&&!/\bvs\.?\s+C\d/i.test(rest);return CI_PRESSED.test(rest);}
function ciNP(rest){const s=String(rest||'');const ps=REFP.parse(s,{scoped:true}).filter(r=>r.at===REFP.parse(s,{scoped:true})[0].at);let end=ps.length?Math.max(...ps.map(r=>r.end)):0;
 const ref=s.slice(0,end).replace(/[.\s]+$/,'').trim();const why=s.slice(end).replace(/^\s*\)?\s*(?:--|—|–|-|;|:|,|\()?\s*/,'').replace(/\)?[\s.]*$/,'').trim();return {ref:ref||s.replace(/[.\s]+$/,''),why};}
const ciReasoned=w=>(String(w||'').match(/[A-Za-z]{2,}/g)||[]).length>=3;
function ciRulings(text){const out=[];const T=String(text||'').replace(/\\n/g,'\n');
 for(const raw of T.split('\n')){const l=raw.replace(/\*\*/g,'').replace(/`/g,'').trim();const m=l.match(CI_LINE);if(!m)continue;const kind=m[1].toUpperCase().replace(/\s+/g,' ');const rest=m[2].trim();
  if(kind==='NOT PRESSED'){if(!ciForm(kind,rest))continue;const np=ciNP(rest);out.push({kind,keys:ciKeys(np.ref),ref:np.ref,reason:np.why,line:l});continue;}
  const p=rest.match(CI_PRESSED);if(!p)continue;const ans=/^UNANSWERED$/i.test(p[4])?'UNANSWERED':'ANSWERED';
  out.push({kind,keys:ciKeys(p[1]),ref:p[1].trim(),round:p[2].toUpperCase(),q:p[3],ans,ansRound:p[5]?p[5].toUpperCase():null,line:l});}
 return out;}
function ciValid(x,side,R){if(x.kind==='NOT PRESSED')return ciReasoned(x.reason)?{ok:true}:{ok:false,why:'NOT PRESSED gives no reason'};
 if(!CI_PRESS[side].includes(x.round))return {ok:false,why:'['+x.round+'] does not press the '+side.toLowerCase()};
 if(typeof R[x.round]!=='string')return {ok:false,why:'the text of ['+x.round+'] could not be read'};
 if(!ciFound(x.q,R[x.round]))return {ok:false,why:'the quotation is not found in ['+x.round+']'};
 if(x.ans==='ANSWERED'){const a=x.ansRound;if(!CI_ANS[side].includes(a)||CI_ORD.indexOf(a)<=CI_ORD.indexOf(x.round))return {ok:false,why:'ANSWERED IN ['+a+'] is not a later round of the '+side.toLowerCase()};
  const K=ciKeys(R[a]);if(![...x.keys].some(k=>K.has(k)))return {ok:false,why:'ANSWERED IN ['+a+'], which does not name '+x.ref+' by book, chapter and verse (ruling 376)'};}
 return {ok:true};}
/* pkgRI3 (reader item 3): true/false when the shared reader reads the line as a CONCEDED count line (for this side / the other side); null when it reads no CONCEDED form, so the old regex decides */
function ri3Count2024(l,side){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='CONCEDED'&&r.f&&!r.f.restated&&(r.f.side==='DEFENDER'||r.f.side==='CHALLENGER'))return r.f.side===side;}catch(e){}return null;}
/* pkgRI3 part B: the reader's CONCEDED head {side,n} (null: no CONCEDED form, or RESTATED); the first line giving the side's STANDING L (reader STANDING first, else the old one-line regex) */


function ciCountSection(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const L=T.split('\n');const head=side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:/i:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:/i;
 const STOP=/^[ \t>#-]*(?:CHALLENGE STANDING|DEFENSE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|COLLISION POINTS|CITATION CHECK|OUT-OF-ROUND|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|CITED-IN RULINGS|NOT PRESSED|PRESSED|REASONING|VERDICT)\b/i;
 const i=L.findIndex(l=>{const rr=ri3Count2024(l,side);return rr===null?head.test(l):rr;});if(i<0)return null;const out=[L[i]];for(const l of L.slice(i+1)){if(STOP.test(l))break;out.push(l);}return out.join('\n');}

const CURE_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const cureQ=s=>String(s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\((l[1-4]|[cd]r[1-4])\)/g,'[$1]').replace(/\s+/g,' ').trim();
function cureFound(q,txt){const T=cureQ(txt);const ps=q.split(/\.{3}|…/).map(x=>cureQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);
 return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));}
function cureFoundAll(q,txt){if(cureFound(q,txt))return true;const ps=String(q).split(/["”]\s*(?:and|&|,|;)\s*["“]/).map(s=>s.trim()).filter(Boolean);
 return ps.length>1&&ps.every(p=>cureFound(p,txt));}
const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|NOT PRESSED|PRESSED|SHORT|STATEMENT|RESPONSE)[ \t]*:[ \t]*(.*)$/;
const cureId=(d,c)=>'D'+d+' vs C'+c;
function cureRest(o,x){const V=s=>String(s==null?'':s).toUpperCase().replace(/\s+/g,' ').trim();const L=V(x.link);const ex=o.restated.filter(r=>V(r.link)===L);if(ex.length)return ex;
 {const wr=o.withdrawn.filter(w=>w.reason&&V(w.link)===L).map(w=>({link:w.link,grade:w.regrade||'UNDERDETERMINED',text:w.link+' '+w.reason,line:w.line,retraction:true}));if(wr.length)return wr.slice(0,1);}
 const m=L.match(/^([DC])(\d+)$/);if(!m)return ex;return o.restated.filter(r=>{const k=V(r.link).match(/^D(\d+) VS C(\d+)$/);return !!k&&(m[1]==='D'?k[1]===m[2]:k[2]===m[2]);});}
const cureUnwrap=t=>{try{const j=JSON.parse(String(t).trim().replace(/^```(?:json)?\s*|\s*```$/g,''));if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return cjrLoose2024(t);}; /* pkgCJR */
function cjrLoose2024(t){const z=String(t==null?'':t).trim().replace(/^```(?:json)?\s*|\s*```$/g,'');if(z[0]!=='{'||!/\\n/.test(z))return t;const m=z.match(/"(?:reasoning|reason|answer)"\s*:\s*"/);if(!m)return t; /* pkgCJR: invalid JSON reply, read its reasoning string as gateRead2024 does */
 return z.slice(m.index+m[0].length).replace(/"\s*\}\s*$/,'').replace(/\\n/g,'\n').replace(/\\"/g,'"');}
function __kcOther(l,label){const t=String(l),L=String(label||'');const own=(L.match(/#\s*(\d+)/)||[])[1];for(const m of t.matchAll(/(?:#|\b(?:item|point|no\.|number)\s*#?)\s*(\d+)\b/gi))if(m[1]!==own)return true;for(const m of t.matchAll(/\bK-[A-Z]+\d*\b/g))if(!L.includes(m[0]))return true;for(const m of t.matchAll(/\b(DEFENDER|CHALLENGER)\s+([CD]R\d)\b/gi))if(!new RegExp('\\b'+m[1]+'\\s+'+m[2]+'\\b','i').test(L))return true;return false;} /* pkgKSL rev 2 */
function __ks3Cont(o,rp){const s=((o&&o.response)||[]).find(z=>z&&z.text===rp);return s&&s.cont&&s.cont.length?(/[.!?;]["”’)\]*_]*\s*$/.test(String(rp))?' ':'. ')+s.cont.join(' '):'';} /* pkgKSL: the prose lines a judge writes right under its K-S3 RESPONSE line are read with it */
function cureLines(text){text=cureUnwrap(text);let __kcLast=null;const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[],cited:[]};
 const LAB=/^(REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*[:\-–—]+\s*/i;
 const pid=p=>{const m=String(p||'').match(/^D(\d+)\s+vs\.?\s+C(\d+)$/i);return m?cureId(m[1],m[2]):null;};
 for(const raw of String(text||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;const k=l.match(CURE_KEY);if(!k){o.prose.push(l);if(__kcLast&&__kcLast.cont.length<3){if(__kcOther(l,__kcLast.label))__kcLast=null;else __kcLast.cont.push(l.replace(/^(?:[-•>]|\d{1,2}[.)])\s+/,''));}continue;}__kcLast=null;
  const r=k[2].trim();let m;
  if(k[1]==='RETRACTED'){const R=__RL.readLine(l);const rest=R.form==='RETRACTED'?String(R.f.reason||''):'';
   if(R.form==='RETRACTED'&&!/\bLINK\s+BROKEN\b/i.test(rest.replace(/\bnot\s+(?:a\s+)?(?:\S+\s+)?LINK\s+BROKEN\b/ig,'').replace(/\b(?:(?:DEFENDER|CHALLENGER)\s+)?LINK\s+BROKEN\s+(?:grade|ruling|mark|label|line|verdict)s?\b/ig,''))){
    const g=(rest.match(/\b(UNDERDETERMINED|STANDS)\b/)||[])[1]||null;
    o.withdrawn.push({link:pid(R.f.pair),line:l,regrade:g,reason:rest.replace(/^\([^)]*\)\s*/,'').replace(/^(?:--|—|-|:)\s*/,'').replace(/^(?:re)?grade[sd]?\s+(?:to\s+)?(?:UNDERDETERMINED|STANDS)\s*(?:--|—|-|:)?\s*/i,'').trim()||null});}
   else o.malformed.push(l);continue;}
  if((k[1]==='PRESSED'||k[1]==='NOT PRESSED')&&ciForm(k[1],r)){for(const z of ciRulings(l))o.cited.push(z);continue;}
  const R=__RL.readLine(l);const f=R.f||{};
  if(k[1]==='PRESSED'&&R.form==='PRESSED'&&f.kind==='cure'&&f.sep==='|'&&/^(DR1|DR2|CR1|CR2|CR3)$/.test(f.round)){o.pressed.push({link:pid(f.pair),round:f.round,q:f.quote,line:l});continue;}
  if(k[1]==='SHORT'&&R.form==='SHORT'&&f.pair&&/^(CR2|CR3|CR4|DR1|DR2|DR3)$/.test(f.round)){o.short.push({link:pid(f.pair),round:f.round,q:f.quote,why:f.why,line:l});continue;}
  if(k[1]==='CORRECTED RESULT'&&R.form==='CORRECTED RESULT'){o.result.push({tag:f.tag,word:f.tag.split('-')[0],line:l});continue;}
  if(k[1]==='CORRECTED COUNT'&&R.form==='CORRECTED COUNT'){o.count.push({side:f.side,n:f.n,line:l});continue;}
  if(k[1]==='CORRECTED STANDING'&&R.form==='CORRECTED STANDING'){o.standing.push({side:f.side,st:f.standing,line:l});continue;}
  if((k[1]==='STATEMENT'||k[1]==='RESPONSE')&&R.form==='STATEMENT'&&f.item&&String(f.text||'').trim()){const at=r.indexOf('|');if(k[1]==='STATEMENT')o.statement.push({label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l});else{__kcLast={label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l,cont:[]};o.response.push(__kcLast);}continue;}
  if(k[1]==='RESTATED'&&((R.form&&f.restated)||(R.form==null&&R.tried==='RESTATED'))){ /* pkgKCR v2: a label RESTATED line (REASONING: ...) wraps no spec form */
   if(R.form==='COLLISION'){o.restated.push({link:pid(f.pair),grade:f.grade,text:r,line:l});continue;}
   if(R.form==='LINK STATE'){o.restated.push({link:String(f.link).toUpperCase(),grade:/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS)$/.test(f.grade)?f.grade:null,text:r,line:l});continue;}
   if((m=r.match(LAB))){o.restated.push({link:m[1].toUpperCase(),grade:null,text:r.slice(m[0].length),line:l});continue;}
  }
  o.malformed.push(l);}
 return o;}
function cureOwn(l,x){const b=String(l).replace(/^[A-Z ]+:\s*/,'').replace(/^K-[A-Z]+\d*\s+/i,'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 const lab=x.rule==='K-G3'?String(x.side||'')+' STANDING':String(x.link||'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 return !!lab&&b.startsWith(lab)&&!/[0-9A-Z]/.test(b.charAt(lab.length));}
const CURE_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
const CURE_SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
function cureRefs(t,scoped){return REFP.keys(t,{scoped:!!scoped,cap:30}).map(k=>({key:k.key,pos:k.pos}));}
function cureNamed(line,LR,w){w=w>0?w:0;const p=String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/);if(!p)return [];const want=new Set(cureRefs(p[1]).map(r=>r.key));if(!want.size)return [];
 const heads=[];const hr=/^[ \t>*#_-]*LINK\s+\d+/gmi;let h;while((h=hr.exec(LR)))heads.push(h.index);
 const span=(pos)=>{let a=0,b=LR.length;for(const x of heads){if(x<=pos)a=x;else{b=x;break;}}const lo=Math.max(a,pos-300),hi=Math.min(b,pos+1200);return {t:LR.slice(Math.max(a,lo-w),Math.min(b,hi+w)),l:LR.slice(Math.max(a,lo-w),lo),r:LR.slice(hi,Math.min(b,hi+w))};};
 const by={};for(const r of cureRefs(LR))if(want.has(r.key))(by[r.key]=by[r.key]||[]).push(span(r.pos));
 return Object.keys(by).map(k=>({ref:k,blocks:by[k].map(x=>x.t),left:by[k].map(x=>x.l),right:by[k].map(x=>x.r)}));}
var __RXR_R=null;var __XK_ITEMS=null; /* pkgXK */
function __l1qSq(b,R){if(!R)return false;b=String(b||'');const rs=[...b.matchAll(/\b([CD]R[1-4])\b/gi)].map(m=>R[m[1].toUpperCase()]).filter(t=>typeof t==='string');if(!rs.length)return false;
 return [...b.matchAll(/(?:^|[\s(\[{:;,])'([^\n]{8,}?)'(?=$|[\s.,;:!?)\]}"])/g)].some(m=>/\S\s+\S+\s+\S/.test(m[1])&&rs.some(t=>cureFound(m[1],t)));}
function cureReasoned(o,flags,R0){const U=s=>String(s).toUpperCase();const out=new Set();const __R=R0||__RXR_R;
 const fold=s=>String(s||'').replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
 const F=[...new Set((flags||[]).map(fold).filter(Boolean))].sort((a,b)=>b.length-a.length);
 const strip=s=>{let t=fold(s);for(const f of F)t=t.split(f).join(' ');return t.replace(/\s+/g,' ').trim();};
 const carriers=o.statement.map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})).concat(o.prose.map(p=>{const t=strip(p);return {name:t,body:t};})).concat(o.withdrawn.filter(w=>w.reason).map(w=>({name:w.link+' '+strip(w.reason),body:strip(w.reason)}))).concat((o.response||[]).filter(s=>{const b=String(s.text||'');const qs=[...b.matchAll(/["\u201c]([^"\u201d]{8,})["\u201d]|(?:^|[\s(\[{:;,])['\u2018]([^\n]{8,}?)['\u2019](?=$|[\s.,;:!?)\]}"\u201d])/g)].map(m=>m[1]||m[2]);return __R&&[...b.matchAll(/\b([CD]R[1-4])\b/gi)].some(m=>{const t=__R[m[1].toUpperCase()];return typeof t==='string'&&qs.some(q=>cureFound(q,t));});}).map(s=>({name:fold(s.label)+' '+strip(s.text),body:strip(s.text)})));
 for(const w of o.withdrawn){const m=String(w.link).match(/^D(\d+) vs C(\d+)$/);if(!m)continue;const re=new RegExp('\\bD'+m[1]+'\\s+vs\\.?\\s+C'+m[2]+'\\b','i');
  if(carriers.some(c=>re.test(c.name)&&/[\[(]?\b[CD]R[1-4]\b/i.test(c.body)&&(/["“][^"”]*\S\s+\S+\s+\S[^"”]*["”]/.test(c.body)||cureRefs(c.body).length>0||__l1qSq(c.body,__R))))out.add(U(w.link));}
 return out;}
/* pkgG4R (W2, 11-08; W3 3106 stacked engine item; W2 3107 item 2). (a) K-G4 witness: when the judge's quotation stands in a PRESSED WITH row
   ("<verse> ... -- MEANS: ..."), the pressed witness is that row's own verse, not an [L3] ground of the line. (b) The gate K-G4 item shows the
   engine's unanswered-false reading up front, so the judge sees that only a FORCED line cures a break whose witness a later round named. */
function kg4RowHead2024(q,P){const out=[];if(!q||typeof P!=='string')return out;
 for(const row of P.split('\n')){const m=row.search(/\s--\s*MEANS\s*:/i);if(m<0||!cureFound(q,row.slice(m)))continue;for(const r of cureRefs(row.slice(0,m)))if(!out.includes(r.key))out.push(r.key);if(out.length)break;}
 return out;}

/* pkgKG7 (D40, W3 3093 ruling 3): the K-G4 answered test applied to a K-G7 line; a break on an answered witness is one of meaning (ruling 421) and is not cured by a count */ function k7cc2024(x){try{if(!x||!/^K-G[47]$/.test(x.rule)||typeof cecBroken2024!=='function')return false;const m=String(x.link||'').match(/^D(\d+)(?:\s+vs\.?\s+C(\d+))?/i);const n=m&&(x.side==='DEFENDER'?m[1]:m[2]);return !!n&&cecBroken2024().some(c=>c&&c.side===x.side&&String(c.link)===n);}catch(e){return false;}} /* pkgK7C rev 2: a K-G7 or K-G4 item on a link the engine's confirmed closing contradiction broke; the engine itself does not count that link */
function kg7Ans2024(x,R){try{const line=String((x&&x.line)||'');const side=x&&x.side;if(!line||!CURE_PRESS[side])return null;R=R||{};
 if(!g4Unans2024(line))return 'the line records an answer and does not say the witness went unanswered, so the break is one of meaning (ruling 421)';
 const hits=[];for(const seg of line.split(/(?=\[(?:CR|DR)[1-4]\])/)){const rm=seg.match(/^\[((?:CR|DR)[1-4])\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;
  for(const m of seg.matchAll(/["\u201c]([^"\u201d]{8,})["\u201d]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}
 if(!hits.length)return null;const ks=kg4Split(side,line,hits,R);if(!ks.rests.length||ks.open.length)return null;
 return 'unanswered-false: a later '+side.toLowerCase()+' round names every pressed witness the line rests on ('+kg4Txt(ks.answered)+'), so the break is one of meaning (ruling 421)';}catch(e){return null;}}
function kg4Witnesses(line,q,pressText){const L=new Set(cureRefs(line).map(r=>r.key));const Q=[...new Set(cureRefs(q).map(r=>r.key))].filter(k=>L.has(k));if(Q.length)return Q;{const H=kg4RowHead2024(q,pressText).filter(k=>L.has(k));if(H.length)return H;} /* pkgG4R: the PRESSED WITH row's own verse */
 const an=new Set(cureRefs((String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/)||[0,''])[1]).map(r=>r.key));const B0=[...L].filter(k=>!an.has(k));
 const P=new Set(cureRefs(pressText||'').map(r=>r.key));if(!B0.length){const AP=[...an].filter(k=>P.has(k));if(AP.length)return AP;}  const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}

const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');
const kgaInAns2024=(t,pos)=>{t=String(t||'');const ls=t.lastIndexOf('\n',pos-1)+1;const le=t.indexOf('\n',pos);const line=t.slice(ls,le<0?t.length:le);const before=t.slice(ls,pos); /* pkgWLG: a hit is in an answer by pkgWLD's rule (rev 2: a list item may name several verses, each with its quoted words, before the hit; a heading may read "Presses answered", "Pressed witnesses, answered" and the like): a MEANS [<round>] header line; a bold label that opens with the verse; or a list item that opens with the verse under an "Answer ... press/witness" heading. Never a line that restates a press. */
 if(/press(?:ed)?\s+with\s*:|The press means|^\s*\*?Premise:/i.test(before)||/^\s*[*_-]*\s*PRESSED WITH/i.test(line))return false;
 if(/^\s*[*_-]*\s*MEANS\s*\[/i.test(line))return true;
 if(/^\s*(?:[-*]\s*)?\*\*\s*(?:\([a-z0-9]\)\s*)?(?:Press\s+)?$/i.test(before))return true;
 if(!/^\s*(?:[-*]|\d+[.)])\s+[*_]*\s*(?:[*_]*(?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?\.?\s+\d+:\d+(?:\s?[-–—]\s?\d+)?[*_]*\s*(?:"[^"\n]{0,200}"|“[^”\n]{0,200}”)?\s*(?:,|;|and|&)?\s*)*[*_]*$/.test(before))return false;
 const U=t.slice(0,Math.max(0,ls-1)).split('\n');for(let j=U.length-1;j>=0;j--){const x=U[j];
  if(/^\s*[*_#]*\s*(?:[A-Z]\.\s+)?(?:Answers?\s+to\s+(?:each\s+pressed\s+witness|the\s+(?:presses|pressed\s+(?:witnesses|verses)|witnesses\s+pressed))(?:\s+(?:under\s+premise|on\s+LINK)\s+\d+)?(?:\s*,\s*each\s+meeting\s+its\s+MEANS)?|(?:the\s+)?(?:presses|pressed\s+witnesses|witnesses\s+pressed)\s*,?\s*(?:each\s+)?answered)[\s*_:.]*$/i.test(x))return true;
  if(/^\s*-{3,}\s*$/.test(x)||/^\s*[*#]*\s*LINK\s+(?:\d+|none)\b/i.test(x)||/^\s*#{1,6}\s/.test(x)||/^\s*\*[^*\n]+\*\s*$/.test(x)||/^\s*[*_-]*\s*MEANS\s*\[/i.test(x)||/UNSUPPORTED-L4 PREMISES/i.test(x))return false;}
 return false;};
function kg4Split(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];
 const g=String(line||'').match(/\bGROUND\s*:([\s\S]*)$/i);const G=g?new Set(cureRefs(g[1]).map(r=>r.key)):null;const rests=[],answered=[],open=[];
 for(const p of presses){const W=kg4Witnesses(line,p.q,R[p.round]);const Wg=G?W.filter(k=>G.has(k)):[];const use=Wg.length?Wg:W;const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of use){if(rests.includes(w))continue;rests.push(w);const hs=[];for(const k of later){if(typeof R[k]!=='string')continue;const h=cureRefs(R[k],true).find(r=>r.key===w&&kgaInAns2024(R[k],r.pos));if(h)hs.push({ref:w,round:k,pos:h.pos});}
   if(hs.length)answered.push(...hs);else open.push(w);}}
 return {rests,answered,open,ground:!!(G&&rests.some(k=>G.has(k)))};}
const kg4Why=(ks,side,head)=>head+'; '+(ks.open.length?'the pressed witness '+ks.open.join(', ')+' '+(ks.open.length>1?'is each':'is')+' named in no answer in a later '+side.toLowerCase()+' round, so the grade stands'+(ks.answered.length?' (answered, and not the ground: '+kg4Txt(ks.answered)+')':''):'no pressed witness is read from the line');
function cvStmtVoid(t){const out=new Set();let all=false;for(const s of String(t||'').replace(/[*_`]+/g,'').split(/(?<=[.!?])\s+|\n/)){if(!/\bVOID\b/.test(s))continue;
  if(/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b/i.test(s))continue;
  const ns=[...s.matchAll(/\bpremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi)].flatMap(m=>m[1].match(/\d+/g).map(Number));if(ns.length)ns.forEach(n=>out.add(n));else if(/\b(?:each|all|every|both)\b/i.test(s))all=true;}
 return {all,set:out};}
const cvSet=v=>new Set(v&&Array.isArray(v.set)?v.set:[]);
const cvCap=x=>{if(!x||!x.L||!x.void)return Infinity;return x.void.all?0:Math.max(0,x.L-[...cvSet(x.void)].filter(j=>j>=1&&j<=x.L).length);};
const cvTxt=x=>x&&x.void?(x.void.all?'every premise':'premise'+(cvSet(x.void).size>1?'s ':' ')+[...cvSet(x.void)].sort((a,b)=>a-b).join(', ')):'';
const cvPrem=(x,ref)=>{const K=ciKeys(ref);return (x.plist||[]).filter(p=>(p.keys||[]).some(k=>K.has(k))).map(p=>p.n);};
const PW_CAP=8;
const PW_ROUND={DEFENDER:'DR2',CHALLENGER:'CR3'};
const pwHead=side=>side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
function pwList(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);let seg=j<0?'':x.slice(j);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);
  const body=seg.replace(/^PRESSED WITH\s*:\s*/i,'');const none=/^[\s*_]*none\b/i.test(body);
  const K=none||j<0?[]:[...ciKeys(body)];
  const P=(none||j<0||typeof PRS==='undefined')?null:PRS.premise(seg,R,PW_ROUND[side],(typeof PRS_L2BAD!=='undefined'?PRS_L2BAD:null));const H=P?[...P.verses.map(v=>v.key),...P.over]:K;  const all=new Set(H.slice(0,PW_CAP));
  const pv=P?new Set(P.verses.filter(v=>v.cls!=='UNPROVEN').map(v=>v.key)):all;
  return {n:k+1,has:j>=0,seg:none?'':seg,keys:new Set([...all].filter(z=>pv.has(z))),all,unproven:[...all].filter(z=>!pv.has(z)),cls:P?P.verses:[],over:H.slice(PW_CAP)};});}
const PW_FOOT=/\bexhibit|\bfooting\b|\[L[1-3]\]|\bquotations\b|prior layers?/i;
const PW_UNANS=/unanswer|unnamed|not named|no later|not answered|receives no|\bleft\b|leaving|names or answers|without (?:an |any )?answer/i;
const PW_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const PW_PRESSR={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const PW_ANSR={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};
const pwClauses=s=>String(s||'').split(/;\s+|,\s+(?:and|but|while|whereas)\s+|(?<=[.!?]["”'’)]?)\s+(?=[\[("“A-Z])|\s+and\s+(?=(?:it\s+|that\s+block\s+|the\s+block\s+|only\s+)?(?:exhibit|offer|show|rest|give)s?\b)|\s+but\s+(?=(?:it\s+|only\s+)?exhibit)/);
const pwUnans=s=>{const K=new Set();for(const c of pwClauses(s)){if(PW_FOOT.test(c)||!PW_UNANS.test(c))continue;for(const k of ciKeys(c))K.add(k);}return [...K];};


const PW_SEG=/(^|\n|[;.]\s+|--\s*|—\s*|:\s+)(?:[-•>]\s*)?(?:\d+[.)]\s*)?[*_]*\s*premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\b(?:\s*\(LINK\s+(?:\d+|none)\))?[*_]*(?=\s*(?:is\b|are\b|:|--|—|\(|UNEXHIBITED|CONCEDED|VOID|SUPPORTED|SPARED|STANDS|NOT\b))/gi;
const KV_KIND=/\bnegations?\b|\bnegative\b|\buniversals?\b|\bclaim\b[^.;]{0,60}\b(?:quote|quoted|quotation)\b[^.;]{0,40}\b(?:do(?:es)?\s+not|never)\s+(?:[a-z]+\s+)?make|\bgo(?:es)?\s+beyond\s+(?:the\s+)?(?:quoted?\b|quotation\b|['‘"“])|\bclaim\b[^.;]{0,30}\bnot\s+(?:made|in)\b[^.;]{0,20}\b(?:quote|quoted|quotation)\b/i;
const KV_NOQ=/\bno\s+verbatim\s+quot|\bnot\s+(?:found\s+)?verbatim\b|\bquot(?:e|ation)\s+(?:is\s+)?not\s+found\b|\bwithout\s+a\s+verbatim\s+quot/i;
const kvNorm=s=>String(s==null?'':s).toLowerCase().replace(/[“”"‘’'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const kvQuotes=s=>{const t=String(s||'');const out=[];for(const m of t.matchAll(/["“]([^"”\n]{1,240})["”]/g))out.push(m[1]);for(const m of t.matchAll(/(?:^|[\s(\[:;,])['‘]((?:[^'’\n]|['’](?=[A-Za-z])){2,160}?)['’](?=$|[\s.,;:!?)\]])/g))out.push(m[1]); return out.map(q=>q.trim()).filter(q=>kvNorm(q).length>=2);};
function kvCharges(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return null;
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=j<0?x:x.slice(0,j);const ch=pre.replace(/["“][^"”]*["”]/g,' | ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 | ');return {n:k+1,charge:' '+kvNorm(ch)+' ',full:' '+kvNorm(pre)+' ',qs:kvQuotes(pre).map(kvNorm)};});}
function kvpOwn2024(seg,ns,out){try{const S=String(seg);let t=S,m;const RX=/(^|[\s,;(])(premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\s+(?:is|are|was|were)\s+(?:also\s+|ruled\s+|thus\s+)?VOID\b)/gi;
 while((m=RX.exec(S))){const nn=m[3].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0);if(!nn.length||nn.some(n=>(ns||[]).includes(n)))continue;t=t.replace(m[2],' ');out.push({ns:nn,seg:S.slice(m.index+m[1].length).trim()});}
 return t;}catch(e){return String(seg);}}
function kvSegments(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const cs=ciCountSection(T,side)||'';const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const out=[];for(const src of [cs,st]){if(!src)continue;const at=[];let m;PW_SEG.lastIndex=0;while((m=PW_SEG.exec(src)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
  at.forEach((x,k)=>{const seg=src.slice(x.i,k+1<at.length?at[k+1].i:src.length);if(!/\bVOID\b/.test(kvpOwn2024(seg,x.ns,out))||((s0=>!/\bVOID\b/.test(s0)&&/\b(?:UNEXHIBITED|SPARED|STANDS|SUPPORTED|CONCEDED|NARROWED|COUNTED)\b/i.test(s0))(seg.split(/(?<=[.!?])\s+/)[0])) ||/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(seg))return;  out.push({ns:x.ns,seg:seg.trim()});});}
 return out;}
const KV_UNI=/^(?:only|never|all|none|no|not|every|always|alone|nothing|nowhere|neither|nor|without|cannot|any|reversed|excludes?|excluded)$/;
function kvUni(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return [];
 const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);const pre=(j<0?x:x.slice(0,j)).replace(/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i,'');const qs=kvQuotes(pre).map(kvNorm);const qw=new Set(qs.join(' ').split(' '));
  const ch=kvNorm(pre.replace(/["“][^"”]*["”]/g,' ').replace(/(^|[\s(\[:;,])['‘][^'’\n]{2,}?['’](?=$|[\s.,;:!?)\]])/g,'$1 '));const w=[...new Set(ch.split(' ').filter(x=>KV_UNI.test(x)&&!qw.has(x)))];return {n:k+1,words:w};});}
function kvNames(seg,words){const S=String(seg);return (words||[]).find(w=>{const st=w.replace(/(?:ed|es|s)$/,'');const loose=!/^(?:no|not|any|all|nor)$/.test(w);
 return new RegExp('["“\'‘]'+w+'["”\'’]|\\b'+w.toUpperCase()+'\\b|\\b(?:the\\s+word|adds?|added|universal|negation)\\s+["“\'‘]?'+w+'\\b','').test(S)||(loose&&new RegExp('\\b'+st+'[a-z]{0,3}\\b','i').test(S));})||null;}
function kvRulingOk(seg,n,CH,UNI){if(KV_NOQ.test(seg))return {ok:true,why:'no verbatim quote'};const kind=KV_KIND.test(seg)||KV_KIND.test(String(seg).replace(/["“][^"”\n]*["”]/g,'"Q"').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,"$1'Q'")); const c=(CH||[]).find(p=>p.n===n);
 const q=c?kvQuotes(seg).find(q=>c.charge.includes(' '+kvNorm(q)+' ')||(c.full&&c.full.includes(' '+kvNorm(q)+' ')&&!(c.qs||[]).some(z=>(' '+z+' ').includes(' '+kvNorm(q)+' ')))):null;  if(kind&&q)return {ok:true,kind,q};const u=(UNI||[]).find(p=>p.n===n);const w=u?kvNames(seg,u.words):null;
 return w?{ok:true,kind:true,q:w,why:'names the word '+w}:{ok:false,kind,q:q||null};}

function kcmf2024(v){try{const L=(v||[]).filter(y=>y&&y.rule==='K-CMTL');if(!L.length||L.some(y=>y.status!=='CURED'))return v;
 return v.map(x=>x&&x.rule==='K-CMT'&&x.status==='UNCURED'?{...x,status:'CURED',why:'every contested line is answered on K-CMTL ('+L.length+' line'+(L.length>1?'s':'')+', each naming its commitment or NOT A GRADE); the grouped RESPONSE alone named none (pkgKCMF, W3 grade_33083)'}:x);}catch(e){return v;}}
function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};__RXR_R=rounds||null;__XK_ITEMS=items||null; /* pkgXK */
 const nK1={DEFENDER:items.filter(x=>x.rule==='K-G1'&&x.side==='DEFENDER').length,CHALLENGER:items.filter(x=>x.rule==='K-G1'&&x.side==='CHALLENGER').length};
 const rsn=cureReasoned(o,items.map(x=>x.line),R);
 const wd=new Set(o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))).map(w=>U(w.link)):[]);
 const rxNoWhy=new Set(o.result.length===1?o.withdrawn.filter(w=>!rsn.has(U(w.link))).map(w=>U(w.link)):[]);
 const rxNoRes=new Set(o.result.length!==1?o.withdrawn.map(w=>U(w.link)):[]);
 const NZ=s=>U(s).replace(/[:|]+/g,' ').replace(/\s+/g,' ').trim();const KWK=s=>{const m=NZ(s).match(/\b(DEFENDER|CHALLENGER)\s+([CD]R[1-4])\s+(LINK\s*\d+|[DC]\d+)\b[^#]{0,60}?#\s*(\d+)\b/);return m?m[1]+' '+m[2]+' '+m[3].replace(/\s+/g,'')+' #'+m[4]:null;};  const HAS=(L,k)=>{const a=NZ(L),b=NZ(k);if(!b)return false;let i=a.indexOf(b);while(i>=0){if(!/[0-9A-Z]/.test(a.charAt(i+b.length)))return true;i=a.indexOf(b,i+1);}return false;};
/* pkgXK: the number of distinct item keys (the link, or SIDE STANDING) a RESPONSE/STATEMENT label names (each item tested as respOf tests it; two rules on one key count once), and the pick: among matching lines, the one naming the fewest items (a line naming none ranks last), first on a tie */
const xkN=new Map();const xkCnt=s=>{if(xkN.has(s))return xkN.get(s);const L=U(s.label);const rs=L.match(/\bK-[A-Z]+[0-9]*\b/g)||[];const K=new Set();for(const y of items){if(!y)continue;const ok=!rs.length||rs.includes(U(y.rule||''));if(!ok)continue;const ly=U(cureLabel(y));if(HAS(L,ly)||(y.rule==='K-W'&&KWK(y.link)&&KWK(L)===KWK(y.link))||(y.link?HAS(L,y.link):(L.includes(String(y.side))&&L.includes('STANDING'))))K.add(NZ(y.link!=null&&y.link!==''?String(y.link):String(y.side)+' STANDING'));}xkN.set(s,K.size);return K.size;};
const xkPick=(A,f)=>{let b=null,bn=Infinity;for(const s of A){if(!f(s))continue;const n=xkCnt(s)||Infinity;if(b===null||n<bn){b=s;bn=n;}}return b;}; /* rev 2 (W1 3661): a line naming no item key under its own rule (0) ranks after every line that names one */
const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\bK-[A-Z]+[0-9]*\b/g)||[];return !rs.length||rs.includes(rk);};
  const r=xkPick(o.response,s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||(x.rule==='K-W'&&KWK(x.link)?xkPick(o.response,s=>ruleOk(U(s.label))&&KWK(s.label)===KWK(x.link)):null)||xkPick(o.response,s=>{const L=U(s.label);return ruleOk(L)&&(x.link?HAS(L,x.link):(L.includes(x.side)&&L.includes('STANDING')));})
   ||(items.filter(y=>y&&y.rule===x.rule).length===1?o.response.find(s=>{const L=NZ(s.label);return (L===rk||L.startsWith(rk+' '))&&ruleOk(U(s.label));}):null);  if(r)return r.text;if(x.rule==='K-CMTL'){const k=+(String(x.link).match(/\d+/)||[0])[0];for(const s of o.response){if(!/^K-CMTL\b/.test(NZ(s.label)))continue;const g=kcmtlSeg2024(s.text,k);if(g)return g;}return null;}  if(x.rule==='K-CMT'){const t=o.response.filter(s=>/^K-CMTL\b/.test(NZ(s.label))).map(s=>s.text).join('\n');return t||null;}  return null;};
 const stmtOf=(x)=>{const st=xkPick(o.statement,s=>x.link?(HAS(s.label,x.link)||(x.rule==='K-W'&&KWK(x.link)!=null&&KWK(s.label)===KWK(x.link))):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};
 const stmtQ=(t)=>[...String(t||'').matchAll(/["“]([^"”]{8,})["”]|(?:^|[\s(\[{:;,—–-])['‘]([^\n]{8,}?)['’](?=$|[\s.,;:!?)\]}"”—–-])/g)].map(m=>m[1]||m[2]);
 const stmtPress=(x)=>{const t=stmtOf(x);if(!t)return null;for(const rk of CURE_PRESS[x.side]){if(!new RegExp('\\['+rk+'\\]').test(t)||typeof R[rk]!=='string')continue;const q=stmtQ(t).find(q=>cureFound(q,R[rk]));if(q)return {round:rk,q,line:'STATEMENT: '+t};}return null;};
 return kcmf2024(items.map(x=>{const res=(status,why,lines,kinds)=>{const keys=(x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-FF'||x.rule==='K-UNX'||x.rule==='K-L2'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?[x.link]:(x.rule==='K-G1'||x.rule==='K-G4')?[x.link,x.side]:[x.side].concat((broken||{})[x.side]||[]);
   const bad=status==='UNCURED'?o.malformed.find(l=>cureOwn(l,x)):null;
   return {...x,judge_statement:stmtOf(x),response:respOf(x),status,why:(why||'')+(bad?(why?'; ':'')+'malformed line: '+bad.slice(0,160):'')||null,statement:(l=>l&&l.length?l.join(' / '):null)(status==='CURED'&&/^retracted/.test(why||'')&&o.result.length===1?(lines||[]).concat([o.result[0].line]):lines),kinds:kinds||[]};};
  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);
  if(!respOf(x)&&!(x.rule==='K-B'&&(wd.has(U(x.link))||cureRest(o,x).length))&&!(x.rule==='K-RUL'&&krulCure(x,reply.text,R,'').st==='CURED')){ /* pkgKRC */const z=res('UNCURED','no written response',null);z.silent=!o.malformed.find(l=>cureOwn(l,x));return z;}
  if(x.link&&rxNoRes.has(U(x.link)))return res('UNCURED','RETRACTED without exactly one CORRECTED RESULT line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  if(x.link&&rxNoWhy.has(U(x.link)))return res('UNCURED','RETRACTED with no reason naming the round and its words or verse (rulings 105)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const ansK=pr=>(x.side==='DEFENDER'?['CR2','CR3','CR4']:['DR1','DR2','DR3']).filter(  k=>!pr||ORD.indexOf(k)>ORD.indexOf(pr));
  const namedIn=pr=>(x.rule==='K-G1'||x.rule==='K-G4')?ansK(pr).filter(k=>typeof R[k]==='string'&&R[k]).map(k=>({k,n:cureNamed(x.line,R[k])})).filter(z=>z.n.length):[];
  const nmTxt=pr=>namedIn(pr).map(z=>'['+z.k+'] '+z.n.map(n=>n.ref).join(', ')).join('; ');
  const ownQ=(q,k)=>!(x.side==='DEFENDER'?['DR1','DR2','DR3','DR4']:['CR1','CR2','CR3','CR4']).some(o2=>ORD.indexOf(o2)<ORD.indexOf(k)&&typeof R[o2]==='string'&&cureFound(q,R[o2]));
  const inWin=(q,z)=>cureNamed(x.line,R[z.k],2*String(q).length+40).some(n=>n.blocks.some((b,i)=>cureFound(q,b)&&!cureFound(q,n.left[i])&&!cureFound(q,n.right[i])));
  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&inWin(s.q,z)))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&inWin(q,z)));};
  if(k7cc2024(x))return res('CURED','the link is broken by the engine\'s confirmed closing contradiction, which no count carries (pkgK7C)',[]);
  if(x.rule==='K-G4'){const __mb421=!g4Unans2024(x.line);  if(wd.has(U(x.link))&&!__mb421)return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   {const fz=(typeof KF_LINE==='undefined'||!reply||!reply.ok)?[]:String(cureUnwrap(reply.text)).split('\n').map(l=>l.trim().replace(/[*_`]+/g,'')).filter(l=>{const m=l.match(KF_LINE);return !!m&&U(m[1].replace(/\s+vs\.?\s+/i,' vs '))===U(x.link)&&(!x.side||(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')===U(x.side));});if(fz.length)return res('CURED','forced link: a FORCED line for '+x.link+' (ruling 411); K-F reads its quotations',fz);}
   if(__mb421&&wd.has(U(x.link))){
   const __wl=o.withdrawn.filter(w=>U(w.link)===U(x.link));const __rt=__wl.map(w=>String(w.reason||'')).concat([respOf(x)||'',stmtOf(x)||'']).join('\n');
   const __hk=x.side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3','DR4'];let __ok=null;
   for(const q of stmtQ(__rt)){if(String(q).trim().split(/\s+/).length<6)continue;const k=__hk.find(k=>typeof R[k]==='string'&&R[k]&&cureFound(q,R[k])&&ownQ(q,k));if(k){__ok='['+k+'] "'+String(q).slice(0,120)+'"';break;}}
   if(!__ok){const rk=new Set(cureRefs(__rt).map(r=>r.key));const z=namedIn(null).find(z=>z.n.some(n=>rk.has(n.ref)));if(z)__ok='['+z.k+'] names '+z.n.filter(n=>rk.has(n.ref)).map(n=>n.ref).join(', ');}
   if(__ok)return res('CURED','retracted with a quoted reason the transcript verifies: '+__ok+' (Eric 15:18 CST 2026-11-06)',__wl.map(w=>w.line));
   return res('UNCURED','retracted, but the BROKEN grade rests on meaning and the retraction gives no quoted reason the transcript verifies (a quotation of 6 or more words standing in a round of the side that holds the link, in its own words, or a verse of the line that such a round names); cure it with a FORCED line or such a quoted reason',__wl.map(w=>w.line));}
   const ps=o.pressed.filter(p=>U(p.link)===U(x.link));const sl=o.short.filter(s=>U(s.link)===U(x.link)).map(s=>s.line);const lines=ps.map(p=>p.line).concat(sl);
   if(!ps.length){const sp=stmtPress(x);if(!sp)return res('UNCURED','no PRESSED line, no RETRACTED line, and no statement that names a pressing round and quotes it, for '+x.link,lines);
    const ks=kg4Split(x.side,x.line,[sp],R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on in an answer: '+kg4Txt(ks.answered),lines.concat([sp.line]));
    return res('CURED',kg4Why(ks,x.side,'statement passes the check: quotation found in '+sp.round),lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hits=ok.filter(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hits.length)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   const ks=kg4Split(x.side,x.line,hits,R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on in an answer: '+kg4Txt(ks.answered),lines);
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
  const sq=y=>{const q=stmtQ(stmtOf(y));return Object.keys(R).find(k=>typeof R[k]==='string'&&q.some(z=>cureFound(z,R[k])))||null;};
  const lbStated=y=>{const st=stmtOf(y);const rk=y.side==='CHALLENGER'?'DR3':'CR3';return !!st&&drvKinds(st).length>=2&&typeof R[rk]==='string'&&stmtQ(st).some(q=>cureFound(q,R[rk]));};
  const kNeed=(sd,self)=>{const ps=new Set();for(const y of items){if(y.side!==sd)continue;
   if(y.rule==='K-G6'&&!sq(y))ps.add('P'+(String(y.link).match(/(\d+)\s*$/)||[0,y.link])[1]);if(y.rule==='K-G7'&&!wd.has(U(y.link))&&!k7cc2024(y)&&!kg7Ans2024(y,R))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));if(y.rule==='K-LB'&&y.premise!=null&&(y===self||enfLive(y))&&!lbStated(y))ps.add('P'+y.premise);  }return ps.size;};
  const kCount=(x,none)=>{const needN=(x.conc||0)+kNeed(x.side,x);
   const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const lines=cs.map(c=>c.line).concat(ss.map(s=>s.line));
   if(!ns.length)return res('UNCURED','no CORRECTED COUNT for '+x.side+' and '+none+' for '+x.link,lines);
   if(ns.length>1)return res('UNCURED','two differing CORRECTED COUNT lines for '+x.side,lines);
   if(ns[0]<needN)return res('UNCURED','corrected count '+ns[0]+' is below '+needN,lines);
   if(ns[0]>cvCap(x))return res('UNCURED','corrected count '+ns[0]+' counts a premise the seat ruled VOID ('+cvTxt(x)+' of '+x.L+'; a VOID premise counts for neither side, so the count is at most '+cvCap(x)+')',lines);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,lines);
   const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT');  const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines.concat(respOf(x)?['RESPONSE: '+respOf(x)]:[]));};
  if(x.rule==='K-G6'){if(o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))return kCount(x,'no statement quoting the transcript');const rk=sq(x);if(rk)return res('CURED','statement quotes the transcript ('+rk+')',['STATEMENT: '+stmtOf(x)]);
   return kCount(x,'no statement quoting the transcript');}
  if(x.rule==='K-G7'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   {const __a7=kg7Ans2024(x,R);if(__a7){const fz=(typeof KF_LINE==='undefined'||!reply||!reply.ok)?[]:String(cureUnwrap(reply.text)).split('\n').map(l=>l.trim().replace(/[*_`]+/g,'')).filter(l=>{const m=l.match(KF_LINE);return !!m&&U(m[1].replace(/\s+vs\.?\s+/i,' vs '))===U(x.link)&&(!x.side||(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')===U(x.side));});
    if(fz.length)return res('CURED','forced link: a FORCED line for '+x.link+' (ruling 421); the premise is not counted (pkgKG7)',fz);
    const cs7=o.count.filter(c=>c.side===x.side).map(c=>c.line);return res('UNCURED',__a7+': a count does not cure it; cure it with one FORCED line for '+x.link+', or RETRACTED for the link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply (pkgKG7)',cs7);}}
   return kCount(x,'no RETRACTED for the link, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply');}
  if(x.rule==='K-G9'){const RU=o.cited||[];const lines=RU.map(z=>z.line).slice(0,30);const ok9=z=>ciValid(z,x.side,R).ok;const hit=(ref,zs)=>{const K=ciKeys(ref);return zs.filter(z=>[...z.keys].some(k=>K.has(k)));};
   const miss=(x.missing||[]).filter(lab=>!hit(lab,RU).some(ok9));
   if(miss.length)return res('UNCURED','no valid ruling line in the reply for '+miss.length+' listed verse(s): '+miss.slice(0,12).join(', ')+(miss.length>12?', ...':''),lines);
   const pu=RU.filter(z=>z.kind==='PRESSED'&&z.ans==='UNANSWERED'&&CI_PRESS[x.side].includes(z.round)&&ok9(z)).map(z=>z.ref);
   const still=(x.uncounted||[]).filter(ref=>!hit(ref,RU).some(z=>ok9(z)&&(z.kind==='NOT PRESSED'||z.ans==='ANSWERED')));const need0=[...new Set(pu.concat(still))];
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
   if(n9>cvCap(x))return res('UNCURED','corrected count '+n9+' counts a premise the seat ruled VOID ('+cvTxt(x)+' of '+x.L+'; a VOID premise counts for neither side, so the count is at most '+cvCap(x)+')',ls);
   if(sv.length>1)return res('UNCURED','two differing CORRECTED STANDING lines for '+x.side,ls);const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT');  const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+n9+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),ls);
   return res('CURED','counted under ruling 372: '+x.side+' COUNT '+n9+', STANDING '+want+(named?'; restated count names '+need.join(', '):''),ls);}
  if(x.rule==='K-G11'||(x.rule==='K-P'&&x.premise==null)){  if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   if(rs.length){const P=new Set(x.pwk||[]);const un=pwUnans(rs[0].text).filter(k=>P.has(k));if(un.length)return res('CURED','restated LINK BROKEN on a pressed witness under PRESSED WITH: '+un.join(', '),[rs[0].line]);
    return res('UNCURED','the restated line still rests, as unanswered, on no verse a listed premise carries under PRESSED WITH (ruling 392)',[rs[0].line]);}
   return res('UNCURED','no RETRACTED or RESTATED line for '+x.link+'; it rests, as unanswered, only on '+(x.verses||[]).join(', ')+', under no PRESSED WITH (ruling 392)',null);}
  if(x.rule==='K-V'){const CH=kvCharges(R,x.side);const UNI=kvUni(R,x.side);const st=stmtOf(x);
   if(st&&CH){const v=kvRulingOk(st,x.premise,CH,UNI);if(v.ok)return res('CURED','statement quotes the charge words ('+(v.q||v.why)+') and names the kind',['STATEMENT: '+st]);}{const rp=CH?respOf(x):null;if(rp){const t=st?st+'\n'+rp:rp;const v=kvRulingOk(t,x.premise,CH,UNI);if(v.ok)return res('CURED',(st?'statement and response together quote':'response quotes')+' the charge words ('+(v.q||v.why)+(st?') and name the kind':') and names the kind'),(st?['STATEMENT: '+st]:[]).concat(['RESPONSE: '+rp]));}}
   const lab=x.side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';const rc=o.restated.filter(r=>r.link===lab);
   if(rc.length===1){const sg=kvSegments(lab+': '+rc[0].text,x.side).find(z=>z.ns.includes(x.premise));
    if(!sg){const T=rc[0].text;const re=new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+x.premise+'\\b[^.;]{0,160}','i');const m=T.match(re);const seg=m?m[0]:'';
     if(/\b(?:SUPPORTED|NARROWED|SPARED|STANDS)\b/i.test(seg)&&!/\b(?:UNEXHIBITED|CONCEDED)\b/.test(seg))return res('CURED','regraded in the restated count: '+seg.slice(0,120),[rc[0].line]);
     if(/\b(?:UNEXHIBITED|CONCEDED)\b/.test(seg)){const cs=o.count.filter(c=>c.side===x.side);const ns=[...new Set(cs.map(c=>c.n))];const ss=o.standing.filter(s=>s.side===x.side);const sv=[...new Set(ss.map(s=>s.st))];const ls=[rc[0].line].concat(cs.map(c=>c.line),ss.map(s=>s.line));
      if(ns.length!==1||ns[0]<=(x.conc||0))return res('UNCURED','the restated count counts premise '+x.premise+' but no single CORRECTED COUNT above '+(x.conc||0)+' for '+x.side,ls);
      const want=(sv.length===1&&(sv[0]==='COLLAPSED'||sv[0]==='PROP-DEPENDENT'))?sv[0]:((x.st==='COLLAPSED'||x.st==='PROP-DEPENDENT')?x.st:'PROP-DEPENDENT');  const got=sv.length===1?sv[0]:(x.st||null);if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),ls);
      return res('CURED','counted: '+x.side+' COUNT '+ns[0]+', STANDING '+want,ls);}
     return res('UNCURED','the restated count does not grade premise '+x.premise,[rc[0].line]);}
    const v=kvRulingOk(sg.seg,x.premise,CH,UNI);if(v.ok)return res('CURED','the restated VOID ruling quotes the charge words ('+(v.q||v.why)+') and names the kind',[rc[0].line]);
    return res('UNCURED','the restated count still rules premise '+x.premise+' VOID without the charge words and the kind',[rc[0].line]);}
   return res('UNCURED','no STATEMENT quoting the charge words and naming the kind, and no RESTATED '+lab+' line regrading premise '+x.premise,null);}
  if(x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)){const pr=x.side==='DEFENDER'?'DR2':'CR3';
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
   const brk=((broken||{})[x.side]||[]).filter(l=>!wd.has(U(l))).length>0;  const want=ns[0]===0?(brk?'PROP-DEPENDENT':'SELF-SUPPORTED'):((x.L&&2*ns[0]>x.L)?'COLLAPSED':'PROP-DEPENDENT');const got=sv.length===1?sv[0]:(x.st||null);
   if(got!==want)return res('UNCURED','count '+ns[0]+' of '+(x.L||'?')+' makes the '+x.side+' standing '+want+'; it reads '+(got||'none'),lines);
   return res('CURED','recounted under ruling 392: '+x.side+' COUNT '+ns[0]+', STANDING '+want,lines);}
  if(x.rule==='K-FF'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   const fl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>ri4IsF2024(l,/^(?:[-•]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i)&&U(l).replace(/\s+VS\.?\s+/g,' VS ').includes(U(x.link).replace(/\s+VS\s+/g,' VS ')));
   if(!fl.length)return res('UNCURED','TRIAL rule (K-FF): no FORCED line for '+x.link+', no RETRACTED line and no RESTATED line regrading it',null);
   const chk=kffLines(fl[0],R);if(chk.items.length)return res('UNCURED','TRIAL rule (K-FF): '+chk.items[0].why,[fl[0]]);
   return res('CURED','TRIAL rule (K-FF): the FORCED line\'s FAILS quotes the answer\'s own words'+(chk.report.length?' ('+chk.report[0]+')':''),[fl[0]]);}
  if(x.rule==='K-FC'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   const fl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>ri4IsF2024(l,/^(?:[-•]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i)&&U(l).replace(/\s+VS\.?\s+/g,' VS ').includes(U(x.link).replace(/\s+VS\s+/g,' VS ')));
   if(!fl.length)return res('UNCURED','TRIAL rule (K-FC): no FORCED line for '+x.link+' with CARRIED BY, no RETRACTED line and no RESTATED line regrading it',null);
   const chk=kfcLines(fl[0],R);if(chk.items.length)return res('UNCURED','TRIAL rule (K-FC): '+chk.items[0].why,[fl[0]]);
   return res('CURED','TRIAL rule (K-FC): the FORCED line carries CARRIED BY words that stand in the pressed verse'+(chk.report.length?' ('+chk.report[0]+')':''),[fl[0]]);}
  if(x.rule==='K-F'){if(wd.has(U(x.link)))return res('CURED','retracted',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length&&rs[0].grade&&!/LINK BROKEN$/.test(rs[0].grade))return res('CURED','regraded '+rs[0].grade,[rs[0].line]);
   const fl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>ri4IsF2024(l,/^(?:[-•]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i)&&U(l).replace(/\s+VS\.?\s+/g,' VS ').includes(U(x.link).replace(/\s+VS\s+/g,' VS ')));
   if(!fl.length)return res('UNCURED','no FORCED line for '+x.link+', no RETRACTED line and no RESTATED line regrading it',null);
   const chk=kfLines(fl[0],R);if(chk.items.length)return res('UNCURED','the FORCED line does not hold: '+chk.items[0].why,[fl[0]]);
   return res('CURED','the FORCED line quotes the MEANS sentence, the answer and the failing layer, each in the round it names',[fl[0]]);}
  if(x.rule==='K-R'){const key=String(x.key||'');
   const rl=String(cureUnwrap(reply&&reply.ok?reply.text:'')).split('\n').map(l=>l.trim().replace(/^[*`]+|[*`]+$/g,'')).filter(l=>/^(?:[-•]\s*)?REFERENCE\s*:/i.test(l)&&ciKeys(l).has(key));
   if(!rl.length)return res('UNCURED','no REFERENCE line for '+key,null);const m=rl[0].replace(/[*_`]+/g,'').match(KR_LINE);
   if(!m)return res('UNCURED','the REFERENCE line is not in the form',[rl[0]]);const rk=m[2].toUpperCase();
   if(rk!==x.round)return res('UNCURED','the REFERENCE line names ['+rk+']; the press names ['+x.round+']',[rl[0]]);
   if(typeof R[rk]!=='string'||!ciFound(m[4],R[rk]))return res('UNCURED','its first quotation is not in ['+rk+']',[rl[0]]);
   if(!x.means||!ciFound(m[5],x.means))return res('UNCURED','its second quotation is not the press\'s MEANS sentence',[rl[0]]);
   return res('CURED','REFERENCE '+m[3].toUpperCase()+' with both meanings quoted',[rl[0]]);}
  if(x.rule==='K-W'){const rp=respOf(x)||'',sp=stmtOf(x)||'';  const kwSt=t=>/\bSTANDS\s+WITHOUT\s+IT\s+because\b/i.test(t)&&/\[L[1-3]\]/.test(t);const kwCo=t=>/(?:^|[.;!?]\s+|:\s+)\**CONCEDED\**(?!\s+LINKS?\b)(?:\s*(?::|;|\.|--|\u2014|$)|(?:\s+[A-Za-z][A-Za-z'\u2019-]*){1,4}\s*(?::|--|\u2014)|\s+as(?:\s+to)?\s+[A-Za-z])/.test(String(t));      const kwRe=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|\u2014)?\s*["\u201c'\u2018][^"\u201d]{6,}["\u201d'\u2019](?![A-Za-z])/i.test(t);for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t)continue;if(kwSt(t))return res('CURED','answered: the link stands without the withdrawn footing, on the layer named'+w,[t]);if(kwCo(t))return res('CURED','answered: the link is conceded'+w,[t]);if(kwRe(t))return res('CURED','answered: the withdrawn footing is reasserted in a later round, with its quote'+w,[t]);}if(KW_NH){const KWR_REF=/\s*\((?:\s*(?:[1-3]\s*)?[A-Z][A-Za-z]*\.?(?:\s+of\s+[A-Z][a-z]+|\s+[A-Z][a-z]+)?\s+)?\d+:\d+(?:\s*[-\u2013]\s*\d+)?(?:\s*[,;]\s*(?:(?:[1-3]\s*)?[A-Z][A-Za-z]*\.?(?:\s+[A-Z][a-z]+)?\s+)?\d+(?::\d+)?(?:\s*[-\u2013]\s*\d+)?)*\s*\)/g;  const nw=s=>String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]+/g,' ').trim().split(' ').filter(Boolean);const q=String(x.line||'');const a=q.indexOf('"'),b=q.lastIndexOf('"');const fs0=(a>=0&&b>a?q.slice(a+1,b):q).replace(KWR_REF,' ');const body=nw(fs0.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,''));const __rn0=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));const __rn=b0=>{const r=__rn0(b0);if(b0.length>=4&&/^(?:that|how|whether)$/.test(b0[0]))r.push(...__rn0(b0.slice(1)));{let k=b0.length;if(k>=3&&/^(?:it|that|this|so|them|these|those)$/.test(b0[k-1])&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-2])&&b0[k-3]==='i')k--;  if(k>=2&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-1])&&b0[k-2]==='i'){k-=2;if(k>0&&/^(?:which|as|that|this)$/.test(b0[k-1]))k--;if(k>=3)r.push(...__rn0(b0.slice(0,k)));}}  return r;};  const runs=__rn(body).concat(...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(KWR_REF,' ').replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,'')))),__rn(nw((a>=0&&b>a?q.slice(a+1,b):q).replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,''))),...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,''))))); /* pkgKWQ: also the runs with the verse references kept */  for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t||!/^\s*NOT\s+HELD\b/i.test(t))continue;const T=' '+nw(t).join(' ')+' ',T2=' '+nw(String(t).replace(KWR_REF,' ')).join(' ')+' ';if(runs.some(r=>r&&(T.includes(' '+r+' ')||T2.includes(' '+r+' ')))) /* pkgKWQ */return res('CURED','answered: NOT HELD, with a reason that quotes the flagged sentence (pkgKW)'+w,[t]);}}return res('UNCURED','neither the RESPONSE nor the STATEMENT line says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED, REASSERTED IN <round> "<quote>", or NOT HELD with a reason that quotes the flagged sentence',rp?[rp]:(sp?[sp]:null));}
  if(x.rule==='K-S3'){const rp=respOf(x)||'';{const c0=String(rp+__ks3Cont(o,rp)).replace(/^[\s*_\x60"'“”‘’>]+/,'');const __kro=/^COUNTED[*_\x60"'”’]*\s*(?:$|[.:;,!]|--|—|–)/.test(c0)&&!/\b(?:not|never|no|nor|cannot|neither|none)\b|n['’]t\b/i.test(c0.split(/[.;!?](?:\s|$)/)[0]);if(__kro||(/(?<![A-Za-z])COUNTED(?![A-Za-z])/i.test(rp)&&!/^NOT\s+COUNTED\b/i.test(c0)&&!/\bTOUCHES\s+NO\s+LINK\b/i.test(rp))){let __r7=null;try{__r7=(t=>{const P=[/^(?:that|this|it)\s+(?:is|would\s+be|seems)\s+(?:not\s+(?:right|correct|true|accurate|so)|wrong|incorrect|mistaken|false|an?\s+error|in\s+error)(?:\s+here)?$/i,/^(?:that|this|it)\s+isn['’]t\s+(?:right|correct|true|accurate)$/i,/^I\s+(?:do\s+not|don['’]t|cannot|can['’]t|will\s+not|won['’]t)\s+(?:agree|accept)(?:\s+(?:it|this|that|here))?$/i,/^I\s+(?:disagree|object|protest|reject)(?:\s+(?:to\s+)?(?:it|this|that|this\s+item|the\s+item)|\s+with\s+(?:it|this|that|the\s+item))?$/i,/^(?:this|it|that)\s+is\s+an?\s+error(?:\s+of\s+the\s+engine)?$/i,/^(?:it|this|that|the\s+rule|ruling\s+\d+)\s+does\s+(?:not|n['’]t)\s+apply(?:\s+here)?$/i,/^(?:it|this|that)\s+(?:is|was)\s+(?:not|n['’]t|no|never)\s+(?:a\s+)?(?:real\s+|close\s+)?concession(?:\s+(?:here|at\s+all|of\s+any\s+link))?$/i,/^not\s+(?:as\s+)?a\s+(?:close\s+)?concession$/i,/^(?:it|this|that)\s+is\s+(?:a\s+|only\s+a\s+|mere\s+)?courtesy$/i,/^no(?:,\s*it\s+is\s+(?:a\s+)?courtesy)?$/i,/^(?:wrong|incorrect|not\s+so|withdrawn|retracted|struck|strike\s+that|not\s+accepted|not\s+counted|only\s+in\s+part|wrongly\s+asked|under\s+protest)$/i,/^I\s+(?:withdraw|retract|reverse|take\s+back)\s+(?:it|this|that)$/i,/^no,\s*it\s+should\s+not\s+be(?:\s+counted)?$/i,/^(?:it|this|that)\s+is\s+not\s+counted$/i,/^(?:it|this|that)\s+(?:is\s+not|isn['’]t)\s+valid$/i,/^(?:it|this|that)\s+is\s+not$/i,/^(?:it|this|that)\s+cannot\s+stand$/i,/^I\s+deny\s+it$/i];  const B=[/^(?:the\s+count|that\s+count|this\s+count|my\s+count|counted)\s+(?:is|would\s+be|seems)\s+(?:not\s+(?:right|correct|true|accurate|so)|wrong|incorrect|mistaken|false|an?\s+error|in\s+error)(?:\s+here)?$/i,/^(?:it|this|that|the\s+grant)\s+(?:should|must|ought\s+to|can|will|would)\s*(?:not|n['’]t)\s+be\s+counted(?:\s+(?:here|at\s+all))?$/i,/^(?:it|this|that|the\s+grant)\s+cannot\s+be\s+counted(?:\s+(?:here|at\s+all))?$/i,/^I\s+(?:do\s+not|don['’]t|cannot|can['’]t|will\s+not|won['’]t)\s+(?:count|concede)(?:\s+(?:it|this|that|here|this\s+grant|the\s+grant)(?:\s+against\s+(?:[DC]\d|the\s+keystone))?)?(?:\s+after\s+all)?$/i,/^I\s+(?:do\s+not|don['’]t|cannot|can['’]t|will\s+not|won['’]t)\s+accept\s+(?:this|the|that)\s+count$/i,/^I\s+(?:do\s+not|don['’]t)\s+(?:agree|accept)(?:\s+(?:it|this|that))?\s+after\s+all$/i,/^I\s+refuse(?:\s+to\s+(?:count|add)\s+it)?$/i,/^I\s+(?:withdraw|retract|reverse|take\s+back)\s+(?:the\s+count|my\s+count(?:\s+of\s+(?:it|this|that|the\s+grant))?)(?:\s+after\s+all)?$/i,/^I\s+(?:withdraw|retract|reverse|take\s+back)\s+(?:it|this|that)\s+after\s+all$/i,/^on\s+reflection,?\s+(?:no|I\s+(?:withdraw|retract)\s+(?:it|that|the\s+count|my\s+count))$/i,/^(?:that\s+grant|this\s+grant|the\s+grant)\s+(?:is|was)\s+(?:not|n['’]t|no|never)\s+(?:a\s+)?(?:real\s+|close\s+)?concession(?:\s+(?:here|at\s+all|of\s+any\s+link|of\s+[DC]\d|of\s+the\s+keystone))?(?:,?\s+so\s+my\s+count\s+stands(?:\s+unchanged)?)?$/i,/^(?:it|this|that)\s+(?:is|was)\s+(?:not|n['’]t|no|never)\s+(?:a\s+)?(?:real\s+|close\s+)?concession(?:\s+of\s+(?:[DC]\d|the\s+keystone))?,?\s+so\s+my\s+count\s+stands(?:\s+unchanged)?$/i,/^(?:it|this|that|that\s+grant|this\s+grant|the\s+grant)\s+(?:is|was)\s+(?:not|n['’]t|no|never)\s+(?:a\s+)?(?:real\s+|close\s+)?concession\s+of\s+(?:[DC]\d|the\s+keystone)$/i,/^(?:that\s+grant|this\s+grant|the\s+grant)\s+does\s+(?:not|n['’]t)\s+apply(?:\s+here|\s+to\s+(?:[DC]\d|the\s+keystone|any\s+link))?$/i,/^(?:it|this|that)\s+does\s+(?:not|n['’]t)\s+apply\s+to\s+(?:[DC]\d|the\s+keystone)$/i,/^the\s+defender\s+(?:never|did\s+not|didn['’]t)\s+(?:grant|grants|granted|concede|concedes|conceded)\s+(?:this|it|that)$/i,/^the\s+defender\s+(?:does\s+not|doesn['’]t)\s+hold\s+(?:it|this|that)\s+as\s+a\s+concession$/i,/^nothing\s+in\s+the\s+round\s+grants\s+(?:it|this|that)$/i,/^(?:(?:the\s+grant|it|this)\s+does\s+not\s+touch\s+(?:[DC]\d|the\s+keystone|any\s+link),?\s+so\s+)?my\s+count\s+stands(?:\s+unchanged)?$/i,/^the\s+count\s+stays\s+as\s+written$/i,/^I\s+(?:maintain|keep|stand\s+by)\s+my\s+first\s+answer$/i,/^I\s+deny\s+that\s+it\s+is\s+a\s+concession$/i,/^I\s+still\s+(?:think|hold|say)\s+(?:this|it|that)\s+is\s+(?:a\s+|only\s+a\s+|mere\s+)?courtesy(?:\s+and\s+no\s+concession)?$/i,/^the\s+enforcer(?:['’]s\s+note)?\s+is\s+(?:wrong|mistaken|incorrect|in\s+error)$/i];    const pre=String(t).replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/[*_\x60\[\]]+/g,' ').trim().replace(/^COUNTED["'”’]*\s*/i,'');  const cln=s=>s.replace(/^[\s,.:;–—-]*(?:(?:but|though|although|yet|however|and|still|so|then)[\s,]+)?/i,'').replace(/[\s,.]+$/,'');  const m=pre.match(/^[\s,.:;!–—-]*([^.!?]*)([.!?]+|$)/);const f=m&&!/\?/.test(m[2])?cln(m[1]):'';const rest=m?/[A-Za-z0-9]/.test(pre.slice(m[0].length)):false;  if(f&&!rest&&(B.some(r=>r.test(f))||P.some(r=>r.test(f))))return {enf:true,note:null};  let c=String(t).replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/[()]/g,' . ').replace(/[*_\x60\[\]]+/g,' ').trim();c=c.replace(/^COUNTED["'”’]*\s*/i,'');  const S=c.split(/[.;!?:]+(?:\s+|$)|\s+[-–—]+\s+|,\s+(?=(?:but|though|although|yet|however)\b)/).map(s=>s.replace(/^[\s,.–—-]*(?:(?:but|though|although|yet|however|and|still|so|then)[\s,]+)?/i,'').replace(/[\s,.]+$/,'')).filter(Boolean);  const n=S.find((s,i)=>(i===0&&P.some(r=>r.test(s)))||B.some(r=>r.test(s)));  return {enf:false,note:n?n.slice(0,160):null};})(c0);}catch(e){__r7=null;}const __n=[];if(!__kro)__n.push('the strict reader would refuse it: COUNTED is not the first word, or the first sentence holds a negation');if(__r7&&__r7.enf)__n.push('the rev 7 reader reads the whole answer as a refusal');else if(__r7&&__r7.note)__n.push('a sentence reads like a refusal: "'+__r7.note+'"');return res('CURED','answered: the close concession is counted'+(__n.length?' (NOTED, record-only: '+__n.join('; ')+')':''),[rp]);}} /* pkgKRO rev 2 (W4): K-S3 COUNTED reading record-only; COUNTED anywhere (any case) cures unless the answer opens with NOT COUNTED or holds TOUCHES NO LINK; the strict pkgFUK rev 3 A test and the pkgFUN rev 7 reader only add notes */ /* pkgFUK rev 3 A (W3 3817): COUNTED only as the first word of the answer, with no negation in its sentence */const m=rp.match(/\bTOUCHES\s+NO\s+LINK\b\s*:?\s*(.*)$/i);if(m&&m[1].split(/\s+/).filter(Boolean).length>=5)return res('CURED','answered: it touches no declared link or listed premise, with its reason',[rp]);
   {const sp=stmtOf(x)||'';const ms=sp.match(/\bTOUCHES\s+NO\s+LINK\b\s*:?\s*(.*)$/i);if(ms&&ms[1].split(/\s+/).filter(Boolean).length>=5)return res('CURED','answered on the STATEMENT line: it touches no declared link or listed premise, with its reason (pkgKS3)',['STATEMENT: '+sp].concat(rp?[rp]:[]));
    const mn=rp.match(/^\s*NOT\s+HELD\b\s*(?:as\b[^:]*)?:?\s*(.*)$/i);
    const fl=String(x.line||'').replace(/^\s*\w+\s+[CD]R\d+\s*:\s*/i,''),fq=fl.match(/^\s*"(.*?)"\s*--/),fw=krulNorm(fq?fq[1]:fl).split(' ').filter(Boolean),fn=Math.min(6,fw.length),RN=' '+krulNorm(rp)+' ';let quoted=false;for(let i=0;fn&&i+fn<=fw.length&&!quoted;i++)quoted=RN.includes(' '+fw.slice(i,i+fn).join(' ')+' ');
     if(!quoted)for(const __f of nhqFull(x.line,R)){const __w=krulNorm(__f).split(' ').filter(Boolean),__n=Math.min(6,__w.length);for(let i=0;__n&&i+__n<=__w.length&&!quoted;i++)quoted=RN.includes(' '+__w.slice(i,i+__n).join(' ')+' ');}
    if(mn&&mn[1].split(/\s+/).filter(Boolean).length>=5&&quoted)return res('CURED','answered NOT HELD with its reason, quoting the flagged sentence (6 words in a row, or all of it if shorter): the sentence is not a countable concession (pkgKS3)',[rp]);}  return res('UNCURED','the RESPONSE neither counts the close concession (COUNTED) nor says TOUCHES NO LINK: <why>',rp?[rp]:null);}
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
  if(x.rule==='K-UNX'&&x.a){const st=stmtOf(x);
   if(x.asm){const cs0=o.count.filter(c=>c.side===x.side);if(cs0.length&&cs0.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (E-ASM): CORRECTED COUNT '+cs0[0].n+' takes the premise out of the count',cs0.map(c=>c.line));
    const am=String(st||'').match(/\bASSUMES\b\s*:?([\s\S]*)/i);const act=am?unxaAct('ASSUMES: '+am[1]):'';
    if(!am||act||!am[1].trim())return res('UNCURED','TRIAL rule (E-ASM): '+(!st?'no STATEMENT for the item':!am?'the STATEMENT names no ASSUMES: given fact':act?'the STATEMENT\'s ASSUMES still names an inferred act ("'+act+'")':'the ASSUMES: is empty')+', and no CORRECTED COUNT below '+(x.conc||0),st?['STATEMENT: '+st]:null);
    if(x.a==='ASM')return res('CURED','TRIAL rule (E-ASM): the STATEMENT\'s ASSUMES names a given fact, not an inferred act',['STATEMENT: '+st]);}const bare=String(st||'').replace(/["“][^"”]*["”]/g,' ');const q=st&&x.l1&&UNX_MRUN(st,x.l1,6);const lack=!!st&&unxLack(st,x.kinds).missing.length>0;
   if(q&&lack)return res('CURED','TRIAL rule (K-UNX-A): the STATEMENT quotes the block\'s [L1] '+(x.l1ref||'')+' and names a layer the block does not exhibit ([L'+unxLack(st,x.kinds).missing.join('], [L')+'])',['STATEMENT: '+st]);
   const cs=o.count.filter(c=>c.side===x.side);if(cs.length&&cs.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (K-UNX-A): CORRECTED COUNT '+cs[0].n+' takes the premise out of the count',cs.map(c=>c.line));
   return res('UNCURED','TRIAL rule (K-UNX-A): '+(!st?'no STATEMENT for the item':!q?'the STATEMENT does not quote the block\'s [L1] '+(x.l1ref||''):'the STATEMENT quotes the [L1] but names no layer the block does not exhibit (a failure of fit is graded at the collision, not counted)')+', and no CORRECTED COUNT below '+(x.conc||0),st?['STATEMENT: '+st]:null);}
  if(x.rule==='K-UNX'){const st=stmtOf(x);const nm=st?unxLack(st,x.kinds).missing:[];  if(nm.length)return res('CURED','TRIAL rule (K-UNX): the STATEMENT names a layer the block does not exhibit ([L'+nm.join('], [L')+'])',['STATEMENT: '+st]);
   const cs=o.count.filter(c=>c.side===x.side);if(cs.length&&cs.every(c=>c.n<(x.conc||0)))return res('CURED','TRIAL rule (K-UNX): CORRECTED COUNT '+cs[0].n+' takes the premise out of the count',cs.map(c=>c.line));
   return res('UNCURED','TRIAL rule (K-UNX): '+(st?'the STATEMENT names no layer the block lacks':'no STATEMENT for the item')+', and no CORRECTED COUNT below '+(x.conc||0),st?['STATEMENT: '+st]:null);}
  if(x.rule==='K-LB'){const st=stmtOf(x);const rk=x.side==='CHALLENGER'?'DR3':'CR3';let step='step 1 (statement): no STATEMENT line for the item';
   const notC=/\bnot\s+counted\b|\bmark\s+is\s+wrong\b|\bshould\s+not\s+be\s+counted\b/i.test(String(respOf(x)||'')+' '+String(st||''));
   if(st&&(notC||!o.count.some(c=>c.side===x.side&&c.n>(x.conc||0)))){const k=lbFoot(lbBlockText(R[rk],x.premise),true);  const qs=stmtQ(st);const hit=typeof R[rk]==='string'&&qs.some(q=>cureFound(q,R[rk]));
    if(k.length>=2&&hit)return res('CURED','statement quotes ['+rk+'] and the block, read by FOOTING LAYERS, exhibits '+k.join(' and '),['STATEMENT: '+st],k);
    step=!qs.length?'step 2 (quotation): the STATEMENT quotes no words in quotation marks':!hit?'step 2 (quotation): no quotation in the STATEMENT stands in ['+rk+']':'step 3 (layer kinds): the block, read by FOOTING LAYERS, exhibits '+(k.length?k.join(' and ')+' only':'no layer kind')+', fewer than two; a tag or relabelling in the STATEMENT does not change the block';
    if(notC)return res('UNCURED','the item\'s own answer says the premise is not counted, and the STATEMENT was refused at '+step,['STATEMENT: '+st],k);}
   else if(st)step='step 1 (statement): a CORRECTED COUNT was given, so the count is checked instead';
   return kCount(x,'the STATEMENT was refused at '+step);}
  if(x.rule==='K-G8')return kCount(x,'no other cure');
  if(x.rule==='K-S'){const rs=cureRest(o,x);
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(/LINK BROKEN$/.test(rs[0].grade||'')){if(o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded LINK BROKEN',[rs[0].line,o.result[0].line]);}
   if(!DRV_ANS.test(rs[0].text))return res('UNCURED','the restated line names no round that answered the witness',[rs[0].line]);
   return res('CURED','regraded: answering round named',[rs[0].line]);}
  if(x.rule==='K-C'||x.rule==='K-S2'){const KEEP=x.rule==='K-S2'?ks2Keeps:netKeeps;  const rs=cureRest(o,x);
   if(!rs.length&&wd.has(U(x.link)))return res('CURED','retracted under a counted RETRACTED line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(KEEP(rs[0].text))return res('UNCURED','the restated line keeps the ground that a verse does not state the link',[rs[0].line]);
   const k=drvKinds(rs[0].text);if(k.length<2){const st=stmtOf(x);const sk=st&&!KEEP(st)?drvKinds(st):[];
    if(wd.has(U(x.link))&&!/LINK BROKEN$/.test(rs[0].grade||''))return res('CURED','retracted under a counted RETRACTED line and restated '+(rs[0].grade||'')+' without the stating ground',[rs[0].line].concat(st?['STATEMENT: '+st]:[]),sk.length?sk:k);
    if(sk.length>=2)return res('CURED','the restated line drops the stating ground; the chain footing is exhibited in the STATEMENT ('+sk.join(' and ')+')',[rs[0].line,'STATEMENT: '+st],sk);
    return res('UNCURED','the restated line names no chain footing: it exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(st?', and the STATEMENT '+(sk.length?'exhibits '+sk.length:'keeps the stating ground or exhibits fewer than two'):''),[rs[0].line],k);}
   if(/LINK BROKEN$/.test(rs[0].grade||'')&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line],k);
   return res('CURED',null,[rs[0].line],k);}
  if(x.rule==='K-N'||x.rule==='K-K'){const rs=cureRest(o,x);const test=x.rule==='K-N'?knLines:kkLines;
   if(!rs.length)return res('UNCURED','no RESTATED line for '+x.link,null);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   const txt=/^D\d+/i.test(x.link)?rs[0].text:x.link+': '+rs[0].text;
   if(test(txt).length)return res('UNCURED','the restated line keeps what '+x.rule+' marks',[rs[0].line]);
   return res('CURED','restated',[rs[0].line]);}
  if(x.rule==='K-SC'){const rs=cureRest(o,x);if(rs.length>1)return res('UNCURED','two RESTATED lines for '+x.link,rs.map(r=>r.line));
   if(rs.length&&rs[0].grade&&rs[0].grade!=='STANDS'){if(/LINK BROKEN$/.test(rs[0].grade)&&o.result.length!==1)return res('UNCURED','regraded LINK BROKEN without exactly one CORRECTED RESULT line',[rs[0].line]);return res('CURED','regraded '+rs[0].grade,[rs[0].line]);}
   const rc=o.restated.filter(r=>r.link==='CONCEDED LINKS');if(x.premise!=null&&rc.length===1&&!cntItems('CONCEDED LINKS: '+rc[0].text).some(i=>i.link===x.premise&&(i.tag==='UNEXHIBITED'||(i.tag==='CONCEDED'&&!knNarrow(i)))))return res('CURED','the restated count no longer counts premise '+x.premise,[rc[0].line]);
   const st=stmtOf(x);if(st){const rk=['CR1','CR2','CR3','CR4','DR1','DR2','DR3'].find(k=>new RegExp('\['+k+'\]').test(st)&&typeof R[k]==='string'&&stmtQ(st).some(q=>cureFound(q,R[k])));if(rk)return res('CURED','statement names '+rk+' and quotes it',['STATEMENT: '+st]);}
   return res('UNCURED',rs.length?'the restated line still grades '+x.link+' STANDS, and no statement names a round and quotes it':'no regrade, no restated count and no statement naming a round and quoting it, for '+x.link,rs.length?[rs[0].line]:null);}
  {const ag=kagCure(x,reply&&reply.ok?reply.text:'',respOf(x));if(ag)return res(ag.st,ag.why,ag.line?[ag.line]:null);}
  {const kk=kkjvCure(x,reply&&reply.ok?reply.text:'');if(kk)return res(kk.st,kk.why,kk.line?[kk.line]:null);}
  {const kr=krulCure(x,reply&&reply.ok?reply.text:'',R,x.rule==='K-CMTL'?(respOf(x)+'\n'+(stmtOf(x)||'')):(x.rule==='K-CMT'?(respOf(x)?respOf(x)+'\n'+(stmtOf(x)||(items.filter(y=>y&&y.rule==='K-CMT').length===1?(o.statement.find(s=>{const L=NZ(s.label);return L==='K-CMT'||L.startsWith('K-CMT ');})||{}).text:'')||''):null):null))  ;if(kr)return res(kr.st,kr.why,kr.line?[kr.line]:null);}
  return res('UNCURED','unknown rule',null);}).concat(krulRestated(items,reply,R)));
}









const rcOne=s=>String(s||'').replace(/\s+/g,' ').trim();


function cecBroken2024(){const L=[];for(const [n,k] of [['Close Enforcer Record','cec'],['Judge Contradiction Record','jcc']]){try{const x=$(n);if(!x||!x.isExecuted)continue;const j=x.first().json;((j&&j[k]&&j[k].confirmed)||[]).forEach(y=>L.push(y));}catch(e){}}
 const seen=new Set();return L.filter(x=>x&&(x.side==='DEFENDER'||x.side==='CHALLENGER')&&Number.isInteger(+x.link)&&+x.link>=1).map(x=>({...x,link:+x.link})).filter(x=>{const k=x.side+' '+x.link;if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>(a.side===b.side?a.link-b.link:a.side==='DEFENDER'?-1:1));} /* pkgCEC rev 2: the pre-panel enforcer and the post-panel confirmation of judge-found contradictions (ASK 2) */
 /* pkgCEC */

 /* pkgRI3B */




function enfPrompt(body){try{if(body&&Array.isArray(body.messages)){const u=body.messages.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].content:null;return typeof c==='string'?c:JSON.stringify(c);}
 if(body&&Array.isArray(body.contents)){const u=body.contents.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].parts:null;return Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):null;}}catch(e){}return null;}

 /* pkgFCD (W3 3817): a K-S3 row says when the follow-up's corrected count was not kept */


/* pkgFUM: the one follow-up. Items the reply left with no line (silent), and K-W/K-CON/K-S3 items answered NOT HELD without the quote; null when none, or not openrouter, or the call failed. */
function fumAsk2024(src,reply,or){try{if(!or||!src||!src.body||!Array.isArray(src.body.messages)||!reply||!reply.ok||!Array.isArray(src.items)||!src.items.length)return null;
 const v=cureVerdicts(src.items,reply,src.broken,src.rounds);const lab=x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':String(x.link==null?'':x.link))+(x.line?': '+String(x.line).replace(/\s+/g,' ').trim():'');
 const miss=v.filter(x=>x.status!=='CURED'&&x.why==='no written response'&&x.silent);
 const noq=v.filter(x=>x.status!=='CURED'&&/^(?:K-W|K-CON|K-S3)$/.test(x.rule)&&x.response&&/^\s*NOT\s+HELD\b/i.test(String(x.response)));
 const ks3=v.filter(x=>x.status!=='CURED'&&x.rule==='K-S3'&&x.response&&!/^\s*NOT\s+HELD\b/i.test(String(x.response))&&!miss.includes(x)&&!noq.includes(x)); /* pkgFUK: a K-S3 answer the reader cannot count (TOUCHES NO LINK with a reason under five words, or neither COUNTED nor NOT HELD) */
 const emp=v.filter(x=>x.status!=='CURED'&&/^no written response(?:;|$)/.test(String(x.why||''))&&!x.silent&&!miss.includes(x)&&(()=>{try{const own=cureLines(reply.text).malformed.filter(l=>cureOwn(l,x));return own.length>0&&own.every(l=>/\|$/.test(String(l).replace(/[*\x60_]+/g,'').trim()));}catch(e){return false;}})()); /* pkgFUK rev 2 B (W3 3809): a RESPONSE line with nothing after the bar */
 if(!miss.length&&!noq.length&&!ks3.length&&!emp.length)return null;
 const P=['FOLLOW-UP, asked once. The items below have no line in your reply above that can be counted. Every other item stands as your reply above left it. Answer only the items below, each on its own line beginning RESPONSE:, in the form the request above gives, and write nothing else.'];
 if(miss.length)P.push('','Items your reply left with no RESPONSE line ('+miss.length+'):',...miss.map(x=>'- '+lab(x)),'For each, write: RESPONSE: <the item, as labelled above> | <your answer>. If you hold the item wrong, write: RESPONSE: <the item, as labelled above> | NOT HELD: <your reason>.'+(miss.some(x=>x.rule==='K-RUL')?' For a K-RUL item, write its RESPONSE line and under it the five-line card, one field to a line: RULING, CLAIM, NAMED BY, RULE, APPLIED.':''));
 if(noq.length)P.push('','Items whose NOT HELD reason does not quote the flagged sentence ('+noq.length+'):',...noq.map(x=>'- '+lab(x)),'For each, write its RESPONSE line again: RESPONSE: <the item, as labelled above> | NOT HELD: <your reason>, quoting at least six words in a row of the flagged sentence (all of it when shorter).');
 if(emp.length)P.push('','Items whose RESPONSE line has nothing after the bar ('+emp.length+'):',...emp.map(x=>'- '+lab(x)),'For each, write: RESPONSE: <the item, as labelled above> | <your answer>, in the form the request above gives for its rule.'); /* pkgFUK rev 2 B */
 if(ks3.length)P.push('','K-S3 items whose RESPONSE cannot be counted ('+ks3.length+'):',...ks3.map(x=>'- '+lab(x)),'For each, write its RESPONSE line again in one of these forms: RESPONSE: <the item, as labelled above> | COUNTED, and correct your count; or RESPONSE: <the item, as labelled above> | TOUCHES NO LINK: <at least five words naming why it touches no declared link or listed premise>; or RESPONSE: <the item, as labelled above> | NOT HELD: <your reason>, quoting at least six words in a row of the flagged sentence (all of it when shorter).'); /* pkgFUK */
 return {asked:miss.map(x=>'NO LINE '+lab(x)).concat(noq.map(x=>'NO QUOTE '+lab(x)),ks3.map(x=>'NO REASON '+lab(x)),emp.map(x=>'NO ANSWER '+lab(x))),items:miss.concat(noq,ks3,emp).map(x=>({rule:x.rule,side:x.side||null,link:x.link==null?null:x.link,ruling:x.ruling||null,krul_ctx:x.krul_ctx||null})),others:v.filter(x=>x.rule==='K-RUL'&&!miss.includes(x)&&!noq.includes(x)&&!ks3.includes(x)&&!emp.includes(x)).map(x=>({rule:x.rule,side:x.side||null,link:x.link==null?null:x.link,ruling:x.ruling||null,krul_ctx:x.krul_ctx||null})),first:reply,body:Object.assign({},src.body,{messages:src.body.messages.concat([{role:'assistant',content:String(reply.text==null?'':reply.text)},{role:'user',content:P.join('\n')+((src.body.response_format&&src.body.response_format.type==='json_schema')?xkJsonNote():'')}])})}; /* pkgXK B */
}catch(e){return null;}}
/* pkgFUM rev 3 (W1 3581, W3 3585): from the follow-up, only the lines of an asked item are read: its RESPONSE and STATEMENT lines whose label begins with the item's own rule
   and then names its key, and a five-line card whose RULING line names an asked K-RUL item (krulMatch, as pkgKRC), with or without a RESPONSE line, blank lines inside it skipped, ending at APPLIED or any other line (rev 4, W3 3588). No RETRACTED, RESTATED, PRESSED or SHORT line is read (it would act on every item of its pair).
   Everything else in the follow-up (other items, CORRECTED RESULT/COUNT/STANDING, prose) is dropped, so a follow-up cannot change an item it was not asked about. */
function fumKey2024(x){const N=t=>String(t==null?'':t).toUpperCase().replace(/:/g,' ').replace(/\s+/g,' ').trim();const r=N(x&&x.rule),k=N(x&&x.rule==='K-G3'?(x.side||'')+' STANDING':(x&&x.link));
 return r&&k?new RegExp('^'+r.replace(/[.*+?^$(){}|[\]\\]/g,'\\$&')+' '+k.replace(/[.*+?^$(){}|[\]\\]/g,'\\$&')+'(?![A-Z0-9])'):null;}
function fumKeep2024(text,items,others){const T=String(text==null?'':text).split('\n');const K=(items||[]).map(x=>({x,re:fumKey2024(x)})).filter(z=>z.re);const KR=(items||[]).filter(x=>x&&x.rule==='K-RUL');const out=[];let card=0;const KS3=new Set((items||[]).filter(x=>x&&x.rule==='K-S3').map(x=>String(x.side||'').toUpperCase())); /* pkgFUK rev 2 C1 */
 const N=l=>String(l).replace(/\*\*/g,'').replace(/\u0060/g,'').replace(/^\s*(?:[-*•>]|\d+[.)])?\s*/,'');
 const RUL=/^RULING\s*(?:--|—|–|:)\s*(.*)$/i,FLD=/^(CLAIM|NAMED BY|RULE|APPLIED)\s*:/i;
 const km=(t,x)=>{try{return krulMatch({target:t},x.ruling||x.link,x.krul_ctx||null);}catch(e){return false;}};const OT=(others||[]).filter(x=>x&&x.rule==='K-RUL');const asked=t=>KR.some(x=>km(t,x))&&!OT.some(x=>km(t,x)); /* pkgFUM rev 6 (W2 3605): a card whose RULING target also names an unasked K-RUL item (a grouped pair, keystone) is not read */
 for(const raw of T){const l=N(raw).trim();
  const r=l.match(RUL);if(r){card=(KR.length>0&&asked(String(r[1]).split(/\s+(?:--|—|–)\s+/)[0]||''))?8:0;if(card)out.push(raw);continue;} /* pkgFUM rev 4: a card is read only when its RULING line names an asked K-RUL item */
  if(card){card--;const f=l.match(FLD);if(f){out.push(raw);continue;}} /* pkgFUM rev 5 (W3 3598, W1 3599): the field lines within the 8 lines after an asked RULING line, the window krulCards reads; other lines there are not card lines */
  if(KS3.size){const cc=l.match(/^CORRECTED\s+COUNT\s*:\s*(DEFENDER|CHALLENGER)\s+\d+/i);if(cc&&KS3.has(cc[1].toUpperCase())){out.push(l);continue;}} /* pkgFUK rev 2 C1 (W3 3809): the corrected count asked of a K-S3 item is kept */
  const U=l.toUpperCase().replace(/\s+/g,' ');const m=U.match(/^(RESPONSE|STATEMENT)\s*:\s*([^|]*)\|/);if(!m)continue;const lab=m[2].replace(/:/g,' ').replace(/\s+/g,' ').trim();const z=K.find(z=>z.re.test(lab));if(!z)continue;
  /* pkgFUM rev 7 (W1 3608, W2 3609): the kept line is rewritten to the asked item's own label, so its label names nothing else; an inline card after the pipe is cut unless its target passes asked() */
  let tx=l.slice(l.indexOf('|')+1).trim();const ir=tx.match(/\bRULING\s*(?:--|\u2014|\u2013|:)\s*(.*)$/i);if(ir&&!(KR.length>0&&asked(String(ir[1]).split(/\s+(?:--|\u2014|\u2013)\s+/)[0]||'')))tx=tx.slice(0,ir.index).trim();
  out.push((m[1]+': '+z.x.rule+' '+(z.x.rule==='K-G3'?(z.x.side||'')+' STANDING':String(z.x.link))+' | '+tx).trim());}
 return out.join('\n');}
/* pkgFUM: the kept follow-up lines are read first, then the first reply; a failed follow-up leaves the first reply as it was. */
function fumJoin2024(r1,r2,items,others,src){if(!r1||!r1.ok)return r1||r2||{ok:false,text:null,why:'no reply'};if(!r2||!r2.ok)return Object.assign({},r1,{fum:{ok:false,why:r2?String(r2.why||'no reply'):'no reply'}});
 const k=fumKeep2024(String(cureUnwrap(r2.text)),items,others);
 /* pkgFUK rev 2 C1: a kept CORRECTED COUNT line replaces the first reply's count line of the same side */
 const CC=/^\s*(?:[-*•>]\s*)?\**\s*CORRECTED\s+COUNT\s*\**\s*:\s*\**\s*(DEFENDER|CHALLENGER)\b/i;
 const mk=kk=>{const sd=new Set(String(kk).split('\n').map(l=>(l.match(CC)||[])[1]).filter(Boolean).map(s=>s.toUpperCase()));const t1=sd.size?String(cureUnwrap(r1.text)).split('\n').filter(l=>{const m=l.replace(/\x60/g,'').match(CC);return !(m&&sd.has(m[1].toUpperCase()));}).join('\n'):String(cureUnwrap(r1.text));
  return Object.assign({},r1,{text:(kk?kk+'\n\n':'')+t1,fum:{ok:true,finish:r2.finish||null,kept:kk?kk.split('\n').length:0}});};
 const J=mk(k);
 /* pkgFUM rev 7 guard: the whole build is read with and without the follow-up; if any item that was NOT asked reads differently, the follow-up is dropped and the first reply stands */
 try{if(src&&Array.isArray(src.items)&&src.items.length){const A=new Set((items||[]).map(x=>x.rule+'|'+x.side+'|'+x.link));const v0=cureVerdicts(src.items,r1,src.broken,src.rounds);
  const chOf=JJ=>{const v1=cureVerdicts(src.items,JJ,src.broken,src.rounds);return src.items.map((x,i)=>(!A.has(x.rule+'|'+(x.side||null)+'|'+(x.link==null?null:x.link))&&(v0[i].status!==v1[i].status||String(v0[i].why)!==String(v1[i].why)))?x.rule+' '+x.link:null).filter(Boolean);};
  const ch=chOf(J);
  if(ch.length){const k1=k.split('\n').filter(l=>!CC.test(l)).join('\n');if(k1!==k){const J1=mk(k1);if(!chOf(J1).length){J1.fum.count_dropped='the follow-up CORRECTED COUNT was not kept: it changed unasked item(s): '+ch.join('; ').slice(0,240);return J1;}} /* pkgFUK rev 2 C1: the count alone is dropped, the asked lines stand */
   return Object.assign({},r1,{fum:{ok:false,why:'follow-up dropped: it changed unasked item(s): '+ch.join('; ').slice(0,300)}});}}}catch(e){return Object.assign({},r1,{fum:{ok:false,why:'follow-up dropped: guard error '+String(e&&e.message||e).slice(0,120)}});}
 return J;}
return $input.all().map((it,i)=>{let src=null;try{src=$('R2 Alternate Cure Build').itemMatching(i).json.cure;}catch(e){src=null;}
 if(!src){try{src=$('R2 Alternate Cure Build').all()[i].json.cure;}catch(e){src=null;}}
 const __fd=!!(it.json&&it.json.fum_done);const reply=__fd?fumJoin2024(it.json.fum_first,cureText(it.json.fum_call||{}),it.json.fum_items,it.json.fum_others,src):(it.json&&it.json.cure&&it.json.cure.skip)?{ok:false,text:null,why:it.json.cure.skip}:cureText(it.json);const __fum=__fd?null:fumAsk2024(src,reply,true); /* pkgFUM */
 return {json:{...(__fum?{fum:__fum}:{}),cure:(c=>{if(!c||!c.body)return c;const p=enfPrompt(c.body);return p==null?c:Object.assign({},c,{body:{messages:[{role:'user',content:p}]}});})(src||(it.json&&it.json.cure)||null),reply}};  });