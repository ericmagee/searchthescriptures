import json
code_check=r"""const REQ=['state','pass','seat','alt','lib','parent_exec'];
return $input.all().map(it=>{const j=it.json;const miss=REQ.filter(k=>j[k]===undefined||j[k]===null||j[k]==='');
 if(miss.length)throw new Error('ASK 379 input check: missing input '+miss.join(', '));
 if(j.fail===true)throw new Error('planted failure in pass '+j.pass);
 return {json:j};});"""
code_cure=r"""return $input.all().map(it=>({json:{...it.json,cure:'cure of pass '+it.json.pass}}));"""
code_join=r"""const ce=$('Cure Node').isExecuted;let cv=null;try{cv=ce?$('Cure Node').first().json.cure:null;}catch(e){cv='read error: '+e.message;}
const j=$input.first().json;
return [{json:{pass:j.pass,seat:j.seat,alt:j.alt,cureFromItem:j.cure||null,cureNodeExecuted:ce,cureNodeRead:cv,parent_exec:j.parent_exec,child_exec:$execution.id,libLen:String(j.lib).length,result:j.alt==='seatme'?'SEATED':'NOT SEATED',why:'scratch pass '+j.pass}}];"""
W={"name":"W4 scratch ASK 379 child (one alternate pass)","nodes":[
 {"id":"c0","name":"In","type":"n8n-nodes-base.executeWorkflowTrigger","typeVersion":1.1,"position":[0,0],"parameters":{"inputSource":"passthrough"}},
 {"id":"c1","name":"Check Inputs","type":"n8n-nodes-base.code","typeVersion":2,"position":[200,0],"parameters":{"jsCode":code_check}},
 {"id":"c2","name":"Cure If","type":"n8n-nodes-base.if","typeVersion":2,"position":[400,0],"parameters":{"conditions":{"options":{"caseSensitive":True,"leftValue":"","typeValidation":"loose"},"conditions":[{"id":"k1","leftValue":"={{ $json.skipCure !== true }}","rightValue":True,"operator":{"type":"boolean","operation":"true","singleValue":True}}],"combinator":"and"},"options":{}}},
 {"id":"c3","name":"Cure Node","type":"n8n-nodes-base.code","typeVersion":2,"position":[600,-100],"parameters":{"jsCode":code_cure}},
 {"id":"c4","name":"Join","type":"n8n-nodes-base.code","typeVersion":2,"position":[800,0],"parameters":{"jsCode":code_join}}],
 "connections":{"In":{"main":[[{"node":"Check Inputs","type":"main","index":0}]]},"Check Inputs":{"main":[[{"node":"Cure If","type":"main","index":0}]]},
  "Cure If":{"main":[[{"node":"Cure Node","type":"main","index":0}],[{"node":"Join","type":"main","index":0}]]},"Cure Node":{"main":[[{"node":"Join","type":"main","index":0}]]}},
 "settings":{"executionOrder":"v1","callerPolicy":"workflowsFromSameOwner"}}
json.dump(W,open('child.json','w'))
