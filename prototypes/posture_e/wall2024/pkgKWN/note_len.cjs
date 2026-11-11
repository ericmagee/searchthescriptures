// W2: judge-visible length added by pkgG4M in 34852 Gate Build items (live vs F2).
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const P='/mnt/project-files/wall2024/';const A=g(P+'fetchback_live_s119.json'),B=g(P+'parent_s119_F2.json');
const X=JSON.parse(fs.readFileSync(P+'ex34852_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const o=n=>{const r=rd[n];if(!r)return null;const x=r[r.length-1];return x.data&&x.data.main?x.data.main:null;};
const pred={};for(const [s,c] of Object.entries(A.connections))for(const ar of (c.main||[]))for(const t of (ar||[]))(pred[t.node]=pred[t.node]||[]).push(s);
const run=async(W)=>{const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;let s=W.nodes.find(n=>n.name==='Gate Build').parameters.jsCode;if(s.includes('\nreturn await new Function('))s=rebuild(s,lib);
const mk=n=>{if(n==='Shared Library')return {params:{jsCode:lib},isExecuted:true};const v=o(n);const it=v?JSON.parse(JSON.stringify(v.flat().filter(Boolean))):[];return {isExecuted:!!v,first:()=>it[0],all:()=>it,last:()=>it[it.length-1],item:it[0],params:{}};};
const inp=mk((pred['Gate Build']||[]).find(p=>o(p)));return new Function('$','$input','return (async()=>{\n'+s+'\n})();')(mk,{first:()=>inp.first(),all:()=>inp.all(),item:inp.item});};
(async()=>{const a=JSON.stringify(await run(A)),b=JSON.stringify(await run(B));
const wa=[...a.matchAll(/"why":"((?:[^"\\]|\\.)*)"/g)].map(m=>m[1]),wb=[...b.matchAll(/"why":"((?:[^"\\]|\\.)*)"/g)].map(m=>m[1]);
console.log('items',wa.length,wb.length,'total out chars',a.length,b.length,'diff',b.length-a.length);
wb.forEach((w,i)=>{if(w!==wa[i])console.log('item',i,'+'+(w.length-wa[i].length),'\n',w.slice(wa[i].length));});})();
(async()=>{const b=await run(B);const s=JSON.stringify(b);const walk=(v,p)=>{if(typeof v==='string'){const c=(v.match(/THE ENGINE READS THIS LINE: its GROUND names no pressed/g)||[]).length;if(c)console.log('field',p,'count',c,'len',v.length);}else if(v&&typeof v==='object')for(const k in v)walk(v[k],p+'.'+k);};walk(b,'');})();
