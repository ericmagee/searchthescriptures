// Offline sketch only (W2). Debater cache markers: C2 marks its first message (C1's cached opening) instead of its last;
// C3 and C4 send no message marker (system marker kept). Measures code size per node.
const fs=require('fs');const P=process.argv[2]||'pkgLIB/strip_W2S114/patched/';
const MK="const __mk=m=>m.map((x,k)=>k===m.length-1&&typeof x.content==='string'?{role:x.role,content:[{type:'text',text:x.content,cache_control:__cc}]}:x);\n";
let tot=0;
for(const n of ['C2','C3','C4']){
 const f=P+n+'_Build.js';const a=fs.readFileSync(f,'utf8');let b=a;
 if(n==='C2'){const o="k===m.length-1&&typeof x.content";if(a.split(o).length!==2)throw n+' anchor';b=a.replace(o,"k===0&&typeof x.content");}
 else{ if(a.split(MK).length!==2)throw n+' mk';b=a.replace(MK,'');
  for(const [o,r] of [['messages:__mk(msgs)','messages:msgs'],['...__mk(msgs)','...msgs']]){if(b.split(o).length!==2)throw n+' '+o;b=b.replace(o,r);}
  if(/__mk/.test(b))throw n+' __mk left';}
 fs.writeFileSync(__dirname+'/'+n+'_Build.sketch.js',b);
 console.log(n,'code',b.length-a.length);tot+=b.length-a.length;
}
console.log('total code',tot,'prompt 0');
