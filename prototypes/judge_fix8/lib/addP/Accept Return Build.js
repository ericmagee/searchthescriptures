// judge_fix8 P2, P3: the one return (v4 Part 1, step 4): the seat's own exchange, then the fault named. One item per returned seat.
//@@POSTURE@@
const A=$('Accept Check').first().json.acc;const B=$('Accept Build').all().map(i=>i.json.acc);
return A.ret.map(i=>{const s=A.seats[i];const b=B[i];const body=JSON.parse(JSON.stringify(b.body));
 body.messages=body.messages.concat([{role:'assistant',content:s.first.text},{role:'user',content:POSTURE.RET(s.first.faults)}]);
 return {json:{acc:{idx:i,seat:s.seat,body}}};});
