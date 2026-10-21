// Parse/evaluate an n8n expression with n8n's own engine (@n8n/tournament, as n8n-workflow uses it).
const {Tournament}=require('@n8n/tournament');
const t=new Tournament((e)=>{throw e;});
const cases=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));
for(const c of cases){
  try{const v=t.execute(c.expr,{$json:c.json});console.log('PARSED',c.name,'->',JSON.stringify(v));}
  catch(e){console.log('REJECTED',c.name,'->',String(e.message||e).slice(0,120));}}
