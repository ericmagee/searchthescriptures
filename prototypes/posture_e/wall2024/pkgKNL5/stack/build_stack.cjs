// W2: one stacked library = pkgFUK rev 3 + pkgFCD + pkgKNL rev 5 (strip_FCD with knlNone2024 replaced as build_KNL5 does), so one write covers all three.
//   node pkgKNL5/stack/build_stack.cjs  -> pkgLIB/strip_FCDKNL5
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'../..');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const NEW=fs.readFileSync(W+'/pkgKNL5/knl5_fn.js','utf8');const HEAD='function knlNone2024(',NEXT='function kfLines(';
const A=W+'/pkgLIB/strip_FCD',B=W+'/pkgLIB/strip_FCDKNL5',K=W+'/pkgLIB/strip_KNL5',V=W+'/pkgLIB/strip_VP1_s84';if(fs.existsSync(B))die(B+' exists');fs.mkdirSync(B+'/patched',{recursive:true});
const cut=s=>{const i=s.indexOf(HEAD);if(i<0||s.indexOf(HEAD,i+1)>=0)die('knlNone2024 count');const j=s.indexOf(NEXT,i);if(j<0)die('no kfLines');return [s.slice(0,i),s.slice(i,j),s.slice(j)];};
let n=0,old=null;
for(const f of fs.readdirSync(A+'/patched').filter(f=>f.endsWith('.js')).sort()){const [a,o,b]=cut(fs.readFileSync(A+'/patched/'+f,'utf8'));
 const [va,vo,vb]=cut(fs.readFileSync(V+'/patched/'+f,'utf8'));if(o!==vo)die(f+': FCD base knlNone2024 differs from the KNL5 base');
 const [ka,ko,kb]=cut(fs.readFileSync(K+'/patched/'+f,'utf8'));if(ko!==NEW||ka!==va||kb!==vb)die(f+': strip_KNL5 is not base + knl5_fn');
 const s=a+NEW+b;new Function('$','$input','return (async()=>{\n'+s+'\n})();');fs.writeFileSync(B+'/patched/'+f,s);n++;}
console.log('strip_FCDKNL5: '+n+' files; each = strip_FCD with knlNone2024 replaced by knl5_fn.js; FCD base function equal to KNL5 base function in every file');
