// Load the send-back cure readers (enf428Cure, UND, ECL) from the s110 Send Back Record source, cut before the node's own work begins.
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../../pkgLIB/strip_R1/patched/Send_Back_Record.js','utf8');const cut=s.indexOf('const __VP3=');
module.exports=(stub)=>{const AF=Function;const f=new AF('$','$input','$json','$execution',s.slice(0,cut)+'\n;return {enf428Cure,UND:typeof UND!=="undefined"?UND:null,ECL:typeof ECL!=="undefined"?ECL:null};');return f(stub,{all:()=>[],first:()=>({json:{}}),item:{json:{}}},{},{id:'x'});};
