// ASK 379 drift check: every chain node in the sub-workflow equals its engine twin in the base (whole node: type, version, settings, credentials, parameters),
// apart from the listed exceptions ($execution.id -> the engine execution id passed in); the Shared Library copy is byte-equal. Run before the write and on the readback.
const fs=require('fs');const [BASE,CHILD]=process.argv.slice(2);const W=JSON.parse(fs.readFileSync(BASE)),C=JSON.parse(fs.readFileSync(CHILD));
const chain=JSON.parse(fs.readFileSync(__dirname+'/chain.json'));const EN=Object.fromEntries(W.nodes.map(n=>[n.name,n])),CN=Object.fromEntries(C.nodes.map(n=>[n.name,n]));
const norm=n=>{const {position,id,webhookId,...r}=n;return JSON.stringify(r).split("$('Alternate Pass Check').first().json.parent_exec").join('$execution.id').split("$(\\'Alternate Pass Check\\').first().json.parent_exec").join('$execution.id');};
let ok=0,bad=0,exc=0;for(const n of chain){const e=EN[n],c=CN[n];if(!e||!c){bad++;console.log('MISSING',n,!!e,!!c);continue;}
 const raw=JSON.stringify((({position,id,webhookId,...r})=>r)(c))===JSON.stringify((({position,id,webhookId,...r})=>r)(e));if(raw){ok++;continue;}
 if(norm(c)===norm(e)){exc++;console.log('EXCEPTION',n,'($execution.id -> parent_exec)');}else{bad++;console.log('DRIFT',n);}}
const sl=JSON.stringify(CN['Shared Library'].parameters)===JSON.stringify(EN['Shared Library'].parameters);
console.log('chain nodes equal',ok,'| listed exceptions',exc,'| drift',bad,'| Shared Library byte-equal',sl);process.exitCode=(bad||!sl)?1:0;
