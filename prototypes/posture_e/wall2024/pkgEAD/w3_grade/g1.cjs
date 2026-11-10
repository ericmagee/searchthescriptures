// W3 L1: stored replay, live s112 against the candidate, three Send Back Build nodes, every stored run and three full exports.
const fs=require('fs');const G=require('./g.cjs');const {H,NODES}=G;
const runs=[...new Set(fs.readdirSync(H.IN).filter(f=>/_Judge_Enforcer_Record\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
const T={node_runs:0,not_replayable:0,byte_equal:0,withheld_runs:0,withheld_items:0,strong_ok:0,FAIL:0};const W=[];
(async()=>{const jobs=runs.map(r=>({run:r,over:null}));for(const e of ['34299','34626','34703'])jobs.push({run:'ex'+e,over:G.exOver('/mnt/project-files/wall2024/ex'+e+'_full.json')});
 for(const {run,over} of jobs)for(const [node,inp] of NODES){if(!over&&!fs.existsSync(H.IN+'/'+run+'_'+inp.replace(/ /g,'_')+'.json'))continue;if(over&&!over[inp])continue;
  let P;try{P=await G.pair(run,node,inp,over);}catch(e){T.not_replayable++;console.log(run,node,'not replayable:',String(e.message).slice(0,80));continue;}
  T.node_runs++;if(JSON.stringify(P.a)===JSON.stringify(P.b)){T.byte_equal++;continue;}
  const ead=(P.b[0].sb_not_sent||[]).filter(x=>/pkgEAD/.test(x.why));if(!ead.length){T.FAIL++;console.log(run,node,'FAIL: differs with no pkgEAD entry');continue;}
  T.withheld_runs++;T.withheld_items+=ead.length;const s=await G.strong(run,node,inp,over,P.b);const ordA=P.a.map(j=>String(j.seat)).join(','),ordB=P.b.map(j=>String(j.seat)).join(',');if(s.eq&&s.ns&&s.del===s.ead&&(ordA===ordB||P.a.length!==P.b.length))T.strong_ok++;else{T.FAIL++;console.log(run,node,'FAIL strong check',JSON.stringify(s));}
  const seatsA=P.a.filter(j=>!j.sb_skip).map(j=>j.seat+':'+(j.items||[]).length).join(' '),seatsB=P.b.filter(j=>!j.sb_skip).map(j=>j.seat+':'+(j.items||[]).length).join(' ');
  console.log(run,node,'WITHHELD',ead.length,'| live',seatsA,'| cand',seatsB,'| skipB',!!P.b[0].sb_skip);
  for(const x of ead){const row=[].concat(P.a.flatMap(j=>(j.items||[]).map(i=>({seat:j.seat,...i})))).find(i=>i.seat===x.seat&&i.rule===x.rule&&i.item===x.item);W.push({run,node,seat:x.seat,rule:x.rule,item:x.item,why:x.why,line:row&&row.line,reason:row&&row.reason});}}
 fs.writeFileSync(__dirname+'/g1_withheld.json',JSON.stringify(W,null,1));console.log('\nTOTAL',JSON.stringify(T));})();
