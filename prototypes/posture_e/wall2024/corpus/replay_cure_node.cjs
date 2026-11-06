// Whole-node cure replay: runs Panel_Cure_Check of each package on each run's saved inputs and compares every seat's cure statuses
// and drv_uncured with the engine's own stored Panel Cure Check output. Usage: node corpus/replay_cure_node.cjs <pkgDir>...
const {load,runNode}=require('./replay_node.cjs');const fs=require('fs');
const runs=fs.readdirSync('corpus/raw').filter(f=>/^nodes_\d+\.json\.gz$/.test(f)).map(f=>f.slice(6,11)).sort();
const ES=(p=>{const t=fs.readFileSync(p+'/patched/Panel_Cure_Check.js','utf8');return new Function('return '+t.match(/const ENF_STATUS=(\{[\s\S]*?\})/)[1])();});
const live=(s,E)=>(s.cure||[]).filter(c=>c.status==='UNCURED'&&E[c.rule]==='LIVE').length;
const key=s=>(s.cure||[]).map(c=>c.rule+'|'+c.link+'|'+c.status);
for(const p of process.argv.slice(2)){const E=ES(p);let rows=0,same=0;const diff=[];
 for(const run of runs){const N=load(run);const st=N.nodes['Panel Cure Check'];const S=st[st.length-1][0].summary||[];let O;try{O=runNode(p,run,'Panel_Cure_Check')[0].json.summary||[];}catch(e){console.log(p+' '+run+': ERROR '+e.message);continue;}
  for(const s of S){const o=O.find(x=>x.seat===s.seat)||{};const a=key(s),b=key(o);rows+=a.length;a.forEach((k,i)=>{if(k===b[i])same++;else diff.push(run+' '+s.seat+' '+k+' -> '+(b[i]||'-'));});
   console.log(p+' '+run+' '+s.seat+': cure items '+a.length+', LIVE uncured stored '+live(s,E)+', replay '+live(o,E));}}
 console.log(p+': '+same+' of '+rows+' cure rows equal the stored Panel Cure Check'+(diff.length?'\n  '+diff.join('\n  '):''));}
