// WALL-2024 K-CON TRIAL -> LIVE, offline tests (W2). argv[2]: fetch of live 6b077f9e. Run from the wall2024 dir. Writes nothing live.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8')).workflow;const LN={};W.nodes.forEach(n=>LN[n.name]=n.parameters&&n.parameters.jsCode||'');
const TP=JSON.parse(fs.readFileSync('pkgT/plan_T.json','utf8'));TP.nodes.forEach(x=>LN[x.name]=fs.readFileSync('pkgT/patched/'+x.name.replace(/ /g,'_')+'.js','utf8')); // base = 6b077f9e + pkgT
const plan=JSON.parse(fs.readFileSync('pkgL/plan_L.json','utf8'));const pat=n=>fs.readFileSync('pkgL/patched/'+n.replace(/ /g,'_')+'.js','utf8');
let bad=0;const T=(ok,m)=>{console.log((ok?'OK  ':'FAIL')+' '+m);if(!ok)bad++;};const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
T(plan.nodes.length===17&&plan.nodes.every(x=>sha(LN[x.name])===x.base_sha&&sha(pat(x.name))===x.final_sha),'17 nodes; base_sha equals 6b077f9e + pkgT, final_sha equals the patched file');
T(JSON.stringify(Object.keys(LN).filter(n=>LN[n].includes("const ENF_STATUS=")).sort())===JSON.stringify(plan.nodes.map(x=>x.name).sort()),'every node with the status table is in the package');
const M="or REASSERTED IN with the quote. TRIAL rule: it removes no seat. REVIEW THIS ROW.]'",M2="or REASSERTED IN with the quote. LIVE rule: left uncured after the cure, it removes the seat. REVIEW THIS ROW.]'";
T(plan.nodes.every(x=>pat(x.name).replace("'K-CON':'LIVE'","'K-CON':'TRIAL'").split(M2).join(M)===LN[x.name]),'reverse edit: the status entry and the K-CON mark sentence are the only changes');
const st=c=>new Function(c.slice(c.indexOf('const ENF_STATUS='),c.indexOf('const enfLive='))+'\nreturn ENF_STATUS;')();
T(plan.nodes.every(x=>{const a=st(LN[x.name]),b=st(pat(x.name));return b['K-CON']==='LIVE'&&a['K-CON']==='TRIAL'&&Object.keys(a).every(k=>k==='K-CON'||a[k]===b[k])&&Object.keys(a).length===Object.keys(b).length;}),'in all 17 status tables K-CON is LIVE and every other entry is unchanged');
T(plan.nodes.every(x=>!pat(x.name).includes(M))&&pat('Panel Payloads').split(M2).length===3,'no K-CON mark still says TRIAL; Panel Payloads carries both K-CON marks');
const $=()=>{throw new Error('no node data offline');};const lib=c=>c.slice(0,c.lastIndexOf('\nreturn $input'));
const mk=c=>new Function('$','$input',lib(c)+'\nreturn {cureVerdicts,enfUncured,enfTrialWhy};')($,null);const N=mk(pat('Panel Cure Normalize 2')),O=mk(LN['Panel Cure Normalize 2']);
const kc={rule:'K-CON',side:'DEFENDER',link:'DEFENDER CR2 D3',line:'[CR3] the engine marked a withdrawn premise reasserted: "I do not claim Luke 1:27 states it at all"'};
{const r={ok:true,text:'RESPONSE: K-CON DEFENDER CR2 D3 | I did not see it.'};const v=N.cureVerdicts([kc],r,null,null),v0=O.cureVerdicts([kc],r,null,null);
 T(v[0].status==='UNCURED'&&N.enfUncured(v)===1&&O.enfUncured(v0)===0,'an answered but uncured K-CON item counts 1 (it counted 0 before)');
 T(N.enfTrialWhy(v[0],v[0].why)===v[0].why,'its stored reason no longer carries the TRIAL prefix: '+v[0].why);}
// a captured K-CON item: shown by the 32949 replay below on the judges' stored replies
// 32949 replay: the stored K-CON cure rows, each seat's stored reply
const F=JSON.parse(fs.readFileSync('pkgS/fixture_32949_cure_rows.json','utf8'));const RP={};F.replies.forEach(r=>RP[r.h]=r.full_reply);
const rows=F.rows.filter(r=>r.rule==='K-CON');const res=rows.map(r=>{const it={rule:'K-CON',side:/^CHALLENGER/.test(r.item||'')?'CHALLENGER':'DEFENDER',link:r.item,line:r.flagged_line};return {seat:r.seat,stored:r.cure_status,now:N.cureVerdicts([it],{ok:true,text:RP[r.h]},null,null)[0].status};});
T(rows.length===2&&res.every(x=>x.stored==='CURED'&&x.now==='CURED'),'32949: the panel K-CON items ('+res.map(x=>x.seat+' '+x.now).join(', ')+') are CURED, so drv_uncured does not change');
T(/kind:'enforcer_check',rule:'K-CON'/.test(pat('Alternate Merge'))&&!/kind:'cure',rule:'K-CON'/.test(pat('Alternate Merge')),'the single judge verified-contradiction row stays kind enforcer_check (record-only; no cure call is made)');
console.log(bad?'FAILED '+bad:'ALL OK');
