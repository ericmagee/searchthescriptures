const fs=require('fs');const N=s=>String(s==null?'':s).toLowerCase().replace(/\\+"/g,'"').replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9Ͱ-Ͽἀ-῿֐-׿ ]+/g,' ').replace(/\s+/g,' ').trim();
const walk=(v,f)=>{if(Array.isArray(v))v.forEach(x=>walk(x,f));else if(v&&typeof v==='object'){if(v.kind&&v.rule&&v.cure_reason)f(v);Object.values(v).forEach(x=>walk(x,f));}};
const tot={notes:0,inPair:0,inNeither:0,noR:0,moved:0,movedPairOk:0};
for(const fn of fs.readdirSync('/mnt/project-files/wall2024/').filter(x=>/^ex3\d+_full\.json$/.test(x))){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+fn,'utf8')).data.resultData.runData;
 let R=null;for(const [n,x] of Object.entries(rd)){const j=x[0]&&x[0].data&&x[0].data.main&&x[0].data.main[0]&&x[0].data.main[0][0]&&x[0].data.main[0][0].json;if(j&&j.cr1&&j.dr3){R={CR1:j.cr1,CR2:j.cr2,CR3:j.cr3,CR4:j.cr4,DR1:j.dr1||j.gr1,DR2:j.dr2||j.gr2,DR3:j.dr3,DR4:j.dr4};break;}}
 const seen=new Set();for(const n of ['Send Back Record','Alt Send Back Record','R2 Alt Send Back Record'])if(rd[n])walk(rd[n],r=>{const k=r.seat+'|'+r.flagged_line;if(seen.has(k))return;seen.add(k);
  const cr=r.cure_reason;const m=cr.match(/not found word for word in \[([^\]]+)\]: \\?"(.{1,120})/);const mv=/moves the answer to the other side's round/.test(cr);
  if(mv)tot.moved++;if(!m)return;tot.notes++;if(!R){tot.noR++;return;}const ks=m[1].split(/;\s*/);const pair=ks.map(k=>(k[0]==='C'?'D':'C')+k.slice(1));const q=N(m[2]).split(' ').slice(0,8).join(' ');
  const inP=pair.some(k=>R[k]&&(' '+N(R[k])+' ').includes(' '+q+' '));if(inP)tot.inPair++;else tot.inNeither++;console.log(fn,r.seat,m[1],inP?'FOUND IN PAIRED ROUND':'not in paired round','|',m[2].slice(0,70));});}
console.log(tot);
