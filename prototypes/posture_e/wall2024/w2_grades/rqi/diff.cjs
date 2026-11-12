const fs=require('fs');const R=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));
const lib=w=>{const c=w.nodes.find(n=>n.name=='Shared Library').parameters.jsCode;return {c,L:JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/'))),M:JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')))};};
const live=R('fetchback_live_s149.json'),rqi=R('parent_s149_RQI.json'),jt=R('parent_s149_JOINT_SDS_FLR_RQI.json'),j0=R('parent_s149_JOINT_SDS_FLR.json');
for(const [a,b,t] of [[live,rqi,'live->RQI'],[j0,jt,'joint->joint+RQI']]){const d=a.nodes.filter((n,i)=>JSON.stringify(n)!==JSON.stringify(b.nodes[i])).map(n=>n.name);const A=lib(a),B=lib(b);
 const dl=A.L.map((l,i)=>l!==B.L[i]?i:-1).filter(i=>i>=0);console.log(t,'nodes',a.nodes.length,b.nodes.length,'differ',d,'conn',JSON.stringify(a.connections)===JSON.stringify(b.connections),'lines',A.L.length,B.L.length,'changed idx',dl,'jsCode +',B.c.length-A.c.length);
 for(const i of dl){console.log(' OLD',A.L[i]);console.log(' NEW',B.L[i]);}
 const mk=Object.keys(A.M).filter(k=>JSON.stringify(A.M[k])!==JSON.stringify(B.M[k]));console.log(' MAP changed',mk.length,mk.join(', '));}
