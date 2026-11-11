const __X1=$('C4 Extract').first().json;const __G=$('C4G Build').first().json;const __in=$input.first().json||{};
const __keep=(why,second)=>[{json:{...__X1,grants_resend:{resent:!!(__G&&__G.resend),kept:'first',why,first_check:__X1.grants_check||null,second:second||null}}}];
if(!__G||!__G.resend)return __keep(__G&&__G.why||'no re-call');
if(__in.error)return __keep('the re-call failed: '+String(__in.error&&__in.error.message||__in.error).slice(0,200));
let __X2=null;try{__X2=(()=>{
const OGR=(()=>{
 const RX=/\bI\s+(?:do\s+not\s+claim|no\s+longer\s+claim|withdraw|grant|concede|drop)\b|(?:^|(?<=[.!?]["”')\]]?\s+)|(?<=\n[ \t>*#-]*))(?:Granted|Conceded|CONCEDED)\b/g;
 const N=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'");
 const W=s=>N(s).toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 function harvest(R){const out=[];const seen=new Set();
  for(const rk of ['CR1','CR2','CR3','CR4']){const t=N(R&&R[rk]);if(!t)continue;
   for(const m of t.matchAll(RX)){const ls=t.lastIndexOf('\n',m.index)+1;const le=t.indexOf('\n',m.index);const ln=t.slice(ls,le<0?t.length:le);const bf=t.slice(ls,m.index);
    if(/^\s*#/.test(ln)&&!/[.!?]["')\]]?\s*$/.test(ln))continue;
    if((bf.match(/"/g)||[]).length%2===1)continue;
    if(/^\s*(?:none|nothing|no)\b/i.test(t.slice(m.index+m[0].length)))continue;
    const ss=t.slice(m.index).split(/(?<=[.!?])["')\]]?\s|\n/);let s=ss[0];if(s.split(/\s+/).length<7&&ss[1])s=s+' '+ss[1];  s=s.slice(0,260).trim();const k=W(s);if(k.split(' ').length<3||seen.has(k))continue;seen.add(k);
    out.push({g:out.length+1,round:rk,text:s});}}
  return out;}
 
 function check(dr4,G,R){const T=N(dr4);const i=T.search(/OPPONENT'?S GRANTS\s*:/i);const res={section:i>=0,missing:[],misquoted:[],ok:[]};if(!G.length)return {...res,applies:false};
  const sec=i<0?'':T.slice(i).split(/\n\s*\n(?!\s*G\d)/)[0];const lines=sec.split('\n').filter(l=>/^\s*[-*]?\s*G(?:\d+\b|\+)/.test(l));res.extra=[];
  for(const l of lines.filter(z=>/^\s*[-*]?\s*G\+/.test(z))){const q=(l.match(/\]\s*"(.{6,})"\s*(?:--|\u2014|\u2013)\s*SUPPORTS\b/i)||l.match(/"([^"]{6,})"/)||[])[1];  const rk=(l.match(/\[(CR[1-4])\]/)||[])[1];const ok=!!(q&&rk&&W(R[rk]||'').includes(W(q)));res.extra.push({ok,round:rk||null,q:q?q.slice(0,120):null});if(!ok)res.misquoted.push('G+ ('+(q?'"'+q.slice(0,60)+'" does not stand in ['+(rk||'no round')+']':'no quotation')+')');}
  for(const x of G){const l=lines.find(z=>new RegExp('^\\s*[-*]?\\s*G'+x.g+'\\b').test(z));if(!l){res.missing.push('G'+x.g);continue;}
   const q=(l.match(/\]\s*"(.{6,})"\s*(?:--|\u2014|\u2013)\s*SUPPORTS\b/i)||l.match(/"([^"]{6,})"/)||[])[1];  const rk=(l.match(/\[(CR[1-4])\]/)||[])[1];
   if(!q||!rk){res.misquoted.push('G'+x.g+' (no quotation or no round)');continue;}
   const inRound=W(R[rk]||'').includes(W(q));const same=W(q).includes(W(x.text))||W(x.text).includes(W(q))&&W(q).split(' ').length>=6;
   if(!inRound)res.misquoted.push('G'+x.g+' (the quotation does not stand in ['+rk+'])');else if(!same)res.misquoted.push('G'+x.g+' (not the listed grant)');else res.ok.push('G'+x.g);}
  return {...res,applies:true,pass:res.section&&!res.missing.length&&!res.misquoted.length};}
 return {harvest,check};})();
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
const C4P=(()=>{
 const refs=t=>{const out=[];for(const r of REFP.parse(t,{scoped:true})){const b=r.book||r.ctx;if(!b)continue;const z=Math.max(r.v1,Math.min(r.v2,r.v1+30));const vs=[];for(let x=r.v1;x<=z;x++)vs.push(b+' '+r.c+':'+x);out.push({label:b+' '+r.label,vs,cv:r.label,bare:r.head&&!r.book&&r.pos>r.at});}return out;};
 const fresh=(earlier,c4)=>{const S=new Set();const u=[],K=x=>x.replace(/.* /,'');earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>{S.add(x);const q=S[K(x)]=S[K(x)]||[];q.includes(x)||q.push(x);})));const seen=new Set();const o=refs(c4).filter(r=>{if(r.vs.some(x=>S.has(x)))return false;const m=r.bare&&[...new Set(r.vs.flatMap(x=>S[K(x)]||[]))].join(', ');return m?(u.push([r.label,r.cv+' ('+m+' named earlier)']),false):true;}).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));o.u=[...new Set(u.filter(z=>!o.includes(z[0])).map(z=>z[1]))];return o;};
 
     
 
 
 
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
 
 const MULTI=/^[ \t>#*_-]*\**\s*[DC]\d+\**\s*(?:,|and\b|&|\/|[-–—]\s*\**[DC]?\d)\s*\**\s*[DC]?\d/i;
 const closeLabels=(t,sd)=>{const T=String(t||'');const out=[];const L=sd;
  const lists=[...T.matchAll(new RegExp('(?:^|[:;.]\\s+)((?:\\**'+L+'\\d+\\**\\s+[^,;\\n]{4,160}?(?:,\\s*(?:and\\s+)?|;\\s*|\\.\\s*$|\\.(?=\\s)|$)){3,})','gm'))];
  for(const m of lists)for(const x of m[1].matchAll(new RegExp('\\**'+L+'(\\d+)\\**\\s+([^,;\\n]{4,160}?)(?=,\\s*(?:and\\s+)?\\**'+L+'\\d|;|\\.\\s|\\.$|$)','g')))if(!/^(?:vs\b|and\b|[-–—]|to\b|through\b)/i.test(x[2]))out.push({n:+x[1],text:x[2],from:'list'});
  const H=[...T.matchAll(new RegExp('^[ \\t>#*_-]*'+L+'(\\d+)\\b[^\\n]*','gm'))].filter(h=>!/^\s*[^\n]*\bvs\.?\s/i.test(h[0])&&!/ANSWER\s*:/i.test(h[0])&&!MULTI.test(h[0]));
  H.forEach(h=>{if(out.some(o=>o.n===+h[1]))return;const from=h.index+h[0].length;const tail=T.slice(from);
   let e=tail.search(/\n\s*\n|\n[ \t]*#{1,6}\s|\n[ \t>*_-]*\**\s*[DC]\d+\b|\n[ \t>*_-]*\**\s*ANSWER\s*:/);e=e<0?tail.length:e;out.push({n:+h[1],text:T.slice(h.index,from+Math.min(e,2500)),from:'block'});});
  return out;};
 const mismatch=(labels,targets,lab,tlab)=>{const out=[];const TG=targets.map(x=>({k:x.k,w:stems(x.text),v:vkeys(x.text)}));const df={};TG.forEach(x=>x.w.forEach(w=>{df[w]=(df[w]||0)+1;}));
  const lim=Math.max(1,Math.floor(TG.length/3));const dist=w=>(df[w]||0)<=lim;
  const sc=(a,b)=>{let n=0;for(const x of a.w)if(b.w.has(x)&&dist(x))n++;for(const x of a.v)if(b.v.has(x))n+=2;return n;};
  for(const c of labels){const a={w:stems(c.text),v:vkeys(c.text)};const own=TG.find(x=>x.k===c.n);if(!own)continue;const os=sc(a,own);if(os>0)continue;
   const best=TG.filter(x=>x.k!==c.n).map(x=>({k:x.k,s:sc(a,x)})).sort((p,q)=>q.s-p.s)[0];
   if(best&&best.s>=3)out.push(lab+c.n+' ("'+String(c.text).replace(/\s+/g,' ').replace(/[\[\]"*_#]/g,'').trim().slice(0,70)+'") shares no verse and no distinctive word with '+tlab+c.n+' and matches '+tlab+best.k+' (score '+best.s+')');}
  return out;};
 const renum=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];const out=[];
  const rm=[...t.matchAll(new RegExp(RENUM.source,RENUM.flags.replace('g','')+'g'))].find(m=>!/\b(?:not|no|never|nor|without)\b[^.\n]{0,40}$/i.test(t.slice(Math.max(0,m.index-60),m.index)))||null;  if(rm&&/\b[DC]\d+\b/.test(t.slice(Math.max(0,rm.index-200),rm.index+400))){const a=Math.max(0,t.lastIndexOf('\n',rm.index)+1);out.push('it states a numbering of its own ("'+t.slice(Math.max(a,rm.index-40),rm.index+120).replace(/\s+/g,' ').replace(/[\[\]"]/g,'').trim()+'")');}
  const nd=nDecl(F),nc=nLink(F);const hd=[...new Set([...t.matchAll(/\bD(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nd&&x>nd);const hc=[...new Set([...t.matchAll(/\bC(\d+)\b/g)].map(m=>+m[1]))].filter(x=>nc&&x>nc);
  if(hd.length)out.push('D'+hd.join(', D')+' above the '+nd+' declared links');if(hc.length)out.push('C'+hc.join(', C')+' above the '+nc+' LINK blocks of [DR3]');
  try{const DL=dlinks(F).map(x=>({k:x.n,text:x.text}));if(DL.length)mismatch(closeLabels(t,'D'),DL,'D','declared D').forEach(x=>out.push(x));
   const CB=cblocks(F).map(x=>({k:x.j,text:x.text}));if(CB.length&&sd==='C')mismatch(closeLabels(t,'C'),CB,'C','[DR3] LINK block C').forEach(x=>out.push(x));}catch(e){}
  return out;};
 
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
 
 
 
 
 
 
 return {refs,fresh,renum,declared,dlinks,cblocks,};})();
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const readEnv=(fam,d)=>{let text=null,trunc=false,u={},cd=null,id=null;
 if(fam==='anthropic'){text=((d.content||[]).filter(c=>c.type==='text').map(c=>c.text).join('\n'))||null;trunc=d.stop_reason==='max_tokens';const x=d.usage||{};const xi=Number(x.input_tokens)||0,xw=Number(x.cache_creation_input_tokens)||0,xr=Number(x.cache_read_input_tokens)||0;u={input_tokens:xi+xw+xr,output_tokens:Number(x.output_tokens)||0,cache_creation_input_tokens:xw,cache_read_input_tokens:xr,input_uncached_tokens:xi};id=typeof d.id==='string'?d.id:null;const dg=d.diagnostics;const cm=dg&&typeof dg==='object'?dg.cache_miss_reason:undefined;const why=(dg===null||dg===undefined)?(DP?'null (no divergence)':'null (first Claude call of the seat, previous_message_id=null)'):(cm===null||cm===undefined)?'pending (comparison not finished)':(String(cm.type||'unknown')+(cm.cache_missed_input_tokens!==undefined&&cm.cache_missed_input_tokens!==null?'; cache_missed_input_tokens='+cm.cache_missed_input_tokens:''));cd='[CACHE DIAG C4: cache_miss_reason='+why+'; read='+xr+'; write='+xw+'; uncached='+xi+'; previous_message_id='+(DP||'null')+'; message_id='+(id||'none')+']';}
 else if(fam==='gemini'){const c=(d.candidates||[])[0]||{};text=(((c.content||{}).parts||[]).filter(p=>!p.thought&&typeof p.text==='string').map(p=>p.text).join(''))||null;trunc=c.finishReason==='MAX_TOKENS';const x=d.usageMetadata||{};u={input_tokens:x.promptTokenCount||0,output_tokens:(Number(x.candidatesTokenCount)||0)+(Number(x.thoughtsTokenCount)||0),cache_creation_input_tokens:0,cache_read_input_tokens:x.cachedContentTokenCount||0};}
 else{const c=(d.choices||[])[0]||{};text=(c.message&&c.message.content)||null;trunc=(c.finish_reason==='length'||c.finish_reason==='model_context_window_exceeded');const x=d.usage||{};u={input_tokens:x.prompt_tokens||0,output_tokens:x.completion_tokens||0,cache_creation_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cache_write_tokens)||0,cache_read_input_tokens:(x.prompt_tokens_details&&x.prompt_tokens_details.cached_tokens)||x.prompt_cache_hit_tokens||0};}
 return {text,trunc,u,cd,id};};
const B=$('C4G Build').first().json.call;const DP=B&&B.diag_prev?B.diag_prev:null;const e=readEnv(B.fam,$input.first().json||{});
const RF=(()=>{const d=$input.first().json||{};if(B.fam==='anthropic')return d.stop_reason==='refusal'?'stop_reason=refusal'+(d.stop_details&&d.stop_details.category?' (category '+d.stop_details.category+')':''):null;const GB=['SAFETY','RECITATION','BLOCKLIST','PROHIBITED_CONTENT','SPII','IMAGE_SAFETY','IMAGE_PROHIBITED_CONTENT'];if(B.fam==='gemini'){const pf=d.promptFeedback||{};if(pf.blockReason)return 'promptFeedback.blockReason='+pf.blockReason;const f=((d.candidates||[])[0]||{}).finishReason;return GB.includes(f)?'finishReason='+f:null;}const c=(d.choices||[])[0]||{};if(c.finish_reason==='content_filter')return 'finish_reason=content_filter';if(c.native_finish_reason==='content_filter'||c.native_finish_reason==='refusal'||GB.includes(c.native_finish_reason))return 'native_finish_reason='+c.native_finish_reason;if(c.message&&typeof c.message.refusal==='string'&&c.message.refusal.trim()!=='')return 'message.refusal: '+c.message.refusal.trim().slice(0,200);return null;})();
const RFT=(e.text&&/^\s*The request was rejected because it was considered high risk\.?\s*$/i.test(e.text))?'reply text is the provider rejection "'+String(e.text).trim().slice(0,80)+'"':null;
if(RF||RFT)throw new Error('VALIDATION: C4 (CHALLENGER, '+B.fam+' '+B.model+') refused by the provider: '+(RF||RFT)+'; output_tokens='+e.u.output_tokens+'. A refusal is not a debate round.'+RT);
if(!e.text||String(e.text).trim()===''){const d0=$input.first().json||{};const c0=(d0.choices||[])[0]||{};const g0=(d0.candidates||[])[0]||{};const x0=d0.usage||{};const fin=d0.stop_reason||g0.finishReason||c0.finish_reason||null;const rt=(x0.completion_tokens_details&&x0.completion_tokens_details.reasoning_tokens)||(d0.usageMetadata&&d0.usageMetadata.thoughtsTokenCount)||0;const rc=(c0.message&&typeof c0.message.reasoning==='string')?c0.message.reasoning.length:0;const er=d0.error?String(d0.error.message||JSON.stringify(d0.error)).slice(0,200):null;throw new Error('VALIDATION: C4 (CHALLENGER, '+B.fam+' '+B.model+') returned no text: finish_reason='+fin+'; output_tokens='+e.u.output_tokens+'; reasoning_tokens='+rt+'; reasoning_chars='+rc+(er?'; error='+er:'')+'.'+RT);}
let raw=e.text;if(e.trunc){raw+='\n\n[TRUNCATED: the provider reported the token limit -- raise max_tokens]';}
const __RFX=(()=>{const n=4;const fx={heading:null,placeholder:0};const L=raw.split('\n');for(let i=0,k=0;i<L.length&&k<3;i++){if(!L[i].trim())continue;k++;const h=L[i].match(/^([ \t#*_>-]*)(.*?\bRound\s+)(\d)\b(\s*\((?:close|closing|close round|link round|link)\)|\s*[-–—:]?\s*(?:close|closing)\b(?:\s+round)?)?(.*)$/i);if(!h||(!/^[ \t]*(?:#|\*\*|__)/.test(L[i])&&L[i].length>160))continue;if(+h[3]===n)break;fx.heading=L[i].trim();L[i]=h[1]+h[2]+n+(n===4?' (close)':n===3?' (link round)':'')+h[5];break;}if(fx.heading)raw=L.join('\n');return fx;})();
const I=$('Init with Guards').first().json;const labelled=I.lab.C+' -- ROUND 4, CLOSE ROUND\n\n'+raw;
const __ogrS2=t=>{const __sb=(T,H,G)=>{const i=T.search(H);if(i<0)return T;const L=T.slice(i).split('\n');let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\n');return T.slice(0,i)+sec.replace(/["\u201c][^"\u201d\n]*["\u201d]/g,'""')+T.slice(i+sec.length);};return __sb(__sb(String(t||''),/OPPONENT['\u2019]?S GRANTS\s*:/i,/^\s*[-*]?\s*\**\s*G(?:\d+|\+)/),/OPPONENT['\u2019]?S CONTRADICTIONS\s*:/i,/^\s*[-*]?\s*\**\s*X\d+/);};
let new_press=[];try{new_press=C4P.fresh([$('C1B Extract').first().json.raw,$('C2B Extract').first().json.raw,$('C3B Extract').first().json.raw],__ogrS2(raw));}catch(x){new_press=[];}
 let grants=[],grants_check=null;try{const __R={CR1:$('D1 Extract').first().json.raw,CR2:$('D2B Extract').first().json.raw,CR3:$('D3B Extract').first().json.raw,CR4:$('D4B Extract').first().json.raw};grants=OGR.harvest(__R);grants_check=OGR.check(raw,grants,__R);}catch(x){grants_check={error:String(x&&x.message||x).slice(0,200)};}
 let contradictions=null;try{const __OR={CR1:$('D1 Extract').first().json.raw,CR2:$('D2B Extract').first().json.raw,CR3:$('D3B Extract').first().json.raw,CR4:$('D4B Extract').first().json.raw};const N=s=>String(s==null?'':s).replace(/[*_`]+/g,'').replace(/[\u201c\u201d]/g,'"').replace(/[\u2018\u2019]/g,"'");const W=s=>N(s).toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();const T=N(raw);const i=T.search(/OPPONENT'?S CONTRADICTIONS\s*:/i);if(i<0)contradictions={section:false,none:false,lines:[],found:0,not_found:0};else{const A=T.slice(i).split('\n');const none=/CONTRADICTIONS\s*:\s*NONE\b/i.test(A[0]);const lines=[];for(const l0 of A.slice(1)){const l=l0.trim();if(!l){if(lines.length)break;continue;}if(!/^[-*]?\s*X\d+/.test(l))break;const x=(l.match(/X(\d+)/)||[])[1];const on=l.match(/\b(LINK|PREMISE)\s+(\d+)/i);const e=l.match(/EARLIER\s*\[(CR[1-4])\]\s*"(.*?)"\s*\|\s*CLOSING/i);const c=l.match(/CLOSING\s*\[(CR[1-4])\]\s*"(.*)"\s*\|/i);const eok=!!(e&&e[1]!=='CR4'&&e[2].trim().split(/\s+/).length>=3&&W(__OR[e[1]]).includes(W(e[2])));const cok=!!(c&&c[1]==='CR4'&&c[2].trim().split(/\s+/).length>=3&&W(__OR.CR4).includes(W(c[2])));lines.push({x:x?Number(x):null,on:on?on[1].toUpperCase()+' '+on[2]:null,earlier_round:e?e[1]:null,earlier:e?e[2].slice(0,300):null,closing_round:c?c[1]:null,closing:c?c[2].slice(0,300):null,earlier_found:eok,closing_found:cok,found:eok&&cok,why:String(l.split('|').slice(-1)[0]||'').trim().slice(0,200)});}contradictions={section:true,none,lines,found:lines.filter(z=>z.found).length,not_found:lines.filter(z=>!z.found).length};}}catch(x){contradictions={error:String(x&&x.message||x).slice(0,200)};}
let renumbered=[];try{renumbered=C4P.renum({cr1:$('D1 Extract').first().json.raw,dr3:$('C3B Extract').first().json.raw,dr4:raw},'C');}catch(x){renumbered=[];}
return [{json:{run_token:TOK,round:'C4',raw,round_fix:__RFX,labelled,usage:e.u,fam:B.fam,model:B.model,cache_diag:e.cd,msg_id:e.id,new_press,renumbered,grants,grants_check,contradictions}}];
})()[0].json;}catch(x){return __keep('the re-call reply was not read: '+String(x&&x.message||x).slice(0,200));}
const __f=c=>!c||c.error||!c.applies?1e9:(c.missing||[]).length+(c.misquoted||[]).length;const __a=__f(__X1.grants_check),__b=__f(__X2.grants_check);
if(__b<__a)return [{json:{...__X2,grants_resend:{resent:true,kept:'second',why:'faults '+__a+' -> '+__b,first_check:__X1.grants_check||null,first_raw_chars:String(__X1.raw||'').length}}}];
return __keep('the re-call did not improve the section (faults '+__a+' -> '+__b+')',{grants_check:__X2.grants_check,raw_chars:String(__X2.raw||'').length});