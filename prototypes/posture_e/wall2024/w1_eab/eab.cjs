// W1: Early Alternate Build replay, s126 vs s127, full stub code with each version's own Shared Library; plus the rebuilt Alternate Build source run bare (no catch).
const fs=require('fs');const RM=require('../pkgLIB/runner_model.cjs');const P='/mnt/project-files/wall2024/';
const cl=x=>JSON.parse(JSON.stringify(x));const AF=Object.getPrototypeOf(async function(){}).constructor;
const rdw=f=>{let w=JSON.parse(fs.readFileSync(P+f,'utf8'));w=w.data||w;return w.workflow||w;};
const V={s126:rdw('prewrite_s127_DCT.json'),s127:rdw('fetchback_live_s127.json')};
const libOf=w=>w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const stubOf=(w,n)=>w.nodes.find(x=>x.name===n).parameters.jsCode;
const rebuilt=(w,entry)=>{const T=libOf(w);const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')))[entry];return M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');};
async function run(code,n,rd,lib){const out=k=>rd[k]?(rd[k][rd[k].length-1].data||{}).main:null;
 const mk=name=>{if(name==='Shared Library')return {isExecuted:true,params:{jsCode:lib},first:()=>({json:{}}),all:()=>[]};const m=out(name);const it=m?m.find(o=>o&&o.length)||m[0]||[]:null;if(it===null){const no=()=>{throw new Error('Referenced node is unexecuted: '+name);};return {isExecuted:false,first:no,last:no,all:no,get item(){return no();},params:{}};}
  return {isExecuted:true,first:()=>cl(it[0]),last:()=>cl(it[it.length-1]),all:()=>cl(it),get item(){return cl(it[0]);},params:{}};};
 const RDt=Date,FX=rd[n][rd[n].length-1].startTime;global.Date=class extends RDt{constructor(...a){a.length?super(...a):super(FX);}static now(){return FX;}};
 const src=(rd[n][rd[n].length-1].source||[])[0];const fd=src&&src.previousNode;const fo=fd&&out(fd)?out(fd)[(src&&src.previousNodeOutput)||0]||[]:[];
 const $input={first:()=>cl(fo[0]),last:()=>cl(fo[fo.length-1]),all:()=>cl(fo),get item(){return cl(fo[0]);}};
 try{const r=await new AF('$','$input','$json','$execution',code)(RM.gate(RM.needs(code),mk),$input,fo[0]&&fo[0].json,{id:'x'});return r.map(x=>x.json);}catch(e){return {err:e.message};}finally{global.Date=RDt;}}
const strip=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));let t=0,eq=0,ne=0;
 console.log('runner needs, s126 stub:',JSON.stringify([...RM.needs(stubOf(V.s126,'Early Alternate Build')).nodes]),'all:',RM.needs(stubOf(V.s126,'Early Alternate Build')).all);
 console.log('runner needs, s127 stub:',JSON.stringify([...RM.needs(stubOf(V.s127,'Early Alternate Build')).nodes]),'all:',RM.needs(stubOf(V.s127,'Early Alternate Build')).all);
 for(const e of ex){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;if(!rd['Early Alternate Build'])continue;
  const stored=(rd['Early Alternate Build'].slice(-1)[0].data?.main?.[0]||[]).length;
  const o={};for(const v of ['s126','s127'])o[v]=await run(stubOf(V[v],'Early Alternate Build'),'Early Alternate Build',rd,libOf(V[v]));
  // bare: the rebuilt Alternate Build source, run with no catch, as the stub would run it
  const b={};for(const v of ['s126','s127']){const S=rebuilt(V[v],'Alternate Build');b[v]=await run('if(false){$(String());} return await new Function("$","$input","return (async()=>{\\n"+'+JSON.stringify(S)+'+"\\n})();")($,$input);','Early Alternate Build',rd,libOf(V[v]));}
  t++;const same=strip(o.s126)===strip(o.s127),bsame=strip(b.s126)===strip(b.s127);if(same&&bsame)eq++;const n127=Array.isArray(o.s127)?o.s127.length:'ERR';if(n127>0)ne++;if(stored&&Array.isArray(o.s127)){const st=rd["Early Alternate Build"].slice(-1)[0].data.main[0].map(x=>x.json);console.log("  vs stored: payload_sha equal",st[0].early.payload_sha===o.s127[0].early.payload_sha,"body_sent equal",JSON.stringify(st[0].alt.body_sent)===JSON.stringify(o.s127[0].alt.body_sent));}
  console.log(e,'stored items',stored,'| stub out s126',Array.isArray(o.s126)?o.s126.length:o.s126.err,'s127',n127,'equal',same,'| bare Alternate Build code s126',Array.isArray(b.s126)?b.s126.length:'ERR '+b.s126.err,'s127',Array.isArray(b.s127)?b.s127.length:'ERR '+b.s127.err,'equal',bsame);}
 console.log('runs',t,'all equal',eq,'runs with an early alternate on s127',ne);})();
