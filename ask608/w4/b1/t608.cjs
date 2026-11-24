// ASK 608 T1-T3 (W4): Init Seats + Resolve Seats, live fbc09389 vs target, every debater pair the engine accepts; judge order and model rows as read 11-24 13:2x CST (data_608.json).
const fs=require('fs');const D=require(__dirname+'/data_608.json');
const L=require(process.env.LIVE||'/mnt/project-files/ask611/w4/write/fetchback_eng611.json');const T=require(process.env.TGT||__dirname+'/target_engine_608.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const ENGS=['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62'];
const run=(src,nodes,input,cd)=>{const $=n=>{const it=nodes[n];return {isExecuted:it!==undefined,first:()=>{if(!it)throw new Error('stub '+n);return {json:it[0]};},all:()=>(it||[]).map(json=>({json}))};};
 const $execution={id:'1',customData:{set(k,v){if(cd)cd[k]=v;}}};const $input={first:()=>({json:input}),all:()=>[{json:input}]};
 try{return {ok:new Function('$','$input','$execution',src)($,$input,$execution)[0].json};}catch(e){return {err:String(e.message).replace(/run_token=\S+/,'')};}};
const one=(W,d,c,rows)=>{const seats=D.jo.panel.concat(D.jo.alternate).map(s=>({seat:s,placed:true}));
 const input={acc:{seats},src:{body:{topic:'T',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}}}};
 const nodes={'Judge Order Read':[D.jo],'Accept Models':rows,'Fetch Models':rows,'Fetch Drift Guards':[],'Fetch Tensions':[]};
 const I=run(code(W,'Init Seats'),nodes,input);if(I.err)return {init_err:I.err};nodes['Init Seats']=[I.ok];const cd={};
 const R=run(code(W,'Resolve Seats'),nodes,{},cd);if(R.ok)R.ok.run_token='X';return {R,cd};};
const fam=Object.fromEntries(D.rows.map(r=>[r.seat,r.family]));const ENGSEAT={claude:'claude_synthesis'};const debFam=e=>fam[ENGSEAT[e]||e];
let n=0,eq=0,bar=0,fails=[];const lines=[];const bad=[];
for(const d of ENGS)for(const c of ENGS){if(d===c)continue;n++;const a=one(L,d,c,D.rows),b=one(T,d,c,D.rows);
 if(a.init_err){if(JSON.stringify(a)!==JSON.stringify(b))bad.push(d+'|'+c+' init differs');continue;}
 const barred=[debFam(d),debFam(c)].indexOf('openai')>=0;
 if(!barred){if(JSON.stringify(a.R)===JSON.stringify(b.R)&&Object.keys(b.cd).filter(k=>k!=='guard_count').length===0)eq++;else bad.push(d+'|'+c+' not barred but differs');continue;}
 bar++;if(b.R.err){fails.push(d+' vs '+c+': '+b.R.err);if(a.R.err)bad.push(d+'|'+c+' live also failed');continue;}
 if(a.R.err){bad.push(d+'|'+c+' live failed: '+a.R.err);continue;}
 const e=b.R.ok.enforcer;const o={...a.R.ok,enforcer:null,alternates:null},p={...b.R.ok,enforcer:null,alternates:null,enforcer_barred:undefined};delete p.enforcer_barred;
 const sat=new Set([...b.R.ok.judges.map(j=>j.seat),b.R.ok.reserve&&b.R.ok.reserve.seat].filter(Boolean));
 const ok=JSON.stringify(o)===JSON.stringify(p)&&e.seat!=='luna'&&[debFam(d),debFam(c)].indexOf(fam[e.seat])<0&&!sat.has(e.seat)&&!b.R.ok.alternates.some(x=>x.seat===e.seat)&&JSON.stringify(a.R.ok.alternates.filter(x=>x.seat!==e.seat))===JSON.stringify(b.R.ok.alternates)&&b.cd.enforcer_seat===e.seat;
 if(!ok)bad.push(d+'|'+c+' barred check failed');lines.push(d+' vs '+c+': enforcer '+e.seat+' ('+e.api_model+'); judges '+b.R.ok.judges.map(j=>j.seat).join(',')+'; reserve '+(b.R.ok.reserve&&b.R.ok.reserve.seat)+'; alternates '+b.R.ok.alternates.map(x=>x.seat).join(','));}
console.log('pairs',n,'| no OpenAI debater, byte-equal',eq,'| luna barred',bar,'| replaced',lines.length,'| fail closed',fails.length);
lines.forEach(x=>console.log('  '+x));fails.forEach(x=>console.log('  FAIL CLOSED '+x));
// T3: the backup seat cannot serve: fails closed with the reason, before any call
const T3=[['backup of a debater family',D.rows.map(r=>r.seat==='hy4'?{...r,family:'google'}:r)],['backup with no family',D.rows.map(r=>r.seat==='hy4'?{...r,family:''}:r)],['backup row missing',D.rows.filter(r=>r.seat!=='hy4')]];
for(const [w,rows] of T3){const t=one(T,'chatgpt','gemini',rows);const ok=t.R&&t.R.err&&/ENFORCER:.*ASK 608/.test(t.R.err);if(!ok)bad.push('T3 '+w);console.log('T3',w,ok?'fails closed: '+t.R.err.slice(0,170):'DID NOT FAIL CLOSED');}
console.log(bad.length?'T1 FAIL '+bad.join('; '):'T1 ALL PASS');
