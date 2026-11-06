// Run Citation Scan (base or patched) on a run's rounds (pkgMK/rounds_<run>.json, the debate_results row). Module: scan(file, run) -> items.
const fs=require('fs');
function F(run){const d=JSON.parse(fs.readFileSync('pkgMK/rounds_'+run+'.json','utf8'));return {cr1:d.claude_r1,gr1:d.engine_r1,cr2:d.claude_r2,gr2:d.engine_r2,cr3:d.engine_r3,dr3:d.challenger_r3,cr4:d.defender_r4,dr4:d.challenger_r4,synthesis:d.synthesis||''};}
function scan(file,run){const src=fs.readFileSync(file,'utf8');const f=F(run);
 const $=n=>{if(n==='Regrade Load')return {isExecuted:false,first:()=>{throw new Error('not run');}};if(n==='Final Output')return {isExecuted:true,first:()=>({json:f})};throw new Error('node not mocked: '+n);};
 return new Function('$','$input','$json',src)($,{first:()=>({json:{}}),all:()=>[]},{})[0].json;}
module.exports={scan};
if(require.main===module){const r=scan(process.argv[2],process.argv[3]);const bc=[...new Set(r.items.flatMap(i=>(i.parts||[{chapter:i.chapter}]).map(p=>i.book+'|'+p.chapter)).concat(r.items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter)))];console.log(JSON.stringify(bc));}
