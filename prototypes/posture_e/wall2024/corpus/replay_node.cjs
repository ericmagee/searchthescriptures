// Run a whole n8n Code node offline on a run's saved inputs. Usage: node corpus/replay_node.cjs <pkgDir> <run> [node file, default Panel_Cure_Check]
// $(name) serves the saved outputs in corpus/raw/nodes_<run>.json.gz (last execution of each node). Returns the node's items.
const fs=require('fs'),zlib=require('zlib');
function load(run){return JSON.parse(zlib.gunzipSync(fs.readFileSync('corpus/raw/nodes_'+run+'.json.gz')));}
function mock(N){return name=>{const runs=N.nodes[name];if(!runs){return {isExecuted:false,first:()=>{throw new Error('node not saved: '+name);},all:()=>{throw new Error('node not saved: '+name);}};}
 const items=runs[runs.length-1]||[];return {isExecuted:true,first:()=>({json:items[0]}),last:()=>({json:items[items.length-1]}),all:()=>items.map(j=>({json:j})),item:{json:items[0]}};};}
function runNode(pkg,run,file){const N=load(run);const src=fs.readFileSync(pkg+'/patched/'+file+'.js','utf8');const $=mock(N);const $input={first:()=>({json:{}}),all:()=>[],item:{json:{}}};
 return new Function('$','$input','$json',src)($,$input,{});}
module.exports={load,runNode};
if(require.main===module){const [pkg,run,file]=process.argv.slice(2);const out=runNode(pkg,run,file||'Panel_Cure_Check');console.log(JSON.stringify(out).slice(0,500));}
