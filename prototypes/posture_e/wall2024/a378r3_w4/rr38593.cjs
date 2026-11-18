// Re-render run 38593's whole transcript with a workflow file's Format Markdown, from the run's own node outputs (execution 38593, node-filtered fetch).
const fs=require('fs');const E=JSON.parse(fs.readFileSync(__dirname+'/../run/exec_38593.json'));const RD=E.data.resultData.runData;
const items=nm=>{const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const $=nm=>{const it=items(nm);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:(...a)=>{if(process.env.NOPB&&nm==='Panel Build'&&!a.length)throw new Error('emulated');return it[0]||{json:{}};},all:(a,b)=>it,params:{}};};
const mk=w=>new Function('$','$input','require',JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode);
const inp={all:()=>items('Format Markdown')||[],first:()=>({json:{}})};
const stored=items('Format Markdown')[0].json.md;
const run=w=>mk(w)($,inp,require)[0].json.md;
const live=run(process.argv[2]);const strip=s=>s.replace(/\*\*Run time:\*\*[^\n]*/,'');
console.log('stored == live re-render (except run time):',strip(stored)===strip(live),'chars',stored.length,live.length);
if(process.argv[3]){const neu=run(process.argv[3]);fs.writeFileSync(process.env.OUTDIR+'/rr38593_live.md',live);fs.writeFileSync(process.env.OUTDIR+'/rr38593_target.md',neu);
 const a=live.split('\n'),b=neu.split('\n');const sa=new Set(a),sb=new Set(b);const out=[];a.forEach(l=>{if(!sb.has(l))out.push('- '+l.slice(0,400));});b.forEach(l=>{if(!sa.has(l))out.push('+ '+l.slice(0,400));});
 console.log('lines live',a.length,'target',b.length,'differing lines',out.length);console.log(out.join('\n'));}
