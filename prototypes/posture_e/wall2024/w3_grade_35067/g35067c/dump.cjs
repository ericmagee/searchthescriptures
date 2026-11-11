const fs=require('fs');
const j=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));
const rd=(j.data&&j.data.resultData||j.resultData).runData;
fs.mkdirSync('nodes',{recursive:true});
for(const n of ['Close Enforcer Build','Close Enforcer Call deepseek','Close Enforcer Record','Anticheat Build','Anticheat Call deepseek','Anticheat Record','Judge Contradiction Build','Judge Contradiction Call deepseek','Judge Contradiction Record','Assume Check Build','Assume Check Call deepseek','Assume Check Record','Judge Enforcer Build','Judge Enforcer Call deepseek','Judge Enforcer Record','Alt Judge Enforcer Build','Alt Judge Enforcer Record','Send Back Build','Send Back Call openrouter','Send Back Record','Build Save Body','Save to DB','Panel Judge 1 openrouter','Panel Judge 2 openrouter','Panel Judge 3 openrouter','Extract Independent Verdict']){
 if(rd[n]) fs.writeFileSync('nodes/'+n.replace(/ /g,'_')+'.json',JSON.stringify(rd[n],null,1));
}
console.log(Object.keys(rd).filter(k=>/R2|Alt/.test(k)).join('|'));
