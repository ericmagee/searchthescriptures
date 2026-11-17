// Scratch replay of one pass in n8n: the built child, with every call node (HTTP and sub-workflow) swapped for a code node that returns the run's stored output.
const fs=require('fs');const [CHILDF,EX,TAG,OUTC,OUTP,INF,CHILDID]=process.argv.slice(2);const C=JSON.parse(fs.readFileSync(CHILDF));const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const pinned=[];
C.nodes=C.nodes.map(n=>{if(n.type==='n8n-nodes-base.httpRequest'||(n.type==='n8n-nodes-base.executeWorkflow')){const r=RD[n.name];const it=r?((r[r.length-1].data||{}).main||[[]])[0]||[]:null;pinned.push([n.name,it?it.length:'not run']);
 return {id:n.id,name:n.name,type:'n8n-nodes-base.code',typeVersion:2,position:n.position,parameters:{jsCode:'// REPLAY PIN of stored output\nreturn '+JSON.stringify((it||[]).map(i=>({json:i.json})))+';'}};}return n;});
C.name='W4 scratch ASK 379 child replay '+TAG;C.settings={executionOrder:'v1',callerPolicy:'workflowsFromSameOwner'};
fs.writeFileSync(OUTC,JSON.stringify({name:C.name,nodes:C.nodes,connections:C.connections,settings:C.settings}));console.log('pinned',JSON.stringify(pinned));
if(CHILDID){const inp=JSON.parse(fs.readFileSync(INF));
 const P={name:'W4 scratch ASK 379 parent replay '+TAG,nodes:[{id:'m',name:'Manual',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0],parameters:{}},{id:'l',name:'Load',type:'n8n-nodes-base.code',typeVersion:2,position:[200,0],parameters:{jsCode:'return [{json:{}}];'}},
  {id:'c',name:'Alternate Pass Call',type:'n8n-nodes-base.executeWorkflow',typeVersion:1.2,position:[400,0],onError:'continueRegularOutput',parameters:{source:'database',workflowId:{__rl:true,mode:'id',value:CHILDID},mode:'once',options:{waitForSubWorkflow:true},workflowInputs:{mappingMode:'defineBelow',value:{},matchingColumns:[],schema:[],attemptToConvertTypes:false,convertFieldsToString:false}}}],
  connections:{Manual:{main:[[{node:'Load',type:'main',index:0}]]},Load:{main:[[{node:'Alternate Pass Call',type:'main',index:0}]]}},settings:{executionOrder:'v1',availableInMCP:true},pinData:{Load:[{json:inp}]}};
 fs.writeFileSync(OUTP,JSON.stringify(P));console.log('parent bytes',JSON.stringify(P).length);}
