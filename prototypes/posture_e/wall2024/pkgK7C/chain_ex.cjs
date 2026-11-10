// W3: replay the chain of code nodes of execution 34626 from Panel Cure Check to Replay Rows, with stored model replies.
// usage: require('./chain.cjs')(candidateWorkflowPath, {hook}) -> {over, rows}
process.chdir(__dirname+'/..');const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const X=JSON.parse(fs.readFileSync((process.env.EX||'/mnt/project-files/wall2024/ex34626_full.json'),'utf8'));const rd=(X.data||X).resultData.runData;
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const ORDER=Object.keys(rd).map(n=>({n,t:rd[n][0].startTime})).sort((a,b)=>a.t-b.t).map(o=>o.n);
const START=ORDER.indexOf('Panel Cure Check'),END=ORDER.indexOf('Replay Rows');
module.exports=async function chain(wfPath,opt){opt=opt||{};const W=g(wfPath);const by={};W.nodes.forEach(n=>by[n.name]=n);const lib=by['Shared Library'].parameters.jsCode;
 const srcOf=n=>by[n].parameters.jsCode; /* the stub itself runs and rebuilds its source from the Shared Library, as in n8n */
 const over=Object.assign({},opt.over||{});const stored=k=>rd[k]?(rd[k][rd[k].length-1].data||{}).main:null;const out=k=>over[k]||stored(k);const log=[];
 for(let i=START;i<=END;i++){const n=ORDER[i];const node=by[n];const type=node.type.replace('n8n-nodes-base.','');const src=(rd[n][rd[n].length-1].source||[])[0];const pn=src&&src.previousNode,po=(src&&src.previousNodeOutput)||0;
  if(opt.before&&opt.before[n])await opt.before[n](over,out);
  if(type==='code'&&!(stored(n)||[]).some(o=>o&&o.length)){/* side branch with no output items in the stored run: kept as stored */}
  else if(type==='code'){const code=srcOf(n);const mk=name=>{if(name==='Shared Library')return {isExecuted:false,params:{jsCode:lib}};const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,params:{}};}return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:(by[name]||{}).parameters||{}};};
   const fo=pn&&out(pn)?out(pn)[po]||[]:[];const $input={first:()=>cl(fo[0]),last:()=>cl(fo[fo.length-1]),all:()=>cl(fo),get item(){return cl(fo[0]);}};
   const RDt=Date,FX=rd[n][rd[n].length-1].startTime;global.Date=class extends RDt{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};
   let res;try{res=await new AF('$','$input','$json','$execution',code)(RM.gate(RM.needs(code),mk),$input,fo[0]&&fo[0].json,{id:process.env.EXID||'34626'});}catch(e){global.Date=RDt;throw new Error(n+': '+e.message);}global.Date=RDt;
   over[n]=[res.map(x=>({json:x.json}))];}
  else if(type==='if'){if(pn&&over[pn]){const st=stored(n);const idx=Math.max(0,st.findIndex(o=>o&&o.length));const arr=st.map(()=>[]);arr[idx]=over[pn][po]||[];over[n]=arr;}}
  /* other node types (model calls, fetches): stored output, unless a hook replaced it */
  if(opt.after&&opt.after[n])await opt.after[n](over,out);}
 const rows=JSON.parse(out('Replay Rows')[0][0].json.body).p_rows;return {over,rows,stored,ORDER};};
module.exports.rd=rd;module.exports.nt=s=>JSON.stringify(s).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/g,'T');
