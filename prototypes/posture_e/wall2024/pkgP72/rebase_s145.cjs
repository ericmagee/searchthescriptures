// pkgP72 rev 4 rebase onto live s145: the rebased file against the graded rev 4 (on 03b0e907) and against live s145, node by node.
const fs=require('fs');const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};const W='/mnt/project-files/wall2024/';
const w={R:un(W+'parent_s145_P72r4.json'),G:un(W+'parent_s144_P72r4_on_DFR.json'),L:un(W+'fetchback_live_s145.json'),C:un(W+'parent_s144_JOINT_DFR_PCQ.json')};
const n={};for(const k in w)n[k]=Object.fromEntries(w[k].nodes.map(x=>[x.name,JSON.stringify(x)]));
const d=(a,b)=>[...new Set([...Object.keys(n[a]),...Object.keys(n[b])])].filter(x=>n[a][x]!==n[b][x]);
console.log('live s145 vs combined a0938cbd differ:',d('L','C'));
console.log('rebased vs graded rev 4 differ:',d('R','G'));console.log('rebased vs live s145 differ:',d('R','L'));
console.log('Shared Library rebased == graded rev 4',n.R['Shared Library']===n.G['Shared Library']);
for(const x of ['Panel Build','Build Independent Verdict'])console.log(x,'rebased == live s145',n.R[x]===n.L[x]);
console.log('connections R=L',JSON.stringify(w.R.connections)===JSON.stringify(w.L.connections));
