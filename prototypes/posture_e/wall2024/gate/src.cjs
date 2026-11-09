// gate/src.cjs: one library source in the build tree (W1, item 6 of the list Eric approved 11-09, Wall 3627; W2's suggestion 3 in Wall 3620/3623).
// Today every package edits the 30 full node sources in pkgLIB/strip_X/patched by text substitution (cureVerdicts sits in 26 of them).
// This tool keeps ONE copy of each shared piece of code and generates the 30 sources from it, byte for byte.
//
//   node gate/src.cjs split pkgLIB/strip_X pkgLIB/src_X    strip folder -> source folder (refused if the output exists)
//   node gate/src.cjs join  pkgLIB/src_X  pkgLIB/strip_Y   source folder -> strip folder (refused if the output exists); then pack with gate/pack.cjs
//   node gate/src.cjs check pkgLIB/src_X  pkgLIB/strip_X   join in memory and compare byte for byte with a strip folder
//
// Source folder layout:
//   lib/<name>.js     one top-level statement (a function, a const, ...) used by 2 or more nodes, stored once (statements inside an
//                     async wrapper  const X=await (async()=>{...})();  count as top level). <name> is the declared name;
//                     when two nodes hold different versions of the same name, each version gets its own file (<name>~2.js, ...) and
//                     VARIANTS.txt lists the names whose versions sit in different nodes (copies that drifted apart), so a fix can be made to every version on purpose.
//   nodes/<Node>.js   the node's source with each shared statement replaced by one line:  //@lib <name>
//   USES.txt          for each lib file, the nodes that include it (what one edit reaches).
// A package edits lib/<name>.js once (or a node's own text in nodes/), joins to a new strip folder, packs it, and runs gate/replay.cjs.
// Statements are found with acorn (pkgLIB/vendor/acorn.cjs) on the node code wrapped as n8n wraps it; a split is accepted only when join
// gives back every source byte for byte.
const fs=require('fs'),path=require('path');const acorn=require(path.resolve(__dirname,'../pkgLIB/vendor/acorn.cjs'));
const WR='async function VmCodeWrapper() { ';const TAG='//@lib ';
const die=m=>{console.error('REFUSED: '+m);process.exit(1);};
const ls=d=>fs.readdirSync(d).filter(f=>f.endsWith('.js')).sort();
function stmts(code,f){let ast;try{ast=acorn.parse(WR+code+'\n}',{ecmaVersion:2025,sourceType:'module'});}catch(e){die(f+' does not parse: '+e.message);}
 const one=s=>{const nm=s.type==='FunctionDeclaration'&&s.id?s.id.name:s.type==='VariableDeclaration'?s.declarations.map(d=>d.id&&d.id.name||'pattern').join('+'):s.type;
  /* inner: the statements of an async wrapper  const X=await (async()=>{ ... })();  (Alternate Build, Alternate Merge 1 and their R2 copies hold the library there) */
  let inner=null;if(s.type==='VariableDeclaration'&&s.declarations.length===1){let e=s.declarations[0].init;if(e&&e.type==='AwaitExpression')e=e.argument;
   if(e&&e.type==='CallExpression'&&e.callee&&(e.callee.type==='ArrowFunctionExpression'||e.callee.type==='FunctionExpression')&&e.callee.body.type==='BlockStatement')inner=e.callee.body.body.map(one);}
  return {nm,a:s.start-WR.length,b:s.end-WR.length,inner};};
 return ast.body[0].body.body.map(one);}
function split(SD){const F=ls(SD+'/patched');const src={};for(const f of F)src[f]=fs.readFileSync(SD+'/patched/'+f,'utf8');
 const all=new Map();const seen=(t,nm,f)=>{if(t.includes('\n'+TAG)||t.startsWith(TAG))die(f+' already holds the include tag');if(!all.has(t))all.set(t,{nm,files:new Set()});all.get(t).files.add(f);};
 const walk=(L,f,code)=>{for(const s of L){seen(code.slice(s.a,s.b),s.nm,f);if(s.inner)walk(s.inner,f,code);}};for(const f of F)walk(stmts(src[f],f),f,src[f]);
 const lib=new Map(),nameOf=new Map(),used=new Map();const taken=new Map();
 for(const [t,v] of all)if(v.files.size>1){const base=v.nm.replace(/[^\w+$-]/g,'_');const k=(taken.get(base)||0)+1;taken.set(base,k);const nm=k===1?base:base+'~'+k;nameOf.set(t,nm);lib.set(nm,t);used.set(nm,[...v.files].sort());}
 const nodes={};for(const f of F){const code=src[f];let out='',at=0;
  const go=L=>{for(const s of L){const t=code.slice(s.a,s.b);const whole=(s.a===0||code[s.a-1]==='\n')&&(s.b===code.length||code[s.b]==='\n');
    if(nameOf.has(t)&&whole){out+=code.slice(at,s.a)+TAG+nameOf.get(t);at=s.b;continue;} /* only whole lines become an include; a statement sharing its line stays inline */
    if(s.inner)go(s.inner);}};go(stmts(code,f));out+=code.slice(at);nodes[f]=out;}
 const vn=(k,i)=>i?k+'~'+(i+1):k;const disjoint=(k,c)=>{const S=Array.from({length:c},(_,i)=>used.get(vn(k,i)));return S.every((a,i)=>S.every((b,j)=>i===j||!a.some(x=>b.includes(x))));};
 const variants=[...taken].filter(([k,c])=>c>1&&!/(Statement|Declaration)$/.test(k)&&disjoint(k,c)) /* drift: one name, different text, in different nodes */.map(([k,c])=>k+': '+c+' versions ('+Array.from({length:c},(_,i)=>i?k+'~'+(i+1):k).map(n=>n+' in '+used.get(n).length+' node(s)').join(', ')+')');
 return {lib,nodes,used,variants};}
