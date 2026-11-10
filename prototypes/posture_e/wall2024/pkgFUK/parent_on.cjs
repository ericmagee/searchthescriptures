// W1: build a parent from a live fetch-back and a packed library folder (any stub form), node for node, then rebuild every library node's source
// from the parent and check it byte for byte against the strip folder the pack came from.
//   node pkgFUK/parent_on.cjs <fetch-back> <pkgLIB_X> <strip_X> <out.json>
const fs=require('fs');const [,,FB,LIBP,STRIP,OUT]=process.argv;const die=m=>{console.error('REFUSED: '+m);process.exit(1);};
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;if(d.nodes.length!==418)die('base has '+d.nodes.length+' nodes');const by={};d.nodes.forEach(n=>by[n.name]=n);const changed=[];
for(const f of fs.readdirSync(LIBP+'/patched').filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(!by[nm])die('no node '+nm);const c=fs.readFileSync(LIBP+'/patched/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;changed.push(nm);}}
for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']]){const c=fs.readFileSync(LIBP+'/e4_rebase/'+f,'utf8');if(by[nm].parameters.jsCode!==c){by[nm].parameters.jsCode=c;changed.push(nm);}}
const src=c=>{const i=c.indexOf('\nif(__S.length!==__N)');const j=c.indexOf('\n',i+1);return new Function('$',c.slice(0,j)+'\nreturn __S;')(()=>({params:{jsCode:by['Shared Library'].parameters.jsCode}}));};
let eq=0;const bad=[];for(const f of fs.readdirSync(STRIP+'/patched').filter(f=>f.endsWith('.js'))){const nm=f.replace(/\.js$/,'').replace(/_/g,' ');if(src(by[nm].parameters.jsCode)===fs.readFileSync(STRIP+'/patched/'+f,'utf8'))eq++;else bad.push(nm);}
const eab=src(by['Early Alternate Build'].parameters.jsCode)===src(by['Alternate Build'].parameters.jsCode);
if(bad.length)die('sources differ: '+bad.join(', '));
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
console.log(OUT.split('/').pop()+': 418 nodes; changed '+changed.length+': '+changed.join(', ')+'; connections unchanged; '+eq+' library sources byte-equal to '+STRIP+'; Early Alternate Build head rebuilds Alternate Build source: '+eab);
