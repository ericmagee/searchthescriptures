// W2: reclassify stored E-ANS send-back rows by the ENFORCER source tags in cure_reason (Wall 4761 check).
const fs=require('fs');const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
const T={};const add=(k,s)=>{T[k]=T[k]||{};T[k][s]=(T[k][s]||0)+1;};
for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));const rd=(X.data||X).resultData.runData;
 for(const n of ['Send Back Record','Alt Send Back Record']){const o=out(rd,n);if(!o)continue;o.forEach(j=>(j.sb_rows||[]).forEach(x=>{if(x.rule!=='E-ANS')return;const cr=String(x.cure_reason||'');
  const s=/^(UN)?CURED$/.test(x.cure_status)?x.cure_status:'other';if(s==='other')return;
  const ds=/\(right: (MEETS|MISSES)\)|ENFORCER (DISAGREE|NO ANSWER)/.test(cr), ab=/ABSENCE CHECK \(pkgABS\)/.test(cr);
  const old=/ABSENCE|pkgABS/i.test(cr)&&!/ENFORCER (?:DISAGREE|NO ANSWER)/.test(cr);
  const k=ds&&ab?'both':ds?'ds':ab?'abs':'none';const right=(cr.match(/\(right: (MEETS|MISSES)\)/)||[])[1]||'-';add(k+' right:'+right,s);
  if(k!=='abs'&&old)console.log('OLD SPLIT CALLED ABS:',f,k,x.cure_status,'right:'+right,x.item);
  if(k==='none')console.log('NONE:',f,x.item,cr.slice(0,200));}));}}
console.log(JSON.stringify(T,null,0));
