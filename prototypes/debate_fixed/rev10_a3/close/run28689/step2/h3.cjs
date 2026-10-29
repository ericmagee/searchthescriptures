const fs=require('fs');
const raw=fs.readFileSync('/root/.claude/projects/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/tool-results/mcp-supbase-fix-execute_sql-1793250411450.txt','utf8');
let t=raw;try{const o=JSON.parse(raw);if(o.result)t=o.result;}catch(e){}
const a=t.indexOf('[{"j"');const b=t.lastIndexOf('}]')+2;const found=JSON.parse(t.slice(a,b))[0].j;
const comp=JSON.parse(fs.readFileSync('comp.json'));const rows=JSON.parse(fs.readFileSync('rows17.json'));const src=fs.readFileSync('Quote_Report.js','utf8');
const tok={};rows.forEach(r=>tok[r.id]=r);
let tot={left:0,leftLB:0,cf:0,cfLB:0};const lines=[];
for(const id in comp){const C=comp[id];const u=decodeURIComponent(C.url_find.split('&or=')[1]||'');
 const mine=new Set([...u.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.([^)]+)\)/g)].map(m=>m[1]+'\t'+m[2].replace(/\*/g,'%')));
 const f=found.filter(r=>mine.has(r.book+'\t'+r.pat));
 const $=n=>n==='Find Words'?{all:()=>f.map(json=>({json}))}:{first:()=>({json:C})};
 // capture 'all' before filter: re-run Report logic up to 'all'
 const src2=src.replace(/const items=all\.filter/, 'globalThis.__ALL=all;const items=all.filter');
 const R=new Function('$',src2)($)[0].json;const all=globalThis.__ALL;
 const kept=new Set(R.items);const left=all.filter(i=>!kept.has(i));
 const st=tok[id].cc;lines.push(tok[id].tok+' replay checked='+R.checked+' mism='+R.mismatches+' | stored checked='+st.checked+' mism='+st.mismatches+' | left out='+left.length);
 for(const i of left){tot.left++;if(i.load_bearing)tot.leftLB++;const why=i.cite_form===false?'cite_form false':(i.opp_words?'opp_words':'opp_short');if(i.cite_form===false){tot.cf++;if(i.load_bearing)tot.cfLB++;}
  lines.push('   '+(i.load_bearing?'LOAD-BEARING ':'')+i.side+' '+i.round+' LINK '+i.link+' '+i.ref+' ['+i.status+'] ('+why+') "'+i.quote.slice(0,110)+'"');}}
lines.push(JSON.stringify(tot));fs.writeFileSync('measure1889.txt',lines.join('\n'));console.log(lines.join('\n'));
