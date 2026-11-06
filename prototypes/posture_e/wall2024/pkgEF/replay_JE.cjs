// Replay Judge Enforcer Build offline on a run's saved Panel Cure Check (and cure rounds). Usage: node pkgEF/replay_JE.cjs <pkgDir> <run>
// Init Seats and Resolve Seats are stubbed (run_token, a DeepSeek model row); the node only builds items and code rows, it calls no model.
const fs=require('fs');const {load}=require('../corpus/replay_node.cjs');
function run(pkg,r,file){const N=load(r);const src=fs.readFileSync(pkg+'/patched/'+(file||'Judge_Enforcer_Build')+'.js','utf8');
 const stub={'Init Seats':[{run_token:'replay-'+r}],'Resolve Seats':[{deepseek:{api_model:'stub'}}]};
 const $=name=>{const runs=N.nodes[name];const items=runs?runs[runs.length-1]:stub[name];if(!items)return {isExecuted:false,first:()=>{throw new Error('node not saved: '+name);},all:()=>{throw new Error('x');}};
  return {isExecuted:true,first:()=>({json:items[0]}),all:()=>items.map(j=>({json:j})),item:{json:items[0]}};};
 const $input={first:()=>({json:{}}),all:()=>[],item:{json:{}}};
 return new Function('$','$input','$json',src)($,$input,{});}
module.exports={run};
if(require.main===module){const [pkg,r]=process.argv.slice(2);const o=run(pkg,+r);console.log(JSON.stringify(o).slice(0,1500));}
