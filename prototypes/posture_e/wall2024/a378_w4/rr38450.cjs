// Re-render run 38450's whole transcript with the target's Format Markdown, from the run's own node outputs (execution 38450).
const fs=require('fs');const E=JSON.parse(fs.readFileSync('../run/exec_38450.json'));const RD=E.data.resultData.runData;
const items=nm=>{const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const $=nm=>{const it=process.env.NOPB&&nm==='Panel Build'?null:items(nm);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:()=>it[0]||{json:{}},all:()=>it,params:{}};};
const mk=w=>new Function('$','$input','require',JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode);
const inp={all:()=>items('Format Markdown')||[],first:()=>({json:{}})};
const old=items('Format Markdown')[0].json.md;
const run=w=>mk(w)($,inp,require)[0].json.md;
const live=run('../rdf/fetchback_s258.json'),neu=run(process.argv[2]);
fs.writeFileSync('rr38450_live.md',live);fs.writeFileSync('rr38450_target.md',neu);
const a=live.split('\n'),b=neu.split('\n');let d=0;const out=[];const m=Math.max(a.length,b.length);
// line diff by LCS-lite: report lines in one not in the other
const sa=new Set(a),sb=new Set(b);a.forEach(l=>{if(!sb.has(l)){d++;out.push('- '+l.slice(0,220));}});b.forEach(l=>{if(!sa.has(l)){d++;out.push('+ '+l.slice(0,220));}});
console.log('stored run output == live re-render (except run time):',old.replace(/\*\*Run time:\*\*[^\n]*/,'')===live.replace(/\*\*Run time:\*\*[^\n]*/,''),'lines live',a.length,'target',b.length,'differing lines',d);console.log(out.join('\n'));
