const L=require(process.argv[2]+'/pcc_lib.cjs');const fs=require('fs');
const j=JSON.parse(fs.readFileSync(process.argv[2]+'/norm_1.json','utf8'));
const line='D2 vs C1 (Matthew 1:25): CHALLENGER LINK BROKEN -- [L1] "knew her not till she had brought forth" and [L2] *ouk eginōsken* (was not knowing) contradict the claim of knowing within the espousal, and the witness is unanswered by rule.';
const items=[{rule:'K-G1',side:'CHALLENGER',link:'D2 vs C1',line}];
const show=(tag,reply)=>{const v=L.cureVerdicts(items,reply,j.cure.broken,j.cure.rounds);console.log(tag,'->',v.map(x=>x.status+' | '+x.why).join(' || '));};
show('as run',j.reply);
show('SHORT line removed',{ok:true,text:j.reply.text.split('\n').filter(l=>!l.startsWith('SHORT:')).join('\n')});
