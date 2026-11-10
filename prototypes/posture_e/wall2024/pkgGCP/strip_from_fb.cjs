// Full sources of the 42 library nodes of a fetch-back (stubs rebuilt from its Shared Library; Alternate Build from its stub head, as e4_rebase does).
// usage: node pkgGCP/strip_from_fb.cjs <fetch-back> <strip name X>  -> pkgLIB/strip_X/patched/
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');let d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));d=d.data||d;d=d.workflow||d;const by={};d.nodes.forEach(n=>by[n.name]=n);const lib=by['Shared Library'].parameters.jsCode;
const out='pkgLIB/strip_'+process.argv[3]+'/patched/';if(fs.existsSync(out))throw new Error(out+' exists');fs.mkdirSync(out,{recursive:true});
for(const f of fs.readdirSync('pkgLIB/strip_R1/patched')){const c=by[f.slice(0,-3).replace(/_/g,' ')].parameters.jsCode;let t;try{t=rebuild(c,lib);}catch(e){const L=c.split('\n');const i=L.findIndex(l=>l.startsWith('if(__S.length!==__N)'));t=rebuild(L.slice(0,i+1).join('\n')+'\nreturn await new Function(',lib);}fs.writeFileSync(out+f,t);}
console.log('written',fs.readdirSync(out).length);
