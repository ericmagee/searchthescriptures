// ASK 623 T (W4): Init Seats + Resolve Seats, live 94b682a0 (base) against target_engine_623, every pairing; model rows and judge order read from the DB at 15:41 CST 11-24 (data_623_db.json), plus the rows and order the write adds.
const D=require(__dirname+'/data_623_db.json');const L=require(__dirname+'/base_moMxiV4Irg1uRBZN.json');const T=require(__dirname+'/target_engine_623.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const NEON={seat:'neon',family:'google',jfl_move:false,api_model:'google/gemini-4-neon',max_tokens:64000,active:true};
const R0=D.rows,R1=D.rows.concat([NEON]).sort((a,b)=>a.seat<b.seat?-1:1);
const O0=D.jo,O1={...D.jo,alternate:D.jo.alternate.concat(['hydrogen','neon']),version:3};
const run=(src,nodes,input)=>{const $=n=>{const it=nodes[n];return {isExecuted:it!==undefined,first:()=>{if(!it)throw new Error('stub '+n);return {json:it[0]};},all:()=>(it||[]).map(json=>({json}))};};
 const $execution={id:'1',customData:{set(){}}};const $input={first:()=>({json:input}),all:()=>[{json:input}]};
 try{return {ok:new Function('$','$input','$execution',src)($,$input,$execution)[0].json};}catch(e){return {err:String(e.message).replace(/run_token=\S+/,'')};}};
const one=(W,jo,rows,d,c)=>{const seats=jo.panel.concat(jo.alternate).map(s=>({seat:s,placed:true}));
 const input={acc:{seats},src:{body:{topic:'T',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}}}};
 const nodes={'Judge Order Read':[jo],'Accept Models':rows,'Fetch Models':rows,'Fetch Drift Guards':[],'Fetch Tensions':[]};
 const I=run(code(W,'Init Seats'),nodes,input);if(I.err)return {err:'INIT: '+I.err};nodes['Init Seats']=[I.ok];const R=run(code(W,'Resolve Seats'),nodes,{});if(R.err)return {err:'RESOLVE: '+R.err};R.ok.run_token='X';return R.ok;};
const sum=r=>r.err?'STOP '+r.err.slice(0,170):'judges '+r.judges.map(j=>j.seat).join(',')+'; reserve '+(r.reserve&&r.reserve.seat||'none')+'; alternates '+((r.alternates||[]).map(x=>x.seat).join(',')||'none')+'; enforcer '+r.enforcer.seat;
const E10=['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62'],E12=E10.concat(['hydrogen','neon']);const bad=[];
// C6 (ASK 601 T5 form): dash_judge_lineup in the rolled-back dry run (out_dry623.json) against the target engine's Resolve Seats, every pairing.
const DB=require(__dirname+'/out_dry623.json');let same=0;const diff=[],stops=[];
for(const d of E12)for(const c of E12){if(d===c)continue;const r=one(T,O1,R1,d,c);const k=d+'|'+c;
 if(r.err){stops.push(k+' (engine stops; DB '+DB[k]+')');continue;}
 const e=r.judges.map(j=>j.seat).join(',')+'/'+(r.reserve&&r.reserve.seat||'none')+'/'+(r.alternates||[]).map(x=>x.seat).join(',');
 if(e===DB[k])same++;else diff.push(k+': engine '+e+' | DB '+DB[k]);}
console.log('C6: equal',same,'| differ',diff.length,'| engine stops',stops.length);diff.forEach(x=>console.log('  DIFF '+x));stops.forEach(x=>console.log('  STOP '+x));
console.log('DB order',JSON.stringify(DB._order),'version',DB._version,'| neon row',JSON.stringify(DB._neon),'| debaters',DB._deb.join(','),'| fault with neon on the panel:',DB._fault);
