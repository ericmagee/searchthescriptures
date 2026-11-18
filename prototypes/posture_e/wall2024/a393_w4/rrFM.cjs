// ASK 393: re-render a run's transcript with s262 Format Markdown and with the target's, from the run's own node outputs.
// For the target, Init Seats' json carries the alt_dropped that the target Init Seats computes on the run's own inputs (unless NOFIELD=1).
const fs=require('fs');const [EX,BASE,TGT,OUTP]=process.argv.slice(2);const E=JSON.parse(fs.readFileSync(EX));const RD=E.data.resultData.runData;
const items0=nm=>{const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const isCode=f=>JSON.parse(fs.readFileSync(f)).nodes.find(n=>n.name==='Init Seats').parameters.jsCode;
const runIS=src=>{const M=Object.create(Math);M.random=()=>0.5;const inp=items0('Accept Final')[0].json;const am=items0('Accept Models').map(i=>i.json);
 return new Function('$','$input','$execution','Math',src)(n=>({all:()=>am.map(json=>({json}))}),{first:()=>({json:inp})},{id:'X',customData:{set:()=>{}}},M)[0].json;};
const mk$=(over)=>nm=>{let it=items0(nm);if(over&&over[nm])it=over[nm];if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:(...a)=>it[0]||{json:{}},all:()=>it,params:{}};};
const run=(w,over)=>{const code=JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode;const inp={all:()=>items0('Format Markdown')||[],first:()=>({json:{}})};return new Function('$','$input','require',code)(mk$(over),inp,require)[0].json.md;};
const strip=s=>s.replace(/\*\*Run time:\*\*[^\n]*/,'');
const stored=items0('Format Markdown')[0].json.md;const base=run(BASE,null);
let over=null;if(!process.env.NOFIELD&&RD['Accept Final']){const ad=runIS(isCode(TGT)).alt_dropped;over={'Init Seats':[{json:{...items0('Init Seats')[0].json,alt_dropped:ad}}]};}
const tgt=run(TGT,over);
console.log('stored == s262 re-render (run time aside):',strip(stored)===strip(base));
const a=strip(base).split('\n'),b=strip(tgt).split('\n');console.log('lines',a.length,b.length);let n=0;for(let i=0;i<Math.max(a.length,b.length);i++)if(a[i]!==b[i]){n++;console.log('- '+i+' '+(a[i]||'').slice(0,700));console.log('+ '+i+' '+(b[i]||'').slice(0,700));}
console.log('differing lines',n);if(OUTP){fs.writeFileSync(OUTP+'_base.md',base);fs.writeFileSync(OUTP+'_target.md',tgt);}
