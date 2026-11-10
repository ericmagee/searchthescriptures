// pkgEAD test (W1): live s112 vs pkgEAD Send Back Build / Alt Send Back Build on every stored run and on execution 34703. Lists every item that differs.
const fs=require('fs');const H=require('./harness_clone.cjs');
const LIVE='pkgLIB/strip_S112L/patched/',NEW=process.env.NEWSRC||'pkgLIB/strip_EAD_on_S112L/patched/';
function exOver(file){const ex=JSON.parse(fs.readFileSync(file,'utf8'));const r=ex.data.resultData.runData;const o={};for(const [n,runs] of Object.entries(r)){const last=runs[runs.length-1];o[n]=(last&&last.data&&last.data.main)||null;}return o;}
const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const T={runs:0,err:0,equal:0,withheld:0,other:0};const EX=process.env.EX||'/mnt/project-files/wall2024/ex34703_full.json';
(async()=>{const jobs=runs.map(r=>({run:r,over:null}));jobs.push({run:'34703',over:exOver(EX)});
 for(const {run,over} of jobs){for(const [node,inp] of [['Send Back Build','Judge Enforcer Record'],['Alt Send Back Build','Alt Judge Enforcer Record']]){
  const f=node.replace(/ /g,'_')+'.js';let a,b;const ov=over||{};if(!over&&!fs.existsSync(H.IN+'/'+run+'_'+inp.replace(/ /g,'_')+'.json'))continue;if(over&&!over[inp])continue;
  try{a=await H.run(fs.readFileSync(LIVE+f,'utf8'),run,inp,ov);b=await H.run(fs.readFileSync(NEW+f,'utf8'),run,inp,ov);}catch(e){T.err++;console.log(run,node,'not replayable:',String(e.message).slice(0,90));continue;}
  T.runs++;const A=a.map(x=>x.json),B=b.map(x=>x.json);
  const key=j=>JSON.stringify({...j,items:undefined,sb_not_sent:undefined,msg:undefined,body:undefined,sb_skip:undefined,sb_why:undefined});
  let same=true;const ai=A.flatMap(j=>(j.items||[]).map(x=>({seat:j.seat,...x}))),bi=B.flatMap(j=>(j.items||[]).map(x=>({seat:j.seat,...x})));
  const sig=x=>x.seat+'|'+x.rule+'|'+x.item+'|'+x.line;const bs=new Set(bi.map(sig));const gone=ai.filter(x=>!bs.has(sig(x)));const as=new Set(ai.map(sig));const added=bi.filter(x=>!as.has(sig(x)));
  const nsA=A.flatMap(j=>j.sb_not_sent||[]),nsB=B.flatMap(j=>j.sb_not_sent||[]);const ead=nsB.filter(x=>/pkgEAD/.test(x.why));
  if(added.length||gone.length!==ead.length||nsB.length-nsA.length!==ead.length){same=false;T.other++;console.log(run,node,'DIFFERS beyond pkgEAD: added',added.length,'gone',gone.length,'ead',ead.length);}
  // a withheld item renumbers later sids and changes the message text; compare the rest of each item with sid stripped
  const strip=x=>{const y={...x};delete y.sid;return JSON.stringify(y);};const restOK=JSON.stringify(ai.filter(x=>bs.has(sig(x))).map(strip))===JSON.stringify(bi.map(strip));if(!restOK){same=false;T.other++;console.log(run,node,'kept items differ in content');}
  if(!ead.length&&same&&A.length===B.length&&A.every((j,i)=>key(j)===key(B[i])&&JSON.stringify(j.msg)===JSON.stringify(B[i].msg)))T.equal++;
  for(const x of ead){T.withheld++;console.log(run,node,'WITHHELD',x.seat,x.rule,x.item,'\n    ',x.why.slice(0,300));}
  if(ead.length){const allW=new Set(ead.map(x=>x.seat));for(const j of B)if(allW.has(j.seat))console.log('     seat',j.seat,'still sends',(j.items||[]).length,'items; skip=',!!j.sb_skip);}}}
 console.log('\nTOTAL',JSON.stringify(T));})();
