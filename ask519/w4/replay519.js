// ASK 519 replay (W4): run a node with the 517 library (base) and with the 519 library on a run's recorded inputs; list K-W / K-S3 lines that differ.
const fs=require('fs');const [,,RUNF,...NODES]=process.argv;
const J=JSON.parse(fs.readFileSync(RUNF,'utf8'));const RD=(J.data&&J.data.resultData||J).runData;
const WB=JSON.parse(fs.readFileSync('/mnt/project-files/ask517/w1/target_engine_517.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_engine_519.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const rdItems=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const mk$=W=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const it=rdItems(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,input)=>{const $=mk$(W);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
const S=JSON.stringify;const noT=v=>JSON.parse(S(v),(k,x)=>(k==='at'||k==='ts')?'(time)':x);
const fl=o=>{const out=[];const walk=(v,p)=>{if(typeof v==='string'){v.split('\n').forEach((l,i)=>out.push(p+'#'+i+' '+l));}else if(v&&typeof v==='object')for(const k of Object.keys(v))walk(v[k],p.replace(/\.\d+(?=\.|$)/g,'.N')+'.'+k);};walk(o,'');return out;};
(async()=>{const tot={};for(const NODE of NODES){const r=RD[NODE];if(!r){console.log(NODE,'NOT IN RUN');continue;}
 for(let ri=0;ri<r.length;ri++){const src=r[ri].source;const inp=src&&src[0]?rdItems(src[0].previousNode,src[0].previousNodeRun):[];
 let a,b;try{a=await run(WB,NODE,inp);b=await run(WT,NODE,inp);}catch(e){console.log(NODE,'run',ri,'ERR',e.message);continue;}
 const rec=((r[ri].data||{}).main||[[]])[0]||[];
 const A=fl(noT(a)),B=fl(noT(b));const cnt=(X,re)=>X.filter(x=>re.test(x)).length;
 const KW=/WITHDRAWAL TO ANSWER \(K-W/,KS=/CLOSE-ROUND CONCESSION NOT MARKED COUNTED/;
 const sb=new Set(B),sa=new Set(A);const onlyA=A.filter(x=>!sb.has(x)),onlyB=B.filter(x=>!sa.has(x));
 console.log(NODE,'run',ri,'items',a.length,b.length,'base replay = recorded',S(noT(a))===S(noT(rec)),'K-W marks',cnt(A,KW),'->',cnt(B,KW),'K-S3 marks',cnt(A,KS),'->',cnt(B,KS),'lines only base',onlyA.length,'only 519',onlyB.length);
 for(const x of onlyA.filter(x=>KW.test(x)||KS.test(x)).slice(0,80))console.log('  - '+x.replace(/^.*?(\[AUDIT)/,'$1').slice(0,260));
 const other=onlyA.filter(x=>!(KW.test(x)||KS.test(x)));for(const x of other.slice(0,15))console.log('  ~base '+x.slice(0,260));for(const x of onlyB.slice(0,15))console.log('  +519 '+x.slice(0,260));}}})().catch(e=>{console.log('ERR',e.message);});
