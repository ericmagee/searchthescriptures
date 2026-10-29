const fs=require('fs');
const raw=fs.readFileSync('/root/.claude/projects/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/tool-results/mcp-supbase-fix-execute_sql-1793250411450.txt','utf8');
let t=raw;try{const o=JSON.parse(raw);if(o.result)t=o.result;}catch(e){}
const a=t.indexOf('[{"j"');const b=t.lastIndexOf('}]')+2;const found=JSON.parse(t.slice(a,b))[0].j;
const comp=JSON.parse(fs.readFileSync('comp.json'));const id=Object.keys(comp).find(k=>k.startsWith('7b466555'));const C=comp[id];
const u=decodeURIComponent(C.url_find.split('&or=')[1]||'');const mine=new Set([...u.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.([^)]+)\)/g)].map(m=>m[1]+'\t'+m[2].replace(/\*/g,'%')));const f=found.filter(r=>mine.has(r.book+'\t'+r.pat));
const run=src=>{const $=n=>n==='Find Words'?{all:()=>f.map(json=>({json}))}:{first:()=>({json:C})};return new Function('$',src)($)[0].json;};
const NEW=fs.readFileSync('new_Quote_Report.js','utf8');
const d9=r=>r.items.some(i=>i.ref==='1 Chronicles 28:6'&&i.side==='CHALLENGER'&&i.round==='R3'&&i.status!=='MATCHES');
const d10=r=>r.items.some(i=>i.ref==='Haggai 2:23'&&i.side==='CHALLENGER'&&i.round==='R3'&&i.status==='WORDING DIFFERS FROM Haggai 2:23');
const M1=NEW.replace(/\n \/\/ F1,[^\n]*\n \/\/ When[^\n]*\n if\(i\.cited&&i\.score>=0\.75&&i\.score>=bs\)\{[^\n]*\}/,'');
const M2=NEW.replace('(i.cite_form!==false||i.load_bearing===true)','i.cite_form!==false');
for(const [n,s] of [['NEW',NEW],['MUTANT F1 removed',M1],['MUTANT F2 removed',M2]]){const r=run(s);console.log(n,'changed='+(s!==NEW),'DoD9='+d9(r),'DoD10='+d10(r));}
