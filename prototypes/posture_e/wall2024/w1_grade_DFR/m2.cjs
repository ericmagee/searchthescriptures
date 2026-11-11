const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const L=w=>{const T=un(w).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const N=new Function(L('/mnt/project-files/wall2024/parent_s143_DFR.json')[1898].trim()+';return OPEN;')();
const O=new Function(L('/mnt/project-files/wall2024/parent_s142_JOINT_A21_SRH.json')[1898].trim()+';return OPEN;')();
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8')).data.resultData.runData;const seen=new Set();
const walk=o=>{if(typeof o==='string'){for(const l0 of o.split('\n')){const l=l0.replace(/\\+"/g,'"');if(!l.includes('D2 vs C1 (Matthew 1:18, 1:24-25')||!/UNDERDETERMINED/.test(l)||seen.has(l))continue;seen.add(l);if(N.test(l)&&!O.test(l)){const m=l.match(N);console.log(JSON.stringify(l.slice(Math.max(0,m.index-200),m.index+80)));}}}else if(o&&typeof o==='object')for(const k in o)walk(o[k]);};
for(const k in rd)rd[k].forEach(r=>walk(r.data));
