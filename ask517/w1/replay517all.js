// ASK 517 replay (W1): every library-user node present in a run's data, run with the live (post-516b) library and with the 517 library
// on the run's recorded inputs; field diff live-replay vs 517-replay ('at' times set aside); also live-replay vs recorded (harness check).
const fs=require('fs');const [,,RUNF,WHICH]=process.argv;const eng=(WHICH||'engine')==='engine';
const RAW=JSON.parse(fs.readFileSync(RUNF,'utf8'));const RD=(RAW.runData||RAW.data.resultData.runData);
const WL=JSON.parse(fs.readFileSync('/mnt/project-files/ask517/w4/live516b_'+(eng?'moMxiV4Irg1uRBZN':'MqQHRl7mQQ0z8QdT')+'.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_'+(eng?'engine':'child')+'_517.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const items=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const mk$=(W,ri)=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const r=RD[n];const it=r?items(n,Math.min(ri,r.length-1)):null;return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,input,ri)=>{const $=mk$(W,ri);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
const flat=(v,p,o)=>{if(typeof v==='string'&&/^\s*[{[]/.test(v)){try{return flat(JSON.parse(v),p+'(json)',o);}catch(e){}}if(typeof v==='string'&&v.includes('\n')){v.split('\n').forEach((l,i)=>o[p+'#'+i]=l);return o;}
 if(v&&typeof v==='object'){for(const k of Object.keys(v))flat(v[k],p+'.'+k,o);}else o[p]=v;return o;};
const diff=(x,y)=>{const A=flat(x,'',{}),B=flat(y,'',{});return [...new Set([...Object.keys(A),...Object.keys(B)])].filter(k=>!/\.(at|ts)$/.test(k)&&JSON.stringify(A[k])!==JSON.stringify(B[k])).map(k=>({k,a:A[k],b:B[k]}));};
// library users: nodes whose code loads a Shared Library MAP entry that changed
const libOf=W=>{const t=node(W,'Shared Library').parameters.jsCode;const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/'))),M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));return k=>M[k]?M[k].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n'):null;};
const cl=libOf(WL),ct=libOf(WT);const users=WL.nodes.map(n=>n.name).filter(n=>cl(n)!=null&&cl(n)!==ct(n));
(async()=>{const out={run:RUNF,users_changed:users,nodes:{}};
 for(const n of users){const r=RD[n];if(!r){out.nodes[n]='not executed';continue;}
  for(let ri=0;ri<r.length;ri++){const src=r[ri].source;let inp=[];if(src&&src[0]&&RD[src[0].previousNode])inp=items(src[0].previousNode,src[0].previousNodeRun||0);
   let a,b,e1=null;try{a=await run(WL,n,inp,ri);b=await run(WT,n,inp,ri);}catch(e){e1=e.message;}
   const key=n+(r.length>1?' run'+ri:'');if(e1){out.nodes[key]={error:e1};continue;}
   const h=diff(items(n,ri),a),d=diff(a,b);out.nodes[key]={harness_diffs:h.length,changes:d.map(z=>z.k+' : '+String(JSON.stringify(z.a)).slice(0,300)+'  =>  '+String(JSON.stringify(z.b)).slice(0,300))};}}
 const o=process.argv[4]||(__dirname+'/replay517_'+RUNF.split('/').pop().replace('.json','')+'.json');fs.writeFileSync(o,JSON.stringify(out,null,1));
 for(const [k,v] of Object.entries(out.nodes))console.log(k,typeof v==='string'?v:v.error?'ERROR '+v.error:('harness '+v.harness_diffs+', 517 changes '+v.changes.length));})();
