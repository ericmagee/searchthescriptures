const fs=require('fs');
const cl=x=>JSON.parse(JSON.stringify(x));
const AF=Object.getPrototypeOf(async function(){}).constructor;
let RD=null;
function loadRD(){ if(RD) return RD; const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')); RD=(j.data&&j.data.resultData||j.resultData).runData; return RD;}
function libFor(ver){let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s'+ver+'.json'));d=d.data||d;d=d.workflow||d;return d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;}
function src(t,name){const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')))[name];const o=[];for(const p of M.p){if(typeof p==='number')o.push(L[p]);else if(typeof p[0]==='string')o.push(p[0]);else for(let i=p[0];i<=p[1];i++)o.push(L[i]);}const s=o.join('\n');if(s.length!==M.n)throw new Error('len mismatch '+s.length+' '+M.n);return s;}
async function run(code,nodeName,libText){
  const rd=loadRD();
  const out=k=>rd[k]?(rd[k][rd[k].length-1].data||{}).main:null;
  const mk=name=>{const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;
   if(name==='Shared Library')return {isExecuted:true,params:{jsCode:libText},first:()=>({json:{}}),last:()=>({json:{}}),all:()=>[{json:{}}]};
   if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
   return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
  const RDt=Date,FX=rd[nodeName][rd[nodeName].length-1].startTime;
  global.Date=class extends RDt{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};
  const s=(rd[nodeName][rd[nodeName].length-1].source||[])[0];const fd=s&&s.previousNode;const fo=fd&&out(fd)?out(fd)[(s&&s.previousNodeOutput)||0]||[]:[];
  const $input={first:()=>cl(fo[0]),last:()=>cl(fo[fo.length-1]),all:()=>cl(fo),get item(){return cl(fo[0]);}};
  try{ const r=await new AF('$','$input','$json','$execution',code)(mk,$input,fo[0]&&fo[0].json,{id:'35067'}); return r.map(x=>x.json);}
  catch(e){return {err:e.message,stack:String(e.stack).split('\n').slice(0,5).join(' / ')};}
  finally{global.Date=RDt;}
}
module.exports={run,libFor,src,loadRD};
