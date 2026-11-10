// Offline sketch only (W2). D2, D3, D4: the last-message marker uses the 5-minute TTL (the system marker keeps 1h).
const fs=require('fs');const P=process.argv[2]||'pkgLIB/strip_W2S114/patched/';
const O="text:x.content,cache_control:__cc}]}:x);";const N="text:x.content,cache_control:{type:'ephemeral'}}]}:x);";
let tot=0;for(const n of ['D2','D3','D4']){const f=P+n+'_Build.js';const a=fs.readFileSync(f,'utf8');if(a.split(O).length!==2)throw n+' anchor';
 const b=a.replace(O,N);fs.writeFileSync(__dirname+'/'+n+'_Build.sketch.js',b);console.log(n,'code',b.length-a.length);tot+=b.length-a.length;}
console.log('total code',tot,'prompt 0');
