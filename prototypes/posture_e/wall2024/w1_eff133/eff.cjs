const fs=require('fs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s133.json'));const w=(W.data||W).workflow||(W.data||W);
const L=require('/mnt/project-files/w4/kwn/lib.cjs')('/mnt/project-files/wall2024/fetchback_live_s133.json');
const raw=w.nodes.filter(n=>n.parameters.jsCode&&n.name!=='Shared Library').map(n=>({n:n.name,c:n.parameters.jsCode,stub:!!L.M[n.name]}));
console.log('code nodes',raw.length,'stubs',raw.filter(x=>x.stub).length,'library chars',w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode.length);
const big=raw.filter(x=>!x.stub).sort((a,b)=>b.c.length-a.c.length).slice(0,15);big.forEach(x=>console.log(String(x.c.length).padStart(8),x.n));
// duplicate lines >=200 chars across non-stub node code
const m=new Map();for(const x of raw.filter(x=>!x.stub))for(const l of new Set(x.c.split('\n')))if(l.length>=200){if(!m.has(l))m.set(l,[]);m.get(l).push(x.n);}
let save=0,rows=[];for(const [l,ns] of m)if(ns.length>1){save+=l.length*(ns.length-1);rows.push([l.length*(ns.length-1),ns.length,l.length,ns.slice(0,4).join(', '),l.slice(0,90)]);}
rows.sort((a,b)=>b[0]-a[0]);console.log('dup lines >=200 in >=2 non-stub nodes:',rows.length,'saveable chars',save);rows.slice(0,15).forEach(r=>console.log(r.join(' | ')));
const R=require('/mnt/project-files/w4/kwn/lib.cjs')('/mnt/project-files/wall2024/parent_s119_R1b.json');const rs=new Set(Object.keys(R.M));
const m2=new Map();for(const x of raw.filter(x=>!x.stub&&!rs.has(x.n)))for(const l of new Set(x.c.split('\n')))if(l.length>=200){if(!m2.has(l))m2.set(l,[]);m2.get(l).push(x.n);}
let s2=0,r2=[];for(const [l,ns] of m2)if(ns.length>1){s2+=l.length*(ns.length-1);r2.push([l.length*(ns.length-1),ns.length,l.length,ns.join(', ').slice(0,160),l.slice(0,70)]);}
r2.sort((a,b)=>b[0]-a[0]);console.log('\nOUTSIDE R1b: nodes',raw.filter(x=>!x.stub&&!rs.has(x.n)).length,'code',raw.filter(x=>!x.stub&&!rs.has(x.n)).reduce((s,x)=>s+x.c.length,0),'dup lines',r2.length,'saveable',s2);r2.slice(0,12).forEach(r=>console.log(r.join(' | ')));
