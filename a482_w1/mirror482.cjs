// ASK 482 C6, the mirror check (W4 9619 K2; rev 2 compares key:mc_seat pairs, since ASK 487 gives key gemini the mc seat gemini_deb).
// Usage: node mirror482.cjs <engine fetchback .json> [--pairs key:mc,key:mc,...]
// Reads Init Seats ENG from the engine fetch, drops deepseek and any minimax key, and prints one read-only SQL statement
// that answers MATCH or MISMATCH against dash_debaters() (key and mc_seat). --pairs replaces the engine list (known-bad test).
const fs=require('fs');const a=process.argv.slice(2);
let pairs;
if(a.includes('--pairs'))pairs=a[a.indexOf('--pairs')+1].split(',');
else{const wf=JSON.parse(fs.readFileSync(a[0],'utf8'));const w=wf.workflow||wf.data||wf;const c=w.nodes.find(n=>n.name==='Init Seats').parameters.jsCode;
 const m=c.match(/const ENG=\{([\s\S]*?)\};/);if(!m)throw new Error('ENG not found in Init Seats');
 pairs=[...m[1].matchAll(/(?:^|,)\s*([a-z0-9_]+)\s*:\s*\{[^}]*?mc\s*:\s*'([a-z0-9_]+)'/g)].map(x=>x[1]+':'+x[2]);
 console.error('engine version '+w.versionId+'; ENG pairs: '+pairs.join(','));}
const want=pairs.filter(p=>!/^deepseek:/.test(p)&&!/minimax/i.test(p)).sort();
console.log("select case when (select array_agg(key||':'||mc_seat order by key||':'||mc_seat) from dash_debaters()) = array['"+want.join("','")+"']::text[] then 'MATCH' else 'MISMATCH' end as ask482_mirror, (select string_agg(key||':'||mc_seat, ',' order by key||':'||mc_seat) from dash_debaters()) as dash_debaters_pairs, '"+want.join(',')+"' as engine_pairs;");
