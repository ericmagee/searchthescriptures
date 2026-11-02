// Loads the checker library of a node file: everything before the node's main body (the first line that calls $( or reads $input), run
// in a Function with $ and $input stubbed, returning its functions. netLib: only the K-C net (const NET_STATE .. end of netLines).
const fs=require('fs');
const NAMES=['netLines','drvCheck','cureVerdicts','cureLines','cureRefs','cureBroken','NET_STATE','netMask','kg4Answered','knLines','scLines','kkLines','dg8Lines','cntItems','cureAsk','cureReport','enfRows','cureRest','cureLabel'];
function fullLib(file){const s=fs.readFileSync(file,'utf8');const m=s.match(/\n[^\n]*(?:\$\(|\$input)/);if(!m)throw new Error('no main in '+file);
 const pre=s.slice(0,m.index);
 return new Function('$','$input',pre+'\n;return {'+NAMES.map(n=>n+':typeof '+n+'!=="undefined"?'+n+':null').join(',')+'};')(()=>{throw new Error('no $')},null);}
function netLib(file){const s=fs.readFileSync(file,'utf8');const a=s.indexOf('const NET_STATE');const b=s.indexOf(' return out;}',s.indexOf('function netLines'))+13;
 return new Function(s.slice(a,b)+';return {netLines,NET_STATE};')();}
module.exports={netLib,fullLib};
// drvLib: the drvCheck block of any node that carries it (from the first DRV_ constant or drvKinds to the end of drvCheck).
function drvLib(file){const s=fs.readFileSync(file,'utf8');const c=['const DRV_','function drvKinds','const drvKinds'].map(k=>s.indexOf(k)).filter(i=>i>=0);const a=Math.min(...c);
 const d=s.indexOf('function drvCheck(');const b=s.indexOf('\n return {items,marks};}',d)+'\n return {items,marks};}'.length;
 return new Function(s.slice(a,b)+';const g=n=>{try{return eval(n);}catch(e){return null;}};return {drvCheck,netLines,knLines:g("knLines"),scLines:g("scLines"),kkLines:g("kkLines"),dg8Lines:g("dg8Lines"),cntItems:g("cntItems"),drvLedger:g("drvLedger"),drvLabAt:g("drvLabAt")};')();}
module.exports.drvLib=drvLib;
