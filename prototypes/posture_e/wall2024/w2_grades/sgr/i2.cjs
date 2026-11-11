const fs=require('fs');const all=[];
for(const fn of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+fn,'utf8')).data.resultData.runData;const seen=new Set();
 for(const n of ['Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record'])if(rd[n])for(const r of (rd[n][0].data.main.flat()[0].json.enf428_rows||[])){const k=r.rule+r.seat+r.flagged_line;if(seen.has(k))continue;seen.add(k);all.push({run:fn.slice(2,7),rule:r.rule,line:r.flagged_line||'',v:(r.cure_reason||'').match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER|NO VERDICT)/)?.[1]||'other'});}}
const t=(f)=>{const m=all.filter(f);return m.reduce((a,r)=>(a[r.v]=(a[r.v]||0)+1,a),{});};
console.log('E-ANS with NOT COUNTED in line',JSON.stringify(t(r=>r.rule==='E-ANS'&&/NOT COUNTED/.test(r.line))));
console.log('E-PREM on recomputed line',JSON.stringify(t(r=>r.rule==='E-PREM'&&/recomputed after the cure/.test(r.line))));
console.log('any rule on recomputed line',JSON.stringify(t(r=>/recomputed after the cure/.test(r.line))));
