const fs=require('fs');
let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s130.json'));d=d.data||d;d=d.workflow||d;
const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
const pats=process.argv.slice(2);
// which map names use lines containing the phrase
const hit={};L.forEach((l,i)=>{for(const p of pats)if(l.includes(p)){(hit[p]=hit[p]||[]).push(i);}});
for(const p of pats){console.log(p,'lines',hit[p]);}
for(const [name,m] of Object.entries(M)){const idx=new Set();for(const e of m.p){if(typeof e==='number')idx.add(e);else if(typeof e[0]!=='string')for(let i=e[0];i<=e[1];i++)idx.add(i);}
 for(const p of pats)if((hit[p]||[]).some(i=>idx.has(i)))console.log('  node',name,'uses',p);
 for(const e of m.p){if(Array.isArray(e)&&typeof e[0]==='string')for(const p of pats)if(e[0].includes(p))console.log('  node',name,'OWN line has',p);}}
