// pkgUNX (W3 2676, 2677): K-UNX. A premise a seat counts UNEXHIBITED (in CONCEDED LINKS or CHALLENGER CONCEDED LINKS) whose answering link-round
// block exhibits two or more layer kinds (FOOTING LAYERS, lbFoot, the reader K-LB uses) must have its count name the missing layer ([L1], [L2],
// [L3] or [L4], one the block does not exhibit), or be restated as a fit ruling (taken out of the count and graded at its collision, ruling 411).
// A count that rests on a ground that is not a layer (an unanswered or unnamed witness, answers not counted, a struck or barred answer, VOID, a narrowed link, an ASSUMES premise) is not read.
// Side-neutral; TRIAL for one run. The mirror of K-LB (a block with fewer than two kinds that is not counted).
const UNX_TAG=/\[?\bL([1-4])\b\]?/g;
const UNX_OTHER=/\bunanswered\b|\bno\s+answer\b|\bnot\s+answered\b|\bwithout\s+(?:\S+\s+){0,2}?answers?\b|\b(?:not|never)\s+named\b|\bNOT\s+COUNTED\b|\bnarrowed\b|\bleaves?\s+[^.;]{0,80}?\bunmet\b|\bstruck\b|\bbarred\b|\bVOID\b|\bROWS\s+GIVE\b|\bASSUMES\b|\bno\s+(?:quoted\s+)?row\s+gives\b/i;
function unxSegs(sec){const H=[...String(sec||'').matchAll(/\bPremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi)];
 return H.map((h,i)=>({ns:h[1].match(/\d+/g).map(Number),seg:sec.slice(h.index,i+1<H.length?H[i+1].index:sec.length)}));}
function unxNamed(s,kinds){const t=String(s||'').replace(/["“][^"”]*["”]/g,' ');const have=new Set((kinds||[]).map(k=>(String(k).match(/[1-4]/)||[''])[0]));
 const named=[...t.matchAll(UNX_TAG)].map(m=>m[1]);return {named,missing:named.filter(n=>n==='4'||!have.has(n))};}
function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};let R;try{R=ciRounds(ptext);}catch(e){return {items,marks};}
 for(const side of ['DEFENDER','CHALLENGER']){const rk=side==='CHALLENGER'?'DR3':'CR3';const sec=ciCountSection(text,side);if(!sec||typeof R[rk]!=='string')continue;
  const n0=+((sec.match(/:\s*(\d+)/)||[])[1]||0);const lab=side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';
  const SG=unxSegs(sec);const segsOf=j=>SG.filter(s=>s.ns.includes(j)); /* every segment of the count section that names premise j */
  for(const s of SG){if(!/\bUNEXHIBITED\b/.test(s.seg)||/\b(?:not|never|no\s+longer)\s+UNEXHIBITED\b/i.test(s.seg))continue;
   for(const j of s.ns){const all=segsOf(j);if(all.some(z=>UNX_OTHER.test(z.seg)))continue;const blk=lbBlockText(R[rk],j);if(!blk)continue;const k=lbFoot(blk,true);if(k.length<2)continue;if(all.some(z=>unxNamed(z.seg,k).missing.length))continue;
    const id=side+' premise '+j;if(items.some(x=>x.link===id))continue;const why='counted UNEXHIBITED in '+lab+', but its ['+rk+'] block exhibits '+k.join(' and ')+' and the count names no layer the block lacks';
    items.push({rule:'K-UNX',side,link:id,premise:j,kinds:k,conc:n0,why,line:id+': '+why+'. Name the missing layer in a STATEMENT for this item ("[L1]", "[L2]", "[L3]" or "[L4]", one the block does not exhibit), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). Your count: '+s.seg.replace(/\s+/g,' ').trim().slice(0,400)});
    marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}}
 return {items,marks};}
