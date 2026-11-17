import json,sys
CHILD=sys.argv[1]
start=r"""const scen=[
 {name:'A stale cure: pass 2 skips its cure branch',alts:['a1','a2','a3'],cap:3,plan:{2:{skipCure:true}}},
 {name:'B dropped input in pass 1, then pass 2 runs',alts:['b1','b2'],cap:2,plan:{1:{drop:'lib'}}},
 {name:'C error in pass 2, pass 3 runs, b-alt not re-picked',alts:['c1','c2','c3'],cap:3,plan:{2:{fail:true}}},
 {name:'D cap 2 stops with alternates left',alts:['d1','d2','d3','d4'],cap:2,plan:{}},
 {name:'E seat filled in pass 1 starts no pass 2',alts:['seatme','e2'],cap:3,plan:{}}];
return [{json:{state:{scen,si:0,acc:[],out:[]}}}];"""
nexta=r"""const st=JSON.parse(JSON.stringify($json.state));
for(;;){if(st.si>=st.scen.length)return [{json:{state:st,done:true}}];
 const sc=st.scen[st.si];const mine=st.acc.filter(a=>a.si===st.si);const tried=mine.map(a=>a.alt);
 const filled=mine.some(a=>a.result==='SEATED');const free=sc.alts.filter(a=>tried.indexOf(a)<0);
 let why=null;if(filled)why='the seat is filled';else if(mine.length>=sc.cap)why='the cap of '+sc.cap+' is reached';else if(!free.length)why='no alternate is left';
 if(why){st.out.push({scenario:sc.name,passes:mine.length,stop:why,tries:mine});st.si++;continue;}
 const pass=mine.length+1;const p=sc.plan[pass]||{};const call={state:'x',pass,seat:'S',alt:free[0],lib:'LIBRARY TEXT',parent_exec:$execution.id,skipCure:p.skipCure===true,fail:p.fail===true};if(p.drop)delete call[p.drop];
 return [{json:{state:st,done:false,call}}];}"""
callin=r"""return [{json:$json.call}];"""
acc=r"""const NA=$('Next Alternate?').first().json;const st=JSON.parse(JSON.stringify(NA.state));const r=$input.first().json;
const rec=r.error?{si:st.si,alt:NA.call.alt,pass:NA.call.pass,result:'NOT SEATED',why:'sub-workflow error: '+String(r.error.message||r.error).slice(0,200)}:{si:st.si,alt:NA.call.alt,pass:NA.call.pass,result:r.result,why:r.why,cureFromItem:r.cureFromItem,cureNodeExecuted:r.cureNodeExecuted,cureNodeRead:r.cureNodeRead,parent_exec:r.parent_exec,child_exec:r.child_exec,callAlt:r.alt};
st.acc.push(rec);return [{json:{state:st}}];"""
final=r"""return [{json:{out:$json.state.out}}];"""
def code(i,n,c,x,y): return {"id":i,"name":n,"type":"n8n-nodes-base.code","typeVersion":2,"position":[x,y],"parameters":{"jsCode":c}}
W={"name":"W4 scratch ASK 379 parent (pass loop)","nodes":[
 {"id":"p0","name":"Manual","type":"n8n-nodes-base.manualTrigger","typeVersion":1,"position":[0,0],"parameters":{}},
 code("p1","Start",start,200,0),code("p2","Next Alternate?",nexta,400,0),
 {"id":"p3","name":"Go?","type":"n8n-nodes-base.if","typeVersion":2,"position":[600,0],"parameters":{"conditions":{"options":{"caseSensitive":True,"leftValue":"","typeValidation":"loose"},"conditions":[{"id":"g1","leftValue":"={{ $json.done !== true }}","rightValue":True,"operator":{"type":"boolean","operation":"true","singleValue":True}}],"combinator":"and"},"options":{}}},
 code("p4","Call Input",callin,800,-100),
 {"id":"p5","name":"Alternate Pass Call","type":"n8n-nodes-base.executeWorkflow","typeVersion":1.2,"position":[1000,-100],"onError":"continueRegularOutput","parameters":{"source":"database","workflowId":{"__rl":True,"mode":"id","value":CHILD},"mode":"once","options":{"waitForSubWorkflow":True},"workflowInputs":{"mappingMode":"defineBelow","value":{},"matchingColumns":[],"schema":[],"attemptToConvertTypes":False,"convertFieldsToString":False}}},
 code("p6","Pass Accumulate",acc,1200,-100),code("p7","Final",final,800,150)],
 "connections":{"Manual":{"main":[[{"node":"Start","type":"main","index":0}]]},"Start":{"main":[[{"node":"Next Alternate?","type":"main","index":0}]]},
  "Next Alternate?":{"main":[[{"node":"Go?","type":"main","index":0}]]},"Go?":{"main":[[{"node":"Call Input","type":"main","index":0}],[{"node":"Final","type":"main","index":0}]]},
  "Call Input":{"main":[[{"node":"Alternate Pass Call","type":"main","index":0}]]},"Alternate Pass Call":{"main":[[{"node":"Pass Accumulate","type":"main","index":0}]]},
  "Pass Accumulate":{"main":[[{"node":"Next Alternate?","type":"main","index":0}]]}},
 "settings":{"executionOrder":"v1","availableInMCP":True}}
json.dump(W,open('parent.json','w'))
