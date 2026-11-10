// pkgCFP test (W1): live s105 Judge Contradiction Build against pkgCFP's on every stored run with Panel Payloads. Labels pkgCFP/labels_CFP.md (073a49a5).
// Runs without a DeepSeek row in Resolve Seats get one planted (same for both columns) so the build reaches its candidate step.
process.chdir(__dirname+'/..');const fs=require('fs');const {harness,D}=require(process.cwd()+'/pkgGSL/harness.cjs');
const code=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;d=d.workflow||d;return d.nodes.find(x=>x.name==='Judge Contradiction Build').parameters.jsCode;};
const LIVE=code('/mnt/project-files/wall2024/fetchback_live_s105.json'),CAND=code('pkgCFP/parent_s105_CFP.json');
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Payloads\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const EXP={33218:[3,0],33222:[0,1],33261:[2,1],33299:[6,0],33345:[1,0],33371:[1,1],33430:[1,0],33442:[1,0],33461:[1,0],33482:[1,0],33530:[0,1],33592:[2,0],33644:[1,0],33705:[1,0],33798:[3,0],33846:[6,0]};
let ok=0,bad=0;const lines=[];
for(const r of runs){const rs=(()=>{const f=D+r+'_Resolve_Seats.json';if(!fs.existsSync(f))return null;const j=JSON.parse(fs.readFileSync(f,'utf8'));const x=j[0]&&j[0].data?j[0].data.main[0][0].json:(j[0]&&j[0].json);return x;})();
 const over={};if(!rs||!rs.deepseek||!rs.deepseek.api_model)over['Resolve Seats']=[{json:{...(rs||{}),deepseek:{api_model:'deepseek/planted',max_tokens:16000}}}];
 let a,b;try{a=harness(r,over)(LIVE,'Panel Payloads');}catch(e){a=[{json:{err:String(e.message)}}];}try{b=harness(r,over)(CAND,'Panel Payloads');}catch(e){b=[{json:{err:String(e.message)}}];}
 const A=a[0].json,B=b[0].json;const code_c=(B.cands||[]).filter(c=>/anti-cheat check/.test(c.by));const n={D:code_c.filter(c=>c.side==='DEFENDER').length,C:code_c.filter(c=>c.side==='CHALLENGER').length};
 const e=EXP[r];let f=[];
 if(e){if(n.D!==e[0]||n.C!==e[1])f.push('L1 expected D'+e[0]+' C'+e[1]+', got D'+n.D+' C'+n.C+(B.cec_skip?' (skip: '+B.why+')':''));}
 else{const sa=JSON.stringify(A).replace(/each was named by a judge after it read the debate\./,'each names who found it.');if(sa!==JSON.stringify(B))f.push('L2 output differs from live');}
 const both=(B.cands||[]).filter(c=>/anti-cheat check/.test(c.by)&&!/found by the system/.test(c.by));
 f.length?bad++:ok++;lines.push((f.length?'FAIL ':'OK   ')+r+(e?' anti-cheat D'+n.D+' C'+n.C:'')+' | live cands '+((A.cands||[]).length)+(A.cec_skip?' (skip)':'')+' | CFP cands '+((B.cands||[]).length)+(B.cec_skip?' (skip: '+String(B.why).slice(0,60)+')':'')+(both.length?' | merged with a judge: '+both.length:'')+(f.length?'  <- '+f.join('; '):''));}
lines.forEach(l=>console.log(l));console.log(runs.length+' runs: '+ok+' OK, '+bad+' FAIL');
