const fs=require('fs');const {split}=require('./s9.cjs');
for(const s of ['luna','chatgpt','sol']){
 const p=JSON.parse(fs.readFileSync('body_'+s+'.txt','utf8')).payload; const {j}=split(p.verdict_raw);
 fs.writeFileSync('reason_first_'+s+'.txt',j.reasoning);
}
