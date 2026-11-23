// ASK 531 (W4): replay named nodes on stored run data with one workflow and compare each output with the recorded output.
// Usage: node fidelity531.js <workflow.json> <runfiles comma list> <node1,node2,...>
const fs=require('fs');const [,,W0,RUNS,NODES]=process.argv;
const RD0={};for(const f of RUNS.split(',')){const J=JSON.parse(fs.readFileSync(f,'utf8'));const r=J.runData||(J.data&&J.data.resultData||J).runData;Object.assign(RD0,r);}
const W=JSON.parse(fs.readFileSync(W0,'utf8'));const node=n=>W.nodes.find(y=>y.name===n);
const noT=v=>JSON.parse(JSON.stringify(v),(k,x)=>(k==='at'||k==='ts'||k==='created_at')?'(time)':x);
(async()=>{const RD=JSON.parse(JSON.stringify(RD0));const rec=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
 for(const NODE of NODES.split(',')){const r=RD[NODE];const recOut=noT(rec(NODE).map(x=>({json:x.json})));
  const $=n=>{if(n==='Shared Library')return {params:{jsCode:node('Shared Library').parameters.jsCode}};const it=rec(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
  const src=r[r.length-1].source;const inp=src&&src[0]?rec(src[0].previousNode,src[0].previousNodeRun):[];const $input={all:()=>inp||[],first:()=>(inp||[])[0],get item(){return (inp||[])[0];}};
  let res;try{res=await new Function('$','$input','return (async()=>{\n'+node(NODE).parameters.jsCode+'\n})();')($,$input);}catch(e){res=[{json:{__error:String(e.stack||e.message).slice(0,800)}}];}
  const got=noT(res.map(x=>({json:x.json})));const a=JSON.stringify(recOut),b=JSON.stringify(got);
  let diff='';if(a!==b){const ka=recOut.map(x=>Object.keys(x.json)),kb=got.map(x=>Object.keys(x.json));diff=' items '+recOut.length+'/'+got.length+'; keys differ: '+[...new Set(got.flatMap((x,i)=>Object.keys(x.json).filter(k=>JSON.stringify((recOut[i]||{json:{}}).json[k])!==JSON.stringify(x.json[k]))))].join(',');}
  console.log(NODE,a===b?'BYTE-EQUAL to recorded':'DIFFERS'+diff,(got[0]&&got[0].json&&got[0].json.__error)||'');}})();
