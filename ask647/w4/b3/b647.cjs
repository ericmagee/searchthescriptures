// ASK 647 build (W4): an unseated alternate's final text, as changed, is kept in one enforcer log row. Engine Shared Library only (LIB 2482). node b647.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const n0=E.nodes.find(k=>k.name==='Shared Library');const T=n0.parameters.jsCode;
const P={head:T.slice(0,T.indexOf('\n/*LIB*/')),L:JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))};
const tail=T.slice(T.lastIndexOf('\n/*END*/')+8);const L0=P.L.slice();
const I=2482;const A="tried.forEach(x=>{if(x.alternate===s.seat&&x.result==='SEATED'){x.result='NOT SEATED';x.why=why;x.verdict_raw=b.payload.verdict_raw;}});";
if(P.L[I].split(A).length!==2||P.L.filter(l=>l.includes(A)).length!==1)throw new Error('ASK 647 build: the anchor is not found exactly once at LIB '+I);
const NEW=String.raw`log.push({run_token:AS.run_token,seat:s.seat,seat_role:'alternate',judge_model:s.api_model,kind:'alternate_reply',rule:'ALT-FINAL',item:'FINAL TEXT AS CHANGED (unseated; seat '+s.removed_seat+' left unfilled)',flagged_line:null,prompt_sent:null,full_reply:b.payload.verdict_raw,reply_error:null,response_line:null,cure_status:'RECORD-ONLY',cure_reason:why,at:T}); /* ASK 647: the unseated alternate's text as changed is stored in the log, not only in the execution */`;
P.L[I]=P.L[I].replace(A,()=>A+NEW);
const reb=p=>p.map(x=>typeof x==='number'?P.L[x]:typeof x[0]==='string'?x[0]:P.L.slice(x[0],x[1]+1).join('\n')).join('\n');
const touched=[];for(const [k,v] of Object.entries(P.M)){if(!v||!Array.isArray(v.p))continue;const n=reb(v.p).length;if(n!==v.n){touched.push(k);v.n=n;}}
n0.parameters.jsCode=P.head+'\n/*LIB*/'+JSON.stringify(P.L)+'\n/*MAP*/'+JSON.stringify(P.M)+'\n/*END*/'+tail;
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 647 built:',OUT,'| LIB lines changed:',P.L.map((l,i)=>l!==L0[i]?i:null).filter(x=>x!==null).join(','),'| MAP entries re-measured:',touched.length,touched.join(', '));
