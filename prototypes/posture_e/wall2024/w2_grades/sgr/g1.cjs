const fs=require('fs');const lib=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));const W=(D.data||D).workflow||(D.data||D);const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');return JSON.parse(c.slice(a,b));};
const A=lib('/mnt/project-files/wall2024/fetchback_live_s141.json'),B=lib('/mnt/project-files/wall2024/parent_s141_SGR.json');console.log(A.length,B.length);
A.forEach((l,i)=>{if(l!==B[i]){console.log('--- line',i,'old');console.log(l);console.log('+++ new');console.log(B[i]);}});
