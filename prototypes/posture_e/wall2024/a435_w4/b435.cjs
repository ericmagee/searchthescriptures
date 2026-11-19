// ASK 435 builder replay (W4, coordinator 05:29Z): run every engine Code node that calls REFP, old (pre-435 engine) and new (post-435 engine),
// on one stored n8n execution. $('X') is answered from the execution's runData (last run of X); $input is the node's own stored input.
// Both sides get the same Resolve Seats additions (enforcer seat, jlabel from the post-429 code), so the only difference is the Shared Library.
// Usage: node b435.cjs EXEC.json OLD_WF.json NEW_WF.json
const fs=require('fs');const [EX,OW,NW]=process.argv.slice(2);
const ex=JSON.parse(fs.readFileSync(EX));const rd=ex.data.resultData.runData;
const wf=f=>{const w=JSON.parse(fs.readFileSync(f));return w.workflow||(w.data&&w.data.nodes?w.data:w);};const O=wf(OW),N=wf(NW);
const outOf=(n,ri)=>{const r=rd[n];if(!r||!r.length)return null;const run=r[ri==null?r.length-1:ri];return ((run.data||{}).main||[[]])[0]||[];};
const JLX=(()=>{const c=N.nodes.find(n=>n.name==='Resolve Seats').parameters.jsCode;const m=c.match(/jlabel:(Object\.fromEntries\(\(judges\|\|\[\]\)[^\n]*?\.filter\(x=>x\[0\]\))/);return m?new Function('judges','return '+m[1]+');'):()=>({});})();
const ENF={seat:'luna',api_model:'openai/gpt-6-luna',max_tokens:64000};
const mk=w=>{const P=Object.fromEntries(w.nodes.map(n=>[n.name,n.parameters||{}]));
 return n=>{let it=outOf(n);if(n==='Resolve Seats'&&it)it=it.map(x=>({...x,json:{...x.json,enforcer:x.json.enforcer||ENF,jlabel:x.json.jlabel||JLX(x.json.judges)}}));const e=!!it;const items=(it||[]).map(x=>({json:x.json,pairedItem:x.pairedItem}));
  return {isExecuted:e,params:P[n],all:()=>{if(!e)throw new Error('node '+n+' not executed');return items;},first:()=>{if(!e)throw new Error('node '+n+' not executed');return items[0];},last:()=>items[items.length-1],item:items[0]};};};
const inputOf=n=>{const r=rd[n][rd[n].length-1];const s=(r.source||[])[0];if(!s)return [];const pr=(rd[s.previousNode]||[])[s.previousNodeRun||0];const o=pr&&((pr.data||{}).main||[])[s.previousNodeOutput||0];return (o||[]).map(x=>({json:x.json}));};
const runNode=async(w,name)=>{const code=w.nodes.find(n=>n.name===name).parameters.jsCode;const $=mk(w);const items=inputOf(name);
 const $input={all:()=>items,first:()=>items[0],item:items[0]};const $execution={id:'replay',customData:{set(){},get(){return null;}}};
 const f=new Function('$','$input','$execution','$json','$items','$now','$workflow','require','return (async()=>{\n'+code+'\n})();');
 return await f($,$input,$execution,items[0]&&items[0].json,()=>items,new Date(),{id:'moMxiV4Irg1uRBZN'},require);};
const names=N.nodes.filter(n=>n.name!=='Shared Library'&&/REFP\.(parse|keys)\(/.test((n.parameters||{}).jsCode||'')).map(n=>n.name);
const tot={nodes:names.length,ran:0,not_run:0,errors:0,equal:0,differ:0};
(async()=>{for(const name of names){if(!rd[name]){tot.not_run++;console.log(name,'| NOT RUN in this execution');continue;}
 let a,b;try{a=await runNode(O,name);b=await runNode(N,name);}catch(e){tot.errors++;console.log(name,'| ERROR',String(e.message).slice(0,160));continue;}
 tot.ran++;const sa=JSON.stringify(a),sb=JSON.stringify(b);if(sa===sb){tot.equal++;console.log(name,'| EQUAL',sa.length,'chars');continue;}
 tot.differ++;console.log(name,'| DIFFER');let i=0;while(sa[i]===sb[i])i++;console.log("   OLD …"+sa.slice(Math.max(0,i-60),i+120));console.log("   NEW …"+sb.slice(Math.max(0,i-60),i+120));const ra=sa.replace(/\*\*Run time:\*\*[^\\]*/g,"RT"),rb=sb.replace(/\*\*Run time:\*\*[^\\]*/g,"RT");console.log("   equal with the Run time line masked:",ra===rb);}
 console.log('TOTAL',JSON.stringify(tot));})();
