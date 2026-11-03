// judge_fix8 P2, P3: the code check of each acceptance reply (v4 Part 1, step 3): the six headings and the acceptance line verbatim; the
// own-words lines kept, not graded. A FAULT (a heading or the line omitted or altered) is returned once (Accept Return Build); a refusal is
// recorded and not returned (step 5); a failed call is recorded. One item out: the seats and the indices to return.
//@@POSTURE@@
const S=$('Init Seats').first().json;const RT=' run_token='+S.run_token;
const B=$('Accept Build').all().map(i=>i.json.acc);const R=$input.all().map(i=>i.json);
if(R.length!==B.length)throw new Error('FAIL-CLOSED: Accept Check read '+R.length+' replies for '+B.length+' acceptance calls.'+RT);
const seats=B.map((b,i)=>{const e=POSTURE.env(R[i]);const c=e.ok?POSTURE.check(e.text):{status:'ERROR',faults:['call failed: '+e.why],lines:{},accept_line:false};
 return {seat:b.seat,role:b.role,api_model:b.api_model,first:{...c,text:e.ok?e.text:null,finish:e.ok?e.finish:null,model_served:(R[i]&&R[i].model)||null}};});
const ret=seats.map((s,i)=>s.first.status==='FAULT'?i:-1).filter(i=>i>=0);
return [{json:{acc:{seats,ret}}}];
