// W2: every Code node of a workflow, stub or own code: does the runner send every node the code reads? (pkgLIB/runner_model.cjs needs over the
// node's own text decides what the runner sends; needs over the rebuilt source, plus a8456_w2/dyn.cjs, decides what the code reads.)
// A node whose own text holds a non-literal $(x) (all:true) is sent every node. Usage: node a_scan_w2/scan_all.cjs <workflow.json>...
const fs=require('fs');const {rebuild}=require('../pkgLIB/unpack.cjs');const {needs}=require('../pkgLIB/runner_model.cjs');const dyn=require('../a8456_w2/dyn.cjs');
for(const f of process.argv.slice(2)){const W=JSON.parse(fs.readFileSync(f));const lib=W.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const all=new Set(W.nodes.map(n=>n.name));let code=0,sentAll=0,bad=0;
 for(const n of W.nodes){const s=(n.parameters||{}).jsCode;if(typeof s!=='string'||n.name==='Shared Library')continue;code++;const sent=needs(s);if(sent.all){sentAll++;continue;}
  const src=s.includes('\nreturn await new Function(')?rebuild(s,lib):s;const miss=[...needs(src).nodes].filter(z=>!sent.nodes.has(z));
  for(const d of dyn(src,all)){if(d===null||!d.length)miss.push('(dynamic, no listed target)');else d.filter(z=>!sent.nodes.has(z)).forEach(z=>miss.push(z+' (dynamic)'));}
  if(miss.length){bad++;console.log(f,'|',n.name,'| not sent:',[...new Set(miss)].join(', '));}}
 console.log(f,'| Code nodes',code,'| sent every node (non-literal $ in own text)',sentAll,'| with a read the runner does not send',bad);}
