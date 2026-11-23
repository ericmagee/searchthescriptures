// ASK 519 (W4): per seat, the K-W and K-S3 items a node raises with the 517 library (base) and the 519 library, from a run's recorded inputs.
const fs=require('fs');const [,,RUNF,...NODES]=process.argv;
const J=JSON.parse(fs.readFileSync(RUNF,'utf8'));const RD=(J.data&&J.data.resultData||J).runData;
const WB=JSON.parse(fs.readFileSync('/mnt/project-files/ask517/w1/target_engine_517.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_engine_519.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const rdItems=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const mk$=W=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const it=rdItems(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,input)=>{const $=mk$(W);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
const grab=o=>{const out=[];const walk=(v,path)=>{if(Array.isArray(v)){v.forEach((x,i)=>walk(x,path));return;}if(v&&typeof v==='object'){if((v.rule==='K-W'||v.rule==='K-S3')&&typeof v.line==='string')out.push(path+' | '+v.rule+' | '+v.link+' | '+v.line);for(const k of Object.keys(v))walk(v[k],path+(k==='judge_seat'?'':''));}};walk(o,'');return out;};
const seatOf=o=>{try{return JSON.stringify(o).match(/"judge_seat":"([^"]+)"/)[1];}catch(e){return '?';}};
(async()=>{const res=[];for(const NODE of NODES){const r=RD[NODE];if(!r){console.log(NODE,'NOT IN RUN');continue;}
 for(let ri=0;ri<r.length;ri++){const src=r[ri].source;const inp=src&&src[0]?rdItems(src[0].previousNode,src[0].previousNodeRun):[];
 let a,b;try{a=await run(WB,NODE,inp);b=await run(WT,NODE,inp);}catch(e){console.log(NODE,'run',ri,'ERR',e.message);continue;}
 const A=grab(a),B=grab(b);const sb=new Set(B),sa=new Set(A);
 const drop=A.filter(x=>!sb.has(x)),add=B.filter(x=>!sa.has(x));
 console.log(NODE,'run',ri,'K-W',A.filter(x=>x.includes('| K-W |')).length,'->',B.filter(x=>x.includes('| K-W |')).length,'K-S3',A.filter(x=>x.includes('| K-S3 |')).length,'->',B.filter(x=>x.includes('| K-S3 |')).length,'dropped',drop.length,'added',add.length);
 for(const x of drop)console.log('  - '+x.slice(0,300));for(const x of add)console.log('  + '+x.slice(0,300));
 res.push({node:NODE,run:ri,base:A,b519:B,dropped:drop,added:add});}}
 fs.writeFileSync(__dirname+'/items519_'+RUNF.split('/').pop().replace(/\.json$/,'')+'.json',JSON.stringify(res));})().catch(e=>{console.log('ERR',e.message);});
