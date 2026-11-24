// ASK 623 order measure (W4): Init Seats + Resolve Seats of live 94b682a0, with and without the ASK 623 seat-table additions, on every pairing; order v2 and model rows from ask608/w4/b1/data_608.json plus a neon row.
const D=require('/mnt/project-files/ask608/w4/b1/data_608.json');
const L=require('/mnt/project-files/ask608/w4/write/fetchback_eng_608.json');
const code=(n)=>L.nodes.find(x=>x.name===n).parameters.jsCode;
const rep=(s,a,b)=>{if(s.split(a).length!==2)throw new Error('anchor not once: '+a);return s.replace(a,b);};
const IS0=code('Init Seats'),RS0=code('Resolve Seats');
let IS1=rep(IS0,"deepseek:{fam:'deepseek',mc:'deepseek_debate'}};","deepseek:{fam:'deepseek',mc:'deepseek_debate'},hydrogen:{fam:'openrouter',mc:'hydrogen'},neon:{fam:'openrouter',mc:'neon'}};");
IS1=rep(IS1,"hydrogen:'google',argon:'google'","hydrogen:'google',neon:'google',argon:'google'");
IS1=IS1.split("hydrogen:'openrouter',").join("hydrogen:'openrouter',neon:'openrouter',");
const RS1=RS0.split("hydrogen:'openrouter',").join("hydrogen:'openrouter',neon:'openrouter',");
const ROWS0=D.rows, ROWS1=D.rows.concat([{seat:'neon',family:'google',jfl_move:false,api_model:'google/gemini-4-neon',max_tokens:64000,active:true}]);
const run=(src,nodes,input)=>{const $=n=>{const it=nodes[n];return {isExecuted:it!==undefined,first:()=>{if(!it)throw new Error('stub '+n);return {json:it[0]};},all:()=>(it||[]).map(json=>({json}))};};
 const $execution={id:'1',customData:{set(){}}};const $input={first:()=>({json:input}),all:()=>[{json:input}]};
 try{return {ok:new Function('$','$input','$execution',src)($,$input,$execution)[0].json};}catch(e){return {err:String(e.message).replace(/run_token=\S+/,'')};}};
const one=(IS,RS,jo,rows,d,c)=>{const seats=jo.panel.concat(jo.alternate).map(s=>({seat:s,placed:true}));
 const input={acc:{seats},src:{body:{topic:'T',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}}}};
 const nodes={'Judge Order Read':[jo],'Accept Models':rows,'Fetch Models':rows,'Fetch Drift Guards':[],'Fetch Tensions':[]};
 const I=run(IS,nodes,input);if(I.err)return {err:'INIT: '+I.err};nodes['Init Seats']=[I.ok];const R=run(RS,nodes,{});if(R.err)return {err:'RESOLVE: '+R.err};R.ok.run_token='X';return R.ok;};
const sum=r=>r.err?'STOP '+r.err.slice(0,160):'judges '+r.judges.map(j=>j.seat).join(',')+'; reserve '+(r.reserve&&r.reserve.seat||'none')+'; alternates '+(r.alternates||[]).map(x=>x.seat).join(',')+'; enforcer '+r.enforcer.seat;
const E10=['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62'],E12=E10.concat(['hydrogen','neon']);
const O0=D.jo,O1={...D.jo,alternate:D.jo.alternate.concat(['hydrogen','neon'])};
let bad=[];
// C3: present 90 pairings, present order: tables added change nothing
let eq=0;for(const d of E10)for(const c of E10){if(d===c)continue;const a=one(IS0,RS0,O0,ROWS0,d,c),b=one(IS1,RS1,O0,ROWS1,d,c);if(JSON.stringify(a)===JSON.stringify(b))eq++;else bad.push('C3 '+d+'|'+c);}
console.log('C3: 90 present pairings, order v2, tables added: byte-equal',eq,'of 90');
// Option measure: 90 present pairings, order v2 vs v2 + hydrogen, neon at the end of the alternates
let same=0,altonly=0,seatchg=[];for(const d of E10)for(const c of E10){if(d===c)continue;const a=one(IS1,RS1,O0,ROWS1,d,c),b=one(IS1,RS1,O1,ROWS1,d,c);
 if(JSON.stringify(a)===JSON.stringify(b)){same++;continue;}
 const k=r=>r.err?r.err:JSON.stringify({j:r.judges.map(j=>j.seat),r:r.reserve&&r.reserve.seat,e:r.enforcer.seat});
 if(k(a)===k(b))altonly++;else seatchg.push(d+' vs '+c+'\n    before: '+sum(a)+'\n    after:  '+sum(b));}
console.log('APPEND: 90 present pairings: identical',same,'| alternates tail only',altonly,'| judges, reserve or enforcer change',seatchg.length);seatchg.forEach(x=>console.log('  '+x));
// C2: 132 pairings under the appended order
let n=0,stop=[],nores=[],three=0;const L2=[];
for(const d of E12)for(const c of E12){if(d===c)continue;n++;const r=one(IS1,RS1,O1,ROWS1,d,c);L2.push(d+' vs '+c+': '+sum(r));
 if(r.err){stop.push(d+' vs '+c+': '+r.err.slice(0,200));continue;}
 if(r.judges.length===3)three++;else bad.push('C2 '+d+'|'+c+' judges '+r.judges.length);if(!r.reserve)nores.push(d+' vs '+c);
 const deb=[d,c].map(e=>(ROWS1.find(x=>x.seat===(e==='claude'?'claude_synthesis':e))||{}));const df=deb.map(x=>x.family),dm=deb.map(x=>x.api_model);
 for(const s of r.judges.map(j=>j.seat).concat(r.reserve?[r.reserve.seat]:[])){const row=ROWS1.find(x=>x.seat===s);if(df.indexOf(row.family)>=0&&!(df[0]==='anthropic'&&df[1]==='anthropic'))bad.push('C2 family '+d+'|'+c+' '+s);if(dm.indexOf(row.api_model)>=0)bad.push('C2 model '+d+'|'+c+' '+s);}
 if(df.indexOf('openai')>=0&&r.enforcer.seat==='luna')bad.push('C2 enforcer '+d+'|'+c);}
console.log('C2: pairings',n,'| three judges',three,'| stop with reason',stop.length,'| no reserve',nores.length);
stop.forEach(x=>console.log('  STOP '+x));console.log('  no reserve: '+nores.join('; '));
console.log('NEW PAIRINGS (hydrogen or neon debating):');L2.filter(x=>/^(hydrogen|neon) vs|vs (hydrogen|neon):/.test(x)).forEach(x=>console.log('  '+x));
console.log(bad.length?'FAIL '+bad.join('; '):'ALL CHECKS PASS');
