// pkgLIB v2: a model of how the n8n task runner decides which node data a Code node gets (run 33094 crash, W3 grading condition 2).
// It follows n8n's BuiltInsParser (@n8n/task-runner, js-task-runner/built-ins-parser): the code is wrapped in an async function, parsed with acorn,
// and walked. A call $('Literal') adds that node; a call $(non-literal) means "send every node"; $node / $item also mean every node;
// $env, $input/$json, $execution, $prevNode set their own flags. A code text that does not parse falls back to "send everything".
// Code inside a string is NOT seen: that is exactly why the f303dc7 stubs (real code held as string data) got no upstream data.
const acorn=require('./vendor/acorn.cjs');const walk=require('./vendor/walk.cjs');
function needs(code){const st={nodes:new Set(),all:false,env:false,input:false,execution:false,prevNode:false,parsed:true};
 let ast;try{ast=acorn.parse('async function VmCodeWrapper() { '+code+' }',{ecmaVersion:2025,sourceType:'module'});}catch(e){st.parsed=false;st.all=true;return st;}
 walk.ancestor(ast,{
  CallExpression(n){if(n.callee.type!=='Identifier'||n.callee.name!=='$'||!n.arguments.length)return;const a=n.arguments[0];
   if(a.type!=='Literal'){st.all=true;return;}if(typeof a.value==='string')st.nodes.add(a.value);},
  Identifier(n){const k=n.name;if(k==='$env')st.env=true;else if(k==='$item'||k==='$node')st.all=true;else if(k==='$input'||k==='$json')st.input=true;
   else if(k==='$execution')st.execution=true;else if(k==='$prevNode')st.prevNode=true;}});
 return st;}
// $ as the runner leaves it: a node the code text does not name (and no "all") comes back unexecuted, the 33094 error
function gate(st,$){return name=>{if(st.all||st.nodes.has(name))return $(name);const msg="Node '"+name+"' hasn't been executed";
 const t=()=>{throw new Error(msg);};return {isExecuted:false,first:t,last:t,all:t,get item(){return t();},params:undefined};};}
module.exports={needs,gate};
