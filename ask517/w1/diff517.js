// Field-level diff for one node: live replay vs recorded, and live replay vs 517 replay (JSON strings parsed and compared by key path).
const fs=require('fs');const [,,RUNF,NODE]=process.argv;
const RD=JSON.parse(fs.readFileSync(RUNF,'utf8')).data.resultData.runData;
const WL=JSON.parse(fs.readFileSync('/mnt/project-files/ask516/w4/b/live_moMxiV4Irg1uRBZN.json','utf8')),WT=JSON.parse(fs.readFileSync(__dirname+'/target_engine_517.json','utf8'));
const node=(W,n)=>W.nodes.find(y=>y.name===n);
const rdItems=(n,i)=>{const r=RD[n];if(!r)return null;const x=r[i==null?r.length-1:i];return ((x.data||{}).main||[[]])[0]||[];};
const mk$=W=>n=>{if(n==='Shared Library')return {params:{jsCode:node(W,'Shared Library').parameters.jsCode}};const it=rdItems(n);return {isExecuted:!!it,all:()=>it||[],first:()=>{if(!it||!it.length)throw new Error('node '+n+' not executed');return it[0];},get item(){return (it||[])[0];},last:()=>(it||[]).slice(-1)[0],params:{}};};
const run=async(W,n,input)=>{const $=mk$(W);const $input={all:()=>input||[],first:()=>(input||[])[0],get item(){return (input||[])[0];}};return await new Function('$','$input','return (async()=>{\n'+node(W,n).parameters.jsCode+'\n})();')($,$input);};
const flat=(v,p,o)=>{if(typeof v==='string'&&/^\s*[{[]/.test(v)){try{return flat(JSON.parse(v),p+'(json)',o);}catch(e){}}
 if(v&&typeof v==='object'){for(const k of Object.keys(v))flat(v[k],p+'.'+k,o);}else o[p]=v;return o;};
const cmp=(x,y,lab)=>{const A=flat(x,'',{}),B=flat(y,'',{});const ks=[...new Set([...Object.keys(A),...Object.keys(B)])].filter(k=>!/\.at$/.test(k)&&JSON.stringify(A[k])!==JSON.stringify(B[k]));
 console.log(lab+': '+ks.length+' fields differ');for(const k of ks.slice(0,30))console.log('  '+k+' : '+String(JSON.stringify(A[k])).slice(0,160)+'  =>  '+String(JSON.stringify(B[k])).slice(0,160));};
(async()=>{const r=RD[NODE];const src=r[r.length-1].source;const inp=src&&src[0]?rdItems(src[0].previousNode,src[0].previousNodeRun):[];
 const a=await run(WL,NODE,inp),b=await run(WT,NODE,inp);const rec=rdItems(NODE);
 cmp(rec,a,'recorded vs live replay');cmp(a,b,'live replay vs 517 replay');})().catch(e=>console.log('ERR',e.message));
// verdict_raw text check: live and 517 differ only in standing words
(async()=>{const r=RD[NODE];const src=r[r.length-1].source;const inp=src&&src[0]?rdItems(src[0].previousNode,src[0].previousNodeRun):[];
 const a=await run(WL,NODE,inp),b=await run(WT,NODE,inp);const ba=a[0].json.bodies||[],bb=b[0].json.bodies||[];
 ba.forEach((x,i)=>{const va=JSON.parse(x).payload.verdict_raw||'',vb=JSON.parse(bb[i]).payload.verdict_raw||'';if(va===vb)return;
  const la=va.split('\n'),lb=vb.split('\n');const d=[];la.forEach((l,j)=>{if(l!==lb[j]){let s=0;while(s<l.length&&l[s]===String(lb[j])[s])s++;let e=0;while(e<l.length-s&&l[l.length-1-e]===String(lb[j])[String(lb[j]).length-1-e])e++;d.push(j+': ...'+l.slice(Math.max(0,s-120),l.length-e+60)+' => ...'+String(lb[j]).slice(Math.max(0,s-120),String(lb[j]).length-e+60));}});
  console.log('seat '+i+' verdict_raw lines differ: '+d.length+(la.length!==lb.length?' (line count differs)':''));d.forEach(x=>console.log('  '+x));});})();
