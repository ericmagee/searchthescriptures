// ASK 591 tests (W4): T1, T2 (JS side; writes t2_cases.json for the SQL side), T4, T5, T6. Run: node t591.cjs
const fs=require('fs');const D=__dirname;
const B=JSON.parse(fs.readFileSync(process.env.T591_BASE||D+'/base_eng.json','utf8'));const E=JSON.parse(fs.readFileSync(process.env.T591_TGT||D+'/target_engine_591.json','utf8')); /* base and target from env at the write */
const MC=JSON.parse(fs.readFileSync(D+'/mc_active.json','utf8'));const MM={};MC.forEach(x=>MM[x.seat]=x);
let pass=0,fail=0;const T=(id,ok,msg,extra)=>{ok?pass++:fail++;console.log((ok?'PASS ':'FAIL ')+id+' '+msg+(ok||!extra?'':' :: '+extra));};
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const SEED={panel:['chatgpt','sol','sol62'],alternate:['gemini','spark','qwen4max','argon','sonnet'],version:1};
// Init Seats under mocks. jo: the Judge Order Read item (undefined = node not run).
const runInit=(W,body,moved,jo)=>{const cd={};const ORD=(jo&&Array.isArray(jo.panel)&&Array.isArray(jo.alternate)?jo.panel.concat(jo.alternate):SEED.panel.concat(SEED.alternate));const acc={seats:ORD.map(s=>({seat:s,placed:true}))};
 const $=n=>{if(n==='Judge Order Read'){if(jo===undefined)throw new Error('node not run');return {first:()=>({json:jo}),isExecuted:true};}
  return {all:()=>(n==='Accept Models'?(moved||[]).map(s=>({json:{seat:s,jfl_move:true}})):[]),isExecuted:true,first:()=>({json:{}})};};
 const $input={first:()=>({json:{acc,src:{body}}}),all:()=>[{json:{acc,src:{body}}}]};const $execution={id:'1',customData:{set:(k,v)=>{cd[k]=v;}}};
 try{const o=new Function('$','$input','$execution','return (()=>{'+code(W,'Init Seats')+'\n})();')($,$input,$execution);return o[0].json;}catch(e){return {err:String(e.message).replace(/run_token=\S+/,'').slice(0,300)};}};
// Resolve Seats' filters on the reserve and the alternates (model rows and families), as in the live node
const famOf=k=>MM[k]&&MM[k].family?String(MM[k].family).trim().toLowerCase():'';
const resolve=j=>{if(j.err)return j;const debFam=[famOf(j.defender.mc_seat),famOf(j.challenger.mc_seat)];const cc=k=>famOf(k)==='anthropic'&&debFam.every(f=>f==='anthropic');
 const okRow=k=>MM[k]&&MM[k].api_model&&Number(MM[k].max_tokens)>0;
 const reserve=(j.panel_reserve&&okRow(j.panel_reserve)&&(cc(j.panel_reserve)||debFam.indexOf(famOf(j.panel_reserve))<0))?j.panel_reserve:null;
 const alts=(j.alt_order||[]).filter(k=>okRow(k)).filter(k=>(famOf(k)==='anthropic'&&debFam.every(f=>f==='anthropic'))||debFam.indexOf(famOf(k))<0);
 return {panel:j.panel_order,reserve,alternates:alts,single_judge:j.single_judge};};
const ENGK=W=>{const s=code(W,'Init Seats');const m=s.match(/const ENG=\{([\s\S]*?)\};/);return [...m[1].matchAll(/(\w+):\{fam/g)].map(x=>x[1]).filter(k=>k!=='deepseek');};
const K=ENGK(E);const MOVES=[[],['sol'],['gemini'],['chatgpt','spark']];

// T1: seeded table = live engine, seat for seat (whole Init Seats output; judge_order, run_token and the start time t0 aside)
{let n=0,diff=[];for(const d of K)for(const c of K){if(d===c)continue;for(const mv of MOVES){n++;const body={topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}};
 const a=runInit(B,body,mv),b=runInit(E,body,mv,SEED);const strip=x=>{const y={...x};delete y.judge_order;delete y.run_token;delete y.t0;return JSON.stringify(y);};
 if(strip(a)!==strip(b))diff.push(d+'/'+c+' '+mv);}}
 T('T1',diff.length===0,'with the seeded order, Init Seats gives the live engine\'s whole output in all '+n+' cases ('+K.length+' debaters, every ordered pair, 4 fault-ledger states)',diff.slice(0,3).join(' | '));}

// T2 (JS side): expected line-ups for five orders x every pair x 4 fault-ledger states
const ORDERS={seeded:SEED,
 alt_into_panel:{panel:['chatgpt','sol','sol62','gemini'],alternate:['spark','qwen4max','argon','sonnet'],version:2},
 panel_to_alt:{panel:['chatgpt','sol','spark'],alternate:['sol62','gemini','qwen4max','argon','sonnet'],version:3},
 reversed:{panel:['sol62','sol','chatgpt'],alternate:['sonnet','argon','qwen4max','spark','gemini'],version:4},
 sonnet_first:{panel:['sonnet','chatgpt','sol','sol62'],alternate:['gemini','spark','qwen4max','argon'],version:5}};
const cases=[];for(const [on,o] of Object.entries(ORDERS))for(const d of K)for(const c of K){if(d===c)continue;for(const mv of MOVES){
 const j=runInit(E,{topic:'t',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}},mv,o);
 cases.push({order:on,o:{panel:o.panel,alternate:o.alternate},d,c,moved:mv,exp:j.err?{error:/NOT GRADED/.test(j.err)?'NOT GRADED':j.err}:resolve(j)});}}
