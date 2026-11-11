const fs=require('fs');
const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflowData||j.workflow||j;return j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c))};};
const reb=(P,e)=>P.M[e].p.map(x=>typeof x==='number'?P.Lb[x]:typeof x[0]==='string'?x[0]:P.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
const A=load('/mnt/project-files/wall2024/fetchback_live_s141.json'),B=load('/mnt/project-files/wall2024/parent_s141_ECS.json');const PA=parts(A),PB=parts(B);
const key=n=>JSON.stringify(n.parameters);const mA=new Map(A.nodes.map(n=>[n.name,key(n)]));console.log('nodes differing:',B.nodes.filter(n=>mA.get(n.name)!==key(n)).map(n=>n.name));
const ch=Object.keys(PB.M).filter(e=>reb(PA,e)!==reb(PB,e));console.log('rebuilt sources differing:',ch, ch.map(e=>reb(PB,e).length-reb(PA,e).length));
const dl=[];for(let i=0;i<Math.max(PA.Lb.length,PB.Lb.length);i++)if(PA.Lb[i]!==PB.Lb[i])dl.push(i);console.log('LIB lines changed/added',dl, PA.Lb.length,PB.Lb.length);
for(const i of dl)console.log(i,(PB.Lb[i]||'').slice(0,900));
for(const e of ['Judge Enforcer Build','Alt Judge Enforcer Build','R2 Alt Judge Enforcer Build']){fs.writeFileSync('ecs_'+e.replace(/ /g,'_')+'.old.js',reb(PA,e));fs.writeFileSync('ecs_'+e.replace(/ /g,'_')+'.new.js',reb(PB,e));}
// stub node code diff
for(const e of ['Judge Enforcer Build']){const a=A.nodes.find(n=>n.name===e).parameters.jsCode,b=B.nodes.find(n=>n.name===e).parameters.jsCode;let i=0;while(a[i]===b[i])i++;console.log('stub diff at',i,'old:',a.slice(i-60,i+80),'\nnew:',b.slice(i-60,i+140));}
