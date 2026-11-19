// usage: node revert_check.cjs REVERT.json LIVE_ENGINE.json.gz LIVE_CHILD.json.gz [OUT_ENGINE.json OUT_CHILD.json]
// For each node: the revert applies only if live holds the node exactly as the package left it (md5) and each hunk once; otherwise it REFUSES that node (changed since; needs a fresh build, W1 9487).
// Writes outputs only when every node applies. Read only on n8n: it never writes a workflow.
const fs=require('fs'),z=require('zlib'),cr=require('crypto');
const rd=p=>{let b=fs.readFileSync(p);try{b=z.gunzipSync(b)}catch(e){}let w=JSON.parse(b);if(w.data&&w.data.nodes)w=w.data;return w;};
const md5=s=>cr.createHash('md5').update(s).digest('hex');
const [R,LE,LC,OE,OC]=process.argv.slice(2);const r=JSON.parse(fs.readFileSync(R));const W={engine:rd(LE),child:rd(LC)};
let refuse=0;
for(const x of r.restore){const w=W[x.workflow];const i=w.nodes.findIndex(n=>n.name===x.node);
  if(i<0){console.log('REFUSE',x.workflow,x.node,': not in live');refuse++;continue;}
  const n=w.nodes[i];const code=n.type==='n8n-nodes-base.code';const t=code?n.parameters.jsCode:JSON.stringify(n.parameters);
  const same=md5(t)===x.pkg_md5;
  if(x.action==='remove node'){if(!same){console.log('REFUSE',x.workflow,x.node,': changed since the package; needs a fresh build');refuse++;continue;}
    w.nodes.splice(i,1);console.log('APPLY ',x.workflow,x.node,': removed (unchanged since)');continue;}
  if(!same){console.log('REFUSE',x.workflow,x.node,': node changed since the package (md5 differs); needs a fresh build');refuse++;continue;}
  let nt=t,bad=0;for(const h of x.hunks){const k=nt.split(h.pkg_text).length-1;if(k!==1){bad++;continue;}nt=nt.replace(h.pkg_text,()=>h.base_text);}
  if(bad){console.log('REFUSE',x.workflow,x.node,':',bad,'of',x.hunks.length,'package hunk(s) no longer found once; changed since the package; needs a fresh build');refuse++;continue;}
  if(code)n.parameters.jsCode=nt;else n.parameters=JSON.parse(nt);
  console.log('APPLY ',x.workflow,x.node,':',same?'node unchanged since':'node changed elsewhere since; package text intact, restored');}
if(r.connections){const c=W.engine.connections;for(const [k,v] of Object.entries(r.connections)){if(JSON.stringify(c[k]||null)!==JSON.stringify(v.pkg)){console.log('REFUSE connections',k,': changed since');refuse++;continue;}
  if(v.base===null)delete c[k];else c[k]=v.base;console.log('APPLY  connections',k);}}
console.log(refuse?'RESULT: REFUSED, '+refuse+' item(s) changed since; a fresh build is needed for them':'RESULT: applies cleanly');
if(!refuse&&OE){fs.writeFileSync(OE,JSON.stringify(W.engine));fs.writeFileSync(OC,JSON.stringify(W.child));}
process.exit(refuse?5:0);
