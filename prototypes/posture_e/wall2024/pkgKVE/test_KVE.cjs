// pkgKVE test. Run from wall2024/: node pkgKVE/test_KVE.cjs
const fs=require('fs');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const rd=f=>fs.readFileSync(f,'utf8');const {execFileSync}=require('child_process');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgKVE/plan_KVE.json'));T('22 K-V nodes; base and final shas match',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(n.base+'/'+n.file))===n.base_sha&&sha(rd('pkgKVE/patched/'+n.file))===n.final_sha));
const O=require('./kvlib.cjs')('pkgKVE/base/patched/Gate_Record.js'),N=require('./kvlib.cjs')('pkgKVE/patched/Gate_Record.js');
const d=JSON.parse(rd('/mnt/project-files/wall2024/inputs/33160_Panel_Cure_Normalize_1.json'))[0];const R=(d.main||d.data.main)[0][0].json.cure.rounds;
const st='VOID: "requires seed ‘according to the flesh’ through a line the rows do not name" is a claim the quoted conclusion does not make.';
const a=O.kvRulingOk(st,5,O.kvCharges(R,'DEFENDER'),O.kvUni(R,'DEFENDER')),b=N.kvRulingOk(st,5,N.kvCharges(R,'DEFENDER'),N.kvUni(R,'DEFENDER'));
T('33160 chatgpt DEFENDER premise 5 statement: live refuses (no charge words found), pkgKVE reads the charge words',!a.ok&&b.ok,JSON.stringify(b.q));
const q2='VOID: "according to the flesh" is a claim the quoted conclusion does not make.';T('a quote of only the charge\'s own embedded quote still does not count',!N.kvRulingOk(q2,5,N.kvCharges(R,'DEFENDER'),N.kvUni(R,'DEFENDER')).ok);
for(const r of ['33040','33060','33083','33107','33129','33149','33160']){const s=execFileSync('node',['corpus/regrade_run.cjs',r,'pkgKVE/base','pkgKVE']).toString();const b0=s.slice(s.indexOf('BASE'),s.indexOf('PATCHED')).split('\n').slice(1).join('\n').trim(),p=s.slice(s.indexOf('PATCHED')).split('\n').slice(1).join('\n').trim();
 if(r==='33160')T('33160 replay: chatgpt K-V DEFENDER premise 5 cured (chatgpt counted); nothing else changes',/chatgpt +HELD +drv_uncured 0/.test(p)&&/chatgpt +HELD +drv_uncured 1 .*K-V DEFENDER premise 5/.test(b0)&&b0.split('\n').filter(l=>!/chatgpt|counted seats/.test(l)).join()===p.split('\n').filter(l=>!/chatgpt|counted seats/.test(l)).join());
 else T(r+' replay: unchanged from live',b0===p);}
console.log(ok+' OK, '+bad+' FAIL');process.exitCode=bad?1:0;
