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
// C3a
let eq=0;for(const d of E10)for(const c of E10){if(d===c)continue;if(JSON.stringify(one(L,O0,R0,d,c))===JSON.stringify(one(T,O0,R1,d,c)))eq++;else bad.push('C3a '+d+'|'+c);}
console.log('C3a: 90 present pairings, order v2: live with today\'s rows vs target with the neon row: byte-equal',eq,'of 90');
// C3b
let same=0,tail=0,chg=[];for(const d of E10)for(const c of E10){if(d===c)continue;const a=one(T,O0,R1,d,c),b=one(T,O1,R1,d,c);if(JSON.stringify(a)===JSON.stringify(b)){same++;continue;}
 const k=r=>r.err?r.err:JSON.stringify({j:r.judges,r:r.reserve,e:r.enforcer});if(k(a)===k(b))tail++;else chg.push(d+' vs '+c+': '+sum(a)+' => '+sum(b));}
console.log('C3b: 90 present pairings, order v2 vs v3 (hydrogen, neon appended): identical',same,'| alternates only',tail,'| judges, reserve or enforcer change',chg.length);chg.forEach(x=>{console.log('  '+x);bad.push('C3b '+x);});
// live refuses the new debaters
for(const e of ['hydrogen','neon']){const r=one(L,O0,R0,e,'claude');console.log('live, '+e+' vs claude:',r.err?r.err.slice(0,110):'ACCEPTED');if(!r.err)bad.push('live accepts '+e);}
// C2
let n=0,three=0;const stop=[],nores=[],L2=[];const fam=s=>(R1.find(x=>x.seat===s)||{}).family,mdl=s=>(R1.find(x=>x.seat===s)||{}).api_model,ms=e=>e==='claude'?'claude_synthesis':e;
for(const d of E12)for(const c of E12){if(d===c)continue;n++;const r=one(T,O1,R1,d,c);L2.push(d+' vs '+c+': '+sum(r));
 if(r.err){stop.push(d+' vs '+c+': '+r.err.slice(0,220));continue;}if(r.judges.length===3)three++;else bad.push('C2 judges '+d+'|'+c);
 if(!r.reserve&&!(r.alternates||[]).length)nores.push(d+' vs '+c);
 const df=[fam(ms(d)),fam(ms(c))],dm=[mdl(ms(d)),mdl(ms(c))];const bothA=df[0]==='anthropic'&&df[1]==='anthropic';
 for(const s of r.judges.map(j=>j.seat).concat(r.reserve?[r.reserve.seat]:[]).concat((r.alternates||[]).map(x=>x.seat))){if(df.indexOf(fam(s))>=0&&!bothA)bad.push('C2 family '+d+'|'+c+' '+s);if(dm.indexOf(mdl(s))>=0)bad.push('C2 model '+d+'|'+c+' '+s);}
 if(df.indexOf(fam(r.enforcer.seat))>=0)bad.push('C2 enforcer family '+d+'|'+c);}
console.log('C2: pairings',n,'| three judges',three,'| stop with reason',stop.length,'| no reserve and no alternate',nores.length);stop.forEach(x=>console.log('  STOP '+x));console.log('  no reserve and no alternate: '+(nores.join('; ')||'none'));
const nw=L2.filter(x=>/^(hydrogen|neon) vs|vs (hydrogen|neon):/.test(x));console.log('NEW PAIRINGS ('+nw.length+'):');nw.forEach(x=>console.log('  '+x));
const c4=['hydrogen vs neon','neon vs hydrogen'].map(p=>L2.find(x=>x.startsWith(p+':')));console.log('C4:',c4.join(' || '));if(c4.some(x=>/STOP|enforcer (?!luna)/.test(x)||/judges[^;]*(gemini|argon|hydrogen|neon)/.test(x)))bad.push('C4');
const c5=L2.filter(x=>/^(hydrogen|neon) vs (chatgpt|sol62)|^(chatgpt|sol62) vs (hydrogen|neon)/.test(x));console.log('C5 ('+c5.length+'):');c5.forEach(x=>{console.log('  '+x);if(!/enforcer glm/.test(x))bad.push('C5 '+x);});
console.log(bad.length?'FAIL '+bad.join('; '):'ALL PASS');
