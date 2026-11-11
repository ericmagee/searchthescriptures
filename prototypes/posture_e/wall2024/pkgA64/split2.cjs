// W2 ASK 64 option 2: stored E-ANS send-back rows split by source: the DeepSeek check (removed by O2) vs the code absence check (pkgABS, kept), with recorded cure.
const fs=require('fs');const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
const T={ds:{CURED:0,UNCURED:0,other:0},abs:{CURED:0,UNCURED:0,other:0}};
for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));const rd=(X.data||X).resultData.runData;const sb=[];
 for(const n of ['Send Back Record','Alt Send Back Record']){const o=out(rd,n);if(o)o.forEach(j=>(j.sb_rows||[]).forEach(x=>sb.push(x)));}
 const r={ds:{CURED:0,UNCURED:0,other:0},abs:{CURED:0,UNCURED:0,other:0}};for(const x of sb.filter(x=>x.rule==='E-ANS')){const k=/ABSENCE|pkgABS/i.test(String(x.cure_reason||''))&&!/ENFORCER (?:DISAGREE|NO ANSWER)/.test(String(x.cure_reason||''))?'abs':'ds';const s=x.cure_status==='CURED'||x.cure_status==='UNCURED'?x.cure_status:'other';r[k][s]++;T[k][s]++;}
 console.log(f,'DeepSeek check items',JSON.stringify(r.ds),'| absence check items',JSON.stringify(r.abs));}
console.log('TOTAL DeepSeek',JSON.stringify(T.ds),'| absence',JSON.stringify(T.abs));
