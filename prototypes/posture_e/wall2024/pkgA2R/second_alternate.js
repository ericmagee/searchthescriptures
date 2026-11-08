// pkgA2R "Second Alternate?" (W1, 11-08; Eric-approved even-panel reserve, WALL-2024 2887 (a), 2889, 2891; design 3222).
// After round 1 (Alternate Merge 1): a second alternate round runs only when an alternate was TRIED for a removed seat and ended NOT SEATED,
// that seat is still unfilled, fewer than two alternates sit, and the pool still holds a model that was not tried in round 1 and passes
// G1 (no family that debates) and G3 (not on this panel). Output: Gate Record's own output (what Alternate Build reads as its input) plus a2r.
// With run false, Second Alternate Needed? sends this item to the final Alternate Merge, which passes round 1 through unchanged.
const R1=$('Alternate Merge 1').first().json;const G=$('Gate Record').first().json;const S=$('Init Seats').first().json;const RS=$('Resolve Seats').first().json;
const QA=S.dry===true&&S.qualify_alternate?S.qualify_alternate:null;
const a2r={run:false,seats:[],tried:[],free:[],why:null};
if(QA)a2r.why='the qualify path makes no second round';
else{const seated=R1.alternates_seated||[];const filled=new Set(seated.map(x=>x.removed_seat));
 const T=(R1.alternates_tried||[]).filter(x=>x&&x.alternate&&x.api_model);a2r.tried=[...new Set(T.map(x=>x.api_model))];
 const failed=[...new Set(T.filter(x=>x.result==='NOT SEATED'&&!filled.has(x.removed_seat)).map(x=>x.removed_seat))];
 a2r.seats=failed.slice(0,Math.max(0,2-seated.length)); /* odv1_record_panel_alternates takes two alternates at most */
 const pay=(G.bodies||[]).map(b=>{try{return JSON.parse(b).payload;}catch(e){return null;}}).filter(Boolean);const deb=RS.debaters||[];
 const free=(RS.alternates||[]).filter(a=>!deb.some(d=>d.model===a.api_model||d.family===a.family)&&!pay.some(q=>q.judge_api_model===a.api_model)&&a2r.tried.indexOf(a.api_model)<0);
 a2r.free=free.map(a=>a.seat);a2r.run=a2r.seats.length>0&&free.length>0;
 a2r.why=a2r.run?'round 2 for '+a2r.seats.join(', ')+'; free: '+a2r.free.join(', ')
  :!T.length?'no alternate was tried in round 1'
  :!failed.length?'every tried alternate is seated'
  :!a2r.seats.length?'two alternates already sit'
  :'no pool model is left after round 1 (pool: '+((RS.alternates||[]).map(a=>a.seat).join(', ')||'empty')+'; tried: '+a2r.tried.join(', ')+')';}
return [{json:{...G,a2r}}];
