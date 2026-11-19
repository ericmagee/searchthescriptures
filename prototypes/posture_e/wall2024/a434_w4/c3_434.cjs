// ASK 434 C3 (W4): run the merge nodes that call cureSupHead, old (pre-434) and new (post-434), on one stored n8n execution; compare with the SUPERSEDED head masked; count changed heads.
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
const names=N.nodes.filter(n=>/cureSupHead|Alternate Merge|Cure Check/.test(n.name+'|'+((n.parameters||{}).jsCode||''))&&n.name!=='Shared Library'&&(n.parameters||{}).jsCode).map(n=>n.name);
const HRE=/SUPERSEDED BY (CURE|SEND-BACK|RECOMPUTE): verdict ([A-Z-]+) to ([A-Z-]+); see the (?:cure|send-back|recompute) lines below/g;
const AT=/"at":"\d{4}-\d\d-\d\dT[\d:.]+Z"/g;const mask=t=>t.replace(AT,'"at":"T"').replace(HRE,'SUPERSEDED BY <STEP>: verdict $2 to $3; see the <step> lines below');
const tot={nodes:names.length,ran:0,not_run:0,errors:0,equal:0,equal_masked:0,differ:0,heads_old:0,heads_new:0,heads_changed:0};const steps={};
(async()=>{for(const name of names){if(!rd[name]){tot.not_run++;console.log(name,'| NOT RUN in this execution');continue;}
 let a,b;try{a=await runNode(O,name);b=await runNode(N,name);}catch(e){tot.errors++;console.log(name,'| ERROR',String(e.message).slice(0,160));continue;}
 tot.ran++;const sa=JSON.stringify(a),sb=JSON.stringify(b);const ha=[...sa.matchAll(HRE)],hb=[...sb.matchAll(HRE)];tot.heads_old+=ha.length;tot.heads_new+=hb.length;
 if(sa.replace(AT,'')===sb.replace(AT,'')){tot.equal++;console.log(name,'| EQUAL',sa.length,'chars | heads',ha.length);continue;}
 if(mask(sa)===mask(sb)){tot.equal_masked++;const ch=hb.filter((h,i)=>!ha[i]||ha[i][0]!==h[0]);tot.heads_changed+=ch.length;ch.forEach(h=>steps[h[1]]=(steps[h[1]]||0)+1);
  console.log(name,'| EQUAL EXCEPT HEAD |',ha.map(h=>h[0]).join(' || '),'=>',hb.map(h=>h[0]).join(' || '));continue;}
 tot.differ++;console.log(name,'| DIFFER BEYOND THE HEAD');let i=0;const ma=mask(sa),mb=mask(sb);while(ma[i]===mb[i])i++;console.log('   OLD …'+ma.slice(Math.max(0,i-150),i+250));console.log('   NEW …'+mb.slice(Math.max(0,i-150),i+250));}
 console.log('TOTAL',JSON.stringify(tot),'changed heads by step',JSON.stringify(steps));})();
