// pkgA2R final "Alternate Merge" (W1, 11-08). The round-1 node is renamed "Alternate Merge 1" (code unchanged). Every node after Dry? reads
// $('Alternate Merge') by name and now reads this node.
// No round 2 (R2 Alternate Merge not executed): round 1's output, unchanged.
// Round 2: R2 Alternate Merge holds the panel base plus the round-2 alternates only. For each seat Second Alternate? named:
//  - seated in round 2: its body and summary come from round 2; its drv_removed entry keeps round 1's lines for that seat plus round 2's
//    ALTERNATE TRIED line;
//  - not seated in round 2: round 1's body stays, and round 2's ALTERNATE TRIED / ALTERNATE UNSEATED lines for it are appended.
// alternates_seated, drv_removed and alternates_tried are round 1's followed by round 2's (the seated and removed lists stay aligned, as
// odv1_record_panel_alternates requires); the enforcer log adds round 2's rows for its own alternates.
const R1=$('Alternate Merge 1').first().json;
let R2=null;try{if($('R2 Alternate Merge').isExecuted)R2=$('R2 Alternate Merge').first().json;}catch(e){R2=null;}
if(!R2)return [{json:R1}];
let SA=null;try{SA=$('Second Alternate?').first().json.a2r;}catch(e){SA=null;}
const seatOf=b=>{try{return JSON.parse(b).payload.judge_seat;}catch(e){return null;}};
const rawOf=b=>{try{return String(JSON.parse(b).payload.verdict_raw==null?'':JSON.parse(b).payload.verdict_raw);}catch(e){return '';}};
const ALT=/^\[AUDIT v(?:21|39): ALTERNATE (?:TRIED|UNSEATED) -- /;
const newLines=(r2raw,r1raw)=>{const have=new Set(r1raw.split('\n'));return String(r2raw).split('\n').filter(l=>ALT.test(l.trim())&&!have.has(l));};
const bodies=(R1.bodies||[]).slice();const summary=(R1.summary||[]).map(x=>({...x}));
const s2=(R2.alternates_seated||[]).slice();const rm2=(R2.drv_removed||[]).map(x=>({...x}));
const r2alt=new Set((R2.alternates_tried||[]).filter(x=>x&&x.alternate).map(x=>x.alternate));const result=[];
for(const rs of ((SA&&SA.seats)||[])){const k1=bodies.findIndex(b=>seatOf(b)===rs);
 if(k1<0){result.push({seat:rs,error:'the removed seat was not found in round 1'});continue;}
 const r1raw=rawOf(bodies[k1]);const st=s2.find(x=>x.removed_seat===rs);
 if(st){const k2=(R2.bodies||[]).findIndex(b=>seatOf(b)===st.alternate_seat);
  if(k2<0){result.push({seat:rs,error:'the round-2 alternate body was not found'});continue;}
  bodies[k1]=R2.bodies[k2];if(R2.summary&&R2.summary[k2])summary[k1]={...R2.summary[k2]};
  const e=rm2.find(x=>x.seat===rs);if(e){const nl=newLines(e.verdict_raw==null?'':e.verdict_raw,r1raw);e.verdict_raw=r1raw+(nl.length?'\n'+nl.join('\n'):'');}
  result.push({seat:rs,seated:st.alternate_seat,api_model:st.alternate_api_model});}
 else{const k2=(R2.bodies||[]).findIndex(b=>seatOf(b)===rs);const nl=k2>=0?newLines(rawOf(R2.bodies[k2]),r1raw):[];
  if(nl.length){const b=JSON.parse(bodies[k1]);b.payload.verdict_raw=r1raw+'\n'+nl.join('\n');bodies[k1]=JSON.stringify(b);}
  result.push({seat:rs,seated:null,lines:nl.length});}}
const enforcer_log=(R1.enforcer_log||[]).concat((R2.enforcer_log||[]).filter(x=>x&&x.seat_role==='alternate'&&r2alt.has(x.seat)));
const out={...R1,bodies,summary,panel_effective:summary.map(x=>x.seat).sort(),alternates_seated:(R1.alternates_seated||[]).concat(s2),
 drv_removed:(R1.drv_removed||[]).concat(rm2),alternates_tried:(R1.alternates_tried||[]).concat(R2.alternates_tried||[]),enforcer_log,
 alternate_round2:{seats:(SA&&SA.seats)||[],tried:(SA&&SA.tried)||[],free:(SA&&SA.free)||[],result}};
if(R1.alt_apply||R2.alt_apply)out.alt_apply=(R1.alt_apply||[]).concat(R2.alt_apply||[]);
return [{json:out}];
