// pkgDCT: the ten nodes that never ran live, replayed on their round-1 sibling's stored data (W1; W4's test T3).
// Every stored node K is also offered under "R2 "+K; R2 Alternate Merge reads Alternate Merge 1; Accept DS Return Build reads Accept Return Build's data.
const fs=require('fs');const run=require('../pkgKSR/run_node.cjs');const W=process.env.W;const P='/mnt/project-files/wall2024/';
const meta=JSON.parse(fs.readFileSync(W+'/eff.meta.json','utf8'));const byName={};for(const [f,m] of Object.entries(meta))byName[m.name]=f;
const SIB={'R2 Alt Gate Build':'Alt Gate Build','R2 Alt Gate Record':'Alt Gate Record','R2 Alt Send Back Build':'Alt Send Back Build','R2 Alt Send Back Record':'Alt Send Back Record','R2 Alternate Cure Build':'Alternate Cure Build','R2 Alternate Cure Normalize':'Alternate Cure Normalize','R2 Alternate Merge Seat':'Alternate Merge Seat','R2 Alternate Payloads':'Alternate Payloads','R2 Alternate Merge':'Alternate Merge 1','Accept DS Return Build':'Accept Return Build'};
const strip=v=>JSON.stringify(v).replace(/\*\*Run time:\*\* \d+ min \d+ s \(started [^)]*\)/g,'<clock>').replace(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g,'<ts>');
(async()=>{const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));let tot=0,eq=0,errb=0,diff=0;const per={};
 for(const e of ex){const rd0=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
  for(const [n,s] of Object.entries(SIB)){if(!rd0[s])continue;const rd=Object.assign({},rd0);for(const k of Object.keys(rd0))if(!rd['R2 '+k])rd['R2 '+k]=rd0[k];rd[n]=rd0[s];if(n==='R2 Alternate Merge')rd['R2 Alternate Merge 1']=rd0['Alternate Merge 1'];
   const f=byName[n];if(!f){console.log('no source for',n);continue;}const a=fs.readFileSync(W+'/eff/'+f,'utf8'),b=fs.readFileSync(W+'/trim/'+f,'utf8');
   const go=async src=>{try{const o=await run(src,n,rd);return o&&o.err?'ERR '+o.err:strip(o);}catch(x){return 'ERR '+x.message;}};const oa=await go(a),ob=await go(b);tot++;per[n]=per[n]||{runs:0,eq:0,err:0};per[n].runs++;
   if(oa===ob){eq++;per[n].eq++;if(oa.startsWith('ERR')){errb++;per[n].err++;}}else{diff++;console.log('DIFFER',e,n,'| live',oa.slice(0,120),'| trim',ob.slice(0,120));}}}
 for(const [n,x] of Object.entries(per))console.log(n,'| runs',x.runs,'equal',x.eq,'both error',x.err);console.log('replays',tot,'equal',eq,'(both error',errb,') differ',diff);})();
