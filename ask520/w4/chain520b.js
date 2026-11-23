// ASK 520 C2a (variant B) (W4): chain replay. Each listed node runs with the 517 library and with the 519 library; a node replayed earlier in the
// chain serves its replayed output to later nodes, every other node serves its recorded output (model calls stay as recorded).
// Prints, for the last nodes, every output line that differs between the two chains (time fields set aside).
const fs=require('fs');const [,,RUNF,CHAIN,SHOW]=process.argv;const NODES=CHAIN.split(',');const SH=(SHOW||'').split(',').filter(Boolean);
const J=JSON.parse(fs.readFileSync(RUNF,'utf8'));const RD=(J.data&&J.data.resultData||J).runData;
const WB=JSON.parse(fs.readFileSync('/mnt/project-files/ask517/w1/target_engine_517.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_engine_520b.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const rec=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const chain=async W=>{const OV={};const get=n=>OV[n]!==undefined?OV[n]:rec(n);
 const $=n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const it=get(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
 for(const n of NODES){const r=RD[n];if(!r){OV[n]=null;continue;}const src=r[r.length-1].source;const inp=src&&src[0]?(OV[src[0].previousNode]!==undefined?OV[src[0].previousNode]:rec(src[0].previousNode,src[0].previousNodeRun)):[];
  const $input={all:()=>inp||[],first:()=>(inp||[])[0],get item(){return (inp||[])[0];}};
  try{OV[n]=await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);}catch(e){OV[n]=[{json:{__error:String(e.message)}}];}}
 return OV;};
const S=JSON.stringify;const noT=v=>JSON.parse(S(v),(k,x)=>(k==='at'||k==='ts')?'(time)':x);
const fl=o=>{const out=[];const walk=(v,p)=>{if(typeof v==='string'){v.split('\n').forEach((l,i)=>out.push(p+' '+l));}else if(v&&typeof v==='object')for(const k of Object.keys(v))walk(v[k],p+'.'+k);};walk(o,'');return out;};
(async()=>{const A=await chain(WB),B=await chain(WT);
 for(const n of (SH.length?SH:NODES)){const a=fl(noT(A[n])),b=fl(noT(B[n]));const sa=new Set(a),sb=new Set(b);const oa=a.filter(x=>!sb.has(x)),ob=b.filter(x=>!sa.has(x));
  console.log('== '+n+': lines only 517 '+oa.length+', only 519 '+ob.length+(A[n]&&A[n][0]&&A[n][0].json&&A[n][0].json.__error?' ERR517 '+A[n][0].json.__error:'')+(B[n]&&B[n][0]&&B[n][0].json&&B[n][0].json.__error?' ERR519 '+B[n][0].json.__error:''));
  const F=x=>!/\.(items|cure\.items|v|verdicts|prompt|body|messages)\./.test(x);const fa=oa.filter(F),fb=ob.filter(F);console.log('  (outside item lists: only 517 '+fa.length+', only 519 '+fb.length+')');for(const x of fa.slice(0,40))console.log('  517 '+x.slice(0,300));for(const x of fb.slice(0,40))console.log('  519 '+x.slice(0,300));}})().catch(e=>console.log('ERR',e.message));
// semantic compare of Panel Cure Check / Cure Check bodies (appended): set CMP=1
if(process.env.CMP){(async()=>{const A=await chain(WB),B=await chain(WT);for(const n of SH){const a=A[n],b=B[n];if(!a||!b)continue;
 for(let i=0;i<Math.max(a.length,b.length);i++){const ja=(a[i]||{}).json||{},jb=(b[i]||{}).json||{};const ba=ja.bodies||[],bb=jb.bodies||[];
  for(let k=0;k<Math.max(ba.length,bb.length);k++){let pa=ba[k],pb=bb[k];try{pa=typeof pa==='string'?JSON.parse(pa):pa;pb=typeof pb==='string'?JSON.parse(pb):pb;}catch(e){}
   const P=x=>(x&&x.payload)||x||{};const xa=P(pa),xb=P(pb);const seat=xa.judge_seat||xb.judge_seat;
   for(const key of new Set([...Object.keys(xa),...Object.keys(xb)])){if(/drv|items|audit|cure_report|marks/i.test(key))continue;let va=S(noT(xa[key])),vb=S(noT(xb[key]));
    if(key==='verdict_raw'){const la=String(xa[key]).split('\n'),lb=String(xb[key]).split('\n');const sa2=new Set(la),sb2=new Set(lb);la.filter(x=>!sb2.has(x)).forEach(x=>console.log('VR',n,seat,'517',x.slice(0,300)));lb.filter(x=>!sa2.has(x)).forEach(x=>console.log('VR',n,seat,'519',x.slice(0,300)));continue;try{const ra=JSON.parse(xa[key]),rb=JSON.parse(xb[key]);for(const k2 of new Set([...Object.keys(ra),...Object.keys(rb)])){const u=S(ra[k2]),w=S(rb[k2]);if(u!==w)console.log('DIFF',n,seat,'verdict_raw.'+k2,'| 517',String(u).slice(0,200),'| 519',String(w).slice(0,200));}continue;}catch(e){}}
    if(va!==vb)console.log('DIFF',n,seat,key,'| 517',String(va).slice(0,200),'| 519',String(vb).slice(0,200));}}}}
 console.log('CMP done');})();}
