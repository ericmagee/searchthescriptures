const __SYNTH9=" QUOTE ONLY THE RECORD: every quotation you give is words of the transcript above or of the KJV, with its book, chapter and verse; the system checks your quotations against the KJV as it checks the debaters'. Give no verdict of any kind: do not say which side won, prevailed, held, broke or should be believed, do not grade any link, and do not state a doctrinal conclusion of your own.";
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
 const fresh=(earlier,c4)=>{const S=new Set();const u=[],K=x=>x.replace(/.* /,'');earlier.forEach(t=>refs(t).forEach(r=>r.vs.forEach(x=>{S.add(x);S[K(x)]=S[K(x)]||x;})));const seen=new Set();const o=refs(c4).filter(r=>{if(r.vs.some(x=>S.has(x)))return false;const m=r.bare&&r.vs.map(x=>S[K(x)]).find(Boolean);return m?(u.push([r.label,r.cv+' ('+m+' named earlier)']),false):true;}).map(r=>r.label).filter(l=>!seen.has(l)&&seen.add(l));o.u=[...new Set(u.filter(z=>!o.includes(z[0])).map(z=>z[1]))];return o;};
 const U=(n,w)=>n.u&&n.u.length?'\n\n[CLOSE-ROUND BOOK CHECK -- by code: '+w+' writes '+n.u.join(', ')+' with no book; not marked NEW, not cleared: read the sentence for its book.]':'';
 const __ogrS=t=>{const __sb=(T,H,G)=>{const i=T.search(H);if(i<0)return T;const L=T.slice(i).split('\n');let n=1;while(n<L.length&&(G.test(L[n])||(!L[n].trim()&&n+1<L.length&&G.test(L[n+1]))))n++;const sec=L.slice(0,n).join('\n');return T.slice(0,i)+sec.replace(/["\u201c][^"\u201d\n]*["\u201d]/g,'""')+T.slice(i+sec.length);};return __sb(__sb(String(t||''),/OPPONENT['\u2019]?S GRANTS\s*:/i,/^\s*[-*]?\s*\**\s*G(?:\d+|\+)/),/OPPONENT['\u2019]?S CONTRADICTIONS\s*:/i,/^\s*[-*]?\s*\**\s*X\d+/);};    const of=F=>F&&F.dr4?fresh([F.gr1,F.gr2,F.dr3],__ogrS(F.dr4)):[];
 const note=F=>{const n=of(F);return (n.length?'\n\n[CLOSE-ROUND PRESS CHECK -- computed by the system, not by a model: [DR4] names '+n.length+' verse reference(s) that no earlier challenger round names: '+n.join(', ')+'. The close round may not press: each is a NEW PRESS and is NOT COUNTED as evidence, as a witness or as an answer.]':'')+U(n,'[DR4]');};
 const ofD=F=>F&&F.cr4?fresh([F.cr1,F.gr1,F.cr2,F.gr2,F.cr3,F.dr3],F.cr4):[];
 const noteD=F=>{const n=ofD(F);return (n.length?'\n\n[CLOSE-ROUND NEW-VERSE CHECK -- computed by the system, not by a model: [CR4] names '+n.length+' verse reference(s) that no earlier round of either side names: '+n.join(', ')+'. Each is NEW IN CLOSE, NOT COUNTED: not evidence, footing, witness or answer. Material in [CR4] counts only as an answer to a witness already pressed against the defender; a sentence in [CR4] that grades or presses against a challenger link is disregarded.]':'')+U(n,'[CR4]');};
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
 const noteR=(F,sd)=>{const r=renum(F,sd);return r.length?'\n\n[CLOSE-ROUND NUMBERING CHECK -- computed by the system, not by a model: ['+(sd==='D'?'CR4':'DR4')+'] does not keep the declared numbering (a TRIAL check): '+r.join('; ')+'. Grade by the D numbers of the DECLARED CHAIN in [CR1] and the C numbers of the [DR3] LINK blocks; the close round\'s numbering does not govern.]':'';};
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
 const press=(F,sd)=>{const t=String((sd==='D'?F.cr4:F.dr4)||'');if(!t)return [];
  const other=sd==='D'?/\bchallenger(?:['’]s)?\b|\bC\d+\b/i:/\bdefen(?:der|ce|se)(?:['’]s)?\b|\bD\d+\b/i;
  const QW=x=>String(x).toLowerCase().replace(/[^a-z\u00c0-\u024f\u1e00-\u1eff ]+/g,' ').split(/\s+/).filter(w=>w.length>=4&&!/^(?:that|this|with|from|have|been)$/.test(w));
  const OS=(sd==='D'?[F.gr1,F.gr2,F.dr3,F.dr4]:[F.cr1,F.cr2,F.cr3,F.cr4]).map(x=>String(x||'').replace(/[*_]+/g,'')).join('\n').split(/[.!?](?:\s|$)|\n/).map(QW).filter(w=>w.length);
  const said=q=>q.length>=2&&OS.some(w=>{for(let st=0;st<w.length;st++){if(w[st]!==q[0])continue;let k=1,e=st;for(let i=st+1;i<w.length&&k<q.length;i++)if(w[i]===q[k]){k++;e=i;}if(k===q.length&&e-st+1<=3*q.length)return true;}return false;});
  const REPORT=/^(?:[DC]\d+\W+)?(?:the\s+)?(?:defender|challenger)(?:['’]s)?\s+(?:grants|granted|says|said|holds|held|states|stated|writes|wrote|narrows|narrowed|answers|answered|concedes|conceded|admits|admitted|drops|dropped|files|filed|claims|claimed|reads|read)\b/i;
  const report=s=>{if(!REPORT.test(s)||/[—–]|\s--\s|;|\bbut\b|\byet\b|\bso\b/i.test(s))return false;return said(QW(s.replace(REPORT,'')));};
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
  const LISTH=/\bUNSUPPORTED-?\s*\[?L4\]?\s*PREMISES\b|\bPREMISES?\s+(?:LIST|AGAINST)\b|\bPREMISE\s+COUNT\s*:/i;const PW=/\bPRESSED\s+WITH\s*:/i;
  const out=[];const seen=new Set();let list=null;
  const add=(s0,why)=>{const s=s0.replace(/\*+/g,'').replace(/\s+/g,' ').trim();if(s.length<12)return;const c=s.slice(0,220);if(seen.has(c))return;seen.add(c);out.push({why,s:c});};
  for(const p0 of t.split(/\n[ \t]*\n/)){let L=p0.split('\n');while(L.length&&/^[ \t]*#{1,6}\s/.test(L[0])){const h=L[0].replace(/^[ \t]*#+\s*/,'').replace(/[*_]+/g,'').trim();list=LISTH.test(h)?'new premise list "'+h.slice(0,60)+'"':null;L=L.slice(1);}
   const p=L.join('\n').trim();if(!p)continue;if(/^[ \t>*_-]*\**\s*ANSWER\s*:/i.test(p))continue;
   const bold=p.match(/^[ \t>_-]*\*\*([^*\n]{4,160})\*\*/);if(bold&&LISTH.test(bold[1]))list='new premise list "'+bold[1].trim().slice(0,60)+'"';else if(LISTH.test(p.split('\n')[0])&&p.split('\n')[0].length<160)list='new premise list "'+p.split('\n')[0].replace(/[*_#]+/g,'').trim().slice(0,60)+'"';
   for(const s0 of p.split(/\n|(?<=[.!?])["”'’)\]]*\s+(?=["“(\[*_]*[A-Z])/)){const s=s0.replace(/\*+/g,'').replace(/^[ \t>_-]+/,'').trim();if(s.length<12)continue;
    if(list){add(s,list);continue;}if(PW.test(s)){add(s,'PRESSED WITH line');continue;}
    if(report(s)||OWN.test(s))continue;if(!other.test(s))continue;const g=VERD.find(([k,rx])=>rx.test(s)&&(k!=='concession claimed'||/\b[CD]\d+\b|\b(?:link|chain|premise|ground|point|case)s?\b/i.test(s)));if(g)add(s,g[0]);}}
  return out;};
 const noteL=(p,sd)=>p&&p.length?'\n\n[CLOSE-ROUND GRADING CHECK -- computed by the system, not by a model; a TRIAL check: ['+(sd==='D'?'CR4':'DR4')+'] holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links. A close round presses nothing (ruling 377): each is DISREGARDED, not a ground for any grade or count: '+p.map((x,i)=>'('+(i+1)+') "'+String(x).replace(/[\[\]"]/g,'')+'"').join(' ')+']':'';
 const noteP=(F,sd,stored)=>noteL(Array.isArray(stored)?stored:press(F,sd).map(x=>x.s),sd);
 const all=F=>({D:F&&F.cr4?press(F,'D').map(x=>x.s):[],C:F&&F.dr4?press(F,'C').map(x=>x.s):[]});
 const storeLine=(p,sd)=>'[AUDIT v27: CLOSE-ROUND GRADING CHECK ('+sd+'4) -- STORED, computed once from every round; a TRIAL check: the '+(sd==='D'?'defender':'challenger')+'\'s close round holds '+p.length+' sentence(s) that grade or press the '+(sd==='D'?'challenger':'defender')+'\'s links; each is marked DISREGARDED for the judges'+(p.length?': '+p.map((x,i)=>'('+(i+1)+') "'+String(x).replace(/[\[\]"]/g,'')+'"').join(' ')+'. REVIEW THIS ROW.]':'.]');
 const stored=(notes,sd)=>{const m=String(notes||'').match(new RegExp('\\[AUDIT v27: CLOSE-ROUND GRADING CHECK \\('+sd+'4\\) -- STORED[^\\]]*?holds (\\d+) sentence\\(s\\)[^\\]]*\\]'));if(!m)return null;
  const p=[...m[0].matchAll(/\((\d+)\) "([^"]*)"/g)].map(x=>x[2]);return p.length===+m[1]?p:null;};
 return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,all,storeLine,stored};})();
const __orc=(b,fam,model,key)=>{if(fam!=='openrouter'||!b||!Array.isArray(b.messages))return b;const o={...b,session_id:String(key).slice(0,128)};if(/^(?:google|qwen)\//.test(String(model)))o.messages=b.messages.map(m=>m.role==='system'&&typeof m.content==='string'?{role:'system',content:[{type:'text',text:m.content,cache_control:{type:'ephemeral'}}]}:m);return o;};
const TOK=$('Init Seats').first().json.run_token;const RT=' run_token='+TOK;
const R=$('Resolve Seats').first().json;const SS=$('Init Seats').first().json;const ORS=[SS.defender&&SS.defender.profile==='oracle'?'DEFENDER':null,SS.challenger&&SS.challenger.profile==='oracle'?'CHALLENGER':null].filter(Boolean);const G3=ORS.length?'3. Drift guard violations by the '+ORS.join(' and ')+' only: the drift guards were given to that seat as The Oracle. A plain seat was never given the drift guards; do not fault a plain seat under any guard. Test that seat\'s GRANTS and CONCESSIONS as well as its claims: a statement a guard lists as FORBIDDEN that the seat granted, accepted at full weight, or conceded, in any round or the link round, is a violation exactly as if the seat had asserted it; quote the seat\'s words and name the guard. ':'3. Neither seat was given the drift guards (both seats are plain): do not assess drift guard violations and do not fault either side under any guard. ';const I=$('Init with Guards').first().json;const mc=R.deepseek;const cr1=$('D1 Extract').first().json.labelled;const gr1=$('C1B Extract').first().json.labelled;const cr2=$('D2B Extract').first().json.labelled;const gr2=$('C2B Extract').first().json.labelled;const cr3=$('D3B Extract').first().json.labelled;const dr3=$('C3B Extract').first().json.labelled;const cr4=$('D4B Extract').first().json.labelled;const dr4=$('C4B Extract').first().json.labelled;
const __S2=$('Init Seats').first().json;const __RT2=' run_token='+__S2.run_token;
const __JFAM2={deepseek:'deepseek',gemini:'openrouter',grok:'openrouter',chatgpt:'openrouter',mimo:'openrouter',glm:'openrouter',alt_minimax31:'openrouter',qwen:'openrouter',sol:'openrouter',luna:'openrouter',haiku:'openrouter'};
const __sj2=__S2.single_judge;const __fam2=__JFAM2[__sj2];
if(!__fam2)throw new Error('ORACLE_DEBATE_V1 Build Synthesis refused: single_judge "'+__sj2+'" has no family map.'+__RT2);
const __M2={};$('Fetch Models').all().forEach(i=>{const x=i.json;if(x&&x.seat)__M2[x.seat]=x;});
const __row2=__M2[__sj2];
if(!__row2||!__row2.api_model)throw new Error('ORACLE_DEBATE_V1 Build Synthesis refused: single_judge "'+__sj2+'" has no ACTIVE model_config row with api_model.'+__RT2);
const __model2=__row2.api_model;const __base2=Math.max(Number(__row2.max_tokens)||0,20000);
const __JIDX2={deepseek:0,openai:1,gemini:2,grok:3,mimo:4,openrouter:5};const __jidx2=__JIDX2[__fam2];
const __CG=C4P.all({cr1,gr1,cr2,gr2,cr3,dr3,cr4,dr4});
const __out={topic:I.topic,cr1,gr1,cr2,gr2,cr3,dr3,cr4,dr4,gl:I.gl,sd:I.sd,close_graded:__CG,requestBody:{model:mc.api_model,max_tokens:Math.max(mc.max_tokens||0,20000),messages:[{role:'system',content:I.fref},{role:'user',content:'DEBATE COMPLETE\n\n'+I.posline+' The framework is not a combatant: it is the Rules of Engagement and Rules of Interaction, binding BOTH sides.\n\nThis debate was chain-scoped (Isaiah 28:10 rule of engagement): assess both sides by whether they engaged chains as chains or stripped isolated terms.\n\nTOPIC: '+I.topic+'\n\n[DEFENDER R1]\n'+cr1+'\n\n[CHALLENGER R1]\n'+gr1+'\n\n[DEFENDER R2]\n'+cr2+'\n\n[CHALLENGER R2]\n'+gr2+'\n\n[DEFENDER R3 -- LINK ROUND (defender cite-or-concede)]\n'+cr3+'\n\n[CHALLENGER R3 -- LINK ROUND (challenger cite-or-concede)]\n'+dr3+'\n\n[DEFENDER R4 -- CLOSE ROUND (defender final defense)]\n'+cr4+C4P.noteD({cr1,gr1,cr2,gr2,cr3,dr3,cr4})+C4P.noteR({cr1,dr3,cr4},'D')+C4P.noteL(__CG.D,'D')+'\n\n[CHALLENGER R4 -- CLOSE ROUND (challenger final words; no new press)]\n'+dr4+C4P.note({gr1,gr2,dr3,dr4})+C4P.noteR({cr1,dr3,dr4},'C')+C4P.noteL(__CG.C,'C')+'\n\nSynthesize: 1. What held at L1-L2-L3? List a point here only if no charge in either side\'s lists contests it; a charged point goes under 2 with both sides\' answers, unresolved. 2. Concessions? Include the results of BOTH LINK ROUNDS and BOTH CLOSE ROUNDS: for each link state CITED-WITH-FOOTING, CONCEDED-BY-ITS-OWN-SIDE, NARROWED-BY-ITS-OWN-SIDE (a limb dropped and the link kept is a narrowing, not a concession) or NO-FOOTING-EXHIBITED, on each side; say what the defender\'s close round answered, and quote a side\'s own words for every concession or withdrawal you report. Do NOT use the word "unanswered" anywhere in this analysis: the challenger close round is structurally LAST in this format, so the defender gets no round after it -- that silence is procedural, not a concession, and counts against neither side. The challenger\'s close round may not press: a verse it names that its earlier rounds never named is not counted. A verse counts only when its book, chapter and verse are stated and the words quoted are exactly the words of the KJV; a quotation may be part of a verse; paraphrased or misquoted words do not count (operator ruling 3). '+G3+'4. How did the challenger engage, and did the defense hold its ground? A sentence that stands in for an answer, such as the defender placeholder "Noted. Not conceding here. Goes to review.", is a defect of method, not discipline: name it as a defect, and never credit it as method (judge_fix8 R8). 5. Most vulnerable? Do NOT deliver a verdict.'+__SYNTH9}]}};
const __bf='requestBody';const __b0=__out[__bf];const __sys2=__b0.messages[0].content;const __usr2=__b0.messages[1].content;const __m2=[{role:'system',content:__sys2},{role:'user',content:__usr2}];
let __nb;
if(__fam2==='gemini')__nb={systemInstruction:{parts:[{text:__sys2}]},contents:[{role:'user',parts:[{text:__usr2}]}],generationConfig:{maxOutputTokens:__base2,temperature:0}};
else if(__fam2==='grok')__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2};
else if(__fam2==='openai')__nb={model:__model2,max_completion_tokens:__base2,messages:__m2};
else if(__fam2==='openrouter'&&/^x-ai\//.test(__model2))__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2}; else if(__fam2==='openrouter'&&/^xiaomi\//.test(__model2))__nb={model:__model2,max_tokens:__base2,messages:__m2}; else if(__fam2==='openrouter'&&/^google\//.test(__model2))__nb={model:__model2,max_tokens:__base2,temperature:0,messages:__m2};
else if(__fam2==='openrouter'&&/^openai\//.test(__model2))__nb={model:__model2,max_tokens:__base2,messages:__m2};
else if(__fam2==='openrouter')__nb={model:__model2,max_tokens:__base2,messages:__m2};
else __nb={model:__model2,max_tokens:__base2,messages:__m2};
__out[__bf]=__orc(__nb,__fam2,__model2,__S2.run_token+':synthesis:'+__sj2);__out.jidx=__jidx2;__out.judge_model=__model2;
return [{json:__out}];