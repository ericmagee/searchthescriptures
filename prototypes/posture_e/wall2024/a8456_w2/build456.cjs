// Read-line fix: for every live form 3 stub, the if(false){...} read line must name every node its rebuilt source reads
// (pkgLIB/runner_model.cjs needs), or hold the all-nodes call $(String()). Adds only the missing literal $("X"); calls to the
// stubs that lack them; keeps every name already there. Nothing else in any node changes.
// Usage (from wall2024/): node a8456_w2/build456.cjs <engine.json> <child.json> <outdir>
const fs=require('fs'),crypto=require('crypto');
const {rebuild}=require('../pkgLIB/unpack.cjs');const {needs}=require('../pkgLIB/runner_model.cjs');
const dyn=require('./dyn.cjs');const md5=s=>crypto.createHash('md5').update(s).digest('hex');
const names=l=>new Set([...l.matchAll(/\$\(("(?:[^"\\]|\\.)*")\)/g)].map(m=>JSON.parse(m[1])));
const [eng,chi,out]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});let bad=0;
for(const [f,tag] of [[eng,'engine'],[chi,'child']]){const W=JSON.parse(fs.readFileSync(f,'utf8'));const nodes=W.nodes||W.workflow.nodes;
 const lib=nodes.find(x=>x.name==='Shared Library').parameters.jsCode;const changed=[];const NS=new Set(nodes.map(y=>y.name));
 for(const x of nodes){const s=(x.parameters||{}).jsCode;if(typeof s!=='string'||x.name==='Shared Library'||!s.includes('\nreturn await new Function('))continue;
  if(!s.startsWith('if(false){')){console.log(tag,'|',x.name,'| no read line; REFUSE');bad++;continue;}
  const nl=s.indexOf('\n'),line=s.slice(0,nl);const have=names(line);const all=line.includes('$(String())');
  if(all)continue;const src=rebuild(s,lib);const RN=needs(src);
  // rev 1 (W2 self-found): a non-literal $(n) reads the nodes listed just before it; those names are added too (not the all-nodes call).
  const D=dyn(src,NS);if(D.some(d=>d===null||!d.length)){console.log(tag,'|',x.name,'| dynamic read with no listed target; REFUSE');bad++;continue;}
  const miss=[...new Set([...RN.nodes,...D.flat()])].filter(n=>!have.has(n)).sort();
  const addAll=false;if(all||!miss.length)continue;
  const nline=line.slice(0,-1)+miss.map(n=>'$('+JSON.stringify(n)+');').join('')+'}';
  const ns=nline+s.slice(nl);
  if(ns.slice(ns.indexOf('\n'))!==s.slice(nl)||!nline.startsWith(line.slice(0,-1))){console.log('REFUSE text',x.name);bad++;continue;}
  x.parameters.jsCode=ns;changed.push(x.name);
  console.log(tag,'|',x.name,'| adds',miss.join(', ')+(addAll?' + $(String())':''),'| md5',md5(s).slice(0,12),'->',md5(ns).slice(0,12));}
 const o=out+'/'+tag+'_target.json';fs.writeFileSync(o,JSON.stringify(W));console.log(tag,'changed',changed.length,'| target',o,'md5',md5(fs.readFileSync(o,'utf8')).slice(0,12));}
process.exit(bad?1:0);
