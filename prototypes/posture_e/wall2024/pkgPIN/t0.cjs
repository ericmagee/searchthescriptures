// ASK 298: PIN.check on DR2 (engine_r2) of the 62 stored debates, with CR1, DR1, CR2 as the earlier rounds.
const fs=require('fs'),zlib=require('zlib');const PIN=new Function(fs.readFileSync(__dirname+'/pin.js','utf8')+'\nreturn PIN;')();
const R=JSON.parse(fs.readFileSync(__dirname+'/../a287/runs.json','utf8'));let rows=Object.values(R).map(x=>x.r).concat(JSON.parse(zlib.gunzipSync(fs.readFileSync(__dirname+'/../a293/data/rounds8.json.gz'))));
const seen=new Set();let n=0,d=0,tot=0,withAlt=0,pins=0;for(const r of rows){if(seen.has(r.id))continue;seen.add(r.id);n++;const RD={CR1:r.claude_r1,DR1:r.engine_r1,CR2:r.claude_r2,DR2:r.engine_r2};pins+=(String(r.engine_r2||'').match(/PROVEN IN \[/g)||[]).length;
 const p=PIN.check(r.engine_r2,'DR2',RD);if(p.length){d++;tot+=p.length;withAlt+=p.filter(x=>x.alt.length).length;}if(String(r.id).startsWith('eaef1fa9')){console.log('37113:');p.forEach(x=>console.log('  ',x.ref,'['+x.rk+']',x.why,'| named in',x.alt.join(',')||'none'));console.log(PIN.note(p).slice(0,700));}}
console.log('debates',n,'PROVEN IN marks in DR2',pins,'| debates flagged',d,'| presses flagged',tot,'| with a round that names it',withAlt);
