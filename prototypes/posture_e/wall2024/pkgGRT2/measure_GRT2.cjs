const fs=require('fs');process.chdir('/home/claude/searchthescriptures/prototypes/posture_e/wall2024');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const WF='/mnt/project-files/wall2024/fetchback_live_s68.json';
const W=JSON.parse(fs.readFileSync(WF,'utf8'));const NN=W.nodes||W.data.nodes;
const runs=[...new Set(fs.readdirSync(D).filter(f=>/^\d+_index\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const FR=/^\s*(?:[-•]|\d+[.)])?\s*FORCED\b/i;const pairOf=s=>{const m=String(s||'').match(/\bD(\d+)\s+vs\.?\s+C(\d+)\b/i);return m?'D'+m[1]+' vs C'+m[2]:null;};
let n=0;const dead=[],ok=[];
for(const nm of ['Send Back Build','Alt Send Back Build','R2 Alt Send Back Build']){const B0=NN.find(x=>x.name===nm).parameters.jsCode;const fe=feeder(WF,nm);
 for(const R of runs){const i=fe.find(x=>fs.existsSync(D+R+'_'+x.replace(/ /g,'_')+'.json'));if(!i)continue;let a;try{a=harness(R)(B0,i);}catch(e){continue;}n++;
  for(const x of a.map(y=>y.json)){const its=x.items||[];for(const it of its){if(it.rule!=='E-COL'||!FR.test(String(it.line||'').replace(/[*_`]+/g,'')))continue;const p=pairOf(it.line);
    const col=its.find(o=>o!==it&&!FR.test(String(o.line||'').replace(/[*_`]+/g,''))&&pairOf(o.line)===p);
    (col?ok:dead).push(R+' '+nm+' '+x.seat+' '+it.sid+' '+p+(col?' with '+col.sid+' ('+col.rule+')':''));}}}}
console.log('node runs',n,'FORCED E-COL asks with pair ask',ok.length,'without',dead.length);dead.forEach(d=>console.log('  DEAD',d));
