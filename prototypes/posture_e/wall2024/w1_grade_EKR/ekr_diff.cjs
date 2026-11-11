const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c)),T};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load('/mnt/project-files/wall2024/fetchback_live_s142.json'),B=load('/mnt/project-files/wall2024/parent_s141_JOINT_EKR.json');const PA=parts(A),PB=parts(B);
const key=n=>JSON.stringify(n.parameters);const mA=new Map(A.nodes.map(n=>[n.name,key(n)]));console.log('nodes',A.nodes.length,B.nodes.length,'differing:',B.nodes.filter(n=>mA.get(n.name)!==key(n)).map(n=>n.name),'conn equal',JSON.stringify(A.connections)===JSON.stringify(B.connections));
console.log('Shared Library delta',PB.T.length-PA.T.length);
const ch=Object.keys(PB.M).filter(e=>reb(PA,e)!==reb(PB,e));console.log('stubs changed',ch.map(e=>e+' '+(reb(PB,e).length-reb(PA,e).length)));
const dl=[];for(let i=0;i<Math.max(PA.Lb.length,PB.Lb.length);i++)if(PA.Lb[i]!==PB.Lb[i])dl.push(i);console.log('LIB lines changed',dl,PA.Lb.length,PB.Lb.length);
// print a word diff of each changed line
for(const i of dl){const a=PA.Lb[i]||'',b=PB.Lb[i]||'';let s=0;while(s<a.length&&a[s]===b[s])s++;let e=0;while(e<a.length-s&&e<b.length-s&&a[a.length-1-e]===b[b.length-1-e])e++;console.log('\n== line',i,'old part:',JSON.stringify(a.slice(s,a.length-e)).slice(0,600),'\n   new part:',b.slice(s,b.length-e).slice(0,2500));}
