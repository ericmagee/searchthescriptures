// ASK 647 tests (W4). node t647.cjs base_eng.json target_engine_647.json
// Runs the node "Alternate Merge 1" (engine library, MAP entry of the same name) offline on a 42528-shaped input: chatgpt seated for qwen4max, left with drv_uncured 3.
const fs=require('fs');const [,,BA,TG]=process.argv;const B=JSON.parse(fs.readFileSync(BA,'utf8')),T=JSON.parse(fs.readFileSync(TG,'utf8'));
let pass=0,fail=0;const ok=(c,m)=>{if(c)pass++;else{fail++;console.log('FAIL',m);}};
const body=(seat,raw,du)=>JSON.stringify({payload:{judge_seat:seat,verdict_raw:raw,verdict_tag:'BROKEN',defense_standing:'COLLAPSED',conceded_links:3,challenge_standing:'PROP-DEPENDENT',challenger_conceded_links:1,drv_uncured:du}});
const mk=(W,rd)=>n=>{if(n==='Shared Library')return {params:W.nodes.find(x=>x.name==='Shared Library').parameters,isExecuted:true};const it=rd[n];
 if(!it)return {isExecuted:false,first:()=>{throw new Error('node '+n+' did not run');},all:()=>{throw new Error('node '+n+' did not run');}};return {isExecuted:true,first:()=>({json:it}),all:()=>[{json:it}]};};
const run=async(W,rd,nm)=>{const code=W.nodes.find(x=>x.name===nm).parameters.jsCode;const $=mk(W,rd);
 return new Function('$','$input','$execution','return (async()=>{\n'+code+'\n})();')($,{first:()=>({json:{}}),all:()=>[]},{id:'0',customData:{set(){}}});};
const scen=(alts)=>{const seats=['sol','sol62'].concat(alts.map(a=>a.seat));
 const AMb=seats.map(s=>{const a=alts.find(x=>x.seat===s);return body(s,'{"verdict_tag":"BROKEN"}\nTEXT OF '+s+(a?' AS CHANGED AT THE SEND-BACK AND GATE':''),a?a.du:0);});
 const ASb=seats.map(s=>body(s,'{"verdict_tag":"BROKEN"}\nTEXT OF '+s+' FIRST REPLY',0));
 const PREb=['sol','sol62'].concat(alts.map(a=>a.removed)).map(s=>body(s,'{"verdict_tag":"BROKEN"}\nTEXT OF '+s+' (THE REMOVED JUDGE)',0));
 return {'Alternate Merge Seat':{run_token:'ODV1-T647',bodies:AMb,summary:seats.map(s=>({seat:s})),alternates_seated:alts.map(a=>({alternate_seat:a.seat,removed_seat:a.removed})),drv_removed:alts.map(a=>({seat:a.removed,replaced_by:a.seat})),alternates_tried:alts.map(a=>({removed_seat:a.removed,alternate:a.seat,api_model:a.model,result:'SEATED'})),enforcer_log:[{run_token:'ODV1-T647',seat:'chatgpt',kind:'alternate_reply',rule:null,item:'first reply'}]},
  'Alt Seated':{run_token:'ODV1-T647',alt_seats:alts.map(a=>({seat:a.seat,removed_seat:a.removed,api_model:a.model})),bodies:ASb,judges:[]},
  'Gate Record':{bodies:PREb,summary:['sol','sol62'].concat(alts.map(a=>a.removed)).map(s=>({seat:s}))},
  'Alt Gate Record':{bodies:AMb,gate_rows:alts.filter(a=>a.du>0).flatMap(a=>[1,2,3].slice(0,a.du).map(i=>({seat:a.seat,item:'G'+i+' RULE','cure_status':'UNCURED',cure_reason:'GATE KEEP | counted in drv_uncured'})))}};};
(async()=>{
const strip=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='at'?undefined:v));
const cases=[['C1 42528-shaped: chatgpt for qwen4max, drv_uncured 3',[{seat:'chatgpt',removed:'qwen4max',model:'openai/gpt-6.1-sol',du:3}],1],
 ['C2 a seated alternate (drv_uncured 0)',[{seat:'chatgpt',removed:'qwen4max',model:'openai/gpt-6.1-sol',du:0}],0],
 ['C2 two alternates unseated',[{seat:'chatgpt',removed:'qwen4max',model:'openai/gpt-6.1-sol',du:3},{seat:'sonnet',removed:'hydrogen',model:'anthropic/claude-sonnet-5.5',du:1}],2]];
for(const [nm,alts,want] of cases){const rd=scen(alts);let o,n;try{o=(await run(B,rd,'Alternate Merge 1'))[0].json;n=(await run(T,rd,'Alternate Merge 1'))[0].json;}catch(e){console.log('ERROR',nm,e.stack);fail++;continue;}
 const add=n.enforcer_log.filter(r=>r.rule==='ALT-FINAL');console.log(nm+': log rows old',o.enforcer_log.length,'new',n.enforcer_log.length,'| ALT-FINAL rows',add.length);
 ok(add.length===want&&n.enforcer_log.length===o.enforcer_log.length+want,nm+': exactly '+want+' new row(s)');
 const no={...strip(n),enforcer_log:strip(n).enforcer_log.filter(r=>r.rule!=='ALT-FINAL')};ok(JSON.stringify(no)===JSON.stringify(strip(o)),nm+': every other output is equal to the old');
 for(const r of add){const a=alts.find(x=>x.seat===r.seat);const tr=n.alternates_tried.find(x=>x.alternate===r.seat);
  console.log('   row:',JSON.stringify({...r,full_reply:String(r.full_reply).slice(0,80)}));
  ok(r.kind==='alternate_reply'&&r.seat_role==='alternate'&&r.cure_status==='RECORD-ONLY'&&r.judge_model===a.model&&r.item==='FINAL TEXT AS CHANGED (unseated; seat '+a.removed+' left unfilled)',nm+': row fields');
  ok(r.full_reply===tr.verdict_raw&&/AS CHANGED/.test(r.full_reply)&&r.cure_reason===tr.why&&/^unseated after its enforcer send-back and gate: /.test(r.cure_reason),nm+': full_reply is the changed text and cure_reason the unseat why');
  const seatBody=n.bodies.map(x=>JSON.parse(x).payload).find(p=>p.judge_seat===a.removed);ok(seatBody&&/THE REMOVED JUDGE/.test(seatBody.verdict_raw),nm+': the seat keeps the removed judge\'s body');}}
// C3/C4 structure
const lib=E=>{const t=E.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));};
const P=d=>Object.fromEntries(d.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const pb=P(B),pt=P(T);const ch=Object.keys(pb).filter(k=>pb[k]!==pt[k]);
ok(JSON.stringify(ch)==='["Shared Library"]','C3 only the Shared Library changes');ok(JSON.stringify(B.connections)===JSON.stringify(T.connections),'C3 connections equal');
const LB=lib(B),LT=lib(T);const dl=LT.map((l,i)=>l!==LB[i]?i:null).filter(x=>x!==null);ok(JSON.stringify(dl)==='[2482]','C3 only LIB 2482 changes');
const add=LT[2482].slice(LB[2482].length-LB[2482].length);ok(/ASK 647/.test(LT[2482])&&(LT[2482].match(/catch/g)||[]).length===(LB[2482].match(/catch/g)||[]).length,'C4 tagged ASK 647; no new catch');
console.log(pass+' pass, '+fail+' fail');console.log(fail?'FAILED':'ALL PASS');})().catch(e=>{console.log('ERROR',e.stack);process.exit(1);});
