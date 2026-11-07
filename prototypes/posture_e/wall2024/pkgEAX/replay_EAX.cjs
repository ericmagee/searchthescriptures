// pkgEAX replay: every saved run, main and Alt. Build pkgEAI/patched_on_pkgEID on the saved input, then Record pkgEAI/patched_on_pkgEID vs pkgEAX LIVE. A row may change only from
// "ENFORCER DISAGREE (right: MISSES)" (E-ANS) to "ENFORCER HELD (pkgEAX ...". Each held row is listed with DeepSeek's reason for review.
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const D='/mnt/project-files/wall2024/inputs/';const rf=f=>fs.readFileSync(f,'utf8');
const IN=JSON.parse(rf('pkgEID/build_inputs.json'));let ok=0,bad=0,held=0,sent=0;
const runs=[...new Set(fs.readdirSync(D).filter(f=>/_Judge_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]))].sort();
for(const R of runs)for(const pre of ['','Alt ']){const fn=pre.replace(' ','_');if(!fs.existsSync(D+R+'_'+fn+'Judge_Enforcer_Call_deepseek.json'))continue;let b0,l;
 try{const bb=harness(R)(rf('pkgEAI/patched_on_pkgEID/'+fn+'Judge_Enforcer_Build.js'),IN[pre+'Judge Enforcer Build']);const S=harness(R,{[pre+'Judge Enforcer Build']:bb.map(j=>({json:j.json||j}))});
  b0=S(rf('pkgEAI/patched_on_pkgEID/'+fn+'Judge_Enforcer_Record.js'),pre+'Judge Enforcer Call deepseek')[0].json;l=S(rf('pkgEAX/patched_live/'+fn+'Judge_Enforcer_Record.js'),pre+'Judge Enforcer Call deepseek')[0].json;}catch(e){console.log('SKIP '+R+' '+(pre||'main')+' '+String(e.message).slice(0,70));continue;}
 let other=0;const H=[];b0.enf428_rows.forEach((r,k)=>{const q=l.enf428_rows[k];if(r.cure_reason===q.cure_reason)return;if(/^ENFORCER DISAGREE \(right: MISSES\)/.test(r.cure_reason)&&/^ENFORCER HELD \(pkgEAX/.test(q.cure_reason))H.push(r);else other++;});
 const g=b0.enf428_rows.filter(r=>r.rule==='E-ANS'&&/^ENFORCER DISAGREE \(right: MISSES\)/.test(r.cure_reason)).length;held+=H.length;sent+=g-H.length;
 const o=other===0&&b0.enf428_rows.length===l.enf428_rows.length;o?ok++:bad++;console.log((o?'OK   ':'FAIL ')+R+' '+(pre||'main ').trim()+': MISSES pushes '+g+', held '+H.length+(other?', OTHER ROWS CHANGED '+other:''));
 H.forEach(r=>console.log('       held '+r.seat+' '+r.item+' :: '+r.cure_reason.replace(/^ENFORCER DISAGREE \(right: MISSES\): /,'').replace(/ \(judge wrote [\s\S]*$/,'').slice(0,170)));}
console.log('held '+held+', still sent '+sent+'; '+ok+' OK, '+bad+' FAIL');
