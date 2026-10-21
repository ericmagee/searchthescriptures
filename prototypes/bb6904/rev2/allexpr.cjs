// Every {{ }} expression in every IF and Switch node of a composed workflow, parsed by n8n's engine (@n8n/tournament).
// A syntax error is PARSE-FAIL; a runtime error ($ or $json lookups on stub data) is PARSED (the parser accepted it).
const {Tournament}=require('@n8n/tournament');const fs=require('fs');
const w=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const nodes=(w.workflow||w).nodes;
const t=new Tournament((e)=>{throw e;});let fail=0,n=0;
const walk=(x,f)=>{if(typeof x==='string')f(x);else if(x&&typeof x==='object')Object.values(x).forEach(v=>walk(v,f));};
for(const nd of nodes){if(!/\.(if|switch)$/.test(nd.type))continue;
  walk(nd.parameters,s=>{if(!s.includes('{{'))return;n++;const e=s.replace(/^=/,'');
    try{t.execute(e,{$json:{},$:()=>({first:()=>({json:{}}),all:()=>[],isExecuted:false})});}
    catch(err){const m=String(err.message||err);if(/Unexpected|Line \d+|SyntaxError|Invalid/i.test(m)){fail++;console.log('PARSE-FAIL',nd.name,'|',m.slice(0,80));}}});}
console.log('expressions',n,'parse failures',fail);
