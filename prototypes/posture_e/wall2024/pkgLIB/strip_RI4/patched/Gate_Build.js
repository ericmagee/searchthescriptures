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
function prsUnprovenOnly(line,side){try{const R=PRS_CTX.R;if(!R)return false;const PL=pwList(R,side);if(!PL)return false;const T=String(line||'').replace(/[*_`]+/g,'');
 const U=pwUnans(T);if(!U.length)return false;const P=new Set(),A=new Set();PL.forEach(p=>{p.keys.forEach(k=>P.add(k));(p.all||p.keys).forEach(k=>A.add(k));});
 return !U.some(k=>P.has(k))&&U.some(k=>A.has(k));}catch(e){return false;}}
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
function __kfM(s){const l=String(s==null?'':s);const r=__RL.readLine(l);if(!r||r.form!=='FORCED'||!r.f||!r.f.pair||r.f.restated)return null;const f=r.f;const m=[l,f.pair,f.meansRound,f.means,f.answerRound,f.answer,f.fails];m.index=0;m.input=l;return m;}
const KF_LINE={test:s=>!!__kfM(s),[Symbol.match]:s=>__kfM(s),toString:()=>'KF_LINE (readLines FORCED)'};
const KF_GROUND=/\bforced\b|\bcannot\s+take\b|\bcan(?:no|')t\s+(?:take|fit|bear)\b|\bdoes\s+not\s+fit\b|\bruling\s+396\b|\b396\b/i;
const __kfLB=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/(^|\n)[ \t]*(?:[-*\u2022>]|\d+[.)])[ \t]+/g,'$1');
const __kfIN=s=>__kfLB(s).replace(/(^|\s)\d{1,2}[.)](?=\s|$)/g,'$1');
const kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t))||ciFound(__kfIN(q),__kfIN(t));
function kfLines(text,R){const items=[],marks=[];const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const forced=new Set();
 for(const raw of T.split('\n')){const l=raw.trim();if(!ri4IsF2024(l,/^(?:[-•]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i))continue;const m=l.match(KF_LINE);
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
  items.push({rule:'K-FF',side:'BOTH',link:id,ref,fails:m[6],why,line:'FORCED line for '+id+': '+why+'. Write the FORCED line again with FAILS: "<the answer\'s own words in ['+rk+'] that fail to show the fit, outside its verse quotations>", or RETRACTED the link with one CORRECTED RESULT, or RESTATED it not graded LINK BROKEN. Your line: '+l.slice(0,600)});
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
  items.push({rule:'K-FC',side:'BOTH',link:id,ref:v?v.ref:null,means:m[3],why,line:'FORCED line for '+id+': '+why+'. Write the FORCED line again with CARRIED BY: "<the words of '+(v?v.ref:'the pressed verse')+' that state the MEANS sentence, quoted from the KJV>" between FAILS and GROUND, or RETRACTED the link, or RESTATED it not graded LINK BROKEN. Your line: '+l.slice(0,600)});
  marks.push('[AUDIT v48: DEBATE RULE VIOLATION (K-FC) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}
 return {items,marks,report};}
const UNX_TAG=/\[?\bL([1-4])\b\]?/g;
const UNX_OTHER=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b|\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bROWS\s+GIVE\b|\bASSUMES\b|\bno\s+(?:quoted\s+)?row\s+gives\b/i;
function unxSegs(sec){const s=String(sec||'');const H=[];
 for(const h of s.matchAll(/\bPremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi))H.push({i:h.index,ns:h[1].match(/\d+/g).map(Number)});
 for(const h of s.matchAll(/(?:^|--|;|:|\.)\s*(\d)(?=\s+(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\b)/g)){const i=h.index+h[0].length-1;if(!H.some(x=>x.i<=i&&i<x.i+12))H.push({i,ns:[+h[1]]});}
 for(const h of s.matchAll(/\bSpared\b/g))H.push({i:h.index,ns:[]});
 H.sort((a,b)=>a.i-b.i);return H.map((h,k)=>({ns:h.ns,seg:s.slice(h.i,k+1<H.length?H[k+1].i:s.length)})).filter(x=>x.ns.length);}
function unxLack(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));const named=[];
 for(const m of t.matchAll(/\[?\bL([1-4])\b\]?/g)){const pre=t.slice(Math.max(0,m.index-40),m.index).split(/[.;]/).pop();const post=t.slice(m.index+m[0].length,m.index+m[0].length+60).split(/[.;]/)[0];
  if(/\b(?:no|not|nothing|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\b[^\[]*$/i.test(pre)||/^\s*(?:layer\s+)?(?:(?:is|are)\s+)?(?:missing|absent|lacking|not\s+(?:exhibited|shown|given|present|there))\b/i.test(post)||/^[^\[]{0,30}?\b(?:does|do|did|is|are)\s+not\b|^[^\[]{0,30}?\bfails?\b/i.test(post))named.push(m[1]);}
 return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
function unxNamed(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));
 const named=[...t.matchAll(UNX_TAG)].map(m=>m[1]);return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
const UNX_MW=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const UNX_MRUN=(a0,b0,k0)=>{const a=' '+UNX_MW(a0)+' ',b=UNX_MW(b0);if(!b)return false;if(a.includes(' '+b+' '))return true;const bw=b.split(' ');const k=Math.min(k0,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
const UNX_MGROUND=/\b(?:meet|meets|meeting|met|answer|answers|answering|answered)\b[^.;]{0,80}?\b(?:MEANS|meaning|significance|inference|claim|claimed|press|pressed)\b/i;
function unxPresses(r){const t=String(r||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
 const its=t.slice(i).split(/\n(?=\s*\**\s*\d+[.)]\s)/).filter(x=>/^\s*\**\s*\d+[.)]\s/.test(x));const out=[];
 for(const x of its){const n=+x.match(/^\s*\**\s*(\d+)/)[1];const pw=x.search(/PRESSED WITH\s*:/i);if(pw<0)continue;
  for(const l of x.slice(pw).split('\n').slice(1)){const m=l.match(/^\s*[-*•]?\s*\**\s*([1-3]?\s*[A-Z][A-Za-z ]+?\s+\d+:\d+(?:[-–]\d+)?)\**\s*[\s\S]*?\s--\s*MEANS\s*:\s*([\s\S]+?)(?:\s+--\s+(?=\[L\d\]|PROVEN\b)|\s+\|\s+|$)/);
   if(!m)continue;const means=m[2].replace(/^["“]|["”]$/g,'').trim();if(UNX_MW(means).split(' ').length<3)continue;out.push({n,ref:m[1].replace(/\s+/g,' ').trim(),means});}}
 return out;}
function unxMeansGround(seg,blk,P){if(!UNX_MGROUND.test(seg))return false;const sg=String(seg).replace(/\s+/g,' ');
 return P.some(p=>{const ref=p.ref.replace(/\s+/g,'\\s+').replace(/\./g,'\\.');const hit=UNX_MRUN(sg,p.means,8)||UNX_MRUN(sg,p.means,4)||new RegExp('\\b'+ref+'\\b(?!\\s*[-–]?\\d)').test(sg);
  return hit&&!String(blk).split('\n').some(l=>UNX_MRUN(l,p.means,8));});}
const UNXA_HARD=/\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b/i;
const UNXA_ASM=/\bASSUMES\b/;const UNXA_UNA=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b/i;
function unxaL1(blk){const t=String(blk==null?'':blk).replace(/\*\*/g,'').replace(/__/g,'');const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
 for(const m of t.matchAll(/["“][^"”\n]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)){const a=m.index,b=a+m[0].length;const aft=R.find(r=>r.a>=b&&r.a-b<=4&&/^[\s(]*$/.test(t.slice(b,r.a)));const bef=R.filter(r=>r.b<=a&&a-r.b<=80).pop();const r=aft||bef;
  if(r)return {ref:r.k,q:m[0].slice(1,-1)};}return null;}
const unxaHead=s=>{const m=String(s).match(/^([\s\S]*[.;)])\s*[^.;)]{0,40}$/);return m?m[1]:String(s);};
function unxaAct(cl){const f=String(cl==null?'':cl).replace(/^[\s\S]*?\bASSUMES\b\s*:?/,'').split(/--\s*ROWS\s+GIVE|\bROWS\s+GIVE\b/i)[0];
 const m=f.match(/\b(?:knew|knows?|knoweth|known|knowing|begat|begot|begets?|begotten|begetting|conceived?|conceives|conceiving)\b(?!\s*(?:of|that|as)\b)/i);return m?m[0]:'';}
function unxaCheck(all,blk,k,P){if(all.some(z=>UNXA_HARD.test(unxaHead(z.seg))))return null;if(k.length<2)return null;
 const A=all.filter(z=>UNXA_ASM.test(z.seg)),B=all.filter(z=>UNXA_UNA.test(z.seg));
 if(A.length){const cl=A.map(z=>z.seg.slice(z.seg.search(UNXA_ASM))).join(' ');const asm=unxaAct(cl);const l1=k.includes('L1')?unxaL1(blk):null;const ua=!!(l1&&!UNX_MRUN(cl,l1.q,6));
  if(ua||asm)return {a:ua?'ASSUMES':'ASM',asm,l1:l1||unxaL1(blk),seg:A[0].seg};}
 if(B.length){const BL=String(blk).split('\n');const L=BL.filter(l=>/\bMEANS\b/.test(l));
  const sub=p=>{const i=BL.findIndex(l=>/\bMEANS\b/.test(l)&&UNX_MRUN(l,p.means,8));if(i<0)return '';let e=BL.findIndex((l,x)=>x>i&&/\bMEANS\b/.test(l));return BL.slice(i,e<0?BL.length:e).join('\n');};
  for(const z of B){const sg=z.seg.replace(/\s+/g,' ');for(const p of P){const ref=p.ref.replace(/\s+/g,'\\s+').replace(/\./g,'\\.');
   if(!(new RegExp('\\b'+ref+'\\b(?!\\s*[-–]?\\d)').test(sg)||UNX_MRUN(sg,p.means,8)))continue;if(L.some(l=>UNX_MRUN(l,p.means,8)))return {a:'UNANSWERED',press:p,l1:unxaL1(sub(p))||unxaL1(blk),seg:z.seg};}}}
 return null;}
function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||!(typeof ptext==='string'||(ptext&&typeof ptext==='object')))return {items,marks};let R;try{R=typeof ptext==='string'?ciRounds(ptext):ptext;}catch(e){return {items,marks};}
 for(const side of ['DEFENDER','CHALLENGER']){const rk=side==='CHALLENGER'?'DR3':'CR3';const sec=ciCountSection(text,side);if(!sec||typeof R[rk]!=='string')continue;
  const n0=+((sec.match(/:\s*(\d+)/)||[])[1]||0);const lab=side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';if(!(n0>=1))continue;
  const SG=unxSegs(sec);const PR=unxPresses(side==='CHALLENGER'?R.CR3:R.DR3);const segsOf=j=>SG.filter(s=>s.ns.includes(j));
  for(const s of SG){if(!/\bUNEXHIBITED\b/.test(s.seg)||/\b(?:not|never|no\s+longer)\s+UNEXHIBITED\b/i.test(s.seg))continue;
   for(const j of s.ns){const all=segsOf(j);if(all.some(z=>UNX_OTHER.test(z.seg))){const bk=lbBlockText(R[rk],j);const ua=bk?unxaCheck(all,bk,lbFoot(bk,true),PR.filter(p=>p.n===j)):null;
    if(ua){const id=side+' premise '+j;if(!items.some(x=>x.link===id)){const k=lbFoot(bk,true);const L1=ua.l1?ua.l1.ref+' "'+ua.l1.q.slice(0,160)+'"':'';
     const why=(ua.asm?'counted UNEXHIBITED in '+lab+' on an ASSUMES ground that names an act the link infers ("'+ua.asm+'"); an inferred act, such as a begetting or a knowing, is never an ASSUMES'+(ua.a==='ASM'?'':'; and it is '):'')+(ua.a==='ASM'?'':ua.a==='ASSUMES'?'counted UNEXHIBITED in '+lab+' on an ASSUMES ground, but its ['+rk+'] block exhibits '+k.join(' and ')+' and the ASSUMES clause does not quote the block\'s [L1] '+L1
      :'counted UNEXHIBITED in '+lab+' as unanswered, but its ['+rk+'] block quotes the MEANS of the press '+ua.press.ref+' under a MEANS line and answers it with '+k.join(' and '));
     items.push({rule:'K-UNX',a:ua.a,asm:ua.asm||'',side,link:id,premise:j,kinds:k,conc:n0,l1:ua.l1?ua.l1.q:'',l1ref:ua.l1?ua.l1.ref:'',press:ua.press?ua.press.ref:'',why,line:id+': '+why+'. Quote the block\'s [L1]'+(L1?' ('+L1+')':'')+(ua.a==='UNANSWERED'?' answering that press':'')+' in a STATEMENT for this item and name the layer the block lacks ("[L1]", "[L2]", "[L3]" or "[L4]", one the block does not exhibit; a failure of fit is not a missing layer), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). A KEEP does not cure it. Your count: '+ua.seg.replace(/\s+/g,' ').trim().slice(0,400)});
     if(ua.asm){const it=items[items.length-1];it.line=id+': '+why+'. In a STATEMENT for this item write ASSUMES: <the given fact the step takes for granted, not what the link infers>'+(ua.a==='ASSUMES'?' and quote the block\'s [L1]'+(L1?' ('+L1+')':'')+', naming what that verse lacks for the step':'')+'; or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). A KEEP does not cure it. Your count: '+ua.seg.replace(/\s+/g,' ').trim().slice(0,400);}
     marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}
    if(!ua&&bk){const kk=lbFoot(bk,true);const nl=all.map(z=>unxLack(z.seg,kk));const nm=[...new Set([].concat(...nl.map(r=>r.named)))].sort();
     if(kk.length>=2&&nm.length&&nl.every(r=>!r.missing.length)){const id=side+' premise '+j;if(!items.some(x=>x.link===id)){const z0=all[0];
      const why='counted UNEXHIBITED in '+lab+' saying the block lacks '+nm.map(n=>'[L'+n+']').join(' and ')+', but its ['+rk+'] block exhibits '+kk.join(' and ')+'; the count names no layer the block lacks';
      items.push({rule:'K-UNX',side,link:id,premise:j,kinds:kk,conc:n0,lack:nm,why,line:id+': '+why+'. Name the missing layer in a STATEMENT for this item ("[L1]", "[L2]", "[L3]" or "[L4]", one the block does not exhibit), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). Your count: '+z0.seg.replace(/\s+/g,' ').trim().slice(0,400)});
      marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}}
    continue;}const blk=lbBlockText(R[rk],j);if(!blk)continue;const k=lbFoot(blk,true);if(k.length<2)continue;if(all.some(z=>unxMeansGround(z.seg,blk,PR.filter(p=>p.n===j))))continue;if(all.some(z=>unxNamed(z.seg,k).missing.length))continue;
    const id=side+' premise '+j;if(items.some(x=>x.link===id))continue;const why='counted UNEXHIBITED in '+lab+', but its ['+rk+'] block exhibits '+k.join(' and ')+' and the count names no layer the block lacks';
    items.push({rule:'K-UNX',side,link:id,premise:j,kinds:k,conc:n0,why,line:id+': '+why+'. Name the missing layer in a STATEMENT for this item ("[L1]", "[L2]", "[L3]" or "[L4]", one the block does not exhibit), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). Your count: '+s.seg.replace(/\s+/g,' ').trim().slice(0,400)});
    marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}}
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
function kl2Lines(text,L2D){const items=[],marks=[];if(!L2D||!Array.isArray(L2D.ow)||typeof L2C==='undefined')return {items,marks};
 const T=String(text||'').replace(/\\n/g,'\n');const rounds=[];T.split('\n').forEach((l,i)=>{if(/\[L2\]/.test(l)&&/^\s*(?:[-•]|\d+[.)])?\s*[*_]*\s*D\d+\s+vs\.?\s+C\d+/i.test(l))rounds.push(['JUDGE','line '+(i+1),l]);});
 if(!rounds.length)return {items,marks};const R=L2C.check(L2C.tags(rounds),L2D.ow,L2D.lex,L2D.read);
 for(const t of R){if(t.status!=='NOT COUNTED')continue;const id=(t.seg.match(/D\d+\s+vs\.?\s+C\d+/i)||[null])[0]||(rounds.find(r=>r[1]===t.round)[2].match(/D\d+\s+vs\.?\s+C\d+/i)||['L2'])[0];const lk=String(id).replace(/\s+vs\.?\s+/i,' vs ');
  if(items.some(x=>x.link===lk))continue;items.push({rule:'K-L2',side:'BOTH',link:lk,line:rounds.find(r=>r[1]===t.round)[2].trim().slice(0,600),why:t.why});
  marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-L2) -- '+lk+': an [L2] of the seat\'s own ground is NOT COUNTED ('+t.why.replace(/[\[\]]/g,'')+'); a NOT COUNTED [L2] voids that ground. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
const __CURE396=" FORCED LINK (ruling 411): a K-G4 item on a link you graded BROKEN because the link cannot take the witness's meaning, though the holding side answered it, is cured by one FORCED line for that item, its three quotations standing in the rounds named. FORCED LINK (md_notes_rulings 396): a link that cannot take a proven witness's meaning is forced and breaks; the meaning weighed is the one the debaters exhibit, and you supply none of your own; that no witness states the point in its own words is never a ground, for either side. PROVEN PRESS (md_notes_rulings 398): a witness is a proven press, one the ledger marks PROVEN or PROVEN BY REFERENCE; a press it marks UNPROVEN is not a witness. K-P (you counted a premise UNEXHIBITED, or graded a link BROKEN as left unanswered, on a press the ledger marks UNPROVEN, not a witness, ruling 398): cure a count with CORRECTED COUNT for that side without that premise and the CORRECTED STANDING that count makes true; cure a BROKEN line with RETRACTED for it and one CORRECTED RESULT, or one RESTATED line that is not graded LINK BROKEN or that rests on a proven press. K-F (a FORCED line whose quotations do not each stand in the round named, or a link graded BROKEN as forced with no FORCED line): cure it with one FORCED line for the item, FORCED: D<i> vs C<j> -- MEANS [<round>]: \"<the MEANS sentence with its layers>\" -- ANSWER [<round>]: \"<the holding side's answer>\" -- FAILS: \"<the layer of that answer that fails>\", each quotation word for word in the round it names, or with RETRACTED for the line and one CORRECTED RESULT, or one RESTATED line not graded LINK BROKEN. K-R (a press proven by reference with no REFERENCE line, or a REFERENCE line whose quotations the rounds do not hold): cure it with one REFERENCE line: REFERENCE: <the press's reference> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- \"<the referenced block's stated meaning>\" / \"<the press's MEANS sentence>\". K-L2 (an [L2] of your own, in a COLLISION POINTS line, whose word stands in no verse that line cites): cure it with RETRACTED for the line and one CORRECTED RESULT, or one RESTATED line whose [L2] words each stand in a verse it cites, or that drops the [L2]. ";
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
const enfSilent=x=>!!(x&&x.silent===true);
const enfUncured=v=>(v||[]).filter(x=>x&&x.status!=='CURED'&&(enfLive(x)||enfSilent(x))).length;
const enfTrialWhy=(x,why)=>enfLive(x)?why:(enfSilent(x)?'TRIAL rule, NO WRITTEN RESPONSE: counts in drv_uncured like a LIVE item (silence count)':'TRIAL rule (recorded and answered; it removes no seat)')+(why?': '+why:'');
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
const drvTranslit=(rest,before)=>{const ok=m=>{if(!m)return false;const w=m[1].split(/\s+/);while(w.length&&DRV_TL_STOP.test(w[0]))w.shift();return w.length>0&&!DRV_TL_STOP.test(w[w.length-1]);};
 const gl=m=>!/\d|^(?:see|cf|compare|or|i\.e)\b/i.test(String(m[2]||''));const any=rx=>[...String(rest||'').matchAll(rx)].some(m=>ok(m)&&gl(m));
 return ok(String(rest||'').match(DRV_TL_AFTER))||ok(String(before||'').match(DRV_TL_BEFORE))||any(DRV_TL_ANY)||any(DRV_TL_PAIR);};
function drvLayers(text){return lbFoot(text,true);}
function drvLayersByTag(text){const t=String(text==null?'':text).replace(/\*\*/g,'').replace(/__/g,'');const re=/\[L([1-3])\](?:\s*(?:\/|and|,)?\s*\[L([1-3])\])*/g;const at=[];let m;
 while((m=re.exec(t)))at.push({i:m.index,e:m.index+m[0].length,ts:[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1])});const met=new Set();
 at.forEach(x=>{if(DRV_NEG.test(t.slice(Math.max(0,x.i-30),x.i)))return;const tail=t.slice(x.e);let end=tail.search(/\[L[1-4]\]|\n\s*\n/);end=end<0?t.length:x.e+end;
  const rest=t.slice(x.e,end);
  for(const ty of x.ts){if(ty==='1'&&DRV_QUOTE.test(rest))met.add('L1');if(ty==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest,t.slice(Math.max(0,x.i-60),x.i))))met.add('L2');
   if(ty==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(t.slice(Math.max(0,x.i-40),x.i))))met.add('L3');}});
 return [...met].sort();}
function drvExhibits(line,needQuote,formC,distinct){const k=drvLayers(line);return distinct?k:k.length;}
const drvKinds=(line)=>drvLayers(line);
const DRV_WORDS=/\b(?:unanswered|not answered|unnamed|not named|none named|neither named|unaddressed)\b/i;
const DRV_STATE=/\b(?:do|does|did)\s+not\s+state\b|\bnot\s+stated\b|\bnever\s+states?\b|\bneither\s+states?\b|\bnor\s+states?\b|\bno\s+(?:\S+\s+){0,4}?(?:verse|row|witness|quotation|passage|text)s?\b(?:\s+\S+){0,4}?\s+(?:states?|names?)\b|\bno\s+\[L[1-4]\](?:\s*\/\s*\[L[1-4]\])*\s+(?:states?|names?)\b|\b(?:met\s+by|without)\s+any\s+(?:verse|row|witness|quotation)\s+that\s+(?:states?|names?)\b/i;
const DRV_ANS=/[\[(](?:CR[2-4]|DR[1-3])\b/i;
const DRV_BARE=/\b(?:in|at|by|from)\s+(?:CR[2-4]|DR[1-3])\b/i;
const DRV_UNANS=[/\b(?:was|were|is|are)\s+(?:left\s+)?(?:not\s+named|unnamed|unanswered|not\s+answered)\b/gi,/,\s*not\s+named\b/gi,/\bleft\s+(?:\S+\s+){1,8}?unnamed\b/gi,/\bunanswered\s+(?:[1-3]\s+)?[A-Z][a-z]+\s+\d+:\d+/g,/\bthe\s+unanswered\s+[a-z]+/gi];
const DRV_UNEG=/\b(?:no|neither|nor|not|never|without|cannot)\b/i;
function drvUnans(line){for(const rx of DRV_UNANS){rx.lastIndex=0;let m;while((m=rx.exec(line))){const pre=line.slice(0,m.index);
  const cl=pre.split(/;|\.(?=\s)|--|—/).pop();if(!DRV_UNEG.test(cl))return m[0];}}return null;}
const NET_STATE=[
 /\b(?:do|does|did)\s+not\s+(?:\S+\s+){0,4}?(?:state|name|deny|assert)s?\b/i,
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
const NET_PRECEPT=/\b(?:scriptures?|precept\s+upon\s+precept)\b/i;const netRefs=s=>(String(s||'').match(/\b(?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+/g)||[]).length;
const netFoot=s=>/\b(?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+/.test(String(s||''))||/\[L[1-3]\]/.test(String(s||''));const netPrecept=(cl,line)=>NET_PRECEPT.test(cl)&&(netFoot(cl)||netFoot(line));
const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:/;
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|COLLISION POINTS)\b/i;
function netSide(cl,at){const sub=cl.slice(Math.max(0,at-90),at);if(/\bneither\s+side|\bboth\s+(?:sides|chains)|\beither\s+way\b/i.test(cl))return 'BOTH';
 const d=sub.search(/\bdefender/i),c=sub.search(/\bchallenger/i);if(d<0&&c<0)return 'CHALLENGER';return d>c?'DEFENDER':'CHALLENGER';}
function netUnwrap(text){let t=String(text||'');const s=t.trim();if(s[0]==='{'){const s2=(!/\}\s*$/.test(s)&&/"\s*$/.test(s))?s+'}':s;  const i=s2.lastIndexOf('}');try{const j=JSON.parse(s2.slice(0,i+1));if(j&&typeof j.reasoning==='string')return j.reasoning;}catch(e){}}return t;}
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
  if(!item||NET_SKIP.test(u)||/^(?:DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*FOOTED\b/.test(u))continue;
  const clauses=drvGround(line,DL).split(  /;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/);
  for(const cl0 of clauses){const cl=netMask(cl0);if(!NET_STATE.some(rx=>rx.test(cl)))continue;
   const hit=NET_STATE.find(rx=>rx.test(cl));const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at))||(NET_CLAIM.test(cl.slice(0,at))&&!NET_PLURAL.test(cl)))continue;if(netPrecept(cl0,drvGround(line,DL)))continue;
   if(!vs&&!NET_PLURAL.test(cl))continue;
   out.push({item,side:item==='DEFENDER CHAIN MARK'?'DEFENDER':item==='CHALLENGER CHAIN MARK'?'CHALLENGER':netSide(cl,at),line});break;}}
 return out;}
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
function kwLines421(text,R){const items=[],marks=[];if(!R)return {items,marks};const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/gi;
 for(const [side,rks] of [['DEFENDER',['CR2','CR3','CR4']],['CHALLENGER',['DR2','DR3','DR4']]]){let n=0;
  for(const rk of rks){const t=String(R[rk]||'').replace(/[*_`]+/g,'');if(!t)continue;
   for(const m of t.matchAll(RX)){if(n>=10)break;const pre=t.slice(0,m.index);{const ls=pre.lastIndexOf('\n')+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);if((/^\s*#/.test(ln)&&!/[.!?]["\u201d']?\s*$/.test(ln))||((bf.match(/["\u201c\u201d]/g)||[]).length%2===1)||/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length))){n++;continue;}}  const hd=[...pre.matchAll(/(?:^|\n)[ \t>#-]*((?:LINK\s*\d+|[DC]\d+)\b[^\n:]{0,40}):/gi)].pop();const lab=hd?(hd[1].match(/^(?:LINK\s*\d+|[DC]\d+)\b/i)||[hd[1]])[0].replace(/\s+/g,' ').trim().slice(0,30):'no link heading';
    let s=t.slice(m.index).split(/(?<=[.!?])\s|\n/)[0].slice(0,220).trim();if(/^\s*(?:it|that|this|so|them|these|those)?\s*[.!?]?["\u201d']?\s*$/i.test(s.slice(m[0].length))){const bnd=x=>Math.max(t.lastIndexOf('\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?]["\u201d']?\s+/g)].map(z=>z.index+z[0].length));const ls2=bnd(m.index);const own=t.slice(ls2,m.index).replace(/[,;:\s]*(?:which|as|that|this)?\s*$/i,'');if(/[A-Za-z0-9]/.test(own)){if(!/[A-Za-z0-9]/.test(s.slice(m[0].length)))s=(t.slice(ls2,m.index)+s).slice(0,220).trim();}else{let q=ls2;while(q>0&&/\s/.test(t[q-1]))q--;const pv=q>0?t.slice(bnd(q-1),q).trim():'';if(!/[A-Za-z0-9]/.test(pv)||!(/[.!?]["\u201d')]?$/.test(pv)||/"[^"]{3,}"|\u201c[^\u201d]{3,}\u201d/.test(pv))){n++;continue;}s=(pv+' '+s).slice(0,300).trim();}  }  n++;const id=side+' '+rk+' '+lab+' #'+n;
    items.push({rule:'K-W',side,link:id,line:'['+rk+'] '+lab+': "'+s+'"'});
    marks.push('[AUDIT v30: WITHDRAWAL TO ANSWER (K-W; ruling 421) -- '+id+': "'+s.replace(/[\[\]"]/g,'')+'"; the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}}
 {const P=wpLines2024(R);P.items.forEach(x=>items.push(x));P.marks.forEach(x=>marks.push(x));const Q=kconLines2024(text,P.items);Q.items.forEach(x=>items.push(x));Q.marks.forEach(x=>marks.push(x));const Z=kcmtLines2024(text);Z.items.forEach(x=>items.push(x));Z.marks.forEach(x=>marks.push(x));}
 return {items,marks};}
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
function kcmtGrade2024(l){if(/^\[AUDIT\b/.test(l))return false;const h=l.replace(/^[-*•>\s]+/,'').replace(/^\*\*/,'');
 if(/^RESULT\s*:.*\brecomputed\b/i.test(h))return false;if(/^CLAUSE\s*:/i.test(h))return false;if(/^SUPERSEDED BY CURE\s*:/i.test(h)||/^RESULT\s*:.*\bderived after the send-back\b/i.test(h))return false;  if(/^(?:DEFENSE|CHALLENGE)\s+STANDING\s*:/i.test(h))return false;
 if(/^(?:RULING\s*(?:--|—|–|:)|CLAIM\s*:|NAMED BY\s*:|RULE\s*:|APPLIED\s*:)/i.test(h))return false;
 if(/\bCommitments?\s*\d+/i.test(h))return false;
 let t=h.replace(/"[^"]*"|“[^”]*”/g,' ');
 if(/^ANSWER CHECK\s*:/i.test(h)){const a=t.lastIndexOf('ANSWER:');const sg=(a<0?'':t.slice(a)).split(/\s(?:--|—|–)\s/);t=sg.length>1?sg[1]:'';}
 t=t.replace(/\b(?:none|no\s+\w+(?:\s+\w+)?)\s+(?:(?:is|are|was|were)\s+)?(?:counted\s+as\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/gi,' ').replace(/\bnot\s+(?:(?:graded|counted|ruled|held)\s+)?(?:(?:DEFENDER|CHALLENGER)\s+)?(?:LINK\s+)?(?:BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/gi,' ');
 return /\b(BROKEN|FORCED|MISSES|VOID|UNPROVEN)\b/.test(t);}
function kcmtlSeg2024(text,k){for(const s of String(text||'').split(/;|\n/)){const m=s.match(/^\s*lines?\s+((?:\d+\s*(?:,|and|&)?\s*)+)\s*(?::|--|\u2014|\u2013|-)\s*([\s\S]*)$/i);if(m&&(m[1].match(/\d+/g)||[]).map(Number).includes(k))return s.trim();}return null;}
function rechk2024(rp,RD){const out=[];const one=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();const has=RD&&['CR1','CR2','CR3','CR4','DR1','DR2','DR3','DR4'].some(k=>typeof RD[k]==='string');
 const pairOf=l=>{const m=one(l).match(/^(?:[-\u2022]\s*)?FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);return m?(m[1]+' vs '+m[2]).toUpperCase():null;};
 for(const [o0,n0,id0] of (rp||[])){const O=String(o0==null?'':o0).split('\n').map(one).filter(Boolean),N=String(n0==null?'':n0).split('\n').map(one).filter(Boolean);const OS=new Set(O);
  for(const l of N){if(OS.has(l)||/^\[AUDIT\b/.test(l))continue;
   if(kcmtGrade2024(l))out.push({id:id0||null,rule:'K-CMT',line:l,orig:O.join(' / '),old:O.some(x=>kcmtGrade2024(x)),why:'a contested grade line that names no Commitment N'});
   const pk=pairOf(l);if(pk){if(!has){out.push({id:id0||null,rule:'K-F',line:l,orig:O.join(' / '),old:null,why:'not re-checked: no rounds'});continue;}const it=kfLines(l,RD).items;
    if(it.length){const oi=O.filter(x=>pairOf(x)===pk);out.push({id:id0||null,rule:'K-F',line:l,orig:O.join(' / '),old:oi.some(x=>kfLines(x,RD).items.length>0),why:it[0].why});}}}}
 return out;}
function rechkRounds2024(seat){try{const PB=$('Panel Build').first().json;const J=PB.judges||[];const j=J.find(q=>q.seat===seat)||J.find(q=>q&&q.body);return j&&j.body?cureRounds(j.body):null;}catch(e){return null;}}
function kcmtLines2024(text){const items=[],marks=[];if(typeof text!=='string'||!text.trim())return {items,marks};
 let T=text;{const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const j=JSON.parse(s.slice(0,i+1));if(j&&typeof j.reasoning==='string')T=j.reasoning;}catch(e){}}}
 const L=T.split('\n').map(l=>l.trim()).filter(l=>l&&kcmtGrade2024(l));
 if(!L.length)return {items,marks};
 items.push({rule:'K-CMT',side:'JUDGE',link:'contested grades without a commitment',line:L.length+' contested grade line'+(L.length===1?'':'s')+' name no commitment (answer each with its Commitment N, or NOT A GRADE); first: '+L.slice(0,5).map(l=>'"'+l.slice(0,160)+'"').join('; ')});
 L.forEach((l,k)=>items.push({rule:'K-CMTL',side:'JUDGE',link:'line '+(k+1),line:'"'+l.slice(0,400)+'" -- this contested grade line names no commitment. TRIAL rule: answer it with RESPONSE: K-CMTL line '+(k+1)+' | (Commitment N), the commitment the grade applies, or NOT A GRADE where the line carries a grade word but grades nothing.'+(k===0&&L.length>1?' Several lines may share one RESPONSE, each line with its own answer, for example: RESPONSE: K-CMTL lines | line 1: (Commitment 3); line 2: (Commitment 7); line 4: NOT A GRADE.':'')}));
 marks.push('[AUDIT v33: GRADE WITHOUT ITS COMMITMENT (K-CMT) -- '+L.length+' contested grade line'+(L.length===1?'':'s')+' name no "(Commitment N)"; first: '+L.slice(0,3).map(l=>l.replace(/[\[\]"]/g,'').slice(0,120)).join(' / ')+'; the judge answers each line with its (Commitment N), or NOT A GRADE where the line carries a grade word but grades nothing. LIVE rule: left unanswered after the cure, it removes the seat; a Commitment N or NOT A GRADE on its RESPONSE or STATEMENT line answers it.]');
 return {items,marks};}
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
 const L=T.split('\n');{const kl=L.find(l=>/^\s*[-*•]?\s*\**KEYSTONE\s*:/.test(l));if(kl){add('keystone','JUDGE');const km=kl.match(/KEYSTONE\s*:\s*\**\s*(D\d+)\b/i);const ke=out.find(u=>u.id==='keystone');if(km&&ke)ke.ks=km[1].toUpperCase();}}
 for(const l of L){let m=l.match(/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b/);if(m)add(m[1]+' vs '+m[2],'JUDGE');
  m=l.match(/^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/);if(m)add(m[1]+' vs '+m[2],'JUDGE');}
 return out;}
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
function krulLines2024(text,R,CP,ACC,PT){const items=[],marks=[];if(typeof text!=='string'||!text.trim())return {items,marks};const X=krulText(text);
 const cp=CP||(X.J?{DEFENDER:X.J.counted_premises_defender,CHALLENGER:X.J.counted_premises_challenger}:null);const RUL=krulRulings(X.T,cp);if(!RUL.length)return {items,marks};
 const cards=krulCards(X.T);const own=krulOwn(ACC);const SRC=Object.values(R||{}).filter(v=>typeof v==='string').join('\n')+'\n'+String(PT||'');
 const KX={ks:(RUL.find(u=>u.id==='keystone')||{}).ks||null,ps:{}};RUL.forEach(u=>{const m=u.id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(m)(KX.ps[m[2]]=KX.ps[m[2]]||[]).push(m[1]);});
 for(const u of RUL){const c=cards.find(c=>krulMatch(c,u.id,KX));const why=krulCheckCard(c,SRC,own);if(!why)continue;
  items.push({rule:'K-RUL',side:u.side,link:u.id,ruling:u.id,krul_ctx:KX,line:'deciding ruling '+u.id+': '+why+'; answer with the five-line card (RULING, CLAIM, NAMED BY, RULE, APPLIED)'});
  marks.push('[AUDIT v34: RULING WITHOUT A VALID CARD (K-RUL; Commitment 11) -- '+u.id+': '+why.replace(/[\[\]"]/g,'')+'. TRIAL rule: it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
function kconUnlabel(l){return String(l==null?'':l).replace(/^\s*(?:[-•*>]\s*)?\**\s*(?:RESPONSE\**\s*:[^|\n]*\|\s*|STATEMENT\**\s*:\s*)\**\s*/i,'');}
function nhqFull(line,rounds){const L=String(line||'');const R=rounds||{};const Nr=s=>String(s||'').replace(/\\"/g,'"').replace(/[\u201c\u201d\u2018\u2019"]/g,"'").replace(/[*_`]+/g,'').replace(/\s+/g,' ');const out=[];
 const re=/(?:\[([CD]R\d)\]|\b([CD]R\d)\s*:)[^"\[\]]{0,80}?"/g;let m;while((m=re.exec(L))){const rk=m[1]||m[2];const a=m.index+m[0].length;const b=L.indexOf('"',a);let q=Nr(b<0?L.slice(a):L.slice(a,b)).replace(/\s*(?:\.\.\.|\u2026)\s*$/,'').trim();
  if(b>=0)re.lastIndex=b+1;const t=Nr(R[rk]);if(!t||q.length<12)continue;const k=q.slice(0,60);const p=t.indexOf(k);if(p<0)continue;
  const from=p+Math.max(q.length-1,0);const e=t.slice(from).search(/(?<!\.)[.!?](?!\.)(?=["')\]]*(?:\s|$))/);  const full=t.slice(p,e<0?Math.min(t.length,p+1500):from+e+1).slice(0,1500);if(full.length>=q.length)out.push(full);}
 return out;}
function krulCure(x,replyText,rounds,respText){const T=krulText(replyText).T;
 if(x.rule==='K-RUL'){const c=krulCards(T).find(c=>krulMatch(c,x.ruling||x.link,x.krul_ctx||null));const why=krulCheckCard(c,Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n'),null);return why?{st:'UNCURED',why}:{st:'CURED',why:'a valid ruling card for '+(x.ruling||x.link),line:c.head};}
 if(x.rule==='K-CMT'||x.rule==='K-CMTL'){const rp=String(respText||'');if(/\bCommitments?\s*\d+/i.test(rp)||/\bNOT A GRADE\b/.test(rp))return {st:'CURED',why:'the response names the commitment, or NOT A GRADE',line:rp};return {st:'UNCURED',why:rp?'the RESPONSE names no Commitment N and no NOT A GRADE':'no written response'};}
 if(x.rule==='K-CON'){const qs=[...String(x.line||'').matchAll(/"([^"]{12,})"/g)].map(m=>m[1]).concat(nhqFull(x.line,rounds));
  const runs=[];for(const q of qs){const w=krulNorm(q).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++)runs.push(w.slice(i,i+6).join(' '));}
  const ln=T.split('\n').find(l0=>{const l=kconUnlabel(l0);return /^\s*(?:[-•*]\s*)?\**(CONTRADICTION\b|NOT HELD\b|REASSERTED IN\b)/i.test(l)&&!/NONE FOUND/i.test(l)&&runs.some(r=>(' '+krulNorm(l)+' ').includes(' '+r+' '));});
  return ln?{st:'CURED',why:'captured with a quote of the flagged sentence',line:ln.trim()}:{st:'UNCURED',why:'no CONTRADICTION, NOT HELD or REASSERTED IN line quotes the flagged sentence'};}
 return null;}
function krulRestated(items,reply,rounds){const out=[];const T=krulText(reply&&reply.ok?reply.text:'').T;if(!T)return out;
 const covered=new Set((items||[]).filter(x=>x&&x.rule==='K-RUL').map(x=>x.ruling||x.link));const cards=krulCards(T);const SRC=Object.values(rounds||{}).filter(v=>typeof v==='string').join('\n');const seen=new Set();
 for(const l of T.split('\n')){const m=l.replace(/[*`]+/g,'').match(/^\s*(?:[-•]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);if(!m)continue;const id=m[1].toUpperCase()+' vs '+m[2].toUpperCase();if(covered.has(id)||seen.has(id))continue;seen.add(id);
  const why=krulCheckCard(cards.find(c=>krulMatch(c,id)),SRC,null);if(!why)continue;
  out.push({rule:'K-RUL',side:'JUDGE',link:id+' (restated in the cure)',ruling:id,line:'restated line '+id+' in the cure reply: '+why,judge_statement:null,response:null,status:'UNCURED',why:'TRIAL, recorded only: the cure reply restated '+id+' without a valid ruling card ('+why+')',statement:l.trim().slice(0,400),kinds:[]});}
 return out;}
function kkjvRows(){try{const g=(typeof $==='function')?$:null;return g?g('Cited Verses').all().map(i=>i.json).filter(r=>r&&r.book):[];}catch(e){return [];}}
function kkjvFold(s){return String(s==null?'':s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
function kkjvNoMargin(s){return String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');}
function kkjvUnGloss(s,cited){const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=kkjvFold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});}
function kkjvSegs(q,cited){let p=String(kkjvNoMargin(q)).split(/\.\.\.|…/);const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';
 if(p.length>1){const last=kkjvFold(kkjvUnGloss(p[p.length-1],cited));if(last&&!cv.includes(' '+last+' '))p=p.slice(0,-1);}return p.map(x=>kkjvFold(kkjvUnGloss(x,cited))).filter(Boolean);}
function kkjvIsVerseQuote(q,cited){const vw=new Set(kkjvFold(kkjvNoMargin(cited)).split(' '));const qw=kkjvSegs(q,cited).join(' ').split(' ').filter(Boolean);return qw.length>0&&qw.filter(w=>vw.has(w)).length/qw.length>=0.5;}
function kkjvStands(q,cited){if(!cited)return false;const segs=kkjvSegs(q,cited);if(!segs.length)return false;
 const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;}
function kkjvText(text){let T=String(text||'');const s=T.trim();if(s[0]==='{'){const i=s.lastIndexOf('}');try{const J=JSON.parse(s.slice(0,i+1));if(J&&typeof J.reasoning==='string')T=J.reasoning;}catch(e){}}return T.replace(/\n\n\[AUDIT v[\s\S]*$/,'');}
const KKJV_REF=/\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;
const KKJV_Q=/^[\s,:;(\-–—]{0,6}(?:\[L1\]\s*)?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z0-9])['‘](?!s\b|\s)((?:[^'‘’\n]|['’](?=[a-z])){6,400}?)['’](?![a-z]))/;
const KKJV_VER=/\b(RSV|NRSV|NIV|ESV|NASB|NKJV|NLT|Septuagint|LXX)\b/;
function kkjvPairs(T){const out=[];const A=new RegExp(KKJV_REF.source,'g');let m;
 while((m=A.exec(T))){const q=KKJV_Q.exec(T.slice(A.lastIndex,A.lastIndex+500));const __q=q?(q[1]||q[2]):null;  if(__q&&kkjvFold(__q).split(' ').filter(Boolean).length>=3)out.push({book:m[1],ch:+m[2],v1:+m[3],v2:+(m[4]||m[3]),q:__q});}
 return out;}
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
function kagLines2024(text){const items=[],marks=[],report={rows:0,grades:{},none:{}};const T=String(kkjvText(text)||'').replace(/\\n/g,'\n');if(!T.trim())return {items,marks,report};
 for(const l of T.split('\n')){const r=kagRow(l);if(!r)continue;report.rows++;const gk=r.grade||'(none)';report.grades[gk]=(report.grades[gk]||0)+1;if(r.none)report.none[gk]=(report.none[gk]||0)+1;
  const bad=!KAG_OK.includes(r.grade);const noneMeets=r.none&&r.grade==='MEETS';if(!bad&&!noneMeets)continue;
  const link='ANSWER CHECK '+r.verse+(r.rk?' ('+r.rk.replace(/\s*[;,]\s*/g,'; ')+')':'');if(items.some(x=>x.link===link&&x.grade===r.grade&&x.none===r.none))continue;
  const what=noneMeets?'grades MEETS where the ANSWER is NONE; no answer cannot meet a press':(r.grade?'grades the answer "'+r.grade+'", which is not a grade the rules name':'gives no grade after the ANSWER');
  items.push({rule:'K-AG',side:'JUDGE',link,verse:r.verse,rk:r.rk,grade:r.grade,none:r.none,
   line:'['+link+'] your ANSWER CHECK line '+what+'. Write the line again with '+(r.none?'MISSES':'MEETS or MISSES')+' as its grade (UNPROVEN if the press has no MEANS sentence), or write NOT HELD with your reason. Your line: '+r.line.slice(0,600)});
  marks.push('[AUDIT v41: ANSWER CHECK GRADE (K-AG; TRIAL) -- '+link+' -- '+(noneMeets?'ANSWER NONE graded MEETS':'grade '+(r.grade||'missing')+' is not MEETS or MISSES')+']');}
 return {items,marks,report};}
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
 for(const raw of T.split('\n')){const f=__acRead(raw);if(f){const v=String(f.verse).match(/^((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)/);if(!v||!/^(MEETS|MISSES|FAILS)$/.test(f.grade))continue;const k=ref(v[1]);for(const rd of new Set(f.rounds.map(x=>x.slice(0,2))))(AC[rd][k]=AC[rd][k]||[]).push(f.grade);continue;}
  if(/^\s*(?:[-\u2022]\s*)?ANSWER CHECK\s*:/i.test(raw)&&__RL.readLine(raw).form==null){const m=raw.trim().match(/^(?:[-\u2022]\s*)?ANSWER CHECK\s*:\s*((?:[1-3]\s?)?[A-Z][a-z]+\.?\s+\d+:\d+)[^\n]*?\[\s*(CR|DR)\d\s*\][^\n]*?--\s*(MEETS|MISSES|FAILS)\b/);if(!m)continue;const k=ref(m[1]);(AC[m[2]][k]=AC[m[2]][k]||[]).push(m[3]);}}
 const out=[];for(const raw of T.split('\n')){const l=raw.trim();const h=l.match(/^(?:[-\u2022]\s*)?(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:(.*)$/i);if(!h)continue;const side=/^CHALLENGER/i.test(h[1])?'CHALLENGER':'DEFENDER';const ac=AC[side==='CHALLENGER'?'DR':'CR'];
  for(const seg of h[2].split(/(?=\bpremise\s+\d+)/i)){const pm=seg.match(/^premise\s+(\d+)/i);if(!pm||!/\bUNEXHIBITED\b/i.test(seg))continue;
   for(const r of new Set([...seg.matchAll(RX)].map(x=>ref(x[1])))){const g=ac[r];if(g&&g.length&&g.every(x=>x==='MEETS'))out.push('[AUDIT v30: SELF-CONTRADICTION (B7; ruling 421) -- '+side+' premise '+pm[1]+' is counted UNEXHIBITED on '+r.replace(/\b[a-z]/g,c=>c.toUpperCase())+' while this judge\'s ANSWER CHECK for that verse, on the '+side.toLowerCase()+'\'s answer, reads MEETS. REVIEW THIS ROW.]');}}}
 return out;}
const knNarrow=it=>it.tag==='CONCEDED'&&it.quotes.length>0&&it.quotes.every(q=>KN_NARROW.test(q)&&!KN_SURR.test(q));
function orcLines(text){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const i=T.search(/OUT-OF-ROUND CONCESSIONS/i);if(i<0)return [];const out=[];for(const raw of T.slice(i).split('\n').slice(1)){const l=raw.trim();if(/^(?:DEFENDER|CHALLENGER)\s+CHAIN\s+MARK/i.test(l))break;const m=l.match(/^(?:[-\u2022]\s*)?(DEFENDER|CHALLENGER)\s*\|\s*\[?\s*(CR4|DR4)\s*\]?\s*\|\s*(.+)$/i);if(!m)continue;if(/\bCOUNTED\W*$/i.test(m[3].trim()))continue;out.push(m[1].toUpperCase()+' '+m[2].toUpperCase()+': '+m[3].trim().slice(0,160));}return out;}
function knLines(text){const out=[];const seen=new Set();for(const it of cntItems(text)){if(!it.one||!knNarrow(it)||seen.has(it.label))continue;seen.add(it.label);out.push({item:it.label,side:it.side,line:it.line,premise:it.n});}return out;}
const SC_CONC=/(?:\[?\bCR[1-4]\b\]?|\bdefen(?:der|se)(?:'s)?\b)[^;]{0,60}?\b(?<!not\s|never\s)conced(?:ed|es)\b(?!\s+nothing)/i;
function scLines(text,DL){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');const its=cntItems(T).filter(it=>it.label==='CONCEDED LINKS'&&it.one&&it.tag==='CONCEDED'&&!knNarrow(it));
 const byLink=it=>/\(\s*LINK\s+\d+\s*\)|^LINK\s+\d+/i.test(it.text);
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.toUpperCase().match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(?:--|—|-|:)?\s*STANDS\b/);if(!m)continue;
  const lq=drvGround(line,DL);const om=lq.match(SC_CONC);  const tail=om?lq.slice(om.index+om[0].length,om.index+om[0].length+120):'';const own=om&&!/\bchallenger|\bDR[1-3]\b|\bit\s+concede|\bnot\b|\bseparate\b/i.test(om[0])&&!/^[^;]{0,25}?\[?DR[1-3]\b/.test(tail)&&!/\b(?:keep(?:s|ing)?|kept|narrow\w*|only|alone)\b/i.test(tail);
  const it=null;
  if(own||it)out.push({item:'D'+m[1],side:'DEFENDER',line,premise:it?it.n:null,tag:it?it.tag:'CONCEDED',own:!!own});}
 return out;}
const KK_GROUND=/\d+:\d+|\[?\b[CD]R[1-4]\b\]?|\bround\b|\bLINK\s+\d|\[L[1-4]\]|\b(?:answered|unanswered|refuted|refutes|withdrawn|withdrew|withdraws|conceded|concedes|pressed|witness\w*|GROUND|because|since|exhibit\w*|footing|premise|chain|verse|row)\b/i;
function kkLines(text){const out=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');
 for(const raw of T.split('\n')){const line=raw.trim();const m=line.match(/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i);if(!m)continue;
  const rs=m[3].replace(/^[\s.\-–—:]+/,'').trim();if(rs.split(/\s+/).length>=3&&!KK_GROUND.test(rs))out.push({item:'KEYSTONE',side:'DEFENDER',line});}
 return out;}
function kg4Conceded(line,side){const L=String(line||'').replace(/[*_`]+/g,'');const who=side==='DEFENDER'?'(?:\\[?\\bCR[1-4]\\b\\]?|\\bdefen(?:der|se)(?:\'s)?\\b)':'(?:\\[?\\bDR[1-4]\\b\\]?|\\bchallenger(?:\'s)?\\b)';
 const re=new RegExp(who+'[^;]{0,80}?\\b(?<!not\\s|never\\s|nor\\s)(?:conced(?:ed|es)|withdr(?:ew|awn|aws)|surrender(?:ed|s)|CONCEDED|WITHDRAWN)\\b(?!\\s+(?:nothing|no\\b))','i');return re.test(L);}
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
function drvLinks(ptext){const t=String(ptext||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return [];const L=[];
 for(const l of t.slice(i).split('\n').slice(1)){const m=l.match(/^\s*\**\s*(\d+)[.)]\s+(\S.*)$/);if(m){L.push(m[2].replace(/\s*Footing\s*:.*$/i,'').replace(/[*_`]+/g,''));continue;}if(L.length&&l.trim()&&!/^\s/.test(l))break;}
 return L;}
const KS2_FORMS=[/\bno\s+(?:\S+\s+){0,2}?witness(?:['’]s|es)?\s+(?:own\s+words\s+)?(?:\S+\s+){0,3}?(?:states?|says?|names?)\b/i,/\bnone\s+(?:of\s+(?:\S+\s+){1,2})?states?\s+that\b/i,
 /\bstates?\s+no\s+(?!round\b|later\b|answer\b)[a-z]+/i,/\bin\s+(?:its|their|his|her)\s+own\s+words\b/i];
function ks2Grounds(line){const t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];if(!gs.length)return [drvGround(line,null)];
 return gs.map((g,k)=>t.slice(g.index+g[0].length,k+1<gs.length?gs[k+1].index:t.length)).map(s=>s.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"));}
function ks2Hit(text){for(const g of (Array.isArray(text)?text:[text]))for(const c0 of String(g).split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
  const hit=KS2_FORMS.concat(NET_STATE,[DRV_STATE]).find(rx=>rx.test(cl));if(!hit)continue;const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at)))continue;return cl.trim();}
 return null;}
function ks2Keeps(text){return !!ks2Hit(ks2Grounds(text));}
function ks2Lines(text,done){const items=[],marks=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');let first=true;const D=done||new Set();
 for(const raw of T.split('\n')){const line=raw.trim();if(!line)continue;const u=line.toUpperCase();let item=null;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(mc)item=mc[1]+' vs '+mc[2];else if(first&&line[0]!=='['&&line[0]!=='{')item='REASONING';first=false;
  if(!item||D.has(item.toUpperCase()))continue;if(item!=='REASONING'&&!/\b(?:UNDERDETERMINED|STANDS)\b/.test(u))continue;
  const h=ks2Hit(item==='REASONING'?[netMask(line.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"))]:ks2Grounds(line));if(!h)continue;D.add(item.toUpperCase());
  const at=line.search(/GROUND\s*:/i);const side=netSide(h,h.length);
  items.push({rule:'K-S2',side,link:item,line});
  marks.push('[AUDIT v27: DEBATE RULE VIOLATION (K-S2) -- '+item+' rests on the retired single-verse ground ("'+h.replace(/[\[\]"]/g,'').slice(0,160)+'"): that a verse or witness does not state the point in its own words is never a ground (DG-61); the chains are weighed as wholes. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
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
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(\s*["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*\)/g)){if(m[2].split(/\s+/).some(w=>!DRV_TL_STOP.test(w)&&!/^[A-Z]/.test(w))){met.add('L2');break;}}
  if(DRV_SRC.test(s.replace(LB_REF,' ').replace(/["“][^"”]*["”]/g,' '))&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(s))met.add('L2');}
 {const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)].map(m=>({a:m.index,b:m.index+m[0].length}));
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}}
 return [...met].sort();}
function lbBlockText(round,j){const s=String(round||'');const c=s.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);const t=c>=0?s.slice(0,c):s;const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t.slice(h.index,j<H.length?H[j].index:t.length):'';}
function __kfHas(text,id,side){try{if(typeof KF_LINE==='undefined')return false;const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');return T.split('\n').some(l=>{const m=l.trim().match(KF_LINE);return !!m&&m[1].replace(/\s+vs\.?\s+/i,' vs ').toUpperCase()===String(id).toUpperCase()&&(!side||(/^CR/i.test(m[2])?'CHALLENGER':'DEFENDER')===String(side).toUpperCase());});}catch(e){return false;}}
function drvCheck(text,dConc,cConc,dStand,cStand,askedCC,DL){  const items=[],marks=[];if(typeof text!=='string')return {items,marks};const cnt={DEFENDER:0,CHALLENGER:0};
 const LS=text.split('\n');for(let li=0;li<LS.length;li++){const line=LS[li];const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();
  {const ms=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(ms){const vs=/^VS\.?\s/.test(ms[2]);const gs=vs?((ms[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/)||[])[1]||null):(/^STANDS\b/.test(ms[2])?'STANDS':null);
   if((gs==='UNDERDETERMINED'||gs==='STANDS')&&DRV_STATE.test(drvGround(line,DL))&&!DRV_ANS.test(line)){  const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    items.push({rule:'K-S',side:null,link:sid,line});marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S) -- '+sid+' '+gs+' rests on a single verse not stating a link or its contrary and names no round that answered the witness. REVIEW THIS ROW.]');}
   if(gs==='UNDERDETERMINED'||gs==='STANDS'){const sid=vs?(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+ms[1]])[1].replace(/\s+VS\.?\s+/,' vs '):'D'+ms[1];
    if(false&&DRV_STATE.test(drvGround(line,DL))&&(DRV_ANS.test(line)||DRV_BARE.test(line)))marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-S2) -- '+sid+' '+gs+' gives as a ground that a verse does not state a link or its contrary, beside '+(DRV_ANS.test(line)?'the round it names':'a round it names without a bracket, which K-S does not read as named')+'; that is never a ground. REVIEW THIS ROW.]');
    const un=drvUnans(drvGround(line,DL));if(un)marks.push('[AUDIT v22: DEBATE RULE VIOLATION (K-U) -- '+sid+' '+gs+' says a witness went unanswered ("'+un+'"); a pressed witness (a verse a listed premise carries under PRESSED WITH, ruling 392) left unanswered is a BROKEN ground; a verse under no PRESSED WITH line is not. REVIEW THIS ROW.]');}}}
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const side=g[1].split(' ')[0];cnt[side]++;const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');
  const nx=String(LS[li+1]||''),nu=nx.toUpperCase().replace(/[*_`]+/g,'').trim();
  const k=(nu&&!/^(?:[-•]|\d+[.)])?\s*[DC]\d+\b/.test(nu)&&!/^[A-Z][A-Z \-]{2,}:/.test(nu)&&!/^(?:DEFENDER|CHALLENGER)\s*\|/.test(nu))?[...new Set([...drvKinds(line),...drvKinds(nx)])].sort():drvKinds(line);
  if(k.length<2){items.push({rule:'K-B',side,link:id,kinds:k,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION -- '+id+' '+g[1]+' exhibits '+k.length+' layer kind'+(k.length===1?'':'s')+(k.length?' ('+k.join(', ')+')':'')+' of the two rule B requires on the line or the line under it. REVIEW THIS ROW.]');}
  const conc=side==='DEFENDER'?dConc:cConc;
  if(prsUnprovenOnly(line,side)){marks.push('[AUDIT v28: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' rests, as unanswered, only on presses the ledger marks UNPROVEN (ruling 398); K-P reads the line.]');}
  else if(__kfHas(text,id,side)){marks.push('[AUDIT v29: K-G1/K-G4 NOT RAISED -- '+id+' '+g[1]+' is graded as a forced link with a FORCED line (ruling 411: a link may fail by meaning though the witness was answered); K-F reads its quotations.]');}
  else if(conc===0&&DRV_WORDS.test(line)){items.push({rule:'K-G1',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G1) -- '+id+' '+g[1]+' rests on a witness left unanswered (a witness is a verse a listed premise carries under PRESSED WITH, ruling 392) while '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' is 0. REVIEW THIS ROW.]');}
  else if(!DRV_WORDS.test(line)&&kg4Conceded(line,side)){marks.push('[AUDIT v24: K-G4 NOT RAISED -- '+id+' '+g[1]+' rests on the '+side.toLowerCase()+"'s own concession of the link, not on a witness left unanswered; the concession rule governs it.]");}
  else{items.push({rule:'K-G4',side,link:id,line});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G4) -- '+id+' '+g[1]+' counts a witness as unanswered; the rule counts it only with the quoted pressing sentence and its round, and only for a verse a listed premise carries under PRESSED WITH (ruling 392). REVIEW THIS ROW.]');}}
 for(const [side,st,lab] of [['DEFENDER',dStand,'DEFENSE'],['CHALLENGER',cStand,'CHALLENGE']]){
  if(st==='SELF-SUPPORTED'&&cnt[side]>0){items.push({rule:'K-G3',side,link:null,line:null});marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G3) -- '+lab+' STANDING SELF-SUPPORTED while '+cnt[side]+' '+side+' LINK BROKEN line'+(cnt[side]===1?'':'s')+' stand. REVIEW THIS ROW.]');}}
 if(askedCC&&!/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?CITATION CHECK\b/im.test(text.replace(/[*_`]+/g,'')))marks.push('[AUDIT v21: CITATION CHECK LINE ABSENT FROM A PROMPT THAT ASKS FOR IT (K-G2); recorded, not counted as a violation.]');
 {let __k3=0;for(const n of orcLines(text)){__k3++;items.push({rule:'K-S3',side:/^CHALLENGER/i.test(n)?'CHALLENGER':'DEFENDER',link:'S3 '+String(n).split(' ').slice(0,2).join(' ')+' #'+__k3,line:String(n).slice(0,400)});  marks.push('[AUDIT v29: CLOSE-ROUND CONCESSION NOT MARKED COUNTED (S3; ruling 412) -- '+n.replace(/[\[\]]/g,'')+'; a close-round concession of a declared link or a listed premise enters the counts and its line ends COUNTED. LIVE cure item K-S3 (ruling 421): COUNTED, or TOUCHES NO LINK with its reason; left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}} for(const m421 of selfLines421(text))marks.push(m421);   for(const n of knLines(text)){items.push({rule:'K-N',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-N) -- '+n.item+' counts premise '+n.premise+' CONCEDED (stated) on words that narrow a limb; a limb the link round narrows counts in its narrowed form, and a narrowing is not a concession. REVIEW THIS ROW.]');}
 for(const n of scLines(text,DL)){items.push({rule:'K-SC',side:n.side,link:n.item,line:n.line,premise:n.premise});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-SC) -- '+n.item+' STANDS while '+(n.own?'its own line says the defender conceded':'CONCEDED LINKS counts premise '+n.premise+' (filed under that link) '+(n.tag==='CONCEDED'?'CONCEDED (stated)':'UNEXHIBITED'))+'; a link counted conceded does not stand. REVIEW THIS ROW.]');}
 for(const n of netLines(text,null,DL)){items.push({rule:'K-C',side:n.side,link:n.item,line:n.line});marks.push('[AUDIT v23: DEBATE RULE VIOLATION (K-C) -- '+n.item+' sets aside '+(n.side==='BOTH'?'both chains':'the '+n.side.toLowerCase()+"'s chain")+' on the ground that no one verse in it states the link or its contrary in its own words; the chain is weighed as a whole. REVIEW THIS ROW.]');}
 {const kc=new Set(items.filter(x=>x.rule==='K-C').map(x=>String(x.link).toUpperCase()));const k2=ks2Lines(text,kc);k2.items.forEach(x=>items.push(x));k2.marks.forEach(x=>marks.push(x));}
 return {items,marks};}
const CURE_FAMS=['deepseek','openai','gemini','grok','mimo','openrouter'];
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
 +"For a K-G4 link the system searches every later round of the side that holds the link ([CR2], [CR3] or [CR4] against the defender; [DR1], [DR2] or [DR3] against the challenger, each after the pressing round) for each pressed witness your line and your PRESSED quotation name, each witness on its own; a witness one of those rounds names was answered. The BROKEN grade is unanswered-false when every witness the line rests on as unanswered was answered: those its GROUND names, or all of them when the GROUND names none. It is then cured by RETRACTED or, where the link cannot take the witness's meaning though the witness was answered, by one FORCED line for the item (ruling 411; md_notes_rulings 419); a meaning break is not retracted for being answered. A BROKEN line whose GROUND names no pressed witness left unanswered rests on meaning: it is cured by one FORCED line, or by RETRACTED beside a quoted reason the system verifies (6 or more words of the holding side's own answer, word for word from its round, or the verse of the line its later round names; Eric 2026-11-06). While one of them is named in no later round, the grade stands (judge_fix7 J1). K-W (ruling 421: a side withdrew or granted, in its own round, footing of a link it keeps): first name the fact the withdrawn sentence carried for the link (a descent, a source, a time, a person); if the side still claims that fact anywhere in the link, answer STANDS WITHOUT IT because <that fact> is carried by <the layer, [L1], [L2] or [L3], quoted, that carries that same fact in its own words>; if no layer the side gives carries it, or the side no longer claims it and the link needed it, answer CONCEDED (ruling 428; run 32677: Galatians 4:4 'made of a woman' does not carry 'the seed of David according to the flesh'). K-S3 (rulings 412 and 421: a close-round concession your count does not mark COUNTED): answer in the RESPONSE line with COUNTED, correcting your count, or with TOUCHES NO LINK: <one line naming why it touches no declared link or listed premise>. K-W is a TRIAL rule: an item left unanswered removes no seat. K-S3 is a LIVE rule: an item left unanswered after the cure removes the seat; NOT HELD: <reason> on the RESPONSE line that quotes at least 6 words in a row of the flagged sentence (all of it if the sentence is shorter), or TOUCHES NO LINK: <reason> on the RESPONSE or the STATEMENT line, answers it. "
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
 +"only for a pressed witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered, and a premise whose witness goes unanswered is counted. When your line records an answer to the witness (it does not say the witness went unanswered, or a later round of that side names the pressed witness), the break is one of meaning (ruling 421): the premise is not counted, and the only cures are one FORCED line for the pair or a RETRACTED line with one CORRECTED RESULT. Otherwise cure it either by counting it: CORRECTED COUNT "
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
const cureLabel=x=>x.rule==='K-B'?x.link:((x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-P'||x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-FF'||x.rule==='K-UNX'||x.rule==='K-R'||x.rule==='K-L2'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-CON'||x.rule==='K-CMT'||x.rule==='K-CMTL'||x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?x.rule+' '+x.link:'K-G3 '+x.side);
function g4Unans2024(line){const s=String(line||'');if(DRV_WORDS.test(s))return true;const i=s.search(/\bGROUND\s*:/i);if(i<0)return false;
 const g=s.slice(i).replace(/"[^"]*"|\u201c[^\u201d]*\u201d|(^|[\s(\[])['\u2018](?:[^'\u2018\u2019]|['\u2019](?=[A-Za-z]))*?['\u2019](?=$|[\s.,;:!?)\]])/g,'$1 ');
 return /\b(?:did not answer|does not answer|not been answered|no answer|receives no answer|gave no answer|left without answer)\b/i.test(g);}
function g4Label2024(x){return g4Unans2024(x.line)
 ?' [UNANSWERED-WITNESS BREAK: your GROUND says a pressed witness was left unanswered. If a later round of that side names the witness, it was answered: cure it with RETRACTED: D<n> vs C<m> and exactly one CORRECTED RESULT line for your whole reply (CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>, a reason may follow after " -- "), or with one FORCED line where the link still cannot take the witness\'s meaning. Otherwise cure it with a PRESSED line quoting the round that pressed it.]'
 :' [MEANING BREAK: your GROUND names no pressed witness left unanswered, so this break rests on meaning. One FORCED line cures it, or RETRACTED beside a quoted reason the system verifies: quote, word for word, 6 or more words of the holding side answer from its own round, or name the verse of this line that its later round names. Otherwise a retraction leaves the item uncured, and an uncured K-G4 item counts against your seat (LIVE rule).]';}
function cureAsk(items,broken){const kb=items.filter(x=>x.rule==='K-B'),kg=items.filter(x=>x.rule!=='K-B');let t='';
 if(kb.length)t+=CURE_RULE+'\n\nFLAGGED LINES:\n'+kb.map(x=>x.link+': '+String(x.line||'').trim()).join('\n');
 if(kg.length)t+=(t?'\n\n':'')+CURE_RULE_G+'\n\nFLAGGED ITEMS:\n'+kg.map(x=>cureLabel(x)+': '+((x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-G1'||x.rule==='K-G4'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||x.rule==='K-G11'||x.rule==='K-V'||x.rule==='K-LB'||x.rule==='K-S'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-P'||x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-FF'||x.rule==='K-UNX'||x.rule==='K-R'||x.rule==='K-L2'||x.rule==='K-C'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K'||x.rule==='K-CON'||x.rule==='K-CMT'||x.rule==='K-CMTL'||x.rule==='K-RUL'||x.rule==='K-KJV'||x.rule==='K-AG')?String(x.line||'').trim()+(x.rule==='K-C'&&x.chain?'\n  '+x.chain:'')+(x.rule==='K-G4'?g4Label2024(x):''):x.side+' STANDING SELF-SUPPORTED while these '+x.side+' links are graded BROKEN: '+((broken||{})[x.side]||[]).join(', '))).join('\n');
 return t+'\n\n'+CURE_FORM;}
function cureBroken(text){const out={DEFENDER:[],CHALLENGER:[]};if(typeof text!=='string')return out;
 for(const line of text.split('\n')){const u=line.toUpperCase().replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m||!/^VS\.?\s/.test(m[2]))continue;
  const g=m[2].match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);if(!g||g[1]==='UNDERDETERMINED')continue;
  const id=(u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+\s+VS\.?\s+C\d+)/)||[null,'D'+m[1]])[1].replace(/\s+VS\.?\s+/,' vs ');out[g[1].split(' ')[0]].push(id);}
 return out;}
function cureBody(fam,body,answer,ask){const b=JSON.parse(JSON.stringify(body));
 if(fam==='gemini'){b.contents=(b.contents||[]).concat([{role:'model',parts:[{text:answer}]},{role:'user',parts:[{text:ask}]}]);return b;}
 b.messages=(b.messages||[]).concat([{role:'assistant',content:answer},{role:'user',content:ask}]);
 if(b.response_format)delete b.response_format;
 return b;}
function cureText(j){
 if(j&&Array.isArray(j.choices)&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {ok:true,text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&Array.isArray(j.candidates)&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {ok:true,text:t,finish:j.candidates[0].finishReason||null};}
 const why=(j&&j.error)?('error: '+String(typeof j.error==='string'?j.error:(j.error.message||JSON.stringify(j.error))).slice(0,160)):('unrecognised reply, keys ['+Object.keys(j||{}).join(',')+']');
 return {ok:false,text:null,why};}
function cureRounds(body){const parts=[];const add=c=>{if(typeof c==='string')parts.push(c);else if(Array.isArray(c))c.forEach(p=>{if(p&&typeof p.text==='string')parts.push(p.text);});};
 try{(body.messages||[]).forEach(m=>{if(m&&m.role!=='assistant')add(m.content);});(body.contents||[]).forEach(m=>{if(m&&m.role!=='model')add(m.parts);});}catch(e){}
 const t=parts.join('\n');const re=/^(?:===[ \t]+)?\[(CR1|DR1|CR2|DR2|CR3|DR3|CR4|DR4)(?:\]|[ \t]--[^\n]*\])(?:[^\n]*===)?[ \t]*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\nCOUNTING RULE',x.e);if(c>=0&&c<end)end=c;out[x.k]=t.slice(x.e,end);});
 return out;}
const CI_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const CI_ANS={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};
const CI_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const ciQ=s=>String(s==null?'':s).replace(/\\(["'\\nrt])/g,(m,c)=>c==='n'?'\n':c==='t'?'\t':c==='r'?'\r':c).replace(/[*_`]+/g,'').toLowerCase().replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[—–]/g,'-').replace(/["']/g,'').replace(/\s+/g,' ').trim();
const ciFound=(q,txt)=>{const T=ciQ(txt);const ps=String(q).split(/\.{3}|…/).map(x=>ciQ(x).replace(/^[\s.,;:!?'"-]+|[\s.,;:!?'"-]+$/g,'')).filter(Boolean);return ps.length>0&&ps.join(' ').split(' ').length>=3&&ps.every(x=>T.includes(x));};
const ciKeys=s=>new Set(REFP.keys(String(s||''),{scoped:true,cap:12}).map(k=>k.key));
function ciLedger(ptext){const out={};const t=String(ptext||'');
 for(const m of t.matchAll(/^cited in [^\n]*?not named in a later round of the (defender|challenger)[^\n]*?\((\d+) of (\d+)\):\s*([^\n]*)$/gmi)){const side=m[1].toUpperCase();if(out[side])continue;
  const list=/^none\s*$/i.test(m[4].trim())?[]:m[4].split(/,\s+(?=(?:[1-3]\s)?[A-Z])/).map(x=>x.trim()).filter(Boolean);out[side]={n:+m[2],total:+m[3],labels:list,line:m[0]};}
 return out;}
function ciRounds(ptext){const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;  out[x.k]=t.slice(x.e,end);});return out;}
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
function ri3Head2024(l){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='CONCEDED'&&r.f&&!r.f.restated&&(r.f.side==='DEFENDER'||r.f.side==='CHALLENGER'))return {side:r.f.side,n:r.f.n};}catch(e){}return null;}
function ri3StandL2024(T,side,re){for(const l of String(T==null?'':T).split('\n')){let r=null;try{r=__RL.readLine(l);}catch(e){r=null;}
 if(r&&r.form==='STANDING'&&r.f&&!r.f.restated){if(r.f.side===side&&r.f.L!=null)return [l,String(r.f.L)];continue;}const m=l.match(re);if(m)return m;}return null;}
function ciCountSection(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const L=T.split('\n');const head=side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:/i:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:/i;
 const STOP=/^[ \t>#-]*(?:CHALLENGE STANDING|DEFENSE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|COLLISION POINTS|CITATION CHECK|OUT-OF-ROUND|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|CITED-IN RULINGS|NOT PRESSED|PRESSED|REASONING|VERDICT)\b/i;
 const i=L.findIndex(l=>{const rr=ri3Count2024(l,side);return rr===null?head.test(l):rr;});if(i<0)return null;const out=[L[i]];for(const l of L.slice(i+1)){if(STOP.test(l))break;out.push(l);}return out.join('\n');}
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
const cureUnwrap=t=>{try{const j=JSON.parse(String(t).trim().replace(/^```(?:json)?\s*|\s*```$/g,''));if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return t;};
function cureLines(text){text=cureUnwrap(text);const o={restated:[],withdrawn:[],result:[],count:[],standing:[],pressed:[],short:[],statement:[],response:[],malformed:[],prose:[],cited:[]};
 const LAB=/^(REASONING|KEYSTONE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*[:\-–—]+\s*/i;
 const pid=p=>{const m=String(p||'').match(/^D(\d+)\s+vs\.?\s+C(\d+)$/i);return m?cureId(m[1],m[2]):null;};
 for(const raw of String(text||'').split('\n')){const l=raw.trim().replace(/^[*`]+|[*`]+$/g,'').trim();if(!l)continue;const k=l.match(CURE_KEY);if(!k){o.prose.push(l);continue;}
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
  if((k[1]==='STATEMENT'||k[1]==='RESPONSE')&&R.form==='STATEMENT'&&f.item&&String(f.text||'').trim()){const at=r.indexOf('|');(k[1]==='STATEMENT'?o.statement:o.response).push({label:String(f.item).trim(),text:r.slice(at+1).trim(),line:l});continue;}
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
var __RXR_R=null;
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
function g4GateNote2024(x,ctx){try{const R=(ctx&&ctx.R)||{};const side=String(x.key||'').split('|')[2]||'';const link=String(x.key||'').split('|')[3]||'';const line=String((x.lines&&x.lines[0])||'');
 if(!CURE_PRESS[side]||!g4Unans2024(line))return '';const hits=[];
 for(const seg of line.split(/(?=\[(?:CR|DR)[1-4]\])/)){const rm=seg.match(/^\[((?:CR|DR)[1-4])\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;
  for(const m of seg.matchAll(/["“]([^"”]{8,})["”]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}
 if(!hits.length)return '';const ks=kg4Split(side,line,hits,R);if(!ks.rests.length||ks.open.length)return '';
 const rds=[...new Set(hits.map(p=>'['+p.round+']'))].join(', ');
 return ' THE ENGINE READS THIS LINE: "unanswered" is false. The pressing quotation stands in '+rds+', and a later '+side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered)+'. So the break rests on meaning (ruling 421): a KEEP, or a CHANGE TO that still says the witness was left unanswered, stays uncured. Cure it with one FORCED line: FORCED: '+(link?link.replace(/ VS /,' vs '):'D<i> vs C<j>')+' -- MEANS [<round>]: "<the MEANS sentence>" -- ANSWER [<round>]: "<the holding side\'s answer>" -- FAILS: "<why that answer cannot take the meaning>", or with a CHANGE TO that no longer breaks the link.';}catch(e){return '';}}
/* pkgKG7 (D40, W3 3093 ruling 3): the K-G4 answered test applied to a K-G7 line; a break on an answered witness is one of meaning (ruling 421) and is not cured by a count */
function kg7Ans2024(x,R){try{const line=String((x&&x.line)||'');const side=x&&x.side;if(!line||!CURE_PRESS[side])return null;R=R||{};
 if(!g4Unans2024(line))return 'the line records an answer and does not say the witness went unanswered, so the break is one of meaning (ruling 421)';
 const hits=[];for(const seg of line.split(/(?=\[(?:CR|DR)[1-4]\])/)){const rm=seg.match(/^\[((?:CR|DR)[1-4])\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;
  for(const m of seg.matchAll(/["\u201c]([^"\u201d]{8,})["\u201d]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}
 if(!hits.length)return null;const ks=kg4Split(side,line,hits,R);if(!ks.rests.length||ks.open.length)return null;
 return 'unanswered-false: a later '+side.toLowerCase()+' round names every pressed witness the line rests on ('+kg4Txt(ks.answered)+'), so the break is one of meaning (ruling 421)';}catch(e){return null;}}
function kg4Witnesses(line,q,pressText){const L=new Set(cureRefs(line).map(r=>r.key));const Q=[...new Set(cureRefs(q).map(r=>r.key))].filter(k=>L.has(k));if(Q.length)return Q;{const H=kg4RowHead2024(q,pressText).filter(k=>L.has(k));if(H.length)return H;} /* pkgG4R: the PRESSED WITH row's own verse */
 const an=new Set(cureRefs((String(line||'').match(/\(([^)]*\d+:\d+[^)]*)\)/)||[0,''])[1]).map(r=>r.key));const B0=[...L].filter(k=>!an.has(k));
 const P=new Set(cureRefs(pressText||'').map(r=>r.key));if(!B0.length){const AP=[...an].filter(k=>P.has(k));if(AP.length)return AP;}  const BP=B0.filter(k=>P.has(k));return BP.length?BP:B0;}
function kg4Answered(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];const out=[];const seen=new Set();
 for(const p of presses){const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of kg4Witnesses(line,p.q,R[p.round]))for(const k of later){if(typeof R[k]!=='string'||seen.has(w+'|'+k))continue;const h=cureRefs(R[k],true).find(r=>r.key===w);  if(h){seen.add(w+'|'+k);out.push({ref:w,round:k,pos:h.pos});}}}
 return out;}
const kg4Txt=a=>a.map(z=>'['+z.round+'] '+z.ref+' at '+z.pos).join('; ');
function kg4Split(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];
 const g=String(line||'').match(/\bGROUND\s*:([\s\S]*)$/i);const G=g?new Set(cureRefs(g[1]).map(r=>r.key)):null;const rests=[],answered=[],open=[];
 for(const p of presses){const W=kg4Witnesses(line,p.q,R[p.round]);const Wg=G?W.filter(k=>G.has(k)):[];const use=Wg.length?Wg:W;const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of use){if(rests.includes(w))continue;rests.push(w);const hs=[];for(const k of later){if(typeof R[k]!=='string')continue;const h=cureRefs(R[k],true).find(r=>r.key===w);if(h)hs.push({ref:w,round:k,pos:h.pos});}
   if(hs.length)answered.push(...hs);else open.push(w);}}
 return {rests,answered,open,ground:!!(G&&rests.some(k=>G.has(k)))};}
const kg4Why=(ks,side,head)=>head+'; '+(ks.open.length?'the pressed witness '+ks.open.join(', ')+' '+(ks.open.length>1?'is each':'is')+' named in no later '+side.toLowerCase()+' round, so the grade stands'+(ks.answered.length?' (answered, and not the ground: '+kg4Txt(ks.answered)+')':''):'no pressed witness is read from the line');
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
function drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);let read=0;
 for(const side of ['DEFENDER','CHALLENGER']){const CH=kvCharges(R,side);if(!CH)continue;const UNI=kvUni(R,side);const done=new Set();
  for(const sg of kvSegments(text,side))for(const n of sg.ns){if(done.has(n)||n>CH.length)continue;done.add(n);read++;const v=kvRulingOk(sg.seg,n,CH,UNI);if(v.ok)continue;
   const id=side+' premise '+n;const miss=(v.q?'':'quotes no charge words of premise '+n+' that go beyond its quote')+(!v.q&&!v.kind?' and ':'')+(v.kind?'':'names no kind (a negation, a universal, or a claim the words of the quote do not make)');
   items.push({rule:'K-V',side,link:id,premise:n,line:'premise '+n+' ruled VOID: '+sg.seg.replace(/\s+/g,' ').slice(0,400)+' -- the ruling '+miss,conc:side==='DEFENDER'?dConc:cConc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||CH.length});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-V) -- '+id+': ruled VOID, but the ruling '+miss+(()=>{const u=UNI.find(p=>p.n===n);return u&&u.words.length?' The system\'s universal test found in its charge, not in its quote: '+u.words.join(', ').toUpperCase()+'.':' The system\'s universal test found no negation or universal word in its charge that its quote lacks.';})()+' A charge is VOID as stronger than its quote only when it asserts what the quote does not; the ruling names the word that makes it stronger (as the universal test lists it) or quotes those charge words and names the kind. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}
 if(!items.length&&read)marks.push('[AUDIT v26: K-V PASS: '+read+' VOID ruling'+(read===1?'':'s')+' read; each quotes the charge words and names the kind; LIVE rule]');
 return {items,marks};}
function kcmf2024(v){try{const L=(v||[]).filter(y=>y&&y.rule==='K-CMTL');if(!L.length||L.some(y=>y.status!=='CURED'))return v;
 return v.map(x=>x&&x.rule==='K-CMT'&&x.status==='UNCURED'?{...x,status:'CURED',why:'every contested line is answered on K-CMTL ('+L.length+' line'+(L.length>1?'s':'')+', each naming its commitment or NOT A GRADE); the grouped RESPONSE alone named none (pkgKCMF, W3 grade_33083)'}:x);}catch(e){return v;}}
function cureVerdicts(items,reply,broken,rounds){const U=s=>String(s).toUpperCase();const o=cureLines(reply&&reply.ok?reply.text:'');const R=rounds||{};__RXR_R=rounds||null;
 const nK1={DEFENDER:items.filter(x=>x.rule==='K-G1'&&x.side==='DEFENDER').length,CHALLENGER:items.filter(x=>x.rule==='K-G1'&&x.side==='CHALLENGER').length};
 const rsn=cureReasoned(o,items.map(x=>x.line),R);
 const wd=new Set(o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))).map(w=>U(w.link)):[]);
 const rxNoWhy=new Set(o.result.length===1?o.withdrawn.filter(w=>!rsn.has(U(w.link))).map(w=>U(w.link)):[]);
 const rxNoRes=new Set(o.result.length!==1?o.withdrawn.map(w=>U(w.link)):[]);
 const NZ=s=>U(s).replace(/[:|]+/g,' ').replace(/\s+/g,' ').trim();const KWK=s=>{const m=NZ(s).match(/\b(DEFENDER|CHALLENGER)\s+([CD]R[1-4])\s+(LINK\s*\d+|[DC]\d+)\b[^#]{0,60}?#\s*(\d+)\b/);return m?m[1]+' '+m[2]+' '+m[3].replace(/\s+/g,'')+' #'+m[4]:null;};  const HAS=(L,k)=>{const a=NZ(L),b=NZ(k);if(!b)return false;let i=a.indexOf(b);while(i>=0){if(!/[0-9A-Z]/.test(a.charAt(i+b.length)))return true;i=a.indexOf(b,i+1);}return false;};
const respOf=(x)=>{const lb=U(cureLabel(x));const rk=U(x.rule||'');const ruleOk=L=>{const rs=L.match(/\bK-[A-Z]+[0-9]*\b/g)||[];return !rs.length||rs.includes(rk);};
  const r=o.response.find(s=>{const L=U(s.label);return HAS(L,lb)&&ruleOk(L);})||(x.rule==='K-W'&&KWK(x.link)?o.response.find(s=>ruleOk(U(s.label))&&KWK(s.label)===KWK(x.link)):null)||o.response.find(s=>{const L=U(s.label);return ruleOk(L)&&(x.link?HAS(L,x.link):(L.includes(x.side)&&L.includes('STANDING')));})
   ||(items.filter(y=>y&&y.rule===x.rule).length===1?o.response.find(s=>{const L=NZ(s.label);return (L===rk||L.startsWith(rk+' '))&&ruleOk(U(s.label));}):null);  if(r)return r.text;if(x.rule==='K-CMTL'){const k=+(String(x.link).match(/\d+/)||[0])[0];for(const s of o.response){if(!/^K-CMTL\b/.test(NZ(s.label)))continue;const g=kcmtlSeg2024(s.text,k);if(g)return g;}return null;}  if(x.rule==='K-CMT'){const t=o.response.filter(s=>/^K-CMTL\b/.test(NZ(s.label))).map(s=>s.text).join('\n');return t||null;}  return null;};
 const stmtOf=(x)=>{const st=o.statement.find(s=>x.link?(HAS(s.label,x.link)||(x.rule==='K-W'&&KWK(x.link)!=null&&KWK(s.label)===KWK(x.link))):(U(s.label).includes(x.side)&&U(s.label).includes(U(x.rule))));return st?st.text:null;};
 const stmtQ=(t)=>[...String(t||'').matchAll(/["“]([^"”]{8,})["”]|(?:^|[\s(\[{:;,—–-])['‘]([^\n]{8,}?)['’](?=$|[\s.,;:!?)\]}"”—–-])/g)].map(m=>m[1]||m[2]);
 const stmtPress=(x)=>{const t=stmtOf(x);if(!t)return null;for(const rk of CURE_PRESS[x.side]){if(!new RegExp('\\['+rk+'\\]').test(t)||typeof R[rk]!=='string')continue;const q=stmtQ(t).find(q=>cureFound(q,R[rk]));if(q)return {round:rk,q,line:'STATEMENT: '+t};}return null;};
 return kcmf2024(items.map(x=>{const res=(status,why,lines,kinds)=>{const keys=(x.rule==='K-W'||x.rule==='K-S3'||x.rule==='K-B'||x.rule==='K-S'||x.rule==='K-C'||x.rule==='K-S2'||x.rule==='K-LXX'||x.rule==='K-F'||x.rule==='K-FC'||x.rule==='K-FF'||x.rule==='K-UNX'||x.rule==='K-L2'||x.rule==='K-N'||x.rule==='K-SC'||x.rule==='K-K')?[x.link]:(x.rule==='K-G1'||x.rule==='K-G4')?[x.link,x.side]:[x.side].concat((broken||{})[x.side]||[]);
   const bad=status==='UNCURED'?o.malformed.find(l=>cureOwn(l,x)):null;
   return {...x,judge_statement:stmtOf(x),response:respOf(x),status,why:(why||'')+(bad?(why?'; ':'')+'malformed line: '+bad.slice(0,160):'')||null,statement:(l=>l&&l.length?l.join(' / '):null)(status==='CURED'&&/^retracted/.test(why||'')&&o.result.length===1?(lines||[]).concat([o.result[0].line]):lines),kinds:kinds||[]};};
  if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);
  if(!respOf(x)){const z=res('UNCURED','no written response',null);z.silent=!o.malformed.find(l=>cureOwn(l,x));return z;}
  if(x.link&&rxNoRes.has(U(x.link)))return res('UNCURED','RETRACTED without exactly one CORRECTED RESULT line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  if(x.link&&rxNoWhy.has(U(x.link)))return res('UNCURED','RETRACTED with no reason naming the round and its words or verse (rulings 105)',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));
  const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const ansK=pr=>(x.side==='DEFENDER'?['CR2','CR3','CR4']:['DR1','DR2','DR3']).filter(  k=>!pr||ORD.indexOf(k)>ORD.indexOf(pr));
  const namedIn=pr=>(x.rule==='K-G1'||x.rule==='K-G4')?ansK(pr).filter(k=>typeof R[k]==='string'&&R[k]).map(k=>({k,n:cureNamed(x.line,R[k])})).filter(z=>z.n.length):[];
  const nmTxt=pr=>namedIn(pr).map(z=>'['+z.k+'] '+z.n.map(n=>n.ref).join(', ')).join('; ');
  const ownQ=(q,k)=>!(x.side==='DEFENDER'?['DR1','DR2','DR3','DR4']:['CR1','CR2','CR3','CR4']).some(o2=>ORD.indexOf(o2)<ORD.indexOf(k)&&typeof R[o2]==='string'&&cureFound(q,R[o2]));
  const inWin=(q,z)=>cureNamed(x.line,R[z.k],2*String(q).length+40).some(n=>n.blocks.some((b,i)=>cureFound(q,b)&&!cureFound(q,n.left[i])&&!cureFound(q,n.right[i])));
  const shortOk=pr=>{const nm=namedIn(pr);return !nm.length||o.short.some(s=>U(s.link)===U(x.link)&&nm.some(z=>z.k===s.round&&ownQ(s.q,z.k)&&inWin(s.q,z)))||stmtQ(stmtOf(x)).some(q=>nm.some(z=>ownQ(q,z.k)&&inWin(q,z)));};
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
    const ks=kg4Split(x.side,x.line,[sp],R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: statement quotes '+sp.round+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered),lines.concat([sp.line]));
    return res('CURED',kg4Why(ks,x.side,'statement passes the check: quotation found in '+sp.round),lines.concat([sp.line]));}
   const ok=ps.filter(p=>CURE_PRESS[x.side].includes(p.round));if(!ok.length)return res('UNCURED','PRESSED round '+ps.map(p=>'['+p.round+']').join(', ')+' does not press the '+x.side.toLowerCase(),lines);
   const hits=ok.filter(p=>typeof R[p.round]==='string'&&cureFoundAll(p.q,R[p.round]));if(!hits.length)return res('UNCURED',ok.every(p=>typeof R[p.round]!=='string')?'the named round text could not be read':'no quotation found in the named round',lines);
   const ks=kg4Split(x.side,x.line,hits,R);if(ks.rests.length&&!ks.open.length)return res('UNCURED','unanswered-false: quotation found in '+hits.map(p=>p.round).join(', ')+', but a later '+x.side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered),lines);
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
   if(y.rule==='K-G6'&&!sq(y))ps.add('P'+(String(y.link).match(/(\d+)\s*$/)||[0,y.link])[1]);if(y.rule==='K-G7'&&!wd.has(U(y.link))&&!kg7Ans2024(y,R))ps.add(y.premise!=null?'P'+y.premise:'L'+U(y.link));if(y.rule==='K-LB'&&y.premise!=null&&(y===self||enfLive(y))&&!lbStated(y))ps.add('P'+y.premise);  }return ps.size;};
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
    const cs7=o.count.filter(c=>c.side===x.side).map(c=>c.line);return res('UNCURED',__a7+': a count does not cure it; cure it with one FORCED line for '+x.link+', or a RETRACTED line with one CORRECTED RESULT (pkgKG7)',cs7);}}
   return kCount(x,'no RETRACTED line with one CORRECTED RESULT');}
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
  if(x.rule==='K-W'){const rp=respOf(x)||'',sp=stmtOf(x)||'';  const kwSt=t=>/\bSTANDS\s+WITHOUT\s+IT\s+because\b/i.test(t)&&/\[L[1-3]\]/.test(t);const kwCo=t=>/(?:^|[.;!?]\s+|:\s+)\**CONCEDED\**(?!\s+LINKS?\b)(?:\s*(?::|;|\.|--|\u2014|$)|(?:\s+[A-Za-z][A-Za-z'\u2019-]*){1,4}\s*(?::|--|\u2014)|\s+as(?:\s+to)?\s+[A-Za-z])/.test(String(t));      const kwRe=t=>/\bREASSERTED\s+IN\s+\[?[CD]R\d+\]?\s*(?:[:,]|--|\u2014)?\s*["\u201c][^"\u201d]{6,}["\u201d]/i.test(t);for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t)continue;if(kwSt(t))return res('CURED','answered: the link stands without the withdrawn footing, on the layer named'+w,[t]);if(kwCo(t))return res('CURED','answered: the link is conceded'+w,[t]);if(kwRe(t))return res('CURED','answered: the withdrawn footing is reasserted in a later round, with its quote'+w,[t]);}if(KW_NH){const KWR_REF=/\s*\((?:\s*(?:[1-3]\s*)?[A-Z][A-Za-z]*\.?(?:\s+of\s+[A-Z][a-z]+|\s+[A-Z][a-z]+)?\s+)?\d+:\d+(?:\s*[-\u2013]\s*\d+)?(?:\s*[,;]\s*(?:(?:[1-3]\s*)?[A-Z][A-Za-z]*\.?(?:\s+[A-Z][a-z]+)?\s+)?\d+(?::\d+)?(?:\s*[-\u2013]\s*\d+)?)*\s*\)/g;  const nw=s=>String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]+/g,' ').trim().split(' ').filter(Boolean);const q=String(x.line||'');const a=q.indexOf('"'),b=q.lastIndexOf('"');const fs0=(a>=0&&b>a?q.slice(a+1,b):q).replace(KWR_REF,' ');const body=nw(fs0.replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,''));const __rn0=b0=>b0.length<=6?[b0.join(' ')]:b0.slice(0,b0.length-5).map((_,i)=>b0.slice(i,i+6).join(' '));const __rn=b0=>{const r=__rn0(b0);if(b0.length>=4&&/^(?:that|how|whether)$/.test(b0[0]))r.push(...__rn0(b0.slice(1)));{let k=b0.length;if(k>=3&&/^(?:it|that|this|so|them|these|those)$/.test(b0[k-1])&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-2])&&b0[k-3]==='i')k--;  if(k>=2&&/^(?:grant|concede|withdraw|drop)$/.test(b0[k-1])&&b0[k-2]==='i'){k-=2;if(k>0&&/^(?:which|as|that|this)$/.test(b0[k-1]))k--;if(k>=3)r.push(...__rn0(b0.slice(0,k)));}}  return r;};  const runs=__rn(body).concat(...nhqFull(x.line,R).map(f=>__rn(nw(f.replace(KWR_REF,' ').replace(/^\s*I\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/i,'')))));  for(const [t,w] of [[rp,''],[sp,' (on its STATEMENT line)']]){if(!t||!/^\s*NOT\s+HELD\b/i.test(t))continue;const T=' '+nw(t).join(' ')+' ';if(runs.some(r=>r&&T.includes(' '+r+' ')))return res('CURED','answered: NOT HELD, with a reason that quotes the flagged sentence (pkgKW)'+w,[t]);}}return res('UNCURED','neither the RESPONSE nor the STATEMENT line says STANDS WITHOUT IT because <layer> with an [L1], [L2] or [L3], CONCEDED, REASSERTED IN <round> "<quote>", or NOT HELD with a reason that quotes the flagged sentence',rp?[rp]:(sp?[sp]:null));}
  if(x.rule==='K-S3'){const rp=respOf(x)||'';if(/\bCOUNTED\b/.test(rp))return res('CURED','answered: the close concession is counted',[rp]);const m=rp.match(/\bTOUCHES\s+NO\s+LINK\b\s*:?\s*(.*)$/i);if(m&&m[1].split(/\s+/).filter(Boolean).length>=5)return res('CURED','answered: it touches no declared link or listed premise, with its reason',[rp]);
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
function cureCorrected(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');if(o.result.length!==1)return null;
 if(!(v||[]).some(x=>x.status==='CURED'&&/^(?:retracted|regraded LINK BROKEN)/.test(x.why||'')))return null;const rsn=cureReasoned(o,(v||[]).map(x=>x.line));return {tag:o.result[0].tag,word:o.result[0].word,links:[...new Set(o.withdrawn.filter(w=>rsn.has(String(w.link).toUpperCase())).map(w=>w.link))]};}
function cureSet(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');const out={};
 for(const side of ['DEFENDER','CHALLENGER']){const ks=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)||(x.rule==='K-V'&&x.status==='CURED'&&/^counted/.test(String(x.why||'')))||x.rule==='K-LB'||(x.rule==='K-UNX'&&x.status==='CURED'&&/CORRECTED COUNT \d+ takes the premise out/.test(String(x.why||'')))));
  if(!ks.length||ks.some(x=>x.status!=='CURED')||ks.every(x=>((x.rule==='K-G6'||x.rule==='K-LB')&&/^statement/.test(String(x.why||'')))||(x.rule==='K-G9'&&/^every listed verse ruled/.test(String(x.why||'')))||(x.rule==='K-G10'&&/^statement/.test(String(x.why||'')))||(x.rule==='K-V'&&!/^counted/.test(String(x.why||''))))  )continue;
  const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];const sv=[...new Set(o.standing.filter(s=>s.side===side).map(s=>s.st))];
  if(ns.length===1||sv.length===1)out[side]={n:ns.length===1?ns[0]:null,st:sv.length===1?sv[0]:null};}
 return Object.keys(out).length?out:null;}
function cureSetApply(p,cs,seat){const F={DEFENDER:['defense_standing','conceded_links'],CHALLENGER:['challenge_standing','challenger_conceded_links']};const lines=[];
 for(const side of Object.keys(cs||{})){const fs=F[side][0],fn=F[side][1],c=cs[side];const was=(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn]);
  if(c.st)p[fs]=c.st;if(c.n!=null)p[fn]=c.n;
  lines.push('[AUDIT v21: CORRECTED STANDING -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; ORIGINAL: '+was+'; COUNTED: '+(p[fs]||'?')+', '+(p[fn]==null?'?':p[fn])+']');}
 return lines;}
function cureCountHeld(reply,v,cs,seat){const o=cureLines(reply&&reply.ok?reply.text:'');const lines=[];
 for(const side of ['DEFENDER','CHALLENGER']){if(cs&&cs[side])continue;const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];if(ns.length!==1)continue;
  const nc=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8'||x.rule==='K-G9'||x.rule==='K-G10'||(x.rule==='K-P'&&x.premise!=null)||x.rule==='K-LB')&&x.status!=='CURED');if(!nc.length)continue;
  lines.push('[AUDIT v21: CORRECTED COUNT NOT WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; CORRECTED COUNT: '+ns[0]+'; NOT CURED: '+cureSafe(nc.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; written only when every count or standing item of the side is CURED (BB-7417)]');}
 return lines;}
function cureSupHead(raw,o,n){let s=String(raw||'');const H=/SUPERSEDED BY CURE: verdict [A-Z-]+ to [A-Z-]+; see the cure lines below(?:\\n|\n)/;const enc=x=>JSON.stringify(String(x)).slice(1,-1);const hd=(o&&n&&o!==n)?'SUPERSEDED BY CURE: verdict '+o+' to '+n+'; see the cure lines below':null;const t=s.trimStart();if(t[0]==='{'){const a=s.indexOf('{');const b=rcObjEnd(s,a);if(b<0)return s;let j=s.slice(a,b).replace(H,'');if(hd)j=j.replace(/("reasoning"\s*:\s*")/,m=>m+enc(hd+'\n'));return s.slice(0,a)+j+s.slice(b);}s=s.replace(H,'');return hd?hd+'\n'+s:s;}
const cureCorrLine=(seat,orig,c)=>'[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+orig+'; COUNTED: '+c.word+' ('+c.tag+'); RETRACTED: '+c.links.join(', ')+']';
const cureSafe=s=>String(s).replace(/\[/g,'(').replace(/\]/g,')').replace(/;(\s*(?:SEAT|ITEM|RULE|RESULT|KINDS|WHY|LINE|STATEMENT|JUDGE STATEMENT):)/g,',$1');
function rcObjEnd(t,a){let d=0,q=false;for(let i=a;i<t.length;i++){const c=t[i];if(q){if(c==='\\')i++;else if(c==='"')q=false;continue;}if(c==='"')q=true;else if(c==='{')d++;else if(c==='}'&&--d===0)return i+1;}return -1;}
function cureJText(raw,panel){const s=String(raw||'');if(!panel){const i=s.indexOf('\n\n[AUDIT');return i<0?s:s.slice(0,i);}
 const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){try{const o=JSON.parse(s.slice(a,b));if(o&&typeof o.reasoning==='string')return o.reasoning;if(o&&typeof o.reason==='string')return o.reason;}catch(e){}
  const m=s.slice(a,b).match(/"reason(?:ing)?"\s*:\s*"([\s\S]*)"\s*\}\s*$/);if(m)return m[1].replace(/\\n/g,'\n').replace(/\\"/g,'"').replace(/\\\\/g,'\\');}return cureUnwrap(s);}
function rcLines(text){const out={col:[],clause:null,key:null,result:null,st:{},cn:{},wdn:0};
 for(const raw of String(text||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const u=l.toUpperCase();if(!l)continue;
  const m=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(m){const r=__RL.readLine(raw);const ok=r.form==='COLLISION'&&!(r.f&&r.f.restated);out.col.push(ok?{link:m[1]+' vs '+m[2],grade:r.f.grade,raw}:{link:m[1]+' vs '+m[2],grade:null,raw,unread:r.detail||r.code||'NO_LINE_FORM'});continue;}
  if(/^(?:[-•]|\d+[.)])?\s*D\d+\s*:?\s*(?:--|—|-|:)?\s*WITHDRAWN\b/.test(u))out.wdn++;
  if(/^CLAUSE\s*:/.test(u)){if(!out.clause)out.clause={raw,u};continue;}if(/^KEYSTONE\s*:/.test(u)){if(!out.key)out.key={raw,u};continue;}if(/^RESULT\s*:/.test(u)){if(!out.result)out.result={raw,u};continue;}
  const s=u.match(/^(DEFENSE|CHALLENGE) STANDING\s*:/);if(s){if(!out.st[s[1]])out.st[s[1]]={raw,u};continue;}
  const c=u.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/);if(c&&!out.cn[c[1]])out.cn[c[1]]={raw,u};}
 out.col=out.col.filter(z=>z.grade||!out.col.some(y=>y.grade&&y.link===z.link));
 return out;}
const rcOne=s=>String(s||'').replace(/\s+/g,' ').trim();
const rcCut=s=>{s=rcOne(s);return s.length>300?s.slice(0,297)+'...':s;};
function cureForcedAdd2024(raw,v,panel){let s=String(raw==null?'':raw);const added=[];const nl=l=>String(l==null?'':l).replace(/\\+/g,'').replace(/[*_\u0060]+/g,'').replace(/\s+/g,' ').trim();const enc=z=>JSON.stringify(String(z)).slice(1,-1); /* pkgFCW (D32): the FORCED line that cured a K-G4 item is written after its collision line, as the gate's forced_add does (ruling 411) */
 for(const x of (v||[])){try{if(!x||x.rule!=='K-G4'||x.status!=='CURED'||!/^forced link: a FORCED line\b/.test(String(x.why||'')))continue;const fl=String(x.statement||'').split(/ \/ (?=FORCED\b)/)[0].trim();const col=String(x.line||'').trim();if(!/^FORCED\b/i.test(fl)||!col)continue;
  const T=cureJText(s,!!panel).split('\n');if(T.some(l=>nl(l)===nl(fl)))continue;const tl=T.filter(l=>nl(l)===nl(col));if(tl.length!==1)continue;const t0=tl[0];
  if(panel&&s.split(enc(t0)).length===2)s=s.replace(enc(t0),()=>enc(t0)+'\\n'+enc(fl));else if(!panel&&s.split(t0).length===2)s=s.replace(t0,()=>t0+'\n'+fl);else continue;added.push(x.link);}catch(e){}}
 return {raw:s,added};}
function cureRecompute(seat,text,F,items,v,reply){const o=cureLines(reply&&reply.ok?reply.text:'');const U=s=>String(s==null?'':s).toUpperCase();const P=rcLines(text);
 const rsn=cureReasoned(o,(items||[]).map(x=>x.line));const __g4u=l=>(v||[]).some(y=>y&&y.rule==='K-G4'&&y.status==='UNCURED'&&U(y.link)===U(l));  const wd=o.result.length===1?o.withdrawn.filter(w=>rsn.has(U(w.link))&&!__g4u(w.link)):[];
 const trig=[];const rp=[];const same=[];const col=P.col.map(c=>({...c}));const done=new Set();
 for(const w of wd){const c=col.find(z=>U(z.link)===U(w.link));if(!c||done.has(U(c.link)))continue;done.add(U(c.link));
  const rs=o.restated.find(r=>U(r.link)===U(w.link)&&r.grade&&!/LINK BROKEN$/.test(r.grade));const g=rs?rs.grade:(w.regrade||'UNDERDETERMINED');
  const nl=rs?rs.text:(w.link+((c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]?' '+(c.raw.match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0]:'')+': '+g+' -- retracted in the cure'+(w.reason?' -- '+w.reason:''));
  trig.push('RETRACTED '+w.link+' ('+(c.grade||'?')+' to '+g+')');c.grade=g;rp.push([c.raw,nl,'RETRACTED '+w.link]);}
 for(const x of (v||[]).filter(y=>y.status==='CURED'&&/^D\d+ vs C\d+$/i.test(String(y.link||'')))){const c=col.find(z=>U(z.link)===U(x.link));if(!c||done.has(U(c.link))||__g4u(x.link))continue;
  const rs=cureRest(o,x).filter(r=>!r.retraction);if(rs.length!==1||!rs[0].grade||rs[0].grade==='STANDS')continue;
  if(rs[0].grade===c.grade){done.add(U(c.link));same.push([c.raw,rs[0].text]);continue;}  done.add(U(c.link));
  trig.push('RESTATED '+x.link+' ('+(c.grade||'?')+' to '+rs[0].grade+')');c.grade=rs[0].grade;rp.push([c.raw,rs[0].text,'RESTATED '+x.link]);}
 /* pkgCRG (W3 3087 ruling 1): a count set by CORRECTED COUNT names its grounds: each K-G1/K-G7 collision the cure counted (still graded the side's LINK BROKEN), then the judge's own line before the cure */
 const __crg=(sd,y,n,yc)=>{const G=sd+' LINK BROKEN';const seen=new Set();const br=[];for(const x of (v||[])){if(!x||x.side!==sd||x.status!=='CURED'||(x.rule!=='K-G7'&&x.rule!=='K-G1'))continue;const lk=U(x.link).replace(/\s+VS\.?\s+/,' VS ');if(seen.has(lk))continue;const z=col.find(q=>U(q.link).replace(/\s+VS\.?\s+/,' VS ')===lk);if(!z||z.grade!==G)continue;seen.add(lk);const m=lk.match(/^D(\d+) VS C(\d+)$/);const p=x.premise!=null?+x.premise:(m?+(sd==='DEFENDER'?m[1]:m[2]):null);br.push((p!=null?'premise '+p+' ':'')+'BROKEN AT THE COLLISION '+z.link.replace(/\s+vs\.?\s+/i,' vs ')+' ('+x.rule+')');}const n0=yc!=null?+yc:(typeof cnt[sd]==='number'?cnt[sd]:null);/* the count the judge's own line states */ const tail=n0>0&&n>=n0?rcOne(y.raw).replace(/^[\s*_]*(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)[*_]*\s*:\s*[*_]*\d+[*_]*\s*(?:--|—|-|:)?\s*/i,'').replace(/[.\s]+$/,''):'';const k=br.length+(tail?n0:0);const low=n0>0&&n<n0?' (the cure lowered the count from '+n0+' and does not say which premises it keeps)':'';if(!br.length&&!tail)return ' -- grounds: the cure names none'+low;return ' -- grounds: '+br.concat(tail?['before the cure, '+n0+': '+tail]:[]).join('; ')+(k!==n?' (the grounds number '+k+', the count '+n+')':'')+low;};
 const cs=cureSet(reply,v);const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnew={};
 for(const sd of ['DEFENDER','CHALLENGER']){let n=null,from=null;
  const rc=o.restated.filter(r=>r.link===lab[sd]);const ok=(v||[]).some(x=>x.status==='CURED'&&(U(x.link)===lab[sd]||(x.rule==='K-SC'&&/restated count/.test(String(x.why||'')))||(x.rule==='K-G9'&&x.side===sd&&/restated count names/.test(String(x.why||'')))));
  if(rc.length===1&&ok){const lead=rc[0].text.match(/^\s*(\d+)\b/);n=lead?+lead[1]:new Set(cntItems(lab[sd]+': '+rc[0].text).filter(i=>i.tag==='CONCEDED'||i.tag==='UNEXHIBITED').map(i=>i.n)).size;from=rc[0].text;}
  if(cs&&cs[sd]&&cs[sd].n!=null){n=cs[sd].n;from=null;trig.push('CORRECTED COUNT '+sd+' '+n);}
  if(n!=null&&n!==cnt[sd]){trig.push('COUNT '+sd+' '+cnt[sd]+' to '+n);cnew[sd]={n,from};}}
 const __r0421=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const __tie421=(cl,a1,a2,n1,n2,r)=>!cl.some(z=>!z.grade)&&!cl.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&a1===a2&&n1===n2&&(r==='DEFENDER WINS'||r==='CHALLENGER WINS');
 if(!trig.length&&__tie421(col,F.defense_standing,F.challenge_standing,F.conceded_links,F.challenger_conceded_links,__r0421))trig.push('TIE (KB-0030)');
 if(!trig.length){if(!same.length)return null;
  return {fields:{verdict_tag:F.verdict_tag,defense_standing:F.defense_standing,conceded_links:F.conceded_links,challenge_standing:F.challenge_standing,challenger_conceded_links:F.challenger_conceded_links},result:null,result0:null,tag:null,trig:[],rp:same,retracted:[],
   audit:'[AUDIT v27: RESTATED LINES WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+same.length+' collision line(s) restated in the cure with the same grade are written in place of the originals; the fields are unchanged]'};}
 rp.push(...same);
 const c={DEFENDER:cnew.DEFENDER?cnew.DEFENDER.n:cnt.DEFENDER,CHALLENGER:cnew.CHALLENGER?cnew.CHALLENGER.n:cnt.CHALLENGER};
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};const unk=col.filter(z=>!z.grade);if(unk.length)trig.push('UNREAD '+unk.map(z=>z.link+' ('+z.unread+')').join(', '));
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const L=Lof(k),n=c[sd];if(typeof n!=='number')return orig;
  if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk.length?orig:'SELF-SUPPORTED';  };
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const held=k<1&&unk.length>0;const tag=held?'UNREAD':k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=held?(F.verdict_tag||null):tag.split('-')[0];
 const res=held?(P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null):(__x=>{if(__tie421(col,dst,cst,c.DEFENDER,c.CHALLENGER,__x)){if(trig.indexOf('TIE (KB-0030)')<0)trig.push('TIE (KB-0030)');return 'UNDERDETERMINED';}return __x;})(word==='BROKEN'?'CHALLENGER WINS':(()=>{const r0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;return (r0&&r0!=='CHALLENGER WINS')?r0:'UNDERDETERMINED';})());
 const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const why='recomputed after the cure from the cured lines ('+trig.join('; ')+')';
 if(P.result&&res!==res0)rp.push([P.result.raw,'RESULT: '+res+' -- '+why+': '+tag+', CHALLENGE STANDING '+cst+', '+(brk.CHALLENGER?brk.CHALLENGER+' collision line(s) stand graded CHALLENGER LINK BROKEN':'no collision line stands graded CHALLENGER LINK BROKEN')+'.']);
 for(const [sd,k2,st,st0] of [['DEFENDER','DEFENSE',dst,F.defense_standing],['CHALLENGER','CHALLENGE',cst,F.challenge_standing]]){const x=P.st[k2];
  const tv=x?(x.u.match(/STANDING\s*:\s*([A-Z-]+)/)||[])[1]:null,tc=x?(x.u.match(/\bC\s*=\s*(\d+)/)||[])[1]:null;
  if(x&&(st!==st0||c[sd]!==cnt[sd]||(tv&&tv!==st)||(tc!=null&&+tc!==c[sd])))rp.push([x.raw,k2+' STANDING: '+st+' -- L='+(Lof(k2)!=null?Lof(k2):'?')+' c='+c[sd]+' -- '+why+'.']);
  const y=P.cn[lab[sd]];const yc=y?(y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/)||[])[1]:null;if(y&&(cnew[sd]||(yc!=null&&+yc!==c[sd])))rp.push([y.raw,lab[sd]+': '+c[sd]+' -- '+why+(cnew[sd]&&cnew[sd].from?' -- '+cnew[sd].from.replace(/^\s*\d+\s*(?:--|—|-|:)?\s*/,''):(c[sd]>0?__crg(sd,y,c[sd],yc):''))+'.']);}
 if(!held&&P.clause&&!new RegExp('^CLAUSE\\s*:\\s*'+tag+'\\b').test(P.clause.u))rp.push([P.clause.raw,P.clause.raw.replace(/^(\s*[*_]*CLAUSE[*_]*\s*:\s*[*_]*)(?:[A-Z]+-\d)?/i,'$1'+tag+' ').replace(/\bk\s*=\s*\d+/i,'k='+k)]);
 const fields={verdict_tag:word,defense_standing:dst,conceded_links:c.DEFENDER,challenge_standing:cst,challenger_conceded_links:c.CHALLENGER};
 const f=(t,d,dc,s2,cc,r)=>t+', DEFENSE '+d+' '+dc+', CHALLENGE '+s2+' '+cc+', RESULT '+(r||'none');
 const audit='[AUDIT v25: RECOMPUTED AFTER CURE -- '+(seat?'SEAT: '+seat+'; ':'')+'TRIGGER: '+cureSafe(trig.join(', '))+'; ORIGINAL: '+f(F.verdict_tag,F.defense_standing,F.conceded_links,F.challenge_standing,F.challenger_conceded_links,res0)
  +'; RECOMPUTED: '+f(word+' ('+tag+')',dst,c.DEFENDER,cst,c.CHALLENGER,res)+'; RULE: engine_manual v85 section 8, STANDINGS, RESULT and VERDICT DEFINITIONS'
  +(rp.length?'; ORIGINAL LINES: '+cureSafe(rp.map(r=>rcCut(r[0])).join(' / ')).replace(/\bRESULT\s*:/g,'RESULT --').replace(/\{/g,'(').replace(/\}/g,')'):'')+']';
 const __cpVoid=(sd,n)=>{const L=[P.cn[lab[sd]],P.st[sd==='DEFENDER'?'DEFENSE':'CHALLENGE']].filter(Boolean).map(z=>z.u).join(' ');return new RegExp('PREMISE\\s+'+n+'\\b[^;.]{0,60}?\\bVOID\\b').test(L);};const __cpSkip=[];
 const __cpAdd={DEFENDER:[],CHALLENGER:[]};(v||[]).forEach(x=>{if(x&&x.status==='CURED'&&/^counted\b/.test(String(x.why||''))&&__cpAdd[x.side]&&Number.isInteger(x.premise)&&x.premise>=1&&__cpAdd[x.side].indexOf(x.premise)<0){if(__cpVoid(x.side,x.premise)){__cpSkip.push(x.side+' '+x.premise);return;}__cpAdd[x.side].push(x.premise);}});
 const __cpT=['DEFENDER','CHALLENGER'].filter(sd=>__cpAdd[sd].length).map(sd=>sd+' '+__cpAdd[sd].join(', ')).join('; ')+(__cpSkip.length?' NOT ADDED, the judge ruled it VOID, so the count that includes it counts a void premise: '+__cpSkip.join(', '):'');
 return {fields,result:res,result0:res0,tag,trig,rp,audit:__cpT?audit.replace(/\]$/,'; COUNTED PREMISES (B6): '+__cpT+']'):audit,retracted:wd.map(x=>x.link),cpAdd:__cpAdd};}
const SB_ROW=/^(DEFENDER|CHALLENGER)\s*\|\s*\[?\s*([CD]R\d)\s*\]?\s*\|\s*(.+?)(?:\s+(?:--|\u2014)\s+.*)?$/i;
const SB_FORM=/^(?:(?:DEFENDER|CHALLENGER)\s*\|\s*\[?\s*[CD]R\d\s*\]?\s*\||D\d+\s+vs\.?\s+C\d+\b|D\d+\s*(?::|--|\u2014)|(?:CHALLENGER\s+)?CONCEDED LINKS\s*:|(?:DEFENSE|CHALLENGE) STANDING\s*:|KEYSTONE\s*:|CLAUSE\s*:|ANSWER CHECK\s*:|FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:|PREMISE\s+\d+\b|RULING\b|(?:DEFENDER|CHALLENGER)\s+CHAIN MARK\s*:\s*(?:FOOTED|STRAINED|SLACK)\b)/i;
function __sbRL(l){try{return __RL.readLine(String(l==null?'':l));}catch(e){return {form:null};}}
function sbLabel(l){const r=__sbRL(l);if(r&&r.form){const f=r.f||{};if(f.restated)return null;
 if(r.form==='COLLISION')return String(f.pair).toUpperCase().replace(/\s+VS\.?\s+/,' VS ');if(r.form==='KEYSTONE')return 'KEYSTONE';if(r.form==='CONCEDED')return f.side==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';
 if(r.form==='STANDING')return f.side+' STANDING';if(r.form==='CLAUSE')return 'CLAUSE';return null;}return sbLabel0(l);}
function sbLabel0(l){const u=String(l||'').replace(/\\+/g,'').replace(/[*_`]+/g,'').trim().replace(/^(?:[-\u2022]|\d+[.)])?\s*/,'').toUpperCase();const m=u.match(/^(D\d+)\s+VS\.?\s+(C\d+)\b/);if(m)return m[1]+' VS '+m[2];const k=u.match(/^(KEYSTONE|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENSE STANDING|CHALLENGE STANDING|CLAUSE)\s*:/);return k?k[1]:null;}
function psGrades(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const __h=ri3Head2024(t);const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m&&!__h)return null;t=m?t.slice(m[0].length):t.replace(/^.*?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i,''); /* pkgRI3B */
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,q=>/[.!?]\s*["”]$/.test(q)?' . ':' ').replace(/(^|[\s(\[:;,])(['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’])(?=$|[\s.,;:!?)\]])/g,(x,a,q)=>a+(/[.!?]\s*['’]$/.test(q)?' . ':' ')) /* pkgPSQ: a quote ending a sentence keeps the sentence break */
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig;
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ').replace(/\b(?:(?:are|is|were|was|be|been)\s+)?(?:not|never)\s+counted\b|\buncounted\b/ig,' spared ');  W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED';
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:__h?__h.side:(m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER'),n:__h?__h.n:(m[2]!=null?+m[2]:null),g};} /* pkgRI3B */
function rctOut(raw,side){const o=new Set();const rx=/\[AUDIT v21: DEBATE RULE VIOLATION REPORT -- SEAT: [^;\]]*; ITEM: (DEFENDER|CHALLENGER) premise (\d+); RULE: K-UNX; RESULT: CURED; WHY: [^\]]*?CORRECTED COUNT \d+ takes the premise out of the count/g;
 for(const m of String(raw||'').replace(/\\+"/g,'"').matchAll(rx))if(m[1]===side)o.add(+m[2]);return o;}
function rctCheck(to,x,raw,RD,cur){const lk=sbLabel(to);const side=lk==='CHALLENGER CONCEDED LINKS'?'CHALLENGER':lk==='CONCEDED LINKS'?'DEFENDER':null;if(!side)return null;
 const out=rctOut(raw,side);if(!out.size)return null;const P=psGrades(to);if(!P)return null;const Q=psGrades(cur);const back=[...out].filter(j=>P.g[j]==='COUNTED'&&!(Q&&Q.g[j]==='COUNTED'));  if(!back.length)return null;
 const rk=side==='CHALLENGER'?'DR3':'CR3';const bad=[];
 for(const j of back){const bk=RD&&typeof RD[rk]==='string'?lbBlockText(RD[rk],j):'';if(!bk)continue;const kk=lbFoot(bk,true);if(!kk.length)continue;
  const txt=unxSegs(String(to)).filter(s=>s.ns.includes(j)).map(s=>s.seg).concat([String(x&&x.why||'')]);if(!txt.some(t=>unxLack(t,kk).missing.length>0))bad.push({j,kk});}
 if(!bad.length)return null;
 return 'RECOUNTED AFTER CURE (pkgRCT, W3 2819): '+bad.map(b=>side+' premise '+b.j).join(', ')+' was taken out by your CORRECTED COUNT; the change names no layer the block lacks (its ['+rk+'] block exhibits '+bad[0].kk.join(' and ')+'). The count stays at your cure value. To count it again, name in the reason a layer ("[L1]", "[L2]", "[L3]") that block does not exhibit.';}
function sbApply2024(seat,raw,F,its,RD){const one=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();const nrm=s=>one(String(s).replace(/\\+/g,'').replace(/[*_`]+/g,''));  const U=s=>String(s==null?'':s).toUpperCase();
 const text=cureJText(raw,true);const lines=text.split('\n');const find=l=>{const n=nrm(l);if(!n)return null;return lines.find(x=>nrm(x)===n)||null;};
 const ch=(its||[]).filter(x=>x&&x.ans==='CHANGE');const items=[];const map=new Map();let resTo=null;
 for(const x of ch){if(x.forced_add){
  const toF=one(String(x.to==null?'':x.to).replace(/\\+"/g,'"')).replace(/[*_`]+/g,'');const kf=toF.match(KF_LINE);const lk=kf?kf[1].toUpperCase().replace(/\s+VS\.?\s+/,' VS '):null;const cur=l=>map.has(l)?map.get(l).to:l;const top=l=>String(cur(l)).split('\n')[0];
  let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}}if(!o&&lk)o=lines.find(l=>sbLabel(top(l))===lk)||null;
  if(!kf||!o||sbLabel(top(o))!==lk){items.push({sid:x.sid,kind:'NOT APPLIED',why:kf?'the collision line of '+kf[1]+' for the FORCED line is not in the judge text':'the FORCED line is not in the FORCED form',to:x.to,lines:o?[o]:[]});continue;}
  const c0=cur(o);if(nrm(c0).includes(nrm(toF)))continue;const pre=(String(o).match(/^\s*(?:[-\u2022]\s+|\d+[.)]\s+)?/)||[''])[0];const p=map.get(o);map.set(o,{sid:p?p.sid:x.sid,to:c0+'\n'+pre+toF,over:p?p.over:[],forced:((p&&p.forced)||[]).concat(x.sid)});continue;}
  let to=one(String(x.to==null?'':x.to).replace(/\\+"/g,'"')).replace(/^["\u201c]+([\s\S]*?)["\u201d]+$/,(m,c)=>c).trim();
  if(/^RESULT\s*:/i.test(to)){resTo={sid:x.sid,to};continue;}
  let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}}
  if(!o){const __a=__sbRL(to);const __oo=r=>r&&r.form==='OUT-OF-ROUND'?r.f:null;const __sk=s=>String(s||'').replace(/\\+/g,'').replace(/["'`\u2018\u2019\u201c\u201d]/g,'').replace(/\s+/g,' ').trim().toUpperCase();
  if(__oo(__a)){const a=__oo(__a);o=lines.find(l=>{const b=__oo(__sbRL(l));return b&&b.side===a.side&&b.round===a.round&&__sk(b.sentence)===__sk(a.sentence);})||null;}else{const m=to.match(SB_ROW);const rq=s=>{const t=nrm(s);const k=t.match(/["\u201c]([^"\u201d]+)["\u201d]/);return (k?k[1]:t.replace(/\s+(?:TOUCHES NO LINK|COUNTED)\b[\s\S]*$/i,'').replace(/^["\u201c]+|["\u201d]+$/g,'')).trim().toUpperCase();};  if(m){const q=rq(m[3]);o=lines.find(l=>{const r=nrm(l).match(SB_ROW);return r&&r[1].toUpperCase()===m[1].toUpperCase()&&r[2].toUpperCase()===m[2].toUpperCase()&&rq(r[3])===q;})||null;}}}
  if(/^NOT HELD\b/i.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'a NOT HELD dispute written under CHANGE TO, not a line change',to,lines:o?[o]:[]});continue;}
  if(!o&&x.rule==='E-UNG'){const __n=(String(x.item||'').match(/\bCOLLISION D(\d+)\b/)||[])[1];const __lk=sbLabel(to);if(__n&&__lk&&__lk.indexOf('D'+__n+' VS ')===0){
   o=lines.find(l=>sbLabel(l)===__lk)||null;if(!o){const __c=lines.filter(l=>/^D\d+ VS C\d+$/.test(String(sbLabel(l)||'')));const __at=__c.length?__c[__c.length-1]:(lines.find(l=>/^\s*\**\s*COLLISION POINTS\b/i.test(l))||null);
    if(__at){const p=map.get(__at);const c0=p?p.to:__at;map.set(__at,{sid:p?p.sid:x.sid,to:c0+'\n'+to,over:p?p.over:[],forced:((p&&p.forced)||[]).concat(p?[x.sid]:[])});continue;}}}}
  if(x.rule==='E-KSC'){const __lk=sbLabel(to);if(__lk==='KEYSTONE'||__lk==='CONCEDED LINKS'){const __c=lines.filter(l=>sbLabel(l)===__lk);if(__c.length===1)o=__c[0];}}
  if(!o){const __lk=sbLabel(to);if(__lk){const __c=lines.filter(l=>sbLabel(l)===__lk);if(__c.length===1)o=__c[0];}}
  if(!o&&!sbLabel(to)){const __sg=nrm(x.line);if(__sg.length>=30){const __h=lines.filter(l=>nrm(l).split(__sg).length===2);
   if(__h.length===1&&nrm(text).split(__sg).length===2){const __o=__h[0];const __p=map.get(__o);const __c=nrm(__p?__p.to:__o);if(__c.split(__sg).length===2){o=__o;to=__c.split(__sg).join(to);}else if(__p){__p.over=(__p.over||[]).concat(x.sid);continue;}}}}
  if(!o){const __rt=nrm(to).match(/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*\.?$/i);if(__rt){const __pk=(__rt[1]+' VS '+__rt[2]).toUpperCase();const __FO=/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i;const __pf=l=>{const m=nrm(l).match(__FO);return m?(m[1]+' VS '+m[2]).toUpperCase():null;}; /* pkgFRP */
   const __dn=[...map.values()].find(v=>v&&v.rfl===__pk);if(__dn){__dn.over=(__dn.over||[]).concat(x.sid);continue;}const __c=lines.filter(l=>!(map.has(l)&&map.get(l).to==='')&&__pf(map.has(l)?map.get(l).to:l)===__pk);if(__c.length===1)o=__c[0];}}
  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text',to});continue;}{const __rt=nrm(to).match(/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*\.?$/i);const __fo=nrm(map.has(o)?map.get(o).to:o).match(/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i);  if(__rt&&__fo&&(__rt[1]+' VS '+__rt[2]).toUpperCase()===(__fo[1]+' VS '+__fo[2]).toUpperCase()){const p=map.get(o);map.set(o,{sid:x.sid,to:'',over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[]),rfl:(__fo[1]+' VS '+__fo[2]).toUpperCase()});continue;}}
  {const __lo=sbLabel(o);if(__lo&&!sbLabel(to)&&SB_FORM.test(to)){const __pn=(nrm(to).match(/^Premise\s+(\d+)\b/i)||[])[1];const __p=map.get(o);const __c=nrm(__p?__p.to:o);
   const __ss=__c.split(/(?:(?<=[.;])|(?<=--))\s+(?=Premises?\s+\d)/);const __ix=__pn?__ss.map((z,i)=>new RegExp('^Premise\\s+'+__pn+'\\b','i').test(z)?i:-1).filter(i=>i>=0):[];
   const __cnt=t=>{const g=psGrades(t);return g&&g.g&&(__pn in g.g)?g.g[__pn]==='COUNTED':null;};if(__ix.length===1){const __s0=__ss.join(' ');__ss[__ix[0]]=to;const __nw=__ss.join(' ');const __a=__cnt(__s0),__b=__cnt(__nw);
    if(__a!=null&&__b!=null&&__a!==__b){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change moves premise '+__pn+(__b?' into':' out of')+' the '+__lo+' count, so the line\'s count number would be stale: write the whole line with its label and count (pkgSGA2, W1 2695)',to,lines:[o]});continue;}to=__nw;}else{items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change has no line label and would replace the whole '+__lo+' line'+(__pn?' (the line has '+(__ix.length?'more than one':'no')+' sentence for premise '+__pn+')':'')+': write the whole line with its label (pkgSGA)',to,lines:[o]});continue;}}}
  if(x.rule==='E-OOR'&&/^\(?\s*(?:STRUCK|STRIKE|REMOVED?|DELETED?)\b/i.test(to)){const __c=map.has(o)?map.get(o).to:o; /* pkgOOS */
   if(/\bCOUNTED\s*\.?\s*$/i.test(nrm(__c))){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the row ends COUNTED, so striking it would leave the count stale: write the whole CONCEDED LINKS line with its count, or the row without COUNTED (pkgOOS)',to,lines:[o]});continue;}
   const p=map.get(o);map.set(o,{sid:x.sid,to:'',over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[]),oos:true});continue;}
  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads',to,lines:[o]});continue;}
  const __psg=x.rule==='E-GATE'&&x.psrc?ch.find(y=>y.sid===x.psrc&&y.rule==='E-PREM')||null:null;
  if(x.rule==='E-PREM'||__psg){const cu=map.has(o)?map.get(o).to:o;const P=psGrades(to),Q=psGrades(cu);
   if(P&&Q){const iq=s=>{const m=String(s||'').match(/against the (defender|challenger)\s+(\d+)/i);return m?{side:m[1].toUpperCase(),n:+m[2]}:null;};const nl=nrm(__psg?__psg.line:x.line);
    const named=new Set(ch.filter(y=>y.rule==='E-PREM'&&nrm(y.line)===nl).map(y=>iq(y.item)).filter(Boolean).map(y=>y.n));const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);
    const moved=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]);const out=moved.filter(k=>!named.has(k));const jump=P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>named.size;
    if(P.side!==Q.side||out.length||jump){items.push({sid:x.sid,kind:'NOT APPLIED',why:P.side!==Q.side?'the change moves the '+Q.side+' CONCEDED LINKS line to the '+P.side+' side (pkgPS, W3 2446)':'the change regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count from '+Q.n+' to '+P.n)+', which '+(out.length>1?'its items do':'its item does')+' not name (named: '+([...named].join(', ')||'none')+'; pkgPS, W3 2446: a premise change stays inside the premises its items name)',to,lines:[o]});continue;}}}
  {const CM=/^\s*(?:[-\u2022]|\d+[.)])?\s*(DEFENDER|CHALLENGER)\s+CHAIN MARK\s*:/i;const ct=nrm(to).match(CM),co=nrm(o).match(CM);
   if((ct||co)&&!(ct&&co&&ct[1].toUpperCase()===co[1].toUpperCase())){items.push({sid:x.sid,kind:'NOT APPLIED',why:ct&&co?'the change moves the '+co[1].toUpperCase()+' CHAIN MARK to the '+ct[1].toUpperCase()+' side (W3 2395: a CHAIN MARK change applies only over the same side\'s CHAIN MARK line)':ct?'a CHAIN MARK line may replace only a CHAIN MARK line of the same side (W3 2395), and the flagged line is not one':'the change drops the '+co[1].toUpperCase()+' CHAIN MARK (W3 2395: a change to a CHAIN MARK line must be a CHAIN MARK line of the same side)',to,lines:[o]});continue;}}
  {const PR=/^\s*(?:[-\u2022]|\d+[.)])?\s*(?:FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*)?(D\d+)\s+VS\.?\s+(C\d+)\b/i;const FR=/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED\b/i;
   const pOf=l=>{const m=nrm(l).match(PR);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};const pk=pOf(o);
   const GR=/^\s*(?:[-\u2022*]\s*|\d+[.)]\s*)?\**D\d+\s+vs\.?\s+C\d+\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\b/;
   if(pk){const tp=pOf(to);const ok=tp===pk&&(FR.test(nrm(to))?FR.test(nrm(o)):GR.test(to));
    if(!ok){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change drops the collision '+pk.replace(' VS ',' vs ')+' (W3 2351: a change to a collision or FORCED line must be a collision line for the same pair)',to,lines:[o]});continue;}}}
  {const __d38=typeof d38Refuse2024==='function'?d38Refuse2024(to,x):null;if(__d38){items.push({sid:x.sid,kind:'NOT APPLIED',why:__d38,to,lines:[o],d38r:true});continue;}}   {const __rct=rctCheck(to,x,raw,RD,map.has(o)?map.get(o).to:o);if(__rct){items.push({sid:x.sid,kind:'NOT APPLIED',why:__rct,to,lines:[o],rct:true});continue;}}
  const lk=sbLabel(to);const same=lk?lines.filter(l=>sbLabel(l)===lk):[];
  for(const o2 of [...new Set([o].concat(same))]){const p=map.get(o2);map.set(o2,{sid:x.sid,to,over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[])});}}
 const build=M=>text.split('\n').map(l=>M.has(l)?M.get(l).to:l).join('\n');
 const keyChecks=(T)=>{const P=rcLines(T);if(!P.key)return [];const m=P.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/);if(!m)return [];const out=[];
  const kc=P.col.filter(z=>U(z.link).startsWith(m[1]+' VS'));const br=kc.some(z=>z.grade==='DEFENDER LINK BROKEN');
  if(m[2]==='STANDS'&&br)out.push({k:m[1],rule:0,why:'KEYSTONE '+m[1]+' STANDS while '+kc.filter(z=>z.grade==='DEFENDER LINK BROKEN').map(z=>z.link).join(', ')+' is graded DEFENDER LINK BROKEN',lines:[P.key.raw].concat(kc.map(z=>z.raw))});
  if(m[2]==='BROKEN'&&!br&&kc.every(z=>z.grade)&&!sbKeyExempt2024(P.key.raw,P,RD))out.push({k:m[1],rule:0,why:'KEYSTONE '+m[1]+' BROKEN while no '+m[1]+' collision line is graded DEFENDER LINK BROKEN, and its GROUND quotes no defender grant found in the named defender round and names no premise its CONCEDED LINKS line counts',lines:[P.key.raw].concat(kc.map(z=>z.raw))});
  if(m[2]!=='WITHDRAWN'){const bw=sbBrokenWord2024(P);const g0=new Map(rcLines(text).col.map(z=>[U(z.link),z.grade]));const fl=P.col.filter(z=>g0.has(U(z.link))&&(g0.get(U(z.link))==='DEFENDER LINK BROKEN')!==(z.grade==='DEFENDER LINK BROKEN'));
   if(m[2]==='BROKEN'&&bw===false)out.push({k:m[1],rule:2,why:'KEYSTONE '+m[1]+' BROKEN while the verdict derived from the corrected collision lines is not BROKEN',lines:[P.key.raw].concat(fl.map(z=>z.raw))});  }
  return out;};
 {const P9=rcLines(build(map));for(const [o9,c9] of [...map]){if(!c9.rfl)continue;const g9=P9.col.filter(z=>U(z.link)===c9.rfl).map(z=>z.grade);if(g9.some(g=>/LINK BROKEN$/.test(String(g||'')))){map.delete(o9);items.push({sid:c9.sid,kind:'NOT APPLIED',why:'the collision line of '+c9.rfl.replace(' VS ',' vs ')+' is still graded '+g9.find(g=>/LINK BROKEN$/.test(String(g||'')))+', and a broken link keeps its FORCED line (ruling 411; pkgRFL)',to:'RETRACTED: '+c9.rfl.replace(' VS ',' vs '),lines:[o9]});}}}  {const P0=rcLines(build(map));const km=P0.key?P0.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|-|:)?\s*(STANDS|BROKEN)\b/):null;
  if(km){const kraw=P0.key.raw;const keyO=lines.find(l=>l===kraw)||find(kraw);const touched=[...map].some(([o,c])=>nrm(o)===nrm(kraw)||nrm(c.to)===nrm(kraw));
   const g0=new Map(rcLines(text).col.map(z=>[U(z.link),z.grade]));const kc=P0.col.filter(z=>U(z.link).startsWith(km[1]+' VS'));const moved=kc.filter(z=>g0.has(U(z.link))&&g0.get(U(z.link))!==z.grade);
   const brl=kc.filter(z=>z.grade==='DEFENDER LINK BROKEN');let d=null;
   if(km[2]==='STANDS'&&brl.length&&moved.some(z=>z.grade==='DEFENDER LINK BROKEN'))d='BROKEN';
   else if(km[2]==='BROKEN'&&!brl.length&&kc.every(z=>z.grade)&&moved.some(z=>g0.get(U(z.link))==='DEFENDER LINK BROKEN')&&!sbKeyExempt2024(kraw,P0,RD))d='STANDS';
   if(d&&keyO&&!touched){const pre=(String(keyO).match(/^\s*(?:[-\u2022]\s+|\d+[.)]\s+)?[*_]*KEYSTONE[*_]*\s*:\s*[*_]*/i)||['KEYSTONE: '])[0];
    const to=pre+km[1]+' -- '+d+' -- derived by the engine from the collision grade'+(d==='BROKEN'?' '+brl.map(z=>z.link).join(', ')+' DEFENDER LINK BROKEN':'s of '+km[1]+' (none DEFENDER LINK BROKEN)')+' after the change of '+[...new Set([...map].filter(([o,c])=>moved.some(z=>nrm(c.to).includes(nrm(z.raw))||U(c.to).includes(U(z.link)))).map(([o,c])=>c.sid))].join(', ')+' (E-APPLY, W3 2362)';
    map.set(keyO,{sid:'KEYSTONE (derived)',to,over:[],derived:true});}}}
 {const seen=new Set();for(const kx of keyChecks(build(map))){const kn=new Set(kx.lines.map(nrm));const hit=new Set();for(const [o,c] of [...map]){if(kn.has(nrm(c.to))||kn.has(nrm(o)))hit.add(c.sid);}for(const [o,c] of [...map]){if(hit.has(c.sid))map.delete(o);}for(const sid of hit){if(seen.has(sid))continue;seen.add(sid);const c=(ch.find(z=>z.sid===sid)||{});items.push({sid,kind:'CONTRADICTION',why:kx.why+' (the change is not applied)',to:String(c.to||''),lines:kx.lines});}}}
 {const P9b=rcLines(build(map));for(const [o9,c9] of [...map]){if(!c9.rfl)continue;const g9=P9b.col.filter(z=>U(z.link)===c9.rfl).map(z=>z.grade);if(g9.some(g=>/LINK BROKEN$/.test(String(g||'')))){map.delete(o9);items.push({sid:c9.sid,kind:'NOT APPLIED',why:'the collision line of '+c9.rfl.replace(' VS ',' vs ')+' is still graded '+g9.find(g=>/LINK BROKEN$/.test(String(g||'')))+' (its change was not applied), and a broken link keeps its FORCED line (ruling 411; pkgRFL, rechecked by pkgFCW v2)',to:'RETRACTED: '+c9.rfl.replace(' VS ',' vs '),lines:[o9]});}}} /* pkgFCW v2 */
 if(!map.size&&!items.length&&!resTo)return null;
 const T=build(map);const P=rcLines(T);const col=P.col;
 const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const c={...cnt};const trig=[];
 const changed=new Set([...map.values()].map(z=>nrm(z.to)));
 for(const sd of ['DEFENDER','CHALLENGER']){const y=P.cn[lab[sd]];if(!y||!changed.has(nrm(y.raw)))continue;const m=y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/);if(m&&+m[1]!==cnt[sd]){c[sd]=+m[1];trig.push('COUNT '+sd+' '+cnt[sd]+' to '+c[sd]);}}
 for(const [o,z] of map){const g0=(rcLines(o).col[0]||{}).grade||null,g1=(rcLines(z.to).col[0]||{}).grade||null;if(g1&&g0!==g1)trig.push('CHANGED '+(rcLines(z.to).col[0].link)+' ('+(g0||'no grade')+' to '+g1+')');}
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length};const unk=col.filter(z=>!z.grade);if(unk.length)trig.push('UNREAD '+unk.map(z=>z.link+' ('+z.unread+')').join(', '));
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const n=c[sd];if(typeof n!=='number')return orig;if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk.length?orig:'SELF-SUPPORTED';};
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|\u2014|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const held=k<1&&unk.length>0;const tag=held?'UNREAD':k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=held?(F.verdict_tag||null):tag.split('-')[0];
 const res0=P.result?((P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null;
 const tie=!unk.length&&!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&dst===cst&&c.DEFENDER===c.CHALLENGER;
 let res=word==='BROKEN'?'CHALLENGER WINS':((res0&&res0!=='CHALLENGER WINS')?res0:'UNDERDETERMINED');if(tie&&(res==='DEFENDER WINS'||res==='CHALLENGER WINS'))res='UNDERDETERMINED';if(held)res=res0;
 let __rsOK=false;  if(resTo){const rw=(U(resTo.to).match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null;if(rw!==res)items.push({sid:resTo.sid,kind:'RESULT DIFFERS',why:'the judge wrote '+(rw?'RESULT: '+rw:'a RESULT line the engine cannot read')+'; the result derived from its corrected lines is '+res,to:resTo.to});else __rsOK=true;}
 const sids=[...new Set([...map.values()].flatMap(z=>[z.sid].concat(z.forced||[])).concat(__rsOK?[resTo.sid]:[]))];const why='derived after the send-back from the judge\'s own changed lines ('+(sids.length?sids.join(', '):'none applied')+(trig.length?'; '+trig.join('; '):'')+')';
 const rp=[];for(const [o,z] of map){const k=Math.max(1,text.split(o).length-1);for(let i=0;i<k;i++)rp.push([o,z.to,z.sid]);}
 if(P.result&&(res!==res0||__rsOK))rp.push([P.result.raw,__rsOK?resTo.to:'RESULT: '+res+' -- '+why+': '+tag+'.']);
 for(const [sd,k2,st,st0] of [['DEFENDER','DEFENSE',dst,F.defense_standing],['CHALLENGER','CHALLENGE',cst,F.challenge_standing]]){const x=P.st[k2];if(x&&(st!==st0||c[sd]!==cnt[sd]))rp.push([x.raw,k2+' STANDING: '+st+' -- L='+(Lof(k2)!=null?Lof(k2):'?')+' c='+c[sd]+' -- '+why+'.']);}
 if(!held&&P.clause&&!new RegExp('^CLAUSE\\s*:\\s*'+tag+'\\b').test(P.clause.u))rp.push([P.clause.raw,P.clause.raw.replace(/^(\s*[*_]*CLAUSE[*_]*\s*:\s*[*_]*)(?:[A-Z]+-\d)?/i,'$1'+tag+' ').replace(/\bk\s*=\s*\d+/i,'k='+k)]);
 const fields={verdict_tag:word,defense_standing:dst,conceded_links:c.DEFENDER,challenge_standing:cst,challenger_conceded_links:c.CHALLENGER};
 const f=(t,d,dc,s2,cc,r)=>t+', DEFENSE '+d+' '+dc+', CHALLENGE '+s2+' '+cc+', RESULT '+(r||'none');
 const over=[...new Map([...map.values()].filter(z=>z.over.length).map(z=>[z.sid,z])).values()].map(z=>z.sid+' replaces '+z.over.join(', ')+' on the same line (the last change wins)');
 const audit='[AUDIT v37: SEND-BACK APPLIED (E-APPLY; WALL-2024 2236, 2237) -- SEAT: '+seat+'; APPLIED: '+(sids.length?sids.join(', '):'none')+(over.length?'; '+over.join('; '):'')+'; ORIGINAL: '+f(F.verdict_tag,F.defense_standing,F.conceded_links,F.challenge_standing,F.challenger_conceded_links,res0)+'; DERIVED: '+f(word+' ('+tag+')',dst,c.DEFENDER,cst,c.CHALLENGER,res)+'; RULE: engine_manual v85 section 8 and the tie rule KB-0030, applied to the corrected lines]'
  +items.map(z=>'\n[AUDIT v37: SEND-BACK ITEM -- SEAT: '+seat+'; '+z.sid+'; '+z.kind+': '+cureSafe(z.why)+'; LINE: '+cureSafe(String(z.to||'').slice(0,300))+'; RECORD-ONLY: no further call is made, it removes no seat. REVIEW THIS ROW.]').join('');
 return {text:T,fields,result:res,result0:res0,tag,trig,rp,audit,retracted:sids.length?['none; send-back changes '+sids.join(', ')+' applied']:['none'],cpAdd:null,items,applied:sids,replace:[...map.values()].filter(z=>z&&Array.isArray(z.over)&&z.over.length).map(z=>({sid:z.sid,over:z.over.slice()}))};}
const GATE_STATUS={'CONTRADICTION':'LIVE','NOT APPLIED':'LIVE','RESULT DIFFERS':'LIVE','ANSWER GROUND':'LIVE','RULE':'LIVE'};
function sbBrokenWord2024(P){const k=P.col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length;const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];
 const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u));const __r=k>=1||(n!=null&&2*w>n)||kw;return __r?true:(P.col.some(z=>!z.grade)?null:false);}
function sbKeyExempt2024(keyRaw,P,RD){const l=String(keyRaw||'').replace(/[*_`]+/g,'');const g=(l.match(/\bGROUND\s*:([\s\S]*)$/i)||[null,l.replace(/^[^]*?\bBROKEN\b/i,'')])[1];
 if(RD&&typeof RD==='object'){for(const m of g.matchAll(/\[\s*(CR[1-4])\s*\]\s*[:,]?\s*["“]([^"”]{12,})["”]/gi)){const r=m[1].toUpperCase();
  if(typeof RD[r]==='string'&&/\b(?:grant|grants|granted|concede|concedes|conceded|allow|drop|withdraw|do not claim)\b/i.test(m[2])&&ciFound(m[2],RD[r]))return true;}}
 const cn=P.cn&&P.cn['CONCEDED LINKS'];if(cn){const cu=cn.u;for(const m of g.matchAll(/\bPremise\s+(\d+)\b/gi)){if(new RegExp('\\bPREMISE\\s+'+m[1]+'\\b[^.;]*\\b(?:CONCEDED|UNEXHIBITED)\\b').test(cu))return true;}}
 return false;}
function gateAnsGround2024(T){const out=[];const P=rcLines(T);const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 for(const raw of String(T||'').split('\n')){const l=raw.replace(/[*_`]+/g,'').trim();const __a=__acRead(raw);const __one=!!(__a&&Array.isArray(__a.rounds)&&__a.rounds.length===1&&__a.verse); /* pkgR1B: shared reader when the line names one round */
  const m=__one?[null,String(__a.verse),String(__a.rounds[0])]:l.match(/^(?:[-•]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i);if(!m)continue;
  const gs=[...l.matchAll(/(?:--|—)\s*(MEETS|MISSES)\b/gi)];if(__one?String(__a.grade||'').toUpperCase()!=='MISSES':(!gs.length||gs[gs.length-1][1].toUpperCase()!=='MISSES'))continue;if(__one?/^NONE\b/i.test(String(__a.means||'').trim()):/(?:--|—)\s*MEANS\s*:\s*NONE\b/i.test(l))continue;
  const ref=m[1].replace(/\s+/g,' ').trim();if(!/^(?:[1-3]\s)?[A-Za-z][A-Za-z ]*\s\d+:\d+$/.test(ref))continue;const side=m[2].toUpperCase().startsWith('C')?'CHALLENGER':'DEFENDER';
  const rx=new RegExp('(?:^|[^A-Za-z0-9])'+esc(ref).replace(/ /g,'\\s+')+'(?![0-9]|:\\d)','i');
  for(const z of P.col){if(z.grade!==side+' LINK BROKEN')continue;const zl=z.raw.replace(/[*_`]+/g,'');const at=zl.toUpperCase().indexOf(z.grade);if(at<0)continue;
   if(rx.test(zl.slice(at+z.grade.length)))out.push({key:'ANSWER GROUND|'+ref.toUpperCase()+'|'+m[2].toUpperCase()+'|'+z.link.toUpperCase(),why:'your ANSWER CHECK on '+ref+' ['+m[2].toUpperCase()+'] grades the answer MISSES, so that press stands for the '+side.toLowerCase()+'; yet '+z.link+' is graded '+z.grade+' with '+ref+' among its footing or ground. Change one of the two lines so they agree.',lines:[raw.trim(),z.raw]});}}
 return out;}
function gatePromptText2024(body){try{const b=body||{};const out=[];(b.messages||[]).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:''));});(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
function sbRoundsOf2024(seat){try{const PB=$('Panel Build').first().json;const j=(PB.judges||[]).find(q=>q.seat===seat);return j&&j.body?ciRounds(gatePromptText2024(j.body)):null;}catch(e){return null;}}
function __kg1lCount(T,side){if(side!=='DEFENDER'&&side!=='CHALLENGER')return [];const re=side==='CHALLENGER'?/^(?:[-\u2022]|\d+[.)])?\s*CHALLENGER CONCEDED LINKS\s*:/i:/^(?:[-\u2022]|\d+[.)])?\s*(?:DEFENDER\s+)?CONCEDED LINKS\s*:/i;
 const L=String(T||'').split('\n').filter(l=>{const c=l.replace(/\\+/g,'').replace(/[*_\x60]+/g,'').trim();const rr=ri3Count2024(c,side);return rr===null?re.test(c):rr;});return L.length?[L[L.length-1].trim()]:[];}
function gateNewK2024(T0,T1,F0,F1,ctx){let MK=[];const run=(T,F)=>{PRS_CTX.R=ctx.R||null;PRS_L2BAD=null;const D=drvCheck(T,F.conceded_links,F.challenger_conceded_links,F.defense_standing,F.challenge_standing,!!ctx.ask,ctx.DL||[]);MK=D.marks||[];const its=(D.items||[]).slice();
  if(ctx.R&&Object.keys(ctx.R).length){const F9=kfLines(T,ctx.R);(F9.items||[]).forEach(x=>its.push(x));MK=MK.concat(F9.marks||[]);}   if(ctx.R&&Object.keys(ctx.R).length){const U9=kunxLines(T,ctx.R);(U9.items||[]).forEach(x=>its.push({...x,why:x.link+': '+x.why}));MK=MK.concat(U9.marks||[]);}
  return its;};
 const key=x=>x.rule+'|'+(x.side||'')+'|'+(x.link?String(x.link).toUpperCase():String(x.why||'').slice(0,80));
 let a,b;try{a=run(T0,F0);b=run(T1,F1);}catch(e){return {error:String(e&&e.message||e).slice(0,200),items:[]};}
 const __q3=x=>x.rule==='K-S3'?'K-S3|'+(x.side||'')+'|'+String(x.line==null?'':x.line).replace(/^\s*(?:DEFENDER|CHALLENGER)\b[^:]*:\s*/i,'').replace(/[\\"'\u2018\u2019\u201c\u201d`*_]+/g,'').replace(/\s+/g,' ').trim().toUpperCase():null; /* pkgKS3Q: a K-S3 row whose sentence the pre-change text already held is not new, whatever its position */
 const k0=new Set(a.map(key));const q0=new Set(a.map(__q3).filter(Boolean));const seen=new Set();const items=[];for(const x of b){const k=key(x);if(k0.has(k)||seen.has(k))continue;const q=__q3(x);if(q&&q0.has(q))continue;seen.add(k);
  const mk=x.link?MK.find(t=>t.includes('('+x.rule+') -- '+x.link)):null;const w=x.why||(mk?mk.replace(/^\[AUDIT v\d+:\s*/,'').replace(/\s*REVIEW THIS ROW\.\]$/,'').replace(/\]$/,''):'');
  items.push({key:'RULE|'+k,rule:x.rule,live:enfStatus(x.rule)==='LIVE',why:(w?String(w):x.rule+(x.link?' '+x.link:'')).slice(0,500),lines:x.line?[String(x.line)].concat(x.rule==='K-G1'?__kg1lCount(T1,x.side):[]):[]});}
 return {items};}
/* pkgD38 (W2, W3 3087 ruling 2 + 3089): after a cure or send-back, the stored count, keystone and collision grades must agree with the RULING cards and grounds left in the judge's own text. */
const D38_STATUS={COL:'LIVE',KEY:'LIVE',PREM:'LIVE',BASIS:'LIVE'}; /* W3 sets each type LIVE (sent back; uncured = a gate fault) or TRIAL (record-only) */
function d38Items2024(T0,T1,raw){const out=[];const U=s=>String(s==null?'':s).toUpperCase();const one=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
 const P=rcLines(T1),P0=rcLines(T0);const cards=[];for(const l of String(T1||'').split('\n')){let r;try{r=__RL.readLine(l);}catch(e){r=null;}if(r&&r.form==='RULING'&&r.f&&!r.f.restated)cards.push({raw:l.trim(),subj:one(r.f.subject),grade:U(one(r.f.grade)).replace(/\s*\(.*$/,'')});}
 const colG=lk=>{const c=P.col.find(z=>U(z.link).replace(/\s+VS\.?\s+/,' VS ')===lk);return c?{grade:c.grade,raw:c.raw}:null;};
 const CG=/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)$/;
 for(const c of cards){const m=c.subj.match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(!m||!CG.test(c.grade))continue;const lk=U(m[1]+' VS '+m[2]);const g=colG(lk);if(!g||!g.grade||g.grade===c.grade)continue;
  out.push({type:'COL',key:'D38|COL|'+lk,why:'your RULING card grades '+m[1]+' vs '+m[2]+' '+c.grade+', but your collision line for '+m[1]+' vs '+m[2]+' now grades it '+g.grade+'. Change one of the two lines so they agree.',lines:[c.raw,g.raw]});}
 const km=P.key?P.key.u.match(/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/):null;
 if(km)for(const c of cards){const m=c.subj.match(/^(?:KEYSTONE\s+(D\d+)|(D\d+)\s*\(?\s*KEYSTONE\s*\)?)$/i);if(!m||!/^(STANDS|BROKEN)$/.test(c.grade))continue;const d=U(m[1]||m[2]);if(d!==km[1]||c.grade===km[2])continue;
  out.push({type:'KEY',key:'D38|KEY|'+d,why:'your RULING card grades KEYSTONE '+d+' '+c.grade+', but your KEYSTONE line now reads '+d+' '+km[2]+'. Change one of the two lines so they agree.',lines:[c.raw,P.key.raw]});}
 const cntOf=sd=>{const y=P.cn[sd==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS'];const m=y&&y.u.match(/CONCEDED LINKS\s*:\s*(\d+)/);return m?{n:+m[1],raw:y.raw}:null;};
 for(const c of cards){if(!/^(UNEXHIBITED|CONCEDED)$/.test(c.grade))continue;const s=c.subj;let sd=null,n=null;let m;
  if((m=s.match(/^(challenger|defender)(?:-directed)?\s+premise\s+(\d+)$/i))){sd=U(m[1]);n=+m[2];}
  else if((m=s.match(/^premise\s+(\d+)\s*\(?\s*against\s+(?:the\s+)?(challenger|defender)\s*\)?$/i))){sd=U(m[2]);n=+m[1];}
  else if((m=s.match(/^LINK\s+(?:D)?(\d+)$/i))){sd='DEFENDER';n=+m[1];}
  if(!sd)continue;const k=cntOf(sd);if(!k||k.n!==0)continue;const lab=sd==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';const src=d38CountSrc2024(T1,raw,sd,k.raw);
  const why='your RULING card grades '+sd.toLowerCase()+' premise '+n+' '+c.grade+', which counts it, but your '+lab+' line counts 0.'+(src?' That count came from the cure ('+src+'). Change the RULING card, not the count: write the card again with a grade that does not count premise '+n+'. '+(sd==='CHALLENGER'?'Raising CHALLENGER CONCEDED LINKS here is an Oracle concede and is refused':'Raising CONCEDED LINKS here is refused')+' (W3 3120).':' Change one of the two lines so they agree.');
  out.push({type:'PREM',key:'D38|PREM|'+sd+'|'+n,why,lines:[c.raw,k.raw],...(src?{d38c:{lab,src}}:{})});}
 for(const sd of ['DEFENDER','CHALLENGER']){const G=sd+' LINK BROKEN';const k=cntOf(sd);if(!k||k.n<1)continue;const lab=sd==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';
  const y0=P0.cn[lab];const same=!!y0&&one(y0.raw)===one(k.raw);const am=String(raw||'').match(new RegExp('counted_premises_'+sd.toLowerCase()+'\\\\?"\\s*:\\s*\\[([^\\]]*)\\]'));
  const arr=am?(am[1].match(/\d+/g)||[]).map(Number):null;if(!same||!arr||arr.length!==k.n)continue;
  const pn=z=>{const m=U(z.link).match(/^D(\d+)\s+VS\.?\s+C(\d+)$/);return m?+(sd==='DEFENDER'?m[1]:m[2]):null;};
  for(const n of arr){const was=P0.col.filter(z=>pn(z)===n&&z.grade===G);if(!was.length)continue;const now=P.col.filter(z=>pn(z)===n);if(now.some(z=>z.grade===G)||!now.length)continue;
   const moved=was.map(z=>now.find(q=>U(q.link)===U(z.link))).filter(q=>q&&q.grade&&q.grade!==G);if(!moved.length)continue;
   const ln=U(k.raw);if(new RegExp('\\b(?:PREMISES?|LINK|D|P)\\s*'+n+'\\b[^;.]*\\b(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\\b').test(ln))continue;
   if(cards.some(c=>/^(UNEXHIBITED|CONCEDED)$/.test(c.grade)&&new RegExp('(?:PREMISE|LINK)\\s+(?:D)?'+n+'$').test(U(c.subj))&&(sd==='DEFENDER'?!/CHALLENGER/.test(U(c.subj)):/CHALLENGER/.test(U(c.subj)))))continue;
   out.push({type:'BASIS',key:'D38|BASIS|'+sd+'|'+n,why:'your '+lab+' line counts '+k.n+' with '+sd.toLowerCase()+' premise '+n+' among them (counted premises '+arr.join(', ')+'), but '+moved.map(z=>z.link).join(', ')+' is now graded '+moved.map(z=>z.grade).join(', ')+' (it was '+G+'), and no line left in your text grounds premise '+n+' as conceded or unexhibited. Recount the line, or regrade the collision.',lines:moved.map(z=>z.raw).concat([k.raw])});}}
 return out;}
/* pkgD38 ASK 2 (W3 3120): a count that came from a cure (the engine recount, CORRECTED COUNT, K-UNX) is fixed; the PREM item may change only the card. */
function d38CountSrc2024(T1,raw,sd,cl){const u=String(cl||'').replace(/[*_`\\]+/g,'').toUpperCase();
 if(/RECOMPUTED AFTER THE CURE/.test(u))return 'the engine recount after the cure';if(/CORRECTED COUNT/.test(u))return 'CORRECTED COUNT';
 if(String(T1||'').split('\n').some(l=>new RegExp('^\\s*(?:[-\u2022]|\\d+[.)])?\\s*CORRECTED COUNT\\s*:\\s*'+sd+'\\b','i').test(l.replace(/[*_`]+/g,''))))return 'CORRECTED COUNT';
 try{if(typeof rctOut==='function'&&rctOut(raw,sd).size)return 'K-UNX';}catch(e){}return null;}
function d38Refuse2024(to,x){try{const c=x&&x.d38c;if(!c)return null;const t=String(to==null?'':to).replace(/\\+/g,'').replace(/[*_`"\u201c\u201d]+/g,'').trim();
 if(typeof sbLabel!=='function'||sbLabel(t)!==c.lab)return null;const m=t.match(/CONCEDED LINKS\s*:\s*(\d+)/i);if(!m||+m[1]<1)return null;
 return 'pkgD38 (W3 3120): the count came from the cure ('+c.src+'), so this item may change only the RULING card; the change raises '+c.lab+' to '+m[1]+(c.lab==='CHALLENGER CONCEDED LINKS'?', an Oracle concede,':'')+' and is refused. The count stays at its cure value.';}catch(e){return null;}}
function gateItems2024(seat,raw,F,its,ctx){const R1=sbApply2024(seat,raw,F,its,ctx.R);if(!R1)return {R1:null,items:[]};const T0=cureJText(raw,true);const T1=R1.text;const items=[];
 for(const x of R1.items){const kind=x.kind;items.push({kind,src:'E-APPLY '+x.sid,sid:x.sid,key:kind+'|'+x.sid,why:x.why,lines:(x.lines&&x.lines.length?x.lines:[]),to:x.to,live:GATE_STATUS[kind]==='LIVE'});}
 for(const x of gateAnsGround2024(T1))items.push({kind:'CONTRADICTION',src:'E-GATE B',key:x.key,why:x.why,lines:x.lines,live:GATE_STATUS['ANSWER GROUND']==='LIVE'});
 const NK=gateNewK2024(T0,T1,F,R1.fields,ctx);for(const x of NK.items)items.push({kind:'RULE '+x.rule,src:'K re-read',key:x.key,why:x.why+(x.rule==='K-G4'?g4GateNote2024(x,ctx):''),lines:x.lines,live:x.live&&GATE_STATUS.RULE==='LIVE'});
 for(const x of d38Items2024(T0,T1,raw))items.push({kind:'CONTRADICTION',src:'E-GATE D38',key:x.key,why:x.why,lines:x.lines,live:D38_STATUS[x.type]==='LIVE',...(x.d38c?{d38c:x.d38c}:{})}); /* pkgD38: last, so earlier gate ids keep their numbers */
 items.forEach((x,i)=>x.gid='G'+(i+1));return {R1,items,T1,newk_error:NK.error||null};}
const GATE_LINE=/GATE\s*:?\s*(?:ITEM\s*)?#?\s*(G\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i;
function gateRead2024(txt){const A={};const J=/^\s*[{\[]/.test(txt);const T2=String(txt||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();{const r=__sbRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='GATE'){const id=r.f.id;if(A[id])continue;
  A[id]={ans:r.f.answer,to:String(r.f.to||'').trim(),why:(J?String(r.f.sentence||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(r.f.sentence||'')).trim(),line:l};continue;}}const m=l.match(GATE_LINE);if(!m)continue;const id=m[1].replace(/\s+/g,'').toUpperCase();if(A[id])continue;
  A[id]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?String(m[4]||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(m[4]||'')).trim(),line:l};}
 return A;}
function gateLineFor2024(item,to){const L=item.lines||[];const t=String(to||'');const lab=sbLabel(t);if(lab){const h=L.find(l=>sbLabel(l)===lab);if(h)return h;}
 const ac=s=>{const f=__acRead(s);if(f&&f.rounds.length)return (String(f.verse).replace(/\s+/g,' ')+'|'+f.rounds[0]).toUpperCase();const m=String(s).replace(/[*_`]+/g,'').trim().match(/^(?:[-•]|\d+[.)])?\s*ANSWER CHECK\s*:\s*(.+?)\s*(?:--|—)\s*\[\s*([CD]R[1-4])\s*\]/i);return m?(m[1].replace(/\s+/g,' ')+'|'+m[2]).toUpperCase():null;};
 const a=ac(t);if(a){const h=L.find(l=>ac(l)===a);if(h)return h;}return L[0]||'';}
function gateG4Cure2024(x,z,to,ctx){const R=(ctx&&ctx.R)||{};const side=String(x.key||'').split('|')[2]||'';const line=String((z&&z.lines&&z.lines[0])||(x.lines&&x.lines[0])||'');
 if(!CURE_PRESS[side])return {cured:false,why:'the corrected text still raises it'};
 if(!g4Unans2024(line))return {cured:false,why:'the corrected text still raises it: its GROUND names no pressed witness left unanswered, so the break rests on meaning, and only a FORCED line cures it (ruling 421)'};
 const T=String(to||'').replace(/\\+"/g,'"');const hits=[];
 for(const seg of T.split(/(?=\[(?:CR|DR)[1-4]\])/)){const rm=seg.match(/^\[((?:CR|DR)[1-4])\]/);if(!rm||!CURE_PRESS[side].includes(rm[1])||typeof R[rm[1]]!=='string')continue;
  for(const m of seg.matchAll(/["\u201c]([^"\u201d]{8,})["\u201d]/g))if(cureFoundAll(m[1],R[rm[1]]))hits.push({round:rm[1],q:m[1],line:seg.trim()});}
 if(!hits.length)return {cured:false,why:'the corrected text still raises it, and the change quotes no pressing sentence found in a round that presses the '+side.toLowerCase()+' (ruling 392)'};
 const rds=[...new Set(hits.map(p=>p.round))].join(', ');const ks=kg4Split(side,line,hits,R);
 if(ks.rests.length&&!ks.open.length)return {cured:false,why:'unanswered-false: the pressing quotation is found in '+rds+', but a later '+side.toLowerCase()+' round names every pressed witness the line rests on: '+kg4Txt(ks.answered)};
 return {cured:true,why:kg4Why(ks,side,'pressed: quotation found in '+rds)};}
function gateForced2024(x,a,ctx){if(!a||x.kind!=='RULE K-G4')return null;const lk=String(x.key||'').split('|')[3]||'';if(!lk)return null;
 const segs=[a.to,a.why].concat(String(a.line||'').split('||')).map(s=>String(s||'').replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim()).filter(s=>ri4IsF2024(s,/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:/i));
 const id=s=>{const __f=ri4F2024(s);if(__f&&/^D\d+\s+vs\.?\s+C\d+$/i.test(__f.pair))return __f.pair.replace(/\s+vs\.?\s+/i,' VS ').toUpperCase();const m=s.match(/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/i);return m?(m[1]+' VS '+m[2]).toUpperCase():null;};
 const sideOf=s=>{const __f=ri4F2024(s);if(__f&&/^(?:CR|DR)[1-4]$/i.test(String(__f.meansRound||'')))return /^CR/i.test(__f.meansRound)?'CHALLENGER':'DEFENDER';const m=s.match(/MEANS\s*\[{0,2}\s*((?:CR|DR)[1-4])/i);return m?(/^CR/i.test(m[1])?'CHALLENGER':'DEFENDER'):null;};const sd=String(String(x.key||'').split('|')[2]||'').toUpperCase();
 const all=[...new Set(segs.filter(s=>id(s)===lk.toUpperCase()))];const mine=all.filter(s=>!sd||sideOf(s)===sd);if(!mine.length){if(all.length)return {cured:false,why:'the FORCED line for '+lk+' breaks the '+String(sideOf(all[0])||'other').toLowerCase()+' link (read from its MEANS round), not the '+sd.toLowerCase()+' link this item grades (pkgKS)',line:all[0]};return null;}const R=(ctx&&ctx.R)||{};
 for(const s of mine){const K=kfLines(s,R).items.filter(z=>z.rule==='K-F');if(!K.length)return {cured:true,why:'forced link: a FORCED line for '+lk+' in the gate reply passes the K-F test, each quotation found in the round it names (ruling 411)',line:s};}
 const K=kfLines(mine[0],R).items.filter(z=>z.rule==='K-F');return {cured:false,why:'the FORCED line for '+lk+' fails the K-F test: '+(K.length?K.map(z=>z.why).join('; '):'not read')+' (ruling 411)',line:mine[0]};}
function gateIsForced2024(s){return KF_LINE.test(String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim());}
function gateStands2024(to,T){if(!to||!T)return false;const f=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim().replace(/^(?:[-\u2022]|\d+[.)])\s*/,'').replace(/^["\u201c]+|["\u201d]+$/g,'').trim();
 const t=f(to);if(!t)return false;return String(T).split('\n').some(l=>f(l)===t);}
function gbcFlip(key,Ta,Tb){const L=String(key||'').split('|')[3];if(!L)return false;const g=T=>{const c=(rcLines(T).col||[]).find(q=>String(q.link||'').toUpperCase().replace(/\s+VS\.?\s+/,' VS ')===L);return c?(c.grade||null):null;};const a=g(Ta),b=g(Tb);return a!=null&&b!=null&&a!==b;}
const DPT_STATUS='TRIAL';
function dptRead(txt){const A={};const T2=String(txt||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const l0 of T2.split('\n')){const l=l0.replace(/[*_`]+/g,'').trim();const m=l.match(/GATE\s*:?\s*(?:ITEM\s*)?#?\s*(G\s*\d+)\s*:?\s*\|\|\s*DIFFERENT\s+POINT\s*:?\s*([\s\S]*)$/i);if(!m)continue;
  const id=m[1].replace(/\s+/g,'').toUpperCase();if(A[id])continue;const q=m[2].match(/press\s+holds\s*:?\s*["\u201c]([^"\u201c\u201d]+)["\u201d][\s\S]*?ground\s+uses\s*:?\s*["\u201c]([^"\u201c\u201d]+)["\u201d]/i);
  A[id]={p:q?q[1]:null,g:q?q[2]:null,line:l};}
 return A;}
function dptCheck(x,d,ctx){const no=w=>({ok:false,why:'DIFFERENT POINT not accepted: '+w});if(!d||!d.p||!d.g)return no('the line does not give the press holds "<words>" and my ground uses "<words>" quotations');
 const L0=String((x.lines||[])[0]||'').replace(/[*_`]+/g,'');const L1=String((x.lines||[])[1]||'').replace(/[*_`]+/g,'');
 const __a=__acRead((x.lines||[])[0]);const __v=(__a&&Array.isArray(__a.rounds)&&__a.rounds.length===1)?String(__a.verse||'').match(/^((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?)\s+(\d+):(\d+)$/):null; /* pkgR1B: shared reader when the line names one round */
 const am=__v?[null,__v[1],__v[2],__v[3],String(__a.rounds[0])]:L0.match(/ANSWER CHECK\s*:\s*((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?)\s+(\d+):(\d+)\s*(?:--|\u2014)\s*\[\s*([CD]R[1-4])\s*\]/i);if(!am)return no('the ANSWER CHECK line was not read');
 const ref=am[1]+' '+am[2]+':'+am[3];const vt=kfcText({book:am[1],ch:+am[2],v1:+am[3],v2:+am[3]},kkjvRows());if(!vt)return no(ref+' was not read this run (Cited Verses), so the spans cannot be checked');
 const f=s=>krulNorm(kkjvNoMargin(s));const V=f(vt).split(' ').filter(Boolean);const P=f(d.p).split(' ').filter(Boolean),G=f(d.g).split(' ').filter(Boolean);
 if(P.length<4||G.length<4)return no('each span must be 4 words or more of '+ref+' (press '+P.length+', ground '+G.length+')');
 const at=S=>{const o=[];for(let i=0;i+S.length<=V.length;i++)if(S.every((w,k)=>V[i+k]===w))o.push([i,i+S.length-1]);return o;};const pa=at(P),ga=at(G);
 if(!pa.length)return no('"'+d.p+'" is not a run of words of '+ref);if(!ga.length)return no('"'+d.g+'" is not a run of words of '+ref);
 const has=(hay,S)=>(' '+f(hay)+' ').includes(' '+S.join(' ')+' ');
 const mm=L0.match(/MEANS\s*:\s*([\s\S]*?)(?:\s(?:--|\u2014)\s*ANSWER\s*:|$)/i);const MEANS=(__v&&typeof __a.means==='string')?__a.means:(mm?mm[1]:''); /* pkgR1B */
 const R=(ctx&&ctx.R)||{};const other=am[4].toUpperCase().startsWith('C')?'DR':'CR';const rk=Object.keys(R).filter(k=>k.toUpperCase().startsWith(other)&&typeof R[k]==='string');
 if(!(has(MEANS,P)||rk.some(k=>has(R[k],P))))return no('"'+d.p+'" stands neither in the ANSWER CHECK\'s MEANS nor in a ['+other+'n] round');
 const cw=s=>new Set(f(s).split(' ').filter(w=>w.length>=4));const mw=cw(MEANS);if(!P.some(w=>w.length>=4&&mw.has(w)))return no('"'+d.p+'" shares no word with the press MEANS, so it is not shown to be what the press holds');
 const at2=L1.toUpperCase().search(/LINK BROKEN/);const tail=at2>=0?L1.slice(at2):L1;const qs=[...tail.matchAll(/["\u201c]([^"\u201c\u201d]{6,})["\u201d]/g)].map(m=>m[1]);
 if(!qs.some(q=>has(q,G)))return no('"'+d.g+'" is not inside a quotation of the collision line');
 if(pa.some(a=>ga.some(b=>a[0]<=b[1]&&b[0]<=a[1])))return no('the two spans overlap in '+ref+', so the press and the ground read the same words');
 const gq=[];for(const q of qs)for(const part of q.split(/\.\.\.|\u2026/)){const W=f(part).split(' ').filter(Boolean);if(W.length>=3)at(W).forEach(r=>gq.push(r));}
 if(pa.some(a=>gq.some(b=>a[0]<=b[1]&&b[0]<=a[1])))return no('"'+d.p+'" overlaps words of '+ref+' that the collision line itself quotes, so the press and the ground read the same words');
 return {ok:true,why:'DIFFERENT POINT accepted (pkgDPT, W3 2832): the press holds "'+d.p+'" and the ground uses "'+d.g+'", two separate runs of '+ref};}
/* pkgGDA (W2, 33627 gemini G6-G9): a gate CHANGE repeating, word for word, the original change S<n> its E-APPLY item came from is cured when S<n> is applied in the same pass */
function gdaDup2024(x,a,its,applied){try{if(!x||!a||a.ans!=='CHANGE'||!a.to||applied.has(x.gid)||!x.sid||!/^E-APPLY\b/.test(String(x.src||''))||!applied.has(x.sid))return null;
 const o=(its||[]).find(z=>z&&z.sid===x.sid);if(!o||!o.to)return null;const N=s=>String(s==null?'':s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/["\u201c\u201d]+/g,'').replace(/\s+/g,' ').trim().replace(/[.\s]+$/,'').toUpperCase();
 if(!N(a.to)||N(a.to)!==N(o.to))return null;return 'the gate change repeats '+x.sid+' word for word, and '+x.sid+' was applied in the same pass, so its line stands as asked (pkgGDA)';}catch(e){return null;}}
function gateCure2024(seat,raw,F,its,G,reply,ctx){const A=gateRead2024(reply||'');const __dpt=dptRead(reply||'');  const add=[];
 for(const x of G){const a=A[x.gid];if(a&&a.ans==='CHANGE'&&a.to&&!(x.kind==='RULE K-G4'&&gateIsForced2024(a.to)))add.push({seat,sid:x.gid,rule:'E-GATE',item:x.kind,line:gateLineFor2024(x,a.to.replace(/^["“]+|["”]+$/g,'')),ans:'CHANGE',to:a.to,why:a.why,...(x.sid?{psrc:x.sid}:{}),...(x.d38c?{d38c:x.d38c}:{})});  }
 for(const x of G){if(x.kind!=='RULE K-G4'||!A[x.gid])continue;const g=gateForced2024(x,A[x.gid],ctx);if(g&&g.cured)add.push({seat,sid:x.gid+'F',rule:'E-GATE',item:'FORCED',line:(x.lines||[])[0]||'',ans:'CHANGE',to:g.line,why:'the FORCED line that cured '+x.gid+', written after its collision line (ruling 411)',forced_add:true});}
 const wd2299=new Set(G.filter(x=>x.kind==='CONTRADICTION'&&/^E-APPLY\b/.test(String(x.src||''))&&A[x.gid]&&A[x.gid].ans==='KEEP').map(x=>x.sid));
 const its2=(its||[]).filter(z=>!(z&&wd2299.has(z.sid))).concat(add);const R2=gateItems2024(seat,raw,F,its2,ctx);const now=new Set((R2.items||[]).map(z=>z.key));const applied=new Set(R2.R1?R2.R1.applied:[]);
 const nL=s=>String(s==null?'':s).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
 const grpOf=g=>{const me=add.find(z=>z.sid===g&&!z.forced_add);if(!me||!me.line)return [g];return add.filter(z=>!z.forced_add&&z.line&&nL(z.line)===nL(me.line)).map(z=>z.sid);};
 const supBy=new Map();const __gsuRep=R2.R1&&Array.isArray(R2.R1.replace)?R2.R1.replace:null;if(__gsuRep){for(const r of __gsuRep)for(const s of r.over){const w0=supBy.get(s);if(!w0||(!applied.has(w0)&&applied.has(r.sid)))supBy.set(s,r.sid);}}else for(const z of add){if(z.forced_add)continue;const g=grpOf(z.sid);const w=g.slice(g.indexOf(z.sid)+1).filter(s=>applied.has(s)).pop();if(w)supBy.set(z.sid,w);}const __gsuKey=t=>{const u=String(t==null?'':t).replace(/\\+/g,'').replace(/[*_`]+/g,'').trim();const m=u.match(/^(?:RESTATED\s*:\s*)?(?:FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*)?(D\d+)\s+vs\.?\s+(C\d+)\b/i);if(m)return 'PAIR '+m[1].toUpperCase()+' VS '+m[2].toUpperCase();const l=sbLabel(u);return l?'LABEL '+l:null;};const __gsuTo=s=>{const z=add.find(q=>q.sid===s&&!q.forced_add);if(z)return z.to;const a0=A[s];return a0&&a0.to?a0.to:null;};const __gsuSame=(g,w)=>{const k1=__gsuKey(A[g]&&A[g].to),k2=__gsuKey(__gsuTo(w));return !!k1&&k1===k2;};const __gsuOther=new Map();
 const kby=new Map();
 {const keysG=new Set(G.map(x=>x.key));const NK=(R2.items||[]).filter(z=>!keysG.has(z.key)&&(z.src==='K re-read'||z.src==='E-GATE B')&&z.live);
  if(NK.length)for(const x of G){const a=A[x.gid];if(!(a&&a.ans==='CHANGE'&&applied.has(x.gid)))continue;const grp=grpOf(x.gid);const R3=gateItems2024(seat,raw,F,its2.filter(z=>!(z&&z.rule==='E-GATE'&&grp.includes(z.sid))),ctx);  const k3=new Set((R3.items||[]).map(z=>z.key));const hit=NK.filter(z=>!k3.has(z.key)&&(z.src!=='E-GATE B'||gbcFlip(z.key,R2.T1,R3.T1)));if(hit.length)kby.set(x.gid,hit);  }}
 const res=G.map(x=>{const a=A[x.gid];let cured=false,why;
  if(!a){why='no GATE line for this item (silence counts)';}
  else if(x.kind==='NOT APPLIED'){const dup=a.ans==='CHANGE'&&!applied.has(x.gid)&&!((R2.R1&&R2.R1.items)||[]).some(z=>z&&z.sid===x.gid)&&gateStands2024(a.to,R2.T1);  const __gw=!dup&&a.ans==='CHANGE'&&!applied.has(x.gid)&&supBy.has(x.gid)&&applied.has(supBy.get(x.gid))?supBy.get(x.gid):null;const sup=!!__gw&&(!__gsuRep||__gsuSame(x.gid,__gw));if(__gw&&!sup)__gsuOther.set(x.gid,__gw); /* pkgGSU */
  const __gda=!(a.ans==='KEEP'||applied.has(x.gid)||dup||sup)?gdaDup2024(x,a,its,applied):null;cured=a.ans==='KEEP'||applied.has(x.gid)||dup||sup||!!__gda;const __rct=!cured&&a.ans==='CHANGE'&&((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rct);  if(__rct){cured=true;}why=__rct?'pkgRCT refused the gate change and the count stays at your cure value (recorded, no seat removed; W3 2819): '+String(__rct.why).slice(0,300):a.ans==='KEEP'?'KEEP: the change stays unapplied':(applied.has(x.gid)?'the gate change was applied':dup?'the gate change is already in the corrected text (another change wrote the same line; W3 2319)':sup?'the later gate change '+supBy.get(x.gid)+' of this judge rewrote the same line (the last change wins) and was applied'+(__gsuRep?' (apply record; pkgGSU)':''):(__gda||'the gate change was not applied'));}
  else if(x.kind==='RULE K-G4'&&gateForced2024(x,a,ctx)){const g=gateForced2024(x,a,ctx);cured=g.cured;why=g.why;}
  else if(a.ans==='KEEP'&&wd2299.has(x.sid)){cured=!now.has(x.key);why=cured?'KEEP: change withdrawn (the refused send-back change '+x.sid+' is dropped, and its contradiction is not in the judge text; W3 2299)':'KEEP: change withdrawn, but the item is still raised';}
  else if(a.ans==='KEEP'){const gch=[...applied].some(z=>/^G\d+$/.test(z));cured=gch&&!now.has(x.key);why=cured?'KEEP, and another gate change of this judge cleared the item':'KEEP does not cure a '+x.kind+' item (2243): a line must change';}
  else if(x.kind==='RULE K-G4'&&applied.has(x.gid)&&now.has(x.key)){const g=gateG4Cure2024(x,(R2.items||[]).find(z=>z.key===x.key),a.to,ctx);cured=g.cured;why=g.why;}
  else if(a.ans==='CHANGE'&&supBy.has(x.gid)&&!applied.has(x.gid)&&applied.has(supBy.get(x.gid))){cured=!now.has(x.key);why=cured?'the later gate change '+supBy.get(x.gid)+' of this judge rewrote the same line (the last change wins), and the item is no longer raised':'the later gate change '+supBy.get(x.gid)+' rewrote the same line, and the item is still raised';}
  else{const st=!applied.has(x.gid)&&a.ans==='CHANGE'&&!((R2.R1&&R2.R1.items)||[]).some(z=>z&&z.sid===x.gid&&/drops the collision/.test(String(z.why||'')))&&gateStands2024(a.to,R2.T1);
   cured=!now.has(x.key)&&(applied.has(x.gid)||st);why=cured?(applied.has(x.gid)?'the gate change was applied and the item is no longer raised':'the gate change is already in the corrected text (another change wrote the same line), and the item is no longer raised (W3 2319)'):(!applied.has(x.gid)?(st?'the gate change is already in the corrected text, but the item is still raised':((((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.d38r)||{why:'the gate change was not applied'}).why)):'the corrected text still raises it');{const __k1=x.kind==='RULE K-G1'&&a.ans==='CHANGE';
   const __rc=__k1&&!cured&&!applied.has(x.gid)&&((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.sid===x.gid&&z.rct);
   if(__rc){cured=true;why='pkgRCT refused the K-G1 gate change on the count line, and the count stays at your cure value (recorded, no seat removed; W3 2819 item 3, pkgKG1L): '+String(__rc.why).slice(0,300);}
   else if(__k1&&cured&&applied.has(x.gid)&&(__c=>{const __h=ri3Head2024(__c);return __h?(__h.side==='CHALLENGER'&&__h.n>=1):/^(?:[-•]|\d+[.)])?\s*CHALLENGER CONCEDED LINKS\s*:\s*[1-9]/i.test(__c);})(String(a.to||'').replace(/\\+/g,'').replace(/[*_\x60"“”]+/g,'').trim()) /* pkgRI3B */)why+=' [pkgKG1L ORACLE CONCEDE: this K-G1 change on the count line sets CHALLENGER CONCEDED LINKS to '+((__h=>__h?String(__h.n):(String(a.to).match(/CONCEDED LINKS\s*:\s*(\d+)/i)||[])[1])(ri3Head2024(String(a.to||'').replace(/\\+/g,'').replace(/[*_\x60"“”]+/g,'').trim())))+'; chain: the collision line "'+String((x.lines||[])[0]||'').slice(0,200)+'" stands BROKEN on a witness left unanswered, and K-G1 requires the count]';}}
  {const __d=__dpt[x.gid];if(__d&&x.src==='E-GATE B'&&x.kind==='CONTRADICTION'){const __r=dptCheck(x,__d,ctx);if(DPT_STATUS==='LIVE'){if(!cured){cured=__r.ok;why=__r.why;}}else why=String(why||'')+' [pkgDPT TRIAL, record-only: '+(__r.ok?'would cure: ':'would not cure: ')+__r.why+']';}}
  if(cured&&kby.has(x.gid)){cured=false;why='the gate change raised a new LIVE item: '+kby.get(x.gid).map(z=>z.kind+' -- '+String(z.why||'').slice(0,240)).join('; ')+' (W3 2341: a change that raises a new LIVE K item does not cure; counted once, here)';}
  return {gid:x.gid,kind:x.kind,src:x.src,live:x.live,ans:a?a.ans:'NO ANSWER',to:a?a.to:'',reason:a?a.why:'',line:a?a.line:null,cured,why};});
 if(__gsuOther.size)for(const r of res){const w=__gsuOther.get(r.gid);if(!w)continue;const rw=res.find(q=>q.gid===w);r.cured=rw?!!rw.cured:false;r.why='the later gate change '+w+' of this judge rewrote the same line (the last change wins; apply record) but its line is for another pair or label, so this item takes '+w+(rw?'\'s cure status: '+(rw.cured?'CURED':'UNCURED'):', which is not a gate item: UNCURED')+' (pkgGSU, W3 2996)';}
 const keys0=new Set(G.map(x=>x.key));const fresh=(R2.items||[]).filter(z=>!keys0.has(z.key)).map(z=>({kind:z.kind,src:z.src,why:z.why,by:[...kby].filter(([g,l])=>l.some(y=>y.key===z.key)).map(([g])=>g).join(', ')||null}));
 return {res,its2,add,fresh,uncured:res.filter(r=>!r.cured&&r.live).length,R2};}
function cpdSync(j,pre,seat){let ob;try{ob=JSON.parse(j);}catch(e){return {j,mark:''};}const T=typeof ob.reasoning==='string'?ob.reasoning:'';let jj=j;const mk=[];
 const lineOf=sd=>{for(const l of T.split('\n')){const u=String(l).replace(/[*_`]+/g,'').replace(/^\s*(?:[-\u2022]\s*|\d+[.)]\s*)?/,'');if(/^\[/.test(u))continue;
   {const rr=ri3Count2024(u,sd);if(rr===null?(sd==='CHALLENGER'?/^CHALLENGER\s+CONCEDED LINKS\s*:/i.test(u):/^(?:DEFENDER\s+)?CONCEDED LINKS\s*:/i.test(u)):rr)return u.trim();}}return null;};
 for(const [sd,key,ck] of [['DEFENDER','counted_premises_defender','conceded_links'],['CHALLENGER','counted_premises_challenger','challenger_conceded_links']]){
  const cur=ob[key],n=ob[ck];if(!Array.isArray(cur)||!Number.isInteger(n)||!pre||pre[ck]==null||pre[ck]===n||cur.length===n)continue;
  const L=lineOf(sd);let set=null,why='';if(n===0)set=[];else if(!L)why='no '+sd+' count line in the text';else{const g=psGrades(L);if(!g||g.n!==n)why='the count line does not give the count '+n;else{const c=Object.keys(g.g).map(Number).filter(k=>g.g[k]==='COUNTED').sort((a,b)=>a-b);if(c.length===n)set=c;else why='the count line names '+c.length+' counted premise(s) ('+(c.join(', ')||'none')+') for a count of '+n;}}
  const was='['+cur.join(',')+']';const from=cureSafe(String(L||'').slice(0,240)).replace(/;\s*END\]/g,', END');
  if(set){const rx=new RegExp('("'+key+'"\\s*:\\s*)\\[[^\\]]*\\]');if(!rx.test(jj))continue;jj=jj.replace(rx,(_,h)=>h+'['+set.join(',')+']');
   mk.push('\n[AUDIT v50: COUNTED PREMISES DERIVED (pkgCPD) -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+sd+'; COUNT: '+pre[ck]+' to '+n+'; WAS: '+was+'; NOW: ['+set.join(',')+']; FROM: '+(n===0?'the count 0':from)+'; record-only, it removes no seat ; END]');}
  else mk.push('\n[AUDIT v50: COUNTED PREMISES NOT DERIVED (pkgCPD) -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+sd+'; COUNT: '+pre[ck]+' to '+n+'; ARRAY: '+was+' (kept); WHY: '+cureSafe(why)+'; LINE: '+from+'; record-only, it removes no seat. REVIEW THIS ROW. ; END]');}
 return {j:jj,mark:mk.join('')};}
function crwRep(h,o,n,enc){const st=k=>k===0||(enc?(h.slice(k-2,k)==='\\n'||h[k-1]==='"'):h[k-1]==='\n');const en=k=>k>=h.length||(enc?(h.slice(k,k+2)==='\\n'||h[k]==='"'):h[k]==='\n');let fb=-1;if(!o)return null;for(let k=h.indexOf(o);k>=0;k=h.indexOf(o,k+1)){if(!st(k))continue;if(en(k+o.length))return h.slice(0,k)+n+h.slice(k+o.length);if(fb<0)fb=k;}return fb<0?null:h.slice(0,fb)+n+h.slice(fb+o.length);}
function cureRewrite(raw,panel,R,seat,F0){let s=String(raw||'');const enc=x=>JSON.stringify(String(x)).slice(1,-1);
 if(panel){const a=s.indexOf('{');const b=a<0?-1:rcObjEnd(s,a);if(b>0){let j=s.slice(a,b);let miss=false;const __cpdPre={conceded_links:(j.match(/"conceded_links"\s*:\s*(\d+)/)||[])[1],challenger_conceded_links:(j.match(/"challenger_conceded_links"\s*:\s*(\d+)/)||[])[1]};for(const k in __cpdPre)__cpdPre[k]=__cpdPre[k]==null?null:+__cpdPre[k];
   for(const [o0,n0] of R.rp){const e=enc(o0);const __r=crwRep(j,e,enc(n0),true);if(__r!=null)j=__r;else miss=true;}
   if(miss){try{const ob=JSON.parse(j);let t=typeof ob.reasoning==='string'?ob.reasoning:'';for(const [o0,n0] of R.rp){const __r=crwRep(t,o0,n0,false);if(__r!=null)t=__r;}ob.reasoning=t;j=JSON.stringify(ob,null,2);}catch(e){}}
   const F=R.fields;j=j.replace(/("verdict_tag"\s*:\s*")[A-Z]+(")/,'$1'+F.verdict_tag+'$2').replace(/("defense_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.defense_standing+'$2').replace(/("challenge_standing"\s*:\s*")[A-Z-]+(")/,'$1'+F.challenge_standing+'$2')
    .replace(/("conceded_links"\s*:\s*)\d+/,'$1'+F.conceded_links).replace(/("challenger_conceded_links"\s*:\s*)\d+/,'$1'+F.challenger_conceded_links);
   if(R.cpAdd)for(const [sd,key] of [['DEFENDER','counted_premises_defender'],['CHALLENGER','counted_premises_challenger']]){const add=R.cpAdd[sd]||[];if(!add.length)continue;
    const rx=new RegExp('("'+key+'"\\s*:\\s*)\\[([^\\]]*)\\]');const m=j.match(rx);if(!m)continue;const cur=(m[2].match(/\d+/g)||[]).map(Number);const nu=[...new Set(cur.concat(add))].sort((a,b)=>a-b);if(nu.length!==cur.length)j=j.replace(rx,(_,h)=>h+'['+nu.join(',')+']');}
   let __cpd='';try{const __c=cpdSync(j,__cpdPre,seat);j=__c.j;__cpd=__c.mark;}catch(e){__cpd='\n[AUDIT v50: COUNTED PREMISES -- the derive failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';}
   const cr=(F0&&F0.verdict_tag&&F0.verdict_tag!==F.verdict_tag)?'\n[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+F0.verdict_tag+'; COUNTED: '+F.verdict_tag+' ('+R.tag+'); RETRACTED: '+R.retracted.join(', ')+']':'';
   s=s.slice(0,a)+j+cr+__cpd+s.slice(b);}}
 else{const i=s.indexOf('\n\n[AUDIT');let t=i<0?s:s.slice(0,i);const rest=i<0?'':s.slice(i);for(const [o0,n0] of R.rp){const __r=crwRep(t,o0,n0,false);if(__r!=null)t=__r;}s=t+rest;}
 const lab=l=>{const u=rcOne(l).replace(/[*_`]+/g,'').replace(/^(?:[-•]|\d+[.)])?\s*/,'').toUpperCase();const m=u.match(/^(D\d+\s+VS\.?\s+C\d+|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|RESULT|CLAUSE|KEYSTONE)\b/);return m?m[1].replace(/\s+VS\.?\s+/,' VS '):'LINE';};
 const sup=(R.rp||[]).map(([o0,n0])=>'\n[AUDIT v27: SUPERSEDED LINE -- '+(seat?'SEAT: '+seat+'; ':'')+'LABEL: '+lab(n0)+'; ORIGINAL: '+cureSafe(rcOne(o0)).replace(/;\s*END\]/g,', END')+' ; END]').join('');
 let rk='';try{const H=rechk2024(R.rp,rechkRounds2024(seat));rk=H.map(h=>'\n[AUDIT v39: K-RECHK -- '+(seat?'SEAT: '+seat+'; ':'')+'CHANGE: '+String(h.id||'change').replace(/;/g,',')+'; RULE: '+h.rule+'; '+(h.old===null?'NOT CHECKED':(h.old?'ALREADY IN THE ORIGINAL':'NEW'))+': '+h.why+'; LINE: '+cureSafe(h.line).slice(0,300)+'; ORIGINAL: '+cureSafe(h.orig).slice(0,300)+'; TRIAL rule, record-only ; END]').join('');}catch(e){rk='\n[AUDIT v39: K-RECHK -- the re-check failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';}
 return s+'\n'+R.audit+sup+rk;}
function cureCut(s){s=String(s);if(s.length<=600)return s;const k=s.lastIndexOf(' ',597);return s.slice(0,k>0?k:597).replace(/\s+$/,'')+'...';}
function enfPrompt(body){try{if(body&&Array.isArray(body.messages)){const u=body.messages.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].content:null;return typeof c==='string'?c:JSON.stringify(c);}
 if(body&&Array.isArray(body.contents)){const u=body.contents.filter(m=>m&&m.role==='user');const c=u.length?u[u.length-1].parts:null;return Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):null;}}catch(e){}return null;}
function prdTok(f,t){if(typeof t!=='string'||t.length<2000)return t;let h=0x811c9dc5;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return '[[PRD:'+f+':'+t.length+':'+h.toString(16)+']]';}
function enfRows(meta,v,reply,body){const T=new Date().toISOString();const ps=enfPrompt(body);const full=reply&&reply.ok?String(reply.text==null?'':reply.text):null;
 return (v||[]).map((x,__k)=>({run_token:meta.run_token||null,seat:meta.seat||null,seat_role:meta.role||null,judge_model:meta.model||null,kind:'cure',rule:x.rule,item:x.rule==='K-G3'?x.side+' STANDING':(x.link||null),
  flagged_line:x.line||null,prompt_sent:__k?prdTok('prompt_sent',ps):ps,full_reply:__k?prdTok('full_reply',full):full,reply_error:reply&&!reply.ok?String(reply.why||'no reply'):(reply?null:'no reply'),response_line:x.response||null,cure_status:x.status,cure_reason:enfTrialWhy(x,x.why)||null,at:T}));}
function cureReport(seat,v){return v.map(x=>'[AUDIT v21: DEBATE RULE VIOLATION REPORT -- '+(seat?'SEAT: '+seat+'; ':'')+'ITEM: '+(x.rule==='K-G3'?x.side+' STANDING':x.link)+'; RULE: '+x.rule+'; RESULT: '+x.status+(x.rule==='K-C'&&x.status!=='CURED'?'; NOT COUNTED (K-C UNCURED)':'')
 +(x.kinds&&x.kinds.length?'; KINDS: '+x.kinds.join(', '):'')+((x.why||!enfLive(x))?'; WHY: '+cureSafe(enfTrialWhy(x,x.why)):'')+(x.line?'; LINE: '+cureSafe((l=>l.length>300?l.slice(0,297)+'...':l)(String(x.line).replace(/\s+/g,' ').trim())):'')
 +(x.statement?'; STATEMENT: '+cureSafe(cureCut(x.statement)):'')+'; JUDGE STATEMENT: '+(x.judge_statement?cureSafe(cureCut(x.judge_statement)):'none written')+']');}
function cureProse(seat,reply){const p=reply&&reply.ok?cureLines(reply.text).prose.join(' ').replace(/\s+/g,' ').trim():'';
 return p?['[AUDIT v21: DEBATE RULE VIOLATION REPLY -- '+(seat?seat+' ':'')+'prose recorded, not read for a cure: '+cureSafe(p.slice(0,600))+']']:[];}
const __AGR_TXT=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';
function __agrTail(msgs){if(!Array.isArray(msgs))return '';let acc=null;
 for(let i=0;i+1<msgs.length;i++){const m=msgs[i],r=msgs[i+1];if(!m||!r)continue;const ut=m.role==='user'?__AGR_TXT(m.content!==undefined?m.content:m.parts):'';
  if(/^POSTURE (FOR ACCEPTANCE|RETURNED)/.test(ut)&&(r.role==='assistant'||r.role==='model'))acc=__AGR_TXT(r.content!==undefined?r.content:r.parts);}
 if(!acc||!acc.trim())return '';
 return '\n\nTHE AGREEMENT YOU ACCEPTED, shown back before this decision. Your own words when you accepted the posture:\n'+acc.trim().split('\n').map(l=>'> '+l).join('\n')
  +'\nEach contested grade you write (BROKEN, FORCED, MISSES, VOID, UNPROVEN) names the commitment it applies, as "(Commitment N)".\nThe reply form given above is unchanged; answer in it.';}
const PASS=$input.first().json;
const skip=(why,rep)=>[{json:{gate_skip:true,gate_why:why,gate_report:rep||[]}}];
if(!Array.isArray(PASS.sb_items)||!PASS.sb_items.length)return skip('no send-back answer was recorded');
const PB0=(()=>{try{return $('Panel Build').first().json;}catch(e){return null;}})();
const BODIES=Array.isArray(PASS.bodies)?PASS.bodies:(()=>{try{return $('Panel Cure Check').first().json.bodies||[];}catch(e){return [];}})();
let SBB=[],SBC=[];try{SBB=$('Send Back Build').all().map(x=>x.json);}catch(e){SBB=[];}try{if($('Send Back Call openrouter').isExecuted)SBC=$('Send Back Call openrouter').all().map(x=>x.json);}catch(e){SBC=[];}
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const out=[];const report=[];
BODIES.forEach((s,i)=>{let b;try{b=JSON.parse(s);}catch(e){return;}const p=b.payload||{};const seat=p.judge_seat;const its=PASS.sb_items.filter(x=>x.seat===seat);if(!its.length)return;
 const F={verdict_tag:p.verdict_tag,defense_standing:p.defense_standing,conceded_links:p.conceded_links,challenge_standing:p.challenge_standing,challenger_conceded_links:p.challenger_conceded_links};
 const j=PB0&&(PB0.judges||[]).find(q=>q.seat===seat);const PT=j?gatePromptText2024(j.body):'';const ctx={R:PT?ciRounds(PT):null,DL:PT?drvLinks(PT):[],ask:PT.includes('CITATION CHECK')};
 let G;try{G=gateItems2024(seat,p.verdict_raw,F,its,ctx);}catch(e){report.push({seat,error:String(e&&e.message||e).slice(0,300)});return;}
 const rp={seat,items:G.items.map(x=>({gid:x.gid,kind:x.kind,src:x.src,live:x.live,why:x.why})),newk_error:G.newk_error,rounds_read:!!ctx.R};report.push(rp);
 if(!G.items.length)return;
 const k=SBB.findIndex(x=>x&&x.seat===seat);const sb=k>=0?SBB[k]:null;const rj=k>=0?SBC[k]:null;
 const sbTxt=rj&&rj.choices&&rj.choices[0]&&rj.choices[0].message&&typeof rj.choices[0].message.content==='string'?rj.choices[0].message.content:null;
 if(!sb||!sb.body||!Array.isArray(sb.body.messages)||sbTxt==null){rp.not_sent='the send-back conversation could not be read; the items are recorded only';return;}
 const msg='The engine applied your send-back answers to your judgment and read the corrected judgment again. It cannot accept the items below as they stand. You keep the decision, under the same rules. For each item, CHANGE one of its lines or KEEP, and give one sentence that quotes the debate\'s own words that decide it. Bring nothing from outside the record.\n'
  +'A KEEP answers a NOT APPLIED item: that change then stays unapplied. A KEEP also answers a CONTRADICTION item whose source is E-APPLY (a contradiction your own refused send-back change would make): that change is then withdrawn and your line stays as it was. A RULE K-G4 item on a link you keep graded LINK BROKEN because the link cannot take the witness\'s meaning (a meaning break, ruling 421) is cured by one FORCED line for that link, written as the reason of its GATE line, after KEEP or after your CHANGE TO: FORCED: D<i> vs C<j> -- MEANS [<round>]: "<the MEANS sentence>" -- ANSWER [<round>]: "<the holding side\'s answer>" -- FAILS: "<the layer of that answer that fails>", each quotation word for word in the round it names (ruling 411). Every other item is answered only by a CHANGE TO one of its lines, written in full in your judgment\'s own line form; the engine applies it with your send-back answers and reads the judgment again. An item that is not answered, is kept, or is still raised after your change counts as a debate rule violation not cured.\n\n'
  +G.items.map(x=>'ITEM '+x.gid+' ('+x.kind+'; '+x.src+'):\nTHE ENGINE: '+cut(x.why,900)+(x.lines&&x.lines.length?x.lines.map(l=>'\nLINE: '+cut(l,1500)).join(''):'')+(x.to?'\nYOUR SEND-BACK ANSWER: CHANGE TO: '+cut(x.to,1500):'')).join('\n\n')
  +(G.items.some(x=>x.src==='E-GATE B')?'\n\nAn E-GATE B item (ANSWER GROUND) may instead be answered DIFFERENT POINT, when the press and your ground use different words of the verse: give the words of the verse the press holds and the words of the verse your ground uses. It is cured only when each is 4 words or more of that verse in the 1611 KJV, word for word, the first stands in the press (its MEANS or its round\'s quotation of the verse) and shares a word with the press MEANS, the second stands in a quotation of your collision line, and the first overlaps neither the second nor any words of that verse your collision line quotes. If they overlap, the press and your ground read the same words: CHANGE one of the two lines.':'')
  +'\n\nThis reply is not a judgment and is not JSON: write plain lines only.\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\nGATE: <item id> || KEEP || <one sentence quoting the words that decide it>\nGATE: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>'+(G.items.some(x=>x.src==='E-GATE B')?'\nGATE: <item id> || DIFFERENT POINT: the press holds "<words of the verse>"; my ground uses "<other words of the verse>" || <one sentence>':'');
 const body={...sb.body,messages:[...sb.body.messages,{role:'assistant',content:sbTxt},{role:'user',content:msg+__agrTail(sb.body.messages)}]};
 out.push({json:{gate_skip:false,seat,idx:i,api_model:sb.api_model||null,run_token:sb.run_token||null,F,items:G.items,msg,body}});});
if(!out.length)return skip('no seat has a gate item',report);
out[0].json.gate_report=report;return out;