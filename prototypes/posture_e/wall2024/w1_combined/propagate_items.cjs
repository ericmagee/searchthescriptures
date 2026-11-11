// W1: item lists of the nodes the propagation changed (35067), stored-input vs propagated, combined code.
const fs=require('fs');const L=require('/mnt/project-files/w4/kwn/lib.cjs');const run=require('../pkgKSR/run_node.cjs');const P='/mnt/project-files/wall2024/';
const C=L('/tmp/claude-0/cmx/combined.json');let W=JSON.parse(fs.readFileSync('/tmp/claude-0/cmx/combined.json'));W=W.data||W;W=W.workflow||W;
const code=n=>(n in C.M)?C.code(n):W.nodes.find(x=>x.name===n).parameters.jsCode;
const rd=JSON.parse(fs.readFileSync(P+'ex35067_full.json','utf8')).data.resultData.runData;
(async()=>{const over={};for(const n of ['Send Back Record','Panel Cure Check']){const o=await run(code(n),n,rd);over[n]=[o.map(x=>({json:x}))];}
 const show=(lab,o,n)=>{if(n==='Send Back Build')o.forEach(it=>console.log(lab,'seat',it.seat,'skip',it.sb_skip,'items',(it.items||[]).map(x=>x.sid+':'+x.rule+':'+String(x.item).slice(0,40)).join(' | ')));
  if(n==='Judge Enforcer Build')o.forEach((it,i)=>console.log(lab,'call',i,'skip',it.je_skip,'ids',(it.ids||[]).length,JSON.stringify(it.counts||{}).slice(0,200)));
  if(n==='Alternate Merge 1')o.forEach(it=>{const rows=JSON.stringify(it).match(/"rule":"K-RECHK","item":"[^"]*"/g)||[];console.log(lab,'K-RECHK rows',rows.length,rows.join(' ').slice(0,600));});};
 for(const n of ['Send Back Build','Judge Enforcer Build','Alternate Merge 1']){show('stored    ',await run(code(n),n,rd),n);show('propagated',await run(code(n),n,rd,over),n);}})();
// sizes of the paid-call bodies, stored-input vs propagated
(async()=>{const over={};for(const n of ['Send Back Record','Panel Cure Check']){const o=await run(code(n),n,rd);over[n]=[o.map(x=>({json:x}))];}
 for(const n of ['Send Back Build','Judge Enforcer Build']){const a=await run(code(n),n,rd),b=await run(code(n),n,rd,over);const len=o=>o.map(it=>JSON.stringify(it.body||it.msg||'').length);console.log('BODY SIZES',n,'stored',JSON.stringify(len(a)),'propagated',JSON.stringify(len(b)));}})();
