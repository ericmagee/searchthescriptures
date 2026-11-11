const fs=require('fs');const rows=JSON.parse(fs.readFileSync('dis_rows.json','utf8')).filter(r=>r.rule==='E-OOR');
const N=s=>String(s||'').toLowerCase().replace(/[“”"’‘'*_`\[\]]/g,'').replace(/\s+/g,' ').trim();const NQ=s=>N(s).replace(/[^a-z0-9:\s]/g,' ').replace(/\s+/g,' ').trim();
const Rs={};const tot={};const add=k=>tot[k]=(tot[k]||0)+1;
for(const r of rows){if(!(r.run in Rs)){const rd=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex'+r.run+'_full.json','utf8')).data.resultData.runData;let R=null;for(const [n,x] of Object.entries(rd)){const j=x[0]&&x[0].data&&x[0].data.main&&x[0].data.main[0]&&x[0].data.main[0][0]&&x[0].data.main[0][0].json;if(j&&j.cr1&&j.dr3){R={CR1:j.cr1,CR2:j.cr2,CR3:j.cr3,CR4:j.cr4,DR1:j.dr1||j.gr1,DR2:j.dr2||j.gr2,DR3:j.dr3,DR4:j.dr4};break;}}Rs[r.run]=R;}
 const R=Rs[r.run];const why=/not found verbatim/.test(r.reason)?'verbatim':/link round/.test(r.reason)?'link-round':/other side/.test(r.reason)?'other-side':/COUNTED ends/.test(r.reason)?'counted':'other';
 if(why!=='verbatim'){add(why);continue;}if(!R){add('verbatim-no-rounds');continue;}
 const m=(r.line||'').match(/^(DEFENDER|CHALLENGER)\s*\|\s*\[?((?:CR|DR)[1-4])\]?\s*\|\s*([\s\S]+)$/);if(!m){add('verbatim-line-unparsed');continue;}
 let sent=m[3].trim();sent=sent.replace(/\s*(?:\||--)\s*COUNTED\.?\s*$/,'');{const __q=sent.match(/^["“]([\s\S]*?)["”](?:\s*(?:--|—|–)\s[\s\S]*|\s+[A-Z(\[][\s\S]*)?$/);sent=__q?__q[1]:sent.split(/\s(?:--|—|–)\s/)[0];}
 const q=NQ(sent);const miss=q.split(' ').length>=4&&!NQ(R[m[2]]).includes(q.slice(0,240));add(miss?'verbatim-still-missed-today':'verbatim-found-by-today-code');if(!miss)console.log('today found:',r.run,r.seat,m[2],sent.slice(0,80));}
console.log(tot);
