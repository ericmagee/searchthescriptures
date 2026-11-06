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
