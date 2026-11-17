// Build the pass input for a stored run (what the engine's call node would send for pass 2): the target's own Second Alternate? code, then the call node's mapping expression.
const fs=require('fs');const [TGT,EX,OUTF]=process.argv.slice(2);const T=JSON.parse(fs.readFileSync(TGT));const node=n=>T.nodes.find(x=>x.name===n);
const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const items=nm=>{const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const $=nm=>{const it=items(nm);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:()=>it[0]||{json:{}},all:()=>it};};
const sa=new Function('$','$input','$execution',node('Second Alternate?').parameters.jsCode)($,{all:()=>items('Alternate Merge 1'),first:()=>items('Alternate Merge 1')[0]},{id:String(E.id)});
const x=node('Alternate Pass Call').parameters.workflowInputs.value.pass;if(!/^=\{\{ [\s\S]* \}\}$/.test(x))throw new Error('call mapping is not one expression');
const inp=new Function('$','$json','$execution','return '+x.slice(4,-3)+';')($,sa[0].json,{id:String(E.id)});
fs.writeFileSync(OUTF,JSON.stringify(inp));const sz={};for(const [k,v] of Object.entries(inp.h))sz[k]=JSON.stringify(v).length;
console.log('input bytes',JSON.stringify(inp).length,'sa',JSON.stringify(inp.sa).length,'parent_exec',inp.parent_exec);console.log(Object.entries(sz).sort((a,b)=>b[1]-a[1]).slice(0,4));
