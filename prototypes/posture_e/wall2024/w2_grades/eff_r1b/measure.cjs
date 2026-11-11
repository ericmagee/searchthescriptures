// W2 second reading of W1 efficiency item 3 (s133): repeated long lines outside the library and outside R1b, and what a library merge costs.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const ld=f=>{let d=JSON.parse(fs.readFileSync(W+f,'utf8'));d=d.data||d;return d.workflow||d;};
const map=d=>{const lib=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const i=lib.indexOf('\n/*MAP*/'),e=lib.indexOf('\n/*END*/');return {lib,M:JSON.parse(lib.slice(i+8,e)),L:JSON.parse(lib.slice(lib.indexOf('\n/*LIB*/')+8,i))};};
const A=ld('fetchback_live_s133.json');const {lib,M,L}=map(A);const R1b=map(ld('parent_s119_R1b.json')).M;
const code=A.nodes.filter(n=>n.parameters&&typeof n.parameters.jsCode==='string'&&n.name!=='Shared Library');
const stubs=code.filter(n=>n.name in M),plain=code.filter(n=>!(n.name in M)),out=plain.filter(n=>!(n.name in R1b));
console.log('code nodes',code.length,'stubs',stubs.length,'plain',plain.length,'plain and not in R1b',out.length,'library chars',lib.length,'library lines',L.length);
// duplicate long lines among the out-set
const dup=(set,min)=>{const m=new Map();for(const x of set)for(const l of new Set(x.parameters.jsCode.split('\n')))if(l.length>=min){if(!m.has(l))m.set(l,new Set());m.get(l).add(x.name);}let s=0;const nodes=new Set();const rows=[];for(const [l,ns] of m)if(ns.size>1){s+=l.length*(ns.size-1);ns.forEach(n=>nodes.add(n));rows.push([l.length*(ns.size-1),ns.size,[...ns].slice(0,3).join(', ')]);}rows.sort((a,b)=>b[0]-a[0]);return {s,nodes,rows};};
for(const min of [200,80,1]){const r=dup(out,min);console.log('lines >= '+min+' chars repeated in 2+ out-set nodes: saveable',r.s,'| nodes holding a repeat',r.nodes.size);if(min===200)r.rows.slice(0,6).forEach(x=>console.log('   ',x.join(' | ')));}
// stub cost on today's 42 stubs: stub code + MAP entry
const sc=stubs.map(n=>({n:n.name,stub:n.parameters.jsCode.length,map:JSON.stringify({[n.name]:M[n.name]}).length,lines:(M[n.name].p||[]).length,len:M[n.name].n}));
const sum=k=>sc.reduce((a,x)=>a+x[k],0);console.log('stubs: stub code min',Math.min(...sc.map(x=>x.stub)),'max',Math.max(...sc.map(x=>x.stub)),'mean',Math.round(sum('stub')/sc.length),'| MAP entry mean',Math.round(sum('map')/sc.length),'max',Math.max(...sc.map(x=>x.map)),'| map chars per rebuilt line',(sum('map')/sum('lines')).toFixed(2));
console.log('MAP entry shape sample:',JSON.stringify(M[sc[0].n]).slice(0,160));
// cost to convert each node that holds a 200+ repeat: stub (mean) + MAP entry (lines x map chars per line) ; unique lines move to the library (no change in total)
const r=dup(out,200);const per=sum('map')/sum('lines');const stubMean=sum('stub')/sc.length;let cost=0;for(const n of r.nodes){const x=out.find(z=>z.name===n);const lines=x.parameters.jsCode.split('\n').length;cost+=stubMean+lines*per+(x.name.length+12);}
console.log('nodes to convert',r.nodes.size,'conversion cost (stub mean + MAP entry by line count) ESTIMATE',Math.round(cost),'| gross saving',r.s,'| net ESTIMATE',Math.round(r.s-cost));
for(const n of r.nodes){const x=out.find(z=>z.name===n);console.log('   ',n,x.parameters.jsCode.length,'chars,',x.parameters.jsCode.split('\n').length,'lines');}
// Measured per-stub overhead on today's 42 stubs: stub code + MAP entry - (rebuilt length - chars of library lines it references by index)
const refChars=p=>{let s=0;for(const e of p||[]){if(typeof e==='number')s+=L[e].length+1;else if(Array.isArray(e))for(let i=e[0];i<=e[1];i++)s+=L[i].length+1;}return s;};
const ov=stubs.map(n=>{const E=JSON.stringify(M[n.name]).length+JSON.stringify(n.name).length+2;const ref=refChars(M[n.name].p);return {n:n.name,over:n.parameters.jsCode.length+E-(M[n.name].n-ref),N:M[n.name].n,lines:(M[n.name].p||[]).length};});
ov.sort((a,b)=>a.over-b.over);const tot=ov.reduce((a,x)=>a+x.over,0);
console.log('\nMEASURED per-stub overhead (stub + MAP entry - own text): min',ov[0].over,ov[0].n,'| median',ov[Math.floor(ov.length/2)].over,'| mean',Math.round(tot/ov.length),'| max',ov[ov.length-1].over,ov[ov.length-1].n);
const med=ov[Math.floor(ov.length/2)].over,mean=tot/ov.length;
const r2=dup(out,200);console.log('NET for converting the',r2.nodes.size,'nodes: gross',r2.s,'- overhead at median',Math.round(r2.nodes.size*med),'=',Math.round(r2.s-r2.nodes.size*med),'| at mean',Math.round(r2.s-r2.nodes.size*mean));
// only groups worth it: per node, its share of the saving vs overhead
const share=new Map();{const m=new Map();for(const x of out)for(const l of new Set(x.parameters.jsCode.split('\n')))if(l.length>=200){if(!m.has(l))m.set(l,new Set());m.get(l).add(x.name);}for(const [l,ns] of m)if(ns.size>1)for(const n of ns)share.set(n,(share.get(n)||0)+l.length*(ns.size-1)/ns.size);}
let keep=0,kn=0;const lst=[];for(const [n,s] of share){if(s>med){keep+=s-med;kn++;lst.push(n+' '+Math.round(s));}}
console.log('nodes whose share of the saving exceeds the median overhead:',kn,'net',Math.round(keep));console.log('   ',lst.join(' ; '));
