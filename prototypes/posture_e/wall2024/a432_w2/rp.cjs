// W2 ASK 432 replay: Citation Scan -> L2 Words -> L2 Lexicon -> L2 Gloss Plan of a workflow file, on stored debates; REST reads answered by get(url).
const cl=x=>JSON.parse(JSON.stringify(x));
const F_=r=>({cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3||null,dr3:r.challenger_r3||null,cr4:r.defender_r4||null,dr4:r.challenger_r4||null,synthesis:r.synthesis||''});
function run(wf,r,get,over,stop){const ns=wf.nodes;const node=n=>ns.find(x=>x.name===n);const M={'Final Output':[{json:F_(r)}]};
 const $=n=>{if(n==='Shared Library'){const x=node(n);return {params:x.parameters,isExecuted:false,first:()=>{throw new Error('ne')},all:()=>{throw new Error('ne')}};}const it=M[n];return it?{isExecuted:true,all:()=>cl(it),first:()=>cl(it[0])}:{isExecuted:false,all:()=>{throw new Error('Node not executed: '+n)},first:()=>{throw new Error('Node not executed: '+n)}};};
 let prev=M['Final Output'];
 for(const n of ['Citation Scan','L2 Words Plan','L2 Words','L2 Lexicon Plan','L2 Lexicon','L2 Gloss Plan']){const x=node(n);let out;
  if(x.type==='n8n-nodes-base.code'){const src=(over&&over[n])||x.parameters.jsCode;out=new Function('$','$input','$execution','$workflow','require',src)($,{all:()=>cl(prev),first:()=>cl(prev[0])},{id:'replay',customData:{set(){},get(){}}},{id:'moMxiV4Irg1uRBZN'},require);}
  else{out=[];for(const it of prev){const R=get(it.json.url);if(R===undefined)return {miss:true,M};if(Array.isArray(R))for(const b of R)out.push({json:b});else out.push({json:R});}if(!out.length&&x.alwaysOutputData)out=[{json:{}}];}
  M[n]=out;prev=out;if(stop===n)break;}
 return {M};}
module.exports={run};
