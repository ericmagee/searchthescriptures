const fs=require('fs');let d=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s119.json','utf8'));d=d.data||d;d=d.workflow||d;
const by={};d.nodes.forEach(n=>by[n.name]=n);const LT=by['Shared Library'].parameters.jsCode;
const L=JSON.parse(LT.slice(LT.indexOf('\n/*LIB*/')+8,LT.lastIndexOf('\n/*MAP*/')));const MAP=JSON.parse(LT.slice(LT.lastIndexOf('\n/*MAP*/')+8,LT.lastIndexOf('\n/*END*/')));
fs.mkdirSync('src',{recursive:true});
for(const n of d.nodes){const c=n.parameters&&n.parameters.jsCode;if(!c||n.name==='Shared Library')continue;let s=c;const M=MAP[n.name];if(M&&c.includes('pkgLIB stub')){s=M.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n')+'\n/*__STUBTAIL__*/\n'+c;}
fs.writeFileSync('src/'+n.name.replace(/[^\w]+/g,'_')+'.js',s);}
