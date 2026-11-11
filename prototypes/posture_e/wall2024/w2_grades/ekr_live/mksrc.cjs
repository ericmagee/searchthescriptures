// rebuild enforcer builder sources from two workflow files (old, new) into a src dir, for the pkgEKR replay on live
const fs=require('fs');const [,,oldF,newF,dir]=process.argv;fs.mkdirSync(dir+'/pkgEKR/src',{recursive:true});
const rebuild=(stub,lib)=>{let i=stub.indexOf('\nreturn await new Function(');if(i<0)i=stub.indexOf('\nconst __e4h');const $=n=>({params:{jsCode:lib}});return new Function('$',stub.slice(0,i)+'\nreturn __S;')($);};
const W=f=>{const D=JSON.parse(fs.readFileSync(f,'utf8'));const w=(D.data||D).workflow||(D.data||D);const by={};w.nodes.forEach(n=>by[n.name]=n);return by;};
const O=W(oldF),N=W(newF);for(const node of ['Judge Enforcer Build','Alt Judge Enforcer Build']){const f=dir+'/pkgEKR/src/'+node.replace(/ /g,'_');fs.writeFileSync(f+'.old.js',rebuild(O[node].parameters.jsCode,O['Shared Library'].parameters.jsCode));fs.writeFileSync(f+'.new.js',rebuild(N[node].parameters.jsCode,N['Shared Library'].parameters.jsCode));}
