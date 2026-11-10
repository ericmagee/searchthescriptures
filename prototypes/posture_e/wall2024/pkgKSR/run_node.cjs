// Offline: run one library source on an execution's own node data. module: run(srcFile, nodeName, execRunData) -> outputs json array (or {err})
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
module.exports=async function run(code,n,rd,over){const out=k=>over&&over[k]?over[k]:(rd[k]?(rd[k][rd[k].length-1].data||{}).main:null);
 const mk=name=>{const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 const RDt=Date,FX=rd[n][rd[n].length-1].startTime;global.Date=class extends RDt{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};
 const src=(rd[n][rd[n].length-1].source||[])[0];const fd=src&&src.previousNode;const fo=fd&&out(fd)?out(fd)[src.previousNodeOutput||0]||[]:[];
 const $input={first:()=>cl(fo[0]),last:()=>cl(fo[fo.length-1]),all:()=>cl(fo),get item(){return cl(fo[0]);}};
 try{return (await new AF('$','$input','$json','$execution',code)(RM.gate(RM.needs(code),mk),$input,fo[0]&&fo[0].json,{id:'34626'})).map(x=>x.json);}catch(e){return {err:e.message};}finally{global.Date=RDt;}};
