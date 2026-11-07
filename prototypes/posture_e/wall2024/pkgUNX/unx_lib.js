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
// MEANS ground (W3 2683 condition 2): a count that says the answer does not meet the press's MEANS is a fit ground, not a layer ground, and is not read
// when (a) the segment states that ground (meet/answer ... MEANS, meaning, significance, inference, claim, press), (b) it points at one press of that premise
// from the other side's UNSUPPORTED-L4 PREMISES list: it quotes the MEANS (8 consecutive words, all of it when shorter, the pkgOAN test), shares 4 consecutive
// words with it, or names its verse, and (c) the answering block does not quote that MEANS on any line (the pkgOAN test).
const UNX_MW=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const UNX_MRUN=(a0,b0,k0)=>{const a=' '+UNX_MW(a0)+' ',b=UNX_MW(b0);if(!b)return false;if(a.includes(' '+b+' '))return true;const bw=b.split(' ');const k=Math.min(k0,bw.length);for(let i=0;i+k<=bw.length;i++)if(a.includes(' '+bw.slice(i,i+k).join(' ')+' '))return true;return false;};
const UNX_MGROUND=/\b(?:meet|meets|meeting|met|answer|answers|answering|answered)\b[^.;]{0,80}?\b(?:MEANS|meaning|significance|inference|claim|claimed|press|pressed)\b/i;
function unxPresses(r){const t=String(r||'');let i=-1;for(const m of t.matchAll(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi))i=m.index;if(i<0)return [];
 const its=t.slice(i).split(/\n(?=\s*\**\s*\d+[.)]\s)/).filter(x=>/^\s*\**\s*\d+[.)]\s/.test(x));const out=[];
 for(const x of its){const n=+x.match(/^\s*\**\s*(\d+)/)[1];const pw=x.search(/PRESSED WITH\s*:/i);if(pw<0)continue;
  for(const l of x.slice(pw).split('\n').slice(1)){const m=l.match(/^\s*[-*•]?\s*\**\s*([1-3]?\s*[A-Z][A-Za-z ]+?\s+\d+:\d+(?:[-–]\d+)?)\**\s*[\s\S]*?\s--\s*MEANS\s*:\s*([\s\S]+?)(?:\s+--\s+(?=\[L\d\]|PROVEN\b)|\s+\|\s+|$)/);
   if(!m)continue;const means=m[2].replace(/^["“]|["”]$/g,'').trim();if(UNX_MW(means).split(' ').length<3)continue;out.push({n,ref:m[1].replace(/\s+/g,' ').trim(),means});}}
 return out;}
function unxMeansGround(seg,blk,P){if(!UNX_MGROUND.test(seg))return false;const sg=String(seg).replace(/\s+/g,' ');
 return P.some(p=>{const ref=p.ref.replace(/\s+/g,'\\s+').replace(/\./g,'\\.');const hit=UNX_MRUN(sg,p.means,8)||UNX_MRUN(sg,p.means,4)||new RegExp('\\b'+ref+'\\b(?!\\s*[-–]?\\d)').test(sg);
  return hit&&!String(blk).split('\n').some(l=>UNX_MRUN(l,p.means,8));});}
function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};let R;try{R=ciRounds(ptext);}catch(e){return {items,marks};}
 for(const side of ['DEFENDER','CHALLENGER']){const rk=side==='CHALLENGER'?'DR3':'CR3';const sec=ciCountSection(text,side);if(!sec||typeof R[rk]!=='string')continue;
  const n0=+((sec.match(/:\s*(\d+)/)||[])[1]||0);const lab=side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS';
  const SG=unxSegs(sec);const PR=unxPresses(side==='CHALLENGER'?R.CR3:R.DR3);const segsOf=j=>SG.filter(s=>s.ns.includes(j)); /* every segment of the count section that names premise j */
  for(const s of SG){if(!/\bUNEXHIBITED\b/.test(s.seg)||/\b(?:not|never|no\s+longer)\s+UNEXHIBITED\b/i.test(s.seg))continue;
   for(const j of s.ns){const all=segsOf(j);if(all.some(z=>UNX_OTHER.test(z.seg)))continue;const blk=lbBlockText(R[rk],j);if(!blk)continue;const k=lbFoot(blk,true);if(k.length<2)continue;if(all.some(z=>unxMeansGround(z.seg,blk,PR.filter(p=>p.n===j))))continue;if(all.some(z=>unxNamed(z.seg,k).missing.length))continue;
    const id=side+' premise '+j;if(items.some(x=>x.link===id))continue;const why='counted UNEXHIBITED in '+lab+', but its ['+rk+'] block exhibits '+k.join(' and ')+' and the count names no layer the block lacks';
    items.push({rule:'K-UNX',side,link:id,premise:j,kinds:k,conc:n0,why,line:id+': '+why+'. Name the missing layer in a STATEMENT for this item ("[L1]", "[L2]", "[L3]" or "[L4]", one the block does not exhibit), or write a CORRECTED COUNT for '+lab+' without this premise and grade its fit at the collision (a FORCED line, ruling 411). Your count: '+s.seg.replace(/\s+/g,' ').trim().slice(0,400)});
    marks.push('[AUDIT v49: DEBATE RULE VIOLATION (K-UNX) -- '+id+': '+why+'. TRIAL rule: answer it in the cure; it removes no seat; not counted in audit_flags.]');}}}
 return {items,marks};}
