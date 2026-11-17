// ASK 344b offline test: run Init Seats, Resolve Seats and Accept Build (live vs target) on mocked inputs.
// usage: node a344/t344.cjs <workflow.json> <models.json> <body.json> [drop_seat_from_models]
const fs=require('fs');
const [wf,mf,bf]=process.argv.slice(2);
const W=JSON.parse(fs.readFileSync(wf));const code=n=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const models=JSON.parse(fs.readFileSync(mf));
const body=JSON.parse(fs.readFileSync(bf));const b=body.body||body;
const cd={set(){},};const ex={id:'999',customData:cd};
function run(src,input,nodes){
  const $=n=>{if(!(n in nodes))throw new Error('no mock for '+n);const v=nodes[n];return {all:()=>v.map(j=>({json:j})),first:()=>({json:v[0]})};};
  const $input={first:()=>({json:input[0]}),all:()=>input.map(j=>({json:j}))};
  return new Function('$','$input','$execution',src)($,$input,ex);
}
// Accept Build: which seats get the posture call
let acc;try{acc=run(code('Accept Build'),models,{'Debate Start':[{body:b}],'Dry Run Config':[{}]}).map(o=>o.json.acc.seat);}catch(e){acc='ERR '+e.message.slice(0,200);}
const seats=['chatgpt','sol','luna','hydrogen','gemini','grok','argon','haiku','spark','qwen','qwen4max','ernie55','ernie','ember','sonnet','sol62'];
const AGR={seats:seats.map(s=>({seat:s,placed:true,status:'ACCEPT'}))};
const init=run(code('Init Seats'),[{acc:AGR,src:{body:b}}],{'Accept Models':models})[0].json;
const res=run(code('Resolve Seats'),[],{'Init Seats':[init],'Fetch Models':models,'Fetch Drift Guards':[],'Fetch Tensions':[]})[0].json;
console.log(JSON.stringify({debaters:[b.defender,b.challenger].map(x=>x.engine),accept_seats:acc,panel:init.panel_order,reserve:init.panel_reserve,alt_order:init.alt_order,
 resolved_judges:res.judges.map(x=>x.seat),resolved_alternates:res.alternates.map(x=>x.seat+':'+x.api_model+':'+x.family)},null,1));
