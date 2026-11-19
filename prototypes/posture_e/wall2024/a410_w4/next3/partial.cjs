const fs=require('fs');const R=JSON.parse(fs.readFileSync('requests_all10.json'));
const id=r=>r.set+'|'+r.src+'|'+r.rep;
for(const m of ['glm_legal','glm','sonnet']){const done=new Set(R.filter(r=>r.seat===m&&fs.existsSync('out/'+r.key+'.json')).map(id));
 const sel=R.filter(r=>['deepseek','luna',m].includes(r.seat)&&done.has(id(r)));fs.writeFileSync('req_partial_'+m+'.json',JSON.stringify(sel));console.log(m,done.size);}
