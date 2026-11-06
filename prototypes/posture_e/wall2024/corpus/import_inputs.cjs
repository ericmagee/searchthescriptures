// Import a run's saved node files from /mnt/project-files/wall2024/inputs/<run>_*.json (live-test thread, from 33040 on)
// into corpus/raw/nodes_<run>.json.gz (same shape as save_nodes.cjs) and corpus/raw/gate_<run>.json (Gate Record, Panel Build, Alt Gate Record).
const fs=require('fs'),zlib=require('zlib');const run=process.argv[2];const D='/mnt/project-files/wall2024/inputs/';
const idx=JSON.parse(fs.readFileSync(D+run+'_index.json','utf8'));const out={run,nodes:{},skipped:[]};const gate={};
for(const [name,v] of Object.entries(idx.nodes)){if(!v||!v.file){out.skipped.push(name);continue;}const X=JSON.parse(fs.readFileSync(D+v.file,'utf8'));
 const runs=X.map(r=>((r.main&&r.main[0])||[]).map(i=>i.json));if(['Gate Record','Panel Build','Alt Gate Record'].includes(name))gate[name]=runs;else out.nodes[name]=runs;}
fs.writeFileSync('corpus/raw/nodes_'+run+'.json.gz',zlib.gzipSync(JSON.stringify(out)));fs.writeFileSync('corpus/raw/gate_'+run+'.json',JSON.stringify(gate));
console.log(run,'nodes',Object.keys(out.nodes).length,'gate',Object.keys(gate).join(', '),'skipped',out.skipped.join(', ')||'none');
