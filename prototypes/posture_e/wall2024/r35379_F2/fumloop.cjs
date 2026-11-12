// Run 35379 F2 plant on run 35296 (live s149): Alternate Merge Seat reads $('Alternate Cure Normalize').all(), the LAST run only.
// When the follow-up loop sends one alternate back through Alternate Cure Normalize, that last run holds only that alternate.
// Plant: the Normalize last run holds a copy of argon's item re-keyed as another alternate (k shifted), i.e. argon's own item is absent.
const fs=require('fs');const {LV,run}=require('./replay_nodes.cjs');
const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35296_full.json','utf8')).data.resultData.runData;
const wrap=items=>({isExecuted:true,first:()=>items[0],all:()=>items,last:()=>items[items.length-1],item:items[0],params:{}});
const inpOf=n=>{const sc=rd[n][0].source[0];return rd[sc.previousNode][sc.previousNodeRun||0].data.main[sc.previousNodeOutput||0]||[];};
const CN=rd['Alternate Cure Normalize'][0].data.main[0];console.log('stored Normalize items',CN.map(x=>x.json.cure&&x.json.cure.seat+' k'+x.json.cure.k));
(async()=>{for(const [lab,over] of [['as stored (one Normalize run)',{}],['last run lacks argon (follow-up loop for another alternate)',{'Alternate Cure Normalize':wrap(CN.map(x=>({json:{...x.json,cure:{...x.json.cure,k:x.json.cure.k+1,seat:'other'}}})))}]]){
 const m=(await run(LV,rd,'Alternate Merge Seat',inpOf('Alternate Merge Seat'),over))[0].json;const el=m.enforcer_log.filter(x=>x.seat==='argon'&&x.kind==='cure');
 console.log(lab,'| argon cure rows',el.length,'| "no cure call was made":',el.filter(x=>/no cure call was made/.test(x.cure_reason||'')).length,'| argon',JSON.stringify((m.alternates_tried||[]).filter(t=>t.alternate==='argon').map(t=>t.result+' '+(t.why||''))));}})();
