// show where base (stored inputs, schema stripped) and candidate (chained) outputs of one node first differ
const fs=require('fs');const W='/mnt/project-files/wall2024/';const [e,n]=process.argv.slice(2);
const L=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};const A=L('fetchback_live_s135.json'),B=L('parent_s135_CRF.json');
const predOf=n=>{for(const [s,o] of Object.entries(A.connections))for(const br of o.main||[])for(const t of br||[])if(t.node===n)return s;};
const runSrc=(src,$,inp)=>{const $input={first:()=>inp[0],all:()=>inp,item:inp[0]};return new Function('$','$input','return (async()=>{\n'+src+'\n})();')($,$input);};
const mk=(rd,d,over)=>{const lo=n=>{if(over&&n in over)return over[n];const r=rd[n];return r?(r[r.length-1].data.main[0]||[]):null;};return [n=>{const o=lo(n)||[];const nd=d.nodes.find(z=>z.name===n);return {params:nd?nd.parameters:{},isExecuted:!!lo(n),first:()=>o[0],all:()=>o,last:()=>o[o.length-1],item:o[0]};},lo];};
const run=async(d,n,rd,over)=>{const [$,lo]=mk(rd,d,over);return await runSrc(d.nodes.find(z=>z.name===n).parameters.jsCode,$,lo(predOf(n))||[]);};
const strip=o=>JSON.stringify(o,(k,v)=>k==='response_format'&&v&&v.json_schema&&v.json_schema.name==='cure_lines'?undefined:v);
const BUILDERS=['Cure Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Cure Build','R2 Alternate Cure Build'];
(async()=>{const X=JSON.parse(fs.readFileSync(W+'ex'+e+'_full.json','utf8'));const rd=(X.data||X).resultData.runData;const over={},overA={};for(const b of BUILDERS)if(rd[b]){over[b]=await run(B,b,rd,null);overA[b]=await run(A,b,rd,null);}
 const x=strip(await run(A,n,rd,overA)),y=JSON.stringify(await run(B,n,rd,over));let i=0;const m=Math.min(x.length,y.length);while(i<m&&x[i]===y[i])i++;console.log(x.length,y.length,'first diff',i);console.log(' base:',JSON.stringify(x.slice(Math.max(0,i-300),i+200)));console.log(' cand:',JSON.stringify(y.slice(Math.max(0,i-30),i+200)));})();
