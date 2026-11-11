const fs=require('fs');const P='/mnt/project-files/wall2024/';
const rd=f=>{let w=JSON.parse(fs.readFileSync(P+f,'utf8'));w=w.data||w;w=w.workflow||w;return w;};
const libOf=w=>{const T=w.nodes.find(x=>x.name=="Shared Library").parameters.jsCode;return JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));};
const code=w=>w.nodes.reduce((s,n)=>s+(n.parameters&&typeof n.parameters.jsCode==='string'?n.parameters.jsCode.length:0),0);
const diffNodes=(a,b)=>{const m=new Map(a.nodes.map(n=>[n.name,JSON.stringify(n)]));return b.nodes.filter(n=>m.get(n.name)!==JSON.stringify(n)).map(n=>n.name).concat(a.nodes.length!==b.nodes.length?['NODECOUNT']:[]);};
const ldiff=(A,B)=>{const out=[];const n=Math.max(A.length,B.length);for(let i=0;i<n;i++)if(A[i]!==B[i])out.push([i,A[i],B[i]]);return out;};
const L125=rd('fetchback_live_s125.json'),L127=rd('fetchback_live_s127.json');
for(const F of ['SU','AU']){const G=rd('parent_s125_EAF_'+F+'.json'),N=rd('parent_s127_EAF_'+F+'.json');
 const sha=require('crypto').createHash('sha256').update(fs.readFileSync(P+'parent_s127_EAF_'+F+'.json')).digest('hex').slice(0,16);
 console.log(F,'sha',sha,'nodes differ from s127:',diffNodes(L127,N).join(','),'conn equal:',JSON.stringify(L127.connections)===JSON.stringify(N.connections),'code',code(L127),'->',code(N),'=',code(N)-code(L127));
 const g=ldiff(libOf(L125),libOf(G)),n=ldiff(libOf(L127),libOf(N));
 console.log(' graded s125 edit lines',g.map(x=>x[0]).join(','),' s127 edit lines',n.map(x=>x[0]).join(','));
 const same=g.length===n.length&&g.every((x,i)=>x[2]===n[i][2]);console.log(' new line text identical to graded:',same);
 const oldSame=g.length===n.length&&g.every((x,i)=>x[1]===n[i][1]);console.log(' old line text identical (live s125 vs s127):',oldSame);
 // other nodes' jsCode vs prompts equal
 const pr=w=>JSON.stringify(w.nodes.map(n=>Object.fromEntries(Object.entries(n.parameters||{}).filter(([k])=>k!=='jsCode'))));console.log(' non-code params equal to s127:',pr(L127)===pr(N));}
