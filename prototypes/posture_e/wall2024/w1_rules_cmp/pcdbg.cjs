const fs=require('fs');const W='/mnt/project-files/wall2024/';
for(const run of ['33497','35067']){const rd=JSON.parse(fs.readFileSync(W+'ex'+run+'_full.json','utf8')).data.resultData.runData;const r=rd['Build Synthesis'][0].data.main[0][0].json;
 const UNESC=x=>String(x||'').replace(/\\(["'\\])/g,'$1');const s=UNESC(r.gr2);const h=s.search(/UNSUPPORTED-?\s*\[?L4\]?\s*PREMISES/i);let body=s.slice(h);const stop=body.slice(1).search(/\n\s*(?:PREMISE COUNT\s*:|-{3,}|#{1,3}\s)/i);if(stop>=0)body=body.slice(0,stop+1);
 const items=body.split(/\n(?=[ \t]*(?:\*\*)?(?:\d+\.|LINK\s+(?:\d+|[A-Za-z][A-Za-z\/]{0,9})\s*:))/i).slice(1);
 console.log('=====',run,'items',items.length);const k=run==='35067'?4:0;const it=items[k];console.log('RAW item:',JSON.stringify(it.slice(0,700)));
 const cut=String(it).split(/PRESSED WITH\s*:/i)[0].split(/\bASSUMES\s*:/i)[0];console.log('AFTER CUT:',JSON.stringify(cut.slice(0,500)));
 const opp=[r.cr1,r.cr2].map(UNESC).join('\n');const q=(it.match(/"([^"]{20,})"/)||[])[1];console.log('first quote:',q&&q.slice(0,90),'| in opp (raw):',q?opp.includes(q):null,'| in opp (folded):',q?opp.toLowerCase().replace(/["“”'‘’]/g,'"').includes(q.toLowerCase().replace(/["“”'‘’]/g,'"')):null);}
