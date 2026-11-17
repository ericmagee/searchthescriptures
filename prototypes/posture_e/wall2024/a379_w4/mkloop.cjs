// ASK 379 scratch loop: the target's own Second Alternate?, Second Alternate Needed?, Alternate Pass Call (mapped input), Pass Accumulate and Alternate Merge,
// fed by code stubs that return the stored run's items for every engine node they read; the call goes to a replay child (recorded replies pinned).
const fs=require('fs');const [TGT,EX,TAG,OUTP,CHILDID]=process.argv.slice(2);const T=JSON.parse(fs.readFileSync(TGT));const N=Object.fromEntries(T.nodes.map(n=>[n.name,n]));
const RD=JSON.parse(fs.readFileSync(EX)).data.resultData.runData;const out=n=>{const r=RD[n];return r?((r[r.length-1].data||{}).main||[[]])[0]||[]:null;};
const x=N['Alternate Pass Call'].parameters.workflowInputs.value.pass;const HOLD=[...new Set([...x.matchAll(/\$\("([^"]+)"\)/g)].map(m=>m[1]))];
const STUBS=[...HOLD,'Alternate Merge 1'].filter((v,i,a)=>a.indexOf(v)===i);const nodes=[{id:'m',name:'Manual',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0],parameters:{}}];const C={};
const link=(a,b,o=0)=>{C[a]=C[a]||{main:[]};while(C[a].main.length<=o)C[a].main.push([]);C[a].main[o].push({node:b,type:'main',index:0});};
let prev='Manual',k=0;const ran=STUBS.filter(n=>out(n)),notRun=STUBS.filter(n=>!out(n));if(!out('Alternate Merge 1'))throw new Error('no Alternate Merge 1');
for(const n of ran.filter(n=>n!=='Alternate Merge 1').concat(['Alternate Merge 1'])){nodes.push({id:'s'+(k++),name:n,type:'n8n-nodes-base.code',typeVersion:2,position:[200+k*20,0],parameters:{jsCode:'// SCRATCH STUB: the stored items of this engine node\nreturn '+JSON.stringify(out(n).map(i=>({json:i.json})))+';'}});link(prev,n);prev=n;}
for(const n of notRun)nodes.push({id:'s'+(k++),name:n,type:'n8n-nodes-base.code',typeVersion:2,position:[200+k*20,400],parameters:{jsCode:'return [];'}}); // present, never run
for(const n of ['Second Alternate?','Second Alternate Needed?','Alternate Pass Call','Pass Accumulate','Alternate Merge']){const c=JSON.parse(JSON.stringify(N[n]));if(n==='Alternate Pass Call')c.parameters.workflowId.value=CHILDID;nodes.push(c);}
link('Alternate Merge 1','Second Alternate?');link('Second Alternate?','Second Alternate Needed?');link('Second Alternate Needed?','Alternate Pass Call',0);link('Second Alternate Needed?','Alternate Merge',1);link('Alternate Pass Call','Pass Accumulate');link('Pass Accumulate','Second Alternate?');
const P={name:'W4 scratch ASK 379 loop '+TAG,nodes,connections:C,settings:{executionOrder:'v1',availableInMCP:true}};fs.writeFileSync(OUTP,JSON.stringify(P));
console.log('stubs run',ran.length,'present not run',notRun.length,'bytes',JSON.stringify(P).length,'SAN true->',JSON.stringify(T.connections['Second Alternate Needed?'].main.map(o=>o.map(e=>e.node))));
