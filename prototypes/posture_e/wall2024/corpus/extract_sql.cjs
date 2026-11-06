// Turn a saved execute_sql tool result (json_agg in one cell) into a plain JSON array. Usage: node corpus/extract_sql.cjs <saved file> <out.json>
const fs=require('fs');const [f,o]=process.argv.slice(2);const r=JSON.parse(fs.readFileSync(f,'utf8')).result;
const a=r.indexOf('>\n',r.indexOf('<untrusted-data-'))+2,b=r.lastIndexOf('\n</untrusted-data-');const rows=JSON.parse(r.slice(a,b));
const v=rows[0][Object.keys(rows[0])[0]];fs.writeFileSync(o,JSON.stringify(v));console.log(o,v.length,'rows');
