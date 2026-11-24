// ASK 579 C6: run the nine B/G Extract nodes' live code on the stored inputs of run 42071 and compare to the stored outputs.
// Usage: node c6_579.cjs <engine.json> <rundata_42071.json>
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const R=JSON.parse(fs.readFileSync(process.argv[3]));
const N=Object.fromEntries(W.nodes.map(n=>[n.name,n]));
const run=k=>(Array.isArray(R[k])?R[k]:[R[k]])[0];
const outItems=(k,o=0)=>((run(k).data.main||[])[o]||[]);
const TARGETS=['C1B','D2B','C2B','D3B','C3G','C3B','D4B','C4G','C4B'].map(s=>s+' Extract');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
(async()=>{let pass=0;const lines=[];
for(const t of TARGETS){const me=run(t);const idx=me.executionIndex;const src=me.source[0];
 // C1B Route was not in the read; Route output 7 equals the Build output on all six read pairs, so the C1B Build output stands in.
 const inItems=R[src.previousNode]?outItems(src.previousNode,src.previousNodeOutput):outItems(src.previousNode.replace(' Route',' Build'));
 const executed=k=>R[k]&&run(k).executionIndex<idx&&run(k).executionStatus==='success';
 const $=k=>{if(k==='Shared Library')return{params:N['Shared Library'].parameters};
  if(!R[k])throw new Error('C6 harness: '+k+' not in the read set');
  return{get isExecuted(){return executed(k)},first(){if(!executed(k))throw new Error('Node '+k+' has not been executed');return outItems(k)[0]},all(){if(!executed(k))throw new Error('Node '+k+' has not been executed');return outItems(k)}};};
 const $input={first:()=>inItems[0],all:()=>inItems,item:inItems[0]};
 let got,err=null;try{got=await new AsyncFunction('$','$input',N[t].parameters.jsCode)($,$input);}catch(e){err=e.message}
 const want=outItems(t).map(i=>i.json);
 const gotJ=err?null:(Array.isArray(got)?got:[got]).map(i=>i&&i.json!==undefined?i.json:i);
 const eq=!err&&JSON.stringify(gotJ)===JSON.stringify(want);
 let diff='';if(!eq&&!err){const a=gotJ[0]||{},b=want[0]||{};const ks=[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));diff=' keys differ: '+ks.join(', ');}
 if(eq)pass++;
 lines.push(`${t}: input from ${R[src.previousNode]?src.previousNode:src.previousNode.replace(' Route',' Build')+' output 0 (for '+src.previousNode+')'}${R[src.previousNode]?' output '+src.previousNodeOutput:''} (${inItems.length} item) -> ${eq?'EQUAL':'DIFFERENT'}${err?' ERROR '+err:''}${diff}`);}
lines.push(`${pass} of ${TARGETS.length} equal`);console.log(lines.join('\n'));})();
