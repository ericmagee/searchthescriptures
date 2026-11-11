function gdsDash2024(l){const s=String(l==null?'':l);if(/\|\|/.test(s))return null;const m=s.match(/^(\s*(?:[-•>]\s+)?(?:(?:SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*[SG]\s*\d+\s*:?)\s*(?:--|—|–|-(?=\s))\s*(KEEP\b|CHANGE\s+TO\b)([\s\S]*)$/i);if(!m)return null;
 const rest=m[3];let at=-1,len=0;for(const x of rest.matchAll(/\s*(?:--|—|–)\s*(?=\[\s*(?:CR|DR)[1-4]|\(\s*(?:CR|DR)[1-4]|(?:CR|DR)[1-4]\b|["“‘'])/gi)){at=x.index;len=x[0].length;}
 return m[1].replace(/\s+$/,'')+' || '+m[2]+(at>=0?rest.slice(0,at)+' || '+rest.slice(at+len):rest);}
const GDS_NOTE='[FORM NOTE: this reply line used a dash where the form needs the double bar; the engine read it as the form (pkgGDS)]';
const __trm=o=>{const c={...o};for(const k of ["enf428_rows","enf421_rows"])delete c[k];return c;};
const __seatC=new Map(),__seatBad={};const __seatOf=x=>{if(__seatC.has(x))return __seatC.get(x);let s;try{s=JSON.parse(x).payload.judge_seat;}catch(e){s=__seatBad;}__seatC.set(x,s);return s;};
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
const B7=(()=>{const LIVE=true;const NN=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9 :]+/g,' ').replace(/\s+/g,' ').trim();
 const six=(t,src)=>{const n=Math.min(6,NN(src).split(' ').filter(Boolean).length);if(n<3)return null;const w=NN(t).split(' ').filter(Boolean);const s=' '+NN(src)+' ';for(let i=0;i+n<=w.length;i++)if(s.includes(' '+w.slice(i,i+n).join(' ')+' '))return w.slice(i,i+n).join(' ');return null;};
 const refs=s=>{const o=new Set();for(const m of String(s||'').matchAll(/\b((?:[1-3]\s)?[A-Z][a-z]+)\s+(\d+):(\d+)/g))o.add(m[1].toLowerCase()+' '+m[2]+':'+m[3]);return o;};
 const R=(ok,w)=>({status:ok?'CURED':'UNCURED',why:w+' (pkgEB7'+(LIVE?'':'; TRIAL')+')'});
 function cure(it,a){const p=it.b7||{};if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');
  if(a.ans==='KEEP'){const q1=six(a.why,p.entry||''),q2=(p.means||[]).map(m=>six(a.why,m)).find(Boolean);
   return R(!!(q1&&q2),q1&&q2?'KEEP quoting the premise ("'+q1+'") and the press MEANS ("'+q2+'")':'KEEP whose sentence does not quote both 6 words in a row of the premise entry and 6 words in a row of a MEANS'+(q1?' (premise quoted, no MEANS)':q2?' (MEANS quoted, no premise)':''));}
  const to=String(a.to||'').replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]\s*|\d+[.)]\s+)/,'');
  const h=to.match(/^(CHALLENGER CONCEDED LINKS|CONCEDED LINKS)\s*:(.*)$/i);
  if(h){const sd=/^CHALLENGER/i.test(h[1])?'CHALLENGER':'DEFENDER';if(sd!==p.side)return R(false,'the CHANGE TO is the other side\'s CONCEDED LINKS line');
   const still=h[2].split(/(?=\bpremise\s+\d+)/i).some(s=>{const m=s.match(/^premise\s+(\d+)/i);return m&&+m[1]===+p.n&&/\bUNEXHIBITED\b/i.test(s);});
   return R(!still,still?'the CHANGE TO still counts premise '+p.n+' UNEXHIBITED':'the CHANGE TO no longer counts premise '+p.n+' UNEXHIBITED');}
  const m=to.match(/^ANSWER CHECK:\s*(.+?)\s*--\s*\[\s*([CD])R/);
  if(m){const on=[...refs(m[1])].some(r=>(p.refs||[]).includes(r));const g=[...to.matchAll(/--\s*(MEETS|MISSES|FAILS)\b/g)].map(x=>x[1]).pop();
   if(!on)return R(false,'the CHANGE TO is an ANSWER CHECK on another verse than '+(p.verses||'the one sent'));if(String(p.round||'')[0]!==m[2])return R(false,'the CHANGE TO grades the other side\'s answer');
   return R(g==='MISSES'||g==='FAILS','the CHANGE TO grades the answer '+(g||'with no grade'));}
  return R(false,'the CHANGE TO is neither the CONCEDED LINKS line nor an ANSWER CHECK line on '+(p.verses||'the verse'));}
 return {LIVE,cure};})();
const KSC=(()=>{const LIVE=true;const clean=l=>String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]\s*|\d+[.)]\s+)/,'');
 const KS=/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b/i;const CL=/^CONCEDED LINKS\s*:(.*)$/i;
 const TAG=/(?:\b(LINK|PREMISE)\s*|(?:--|;|,)\s*)(\d+)\s*(?::|--|—|–|-|\(|,)?\s*(?:(?:is|was|stays|remains)\s+)?(UNEXHIBITED|CONCEDED|WITHDRAWN)\b/gi;
 function premiseMap(dr2){const t=String(dr2||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return null;
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  const M={};its.forEach((x,k)=>{const m=x.match(/^\s*\**\s*(?:(\d+)[.)]\s*\**\s*)?LINK\s+(\d+|none)\s*\**\s*:/i);if(!m||/none/i.test(m[2]))return;const p=m[1]?+m[1]:k+1;if(!(p in M))M[p]=+m[2];});return M;}
 const keystone=t=>{let k=null;for(const raw of String(t||'').split('\n')){const m=clean(raw).match(KS);if(m)k={n:+m[1],state:m[2].toUpperCase(),line:raw.trim()};}return k;};
 const entries=l=>{const m=clean(l).match(CL);if(!m)return null;return [...m[1].matchAll(TAG)].map(x=>({kind:/^LINK$/i.test(x[1]||'')?'LINK':'PREMISE',num:+x[2],tag:x[3].toUpperCase()}));};
 const clrE=r=>r.counted.filter(x=>x.ref!=='C').map(x=>({kind:x.ref==='LINK'||x.ref==='D'?'LINK':'PREMISE',num:x.num,tag:x.tag,own:x.link!=null&&x.link!=='none'?x.link:null}));
 const conceded=t=>{const r=CLR.read(t,'DEFENDER');return r?{e:clrE(r),body:r.body,line:r.line+(r.cont?' (+'+r.cont+' line'+(r.cont>1?'s':'')+')':'')}:null;};
 const ownLink=(body,n)=>{if(body==null)return true;const t=String(body).replace(/\x22[^\x22]*\x22|\u201c[^\u201d]*\u201d/g,m=>' '.repeat(m.length));for(const m of t.matchAll(new RegExp('\\b(?:(?:LINK|Link|link)\\s*|D)'+n+'\\b(?=\\s*(?::|--|\u2014|\u2013|-|\\(|,)?\\s*(?:(?:is|was|stays|remains)\\s+)?(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\\b)','g'))){const pre=t.slice(Math.max(0,m.index-48),m.index);if(/\b(?:against|under|beneath|of|on|in|within|for)\s*\(?\s*\[?\s*$/i.test(pre))continue;if(/\b(?:premises?|items?)\s+\d+(?:\s*(?:,|and|&)\s*\d+)*\s*(?:[,(:\[]|--|—|–)?\s*$/i.test(pre))continue;return true;}return false;};
 const counts=(e,n,pm,body)=>{for(const x of e||[]){if(x.kind!=='LINK'||x.num!==n)continue;if(!ownLink(body,n))continue;return {...x,link:n,via:'LINK '+x.num};}return null;};
 function items(t,dr2){const k=keystone(t);if(!k||k.state!=='STANDS')return [];const c=conceded(t);if(!c)return [];const pm=premiseMap(dr2);const h=counts(c.e,k.n,pm,c.body);if(!h)return [];
  return [{n:k.n,tag:h.tag,via:h.via,pmap:pm||{},keystone_line:k.line,conceded_line:c.line}];}
 function cure(it,a){const p=it.ksc||{};const R=(ok,w)=>({status:ok?'CURED':'UNCURED',why:w+' (pkgKSC, Commitment 15'+(LIVE?'':'; TRIAL')+')'});
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a keystone that stands on a link the same verdict counts '+p.tag);
  const to=String(a.to==null?'':a.to);const k=clean(to).match(KS);
  if(k){if(+k[1]!==p.n)return R(false,'the KEYSTONE line names D'+k[1]+'; the keystone is D'+p.n);return k[2].toUpperCase()==='STANDS'?R(false,'the KEYSTONE line still grades D'+p.n+' STANDS while '+p.via+' is counted '+p.tag):R(true,'CHANGE TO the KEYSTONE line: D'+p.n+' '+k[2].toUpperCase());}
  const rr=CLR.read(to,'DEFENDER');const e=rr?clrE(rr):entries(to);if(e){  const h=counts(e,p.n,p.pmap,rr?rr.body:to);return h?R(false,'the CONCEDED LINKS line still counts '+h.via+' '+h.tag):R(true,'CHANGE TO a CONCEDED LINKS line that no longer counts LINK '+p.n);}
  return R(false,'the CHANGE TO is neither a KEYSTONE line for D'+p.n+' nor a CONCEDED LINKS line');}
 
 return {LIVE,items,cure,keystone,conceded,entries,premiseMap,counts};})();
const __L={"Cited Verses":()=>$('Cited Verses'),"Judge Enforcer Record":()=>$('Judge Enforcer Record'),"L2 Lexicon":()=>$('L2 Lexicon'),"L2 Words":()=>$('L2 Words'),"Panel Cure Check":()=>$('Panel Cure Check'),"Panel Cure Normalize 1":()=>$('Panel Cure Normalize 1'),"Panel Cure Normalize 2":()=>$('Panel Cure Normalize 2'),"Panel Cure Normalize 3":()=>$('Panel Cure Normalize 3'),"Send Back Build":()=>$('Send Back Build')};
const ABS=(()=>{
 const AB=/\b(?:do(?:es)?\s+not|did\s+not|doesn['’]t|didn['’]t|never)\s+(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject)\b|\bnames?\s+no\b|\bstates?\s+no\b|\bsays?\s+nothing\b|\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?|says?|names?|denies|deny|excludes?)\b|\bis\s+silent\b|\bboth\s+(?:are\s+)?(?:retained|accommodated|kept|stand|preserved)\b|\bare\s+both\s+(?:retained|accommodated|kept|preserved)\b|\baccommodat\w+\b|\b(?:remains?|is|are)\s+compatible\b|\bnot\s+inconsistent\b|\bleaves?\s+(?:room|open)\b|\bwithout\s+(?:asserting|stating|naming|saying|claiming|mentioning|specifying|denying|excluding)\b|\b(?:is|are|was|were)\s+(?:itself\s+|themselves\s+)?not\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|disputed|ruled\s+out|rejected|negated)\b/i;
 const WD=/\bI\s+(?:drop|withdraw|narrow)\b|\bnarrow\s+accordingly\b/i;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"');
 const AQ=/ANSWER:\s*["“'‘]([\s\S]*?)["”'’]\s*--\s*(MEETS|MISSES|FAILS)\b\s*(?:--\s*([\s\S]*))?$/i;
 function text(id){const L=N(id&&id.flagged_line);if(id.rule==='E-ANS'){const m=L.match(AQ);return m?(m[1]+' '+(m[3]||'')):L;}return L;}
 function absence(t){const m=String(t||'').match(AB);return m?m[0]:null;}
 function fit(t,ctx){try{const c=ECL.check('FORCED -- GROUND: '+N(t),ctx||{});return c.l1;}catch(e){return 'NONE';}}
 function check(id,ctx){const g=String(id&&id.grade||'').toUpperCase();
  if(!((id.rule==='E-ANS'&&g==='MEETS')||(id.rule==='E-HOLD'&&(g==='STANDS'||g==='UNDERDETERMINED'))))return {applies:false,raise:false};
  const t=text(id);const a=absence(t);if(!a)return {applies:true,raise:false,absence:null};
  if(WD.test(t))return {applies:true,raise:false,absence:a,withdrawn:true,why:'the answer drops or narrows its own claim (a withdrawal, K-W), not a meeting by absence'};
  const f=fit(t,ctx);if(f==='COUNTED')return {applies:true,raise:false,absence:a,fit:f,why:'absence phrase "'+a+'" with a counted [L1] positive fit'};
  return {applies:true,raise:true,absence:a,fit:f,why:id.rule+' '+g+' rests on an absence or non-denial ("'+a+'") and quotes no counted [L1] positive fit'+(f!=='NONE'?' ([L1] '+f+')':'')};}
 function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');
  if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a grade resting on an absence (pkgABS, Commitment 3, ruling 421)');const to=N(a.to);
  if(it.rule==='E-ANS'&&/--\s*(?:MISSES|FAILS)\b/i.test(to))return R(true,'CHANGE TO grades MISSES (pkgABS)');
  if(/^\s*RETRACTED\b/i.test(to))return R(true,'CHANGE TO RETRACTED (pkgABS)');
  if(/\b(?:BROKEN|FORCED)\b/.test(to)){const c=ECL.check(to,ctx||{});if(c.applies&&!c.faults.length)return R(true,'CHANGE TO a break with its layers (pkgABS): '+c.why);return R(false,'CHANGE TO a break that fails the layer check (pkgABS): '+c.why);}
  const f=fit(it.rule==='E-ANS'?(to.match(AQ)?(to.match(AQ)[1]+' '+(to.match(AQ)[3]||'')):to):to,ctx);if(f==='COUNTED')return R(true,'CHANGE TO quotes a counted [L1] positive fit (pkgABS)');
  return R(false,'CHANGE TO quotes no counted [L1] positive fit and is not regraded MISSES, BROKEN or FORCED (pkgABS)'+(f!=='NONE'?' ([L1] '+f+')':''));}
 const QP=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?[^"“”'‘\n\[]{0,40}?(?:"([^"“”]{6,400})"|“([^"“”]{6,400})”|'([^'\n]{6,400}?)'(?![a-z])|‘([^’\n]{6,400})’)/g;
 function quoted(t,ctx){const idx={};for(const r of (ctx&&ctx.rows)||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;const out=[];
  for(const p of String(t||'').matchAll(QP)){const q=p[5]||p[6]||p[7]||p[8];const v1=+p[3],v2=+(p[4]||p[3]);const parts=[];for(let v=v1;v<=v2;v++){const x=idx[p[1]+' '+p[2]+':'+v];if(x)parts.push(x);}
   const ref=p[1]+' '+p[2]+':'+v1+(v2!==v1?'-'+v2:'');if(parts.length!==v2-v1+1){out.push({ref,q,status:'UNVERIFIABLE'});continue;}const k=parts.join(' ');out.push({ref,q,status:kkjvIsVerseQuote(q,k)&&kkjvStands(q,k)?'STANDS':'NOT IN VERSE'});}
  return out;}
 return {check,cure,absence,text,fit,quoted};})();
const MNP=(()=>{
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
 const PW_CAP=8;const PW_ROUND={DEFENDER:'DR2',CHALLENGER:'CR3'};const pwHead=side=>side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');
 const keyOf=t=>{try{const k=REFP.keys(String(t||''),{scoped:true,cap:12});return k.length?k[0].key:null;}catch(e){return null;}};
 function ledger(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));const out=[];
  its.forEach((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);if(j<0)return;let seg=x.slice(j);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);if(/^PRESSED WITH\s*:\s*[\s*_]*none\b/i.test(seg))return;
   let P=null;try{P=PRS.premise(seg,R,PW_ROUND[side],null);}catch(e){P=null;}if(!P)return;for(const v of P.verses)out.push({premise:k+1,key:v.key,cls:v.cls,why:v.why,means:v.means||''});});return out;}
 const NOM=/\bno\s+(?:separate\s+|stated\s+|own\s+)?MEANS\b|\bMEANS\s+(?:sentence\s+)?(?:is\s+)?(?:missing|absent)\b|\bwithout\s+a\s+MEANS\b/i;
 function claims(text){const out=[];for(const l0 of N(text).split('\n')){const l=l0.trim();if(!/^ANSWER CHECK\s*:/.test(l))continue;
  const A0=__acm(l);const A=A0&&A0.rounds.length===1?A0:null;let m,mv,gr;
  if(A){m=[l,A.verse,A.rounds[0][0]==='C'?'C':'D',A.rounds[0].slice(2)];mv=A.means===undefined?null:String(A.means).trim();gr=A.grade;}
  else{m=l.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--\s*\[\s*([CD])R\s*(\d)\s*\]/);if(!m)continue;const mm=l.match(/--\s*MEANS\s*:\s*(["\u201c]?)([^"\u201d]*?)\1\s*(?:--|$)/);mv=mm?mm[2].trim():null;gr=(l.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1]||null;}
  const none=mv!==null&&(/^(?:NONE|N\/A|-+)?\.?$/i.test(mv));const unp=/\bUNPROVEN\b/.test(l)&&NOM.test(l);if(!none&&!unp)continue;
  out.push({line:l,ref:m[1].trim(),key:keyOf(m[1]),round:m[2]+'R'+m[3],side:m[2]==='C'?'DEFENDER':'CHALLENGER',means:mv,grade:gr});}return out;}
 function check(text,R){const out=[];const L={};for(const c of claims(text)){if(!c.key)continue;L[c.side]=L[c.side]||ledger(R,c.side);const hit=L[c.side].find(v=>v.key===c.key&&String(v.means).trim().length>=6);if(!hit)continue;
  out.push({...c,premise:hit.premise,ledger_means:hit.means,ledger_cls:hit.cls,why:'the ANSWER CHECK on '+c.ref+' ['+c.round+'] says the press has no MEANS, but the press ledger reads a MEANS for it in ['+PW_ROUND[c.side]+'] (premise '+hit.premise+'): "'+hit.means.slice(0,300)+'" (ledger: '+hit.cls+')'});}return out;}
 const nw=s=>N(s).toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`]/g,'').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]+/g,' ').trim().split(' ').filter(Boolean);
 function cure(it,a){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans!=='CHANGE')return R(false,(a&&a.ans==='KEEP'?'a KEEP does not cure this item':'no answer')+' (pkgMNP)');const p=it.mnp||{};
  const c=claims(a.to);const to=N(a.to).trim();if(!/^ANSWER CHECK\s*:/.test(to))return R(false,'the CHANGE TO is not an ANSWER CHECK line (pkgMNP)');const TA=__acm(to);  if(keyOf(TA?TA.verse:to.replace(/^ANSWER CHECK\s*:\s*/,'').split('--')[0])!==p.key)return R(false,'the CHANGE TO grades another verse (pkgMNP)');
  if(c.length)return R(false,'the CHANGE TO still says the press has no MEANS (pkgMNP)');const g=TA?TA.grade:(to.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1];if(!g)return R(false,'the CHANGE TO has no grade (pkgMNP)');
  if(g==='UNPROVEN'&&p.ledger_cls!=='UNPROVEN')return R(false,'graded UNPROVEN, but the ledger marks the press '+p.ledger_cls+' (pkgMNP)');
  const mm=to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--\s*ANSWER\s*:/)||to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--/);const mvq=TA&&TA.means!==undefined?String(TA.means).trim():mm?mm[1].trim().replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1'):'';const pw=nw(p.ledger_means);const T=' '+nw(mvq).join(' ')+' ';  const runs=pw.length<=6?[pw.join(' ')]:pw.slice(0,pw.length-5).map((_,i)=>pw.slice(i,i+6).join(' '));
  const q=runs.find(r=>T.includes(' '+r+' '));return q?R(true,'graded '+g+' on the real MEANS ("'+q+'") (pkgMNP)'):R(false,'the CHANGE TO\'s MEANS quotes no 6 words in a row of the ledger\'s MEANS (pkgMNP)');}
 return {claims,ledger,check,cure,PRS};})();
const IMP=(()=>{
 const AB=/\b(?:do(?:es)?\s+not|did\s+not|doesn['’]t|didn['’]t|never)\s+(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject|tell|record)\b|\bnames?\s+no\b|\bstates?\s+no\b|\bsays?\s+nothing\b|\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?|says?|names?|denies|deny|excludes?)\b|\bis\s+silent\b|\bwithout\s+(?:asserting|stating|naming|saying|mentioning|specifying|denying|excluding)\b|\b(?:is|are|was|were)\s+(?:itself\s+|themselves\s+)?not\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|ruled\s+out|named|stated)\b/i;
 const REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"');
 const ROUNDS=['CR2','DR1','DR2','CR3','DR3','CR4','DR4'];
 const GIVE=/\bI\s+(?:drop|withdraw|narrow|grant|concede|accept|allow|rest\s+nothing)\b|\bnarrow\s+(?:accordingly|it|the\s+link)\b|^\W*(?:Granted|Conceded|CONCEDED|Grant)\b|\bI\s+do\s+not\s+(?:say|claim|rest|hold|argue)\b|\bno\s+longer\s+(?:claims?|holds?|rests?)\b|\bin\s+(?:so\s+many\s+)?words\b|\bI\s+hold\s+(?:that|this|the)\s+limb\b/i;
 const ANS=/\banswers?\s+to\b|^[\s#>*_-]*ANSWER\s*:|\bpressed\s+rows\b|\banswers?\s+(?:on|for)\s+the\s+press/i;
 
 
 const has=(a0,b0,n)=>{const a=' '+W(a0)+' ',bw=W(b0).split(' ').filter(Boolean);if(!bw.length)return false;const k=Math.min(n||8,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
 const LINE=/^[\s>*_\-•]*IMPOSED\s*:\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”]\s*--\s*(?:asks\s+([\s\S]+?)\s+to\s+([\s\S]+?)\s*--\s*(NO ROW SETS IT|SET BY\b\s*([\s\S]*))|(NOT A REQUIREMENT)\s*--\s*rebuts\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”])\s*$/i;
 function lines(text){const o=[];for(const l of N(text).split('\n')){const m=l.match(LINE);if(!m)continue;
  if(m[7])o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],nar:true,rround:m[8].toUpperCase(),rquote:m[9]});else o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],verse:m[3],req:m[4],no:/^NO ROW/i.test(m[5]),set:m[6]||null});}return o;}
 function rebutOk(l,round,R){if(!l||!l.nar)return {ok:false,why:'not a NOT A REQUIREMENT line'};if(l.rround[0]===round[0])return {ok:false,why:'['+l.rround+'] is a round of the same side; a rebuttal answers the other side'};
  const q=W(l.rquote);if(q.split(' ').length<6)return {ok:false,why:'the rebutted quote has fewer than 6 words'};if(!R||!R[l.rround])return {ok:false,why:'round ['+l.rround+'] could not be read'};
  if(!W(R[l.rround]).includes(q))return {ok:false,why:'the quote does not stand word for word in ['+l.rround+']'};return {ok:true,why:'rebuts ['+l.rround+'] "'+String(l.rquote).slice(0,80)+'", which stands in that round'};}
 const RND=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;
 function rounds(t){t=String(t||'');const at=[];let m;RND.lastIndex=0;while((m=RND.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});const o={};at.forEach((x,i)=>{if(o[x.k]==null)o[x.k]=t.slice(x.e,i+1<at.length?at[i+1].s:t.length);});return o;}
 const roundsOf=b=>{try{const ms=(b&&b.body&&(b.body.messages||b.body.contents))||[];return rounds(ms.map(m=>typeof m.content==='string'?m.content:Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):Array.isArray(m.parts)?m.parts.map(c=>c&&c.text||'').join('\n'):'').join('\n'));}catch(e){return {};}};
 const AC=/^[\s>*_\-•]*ANSWER CHECK\s*:\s*([^\n]*?)\s*--\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*--[\s\S]*?ANSWER\s*:\s*["“]([\s\S]*?)["”]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 function items(text,H,R){const L=lines(text);const out=[];
  for(const h of H){if(L.some(l=>l.round===h.round&&has(l.quote,h.sentence,8)&&(!l.nar||rebutOk(l,h.round,R).ok)))continue;  out.push({kind:'IMPOSED',id:h.id,round:h.round,side:h.side,sentence:h.sentence,phrase:h.phrase});}
  for(const l of N(text).split('\n')){const m=l.match(AC);if(!m||m[4].toUpperCase()!=='MEETS')continue;const f=L.find(z=>z.no&&z.round===m[2].toUpperCase()&&(has(m[3],z.quote,8)||has(z.quote,m[3],8)));
   if(f)out.push({kind:'CONTRADICTION',id:'AC '+m[1].trim()+' ['+m[2].toUpperCase()+']',round:m[2].toUpperCase(),line:l.trim(),imposed:f.raw,ref:m[1].trim()});}
  return out;}
 function setOk(set,ctx){if(!set)return {ok:false,l1:'NONE'};try{const c=ECL.check('FORCED -- GROUND: '+N(set),ctx||{});return {ok:c.l1==='COUNTED',l1:c.l1};}catch(e){return {ok:false,l1:'ERROR'};}}
 function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w+' (pkgIMP, Commitment 14)'});const p=it.imp||{};
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure an imposed requirement');const to=N(a.to).trim();
  if(p.kind==='CONTRADICTION'){if(/^[\s*]*ANSWER CHECK\s*:/i.test(to)&&/--\s*(?:MISSES|FAILS)\b/.test(to)&&has(to,p.ref,2))return R(true,'CHANGE TO the ANSWER CHECK regraded MISSES or FAILS');
   const l=lines(to)[0];if(l&&!l.no&&!l.nar){const s=setOk(l.set,ctx);return s.ok?R(true,'CHANGE TO the IMPOSED line SET BY a counted [L1]'):R(false,'the IMPOSED line is SET BY no counted [L1] ([L1] '+s.l1+')');}
   return R(false,'the CHANGE TO neither regrades the ANSWER CHECK MISSES or FAILS nor sets the requirement by a counted [L1]');}
  const l=lines(to)[0];if(!l)return R(false,'the CHANGE TO is not an IMPOSED line (IMPOSED: [<round>] "<the sentence>" -- asks <verse> to <what> -- NO ROW SETS IT, or SET BY [L1] <reference> "<KJV words>", or NOT A REQUIREMENT -- rebuts [<round>] "<the opponent words>")');
  if(l.round!==p.round)return R(false,'the IMPOSED line names ['+l.round+'], the sentence is in ['+p.round+']');if(!has(l.quote,p.sentence,8))return R(false,'the IMPOSED line does not quote the sentence (8 words in a row, or all of it)');
  if(l.nar){const v=rebutOk(l,p.round,ctx&&ctx.R);return R(v.ok,v.ok?'NOT A REQUIREMENT: '+v.why:'NOT A REQUIREMENT not verified: '+v.why);}
  if(l.no)return R(true,'flagged: NO ROW SETS IT');const s=setOk(l.set,ctx);return s.ok?R(true,'SET BY a counted [L1]'):R(false,'SET BY gives no counted [L1] ([L1] '+s.l1+'); write NO ROW SETS IT, or quote the KJV row that sets it under [L1]');}
 return {AB,GIVE,items,lines,cure,has,rebutOk,rounds,roundsOf};})();
const PAB=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})/g;
 const UN=/\b(?:unanswered|not answered|no answer|never answered|not named|never names?|did not name|does not name the verse)\b|\(\s*Commitment\s+5\s*\)|\bCommitment\s+5\b/i;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');
 const nw=s=>N(s).toLowerCase().replace(/[‘’“”"'`]/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g,' ').trim().split(' ').filter(Boolean);
 const refs=t=>[...new Set([...String(t||'').matchAll(REF)].map(m=>m[1]+' '+m[2]+':'+m[3]))];
 function presses(R){const out=[];for(const [k,t0] of Object.entries(R||{})){if(!/^(?:CR|DR)\d$/.test(k))continue;const t=N(t0);
  for(const l of t.split('\n')){const m=l.match(/^\s*[-\d.)\s]*((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d{1,3}:\d{1,3})(?:[-–]\d{1,3})?\s+["“][^\n]*?["”][^\n]*?--\s*MEANS:\s*(.+?)(?:\s+--\s+|$)/);if(!m)continue;
   out.push({round:k,ref:m[1],means:m[2].trim()});}}return out;}
 function parts(means){const cl=String(means||'').split(/,\s*(?:and|but)\s+|\s+(?:and|but)\s+(?=(?:does|do|did|is|are|was|were)\s+not\b|never\b|(?:states?|names?|says?|gives?)\s+no\b)|;\s*|\.\s+/).map(x=>x.trim()).filter(Boolean);const ab=cl.filter(c=>ABS.absence(c)),po=cl.filter(c=>!ABS.absence(c));return {absence:ab,positive:po.join('; ')};}
 function charges(text){const out=[];for(const l0 of N(text).split('\n')){const l=l0.trim();if(/^\[AUDIT/.test(l))continue;
   if(/^(?:DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:/i.test(l)){for(const c of l.split(/;\s*|\.\s+(?=Premises?\s+\d)/)){if(!/\b(?:UNEXHIBITED|CONCEDED)\b/.test(c)||!UN.test(c))continue;const pm=c.match(/\bPremise\s+(\d+)/i);out.push({kind:'CONCESSION',label:(pm?'premise '+pm[1]:'concession')+(/^CHALLENGER/i.test(l)?' (challenger)':' (defender)'),line:l,clause:c.trim(),refs:refs(c)});}}
   else if(/\bLINK BROKEN\b/.test(l)&&UN.test(l)&&/\bD\d+\s+vs\.?\s+C\d+/.test(l)){const pm=l.match(/\b(D\d+)\s+vs\.?\s+(C\d+)/);out.push({kind:'BREAK',label:pm[1]+' vs '+pm[2],line:l,clause:l,refs:refs(l.split(/--\s*GROUND\s*:/)[0])});}}
  return out;}
 function check(text,R){const P=presses(R);const out=[];for(const c of charges(text))for(const ref of c.refs){const ps=P.filter(p=>p.ref===ref);
   const hit=ps.map(p=>({...p,...parts(p.means)})).find(p=>p.absence.length);if(!hit)continue;
   out.push({kind:c.kind,label:c.label,ref,round:hit.round,means:hit.means,absence:hit.absence,positive:hit.positive,line:c.line,clause:c.clause,
    why:c.kind.toLowerCase()+' '+c.label+' charges the press '+ref+' ['+hit.round+'] as unanswered, but its MEANS rests on an absence ("'+hit.absence.join('; ')+'")'+(hit.positive?'; the positive part is "'+hit.positive+'"':'; it has no positive part')});break;}
  return out;}
 function cure(it,a){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');const p=it.pab||{};
  const to=N(a.to);if(a.ans==='CHANGE'&&/^\s*RETRACTED\b/i.test(to))return R(true,'CHANGE TO RETRACTED (pkgPAB)');
  if(a.ans==='CHANGE'&&to&&!(refs(to).includes(p.ref)&&UN.test(to)))return R(true,'CHANGE TO a line that no longer charges '+p.ref+' as unanswered (pkgPAB)');
  const pw=nw(p.positive);if(!pw.length)return R(false,'the press has no positive part; only RETRACTED or a regrade cures (pkgPAB)');
  const runs=pw.length<=6?[pw.join(' ')]:pw.slice(0,pw.length-5).map((_,i)=>pw.slice(i,i+6).join(' '));const T=' '+nw(to+' '+(a.why||'')).join(' ')+' ';
  const q=runs.find(r=>T.includes(' '+r+' '));return q?R(true,'the reply quotes the positive part of the MEANS: "'+q+'" (pkgPAB)'):R(false,(a.ans==='KEEP'?'KEEP':'CHANGE TO')+' quotes no part of the positive MEANS "'+p.positive+'" (pkgPAB)');}
 return {presses,parts,charges,check,cure,refs};})();
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
  
 
 
 
 
 
 
 
 
 return {tags,tagWords,check,norm,variants,beta2lat,grk2lat,blockAt,refsIn,apocIn,numOf,index,matchWord};})();

function kkjvFold(s){return String(s==null?'':s).toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();}
function kkjvNoMargin(s){return String(s||'').replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/\([^)]*:\s*(?:Gr\.|Heb\.|or,|that is)[^)]*\)/g,' ');}
function kkjvUnGloss(s,cited){const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';return String(s||'').replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(all,a,b)=>{const inner=kkjvFold(a!==undefined?a:b);return inner&&cv.includes(' '+inner+' ')?' '+inner+' ':' ';});}
function kkjvSegs(q,cited){let p=String(kkjvNoMargin(q)).split(/\.\.\.|…/);const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';
 if(p.length>1){const last=kkjvFold(kkjvUnGloss(p[p.length-1],cited));if(last&&!cv.includes(' '+last+' '))p=p.slice(0,-1);}return p.map(x=>kkjvFold(kkjvUnGloss(x,cited))).filter(Boolean);}
function kkjvIsVerseQuote(q,cited){const vw=new Set(kkjvFold(kkjvNoMargin(cited)).split(' '));const qw=kkjvSegs(q,cited).join(' ').split(' ').filter(Boolean);return qw.length>0&&qw.filter(w=>vw.has(w)).length/qw.length>=0.5;}
function kkjvStands(q,cited){if(!cited)return false;const segs=kkjvSegs(q,cited);if(!segs.length)return false;
 const cv=' '+kkjvFold(kkjvNoMargin(cited))+' ';let at=0;for(const g of segs){const k=cv.indexOf(' '+g+' ',at);if(k<0)return false;at=k+g.length+1;}return true;}
const ECL=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
 const PAIR=new RegExp(REF.source+'[^"“”\\n\\[]{0,40}?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z])[\'‘](?!s\\b|\\s)((?:[^\'‘’\\n]|[\'’](?=[a-z])){6,400}?)[\'’](?![a-z]))','g');
 const MW=/\b(?:means|meaning|meant|sense|signif(?:y|ies|ied|ying)|denot(?:e|es|ed|ing)|the word|lexic\w*|connot\w*|defin\w*|translat\w*|render(?:s|ed|ing)?|Greek|Hebrew)\b/i;
 const UNANS=/\b(?:unanswered|not answered|no answer|never answered|not named)\b|\(\s*Commitment\s+5\s*\)/i;
 const RANK={COUNTED:3,UNVERIFIABLE:2,'NOT COUNTED':1,NONE:0};
 const ground=l=>String(l||'').replace(/\\+"/g,'"').replace(/--\s*ANSWER\s*\[[^\]]*\]\s*:[\s\S]*?(?=--\s*GROUND\s*:|$)/i,' ');
 function l1(g,rows){const idx={};for(const r of rows||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;
  const out=[];const T=[...g.matchAll(/\[L([1-4])\]/g)];
  T.forEach((m,k)=>{if(m[1]!=='1')return;const a=m.index+4,b=k+1<T.length?T[k+1].index:g.length,pa=k>0?T[k-1].index+4:0;
   const before=g.slice(Math.max(pa,m.index-600),m.index);const bs=[...before.matchAll(PAIR)];let p=bs.length?bs[bs.length-1]:null;
   if(p&&before.slice(p.index+p[0].length).replace(/[\s;,.:)]+/g,'').length)p=null;
   if(!p){const as=[...g.slice(a,Math.min(b,a+700)).matchAll(PAIR)];p=as.length&&as[0].index<=6?as[0]:null;}
   if(!p){out.push({status:'NOT COUNTED',why:'an [L1] tag with no verse quoted beside its reference'});return;}
   const bk=p[1],ch=+p[2],v1=+p[3],v2=+(p[4]||p[3]),q=p[5]||p[6];  const ref=bk+' '+ch+':'+v1+(v2!==v1?'-'+v2:'');const parts=[];
   for(let v=v1;v<=v2;v++){const t=idx[bk+' '+ch+':'+v];if(t)parts.push(t);}
   if(parts.length!==v2-v1+1){out.push({status:'UNVERIFIABLE',ref,why:ref+' was not read this run'});return;}
   const kjv=parts.join(' ');out.push(kkjvIsVerseQuote(q,kjv)&&kkjvStands(q,kjv)?{status:'COUNTED',ref,why:ref+' "'+q.slice(0,80)+'"'}:{status:'NOT COUNTED',ref,why:ref+' "'+q.slice(0,80)+'" does not stand in the KJV verse'});});
  return out;}
 function l2(g,ow,lex){const TG=L2C.tags([['JUDGE','J',g]]);if(!TG.length)return [];
  return L2C.check(TG,ow||[],lex||[]).filter(t=>t.status!=='IGNORED').map(t=>({status:t.status,why:String(t.seg||'').slice(0,60)+': '+t.status+' ('+t.why+')'}));}
 function check(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const forced=/^\s*FORCED\b/i.test(L);ctx=ctx||{};
  if(!forced&&!/LINK BROKEN/.test(L))return {applies:false,faults:[],why:'not a FORCED or LINK BROKEN line'};
  if(!forced&&UNANS.test(L))return {applies:false,faults:[],why:'rests on an unanswered press (ruling 392), not on meaning'};
  const g=ground(L);const a=l1(g,ctx.rows),b=l2(g,ctx.ow,ctx.lex);const best=xs=>xs.reduce((m,x)=>RANK[x.status]>RANK[m]?x.status:m,'NONE');const s1=best(a),s2=best(b);
  const meaning=/\[L2\]/.test(g)||MW.test(g.replace(/\bMEANS\s*(?:\[[^\]]*\])?\s*:/g,' '));const faults=[];
  if(s1==='NONE')faults.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(s1==='NOT COUNTED')faults.push('no counted [L1]: '+a.map(x=>x.why).join('; '));
  if(meaning&&s2==='NONE')faults.push('the ground turns on a word\'s meaning and carries no [L2]');else if(meaning&&s2==='NOT COUNTED')faults.push('the ground turns on a word\'s meaning and no [L2] is counted: '+b.map(x=>x.why).join('; '));
  return {applies:true,forced,l1:s1,l2:s2,meaning,faults,why:faults.length?faults.join(' | '):'layers counted: [L1] '+s1+(meaning?'; [L2] '+s2:'')};}
 function ctxLive(){const g=n=>{try{return __L[n]().isExecuted?__L[n]().all().map(i=>i.json):[];}catch(e){return [];}};
  return {rows:g('Cited Verses').filter(r=>r&&r.book),ow:g('L2 Words').filter(r=>r&&r.book),lex:g('L2 Lexicon').filter(r=>r&&r.strongs_number)};}
 return {check,ground,ctxLive};})();
