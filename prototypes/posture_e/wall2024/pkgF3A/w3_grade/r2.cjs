// W3: offline walk of round 2 (never run in 34626) with planted round-2 alternate replies. Each stub runs as n8n runs it.
process.chdir(__dirname+'/../..');const fs=require('fs');const RM=require('../../pkgLIB/runner_model.cjs');
const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=Array.isArray(d)?d[0]:d;d=d.data||d;return d.workflow||d;};
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const FX=rd['Second Alternate?'][0].startTime;
module.exports=function make(wfPath,rdOver){const W=g(wfPath);const by={};W.nodes.forEach(n=>by[n.name]=n);const lib=by['Shared Library'].parameters.jsCode;const over=Object.assign({},rdOver||{});
 const stored=k=>rd[k]?(rd[k][rd[k].length-1].data||{}).main:null;const out=k=>over[k]||stored(k);
 const run=async(n,from)=>{const code=by[n].parameters.jsCode;
  const mk=name=>{if(name==='Shared Library')return {isExecuted:false,params:{jsCode:lib}};const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
   return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:(by[name]||{}).parameters||{}};};
  const fo=from?(out(from)||[[]]).find(o=>o&&o.length)||[]:[];const $input={first:()=>cl(fo[0]),last:()=>cl(fo[fo.length-1]),all:()=>cl(fo),get item(){return cl(fo[0]);}};
  const RDt=Date;global.Date=class extends RDt{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};
  try{const res=await new AF('$','$input','$json','$execution',code)(RM.gate(RM.needs(code),mk),$input,fo[0]&&fo[0].json,{id:'34626'});over[n]=[res.map(x=>({json:x.json}))];return over[n][0].map(x=>x.json);}catch(e){throw new Error(n+': '+e.message);}finally{global.Date=RDt;}};
 const pass=(n,from)=>{over[n]=[cl(out(from).find(o=>o&&o.length)||[])];};
 return {run,pass,over,out,by,rd,cl};};