function join(XD){const lib={};for(const f of ls(XD+'/lib'))lib[f.replace(/\.js$/,'')]=fs.readFileSync(XD+'/lib/'+f,'utf8');const out={};
 for(const f of ls(XD+'/nodes')){const t=fs.readFileSync(XD+'/nodes/'+f,'utf8');
  out[f]=t.split('\n').map(l=>{if(!l.startsWith(TAG))return l;const nm=l.slice(TAG.length);if(!(nm in lib))die(f+' includes unknown lib '+nm);return lib[nm];}).join('\n');}
 return out;}
const [cmd,I,O]=process.argv.slice(2);
if(cmd==='split'){if(!I||!O)die('usage: split <strip dir> <src dir>');if(fs.existsSync(O))die(O+' exists');const r=split(I);
 const T=O+'.tmp_'+process.pid;fs.mkdirSync(T+'/lib',{recursive:true});fs.mkdirSync(T+'/nodes');
 for(const [n,t] of r.lib)fs.writeFileSync(T+'/lib/'+n+'.js',t);for(const [f,t] of Object.entries(r.nodes))fs.writeFileSync(T+'/nodes/'+f,t);
 fs.writeFileSync(T+'/USES.txt',[...r.used].map(([n,fs2])=>n+' ('+fs2.length+'): '+fs2.map(f=>f.replace(/\.js$/,'')).join(', ')).join('\n')+'\n');
 fs.writeFileSync(T+'/VARIANTS.txt',(r.variants.length?r.variants.join('\n'):'none')+'\n');
 const back=join(T);const src=ls(I+'/patched');const bad=src.filter(f=>back[f]!==fs.readFileSync(I+'/patched/'+f,'utf8'));
 if(bad.length||Object.keys(back).length!==src.length){fs.rmSync(T,{recursive:true});die('join does not give back the sources byte for byte: '+bad.join(', '));}
 fs.renameSync(T,O);const lb=[...r.lib.values()].reduce((a,t)=>a+t.length,0),nb=Object.values(r.nodes).reduce((a,t)=>a+t.length,0),sb=src.reduce((a,f)=>a+fs.statSync(I+'/patched/'+f).size,0);
 console.log('SPLIT '+I+' -> '+O+': '+src.length+' nodes, '+r.lib.size+' shared statements in lib/ ('+lb+' bytes), node files '+nb+' bytes; strip folder '+sb+' bytes. Join gives back every source byte for byte.');
 console.log('Statements with more than one version (VARIANTS.txt): '+(r.variants.length?'\n  '+r.variants.join('\n  '):'none'));}
else if(cmd==='join'){if(!I||!O)die('usage: join <src dir> <strip dir>');if(fs.existsSync(O))die(O+' exists');const r=join(I);fs.mkdirSync(O+'/patched',{recursive:true});
 for(const [f,t] of Object.entries(r))fs.writeFileSync(O+'/patched/'+f,t);console.log('JOINED '+I+' -> '+O+': '+Object.keys(r).length+' node sources.');}
else if(cmd==='check'){const r=join(I);const src=ls(O+'/patched');const bad=src.filter(f=>r[f]!==fs.readFileSync(O+'/patched/'+f,'utf8')).concat(Object.keys(r).filter(f=>!src.includes(f)));
 console.log(bad.length?'DIFFER: '+bad.join(', '):'SAME: '+src.length+' sources byte for byte');process.exit(bad.length?1:0);}
else die('usage: node gate/src.cjs split|join|check ...');
