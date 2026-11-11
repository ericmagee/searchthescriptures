// W1 identity check of the combined DFR + PCQ file against the two graded parents and live s144, node by node.
const fs=require('fs'),cr=require('crypto');const W='/mnt/project-files/wall2024/';
const sha=p=>cr.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const un=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;return j.workflow||j;};
const F={J:W+'parent_s144_JOINT_DFR_PCQ.json',D:W+'parent_s143_DFR.json',P:W+'parent_s143_PCQ.json',L:W+'fetchback_live_s144.json'};
for(const k in F)console.log(k,F[k].split('/').pop(),sha(F[k]).slice(0,16));
const w={};for(const k in F)w[k]=un(F[k]);const byN=x=>Object.fromEntries(x.nodes.map(n=>[n.name,JSON.stringify(n)]));const n={};for(const k in w)n[k]=byN(w[k]);
const diff=(a,b)=>{const ks=new Set([...Object.keys(n[a]),...Object.keys(n[b])]);return [...ks].filter(x=>n[a][x]!==n[b][x]);};
console.log('nodes J',w.J.nodes.length,'D',w.D.nodes.length,'P',w.P.nodes.length,'L',w.L.nodes.length);
console.log('J vs DFR differ (whole node JSON):',diff('J','D'));console.log('J vs PCQ differ:',diff('J','P'));console.log('J vs live s144 differ:',diff('J','L'));
for(const x of ['Panel Build','Build Independent Verdict'])console.log(x,'J equals PCQ node byte for byte',n.J[x]===n.P[x]);
console.log('Shared Library J equals DFR byte for byte',n.J['Shared Library']===n.D['Shared Library']);
const c=k=>JSON.stringify(w[k].connections);console.log('connections J=D',c('J')===c('D'),'J=P',c('J')===c('P'),'J=L',c('J')===c('L'));
const top=k=>{const {nodes,connections,...r}=w[k];return JSON.stringify(r);};console.log('other top-level fields J=D',top('J')===top('D'));
const len=(k,x)=>JSON.parse(n[k][x]).parameters.jsCode.length;console.log('code vs live: SL',len('J','Shared Library')-len('L','Shared Library'),'PB',len('J','Panel Build')-len('L','Panel Build'),'BIV',len('J','Build Independent Verdict')-len('L','Build Independent Verdict'));
