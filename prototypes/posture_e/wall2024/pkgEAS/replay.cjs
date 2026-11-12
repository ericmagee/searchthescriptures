// pkgESS replay on run 35296 stored data: runs the Alternate Build stub and the Alternate Payloads stub, live s146 vs the package.
// Cases: (1) as run: luna early (grok), sol not (argon); (2) none early (no stored reply); (3) all early (plant: a stored reply for sol too).
// Usage: node replay.cjs <live json> <package json> <export json>
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const [LV,PK]=[load(process.argv[2]),load(process.argv[3])];const rd0=JSON.parse(fs.readFileSync(process.argv[4],'utf8')).data.resultData.runData;
const mkS=(W,rd,over)=>name=>{if(over&&over[name])return over[name];const r=rd[name];const items=r?r[r.length-1].data.main.flat().filter(Boolean):[];const nd=W.nodes.find(n=>n.name===name)||{};return {isExecuted:!!r,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:nd.parameters||{}};};
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const runNode=async(W,rd,name,input,over)=>{input=input||[];const $=mkS(W,rd,over);const src=W.nodes.find(n=>n.name===name).parameters.jsCode;const $input={all:()=>input,first:()=>input[0],last:()=>input[input.length-1],item:input[0]};
 return await new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const early=rd0['Get Early Alternate'][0].data.main[0];
const callOut=rd0['Alternate Call openrouter'][0].data.main[0]; // [grok aborted, argon reply]
const sumP=o=>o.map(x=>({seat:x.json.alt&&x.json.alt.seat,ok:x.json.ok,why:x.json.why,len:JSON.stringify(x.json).length}));
(async()=>{
 const res={};const keep={};
 for(const [cname,E] of [['as run',early],['none early',[]],['all early (plant)',null]]){
  let Eitems=E;
  if(E===null){ // plant: a stored reply for sol too, built from argon's actual reply and sol's payload hash
   const ABlive=await runNode(LV,rd0,'Alternate Build',null,{'Get Early Alternate':wrap(early)});
   const e4h=s=>{s=String(s);let a=0x811c9dc5,b=0x01000193^0x9e3779b9;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a^=c;a=Math.imul(a,0x01000193)>>>0;b^=c;b=Math.imul(b,0x01000193)>>>0;b^=b>>>13;}return a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');};
   const sol=ABlive.find(x=>x.json.alt&&x.json.alt.removed_seat==='sol');Eitems=[...early,{json:{seat_for:'sol',payload_sha:e4h(JSON.stringify(sol.json.alt.body)),reply:callOut[1].json,error:null}}];}
  const over={'Get Early Alternate':wrap(Eitems)};
  const out={};
  for(const [wn,W] of [['live',LV],['pkg',PK]]){
   const AB=await runNode(W,rd0,'Alternate Build',null,over);
   const toEarly=AB.filter(x=>x.json.early_all===true),toCall=AB.filter(x=>x.json.early_all!==true);
   const allEarly=AB.filter(x=>x.json.alt&&!x.json.alt.skip).every(x=>x.json.early_all===true);
   // the call branch: the stored call output of the same seat (grok's re-call aborted in the run; argon answered)
   const callFor=x=>callOut[AB.filter(z=>z.json.alt&&!z.json.alt.skip).indexOf(x)]?callOut[rd0['Alternate Build'][0].data.main[0].findIndex(z=>z.json.alt.removed_seat===x.json.alt.removed_seat)]:null;
   const callItems=toCall.map(callFor);
   let input,via;
   if(wn==='live'){if(toEarly.length&&!toCall.length){input=toEarly.map(x=>({json:x.json.__early_reply}));via='Early Alternate Reply';}else{input=AB.map(callFor);via='Alternate Call (all items)';}}
   else{ if(toCall.length){input=callItems;via='Alternate Call ('+toCall.length+' item(s)); Early Alternate Reply '+toEarly.length+' item(s) stops at Early All? (false)';} else {input=toEarly.map(x=>({json:x.json.__early_reply}));via='Early Alternate Reply -> Early All? (true)';} }
   const P=await runNode(W,rd0,'Alternate Payloads',input,{...over,'Alternate Build':wrap(AB)});
   out[wn]={early_marked:toEarly.map(x=>x.json.alt.removed_seat),called:(wn==='live'&&!(toEarly.length&&!toCall.length))?AB.map(x=>x.json.alt.seat):toCall.map(x=>x.json.alt.seat),allEarly,via,payloads:sumP(P),P};
  }
  // equality of the argon payload between live and pkg
  const eq=s=>JSON.stringify((out.live.P.find(x=>x.json.alt.seat===s)||{}).json)===JSON.stringify((out.pkg.P.find(x=>x.json.alt.seat===s)||{}).json);
  keep[cname]=out;console.log('\n== '+cname);for(const wn of ['live','pkg']){const o=out[wn];console.log(wn.padEnd(4),'early:',JSON.stringify(o.early_marked),'| called:',JSON.stringify(o.called),'| via:',o.via);console.log('     payloads',JSON.stringify(o.payloads));}
  console.log('     argon payload equal live/pkg:',eq('argon'),'| grok payload equal live/pkg:',eq('grok'));
 }
 const g=(c,w)=>JSON.stringify((keep[c][w].P.find(x=>x.json.alt.seat==='grok')||{}).json);console.log('\npkg as-run grok payload equals live all-early grok payload (the early path today):',g('as run','pkg')===g('all early (plant)','live'));
})().catch(e=>{console.error(e);process.exit(1);});
