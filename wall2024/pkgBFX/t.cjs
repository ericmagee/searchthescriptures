function unxSegs(sec){const s=String(sec||'');const H=[];
 for(const h of s.matchAll(/\bPremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi))H.push({i:h.index,ns:h[1].match(/\d+/g).map(Number)});
 for(const h of s.matchAll(/(?:^|--|;|:|\.)\s*(\d)(?=\s+(?:UNEXHIBITED|CONCEDED|WITHDRAWN)\b)/g)){const i=h.index+h[0].length-1;if(!H.some(x=>x.i<=i&&i<x.i+12))H.push({i,ns:[+h[1]]});}
 for(const h of s.matchAll(/\bSpared\b/g))H.push({i:h.index,ns:[]});
 H.sort((a,b)=>a.i-b.i);return H.map((h,k)=>({ns:h.ns,seg:s.slice(h.i,k+1<H.length?H[k+1].i:s.length)})).filter(x=>x.ns.length);}
const BFX=/footing\s+borrowed\s+from\s+contested\s+Links?\b/i;
const cases=[
['defender cured S8 (38163), item 6',"CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED ([L4] footing borrowed from contested Links 1 to 3); STEP: “Links 1 to 3 give the Holy Ghost as the source (Matthew 1:20), and the rows name Mary as the one conceiving and bearing” -- ASSUMES: the contested conclusions of Links 1 to 3 establish the route -- ROWS GIVE: “of the fruit of his loins, according to the flesh” (Acts 2:30).",6],
['challenger original (37835), item 3',"CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED ([L4] footing borrowed from contested Link 1) -- STEP: “The husband is the father by Link 1's chain” -- ASSUMES: the conclusion of the challenger's contested Link 1 -- ROWS GIVE: “Joseph her husband” (Matthew 1:19).",3],
['challenger recount (38204), item 3',"CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED ([L4] footing borrowed from contested Link 1); Premises 1, 4, 5 and 6 spared; Premise 2 VOID.",3],
['plain ASSUMES, other premise (control)',"CONCEDED LINKS: 2 -- Premise 6: UNEXHIBITED ([L4] footing borrowed from contested Links 1 to 3). Premise 5: UNEXHIBITED (assumed house descent) -- STEP: x -- ASSUMES: Mary is of David's house -- ROWS GIVE: y.",5],
['plain ASSUMES alone (control)',"CONCEDED LINKS: 1 -- Premise 8: UNEXHIBITED (assumed house descent) -- STEP: x -- ASSUMES: Mary is of David's house -- ROWS GIVE: y.",8]];
for(const [n,l,j] of cases){const all=unxSegs(l).filter(s=>s.ns.includes(j));console.log(n,'| segs',all.length,'| exit',all.some(z=>BFX.test(z.seg)));}
