const __L={"R2 Alternate Build":()=>$('R2 Alternate Build'),"R2 Alternate Call openrouter":()=>$('R2 Alternate Call openrouter'),"Build Save Body":()=>$('Build Save Body'),"Cited Verses":()=>$('Cited Verses'),"Final Output":()=>$('Final Output'),"Init Seats":()=>$('Init Seats'),"Panel Build":()=>$('Panel Build'),"Panel Check":()=>$('Panel Check'),"Panel Judge 1 deepseek":()=>$('Panel Judge 1 deepseek'),"Panel Judge 1 gemini":()=>$('Panel Judge 1 gemini'),"Panel Judge 1 grok":()=>$('Panel Judge 1 grok'),"Panel Judge 1 mimo":()=>$('Panel Judge 1 mimo'),"Panel Judge 1 openai":()=>$('Panel Judge 1 openai'),"Panel Judge 1 openrouter":()=>$('Panel Judge 1 openrouter'),"Panel Judge 2 gemini":()=>$('Panel Judge 2 gemini'),"Panel Judge 2 grok":()=>$('Panel Judge 2 grok'),"Panel Judge 2 mimo":()=>$('Panel Judge 2 mimo'),"Panel Judge 2 openai":()=>$('Panel Judge 2 openai'),"Panel Judge 2 openrouter":()=>$('Panel Judge 2 openrouter'),"Panel Judge 3 gemini":()=>$('Panel Judge 3 gemini'),"Panel Judge 3 grok":()=>$('Panel Judge 3 grok'),"Panel Judge 3 mimo":()=>$('Panel Judge 3 mimo'),"Panel Judge 3 openai":()=>$('Panel Judge 3 openai'),"Panel Judge 3 openrouter":()=>$('Panel Judge 3 openrouter'),"Panel Reserve deepseek":()=>$('Panel Reserve deepseek'),"Panel Reserve gemini":()=>$('Panel Reserve gemini'),"Panel Reserve grok":()=>$('Panel Reserve grok'),"Panel Reserve mimo":()=>$('Panel Reserve mimo'),"Panel Reserve openai":()=>$('Panel Reserve openai'),"Panel Reserve openrouter":()=>$('Panel Reserve openrouter'),"Quote Report":()=>$('Quote Report'),"Regrade Load":()=>$('Regrade Load'),"Regrade Row":()=>$('Regrade Row')};
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
/* pkgRI5 (reader item 5): a line's label from the reader (null: no form, a RESTATED line, or a form with no label here); the old regex decides on null */
function ri5Lab2024(l,res){let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}if(!r||!r.form||!r.f||r.f.restated)return null;const f=r.f;
 if(r.form==='COLLISION'&&f.pair)return f.pair.replace(/\s+vs\.?\s+/i,' VS ').toUpperCase();if(r.form==='KEYSTONE')return 'KEYSTONE';if(r.form==='CLAUSE')return 'CLAUSE';
 if(r.form==='CONCEDED'&&f.side)return f.side==='CHALLENGER'?'CHALLENGER CONCEDED LINKS':'CONCEDED LINKS';if(r.form==='STANDING'&&f.side)return f.side+' STANDING';if(res&&r.form==='RESULT')return 'RESULT';return null;}
