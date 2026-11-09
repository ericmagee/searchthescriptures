const fs=require('fs'),crypto=require('crypto');const {rebuild}=require(process.cwd()+'/pkgLIB/unpack.cjs');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s71.json','utf8'));const N={};for(const n of W.nodes)N[n.name]=n.parameters.jsCode;
for(const P of process.argv.slice(2)){const ST='pkgLIB/strip_'+P.replace('pkgLIB_','');
 const lib=fs.readFileSync(P+'/patched/Shared_Library.js','utf8');let bad=0;
 for(const f of fs.readdirSync(P+'/patched').filter(f=>f!=='Shared_Library.js')){if(rebuild(fs.readFileSync(P+'/patched/'+f,'utf8'),lib)!==fs.readFileSync(ST+'/patched/'+f,'utf8')){bad++;console.log('MISMATCH',P,f);}}
 fs.mkdirSync(P+'/e4_rebase',{recursive:true});const stub=fs.readFileSync(P+'/patched/Alternate_Build.js','utf8').split('\n').slice(0,8);
 for(const [k,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const nw=stub.concat(N[k].split('\n').slice(8)).join('\n');
  const ok=rebuild(stub.join('\n')+'\nreturn await new Function(',lib)===fs.readFileSync(ST+'/patched/Alternate_Build.js','utf8');fs.writeFileSync(P+'/e4_rebase/'+f,nw);console.log(P,k,h(N[k]),'->',h(nw),'rebuild=strip',ok);}
 const out={};for(const f of fs.readdirSync(P+'/patched')){const name=f.replace(/\.js$/,'').replace(/_/g,' ');out[name]=[N[name]?h(N[name]):'(new)',h(fs.readFileSync(P+'/patched/'+f,'utf8'))];}
 fs.writeFileSync(P+'/hashes.json',JSON.stringify(out,null,1));console.log(P,'stubs ok',bad===0,'SL',h(lib));}
