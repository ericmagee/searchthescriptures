// usage: node check_CRX.cjs <workflow.json>  exit 0 only if Judge Contradiction Build holds the Close Enforcer Build RULES, FORMAT and cecBlock text exactly.
const fs=require('fs');const {lit,RULES,FORMAT,cecBlockOf}=require('./crx_lib.cjs');const w=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const C=w.nodes.find(n=>n.name==='Close Enforcer Build').parameters.jsCode,J=w.nodes.find(n=>n.name==='Judge Contradiction Build').parameters.jsCode;
const CP=lit(C,'PROMPT');let JP='';try{JP=lit(J,'PROMPT');}catch(e){}const bad=[];
if(!JP.includes(RULES(CP)))bad.push('judge prompt lacks the shared RULES');if(!JP.endsWith(FORMAT(CP)))bad.push('judge prompt does not end with the shared FORMAT');
let jb='';try{jb=cecBlockOf(J);}catch(e){}if(jb!==cecBlockOf(C))bad.push('cecBlock differs between the two nodes');
console.log('CRX check: '+(bad.length?'FAIL\n  '+bad.join('\n  '):'shared RULES, FORMAT and cecBlock equal in both nodes'));process.exitCode=bad.length?1:0;
