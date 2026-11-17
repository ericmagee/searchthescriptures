// Build the Alternate Pass Input item for a stored run (what the engine would send in pass 2), using the target's own Alternate Pass Input and Second Alternate? code.
const fs=require('fs');const [TGT,EX,OUTF]=process.argv.slice(2);const T=JSON.parse(fs.readFileSync(TGT));const code=n=>T.nodes.find(x=>x.name===n).parameters.jsCode;
const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const items=(nm,over)=>{if(over&&nm in over)return over[nm];const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const mk$=over=>nm=>{const it=items(nm,over);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:()=>it[0]||{json:{}},all:()=>it};};
const run=(c,over,input)=>new Function('$','$input','$execution',c)(mk$(over),{all:()=>input,first:()=>input[0]},{id:String(E.id)});
const sa=run(code('Second Alternate?'),{},items('Alternate Merge 1'));const inp=run(code('Alternate Pass Input'),{},sa)[0].json;
fs.writeFileSync(OUTF,JSON.stringify(inp));const sz={};for(const [k,v] of Object.entries(inp.h))sz[k]=JSON.stringify(v).length;
console.log('input bytes',JSON.stringify(inp).length,'sa',JSON.stringify(inp.sa).length);console.log(Object.entries(sz).sort((a,b)=>b[1]-a[1]).slice(0,8));
