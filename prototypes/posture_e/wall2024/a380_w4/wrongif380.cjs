// ASK 380 wrong-if on run 38450 (execution 38450's own node outputs): live s259 vs target.
const fs=require('fs');const E=JSON.parse(fs.readFileSync('../run/exec_38450.json'));const RD=E.data.resultData.runData;
const items=nm=>{const r=RD[nm];if(!r)return null;const last=r[r.length-1];return ((last.data&&last.data.main&&last.data.main[0])||[]);};
const $=nm=>{const it=items(nm);if(!it)return {isExecuted:false,first:()=>{throw new Error('not run '+nm)},all:()=>{throw new Error('not run '+nm)}};return {isExecuted:true,first:()=>it[0]||{json:{}},all:()=>it,params:{}};};
const mk=w=>new Function('$','$input','require',JSON.parse(fs.readFileSync(w)).nodes.find(n=>n.name==='Format Markdown').parameters.jsCode);
const inp={all:()=>items('Format Markdown')||[],first:()=>({json:{}})};
const run=w=>mk(w)($,inp,require)[0].json.md;
const live=run('../rdf/fetchback_s259.json'),neu=run('t380_on259.json');fs.writeFileSync('rr38450_s259.md',live);fs.writeFileSync('rr38450_t380.md',neu);
const pick=(md,re)=>md.split('\n').filter(l=>re.test(l));
console.log('KNOWN-BAD (live s259), lines naming ernie or REMOVED FOR:');pick(live,/ernie|REMOVED FOR/i).forEach(l=>console.log('  '+l.slice(0,400)));
console.log('KNOWN-GOOD (target), same lines:');pick(neu,/ernie|REMOVED FOR/i).forEach(l=>console.log('  '+l.slice(0,400)));
console.log('target lines with ChatGPT reason (K-V on CHALLENGER premise 4):');pick(neu,/K-V on CHALLENGER premise 4/).forEach(l=>console.log('  '+l.slice(0,300)));
const a=live.split('\n'),b=neu.split('\n');const sa=new Set(a),sb=new Set(b);console.log('DIFF:');a.forEach(l=>{if(!sb.has(l))console.log('- '+l.slice(0,300));});b.forEach(l=>{if(!sa.has(l))console.log('+ '+l.slice(0,300));});
