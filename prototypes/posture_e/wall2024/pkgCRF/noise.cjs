// show where two base runs of one node differ (time noise check)
const fs=require('fs');const W='/mnt/project-files/wall2024/';const e=process.argv[2],n=process.argv[3];
let d=JSON.parse(fs.readFileSync(W+'fetchback_live_s133.json','utf8'));d=d.data||d;d=d.workflow||d;
const predOf=n=>{for(const [s,o] of Object.entries(d.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const lo=n=>{const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};const $=n=>{const o=lo(n)||[];const nd=d.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!rd[n],first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};};
const run=async()=>{const inp=lo(predOf(n))||[];const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return JSON.stringify(await new Function('$','$input','return (async()=>{\n'+d.nodes.find(z=>z.name===n).parameters.jsCode+'\n})();')($,$input));};
(async()=>{const a=await run();await new Promise(r=>setTimeout(r,1100));const b=await run();let i=0;while(a[i]===b[i])i++;console.log(a.length,b.length,JSON.stringify(a.slice(i-120,i+60)),'|',JSON.stringify(b.slice(i-5,i+60)));})();
