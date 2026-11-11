// Writes a read-only SELECT that runs the function's pricing expression on the 35067 call list with the same test prices as replay.cjs.
const fs=require('fs');const c=fs.readFileSync(__dirname+'/calls_35067.json','utf8');
const sql=fs.readFileSync(__dirname+'/schema_RCS.sql','utf8');
const a=sql.indexOf('SELECT c.x, c.ord,');const b=sql.indexOf(") e;",a);
const body=sql.slice(a,b).replace('jsonb_array_elements(p_calls)',"jsonb_array_elements($j$"+c+"$j$::jsonb)");
const q="WITH model_prices(model,input_per_m,cache_read_per_m,cache_write_5m_per_m,cache_write_1h_per_m,output_per_m) AS (VALUES ('claude-opus-5-5',4::numeric,0.20::numeric,5::numeric,8::numeric,20::numeric),('claude-sonnet-5-5',2,0.10,2.5,4,10)), e AS ("+body+")\nSELECT src, count(*) n, sum(usd) usd FROM e GROUP BY src ORDER BY src;";
fs.writeFileSync(__dirname+'/sqlcheck_35067.sql',q);console.log(q.length);
