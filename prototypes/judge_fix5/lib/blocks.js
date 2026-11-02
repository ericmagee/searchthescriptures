// judge_fix5 G13 (operator, on "is a link-round block with only one valid layer UNEXHIBITED or SUPPORTED?": "what makes any other round count?";
// the burden rule: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them; fewer floats and carries
// zero weight): K-LB, rule B's test applied to the link-round blocks. Each LINK block of [DR3] (the challenger's answer to premise j of the
// defender's list) and of [CR3] before its own list (the defender's answer to premise j of the challenger's [DR2] list) that is not CONCEDED is
// read for the layer kinds it exhibits, each tag read up to the next tag or blank line: [L1] with KJV words in quotation marks; [L2] with the
// source word (its script, transliteration marks, a Strong's number, or plain letters with the English meaning beside it); [L3] with a
// cross-reference named by book, chapter and verse. A block with fewer than two kinds is UNEXHIBITED. K-LB marks it when the judge's count does
// not count that premise (by counted_premises when the panel field is valid; else only at a count of 0, as K-G6). Cure: count it (CORRECTED COUNT
// and STANDING), or a STATEMENT for the item that quotes words of the block and itself exhibits two layer kinds from it.
function lbKinds(block){const t=String(block||'').replace(/\*\*/g,'').replace(/__/g,'');const met=new Set();const re=/\[L([1-3])\](?:\s*(?:\/|and|,)?\s*\[L([1-3])\])*/g;let m;const at=[];
 while((m=re.exec(t)))at.push({i:m.index,e:m.index+m[0].length,ts:[...m[0].matchAll(/L([1-3])/g)].map(x=>x[1])});
 at.forEach((x,k)=>{const before=t.slice(Math.max(0,x.i-30),x.i);if(/\b(?:no|without|lacks?|lacking|not)\s+$/i.test(before))return;
  let end=k+1<at.length?at[k+1].i:t.length;const bl=t.slice(x.e,end).search(/\n\s*\n/);if(bl>=0)end=x.e+bl;const rest=t.slice(x.e,end);const pre=t.slice(Math.max(0,x.i-60),x.i);
  for(const ty of x.ts){if(ty==='1'&&/["“][^"”\n]{4,}["”]/.test(rest))met.add('L1');
   if(ty==='2'&&(DRV_SRC.test(rest)||drvTranslit(rest.replace(/^[\s:*_]+/,''),pre)))met.add('L2');
   if(ty==='3'&&(DRV_REF.test(rest)||DRV_REF_END.test(pre)))met.add('L3');}});
 return [...met].sort();}
function lbBlocks(t,stopRe){let s=String(t||'');if(stopRe){const c=s.search(stopRe);if(c>=0)s=s.slice(0,c);}const H=[...s.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];
 return H.map((h,i)=>({j:i+1,n:+h[1],head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim(),text:s.slice(h.index,i+1<H.length?H[i+1].index:s.length)}));}
function drvBlocks(text,ptext,dConc,cConc,dStand,cStand,CPV,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);
 const S={CHALLENGER:lbBlocks(R.DR3),DEFENDER:lbBlocks(R.CR3,/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i)};
 for(const side of ['DEFENDER','CHALLENGER']){const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;const cp=drvCPA(CPV&&CPV[side],LN&&LN[side]);if(!cp.present&&sc!==0)continue;
  for(const b of S[side]){if(/:\s*\**\s*CONCEDED\b/i.test(b.head)||/^LINK\s+\d+[^:\n]*:\s*\**\s*CONCEDED\b/i.test(b.head))continue;const k=lbKinds(b.text);if(k.length>=2)continue;
   if(cp.present&&cp.set.has(b.j))continue;const id=side+' premise '+b.j;
   items.push({rule:'K-LB',side,link:id,premise:b.j,line:'['+(side==='CHALLENGER'?'DR3':'CR3')+'] '+b.head.slice(0,160)+' -- exhibits '+(k.length?k.join(' and '):'no layer kind')+'; fewer than two prior layers',kinds:k,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||null});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-LB) -- '+id+': the link-round block ('+(side==='CHALLENGER'?'DR3':'CR3')+' LINK '+b.n+') exhibits '+(k.length?k.join(' and '):'no layer kind')+', fewer than two prior layers (the burden rule), and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it as UNEXHIBITED. REVIEW THIS ROW.]');}}
 return {items,marks};}
