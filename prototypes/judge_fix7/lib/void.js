// judge_fix7 J2/J3: VOID premises in the cure check. x.void is the set of the side's premises the seat ruled VOID in its judgment (lbVoid, carried
// on the K-G6, K-G9 and K-LB items); a cure's STATEMENT for the item may re-rule premises VOID ("premise 4 ... VOID", "their charges are VOID:
// premise 4 ...; premise 1 ..."). A VOID premise counts for neither side (section 8), so no corrected count may count one: the count of a side
// is at most L less its VOID premises. x.plist holds the side's listed premises (number and the verse keys each carries) for K-G9.
function cvStmtVoid(t){const out=new Set();let all=false;for(const s of String(t||'').replace(/[*_`]+/g,'').split(/(?<=[.!?])\s+|\n/)){if(!/\bVOID\b/.test(s))continue;
  if(/\b(?:not|never)\s+(?:be\s+)?VOID\b|\bno\s+(?:premise|charge|link)s?\s+(?:is|are|was|were)\s+VOID\b/i.test(s))continue;
  const ns=[...s.matchAll(/\bpremises?\s+(\d+(?:\s*(?:,\s*(?:and|or|&)?|and|&|or)\s*\d+)*)/gi)].flatMap(m=>m[1].match(/\d+/g).map(Number));if(ns.length)ns.forEach(n=>out.add(n));else if(/\b(?:each|all|every|both)\b/i.test(s))all=true;}
 return {all,set:out};}
const cvSet=v=>new Set(v&&Array.isArray(v.set)?v.set:[]);
const cvCap=x=>{if(!x||!x.L||!x.void)return Infinity;return x.void.all?0:Math.max(0,x.L-[...cvSet(x.void)].filter(j=>j>=1&&j<=x.L).length);};
const cvTxt=x=>x&&x.void?(x.void.all?'every premise':'premise'+(cvSet(x.void).size>1?'s ':' ')+[...cvSet(x.void)].sort((a,b)=>a-b).join(', ')):'';
const cvPrem=(x,ref)=>{const K=ciKeys(ref);return (x.plist||[]).filter(p=>(p.keys||[]).some(k=>K.has(k))).map(p=>p.n);};