if(!process.env.T591_TGT)fs.writeFileSync(D+'/t2_cases.json',JSON.stringify(cases));
{const sj=cases.filter(x=>x.exp.single_judge==='sonnet').length;T('T2.js',sj===0&&cases.length===5*K.length*(K.length-1)*4,cases.length+' expected line-ups written to t2_cases.json; sonnet is never the single judge ('+sj+'); errors '+cases.filter(x=>x.exp.error).length);}

// T4: the read stands before every model call on every start path; a missing or bad read stops Accept Build and Init Seats
const C=E.connections;const succ=n=>((C[n]||{}).main||[]).flat().filter(Boolean).map(o=>o.node);
const reachAvoiding=(from,to,avoid)=>{const seen=new Set([from]);const q=[from];while(q.length){const x=q.shift();if(x===to)return true;for(const y of succ(x)){if(y===avoid||seen.has(y))continue;seen.add(y);q.push(y);}}return false;};
{const calls=E.nodes.filter(n=>n.type==='n8n-nodes-base.httpRequest'&&n.name!=='Judge Order Read'&&n.name!=='Accept Models').map(n=>n.name);
 const bad=[];for(const st of ['Debate Start','Manual Start'])for(const t of calls.concat(['Accept Build','Init Seats']))if(reachAvoiding(st,t,'Judge Order Read'))bad.push(st+'->'+t);
 T('T4.1',bad.length===0&&reachAvoiding('Debate Start','Judge Order Read')&&reachAvoiding('Manual Start','Judge Order Read'),'every path from Debate Start and Manual Start to any HTTP call node, Accept Build or Init Seats passes Judge Order Read',bad.slice(0,4).join(' | '));
 const jor=E.nodes.find(n=>n.name==='Judge Order Read');T('T4.2',!jor.onError&&jor.retryOnFail===true&&jor.executeOnce===true,'the read node has no onError (a failed read stops the run), retries 3 times, runs once');}
{const body={topic:'t',defender:{engine:'claude',profile:'oracle'},challenger:{engine:'gemini',profile:'plain'}};
 const r1=runInit(E,body,[],undefined),r2=runInit(E,body,[],{panel:['chatgpt'],alternate:[],version:9}),r3=runInit(E,body,[],{panel:'x'});
 T('T4.3',[r1,r2,r3].every(r=>r.err&&/JUDGE ORDER: the order table could not be read/.test(r.err)),'Init Seats stops with the JUDGE ORDER message when the read did not run, gave under three panel seats, or no list');
 const ab=(jo)=>{const $=n=>{if(n==='Judge Order Read'){if(jo===undefined)throw new Error('x');return {first:()=>({json:jo})};}if(n==='Shared Library')return {params:{jsCode:E.nodes.find(x=>x.name==='Shared Library').parameters.jsCode}};return {isExecuted:n==='Debate Start',first:()=>({json:{body}})};};
  const $input={all:()=>MC.map(x=>({json:x}))};try{return new Function('$','$input','$execution','return (()=>{'+code(E,'Accept Build')+'\n})();')($,$input,{id:'1'});}catch(e){return {err:e.message};}};
 const ok=ab(SEED),no=ab(undefined);const asked=Array.isArray(ok)?ok.map(o=>o.json.acc.seat):[];
 T('T4.4',JSON.stringify(asked)===JSON.stringify(['chatgpt','sol','sol62','spark','qwen4max','argon','sonnet'])&&no.err&&/JUDGE ORDER/.test(no.err),'Accept Build asks the agreement of the table\'s seats in its order less the debaters ('+asked.join(', ')+'), and stops with the JUDGE ORDER message without the read');}

// T5: the review_notes line is built after Init Seats on the live path, with the order and the seats
{const ok=reachAvoiding('Init Seats','Build Save Body',null);const s=code(E,'Build Save Body');const i=s.indexOf("review_notes:RN+(()=>{try{const I=$('Init Seats')");
 const frag=s.slice(i+'review_notes:RN+'.length);let depth=0,end=-1;for(let k=0;k<frag.length;k++){if(frag[k]==='(')depth++;else if(frag[k]===')'){depth--;if(depth===0&&frag.slice(k,k+3)===')()'){end=k+3;break;}}}
 const fn=frag.slice(0,end);const I=runInit(E,{topic:'t',defender:{engine:'sol62',profile:'oracle'},challenger:{engine:'claude',profile:'plain'}},[],SEED);
 const line=new Function('$','return '+fn)(n=>({first:()=>({json:I})}));
 T('T5',ok&&/^\n\n\[JUDGE ORDER v1: panel list chatgpt, sol, sol62; alternates list gemini, spark, qwen4max, argon, sonnet \| SEATED: panel gemini, spark, qwen4max; reserve argon; alternates argon; single judge gemini\]$/.test(line),'Build Save Body is downstream of Init Seats and writes: '+JSON.stringify(line));}

// T6: only the named nodes change; the new node is the only addition; the child is untouched
{const P=W=>Object.fromEntries(W.nodes.map(n=>[n.name,JSON.stringify(n.parameters)]));const a=P(B),b=P(E);
 const ch=Object.keys(b).filter(k=>a[k]!==b[k]).sort();T('T6',JSON.stringify(ch)===JSON.stringify(['Accept Build','Build Save Body','Init Seats','Judge Order Read'])&&E.nodes.length===B.nodes.length+1,'changed or added nodes: '+ch.join(', ')+'; nodes '+B.nodes.length+' -> '+E.nodes.length);}
console.log('RESULT: '+(fail?fail+' FAIL, '+pass+' PASS':'ALL PASS ('+pass+' pass)'));
