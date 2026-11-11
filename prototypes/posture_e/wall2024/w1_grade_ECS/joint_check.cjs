const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+p,'utf8'));j=j.data||j;j=j.workflowData||j.workflow||j;return j;};
const L=load('fetchback_live_s141.json'),J=load('parent_s141_JOINT_PCS_ECS_RRT.json'),P={PCS:load('parent_s141_PCS.json'),ECS:load('parent_s141_ECS.json'),RRT:load('parent_s141_RRT.json')};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const PL=parts(L),PJ=parts(J);const pp={};for(const k in P)pp[k]=parts(P[k]);
// each LIB line in J equals the line of whichever package changed it
let ok=true;for(let i=0;i<PJ.Lb.length;i++){const ch=Object.keys(pp).filter(k=>pp[k].Lb[i]!==PL.Lb[i]);const exp=ch.length?pp[ch[0]].Lb[i]:PL.Lb[i];if(ch.length>1)console.log('line',i,'changed by',ch);if(PJ.Lb[i]!==exp){ok=false;console.log('LIB line',i,'differs from expected',ch);}}console.log('LIB lines as expected:',ok);
// rebuilt stub sources: for each stub, equals the package's rebuild where that package changed it
let ok2=true;for(const e in PJ.M){const ch=Object.keys(pp).filter(k=>reb(pp[k],e)!==reb(PL,e));const exp=ch.length===1?reb(pp[ch[0]],e):ch.length?null:reb(PL,e);if(ch.length>1)console.log('stub',e,'changed by',ch);else if(reb(PJ,e)!==exp){ok2=false;console.log('stub',e,'differs');}}console.log('stub sources as expected:',ok2);
// non-library nodes
const key=n=>JSON.stringify(n.parameters);let ok3=true;for(const n of J.nodes){if(n.name==='Shared Library')continue;const ch=Object.keys(P).filter(k=>key(P[k].nodes.find(x=>x.name===n.name))!==key(L.nodes.find(x=>x.name===n.name)));const exp=ch.length?key(P[ch[0]].nodes.find(x=>x.name===n.name)):key(L.nodes.find(x=>x.name===n.name));if(ch.length>1)console.log('node',n.name,'changed by',ch);if(key(n)!==exp){ok3=false;console.log('node differs',n.name);}}console.log('other nodes as expected:',ok3, J.nodes.length);
