// Every {{ }} expression in every node of any type (jsCode excluded: it is code, not an expression), parsed by n8n's
// engine (@n8n/tournament). With a base file, only new or changed nodes (parameters differ from the base) are checked.
// A syntax error is PARSE-FAIL; a runtime error on stub data means the parser accepted the expression.
// Usage: node allexpr2.cjs <workflow json> [<base workflow json>]
const {Tournament}=require('@n8n/tournament');const fs=require('fs');
const load=p=>{const w=JSON.parse(fs.readFileSync(p,'utf8'));return (w.workflow||w).nodes;};
const nodes=load(process.argv[2]);const base=process.argv[3]?Object.fromEntries(load(process.argv[3]).map(n=>[n.name,n])):null;
const t=new Tournament((e)=>{throw e;});let fail=0,n=0,nn=0;
const walk=(x,k,f)=>{if(typeof x==='string'){if(k!=='jsCode')f(x);}else if(x&&typeof x==='object')for(const [kk,v] of Object.entries(x))walk(v,kk,f);};
const stub={first:()=>({json:{}}),all:()=>[],item:{json:{}},isExecuted:false,itemMatching:()=>({json:{}})};
for(const nd of nodes){if(base&&base[nd.name]&&JSON.stringify(base[nd.name].parameters)===JSON.stringify(nd.parameters))continue;
  let had=false;
  walk(nd.parameters,'',s=>{if(!s.includes('{{'))return;had=true;n++;const e=s.replace(/^=/,'');
    try{t.execute(e,{$json:{},$:()=>stub,$input:stub});}
    catch(err){const m=String(err.message||err);if(/Unexpected|Line \d+|SyntaxError|Invalid/i.test(m)){fail++;console.log('PARSE-FAIL',nd.name,'|',m.slice(0,80));}}});
  if(had)nn++;}
console.log((base?'new or changed ':'all ')+'nodes with expressions',nn,'expressions',n,'parse failures',fail);
