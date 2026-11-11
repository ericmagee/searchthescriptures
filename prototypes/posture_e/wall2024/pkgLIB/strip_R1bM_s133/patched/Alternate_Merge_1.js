const __CSP=(()=>{
const CLR=(()=>{
 const LBL=/^\s*(?:[-\u2022>]\s*|\d+[.)]\s+)?\**\s*(?:[A-Z][A-Z0-9 '\/()-]{2,60}:|D\d+\s+vs\.?\s+C\d+|C\d+\s+vs\.?\s+D\d+|\[|FORCED\b|RESULT\b|KEYSTONE\b|CLAUSE\b|#)/;
 const COUNTED=/^(UNEXHIBITED|CONCEDED|WITHDRAWN)$/i,TAGS='UNEXHIBITED|CONCEDED|WITHDRAWN|VOID|SPARED|SUPPORTED';
 const un=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/\\+"/g,'"');
 function block(text,side){const L=un(text).split('\n');const lab=side==='CHALLENGER'?/^\s*(?:[-\u2022>]\s*)?\**\s*CHALLENGER CONCEDED LINKS\**\s*:\s*\**\s*(\d+)?/i:/^\s*(?:[-\u2022>]\s*)?\**\s*(?:DEFENDER )?CONCEDED LINKS\**\s*:\s*\**\s*(\d+)?/i;
  let at=-1,cnt=null;L.forEach((l,i)=>{const m=l.match(lab);if(m){at=i;cnt=m[1]!=null?+m[1]:null;}});if(at<0)return null;
  const parts=[L[at].replace(lab,'')];for(let i=at+1;i<L.length&&i<at+12;i++){const l=L[i];if(!l.trim())break;if(LBL.test(l.replace(/[*_`]/g,'')))break;parts.push(l);}
  return {count:cnt,line:L[at].trim(),cont:parts.length-1,body:parts.join(' ').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim()};}
 const REF=new RegExp('(?:\\b(premises?|items?|links?|counted:?)\\s+((?:\\d+(?:\\s*(?:,|and|&|–|-|to|through)\\s*)*)+)|\\b([CD])(\\d)\\b|\\((\\d)\\)|(?:^|--|;|:)\\s*(\\d)(?=\\s+(?:'+TAGS+')\\b))','gi');
 const nums=s=>{const o=[];const t=String(s).replace(/\s+/g,' ');for(const m of t.matchAll(/(\d+)\s*(?:[–-]|to|through)\s*(\d+)|(\d+)/g)){if(m[1]){for(let k=+m[1];k<=+m[2]&&k<=+m[1]+9;k++)o.push(k);}else o.push(+m[3]);}return o;};
 function entries(body){const out=[];if(!body)return out;
  let b=body.replace(/"[^"]*"|\u201c[^\u201d]*\u201d|\u2018[^\u2019]*\u2019|(?<=[\s(])'[^']{3,}?'(?=[\s,.;:)]|$)/g,m=>' '.repeat(m.length));
  const own=[];b=b.replace(/\(([^()]*)\)/g,(m,c,off)=>{const k=c.match(/^\s*(?:\[?DR2\]?\s*)?LINK\s+(\d+|none)\b/i);if(k)own.push({at:off,link:/none/i.test(k[1])?'none':+k[1]});return /^\s*\d\s*$/.test(c)?m:' '.repeat(m.length);});
  for(const cl of splitClauses(b)){const lead=cl.text.match(new RegExp('^\\s*(?:--\\s*)?(?:counted\\s*:?\\s*)?('+TAGS+')\\b(?:\\s*\\(stated\\))?\\s*:','i'));
   const refs=[...cl.text.matchAll(REF)];
   for(let r=0;r<refs.length;r++){const m=refs[r];let ref,ns;
    if(m[1]){const w=m[1].toLowerCase();ref=/^link/.test(w)?'LINK':'PREMISE';ns=nums(m[2]);}else if(m[3]&&!new RegExp('^\\s*[:(\\-\\s]*('+TAGS+')\\b','i').test(cl.text.slice(m.index+m[0].length))){continue;}else if(m[3]){ref=m[3];ns=[+m[4]];}else if(m[5]){ref='PREMISE';ns=[+m[5]];}else{ref='PREMISE';ns=[+m[6]];}
    const from=m.index+m[0].length;let nx=r+1;let inl=null;
    if(ref==='PREMISE'&&ns.length===1&&refs[nx]&&/^link/i.test(refs[nx][1]||'')&&/^\s*$/.test(cl.text.slice(from,refs[nx].index))){const k=nums(refs[nx][2]);if(k.length===1){inl=k[0];r++;nx++;}}
    const from2=inl!=null?refs[r].index+refs[r][0].length:from;const to=nx<refs.length?refs[nx].index:cl.text.length;const seg=cl.text.slice(from2,to);
    let tg=(seg.match(new RegExp('\\b((?:NOT|not|none|no)\\s+)?(UNEXHIBITED|CONCEDED|WITHDRAWN|VOID|SPARED|SUPPORTED|[Ss]pared|[Ss]upported)\\b'))||[]);let tag=tg[2]?(tg[1]?'NOT '+tg[2]:tg[2]).toUpperCase():null;
    if(!tag&&lead)tag=lead[1].toUpperCase();if(!tag){const back=cl.text.slice(0,m.index).match(new RegExp('\\b('+TAGS+')\\b[^.;]*$','i'));if(back&&!/\b(spared|supported)\b/i.test(cl.text.slice(back.index,m.index)))tag=null;}
    if(!tag)continue;const ow=own.find(o=>o.at>=cl.off+m.index&&o.at<=cl.off+from+2);
    for(const n of ns)out.push({ref,num:n,link:inl!=null?inl:(ref==='PREMISE'&&ow?ow.link:null),tag,counted:COUNTED.test(tag)});}}
  return out;}
 function splitClauses(b){const o=[];let off=0;for(const p of b.split(/(?<=[.;])\s+(?=[A-Z(\d]|premise|item|counted)/)){o.push({text:p,off:b.indexOf(p,off)});off+=p.length;}return o;}
 function read(text,side){const B=block(text,side);if(!B)return null;const e=entries(B.body);const counted=B.count===0?[]:[...new Map(e.filter(x=>x.counted).map(x=>[x.ref+x.num,x])).values()];
  return {...B,entries:e,counted,named:counted.length,agrees:B.count==null?null:counted.length===B.count};}
 return {read,block,entries};})();
const nm=x=>(x.ref==='PREMISE'?'premise ':x.ref==='LINK'?'link ':x.ref)+x.num;
const one=(t,side,stored)=>{const st=(typeof stored==='number'&&isFinite(stored))?stored:null;const r=CLR.read(t,side);if(!r)return {stored:st,stated:null,granted:0,unexhibited:0,broken_at_collision:0,unnamed:null,granted_items:[],unexhibited_items:[],broken_items:[]};
 const g=r.counted.filter(x=>x.tag==='CONCEDED'||x.tag==='WITHDRAWN'),u=r.counted.filter(x=>x.tag==='UNEXHIBITED');
 /* pkgCRG: the engine's recount names "premise n BROKEN AT THE COLLISION Dn vs Cm" (a premise counted under K-G1/K-G7); counted, but neither granted nor unexhibited */
 const have=new Set(r.counted.map(x=>x.ref+x.num));const b=[];if(r.count!==0)for(const m of String(r.body||'').matchAll(/\bpremise\s+(\d+)\s+BROKEN AT THE COLLISION\b/g)){const k='PREMISE'+m[1];if(!have.has(k)){have.add(k);b.push({ref:'PREMISE',num:+m[1]});}}
 return {stored:st,stated:r.count,granted:g.length,unexhibited:u.length,broken_at_collision:b.length,unnamed:r.count==null?null:Math.max(0,r.count-g.length-u.length-b.length),granted_items:g.map(nm),unexhibited_items:u.map(nm),broken_items:b.map(nm)};};
return (t,dc,cc)=>{try{return {reader:'pkgCLR',defender:one(String(t==null?'':t),'DEFENDER',dc),challenger:one(String(t==null?'':t),'CHALLENGER',cc)};}catch(e){return {reader:'pkgCLR',error:String(e&&e.message||e).slice(0,200)};}};})();
const __CSPOUT=(()=>{
const __L={"Alt Gate Record":()=>$('Alt Gate Record'),"Alt Judge Enforcer Record":()=>$('Alt Judge Enforcer Record'),"Alt Seated":()=>$('Alt Seated'),"Alt Send Back Record":()=>$('Alt Send Back Record'),"Alternate Merge":()=>$('Alternate Merge'),"Alternate Merge Seat":()=>$('Alternate Merge Seat'),"Cited Verses":()=>$('Cited Verses'),"Gate Record":()=>$('Gate Record'),"Panel Build":()=>$('Panel Build'),"Panel Cure Check":()=>$('Panel Cure Check'),"Quote Report":()=>$('Quote Report')};
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
 
 
 const RND=F=>({CR1:F.cr1,DR1:F.gr1,CR2:F.cr2,DR2:F.gr2,CR3:F.cr3,DR3:F.dr3,CR4:F.cr4,DR4:F.dr4});
 
 return {entries,parse,RND,ORD};})();
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
 
 const GRK={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'e','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'u','φ':'ph','χ':'ch','ψ':'ps','ω':'o'};
 
 
 const norm=s=>{let t=strip(s).toLowerCase().replace(/[ᵉʼʻ'’`‘.\-\/\s]/g,'').replace(/[^a-z]/g,'');
  t=t.replace(/gg/g,'ng').replace(/g(?=[kx])/g,'n').replace(/tz/g,'ts').replace(/ph/g,'f').replace(/kh/g,'ch').replace(/ps/g,'\u0001').replace(/y/g,'u').replace(/\u0001/g,'ps')
   .replace(/uw/g,'u').replace(/ow/g,'o').replace(/iu(?=$|[^aeiou])/g,'i').replace(/c(?!h)/g,'s').replace(/(.)\1+/g,'$1');return t;};
 
 
 
 const PREF=['ha','he','ve','va','vu','u','we','wa','be','ba','bi','le','la','li','ke','ka','ki','mi','me','she','sh','ush','uve','hal'];
 
 
 
 
 
 
 const W_IT=/(?:^|[^*\w])[*_]([^*_\n]{2,60}?)[*_](?![*\w])/g;
 
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"\u201c\u201d\u2018\u2019'(,:]*$/i;
 const LETTER=/[a-z\u00e0-\u024f\u1e00-\u1eff\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff\u02bc\u02bb]/i;
 
 
 
 
 
 
  
 
 
 
 
 
 
 
 
 return {norm,};})();
let PRS_L2BAD=null;
const PRS_CTX={R:null};


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

/* pkgRI5 part B (reader item 5): reader-first field reads for sbApply2024; each returns the old regex's match shape, or the old regex's own result when the reader reads no such form */
function ri5Rd2024(l){try{const r=__RL.readLine(String(l==null?'':l));return r&&r.form&&r.f&&!r.f.restated?r:null;}catch(e){return null;}}
function ri5Res2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='RESULT'&&r.f.result)return [l,r.f.result];return re?String(l==null?'':l).match(re):null;} /* pkgRI5C: no regex, no match */
function ri5IsRes2024(l,re){const r=ri5Rd2024(l);return (r&&r.form==='RESULT')||re.test(l);}
function ri5Rt2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='RETRACTED'&&r.f.pair&&!r.f.reason){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return p;}return String(l==null?'':l).match(re);}
function ri5Pair2024(l,re,forms){const r=ri5Rd2024(l);if(r&&forms.includes(r.form)&&r.f.pair){const p=String(r.f.pair).match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(p)return p;}return String(l==null?'':l).match(re);}
function ri5Cm2024(l,re){const r=ri5Rd2024(l);if(r&&r.form==='CHAIN MARK'&&r.f.side)return [l,r.f.side];return String(l==null?'':l).match(re);}
function ri5Key2024(raw,u,re,grades){const r=ri5Rd2024(raw);if(r&&r.form==='KEYSTONE'&&r.f.link&&grades.includes(r.f.grade))return [raw,r.f.link,r.f.grade];return String(u==null?'':u).match(re);}
/* pkgRI5 part C (reader item 5): one reader field of a line, or null when the reader reads no such form (then the old regex decides) */
function ri5Fd2024(l,form,k){const r=ri5Rd2024(l);return r&&r.form===form&&r.f[k]!=null?r.f[k]:null;}
/* pkgRI6 (reader item 6, KEYSTONE): reader-first reads; each returns the old regex's match shape, or the old regex's result when the reader reads no such form */



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


const KFF_Q='["“]([^"“”]{6,600})["”]';




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



const UNX_MGROUND=/\b(?:meet|meets|meeting|met|answer|answers|answering|answered)\b[^.;]{0,80}?\b(?:MEANS|meaning|significance|inference|claim|claimed|press|pressed)\b/i;


const UNXA_HARD=/\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b/i;
const UNXA_ASM=/\bASSUMES\b/;const UNXA_UNA=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b/i;





const KR_LINE=/^\s*(?:[-•]|\d+[.)])?\s*REFERENCE\s*:\s*(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*(CONFIRMED|NOT CONFIRMED)\s*(?:--|—|–)\s*["“](.+?)["”]\s*\/\s*["“](.+?)["”]\s*\.?\s*$/i;


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


const NET_REPORT=/\b(?:stated|granted|says|said|conceded|argued|admitted)\s+that\b|\b(?:conceding|concedes|admitting|admits|granting|grants)\b/i;
const NET_CLAIM=/\b(?:challenger|defender)\s+(?:reads|read|claims|claimed|says|said|argues|argued|takes|took|holds|asserts|asserted|presses|pressed)\b[^;]{0,160}?\b(?:as\s+(?:saying|stating|meaning)|to\s+(?:say|state|mean))\b/i;
const NET_PLURAL=/\b(?:rows|verses|witnesses|speeches|they|these|those|them|none|neither|read\s+together|idiom)\b|\bno\s+(?:verse|witness|row)\b|\b(?:\d?\s?[A-Z][a-z]+\s+\d+:\d+)[^;.]{0,40}?\band\s+(?:\d?\s?[A-Z][a-z]+\s+)?\d+:\d+|\bscripture\b|\bnowhere\b|\bno\s+(?:exhibit|passage|text)s?\b|\ba\s+single\s+(?:\S+\s+)?(?:text|verse|witness|row|passage)\b/i;
const NET_PRECEPT=/\b(?:scriptures?|precept\s+upon\s+precept)\b/i;

const NET_HEAD=/^(RESULT|KEYSTONE|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:/;
const NET_SKIP=/^(?:CLAUSE|CITATION CHECK|COLLISION POINTS)\b/i;






const CNT_HEAD=/^[ \t>#-]*(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:/i;
const KN_NARROW=/\b(?:drop(?:s|ped)?\s+(?:any|the|my|that)\s+(?:\S+\s+){0,2}?(?:claim|form|limb|reading)|no\s+longer\s+(?:claim|hold|assert|rest)|(?:do|does)\s+not\s+(?:claim|assert|need)|narrow\w*|limb\s+(?:is\s+)?dropped|\bonly\b|\balone\b)/i;
const KN_SURR=/\b(?:I\s+concede|concede[sd]?\s+(?:the\s+|this\s+)?link|withdraw\w*|surrender\w*|CONCEDED\b|I\s+yield|I\s+grant\s+the\s+link)/i;





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

const __KRUL_HEADS=["Commitment 1. The record is the only evidence.", "Commitment 2. I repair nothing.", "Commitment 3. Meaning, not words.", "Commitment 4. One standard for both sides.", "Commitment 5. Silence is not neutral.", "Commitment 6. I void only by quoting.", "Commitment 7. I judge; I do not only count.", "Commitment 8. The method is Isaiah 28:10.", "Commitment 9. I answer in the form each request gives.", "Commitment 10. I capture contradictions.", "Commitment 11. I show every ruling that decides.", "Commitment 12. I judge by the 1611 KJV alone."];



function krulNorm(s){return String(s||'').toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`*_]/g,'').replace(/\[[lr]\d\]/g,' ').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff]+/g,' ').replace(/\s+/g,' ').trim();}




function krulMatch(c,id,ctx){const t=c.target;const X=ctx||{};if(id==='keystone'){if(/\bkeystone\b/i.test(t))return true;const lone=String(t).trim().match(/^(D\d+)\s*$/i);return !!lone&&(!X.ks||lone[1].toUpperCase()===X.ks);}
 {const pm=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(pm&&!/\b(DEFENDER|CHALLENGER)\b/i.test(t)&&new RegExp('\\bpremise\\s*'+pm[2]+'\\b','i').test(t)&&X.ps&&Array.isArray(X.ps[pm[2]])&&X.ps[pm[2]].length===1&&X.ps[pm[2]][0]===pm[1])return true;}
 let m=id.match(/^(DEFENDER|CHALLENGER) premise (\d+)$/);if(m)return new RegExp('\\b'+m[1]+'\\b','i').test(t)&&new RegExp('\\bpremise\\s*'+m[2]+'\\b','i').test(t);
 m=id.match(/^(D\d+) vs (C\d+)$/);if(m){if(new RegExp('\\b'+m[1]+'\\s*vs\\.?\\s*'+m[2]+'\\b','i').test(t))return true;for(const g of String(t).matchAll(/((?:\bD\d+\s*(?:,\s*(?:and\s+)?|\s+and\s+|\s*&\s*))+D\d+)\s*vs\.?\s*(C\d+)\b/gi)){if(g[2].toUpperCase()===m[2].toUpperCase()&&(g[1].match(/D\d+/gi)||[]).some(d=>d.toUpperCase()===m[1].toUpperCase()))return true;}}  return false;}
const KRUL_BAD=/^(?:UNEXHIBITED|VOID|DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|BROKEN)\b/i;



/* pkgRP8 (reader item 8): a RESPONSE or STATEMENT line as the shared reader reads it gives its answer text; any other line keeps the old read */



/* pkgXK: among the cards krulMatch ties to item x, the card whose RULING target names the fewest K-RUL items of the build (__XK_ITEMS, set by cureVerdicts); first on a tie */





function kkjvNoMargin(s){return String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');}





const KKJV_REF=/\b((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;
const KKJV_Q=/^[\s,:;(\-–—]{0,6}(?:\[L1\]\s*)?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z0-9])['‘](?!s\b|\s)((?:[^'‘’\n]|['’](?=[a-z])){6,400}?)['’](?![a-z]))/;
const KKJV_VER=/\b(RSV|NRSV|NIV|ESV|NASB|NKJV|NLT|Septuagint|LXX)\b/;


const KAG_OK=['MEETS','MISSES','FAILS','UNPROVEN'];












const SC_CONC=/(?:\[?\bCR[1-4]\b\]?|\bdefen(?:der|se)(?:'s)?\b)[^;]{0,60}?\b(?<!not\s|never\s)conced(?:ed|es)\b(?!\s+nothing)/i;

const KK_GROUND=/\d+:\d+|\[?\b[CD]R[1-4]\b\]?|\bround\b|\bLINK\s+\d|\[L[1-4]\]|\b(?:answered|unanswered|refuted|refutes|withdrawn|withdrew|withdraws|conceded|concedes|pressed|witness\w*|GROUND|because|since|exhibit\w*|footing|premise|chain|verse|row)\b/i;


const GROUND_HEAD=/^(?:[-•]|\d+[.)])?\s*(?:D\d+(?:\s+vs\.?\s+C\d+(?:\s*\/\s*C\d+)*)?(?:\s*\([^)]*\))?|KEYSTONE|RESULT|CLAUSE|REASONING|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK)\s*:?\s*/i;



const KS2_FORMS=[/\bno\s+(?:\S+\s+){0,2}?witness(?:['’]s|es)?\s+(?:own\s+words\s+)?(?:\S+\s+){0,3}?(?:states?|says?|names?)\b/i,/\bnone\s+(?:of\s+(?:\S+\s+){1,2})?states?\s+that\b/i,
 /\bstates?\s+no\s+(?!round\b|later\b|answer\b)[a-z]+/i,/\bin\s+(?:its|their|his|her)\s+own\s+words\b/i];




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





/* pkgXK stage B: JSON cure answers. Functions, so they are hoisted wherever cureBody, cureText or fumAsk2024 runs. */



/* rev 3 (W1 ask, operator approved 18:16Z 11-09): a cut-off cure_lines reply keeps every COMPLETE entry; the cut entry and anything after it are dropped. */



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

function ciRounds(ptext){const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;  out[x.k]=t.slice(x.e,end);});return out;}
const CI_LINE=/^\s*(?:[-*•>]|\d+[.)])?\s*(NOT PRESSED|PRESSED)\s*:\s*(.+)$/i;
const CI_PRESSED=/^(.+?)\s*(?:--|—|–)\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*(?:--|—|–)\s*["“](.+)["”]\s*(?:--|—|–)\s*(UNANSWERED|ANSWERED\s+IN\s*\[?\s*((?:CR|DR)[1-4])\s*\]?)\s*\.?$/i;





/* pkgRI3 (reader item 3): true/false when the shared reader reads the line as a CONCEDED count line (for this side / the other side); null when it reads no CONCEDED form, so the old regex decides */
function ri3Count2024(l,side){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='CONCEDED'&&r.f&&!r.f.restated&&(r.f.side==='DEFENDER'||r.f.side==='CHALLENGER'))return r.f.side===side;}catch(e){}return null;}
/* pkgRI3 part B: the reader's CONCEDED head {side,n} (null: no CONCEDED form, or RESTATED); the first line giving the side's STANDING L (reader STANDING first, else the old one-line regex) */
function ri3Head2024(l){try{const r=__RL.readLine(String(l==null?'':l));if(r&&r.form==='CONCEDED'&&r.f&&!r.f.restated&&(r.f.side==='DEFENDER'||r.f.side==='CHALLENGER'))return {side:r.f.side,n:r.f.n};}catch(e){}return null;}



const CURE_PRESS={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};



const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|CORRECTED STANDING|NOT PRESSED|PRESSED|SHORT|STATEMENT|RESPONSE)[ \t]*:[ \t]*(.*)$/;


const cureUnwrap=t=>{try{const j=JSON.parse(String(t).trim().replace(/^```(?:json)?\s*|\s*```$/g,''));if(j&&typeof j==='object'){for(const k of ['reasoning','reason','answer'])if(typeof j[k]==='string')return j[k];}}catch(e){}return cjrLoose2024(t);}; /* pkgCJR */
function cjrLoose2024(t){const z=String(t==null?'':t).trim().replace(/^```(?:json)?\s*|\s*```$/g,'');if(z[0]!=='{'||!/\\n/.test(z))return t;const m=z.match(/"(?:reasoning|reason|answer)"\s*:\s*"/);if(!m)return t; /* pkgCJR: invalid JSON reply, read its reasoning string as gateRead2024 does */
 return z.slice(m.index+m[0].length).replace(/"\s*\}\s*$/,'').replace(/\\n/g,'\n').replace(/\\"/g,'"');}
 /* pkgKSL rev 2 */
 /* pkgKSL: the prose lines a judge writes right under its K-S3 RESPONSE line are read with it */

function cureOwn(l,x){const b=String(l).replace(/^[A-Z ]+:\s*/,'').replace(/^K-[A-Z]+\d*\s+/i,'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 const lab=x.rule==='K-G3'?String(x.side||'')+' STANDING':String(x.link||'').toUpperCase().replace(/\s+VS\.?\s+/g,' VS ').replace(/\s+/g,' ');
 return !!lab&&b.startsWith(lab)&&!/[0-9A-Z]/.test(b.charAt(lab.length));}
const CURE_BK={mt:'mat',mk:'mar',lk:'luk',jn:'joh',ex:'exo',ro:'rom'};
const CURE_SENT=/[.!?]["”'’)\]]*\s+(?=["“'‘(\[]*[A-Z])|\n/;


var __RXR_R=null;var __XK_ITEMS=null; /* pkgXK */


/* pkgG4R (W2, 11-08; W3 3106 stacked engine item; W2 3107 item 2). (a) K-G4 witness: when the judge's quotation stands in a PRESSED WITH row
   ("<verse> ... -- MEANS: ..."), the pressed witness is that row's own verse, not an [L3] ground of the line. (b) The gate K-G4 item shows the
   engine's unanswered-false reading up front, so the judge sees that only a FORCED line cures a break whose witness a later round named. */


/* pkgKG7 (D40, W3 3093 ruling 3): the K-G4 answered test applied to a K-G7 line; a break on an answered witness is one of meaning (ruling 421) and is not cured by a count */  /* pkgK7C rev 2: a K-G7 or K-G4 item on a link the engine's confirmed closing contradiction broke; the engine itself does not count that link */












const PW_CAP=8;
const PW_ROUND={DEFENDER:'DR2',CHALLENGER:'CR3'};


const PW_FOOT=/\bexhibit|\bfooting\b|\[L[1-3]\]|\bquotations\b|prior layers?/i;
const PW_UNANS=/unanswer|unnamed|not named|no later|not answered|receives no|\bleft\b|leaving|names or answers|without (?:an |any )?answer/i;
const PW_ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];
const PW_PRESSR={DEFENDER:['DR1','DR2'],CHALLENGER:['CR1','CR2','CR3']};
const PW_ANSR={DEFENDER:['CR2','CR3','CR4'],CHALLENGER:['DR1','DR2','DR3']};




const PW_SEG=/(^|\n|[;.]\s+|--\s*|—\s*|:\s+)(?:[-•>]\s*)?(?:\d+[.)]\s*)?[*_]*\s*premises?\s+(\d+(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+|\s*&\s*)\d+)*)\b(?:\s*\(LINK\s+(?:\d+|none)\))?[*_]*(?=\s*(?:is\b|are\b|:|--|—|\(|UNEXHIBITED|CONCEDED|VOID|SUPPORTED|SPARED|STANDS|NOT\b))/gi;
const KV_KIND=/\bnegations?\b|\bnegative\b|\buniversals?\b|\bclaim\b[^.;]{0,60}\b(?:quote|quoted|quotation)\b[^.;]{0,40}\b(?:do(?:es)?\s+not|never)\s+(?:[a-z]+\s+)?make|\bgo(?:es)?\s+beyond\s+(?:the\s+)?(?:quoted?\b|quotation\b|['‘"“])|\bclaim\b[^.;]{0,30}\bnot\s+(?:made|in)\b[^.;]{0,20}\b(?:quote|quoted|quotation)\b/i;
const KV_NOQ=/\bno\s+verbatim\s+quot|\bnot\s+(?:found\s+)?verbatim\b|\bquot(?:e|ation)\s+(?:is\s+)?not\s+found\b|\bwithout\s+a\s+verbatim\s+quot/i;





const KV_UNI=/^(?:only|never|all|none|no|not|every|always|alone|nothing|nowhere|neither|nor|without|cannot|any|reversed|excludes?|excluded)$/;










function cureSupHead(raw,o,n){let s=String(raw||'');const H=/SUPERSEDED BY CURE: verdict [A-Z-]+ to [A-Z-]+; see the cure lines below(?:\\n|\n)/;const enc=x=>JSON.stringify(String(x)).slice(1,-1);const hd=(o&&n&&o!==n)?'SUPERSEDED BY CURE: verdict '+o+' to '+n+'; see the cure lines below':null;const t=s.trimStart();if(t[0]==='{'){const a=s.indexOf('{');const b=rcObjEnd(s,a);if(b<0)return s;let j=s.slice(a,b).replace(H,'');if(hd)j=j.replace(/("reasoning"\s*:\s*")/,m=>m+enc(hd+'\n'));return s.slice(0,a)+j+s.slice(b);}s=s.replace(H,'');return hd?hd+'\n'+s:s;}

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


function cecBroken2024(){const L=[];for(const [n,k] of [['Close Enforcer Record','cec'],['Judge Contradiction Record','jcc']]){try{const x=$(n);if(!x||!x.isExecuted)continue;const j=x.first().json;((j&&j[k]&&j[k].confirmed)||[]).forEach(y=>L.push(y));}catch(e){}}
 const seen=new Set();return L.filter(x=>x&&(x.side==='DEFENDER'||x.side==='CHALLENGER')&&Number.isInteger(+x.link)&&+x.link>=1).map(x=>({...x,link:+x.link})).filter(x=>{const k=x.side+' '+x.link;if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>(a.side===b.side?a.link-b.link:a.side==='DEFENDER'?-1:1));} /* pkgCEC rev 2: the pre-panel enforcer and the post-panel confirmation of judge-found contradictions (ASK 2) */
function cecLine2024(c,x){const q=t=>{t=String(t||'').replace(/\s+/g,' ').trim().replace(/"/g,"'");return t.length>300?t.slice(0,297)+'...':t;};const par=(String(c.raw||'').match(/\([^)]*\d+:\d+[^)]*\)/)||[''])[0];
 return c.link+(par?' '+par:'')+': '+x.side+' LINK BROKEN -- [AUDIT: LINK '+x.link+' BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- '+x.side+' -- EARLIER ['+x.earlier_round+'] "'+q(x.earlier_q)+'" -- CLOSING ['+x.closing_round+'] "'+q(x.closing_q)+'"]';} /* pkgCEC */

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
  .replace(/\b(premises\s+)(\d)\s+(?:through|to)\s+(\d)\b/ig,'$1$2-$3').replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig;
 for(const c0 of t.split(/;|\.(?=\s|$)/)){const c=c0.replace(/\bnone\s+counted\b/ig,' ').replace(/\b(?:(?:are|is|were|was|be|been)\s+)?(?:not|never)\s+(?:counted|void|unexhibited|conceded)\b|\buncounted\b/ig,' spared ');  W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED'; /* pkgNVR */
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
/* pkgSGA3 (W2, 11-08; Eric approved ASK 2): append a no-label "Premise N: <grade>" change to the CONCEDED LINKS line that has no sentence for
   premise N, when side and count stay, N gets a grade that is not COUNTED, and no other premise moves; else null (the pkgSGA refusal stands) */
function sga3Append2024(cur,pn,to){try{const c=String(cur==null?'':cur).trim(),t=String(to==null?'':to).trim();if(!c||!t||!new RegExp('^Premise\\s+'+pn+'\\b','i').test(t))return null;
 const P0=psGrades(c);if(!P0)return null;let c1=c;
 if(pn in P0.g){if(P0.g[pn]==='COUNTED')return null;const J=/\b(Premises\s+)((?:\d+\s*(?:,\s*(?:and\s+)?|and\s+|&\s*))+\d+)(\s+)(are|were)\b/gi;const hs=[...c.matchAll(J)].filter(m=>(m[2].match(/\d+/g)||[]).map(Number).includes(+pn));if(hs.length!==1)return null;
  const m=hs[0];const rest=(m[2].match(/\d+/g)||[]).map(Number).filter(n=>n!==+pn);if(!rest.length)return null;const lst=rest.length===1?String(rest[0]):rest.slice(0,-1).join(', ')+' and '+rest[rest.length-1];
  c1=c.slice(0,m.index)+(rest.length===1?'Premise ':m[1])+lst+m[3]+(rest.length===1?(/^were$/i.test(m[4])?'was':'is'):m[4])+c.slice(m.index+m[0].length);} /* a joint sentence that names N loses N; the change is appended as N's own clause */
 const bare=/CONCEDED LINKS\s*:\s*\d*\s*\.?$/i.test(c1);const nw=bare?c1.replace(/\s*\.$/,'')+' -- '+t:c1.replace(/[\s.;]+$/,'')+'; '+t;
 const P1=psGrades(nw);if(!P1||P1.side!==P0.side||P1.n!==P0.n||!(pn in P1.g)||P1.g[pn]==='COUNTED')return null;
 for(const k of new Set(Object.keys(P0.g).concat(Object.keys(P1.g))))if(+k!==+pn&&P0.g[k]!==P1.g[k])return null;return nw;}catch(e){return null;}}
function sbApply2024(seat,raw,F,its,RD){const one=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();const nrm=s=>one(String(s).replace(/\\+/g,'').replace(/[*_`]+/g,''));  const U=s=>String(s==null?'':s).toUpperCase();
 const text=cureJText(raw,true);const lines=text.split('\n');const find=l=>{const n=nrm(l);if(!n)return null;return lines.find(x=>nrm(x)===n)||null;};
 const ch=(its||[]).filter(x=>x&&x.ans==='CHANGE');const items=[];const map=new Map();let resTo=null;
 for(const x of ch){if(x.forced_add){
  const toF=one(String(x.to==null?'':x.to).replace(/\\+"/g,'"')).replace(/[*_`]+/g,'');const kf=toF.match(KF_LINE);const lk=kf?kf[1].toUpperCase().replace(/\s+VS\.?\s+/,' VS '):null;const cur=l=>map.has(l)?map.get(l).to:l;const top=l=>String(cur(l)).split('\n')[0];
  let o=find(x.line);if(!o){const n=nrm(x.line);for(const [o2,c2] of map){if(n&&nrm(c2.to)===n){o=o2;break;}}}if(!o&&lk)o=lines.find(l=>sbLabel(top(l))===lk)||null;
  if(!kf||!o||sbLabel(top(o))!==lk){items.push({sid:x.sid,kind:'NOT APPLIED',why:kf?'the collision line of '+kf[1]+' for the FORCED line is not in the judge text':'the FORCED line is not in the FORCED form',to:x.to,lines:o?[o]:[]});continue;}
  const c0=cur(o);if(nrm(c0).includes(nrm(toF)))continue;const pre=(String(o).match(/^\s*(?:[-\u2022]\s+|\d+[.)]\s+)?/)||[''])[0];const p=map.get(o);map.set(o,{sid:p?p.sid:x.sid,to:c0+'\n'+pre+toF,over:p?p.over:[],forced:((p&&p.forced)||[]).concat(x.sid)});continue;}
  let to=one(String(x.to==null?'':x.to).replace(/\\+"/g,'"')).replace(/^["\u201c]+([\s\S]*?)["\u201d]+$/,(m,c)=>c).trim();
  if(ri5IsRes2024(to,/^RESULT\s*:/i)){resTo={sid:x.sid,to};continue;} /* pkgRI5B */
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
  const __rtH=/^RETRACTED\s*:\s*D\d+\s+VS\.?\s+C\d+\s*\S/i.test(nrm(to||''))?'; a retraction is written "RETRACTED: <pair>" with nothing after the pair':'';if(!o){const __rt=ri5Rt2024(nrm(to),/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*\.?$/i); /* pkgRI5B */if(__rt){const __pk=(__rt[1]+' VS '+__rt[2]).toUpperCase();const __FO=/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i;const __pf=l=>{const m=ri5Pair2024(nrm(l),__FO,['FORCED']);return m?(m[1]+' VS '+m[2]).toUpperCase():null;}; /* pkgFRP */
   const __dn=[...map.values()].find(v=>v&&v.rfl===__pk);if(__dn){__dn.over=(__dn.over||[]).concat(x.sid);continue;}const __c=lines.filter(l=>!(map.has(l)&&map.get(l).to==='')&&__pf(map.has(l)?map.get(l).to:l)===__pk);if(__c.length===1)o=__c[0];}}
  if(!o){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the flagged line is not in the judge text'+__rtH,to});continue;}{const __rt=ri5Rt2024(nrm(to),/^RETRACTED\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\s*\.?$/i); /* pkgRI5B */const __fo=ri5Pair2024(nrm(map.has(o)?map.get(o).to:o),/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*(D\d+)\s+VS\.?\s+(C\d+)\b/i,['FORCED']); /* pkgRI5B */  if(__rt&&__fo&&(__rt[1]+' VS '+__rt[2]).toUpperCase()===(__fo[1]+' VS '+__fo[2]).toUpperCase()){const p=map.get(o);map.set(o,{sid:x.sid,to:'',over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[]),rfl:(__fo[1]+' VS '+__fo[2]).toUpperCase()});continue;}}
  {const __lo=sbLabel(o);if(__lo&&!sbLabel(to)&&SB_FORM.test(to)){const __pn=(nrm(to).match(/^Premise\s+(\d+)\b/i)||[])[1];const __p=map.get(o);const __c=nrm(__p?__p.to:o);
   const __ss=__c.split(/(?:(?<=[.;])|(?<=--))\s+(?=Premises?\s+\d)/);const __ix=__pn?__ss.map((z,i)=>new RegExp('^Premise\\s+'+__pn+'\\b','i').test(z)?i:-1).filter(i=>i>=0):[];
   const __cnt=t=>{const g=psGrades(t);return g&&g.g&&(__pn in g.g)?g.g[__pn]==='COUNTED':null;};if(__ix.length===1){const __s0=__ss.join(' ');__ss[__ix[0]]=to;const __nw=__ss.join(' ');const __a=__cnt(__s0),__b=__cnt(__nw);
    if(__a!=null&&__b!=null&&__a!==__b){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change moves premise '+__pn+(__b?' into':' out of')+' the '+__lo+' count, so the line\'s count number would be stale: write the whole line with its label and count (pkgSGA2, W1 2695)',to,lines:[o]});continue;}to=__nw;}else if(!__ix.length&&__pn&&sga3Append2024(__c,__pn,to)){to=sga3Append2024(__c,__pn,to); /* pkgSGA3 */}else{items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change has no line label and would replace the whole '+__lo+' line'+(__pn?' (the line has '+(__ix.length?'more than one':'no')+' sentence for premise '+__pn+')':'')+': write the whole line with its label (pkgSGA)',to,lines:[o]});continue;}}}
  if(x.rule==='E-OOR'&&/^\(?\s*(?:OUT-OF-ROUND CONCESSIONS\s*:\s*)?(?:STRUCK|STRIKE|REMOVED?|DELETED?|NONE)\b/i.test(to)) /* pkgOON: NONE strikes the row */{const __c=map.has(o)?map.get(o).to:o; /* pkgOOS */
   if(/\bCOUNTED\s*\.?\s*$/i.test(nrm(__c))){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the row ends COUNTED, so striking it would leave the count stale: write the whole CONCEDED LINKS line with its count, or the row without COUNTED (pkgOOS)',to,lines:[o]});continue;}
   const p=map.get(o);map.set(o,{sid:x.sid,to:'',over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[]),oos:true});continue;}
  if(!to||!SB_FORM.test(to)){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads'+__rtH,to,lines:[o]});continue;}
  const __psg=x.rule==='E-GATE'&&x.psrc?ch.find(y=>y.sid===x.psrc&&y.rule==='E-PREM')||null:null;
  if(x.rule==='E-PREM'||__psg){const cu=map.has(o)?map.get(o).to:o;const P=psGrades(to),Q=psGrades(cu);
   if(P&&Q){const iq=s=>{const m=String(s||'').match(/against the (defender|challenger)\s+(\d+)/i);return m?{side:m[1].toUpperCase(),n:+m[2]}:null;};const nl=nrm(__psg?__psg.line:x.line);
    const named=new Set(ch.filter(y=>y.rule==='E-PREM'&&nrm(y.line)===nl).map(y=>iq(y.item)).filter(Boolean).map(y=>y.n));const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);
    const moved=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]);const out=moved.filter(k=>!named.has(k));const jump=P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>named.size;
    if(P.side!==Q.side||out.length||jump){items.push({sid:x.sid,kind:'NOT APPLIED',why:P.side!==Q.side?'the change moves the '+Q.side+' CONCEDED LINKS line to the '+P.side+' side (pkgPS, W3 2446)':'the change regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count from '+Q.n+' to '+P.n)+', which '+(out.length>1?'its items do':'its item does')+' not name (named: '+([...named].join(', ')||'none')+'; pkgPS, W3 2446: a premise change stays inside the premises its items name)',to,lines:[o]});continue;}}}
  {const CM=/^\s*(?:[-\u2022]|\d+[.)])?\s*(DEFENDER|CHALLENGER)\s+CHAIN MARK\s*:/i;const ct=ri5Cm2024(nrm(to),CM),co=ri5Cm2024(nrm(o),CM); /* pkgRI5B */
   if((ct||co)&&!(ct&&co&&ct[1].toUpperCase()===co[1].toUpperCase())){items.push({sid:x.sid,kind:'NOT APPLIED',why:ct&&co?'the change moves the '+co[1].toUpperCase()+' CHAIN MARK to the '+ct[1].toUpperCase()+' side (W3 2395: a CHAIN MARK change applies only over the same side\'s CHAIN MARK line)':ct?'a CHAIN MARK line may replace only a CHAIN MARK line of the same side (W3 2395), and the flagged line is not one':'the change drops the '+co[1].toUpperCase()+' CHAIN MARK (W3 2395: a change to a CHAIN MARK line must be a CHAIN MARK line of the same side)',to,lines:[o]});continue;}}
  {const PR=/^\s*(?:[-\u2022]|\d+[.)])?\s*(?:FORCED(?:\s*\(\s*Commitment\s+\d+\s*\))?\s*:\s*)?(D\d+)\s+VS\.?\s+(C\d+)\b/i;const FR=/^\s*(?:[-\u2022]|\d+[.)])?\s*FORCED\b/i;
   const pOf=l=>{const m=ri5Pair2024(nrm(l),PR,['FORCED','COLLISION']);return m?(m[1]+' VS '+m[2]).toUpperCase():null;}; /* pkgRI5B */const pk=pOf(o);
   const GR=/^\s*(?:[-\u2022*]\s*|\d+[.)]\s*)?\**D\d+\s+vs\.?\s+C\d+\b(?:\s*\([^)\n]*\))?[^:\n(]*:\s*\**(?:DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\b/;
   if(pk){const tp=pOf(to);const ok=tp===pk&&(ri4IsF2024(nrm(to),FR)?ri4IsF2024(nrm(o),FR):GR.test(to)); /* pkgRI5B */
    if(!ok){items.push({sid:x.sid,kind:'NOT APPLIED',why:'the change drops the collision '+pk.replace(' VS ',' vs ')+' (W3 2351: a change to a collision or FORCED line must be a collision line for the same pair)',to,lines:[o]});continue;}}}
  {const __d38=typeof d38Refuse2024==='function'?d38Refuse2024(to,x):null;if(__d38){items.push({sid:x.sid,kind:'NOT APPLIED',why:__d38,to,lines:[o],d38r:true});continue;}}   {const __rct=rctCheck(to,x,raw,RD,map.has(o)?map.get(o).to:o);if(__rct){items.push({sid:x.sid,kind:'NOT APPLIED',why:__rct,to,lines:[o],rct:true});continue;}}
  const lk=sbLabel(to);const same=lk?lines.filter(l=>sbLabel(l)===lk):[];
  for(const o2 of [...new Set([o].concat(same))]){const p=map.get(o2);map.set(o2,{sid:x.sid,to,over:p&&p.sid!==x.sid?(p.over||[]).concat(p.sid):(p?p.over:[])});}}
 const build=M=>text.split('\n').map(l=>M.has(l)?M.get(l).to:l).join('\n');
 const keyChecks=(T)=>{const P=rcLines(T);if(!P.key)return [];const m=ri5Key2024(P.key.raw,P.key.u,/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|—|-|:)?\s*(STANDS|BROKEN|WITHDRAWN)\b/,['STANDS','BROKEN','WITHDRAWN']); /* pkgRI5B */if(!m)return [];const out=[];
  const kc=P.col.filter(z=>U(z.link).startsWith(m[1]+' VS'));const br=kc.some(z=>z.grade==='DEFENDER LINK BROKEN')||cecBroken2024().some(x=>x.side==='DEFENDER'&&'D'+x.link===m[1]);
  if(m[2]==='STANDS'&&br)out.push({k:m[1],rule:0,why:'KEYSTONE '+m[1]+' STANDS while '+kc.filter(z=>z.grade==='DEFENDER LINK BROKEN').map(z=>z.link).join(', ')+' is graded DEFENDER LINK BROKEN',lines:[P.key.raw].concat(kc.map(z=>z.raw))});
  if(m[2]==='BROKEN'&&!br&&kc.every(z=>z.grade)&&!sbKeyExempt2024(P.key.raw,P,RD))out.push({k:m[1],rule:0,why:'KEYSTONE '+m[1]+' BROKEN while no '+m[1]+' collision line is graded DEFENDER LINK BROKEN, and its GROUND quotes no defender grant found in the named defender round and names no premise its CONCEDED LINKS line counts',lines:[P.key.raw].concat(kc.map(z=>z.raw))});
  if(m[2]!=='WITHDRAWN'){const bw=sbBrokenWord2024(P);const g0=new Map(rcLines(text).col.map(z=>[U(z.link),z.grade]));const fl=P.col.filter(z=>g0.has(U(z.link))&&(g0.get(U(z.link))==='DEFENDER LINK BROKEN')!==(z.grade==='DEFENDER LINK BROKEN'));
   if(m[2]==='BROKEN'&&bw===false&&!cecBroken2024().some(x=>x.side==='DEFENDER'&&'D'+x.link===m[1]))out.push({k:m[1],rule:2,why:'KEYSTONE '+m[1]+' BROKEN while the verdict derived from the corrected collision lines is not BROKEN',lines:[P.key.raw].concat(fl.map(z=>z.raw))});  }
  return out;};
 {const P9=rcLines(build(map));for(const [o9,c9] of [...map]){if(!c9.rfl)continue;const g9=P9.col.filter(z=>U(z.link)===c9.rfl).map(z=>z.grade);if(g9.some(g=>/LINK BROKEN$/.test(String(g||'')))){map.delete(o9);items.push({sid:c9.sid,kind:'NOT APPLIED',why:'the collision line of '+c9.rfl.replace(' VS ',' vs ')+' is still graded '+g9.find(g=>/LINK BROKEN$/.test(String(g||'')))+', and a broken link keeps its FORCED line (ruling 411; pkgRFL)',to:'RETRACTED: '+c9.rfl.replace(' VS ',' vs '),lines:[o9]});}}}  {const P0=rcLines(build(map));const km=P0.key?ri5Key2024(P0.key.raw,P0.key.u,/^KEYSTONE\s*:\s*(D\d+)\s*(?:--|\u2014|-|:)?\s*(STANDS|BROKEN)\b/,['STANDS','BROKEN']):null; /* pkgRI5B */
  if(km){const kraw=P0.key.raw;const keyO=lines.find(l=>l===kraw)||find(kraw);const touched=[...map].some(([o,c])=>nrm(o)===nrm(kraw)||nrm(c.to)===nrm(kraw));
   const g0=new Map(rcLines(text).col.map(z=>[U(z.link),z.grade]));const kc=P0.col.filter(z=>U(z.link).startsWith(km[1]+' VS'));const moved=kc.filter(z=>g0.has(U(z.link))&&g0.get(U(z.link))!==z.grade);
   const brl=kc.filter(z=>z.grade==='DEFENDER LINK BROKEN');let d=null;
   if(km[2]==='STANDS'&&brl.length&&moved.some(z=>z.grade==='DEFENDER LINK BROKEN'))d='BROKEN';
   else if(km[2]==='BROKEN'&&!cecBroken2024().some(x=>x.side==='DEFENDER'&&'D'+x.link===km[1])&&!brl.length&&kc.every(z=>z.grade)&&moved.some(z=>g0.get(U(z.link))==='DEFENDER LINK BROKEN')&&!sbKeyExempt2024(kraw,P0,RD))d='STANDS';
   if(d&&keyO&&!touched){const pre=(String(keyO).match(/^\s*(?:[-\u2022]\s+|\d+[.)]\s+)?[*_]*KEYSTONE[*_]*\s*:\s*[*_]*/i)||['KEYSTONE: '])[0];
    const to=pre+km[1]+' -- '+d+' -- derived by the engine from the collision grade'+(d==='BROKEN'?' '+brl.map(z=>z.link).join(', ')+' DEFENDER LINK BROKEN':'s of '+km[1]+' (none DEFENDER LINK BROKEN)')+' after the change of '+[...new Set([...map].filter(([o,c])=>moved.some(z=>nrm(c.to).includes(nrm(z.raw))||U(c.to).includes(U(z.link)))).map(([o,c])=>c.sid))].join(', ')+' (E-APPLY, W3 2362)';
    map.set(keyO,{sid:'KEYSTONE (derived)',to,over:[],derived:true});}}}
 {const seen=new Set();for(const kx of keyChecks(build(map))){const kn=new Set(kx.lines.map(nrm));const hit=new Set();for(const [o,c] of [...map]){if(kn.has(nrm(c.to))||kn.has(nrm(o)))hit.add(c.sid);}for(const [o,c] of [...map]){if(hit.has(c.sid))map.delete(o);}for(const sid of hit){if(seen.has(sid))continue;seen.add(sid);const c=(ch.find(z=>z.sid===sid)||{});items.push({sid,kind:'CONTRADICTION',why:kx.why+' (the change is not applied)',to:String(c.to||''),lines:kx.lines});}}}
 {const P9b=rcLines(build(map));for(const [o9,c9] of [...map]){if(!c9.rfl)continue;const g9=P9b.col.filter(z=>U(z.link)===c9.rfl).map(z=>z.grade);if(g9.some(g=>/LINK BROKEN$/.test(String(g||'')))){map.delete(o9);items.push({sid:c9.sid,kind:'NOT APPLIED',why:'the collision line of '+c9.rfl.replace(' VS ',' vs ')+' is still graded '+g9.find(g=>/LINK BROKEN$/.test(String(g||'')))+' (its change was not applied), and a broken link keeps its FORCED line (ruling 411; pkgRFL, rechecked by pkgFCW v2)',to:'RETRACTED: '+c9.rfl.replace(' VS ',' vs '),lines:[o9]});}}} /* pkgFCW v2 */
 {/* pkgRCD (W2; Eric yes 11-08 17:40 CST; Matthew 1:18 repeat): a RULING card that carried a collision line's old grade follows the judge's own regrade of that line in this send-back, when no change touches the card (as the derived KEYSTONE line, W3 2362), so card and line agree (D38) */
  const __rk=s=>U(s).replace(/[*_\x60]+/g,'').replace(/\s+VS\.?\s+/,' VS ').trim();const __CG=/^(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED)$/;
  const __g0=new Map(rcLines(text).col.map(z=>[__rk(z.link),z.grade])),__g1=new Map(rcLines(build(map)).col.map(z=>[__rk(z.link),z.grade]));
  for(const l of lines){if(map.has(l))continue;let r;try{r=__RL.readLine(String(l).trim());}catch(e){r=null;}if(!r||r.form!=='RULING'||!r.f||r.f.restated)continue;
   const sm=String(r.f.subject||'').replace(/[*_\x60]+/g,'').trim().match(/^(D\d+)\s+vs\.?\s+(C\d+)$/i);if(!sm)continue;const lk=__rk(sm[1]+' VS '+sm[2]);
   const cg=U(String(r.f.grade||'').replace(/[*_\x60]+/g,'').replace(/\s+/g,' ').trim()).replace(/\s*\(.*$/,'');if(!__CG.test(cg))continue;
   const a=__g0.get(lk),b=__g1.get(lk);if(!a||!b||a===b||cg!==a||!__CG.test(b))continue;if([...map.values()].some(c=>nrm(c.to)===nrm(l)))continue;
   const k=U(l).lastIndexOf(cg);if(k<0)continue;const sids=[...new Set([...map].filter(([o,c])=>__rk(c.to).includes(lk)).map(([o,c])=>c.sid))];
   map.set(l,{sid:'RULING (derived)',to:l.slice(0,k)+b+' (derived by the engine from the collision grade of '+sm[1]+' vs '+sm[2]+' after the change of '+(sids.join(', ')||'the send-back')+'; pkgRCD, as W3 2362)'+l.slice(k+cg.length),over:[],derived:true});}}
 if(!map.size&&!items.length&&!resTo)return null;
 const T=build(map);const P=rcLines(T);const col=P.col;
 const lab={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};const cnt={DEFENDER:F.conceded_links,CHALLENGER:F.challenger_conceded_links};const c={...cnt};const trig=[];
 const changed=new Set([...map.values()].map(z=>nrm(z.to)));
 for(const sd of ['DEFENDER','CHALLENGER']){const y=P.cn[lab[sd]];if(!y||!changed.has(nrm(y.raw)))continue;const m=y.u.match(/^(?:CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:\s*(\d+)/);if(m&&+m[1]!==cnt[sd]){c[sd]=+m[1];trig.push('COUNT '+sd+' '+cnt[sd]+' to '+c[sd]);}}
 for(const [o,z] of map){const g0=(rcLines(o).col[0]||{}).grade||null,g1=(rcLines(z.to).col[0]||{}).grade||null;if(g1&&g0!==g1)trig.push('CHANGED '+(rcLines(z.to).col[0].link)+' ('+(g0||'no grade')+' to '+g1+')');}
 const __cecX={DEFENDER:0,CHALLENGER:0};for(const x of cecBroken2024()){const G=x.side+' LINK BROKEN';const lb=(x.side==='DEFENDER'?'D':'C')+x.link;let hit=0;
  for(const c0 of col){const m=U(c0.link).match(/^D(\d+) VS C(\d+)$/);if(!m||(x.side==='DEFENDER'?'D'+m[1]:'C'+m[2])!==lb)continue;hit++;{const __ob=c0.cec||(/^(?:DEFENDER|CHALLENGER) LINK BROKEN$/.test(c0.grade||'')&&c0.grade!==G?c0.grade.split(' ')[0]:'');if(__ob&&__ob!==x.side){hit--;continue;}}if(c0.cec)continue;c0.cec=x.side; /* pkgCMX */if(c0.grade===G)continue;
   trig.push('CLOSE-CONTRADICTION '+c0.link+' ('+(c0.grade||'unread')+' to '+G+')');c0.grade=G;const nl=cecLine2024(c0,x);
   const ent=[...map].find(([o,z])=>String(z.to).split('\n').includes(c0.raw));if(ent)ent[1].to=String(ent[1].to).split('\n').map(l=>l===c0.raw?nl:l).join('\n');else if(text.split('\n').includes(c0.raw))map.set(c0.raw,{sid:'CLOSE-CONTRADICTION (pkgCEC)',to:nl,over:[],derived:true});}
  if(!hit){__cecX[x.side]++;trig.push('CLOSE-CONTRADICTION '+lb+' (no collision line names it; counted as one '+G+')');}} /* pkgCEC */
 const brk={DEFENDER:col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length+__cecX.DEFENDER,CHALLENGER:col.filter(z=>z.grade==='CHALLENGER LINK BROKEN').length+__cecX.CHALLENGER}; /* pkgCEC */const unk=col.filter(z=>!z.grade);if(unk.length)trig.push('UNREAD '+unk.map(z=>z.link+' ('+z.unread+')').join(', '));
 const Lof=k=>{const x=P.st[k];const m=x&&x.u.match(/\bL\s*=\s*(\d+)/);return m?+m[1]:null;};
 const stand=(sd,k,orig)=>{const x=P.st[k];if(x&&/FORFEIT/.test(x.u))return orig;const n=c[sd];if(typeof n!=='number')return orig;if(n>=1||brk[sd]>0)return (orig==='COLLAPSED'||orig==='PROP-DEPENDENT')?orig:'PROP-DEPENDENT';return unk.length?orig:'SELF-SUPPORTED';};
 const dst=stand('DEFENDER','DEFENSE',F.defense_standing),cst=stand('CHALLENGER','CHALLENGE',F.challenge_standing);
 const cl=P.clause?P.clause.u:'';const nN=(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(cl.match(/\bW\s*=\s*(\d+)/)||[])[1];const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;
 const kw=!!(P.key&&/^KEYSTONE\s*:\s*D\d+\s*(?:--|\u2014|-|:)\s*WITHDRAWN\b/.test(P.key.u));const k=brk.DEFENDER;
 const held=k<1&&unk.length>0;const tag=held?'UNREAD':k>=1?'BROKEN-1':((n!=null&&2*w>n)||kw)?'BROKEN-2':w>=1?'PARTIAL-1':dst==='COLLAPSED'?'PARTIAL-2':'HELD-1';const word=held?(F.verdict_tag||null):tag.split('-')[0];
 const res0=P.result?((ri5Res2024(P.result.raw,null)||P.result.u.match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null):null; /* pkgRI5B */
 const tie=!unk.length&&!col.some(z=>/LINK BROKEN$/.test(String(z.grade||'')))&&dst===cst&&c.DEFENDER===c.CHALLENGER;
 let res=word==='BROKEN'?'CHALLENGER WINS':((res0&&res0!=='CHALLENGER WINS')?res0:'UNDERDETERMINED');if(tie&&(res==='DEFENDER WINS'||res==='CHALLENGER WINS'))res='UNDERDETERMINED';if(held)res=res0;
 let __rsOK=false;  if(resTo){const rw=(ri5Res2024(resTo.to,null)||U(resTo.to).match(/^RESULT\s*:\s*(DEFENDER WINS|CHALLENGER WINS|UNDERDETERMINED)/)||[])[1]||null; /* pkgRI5B */if(rw!==res)items.push({sid:resTo.sid,kind:'RESULT DIFFERS',why:'the judge wrote '+(rw?'RESULT: '+rw:'a RESULT line the engine cannot read')+'; the result derived from its corrected lines is '+res,to:resTo.to});else __rsOK=true;}
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
const GATE_STATUS={'CONTRADICTION':'LIVE','NOT APPLIED':'LIVE','RESULT DIFFERS':'LIVE','ANSWER GROUND':'LIVE','RULE':'LIVE','ANSWER OPEN':'LIVE'}; /* pkgVP1 */
function sbBrokenWord2024(P){const k=P.col.filter(z=>z.grade==='DEFENDER LINK BROKEN').length;const cl=P.clause?P.clause.u:'';const nN=(P.clause&&ri5Fd2024(P.clause.raw,'CLAUSE','n')!=null)?ri5Fd2024(P.clause.raw,'CLAUSE','n'):(cl.match(/\bN\s*=\s*(\d+)/)||[])[1];const wN=(P.clause&&ri5Fd2024(P.clause.raw,'CLAUSE','w')!=null)?ri5Fd2024(P.clause.raw,'CLAUSE','w'):(cl.match(/\bW\s*=\s*(\d+)/)||[])[1]; /* pkgRI6 */
 const n=nN!=null?+nN:null;const w=wN!=null?+wN:P.wdn;const kw=!!(P.key&&(ri5Fd2024(P.key.raw,'KEYSTONE','grade')!=null?ri5Fd2024(P.key.raw,'KEYSTONE','grade')==='WITHDRAWN':/^KEYSTONE\s*:\s*D\d+\s*(?:--|—|-|:)\s*WITHDRAWN\b/.test(P.key.u))); /* pkgRI6 */const __r=k>=1||(n!=null&&2*w>n)||kw;return __r?true:(P.col.some(z=>!z.grade)?null:false);}
function sbKeyExempt2024(keyRaw,P,RD){const l=String(keyRaw||'').replace(/[*_`]+/g,'');const g=(l.match(/\bGROUND\s*:([\s\S]*)$/i)||[null,l.replace(/^[^]*?\bBROKEN\b/i,'')])[1];
 if(RD&&typeof RD==='object'){for(const m of g.matchAll(/\[\s*(CR[1-4])\s*\]\s*[:,]?\s*["“]([^"”]{12,})["”]/gi)){const r=m[1].toUpperCase();
  if(typeof RD[r]==='string'&&/\b(?:grant|grants|granted|concede|concedes|conceded|allow|drop|withdraw|do not claim)\b/i.test(m[2])&&ciFound(m[2],RD[r]))return true;}}
 const cn=P.cn&&P.cn['CONCEDED LINKS'];if(cn){const cu=cn.u;for(const m of g.matchAll(/\bPremise\s+(\d+)\b/gi)){if(new RegExp('\\bPREMISE\\s+'+m[1]+'\\b[^.;]*\\b(?:CONCEDED|UNEXHIBITED)\\b').test(cu))return true;}}
 return false;}

/* pkgVP1 (W3; WALL-3703 part 2a; md_notes_rulings 459): a judge's own lines must agree. An ANSWER CHECK graded MISSES or FAILS "leaves the witness unanswered"
   (the judges' form, md_notes_rulings 372), and a proven press left unanswered is a BROKEN ground (engine_manual section 8; ruling 392). So a judge that grades the
   answer to a proven press MISSES, while every collision line of the link that press is listed against stays open (UNDERDETERMINED, none graded LINK BROKEN for that
   side), holds two lines that cannot both stand. The verse is tied to its link through the premise list, not through the collision line's own verses: the list that
   closes [DR2] presses the defender, and an entry labelled "LINK k:" presses Dk (an entry with no label ties to no link, as pkgKSC reads it, W3 2671); the
   CHALLENGER'S UNSUPPORTED-L4 PREMISES list that closes [CR3] presses the challenger, entry j against Cj (as pkgD38 reads it). Only a verse the ledger counts as a
   proven press is used (pwList keys). ENFORCED (GATE_STATUS 'ANSWER OPEN'): raised at the gate after the send-back, cured by a change after which it is no longer raised. */

/* pkgVP1: the BROKEN way out of an E-GATE M item. The answer was given and graded MISSES or FAILS, so the judge "may still find that answer MISSES and grade the link
   BROKEN with a FORCED line that quotes it" (the judges' ledger note; ruling 411). The FORCED line is written as the reason of the GATE line, as for a K-G4 item, and
   is added after the collision line only when the CHANGE TO is a collision line of this item's link graded LINK BROKEN for the pressed side, the FORCED line is for
   that pair and that side, and it passes the K-F test (each quotation found in the round it names). It cures nothing by itself: the item is cured as every
   CONTRADICTION item is, by an applied change after which it is no longer raised and no new LIVE item is raised. */

function gatePromptText2024(body){try{const b=body||{};const out=[];(b.messages||[]).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:''));});(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}



/* pkgGCP (W3 path 2): a counted cure item off once when an applied change replaced its line and cleared it */

/* pkgD38 (W2, W3 3087 ruling 2 + 3089): after a cure or send-back, the stored count, keystone and collision grades must agree with the RULING cards and grounds left in the judge's own text. */
const D38_STATUS={COL:'LIVE',KEY:'LIVE',PREM:'LIVE',BASIS:'LIVE'}; /* W3 sets each type LIVE (sent back; uncured = a gate fault) or TRIAL (record-only) */

/* pkgD38 ASK 2 (W3 3120): a count that came from a cure (the engine recount, CORRECTED COUNT, K-UNX) is fixed; the PREM item may change only the card. */

function d38Refuse2024(to,x){try{const c=x&&x.d38c;if(!c)return null;const t=String(to==null?'':to).replace(/\\+/g,'').replace(/[*_`"\u201c\u201d]+/g,'').trim();
 if(typeof sbLabel!=='function'||sbLabel(t)!==c.lab)return null;const m=t.match(/CONCEDED LINKS\s*:\s*(\d+)/i);if(!m||+m[1]<1)return null;
 return 'pkgD38 (W3 3120): the count came from the cure ('+c.src+'), so this item may change only the RULING card; the change raises '+c.lab+' to '+m[1]+(c.lab==='CHALLENGER CONCEDED LINKS'?', an Oracle concede,':'')+' and is refused. The count stays at its cure value.';}catch(e){return null;}}

const GATE_LINE=/GATE\s*:?\s*(?:ITEM\s*)?#?\s*(G\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i;
/* pkgGDS (W3 3362, Eric ASK 1): a gate or send-back reply line written with "--" where the form needs "||" is rewritten to the form; null when the line already has "||" or is not such a line */

const GDS_NOTE='[FORM NOTE: this reply line used a dash where the form needs the double bar; the engine read it as the form (pkgGDS)]';







const DPT_STATUS='TRIAL';


/* pkgGDA (W2, 33627 gemini G6-G9): a gate CHANGE repeating, word for word, the original change S<n> its E-APPLY item came from is cured when S<n> is applied in the same pass */


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
 const lab=l=>{{const __r=ri5Lab2024(rcOne(l),true);if(__r)return __r;} /* pkgRI5 */const u=rcOne(l).replace(/[*_`]+/g,'').replace(/^(?:[-•]|\d+[.)])?\s*/,'').toUpperCase();const m=u.match(/^(D\d+\s+VS\.?\s+C\d+|DEFENSE STANDING|CHALLENGE STANDING|CHALLENGER CONCEDED LINKS|CONCEDED LINKS|RESULT|CLAUSE|KEYSTONE)\b/);return m?m[1].replace(/\s+VS\.?\s+/,' VS '):'LINE';};
 const sup=(R.rp||[]).map(([o0,n0])=>'\n[AUDIT v27: SUPERSEDED LINE -- '+(seat?'SEAT: '+seat+'; ':'')+'LABEL: '+lab(n0)+'; ORIGINAL: '+cureSafe(rcOne(o0)).replace(/;\s*END\]/g,', END')+' ; END]').join('');
 let rk='';try{const H=rechk2024(R.rp,rechkRounds2024(seat));rk=H.map(h=>'\n[AUDIT v39: K-RECHK -- '+(seat?'SEAT: '+seat+'; ':'')+'CHANGE: '+String(h.id||'change').replace(/;/g,',')+'; RULE: '+h.rule+'; '+(h.old===null?'NOT CHECKED':(h.old?'ALREADY IN THE ORIGINAL':'NEW'))+': '+h.why+'; LINE: '+cureSafe(h.line).slice(0,300)+'; ORIGINAL: '+cureSafe(h.orig).slice(0,300)+'; TRIAL rule, record-only ; END]').join('');}catch(e){rk='\n[AUDIT v39: K-RECHK -- the re-check failed: '+cureSafe(String(e&&e.message||e)).slice(0,160)+' ; END]';}
 return s+'\n'+R.audit+sup+rk;}



 /* pkgFCD (W3 3817): a K-S3 row says when the follow-up's corrected count was not kept */


function rechkRows2024(AM,AS){try{
 const ex=n=>{try{return __L[n]().isExecuted?__L[n]().first().json:null;}catch(e){return null;}};const texts=[];const model={};const alt=new Set(((AS&&AS.alt_seats)||[]).map(s=>s&&s.seat));
 const addB=bs=>(Array.isArray(bs)?bs:[]).forEach(x=>{try{const p=JSON.parse(x).payload;texts.push([p.judge_seat||null,p.verdict_raw]);if(p.judge_seat&&!model[p.judge_seat])model[p.judge_seat]=p.judge_api_model||null;}catch(e){}});
 for(const n of ['Panel Cure Check','Gate Record','Alt Gate Record']){const j=ex(n);if(j)addB(j.bodies);}addB(AM.bodies);
 (AM.alternates_tried||[]).forEach(x=>{if(x&&x.verdict_raw)texts.push([x.alternate||null,x.verdict_raw]);});
 const RX=/\[AUDIT v39: K-RECHK -- (?:SEAT: ([^;\]]*); )?CHANGE: ([^;\]]*); RULE: (K-[A-Z0-9]+); (NEW|ALREADY IN THE ORIGINAL|NOT CHECKED): ([\s\S]*?); LINE: ([\s\S]*?); ORIGINAL: ([\s\S]*?); TRIAL rule, record-only ; END\]/g;
 const seen=new Set();const rows=[];const T=new Date().toISOString();
 for(const [s0,t] of texts){const s=String(t==null?'':t);RX.lastIndex=0;let m;while((m=RX.exec(s))){const seat=m[1]||s0||null;const k=[seat,m[2],m[3],m[4],m[6]].join('|');if(seen.has(k))continue;seen.add(k);
  rows.push({run_token:(AS&&AS.run_token)||AM.run_token||null,seat,seat_role:seat&&alt.has(seat)?'alternate':'panel',judge_model:model[seat]||null,kind:'send_back',rule:'K-RECHK',item:m[2],flagged_line:m[6],prompt_sent:null,full_reply:null,reply_error:null,response_line:m[7],cure_status:null,cure_reason:m[4]+' ('+m[3]+'): '+m[5]+' (TRIAL rule, record-only; W3 2496)',at:T});}}
 return rows;}catch(e){return [];}}
const AM=$('Alternate Merge Seat').first().json;const AS=$('Alt Seated').first().json;
if(!Array.isArray(AS.alt_seats)||!AS.alt_seats.length){const __rk=rechkRows2024(AM,AS);if(!__rk.length)return [{json:AM}];const __b=AM.enforcer_log_body||{};
 return [{json:{...AM,enforcer_log:(AM.enforcer_log||[]).concat(__rk)}}];}
const ex=n=>{try{return __L[n]().isExecuted?__L[n]().first().json:null;}catch(e){return null;}};
const JER=ex('Alt Judge Enforcer Record'),SBR=ex('Alt Send Back Record'),GR=ex('Alt Gate Record');
const gb=(GR&&Array.isArray(GR.bodies)&&GR.bodies.length===AS.bodies.length)?GR.bodies:AS.bodies;const SBI=(GR&&GR.sb_items)||(SBR&&SBR.sb_items)||[];
const PRE=(()=>{const g=ex('Gate Record');if(g&&Array.isArray(g.bodies))return g;return $('Panel Cure Check').first().json;})();
const bodies=AM.bodies.slice();const summary=(AM.summary||[]).map(x=>({...x}));let seated=(AM.alternates_seated||[]).slice();let removed=(AM.drv_removed||[]).slice();
const tried=(AM.alternates_tried||[]).map(x=>({...x}));const log=(AM.enforcer_log||[]).slice();const alt_apply=[];const T=new Date().toISOString();
const __vp1RR=(()=>{try{return $('Alt Reread Record').isExecuted?($('Alt Reread Record').first().json.rr_rows||[]):[];}catch(e){return [];}})(); /* pkgVP1: the second readings follow the send-back rows */
[JER&&JER.enf428_rows,SBR&&SBR.sb_rows,__vp1RR,GR&&GR.gate_rows].forEach(rs=>(rs||[]).forEach(x=>log.push(x)));
const roundsOf=seat=>{const j=(AS.judges||[]).find(q=>q.seat===seat);return j&&j.body?ciRounds(gatePromptText2024(j.body)):null;};
const altSafe=s=>cureSafe(s).replace(/\{/g,'(').replace(/\}/g,')').replace(/\s+/g,' ').trim();
for(const s of AS.alt_seats){const k=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===s.seat;}catch(e){return false;}});const gi=AS.bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===s.seat;}catch(e){return false;}});
 if(k<0||gi<0){alt_apply.push({seat:s.seat,error:'the seated alternate\'s body was not found'});continue;}
 const b=JSON.parse(gb[gi]);const its=SBI.filter(x=>x.seat===s.seat);let R=null;
 if(its.length){try{const t0=b.payload.verdict_tag;const F0={verdict_tag:b.payload.verdict_tag,defense_standing:b.payload.defense_standing,conceded_links:b.payload.conceded_links,challenge_standing:b.payload.challenge_standing,challenger_conceded_links:b.payload.challenger_conceded_links};
  R=sbApply2024(s.seat,b.payload.verdict_raw,F0,its,roundsOf(s.seat));if(R){b.payload.verdict_raw=cureRewrite(b.payload.verdict_raw,true,R,s.seat,F0);Object.assign(b.payload,R.fields);b.payload.verdict_raw=cureSupHead(b.payload.verdict_raw,t0,b.payload.verdict_tag);}
  log.push({run_token:AS.run_token,seat:s.seat,seat_role:'alternate',judge_model:s.api_model,kind:'send_back',rule:'E-APPLY',item:'APPLIED '+(R?(R.applied.join(', ')||'none'):'none'),flagged_line:null,prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:null,cure_reason:R?'verdict '+t0+' to '+R.fields.verdict_tag+'; derived RESULT '+R.result+' (WALL-2024 2236, 2237; item C)':'no change applied',at:T});
  (R?R.items:[]).forEach(z=>log.push({run_token:AS.run_token,seat:s.seat,seat_role:'alternate',judge_model:s.api_model,kind:'send_back',rule:'E-APPLY',item:z.sid+' '+z.kind,flagged_line:String(z.to||'').slice(0,1500),prompt_sent:null,full_reply:null,reply_error:null,response_line:null,cure_status:'UNCURED',cure_reason:'answered at the gate (Alt Gate Record): '+z.why,at:T}));}
  catch(e){alt_apply.push({seat:s.seat,error:String(e&&e.message||e).slice(0,300)});}}
 const du=b.payload.drv_uncured||0;
 if(du>0){
  const un=((GR&&GR.gate_rows)||[]).filter(x=>x.seat===s.seat&&x.cure_status==='UNCURED'&&/counted in drv_uncured/.test(String(x.cure_reason||''))).map(x=>'E-GATE '+x.item)
   .concat(((SBR&&SBR.sendback&&SBR.sendback.silent_counted)||[]).filter(x=>x.seat===s.seat).flatMap(x=>x.items.map(i=>'SEND-BACK '+i+' (no written answer)')));
  const why='unseated after its enforcer send-back and gate: '+du+' uncured item(s)'+(un.length?' ('+un.join('; ')+')':'');
  const pre=PRE.bodies&&PRE.bodies[k]?JSON.parse(PRE.bodies[k]):null;
  if(pre){pre.payload.verdict_raw=pre.payload.verdict_raw+'\n[AUDIT v21: ALTERNATE TRIED -- SEAT: '+s.removed_seat+'; ALTERNATE: '+s.seat+'; MODEL: '+(s.api_model||'none')+'; RESULT: NOT SEATED; WHY: '+altSafe(why.slice(0,600))+']\n[AUDIT v39: ALTERNATE UNSEATED -- SEAT: '+s.removed_seat+' is left unfilled and not counted; ALTERNATE: '+s.seat+'; '+altSafe(why.slice(0,900))+' (WALL-2024 2268 ruling 1). REVIEW THIS ROW.]';
   bodies[k]=JSON.stringify(pre);if(PRE.summary&&PRE.summary[k])summary[k]={...PRE.summary[k]};}
  seated=seated.filter(x=>x.alternate_seat!==s.seat);removed=removed.filter(r=>r.replaced_by!==s.seat);
  tried.forEach(x=>{if(x.alternate===s.seat&&x.result==='SEATED'){x.result='NOT SEATED';x.why=why;x.verdict_raw=b.payload.verdict_raw;}});
  alt_apply.push({seat:s.seat,removed_seat:s.removed_seat,applied:R?R.applied:[],unseated:true,why,uncured:un});}
 else{bodies[k]=JSON.stringify(b);alt_apply.push({seat:s.seat,removed_seat:s.removed_seat,applied:R?R.applied:[],unseated:false});}}
const panel_effective=summary.map(x=>x.seat).sort();
rechkRows2024({...AM,bodies,alternates_tried:tried},AS).forEach(r=>log.push(r));
return [{json:{...AM,bodies,summary,panel_effective,alternates_seated:seated,drv_removed:removed,alternates_tried:tried,enforcer_log:log,alt_apply}}];
})();
if(Array.isArray(__CSPOUT))for(const it of __CSPOUT){const j=it&&it.json;if(!j||!Array.isArray(j.bodies))continue;it.json={...j,bodies:j.bodies.map(x=>{try{const s=typeof x==='string';const o=s?JSON.parse(x):JSON.parse(JSON.stringify(x));if(!o||!o.payload)return x;o.payload.conceded_split=__CSP(o.payload.verdict_raw,o.payload.conceded_links,o.payload.challenger_conceded_links);return s?JSON.stringify(o):o;}catch(e){return x;}})};}
return __CSPOUT;