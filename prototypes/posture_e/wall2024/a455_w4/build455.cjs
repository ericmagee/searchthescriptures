// ASK 455 rev 1 (W4) parts A to C (rev 2 of part A: Resolve Seats no longer requires the deepseek row; the three builders are not touched): node edits on the engine (after lib_apply has applied pairs_455.json to both libraries).
// Usage: node build455.cjs ENG_IN.json ENG_OUT.json   Each edit's old text must occur exactly the stated number of times in that node.
const fs=require('fs');const [IN,OUT]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));w=w.data&&w.data.nodes?w.data:w;
const E=[
 ['Resolve Seats',"const ds=need('deepseek');const enf=need('luna');","const enf=need('luna');const ds=M['deepseek']||enf;",1],
 ['Assume Check Record',"'DEEPSEEK '+f.deepseek","'ENFORCER '+f.deepseek",null],
 ['Assume Check Record',"cure_reason:'DEEPSEEK: '+f.deepseek","cure_reason:'ENFORCER: '+f.deepseek",null],
 ['Enforcer Build',"'no DeepSeek model_config row'","'no ENFORCER model_config row'",1],
 ['Anticheat Build',"'no DeepSeek model_config row'","'no ENFORCER model_config row'",1],
 ['Close Enforcer Build',"'no DeepSeek model_config row'","'no ENFORCER model_config row'",1],
 ['Judge Contradiction Build',"'no DeepSeek model_config row'","'no ENFORCER model_config row'",1],
 ['Assume Check Build',"'no DeepSeek model_config row'","'no ENFORCER model_config row'",1],
];
for(const [nm,o,n,cnt] of E){const x=w.nodes.find(q=>q.name===nm);if(!x)throw new Error('no node '+nm);const c=x.parameters.jsCode;const k=c.split(o).length-1;
 if(cnt!==null&&k!==cnt||k<1)throw new Error('REFUSE '+nm+': "'+o.slice(0,50)+'" found '+k);x.parameters.jsCode=c.split(o).join(n);console.log(nm,'x'+k);}
fs.writeFileSync(OUT,JSON.stringify(w));
