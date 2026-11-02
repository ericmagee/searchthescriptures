// judge_fix5 G13 (operator, on "is a link-round block with only one valid layer UNEXHIBITED or SUPPORTED?": "what makes any other round count?";
// the burden rule: a load-bearing [L4] counts only when it exhibits at least two prior layers and the chain from them; fewer floats and carries
// zero weight): K-LB, rule B's test applied to the link-round blocks. Each LINK block of [DR3] (the challenger's answer to premise j of the
// defender's list) and of [CR3] before its own list (the defender's answer to premise j of the challenger's [DR2] list) that is not CONCEDED is
// read for the layer kinds it exhibits. A block with fewer than two kinds is UNEXHIBITED. K-LB marks it when the judge's count does not count
// that premise (by counted_premises when the panel field is valid; else only at a count of 0, as K-G6). Cure: count it (CORRECTED COUNT and
// STANDING), or a STATEMENT for the item that quotes words of the block and itself exhibits two layer kinds from it.
// judge_fix6 H1 (run 32293: all ten K-LB marks were false, and GLM was removed on two of them): the block's kinds are read by drvLayers, the one
// layer reader rule B's K-B and the cure checks use (a plain-letter source word with its meaning counts anywhere in an [L2] tag's text); a
// premise the seat ruled VOID is never marked (a VOID premise enters no count, whatever its block shows: ChatGPT's six and Sol's 4 and 6 in
// 32293); K-LB is a TRIAL rule (ENF_STATUS), so an uncured K-LB item never removes a seat.
const lbKinds=block=>drvLayers(block);
function lbBlocks(t,stopRe){let s=String(t||'');if(stopRe){const c=s.search(stopRe);if(c>=0)s=s.slice(0,c);}const H=[...s.matchAll(/^[ \t>*#_-]*LINK\s+(\d+)[^\n]*/gmi)];
 return H.map((h,i)=>({j:i+1,n:+h[1],head:h[0].replace(/^[ \t>*#_-]+/,'').replace(/[*_]+/g,'').trim(),text:s.slice(h.index,i+1<H.length?H[i+1].index:s.length)}));}
// The premises a seat rules VOID for one side, read from that side's count section (CONCEDED LINKS or CHALLENGER CONCEDED LINKS and the lines
// under it) and its standing line (DEFENSE STANDING or CHALLENGE STANDING): "Premise 4 is VOID", "Premises 1 and 5 are VOID"; with no number,
// "each", "all", "every", "both" or "the six charges" beside VOID rules every premise VOID. "not VOID" and "no premise is VOID" rule nothing.
function lbVoid(text,side){const T=String(text||'').replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const out=new Set();let all=false;
 const st=(T.match(new RegExp('^[ \\t>#-]*'+(side==='DEFENDER'?'DEFENSE':'CHALLENGE')+' STANDING[^\\n]*','mi'))||[''])[0];
 const sec=(ciCountSection(T,side)||'')+'\n'+st;
 for(const s of sec.split(/(?<=[.;])\s+|\n/)){if(!/\bVOID\b/.test(s))continue;if(/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b|\bnone\s+(?:is|are|of\s+them\s+(?:is|are))\s+VOID\b/i.test(s))continue;
  const ns=[...s.matchAll(/\bPremises?\s+(\d+(?:\s*(?:,|and|&|or)\s*\d+)*)/gi)].flatMap(m=>m[1].match(/\d+/g).map(Number));
  if(ns.length)ns.forEach(n=>out.add(n));else if(/\b(?:each|all|every|both|the\s+(?:six|five|four|three|two|\d+)\s+(?:charges|premises|links))\b/i.test(s))all=true;}
 return {all,set:out,has:j=>all||out.has(j)};}
function drvBlocks(text,ptext,dConc,cConc,dStand,cStand,CPV,LN){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};const R=ciRounds(ptext);
 const S={CHALLENGER:lbBlocks(R.DR3),DEFENDER:lbBlocks(R.CR3,/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i)};
 for(const side of ['DEFENDER','CHALLENGER']){const sc=side==='DEFENDER'?dConc:cConc;if(typeof sc!=='number')continue;const cp=drvCPA(CPV&&CPV[side],LN&&LN[side]);if(!cp.present&&sc!==0)continue;const VD=lbVoid(text,side);
  for(const b of S[side]){if(/:\s*\**\s*CONCEDED\b/i.test(b.head)||/^LINK\s+\d+[^:\n]*:\s*\**\s*CONCEDED\b/i.test(b.head))continue;const k=lbKinds(b.text);if(k.length>=2)continue;
   if(cp.present&&cp.set.has(b.j))continue;if(VD.has(b.j))continue;const id=side+' premise '+b.j;
   items.push({rule:'K-LB',side,link:id,premise:b.j,line:'['+(side==='CHALLENGER'?'DR3':'CR3')+'] '+b.head.slice(0,160)+' -- exhibits '+(k.length?k.join(' and '):'no layer kind')+'; fewer than two prior layers',kinds:k,conc:cp.present?cp.set.size:sc,st:side==='DEFENDER'?dStand:cStand,L:(LN&&LN[side])||null});
   marks.push('[AUDIT v26: DEBATE RULE VIOLATION (K-LB) -- '+id+': the link-round block ('+(side==='CHALLENGER'?'DR3':'CR3')+' LINK '+b.n+') exhibits '+(k.length?k.join(' and '):'no layer kind')+', fewer than two prior layers (the burden rule), and '+(side==='DEFENDER'?'CONCEDED LINKS':'CHALLENGER CONCEDED LINKS')+' does not count it as UNEXHIBITED or rule it VOID. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}}
 return {items,marks};}
