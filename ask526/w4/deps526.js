// ASK 526 (W4): find the Library lines cpdSync needs, starting from the Alternate Merge ERT entry, by running it on the 37 stored rows.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const t=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const L=JSON.parse(t.slice(t.indexOf('\n/*LIB*/')+8,t.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(t.slice(t.lastIndexOf('\n/*MAP*/')+8,t.lastIndexOf('\n/*END*/')));
const D=JSON.parse(fs.readFileSync('/mnt/project-files/ask526/w3/cpd37.json','utf8'));
const mk=()=>({isExecuted:false,first:()=>({json:{}}),all:()=>[],params:{}});const $=n=>n==='Shared Library'?{params:{jsCode:t}}:mk();
let p=M['Alternate Merge ERT'].p.slice();const flat=x=>x.flatMap(e=>typeof e==='number'?[e]:typeof e[0]==='string'?[]:Array.from({length:e[1]-e[0]+1},(_,k)=>e[0]+k));
const add=i=>{if(!flat(p).includes(i))p.push(i);};p.push([885,888],[1376,1383],[1536,1546]);
for(let it=0;it<40;it++){const S=p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
 let F;try{F=new Function('$',S+'\nreturn {cpdSync,rcObjEnd};')($);}catch(e){const m=String(e.message).match(/(\w+) is not defined/);if(!m){console.log('LOAD ERR',e.message);break;}const i=L.findIndex(l=>new RegExp('(?:function\\s+|(?:const|let|var)\\s+)'+m[1]+'\\b').test(l));console.log('load needs',m[1],i);if(i<0)break;add(i);continue;}
 let need=null;for(const r of D){const raw=r.raw;const a=raw.indexOf('{');if(a<0)continue;const b=F.rcObjEnd(raw,a);if(b<0)continue;const j=raw.slice(a,b);try{F.cpdSync(j,{conceded_links:'X',challenger_conceded_links:'X'},r.seat);}catch(e){const m=String(e.message).match(/(\w+) is not defined/);if(m){need=m[1];break;}console.log('ERR',r.id,e.message);}}
 if(!need){console.log('OK p',JSON.stringify(p));fs.writeFileSync('cpd_p.json',JSON.stringify(p));break;}
 const i=L.findIndex(l=>new RegExp('(?:function\\s+|(?:const|let|var)\\s+)'+need+'\\b').test(l));console.log('run needs',need,i);if(i<0)break;add(i);}
