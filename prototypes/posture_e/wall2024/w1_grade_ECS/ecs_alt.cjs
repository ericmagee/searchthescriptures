const fs=require('fs');const ex=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35173_full.json','utf8'));const rd=ex.data.resultData.runData;
const s=rd['Alt Judge Enforcer Build'][0].data.main.flat().map(x=>x.json);for(const i of s)for(const x of (i.ids||[]))if(x.rule==='E-COL')console.log(x.seat,'|',x.flagged_line.slice(0,120));
const ce=rd['Close Enforcer Record'];console.log('Close Enforcer Record ran',!!ce, ce?JSON.stringify(ce[0].data.main.flat()[0].json.cec&&ce[0].data.main.flat()[0].json.cec.confirmed).slice(0,300):'');
const jc=rd['Judge Contradiction Record'];console.log('JCR ran',!!jc, jc?JSON.stringify((jc[0].data.main.flat()[0].json.jcc||{}).confirmed).slice(0,300):'');
