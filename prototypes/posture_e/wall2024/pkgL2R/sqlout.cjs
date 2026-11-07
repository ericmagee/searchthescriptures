// pkgL2R: read a saved execute_sql result file (one row, one column j holding JSON text) -> the parsed JSON. node pkgL2R/sqlout.cjs <in> <out.json>
const fs=require('fs');
function parse(f){const o=JSON.parse(fs.readFileSync(f,'utf8'));const r=o.result;const a=r.indexOf('[{');const b=r.lastIndexOf('}]');const rows=JSON.parse(r.slice(a,b+2));return JSON.parse(rows[0].j);}
if(require.main===module){fs.writeFileSync(process.argv[3],JSON.stringify(parse(process.argv[2])));console.log('wrote',process.argv[3]);}
module.exports={parse};
