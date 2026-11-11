const fs=require('fs');const lib=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));const W=(D.data||D).workflow||(D.data||D);const c=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const a=c.indexOf('\n/*LIB*/')+8,b=c.lastIndexOf('\n/*MAP*/');return JSON.parse(c.slice(a,b));};
const A=lib('/mnt/project-files/wall2024/fetchback_live_s141.json'),B=lib('/mnt/project-files/wall2024/parent_s141_SGR.json');
const nl=A.findIndex((l,i)=>i<3163&&i>3100&&/const N=/.test(l));const Nsrc=nl>=0?A[nl]:null;console.log('N line',nl,Nsrc&&Nsrc.slice(0,200));
const tail=s=>s.slice(0,s.indexOf('return out')>0?undefined:undefined);
// take line 3163 and the next lines until giveUp closes
let o='',n='';for(let i=3163;i<3168;i++){o+=A[i]+'\n';n+=B[i]+'\n';if(/^\s*return /.test(A[i])||/\breturn out\b/.test(A[i]))break;}
console.log(o.slice(-400));
fs.writeFileSync('gu_old.js',o);fs.writeFileSync('gu_new.js',n);
