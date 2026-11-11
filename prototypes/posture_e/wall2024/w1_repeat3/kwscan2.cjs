const fs=require('fs');const P='/mnt/project-files/wall2024/';
const ex=fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x));
const live=/(?:^|[.;!?]["”'’)\]]*\s+)\**NOT\s+HELD\b/i;
const cand=/(?:^|[.;:!?]["”'’)\]]*\s+|\s+(?:--|—|–)\s+)\**NOT\s+HELD\b/i;
let colonAll=0;const col=[];
for(const e of ex){const d=JSON.parse(fs.readFileSync(P+e,'utf8')).data.resultData.runData;
 for(const nn of Object.keys(d).filter(k=>/Cure Check/i.test(k)))for(const run of d[nn]){const L=run.data?.main?.[0]?.[0]?.json?.enforcer_log||[];
  for(const r of L){if(r.rule!=='K-W'||r.kind!=='cure')continue;const rl=String(r.response_line||'');
   const body=rl.replace(/^\s*RESPONSE\s*:\s*[^|]*\|\s*/i,'');
   if(r.cure_status!=='CURED')console.log('UNCURED',e,r.seat,r.item,'\n  RESP:',rl.slice(0,400),'\n  live:',live.test(body),'cand:',cand.test(body));
   if(!live.test(body)&&cand.test(body)){colonAll++;col.push([e,r.seat,r.item,r.cure_status,body.slice(0,200),String(r.cure_reason).slice(0,90)]);}}}}
console.log('rows where only the candidate finds NOT HELD:',colonAll);col.forEach(c=>console.log(c.join(' || ')));
