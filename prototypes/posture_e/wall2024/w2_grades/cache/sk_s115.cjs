// Re-measure the cache sketch on a workflow file (node code read straight from it).
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const N=n=>W.nodes.find(x=>x.name===n).parameters.jsCode;
const MK="const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);\n";
const one=(a,o,r,n)=>{if(a.split(o).length!==2)throw n+' anchor '+o;return a.replace(o,r);};let tot=0,src='';
for(const n of ['C2','C3','C4','D2','D3','D4']){const a=N(n+' Build');let b=a;
 if(n==='C2')b=one(a,"k===m.length-1&&typeof x.content","k===0&&typeof x.content",n);
 else if(n[0]==='C'){b=one(a,MK,'',n);b=one(b,'messages:__mk(msgs)','messages:msgs',n);b=one(b,'...__mk(msgs)','...msgs',n);if(/__mk/.test(b))throw n+' left';}
 else b=one(a,"text:x.content,cache_control:__cc}]}:x);","text:x.content,cache_control:{type:'ephemeral'}}]}:x);",n);
 src+='(async function(){'+b+'\n});\n';console.log(n,b.length-a.length);tot+=b.length-a.length;}
new Function(src);console.log('total',tot,'syntax ok');
