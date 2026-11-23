const fs=require('fs');const T=fs.readFileSync(__dirname+'/../rb566/eng_Shared_Library_new.js','utf8');
const L=JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(T.slice(T.lastIndexOf('\n/*MAP*/')+8,T.lastIndexOf('\n/*END*/')));
const S=M.LAY.p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');fs.writeFileSync(__dirname+'/lay569.js',S);
const LAY=new Function(S+'\nreturn LAY;')();const R=require('/mnt/project-files/ask557/w4/build/rounds41822.json');
for(const k of ['CR1','DR1','CR4']){for(const o of [undefined,{oracle:true}]){let c;try{c=LAY.check(R[k],undefined,o);}catch(e){console.log(k,'err',e.message);continue;}
 console.log(k,JSON.stringify(o),'items',c.items.length);c.items.slice(0,40).forEach(x=>console.log('   ',String(x.head).slice(0,70),'--',String(x.why).slice(0,90)));}}
