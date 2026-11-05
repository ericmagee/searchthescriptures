// WALL-2024 fixture: build the pressed-witness ledger offline from stored round texts.
// Uses the lifted PRS library unchanged. Every line that carries "-- MEANS:" is read as one press entry,
// classified against the run's rounds with the round it stands in as the pressing round.
// Limit: the [L2] NOT COUNTED check (l2bad) needs the Quote Report, which is not stored; it is passed as null.
const fs=require('fs');const path=require('path');
const {PRS}=require('./prs_lifted.cjs');
const ROUND_KEYS=[['CR1','cr1'],['DR1','gr1'],['CR2','cr2'],['DR2','gr2'],['CR3','cr3'],['DR3','dr3'],['CR4','cr4'],['DR4','dr4']];
function load(run){return JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures',run+'.json'),'utf8'));}
function ledger(run){const F=load(run);const R=PRS.RND(F);const out=[];
 for(const [rl,k] of ROUND_KEYS){const t=String(F[k]||'');
  t.split('\n').forEach((line,i)=>{if(!/(?:--|—|–)\s*MEANS\s*:/i.test(line))return;
   for(const e of PRS.entries(line)){if(!e.means)continue;const c=PRS.classify(e,R,rl,null);
    out.push({run,round:rl,line:i+1,ref:e.ref,quote:e.quote,means:e.means,l2:e.l2.map(x=>x.text),l3:e.l3.map(x=>x.text),cls:c.cls,why:c.why||null,e});}});}
 return out;}
module.exports={ledger,load,ROUND_KEYS};
