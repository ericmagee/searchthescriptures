const fs=require('fs');const names=new Set(fs.readFileSync('names.txt','utf8').trim().split('|'));
for(const f of process.argv.slice(2)){const j=JSON.parse(fs.readFileSync(f,'utf8'));const rd=(j.data||j).resultData.runData;
 const multi=[],ex=[];let items=0,withU=0;for(const [n,runs] of Object.entries(rd)){if(!names.has(n))continue;ex.push(n);if(runs.length>1)multi.push(n+'x'+runs.length);
  for(const r of runs)for(const it of (((r.data||{}).main||[])[0]||[])){items++;if(it.json&&(it.json.usage||it.json.usageMetadata))withU++;}}
 const others=Object.entries(rd).filter(([n])=>!names.has(n)&&!/Extract|Normalizer/.test(n)).filter(([n,runs])=>runs.some(r=>(((r.data||{}).main||[])[0]||[]).some(it=>it.json&&it.json.usage&&it.json.id))).map(([n])=>n);
 console.log(f.split('/').pop(),'| call nodes',ex.length,'| multi-run',multi.join(',')||'none','| items',items,'with usage',withU,'| other nodes with usage+id',others.join(',')||'none');}
