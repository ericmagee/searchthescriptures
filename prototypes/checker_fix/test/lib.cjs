// Loads the checker library of a node file: everything before the node's main body, run in a Function, returning its functions.
// Nodes with cureVerdicts (Cure/Panel Cure/Alternate nodes): the prefix up to the first line that calls $( or reads $input (the node's main body).
// Every node: netLines alone, cut as kc_fix/unit.cjs cut it (const NET_STATE .. end of netLines), plus NET_ANSWER/netMask when present.
const fs=require('fs');
function netLib(file){const s=fs.readFileSync(file,'utf8');const a=s.indexOf('const NET_STATE');const b=s.indexOf(' return out;}',s.indexOf('function netLines'))+13;
 return new Function(s.slice(a,b)+';return {netLines,NET_STATE,netMask:typeof netMask==="function"?netMask:(t=>t)};')();}
function fullLib(file){const s=fs.readFileSync(file,'utf8');const m=s.match(/\n[^\n]*(?:\$\(|\$input)/);if(!m)throw new Error('no main in '+file);
 const pre=s.slice(0,m.index);
 return new Function('$','$input',pre+'\n;return {netLines,drvCheck,cureVerdicts,cureLines,cureRefs,cureBroken,NET_STATE,netMask:typeof netMask==="function"?netMask:(t=>t),kg4Answered:typeof kg4Answered==="function"?kg4Answered:null};')(()=>{throw new Error('no $')},null);}
module.exports={netLib,fullLib};
