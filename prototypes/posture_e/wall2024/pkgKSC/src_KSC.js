/* pkgKSC (W3 queue B6, builder feedback 4; W3 design ruling Wall 2665): KEYSTONE CONSISTENCY, side-neutral. The keystone is the defender's last
   declared link, Dn. A verdict may not grade "KEYSTONE: Dn -- STANDS" while its own CONCEDED LINKS line counts LINK n UNEXHIBITED, CONCEDED
   or WITHDRAWN (33175 and 33055 single judge: LINK 6 "Mary is of the house of David" UNEXHIBITED, keystone D6 STANDS). Panel and alternate
   seats: one E-KSC send-back item, ENFORCED; it cures either way, by a KEYSTONE line for Dn not graded STANDS, or a CONCEDED LINKS line that
   no longer counts LINK n. The single judge: a review line, record-only (it has no send-back). Commitment 15. */
const KSC=(()=>{const clean=l=>String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]\s*|\d+[.)]\s+)/,'');
 const KS=/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b/i;const CL=/^CONCEDED LINKS\s*:(.*)$/i;
 const TAG=/(?:\b(?:LINK|PREMISE)\s*|(?:--|;|,)\s*)(\d+)\s*(?::|--|—|–|-|\()?\s*(UNEXHIBITED|CONCEDED|WITHDRAWN)\b/gi; // \"LINK 6: UNEXHIBITED\", \"Premise 6 CONCEDED\", \"-- 4 UNEXHIBITED; 6 CONCEDED\" (33129 chatgpt)
 const keystone=t=>{let k=null;for(const raw of String(t||'').split('\n')){const m=clean(raw).match(KS);if(m)k={n:+m[1],state:m[2].toUpperCase(),line:raw.trim()};}return k;}; // the last plain KEYSTONE line
 const counted=l=>{const m=clean(l).match(CL);if(!m)return null;const g={};for(const x of m[1].matchAll(TAG))if(!(+x[1] in g))g[+x[1]]=x[2].toUpperCase();return g;};
 const conceded=t=>{let c=null;for(const raw of String(t||'').split('\n')){if(/^\s*\[/.test(raw))continue;const g=counted(raw);if(g)c={g,line:raw.trim()};}return c;}; // the last defender CONCEDED LINKS line
 // the items of one judge text (the reasoning, unescaped once; AUDIT and EXTRACTOR lines are not read)
 function items(t){const k=keystone(t);if(!k||k.state!=='STANDS')return [];const c=conceded(t);if(!c||!c.g[k.n])return [];
  return [{n:k.n,tag:c.g[k.n],keystone_line:k.line,conceded_line:c.line}];}
 function cure(it,a){const p=it.ksc||{};const R=(ok,w)=>({status:ok?'CURED':'UNCURED',why:w+' (pkgKSC, Commitment 15)'});
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a keystone that stands on a premise the same verdict counts '+p.tag);
  const to=String(a.to==null?'':a.to);const k=clean(to).match(KS);
  if(k){if(+k[1]!==p.n)return R(false,'the KEYSTONE line names D'+k[1]+'; the keystone is D'+p.n);return k[2].toUpperCase()==='STANDS'?R(false,'the KEYSTONE line still grades D'+p.n+' STANDS while LINK '+p.n+' is counted '+p.tag):R(true,'CHANGE TO the KEYSTONE line: D'+p.n+' '+k[2].toUpperCase());}
  const g=counted(to);if(g)return g[p.n]?R(false,'the CONCEDED LINKS line still counts LINK '+p.n+' '+g[p.n]):R(true,'CHANGE TO a CONCEDED LINKS line that no longer counts LINK '+p.n);
  return R(false,'the CHANGE TO is neither a KEYSTONE line for D'+p.n+' nor a CONCEDED LINKS line');}
 const note=it=>'THE KEYSTONE CONSISTENCY RULE (E-KSC, ENFORCED, pkgKSC; Commitment 15): your KEYSTONE line grades D'+it.n+' STANDS, and your CONCEDED LINKS line counts LINK '+it.n+' '+it.tag+'. D'+it.n+' is the keystone, the last declared link; it cannot stand on a premise your own verdict counts '+it.tag+'. CHANGE TO one line, as your reading of the record gives: a KEYSTONE line for D'+it.n+' graded WITHDRAWN or BROKEN, with its ground; or your CONCEDED LINKS line no longer counting LINK '+it.n+', with your reason. A KEEP does not cure this item; left uncured, it is recorded against your seat.';
 return {items,cure,note,keystone,conceded,counted};})();
