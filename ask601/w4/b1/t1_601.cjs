// ASK 601 T1 (W4): Init Seats + Resolve Seats, live vs target, on every debater pair the engine accepts, judge order v2, model rows as read 11-24.
const fs=require('fs');const D=require(__dirname+'/data_601.json');
const L=require(process.env.LIVE||'/mnt/project-files/ask588/w4/fixqr/fetchback_eng_fixqr.json');const T=require(process.env.TGT||__dirname+'/target_engine_601.json');
const code=(W,n)=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const ENGS=['claude','chatgpt','gemini','grok','mimo','opus','glm','qwen4max','spark','sol62'];
const run=(src,nodes,input)=>{const $=n=>{const it=nodes[n];return {isExecuted:it!==undefined,first:()=>{if(!it)throw new Error('stub '+n);return {json:it[0]};},all:()=>(it||[]).map(json=>({json}))};};
 const $execution={id:'1',customData:{set(){}}};const $input={first:()=>({json:input}),all:()=>[{json:input}]};
 try{return {ok:new Function('$','$input','$execution',src)($,$input,$execution)[0].json};}catch(e){return {err:String(e.message).replace(/run_token=\S+/,'')};}};
const one=(W,d,c)=>{const seats=D.jo.panel.concat(D.jo.alternate).map(s=>({seat:s,placed:true}));
 const input={acc:{seats},src:{body:{topic:'T',defender:{engine:d,profile:'oracle'},challenger:{engine:c,profile:'plain'}}}};
 const nodes={'Judge Order Read':[D.jo],'Accept Models':D.rows,'Fetch Models':D.rows,'Fetch Drift Guards':[],'Fetch Tensions':[]};
 const I=run(code(W,'Init Seats'),nodes,input);if(I.err)return {init_err:I.err};nodes['Init Seats']=[I.ok];
 const R=run(code(W,'Resolve Seats'),nodes,{});
 return {panel:I.ok.panel_order,reserve:I.ok.panel_reserve,alt:I.ok.alt_order,dropped:I.ok.alt_dropped||null,res:R.err?{err:R.err}:{judges:R.ok.judges.map(j=>j.seat),reserve:R.ok.reserve&&R.ok.reserve.seat,alternates:R.ok.alternates.map(a=>a.seat)}};};
let n=0,same=0;const diffs=[];const out={};
for(const d of ENGS)for(const c of ENGS){if(d===c)continue;n++;const a=one(L,d,c),b=one(T,d,c);out[d+'|'+c]={live:a,target:b};
 if(JSON.stringify(a)===JSON.stringify(b))same++;else diffs.push(d+' vs '+c+': live '+JSON.stringify(a.res||a)+' | target '+JSON.stringify(b.res||b)+' | target dropped '+JSON.stringify(b.dropped));}
fs.writeFileSync(__dirname+'/out_t1_601.json',JSON.stringify(out,null,1));
console.log('pairs',n,'equal',same,'differ',diffs.length);diffs.forEach(x=>console.log(' ',x));
