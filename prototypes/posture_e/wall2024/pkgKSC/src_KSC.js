/* pkgKSC (W3 queue B6, builder feedback 4; W3 design ruling Wall 2665, grade 2671): KEYSTONE CONSISTENCY, side-neutral. The keystone is the
   defender's last declared link, Dn. A verdict may not grade "KEYSTONE: Dn -- STANDS" while its own CONCEDED LINKS line counts that link
   UNEXHIBITED, CONCEDED or WITHDRAWN (33175 single judge: LINK 6 "Mary is of the house of David" UNEXHIBITED, keystone D6 STANDS).
   W3 2671 (1): a "LINK n" the judge writes is Dn; a "Premise p" (or a bare "p") is the p-th entry of the [DR2] UNSUPPORTED-L4 PREMISES list
   and presses the link its own "LINK <n>:" label names, as pkgUNL reads it (33149: premise 6 was LINK 4). A premise with no label maps to no
   link and raises nothing. W3 2671 (2): TRIAL for one run (LIVE=false): the item is sent back and answered, and an uncured one is recorded
   (AUDIT v48), not counted in drv_uncured; it removes no seat. LIVE after a run with zero false items. Panel and alternate seats: one E-KSC
   send-back item; it cures either way, by a KEYSTONE line for Dn not graded STANDS, or a CONCEDED LINKS line that no longer counts that link.
   The single judge: a review line, record-only (it has no send-back). Commitment 15. */
const KSC=(()=>{const LIVE=false;const clean=l=>String(l==null?'':l).replace(/\\+"/g,'"').replace(/[*_`]+/g,'').trim().replace(/^(?:[-•>]\s*|\d+[.)]\s+)/,'');
 const KS=/^KEYSTONE\s*:\s*D(\d+)\s*(?:--|—|–|-|:)\s*(STANDS|BROKEN|WITHDRAWN)\b/i;const CL=/^CONCEDED LINKS\s*:(.*)$/i;
 // "LINK 6: UNEXHIBITED" (a link), "Premise 6 CONCEDED" or "-- 4 UNEXHIBITED; 6 CONCEDED" (a premise of the [DR2] list, 33129 chatgpt)
 const TAG=/(?:\b(LINK|PREMISE)\s*|(?:--|;|,)\s*)(\d+)\s*(?::|--|—|–|-|\()?\s*(UNEXHIBITED|CONCEDED|WITHDRAWN)\b/gi;
 // the [DR2] list: premise p -> the link its "LINK <n>:" label names (pkgUNL's reading: the last UNSUPPORTED-L4 PREMISES heading of [DR2])
 function premiseMap(dr2){const t=String(dr2||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return null;
  const its=t.slice(i).split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
  const M={};its.forEach((x,k)=>{const m=x.match(/^\s*\**\s*(?:(\d+)[.)]\s*\**\s*)?LINK\s+(\d+|none)\s*\**\s*:/i);if(!m||/none/i.test(m[2]))return;const p=m[1]?+m[1]:k+1;if(!(p in M))M[p]=+m[2];});return M;}
 const keystone=t=>{let k=null;for(const raw of String(t||'').split('\n')){const m=clean(raw).match(KS);if(m)k={n:+m[1],state:m[2].toUpperCase(),line:raw.trim()};}return k;}; // the last plain KEYSTONE line
 const entries=l=>{const m=clean(l).match(CL);if(!m)return null;return [...m[1].matchAll(TAG)].map(x=>({kind:/^LINK$/i.test(x[1]||'')?'LINK':'PREMISE',num:+x[2],tag:x[3].toUpperCase()}));};
 const conceded=t=>{let c=null;for(const raw of String(t||'').split('\n')){if(/^\s*\[/.test(raw))continue;const e=entries(raw);if(e)c={e,line:raw.trim()};}return c;}; // the last defender CONCEDED LINKS line
 // the entry of a CONCEDED LINKS line that counts link n, read through the [DR2] map (pm); null when none
 const counts=(e,n,pm)=>{for(const x of e||[]){const lk=x.kind==='LINK'?x.num:(pm&&pm[x.num]!=null?pm[x.num]:null);if(lk===n)return {...x,link:lk,via:x.kind==='LINK'?'LINK '+x.num:'Premise '+x.num+' = LINK '+lk+' ([DR2] list)'};}return null;};
 // the items of one judge text (the reasoning, unescaped once; AUDIT and EXTRACTOR lines are not read); dr2: the challenger's round 2
 function items(t,dr2){const k=keystone(t);if(!k||k.state!=='STANDS')return [];const c=conceded(t);if(!c)return [];const pm=premiseMap(dr2);const h=counts(c.e,k.n,pm);if(!h)return [];
  return [{n:k.n,tag:h.tag,via:h.via,pmap:pm||{},keystone_line:k.line,conceded_line:c.line}];}
 function cure(it,a){const p=it.ksc||{};const R=(ok,w)=>({status:ok?'CURED':'UNCURED',why:w+' (pkgKSC, Commitment 15'+(LIVE?'':'; TRIAL')+')'});
  if(!a||a.ans==='NO ANSWER')return R(false,'no answer to the send-back');if(a.ans!=='CHANGE')return R(false,'a KEEP does not cure a keystone that stands on a link the same verdict counts '+p.tag);
  const to=String(a.to==null?'':a.to);const k=clean(to).match(KS);
  if(k){if(+k[1]!==p.n)return R(false,'the KEYSTONE line names D'+k[1]+'; the keystone is D'+p.n);return k[2].toUpperCase()==='STANDS'?R(false,'the KEYSTONE line still grades D'+p.n+' STANDS while '+p.via+' is counted '+p.tag):R(true,'CHANGE TO the KEYSTONE line: D'+p.n+' '+k[2].toUpperCase());}
  const e=entries(to);if(e){const h=counts(e,p.n,p.pmap);return h?R(false,'the CONCEDED LINKS line still counts '+h.via+' '+h.tag):R(true,'CHANGE TO a CONCEDED LINKS line that no longer counts LINK '+p.n);}
  return R(false,'the CHANGE TO is neither a KEYSTONE line for D'+p.n+' nor a CONCEDED LINKS line');}
 const note=it=>'THE KEYSTONE CONSISTENCY RULE (E-KSC, '+(LIVE?'ENFORCED':'TRIAL: answer it; it removes no seat')+', pkgKSC; Commitment 15): your KEYSTONE line grades D'+it.n+' STANDS, and your CONCEDED LINKS line counts '+it.via+' '+it.tag+'. D'+it.n+' is the keystone, the last declared link; it cannot stand on a link your own verdict counts '+it.tag+'. CHANGE TO one line, as your reading of the record gives: a KEYSTONE line for D'+it.n+' graded WITHDRAWN or BROKEN, with its ground; or your CONCEDED LINKS line no longer counting LINK '+it.n+', with your reason. A KEEP does not cure this item.';
 return {LIVE,items,cure,note,keystone,conceded,entries,premiseMap,counts};})();
