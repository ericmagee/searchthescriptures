// W1 grade of the ASK 88 joint: every node and library line equals live s142 or exactly one graded single.
const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflowData||j.workflow||j;};
const lib=w=>{const T=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');return {Lb:JSON.parse(T.slice(a+8,b)),M:JSON.parse(T.slice(b+8,c)),len:T.length};};
const W='/mnt/project-files/wall2024/';const S=load(W+'fetchback_live_s142.json'),J=load(W+'parent_s142_JOINT_EKR_SGR_AMG.json');
const singles={EKR:load(W+'parent_s141_JOINT_EKR.json'),SGR:load(W+'parent_s142_SGR.json'),AMG:load(W+'parent_s142_AMG.json')};
const key=n=>JSON.stringify(n.parameters);const mS=new Map(S.nodes.map(n=>[n.name,key(n)]));console.log('nodes',S.nodes.length,J.nodes.length,'differing from s142:',J.nodes.filter(n=>mS.get(n.name)!==key(n)).map(n=>n.name),'connections equal',JSON.stringify(S.connections)===JSON.stringify(J.connections));
const ls=lib(S),lj=lib(J),LX=Object.fromEntries(Object.entries(singles).map(([k,v])=>[k,lib(v)]));let bad=0;const by={};
for(let i=0;i<Math.max(ls.Lb.length,lj.Lb.length);i++){const own=Object.keys(LX).filter(k=>LX[k].Lb[i]!==ls.Lb[i]);if(lj.Lb[i]===ls.Lb[i]&&!own.length)continue;
 if(own.length!==1||lj.Lb[i]!==LX[own[0]].Lb[i]){bad++;console.log('LINE',i,'changed by',own,'joint equals s142',lj.Lb[i]===ls.Lb[i]);}else(by[own[0]]=by[own[0]]||[]).push(i);}
console.log('lines by package',JSON.stringify(by),'faults',bad,'LIB lengths',ls.Lb.length,lj.Lb.length);
console.log('code delta joint',lj.len-ls.len,'singles',Object.fromEntries(Object.entries(LX).map(([k,v])=>[k,v.len-ls.len])));
// singles that are not on s142 (EKR is on the joint 3aa73d1c, equal to s142): check its other lines equal s142
for(const [k,v] of Object.entries(LX)){let o=0;for(let i=0;i<ls.Lb.length;i++)if(v.Lb[i]!==ls.Lb[i]&&!(by[k]||[]).includes(i))o++;console.log(k,'lines differing from s142 outside its own:',o);}
