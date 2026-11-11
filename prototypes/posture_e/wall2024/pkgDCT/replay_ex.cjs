// pkgDCT replay from the full stored exports (W1): live effective source vs trimmed source, $input from the stored source node.
// Usage: W=<measure.sh work dir> node pkgDCT/replay_ex.cjs "<node>,<node>..."
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const W=process.env.W;const P='/mnt/project-files/wall2024/';
const meta=JSON.parse(fs.readFileSync(W+'/eff.meta.json','utf8'));const byName={};for(const [f,m] of Object.entries(meta))byName[m.name]=f;
const strip=v=>JSON.stringify(v).replace(/\*\*Run time:\*\* \d+ min \d+ s \(started [^)]*\)/g,'<clock>').replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{const names=process.argv[2].split(',');const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));let tot=0,eq=0,errb=0;const diff=[];
 for(const e of ex){const rd=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
  for(const n of names){if(!rd[n])continue;const f=byName[n];const a=fs.readFileSync(W+'/eff/'+f,'utf8'),b=fs.readFileSync(W+'/trim/'+f,'utf8');
   const go=async s=>{try{const o=await run(s,n,rd);return o&&o.err?'ERR '+o.err:strip(o);}catch(x){return 'ERR '+x.message;}};const oa=await go(a),ob=await go(b);tot++;
   if(oa===ob){eq++;if(oa.startsWith('ERR'))errb++;console.log(e,n,'equal',oa.startsWith('ERR')?'(both ERR: '+oa.slice(0,100)+')':'');}else{diff.push(e+' '+n);console.log(e,n,'DIFFER | live',oa.slice(0,120),'| trim',ob.slice(0,120));}}}
 console.log('replays',tot,'equal',eq,'(both error',errb,') differ',diff.length);})();
