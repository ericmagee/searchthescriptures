// W3: classify the combined-replay differences for the prompt-build nodes and Alternate Merge Seat (v19 vs new strip).
const fs=require('fs');const {harness,feeder}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';
const [A,B]=process.argv.slice(2);const F='/mnt/project-files/wall2024/fetchback_live_s61.json';
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Panel_Cure_Check\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const lines=x=>JSON.stringify(x).split(/\\n|","|\],\[/);
(async()=>{const cls={};
for(const name of ['Cure Build','Panel Cure Build 1','Panel Cure Build 2','Panel Cure Build 3','Alternate Cure Build','Alternate Merge Seat']){const f=name.replace(/ /g,'_')+'.js';const IN=feeder(F,name)[0];
 for(const R of runs){let a,b;try{a=await harness(R)('return (async()=>{'+fs.readFileSync(A+'/patched/'+f,'utf8')+'\n})()',IN);b=await harness(R)('return (async()=>{'+fs.readFileSync(B+'/patched/'+f,'utf8')+'\n})()',IN);}catch(e){continue;}
  const la=lines(a),lb=lines(b);const sa=new Set(la),sb=new Set(lb);const gone=la.filter(x=>!sb.has(x)),add=lb.filter(x=>!sa.has(x));if(!gone.length&&!add.length)continue;
  for(const x of add){let k;if(/K-G7/.test(x)&&/pkgKG7|FORCED line for|meaning \(ruling 421\)|only for an unanswered|answered/i.test(x))k='KG7 rule/cure text';else if(/removed_rules|REMOVED FOR/.test(x))k='RMR removed rules';else k='OTHER+ '+x.slice(0,140);cls[name+' | '+k]=(cls[name+' | '+k]||0)+1;}
  for(const x of gone){let k;if(/K-G7/.test(x))k='KG7 old text';else if(/ALTERNATE TRIED|REMOVED FOR/.test(x))k='RMR old tail';else k='OTHER- '+x.slice(0,140);cls[name+' | '+k]=(cls[name+' | '+k]||0)+1;}}}
Object.entries(cls).sort().forEach(([k,v])=>console.log(v+'  '+k));})();
