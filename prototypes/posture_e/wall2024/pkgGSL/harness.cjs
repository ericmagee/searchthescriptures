const fs=require('fs');const D='/mnt/project-files/wall2024/inputs/';const rd=f=>fs.readFileSync(f,'utf8');
function harness(RUN,over){const cache={};const saved=n=>{if(over&&n in over)return over[n];if(n in cache)return cache[n];const f=D+RUN+'_'+n.replace(/ /g,'_')+'.json';if(!fs.existsSync(f))return cache[n]=null;const d=JSON.parse(rd(f));const r=Array.isArray(d)?d[0]:d;const m=(r.data&&r.data.main)||r.main;return cache[n]=(m&&m[0])||[];};
 const cl=x=>JSON.parse(JSON.stringify(x));const mk=n=>{const it=saved(n);if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+n);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 return (code,inputNode)=>{const inp=saved(inputNode)||[];const $input={first:()=>cl(inp[0]),last:()=>cl(inp[inp.length-1]),all:()=>cl(inp),get item(){return cl(inp[0]);}};
  const RD=Date,FIX=new RD('2026-11-07T03:10:18.511Z').getTime();class FD extends RD{constructor(...a){a.length?super(...a):super(FIX);}static now(){return FIX;}}global.Date=FD;
  try{return new Function('$','$input','$json','$execution','$workflow',code)(mk,$input,inp[0]&&inp[0].json,{id:RUN,customData:{set:()=>{},get:()=>undefined}},{id:'w'});}finally{global.Date=RD;}};}
const live=(f,n)=>JSON.parse(rd(f)).nodes.find(z=>z.name===n).parameters.jsCode;
const feeder=(f,n)=>{const c=JSON.parse(rd(f)).connections;return Object.entries(c).filter(([k,v])=>JSON.stringify(v).includes('"'+n+'"')).map(([k])=>k);};
module.exports={harness,live,feeder,rd,D};
