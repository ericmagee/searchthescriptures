// ASK 517 replay (W1): run a node with the live library and with the 517 library on a run's recorded inputs; print the standing lines that differ.
const fs=require('fs');const [,,RUNF,NODE]=process.argv;
const RD=JSON.parse(fs.readFileSync(RUNF,'utf8')).data.resultData.runData;
const WL=JSON.parse(fs.readFileSync('/mnt/project-files/ask516/w4/b/live_moMxiV4Irg1uRBZN.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_engine_517.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const rdItems=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const mk$=W=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const it=rdItems(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,input)=>{const $=mk$(W);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
(async()=>{const r=RD[NODE];const src=r[r.length-1].source;const inp=src&&src[0]?rdItems(src[0].previousNode,src[0].previousNodeRun):[];
 const a=await run(WL,NODE,inp),b=await run(WT,NODE,inp);const rec=rdItems(NODE);
 const S=JSON.stringify;const noT=v=>JSON.parse(S(v),(k,x)=>(k==='at'||k==='ts')?'(time)':x);
 console.log(NODE,'items live',a.length,'517',b.length,'live replay = recorded',S(noT(a))===S(noT(rec)));
 const fl=o=>{const out=[];const walk=(v,p)=>{if(typeof v==='string'){v.split('\n').forEach((l,i)=>out.push(p+'#'+i+' '+l));}else if(v&&typeof v==='object')for(const k of Object.keys(v))walk(v[k],p+'.'+k);};walk(o,'');return out;};
 const A=fl(noT(a)),B=fl(noT(b));const sa=new Set(A),sb=new Set(B);
 const onlyA=A.filter(x=>!sb.has(x)),onlyB=B.filter(x=>!sa.has(x));
 console.log('lines only in live:',onlyA.length,'only in 517:',onlyB.length);
 for(const x of onlyA.slice(0,40))console.log('- '+x.slice(0,400));for(const x of onlyB.slice(0,40))console.log('+ '+x.slice(0,400));})().catch(e=>{console.log('ERR',e.message);});