const UND=(()=>{
 const rounds=ptext=>{const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
  const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;out[x.k]=t.slice(x.e,end);});return out;};
 
 const GR=/^[\s>*_-]*D(\d+)\s+vs\.?\s+C(\d+)\b[^\n]{0,200}?:\s*\**\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)/gmi;
 const WD=/^[\s>*_-]*D(\d+)\s*:\s*\**\s*WITHDRAWN\b/gmi;
 
 
 
 const OPEN=/\b(?:leaves?\s+(?:(?!--)[^\s.;:,!?()—–]+\s+){0,8}(?:open|disputed|undecided|unsettled|unresolved|contested|in\s+dispute)|leaves?\s+(?:\w+\s+){1,4}to\s+(?:the\s+)?other|disputed?|disputes|in\s+dispute|unsettled|unresolved|contested|left\s+open|open\s+(?:question|point|whether)|(?:does|do|did)\s+not\s+(?:decide|settle|determine|say|state|show|fix)|neither\s+(?:reading|side|one)|both\s+readings|either\s+reading|consistent\s+with\s+both|agrees?\s+with\s+both|fits?\s+both|undecided|silent\s+(?:on|about|as\s+to)|not\s+stated)\b/i;
 function undOk(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const f=[];
  const c=ECL.check('FORCED: X -- GROUND: '+L,ctx);if(c.l1==='NONE')f.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(c.l1==='NOT COUNTED')f.push('no counted [L1] (the quoted words do not stand in the verse named)');
  if(!OPEN.test(L))f.push('the line does not state what the record leaves open (for example: "the record leaves open whether ...", "both readings agree with ...")');
  return {ok:!f.length,l1:c.l1,faults:f,why:f.length?f.join(' | '):'[L1] '+c.l1+'; states what the record leaves open'};}
 
 
 const CURE_UND='UNDERDETERMINED GIVES ITS GROUNDS (E-HOLD on UNDERDETERMINED, ENFORCED, pkgUND): the enforcer reads this line as BROKEN; the decision stays yours. Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13 (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "..."), or a STANDS line that quotes the answer\'s positive fit, [CR<n>] "<the answer\'s words>", with [L1] <reference> "<KJV words>"), or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line with, after GROUND:, [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open (for example: "the record leaves open whether ..."). A KEEP does not cure this item.';
 const FIT=/\[(?:CR|DR)[1-4]\][^"“\n]{0,60}["“][^"”]{6,}["”]|\bANSWER\b[^"“\n]{0,40}["“][^"”]{6,}["”]/;
 const GRADED1=n=>new RegExp('\\bD'+n+'\\s+vs\\.?\\s+C\\d+\\b[^\\n]{0,200}?:\\s*\\**\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)','i');
 function cure(it,a,ctx){const res=(c,why)=>({status:c?'CURED':'UNCURED',why});a=a||{ans:'NO ANSWER'};const to=String(a.to||'').replace(/\\+"/g,'"').trim();
  if(a.ans!=='CHANGE')return res(false,(a.ans==='KEEP'?'a KEEP does not cure this item':'no answer')+' (pkgUND)');
  if(/^\s*RETRACTED\b/i.test(to))return res(it.rule!=='E-UNG','CHANGE TO RETRACTED'+(it.rule==='E-UNG'?' does not grade a pressed link':''));
  if(it.rule==='E-UNG'){const n=+(String(it.item||'').match(/\bD(\d+)\b/)||[])[1];const m=to.match(GRADED1(n));if(!m)return res(false,'the CHANGE TO has no graded D'+n+' vs C<j> line');
   const gr=m[1].toUpperCase();if(/BROKEN/.test(gr)){const c=ECL.check(to,ctx);return res(!c.faults.length,'graded '+gr+(c.faults.length?'; the layer check fails: '+c.why:'; '+c.why));}
   if(gr==='UNDERDETERMINED'){const u=undOk(to,ctx);return res(u.ok,'graded UNDERDETERMINED; '+u.why);}return res(true,'graded '+gr);}
  if(/\bUNDERDETERMINED\b/.test(to)){const u=undOk(to,ctx);return res(u.ok,'kept UNDERDETERMINED; '+u.why);}
  if(/\bLINK BROKEN\b/.test(to)||/^\s*FORCED\b/i.test(to)){const c=ECL.check(to,ctx);return res(!c.faults.length,'regraded BROKEN; '+c.why);}
  if(/\b(?:STANDS|MEETS)\b/.test(to)){const c=ECL.check('FORCED: X -- GROUND: '+to,ctx);const fit=FIT.test(to);
   const f=[];if(c.l1==='NONE')f.push('no [L1]');else if(c.l1==='NOT COUNTED')f.push('no counted [L1]');if(!fit)f.push('no quote of the answer\'s fit (the answer\'s own words with its round, e.g. [CR3] "<words>")');
   return res(!f.length,'regraded '+(/\bMEETS\b/.test(to)?'MEETS':'STANDS')+(f.length?'; '+f.join(' | '):'; [L1] '+c.l1+', quotes the answer\'s fit'));}
  return res(false,'the CHANGE TO neither regrades the line, retracts it, nor keeps UNDERDETERMINED with its grounds');}
 return {rounds,undOk,cure,CURE_UND};})();
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
P.RETRACTED=s=>{const m=s.match(new RegExp('^RETRACTED\\s*:\\s*'+PAIR,'i'));return m?{pair:m[1]+' vs '+m[2],reason:s.slice(m[0].length).replace(new RegExp('^\\s*(?:'+SEP+'|:)\\s*'),'').trim()}:(/^RETRACTED\s*:/i.test(s)?{why:'RETRACTED: no pair',code:'RETRACTED_NO_PAIR'}:null);};
P['NOT PRESSED']=s=>{const m=s.match(/^NOT PRESSED\s*:\s*(.+?)(?:\s*(?:--|\u2014|\u2013)\s*(.*))?$/i);return m?{verse:m[1].trim(),reason:(m[2]||'').trim()}:null;};
P.PRESSED=s=>{if(!/^PRESSED\s*:/i.test(s))return null;const r=s.replace(/^PRESSED\s*:\s*/i,'');
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
P.SHORT=s=>{const m=s.match(/^SHORT\s*:\s*(.*)$/i);return m?{text:m[1]}:null;};
P.REPLY=s=>{const m=s.match(/^(?:(SENDBACK|GATE)\s*:?\s*)?(?:ITEM\s*)?#?\s*([SG])\s*(\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(!m)return null;
 const to=m[5]!=null?m[5].trim():null;return {kind:(m[1]||(m[2].toUpperCase()==='G'?'GATE':'SENDBACK')).toUpperCase(),id:m[2].toUpperCase()+m[3],answer:/^KEEP$/i.test(m[4])?'KEEP':'CHANGE',to,toRow:to?readLine(to.replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1')):null,sentence:(m[6]||'').trim()};};
P.PREMISE=s=>{const t=s.replace(/^premise\s+\d+\s+ruled\s+[A-Z ]+?\s*:\s*(?=premise\b)/i,'');const m=t.match(new RegExp('^premise\\s+(\\d+)\\s*(?:is\\s+)?:?\\s*(UNEXHIBITED|CONCEDED|NOT VOID|VOID|SPARED|COUNTED)\\b(?:\\s*'+TAG+')?\\s*(?:'+SEP+'|:|,)?\\s*','i'));if(!m)return null;
 if(m[2]!==m[2].toUpperCase())return {why:'PREMISE: status word not upper case',code:'PREMISE_STATUS_NOT_UPPER_CASE'};return {premise:+m[1],status:m[2],tag:m[3]?+m[3]:null,reason:t.slice(m[0].length).trim(),engineLabel:t!==s};};
const ORDER=['REPLY','FORCED','CORRECTED RESULT','CORRECTED COUNT','CORRECTED STANDING','RETRACTED','NOT PRESSED','PRESSED','COLLISION','ANSWER CHECK','KEYSTONE','RESULT','CLAUSE','STANDING','CONCEDED','PREMISE','RULING','RULING PART','CHAIN MARK','LINK STATE','CITATION CHECK','OUT-OF-ROUND','STATEMENT','SHORT','HEADING'];
const RESTATABLE=['COLLISION','FORCED','ANSWER CHECK','KEYSTONE','STANDING','CONCEDED','RESULT'];
function readLine(line){const norm=normLine(line);if(!norm)return {form:null,why:'empty',code:'EMPTY',norm};
 const rs=norm.match(/^RESTATED\s*:\s*/i);if(rs){const r=readLine(norm.slice(rs[0].length));if(r.form&&RESTATABLE.includes(r.form))return {form:r.form,f:Object.assign({},r.f,{restated:true}),norm};
  if(r.form==null&&r.tried&&RESTATABLE.includes(r.tried))return Object.assign({},r,{norm});return {form:null,tried:'RESTATED',why:'RESTATED wraps no spec form',code:'NOT_A_FORM',norm};}
 for(const k of ORDER){const f=P[k](norm);if(!f)continue;if(f.code)return {form:null,tried:k,why:f.why,code:'MALFORMED_'+k.replace(/[^A-Z]+/g,'_'),detail:f.code,norm};return {form:k,f,norm};}
 {const lab=[[/^FORCED\b/i,'FORCED'],[/^D\d+\s+vs\.?\s+C\d+\b/i,'COLLISION'],[/^ANSWER CHECK\s*:/i,'ANSWER CHECK'],[/^KEYSTONE\s*:/i,'KEYSTONE']].find(([r])=>r.test(norm));
  if(lab)return {form:null,tried:lab[1],why:lab[1]+' label, line does not parse',code:'MALFORMED_'+lab[1].replace(/[^A-Z]+/g,'_'),detail:'NO_PARSE',norm};}
 return {form:null,why:'no line form',code:'NO_LINE_FORM',norm};}
function readStored(raw){return readLines(judgeText(raw).text);}
function readLines(text){return String(text==null?'':text).split('\n').map((l,i)=>{const r=readLine(l);return r.form?{n:i,form:r.form,fields:r.f,norm:r.norm}:{n:i,form:null,why:r.why,code:r.code,detail:r.detail||null,tried:r.tried||null,norm:r.norm};}).filter(r=>r.code!=='EMPTY');}
module.exports={norm:normLine,readLine,readLines,readStored,judgeText,normLine,unescapeOnce,quoteAt,FORMS:ORDER};
return module.exports;})();
function __acm(l){let r;try{r=__RL.readLine(String(l==null?'':l));}catch(x){return null;}return r&&r.form==='ANSWER CHECK'&&r.f?r.f:null;}
function __acm4(l){const f=__acm(l);if(!f||!f.rounds||!f.rounds.length||f.means===undefined||f.answer===undefined||!/^(MEETS|MISSES|FAILS)$/.test(f.grade))return null;const x=[l,f.verse,f.rounds.join('; '),String(f.means),String(f.answer),f.grade];return x;}
function __sbxRL(l){try{return __RL.readLine(String(l==null?'':l));}catch(e){return {form:null};}}
const PASS=$('Judge Enforcer Record').first().json;
const B=$('Send Back Build').all().map(x=>x.json);const first=B[0]||{};const T=new Date().toISOString();
const ns=(first.sb_not_sent||[]).map(x=>({run_token:null,seat:x.seat,seat_role:'panel',judge_model:null,kind:'send_back',rule:x.rule,item:x.item||null,flagged_line:null,prompt_sent:null,full_reply:null,reply_error:'NOT SENT: '+x.why,response_line:null,cure_status:null,cure_reason:'SEND-BACK NOT SENT: '+x.why+' (ruling 428)',at:T}));
if(first.sb_skip)return [{json:{...__trm(PASS),sendback:{skipped:true,why:first.sb_why||'',not_sent:ns.length,tally:{}},sb_rows:ns,sb_items:[]}}];
const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];const SIL={};  const ECF={};const UNDF={};const ABSM={};const PABM={};const MNPM={};const IMPM={};const KSCM={};const B7M={};
function psGrades(l){const g={};let t=String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');const m=t.match(/^\s*(?:[-•]\s*|\d+[.)]\s*)?(DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:\s*(\d+)?\s*(?:--|—|–)?/i);if(!m)return null;t=t.slice(m[0].length);
 t=t.replace(/\([^()]*\)/g,' ').replace(/"[^"\n]*"|“[^”\n]*”/g,' ').replace(/(^|[\s(\[:;,])['‘](?:[^'’\n]|['’](?=[A-Za-z]))+?['’](?=$|[\s.,;:!?)\]])/g,'$1 ')
  .replace(/\[[^\]]*\]/g,' ').replace(/\b\d+:\d+(?:[-–]\d+)?\b/g,' ').replace(/\b(?:Commitment|Link|LINK|links?)\s+\d+\b/g,' ').replace(/\b[CDL]\d+\b/g,' ').replace(/\b[123]\s+(?:Samuel|Kings|Chronicles|Corinthians|Thessalonians|Timothy|Peter|John)\b/g,' ')
  .replace(/\b(premises\s+)(\d)\s+(?:through|to)\s+(\d)\b/ig,'$1$2-$3').replace(/\b(\d)\s*[–—-]\s*(\d)\b/g,(x,a,b)=>{const o=[];for(let i=+a;i<=+b;i++)o.push(i);return o.join(', ');});
 const W=/\b(VOID|UNEXHIBITED|CONCEDED|counted|spared|SUPPORTED|NARROWED|STANDS)\b/ig;
 for(const c0 of t.split(/;|\.(?=\s|$)/).flatMap(x=>x.split(/,\s*(?=(?:and|but|while|whereas)\s+premises?\s+\d)/i).reduce((o,y)=>{const l=o.length-1;if(l>=0&&!(W.lastIndex=0,W.test(o[l])))o[l]+=', '+y;else o.push(y);return o;},[]))){ /* pkgPCS */const c=c0.replace(/\bnone\s+counted\b/ig,' ').replace(/\b(?:(?:are|is|were|was|be|been)\s+)?(?:not|never)\s+(?:counted|void|unexhibited|conceded)\b|\buncounted\b/ig,' spared ');  W.lastIndex=0;const w=W.exec(c);if(!w)continue;const k=w[1].toUpperCase();const G=k==='VOID'?'VOID':(k==='UNEXHIBITED'||k==='CONCEDED'||k==='COUNTED')?'COUNTED':'SPARED'; /* pkgNVR */
  for(const n of (c.match(/\b\d\b/g)||[]).map(Number))if(n>0&&!(n in g))g[n]=G;}
 return {side:m[1]&&/^CHALLENGER/i.test(m[1])?'CHALLENGER':'DEFENDER',n:m[2]!=null?+m[2]:null,g};}
function enf428Cure(it,a,R,named){
 const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
 const side=k=>/^CR/i.test(k)?'C':/^DR/i.test(k)?'D':null;const has=(k,q)=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return !!t&&t.includes(' '+N(q)+' ');};
 const six=(why,ks)=>{const w=N(why).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ks.some(k=>has(k,r)))return r;}return null;};
 const res=(c,why)=>({status:c?'CURED':'UNCURED',why});if(!a||a.ans==='NO ANSWER')return res(false,'no answer to the send-back');
 const AC=/ANSWER CHECK:\s*(.+?)\s*--\s*\[((?:CR|DR)[1-4](?:\s*[;,]\s*(?:CR|DR)[1-4])*)\]\s*--\s*MEANS:\s*["'“‘]([\s\S]*?)["'”’]\s*--\s*ANSWER:\s*["'“‘]([\s\S]*)["'”’]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 const pieces=s=>String(s).split(/["'”’]\s*;\s*["'“‘]|\.{3}|…/).map(x=>x.trim()).filter(x=>N(x).split(' ').length>=3);
 if(it.rule==='E-ANS'){const f=__acm4(String(it.line||'').replace(/\\+"/g,'"'))||String(it.line||'').replace(/\\+"/g,'"').match(AC);  if(!f)return res(false,'the flagged line is not read as an ANSWER CHECK line');const fs=side(f[2]);const SR=Object.keys(R||{}).filter(k=>side(k)===fs);
  if(a.ans==='KEEP'){const __S=String(f[4]).split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>/[A-Za-z]/.test(x));const __gr=x=>/^["'“‘]?(?:I\s+(?:grant|concede|accept|allow|affirm)\b|granted\b|conceded\b)/i.test(x)&&!/\b(?:so|because|for|but|yet|therefore|thus|hence|since)\b/i.test(x.replace(/^["'“‘]?\S+\s+\S+\s*/,''));const __df=x=>/^["“]?(?:(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–]\s*\d+)?[.:,]?\s+|(?:this|it|that|the\s+same)\s+)?(?:is|are|was|were|be|been)\s+answered\s+(?:(?:above|below)\s+)?(?:under|with|in|at|by|as\s+in|as\s+under|together\s+with)\s+(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–]\s*\d+)?\s*[.;:]?\s*(?:\*\*|["”’)\]])*\s*$|\b(?:under|in|at|see)\s+LINK\s*\d|\b(?:under|in|see)\s+\[?[CD]R[1-4]\]?|\banswer(?:ed)?\s+(?:it|this|that)?\s*(?:fully|in\s+full|below|above|later|there)\b/i.test(x)&&x.split(/\s+/).length<=15;const __lm=x=>{let y=String(x),p;do{p=y;y=y.replace(/^\s+/,'').replace(/^(?:[-•–—>]|\d{1,2}[.)])\s+/,'').replace(/^\*\*[^*\n]{1,80}\*\*[:.]?\s+(?=\S)/,'').replace(/^\[[^\]\n]{1,24}\]\s*/,'').replace(/^(?:(?:On|In|At|For|Under|As\s+to|Regarding)\s+)?(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+(?:\s*[-–,]\s*\d+)*[*_]*[.:,]?[*_]*\s+(?=\S)/,'').replace(/^[*_\x60#]+\s*/,'');}while(y!==p);return y.trim();};     const __bare=__S.length>0&&__S.every(x=>__gr(__lm(x))||__df(__lm(x)));const __fa=__bare?' '+N(f[4])+' ':null;  const __VR=/\b(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+/,__VQ=/"[^"\n]*"|“[^”\n]*”/g;let __vK=null;const __kjv=()=>{if(__vK)return __vK;let rows=[];try{rows=(typeof $==='function'?$('Cited Verses').all():[]).map(i=>i&&i.json).filter(r=>r&&r.book&&typeof r.text==='string');}catch(e){rows=[];}__vK=rows.map(r=>' '+N(r.text)+' ');return __vK;};const __vq=s=>String(s).split('\n').map(l=>__VR.test(l)?l.replace(__VQ,m=>m.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length>=6?' . zqvz . ':m):l.replace(__VQ,m=>{const n=N(m);return n.split(' ').length>=6&&__kjv().some(v=>v.includes(' '+n+' '))?' . zqvz . ':m;})).join('\n');  const __cut=k=>{const t=R&&typeof R[k]==='string'?' '+N(R[k])+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;};const __cutV=k=>{const t=R&&typeof R[k]==='string'?' '+N(__vq(R[k]))+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;};  const __oc=y=>{const z=String(y).replace(/\([^()]*\)/g,' ').replace(/"[^"]*"|“[^”]*”/g,' q ');const P=z.split(/,\s*and\s+|;\s+|\s+and\s+(?=I\b)/);const col=/:\s/.test(P[0]);  return P.slice(1).some(c=>{c=c.trim().replace(/^(?:on\s+that\s+ground|there|here|then|thus)\s+/i,'');const n=c.split(/\s+/).filter(Boolean).length;   if(/^that\b/i.test(c)||/^I\s+(?:also\s+|further\s+|likewise\s+)?(?:grant|concede|accept|allow|affirm)\b/i.test(c))return false;   if(/^(?:[1-3]\s*)?[A-Z][a-z]+\.?\s+\d+:\d+[\s\d:,;–-]*\.?$/.test(c))return false;   const cl=c.replace(/\b(?:[DC][1-9]|LINKS?\s+\d+|premise\s+\d+)\b(?:\s+(?:through|to|and)\s+(?:[DC]?[1-9]|\d+)\b)?/gi,'L');if(n<=8&&!/\d|\bq\b/.test(cl)&&(/^(?:I|my)\b/i.test(c)||n<=5)&&!/\b(?:not|no|never|nothing|only|because|since|for)\b/i.test(c)&&/^(?:\S+\s+){1,3}?(?:still\s+|also\s+)?(?:keeps?|holds?|maintains?|stands?|supports?|follows?|remains?|retains?)\b/i.test(c))return false;   if(n<=6&&!/\bq\b/.test(c)&&!/\b(?:not|no|never|nothing|only|because|since)\b/i.test(c)&&/\s(?:it|this|that|them|these|those|the\s+same)\.?$/i.test(c))return false;   if(col)return /^(?:I|my)\s+\S+\s+\S+/i.test(c);   if(/^(?:no|neither)\b/i.test(c))return n>=5;   return /^(?:I|my|the|this|these|those|it|he|she|they|we|nothing|both|each|all|[A-Z]\w*(?:['’]s)?)\s+\S+\s+\S+/.test(c);});};  const __bq=s=>String(s).split(/(?<=[.!?]["”’)\]*_]*)\s+|\n+/).map(x=>{const y=__lm(x);return y&&((__gr(y)&&!__oc(y))||__df(y))?' . zqbz . ':x;}).join(' ');const __cutB=k=>{const t=R&&typeof R[k]==='string'?' '+N(__bq(__vq(R[k])))+' ':'';return __fa&&N(f[4])?t.split(__fa).join(' \u0001 '):t;};    const __w=N(a.why).split(' ').filter(Boolean);let q=null,__qf=null,__qv=null,__qb=null;for(let i=0;i+6<=__w.length;i++){const r=__w.slice(i,i+6).join(' ');if(SR.some(k=>has(k,r))){if(__fa&&(__fa.includes(' '+r+' ')||!SR.some(k=>__cut(k).includes(' '+r+' ')))){__qf=__qf||r;continue;}if(!SR.some(k=>__cutV(k).includes(' '+r+' '))){__qv=__qv||r;continue;}if(__fa&&!SR.some(k=>__cutB(k).includes(' '+r+' '))){__qb=__qb||r;continue;}q=r;break;}}
   return res(!!q,q?'KEEP whose reason quotes the answering side\'s round: "'+q+'"':__qf?'KEEP whose reason quotes only the bare flagged answer itself, or words running into it ("'+__qf+'"), not a fuller answer from the answering side\'s rounds (pkgKQG)':__qv?'KEEP whose reason quotes only scripture the answering side quoted ("'+__qv+'"), not the side\'s own answer (pkgKVQ)':__qb?'KEEP whose reason quotes only another bare grant, affirmation or deferral of the answering side ("'+__qb+'"), not a fuller answer (pkgKBG)':'KEEP whose reason quotes no 6 words in a row of the answering side\'s rounds');}
  const t=__acm4(String(a.to||'').replace(/\\+"/g,'"'))||String(a.to||'').replace(/\\+"/g,'"').match(AC);  if(!t)return res(false,'the CHANGE TO is not an ANSWER CHECK line');if(N(t[1])!==N(f[1]))return res(false,'the CHANGE TO names another verse ('+t[1]+')');
  if(/^(MISSES|FAILS)$/i.test(t[5]))return res(true,'CHANGE TO grades MISSES');const ks=t[2].split(/\s*[;,]\s*/).map(k=>k.toUpperCase());
  if(ks.some(k=>side(k)!==fs))return res(false,'the CHANGE TO moves the answer to the other side\'s round');const ps=pieces(t[4]);if(!ps.length)return res(false,'the CHANGE TO quotes no answer of 3 or more words');
  const miss=ps.filter(p=>!ks.some(k=>has(k,p)));if(miss.length)return res(false,'the CHANGE TO answer is not found word for word in ['+ks.join('; ')+']: "'+miss[0].slice(0,120)+'"');
  const fa=N(f[4]),ta=N(t[4]);if(ta===fa||fa.includes(ta)){if(!/^MEETS$/i.test(f[5])&&/\(right:\s*MEETS\b/i.test(String(it.reason||'')))return res(true,'CHANGE TO MEETS, the grade the enforcer gave, on the same answer (pkgAMG)');}if(ta===fa||fa.includes(ta))return res(false,'the CHANGE TO MEETS quotes the flagged answer again (or a shorter cut of it)');
  return res(true,'CHANGE TO MEETS with a fuller answer found in ['+ks.join('; ')+']');}
 if(it.rule==='E-PREM'){const m=String(it.item||'').match(/against the (defender|challenger)\s+(\d+)/i);if(!m)return res(false,'the item names no premise');const n=+m[2];const fs=/^d/i.test(m[1])?'C':'D';
  const right=(String(it.reason||'').match(/\(right:\s*([A-Z ]+?)\)/)||[])[1]||null;const SR=Object.keys(R||{}).filter(k=>side(k)===fs);const ALL=Object.keys(R||{}).filter(k=>side(k));
  if(a.ans==='KEEP'){const q=six(a.why,SR);return res(!!q,q?'KEEP whose reason quotes the side\'s round: "'+q+'"':'KEEP whose reason quotes no 6 words in a row of the side\'s rounds');}
  const to=String(a.to||'');let g=null;const P=typeof psGrades==='function'?psGrades(to):null;if(P&&(n in P.g))g=P.g[n];
  if(!g){const z=to.match(new RegExp('\\bpremises?\\s+(?:\\d+\\s*(?:,|and|&)\\s*)*'+n+'\\b[^.;]{0,80}?\\b(not\\s+|never\\s+)?(VOID|UNEXHIBITED|CONCEDED|COUNTED|SPARED|SUPPORTED|NARROWED|STANDS)\\b','i'));if(z){const k=z[1]?'SPARED':z[2].toUpperCase();g=k==='VOID'?'VOID':/UNEXHIBITED|CONCEDED|COUNTED/.test(k)?'COUNTED':'SPARED';}}
  if(!g)return res(false,'the CHANGE TO gives premise '+n+' no grade the engine reads');
  {const Q=typeof psGrades==='function'?psGrades(it.line):null;if(P&&Q){const nm=named&&named.size?named:new Set([n]);const known=k=>(k in Q.g)?Q.g[k]:(!Object.keys(Q.g).length&&Q.n===0?'SPARED':null);const out=Object.keys(P.g).map(Number).filter(k=>known(k)!=null&&known(k)!==P.g[k]&&!nm.has(k));
   if(out.length||P.side!==Q.side||(P.n!=null&&Q.n!=null&&Math.abs(P.n-Q.n)>nm.size))return res(false,'the CHANGE TO regrades '+(out.length?'premise'+(out.length>1?'s ':' ')+out.join(', '):'the count or side')+' beyond its items (pkgPS refuses it)');}}const want=right&&/^VOID/.test(right)?'VOID':right&&/^(?:COUNTED|UNEXHIBITED|CONCEDED)/.test(right)?'COUNTED':right?'SPARED':null;
  if(want&&g!==want)return res(false,'the CHANGE TO grades premise '+n+' '+g+', not the enforcer\'s '+want);
  const qs=[...to.matchAll(/["“]([^"”]{8,240})["”]/g)].map(x=>x[1]).filter(q=>N(q).split(' ').length>=3);const miss=qs.filter(q=>!ALL.some(k=>has(k,q)));
  if(miss.length)return res(false,'a quote in the CHANGE TO is not found in any round: "'+miss[0].slice(0,120)+'"');return res(true,'CHANGE TO grades premise '+n+' '+g+(qs.length?', its quotes found in the rounds':''));}
 if(it.rule==='E-COL'){if(it.ecl&&Array.isArray(it.ecl.faults)&&it.ecl.faults.length){
  if(a.ans!=='CHANGE')return res(false,'a KEEP does not cure a layer fault (pkgECL, Commitment 13): '+it.ecl.why);const __to=String(a.to||'').replace(/\\+"/g,'"');
  if(/^\s*RETRACTED\b/i.test(__to))return res(true,'CHANGE TO RETRACTED (pkgECL)');if(!/\b(?:BROKEN|FORCED)\b/.test(__to))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED (pkgECL)');
  const __c=ECL.check(__to,ECL.ctxLive());if(__c.faults.length)return res(false,'CHANGE TO still fails the layer check (pkgECL): '+__c.why);if(!it.ecl.ds)return res(true,'CHANGE TO carries its layers (pkgECL): '+__c.why);}
const L=String(it.line||'').replace(/\\+"/g,'"');const pm=(L.match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i)||String(it.item||'').match(/\b(D\d+)\s*vs\.?\s*(C\d+)\b/i));
  const am=L.match(/ANSWER\s*\[\s*(?:([CD])R|(Defender|Challenger))/i);const fs=am?(am[1]?am[1].toUpperCase():(/^d/i.test(am[2])?'C':'D')):/CHALLENGER LINK BROKEN/.test(L)?'D':/DEFENDER LINK BROKEN/.test(L)?'C':null;
  if(!fs)return res(false,'the line names no answering side');const FORC=/^\s*FORCED\b/i.test(L);const ps=fs==='C'?'D':'C';
  const QR=/"[^"\n]{8,}?"|“[^”\n]{8,}?”/g;const own=k=>String(R&&R[k]||'').replace(/[*_\x60]+/g,'').replace(QR,' | ');const rows=k=>(String(R&&R[k]||'').replace(/[*_\x60]+/g,'').match(QR)||[]).join(' | ');
  const hasIn=(txt,q)=>(' '+N(txt)+' ').includes(' '+q+' ');const run6=(s,txts,not)=>{const w=N(s).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(not&&(' '+not+' ').includes(' '+r+' '))continue;if(txts.some(t=>hasIn(t,r)))return r;}return null;};
  const KS=Object.keys(R||{}).filter(k=>side(k));const ANSF=KS.filter(k=>side(k)===fs).map(k=>String(R[k]||'')),ROWS=KS.map(rows),PRS=KS.filter(k=>side(k)===ps).map(k=>String(R[k]||''));
  const ROWN=' '+ROWS.map(N).join(' | ')+' ';const ownRun=(t)=>{const w=N(t).split(' ').filter(Boolean);for(let i=0;i+6<=w.length;i++){const r=w.slice(i,i+6).join(' ');if(ROWN.includes(' '+r+' '))continue;if(ANSF.some(x=>hasIn(x,r)))return r;}return null;};
  const both=s=>{const t=String(s||'').replace(/\\+"/g,'"');const a1=ownRun(t);if(!a1)return {ok:false,why:'quotes no 6 words in a row of the answering side\'s own words'};const v=run6(t,ROWS,a1);if(!v)return {ok:false,why:'quotes the answering side ("'+a1+'") but no 6 words in a row of the quoted verse it cannot agree with'};return {ok:true,why:'quotes the answer ("'+a1+'") and the verse ("'+v+'")'};};
  const press=s=>{if(FORC||!/\b(?:unanswered|not answered|no answer|left (?:it )?unanswered|never answered)\b/i.test(String(s||'')+' '+L))return null;const r=run6(s,PRS,null);return r?'quotes the unanswered pressing sentence ("'+r+'"), ruling 392':null;};
  if(a.ans==='CHANGE'){const to=String(a.to||'');const pr=pm?new RegExp('\\b'+pm[1]+'\\s*vs\\.?\\s*'+pm[2]+'\\b','i'):null;
   if(!/\b(?:BROKEN|FORCED)\b/.test(to)&&(!pr||pr.test(to)||/^\s*RETRACTED\b/i.test(to)))return res(true,'CHANGE TO a line that does not grade the pair BROKEN or FORCED');
   const s=to+' '+(a.why||'');const p=press(s);if(p)return res(true,'CHANGE TO keeps the break and '+p);const b2=both(s);return res(b2.ok,'CHANGE TO keeps the break and '+b2.why);}
  const p=press(a.why);if(p)return res(true,'KEEP that '+p);const b2=both(a.why);return res(b2.ok,'KEEP that '+b2.why);}
 return res(false,'not an E-ANS, E-PREM or E-COL item');}
function vp1Oor2024(to,R){const res=(c,why)=>({status:c?'CURED':'UNCURED',why});const t=String(to==null?'':to).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').replace(/^\s*(?:[-•]\s*)?/,'').trim();
 if(/^STRUCK\b/i.test(t))return res(true,'the row is struck');if(!R||typeof R!=='object')return null;
 const m=t.match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?((?:CR|DR)[1-4])\]?\s*\|\s*([\s\S]+)$/);if(!m)return res(false,'the replaced line is not in the form <SIDE> | [<round>] | "<sentence>"');
 const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();const NQ=s=>N(s).replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
 const rd=m[2];let sent=m[3].trim();const counted=/(?:\||--)\s*COUNTED\.?\s*$/.test(sent);sent=sent.replace(/\s*(?:\||--)\s*COUNTED\.?\s*$/,'');{const q=sent.match(/^["“]([\s\S]*?)["”](?:\s*(?:--|—|–)\s[\s\S]*|\s+[A-Z(\[][\s\S]*)?$/);sent=q?q[1]:sent.split(/\s(?:--|—|–)\s/)[0];}
 if(/^(CR3|DR3)$/.test(rd))return res(false,'the replaced line names ['+rd+'], a link round; the section lists ground granted outside the two link rounds');
 if(rd.slice(0,2)!==(m[1]==='DEFENDER'?'CR':'DR'))return res(false,'the replaced line names '+m[1]+' but the round ['+rd+'] is the other side\'s');
 if(typeof R[rd]!=='string')return null;const q=NQ(sent);if(q.split(' ').length>=4&&!NQ(R[rd]).includes(q.slice(0,240)))return res(false,'the replaced sentence is not found verbatim in ['+rd+']');
 if(counted&&!/^(CR4|DR4)$/.test(rd))return res(false,'COUNTED ends a line from ['+rd+']; only a close-round concession enters the counts');
 return res(true,'the replaced line passes the code checks: its round is ['+rd+'], its side\'s own and not a link round, and its sentence is found verbatim there');}
function vp3Answers2024(T,verse){const L=String(T||'').split('\n');const out=[];if(!verse)return out;
 const vr=verse.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const head=new RegExp('^\\s*(?:[-*•]|\\d+[.)])?\\s*(?:\\*\\*)?\\s*(?:ANSWER\\s*:?\\s*)?'+vr+'(?![0-9])','i');const ansHead=new RegExp('\\bANSWER\\s*:?\\s*["“]?'+vr+'(?![0-9])','i');const bolded=new RegExp('^\\s*(?:[-*\u2022]|\\d+[.)])\\s.*\\*\\*'+vr+'(?![0-9])[^*]{0,3}\\*\\*');
 const top=l=>/^(?:[-*•]|\d+[.)])\s/.test(l)||/^#|^\*\*/.test(l.trim())||/^\s*LINK\s+\d/i.test(l);const isLay=l=>/^\s*[-*•]\s*\[L[1-4]\]/.test(l);
 for(let k=0;k<L.length;k++){const l=L[k];const hd=head.test(l.replace(/\*\*/g,''))||ansHead.test(l);
  const bold=!hd&&bolded.test(l)&&!/^\s*(?:[-*•]|\d+[.)])\s*(?:\*\*)?\s*\[L[1-4]/.test(l);  if(!hd&&!bold)continue;if(/--\s*MEANS\s*:/i.test(l))continue;
  let b=k;while(b+1<L.length){const n=L[b+1];if(!n.trim())break;if(isLay(n)||/^\s{2,}\S/.test(n)||!top(n)){b++;continue;}break;}
  let first=l.replace(/\*\*/g,'');const at=first.search(new RegExp(vr+'(?![0-9])','i'));let rest=at>=0?first.slice(at+verse.length):first;
  if(bold)rest=first.replace(/^\s*(?:[-*•]|\d+[.)])\s*/,'');
  else rest=rest.replace(/^\s*:?\s*,?\s*(?:["“][^"”]*["”]|'[^']*')\s*/,'').replace(/^\s*(?::|--|—|-|\.)\s*/,'').replace(/^ANSWER\s*:\s*/i,'');
  out.push({at:k,text:[rest,...L.slice(k+1,b+1)].join('\n').trim()});}
 return out;}
function vp3Bare2024(ans){const t=String(ans||'').trim();if(!t)return {bare:false,why:'empty answer'};
 if(/\[L[1-4]\]/.test(t))return {bare:false,why:'the answer carries its own layer '+(t.match(/\[L[1-4]\]/)||[''])[0]};
 const words=t.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').filter(Boolean).length;if(words>60)return {bare:false,why:'the answer runs '+words+' words'};
 const S=t.replace(/["“][^"”]*["”]/g,q=>q.replace(/[.!?]/g,' ')).split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>/[A-Za-z]/.test(s));if(!S.length)return {bare:false,why:'no sentence'};
 const GR=/^(?:I\s+(?:grant|concede|accept|allow)\b|granted\b|conceded\b)/i;const FITW=/\b(?:so|because|for|but|yet|therefore|thus|hence|since|which\s+(?:shows|fits|means)|this\s+(?:supports|fits|shows))\b/i;
 const DF=/\b(?:under|in|at|see)\s+(?:LINK|Link)\s*\d|\b(?:under|in|see)\s+\[?[CD]R[1-4]\]?|\banswer(?:ed)?\s+(?:it|this|that)?\s*(?:fully|in\s+full|below|above|later|there)\b|\bsee\s+(?:above|below)\b/i;
 const kinds=[];for(const s of S){const w=s.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length;
  if(GR.test(s)&&!FITW.test(s.replace(/^I\s+\w+\s+/i,'')))kinds.push('grant');else if(DF.test(s)&&w<=15)kinds.push('deferral');else return {bare:false,why:'a sentence is neither a grant nor a deferral: "'+s.slice(0,120)+'"'};}
 return {bare:true,why:'no layer of its own; only '+[...new Set(kinds)].join(' and ')+': "'+t.slice(0,200).replace(/\n/g,' ')+'"'};}
function vp3Link2024(T,n){const L=String(T||'').split('\n');const hd=k=>/^\s*(?:#+\s*)?(?:\*\*)?\s*LINK\s+\d+\b/i.test(L[k]);let a=-1;
 for(let k=0;k<L.length;k++)if(hd(k)&&new RegExp('^\\s*(?:#+\\s*)?(?:\\*\\*)?\\s*LINK\\s+'+n+'\\b','i').test(L[k])){a=k;break;}if(a<0)return null;
 let b=a+1;while(b<L.length&&!hd(b))b++;return L.slice(a,b).join('\n');}
function vp3Other2024(T,verse,skip){const vm=String(verse).match(/^(.*?)\s*(\d+):(\d+)/);if(!vm)return [];const bk=vm[1].trim(),ch=vm[2],vs=vm[3];
 const esc=x=>x.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,'\\$&');const RF=[new RegExp('(?<![0-9:])'+ch+'\\s*[:.]\\s*'+vs+'(?![0-9])'),new RegExp(esc(bk)+'\\s+'+ch+'\\s*,\\s*(?:verse|v\\.?)\\s*'+vs+'(?![0-9])','i'),new RegExp('\\b(?:verse|vv?\\.)\\s*'+vs+'(?![0-9])','i')];
 const NW=x=>String(x||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();const ST=new Set('the a an of and to in that is it be this for not i he she his her unto shall was with as by on which have him them they but or at from all said thou thee ye my me we our you your are so no'.split(' '));
 const W3=t=>{const w=NW(t).split(' ').filter(Boolean),o=[];for(let i=0;i+3<=w.length;i++){const g=w.slice(i,i+3);if(g.some(z=>!ST.has(z)))o.push(' '+g.join(' ')+' ');}return o;};
 let G=[];try{const cv=(typeof $==='function'?$('Cited Verses').all():[]).map(i=>i&&i.json).filter(r=>r&&r.book&&String(r.book).toLowerCase()===bk.toLowerCase()&&String(r.chapter)===ch&&String(r.verse)===vs);for(const r of cv)G=G.concat(W3(String(r.text).replace(/\[[^\]]*\]/g,' ')));}catch(e){}
 const out=[];String(T||'').split('\n').forEach((l,k)=>{if(skip&&skip(k,l))return;if(/--\s*MEANS\s*:/i.test(l))return;const n=' '+NW(l)+' ';if(RF.some(r=>r.test(l))||G.some(g=>n.includes(g)))out.push({at:k,text:l});});return out;}
function vp3Code2024(R,rounds,verse,dp){if(!R)return {ok:false,why:'no rounds found'};const found=[];
 const vr=verse.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const VR=new RegExp(vr+'(?![0-9])','i');
 for(const rd of rounds){const T=String(R[rd]||'');if(!T)continue;const L=T.split('\n');const ans=vp3Answers2024(T,verse);const at=new Set(ans.map(x=>x.at));
  for(const x of ans){const t=vp3Bare2024(x.text);if(!t.bare)return {ok:false,why:'['+rd+'] answer to '+verse+': '+t.why};
   for(const m of x.text.matchAll(/\b(?:LINK|Link)\s*(\d+)/g)){let blk=vp3Link2024(T,m[1]),inRd=rd;
    if(blk==null)for(const k of Object.keys(R).filter(k=>k.slice(0,2)===rd.slice(0,2)&&k!==rd).sort()){const b2=vp3Link2024(R[k],m[1]);if(b2!=null){blk=b2;inRd=k;break;}}
    if(blk==null){x.dv=(x.dv||'')+'; its deferral to LINK '+m[1]+' names a block no round of the side holds (pkgVPD: defers to nothing)';continue;}const w=blk.replace(/[^A-Za-z0-9]+/g,' ').trim().split(' ').length;
    if(/\[L[1-4]\]/.test(blk)||w>=25)return {ok:false,why:'['+rd+'] the deferral to LINK '+m[1]+(inRd!==rd?' (found in ['+inRd+'])':'')+' names an answer of '+w+' words'+(/\[L[1-4]\]/.test(blk)?' with layers':'')};}
   for(const m of x.text.matchAll(/\[?\b([CD]R[1-4])\b\]?/g)){const rr=m[1];
    if(rr.slice(0,2)===rd.slice(0,2)&&String(R[rr]||'').trim()){const VRx=new RegExp(verse.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![0-9])','i');const om=vp3Other2024(R[rr],verse,(k,l)=>VRx.test(l)||(rr===rd&&k>=x.at&&k<=x.at+((x.text.match(/\n/g)||[]).length)));
     for(const o of om){const tb=vp3Bare2024(o.text.replace(/^\s*(?:[-*•>]|\d+[.)])\s*/,''));if(!tb.bare)return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], which answers '+verse+' without its exact reference (line '+o.at+': \"'+o.text.trim().slice(0,90)+'\"; pkgVPD rev 2)'};}}
    if(rr.slice(0,2)!==rd.slice(0,2)){if(String(R[rr]||'').trim())return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], a round that holds text'};continue;}
    if(rounds.includes(rr)){x.dv=(x.dv||'')+'; its deferral to ['+rr+']'+(rr===rd?' (its own round)':'')+' names a round already read (pkgVPD)';continue;}
    if(!String(R[rr]||'').trim())continue;if(dp)return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], a further round (pkgVPD: one hop only)'};
    const c2=vp3Code2024(R,[rr],verse,1);if(c2.ok||/^no answer to /.test(c2.why)){x.dv=(x.dv||'')+'; its deferral to ['+rr+'] finds '+(c2.ok?'only a bare answer':'no answer to '+verse)+' there (pkgVPD)';continue;}
    return {ok:false,why:'['+rd+'] the answer defers to ['+rr+'], which answers '+verse+' ('+c2.why+')'};}
   found.push({rd,why:t.why+(x.dv||'')});}
  for(let k=0;k<L.length;k++){if(at.has(k)||!VR.test(L[k])||/--\s*MEANS\s*:/i.test(L[k]))continue;if(ans.some(x=>k>x.at&&k<=x.at+((x.text.match(/\n/g)||[]).length)))continue;
   return {ok:false,why:'['+rd+'] names '+verse+' again (line '+k+': "'+L[k].trim().slice(0,90)+'")'};}}
 if(!found.length)return {ok:false,why:'no answer to '+verse+' found in ['+rounds.join('], [')+']'};
 return {ok:true,why:found.map(f=>'['+f.rd+'] '+verse+': '+f.why).join('; ')};}
function vp3Trial2024(it,a,R,live){const rule=it&&it.rule;const rs=String(it&&it.reason||'');
 const ds=rule==='E-ANS'?rs.match(/\(right:\s*MISSES\)\s*:?\s*([\s\S]*?)(?:\s*\(judge wrote|$)/i):rule==='E-HOLD'?rs.match(/\(right:\s*BROKEN\)\s*:?\s*([\s\S]*?)(?:\s*\(judge wrote|$)/i):null;
 if(!ds)return null;const why=ds[1];let code;
 if(rule==='E-ANS'){const m=String(it.item||'').match(/ANSWER CHECK\s+(.+?)\s*\[((?:CR|DR)[1-4])\]/);if(!m)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the item names no verse and round'};const sd0=m[2].slice(0,2),r0=+m[2][2];code=vp3Code2024(R,[1,2,3,4].filter(n=>n>=r0).map(n=>sd0+n),m[1].trim());code.verse=m[1].trim();}
 else{const ln=String(it.line||'').replace(/\\+"/g,'"');const pm=ln.match(/^\s*(?:FORCED\s*:\s*)?D\d+\s+vs\s+C\d+\s*\(([^)]*)\)/i);if(!pm)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the line names no collision witnesses'};
  const ws=pm[1].split(/\s*;\s*/).map(x=>x.trim()).filter(Boolean);const named=ws.filter(v=>new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![0-9])','i').test(why));
  if(!named.length)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the DeepSeek reason names none of the collision witnesses'};
  const sd=/\bdefender/i.test(why)&&!/\bchallenger/i.test(why)?'CR':/\bchallenger/i.test(why)&&!/\bdefender/i.test(why)?'DR':(why.match(/\b(CR|DR)[1-4]\b/)||[])[1]||null;
  if(!sd)return {agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- the DeepSeek reason names no side'};
  const rn=[...new Set([...why.matchAll(new RegExp('\\b'+sd+'([1-4])\\b','g'))].map(x=>sd+x[1]))];const rounds=rn.length?rn:[1,2,3,4].map(n=>sd+n).filter(k=>R&&R[k]);
  code=null;for(const v of named){const c=vp3Code2024(R,rounds,v);if(c.ok){code={...c,verse:v};break;}code=code||{...c,verse:v};}code.side=sd;}
 if(!code.ok)return {agree:false,note:'TRIAL pkgVP3: code check does not agree, not an item -- '+code.why};
 const ans=a&&a.ans?a.ans:'NO ANSWER';const to=String(a&&a.to||'').replace(/\\+"/g,'"');let cured=false;
 if(ans==='CHANGE'){if(/^\s*(?:RETRACTED|WITHDRAWN)\b/i.test(to))cured=true;
  else if(rule==='E-ANS')cured=/--\s*(?:MISSES|FAILS)\b/i.test(to);
  else{const g=to.match(/\)\s*:\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)\b/i);const want=code.side==='CR'?'DEFENDER LINK BROKEN':'CHALLENGER LINK BROKEN';cured=/^\s*FORCED\b/i.test(to)||!!(g&&(g[1].toUpperCase()===want||g[1].toUpperCase()==='WITHDRAWN'));}}
 const lv=live==null?'none':String(live);const would=!cured&&lv==='UNCURED';
 return {agree:true,cured:!would,would,note:'TRIAL pkgVP3: TWO READERS AGREE on '+code.verse+' ('+code.why.slice(0,300)+') -- '+(would?'WOULD REMOVE %SEAT%: the reply ('+ans+') keeps the grade and the live cure reading is UNCURED':cured?'CURED by the reply ('+ans+')':'not listed: the live cure reading is '+(lv==='none'?'empty':lv))+'; record-only, no seat removed'};}
const __VP3={status:"TRIAL",checked:0,agree:0,would_remove:{}};
let __RD=null;for(const n of ['Panel Cure Normalize 1','Panel Cure Normalize 2','Panel Cure Normalize 3']){try{if(__L[n]().isExecuted)for(const it of __L[n]().all()){const c=it.json&&it.json.cure;if(c&&c.rounds){__RD=c.rounds;break;}}}catch(e){}if(__RD)break;}
B.forEach((b,ci)=>{let txt='',err=null;try{txt=String(R[ci].choices[0].message.content||'');}catch(e){err=String((R[ci]&&R[ci].error&&(R[ci].error.message||R[ci].error))||'no reply').slice(0,200);errors.push(b.seat+': '+err);}
 const J=/^\s*[{\[]/.test(txt);const A={};const T2=txt.replace(/\\n/g,'\n').replace(/\\"/g,'"');const __gds=new Set();for(const l0 of T2.split('\n')){const __l0=l0.replace(/[*_`]+/g,'').trim();const __gd=gdsDash2024(__l0);const l=__gd||__l0;if(__gd)__gds.add(l);
  {const r=__sbxRL(l);if(r&&r.form==='REPLY'&&r.f&&r.f.kind==='SENDBACK'){const id=r.f.id;
   const m0=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);const same=m0&&m0[1].replace(/\s+/g,'').toUpperCase()===id&&(/^KEEP$/i.test(m0[2].trim())?'KEEP':'CHANGE')===r.f.answer;
   if(!A[id])A[id]=same?{ans:r.f.answer,to:(m0[3]||'').trim(),why:(J?String(m0[4]||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(m0[4]||'')).trim(),line:l}:{ans:r.f.answer,to:String(r.f.to||'').trim(),why:(J?String(r.f.sentence||'').replace(/"\s*,?\s*[}\]]*\s*$/,''):String(r.f.sentence||'')).trim(),line:l};continue;}}
  const m=l.match(/SENDBACK\s*:?\s*(?:ITEM\s*)?#?\s*(S\s*\d+)\s*:?\s*\|\|\s*(KEEP|CHANGE\s+TO\s*:?([\s\S]*?))\s*(?:\|\|\s*(.*))?$/i);if(m){m[1]=m[1].replace(/\s+/g,'');m[4]=m[4]||'';}
  if(m&&!A[m[1].toUpperCase()])A[m[1].toUpperCase()]={ans:/^KEEP$/i.test(m[2].trim())?'KEEP':'CHANGE',to:(m[3]||'').trim(),why:(J?m[4].replace(/"\s*,?\s*[}\]]*\s*$/,''):m[4]).trim(),line:l};}
 for(const k in A){const m=A[k].ans==='CHANGE'&&A[k].to.match(/^(D\d+ vs C\d+)\b([^]*?)[\s;\/|-]*(FORCED[^:]{0,20}: *\1\b[^]*)$/);if(m){A[k].to=m[1]+m[2];A[k].fz=m[3];}}
 for(const k in A)if(__gds.has(A[k].line)){A[k].form='DASH';A[k].line=GDS_NOTE+' '+A[k].line;}
 (b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;
  let __ec=null;if(!it.grt2&&(it.rule==='E-ANS'||it.rule==='E-PREM'||it.rule==='E-COL')){try{const nm=it.rule==='E-PREM'?new Set((b.items||[]).filter(y=>y.rule==='E-PREM'&&String(y.line)===String(it.line)).map(y=>+((String(y.item||'').match(/(\d+)\s*$/)||[])[1]))):null;
   __ec=__RD?enf428Cure({rule:it.rule,item:it.item,line:it.line,reason:it.reason,ecl:it.ecl||null},a||{ans:'NO ANSWER'},__RD,nm):{status:'UNREAD',why:'no rounds found in the Panel Cure Normalize nodes'};}catch(e){__ec={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  if(it.abs){try{const __ac=ABS.cure(it,a||{ans:'NO ANSWER'},ECL.ctxLive());__ec=__ec?{status:__ac.status,why:__ac.why+' | record-only reading: '+__ec.status+' -- '+__ec.why}:__ac;}catch(e){__ec={status:'UNREAD',why:'absence cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  if(it.b7){try{__ec=B7.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'self-contradiction cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  if(it.ksc){try{__ec=KSC.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'keystone consistency cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  if(it.imp){try{__ec=IMP.cure(it,a||{ans:'NO ANSWER'},{...ECL.ctxLive(),R:IMP.roundsOf(b)});}catch(e){__ec={status:'UNREAD',why:'imposed-requirement cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  if(it.mnp){try{__ec=MNP.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'MEANS cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  if(it.pab){try{__ec=PAB.cure(it,a||{ans:'NO ANSWER'});}catch(e){__ec={status:'UNREAD',why:'press absence cure reading error: '+String(e&&e.message||e).slice(0,160)};}}
  const named=!a&&!err&&new RegExp('\\bS\\s*'+String(it.sid).replace(/^S/i,'')+'(?!\\d)').test(T2);const silent=!a&&!err&&!named&&!it.grt2;  if(silent)(SIL[b.seat]=SIL[b.seat]||[]).push(it.sid);
  shown.push({seat:b.seat,sid:it.sid,rule:it.rule,item:it.item,line:it.line,reason:it.reason,ans,to:a?a.to:'',why:a?a.why:(err?'no reply: '+err:'no SENDBACK line for this item')});
  rows.push({run_token:b.run_token,seat:b.seat,seat_role:'panel',judge_model:b.api_model,kind:'send_back',rule:it.rule,item:it.item||null,flagged_line:String(it.line).slice(0,1500),
   prompt_sent:k===0?b.msg:null,full_reply:k===0?(txt||null):null,reply_error:err,response_line:a?a.line.slice(0,1500):null,cure_status:null,
   cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)'+(silent?' | SILENT: no written answer; counted in drv_uncured (silence rule, WALL-2024 2274)':named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':'')+(__ec?(it.b7?' | CURE (SELF-CONTRADICTION '+(B7.LIVE?'ENFORCED':'TRIAL')+', pkgEB7): ':it.ksc?' | CURE (KEYSTONE CONSISTENCY ENFORCED, pkgKSC): ':it.imp?' | CURE (IMPOSED REQUIREMENT ENFORCED, pkgIMP): ':it.mnp?' | CURE (MEANS AGAINST THE LEDGER ENFORCED, pkgMNP): ':it.pab?' | CURE (PRESS ABSENCE ENFORCED, pkgPAB): ':it.abs?' | CURE (ABSENCE CHECK ENFORCED, pkgABS): ':it.rule==='E-COL'?' | CURE (E-COL ENFORCED, pkgECF): ':' | CURE (record-only until promoted): ')+__ec.status+' -- '+String(__ec.why).slice(0,400):''),at:T});
  if(it.grt2){rows[rows.length-1].cure_reason+=' | COMPANION ASK (pkgGRT2, for '+it.grt2.forced+'): record-only, counts against no seat';if(a)rows[rows.length-1].cure_status='CURED';}
  if(it.rule==='E-COL'&&__ec&&__ec.status!=='CURED'&&!silent&&!err){(ECF[b.seat]=ECF[b.seat]||[]).push(it.sid+' ('+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.rule==='E-COL'&&__ec&&__ec.status==='CURED')rows[rows.length-1].cure_status='CURED';
  if(it.rule==='E-UNG'||it.und){let __u;try{__u=UND.cure(it,a||{ans:'NO ANSWER'},ECL.ctxLive());}catch(e){__u={status:'UNREAD',why:'cure reading error: '+String(e&&e.message||e).slice(0,160)};}
   rows[rows.length-1].cure_reason+=' | CURE (pkgUND, ENFORCED): '+__u.status+' -- '+String(__u.why).slice(0,400);
   if(__u.status==='UNCURED'&&!silent&&!err){(UNDF[b.seat]=UNDF[b.seat]||[]).push(it.sid+' ('+it.rule+(it.rule==='E-UNG'?'':' on UNDERDETERMINED')+' '+String(it.item||'').slice(0,60)+': '+String(__u.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
   else if(__u.status==='CURED')rows[rows.length-1].cure_status='CURED';}
  if(it.abs&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(ABSM[b.seat]=ABSM[b.seat]||[]).push(it.sid+' ('+it.rule+' '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.abs&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';
  if(it.pab&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(PABM[b.seat]=PABM[b.seat]||[]).push(it.sid+' (E-PAB '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.pab&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';
  if(it.mnp&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(MNPM[b.seat]=MNPM[b.seat]||[]).push(it.sid+' (E-MNP '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.mnp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';
  if(it.imp&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(IMPM[b.seat]=IMPM[b.seat]||[]).push(it.sid+' (E-IMP '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.imp&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';
  if(it.ksc&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(KSCM[b.seat]=KSCM[b.seat]||[]).push(it.sid+' (E-KSC '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.ksc&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';
  if(it.b7&&__ec&&__ec.status!=='CURED'&&!silent&&!err){if(rows[rows.length-1].cure_status!=='UNCURED')(B7M[b.seat]=B7M[b.seat]||[]).push(it.sid+' (E-B7 '+String(it.item||'').slice(0,60)+': '+String(__ec.why).slice(0,160)+')');rows[rows.length-1].cure_status='UNCURED';}
  else if(it.b7&&__ec&&__ec.status==='CURED'&&rows[rows.length-1].cure_status!=='UNCURED')rows[rows.length-1].cure_status='CURED';
  {const __r=rows[rows.length-1];if(__r.cure_status==null&&!it.grt2&&!silent&&!err){
   if((it.rule==='E-ANS'||it.rule==='E-PREM')&&!it.abs&&!it.b7&&!it.ksc&&!it.imp&&!it.mnp&&!it.pab&&__ec&&(__ec.status==='CURED'||__ec.status==='UNCURED'))__r.cure_status=__ec.status;
   else if(it.rule==='E-OOR'&&a&&a.ans==='CHANGE'){let __o=null;try{__o=vp1Oor2024(a.to,__RD);}catch(e){__o=null;}if(__o){__r.cure_status=__o.status;__r.cure_reason+=' | CURE (E-OOR code reading of the replaced line, pkgVP1; record-only): '+__o.status+' -- '+__o.why;}}}}
  if((it.rule==='E-ANS'||it.rule==='E-HOLD')&&!it.grt2){const __r=rows[rows.length-1];let __v=null;try{__v=vp3Trial2024(it,a,__RD,__r.cure_status);}catch(e){__v={agree:false,note:'TRIAL pkgVP3: NOT CHECKED -- '+String(e&&e.message||e).slice(0,160)};}
   if(__v){let __n=__v.note;if(__v.agree&&__v.would&&(silent||err))__n=__n.replace(/WOULD REMOVE %SEAT%[^;]*/,'no written answer; silence is counted already (pkgSBS)');
    __r.cure_reason+=' | '+__n.replace('%SEAT%',b.seat);__VP3.checked++;if(__v.agree)__VP3.agree++;if(__v.agree&&__v.would&&!silent&&!err)(__VP3.would_remove[b.seat]=__VP3.would_remove[b.seat]||[]).push(it.sid+' ('+it.rule+' '+String(it.item||'').slice(0,60)+')');}}
});});
let bodies=null,anySil=false;const silent_counted=[];const ecol_counted=[];const und_counted=[];const abs_counted=[];const pab_counted=[];const mnp_counted=[];const imp_counted=[];const ksc_counted=[];const b7_counted=[];
if(Object.keys(ECF).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();
 for(const [seat,its] of Object.entries(ECF)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;ecol_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v41: E-COL UNCURED (pkgECF, W3 2534) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(UNDF).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(UNDF)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;und_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(ABSM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(ABSM)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;abs_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v43: ABSENCE GRADE UNCURED (pkgABS; Commitment 3, ruling 421) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(KSCM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(KSCM)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  if(KSC.LIVE){p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;}ksc_counted.push({seat,items:its,counted:KSC.LIVE});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v48: KEYSTONE CONSISTENCY UNCURED (pkgKSC, Commitment 15'+(KSC.LIVE?'':'; TRIAL')+') -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+(KSC.LIVE?'; counted in drv_uncured':'; TRIAL rule: recorded, not counted in drv_uncured; it removes no seat')+'. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(B7M).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(B7M)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  if(B7.LIVE){p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;}b7_counted.push({seat,items:its,counted:B7.LIVE});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v51: SELF-CONTRADICTION UNCURED (pkgEB7, ruling 421'+(B7.LIVE?'':'; TRIAL')+') -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+(B7.LIVE?'; counted in drv_uncured':'; TRIAL rule: recorded, not counted in drv_uncured; it removes no seat')+'. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(IMPM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(IMPM)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;imp_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v46: IMPOSED REQUIREMENT UNCURED (pkgIMP, Commitment 14) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(MNPM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(MNPM)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;mnp_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v45: MEANS AGAINST THE LEDGER UNCURED (pkgMNP) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(PABM).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,its] of Object.entries(PABM)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+its.length;anySil=true;pab_counted.push({seat,items:its});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v44: PRESS ABSENCE UNCURED (pkgPAB; Commitment 3, Commitment 5) -- SEAT: '+seat+'; ITEMS: '+its.join('; ')+'; counted in drv_uncured. REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
if(Object.keys(SIL).length){bodies=(bodies||(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies)).slice();
 for(const [seat,sids] of Object.entries(SIL)){const i=bodies.findIndex(x=>__seatOf(x)===seat);if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;
  p.drv_uncured=(p.drv_uncured||0)+sids.length;anySil=true;silent_counted.push({seat,items:sids});
  p.verdict_raw=p.verdict_raw+'\n[AUDIT v40: SEND-BACK SILENCE -- SEAT: '+seat+'; ITEMS: '+sids.join(', ')+'; no written answer to '+(sids.length===1?'this send-back item':'these send-back items')+'; counted in drv_uncured (silence rule, WALL-2024 2274). REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}
return [{json:{...__trm(PASS),...(bodies?{bodies}:{}),alt_needed:!!PASS.alt_needed||anySil,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted,ecol_counted,und_counted,abs_counted,pab_counted,mnp_counted,imp_counted,ksc_counted,b7_counted,vp3_trial:__VP3},sb_rows:rows,sb_items:shown}}];