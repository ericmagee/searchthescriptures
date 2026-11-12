// W2: count send-back/gate replies where the pkgGDS rewrite cut a CHANGE TO ANSWER CHECK line at the round tag, over all stored exports
const fs=require('fs');const D='/mnt/project-files/wall2024/';
for(const fn of fs.readdirSync(D).filter(x=>/^ex3\d+_full\.json$/.test(x))){let rd;try{rd=JSON.parse(fs.readFileSync(D+fn,'utf8')).data.resultData.runData;}catch(e){console.log(fn,'unreadable');continue;}
 let note=0,cut=0;const ex=[];
 for(const n of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record']){const r=rd[n];if(!r)continue;const j=(r.slice(-1)[0].data.main.flat()[0]||{}).json||{};
  for(const row of (j.sb_rows||[])){const resp=String(row.response_line||'');if(!/pkgGDS/.test(resp))continue;note++;const m=resp.match(/CHANGE TO: (ANSWER CHECK: [^|]*?) \|\| \[/);if(m){cut++;ex.push(row.seat+' '+row.item+' '+row.cure_status);}}}
 if(note)console.log(fn.slice(2,7),'GDS-noted rows',note,'cut at round tag',cut,ex.join('; '));}
