// pkgSTB (W3; the operator's approval 17:48 CST 11-09, thread message "1" to ASK 1): stub form 3. Base: live s90 (418 nodes), library strip_VP1_s84 (copied unchanged as strip_STB).
// No line of any node's running code changes. Each library node's line list, own lines and length move from its stub into the Shared Library (/*MAP*/ block, keyed by node name).
//   cp -r pkgLIB/strip_VP1_s84 pkgLIB/strip_STB
//   STUBV=3 FB=/mnt/project-files/wall2024/fetchback_live_s90.json node gate/pack.cjs pkgLIB/strip_STB pkgLIB_STB
//   node pkgSTB/build_STB.cjs [fetch-back] [pkgLIB_X, default pkgLIB_STB] [out]   -> pkgSTB/parent_s90_STB.json
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const die=m=>{console.error('BUILD REFUSED: '+m);process.exit(1);};
const FB=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s90.json',LIBP=process.argv[3]||'pkgLIB_STB',OUT=process.argv[4]||__dirname+'/parent_s90_STB.json';
let d=JSON.parse(fs.readFileSync(FB,'utf8'));d=d.data||d;d=d.workflow||d;const NODES=+(process.env.NODES||418);if(d.nodes.length!==NODES)die('base has '+d.nodes.length+' nodes, expected '+NODES);
const by={};d.nodes.forEach(n=>by[n.name]=n);const P=W+'/'+LIBP+'/patched';if(!fs.existsSync(P))die('pack first');const changed=[],same=[];
const set=(nm,c)=>{const n=by[nm];if(!n)die('no node '+nm);if(n.parameters.jsCode!==c){n.parameters.jsCode=c;changed.push(nm);}else same.push(nm);};
for(const f of fs.readdirSync(P).filter(f=>f.endsWith('.js')).sort())if(f!=='Alternate_Build.js')set(f.replace(/\.js$/,'').replace(/_/g,' '),fs.readFileSync(P+'/'+f,'utf8'));
for(const [nm,f] of [['Alternate Build','Alternate_Build.js'],['Early Alternate Build','Early_Alternate_Build.js']])set(nm,fs.readFileSync(W+'/'+LIBP+'/e4_rebase/'+f,'utf8'));
for(const n of d.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c==='string'&&n.name!=='Shared Library'&&c.includes("$('Shared Library')")&&!/^\/\/ pkgLIB stub, form 3: /.test(c))die(n.name+' reads the Shared Library and is not a form 3 stub');}
fs.writeFileSync(OUT,JSON.stringify({nodes:d.nodes,connections:d.connections,settings:d.settings},null,1));
console.log(path.basename(OUT)+': '+d.nodes.length+' nodes; changed '+changed.length+' ('+changed.join(', ')+'); unchanged library nodes '+same.length+(same.length?' ('+same.join(', ')+')':'')+'; connections unchanged');
