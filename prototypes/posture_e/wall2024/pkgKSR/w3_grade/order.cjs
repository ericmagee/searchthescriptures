const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34626_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const W=g('/mnt/project-files/wall2024/fetchback_live_s110.json');const ty={};W.nodes.forEach(n=>ty[n.name]=n.type.replace('n8n-nodes-base.',''));
const ord=Object.keys(rd).map(n=>({n,t:rd[n][0].startTime,src:(rd[n][0].source||[]).map(s=>s&&s.previousNode+':'+(s.previousNodeOutput||0)).join(','),outs:(rd[n][0].data.main||[]).map(o=>o?o.length:0).join('/'),runs:rd[n].length})).sort((a,b)=>a.t-b.t);
const i=ord.findIndex(o=>o.n==='Panel Cure Check');const lib=new Set(fs.readdirSync('pkgLIB/strip_R1/patched').map(f=>f.slice(0,-3).replace(/_/g,' ')));
ord.slice(i-3).forEach(o=>console.log(o.n+' | '+ty[o.n]+(lib.has(o.n)?' LIB':'')+' | from '+o.src+' | outs '+o.outs+(o.runs>1?' | runs '+o.runs:'')));
