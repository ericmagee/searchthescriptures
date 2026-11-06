// pkgLIB pack (Eric approved 2026-11-06 10:07 CST: one shared copy of the library code). Run from wall2024/: node pkgLIB/pack.cjs <base pkg dir, default pkgKW>
// The 22 library nodes today each carry their own ~300 KB copy of the shared reader/enforcer code (~6.4 MB of the 8.2 MB of Code in the workflow).
// pack.cjs writes:
//  pkgLIB/patched/Shared_Library.js  the jsCode of ONE new Code node "Shared Library": every source line used by 2 or more of the 22 nodes, once,
//                                    as a JSON array. The node is not wired to anything and never runs; stubs read its text via $('Shared Library').params.jsCode.
//  pkgLIB/patched/<node>.js          a stub per node: a list of library line numbers (and ranges) plus the node's own lines, which rebuilds the node's
//                                    full source byte for byte and runs it with the same $ and $input.
// The full sources stay the source of truth (pkg*/patched); every later package patches full sources and re-packs. unpack.cjs rebuilds them.
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
// several package dirs may be given, base first: a later package's patched file replaces the earlier one (pkgPS patches 6 of the 22 on pkgPAY)
const DIRS=(process.argv.length>2?process.argv.slice(2):['pkgKW']).map(d=>d.replace(/\/$/,''));const BASE=DIRS.join('+');const SRCOF={};
for(const d of DIRS)for(const f of fs.readdirSync(d+'/patched/').filter(f=>f.endsWith('.js')&&f!=='Shared_Library.js'))SRCOF[f]=d+'/patched/'+f;
const F=Object.keys(SRCOF).sort();if(F.length!==22)throw new Error('expected 22 nodes, got '+F.length);
const SRC=F.map(f=>fs.readFileSync(SRCOF[f],'utf8'));const LINES=SRC.map(s=>s.split('\n'));
const cnt=new Map();for(const a of LINES)for(const l of new Set(a))cnt.set(l,(cnt.get(l)||0)+1);
const LIB=[],IDX=new Map();const add=l=>{if(!IDX.has(l)){IDX.set(l,LIB.length);LIB.push(l);}};
// library order: the lines in node order of the largest node first, then any other shared line in first-seen order (keeps long runs consecutive)
const order=[...F.keys()].sort((a,b)=>SRC[b].length-SRC[a].length);
for(const k of order)for(const l of LINES[k])if(cnt.get(l)>=2)add(l);
const LIBJSON=JSON.stringify(LIB);if(LIBJSON.includes('\n/*END*/'))throw new Error('end marker inside the library');
const LIBCODE="// pkgLIB: the shared library for the 22 library nodes (gate, cure, payload and merge nodes). ONE copy; each node reads it.\n"
 +"// This node is not wired to anything and never runs. A stub reads this text through $('Shared Library').params.jsCode and rebuilds its own\n"
 +"// full source from these lines. Do not edit by hand: patch the full sources and re-pack (pkgLIB/pack.cjs in the repo).\n"
 +"// library sha "+sha(LIBJSON)+", "+LIB.length+" lines\n"
 +"return [];\n/*LIB*/"+LIBJSON+"\n/*END*/\n";
const STUBHEAD=(name,s)=>"// pkgLIB stub: \""+name+"\". The node's full code (sha "+sha(s)+", "+s.length+" bytes) is rebuilt line for line from the\n"
 +"// \"Shared Library\" node (one copy for 22 nodes) plus the lines below that only this node has, then run unchanged with the same $ and $input.\n";
const STUBRUN="const __LT=$('Shared Library').params.jsCode;const __L=JSON.parse(__LT.slice(__LT.indexOf('\\n/*LIB*/')+8,__LT.lastIndexOf('\\n/*END*/')));\n"
 +"const __S=__P.map(e=>typeof e==='number'?__L[e]:typeof e[0]==='string'?e[0]:__L.slice(e[0],e[1]+1).join('\\n')).join('\\n');\n"
 +"if(__S.length!==__N)throw new Error('pkgLIB: rebuilt source is '+__S.length+' bytes, expected '+__N+' (Shared Library does not match this stub)');\n"
 +"return await new (Object.getPrototypeOf(async function(){}).constructor)('$','$input',__S)($,$input);\n";
fs.mkdirSync('pkgLIB/patched',{recursive:true});const plan={new_node:{name:'Shared Library',type:'n8n-nodes-base.code',typeVersion:2,parameters:{jsCode:'<pkgLIB/patched/Shared_Library.js>'},connections:'none: not wired to any node',note:'the name must stay exactly Shared Library; the 22 stubs read it by name'},base:BASE,library:{file:'Shared_Library.js',lines:LIB.length,json_sha:sha(LIBJSON),bytes:LIBCODE.length},nodes:[]};
fs.writeFileSync('pkgLIB/patched/Shared_Library.js',LIBCODE);
F.forEach((f,k)=>{const P=[];for(const l of LINES[k]){if(cnt.get(l)>=2){const i=IDX.get(l);const t=P[P.length-1];
   if(typeof t==='number'&&t+1===i)P[P.length-1]=[t,i];else if(Array.isArray(t)&&typeof t[0]==='number'&&t.length===2&&t[1]+1===i)t[1]=i;else P.push(i);}
  else P.push([l]);} /* number: one library line; [a,b]: library lines a..b; [string]: a line only this node has */
 const name=f.replace(/\.js$/,'').replace(/_/g,' ');const stub=STUBHEAD(name,SRC[k])+'const __N='+SRC[k].length+';\nconst __P='+JSON.stringify(P)+';\n'+STUBRUN;
 fs.writeFileSync('pkgLIB/patched/'+f,stub);plan.nodes.push({file:f,name,src:SRCOF[f],base_sha:sha(SRC[k]),base_bytes:SRC[k].length,stub_sha:sha(stub),stub_bytes:stub.length,own_lines:P.filter(e=>Array.isArray(e)&&typeof e[0]==='string').length});});
const tb=plan.nodes.reduce((a,n)=>a+n.base_bytes,0),ts=plan.nodes.reduce((a,n)=>a+n.stub_bytes,0)+LIBCODE.length;plan.bytes_before=tb;plan.bytes_after=ts;
fs.writeFileSync('pkgLIB/plan_LIB.json',JSON.stringify(plan,null,1));
plan.nodes.forEach(n=>console.log(n.name.padEnd(30),String(n.base_bytes).padStart(7),'->',String(n.stub_bytes).padStart(6),'own lines',n.own_lines));
console.log('Shared Library',LIBCODE.length,'bytes,',LIB.length,'lines. 22 nodes: '+tb+' bytes before, '+ts+' after (library included).');
