const __L={"C1 Call anthropic":()=>$('C1 Call anthropic'),"C1B Extract":()=>$('C1B Extract'),"C2 Call anthropic":()=>$('C2 Call anthropic'),"C2B Extract":()=>$('C2B Extract'),"C3 Call anthropic":()=>$('C3 Call anthropic'),"C3B Extract":()=>$('C3B Extract'),"C4 Call anthropic":()=>$('C4 Call anthropic'),"D1 Call anthropic":()=>$('D1 Call anthropic'),"D1 Extract":()=>$('D1 Extract'),"D2 Call anthropic":()=>$('D2 Call anthropic'),"D2B Extract":()=>$('D2B Extract'),"D3 Build":()=>$('D3 Build'),"D3 Call anthropic":()=>$('D3 Call anthropic'),"D3B Extract":()=>$('D3B Extract'),"D4 Call anthropic":()=>$('D4 Call anthropic'),"D4 Lexicon Sheet":()=>$('D4 Lexicon Sheet'),"D4 Verse Sheet":()=>$('D4 Verse Sheet'),"D4 Words Sheet":()=>$('D4 Words Sheet'),"Init Seats":()=>$('Init Seats'),"Init with Guards":()=>$('Init with Guards'),"Resolve Seats":()=>$('Resolve Seats')};
if(false){$('L2 Count Plan');}
const L2C=(T=>{const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))["L2C Build"];if(!M)throw new Error('pkgL2C: the Shared Library holds no L2C Build entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('pkgL2C: rebuilt L2C Build is '+S.length+', expected '+M.n);return new Function('$','__RF',"const REFP=new Proxy({},{get:(o,k)=>{const r=__RF();const x=r[k];return typeof x==='function'?x.bind(r):x;}});\n"+S+'\nreturn L2C;')($,()=>REFP);})($('Shared Library').params.jsCode);
const PRS_LB=(()=>{const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/;
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_GLOSS=/(?:^|[\s(,;:"“'‘])[*_]*([^\s()"“”,;:]{2,24}(?:\s+[^\s()"“”,;:]{2,24}){0,2})[*_]*\s*\(\s*([a-z][^()\n]{1,80}?)\s*\)/g;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
function lbFoot(block,full){let t=String(block==null?'':block).replace(/\*\*/g,'').replace(/__/g,'');t=t.replace(/(?<![A-Za-z])["“]([A-Za-z]{1,3})["”](?![A-Za-z])/g,'‘$1’');
 if(!full){const c=t.search(/^[ \t>*_#-]*(?:the\s+)?pressed(?:\s+(?:verses|witnesses))?\s*[.:]/im);if(c>0)t=t.slice(0,c);}
 const met=new Set();const src=/\[L2\]|\b(?:Greek|Hebrew|Aramaic)\b/i.test(t);let first=null;
 for(const s of t.split(/\n+|(?<=[.!?]["”’']?)\s+(?=[A-Z\[(])/)){const refs=[...s.matchAll(LB_REF)].map(m=>m[0].replace(/\.\s/,' '));
  const hasQ=/["“][^"”\n]{4,}?["”]|(?:^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/.test(s);
  for(const m of s.matchAll(LB_TL)){const w=m[2];const last=w.split(/\s+/).pop();if(DRV_TL_STOP.test(last)||DRV_TL_STOP.test(w.split(/\s+/)[0]))continue;
   if(DRV_SRC.test(w)||m[1]||src){met.add('L2');break;}}
  for(const m of s.matchAll(/(?:^|[\s(,;:"“'‘\]])([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24})\s*\(\s*(?:[GH]\d{1,5}\s*[,:;]\s*["“'‘]?[a-z][^()\n]{1,80}?|["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*[,;]\s*[GH]\d{1,5})\s*\)/g)){if(!DRV_TL_STOP.test(m[1])){met.add('L2');break;}}
  for(const m of s.matchAll(/([*_])([^*_\n]{2,40})\1\s*\(\s*["“'‘]?[a-z][^()\n\d]{1,80}?["”'’]?\s*\)/g)){if(m[2].split(/\s+/).some(w=>!DRV_TL_STOP.test(w)&&!/^[A-Z]/.test(w))){met.add('L2');break;}}
  if(DRV_SRC.test(s.replace(LB_REF,' ').replace(/["“][^"”]*["”]/g,' '))&&/\(\s*["“'‘]?[a-z][^()\n]{1,80}\)/.test(s))met.add('L2');}
 {const R=[...t.matchAll(LB_REF)].map(m=>({k:m[0].replace(/\.\s/,' '),a:m.index,b:m.index+m[0].length}));
  const Q=[...t.matchAll(/["“][^"”\n|]{4,}?["”]|(?<=^|[\s(:])['‘][^'’\n]{4,}?['’](?=$|[\s.,;:)\]])/g)].map(m=>({a:m.index,b:m.index+m[0].length}));
  for(const q of Q){const aft=R.find(r=>r.a>=q.b&&r.a-q.b<=4&&/^[\s(]*$/.test(t.slice(q.b,r.a)));const bef=R.filter(r=>r.b<=q.a&&q.a-r.b<=80).pop();const r=aft||bef;if(!r)continue;
   if(first===null){first=r.k;met.add('L1');}else if(r.k!==first)met.add('L3');}}
 return [...met].sort();}
return lbFoot;})();
const PRS=(()=>{
 const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
 const REF='(?:[1-3]\\s)?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?\\.?\\s\\d{1,3}:\\d{1,3}(?:\\s?[-–]\\s?\\d{1,3})?';
 const START=new RegExp('(^|(?<!(?:--|\\|)\\s*\\[L[1-4]\\][^\\n|]*);|;(?=[^;\\n]*--\\s*MEANS)|\\n|^\\s*[-*•]|\\n\\s*[-*•])\\s*[*_]*\\s*('+REF+')[*_]*\\s*[:,]?\\s*(?=["“])','g');
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
  for(const h of hits){const after=t.slice(h.pos,(e=>e<0?t.length:e)(t.indexOf('\n',h.pos))); /* ASK 651: the quotation is read to the end of its line (was 160 characters, which missed long verses such as Luke 1:35) */const before=t.slice(Math.max(0,h.pos-220),h.pos);
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
let PWL_R={};
const SHEET=(()=>{const BASE='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/kjv_verses?select=book,chapter,verse,text';const URL_MAX=7000;const CAP_V=150,CAP_C=24000;
 
 
 
 const text=(rows,P,head)=>{const idx={};(rows||[]).forEach(r=>{if(r&&r.book&&r.chapter!=null&&r.verse!=null)idx[r.book+' '+r.chapter+':'+r.verse]=String(r.text||'');});
  const keys=(P&&P.sheet_req)||[];const offU=new Set((P&&P.sheet_off_url)||[]);const lines=[],cap=[],miss=[];let n=0,ch=0;
  for(const k of keys){if(offU.has(k))continue;const t=idx[k];if(t==null){miss.push(k);continue;}if(n>=CAP_V||ch+t.length>CAP_C){cap.push(k);continue;}lines.push(k+' '+t);n++;ch+=t.length;}
  if(!keys.length)return '';const left=[].concat(offU.size?['not read (request size): '+[...offU].join(', ')]:[],cap.length?['over the cap of '+CAP_V+' verses or '+CAP_C+' characters: '+cap.join(', ')]:[],miss.length?['not in the KJV table as cited (no such verse, or the read failed): '+miss.join(', ')]:[]);
  return 'VERSE SHEET -- '+head+' Read by the system from the record\'s KJV table (kjv_verses), as stored: words in [brackets] are the KJV\'s italics or its margin notes. Quote only from this sheet, or from a verse you name with its full reference (book, chapter and verse) and quote exactly in the KJV.\n'+(lines.length?lines.join('\n'):'(no verse text could be read this round)')+(left.length?'\nLEFT OFF THE SHEET: '+left.join('; ')+'.':'');};
 return {text,CAP_V,CAP_C};})();
const REFP=(T=>{const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/'))).REFP;if(!M)throw new Error('pkgREFP: the Shared Library holds no REFP entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('pkgREFP: rebuilt REFP is '+S.length+', expected '+M.n);return new Function(S+'\nreturn REFP;')();})($('Shared Library').params.jsCode);  
const C4P=(()=>{
 const refs=t=>{const out=[];for(const r of REFP.parse(t,{scoped:true})){const b=r.book||r.ctx;if(!b)continue;const z=Math.max(r.v1,Math.min(r.v2,r.v1+30));const vs=[];for(let x=r.v1;x<=z;x++)vs.push(b+' '+r.c+':'+x);out.push({label:b+' '+r.label,vs,cv:r.label,bare:!r.book });}return out;};
 
 const U=(n,w)=>n.u&&n.u.length?'\n\n[CLOSE-ROUND BOOK CHECK -- by code: '+w+' writes '+n.u.join(', ')+' with no book; not marked NEW, not cleared: read the sentence for its book.]':'';
     
 
 
 
 const declared=F=>{const t=String(F&&F.cr1||'');const i=t.search(/DECLARED CHAIN\b/);if(i<0)return null;const a=t.lastIndexOf('\n',i)+1;const L=t.slice(a).split('\n');const out=[L[0]];let on=false,pre=0;
  for(const l of L.slice(1)){const num=/^\s*(?:#+\s*)?[*_]*\s*D?([0-9]+)[*_]*(?:[.:)](?![0-9])|\s+[-‐-―−]{1,3}(?:\s|$))[*_]*\s*\S/i.test(l);  if(num){on=true;out.push(l);continue;}if(!on){if(l.trim()){if(/^\s*#/.test(l)||++pre>3)break;}out.push(l);continue;}
   if(!l.trim()||/^\s+\S/.test(l)||/^\s*[-*•]\s/.test(l)){out.push(l);continue;}break;}
  return out.join('\n').replace(/\s+$/,'');};
 
 const cblocks=F=>{const t=String(F&&F.dr3||'');const H=[];for(const h of t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi))H.push({n:+h[1],at:h.index,head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim()});
  return H.map((x,i)=>({j:i+1,n:x.n,head:x.head,text:t.slice(x.at,i+1<H.length?H[i+1].at:t.length)}));};
 
 
 const RENUM=/\b(?:re-?number\w*|I\s+(?:now\s+)?number|number(?:ed|ing)?\s+(?:my|the|its|our|his)\s+(?:chain|links?|premises)|in\s+the\s+order\s+of\s+the\s+link\s+round|under\s+my\s+own\s+numbers?|(?:my|its|our)\s+own\s+number(?:s|ing)|in\s+the\s+order\s+(?:the|my|its|his|their)\s+[^.\n]{0,60}?\b(?:answer(?:s|ed)?|blocks?|list|took)\b|I\s+(?:now\s+)?(?:take|label|restate)\s+(?:them\s+)?[^.\n]{0,30}?\b[DC]1\s*[–—-]\s*[DC]\d|have\s+not\s+seen\s+the\s+text\s+of\s+my\s+(?:round\s+1\s+)?declaration)/i;
 const STOP=new Set('that this these those with from which whom what when where their there than then also into upon such have been were will would shall should could being does each very more most some only link links chain round rounds verse verses text says said stated state states before after because under over about against other another child text rows row stands stand holds hold named names'.split(' '));
 
 
 
 const MULTI=/^[ \t>#*_-]*\**\s*[DC]\d+\**\s*(?:,|and\b|&|\/|[-–—]\s*\**[DC]?\d)\s*\**\s*[DC]?\d/i;
 
 
 
 
 const GRADE=[['own measure',/\b(?:by|on|in)\s+(?:the\s+)?(?:challenger|defender|defence|defense)['’]s\s+own\s+(?:measure|reading|terms|words|account|admission|rows?)\b/i],
  ['no reading offered',/\b(?:challenger|defender|defence|defense)\s+(?:has\s+|had\s+)?(?:offered|offers|gave|gives|has|had|left|leaves)\s+no\s+(?:reading|answer|footing|row|reply|response|account|ground)\b/i],
  ['concession claimed',/\b(?:(?:the\s+)?(?:challenger|defender)|\b[CD]\d+)\s+(?:has\s+|had\s+)?(?:conced(?:es|ed)|grant(?:s|ed)|admit(?:s|ted)|dropp(?:ed)|drops|abandon(?:s|ed)|gave\s+up|gives\s+up)\b/i],
  ['link graded',/\b[CD]\d+(?:\s*(?:,|and|&)\s*[CD]\d+)*\s+(?:is|are|was|were|stands?|lies)\s+(?:refused|broken|refuted|false|unfooted|unsupported|unexhibited|void|collapsed|defeated|overturned|answered|unanswered|fails?)\b/i],
  ['inference graded',/\b(?:each\s+)?(?:stands?|rests?)\s+on\s+(?:an?\s+)?inferences?\b[^.]{0,60}\b(?:do(?:es)?\s+not|never|no)\b/i],
  ['link argued against',/\b[CD]\d+\s+(?:answers|argues|claims|routes|reads|rests)\s+(?:by|that|on)\b|^\s*Against\s+that\b/i],
  ['link left unanswered',/\b(?:left|leaves)\s+[^.]{0,80}\bunanswered\b/i],
  ['ground conceded heading',/^#{1,4}\s*(?:ground|points?|links?)\s+(?:the\s+)?(?:challenger|defender)\s+(?:conceded|granted|dropped)\b/i],
  ['refused',/\brefused\b|\brefutes?\b|\brefuted\b/i],['fails',/\bfail(?:s|ed)?\b/i],
  ['does not stand',/\b(?:does|do|did)\s+not\s+(?:stand|hold|carry|follow|touch|show|name|state|say|reach|bear)\b|\bcannot\s+(?:stand|hold|carry|bear)\b|\bis\s+not\s+(?:stated|shown|written)\s+(?:by|in)\b/i],
  ['inference not stated',/\binferences?\b[^.]{0,80}\b(?:not|never)\s+(?:state|stated|say|said|written)\b/i],
  ['concedes',/\bconced(?:es|ed)\b|\bgrant(?:s|ed)\b|\badmit(?:s|ted)\b/i],
  ['breaks',/\b(?:breaks?|broke|collapses?|collapsed)\b/i],
  ['none of them',/\bnot\s+one\s+of\b|\bnone\s+of\s+(?:them|these|those|its|his|her|their)\b/i]];
 
 
 
 
 
 
 return {refs,declared,cblocks,};})();
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const __RND='D4';const __AID=m=>{const x=String(m||'');return /^anthropic\//.test(x)?x.slice(10).replace(/\./g,'-'):x;};const __AOK=id=>/^claude-(?:opus|sonnet|fable|mythos)-\d+(?:-\d+)?$/.test(String(id||''));const __AIDV=m=>{const id=__AID(m);if(!__AOK(id))throw new Error('VALIDATION: '+__RND+' the model "'+m+'" maps to the direct Anthropic id "'+id+'", which is not a known form; no call made.'+RT);return id;};
const __DIAGPREV=sd=>{const n=+__RND[1];const top=sd===__RND[0]?n-1:(sd==='D'?n:n-1);for(let k=top;k>=1;k--){let o=null;try{const p=__L[sd+k+' Call anthropic']();if(!p||!p.isExecuted)continue;o=p.first().json;}catch(e){continue;}if(o&&typeof o.id==='string'&&/^msg_/.test(o.id))return o.id;}return null;};
let __DPREV=null;
const FAMS=['anthropic','openai','gemini','grok','mimo','openrouter','deepseek'];
const __cc={type:'ephemeral',ttl:'1h'};const __sysB=s=>{const i=s.indexOf('\n\n=== DEFENSE DISCIPLINE');return i>0?[{type:'text',text:s.slice(0,i),cache_control:__cc},{type:'text',text:s.slice(i),cache_control:__cc}]:[{type:'text',text:s,cache_control:__cc}];};
const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);
const bodyFor=(fam,model,tok,sys,msgs)=>{
 if(fam==='anthropic')return {model:__AIDV(model),max_tokens:tok,system:__sysB(sys),messages:__mk(msgs),diagnostics:{previous_message_id:__DPREV}};
 if(fam==='gemini')return {systemInstruction:{parts:[{text:sys}]},contents:msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:tok}};
 const m=[{role:'system',content:sys},...msgs];
 if(fam==='openai')return {model,max_completion_tokens:tok,messages:m};
 if(fam==='openrouter'&&/^anthropic\//.test(model))return {model,max_tokens:tok,messages:[{role:'system',content:__sysB(sys)},...__mk(msgs)]};  if(fam==='openrouter'&&/^(?:x-ai|xiaomi)\//.test(model))return {model,max_tokens:tok,messages:m};  if(fam==='openrouter'&&/^google\//.test(model))return {model,max_tokens:tok,messages:m};
 if(fam==='openrouter'&&/^openai\//.test(model))return {model,max_tokens:tok,messages:m};
 if(fam==='openrouter')return {model,max_tokens:tok,messages:m};
 return {model,max_tokens:tok,messages:m};};
const I=$('Init with Guards').first().json;const R=$('Resolve Seats').first().json;
const call=(seat,sys,msgs)=>{const idx=FAMS.indexOf(seat.fam);__DPREV=seat.fam==='anthropic'?__DIAGPREV(seat===R.defender?'D':'C'):null;if(idx<0)throw new Error('ORACLE_DEBATE_V1: no call path for family '+seat.fam+RT);return {fam:seat.fam,fam_idx:idx,model:seat.model,body:__orc(bodyFor(seat.fam,seat.model,seat.tok,sys,msgs),seat.fam,seat.model,TOK+':'+(seat===R.defender?'defender':'challenger')),...(seat.fam==='anthropic'?{diag_prev:__DPREV}:{})};};
const PWL=(()=>{
 const BOOKS="Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation".split('|');
 const key=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
 const BK={};BOOKS.forEach(b=>{BK[key(b)]=b;});
 Object.assign(BK,{psalm:'Psalms',song:'Song of Solomon',gen:'Genesis',exod:'Exodus',exo:'Exodus',ex:'Exodus',lev:'Leviticus',num:'Numbers',deut:'Deuteronomy',dt:'Deuteronomy',josh:'Joshua',judg:'Judges','1sam':'1 Samuel','2sam':'2 Samuel','1kgs':'1 Kings','2kgs':'2 Kings','1chr':'1 Chronicles','2chr':'2 Chronicles',neh:'Nehemiah',esth:'Esther',ps:'Psalms',psa:'Psalms',prov:'Proverbs',eccl:'Ecclesiastes',isa:'Isaiah',jer:'Jeremiah',lam:'Lamentations',ezek:'Ezekiel',dan:'Daniel',hos:'Hosea',mic:'Micah',hab:'Habakkuk',zech:'Zechariah',mal:'Malachi',matt:'Matthew',mt:'Matthew',mk:'Mark',lk:'Luke',jn:'John',rom:'Romans','1cor':'1 Corinthians','2cor':'2 Corinthians',gal:'Galatians',eph:'Ephesians',phil:'Philippians',col:'Colossians','1thess':'1 Thessalonians','2thess':'2 Thessalonians','1tim':'1 Timothy','2tim':'2 Timothy',heb:'Hebrews',jas:'James','1pet':'1 Peter','2pet':'2 Peter','1jn':'1 John',rev:'Revelation','1chron':'1 Chronicles','2chron':'2 Chronicles',hag:'Haggai'});
 const CHL=(()=>{const o={};'Luke=80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53|Jeremiah=19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34|Zechariah=21,13,10,14,11,15,14,23,17,12,17,14,9,21|Malachi=14,17,18,6|Matthew=25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20|Psalms=6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6|Judges=36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25|Mark=45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20|Ruth=22,23,18,22|1 Samuel=28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13|Exodus=22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38|1 Chronicles=54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30|2 Chronicles=17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23|Leviticus=17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34|Revelation=20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21|2 Kings=18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30|Deuteronomy=46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12|Genesis=31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26|2 Corinthians=24,17,18,18,21,18,16,24,15,18,33,21,14|Proverbs=33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31|1 Kings=53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53|Galatians=24,21,29,31,26,18|John=51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25|Job=22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17|Romans=32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27|Ephesians=23,22,21,32,33,24|Acts=26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31|Ecclesiastes=18,26,22,16,20,12,29,17,18,20,10,14|Philippians=30,30,21,23|Colossians=29,23,25,18|1 Thessalonians=10,20,13,18,28|1 Corinthians=31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24|2 Thessalonians=12,17,18|Song of Solomon=17,17,11,16,16,13,13,14|Joshua=18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33|1 Timothy=20,15,16,16,25,21|Isaiah=31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24|2 Timothy=18,26,17,22|Titus=16,15,15|Daniel=21,49,30,37,31,28,28,27,27,21,45,13|Philemon=25|Hebrews=14,18,19,16,14,20,28,13,28,39,40,29,25|Hosea=11,23,5,19,15,11,16,14,17,15,12,14,16,9|Numbers=54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13|Joel=20,32,21|Ezra=11,70,13,24,17,22,28,36,15,44|Amos=15,16,15,13,27,14,17,14,15|Obadiah=21|Jonah=17,10,10,11|Micah=16,13,12,13,15,16,20|Nehemiah=11,20,32,23,19,19,73,18,38,39,36,47,31|2 Samuel=27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25|Nahum=15,13,19|Habakkuk=17,20,19|Zephaniah=18,15,20|Haggai=15,23|Lamentations=22,22,66,22,22|Esther=22,23,15,17,14,14,10,17,32,3|Ezekiel=28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35|James=27,26,18,17,20|1 Peter=25,25,22,19,14|2 Peter=21,22,18|1 John=10,29,24,21,21|2 John=13|3 John=14|Jude=25'.split('|').forEach(x=>{const p=x.split('=');o[p[0]]=p[1].split(',').map(Number);});return o;})();
 const isVerse=(bk,cv)=>{const L=bk?CHL[bk]:null;if(!L)return true;const a=String(cv).split(':');const n=L[+a[0]-1];return !!n&&+a[1]>=1&&+a[1]<=n;};
 const verses=(c,v,tail)=>{const out=[+v];let last=+v;for(const m of String(tail||'').matchAll(/([–—-]|,)\s?(\d{1,3})(?!\d|:)/g)){const n=+m[2];if(m[1]===','){out.push(n);last=n;}else{for(let x=last+1;x<=n&&x-last<=12;x++)out.push(x);last=n;}}return out.map(x=>c+':'+x);};
 const TAIL='((?:\\s?[–—-]\\s?\\d{1,3}(?!\\d|:\\d)|\\s?,\\s?\\d{1,3}(?!\\d|:\\d|\\s+[A-Z]))*)';
 const refs=(t,scoped)=>REFP.parse(t,{scoped:!!scoped}).map(r=>{const cvs=verses(r.c,r.v1,r.v2>r.v1?'-'+r.v2:'');return {book:r.book,cv:cvs[0],cvs,label:r.label,ctx:r.ctx};}).map(r=>({...r,cvs:r.cvs.filter(cv=>isVerse(r.book||r.ctx,cv))})).filter(r=>r.cvs.length).map(r=>({...r,cv:r.cvs[0]}));
 const namedIn=t=>{const s=new Map();for(const r of refs(t,true))for(const cv of r.cvs){if(!s.has(cv))s.set(cv,{books:new Set(),bare:false,inh:new Set()});const f=s.get(cv);if(r.book)f.books.add(r.book);else{f.bare=true;if(r.ctx)f.inh.add(r.ctx);}}return s;};
 const isNamed=(N,bk,cv)=>{const f=N.get(cv);if(!f)return false;if(!bk||f.books.has(bk)||f.inh.has(bk))return true;return false;};
 const lastHead=(t,re)=>{let i=-1;for(const m of String(t||'').matchAll(re))i=m.index;return i;};
 const items=t=>String(t||'').split(/\n(?=\s*(?:#{1,6}\s*)?\**\s*(?:\d+[.)]\**\s|LINK\s+(?:\d+|none)\s*:))/i).reduce((a,x,i,A)=>{const H=y=>/^\s*(?:#{1,6}\s*)?\**\s*(?:\d+[.)]\**\s|LINK\s+(?:\d+|none)\s*:)/i.test(y)&&(a.f===null||a.f===/^\s*#/.test(y));if(a.f===null&&H(x))a.f=/^\s*#/.test(x);if(H(x))a.p.push(x);else if(a.p.length&&!(/^\s*$/.test(x)&&i+1<A.length&&H(A[i+1])))a.p[a.p.length-1]+='\n'+x;return a;},{p:[],f:null}).p; /* ASK 626 */
 const side=(pressing,answering,headRe)=>{const i=lastHead(pressing,headRe);if(i<0)return {list:false,premises:[]};
  const list=String(pressing).slice(i);const N=namedIn(answering);
  const premises=items(list).map((x,k)=>{const lk=(x.match(/LINK\s+(\d+|none)\b/i)||[])[1]||null;const seen=new Set();const notNamed=[];let named=0;
   const pwi=x.search(/PRESSED WITH\s*:/i);let xw=pwi<0?'':x.slice(pwi);{const b=xw.search(/\n\s*\n/);if(b>=0)xw=xw.slice(0,b);}if(/^PRESSED WITH\s*:\s*[*_]*\s*none\b/i.test(xw))xw='';
   let nk=0;const kk=new Set();
   const PRSP=(typeof PRS!=='undefined'&&xw)?PRS.premise(xw,PWL_R,headRe===CH_RE?'CR3':'DR2',null):null;const unp=[];
   for(const r of refs(xw)){const label=((r.book||r.ctx)?((r.book||r.ctx)+' '):'')+r.label;if(PRSP&&!r.cvs.some(cv=>{const z=(r.book||r.ctx||'')+' '+cv;return PRSP.verses.some(v=>v.key===z)||(PRSP.over||[]).includes(z);}))continue; /* ASK 652: a verse inside a press line ([L3], MEANS) is not a press: not labelled, not counted to the cap */if(seen.has(label))continue;const nw=r.cvs.filter(cv=>!kk.has((r.book||r.ctx||'')+' '+cv));if(nk>=8&&nw.length)continue;nw.forEach(cv=>kk.add((r.book||r.ctx||'')+' '+cv));nk+=nw.length;seen.add(label);
    {const ks=r.cvs.map(cv=>(r.book||r.ctx||'')+' '+cv);if(PRSP&&!ks.some(z=>PRSP.verses.some(v=>v.key===z&&v.cls!=='UNPROVEN'))){unp.push(label);continue;}}
    if(r.cvs.some(cv=>isNamed(N,r.book||r.ctx||'',cv)))named++;else notNamed.push(label);}
   return {n:k+1,link:lk,verses:seen.size,named,notNamed,unp};});
  return {list:true,premises};};
 const LF=String.fromCharCode(10);
 const PSENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;
 const DEF_RE=/UNSUPPORTED-L4 PREMISES/gi, CH_RE=/CHALLENGER.S UNSUPPORTED-L4 PREMISES/gi;
 
 
 
 
 
 
 
 
 
 return {DEF_RE,CH_RE,side,namedIn,isNamed};})();
const RW={cr1:$('D1 Extract').first().json.raw,gr1:$('C1B Extract').first().json.raw,cr2:$('D2B Extract').first().json.raw,gr2:$('C2B Extract').first().json.raw,cr3:$('D3B Extract').first().json.raw,dr3:$('C3B Extract').first().json.raw};
const OPEN=(()=>{try{const LF=String.fromCharCode(10);const out=[];PWL_R=(typeof PRS!=='undefined'?PRS.RND(RW):{});
 const s=PWL.side(RW.gr2,String(RW.cr2||'')+LF+String(RW.cr3||''),PWL.DEF_RE);
 const pl=s.list?s.premises.filter(p=>p.notNamed.length):[];
 out.push('(a) PRESSED PREMISES (the list that closes the challenger\'s round 2), proven presses (md_notes_rulings 398) carried under PRESSED WITH that no defender round after it names:');
 out.push(s.list?(pl.length?pl.map(p=>'premise '+p.n+(p.link?' (LINK '+p.link+')':'')+': NOT NAMED: '+p.notNamed.join(', ')).join(LF):'none: every verse those premises carry under PRESSED WITH is named in your round 2 or your link round'):'no premise list was found at the end of the challenger\'s round 2');
 {const up=s.list?s.premises.filter(p=>p.unp&&p.unp.length):[];if(up.length)out.push('(b) UNPROVEN PRESSES, not witnesses (md_notes_rulings 398: no MEANS sentence with an [L2] or [L3], and no checked PROVEN IN reference); leaving them unanswered costs you nothing: '+up.map(p=>'premise '+p.n+': '+p.unp.join(', ')).join('; '));}
 return 'STILL UNANSWERED AGAINST YOUR CHAIN -- computed by the system from the transcript, not by a model; a verse listed here is unanswered by the rule until a round of yours names it and answers it:'+LF+out.join(LF);}catch(e){return 'STILL UNANSWERED AGAINST YOUR CHAIN: the system could not compute the list this run; answer every witness the challenger pressed that your rounds have not named.';}})();
const G1F={cr1:$('D1 Extract').first().json.raw,dr3:$('C3B Extract').first().json.raw};
const G1DECL=(()=>{try{const d=C4P.declared(G1F);return d?'YOUR DECLARED CHAIN -- your round 1 DECLARED CHAIN, copied verbatim by the system. Keep these numbers in this round: D<n> is link n of this list and no other link; do not renumber, relabel or reorder the links:\n'+d:'YOUR DECLARED CHAIN: the system found no DECLARED CHAIN heading in your round 1; keep the numbers your round 1 gave its links.';}catch(e){return '';}})();
const G1CL=(()=>{try{const c=C4P.cblocks(G1F);return c.length?'THE C NUMBERS -- the LINK blocks of the challenger\'s round 3 link round, in its order, read by the system; C<j> is the j-th block and no other:\n'+c.map(x=>'C'+x.j+' = [DR3] '+x.head.slice(0,220)).join('\n'):'';}catch(e){return '';}})();
const OGR=(()=>{
 const RX=/\bI\s+(?:(?:also|now|further|readily|freely|fully|plainly|openly|likewise|therefore|thus|hereby|still|so)\s+){0,2}(?:do\s+not\s+claim|no\s+longer\s+claim|no\s+longer\s+rest|withdraw|grant|concede|drop|admit|retract|give\s+up)\b|(?:^|(?<=[.!?]["”')\]]?\s+)|(?<=\n[ \t>*#-]*))(?:Granted|Conceded|CONCEDED)\b/g;
 const N=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
 const W=s=>N(s).toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 const RX2=/\b(?:is|are)\s+(?:(?:readily|freely|fully|plainly|also|therefore|thus|so)\s+)?(?:granted|conceded)\b/g;  
 function harvest(R,wide){const out=[];const seen=new Set();
  for(const rk of ['CR1','CR2','CR3','CR4']){const t=N(R&&R[rk]);if(!t)continue;
   for(const m of (wide?[...t.matchAll(RX),...[...t.matchAll(RX2)].map(x=>(x.__w=true,x))].sort((p,q)=>p.index-q.index):t.matchAll(RX))){const ls=t.lastIndexOf('\n',m.index)+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);
    if(/^\s*#/.test(ln)&&!/[.!?]["')\]]?\s*$/.test(ln))continue;
    if((bf.match(/"/g)||[]).length%2===1)continue;
    if(/^(?:\s*,?\s*(?:and\s+|or\s+)?(?:set\s+aside|(?:do\s+not\s+claim|no\s+longer\s+claim|no\s+longer\s+rest|withdraw|grant|concede|drop|admit|retract|give\s+up)))*\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length)))continue; 
    let __ld=bf.replace(/^[\s>*#-]*(?:\[[A-Za-z]{1,3}\d*\][\s:]*)*/,'');{const __b=[...__ld.matchAll(/[.!?]["')\]]?\s+/g)];if(__b.length){const __e=__b[__b.length-1];__ld=__ld.slice(__e.index+__e[0].length);}if(__ld.length>160){__ld=__ld.slice(-160);__ld=__ld.slice(__ld.indexOf(' ')+1);}} const ss=ln.slice(m.index-ls).split(/(?<=[.!?])["')\]]?\s/);let s=__ld+ss[0];if(s.split(/\s+/).length<7&&ss[1])s=s+' '+ss[1];if(/^what i (?:\w+ ){0,2}(?:grant|withdraw|concede|drop|admit|retract|give up|set aside|release|no longer (?:claim|rest)|do not claim)(?: and what i (?:\w+ ){0,2}(?:grant|withdraw|concede|drop|admit|retract|give up|set aside|release|no longer (?:claim|rest)|do not claim))?$/.test(W(s)))continue;if(/\?["')\]]?$/.test(ss[0].trim())||/^(?:if|unless|should|nor)\b[^,;:]*$/i.test(__ld.trim()))continue;  if(m.__w){const ld=__ld.trim();if(/^(?:nothing|none|no|neither|nor|what)\b/i.test(ld)||/\b(?:where|if|unless|once|when|whether|until|after|since|because|though|although)\b/i.test(ld)||/^\s+by\s+(?:the\s+)?(?:defender|challenger|other\s+side|opponent)\b/i.test(t.slice(m.index+m[0].length))||/\bI\s+(?:\w+\s+){0,2}(?:grant|concede|withdraw|drop|admit|retract)\b/i.test(ld))continue;if(/^(?:that|this|it|these|those|both|each|which)\b/i.test(ld)){const pv=(t.slice(0,m.index-__ld.length).split('\n').filter(l=>l.trim()).pop()||'').trim();let ps=(pv.split(/(?<=[.!?]["')\]]?)\s+/).pop()||'').replace(/^[\s>*#-]*(?:\[[A-Za-z]{1,3}\d*\][\s:]*)*/,'');if(ps.length>200){ps=ps.slice(-200);ps=ps.slice(ps.indexOf(' ')+1);}if(ps&&!/^#/.test(pv))s=ps+' '+s;}}  
  s=s.slice(0,m.__w?420:260).trim();const k=W(s);if(k.split(' ').length<3||seen.has(k))continue;seen.add(k);
    out.push({g:out.length+1,round:rk,text:s});}}
  return out;}
 return {harvest};})();
const OWR=(R,G)=>{try{const st=x=>String(x).replace(/[*_`]+/g,'').replace(/^[\s>#-]+/,'').trim();const MK=/^(?:LINK\s+|[DC])(\d+)\s*(?:\[[^\]\n]*\]|\([^)\n]*\))?\s*:\s*(?:NARROWED TO|CONCEDED?|WITHDRAWN|DROPPED)\b/i;const out=[];for(const [rk,t] of R)for(const l of String(t||'').split('\n')){const s=st(l);if(MK.test(s))out.push('['+rk+'] '+s.slice(0,260));}for(const g of (G||[]))out.push('['+R[+String(g.round).slice(2)-1][0]+'] "'+g.text+'"');return out.length?'YOUR OWN RECORD -- computed by the system from the transcript, not by a model: each line of your earlier rounds that narrows, concedes, withdraws or drops one of your links, and each sentence in which you grant, concede, withdraw or drop footing, word for word with its round. Your close may keep these or go further; it may not deny any of them, or restore what they narrowed, conceded, withdrew or dropped:\n'+out.join('\n'):'';}catch(e){return '';}};  
const __OWB=(()=>{try{const R=[['CR1',$('D1 Extract').first().json.raw],['CR2',$('D2B Extract').first().json.raw],['CR3',$('D3B Extract').first().json.raw]];return OWR(R,OGR.harvest({CR1:R[0][1],CR2:R[1][1],CR3:R[2][1]},true));}catch(e){return '';}})();
const sys=I.dsys;const msgs=[{role:'user',content:'SUBJECT: '+I.topic+'\n\nYou opened as the DEFENDER, holding '+$('Init Seats').first().json.dpos+' of the topic. The challenger\'s LINK ROUND reply follows; in it the challenger answered your premise list and may have pressed further witnesses against your chain:\n\n'+$('C3B Extract').first().json.raw+'\n\n'+(G1DECL?G1DECL+'\n\n':'')+(G1CL?G1CL+'\n\n':'')+OPEN+(__OWB?'\n\n'+__OWB:'')+'\n\nCLOSE ROUND -- your final defense. This is the defender\'s last round; the challenger\'s close follows it and may not press anything new. Make your final defense of your declared chain D1..Dn, and answer every witness pressed against it that is still unanswered: each verse listed above, and above all those the challenger pressed in its link round. For each, write a line ANSWER: <book chapter:verse> -- D<n> -- then quote that verse exactly in the KJV and show from the text why it does not overturn that link.'+((($('Init Seats').first().json.defender||{}).profile==='oracle')?'\n\nANSWER AT THE PRESSED VERSE. For every verse pressed against you, take that verse itself through the four layers before any other row.\nLayer 1 — What Does the KJV Actually Say? "Read the verse. Read the surrounding verses."\nLayer 2 — What Does the Hebrew or Greek Actually Mean? "what did the original word carry?"\nLayer 3 — What Does the Rest of Scripture Say? "The meaning is assembled across passages, not extracted from one."\nLayer 4 — Inference, Named as Inference. "an inference presented as text is the primary failure mode this method exists to prevent." "every Layer 4 step is flagged as exactly what it is." L4 must have two supporting layers.\nUnder each ANSWER line take the pressed verse itself through the four layers, each on its own line, beginning with its tag: [L1] the pressed verse, with its book, chapter and verse written again at the start of that line and its words quoted; [L1] another verse of its chapter, quoted with its reference; [L2] each word of that verse the challenger pressed, by its Strong\'s number from the [L2] SHEET, with its meaning; [L3] a verse of another passage, quoted with its reference; [L4] your opponent\'s words: [<round>] "<their words, 6 or more, word for word>"; [L4] the inference from those layers that shows the fit with D<n>, naming the pressed word.':'')+' A witness answered in substance, without its book, chapter and verse named and its words quoted, is not counted as answered. You may keep a link (the footing already exhibited), narrow it (NARROWED TO: <the limb you keep>, with its footing) or concede it (CONCEDED); do not add links or re-seat the chain. Narrowing or conceding carries no conduct penalty: it is weighed on the merits, and a part left out of a narrowed restatement counts as dropped. A close sentence that denies what your earlier rounds granted, or restores a link or a part you narrowed, conceded or dropped, contradicts your own record: your chain is broken by default, the system sends no request to correct it, and a later withdrawal does not undo it. Keep the numbering: D1..Dn exactly as your round 1 DECLARED CHAIN numbers them, and C1..Cm as the challenger\'s link round numbers its LINK blocks; do not renumber (the system flags a close round that does). This round defends: do not press new witnesses or premises against the challenger, who has no round to answer them; the judges do not count a press made here. Cite every verse by book, chapter and verse and quote it exactly in the KJV.'+((($('Init Seats').first().json.defender||{}).profile==='oracle')?' GAPS LEFT OPEN: track every question you put to your opponent in your earlier rounds -- each premise you listed against the opponent\'s words, and each verse you pressed under it -- that no later round of the opponent answered. Restate each in one line: GAP: premise <n> [<the round that listed it>] -- <the verse you pressed, by book, chapter and verse> -- UNANSWERED. Write the line in exactly that form: no quotation and no other words. Name only premises your earlier rounds listed and verses your earlier rounds pressed under them; a gap restated here is not a new press. If none is left, write GAPS: NONE.':'') /* ASK 537: GAPS LEFT OPEN, Oracle seat only */}];
const __SHT=(()=>{try{const P=$('C3B Extract').first().json;let rows=[];try{rows=$('D4 Verse Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){rows=[];}return SHEET.text(rows,{sheet_req:P['sheet_req']||[],sheet_off_url:P['sheet_off_url']||[]},'the KJV text of every verse cited so far in this debate, by either side, in the order first cited.');}catch(e){return '';}})();
if(__SHT){for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__SHT};break;}}}
const __PROVE9="PROVEN STRUCTURE (md_notes_rulings 397 to 400: the layers are the language of this debate). Every critical point you write carries its layers: a declared link, a listed premise's supporting block, a press, an answer to a press, and every [L4]. [L1] is a KJV verse quoted with its book, chapter and verse. [L2] is a Hebrew or Greek word named (its dictionary form, transliteration or Strong's number) with its meaning; it counts only when the word stands in a verse the same block cites. [L3] is any further verse quoted with its reference after the [L1] verse, as its support (ruling 400). [L4] is an inference: it stands only on two lower layer kinds and the chain from them. At a critical point, a statement of what a verse means without its layers is a bare claim and carries no weight. An answer to a press shows, with layers, how the witness's meaning fits your link; restating your link's own footing while passing over the witness is not an answer. The charge sentence of a premise list (that the other side's inference lacks footing) is exempt; the witnesses under it carry the layers. A count of occurrences names its unit, verses or tokens (for example \"H5959: 7 verses\"); the system recomputes it from the record.";
const __KEEP=(()=>{const s=new Set();for(const n of ['D1 Extract','C1B Extract','D2B Extract','C2B Extract','D3B Extract','C3B Extract']){try{const x=$(n);if(x&&x.isExecuted){for(const m of String(x.first().json.raw||'').matchAll(/\b([GH])0*(\d{1,5})\b/g))s.add(m[1]+m[2]);}}catch(e){}}return s;})();
const __L2S=(()=>{try{if(typeof L2C==='undefined')return '';const P=$('C3B Extract').first().json;let ow=[],lx=[];try{ow=$('D4 Words Sheet').all().map(i=>i.json).filter(x=>x&&x.book);}catch(e){ow=[];}try{lx=$('D4 Lexicon Sheet').all().map(i=>i.json).filter(x=>x&&x.strongs_number);}catch(e){lx=[];}return L2C.sheet(ow,lx,{...P,l2_keep:[...__KEEP]});}catch(e){return '';}})();
{const __X9=[__PROVE9,__L2S].filter(Boolean).join('\n\n');for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__X9};break;}}}
{const __PL=(()=>{try{if(!((($('Init Seats').first().json.defender||{}).profile)==='oracle'))return [];return (T=>{const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))['PRESS LIST'];if(!M)throw new Error('ASK 628: the Shared Library holds no PRESS LIST entry');const S=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');if(S.length!==M.n)throw new Error('ASK 628: rebuilt PRESS LIST is '+S.length+', expected '+M.n);return new Function(S+'\nreturn PRESSL;')();})($('Shared Library').params.jsCode).pressed([RW.gr1,RW.gr2,RW.dr3]);}catch(e){return [];}})(); /* ASK 628: the verses pressed against the Oracle defender, given to its close */
 if(__PL.length){const __T='THE VERSES PRESSED AGAINST YOU -- computed by the system, not by a model: every verse the challenger carried under PRESSED WITH in its rounds 1 to 3 ('+__PL.length+'): '+__PL.join('; ')+'. Write one ANSWER line for each of them in this close, in the ANSWER form above.';for(let k=msgs.length-1;k>=0;k--){if(msgs[k]&&msgs[k].role==='user'&&typeof msgs[k].content==='string'){msgs[k]={...msgs[k],content:msgs[k].content+'\n\n'+__T};break;}}}}
const __ZH=(side,prev,seat,ms)=>{if(!(seat&&seat.fam==='openrouter'&&/^(?:z-ai|qwen)\//.test(String(seat.model||''))))return ms;try{const pb=__L[side+prev+' Build']().first().json.call.body;const raw=__L[side+prev+'B Extract']().first().json.raw;  if(!pb||!Array.isArray(pb.messages)||typeof raw!=='string'||!raw)return ms;return pb.messages.filter(m=>m&&m.role!=='system').concat([{role:'assistant',content:raw}],ms);}catch(e){return ms;}};
return [{json:{run_token:TOK,round:'D4',open_list:OPEN,call:call(R.defender,sys,__ZH('D','3',R.defender,msgs))}}];