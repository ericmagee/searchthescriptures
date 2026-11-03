// judge_fix8 R6 (run 32306, Worker_E A6, Worker_G1 #4: GLM rested its collision lines and its reasoning line on the retired single-verse ground
// in forms the patterns missed: "no witness's own words state union before the taking", "state no father for this child", "none states that
// the coming-upon ... was not the means", "no exhibited witness states in its own words"; and the K-S2 marks on D1 vs C1 and D6 vs C1 were
// never sent to cure). K-S2 (TRIAL) reads every GROUND clause of a collision line (not only the last) and the reasoning line (the first line),
// quotations and the side's own reported words masked as the K-C net masks them, for the K-C forms, the K-S forms and these: "no (exhibited)
// witness('s own words) state(s)", "none states that", "state(s) no ...", "in its own words". A line K-C already marks is left to K-C. Each hit is
// an item sent to the cure as K-C items are (a RESTATED line that drops the ground, or a retraction); TRIAL: it removes no seat.
const KS2_FORMS=[/\bno\s+(?:\S+\s+){0,2}?witness(?:['’]s|es)?\s+(?:own\s+words\s+)?(?:\S+\s+){0,3}?(?:states?|says?|names?)\b/i,/\bnone\s+(?:of\s+(?:\S+\s+){1,2})?states?\s+that\b/i,
 /\bstates?\s+no\s+(?!round\b|later\b|answer\b)[a-z]+/i,/\bin\s+(?:its|their|his|her)\s+own\s+words\b/i];
function ks2Grounds(line){const t=String(line||'').replace(/[*_`]+/g,'');const gs=[...t.matchAll(/\bGROUND\s*:/gi)];if(!gs.length)return [drvGround(line,null)];
 return gs.map((g,k)=>t.slice(g.index+g[0].length,k+1<gs.length?gs[k+1].index:t.length)).map(s=>s.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"));}
function ks2Hit(text){for(const g of (Array.isArray(text)?text:[text]))for(const c0 of String(g).split(/;|(?<=[.!?])\s+(?=[A-Z\[])|\s--\s|\s—\s/)){const cl=netMask(c0);
  const hit=KS2_FORMS.concat(NET_STATE,[DRV_STATE]).find(rx=>rx.test(cl));if(!hit)continue;const at=cl.search(hit);if(NET_REPORT.test(cl.slice(0,at))||NET_CONC.test(cl.slice(0,at)))continue;return cl.trim();}
 return null;}
// the cure test of a RESTATED line: true when any of its GROUND clauses keeps a K-S2 form
function ks2Keeps(text){return !!ks2Hit(ks2Grounds(text));}
function ks2Lines(text,done){const items=[],marks=[];const T=netUnwrap(text).replace(/[*_`]+/g,'');let first=true;const D=done||new Set();
 for(const raw of T.split('\n')){const line=raw.trim();if(!line)continue;const u=line.toUpperCase();let item=null;
  const mc=u.match(/^(?:[-•]|\d+[.)])?\s*(D\d+)\s+VS\.?\s+(C\d+)\b/);if(mc)item=mc[1]+' vs '+mc[2];else if(first&&line[0]!=='['&&line[0]!=='{')item='REASONING';first=false;
  if(!item||D.has(item.toUpperCase()))continue;if(item!=='REASONING'&&!/\b(?:UNDERDETERMINED|STANDS)\b/.test(u))continue; /* a BROKEN line is K-B's and K-G4's */
  const h=ks2Hit(item==='REASONING'?[netMask(line.replace(NET_QUOTE,'"[quote]"').replace(NET_QUOTE1,"'[quote]'"))]:ks2Grounds(line));if(!h)continue;D.add(item.toUpperCase());
  const at=line.search(/GROUND\s*:/i);const side=netSide(h,h.length);
  items.push({rule:'K-S2',side,link:item,line});
  marks.push('[AUDIT v27: DEBATE RULE VIOLATION (K-S2) -- '+item+' rests on the retired single-verse ground ("'+h.replace(/[\[\]"]/g,'').slice(0,160)+'"): that a verse or witness does not state the point in its own words is never a ground (DG-61); the chains are weighed as wholes. TRIAL rule: answer it in the cure; it removes no seat. REVIEW THIS ROW.]');}
 return {items,marks};}
