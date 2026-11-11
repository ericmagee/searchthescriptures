// W2 ASK 64 measure: per stored export, E-ANS check rows (Judge Enforcer Record) and E-ANS send-back rows (Send Back Record / Alt / R2) and their cure status.
const fs=require('fs');const W='/mnt/project-files/wall2024/';
const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
for(const f of fs.readdirSync(W).filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync(W+f));const rd=(X.data||X).resultData.runData;
 const jer=[];for(const n of ['Judge Enforcer Record','Alt Judge Enforcer Record','R2 Alt Judge Enforcer Record']){const o=out(rd,n);if(o)o.forEach(j=>(j.enf428_rows||[]).forEach(x=>jer.push({...x,_n:n})));}
 const ea=jer.filter(x=>x.rule==='E-ANS'&&x.kind!=='send_back');const dis=ea.filter(x=>/^ENFORCER DISAGREE \(right: MISSES\)/.test(String(x.cure_reason||'')));
 const sb=[];for(const n of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']){const o=out(rd,n);if(o)o.forEach(j=>(j.sb_rows||j.enf428_rows||[]).forEach(x=>sb.push({...x,_n:n})));}
 const sbe=sb.filter(x=>x.rule==='E-ANS');const st={};sbe.forEach(x=>{st[x.cure_status]=(st[x.cure_status]||0)+1;});
 console.log(f,'| E-ANS check rows',ea.length,'| DISAGREE (right: MISSES)',dis.length,'| E-ANS send-back rows',sbe.length,JSON.stringify(st));}
