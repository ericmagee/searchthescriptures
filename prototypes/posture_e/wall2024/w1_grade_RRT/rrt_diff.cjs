const fs=require('fs');const load=p=>{let j=JSON.parse(fs.readFileSync(p,'utf8'));j=j.data||j;j=j.workflowData||j.workflow||j;return j;};
const A=load('/mnt/project-files/wall2024/fetchback_live_s141.json'),B=load('/mnt/project-files/wall2024/parent_s141_RRT.json');
const key=n=>JSON.stringify(n.parameters);const mA=new Map(A.nodes.map(n=>[n.name,n]));const d=B.nodes.filter(n=>key(mA.get(n.name))!==key(n));
console.log('nodes',A.nodes.length,B.nodes.length,'differing',d.map(n=>n.name+' '+(n.parameters.jsCode.length-mA.get(n.name).parameters.jsCode.length)));
const deep=o=>Array.isArray(o)?o.map(deep):(o&&typeof o==='object')?Object.fromEntries(Object.keys(o).sort().map(k=>[k,deep(o[k])])):o;console.log('connections equal',JSON.stringify(deep(A.connections))===JSON.stringify(deep(B.connections)));
for(const n of d){try{new Function('$','$input',n.parameters.jsCode);}catch(e){console.log('COMPILE',n.name,e.message);}}
for(const n of d){fs.writeFileSync('rrt_'+n.name.replace(/ /g,'_')+'.old.js',mA.get(n.name).parameters.jsCode);fs.writeFileSync('rrt_'+n.name.replace(/ /g,'_')+'.new.js',n.parameters.jsCode);}
const o=mA.get('Reread Build').parameters.jsCode,nn=d.find(n=>n.name==='Reread Build').parameters.jsCode;let i=0;while(o[i]===nn[i])i++;let a=o.length-1,b=nn.length-1;while(o[a]===nn[b]){a--;b--;}console.log('Reread Build change:\n OLD:',o.slice(i-100,a+1),'\n NEW:',nn.slice(i-100,b+1));
const bs=['Reread Build','Alt Reread Build','R2 Alt Reread Build'].map(x=>d.find(n=>n.name===x).parameters.jsCode);console.log('three builds same after name mask:',new Set(bs.map(s=>s.replace(/R2 Alt |Alt /g,''))).size===1);
