// judge_fix8 P2, P3: each seat's final acceptance status (ACCEPT, HEDGE, ACCEPT_ON_RETURN, HEDGE_ON_RETURN, FAULT_RECORDED, REFUSE, ERROR) and
// the exchange that goes at the head of its judging conversation (placed only when the code check passed; the seat sits in every case).
//@@POSTURE@@
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;const A=$('Accept Check').first().json.acc;
let RB=[],RR=[];try{if($('Accept Return Build').isExecuted){RB=$('Accept Return Build').all().map(i=>i.json.acc);RR=$('Accept Return Call openrouter').all().map(i=>i.json);}}catch(e){RB=[];RR=[];}
if(RB.length!==RR.length)throw new Error('FAIL-CLOSED: Accept Final read '+RR.length+' return replies for '+RB.length+' returns.'+RT);
const second={};RB.forEach((b,k)=>{const e=POSTURE.env(RR[k]);second[b.idx]={...(e.ok?POSTURE.check(e.text):{status:'ERROR',faults:['call failed: '+e.why],lines:{},accept_line:false}),text:e.ok?e.text:null,finish:e.ok?e.finish:null};});
const seats=A.seats.map((s,i)=>{const r=second[i]||null;const status=POSTURE.final(s.first,r);const use=r&&(status==='ACCEPT_ON_RETURN'||status==='HEDGE_ON_RETURN')?r:s.first;
 const exchange=[{role:'user',content:POSTURE.PROMPT},{role:'assistant',content:s.first.text||''}].concat(r?[{role:'user',content:POSTURE.RET(s.first.faults)},{role:'assistant',content:r.text||''}]:[]);
 return {seat:s.seat,role:s.role,api_model:s.api_model,status,placed:POSTURE.PLACED.indexOf(status)>=0,lines:use.lines||{},faults:s.first.faults,return_faults:r?r.faults:null,
  first_text:s.first.text,return_text:r?r.text:null,first_status:s.first.status,return_status:r?r.status:null,exchange};});
$execution.customData.set('posture_accept',seats.map(s=>s.seat+':'+s.status).join(','));
return [{json:{acc:{seats,probe:S.accept_probe===true}}}];
