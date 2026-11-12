// usage: node replay_stored.cjs <stored_judge_prompts.json> <old.json> <new.json>
// stored file: [{t,id,p}] from debate_enforcer_log where prompt_sent holds "each was named by a judge". Checks old code reproduces each stored prompt byte for byte, then measures the new one.
const fs=require('fs');const {run}=require('./replay_harness.cjs');const [,,ST,A,B]=process.argv;const rows=JSON.parse(fs.readFileSync(ST,'utf8'));
const code=f=>JSON.parse(fs.readFileSync(f,'utf8')).nodes.find(n=>n.name==='Judge Contradiction Build').parameters.jsCode;const J0=code(A),J1=code(B);let tot=0;
for(const r of rows){const o0=run(J0,r)[0].json,o1=run(J1,r)[0].json;const u0=o0.body.messages[1].content,u1=o1.body.messages[1].content;tot+=u1.length-u0.length;
 console.log(r.t,'old==stored',u0===r.p,'cands',o1.cands.length,'blocks',(u1.match(/CLOSING BLOCK \(the closing/g)||[]).length,'as-under',(u1.match(/CLOSING BLOCK: as under/g)||[]).length,'new chars',u1.length,'(+'+(u1.length-u0.length)+')','rounds equal',u0.slice(u0.indexOf('######## THE DEFENDER'))===u1.slice(u1.indexOf('######## THE DEFENDER')));}
console.log('total +'+tot);
