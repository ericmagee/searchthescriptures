const fs=require('fs');const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));const rd=(X.data||X).resultData.runData;
 for(const n of ['Send Back Record','Alt Send Back Record']){const o=out(rd,n);if(!o)continue;o.forEach(j=>(j.sb_rows||[]).forEach(x=>{if(x.rule!=='E-ANS')return;const cr=String(x.cure_reason||'');
  if(/absence/i.test(cr)&&/CURED/.test(x.cure_status))console.log(f,x.cure_status,x.item,'||',cr.slice(0,260).replace(/\n/g,' '));}));}}
