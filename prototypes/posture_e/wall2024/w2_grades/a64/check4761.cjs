// W2: check W4's Wall 4761 items 6 and 7 against the stored send-back rows.
const fs=require('fs');const out=(rd,n)=>{const r=rd[n];if(!r)return null;const m=(r[r.length-1].data||{}).main;return m&&m[0]?m[0].map(x=>x.json):null;};
let keys=null;const T={};
for(const f of fs.readdirSync('/mnt/project-files/wall2024/').filter(f=>/^ex\d+_full\.json$/.test(f)).sort()){const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f));const rd=(X.data||X).resultData.runData;
 for(const n of ['Send Back Record','Alt Send Back Record']){const o=out(rd,n);if(!o)continue;o.forEach(j=>(j.sb_rows||[]).forEach(x=>{if(x.rule!=='E-ANS')return;if(!keys){keys=Object.keys(x);console.log('KEYS',keys.join(','));}
  const cr=String(x.cure_reason||'');const old=/ABSENCE|pkgABS/i.test(cr)&&!/ENFORCER (?:DISAGREE|NO ANSWER)/.test(cr);
  if(/absence/i.test(cr)&&(x.cure_status==='CURED'||x.cure_status==='UNCURED'))console.log(f,n,x.cure_status,'oldsplit='+(old?'abs':'ds'),JSON.stringify(x).slice(0,700));}));}}
