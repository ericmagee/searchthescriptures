const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const live=un('/tmp/claude-0/fetchback_live_s128.json'),A=un('/tmp/claude-0/parent_s128_A1N3.json'),R=un('/mnt/project-files/wall2024/parent_s128_RCL3.json');
const mk=(first,second)=>{const M=JSON.parse(JSON.stringify(live));const put=(w,name)=>{const i=M.nodes.findIndex(n=>n.name===name);M.nodes[i]=JSON.parse(JSON.stringify(w.nodes.find(n=>n.name===name)));};
 for(const [w,name] of [first,second])put(w,name);return M;};
const J1=mk([A,'Shared Library'],[R,'Close Enforcer Build']),J2=mk([R,'Close Enforcer Build'],[A,'Shared Library']);
console.log('either order identical',JSON.stringify(J1)===JSON.stringify(J2));fs.writeFileSync('/tmp/claude-0/joint_A1N3_RCL3.json',JSON.stringify(J1));
const L=require('/mnt/project-files/w4/kwn/lib.cjs');const xl=L('/tmp/claude-0/fetchback_live_s128.json'),xa=L('/tmp/claude-0/parent_s128_A1N3.json'),xr=L('/mnt/project-files/wall2024/parent_s128_RCL3.json'),xj=L('/tmp/claude-0/joint_A1N3_RCL3.json');
console.log('Close Enforcer Build has MAP entry',!!xl.M['Close Enforcer Build'],'MAP entry same live/A1N',JSON.stringify(xl.M['Close Enforcer Build'])===JSON.stringify(xa.M['Close Enforcer Build']));
const names=live.nodes.filter(n=>n.type&&n.type.includes('code')).map(n=>n.name);let d=[];
for(const n of names){let cj,cl,ca,cr;try{cj=xj.code(n);cl=xl.code(n);ca=xa.code(n);cr=xr.code(n);}catch(e){continue;}
 const exp=ca!==cl?ca:cr; // expected: A1N's if A1N changed it, else RCL's
 if(ca!==cl&&cr!==cl)d.push('BOTH '+n);else if(cj!==exp)d.push('MISMATCH '+n);else if(cj!==cl)d.push('changed '+n+(ca!==cl?' (A1N)':' (RCL)'));}
console.log(d.join('\n'));
const len=w=>w.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);console.log('joint code',len(J1)-len(live));
const RM=require('/home/claude/searchthescriptures/prototypes/posture_e/wall2024/pkgLIB/runner_model.cjs');const x=RM.needs(xr.code('Close Enforcer Build'));console.log('RCL node reads',x.all?'ALL':[...x.nodes].join(', '));
