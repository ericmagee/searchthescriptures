// pkgECG chain on run 35296 (ESTIMATE: the stored cure replies answered the old asks): package Payloads output fed to the
// Merge Seat / Panel Cure Check of the package; records and seat result, live vs package
const fs=require('fs');const {LV,PK,run,mask}=require('./replay_nodes.cjs');
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const inpOf=n=>{const sc=rd[n][0].source[0];return rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];};
(async()=>{
 for(const [P,Mg] of [['R2 Alternate Payloads','R2 Alternate Merge Seat'],['Panel Payloads','Panel Cure Check']]){
  const out={};for(const [w,W] of [['live',LV],['pkg',PK]]){const pp=await run(W,rd,P,inpOf(P));const over={[P]:wrap(pp)};
   const inM=Mg==='Panel Cure Check'?inpOf(Mg):inpOf(Mg);const m=(await run(W,rd,Mg,inM,over))[0].json;
   const el=(m.enforcer_log||[]);out[w]={ecgRows:el.filter(x=>/pkgECG/.test(x.cure_reason||'')).map(x=>x.seat+' '+x.rule+' '+x.item),
    kinds:el.length,tried:(m.tried||m.alt_tried||[]).map(t=>t.alternate+':'+t.result+(t.why?' ('+t.why+')':'')),
    pcc:(m.summary||[]).map(s=>s.seat+' uncured '+(s.cure||[]).filter(c=>c.status!=='CURED').length)};}
  console.log('==',P,'->',Mg);for(const w of ['live','pkg'])console.log(' ',w,JSON.stringify(out[w]));}
})();
