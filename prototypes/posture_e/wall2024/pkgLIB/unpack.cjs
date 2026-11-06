// pkgLIB unpack: rebuilds each node's full source from its stub and the Shared Library, exactly as the stub does in n8n.
// Usage (from wall2024/): node pkgLIB/unpack.cjs [stub dir, default pkgLIB/patched] [out dir, default pkgLIB/unpacked]
// Also usable as a module: require('./pkgLIB/unpack.cjs').rebuild(stubText, libText) -> full source.
const fs=require('fs');
function rebuild(stub,lib){const i=stub.indexOf('\nreturn await new (');if(i<0)throw new Error('not a pkgLIB stub');
 const $=n=>{if(n!=='Shared Library')throw new Error('stub read '+n+' before rebuilding');return {params:{jsCode:lib}};};
 return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);}
module.exports={rebuild};
if(require.main===module){const SD=process.argv[2]||'pkgLIB/patched',OD=process.argv[3]||'pkgLIB/unpacked';fs.mkdirSync(OD,{recursive:true});
 const lib=fs.readFileSync(SD+'/Shared_Library.js','utf8');
 for(const f of fs.readdirSync(SD).filter(f=>f.endsWith('.js')&&f!=='Shared_Library.js').sort()){fs.writeFileSync(OD+'/'+f,rebuild(fs.readFileSync(SD+'/'+f,'utf8'),lib));console.log(f);}}
