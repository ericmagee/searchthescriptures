// pkgCCM (W2): debater cache markers, C side only (ASK 41 option 1).
// C2 marks its first message (C1's cached opening) instead of its last; C3 and C4 send no message marker (system marker kept).
const fs=require('fs');const BASE=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s115.json',OUT=process.argv[3]||'/mnt/project-files/wall2024/parent_s115_CCM.json';
const W=JSON.parse(fs.readFileSync(BASE));const N=n=>W.nodes.find(x=>x.name===n);
const MK="const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);\n";
const one=(a,o,r,n)=>{if(a.split(o).length!==2)throw new Error(n+' anchor not found once: '+o.slice(0,50));return a.replace(o,r);};let tot=0;
for(const n of ['C2','C3','C4']){const node=N(n+' Build');const a=node.parameters.jsCode;let b;
 if(n==='C2')b=one(a,"k===m.length-1&&typeof x.content","k===0&&typeof x.content",n);
 else{b=one(a,MK,'',n);b=one(b,'messages:__mk(msgs)','messages:msgs',n);b=one(b,'...__mk(msgs)','...msgs',n);if(/__mk/.test(b))throw new Error(n+' __mk left');}
 node.parameters.jsCode=b;console.log(n+' Build',b.length-a.length);tot+=b.length-a.length;}
fs.writeFileSync(OUT,JSON.stringify(W));console.log('total code',tot,'prompt 0; wrote',OUT);
