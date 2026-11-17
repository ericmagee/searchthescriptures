// pkgQ4D rev 2: __ZH in D3/D4 Build carries history for z-ai and qwen defenders only
const fs=require('fs');
for(const f of ['live.json','target_348r2.json']){const w=JSON.parse(fs.readFileSync(f));const N={};w.nodes.forEach(n=>N[n.name]=n);
 for(const nm of ['D3 Build','D4 Build','C3 Build','C4 Build']){const c=N[nm].parameters.jsCode;const m=c.match(/const __ZH=\(side,prev,seat,ms\)=>\{[\s\S]*?catch\(e\)\{return ms;\}\};/)[0];
  const ZH=new Function('__L','return '+m.slice('const __ZH='.length,-1))(new Proxy({},{get:(t,k)=>()=>({first:()=>({json:k.endsWith('B Extract')?{raw:'PRIOR RAW'}:{call:{body:{messages:[{role:'system',content:'S'},{role:'user',content:'U1'}]}}}})})}));
  const r=mod=>ZH(nm[0],'2',{fam:'openrouter',model:mod},[{role:'user',content:'NOW'}]).length;
  console.log(f.padEnd(18),nm,'glm',r('z-ai/glm-5.3'),'qwen4max',r('qwen/qwen4-max'),'spark',r('meta/muse-spark-1.3'));}}
