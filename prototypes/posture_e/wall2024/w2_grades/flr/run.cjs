// W2 grade harness for pkgFLR: run Alternate Merge Seat / R2 Alternate Merge Seat of a workflow file on a stored export, with
// $(name).all(branch, run) honouring the run index (missing run throws, as n8n does) and optional planted runs.
const fs=require('fs');const AF=Object.getPrototypeOf(async function(){}).constructor;
const W={};const wf=f=>W[f]||(W[f]=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8')));
const src=(w,name)=>{const libJs=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;const stub=w.nodes.find(n=>n.name==name).parameters.jsCode;let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');return new Function('$',stub.slice(0,i)+'\nreturn __S;')(n=>({params:{jsCode:libJs}}));};
const RD={};const rdOf=ex=>RD[ex]||(RD[ex]=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+ex,'utf8')).data.resultData.runData);
async function run(file,node,ex,plant){const rd=Object.assign({},rdOf(ex),plant||{});
 const runs=n=>(rd[n]||[]).map(r=>(r.data&&r.data.main||[]).map(o=>(o||[]).map(x=>({json:x.json}))));
 const $=n=>{const R=runs(n);const pick=(b,r)=>{if(!R.length)throw new Error('node '+n+' has not run');const ri=r==null?R.length-1:r;if(ri<0||ri>=R.length)throw new Error('Run '+ri+' of node "'+n+'" not found');return R[ri][b||0]||[];};
  return {isExecuted:R.length>0,all:(b,r)=>pick(b,r),first:(b,r)=>{const a=pick(b,r);if(!a.length)throw new Error('no item');return a[0];},last:()=>{const a=pick();return a[a.length-1];},get item(){return pick()[0];},params:{}};};
 const prevName=Object.keys(wf(file).connections).find(k=>wf(file).connections[k].main.some(o=>(o||[]).some(x=>x.node===node)));
 const inp={all:()=>{try{return $(prevName).all();}catch(e){return [];}},first:()=>$(prevName).first(),item:{json:{}}};
 const s=src(wf(file),node);const f=new AF('$','$input','$json','$node','$execution','$env','$items','$now',s);
 try{return await f($,inp,{},{},{id:'x',mode:'production'},{},()=>[],new Date(0));}catch(e){return 'ERR '+e.message;}}
const mask=v=>JSON.stringify(v).replace(/\d{4}-\d\d-\d\dT[\d:.]+Z?/g,'T');
module.exports={run,mask,rdOf};
