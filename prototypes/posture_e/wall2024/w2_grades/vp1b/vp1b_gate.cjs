// W2: grade of pkgVP1B rev 2: 34852 Gate Build items, live s119 vs rev 2.
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const P='/mnt/project-files/wall2024/';const A=g(P+'fetchback_live_s119.json'),B=g('/mnt/project-files/w3/parent_s119_VP1B_r2.json');
const X=JSON.parse(fs.readFileSync(P+'ex34852_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const o=n=>{const r=rd[n];if(!r)return null;const x=r[r.length-1];return x.data&&x.data.main?x.data.main:null;};
const pred={};for(const [s,c] of Object.entries(A.connections))for(const ar of (c.main||[]))for(const t of (ar||[]))(pred[t.node]=pred[t.node]||[]).push(s);
const run=async(W)=>{const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;let s=W.nodes.find(n=>n.name==='Gate Build').parameters.jsCode;if(s.includes('\nreturn await new Function('))s=rebuild(s,lib);
const mk=n=>{if(n==='Shared Library')return {params:{jsCode:lib},isExecuted:true};const v=o(n);const it=v?JSON.parse(JSON.stringify(v.flat().filter(Boolean))):[];return {isExecuted:!!v,first:()=>it[0],all:()=>it,last:()=>it[it.length-1],item:it[0],params:{}};};
const inp=mk((pred['Gate Build']||[]).find(p=>o(p)));return new Function('$','$input','return (async()=>{\n'+s+'\n})();')(mk,{first:()=>inp.first(),all:()=>inp.all(),item:inp.item});};
(async()=>{const a=await run(A),b=await run(B);
const it=r=>{const x=[];const w=(v,p)=>{if(v&&typeof v==='object'){if(v.gid&&v.kind)x.push(p+' | '+v.gid+' | '+v.kind+' | '+v.src+' | '+String(v.why||v.key||'').slice(0,200));for(const k in v)w(v[k],p+'.'+k);}};w(r,'');return x;};
const ia=it(a),ib=it(b);console.log('items live',ia.length,'rev2',ib.length);
const sb=new Set(ib),sa=new Set(ia);for(const s of ia)if(!sb.has(s))console.log('ONLY LIVE:',s);for(const s of ib)if(!sa.has(s))console.log('ONLY REV2:',s);})();
(async()=>{const a=await run(A),b=await run(B);
const it=r=>{const x=[];(r||[]).forEach((o,j)=>((o.json&&o.json.gate_report)||[]).forEach((g,s)=>(g.items||[]).forEach(v=>x.push('out'+j+' seat'+s+'('+(g.seat||g.model||'')+') | '+v.kind+' | '+v.src+' | '+String(v.why||'')))));return x;};
const ia=it(a),ib=it(b);const cnt=x=>{const m=new Map();x.forEach(s=>m.set(s,(m.get(s)||0)+1));return m;};const ma=cnt(ia),mb=cnt(ib);
for(const [s,c] of ma)if((mb.get(s)||0)!==c)console.log('\nLIVE x'+c+' REV2 x'+(mb.get(s)||0)+': '+s.slice(0,1500));
for(const [s,c] of mb)if(!ma.has(s))console.log('\nNEW IN REV2: '+s.slice(0,600));})();
