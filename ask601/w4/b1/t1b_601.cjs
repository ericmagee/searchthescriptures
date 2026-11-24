// ASK 601 T1b (W4): Resolve Seats second guard. Live Init Seats output with sonnet on the panel (order panel sonnet, sol, sol62) for claude vs opus; target Resolve Seats must fail closed; live Resolve Seats seats it.
const D=JSON.parse(JSON.stringify(require(__dirname+'/data_601.json')));D.jo={panel:['sonnet','sol','sol62'],alternate:['spark','chatgpt']};
const L=require('/mnt/project-files/ask588/w4/fixqr/fetchback_eng_fixqr.json');const T=require(__dirname+'/target_engine_601.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const run=(src,nodes,input)=>{const $=n=>{const it=nodes[n];return {isExecuted:it!==undefined,first:()=>({json:it[0]}),all:()=>(it||[]).map(json=>({json}))};};
 try{return {ok:new Function('$','$input','$execution',src)($,{first:()=>({json:input})},{id:'1',customData:{set(){}}})[0].json};}catch(e){return {err:String(e.message).replace(/run_token=\S+/,'')};}};
const input={acc:{seats:D.jo.panel.concat(D.jo.alternate).map(s=>({seat:s,placed:true}))},src:{body:{topic:'T',defender:{engine:'opus',profile:'oracle'},challenger:{engine:'claude',profile:'plain'}}}};
const nodes={'Judge Order Read':[D.jo],'Accept Models':D.rows,'Fetch Models':D.rows,'Fetch Drift Guards':[],'Fetch Tensions':[]};
const I=run(code(L,'Init Seats'),nodes,input);nodes['Init Seats']=[I.ok];console.log('live Init panel',I.ok.panel_order);
const rl=run(code(L,'Resolve Seats'),nodes,{}),rt=run(code(T,'Resolve Seats'),nodes,{});
console.log('live Resolve:',rl.err||rl.ok.judges.map(j=>j.seat));console.log('target Resolve:',rt.err||rt.ok.judges.map(j=>j.seat));
const It=run(code(T,'Init Seats'),nodes,input);console.log('target Init panel',It.ok&&It.ok.panel_order,'dropped',It.ok&&It.ok.alt_dropped);
console.log((rt.err&&/same model as a debater/.test(rt.err)&&!rl.err)?'T1b PASS':'T1b FAIL');
