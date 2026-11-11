// joint88: every Shared Library line equals s142 or exactly one graded parent (EKR, SGR s142, AMG s142); every other node equals s142
const fs=require('fs');const ld=f=>{const D=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f+'.json','utf8'));return (D.data||D).workflow||(D.data||D);};
const lib=W=>{const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');return JSON.parse(c.slice(a,b));};
const J=ld('parent_s142_JOINT_EKR_SGR_AMG'),B=ld('fetchback_live_s142');const P={EKR:ld('parent_s141_JOINT_EKR'),SGR:ld('parent_s142_SGR'),AMG:ld('parent_s142_AMG')};
const LJ=lib(J),LB=lib(B),LP=Object.fromEntries(Object.entries(P).map(([k,w])=>[k,lib(w)]));const from={EKR:[],SGR:[],AMG:[]};let bad=0;
LJ.forEach((l,i)=>{const ch=Object.keys(LP).filter(k=>LP[k][i]!==LB[i]);if(ch.length>1)bad++;if(!ch.length){if(l!==LB[i])bad++;return;}if(l===LP[ch[0]][i])from[ch[0]].push(i);else bad++;});
const other=J.nodes.filter(n=>n.name!=='Shared Library'&&JSON.stringify(n.parameters)!==JSON.stringify(B.nodes.find(z=>z.name===n.name).parameters)).map(n=>n.name);
const code=W=>W.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
console.log('lines from',JSON.stringify(from),'| bad',bad,'| other nodes differing from s142',other,'| connections equal',JSON.stringify(J.connections)===JSON.stringify(B.connections));
console.log('SIZE code vs s142: joint',code(J)-code(B),'| singles: EKR (vs its base 3aa73d1c = s142)',code(P.EKR)-code(B),'SGR',code(P.SGR)-code(B),'AMG',code(P.AMG)-code(B));
