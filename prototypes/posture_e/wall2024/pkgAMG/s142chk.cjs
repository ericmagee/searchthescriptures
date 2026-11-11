const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const parts=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c)),T};};
const L=load('/mnt/project-files/wall2024/fetchback_live_s142.json'),J=load('/mnt/project-files/wall2024/parent_s141_JOINT_PCS_ECS_RRT.json'),P=load('/home/claude/pcs_parent.json'.replace('/home/claude/pcs_parent.json','/mnt/project-files/wall2024/parent_s141_PCS.json'));
console.log('nodes',L.nodes.length,J.nodes.length);const key=n=>JSON.stringify(n.parameters);const mJ=new Map(J.nodes.map(n=>[n.name,key(n)]));
const diff=L.nodes.filter(n=>mJ.get(n.name)!==key(n)).map(n=>n.name);console.log('live nodes differing from joint parent:',diff);
console.log('connections equal',JSON.stringify(L.connections)===JSON.stringify(J.connections));
const pl=parts(L),pp=parts(P);for(const i of [1381,1643])console.log('line',i,'live equals my pkgPCS build',pl.Lb[i]===pp.Lb[i],/pkgPCS/.test(pl.Lb[i]));
const reb=(X,e)=>X.M[e].p.map(x=>typeof x==='number'?X.Lb[x]:typeof x[0]==='string'?x[0]:X.Lb.slice(x[0],x[1]+1).join('\n')).join('\n');let bad=0,n=0;for(const e in pl.M){n++;const s=reb(pl,e);if(s.length!==pl.M[e].n)bad++;try{new Function('$','$input',s)}catch(er){bad++;}}
console.log('live stubs',n,'faults',bad,'header sha',(pl.T.match(/library sha ([0-9a-f]{16})/)||[])[1],'computed',require('crypto').createHash('sha256').update(JSON.stringify(pl.Lb)).digest('hex').slice(0,16));
