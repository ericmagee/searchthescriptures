// Extract rows42.json from the saved execute_sql output of rows42.sql. Each raw verdict keeps its full text; reasoning is read with a spacing-tolerant match.
const o=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));const r=o.result;const a=r.indexOf('[{"json_agg"'),b=r.lastIndexOf('}]')+2;const j=JSON.parse(r.slice(a,b))[0].json_agg;
const out=j.map(x=>{let reasoning=null;const t=x.raw;const m=/"reasoning"\s*:\s*"/.exec(t);if(m){const i=m.index+m[0].length;let k=i,esc=false;for(;k<t.length;k++){const c=t[k];if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c==='"')break;}reasoning=JSON.parse('"'+t.slice(i,k)+'"');}return {id:x.id,seat:x.seat,reasoning,raw:t};});
require('fs').writeFileSync('rows42.json',JSON.stringify(out));console.log(out.length,'rows');
