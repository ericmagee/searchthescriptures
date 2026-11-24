const fs=require('fs');const nodes=[];
for(const [f,tag] of [["eng.json","E"],["child.json","C"]]){const w=JSON.parse(fs.readFileSync(f));for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(c&&n.name!=='Shared Library')nodes.push({id:tag+':'+n.name,c})}}
for(const nm of ['__MT','__A423','__O423','POSTURE','C4P','__RL','PWL','IMP','L2C','PART2']){const per={};
 for(const n of nodes){const re=new RegExp('(?:const|let|var)\\s+'+nm.replace(/\$/g,'\\$')+'\\s*=','g');let m;while((m=re.exec(n.c))){// extent: to end of physical line
  const e=n.c.indexOf('\n',m.index);const seg=n.c.slice(m.index,e<0?n.c.length:e);per[n.id]=(per[n.id]||'')+seg;}}
 const ids=Object.keys(per);if(!ids.length){console.log(nm,'none');continue}const lens=ids.map(i=>per[i].length);const tot=lens.reduce((a,b)=>a+b,0);
 console.log(nm,'| nodes',ids.length,'| texts',new Set(Object.values(per)).size,'| max',Math.max(...lens),'| total',tot,'|',ids.map(x=>x.replace('E:','')).join(', ').slice(0,200));}
