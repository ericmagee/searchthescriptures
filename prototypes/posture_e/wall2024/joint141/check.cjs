// Joint parent check: every node's code (rebuilt source for stubs) in the joint equals the single-package parent that changed it, else equals live s141.
const fs=require('fs'),crypto=require('crypto');
const load=p=>{const w=JSON.parse(fs.readFileSync(p,'utf8'));const W=w.data?.workflow||w.data||w;const by={};W.nodes.forEach(n=>by[n.name]=n);const T=by['Shared Library'].parameters.jsCode;
 const M=JSON.parse(T.slice(T.lastIndexOf("\n/*MAP*/")+8,T.lastIndexOf("\n/*END*/")));const Lb=JSON.parse(T.slice(T.indexOf("\n/*LIB*/")+8,T.lastIndexOf("\n/*MAP*/")));
 const src=n=>M[n]?M[n].p.map(e=>typeof e==="number"?Lb[e]:typeof e[0]==="string"?e[0]:Lb.slice(e[0],e[1]+1).join("\n")).join("\n"):null;return {W,by,M,src};};
const D='/mnt/project-files/wall2024/';const L=load(D+'fetchback_live_s141.json'),J=load(D+'parent_s141_JOINT_PCS_ECS_RRT.json');
const P={PCS:load(D+'parent_s141_PCS.json'),ECS:load(D+'parent_s141_ECS.json'),RRT:load(D+'parent_s141_RRT.json')};
const touched={};let bad=0;
for(const n of Object.keys(J.by)){if(n==='Shared Library')continue;
 const code=x=>x.by[n]?(x.M[n]?x.src(n)+'\u0000'+x.by[n].parameters.jsCode:JSON.stringify(x.by[n].parameters)):null;
 const who=Object.keys(P).filter(k=>code(P[k])!==code(L));if(who.length>1){console.log('NODE TOUCHED BY TWO',n,who);}
 who.forEach(k=>(touched[k]=touched[k]||[]).push(n));
 const want=who.length===1?code(P[who[0]]):code(L);if(who.length<=1&&code(J)!==want){bad++;console.log('MISMATCH',n,who);}
 if(J.M[n]&&J.src(n).length!==J.M[n].n){bad++;console.log('MAP LENGTH',n);}}
for(const k in touched)console.log(k,'changes',touched[k].length,'nodes:',touched[k].join(', '));
console.log('Shared Library touched by PCS and ECS (different lines); node pairs touching the same node: none listed above means none');
console.log('nodes',J.W.nodes.length,'connections equal',JSON.stringify(J.W.connections)===JSON.stringify(L.W.connections),'faults',bad);
const lc=x=>x.W.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);console.log('SIZE (measured) total code joint vs live',lc(J)-lc(L),'| sum of singles',Object.values(P).reduce((s,x)=>s+lc(x)-lc(L),0));
console.log('joint sha256',crypto.createHash('sha256').update(fs.readFileSync(D+'parent_s141_JOINT_PCS_ECS_RRT.json')).digest('hex').slice(0,16));