function ri5Restated2024(l){let r=null;try{r=__RL.readLine(String(l==null?'':l));}catch(e){r=null;}return r&&r.form==='COLLISION'&&r.f&&r.f.restated&&/^D\d+\s+vs\.?\s+C\d+$/i.test(String(r.f.pair||''))?r.f.pair.match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i):null;}
function ri5Rd2024(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form&&r.f&&!r.f.restated?r:null;}catch(e){return null;}}
/* pkgRI5 part C (reader item 5): one reader field of a line, or null when the reader reads no such form (then the old regex decides) */
function ri5Fd2024(l,form,k){const r=ri5Rd2024(l);return r&&r.form===form&&r.f[k]!=null?r.f[k]:null;}
/* pkgRI6 (reader item 6, KEYSTONE): reader-first reads; each returns the old regex's match shape, or the old regex's result when the reader reads no such form */
function ri6Kk2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='KEYSTONE'&&r.f.link&&['STANDS','BROKEN','WITHDRAWN'].includes(r.f.grade))return [l,String(r.f.link).replace(/^D/i,''),r.f.grade,r.f.reason||''];return String(l==null?'':l).match(re);}
function ri6Col2024(l,re,grades){const r=ri5Rd2024(l);if(r&&r.form==='COLLISION'&&r.f.pair&&grades.includes(r.f.grade)){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return [l,p[1],p[2],r.f.grade];}return String(l==null?'':l).match(re);}
function ri6Rs2024(l,re){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='COLLISION'&&r.f&&r.f.restated&&r.f.pair){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return p;}}catch(e){}return String(l==null?'':l).match(re);}
function __kfM(s){const l=String(s==null?'':s);const r=__RL.readLine(l);if(!r||r.form!=='FORCED'||!r.f||!r.f.pair||r.f.restated)return null;const f=r.f;const m=[l,f.pair,f.meansRound,f.means,f.answerRound,f.answer,f.fails];m.index=0;m.input=l;return m;}
const KF_LINE={test:s=>!!__kfM(s),[Symbol.match]:s=>__kfM(s),toString:()=>'KF_LINE (readLines FORCED)'};
const KF_GROUND=/\bforced\b|\bcannot\s+take\b|\bcan(?:no|')t\s+(?:take|fit|bear)\b|\bdoes\s+not\s+fit\b|\bruling\s+396\b|\b396\b/i;
const __kfLB=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/(^|\n)[ \t]*(?:[-*\u2022>]|\d+[.)])[ \t]+/g,'$1');
const __kfIN=s=>__kfLB(s).replace(/(^|\s)\d{1,2}[.)](?=\s|$)/g,'$1');
const kfFound=(q,t)=>ciFound(__kfLB(q),__kfLB(t))||ciFound(__kfIN(q),__kfIN(t));
function knlNone2024(l){const s=String(l==null?'':l).replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]|\d+[.)])\s*/,'');const m=s.match(/^FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(.*)$/i);if(!m)return false;const r=m[1].trim(); /* pkgKNL */
 return /^(?:none|nil|n\/a|no|nothing|zero|0)\b/i.test(r)&&!/\b[DC]\d+\b|\bLINK\s*\d+|\[[CD]R\d\]|\b(?:except|but)\b/i.test(r)&&!/["“”‘]/.test(r);} /* rev 2 (W1 3561-3563): a none line that names a link or round, quotes, or says except or but is checked as before */
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
function unxSegs(sec){const s=String(sec||'');const H=[];
 for(const h of s.matchAll(/\bPremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi))H.push({i:h.index,ns:h[1].match(/\d+/g).map(Number)});
 for(const h of s.matchAll(/(?:^|--|;|:|\.)\s*(\d)(?=\s+(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\b)/g)){const i=h.index+h[0].length-1;if(!H.some(x=>x.i<=i&&i<x.i+12))H.push({i,ns:[+h[1]]});}
 for(const h of s.matchAll(/\bSpared\b/g))H.push({i:h.index,ns:[]});
 H.sort((a,b)=>a.i-b.i);return H.map((h,k)=>({ns:h.ns,seg:s.slice(h.i,k+1<H.length?H[k+1].i:s.length)})).filter(x=>x.ns.length);}
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
function unxLack(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));const named=[];
 for(const m of t.matchAll(/\[?\bL([1-4])\b\]?/g)){const pre=t.slice(Math.max(0,m.index-40),m.index).split(/[.;]/).pop();const post=t.slice(m.index+m[0].length,m.index+m[0].length+60).split(/[.;]/)[0];
  if(/\b(?:no|not|nothing|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\b[^\[]*$/i.test(pre)||/^\s*(?:layer\s+)?(?:(?:is|are)\s+)?(?:missing|absent|lacking|not\s+(?:exhibited|shown|given|present|there))\b/i.test(post)||/^[^\[]{0,30}?\b(?:does|do|did|is|are)\s+not\b|^[^\[]{0,30}?\bfails?\b/i.test(post))named.push(m[1]);}
 return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
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
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const P=$('Panel Build').first().json;const S=$('Init Seats').first().json;
const SUB=$('Panel Check').first().json.sub||null;const RESERVE_NODES=['Panel Reserve deepseek','Panel Reserve openai','Panel Reserve gemini','Panel Reserve grok','Panel Reserve mimo','Panel Reserve openrouter'];
const TAGS=['HELD','PARTIAL','BROKEN'];const STAND=['SELF-SUPPORTED','PROP-DEPENDENT','COLLAPSED'];
const SLOT_NODES=[['Panel Judge 1 deepseek','Panel Judge 1 openai','Panel Judge 1 gemini','Panel Judge 1 grok','Panel Judge 1 mimo','Panel Judge 1 openrouter'],['Panel Judge 2 openai','Panel Judge 2 gemini','Panel Judge 2 grok','Panel Judge 2 mimo','Panel Judge 2 openrouter'],['Panel Judge 3 openai','Panel Judge 3 gemini','Panel Judge 3 grok','Panel Judge 3 mimo','Panel Judge 3 openrouter']];
const ran=names=>names.filter(n=>{try{return __L[n]().isExecuted;}catch(e){return false;}});
function envelope(seat,j){
 if(j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content===null)throw new Error('seat "'+seat+'" returned content null (finish_reason '+(j.choices[0].finish_reason||'none')+'). NO ROW IS WRITTEN.'+RT);
 if(j&&j.choices&&j.choices[0]&&j.choices[0].message&&typeof j.choices[0].message.content==='string')return {text:j.choices[0].message.content,finish:j.choices[0].finish_reason||null};
 if(j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&Array.isArray(j.candidates[0].content.parts)){const t=j.candidates[0].content.parts.filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join('');if(t)return {text:t,finish:j.candidates[0].finishReason||null};}
 throw new Error('FAIL-CLOSED: seat "'+seat+'" returned an envelope this parser does not recognise. Top-level keys: ['+Object.keys(j||{}).join(',')+']. NO ROW IS WRITTEN.'+RT);}
function repairReasoning(x){const m=/"reasoning"\s*:\s*"/.exec(x);if(!m)return null;const vs=m.index+m[0].length;
 const ve=x.lastIndexOf('"');if(ve<vs||!/^"\s*}\s*$/.test(x.slice(ve)))return null;let out='',bs=0;
 for(let i=vs;i<ve;i++){const c=x[i];if(c==='\\'){bs++;out+=c;continue;}if(c==='"'&&bs%2===0)out+='\\"';else out+=c;bs=0;}
 return x.slice(0,vs)+out+x.slice(ve);}
function verdict(seat,text){let s=String(text).trim();s=s.replace(/^```[a-zA-Z]*\s*/,'').replace(/```\s*$/,'').trim();if(s[0]==='{'&&!/\}\s*$/.test(s)&&/"\s*$/.test(s))s=s+'}';  const a=s.indexOf('{');const b=s.lastIndexOf('}');
 if(a===-1||b===-1||b<=a)throw new Error('FAIL-CLOSED: seat "'+seat+'" returned no JSON object. First 200 chars: '+s.slice(0,200)+RT);
 const x=s.slice(a,b+1);try{return JSON.parse(x);}catch(e){const r=repairReasoning(x);if(r!==null){try{return JSON.parse(r);}catch(e2){}}throw new Error('FAIL-CLOSED: seat "'+seat+'" JSON did not parse: '+e.message+RT);}}
function intOrFail(seat,f,v){const n=Number(v);if(!Number.isInteger(n)||n<0)throw new Error('FAIL-CLOSED: seat "'+seat+'" field '+f+' is not an integer >= 0. Got: '+JSON.stringify(v)+RT);return n;}
let RGL=null;try{if($('Regrade Load').isExecuted)RGL=$('Regrade Load').first().json;}catch(e){RGL=null;}const F=RGL?RGL.f:$('Final Output').first().json;
function k2Marks(text){if(typeof text!=='string'||!F)return [];
 const D='[\\s‐-―−-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';const DM=(s)=>String(s||'').replace(/[‐-―−]/g,'-');
 const upper=text.toUpperCase().replace(/[*_`]+/g,'');const upperD=upper.replace(/CHALLENGER\s+CONCEDED\s+LINKS/g,'XCHALLENGERCONCEDEDLINKSX');
 const clauseLineM=upper.match(new RegExp('(^|\\n)([ \\t]*CLAUSE'+SEP+'(?:BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|HELD-1)[^\\n]*)'));
 const nwk=clauseLineM?clauseLineM[2].match(/N\s*=\s*([0-9]+)\s+W\s*=\s*([0-9]+)\s+K\s*=\s*([0-9]+)/):null;const n=nwk?parseInt(nwk[1],10):null;
 const colSec=(()=>{const L=upper.split('\n');const i=L.findIndex(x=>/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS\b/.test(x));if(i<0)return null;const out=[];const f=L[i].replace(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?COLLISION POINTS[ \t]*:?/,'');if(f.trim())out.push(f);for(let j=i+1;j<L.length;j++){const x=L[j];if(/^[ \t]*(?:#+[ \t]*|[-•][ \t]*)?(CITATION CHECK|OUT-OF-ROUND CONCESSIONS|CHALLENGER CHAIN MARK|KEYSTONE|CLAUSE|RESULT|DEFENSE STANDING|CHALLENGE STANDING|CONCEDED LINKS|CHALLENGER CONCEDED LINKS|LINK AUDIT)\b/.test(x))break;if(/^[ \t]*\[(EXTRACTOR|REVIEW|TRUNCATED|AUDIT)/.test(x))break;out.push(x);}return out;})();
 const colMap={};if(colSec){for(const x0 of colSec){const x=x0.trim();if(!x)continue;const m=x.match(/^(?:[-•]|\d+[.)])?\s*D(\d+)\b\s*:?\s*(?:D\1\b\s*)?(.*)$/);if(!m)continue;const rest=m[2];let st=null;if(/^VS\.?\s/.test(rest)){const g=rest.match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)/);st=g?g[1]:null;}else{const g=rest.match(/^(WITHDRAWN|STANDS)\b/);st=g?g[1]:null;}if(!st)continue;(colMap[+m[1]]=colMap[+m[1]]||[]).push(st);}}
 const colState=(i)=>{const a=colMap[i];if(!a)return null;const w=a.includes('WITHDRAWN'),b=a.includes('DEFENDER LINK BROKEN');return (w&&b)?'CONFLICT':w?'WITHDRAWN':b?'BROKEN':'STANDS';};
 const KSM=upper.match(new RegExp('(^|\\n)[ \\t]*KEYSTONE'+SEP+'D([0-9]+)'+SEP+'(WITHDRAWN|BROKEN|STANDS)(?![A-Z0-9])(?![ \\t]*(?:\\||/|OR[ \\t]))'));
 const keystone_link=KSM?parseInt(KSM[2],10):null,keystone_state=KSM?KSM[3]:null;
 const chain_count=(()=>{const t=F.cr1;if(typeof t!=='string')return null;const L=DM(t).split('\n');let hi=-1;for(let i=0;i<L.length;i++){if(/^\s*#*\s*\**\s*DECLARED CHAIN\s*:?\s*\**\s*(?:-{1,3}[^\n]*)?:?\s*$/i.test(L[i]))hi=i;}if(hi<0)return null;let c=0;for(let i=hi+1;i<L.length;i++){const m=L[i].match(/^(?:#+\s*)?\**D?([0-9]+)(?:\.|\s+-{1,3}(?:\s|$))/i);if(!m)continue;if(parseInt(m[1],10)===c+1)c++;else break;}return c;})();
 const gL=DM(F.gr2).split('\n');let gh=-1;for(let i=0;i<gL.length;i++){if(/^\s*#*\s*\**\s*UNSUPPORTED-L4 PREMISES\s*:?\s*\**\s*:?\s*$/i.test(gL[i]))gh=i;}
 const labs=[];if(gh>=0){let c=0;for(let i=gh+1;i<gL.length;i++){const m=gL[i].match(/^(?:#+\s*)?\**([0-9]+)\./);if(!m)continue;if(parseInt(m[1],10)!==c+1)break;c++;const lm=gL[i].replace(/[*_`]+/g,'').match(/^(?:#+\s*)?[0-9]+\.\s*LINK\s*([0-9]+|NONE)\b/i);labs.push(lm?lm[1].toUpperCase():null);}}
 const ent=[];const seen=new Set();
 for(const x of DM(F.cr3).replace(/[*_`]+/g,'').toUpperCase().split('\n')){if(/^[ \t#>]*CHALLENGER.{0,2}S UNSUPPORTED-L4 PREMISES[ \t:]*$/.test(x))break;
  const m=x.match(/^[ \t#>•-]*LINK[ \t]+([0-9]+|NONE)[ \t]*(?:\[[ \t]*PREMISE[ \t]*([0-9]+)[ \t]*\])?[ \t]*:?[ \t]*(SUPPORTED|CONCEDED)\b/);if(!m)continue;
  const key=m[1]+'#'+(m[2]||'');if(seen.has(key+'#'+m[3]))continue;seen.add(key+'#'+m[3]);ent.push({lab:m[1],p:m[2]?+m[2]:null,st:m[3],key});}
 const keys=[...new Set(ent.map(e=>e.key))];const kl=keys.map(x=>x.split('#')[0]);const ms=(a)=>a.slice().sort().join(',');
 const pmode=ent.length>0&&ent.every(e=>e.p===null)&&keys.length===labs.length&&kl.every((x,i)=>x===String(i+1))&&labs.every(x=>x!==null)&&ms(labs)!==ms(kl);
 if(pmode){for(const e of ent){e.lab=labs[+e.lab-1];}}
 const conc=new Set(ent.filter(e=>e.st==='CONCEDED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));const sup=new Set(ent.filter(e=>e.st==='SUPPORTED'&&/^[0-9]+$/.test(e.lab)).map(e=>+e.lab));
 const vIds=new Set();const clm=upperD.match(new RegExp('(^|\\n)[ \\t]*CONCEDED\\s+LINKS'+SEP+'(?:[0-9]+)?([^\\n]*)'));const cl=clm?clm[2]:null;
 if(cl!==null){for(const it of cl.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,2}\s+VOID\b/.test(it);if(!isV)continue;
  let m;const r1=/\b(?:D|C|LR)(\d+)\b/g;while((m=r1.exec(it))!==null)vIds.add(+m[1]);
  const r2=/\b(LINKS?|PREMISES?)\s+(\d+(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*\d+)*)/g;
  while((m=r2.exec(it))!==null){const ids=[];for(const p of m[2].split(/\s*(?:,\s*AND|,|AND)\s*/)){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push(q);}else if(/^\d+$/.test(p.trim()))ids.push(+p.trim());}
   for(const q of ids){if(/^PREMISE/.test(m[1])){const lb=labs[q-1];if(lb&&/^[0-9]+$/.test(lb))vIds.add(+lb);}else vIds.add(q);}}}}
 const nD=(chain_count!==null)?chain_count:n;const stands=(i)=>{const s=colState(i);return s==='STANDS'||(s===null&&keystone_link===i&&keystone_state==='STANDS');};
 const out=[];if(nD!==null){for(let i=1;i<=nD;i++){if(!conc.has(i)||!stands(i)||vIds.has(i))continue;
  if(sup.has(i))out.push('[EXTRACTOR v18: SPLIT LINK D'+i+' -- CR3 concedes and supports premises mapped to it. REVIEW THIS ROW.]');
  else{out.push('[EXTRACTOR v18: WITHDRAWN MISSED D'+i+' -- CR3 states LINK '+i+': CONCEDED; the judge marks it STANDS. REVIEW THIS ROW.]');(out.missed=out.missed||[]).push(i);}}}
 out.nwk=nwk?[n,parseInt(nwk[2],10),parseInt(nwk[3],10)]:null;out.ks=keystone_state==='STANDS'?keystone_link:null;
 return out;}
function k3Marks(text,dGiven,cGiven){if(typeof text!=='string')return [];
 const D='[\\s‐-―−-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';const STD='(SELF'+D+'SUPPORTED|PROP'+D+'DEPENDENT|COLLAPSED)';const upper=text.toUpperCase().replace(/[*_`]+/g,'');const out=[];
 for(const [label,given] of [['DEFENSE',dGiven],['CHALLENGE',cGiven]]){
  const m=upper.match(new RegExp('(^|\\n)[ \\t]*'+label+'\\s+STANDING'+SEP+STD+'([^\\n]*)'))||upper.match(new RegExp(label+'\\s+STANDING'+SEP+STD+'([^\\n]*)'));if(!m)continue;
  const q=m[m.length-1].match(/^[\s:,;.(‐-―−-]*L\s*=\s*([0-9]+)[\s,;]*C\s*=\s*([0-9]+)(?![0-9])/);if(!q)continue;const L=parseInt(q[1],10),c=parseInt(q[2],10);
  if((given==='COLLAPSED')!==(2*c>L))out.push('[EXTRACTOR v18: STANDING COUNT -- '+label+' STANDING '+given+' but L='+L+' c='+c+' gives '+((2*c>L)?'more than half':'half or fewer')+' (information only; trim A3: the standing is the judge\'s).]');}
 return out;}
let SJ=null;try{if(RGL){const RR=$('Regrade Row').all().map(i=>i.json).find(r=>r&&r.id)||null;SJ=RR?(RR.panel_verdict==null?RR:Object.assign({},RR,{defense_standing:null,challenge_standing:null,conceded_links:null,challenger_conceded_links:null,sj_void_only:true})):null;}else if($('Build Save Body').isExecuted){const B=$('Build Save Body').first().json;SJ=B.saveBody?Object.assign({},B.saveBody,B.sj_values||{}):null;}}catch(e){SJ=null;}
function voidCounts(text){if(typeof text!=='string')return null;
 const D='[\\s‐-―−-]';const SEP='[\\s:'+D.slice(3,-1)+']*?';
 const upper=text.toUpperCase().replace(/[*_`]+/g,'');const upperD=upper.replace(/CHALLENGER\s+CONCEDED\s+LINKS/g,'XCHALLENGERCONCEDEDLINKSX');
 const itemIds=(it)=>{const ids=[];let m;const r1=/\b(?:D|C|LR)(\d+[A-Z]?)\b/g;while((m=r1.exec(it))!==null)ids.push('L'+m[1]);
 const r2=/\bLINKS?\s+((?:\d+[A-Z]?|NONE)(?:\s*(?:,\s*AND|,|AND|–|-|TO)\s*(?:\d+[A-Z]?))*)/g;
 while((m=r2.exec(it))!==null){const body=m[1];if(/^NONE/.test(body)){ids.push('NONE#'+ids.length);continue;}
  const parts=body.split(/\s*(?:,\s*AND|,|AND)\s*/);for(const p of parts){const rg=p.match(/^(\d+)\s*(?:–|-|TO)\s*(\d+)$/);if(rg){for(let q=+rg[1];q<=+rg[2];q++)ids.push('L'+q);}else if(p.trim())ids.push('L'+p.trim());}}
 const u=new Set(ids.filter(x=>!/^NONE#/.test(x)));return u.size+ids.filter(x=>/^NONE#/.test(x)).length;};
 const TAGC=/\bCONCEDED\s*\(?\s*(?:STATED|CONDITIONAL)\b|\bUNEXHIBITED\s*\(/;
 const deriveConc=(line)=>{if(line===null)return null;let nC=0,nV=0,tags=0;for(const it of line.split(/;|\.\s+(?=[A-Z\[])/)){const isV=/\bVOID\b/.test(it)&&!/\b(?:NONE|NO|NOT|NOTHING|NEITHER)\b(?:\s+[A-Z]+){0,4}\s+VOID\b/.test(it);const isT=TAGC.test(it);if(!isV&&!isT)continue;tags++;const c=Math.max(1,itemIds(it));if(isV)nV+=c;else nC+=c;}return {nC,nV,tags};};
 const concLine=(src,lab)=>{const m=src.match(new RegExp('(^|\\n)[ \\t]*'+lab+SEP+'(?:[0-9]+)?([^\\n]*)'));return m?m[2]:null;};
 const d=deriveConc(concLine(upperD,'CONCEDED\\s+LINKS')),c=deriveConc(concLine(upper,'CHALLENGER\\s+CONCEDED\\s+LINKS'));
 return {def:d?d.nV:null,ch:c?c.nV:null};}
function sameModelMarks(p,WT){if(!SJ||!SJ.judge_model||p.judge_api_model!==SJ.judge_model)return [];const diffs=[];
 const cmp=(lab,a,b)=>{if(a===null||a===undefined||b===null||b===undefined)return;if(a!==b)diffs.push(lab+' '+a+' vs '+b);};
 cmp('defense standing',p.defense_standing,SJ.defense_standing);cmp('challenge standing',p.challenge_standing,SJ.challenge_standing);
 cmp('defender conceded count',p.conceded_links,SJ.conceded_links);cmp('challenger conceded count',p.challenger_conceded_links,SJ.challenger_conceded_links);
 const vp=voidCounts(WT),vs=voidCounts(SJ.independent_verdict_raw);if(vp&&vs){cmp('defender VOID count',vp.def,vs.def);cmp('challenger VOID count',vp.ch,vs.ch);}
 if(!diffs.length)return [];
 return ['[AUDIT v1: SAME-MODEL DIVERGENCE -- seat '+p.judge_seat+' and the single judge both ran '+p.judge_api_model+'; seat vs single judge: '+diffs.join('; ')+'. Counts only; premise ids are not compared.'+(SJ.sj_void_only?' Stamped row: VOID counts only.':'')+' REVIEW THIS ROW.]'];}
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
const C_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
function cRefs(t){return REFP.keys(t,{cap:30}).map(k=>({key:k.key,pos:k.pos}));}
function cAudit(text,ptext){const P=String(ptext||'');const i=P.lastIndexOf('=== [DR3]');if(i<0)return [];const e=P.indexOf('\n=== ',i+1);const t=P.slice(P.indexOf('\n',i)+1,e<0?P.length:e);
 const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+\d+/gmi))H.push(h.index);if(!H.length)return [];
 const links=H.map((a,k)=>new Set(cRefs(t.slice(a,k+1<H.length?H[k+1]:t.length)).map(r=>r.key)));const N=links.length;const out=[];
 for(const ln of String(text||'').replace(/\\n/g,'\n').split('\n')){const m=ln.trim().match(/^[*_>-]*\s*(D\d+)\s+vs\s+(C\d+(?:\s*\/\s*C\d+)*)\s*(?:\(([^)]*)\))?/);if(!m)continue;
  const js=m[2].split('/').map(x=>+x.trim().slice(1));let why='';
  if(js.some(j=>j<1||j>N))why='C'+js.filter(j=>j<1||j>N).join(', C')+' is above the '+N+' LINK blocks of DR3';
  else if(m[3]){const want=cRefs(m[3]).map(r=>r.key);const U=new Set();js.forEach(j=>links[j-1].forEach(k=>U.add(k)));if(want.length&&!want.some(k=>U.has(k)))why='DR3 LINK block '+js.join('/')+' names none of '+m[3].trim();}
  if(why)out.push('[AUDIT v21: C-LABEL OFF THE GUIDE -- '+m[1]+' vs '+m[2].replace(/\s+/g,'')+(m[3]?' ('+m[3].trim()+')':'')+': '+why.replace(/[\[\]]/g,'')+'; recorded, not a violation, not counted.]');}
 return out;}
function __pIsHead(a,i){const tx=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&p.text||'').join(''):'';const R=/^POSTURE (?:FOR ACCEPTANCE|RETURNED)/;const m=a[i];if(!m)return false;
 if(m.role==='user')return R.test(tx(m.content));if(m.role==='assistant'){const p=a[i-1];return !!p&&p.role==='user'&&R.test(tx(p.content));}return false;}
function drvPromptText(body){try{const b=body||{};const out=[];if(b.systemInstruction&&b.systemInstruction.parts)b.systemInstruction.parts.forEach(p=>out.push(String(p.text||'')));
 (b.messages||[]).filter((m,i,a)=>!__pIsHead(a,i)).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:JSON.stringify(p)));else out.push(JSON.stringify(c));});(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
function drvLedgerN(ptext,side){if(typeof ptext!=='string')return null;const i=drvLabAt(ptext,'DEFENDER',0);const j=i<0?-1:drvLabAt(ptext,'CHALLENGER',i);
 const k=j<0?-1:ptext.indexOf('A verse marked NOT NAMED',j);if(i<0||j<0||k<0)return null;const n=(side==='DEFENDER'?ptext.slice(i,j):ptext.slice(j,k)).split('\n').filter(l=>/^\s*premise \d+/.test(l)).length;return n||null;}
function drvCPA(val,max){if(val===undefined||val===null)return {present:false,why:'absent'};
 if(!Array.isArray(val)||!val.every(x=>Number.isInteger(x)&&x>=1&&(!max||x<=max))){let r;try{r=JSON.stringify(val);}catch(e){r=String(val);}return {present:false,why:'invalid',raw:String(r).slice(0,200)};}
 return {present:true,set:new Set(val),line:JSON.stringify(val)};}
function drvLinkMap(ptext){if(typeof ptext!=='string')return null;const i=drvLabAt(ptext,'DEFENDER',0);const j=i<0?-1:drvLabAt(ptext,'CHALLENGER',i);
 if(i<0||j<0)return null;const M={};let any=false;for(const l of ptext.slice(i,j).split('\n')){const m=l.trim().match(/^premise (\d+) \(LINK (\d+)\)/);if(m){any=true;(M[+m[2]]=M[+m[2]]||[]).push(+m[1]);}}
 return any?M:null;}
const drvCountLine=(T,side)=>{const re=side==='DEFENDER'?/^[ \t>#-]*CONCEDED LINKS[ \t]*:.*/i:/^[ \t>#-]*CHALLENGER CONCEDED LINKS[ \t]*:.*/i;for(const l of String(T).split('\n')){const rr=ri3Count2024(l,side);if(rr===null?re.test(l):rr)return rr===null?l.match(re)[0]:l.match(/^.*/)[0];}return null;}; /* pkgRI3B */
const DRV_WORDS7=/\b(?:unanswered|not answered|unnamed|not named|never named|none named|neither named|unaddressed|unexhibited)\b/i;
function drvBroken(text,dConc,dStand,prior,cConc,cStand,ptext,CPV){const items=[],marks=[];if(typeof text!=='string')return {items,marks};const T=text.replace(/[*_`]+/g,'');
 const cl=drvCountLine(T,'DEFENDER');const lm=ri3StandL2024(T,'DEFENSE',/^[ \t>#-]*DEFENSE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/i); /* pkgRI3B */const L=drvLedgerN(ptext,'DEFENDER')||(lm?+lm[1]:null);
 const cm=ri3StandL2024(T,'CHALLENGE',/^[ \t>#-]*CHALLENGE STANDING[ \t]*:[^\n]*?\bL\s*=\s*(\d+)/i); /* pkgRI3B */const LC=drvLedgerN(ptext,'CHALLENGER')||(cm?+cm[1]:null);
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
 const VD={DEFENDER:lbVoid(text,'DEFENDER'),CHALLENGER:lbVoid(text,'CHALLENGER')};
 for(const side of ['DEFENDER','CHALLENGER']){const cp=drvCPA(CPV&&CPV[side],drvLedgerN(ptext,side));const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;
  if(!cp.present&&sc!==0)continue;
  for(const l of LG[side]){const m=l.match(/^premise (\d+)(?: \(LINK (\d+)\))?: .*NOT NAMED: (.+)$/);if(!m||/^none\s*$/i.test(m[3]))continue;
   if(cp.present&&cp.set.has(+m[1]))continue;
   if(VD[side].has(+m[1]))continue;
   const id=side+' premise '+m[1];
   items.push({rule:'K-G6',side,link:id,line:l,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:LG[side].length,void:lbVoidList(VD[side])});
   marks.push('[AUDIT v21: DEBATE RULE VIOLATION (K-G6) -- '+id+(m[2]?' (LINK '+m[2]+')':'')+': the PRESSED-WITNESS LEDGER marks '+m[3].trim()+' NOT NAMED and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it. REVIEW THIS ROW.]');}}
 return {items,marks};}
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
  const VD=lbVoid(text,side);const PL=ciPlist(R,side);const onVoid=z=>ciVoidOf(z,PL,VD);
  const missing=[],why=[];const mine=RU.filter(x=>x.kind==='NOT PRESSED'||CI_PRESS[side].includes(x.round)||(lg&&lg.labels.some(l=>[...ciKeys(l)].some(k=>x.keys.has(k)))));
  if(lg)for(const lab of lg.labels){const K=ciKeys(lab);if(onVoid({ref:lab,keys:K}))continue;  const rs=mine.filter(x=>[...x.keys].some(k=>K.has(k)));if(!rs.length){missing.push(lab);continue;}
   const bad=rs.map(x=>({x,v:ciValid(x,side,R)})).filter(z=>!z.v.ok);if(bad.length===rs.length){missing.push(lab);why.push(lab+': '+bad[0].v.why);}}
  const pu=RU.filter(x=>x.kind==='PRESSED'&&x.ans==='UNANSWERED'&&CI_PRESS[side].includes(x.round)&&ciValid(x,side,R).ok);
  const cs=ciCountSection(text,side);const CK=cs?ciKeys(cs):new Set();const uncounted=pu.filter(x=>!onVoid(x)).filter(x=>typeof conc!=='number'||conc<1||![...x.keys].some(k=>CK.has(k))).map(x=>x.ref);
  if(!missing.length&&!uncounted.length){if(lg)pass.push({side,n:lg.labels.length});continue;}
  const line=(missing.length?'the ledger lists '+lg.labels.length+' verse(s) cited against the '+side.toLowerCase()+' and not named in a later round of it; no valid ruling for '+missing.length+': '+missing.join(', ')+(why.length?' ('+why.join('; ')+')':''):'')+(missing.length&&uncounted.length?'; ':'')+(uncounted.length?'ruled PRESSED and UNANSWERED but not counted in '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+': '+[...new Set(uncounted)].join(', '):'');
  items.push({rule:'K-G9',side,link:side+' CITED-IN',line,missing,uncounted:[...new Set(uncounted)],conc:typeof conc==='number'?conc:0,st,L:(LN&&LN[side])||null,void:lbVoidList(VD),plist:PL.map(p=>({n:p.n,keys:p.keys}))});
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G9) -- '+side+' CITED-IN: '+line.replace(/[\[\]]/g,'')+'. Ruling 372: a pressed witness left unanswered makes the premise UNEXHIBITED and counts; a NOT PRESSED ruling gives its reason in one clause. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 if(pass.length)marks.push('[AUDIT v26: K-G9 PASS: '+pass.reduce((a,p)=>a+p.n,0)+' verses ruled -- '+pass.map(p=>p.side+' CITED-IN '+p.n).join('; ')+'; TRIAL rule]');
 return {items,marks};}
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
const PW_SEG=/(^|\n|[;.]\s+|--\s*|—\s*|:\s+)(?:[-•>]\s*)?(?:\d+[.)]\s*)?[*_]*\s*premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\b(?:\s*\(LINK\s+(?:\d+|none)\))?[*_]*(?=\s*(?:is\b|are\b|:|--|—|\(|UNEXHIBITED|CONCEDED|VOID|SUPPORTED|SPARED|STANDS|NOT\b))/gi;
const PW_WIT=/unanswer|unnamed|not named|no later|pressed|witness|ruling 372|\b372\b/i;
const PW_FOOT=/\bexhibit|\bfooting\b|\[L[1-3]\]|\bquotations\b|prior layers?/i;
const PW_UNANS=/unanswer|unnamed|not named|no later|not answered|receives no|\bleft\b|leaving|names or answers|without (?:an |any )?answer/i;
const PW_FOOTGROUND=/fewer than two|exhibits? only|only \[L[1-3]\]|no (?:layer )?footing|inadequate footing|one layer kind|single layer/i;
function pwSegments(text,side){const cs=ciCountSection(text,side);if(!cs)return [];const at=[];let m;PW_SEG.lastIndex=0;
 while((m=PW_SEG.exec(cs)))at.push({i:m.index+m[1].length,ns:m[2].split(/\s*(?:,|and|&)\s*/).map(Number).filter(n=>n>0)});
 return at.map((x,k)=>{const seg=cs.slice(x.i,k+1<at.length?at[k+1].i:cs.length);const wit=/UNEXHIBITED/.test(seg)&&PW_WIT.test(seg);
  const cl=seg.split(/;\s+|,\s+(?:and|but|while|whereas)\s+|(?<=[.!?]["”'’)]?)\s+(?=[\[("“A-Z])|\s+and\s+(?=(?:it\s+|that\s+block\s+|the\s+block\s+|only\s+)?(?:exhibit|offer|show|rest|give)s?\b)|\s+but\s+(?=(?:it\s+|only\s+)?exhibit)/);
  const keys=new Set();if(wit)for(const c of cl){if(PW_FOOT.test(c)||!PW_UNANS.test(c))continue;for(const k0 of ciKeys(c))keys.add(k0);}
  return {ns:x.ns,seg:seg.trim(),wit,foot:PW_FOOTGROUND.test(seg),keys:[...keys]};});}
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
  if(!PWS[side]){const PL=pwList(R,side);PWS[side]=PL?new Set(PL.flatMap(p=>[...p.keys])):null;PWS[side+'A']=PL?new Set(PL.flatMap(p=>[...(p.all||p.keys)])):null;}const PW=PWS[side];if(!PW)continue;const PA=PWS[side+'A']||PW;
  const U=pwUnans(l);if(!U.length||U.some(k=>PW.has(k)))continue;
  const other=[...ciKeys(l)].filter(k=>PW.has(k)&&!pwAnswered(k,side,R));if(other.length)continue;
  const named=[...ciKeys(l)].filter(k=>PW.has(k));
  const kp=U.some(k=>PA.has(k));
  items.push({rule:kp?'K-P':'K-G11',side,link:id,line:l.slice(0,600),verses:U,pwNamed:named,pwk:[...PW]});
  if(kp){marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-P) -- '+id+' '+g+' rests, as unanswered, only on '+U.join(', ')+', presses the ledger marks UNPROVEN or carries under no PRESSED WITH; ruling 398: only a proven press is a witness, and an unproven press left unanswered is no BROKEN ground. TRIAL rule: answer it in the cure with RETRACTED for that line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or with one RESTATED line for it that is not graded LINK BROKEN, or with one RESTATED LINK BROKEN line that names, as left unanswered, a verse that the list against that side carries under PRESSED WITH: and the ledger marks PROVEN or PROVEN BY REFERENCE; it removes no seat. REVIEW THIS ROW.]');continue;}
  marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G11) -- '+id+' '+g+' rests, as unanswered, only on '+U.join(', ')+', which no premise of the list against the '+side.toLowerCase()+' (the list that closes '+PW_ROUND[side]+') carries under PRESSED WITH'+(named.length?'; the verses of the line that list carries ('+named.join(', ')+') are each named in a later '+side.toLowerCase()+' round':'')+'. Ruling 392: a verse pressed without a premise is no BROKEN ground. TRIAL rule: answer it in the cure with RETRACTED for that line, with its reason (the round in brackets, then its words quoted or the verse it cites), and the one CORRECTED RESULT of your whole reply, or with one RESTATED line for it that is not graded LINK BROKEN, or with one RESTATED LINK BROKEN line that names, as left unanswered, a verse that the list against that side carries under PRESSED WITH: and the ledger marks PROVEN or PROVEN BY REFERENCE; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
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
  const PL=pwList(R,side);if(!PL)continue;const PW=new Set();PL.forEach(p=>p.keys.forEach(k=>PW.add(k)));const PA=new Set();PL.forEach(p=>(p.all||p.keys).forEach(k=>PA.add(k)));const VD=lbVoid(text,side);
  for(const sg of pwSegments(text,side)){if(!sg.wit)continue;read++;const bad=sg.keys.filter(k=>!PW.has(k));if(!bad.length||bad.length<sg.keys.length||sg.foot)continue;
   for(const n of sg.ns){if(VD.all||VD.set.has(n))continue;const id=side+' premise '+n;if(items.some(y=>y.link===id))continue;
    const kp=bad.some(k=>PA.has(k));
    items.push({rule:kp?'K-P':'K-G10',side,link:id,premise:n,line:'premise '+n+': counted UNEXHIBITED on '+bad.join(', ')+(kp?', which the ledger marks UNPROVEN, not a witness (ruling 398); ':', which no premise of the list that closes ['+PW_ROUND[side]+'] carries under PRESSED WITH; ')+'the count reads: '+sg.seg.replace(/\s+/g,' ').slice(0,360),verses:bad,conc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||PL.length,void:lbVoidList(VD),
     pw:PL.filter(p=>p.has).map(p=>({n:p.n,seg:p.seg.slice(0,1500)}))});
    if(kp)marks.push('[AUDIT v28: DEBATE RULE VIOLATION (K-P) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', a press the ledger marks UNPROVEN: it carries no MEANS sentence with an [L2] or [L3] and no checked PROVEN IN reference. Ruling 398: only a proven press is a witness. TRIAL rule: answer it in the cure with CORRECTED COUNT for that side without that premise and the CORRECTED STANDING that count makes true; it removes no seat. REVIEW THIS ROW.]');else
    marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-G10) -- '+id+': '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' counts it UNEXHIBITED on '+bad.join(', ')+', which no premise of the list against the '+side.toLowerCase()+' (the list that closes '+PW_ROUND[side]+') carries under PRESSED WITH. Ruling 392: a press must have a premise behind it; a verse pressed without one is not a witness, and leaving it unanswered never counts. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}}
 const pass=!items.length;
 {const B=drvBrokenPW(text,R);B.items.forEach(x=>items.push(x));B.marks.forEach(x=>marks.push(x));}
 {const V=drvVoid(text,ptext,dConc,cConc,dStand,cStand,LN);V.items.forEach(x=>items.push(x));V.marks.forEach(x=>marks.push(x));}
 {const X=drvLxx(text,ptext);X.items.forEach(x=>items.push(x));X.marks.forEach(x=>marks.push(x));}
 {const F9=kfLines(text,R);F9.items.forEach(x=>items.push(x));F9.marks.forEach(x=>marks.push(x));}
    {const FC=kfcLines(text,R);FC.items.forEach(x=>items.push(x));FC.marks.forEach(x=>marks.push(x));}
    {const FF=kffLines(text,R);FF.items.forEach(x=>items.push(x));FF.marks.forEach(x=>marks.push(x));}
 {const R9=krLines(text,R);R9.items.forEach(x=>items.push(x));R9.marks.forEach(x=>marks.push(x));}
 {const X9=kl2Lines(text,l2Data());X9.items.forEach(x=>items.push(x));X9.marks.forEach(x=>marks.push(x));}
 {const W9=kwLines421(text,R);W9.items.forEach(x=>items.push(x));W9.marks.forEach(x=>marks.push(x));}
 if(pass)marks.push('[AUDIT v26: K-G10 PASS: '+read+' UNEXHIBITED witness ground'+(read===1?'':'s')+' read; every witness named is carried under a listed premise\'s PRESSED WITH; TRIAL rule]');
 return {items,marks};}
const lbKinds=block=>lbFoot(block);
function lbBlocks(t,stopRe){let s=String(t||'');if(stopRe){const c=s.search(stopRe);if(c>=0)s=s.slice(0,c);}const H=[...s.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];
 return H.map((h,i)=>({j:i+1,n:+h[1],head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim(),text:s.slice(h.index,i+1<H.length?H[i+1].index:s.length)}));}
function lbVoid(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const out=new Set();let all=false;
 const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const sec=(ciCountSection(T,side)||'')+'\n'+st;
 for(const s of sec.split(/(?<=[.;])\s+|\n/)){if(!/\bVOID\b/.test(s))continue;if(/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(s))continue;
  const ns=[...s.matchAll(/\bPremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi)]  .flatMap(m=>m[1].match(/\d+/g).map(Number));
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
  if(!item||NET_SKIP.test(u)||(ri5Fd2024(line,'CHAIN MARK','mark')!=null?ri5Fd2024(line,'CHAIN MARK','mark')==='FOOTED':/^(?:DEFENDER|CHALLENGER) CHAIN MARK\s*:\s*FOOTED\b/.test(u)))continue; /* pkgRI6 item 7 */
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
function kwiCut2024(t,i){const old=t.slice(i).split(/(?<=[.!?])\s|\n/)[0].slice(0,220).trim();if(((old.match(/"/g)||[]).length%2)===0)return old;const ln=t.slice(i).split('\n')[0];let q=false;for(let k=0;k<ln.length;k++){const c=ln[k];const nx=ln.slice(k+1);if(c==='"'){q=!q;if(!q&&/[.!?]$/.test(ln.slice(0,k))&&/^(?:\s|$)/.test(nx)){const r=ln.slice(0,k+1).trim();return r.length<=300?r:old;}continue;}if(!q&&/[.!?]/.test(c)&&/^[\u201d')\]]*(?:\s|$)/.test(nx)){const r=(ln.slice(0,k+1)+(nx.match(/^[\u201d')\]]*/)||[''])[0]).trim();return r.length<=300?r:old;}}return old;}
function kwiSq2024(s){let o=false;return String(s).replace(/["\u201c\u201d]/g,c=>c==='\u201c'?'\u2018':c==='\u201d'?'\u2019':((o=!o)?'\u2018':'\u2019'));}
function kwLines421(text,R){const items=[],marks=[];if(!R)return {items,marks};const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b/gi;
 for(const [side,rks] of [['DEFENDER',['CR2','CR3','CR4']],['CHALLENGER',['DR2','DR3','DR4']]]){let n=0;
  for(const rk of rks){const t=String(R[rk]||'').replace(/[*_`]+/g,'');if(!t)continue;
   for(const m of t.matchAll(RX)){if(n>=10)break;const pre=t.slice(0,m.index);{const ls=pre.lastIndexOf('\n')+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);if((/^\s*#/.test(ln)&&!/[.!?]["\u201d']?\s*$/.test(ln))||((bf.match(/["\u201c\u201d]/g)||[]).length%2===1)||/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length))){n++;continue;}}  const hd=[...pre.matchAll(/(?:^|\n)[ \t>#-]*((?:LINK\s*\d+|[DC]\d+)\b[^\n:]{0,40}):/gi)].pop();const lab=hd?(hd[1].match(/^(?:LINK\s*\d+|[DC]\d+)\b/i)||[hd[1]])[0].replace(/\s+/g,' ').trim().slice(0,30):'no link heading';
    let s=kwiCut2024(t,m.index);if(/^\s*(?:it|that|this|so|them|these|those)?\s*[.!?]?["\u201d']?\s*$/i.test(s.slice(m[0].length))){const bnd=x=>Math.max(t.lastIndexOf('\n',x-1)+1,...[...t.slice(0,x).matchAll(/[.!?]["\u201d']?\s+/g)].map(z=>z.index+z[0].length));const ls2=bnd(m.index);const own=t.slice(ls2,m.index).replace(/[,;:\s]*(?:which|as|that|this)?\s*$/i,'');if(/[A-Za-z0-9]/.test(own)){if(!/[A-Za-z0-9]/.test(s.slice(m[0].length)))s=(t.slice(ls2,m.index)+s).slice(0,220).trim();}else{let q=ls2;while(q>0&&/\s/.test(t[q-1]))q--;const pv=q>0?t.slice(bnd(q-1),q).trim():'';if(!/[A-Za-z0-9]/.test(pv)||!(/[.!?]["\u201d')]?$/.test(pv)||/"[^"]{3,}"|\u201c[^\u201d]{3,}\u201d/.test(pv))){n++;continue;}s=(pv+' '+s).slice(0,300).trim();}  }  n++;const id=side+' '+rk+' '+lab+' #'+n;
    items.push({rule:'K-W',side,link:id,line:'['+rk+'] '+lab+': "'+kwiSq2024(s)+'"'});
    marks.push('[AUDIT v30: WITHDRAWAL TO ANSWER (K-W; ruling 421) -- '+id+': "'+s.replace(/[\[\]"]/g,'')+'"; the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, REASSERTED IN <round> \"<quote>\", or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter; quote marks inside the sentence do not end the six words: quote across them, leaving them out). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}}
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
      marks.push('[AUDIT v31: WITHDRAWN PREMISE REASSERTED (K-W; WALL-2024 check 2) -- '+id+': ['+rk+'] "'+ws.replace(/[\[\]"]/g,'')+'"; ['+rk2+'] "'+ls.replace(/[\[\]"]/g,'')+'" ('+actor+', '+sv.join(', ')+', shared: '+sh.join(', ')+'); the judge answers STANDS WITHOUT IT because <layer>, CONCEDED, REASSERTED IN <round> \"<quote>\", or NOT HELD with a reason that quotes it (six words in a row, or all of it when shorter; quote marks inside the sentence do not end the six words: quote across them, leaving them out). LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]');}}}}});}
 return {items,marks};}
function kcmtGrade2024(l){if(/^\[AUDIT\b/.test(l))return false;const h=l.replace(/^[-*•>\s]+/,'').replace(/^\*\*/,'');
 if(/^RESULT\s*:.*\brecomputed\b/i.test(h))return false;if(/^CLAUSE\s*:/i.test(h))return false;if(/^SUPERSEDED BY CURE\s*:/i.test(h)||/^RESULT\s*:.*\bderived after the send-back\b/i.test(h))return false;  if(/^(?:DEFENSE|CHALLENGE)\s+STANDING\s*:/i.test(h))return false;
 if(/^(?:RULING\s*(?:--|—|–|:)|CLAIM\s*:|NAMED BY\s*:|RULE\s*:|APPLIED\s*:)/i.test(h))return false;
 if(/\bCommitments?\s*\d+/i.test(h))return false;if(knlNone2024(h))return false; /* pkgKNL */
 let t=h.replace(/"[^"]*"|“[^”]*”/g,' ');
 if(/^ANSWER CHECK\s*:/i.test(h)&&ri5Fd2024(l,'ANSWER CHECK','answer')!=null&&ri5Fd2024(l,'ANSWER CHECK','grade')!=null)t=ri5Fd2024(l,'ANSWER CHECK','grade'); /* pkgRI5C */ else if(/^ANSWER CHECK\s*:/i.test(h)){const a=t.lastIndexOf('ANSWER:');const sg=(a<0?'':t.slice(a)).split(/\s(?:--|—|–)\s/);t=sg.length>1?sg[1]:'';}
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
 const L=T.split('\n');{const kl=L.find(l=>/^\s*[-*•]?\s*\**KEYSTONE\s*:/.test(l));if(kl){add('keystone','JUDGE');const km=ri5Fd2024(kl,'KEYSTONE','link')!=null?[kl,ri5Fd2024(kl,'KEYSTONE','link')]:kl.match(/KEYSTONE\s*:\s*\**\s*(D\d+)\b/i); /* pkgRI6 */const ke=out.find(u=>u.id==='keystone');if(km&&ke)ke.ks=km[1].toUpperCase();}}
 for(const l of L){let m=ri6Col2024(l,/^\s*(?:[-•*]\s*|\d+[.)]\s*)?\**(D\d+)\s+vs\.?\s+(C\d+)\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|WITHDRAWN)\b/,['DEFENDER LINK BROKEN','CHALLENGER LINK BROKEN','WITHDRAWN']); /* pkgRI6 */if(m)add(m[1]+' vs '+m[2],'JUDGE');
  m=ri6Rs2024(l,/^\s*(?:[-•*]\s*)?RESTATED\s*:\s*(D\d+)\s+vs\.?\s+(C\d+)/); /* pkgRI6 */if(m)add(m[1]+' vs '+m[2],'JUDGE');}
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
/* pkgRP8 (reader item 8): a RESPONSE or STATEMENT line as the shared reader reads it gives its answer text; any other line keeps the old read */
function kconUnlabel(l){try{const r=__RL.readLine(String(l==null?'':l).trim());if(r&&r.form==='STATEMENT'&&r.f&&!r.f.restated&&typeof r.f.text==='string'&&r.f.text.trim())return r.f.text;}catch(e){}return kconUnlabel0(l);}
function kconUnlabel0(l){return String(l==null?'':l).replace(/^\s*(?:[-•*>]\s*)?\**\s*(?:RESPONSE\**\s*:[^|\n]*\|\s*|STATEMENT\**\s*:\s*)\**\s*/i,'');}
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
 for(const raw of T.split('\n')){const line=raw.trim();const m=ri6Kk2024(line,/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b\s*(?:--|—|-|:)?\s*(.*)$/i); /* pkgRI6 */if(!m)continue;
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
function postureBlock(T,head){const L=T.split('\n');const i=L.findIndex(l=>new RegExp('^\\s*(?:[-•#>]\\s*)?'+head+'\\s*:','i').test(l));if(i<0)return null;
 const out=[L[i].replace(new RegExp('^\\s*(?:[-•#>]\\s*)?'+head+'\\s*:\\s*','i'),'')];
 for(let k=i+1;k<L.length;k++){const l=L[k];if(/^\s*(?:[-•#>]\s*)?(?:SILENCE|SAME TEST|RESULT|CLAUSE|VERDICT|DEFENSE STANDING|CHALLENGE STANDING|CONCEDED LINKS|CITATION CHECK|COLLISION POINTS|KEYSTONE)\b/i.test(l))break;if(!l.trim()){if(out.length>1)break;continue;}out.push(l);}
 return out.map(x=>x.replace(/^\s*(?:[-•*]|\d+[.)])\s*/,'').trim()).join('\n').split(/\n|;\s*(?=[1-3]?\s?[A-Z][a-z]+\.?\s+\d)/).map(x=>x.trim()).filter(Boolean);}
function postureCheck(text,ptext){const marks=[];if(typeof text!=='string')return {marks};const T=netUnwrap(text).replace(/[*_`]+/g,'');
 const tag=(k,m)=>'[AUDIT v28: POSTURE CHECK ('+k+', TRIAL) -- '+m.replace(/[\[\]]/g,'')+' Recorded, not cured, not counted.]';
 const S=postureBlock(T,'SILENCE');
 if(!S)marks.push(tag('SILENCE','the judgment has no SILENCE line.'));
 else{const R=ciRounds(String(ptext||''));const PW=new Map();
  for(const side of ['DEFENDER','CHALLENGER']){const PL=pwList(R,side)||[];PL.forEach(p=>p.keys.forEach(k=>{if(!PW.has(k))PW.set(k,side.toLowerCase()+' premise '+p.n);}));}
  const said=new Set();
  for(const e of S){if(/^\s*none\b/i.test(e))continue;for(const k of ciKeys(e)){said.add(k);if(!PW.has(k))marks.push(tag('SILENCE','SILENCE counts '+k+' unanswered, but no listed premise carries it under PRESSED WITH within the cap of 8 (rulings 392, 393): "'+e.slice(0,160)+'".'));}}
  const nn=[];for(const l of String(ptext||'').split('\n')){const m=l.match(/^\s*premise \d+[^\n]*NOT NAMED: (.+)$/);if(m&&!/^none\b/i.test(m[1].trim()))for(const k of ciKeys(m[1]))nn.push(k);}
  for(const k of nn)if(!said.has(k))marks.push(tag('SILENCE','the ledger marks '+k+' NOT NAMED (unanswered by the rule); the SILENCE line does not count it.'));}
 const Q=postureBlock(T,'SAME TEST');
 if(!Q)marks.push(tag('SAME TEST','the judgment has no SAME TEST line.'));
 else{const pairs=new Set();
  for(const e of Q){if(/^\s*none\b/i.test(e))continue;const d=e.match(/\bon\s+(D\d+)\b/i),c=e.match(/\bon\s+(C\d+)\b/i);
   if(d&&c)pairs.add(d[1].toUpperCase()+' vs '+c[1].toUpperCase());
   const one=!d||!c||/\bon\s+[CD]\d+\s*:\s*(?:not\s+applied|n\/a|none|not\s+tested|-|—|no\s+test)\b/i.test(e)||/\b(?:not\s+applied|only)\s+(?:to|on)\s+(?:D|C)\d+/i.test(e);
   if(one)marks.push(tag('SAME TEST','"'+e.slice(0,200)+'" applies a test to one link of a collision line and not to the other.'));}
  for(const l of T.split('\n')){const m=l.match(/^\s*(?:[-•]|\d+[.)])?\s*(D\d+)\s+vs\.?\s+(C\d+)\b/i);if(!m)continue;const id=m[1].toUpperCase()+' vs '+m[2].toUpperCase();
   if(!pairs.has(id)&&ks2Hit(ks2Grounds(l)))marks.push(tag('SAME TEST',id+' rests on a witness\'s-own-words test, and the SAME TEST line has no entry applying it to both links of that line.'));}}
 return {marks};}
const ALTB=$('R2 Alternate Build').all().map(x=>x.json.alt).filter(a=>a&&!a.skip);
const callOut=$input.all().map(x=>x.json);
const out=ALTB.map((a,k)=>{const raw=callOut[k];const res={alt:a,ok:false,why:null,body:null,summary:null,drv:[]};
 try{if(!raw)throw new Error('no call output');if(raw.error){const e=raw.error;throw new Error('call failed: '+String((typeof e==='string')?e:((e&&(e.message||e.description))||JSON.stringify(e))).slice(0,200));}
  const env=envelope(a.seat,raw);let v;try{v=verdict(a.seat,env.text);}catch(e){throw new Error(String(e&&e.message||e)+' (finish_reason '+(env.finish||'none')+')');}
  if(TAGS.indexOf(v.verdict_tag)===-1)throw new Error('verdict_tag "'+v.verdict_tag+'" outside the closed set');
  if(STAND.indexOf(v.defense_standing)===-1)throw new Error('defense_standing "'+v.defense_standing+'" outside the closed set');
  if(STAND.indexOf(v.challenge_standing)===-1)throw new Error('challenge_standing "'+v.challenge_standing+'" outside the closed set');
  const p={debate_id:P.debate_id,judge_seat:a.seat,judge_api_model:a.api_model,verdict_raw:env.text,verdict_tag:v.verdict_tag,defense_standing:v.defense_standing,challenge_standing:v.challenge_standing,conceded_links:intOrFail(a.seat,'conceded_links',v.conceded_links),challenger_conceded_links:intOrFail(a.seat,'challenger_conceded_links',v.challenger_conceded_links),finish_reason:env.finish};
  const marks=[];if(p.defense_standing==='SELF-SUPPORTED'&&p.conceded_links>0)marks.push('[AUDIT v1: DEFENSE SELF-SUPPORTED WITH '+p.conceded_links+' CONCEDED LINKS. REVIEW THIS ROW.]');
  if(p.challenge_standing==='SELF-SUPPORTED'&&p.challenger_conceded_links>0)marks.push('[AUDIT v1: CHALLENGE SELF-SUPPORTED WITH '+p.challenger_conceded_links+' CHALLENGER CONCEDED LINKS. REVIEW THIS ROW.]');
  const offKey=v.reasoning==null&&v.reason!=null;const WT=offKey?v.reason:v.reasoning;
  {const K2W=k2Marks(WT);for(const x of K2W)marks.push(x);
  if(K2W.missed&&K2W.missed.length&&K2W.nwk){const n0=K2W.nwk[0],w1=K2W.nwk[1]+K2W.missed.length,k0=K2W.nwk[2],ksW=K2W.ks!=null&&K2W.missed.includes(K2W.ks);
   const tg=k0>=1?'BROKEN-1':((2*w1>n0||ksW)?'BROKEN-2':(w1>=1?'PARTIAL-1':(p.defense_standing==='COLLAPSED'?'PARTIAL-2':'HELD-1')));const wd2=tg.split('-')[0];
   if(wd2!==p.verdict_tag){marks.push('[AUDIT v22: WITHDRAWAL COUNTED -- D'+K2W.missed.join(', D')+' stated CONCEDED in CR3 and marked STANDS by the judge, counted withdrawn: n='+n0+' w='+w1+' k='+k0+(ksW?' keystone WITHDRAWN':'')+' gives '+tg+'; ORIGINAL: '+p.verdict_tag+'; COUNTED: '+wd2+']');p.verdict_tag=wd2;}}}for(const x of k3Marks(WT,p.defense_standing,p.challenge_standing))marks.push(x);
  if(offKey)marks.push('[AUDIT v1: WORKED TEXT KEYED "reason", NOT "reasoning"; READ UNDER "reason". REVIEW THIS ROW.]');
  for(const x of sameModelMarks(p,WT))marks.push(x);
  let drvAsk=false;try{drvAsk=JSON.stringify(a.body||{}).includes('CITATION CHECK');}catch(e){drvAsk=false;}
  PRS_CTX.R=ciRounds(drvPromptText(a.body));PRS_L2BAD=(()=>{try{const q=$('Quote Report').first().json;return q&&q.l2&&Array.isArray(q.l2.tags)?PRS.l2bad(q.l2.tags):null;}catch(e){return null;}})();
const DRV=drvCheck(WT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,drvAsk,drvLinks(drvPromptText(a.body)));for(const x of DRV.marks)marks.push(x);
 for(const x of DRV.items)if(x.rule==='K-C')x.chain=drvChains(drvPromptText(a.body),x);
  const DL=drvLedger(WT,drvPromptText(a.body),p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger});for(const x of DL.items)DRV.items.push(x);for(const x of DL.marks)marks.push(x);
  const DB=drvBroken(WT,p.conceded_links,p.defense_standing,DRV.items,p.challenger_conceded_links,p.challenge_standing,drvPromptText(a.body),{DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger});for(const x of DB.items)DRV.items.push(x);for(const x of DB.marks)marks.push(x);
  {const PT=drvPromptText(a.body);const LN={DEFENDER:drvLedgerN(PT,'DEFENDER'),CHALLENGER:drvLedgerN(PT,'CHALLENGER')};const CPV={DEFENDER:v.counted_premises_defender,CHALLENGER:v.counted_premises_challenger};
  const CI=drvPressWith(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,LN);for(const x of CI.items)DRV.items.push(x);for(const x of CI.marks)marks.push(x);
  {const KR=krulLines2024(WT,PRS_CTX.R,CPV,krulAcc(a.body),PT);KR.items.forEach(x=>DRV.items.push(x));KR.marks.forEach(x=>marks.push(x));}
  {const KK=kkjvLines2024(WT,kkjvRows());KK.items.forEach(x=>DRV.items.push(x));KK.marks.forEach(x=>marks.push(x));}
  {const KA=kagLines2024(WT);KA.items.forEach(x=>DRV.items.push(x));KA.marks.forEach(x=>marks.push(x));}
  const LB=drvBlocks(WT,PT,p.conceded_links,p.challenger_conceded_links,p.defense_standing,p.challenge_standing,CPV,LN);for(const x of LB.items)DRV.items.push(x);for(const x of LB.marks)marks.push(x);
  {const UX=kunxLines(WT,PT);for(const x of UX.items)DRV.items.push(x);for(const x of UX.marks)marks.push(x);}}
 for(const x of cAudit(WT,drvPromptText(a.body)))marks.push(x);
  p.drv_uncured=DRV.items.filter(enfLive).length;
  marks.push('[AUDIT v21: ALTERNATE JUDGE -- SEAT: '+a.seat+'; REPLACES: '+a.removed_seat+'; MODEL: '+a.api_model+(a.qualify?'; QUALIFY RUN':'')+']');
  p.verdict_raw=p.verdict_raw+'\n\n'+marks.join('\n');
  res.ok=true;res.body=JSON.stringify({payload:p});res.drv=DRV.items;res.summary={seat:a.seat,node:'R2 Alternate Call openrouter',api_model:a.api_model,verdict_tag:p.verdict_tag,raw_chars:env.text.length,finish_reason:p.finish_reason,flags:marks.length,drv:DRV.items,substitute:false,alternate_of:a.removed_seat};}
 catch(e){res.why=String(e.message||e).replace(/^FAIL-CLOSED:\s*/,'').slice(0,300);}
 return {json:res};});
return out.length?out:[{json:{alt:null,ok:false,why:'no alternate call'}}];