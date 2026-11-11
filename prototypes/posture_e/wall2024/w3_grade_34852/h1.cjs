const fs=require('fs');let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json'));d=d.data||d;d=d.workflow||d;const t=d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
function src(name){const m=M[name];const o=[];for(const p of m.p){if(Array.isArray(p)){if(typeof p[0]==='string')o.push(p[0]);else for(let i=p[0];i<=p[1];i++)o.push(L[i]);}else o.push(L[p]);}const s=o.join('\n');return s;}
function hook(name,fn){let s=src(name);const i=s.lastIndexOf('\nconst PASS=');if(i<0)throw new Error('no PASS');s=s.slice(0,i)+'\nreturn __H(n=>eval(n));'+s.slice(i);const $=()=>{throw new Error('no $')};return new Function('$','$input','__H',s)($,{},fn);}
module.exports={src,hook,L,M};
if(require.main===module){const s=src('Gate Record');console.log(s.length,M['Gate Record'].n);}
