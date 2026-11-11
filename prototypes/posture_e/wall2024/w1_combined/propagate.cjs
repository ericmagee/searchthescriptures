// W1: one step of propagation on 35067. The combined file's own outputs of the changed nodes (Send Back Record, Panel Cure Check) replace the stored ones,
// then every node that reads them (library nodes, Build Save Body, Format Markdown) is replayed with the combined code. Compared with the same code on the stored inputs.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const C=L('/tmp/claude-0/cmx/combined.json');let W=JSON.parse(fs.readFileSync('/tmp/claude-0/cmx/combined.json'));W=W.data||W;W=W.workflow||W;
const code=n=>(n in C.M)?C.code(n):W.nodes.find(x=>x.name===n).parameters.jsCode;
const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;const S=v=>JSON.stringify(v).replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{const over={};for(const n of ['Send Back Record','Panel Cure Check']){const o=await run(code(n),n,rd);over[n]=[o.map(x=>({json:x}))];}
 const reads=W.nodes.filter(n=>n.parameters&&n.parameters.jsCode&&rd[n.name]).map(n=>n.name).filter(n=>/\$\(['"](Send Back Record|Panel Cure Check)['"]\)/.test(code(n))&&!['Send Back Record','Panel Cure Check'].includes(n));
 console.log('readers replayed:',reads.join(', '));
 for(const n of reads){const a=await run(code(n),n,rd),b=await run(code(n),n,rd,over);if(a.err||b.err){console.log(n,'ERR',a.err,'|',b.err);continue;}const sa=S(a),sb=S(b);if(sa===sb){console.log('equal  ',n);continue;}
  let i=0;while(sa[i]===sb[i])i++;console.log('CHANGED',n,'\n   stored-input:',sa.slice(Math.max(0,i-200),i+300),'\n   propagated:  ',sb.slice(Math.max(0,i-200),i+300));}})();
