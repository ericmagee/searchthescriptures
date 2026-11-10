// W2 form-loss scan: runs the live s108 enforcer record steps on every stored run (inputs/) and saves their outputs.
// Usage (from wall2024/): node study_form_loss/run_records.cjs <out dir>
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');const D='/mnt/project-files/wall2024/inputs/';
const Ld=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const w=Ld('/mnt/project-files/wall2024/fetchback_live_s108.json');const LIB=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const OUT=process.argv[2];fs.mkdirSync(OUT,{recursive:true});
const NODES={'Enforcer Record':'Enforcer Call deepseek','Anticheat Record':'Anticheat Call deepseek','Judge Enforcer Record':'Judge Enforcer Call deepseek','Alt Judge Enforcer Record':'Alt Judge Enforcer Call deepseek'};
const feeder=n=>Object.entries(w.connections).filter(([k,v])=>(v.main||[]).some(o=>(o||[]).some(c=>c.node===n))).map(([k])=>k);
const saved=(run,n)=>{const f=D+run+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return null;const d=JSON.parse(fs.readFileSync(f,'utf8'));const r=Array.isArray(d)?d[0]:d;if(!r)return null;const m=(r.data&&r.data.main)||r.main;return (m&&m[0])||[];};
const cl=x=>JSON.parse(JSON.stringify(x));
const mk=run=>name=>{if(name==='Shared Library')return {isExecuted:true,params:{jsCode:LIB}};const it=saved(run,name);
 if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
 return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
const AF=Object.getPrototypeOf(async function(){}).constructor;
const runs=fs.readdirSync(D).filter(f=>/_index\.json$/.test(f)).map(f=>f.split('_')[0]).sort();
(async()=>{for(const [node,call] of Object.entries(NODES)){let code=w.nodes.find(n=>n.name===node).parameters.jsCode;if(/^\/\/ pkgLIB stub/.test(code))code=rebuild(code,LIB);
  let n=0;
  for(const run of runs){if(saved(run,call)===null)continue;const inNode=[call.replace(' Call',' Retry Call'),call].concat(feeder(node)).find(x=>saved(run,x)!==null);const inp=saved(run,inNode)||[];
   const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
   let res;try{const $=RM.gate(RM.needs(code),mk(run));res={ok:true,out:await new AF('$','$input','$json','$execution',code)($,$input,inp[0]&&inp[0].json,{id:run})};}catch(e){res={ok:false,err:String(e&&e.message||e)};}
   fs.writeFileSync(OUT+'/'+run+'_'+node.replace(/ /g,'_')+'.json',JSON.stringify({run,node,input_node:inNode,...res}));n++;}
  console.log(node,n,'runs');}})();
