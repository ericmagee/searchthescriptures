// ASK 517 C2 chained check (W1): run Panel Cure Check with the 517 library, then run Alternate Merge Seat with the 517 library
// reading that 517 Panel Cure Check output (as a real 517 run would), instead of the recorded live one. Diff against the live replay.
const fs=require('fs');const [,,RUNF]=process.argv;
const RD=JSON.parse(fs.readFileSync(RUNF,'utf8')).runData;
const WL=JSON.parse(fs.readFileSync('/mnt/project-files/ask517/w4/live516b_moMxiV4Irg1uRBZN.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_engine_517.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const items=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const mk$=(W,ri,OVR)=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};if(OVR&&OVR[n]){const it=OVR[n];return {isExecuted:true,all:()=>it,first:()=>it[0],get item(){return it[0];},last:()=>it.slice(-1)[0],params:{}};}
 const r=RD[n];const it=r?items(n,Math.min(ri,r.length-1)):null;return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,input,ri,OVR)=>{const $=mk$(W,ri,OVR);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
const flat=(v,p,o)=>{if(typeof v==='string'&&/^\s*[{[]/.test(v)){try{return flat(JSON.parse(v),p+'(json)',o);}catch(e){}}if(typeof v==='string'&&v.includes('\n')){v.split('\n').forEach((l,i)=>o[p+'#'+i]=l);return o;}
 if(v&&typeof v==='object'){for(const k of Object.keys(v))flat(v[k],p+'.'+k,o);}else o[p]=v;return o;};
const diff=(x,y)=>{const A=flat(x,'',{}),B=flat(y,'',{});return [...new Set([...Object.keys(A),...Object.keys(B)])].filter(k=>!/\.(at|ts)$/.test(k)&&JSON.stringify(A[k])!==JSON.stringify(B[k])).map(k=>k+' : '+JSON.stringify(A[k])+'  =>  '+JSON.stringify(B[k]));};
const inp=n=>{const r=RD[n];const src=r[r.length-1].source;return (src&&src[0]&&RD[src[0].previousNode])?items(src[0].previousNode,src[0].previousNodeRun||0):[];};
(async()=>{const ri=RD['Panel Cure Check'].length-1;
 const pL=await run(WL,'Panel Cure Check',inp('Panel Cure Check'),ri),pT=await run(WT,'Panel Cure Check',inp('Panel Cure Check'),ri);
 const mL=await run(WL,'Alternate Merge Seat',inp('Alternate Merge Seat'),0,{'Panel Cure Check':pL}),mT=await run(WT,'Alternate Merge Seat',inp('Alternate Merge Seat'),0,{'Panel Cure Check':pT});
 const d=diff(mL,mT);console.log('Alternate Merge Seat, chained, live vs 517:',d.length,'changes');for(const x of d)console.log('  ',x.slice(0,900));})();
