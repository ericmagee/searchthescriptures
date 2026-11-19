// ASK 482 C6, the mirror check (W4 9619 K2). Usage: node mirror482.cjs <engine fetchback .json> [--keys a,b,c]
// Reads Init Seats ENG from the engine fetch, drops deepseek and any minimax key, and prints one read-only SQL statement
// that answers MATCH or MISMATCH against dash_debaters(). --keys replaces the engine list (for the known-bad test).
const fs=require('fs');const a=process.argv.slice(2);
let keys;
if(a.includes('--keys'))keys=a[a.indexOf('--keys')+1].split(',');
else{const wf=JSON.parse(fs.readFileSync(a[0],'utf8'));const c=wf.nodes.find(n=>n.name==='Init Seats').parameters.jsCode;
 const m=c.match(/const ENG=\{([\s\S]*?)\};/);if(!m)throw new Error('ENG not found in Init Seats');
 keys=[...m[1].matchAll(/(?:^|,)\s*([a-z0-9_]+)\s*:\s*\{/g)].map(x=>x[1]);
 console.error('engine version '+wf.versionId+'; ENG keys: '+keys.join(','));}
const want=keys.filter(k=>k!=='deepseek'&&!/minimax/i.test(k)).sort();
console.log("select case when (select array_agg(key order by key) from dash_debaters()) = array['"+want.join("','")+"']::text[] then 'MATCH' else 'MISMATCH' end as ask482_mirror, (select string_agg(key, ',' order by key) from dash_debaters()) as dash_debaters_keys, '"+want.join(',')+"' as engine_keys;");
