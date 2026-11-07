/* pkgTRM: row arrays the next nodes never read from this output (each reader takes them from the node that made them, by name) are not copied on */
const __trm=o=>{const c={...o};for(const k of ["enf428_rows","enf421_rows"])delete c[k];return c;};
// pkgEPK library: copied byte for byte from Gate Record (unxLack, DRV_SRC, DRV_TL_STOP, LB_REF, LB_TL, lbFoot, lbBlockText, ciRounds, gatePromptText2024)
function unxLack(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));const named=[];
 for(const m of t.matchAll(/\[?\bL([1-4])\b\]?/g)){const pre=t.slice(Math.max(0,m.index-40),m.index).split(/[.;]/).pop();const post=t.slice(m.index+m[0].length,m.index+m[0].length+60).split(/[.;]/)[0];
  if(/\b(?:no|not|nothing|lacks?|lacking|without|missing|absent|never|nor|neither|fails?)\b[^\[]*$/i.test(pre)||/^\s*(?:layer\s+)?(?:(?:is|are)\s+)?(?:missing|absent|lacking|not\s+(?:exhibited|shown|given|present|there))\b/i.test(post)||/^[^\[]{0,30}?\b(?:does|do|did|is|are)\s+not\b|^[^\[]{0,30}?\bfails?\b/i.test(post))named.push(m[1]);}
 return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
const DRV_SRC=/[֐-׿Ā-ɏÂÊÎÔÛâêîôû̀-ͯͰ-ϿḀ-ỿἀ-῿ʾʿ]|\b[GH]\d{2,5}\b/;
const DRV_TL_STOP=/^(?:the|a|an|and|or|of|in|on|at|to|for|with|by|from|this|that|these|those|its|his|her|their|our|your|word|words|term|terms|verb|verbs|noun|nouns|root|roots|lexical|lexicon|ground|grounds|sense|meaning|greek|hebrew|aramaic|same|no|not|none|see|cf|which|where|who|is|are|was|were|be|been|as|it|he|she|they|we|i|but|if|so|also|only|both|each|every|any|all|text|verse|row|rows|layer|link|chain|here|there|than|then|when|while|after|before|under|over|into|upon|unto|thee|thou|thy|ye|hath|shall|unto)$/i;
const LB_REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/g;
const LB_TL=/(?:^|[\s(,;:"“'‘])([*_]*)([a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}(?:\s+[a-zà-ɏḀ-ỿ][a-zà-ɏḀ-ỿʼ'’-]{1,24}){0,2})\1\s*\(\s*["“'‘]?([a-z][^()\n\d]{1,80}?)["”'’]?\s*\)/g;
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
function lbBlockText(round,j){const s=String(round||'');const c=s.search(/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);const t=c>=0?s.slice(0,c):s;const H=[...t.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];const h=H[j-1];return h?t.slice(h.index,j<H.length?H[j].index:t.length):'';}
function ciRounds(ptext){const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
 const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7; /* judge_fix7 J5 */out[x.k]=t.slice(x.e,end);});return out;}
function gatePromptText2024(body){try{const b=body||{};const out=[];(b.messages||[]).forEach(m=>{const c=m&&m.content;if(typeof c==='string')out.push(c);else if(Array.isArray(c))c.forEach(p=>out.push(p&&typeof p.text==='string'?p.text:''));});(b.contents||[]).forEach(c=>(c.parts||[]).forEach(p=>out.push(String(p.text||''))));return out.join('\n');}catch(e){return '';}}
/* pkgKSC (W3 queue B6, builder feedback 4; W3 design ruling Wall 2665, grade 2671): KEYSTONE CONSISTENCY, side-neutral. The keystone is the
   defender's last declared link, Dn. A verdict may not grade "KEYSTONE: Dn -- STANDS" while its own CONCEDED LINKS line counts that link
   UNEXHIBITED, CONCEDED or WITHDRAWN (33175 single judge: LINK 6 "Mary is of the house of David" UNEXHIBITED, keystone D6 STANDS).
   W3 2671 (1): a "LINK n" the judge writes is Dn; a "Premise p" (or a bare "p") is the p-th entry of the [DR2] UNSUPPORTED-L4 PREMISES list
   and presses the link its own "LINK <n>:" label names, as pkgUNL reads it (33149: premise 6 was LINK 4). A premise with no label maps to no
   link and raises nothing. W3 2671 (2): TRIAL for one run (LIVE=false): the item is sent back and answered, and an uncured one is recorded
   (AUDIT v48), not counted in drv_uncured; it removes no seat. LIVE after a run with zero false items. Panel and alternate seats: one E-KSC
   send-back item; it cures either way, by a KEYSTONE line for Dn not graded STANDS, or a CONCEDED LINKS line that no longer counts that link.
   The single judge: a review line, record-only (it has no send-back). Commitment 15. */
const CLR=(()=>{
 const LBL=/^\s*(?:[-\u2022>]\s*|\d+[.)]\s+)?\**\s*(?:[A-Z][A-Z0-9 '\/()-]{2,60}:|D\d+\s+vs\.?\s+C\d+|C\d+\s+vs\.?\s+D\d+|\[|FORCED\b|RESULT\b|KEYSTONE\b|CLAUSE\b|#)/;
 const COUNTED=/^(UNEXHIBITED|CONCEDED|WITHDRAWN)$/i,TAGS='UNEXHIBITED|CONCEDED|WITHDRAWN|VOID|SPARED|SUPPORTED';
 const un=s=>String(s==null?'':s).replace(/\\n/g,'\n').replace(/\\+"/g,'"');
 function block(text,side){const L=un(text).split('\n');const lab=side==='CHALLENGER'?/^\s*(?:[-\u2022>]\s*)?\**\s*CHALLENGER CONCEDED LINKS\**\s*:\s*\**\s*(\d+)?/i:/^\s*(?:[-\u2022>]\s*)?\**\s*(?:DEFENDER )?CONCEDED LINKS\**\s*:\s*\**\s*(\d+)?/i;
  let at=-1,cnt=null;L.forEach((l,i)=>{const m=l.match(lab);if(m){at=i;cnt=m[1]!=null?+m[1]:null;}});if(at<0)return null;
  const parts=[L[at].replace(lab,'')];for(let i=at+1;i<L.length&&i<at+12;i++){const l=L[i];if(!l.trim())break;if(LBL.test(l.replace(/[*_`]/g,'')))break;parts.push(l);}
  return {count:cnt,line:L[at].trim(),cont:parts.length-1,body:parts.join(' ').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim()};}
 // a "ref group": "Premise 2", "Premises 2, 4 and 5", "premise 6", "item 1", "LINK 5", "C1", "(1)", or a bare "2" after "--", ";" or ":"
 const REF=new RegExp('(?:\\b(premises?|items?|links?|counted:?)\\s+((?:\\d+(?:\\s*(?:,|and|&|–|-|to|through)\\s*)*)+)|\\b([CD])(\\d)\\b|\\((\\d)\\)|(?:^|--|;|:)\\s*(\\d)(?=\\s+(?:'+TAGS+')\\b))','gi');
 const nums=s=>{const o=[];const t=String(s).replace(/\s+/g,' ');for(const m of t.matchAll(/(\d+)\s*(?:[–-]|to|through)\s*(\d+)|(\d+)/g)){if(m[1]){for(let k=+m[1];k<=+m[2]&&k<=+m[1]+9;k++)o.push(k);}else o.push(+m[3]);}return o;};
 function entries(body){const out=[];if(!body)return out;
  // parentheses and quotes are masked (their numbers are verses), except a "(LINK n" right after a premise
  let b=body.replace(/"[^"]*"|\u201c[^\u201d]*\u201d|\u2018[^\u2019]*\u2019|(?<=[\s(])'[^']{3,}?'(?=[\s,.;:)]|$)/g,m=>' '.repeat(m.length));
  const own=[];b=b.replace(/\(([^()]*)\)/g,(m,c,off)=>{const k=c.match(/^\s*(?:\[?DR2\]?\s*)?LINK\s+(\d+|none)\b/i);if(k)own.push({at:off,link:/none/i.test(k[1])?'none':+k[1]});return /^\s*\d\s*$/.test(c)?m:' '.repeat(m.length);});
  for(const cl of splitClauses(b)){const lead=cl.text.match(new RegExp('^\\s*(?:--\\s*)?(?:counted\\s*:?\\s*)?('+TAGS+')\\b(?:\\s*\\(stated\\))?\\s*:','i'));
   const refs=[...cl.text.matchAll(REF)];
   for(let r=0;r<refs.length;r++){const m=refs[r];let ref,ns;
    if(m[1]){const w=m[1].toLowerCase();ref=/^link/.test(w)?'LINK':'PREMISE';ns=nums(m[2]);}else if(m[3]&&!new RegExp('^\\s*[:(\\-\\s]*('+TAGS+')\\b','i').test(cl.text.slice(m.index+m[0].length))){continue;}else if(m[3]){ref=m[3];ns=[+m[4]];}else if(m[5]){ref='PREMISE';ns=[+m[5]];}else{ref='PREMISE';ns=[+m[6]];}
    const from=m.index+m[0].length;let nx=r+1;let inl=null; /* "premise 1 LINK 5 CONCEDED": the LINK names the premise's link */
    if(ref==='PREMISE'&&ns.length===1&&refs[nx]&&/^link/i.test(refs[nx][1]||'')&&/^\s*$/.test(cl.text.slice(from,refs[nx].index))){const k=nums(refs[nx][2]);if(k.length===1){inl=k[0];r++;nx++;}}
    const from2=inl!=null?refs[r].index+refs[r][0].length:from;const to=nx<refs.length?refs[nx].index:cl.text.length;const seg=cl.text.slice(from2,to);
    let tg=(seg.match(new RegExp('\\b((?:NOT|not|none|no)\\s+)?(UNEXHIBITED|CONCEDED|WITHDRAWN|VOID|SPARED|SUPPORTED|[Ss]pared|[Ss]upported)\\b'))||[]);let tag=tg[2]?(tg[1]?'NOT '+tg[2]:tg[2]).toUpperCase():null; /* counted tags are read in capitals only ("was conceded but" is prose); NOT/none/no negates */
    if(!tag&&lead)tag=lead[1].toUpperCase();if(!tag){const back=cl.text.slice(0,m.index).match(new RegExp('\\b('+TAGS+')\\b[^.;]*$','i'));if(back&&!/\b(spared|supported)\b/i.test(cl.text.slice(back.index,m.index)))tag=null;}
    if(!tag)continue;const ow=own.find(o=>o.at>=cl.off+m.index&&o.at<=cl.off+from+2);
    for(const n of ns)out.push({ref,num:n,link:inl!=null?inl:(ref==='PREMISE'&&ow?ow.link:null),tag,counted:COUNTED.test(tag)});}}
  return out;}
 function splitClauses(b){const o=[];let off=0;for(const p of b.split(/(?<=[.;])\s+(?=[A-Z(\d]|premise|item|counted)/)){o.push({text:p,off:b.indexOf(p,off)});off+=p.length;}return o;}
 function read(text,side){const B=block(text,side);if(!B)return null;const e=entries(B.body);const counted=B.count===0?[]:[...new Map(e.filter(x=>x.counted).map(x=>[x.ref+x.num,x])).values()];
  return {...B,entries:e,counted,named:counted.length,agrees:B.count==null?null:counted.length===B.count};}
 return {read,block,entries};})(); /* pkgCLR */
const KSC=(()=>{const LIVE=true;const clean=l=>String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]\s*|\d+[.)]\s+)/,'');
 const KS=/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b/i;const CL=/^CONCEDED LINKS\s*:(.*)$/i;
 // "LINK 6: UNEXHIBITED" (a link), "Premise 6 CONCEDED" or "-- 4 UNEXHIBITED; 6 CONCEDED" (a premise of the [DR2] list, 33129 chatgpt)
 const TAG=/(?:\b(LINK|PREMISE)\s*|(?:--|;|,)\s*)(\d+)\s*(?::|--|—|–|-|\(|,)?\s*(?:(?:is|was|stays|remains)\s+)?(UNEXHIBITED|CONCEDED|WITHDRAWN)\b/gi; /* pkgKSCL: ", TAG" and "is TAG" */
 // the [DR2] list: premise p -> the link its "LINK <n>:" label names (pkgUNL's reading: the last UNSUPPORTED-L4 PREMISES heading of [DR2])
 function premiseMap(dr2){const t=String(dr2||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return null;
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  const M={};its.forEach((x,k)=>{const m=x.match(/^\s*\**\s*(?:(\d+)[.)]\s*\**\s*)?LINK\s+(\d+|none)\s*\**\s*:/i);if(!m||/none/i.test(m[2]))return;const p=m[1]?+m[1]:k+1;if(!(p in M))M[p]=+m[2];});return M;}
 const keystone=t=>{let k=null;for(const raw of String(t||'').split('\n')){const m=clean(raw).match(KS);if(m)k={n:+m[1],state:m[2].toUpperCase(),line:raw.trim()};}return k;}; // the last plain KEYSTONE line
 const entries=l=>{const m=clean(l).match(CL);if(!m)return null;return [...m[1].matchAll(TAG)].map(x=>({kind:/^LINK$/i.test(x[1]||'')?'LINK':'PREMISE',num:+x[2],tag:x[3].toUpperCase()}));};
 const clrE=r=>r.counted.filter(x=>x.ref!=='C').map(x=>({kind:x.ref==='LINK'||x.ref==='D'?'LINK':'PREMISE',num:x.num,tag:x.tag,own:x.link!=null&&x.link!=='none'?x.link:null})); /* pkgCLR */
 const conceded=t=>{const r=CLR.read(t,'DEFENDER');return r?{e:clrE(r),body:r.body,line:r.line+(r.cont?' (+'+r.cont+' line'+(r.cont>1?'s':'')+')':'')}:null;}; /* pkgCLR: label line + continuation lines */ // the last defender CONCEDED LINKS line
 // the entry of a CONCEDED LINKS line that counts link n, read through the [DR2] map (pm); null when none
 const ownLink=(body,n)=>{if(body==null)return true;const t=String(body).replace(/\x22[^\x22]*\x22|\u201c[^\u201d]*\u201d/g,m=>' '.repeat(m.length));for(const m of t.matchAll(new RegExp('\\b(?:(?:LINK|Link|link)\\s*|D)'+n+'\\b(?=\\s*(?::|--|\u2014|\u2013|-|\\(|,)?\\s*(?:(?:is|was|stays|remains)\\s+)?(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\\b)','g'))){const pre=t.slice(Math.max(0,m.index-48),m.index);if(/\b(?:against|under|beneath|of|on|in|within|for)\s*\(?\s*\[?\s*$/i.test(pre))continue;if(/\b(?:premises?|items?)\s+\d+(?:\s*(?:,|and|&)\s*\d+)*\s*(?:[,(:\[]|--|—|–)?\s*$/i.test(pre))continue;return true;}return false;}; /* pkgKSP: the line names LINK n (or Dn) on its own with a counted tag, not as a premise's link */
 const counts=(e,n,pm,body)=>{for(const x of e||[]){if(x.kind!=='LINK'||x.num!==n)continue;if(!ownLink(body,n))continue;return {...x,link:n,via:'LINK '+x.num};}return null;}; /* pkgKSP (W3 grade_33411 Fault 3): only the keystone LINK itself counted, never a premise charged against it */
 // the items of one judge text (the reasoning, unescaped once; AUDIT and EXTRACTOR lines are not read); dr2: the challenger's round 2
 function items(t,dr2){const k=keystone(t);if(!k||k.state!=='STANDS')return [];const c=conceded(t);if(!c)return [];const pm=premiseMap(dr2);const h=counts(c.e,k.n,pm,c.body);if(!h)return [];
  return [{n:k.n,tag:h.tag,via:h.via,pmap:pm||{},keystone_line:k.line,conceded_line:c.line}];}
 function cure(it,a){const p=it.ksc||{};const R=(ok,w)=>({status:ok?'CURED':'UNCURED',why:w+' (pkgKSC, Commitment 15'+(LIVE?'':'; TRIAL')+')'});
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a keystone that stands on a link the same verdict counts '+p.tag);
  const to=String(a.to==null?'':a.to);const k=clean(to).match(KS);
  if(k){if(+k[1]!==p.n)return R(false,'the KEYSTONE line names D'+k[1]+'; the keystone is D'+p.n);return k[2].toUpperCase()==='STANDS'?R(false,'the KEYSTONE line still grades D'+p.n+' STANDS while '+p.via+' is counted '+p.tag):R(true,'CHANGE TO the KEYSTONE line: D'+p.n+' '+k[2].toUpperCase());}
  const rr=CLR.read(to,'DEFENDER');const e=rr?clrE(rr):entries(to);if(e){ /* pkgCLR */const h=counts(e,p.n,p.pmap,rr?rr.body:to);return h?R(false,'the CONCEDED LINKS line still counts '+h.via+' '+h.tag):R(true,'CHANGE TO a CONCEDED LINKS line that no longer counts LINK '+p.n);}
  return R(false,'the CHANGE TO is neither a KEYSTONE line for D'+p.n+' nor a CONCEDED LINKS line');}
 const note=it=>'THE KEYSTONE CONSISTENCY RULE (E-KSC, '+(LIVE?'ENFORCED':'TRIAL: answer it; it removes no seat')+', pkgKSC; Commitment 15): your KEYSTONE line grades D'+it.n+' STANDS, and your CONCEDED LINKS line counts '+it.via+' '+it.tag+'. D'+it.n+' is the keystone, the last declared link; it cannot stand on a link your own verdict counts '+it.tag+'. CHANGE TO one line, as your reading of the record gives: a KEYSTONE line for D'+it.n+' graded WITHDRAWN or BROKEN, with its ground; or your CONCEDED LINKS line no longer counting LINK '+it.n+', with your reason. A KEEP does not cure this item.';
 return {LIVE,items,cure,note,keystone,conceded,entries,premiseMap,counts};})();

const __L={"Alt Judge Enforcer Build":()=>$('Alt Judge Enforcer Build'),"Alt Seated":()=>$('Alt Seated'),"Alternate Call openrouter":()=>$('Alternate Call openrouter'),"Alternate Cure Call openrouter":()=>$('Alternate Cure Call openrouter'),"Cited Verses":()=>$('Cited Verses'),"L2 Lexicon":()=>$('L2 Lexicon'),"L2 Words":()=>$('L2 Words'),"Panel Cure Call 1 openrouter":()=>$('Panel Cure Call 1 openrouter'),"Panel Cure Call 2 openrouter":()=>$('Panel Cure Call 2 openrouter'),"Panel Cure Call 3 openrouter":()=>$('Panel Cure Call 3 openrouter'),"Panel Judge 1 openrouter":()=>$('Panel Judge 1 openrouter'),"Panel Judge 2 openrouter":()=>$('Panel Judge 2 openrouter'),"Panel Judge 3 openrouter":()=>$('Panel Judge 3 openrouter'),"Panel Reserve openrouter":()=>$('Panel Reserve openrouter')}; /* pkgPTA: literal names only */
// pkgABS (W3 ruling, Wall 2024, 2026-11-06; Commitment 3, ruling 421): a grade that rests on an absence. An E-ANS line graded MEETS, or an E-HOLD
// line graded STANDS or UNDERDETERMINED, whose answer words are an absence or a non-denial ("does not deny", "names no", "both retained") and that
// quotes no positive fit (a counted [L1]: a verse quoted with its reference under an [L1] tag, standing in the KJV verse) is raised. The text read is
// the ANSWER quote and the judge's MEETS quote (E-ANS), or the whole line (E-HOLD). A line with an absence phrase and a counted [L1] is not raised.
// Cure (Send Back Record): CHANGE TO MISSES or FAILS (E-ANS); CHANGE TO a BROKEN or FORCED line that passes the layer check (pkgECL); or a CHANGE TO
// whose line quotes a counted [L1] positive fit and no longer rests on the absence alone. A KEEP does not cure. Uses ECL (pkgECL) for the [L1] count.
const ABS=(()=>{
 const AB=/\b(?:do(?:es)?\s+not|did\s+not|doesn['’]t|didn['’]t|never)\s+(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject)\b|\bnames?\s+no\b|\bstates?\s+no\b|\bsays?\s+nothing\b|\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?|says?|names?|denies|deny|excludes?)\b|\bis\s+silent\b|\bboth\s+(?:are\s+)?(?:retained|accommodated|kept|stand|preserved)\b|\bare\s+both\s+(?:retained|accommodated|kept|preserved)\b|\baccommodat\w+\b|\b(?:remains?|is|are)\s+compatible\b|\bnot\s+inconsistent\b|\bleaves?\s+(?:room|open)\b|\bwithout\s+(?:asserting|stating|naming|saying|claiming|mentioning|specifying|denying|excluding)\b|\b(?:is|are|was|were)\s+(?:itself\s+|themselves\s+)?not\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|disputed|ruled\s+out|rejected|negated)\b/i; /* pkgABW (W3 2596; 33149 gemini D5 "without asserting a male begetter", chatgpt D1 "is not itself denied") */
 const WD=/\bI\s+(?:drop|withdraw|narrow)\b|\bnarrow\s+accordingly\b/i;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"');
 const AQ=/ANSWER:\s*["“'‘]([\s\S]*?)["”'’]\s*--\s*(MEETS|MISSES|FAILS)\b\s*(?:--\s*([\s\S]*))?$/i;
 // the text an item's grade rests on
 function text(id){const L=N(id&&id.flagged_line);if(id.rule==='E-ANS'){const m=L.match(AQ);return m?(m[1]+' '+(m[3]||'')):L;}return L;}
 function absence(t){const m=String(t||'').match(AB);return m?m[0]:null;}
 function fit(t,ctx){try{const c=ECL.check('FORCED -- GROUND: '+N(t),ctx||{});return c.l1;}catch(e){return 'NONE';}}
 // applies to E-ANS MEETS and E-HOLD STANDS/UNDERDETERMINED; returns {raise, absence, fit, why}
 function check(id,ctx){const g=String(id&&id.grade||'').toUpperCase();
  if(!((id.rule==='E-ANS'&&g==='MEETS')||(id.rule==='E-HOLD'&&(g==='STANDS'||g==='UNDERDETERMINED'))))return {applies:false,raise:false};
  const t=text(id);const a=absence(t);if(!a)return {applies:true,raise:false,absence:null};
  if(WD.test(t))return {applies:true,raise:false,absence:a,withdrawn:true,why:'the answer drops or narrows its own claim (a withdrawal, K-W), not a meeting by absence'};
  const f=fit(t,ctx);if(f==='COUNTED')return {applies:true,raise:false,absence:a,fit:f,why:'absence phrase "'+a+'" with a counted [L1] positive fit'};
  return {applies:true,raise:true,absence:a,fit:f,why:id.rule+' '+g+' rests on an absence or non-denial ("'+a+'") and quotes no counted [L1] positive fit'+(f!=='NONE'?' ([L1] '+f+')':'')};}
 // the cure of a send-back answer a = {ans, to, why}
 function cure(it,a,ctx){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');
  if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a grade resting on an absence (pkgABS, Commitment 3, ruling 421)');const to=N(a.to);
  if(it.rule==='E-ANS'&&/--\s*(?:MISSES|FAILS)\b/i.test(to))return R(true,'CHANGE TO grades MISSES (pkgABS)');
  if(/^\s*RETRACTED\b/i.test(to))return R(true,'CHANGE TO RETRACTED (pkgABS)');
  if(/\b(?:BROKEN|FORCED)\b/.test(to)){const c=ECL.check(to,ctx||{});if(c.applies&&!c.faults.length)return R(true,'CHANGE TO a break with its layers (pkgABS): '+c.why);return R(false,'CHANGE TO a break that fails the layer check (pkgABS): '+c.why);}
  const f=fit(it.rule==='E-ANS'?(to.match(AQ)?(to.match(AQ)[1]+' '+(to.match(AQ)[3]||'')):to):to,ctx);if(f==='COUNTED')return R(true,'CHANGE TO quotes a counted [L1] positive fit (pkgABS)');
  return R(false,'CHANGE TO quotes no counted [L1] positive fit and is not regraded MISSES, BROKEN or FORCED (pkgABS)'+(f!=='NONE'?' ([L1] '+f+')':''));}
 // a verse quoted beside its reference without an [L1] tag, standing in the KJV verse: reported beside a raise, never a bar to it
 const QP=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?[^"“”'‘\n\[]{0,40}?(?:"([^"“”]{6,400})"|“([^"“”]{6,400})”|'([^'\n]{6,400}?)'(?![a-z])|‘([^’\n]{6,400})’)/g;
 function quoted(t,ctx){const idx={};for(const r of (ctx&&ctx.rows)||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;const out=[];
  for(const p of String(t||'').matchAll(QP)){const q=p[5]||p[6]||p[7]||p[8];const v1=+p[3],v2=+(p[4]||p[3]);const parts=[];for(let v=v1;v<=v2;v++){const x=idx[p[1]+' '+p[2]+':'+v];if(x)parts.push(x);}
   const ref=p[1]+' '+p[2]+':'+v1+(v2!==v1?'-'+v2:'');if(parts.length!==v2-v1+1){out.push({ref,q,status:'UNVERIFIABLE'});continue;}const k=parts.join(' ');out.push({ref,q,status:kkjvIsVerseQuote(q,k)&&kkjvStands(q,k)?'STANDS':'NOT IN VERSE'});}
  return out;}
 return {check,cure,absence,text,fit,quoted};})();
// pkgPAB (W3 ruling, Wall 2596/2599; Commitment 3 with Commitment 5): a press counts as proven only on the part of its MEANS that stands on the
// quoted words. A judge's break or concession that charges a press as unanswered, where that press's MEANS carries an absence clause (the pkgABS
// AB pattern, e.g. "Jeremiah 22:30 states no such condition"), is sent back. Cure: a reply that quotes the MEANS' positive part (6 words in a
// row, or all of it when shorter), or CHANGE TO: RETRACTED, or a CHANGE TO line that no longer charges that press as unanswered. A MEANS with no
// positive part is cured only by the retraction or the regrade. Side-neutral: a press from either side's rounds. Uses ABS.absence (pkgABS/pkgABW).
// pkgMNP (W3 2026-11-06; 33107 chatgpt ANSWER CHECK Acts 2:30 -- [CR3] -- MEANS: "NONE" ... UNPROVEN: no separate MEANS sentence, while
// [DR2] gives Acts 2:30 a MEANS): an ANSWER CHECK line that says its press has no MEANS (MEANS "NONE" or empty, or UNPROVEN for no MEANS) is
// read against the press ledger (PRS, the live copy, on the list that closes the pressing round: [DR2] for a [CR] answer, [CR3] for a [DR]
// answer). When the ledger finds a MEANS for that verse, the line is sent back, ENFORCED. Cure: CHANGE TO the ANSWER CHECK line for that verse
// with its real MEANS (6 words in a row of the ledger's MEANS, or all of it when shorter) and a grade (MEETS, MISSES or FAILS; UNPROVEN only
// where the ledger itself marks the press UNPROVEN). A KEEP does not cure. Uses REFP (in the node). lbFoot and PRS are the live library copies.
const MNP=(()=>{
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

 const PW_CAP=8;const PW_ROUND={DEFENDER:'DR2',CHALLENGER:'CR3'};const pwHead=side=>side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');
 const keyOf=t=>{try{const k=REFP.keys(String(t||''),{scoped:true,cap:12});return k.length?k[0].key:null;}catch(e){return null;}};
 // the ledger of one side: every pressed verse of the list that closes its pressing round, with its MEANS and class
 function ledger(R,side){const t=String((R&&R[PW_ROUND[side]])||'');let i=-1;for(const m of t.matchAll(pwHead(side)))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));const out=[];
  its.forEach((x,k)=>{const j=x.search(/PRESSED WITH\s*:/i);if(j<0)return;let seg=x.slice(j);const b=seg.search(/\n\s*\n/);if(b>=0)seg=seg.slice(0,b);if(/^PRESSED WITH\s*:\s*[\s*_]*none\b/i.test(seg))return;
   let P=null;try{P=PRS.premise(seg,R,PW_ROUND[side],null);}catch(e){P=null;}if(!P)return;for(const v of P.verses)out.push({premise:k+1,key:v.key,cls:v.cls,why:v.why,means:v.means||''});});return out;}
 // the judge's ANSWER CHECK lines that say the press has no MEANS
 const NOM=/\bno\s+(?:separate\s+|stated\s+|own\s+)?MEANS\b|\bMEANS\s+(?:sentence\s+)?(?:is\s+)?(?:missing|absent)\b|\bwithout\s+a\s+MEANS\b/i;
 function claims(text){const out=[];for(const l0 of N(text).split('\n')){const l=l0.trim();if(!/^ANSWER CHECK\s*:/.test(l))continue;
  const m=l.match(/^ANSWER CHECK\s*:\s*(.+?)\s*--\s*\[\s*([CD])R\s*(\d)\s*\]/);if(!m)continue;const mm=l.match(/--\s*MEANS\s*:\s*(["\u201c]?)([^"\u201d]*?)\1\s*(?:--|$)/);const mv=mm?mm[2].trim():null;
  const none=mv!==null&&(/^(?:NONE|N\/A|-+)?\.?$/i.test(mv));const unp=/\bUNPROVEN\b/.test(l)&&NOM.test(l);if(!none&&!unp)continue;
  out.push({line:l,ref:m[1].trim(),key:keyOf(m[1]),round:m[2]+'R'+m[3],side:m[2]==='C'?'DEFENDER':'CHALLENGER',means:mv,grade:(l.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1]||null});}return out;}
 function check(text,R){const out=[];const L={};for(const c of claims(text)){if(!c.key)continue;L[c.side]=L[c.side]||ledger(R,c.side);const hit=L[c.side].find(v=>v.key===c.key&&String(v.means).trim().length>=6);if(!hit)continue;
  out.push({...c,premise:hit.premise,ledger_means:hit.means,ledger_cls:hit.cls,why:'the ANSWER CHECK on '+c.ref+' ['+c.round+'] says the press has no MEANS, but the press ledger reads a MEANS for it in ['+PW_ROUND[c.side]+'] (premise '+hit.premise+'): "'+hit.means.slice(0,300)+'" (ledger: '+hit.cls+')'});}return out;}
 const nw=s=>N(s).toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`]/g,'').replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]+/g,' ').trim().split(' ').filter(Boolean);
 function cure(it,a){const R=(c,w)=>({status:c?'CURED':'UNCURED',why:w});if(!a||a.ans!=='CHANGE')return R(false,(a&&a.ans==='KEEP'?'a KEEP does not cure this item':'no answer')+' (pkgMNP)');const p=it.mnp||{};
  const c=claims(a.to);const to=N(a.to).trim();if(!/^ANSWER CHECK\s*:/.test(to))return R(false,'the CHANGE TO is not an ANSWER CHECK line (pkgMNP)');if(keyOf(to.replace(/^ANSWER CHECK\s*:\s*/,'').split('--')[0])!==p.key)return R(false,'the CHANGE TO grades another verse (pkgMNP)');
  if(c.length)return R(false,'the CHANGE TO still says the press has no MEANS (pkgMNP)');const g=(to.match(/--\s*(MEETS|MISSES|FAILS|UNPROVEN)\b/)||[])[1];if(!g)return R(false,'the CHANGE TO has no grade (pkgMNP)');
  if(g==='UNPROVEN'&&p.ledger_cls!=='UNPROVEN')return R(false,'graded UNPROVEN, but the ledger marks the press '+p.ledger_cls+' (pkgMNP)');
  const mm=to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--\s*ANSWER\s*:/)||to.match(/--\s*MEANS\s*:\s*([\s\S]*?)\s*--/);const mvq=mm?mm[1].trim().replace(/^["\u201c]([\s\S]*)["\u201d]$/,'$1'):'';const pw=nw(p.ledger_means);const T=' '+nw(mvq).join(' ')+' '; /* pkgMNQ: 33461 sol, a MEANS with an inner quote read as empty */const runs=pw.length<=6?[pw.join(' ')]:pw.slice(0,pw.length-5).map((_,i)=>pw.slice(i,i+6).join(' '));
  const q=runs.find(r=>T.includes(' '+r+' '));return q?R(true,'graded '+g+' on the real MEANS ("'+q+'") (pkgMNP)'):R(false,'the CHANGE TO\'s MEANS quotes no 6 words in a row of the ledger\'s MEANS (pkgMNP)');}
 return {claims,ledger,check,cure,PRS};})();

// pkgIMP (Eric 17:08 CST 2026-11-06: "the judges should flag comments where the model make requirements of scripture that the scripture itself
// doesn't hold or suggest"; W3 spec, Wall 2627; Commitment 14, IMPOSED REQUIREMENT, ENFORCED, both sides, not a DG).
// Amended per W3 2629: grants, concessions, withdrawals and narrowings are skipped; only sentences inside an answer block are read; a third cure,
// NOT A REQUIREMENT -- rebuts [<round>] "<the opponent's words>", verified in code (6+ words standing in a round of the other side).
// IMP.harvest: every debater sentence of [CR2]-[CR4] and [DR1]-[DR4] whose words (quotations removed) rest on a verse not stating, naming or
// saying something (the ABS.AB absence forms, without the "both retained / compatible / leaves room" forms, which ask nothing of a verse), and that
// rests on a verse: a reference in the sentence or in the 600 characters of its round before it. IMP.items: one E-IMP item per harvested
// sentence for a judge, unless that judge's text already holds an IMPOSED line quoting it; plus a contradiction item for an ANSWER CHECK the
// judge grades MEETS on an answer its own IMPOSED line flags NO ROW SETS IT (W3 2627 (4)). IMP.cure: CHANGE TO an IMPOSED line for the sentence
// (NO ROW SETS IT, or SET BY a counted [L1], the ECL count); for a contradiction item, CHANGE TO the ANSWER CHECK graded MISSES or FAILS, or an
// IMPOSED line SET BY a counted [L1]. A KEEP does not cure.
const IMP=(()=>{
 const AB=/\b(?:do(?:es)?\s+not|did\s+not|doesn['’]t|didn['’]t|never)\s+(?:deny|denies|dispute|contradict|exclude|rule\s+out|name|state|say|mention|specify|forbid|reject|tell|record)\b|\bnames?\s+no\b|\bstates?\s+no\b|\bsays?\s+nothing\b|\bno\s+(?:verse|row|text|word|witness)s?\s+(?:states?|says?|names?|denies|deny|excludes?)\b|\bis\s+silent\b|\bwithout\s+(?:asserting|stating|naming|saying|mentioning|specifying|denying|excluding)\b|\b(?:is|are|was|were)\s+(?:itself\s+|themselves\s+)?not\s+(?:itself\s+|themselves\s+)?(?:denied|contradicted|excluded|ruled\s+out|named|stated)\b/i;
 const REF=/(?:[1-3]\s)?[A-Z][a-z]+\.?\s\d{1,3}:\d{1,3}/;
 const W=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
 const unq=s=>String(s||'').replace(/"[^"\n]*"|“[^”\n]*”/g,' " ');
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"');
 const ROUNDS=['CR2','DR1','DR2','CR3','DR3','CR4','DR4'];
 /* (W3 2629 (1)) a sentence that grants, concedes, withdraws or narrows is the debater's own ground given up, not a requirement */
 const GIVE=/\bI\s+(?:drop|withdraw|narrow|grant|concede|accept|allow|rest\s+nothing)\b|\bnarrow\s+(?:accordingly|it|the\s+link)\b|^\W*(?:Granted|Conceded|CONCEDED|Grant)\b|\bI\s+do\s+not\s+(?:say|claim|rest|hold|argue)\b|\bno\s+longer\s+(?:claims?|holds?|rests?)\b|\bin\s+(?:so\s+many\s+)?words\b|\bI\s+hold\s+(?:that|this|the)\s+limb\b/i;
 /* (W3 2629 (3)) answer blocks: a heading or label that answers a press ("Answer to ...", "Answers to the presses", "ANSWER: ...", "Pressed rows")
    and its lines, to the next heading of its kind; a markdown heading's block runs to the next markdown heading of the same or a higher level */
 const ANS=/\banswers?\s+to\b|^[\s#>*_-]*ANSWER\s*:|\bpressed\s+rows\b|\banswers?\s+(?:on|for)\s+the\s+press/i;
 function blocks(t){const L=String(t||'').split('\n');const out=[];let off=0,cur=null;
  const md=l=>{const m=l.match(/^\s*(#{1,6})\s/);return m?m[1].length:0;};const bold=l=>/^\s*\*\*[^*\n]{2,200}\*\*\s*:?\s*$/.test(l)||/^\s*[A-Z][A-Za-z' -]{2,40}:\s*$/.test(l);const link=l=>/^[\s#>*_-]*LINK\s+\d+\b/i.test(l);const rule=l=>/^\s*-{3,}\s*$/.test(l);
  for(const l of L){const a=off;off+=l.length+1;const lv=md(l);
   if(cur){const end=cur.md?((lv&&lv<=cur.md)||(cur.md>1&&rule(l))):(lv||rule(l)||link(l)||bold(l));if(end){cur.e=a;out.push(cur);cur=null;}}
   if(!cur&&(lv||bold(l)||/^[\s>*_-]*\**\s*ANSWER\s*:/i.test(l))&&ANS.test(l))cur={s:a,md:lv,head:l.trim().slice(0,80)};}
  if(cur){cur.e=off;out.push(cur);}return out;}
 function harvest(R){const out=[];const seen=new Set();
  for(const k of ROUNDS){const t=String(R&&R[k]||'');if(!t)continue;const BL=blocks(t);if(!BL.length)continue;const inA=i=>BL.some(b=>i>=b.s&&i<b.e);let off=0;
   for(const para of t.split(/(\n)/)){const at=off;off+=para.length;if(!para.trim()||/^\s*#|^\s*\**\s*LINK\s+\d+\s*:\s*\**\s*\w+\**\s*$|^\s*\*\*[^*\n]{2,200}\*\*\s*:?\s*$|^\s*[A-Z][A-Za-z' -]{2,40}:\s*$/i.test(para.trim()))continue; /* one line at a time; headings and labels are not sentences */
    let so=0;for(const s0 of para.split(/(?<=[.!?]["”']?)\s+(?=["“(\[*]*[A-Z])/)){const pos=at+para.indexOf(s0,so);so=Math.max(so,pos-at+s0.length);
     const s=s0.replace(/\s+/g,' ').replace(/^[\s*_\-•]+|[\s*_]+$/g,'').trim();if(s.length<12||/^(?:PRESSED WITH|MEANS)\b/i.test(s))continue;
     if(!inA(pos))continue;const m=unq(s).match(AB);if(!m||GIVE.test(unq(s)))continue;if(!REF.test(t.slice(Math.max(0,pos-600),pos+s0.length)))continue; /* rests on a verse: a reference in the sentence or the 600 characters before it */
     const key=k+'|'+W(s);if(seen.has(key))continue;seen.add(key);const bl=BL.find(b=>pos>=b.s&&pos<b.e);out.push({id:'I'+(out.length+1),round:k,side:k[0]==='C'?'DEFENDER':'CHALLENGER',sentence:s.slice(0,400),phrase:m[0],block:bl?bl.head:null});}}}
  return out;}
 const has=(a0,b0,n)=>{const a=' '+W(a0)+' ',bw=W(b0).split(' ').filter(Boolean);if(!bw.length)return false;const k=Math.min(n||8,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
 const LINE=/^[\s>*_\-•]*IMPOSED\s*:\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”]\s*--\s*(?:asks\s+([\s\S]+?)\s+to\s+([\s\S]+?)\s*--\s*(NO ROW SETS IT|SET BY\b\s*([\s\S]*))|(NOT A REQUIREMENT)\s*--\s*rebuts\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*["“]([\s\S]+?)["”])\s*$/i;
 function lines(text){const o=[];for(const l of N(text).split('\n')){const m=l.match(LINE);if(!m)continue;
  if(m[7])o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],nar:true,rround:m[8].toUpperCase(),rquote:m[9]});else o.push({raw:l.trim(),round:m[1].toUpperCase(),quote:m[2],verse:m[3],req:m[4],no:/^NO ROW/i.test(m[5]),set:m[6]||null});}return o;}
 /* (W3 2629 (2)) NOT A REQUIREMENT: the sentence rebuts an opponent's claim. The quote stands word for word in a round of the other side, 6 words or more */
 function rebutOk(l,round,R){if(!l||!l.nar)return {ok:false,why:'not a NOT A REQUIREMENT line'};if(l.rround[0]===round[0])return {ok:false,why:'['+l.rround+'] is a round of the same side; a rebuttal answers the other side'};
  const q=W(l.rquote);if(q.split(' ').length<6)return {ok:false,why:'the rebutted quote has fewer than 6 words'};if(!R||!R[l.rround])return {ok:false,why:'round ['+l.rround+'] could not be read'};
  if(!W(R[l.rround]).includes(q))return {ok:false,why:'the quote does not stand word for word in ['+l.rround+']'};return {ok:true,why:'rebuts ['+l.rround+'] "'+String(l.rquote).slice(0,80)+'", which stands in that round'};}
 const RND=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;
 function rounds(t){t=String(t||'');const at=[];let m;RND.lastIndex=0;while((m=RND.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});const o={};at.forEach((x,i)=>{if(o[x.k]==null)o[x.k]=t.slice(x.e,i+1<at.length?at[i+1].s:t.length);});return o;}
 const roundsOf=b=>{try{const ms=(b&&b.body&&(b.body.messages||b.body.contents))||[];return rounds(ms.map(m=>typeof m.content==='string'?m.content:Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):Array.isArray(m.parts)?m.parts.map(c=>c&&c.text||'').join('\n'):'').join('\n'));}catch(e){return {};}};
 const AC=/^[\s>*_\-•]*ANSWER CHECK\s*:\s*([^\n]*?)\s*--\s*\[\s*((?:CR|DR)[1-4])\s*\]\s*--[\s\S]*?ANSWER\s*:\s*["“]([\s\S]*?)["”]\s*--\s*(MEETS|MISSES|FAILS)\b/i;
 function items(text,H,R){const L=lines(text);const out=[];
  for(const h of H){if(L.some(l=>l.round===h.round&&has(l.quote,h.sentence,8)&&(!l.nar||rebutOk(l,h.round,R).ok)))continue; /* a NOT A REQUIREMENT line counts only when its rebuttal verifies */out.push({kind:'IMPOSED',id:h.id,round:h.round,side:h.side,sentence:h.sentence,phrase:h.phrase});}
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
 return {AB,GIVE,blocks,harvest,items,lines,cure,has,rebutOk,rounds,roundsOf};})();

const PAB=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})/g;
 const UN=/\b(?:unanswered|not answered|no answer|never answered|not named|never names?|did not name|does not name the verse)\b|\(\s*Commitment\s+5\s*\)|\bCommitment\s+5\b/i;
 const N=s=>String(s==null?'':s).replace(/\\+"/g,'"').replace(/[*_`]+/g,'');
 const nw=s=>N(s).toLowerCase().replace(/[‘’“”"'`]/g,'').replace(/[^a-z0-9Ͱ-Ͽἀ-῿]+/g,' ').trim().split(' ').filter(Boolean);
 const refs=t=>[...new Set([...String(t||'').matchAll(REF)].map(m=>m[1]+' '+m[2]+':'+m[3]))];
 // press rows in the rounds: <ref> "<quote>" -- MEANS: <meaning> [-- ...]
 function presses(R){const out=[];for(const [k,t0] of Object.entries(R||{})){if(!/^(?:CR|DR)\d$/.test(k))continue;const t=N(t0);
  for(const l of t.split('\n')){const m=l.match(/^\s*[-\d.)\s]*((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)? \d{1,3}:\d{1,3})(?:[-–]\d{1,3})?\s+["“][^\n]*?["”][^\n]*?--\s*MEANS:\s*(.+?)(?:\s+--\s+|$)/);if(!m)continue;
   out.push({round:k,ref:m[1],means:m[2].trim()});}}return out;}
 function parts(means){const cl=String(means||'').split(/,\s*(?:and|but)\s+|\s+(?:and|but)\s+(?=(?:does|do|did|is|are|was|were)\s+not\b|never\b|(?:states?|names?|says?|gives?)\s+no\b)|;\s*|\.\s+/).map(x=>x.trim()).filter(Boolean);const ab=cl.filter(c=>ABS.absence(c)),po=cl.filter(c=>!ABS.absence(c));return {absence:ab,positive:po.join('; ')};}
 // the judge's charges on an unanswered press: CONCEDED LINKS clauses and collision BROKEN lines
 function charges(text){const out=[];for(const l0 of N(text).split('\n')){const l=l0.trim();if(/^\[AUDIT/.test(l))continue;
   if(/^(?:DEFENDER\s+|CHALLENGER\s+)?CONCEDED LINKS\s*:/i.test(l)){for(const c of l.split(/;\s*|\.\s+(?=Premises?\s+\d)/)){if(!/\b(?:UNEXHIBITED|CONCEDED)\b/.test(c)||!UN.test(c))continue;const pm=c.match(/\bPremise\s+(\d+)/i);out.push({kind:'CONCESSION',label:(pm?'premise '+pm[1]:'concession')+(/^CHALLENGER/i.test(l)?' (challenger)':' (defender)'),line:l,clause:c.trim(),refs:refs(c)});}}
   else if(/\bLINK BROKEN\b/.test(l)&&UN.test(l)&&/\bD\d+\s+vs\.?\s+C\d+/.test(l)){const pm=l.match(/\b(D\d+)\s+vs\.?\s+(C\d+)/);out.push({kind:'BREAK',label:pm[1]+' vs '+pm[2],line:l,clause:l,refs:refs(l.split(/--\s*GROUND\s*:/)[0])});}}
  return out;}
 // raise: a charge whose named press (by reference) carries an absence clause in its MEANS
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
 // pkgL2R: a word named only as the root of another ("from *nomos*", "from the root X", "derived from G3551") is marked root:true
 const ROOTPRE=/(?:\bfrom|\broot|\bderived\s+from|\bcognate\s+(?:of|with|to)|\brelated\s+to)(?:\s+(?:the|a|an))?(?:\s+(?:root|verb|noun|word|stem|lemma|greek|hebrew|aramaic))*[\s*_"\u201c\u201d\u2018\u2019'(,:]*$/i;
 const LETTER=/[a-z\u00e0-\u024f\u1e00-\u1eff\u0370-\u03ff\u1f00-\u1fff\u0590-\u05ff\u02bc\u02bb]/i;
 function markRoots(seg,wds){const s=String(seg||'');const lo=s.toLowerCase();const R=new Set();
  const occ=w=>{const out=[];const k=String(w.w).toLowerCase();const sm=w.kind==='strongs'?k.match(/^([gh])(\d+)$/):null;
   if(sm){for(const x of s.matchAll(new RegExp('\\b'+sm[1]+'0*'+sm[2]+'\\b','gi')))out.push(x.index);return out;}
   let i=-1;while((i=lo.indexOf(k,i+1))>=0){const b=i>0?lo[i-1]:'',a=lo[i+k.length]||'';if((b&&LETTER.test(b))||(a&&LETTER.test(a)))continue;out.push(i);}return out;};
  const pos=wds.map(occ);
  // pass 0: the root phrase stands just before the word; pass 1: a word in parentheses just after a root word ("from *nomos* (G3551)")
  const rootAt=(i,pass)=>{const pre=s.slice(Math.max(0,i-60),i);if(ROOTPRE.test(pre))return true;if(!pass)return false;
   const m=pre.match(/([^\s(*_"\u201c\u201d]+)[*_"\u201d\u2019]*\s*\(\s*$/);if(!m)return false;const j=i-pre.length+pre.lastIndexOf(m[1]);
   return wds.some((w,k)=>R.has(k)&&pos[k].includes(j));};
  for(let pass=0;pass<2;pass++)wds.forEach((w,k)=>{if(R.has(k)||!pos[k].length)return;if(pos[k].every(i=>rootAt(i,pass)))R.add(k);});
  return wds.map((w,k)=>R.has(k)?{...w,root:true}:w);}
 function tags(rounds){const out=[];for(const [side,round,text] of rounds||[]){const t=String(text||'');
  for(const m of t.matchAll(/\[L2\]/g)){const i=m.index;let e=t.length;const nx=t.slice(i+4).search(/\[L[1-4]\]|\n/);if(nx>=0)e=i+4+nx;let seg=t.slice(i+4,Math.min(e,i+4+500));
   if(!seg.replace(/[*_\s:.\-]+/g,'').length){const nl=t.indexOf('\n',e+1);seg=t.slice(e,nl<0?t.length:Math.min(nl,e+500));}
   let wds=tagWords(seg);if(!wds.length){const pe=t.slice(i+4).search(/\n\s*\n|\[L[1-4]\]/);const seg2=t.slice(i+4,pe<0?Math.min(t.length,i+904):Math.min(i+4+pe,i+904));const w2=tagWords(seg2);if(w2.length){seg=seg2;wds=w2;}}
   const blk=blockAt(t,i);const own=refsIn(seg);const __ls=t.lastIndexOf('\n',i)+1,__le=(x=>x<0?t.length:x)(t.indexOf('\n',i));const __line=t.slice(__ls,__le);const __press=/--\s*MEANS\s*:/.test(t.slice(__ls,i)); /* s429 F4: a press line's [L2] is read against that line's verses */const vs=[...new Set(own.concat(__press?refsIn(__line):refsIn(blk)))];const ap=[...new Set(apocIn(seg).concat(apocIn(blk)))];
   wds=markRoots(seg,wds); /* pkgL2R */
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
   const ws=(t.words||[]).map(wd=>{const m=matchWord(wd,cands,IX);const at=m.ok?read.filter(k=>(IX.V[k]||[]).some(r=>numOf(r.strongs_number)===m.num)):[];
    return {w:wd.w,kind:wd.kind,ok:m.ok,num:m.num||null,route:m.route||null,...(wd.root?{root:true}:{}),...(at.length?{in:at.join(', ')}:{})};});
   const core=ws.some(w=>!w.root)?ws.filter(w=>!w.root):ws; /* pkgL2R: a root the tag names does not decide it */
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

// pkgECL (W3 Wall 2547, Eric 2026-11-06): the layer check on a judge's break line (E-COL, ENFORCED; Commitment 13). A FORCED line, or a LINK BROKEN
// line that does not rest on an unanswered press, gives its grounds in layers: a counted [L1] (a verse quoted with its reference under an [L1] tag,
// standing in the KJV verse as the record serves it, "Cited Verses"), and, when the ground turns on a word's meaning, a counted [L2] (the word stands
// in a verse the line cites: the [L2] tag check, L2C, on "L2 Words" and "L2 Lexicon"). The ANSWER and FAILS quotes are the answer's words, not grounds.
// A verse or word the run did not read is UNVERIFIABLE and raises nothing.
const ECL=(()=>{
 const REF=/((?:[1-3] )?[A-Z][a-z]+(?: of [A-Z][a-z]+)?) (\d{1,3}):(\d{1,3})(?:[-–](\d{1,3}))?/;
 const PAIR=new RegExp(REF.source+'[^"“”\\n\\[]{0,40}?(?:["“]([^"“”]{6,400})["”]|(?<![A-Za-z])[\'‘](?!s\\b|\\s)((?:[^\'‘’\\n]|[\'’](?=[a-z])){6,400}?)[\'’](?![a-z]))','g'); /* pkgL1Q (W3 2861/2864): a single-quoted verse quote also pairs; an in-word apostrophe neither opens nor closes it */
 const MW=/\b(?:means|meaning|meant|sense|signif(?:y|ies|ied|ying)|denot(?:e|es|ed|ing)|the word|lexic\w*|connot\w*|defin\w*|translat\w*|render(?:s|ed|ing)?|Greek|Hebrew)\b/i;
 const UNANS=/\b(?:unanswered|not answered|no answer|never answered|not named)\b|\(\s*Commitment\s+5\s*\)/i;
 const RANK={COUNTED:3,UNVERIFIABLE:2,'NOT COUNTED':1,NONE:0};
 // the judge's own grounds: the line without its ANSWER and FAILS quotes (a FORCED line's GROUND follows its FAILS quote)
 const ground=l=>String(l||'').replace(/\\+"/g,'"').replace(/--\s*ANSWER\s*\[[^\]]*\]\s*:[\s\S]*?(?=--\s*GROUND\s*:|$)/i,' ');
 function l1(g,rows){const idx={};for(const r of rows||[])if(r&&r.book)idx[r.book+' '+r.chapter+':'+r.verse]=r.text;
  const out=[];const T=[...g.matchAll(/\[L([1-4])\]/g)];
  T.forEach((m,k)=>{if(m[1]!=='1')return;const a=m.index+4,b=k+1<T.length?T[k+1].index:g.length,pa=k>0?T[k-1].index+4:0;
   const before=g.slice(Math.max(pa,m.index-600),m.index);const bs=[...before.matchAll(PAIR)];let p=bs.length?bs[bs.length-1]:null;
   if(p&&before.slice(p.index+p[0].length).replace(/[\s;,.:)]+/g,'').length)p=null; /* the form <reference> "<words>" [L1]: the quote closes just before the tag */
   if(!p){const as=[...g.slice(a,Math.min(b,a+700)).matchAll(PAIR)];p=as.length&&as[0].index<=6?as[0]:null;} /* the form [L1] <reference> "<words>" */
   if(!p){out.push({status:'NOT COUNTED',why:'an [L1] tag with no verse quoted beside its reference'});return;}
   const bk=p[1],ch=+p[2],v1=+p[3],v2=+(p[4]||p[3]),q=p[5]||p[6]; /* pkgL1Q */const ref=bk+' '+ch+':'+v1+(v2!==v1?'-'+v2:'');const parts=[];
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
// pkgUND (W3 Wall ruling after 2566; Eric 2026-11-06 "the results seem to have gotten worse"): two ENFORCED send-back items, both side-neutral.
// (1) E-UNG, missing collision grades: a defender link that a premise of the list closing [DR2] presses takes a graded "D<i> vs C<j>" line
//     (DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED, or WITHDRAWN). A "D<i>: STANDS" line alone does not grade a pressed link.
// (2) E-HOLD on an UNDERDETERMINED line the enforcer says is BROKEN: sent back ENFORCED. Cured by CHANGE TO RETRACTED, a regrade (a BROKEN
//     regrade with its counted layers, pkgECL), or CHANGE TO the UNDERDETERMINED line with a counted [L1] (the verse words both readings rest on)
//     and what the record leaves open. A KEEP does not cure it. The enforcer never overrules the judge: the judge may keep UNDERDETERMINED by
//     giving its grounds.
// pkgUNL (33149, W1's own pkgUND fault): a premise of the [DR2] list presses the link its own "LINK <n>:" label names, not the link of its
//  position (33149: premise 1 is LINK 6, premise 5 is LINK 3). A premise with no LINK label names no link and raises nothing. The open-point test
//  also reads "leaves that role disputed", "dispute its implications", "unsettled" (33149 chatgpt, two CHANGE TO lines refused on wording).
// Uses ECL (pkgECL, same library) for the [L1] count: a verse the run did not read is UNVERIFIABLE and counts as given (raises nothing).
const UND=(()=>{
 const rounds=ptext=>{const t=String(ptext||'');const re=/^===\s*\[(CR[1-4]|DR[1-4])\][^\n]*===\s*$/gm;const at=[];let m;while((m=re.exec(t)))at.push({k:m[1],s:m.index,e:m.index+m[0].length});
  const out={};at.forEach((x,i)=>{if(out[x.k]!=null)return;let end=i+1<at.length?at[i+1].s:t.length;const c=t.indexOf('\n\n[CLOSE-ROUND',x.e);if(c>=0&&c<end)end=c;const c7=t.indexOf('\n\n[LINK-ROUND FORMAT CHECK',x.e);if(c7>=0&&c7<end)end=c7;out[x.k]=t.slice(x.e,end);});return out;};
 // the premises of the list that closes [DR2] (the list against the defender); each presses the defender link its "LINK <n>:" label names (pkgUNL)
 function pressed(ptext){const t=rounds(ptext).DR2||'';let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  const by=new Map();its.forEach((x,k)=>{const m=x.match(/^\s*\**\s*(?:(\d+)[.)]\s*\**\s*)?LINK\s+(\d+|none)\s*\**\s*:/i);if(!m||/none/i.test(m[2]))return;const n=+m[2],p=m[1]?+m[1]:k+1;
   const e=by.get(n)||{n,premises:[],head:x.replace(/\s+/g,' ').trim().slice(0,160)};e.premises.push(p);by.set(n,e);});
  return [...by.values()].sort((a,b)=>a.n-b.n).map(e=>({n:e.n,premises:e.premises,head:e.head}));}
 const GR=/^[\s>*_-]*D(\d+)\s+vs\.?\s+C(\d+)\b[^\n]{0,200}?:\s*\**\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)/gmi;
 const WD=/^[\s>*_-]*D(\d+)\s*:\s*\**\s*WITHDRAWN\b/gmi;
 function graded(text){const g=new Map();const T=String(text||'');for(const m of T.matchAll(GR))g.set(+m[1],(g.get(+m[1])||[]).concat(m[3].toUpperCase()));for(const m of T.matchAll(WD))g.set(+m[1],['WITHDRAWN']);return g;}
 const ownLine=(text,n)=>{const l=String(text||'').split('\n').find(x=>new RegExp('^[\\s>*_-]*D'+n+'\\s*:').test(x));return l?l.trim():'';};
 // the pressed defender links this judge left without a graded collision line
 function missing(ptext,text){const P=pressed(ptext);if(!P.length)return [];const g=graded(text);return P.filter(p=>!g.has(p.n)).map(p=>({n:p.n,ps:p.premises.join(', '),premise:p.head,line:ownLine(text,p.n)}));}
 const OPEN=/\b(?:leaves?\s+(?:\w+\s+){0,3}(?:open|disputed|undecided|unsettled|unresolved|contested|in\s+dispute)|leaves?\s+(?:\w+\s+){1,4}to\s+(?:the\s+)?other|disputed?|disputes|in\s+dispute|unsettled|unresolved|contested|left\s+open|open\s+(?:question|point|whether)|(?:does|do|did)\s+not\s+(?:decide|settle|determine|say|state|show|fix)|neither\s+(?:reading|side|one)|both\s+readings|either\s+reading|consistent\s+with\s+both|agrees?\s+with\s+both|fits?\s+both|undecided|silent\s+(?:on|about|as\s+to)|not\s+stated)\b/i;
 // an UNDERDETERMINED line that gives its grounds: a counted [L1] and what the record leaves open
 function undOk(line,ctx){const L=String(line||'').replace(/\\+"/g,'"');const f=[];
  const c=ECL.check('FORCED: X -- GROUND: '+L,ctx);if(c.l1==='NONE')f.push('no [L1]: no verse is quoted with its reference under an [L1] tag');else if(c.l1==='NOT COUNTED')f.push('no counted [L1] (the quoted words do not stand in the verse named)');
  if(!OPEN.test(L))f.push('the line does not state what the record leaves open (for example: "the record leaves open whether ...", "both readings agree with ...")');
  return {ok:!f.length,l1:c.l1,faults:f,why:f.length?f.join(' | '):'[L1] '+c.l1+'; states what the record leaves open'};}
 const isUndBroken=x=>x&&x.rule==='E-HOLD'&&/UNDERDETERMINED/.test(String(x.flagged_line||x.line||''))&&/\(right:\s*BROKEN\)/i.test(String(x.cure_reason||x.reason||''));
 const CURE_UNG=n=>'MISSING COLLISION GRADE (E-UNG, ENFORCED, pkgUND): the challenger presses D'+n+' in the list that closes [DR2], and your COLLISION POINTS has no graded D'+n+' vs C<j> line. A "D'+n+': STANDS" line does not grade a pressed link. CHANGE TO the graded line: D'+n+' vs C<j> (<verse>): DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED -- <one clause of why> -- GROUND: <a BROKEN grade in its layers (Commitment 13); an UNDERDETERMINED grade with [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open>. Any grade may be chosen; the grade is yours. A KEEP does not cure this item.';
 const CURE_UND='UNDERDETERMINED GIVES ITS GROUNDS (E-HOLD on UNDERDETERMINED, ENFORCED, pkgUND): the enforcer reads this line as BROKEN; the decision stays yours. Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13, or a STANDS line that quotes the answer\'s positive fit, [CR<n>] "<the answer\'s words>", with [L1] <reference> "<KJV words>"), or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line with, after GROUND:, [L1] <reference> "<the KJV words both readings rest on>" and what the record leaves open (for example: "the record leaves open whether ..."). A KEEP does not cure this item.';
 const FIT=/\[(?:CR|DR)[1-4]\][^"“\n]{0,60}["“][^"”]{6,}["”]|\bANSWER\b[^"“\n]{0,40}["“][^"”]{6,}["”]/;
 const GRADED1=n=>new RegExp('\\bD'+n+'\\s+vs\\.?\\s+C\\d+\\b[^\\n]{0,200}?:\\s*\\**\\s*(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|WITHDRAWN AFTER)','i');
 // the cure of one item from the judge's send-back answer a = {ans:'KEEP'|'CHANGE'|'NO ANSWER', to}
 function cure(it,a,ctx){const res=(c,why)=>({status:c?'CURED':'UNCURED',why});a=a||{ans:'NO ANSWER'};const to=String(a.to||'').replace(/\\+"/g,'"').trim();
  if(a.ans!=='CHANGE')return res(false,(a.ans==='KEEP'?'a KEEP does not cure this item':'no answer')+' (pkgUND)');
  if(/^\s*RETRACTED\b/i.test(to))return res(it.rule!=='E-UNG','CHANGE TO RETRACTED'+(it.rule==='E-UNG'?' does not grade a pressed link':''));
  if(it.rule==='E-UNG'){const n=+(String(it.item||'').match(/\bD(\d+)\b/)||[])[1];const m=to.match(GRADED1(n));if(!m)return res(false,'the CHANGE TO has no graded D'+n+' vs C<j> line');
   const gr=m[1].toUpperCase();if(/BROKEN/.test(gr)){const c=ECL.check(to,ctx);return res(!c.faults.length,'graded '+gr+(c.faults.length?'; the layer check fails: '+c.why:'; '+c.why));}
   if(gr==='UNDERDETERMINED'){const u=undOk(to,ctx);return res(u.ok,'graded UNDERDETERMINED; '+u.why);}return res(true,'graded '+gr);}
  // E-HOLD on an UNDERDETERMINED line
  if(/\bUNDERDETERMINED\b/.test(to)){const u=undOk(to,ctx);return res(u.ok,'kept UNDERDETERMINED; '+u.why);}
  if(/\bLINK BROKEN\b/.test(to)||/^\s*FORCED\b/i.test(to)){const c=ECL.check(to,ctx);return res(!c.faults.length,'regraded BROKEN; '+c.why);}
  if(/\b(?:STANDS|MEETS)\b/.test(to)){const c=ECL.check('FORCED: X -- GROUND: '+to,ctx);const fit=FIT.test(to); /* W3: a STANDS or MEETS regrade quotes the answer's positive fit with a counted [L1] */
   const f=[];if(c.l1==='NONE')f.push('no [L1]');else if(c.l1==='NOT COUNTED')f.push('no counted [L1]');if(!fit)f.push('no quote of the answer\'s fit (the answer\'s own words with its round, e.g. [CR3] "<words>")');
   return res(!f.length,'regraded '+(/\bMEETS\b/.test(to)?'MEETS':'STANDS')+(f.length?'; '+f.join(' | '):'; [L1] '+c.l1+', quotes the answer\'s fit'));}
  return res(false,'the CHANGE TO neither regrades the line, retracts it, nor keeps UNDERDETERMINED with its grounds');}
 return {rounds,pressed,graded,missing,undOk,isUndBroken,cure,CURE_UNG,CURE_UND};})();


// WALL-2024 package B (operator 2026-11-05: the agreement shown back before every decision; B1 amended to the walker form, W3 2121).
// The seat's own acceptance reply is read from the head exchange of its own conversation (the assistant turn after "POSTURE FOR
// ACCEPTANCE" or "POSTURE RETURNED") and shown back at the END of the final user message. The system message and the head exchange,
// the cached prefix, are not touched. A body with no accepted exchange is left as it is.
const __AGR_TXT=c=>typeof c==='string'?c:Array.isArray(c)?c.map(p=>p&&typeof p.text==='string'?p.text:'').join(''):'';
function __agrTail(msgs){if(!Array.isArray(msgs))return '';let acc=null;
 for(let i=0;i+1<msgs.length;i++){const m=msgs[i],r=msgs[i+1];if(!m||!r)continue;const ut=m.role==='user'?__AGR_TXT(m.content!==undefined?m.content:m.parts):'';
  if(/^POSTURE (FOR ACCEPTANCE|RETURNED)/.test(ut)&&(r.role==='assistant'||r.role==='model'))acc=__AGR_TXT(r.content!==undefined?r.content:r.parts);}
 if(!acc||!acc.trim())return '';
 return '\n\nTHE AGREEMENT YOU ACCEPTED, shown back before this decision. Your own words when you accepted the posture:\n'+acc.trim().split('\n').map(l=>'> '+l).join('\n')
  +'\nEach contested grade you write (BROKEN, FORCED, MISSES, VOID, UNPROVEN) names the commitment it applies, as "(Commitment N)".\nThe reply form given above is unchanged; answer in it.';}
const __AGR_SB=(items)=>{const seen=new WeakSet();const walk=(o,d)=>{if(!o||typeof o!=='object'||d>7||seen.has(o))return;seen.add(o);
 if(Array.isArray(o.messages)&&typeof o.model==='string'){const m=o.messages;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'){const c=m[i].content;if(typeof c==='string'){if(!c.includes('THE AGREEMENT YOU ACCEPTED, shown back'))m[i].content=c+tail;}else if(Array.isArray(c)){if(!c.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))c.push({type:'text',text:tail});}break;}}}}
 else if(Array.isArray(o.contents)&&o.systemInstruction){const m=o.contents;const tail=__agrTail(m);if(tail){for(let i=m.length-1;i>=0;i--){if(m[i]&&m[i].role==='user'&&Array.isArray(m[i].parts)){if(!m[i].parts.some(p=>String(p&&p.text||'').includes('THE AGREEMENT YOU ACCEPTED, shown back')))m[i].parts.push({text:tail});break;}}}}
 for(const k of Object.keys(o))walk(o[k],d+1);};(items||[]).forEach(it=>walk(it&&it.json,0));return items;};
// ruling 428, the send-back half (journal 2078: the record half was built in s428a and s429; this half was approved and not built). Every line
// an enforcer DISAGREES with (E-ANS, E-VOID, E-COL of ruling 428 and the later enforcer rules; never a withdrawal row, K-W, ruling 445) goes back once to the panel
// judge that wrote it, in that judge's own conversation, with the enforcer's quoted reason. The judge keeps the decision: KEEP or CHANGE, with
// one sentence quoting the debate words that decide it. Both are recorded (Send Back Record). Transport limit, not a rule: at most 60 items per
// judge; an item past that is recorded NOT SENT, never dropped silently. A judge whose call family is not openrouter is recorded NOT SENT.
const PASS=$input.first().json; // Judge Enforcer Record's output, passed on unchanged
let PB=null;try{PB=$('Alt Seated').first().json;}catch(e){PB=null;}
let PCC=null;try{PCC=$('Alt Seated').first().json;}catch(e){PCC=null;}
let E421=[];try{if($('Alt Seated').isExecuted)E421=$('Alt Seated').first().json.enf421_rows||[];}catch(e){E421=[];}
const E428=PASS.enf428_rows||[];
const skip=(why,ns)=>[{json:{...__trm(PASS),sb_skip:true,sb_why:why,sb_not_sent:ns||[]}}];
const dis=[].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate'&&x.rule!=='K-W'&&x.rule!=='K-CON' /* package A/B: K-CON is TRIAL and not sent back (W1, W3, 2026-11-05);  ruling 445: "withdrawals will not be included in send-backs" */&&/^ENFORCER (?:DISAGREE|NO ANSWER)\b/.test(String(x.cure_reason||'')) /* s432: a NO ANSWER row is a reported violation too */);
/* pkgEB7: an E-B7 disagreement carries its premise, verses and MEANS from the Build, for the note and the cure */
try{const __b7I={};for(const __it of $('Alt Judge Enforcer Build').all())for(const __x of ((__it.json&&__it.json.ids)||[]))if(__x&&__x.rule==='E-B7'&&__x.b7)__b7I[__x.seat+'|'+__x.item]=__x.b7;for(const __x of dis)if(__x&&__x.rule==='E-B7')__x.b7=__b7I[__x.seat+'|'+__x.item]||{refs:[],means:[]};}catch(e){}
/* pkgECL (W3 2547): the layer check on every E-COL line, ENFORCED: a fault is sent back even when the enforcer agreed */
try{const __ctx=ECL.ctxLive();const __seen=new Set();for(const __it of $('Alt Judge Enforcer Build').all())for(const __x of ((__it.json&&__it.json.ids)||[])){if(!__x||__x.rule!=='E-COL')continue;const __k=__x.seat+'|'+__x.flagged_line;if(__seen.has(__k))continue;__seen.add(__k);
 const __c=ECL.check(__x.flagged_line,__ctx);if(!__c.faults.length)continue;const __d=dis.find(y=>y.rule==='E-COL'&&y.seat===__x.seat&&String(y.flagged_line||'')===String(__x.flagged_line||''));
 if(__d){__d.ecl={...__c,ds:true};__d.cure_reason=String(__d.cure_reason||'')+' | LAYER CHECK (pkgECL, Commitment 13): '+__c.why;}
 else dis.push({seat:__x.seat,seat_role:'alternate',rule:'E-COL',item:__x.item,flagged_line:__x.flagged_line,response_line:__x.response_line,cure_reason:'ENFORCER DISAGREE: LAYER CHECK (pkgECL, Commitment 13): '+__c.why,ecl:{...__c,ds:false}});}}catch(e){}
/* pkgUND (E-UNG, E-HOLD on UNDERDETERMINED; ENFORCED) */
try{for(const __x of dis)if(UND.isUndBroken(__x)){__x.und={kind:'E-HOLD-UND'};__x.cure_reason=String(__x.cure_reason||'')+' | '+UND.CURE_UND;}
 const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;
  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;
  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n');
  const __t=__tx(__p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');
  for(const __m of UND.missing(__pt,__t))dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-UNG',item:'COLLISION D'+__m.n+' (pressed: [DR2] premise '+__m.ps+')',flagged_line:__m.line||('(no COLLISION POINTS line for D'+__m.n+')'),response_line:__m.line||'',cure_reason:'ENFORCER DISAGREE: '+UND.CURE_UNG(__m.n)+' THE PREMISE: '+__m.premise,und:{kind:'E-UNG',n:__m.n}});}}catch(e){}
/* pkgABS (W3 ruling; Commitment 3, ruling 421): a MEETS, STANDS or UNDERDETERMINED grade resting on an absence, ENFORCED: sent back even when the enforcer agreed */
try{const __ctx=ECL.ctxLive();const __seen=new Set();for(const __it of $('Alt Judge Enforcer Build').all())for(const __x of ((__it.json&&__it.json.ids)||[])){if(!__x||(__x.rule!=='E-ANS'&&__x.rule!=='E-HOLD'))continue;const __k=__x.rule+'|'+__x.seat+'|'+__x.flagged_line;if(__seen.has(__k))continue;__seen.add(__k);
 const __c=ABS.check(__x,__ctx);if(!__c.raise)continue;const __d=dis.find(y=>y.rule===__x.rule&&y.seat===__x.seat&&String(y.flagged_line||'')===String(__x.flagged_line||''));
 if(__d){__d.abs={...__c,ds:true};__d.cure_reason=String(__d.cure_reason||'')+' | ABSENCE CHECK (pkgABS): '+__c.why;}
 else dis.push({seat:__x.seat,seat_role:'alternate',rule:__x.rule,item:__x.item,flagged_line:__x.flagged_line,response_line:__x.response_line,cure_reason:'ENFORCER DISAGREE: ABSENCE CHECK (pkgABS): '+__c.why,abs:{...__c,ds:false}});}}catch(e){}
/* pkgUNA (W3): every UNDERDETERMINED collision line read for its grounds, ENFORCED, without waiting for an E-HOLD item */
try{const __ctx=ECL.ctxLive();const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');const __nl=s=>String(s||'').replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();
 const __UD=/^[\s>*_-]*(D\d+)\s+vs\.?\s+(C\d+)\b[^\n]{0,200}?:\s*\**\s*UNDERDETERMINED\b/i;
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;
  for(const __l of __tx(__p.verdict_raw).split('\n')){if(/^\s*\[AUDIT\b/.test(__l))continue;const __m=__l.match(__UD);if(!__m)continue;const __u=UND.undOk(__l,__ctx);if(__u.ok)continue;const __ab=ABS.absence(__l);
   const __why='UNDERDETERMINED WITHOUT ITS GROUNDS (E-HOLD on UNDERDETERMINED, ENFORCED, pkgUNA): '+__u.why+(__ab?' | it rests on an absence: "'+__ab+'"':'');
   const __d=dis.find(y=>y.seat===__p.judge_seat&&y.rule==='E-HOLD'&&__nl(y.flagged_line)===__nl(__l));
   if(__d){if(!__d.und){__d.und={kind:'E-HOLD-UNA'};__d.cure_reason=String(__d.cure_reason||'')+' | '+__why;}continue;}
   dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-HOLD',item:'COLLISION '+__m[1]+' vs '+__m[2]+' (UNDERDETERMINED; pkgUNA)',flagged_line:__l.trim(),response_line:__l.trim(),cure_reason:'ENFORCER DISAGREE: '+__why,und:{kind:'E-HOLD-UNA'}});}}}catch(e){}
/* pkgMNP (W3): an ANSWER CHECK that says its press has no MEANS, read against the press ledger, ENFORCED */
try{const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;
  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;
  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n');
  const __t=__tx(__p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');const __seen=new Set();
  for(const __c of MNP.check(__t,UND.rounds(__pt))){if(__seen.has(__c.line))continue;__seen.add(__c.line);dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-MNP',item:'ANSWER CHECK '+__c.ref+' ['+__c.round+'] (MEANS NONE)',flagged_line:__c.line,response_line:__c.line,cure_reason:'ENFORCER DISAGREE: MEANS AGAINST THE LEDGER (pkgMNP): '+__c.why,mnp:{key:__c.key,ref:__c.ref,round:__c.round,premise:__c.premise,ledger_means:__c.ledger_means,ledger_cls:__c.ledger_cls}});}}}catch(e){}
/* pkgPAB (W3 ruling; Commitment 3 with Commitment 5): a break or concession charging a press as unanswered whose MEANS rests on an absence, ENFORCED */
try{const __seats=new Set([].concat(E421,E428).filter(x=>x&&x.seat_role==='alternate').map(x=>x.seat));const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__seats.has(__p.judge_seat))continue;
  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;
  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n');
  const __t=__tx(__p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');
  for(const __c of PAB.check(__t,UND.rounds(__pt)))dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-PAB',item:__c.kind+' '+__c.label+' on '+__c.ref,flagged_line:__c.clause,response_line:__c.line,cure_reason:'ENFORCER DISAGREE: PRESS ABSENCE (pkgPAB): '+__c.why,pab:{kind:__c.kind,label:__c.label,ref:__c.ref,round:__c.round,means:__c.means,absence:__c.absence,positive:__c.positive}});}}catch(e){}
/* pkgKSC (W3 B6, Wall 2665; Commitment 15): a keystone graded STANDS on a premise the same verdict counts UNEXHIBITED, CONCEDED or WITHDRAWN: one E-KSC item per seat, ENFORCED */
try{const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__p.judge_seat)continue;
  const __t=__tx(__p.verdict_raw).split('\n').filter(l=>!/^\s*\[(?:AUDIT|EXTRACTOR)\b/.test(l)).join('\n');
  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;const __pt=__j&&__j.body&&Array.isArray(__j.body.messages)?__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n'):'';
  const __dr2=__pt?(UND.rounds(__pt).DR2||''):''; /* W3 2671: a Premise p of CONCEDED LINKS is read through the [DR2] list's LINK labels */
  for(const __k of KSC.items(__t,__dr2))dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-KSC',item:'KEYSTONE D'+__k.n+' on LINK '+__k.n+' '+__k.tag,flagged_line:__k.keystone_line,response_line:__k.conceded_line,cure_reason:'ENFORCER DISAGREE: KEYSTONE CONSISTENCY (pkgKSC, Commitment 15'+(KSC.LIVE?'':'; TRIAL')+'): KEYSTONE D'+__k.n+' STANDS while the same verdict\'s CONCEDED LINKS counts '+__k.via+' '+__k.tag+': "'+String(__k.conceded_line).slice(0,300)+'"',ksc:__k});}}catch(e){}
/* pkgIMP (Eric 17:08 CST; W3 2627; Commitment 14): every debater sentence that imposes a requirement on scripture, one E-IMP item per judge, ENFORCED */
try{const __tx=r=>String(r||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
 for(const __b of ((PCC&&PCC.bodies)||[])){let __p;try{__p=(typeof __b==='string'?JSON.parse(__b):__b).payload||{};}catch(e){continue;}if(!__p.judge_seat)continue;
  const __j=PB&&Array.isArray(PB.judges)?PB.judges.find(q=>q.seat===__p.judge_seat):null;if(!__j||!__j.body||!Array.isArray(__j.body.messages))continue;
  const __pt=__j.body.messages.map(m=>typeof m.content==='string'?m.content:(Array.isArray(m.content)?m.content.map(c=>c&&c.text||'').join('\n'):'')).join('\n');
  const __t=__tx(__p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n');
  const __R=UND.rounds(__pt);for(const __c of IMP.items(__t,IMP.harvest(__R),__R)){if(__c.kind==='IMPOSED')dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-IMP',item:'IMPOSED '+__c.id+' ['+__c.round+'] ('+__c.side+': "'+__c.phrase+'")',flagged_line:'['+__c.round+'] "'+__c.sentence+'"',response_line:'',cure_reason:'ENFORCER DISAGREE: IMPOSED REQUIREMENT (pkgIMP, Commitment 14): the '+__c.side.toLowerCase()+' rests an answer on a verse not stating something ("'+__c.phrase+'"), and your reasoning holds no IMPOSED line for it',imp:{kind:'IMPOSED',id:__c.id,round:__c.round,side:__c.side,sentence:__c.sentence,phrase:__c.phrase}});
   else dis.push({seat:__p.judge_seat,seat_role:'alternate',rule:'E-IMP',item:'CONTRADICTION '+__c.id,flagged_line:__c.line,response_line:__c.line,cure_reason:'ENFORCER DISAGREE: IMPOSED REQUIREMENT CONTRADICTION (pkgIMP, Commitment 14): this ANSWER CHECK is graded MEETS on an answer your own line flags NO ROW SETS IT: '+__c.imposed,imp:{kind:'CONTRADICTION',id:__c.id,round:__c.round,ref:__c.ref,imposed:__c.imposed}});}}}catch(e){}
if(!dis.length)return skip('no enforcer reported a violation in a panel judge line');
if(!PB||!Array.isArray(PB.judges))return skip('the panel judges\' requests could not be read',dis.map(x=>({seat:x.seat,rule:x.rule,item:x.item,why:'panel requests not read'})));
const textOf=raw=>String(raw||'').replace(/\\n/g,'\n').replace(/\\"/g,'"');
const said={};for(const s of ((PCC&&PCC.bodies)||[])){try{const p=(typeof s==='string'?JSON.parse(s):s).payload||{};said[p.judge_seat]=textOf(p.verdict_raw).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();}catch(e){}}
const why=x=>String(x.cure_reason||'').replace(/^ENFORCER (?:DISAGREE|NO ANSWER)\s*:?\s*/,'').replace(/\s*\((?:judge cure [A-Z]+; )?(?:RECORD-ONLY )?TRIAL[^)]*\)\s*$/,'').trim();
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+' [...]':s;};
const MAX=60;const bySeat=new Map();for(const x of dis){if(!bySeat.has(x.seat))bySeat.set(x.seat,[]);bySeat.get(x.seat).push(x);}
const out=[];const not_sent=[];
for(const [seat,list] of bySeat){const j=PB.judges.find(q=>q.seat===seat);
 if(!j||!j.body||!Array.isArray(j.body.messages)){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'no panel request for this seat'}));continue;}
 if(j.fam!=='openrouter'){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'call family '+j.fam+' has no send-back route'}));continue;}
 if(!said[seat]){list.forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'the judge\'s own judgment text could not be read'}));continue;}
 const items=list.slice(0,MAX).map((x,k)=>({sid:'S'+(k+1),rule:x.rule,item:x.item||'',line:x.flagged_line||x.response_line||'',reason:why(x),ecl:x.ecl||null,und:x.und||null,abs:x.abs||null,pab:x.pab||null,mnp:x.mnp||null,imp:x.imp||null,ksc:x.ksc||null,b7:x.b7||null,src:x}));
 /* pkgEPK (W1 2758; W3 2759; TRIAL) */{let PT9='';try{PT9=gatePromptText2024(j.body);}catch(e){}let R9={};try{R9=PT9?ciRounds(PT9):{};}catch(e){}
  const NW9=s=>String(s==null?'':s).toLowerCase().replace(/[\u2018\u2019]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/'(?![a-z])|(?<![a-z])'/g,' ').replace(/\s+/g,' ').trim(); /* a quote mark is not part of a word: 'of' = "of" */
  const own9=' '+NW9(said[seat])+' ',rec9=' '+NW9(PT9)+' ',oth9=Object.keys(said).filter(s=>s!==seat).map(s=>' '+NW9(said[s])+' ');
  for(const i of items){const rs=String(i.reason||'');
   if(i.rule==='E-PREM'&&/\(right:\s*COUNTED/i.test(rs)){const m=String(i.item||'').match(/against the (challenger|defender)\s+(\d+)/i);if(m){const sd=m[1].toUpperCase();let k=[];try{const blk=lbBlockText(R9[sd==='CHALLENGER'?'DR3':'CR3'],+m[2]);k=blk?lbFoot(blk,true):[];}catch(e){k=[];}if(k.length>=2&&!unxLack(rs,k).missing.length)i.epk={side:sd,premise:+m[2],kinds:k};}}
   const tk=rs.split(/(\s+)/);const ix=[];tk.forEach((t,q)=>{if(/\S/.test(t)&&NW9(t))ix.push(q);});const cutq=new Set();
   const keep9=new Set();for(let a=0;a+6<=ix.length;a++){const ph=' '+ix.slice(a,a+6).map(q=>NW9(tk[q])).join(' ')+' ';if(own9.includes(ph)||rec9.includes(ph))ix.slice(a,a+6).forEach(q=>keep9.add(q));} /* words of the record or of this judge's own text are never cut */
   for(let a=0;a+6<=ix.length;a++){const ph=' '+ix.slice(a,a+6).map(q=>NW9(tk[q])).join(' ')+' ';if(oth9.some(o=>o.includes(ph))&&!own9.includes(ph)&&!rec9.includes(ph))ix.slice(a,a+6).forEach(q=>{if(!keep9.has(q))cutq.add(q);});}
   {let run=[];const flush=()=>{if(run.length<3)run.forEach(q=>cutq.delete(q));run=[];};ix.forEach(q=>{if(cutq.has(q))run.push(q);else flush();});flush();} /* a cut is 3 words or more; shorter leftovers next to record words stay */
   if(cutq.size){const parts=[];const spans=[];let cur=null;tk.forEach((t,q)=>{if(cutq.has(q)){if(!cur){cur=[];parts.push(null);}cur.push(t);}else if(cur&&!/\S/.test(t)&&cutq.has(q+1)){cur.push(t);}else{if(cur){spans.push(cur.join(''));cur=null;}parts.push(t);}});if(cur)spans.push(cur.join(''));
    i.reason_full=rs;i.xcut=spans;i.reason=parts.map(p=>p===null?"[words from another judge's line cut: record words only (pkgEPK)]":p).join('');}}}

 list.slice(MAX).forEach(x=>not_sent.push({seat,rule:x.rule,item:x.item,why:'over the '+MAX+'-item transport limit'}));
 // pkgCM (c) (W3 2394; run 33040 chatgpt S19, S20): an E-HOLD item that proposes BROKEN states the gate's rule for a BROKEN grade, so the
 // send-back never asks for a grade the gate then charges. Record-only as before.
 const hold421=i=>{if(i.rule!=='E-HOLD'||!/\(right:\s*BROKEN\)/i.test(String((i.src&&i.src.cure_reason)||i.reason||'')))return '';const pm=String(i.item||'').match(/\b(D\d+\s+vs\.?\s+C\d+)\b/i);const pr=pm?pm[1].replace(/\s+vs\.?\s+/i,' vs '):'D<i> vs C<j>';
  return '\nTHE RULE FOR A BROKEN GRADE (the gate checks it, K-G4): if the answering side answered the witness, the link can break only by meaning, and that break counts only with a FORCED line for the pair (ruling 421): FORCED: '+pr+' -- MEANS [<round>]: "<the pressing sentence, quoted>" -- ANSWER [<round>]: "<the answer, quoted>" -- FAILS: "<the words that cannot agree, quoted>". If the witness was left unanswered, the BROKEN line must quote the pressing sentence and name its round (ruling 392). A CHANGE TO here replaces only this line and cannot add the FORCED line.';};
 const __undR=i=>!i.und?'':'\nTHE COLLISION RULE (pkgUND, ENFORCED): '+(i.rule==='E-UNG'?UND.CURE_UNG(i.und.n):i.und.kind==='E-HOLD-UNA'?UND.CURE_UND.replace('the enforcer reads this line as BROKEN; the decision stays yours.','an UNDERDETERMINED line gives its grounds: a counted [L1] and what the record leaves open; this line does not. The decision stays yours.').replace('pkgUND)','pkgUND, pkgUNA)'):UND.CURE_UND);
const __kscR=i=>!i.ksc?'':'\n'+KSC.note(i.ksc); /* pkgKSC */
const __b7R=i=>!i.b7?'':'\nTHE SELF-CONTRADICTION RULE (E-B7, ENFORCED, pkgEB7; ruling 421): your '+(i.b7.side==='CHALLENGER'?'CHALLENGER ':'')+'CONCEDED LINKS line counts premise '+i.b7.n+' UNEXHIBITED on '+(i.b7.verses||'')+', and your own ANSWER CHECK on '+(i.b7.verses||'that verse')+' for the '+String(i.b7.side||'').toLowerCase()+'\'s answer reads MEETS. The enforcer reads them as the same ground; both cannot stand. CHANGE TO your '+(i.b7.side==='CHALLENGER'?'CHALLENGER ':'')+'CONCEDED LINKS line without premise '+i.b7.n+' counted UNEXHIBITED, or CHANGE TO that ANSWER CHECK line graded MISSES. To keep both, KEEP with a sentence that quotes the premise (at least 6 words in a row of: "'+String(i.b7.entry||'').slice(0,300)+'") and the press (at least 6 words in a row of its MEANS, or all of it if shorter) and says how the two grounds differ.'; /* pkgEB7 */

const __impR=i=>!i.imp?'':(i.imp.kind==='CONTRADICTION'?'\nTHE IMPOSED REQUIREMENT RULE (E-IMP, ENFORCED, pkgIMP; Commitment 14): you grade MEETS an answer your own IMPOSED line flags NO ROW SETS IT. A requirement no row sets is not an answer. CHANGE TO this ANSWER CHECK graded MISSES or FAILS, or CHANGE TO the IMPOSED line SET BY [L1] <reference> "<the KJV words that set it>". A KEEP does not cure this item.':'\nTHE IMPOSED REQUIREMENT RULE (E-IMP, ENFORCED, pkgIMP; Commitment 14): the sentence above rests an answer on a verse not stating something ("'+i.imp.phrase+'"). That asks the verse to hold a requirement; it is an answer only when a row of scripture sets that requirement. CHANGE TO one line: IMPOSED: ['+i.imp.round+'] "<the sentence, quoted>" -- asks <verse> to <what it is asked to state> -- NO ROW SETS IT, or SET BY [L1] <reference> "<the KJV words that set it>". The KJV words are counted. A KEEP does not cure this item.');
const __mnpR=i=>!i.mnp?'':'\nTHE MEANS RULE (E-MNP, ENFORCED, pkgMNP): your ANSWER CHECK says this press has no MEANS. The press ledger reads its MEANS in ['+(i.mnp.round[0]==='C'?'DR2':'CR3')+'] (premise '+i.mnp.premise+'): "'+i.mnp.ledger_means+'". The ledger marks the press '+i.mnp.ledger_cls+'. CHANGE TO the ANSWER CHECK line for '+i.mnp.ref+' with that MEANS quoted (at least 6 words in a row of it, or all of it if shorter) and the answer graded MEETS or MISSES'+(i.mnp.ledger_cls==='UNPROVEN'?' (or UNPROVEN, as the ledger marks it)':'')+'. A KEEP does not cure this item.';
const __pabR=i=>!i.pab?'':'\nTHE PRESS ABSENCE RULE (E-PAB, ENFORCED, pkgPAB; Commitment 3 with Commitment 5): your line charges the press '+i.pab.ref+' ['+i.pab.round+'] as unanswered. A press proves only what its quoted words show; its MEANS reads "'+i.pab.means+'", and the part "'+i.pab.absence.join('; ')+'" is an absence (what a verse does not state), which presses nothing. '+(i.pab.positive?'To keep the line, KEEP it with a sentence that quotes the positive part of that MEANS the charge rests on (at least 6 words in a row of "'+i.pab.positive+'", or all of it if shorter) and says why that part was left unanswered. ':'This MEANS has no positive part, so a KEEP cannot cure it. ')+'Otherwise CHANGE TO: RETRACTED, or CHANGE TO the line regraded so it no longer charges '+i.pab.ref+' as unanswered.';
const __absR=i=>!i.abs?'':'\nTHE ABSENCE CHECK ('+i.rule+', ENFORCED, pkgABS; Commitment 3, ruling 421): '+i.abs.why+'. An answer meets a press, and a link stands, by a positive fit: the KJV words that show it, quoted with the reference under an [L1] tag ([L1] <reference> "<the KJV words>"). That a verse does not deny, does not name or leaves room for a reading is not a fit, and two readings both retained is not a fit. To keep the grade, CHANGE TO the line with the positive fit quoted under [L1]. Otherwise CHANGE TO the line regraded'+(i.rule==='E-ANS'?' MISSES':' (a BROKEN or FORCED grade gives its layers, Commitment 13)')+'. A KEEP does not cure this item.';
const __eclR=i=>!i.ecl?'':'\nTHE LAYER CHECK (E-COL, ENFORCED, pkgECL; Commitment 13): '+i.ecl.why+'. A break line gives its grounds after GROUND: in layers: [L1] <reference> "<the KJV words the answer cannot agree with>" (counted when the words stand in that verse); [L2] <word> (<Strong\'s number>, <gloss>) when the break turns on a word\'s meaning (counted when the word stands in a verse the line cites); [L3] <reference> "<KJV words>" for any cross-reference relied on. To keep the break, CHANGE TO the line with its counted layers. Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded. A KEEP does not cure this item.';
const __ecfR=i=>i.rule!=='E-COL'?'':'\nTHE RULE (E-COL, ENFORCED, pkgECF): a collision line breaks a link by meaning only when the answer\'s own words cannot agree with the meaning pressed; a rival reading of a contested word, footed by the answer\'s own layers, is not a break. To keep the line, KEEP it with a sentence that quotes both sides of the conflict: at least 6 words in a row of the answering side\'s own words (its FAILS words may be these), and at least 6 words in a row of the verse those words cannot agree with, as a round quotes it (pkgECF2, W3 2540). For a line resting on an unanswered press, say it was left unanswered and quote the pressing sentence, at least 6 words in a row (ruling 392). Otherwise CHANGE TO: RETRACTED: <pair>, or the pair regraded (UNDERDETERMINED or STANDS). An item left without either counts against your seat.';
 const msg='An enforcer has read some of your lines against the debate record and reports a violation in each. Its reasons are quoted below. You keep the decision. For each item, KEEP your line or CHANGE it, and give one sentence that quotes the debate\'s own words that decide it. Bring nothing from outside the record.\n\n'
  +items.map(i=>'ITEM '+i.sid+' ('+i.rule+(i.item?', '+cut(i.item,200):'')+'):\nYOUR LINE: '+cut(i.line,1500)+'\nTHE ENFORCER: '+cut(i.reason,900)+hold421(i)+__ecfR(i)+__eclR(i)+__undR(i)+__absR(i)+__pabR(i)+__mnpR(i)+__impR(i)+__kscR(i)+__b7R(i)+(i.epk?'\nTHE COUNT RULE (K-UNX, TRIAL, pkgEPK): A count of UNEXHIBITED must name the layer the block lacks (K-UNX). A failure of fit is graded at the collision (a FORCED line, ruling 411), not counted. You keep the decision.':'')).join('\n\n')
  +'\n\nThis reply is not a judgment and is not JSON: write plain lines only.\nReply with exactly one line per item, and nothing else, in this form (the fields are separated by two vertical bars):\nSENDBACK: <item id> || KEEP || <one sentence quoting the words that decide it>\nSENDBACK: <item id> || CHANGE TO: <your corrected line> || <one sentence quoting the words that decide it>';
 // xAI (operator, option A): for an x-ai/ seat, the judge's reply exactly as Grok wrote it, so the conversation is only appended to and the
// wrapper can hand its reasoning back; chosen only when it reads, as said[] is read, to the same text. Otherwise said[seat] as before.
let asst=said[seat];if(/^x-ai\//.test(String(j.api_model||j.body.model||''))){const XN=['Alternate Call openrouter','Alternate Cure Call openrouter','Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter','Panel Reserve openrouter','Panel Cure Call 1 openrouter','Panel Cure Call 2 openrouter','Panel Cure Call 3 openrouter'];const rd=t=>textOf(t).split('\n').filter(l=>!/^\s*\[AUDIT\b/.test(l)).join('\n').trim();for(const xn of XN){let xa=[];try{if(!__L[xn]().isExecuted)continue;xa=__L[xn]().all();}catch(xe){continue;}for(const xi of xa){const xj=(xi&&xi.json)||{};const xc=xj.choices&&xj.choices[0]&&xj.choices[0].message&&xj.choices[0].message.content;if(/^x-ai\//.test(String(xj.model||''))&&typeof xc==='string'&&rd(xc)===said[seat])asst=xc;}}}
const body={...j.body,messages:[...j.body.messages,{role:'assistant',content:asst},{role:'user',content:msg+__agrTail(j.body.messages)}]};
 out.push({json:{sb_skip:false,seat,api_model:j.api_model,run_token:PB.run_token||null,items:items.map(i=>({sid:i.sid,rule:i.rule,item:i.item,line:i.line,reason:i.reason,ecl:i.ecl||null,und:i.und||null,abs:i.abs||null,pab:i.pab||null,mnp:i.mnp||null,imp:i.imp||null,ksc:i.ksc||null,b7:i.b7||null,epk:i.epk||null,reason_full:i.reason_full||null,xcut:i.xcut||null})),msg,body}});}
if(!out.length)return skip('no disagreement could be sent',not_sent);
out[0].json.sb_not_sent=not_sent;return out;
