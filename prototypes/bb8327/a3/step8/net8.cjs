const {netLines}=require('./s_net.js');const x=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));
const kc=t=>[...t.matchAll(/\[AUDIT v2[23]: (?:SINGLE JUDGE \(second opinion\): )?DEBATE RULE VIOLATION \(K-C\) -- ([^\]]*?) sets aside/g)].map(m=>m[1]);
const rep=t=>[...t.matchAll(/ITEM: ([^;]+); RULE: K-C; RESULT: (CURED|UNCURED)(; NOT COUNTED \(K-C UNCURED\))?/g)].map(m=>m[1]+' '+m[2]+(m[3]?' NOT-COUNTED':''));
const show=(name,t)=>{const n=netLines(t);console.log('== '+name);console.log(' netLines:',n.length);n.forEach(r=>console.log('   ',r.item,'|',r.side,'|',r.line.slice(0,160)));console.log(' K-C marks:',JSON.stringify(kc(t)));console.log(' K-C reports:',JSON.stringify(rep(t)));};
for(const d of x.dj)show(d.id+' '+d.judge_seat+' drv_uncured='+d.drv_uncured,d.verdict_raw);
show('single verdict (independent_verdict_raw)',x.dr.independent_verdict_raw);
console.log('review_notes K-C marks:',JSON.stringify(kc(x.dr.review_notes||'')),'reports:',JSON.stringify(rep(x.dr.review_notes||'')));
