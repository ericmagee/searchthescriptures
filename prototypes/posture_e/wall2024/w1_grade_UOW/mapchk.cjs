const fs=require('fs');
function chk(path,label){let j=JSON.parse(fs.readFileSync(path,'utf8'));j=j.data||j;j=j.workflowData||j.workflow||j;
const T=j.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));
const reb=e=>M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');
let bad=[],comp=[],n=0;for(const e in M){n++;const s=reb(e);if(s.length!==M[e].n)bad.push(e+' '+s.length+'!='+M[e].n);try{new Function('$','$input','$json','$execution','$node','$items',s);}catch(er){comp.push(e+': '+er.message);}}
const sha=require('crypto').createHash('sha256').update(JSON.stringify(Lb)).digest('hex').slice(0,16);const hdr=(T.match(/library sha ([0-9a-f]{16})/)||[])[1];
console.log(label,'stubs',n,'length mismatches',bad.length,bad.slice(0,10),'compile errors',comp.length,comp.slice(0,5),'header sha',hdr,'computed',sha, 'file sha256',require('crypto').createHash('sha256').update(fs.readFileSync(path)).digest('hex').slice(0,16));}
for(const p of process.argv.slice(2))chk(p,p.split('/').pop());
