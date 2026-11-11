const fs=require('fs');const D=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s142.json','utf8'));const W=(D.data||D).workflow||(D.data||D);
const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');const L=JSON.parse(c.slice(a,b));const M=JSON.parse(c.slice(b+8,c.lastIndexOf('\n/*END*/')));
L.forEach((l,i)=>{const k=l.indexOf('stand graded');if(k>=0)console.log(i,l.slice(Math.max(0,k-700),k+300),'\n USED BY',Object.entries(M).filter(([n,v])=>v.p.some(p=>p===i||(Array.isArray(p)&&typeof p[0]==='number'&&p[0]<=i&&i<=p[1]))).map(x=>x[0]).join(', '),'\n');});
W.nodes.forEach(n=>{const s=n.parameters.jsCode||'';if(n.name!=='Shared Library'&&s.includes('stand graded'))console.log('NODE',n.name);});
