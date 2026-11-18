const fs=require('fs');const pop=JSON.parse(fs.readFileSync('pop3.json'));const J0=fs.readFileSync('judges.js','utf8');
const f=new Function('VSIDE','nm',J0.slice(J0.indexOf('const resWord'),J0.indexOf('const chgText'))+'\nreturn {resWord,chgList};')('',x=>x);
const rows=[];const deb={};
for(const d of pop){for(const j of d.J||[]){const L=f.chgList(j.verdict_raw).filter(c=>c.ro&&c.rt&&c.ro!==c.rt);if(!L.length)continue;const last=L[L.length-1].rt;if(last!==j.sql_rw){rows.push({tok:d.r.run_token,id:j.id,seat:j.judge_seat,vt:j.verdict_tag,cs:j.challenge_standing,engine_last:last,outcome_reads:j.sql_rw,kind:L[L.length-1].k,counted:!j.truncated&&!(+j.drv_uncured),panel:d.r.panel_verdict,outcome:d.r.outcome,split:d.r.panel_split});}}
 for(const x of d.r.drv_removed||[]){const L=f.chgList(x.verdict_raw||'').filter(c=>c.ro&&c.rt&&c.ro!==c.rt);if(!L.length)continue;const last=L[L.length-1].rt;if(last!==x.sql_rw)rows.push({tok:d.r.run_token,id:'removed '+x.seat,vt:x.verdict_tag,engine_last:last,outcome_reads:x.sql_rw,kind:L[L.length-1].k,counted:false,panel:d.r.panel_verdict,outcome:d.r.outcome});}}
// tie relevance: counted seat whose verdict equals the panel verdict, panel HELD or PARTIAL
rows.forEach(r=>r.tie_relevant=!!(r.counted&&/^(HELD|PARTIAL)$/.test(r.panel||'')&&r.vt===r.panel));
console.log(rows.length);rows.forEach(r=>console.log(JSON.stringify(r)));
