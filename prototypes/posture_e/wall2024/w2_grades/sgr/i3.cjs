const fs=require('fs');const rows=JSON.parse(fs.readFileSync('dis_rows.json','utf8')).filter(r=>r.rule==='E-OOR');
const N=s=>String(s||'').toLowerCase().replace(/[‘’“”"'`*_]/g,'').replace(/[—–-]/g,' ').replace(/[^a-z0-9ͰϿἀ-῿ ]+/g,' ').replace(/\s+/g,' ').trim();
const Rs={};const tot={rows:rows.length,checkable:0,foundExact:0,foundNorm:0,notFound:0,noQuote:0};
for(const r of rows){if(!(r.run in Rs)){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r.run+'_full.json','utf8')).data.resultData.runData;let R=null;for(const [n,x] of Object.entries(rd)){const j=x[0]&&x[0].data&&x[0].data.main&&x[0].data.main[0]&&x[0].data.main[0][0]&&x[0].data.main[0][0].json;if(j&&j.cr1&&j.dr3){R={CR1:j.cr1,CR2:j.cr2,CR3:j.cr3,CR4:j.cr4,DR1:j.dr1||j.gr1,DR2:j.dr2||j.gr2,DR3:j.dr3,DR4:j.dr4};break;}}Rs[r.run]=R;}
 const R=Rs[r.run];if(!R)continue;const m=(r.line||'').match(/\|\s*\[?([CD]R\d)\]?\s*\|\s*["“]([^"”]+)["”]/);if(!m){tot.noQuote++;continue;}tot.checkable++;const t=R[m[1]]||'';
 if(t.includes(m[2])){tot.foundExact++;console.log("EXACT",r.run,r.seat,m[1],"|",(r.line||"").slice(0,200));}else if((' '+N(t)+' ').includes(' '+N(m[2])+' ')){tot.foundNorm++;console.log('FOUND (normalised)',r.run,r.seat,m[1],m[2].slice(0,90),'|',r.reason.slice(25,110));}else tot.notFound++;}
console.log(tot);
