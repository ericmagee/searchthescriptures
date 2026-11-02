// judge_fix7 J1 (run 32302, enforcer row 92: GLM's "D6 vs C4" BROKEN grade rested on Luke 3:31, which no later challenger round names; it was
// refused as unanswered-false because Matthew 1:12 and Jeremiah 22:30, also named in the line and in the pressing quotation, were answered in
// [DR3]): K-G4 judges each pressed witness on its own. The witnesses the line rests on as unanswered are the pressed witnesses (kg4Witnesses)
// that its GROUND names, or every pressed witness when the GROUND names none of them. The grade is unanswered-false only when each of those is
// named in a later round of the side that holds the link; while one is named in none, the grade stands, and the cure line names it.
function kg4Split(side,line,presses,R){const ORD=['CR1','DR1','CR2','DR2','CR3','DR3','CR4','DR4'];const own=side==='DEFENDER'?['CR1','CR2','CR3','CR4']:['DR1','DR2','DR3'];
 const g=String(line||'').match(/\bGROUND\s*:([\s\S]*)$/i);const G=g?new Set(cureRefs(g[1]).map(r=>r.key)):null;const rests=[],answered=[],open=[];
 for(const p of presses){const W=kg4Witnesses(line,p.q,R[p.round]);const Wg=G?W.filter(k=>G.has(k)):[];const use=Wg.length?Wg:W;const later=own.filter(k=>ORD.indexOf(k)>ORD.indexOf(p.round));
  for(const w of use){if(rests.includes(w))continue;rests.push(w);const hs=[];for(const k of later){if(typeof R[k]!=='string')continue;const h=cureRefs(R[k],true).find(r=>r.key===w);if(h)hs.push({ref:w,round:k,pos:h.pos});}
   if(hs.length)answered.push(...hs);else open.push(w);}}
 return {rests,answered,open,ground:!!(G&&rests.some(k=>G.has(k)))};}
const kg4Why=(ks,side,head)=>head+'; '+(ks.open.length?'the pressed witness '+ks.open.join(', ')+' '+(ks.open.length>1?'is each':'is')+' named in no later '+side.toLowerCase()+' round, so the grade stands'+(ks.answered.length?' (answered, and not the ground: '+kg4Txt(ks.answered)+')':''):'no pressed witness is read from the line');
