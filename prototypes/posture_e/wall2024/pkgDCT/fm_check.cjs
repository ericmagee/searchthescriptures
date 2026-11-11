const fs=require('fs');const H=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgEAD/harness_clone.cjs');const W='/tmp/claude-0/dct125';
let A=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s125.json','utf8'));A=A.data||A;A=A.workflow||A;const lib=A.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const pred={};for(const [src,c] of Object.entries(A.connections))for(const arr of (c.main||[]))for(const t of (arr||[]))(pred[t.node]=pred[t.node]||[]).push(src);
const strip=v=>JSON.stringify(v,(k,x)=>typeof x==='function'?'[fn]':x).replace(/\*\*Run time:\*\* \d+ min \d+ s \(started [^)]*\)/g,'<clock>').replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
const RUN=(src,r,inp)=>{const $0=H.mk$(r,{});const $=n=>n==='Shared Library'?{params:{jsCode:lib},isExecuted:true}:$0(n);const i=$0(inp);const $input={first:()=>i.first(),all:()=>i.all(),item:i.item};const $execution={id:String(r),mode:'production',resumeUrl:'',customData:{set(){},get(){},setAll(){},getAll(){return {};}}};return new Function('$','$input','$execution','return (async()=>{\n'+src+'\n})();')($,$input,$execution);};
(async()=>{const r='33682',n='Format_Markdown.js';const inp=(pred['Format Markdown']||[]).find(p=>H.out(r,p));const a=fs.readFileSync(W+'/eff/'+n,'utf8'),b=fs.readFileSync(W+'/trim/'+n,'utf8');
 const o=[];for(const s of [a,a,b,b])o.push(strip(await RUN(s,r,inp)));
 const d=(x,y)=>{let i=0;while(i<x.length&&i<y.length&&x[i]===y[i])i++;return i>=x.length&&x.length===y.length?'equal':'@'+i+' | '+x.slice(i-80,i+80)+' || '+y.slice(i-80,i+80);};
 console.log('live1 vs live2',d(o[0],o[1]));console.log('trim1 vs trim2',d(o[2],o[3]));console.log('live1 vs trim1',d(o[0],o[2]));})();
