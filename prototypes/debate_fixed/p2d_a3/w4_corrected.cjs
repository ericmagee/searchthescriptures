// W4 (rev 3, DoD 5): fires when a panel judge's stored standing (the report header, read from the row) differs from the
// CORRECTED STANDING its CURED K-G3 row carries. Reads the report only.
const md=require('fs').readFileSync(process.argv[2],'utf8');let f=0;
for(const m of md.matchAll(/^## Panel judge \d+: (\w+) [^\n]*\n[\s\S]*?\*\*Defense standing:\*\* ([A-Z-]+)[\s\S]*?\*\*Challenge standing:\*\* ([A-Z-]+)/gm)){
 const st={DEFENDER:m[2],CHALLENGER:m[3]};
 for(const l of md.split('\n').filter(l=>new RegExp('^\\| Panel judge '+m[1]+' \\| [A-Z]+ STANDING \\| Standing \\(K-G3\\) \\| \\*\\*CURED\\*\\*').test(l)))
  for(const c of l.matchAll(/CORRECTED STANDING: (DEFENDER|CHALLENGER) ([A-Z-]+)/g)){const bad=st[c[1]]!==c[2];if(bad)f++;console.log(m[1],c[1],'stored',st[c[1]],'corrected',c[2],bad?'FIRES':'silent');}}
console.log('W4 fired on',f);
