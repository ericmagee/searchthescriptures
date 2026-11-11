const fs=require('fs');const P='/mnt/project-files/wall2024/';
const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));const seen=new Set();let n=0;
for(const e of ex){const d=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const nn of Object.keys(d).filter(k=>/Cure Check/i.test(k)))for(const run of d[nn]){const L=run.data?.main?.[0]?.[0]?.json?.enforcer_log||[];
  for(const r of L){if(r.kind!=='cure')continue;const fr=String(r.full_reply||'');if(seen.has(fr))continue;seen.add(fr);
   for(const ln of fr.split('\n')){const m=ln.match(/^\s*[-*]*\s*(RESPONSE|STATEMENT)\s*:\s*(?:[^|]*\|)?\s*(.*)$/i);if(!m)continue;const b=m[2];
    if(/NOT\s+HELD/i.test(b)&&!/(?:^|[.;!?]["”'’)\]]*\s+)\**NOT\s+HELD\b/i.test(b)&&/(?:[:]\s+|\s+(?:--|—|–)\s+)\**NOT\s+HELD\b/i.test(b)){n++;console.log(e,r.seat,m[1],'|',b.slice(0,220));}}}}}
console.log('distinct replies',seen.size,'colon/dash-joined lines',n);
