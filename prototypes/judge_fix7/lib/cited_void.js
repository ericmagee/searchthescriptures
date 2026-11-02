// judge_fix7 J2 (run 32302, enforcer rows 97, 98 and 108, 109: ChatGPT and Sol ruled challenger premises 1, 4 and 5 VOID; K-G6 marked premise 4
// and K-G9 marked the verses pressed under it, and ChatGPT's cure then counted the VOID premises 1 and 4, COLLAPSED 4 from PROP-DEPENDENT 2):
// K-G6 and K-G9 never mark a premise the seat ruled VOID (lbVoid, as K-LB). For K-G9 a verse belongs to the listed premise(s) whose line carries
// it, or whose line holds the ruling's quotation; a verse of no listed premise is still marked. The items carry the seat's VOID premises and the
// list, so the cure check never lets a count include a VOID premise.
function ciPlist(R,side){const t=String((side==='CHALLENGER'?R.CR3:R.DR2)||'');const re=side==='CHALLENGER'?/CHALLENGER.{0,2}S\s+UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi:/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/gi;
 let i=-1;for(const m of t.matchAll(re))i=m.index;if(i<0)return [];const list=t.slice(i);
 const its=list.split(/\n(?=\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:))/i).filter(x=>/^\s*\**\s*(?:\d+[.)]\s|LINK\s+(?:\d+|none)\s*:)/i.test(x));
 return its.map((x,k)=>({n:k+1,keys:[...ciKeys(x)],text:x}));}
function ciVoidOf(x,PL,VD){const K=x.keys||ciKeys(x.ref);const ps=PL.filter(p=>p.keys.some(k=>K.has(k))||(x.q&&ciFound(x.q,p.text))).map(p=>p.n);return ps.length>0&&ps.every(j=>VD.has(j));}
const lbVoidList=v=>({all:!!v.all,set:[...v.set]});
