// Rebuild the 42 library node sources from a fetch-back (stubs + Shared Library), named as in pkgLIB/strip_R1/patched. Usage: node pkgKSR/strip_from_fb.cjs <fetchback> <out dir>
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');const [FB,OUT]=process.argv.slice(2);let W=JSON.parse(fs.readFileSync(FB,'utf8'));W=W.data||W;W=W.workflow||W;
const BY={};W.nodes.forEach(n=>BY[n.name.replace(/ /g,'_')+'.js']=n);const lib=BY['Shared_Library.js'].parameters.jsCode;fs.mkdirSync(OUT,{recursive:true});let n=0;
for(const f of fs.readdirSync('pkgLIB/strip_R1/patched')){const nd=BY[f];if(!nd)throw new Error('no node '+f);let t;try{t=rebuild(nd.parameters.jsCode,lib);}catch(e){t=nd.parameters.jsCode;}fs.writeFileSync(OUT+'/'+f,t);n++;}console.log('rebuilt '+n);
