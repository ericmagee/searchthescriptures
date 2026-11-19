// ASK 456 effect replay: run a stub on one stored execution twice, with $ gated as the n8n runner gates it (pkgLIB/runner_model.cjs gate):
// OLD = the live stub's read line, NEW = the target stub's read line. Same code otherwise. $('X') is answered from the stored runData
// (last run of X); $input is the node's stored input. Prints whether OLD, NEW and the STORED output agree (timestamps masked).
// Usage: node r456.cjs <live.json> <target.json> <node name> <exec chunk.json>...
const fs=require('fs');const {needs,gate}=require('../pkgLIB/runner_model.cjs');const crypto=require('crypto');
const [LW,TW,NAME,...EX]=process.argv.slice(2);const rd={};for(const f of EX){const e=JSON.parse(fs.readFileSync(f));Object.assign(rd,e.data.resultData.runData);}
const wf=f=>{const w=JSON.parse(fs.readFileSync(f));return w.workflow||w;};const L=wf(LW),T=wf(TW);
const outOf=n=>{const r=rd[n];if(!r||!r.length)return null;return ((r[r.length-1].data||{}).main||[[]])[0]||[];};
const mk=w=>{const P=Object.fromEntries(w.nodes.map(n=>[n.name,n.parameters||{}]));
 return n=>{const it=outOf(n);const e=!!it;const items=(it||[]).map(x=>({json:x.json,pairedItem:x.pairedItem}));const t=()=>{throw new Error("Node '"+n+"' hasn't been executed");};
  return {isExecuted:e,params:P[n],all:()=>e?items:t(),first:()=>e?items[0]:t(),last:()=>e?items[items.length-1]:t(),get item(){return e?items[0]:t();}};};};
const inputOf=n=>{const r=rd[n][rd[n].length-1];const s=(r.source||[])[0];if(!s)return [];const pr=(rd[s.previousNode]||[])[s.previousNodeRun||0];const o=pr&&((pr.data||{}).main||[])[s.previousNodeOutput||0];if(!o)throw new Error('input node '+s.previousNode+' not in chunks');return o.map(x=>({json:x.json}));};
const run=async w=>{const code=w.nodes.find(n=>n.name===NAME).parameters.jsCode;const $=gate(needs(code),mk(w));const items=inputOf(NAME);
 const $input={all:()=>items,first:()=>items[0],item:items[0]};const $execution={id:'replay',customData:{set(){},get(){return null;}}};
 const f=new Function('$','$input','$execution','$json','$items','$now','$workflow','require','return (async()=>{\n'+code+'\n})();');
 return await f($,$input,$execution,items[0]&&items[0].json,()=>items,new Date(),{id:'moMxiV4Irg1uRBZN'},require);};
const mask=o=>JSON.stringify(o).replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'T');const h=s=>crypto.createHash('md5').update(s).digest('hex').slice(0,10);
const DUMP=process.env.DUMP;
(async()=>{if(!rd[NAME]){console.log(NAME,'| NOT RUN');return;}
 const o=await run(L),n=await run(T);const st=outOf(NAME).map(x=>({json:x.json}));const norm=a=>(a||[]).map(x=>({json:x.json}));
 const mo=mask(norm(o)),mn=mask(norm(n)),ms=mask(st);if(DUMP){fs.writeFileSync(DUMP+".old.json",JSON.stringify(norm(o),null,1));fs.writeFileSync(DUMP+".new.json",JSON.stringify(norm(n),null,1));}
 console.log(NAME,'| OLD',h(mo),'NEW',h(mn),'STORED',h(ms),'| OLD==NEW',mo===mn,'| OLD==STORED',mo===ms,'| NEW==STORED',mn===ms);
 if(mo!==mn){const a=JSON.stringify(norm(o),null,1).split('\n'),b=JSON.stringify(norm(n),null,1).split('\n');let k=0;for(let i=0;i<Math.max(a.length,b.length)&&k<12;i++)if(a[i]!==b[i]){k++;console.log('  line',i,'\n   OLD:',String(a[i]).slice(0,400),'\n   NEW:',String(b[i]).slice(0,400));}}
})().catch(e=>{console.log(NAME,'| ERROR',e.message);});
