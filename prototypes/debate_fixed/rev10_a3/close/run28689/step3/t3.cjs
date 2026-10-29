const fs=require('fs');
const raw=fs.readFileSync('/root/.claude/projects/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/tool-results/mcp-supbase-fix-execute_sql-1793250411450.txt','utf8');
let t=raw;try{const o=JSON.parse(raw);if(o.result)t=o.result;}catch(e){}
const a=t.indexOf('[{"j"');const b=t.lastIndexOf('}]')+2;const found=JSON.parse(t.slice(a,b))[0].j;
const comp=JSON.parse(fs.readFileSync('comp.json'));const rows=JSON.parse(fs.readFileSync('rows17.json'));const tok={};rows.forEach(r=>tok[r.id]=r.tok);
const run=(src,C,f)=>{const $=n=>n==='Find Words'?{all:()=>f.map(json=>({json}))}:{first:()=>({json:C})};return new Function('$',src)($)[0].json;};
const OLD=fs.readFileSync('Quote_Report.js','utf8'),NEW=fs.readFileSync('new_Quote_Report.js','utf8');
const K=i=>i.side+'|'+i.round+'|'+i.ref+'|'+i.quote;const out=[];let changed=0,added=0,removed=0;
for(const id in comp){const C=comp[id];const u=decodeURIComponent(C.url_find.split('&or=')[1]||'');
 const mine=new Set([...u.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.([^)]+)\)/g)].map(m=>m[1]+'\t'+m[2].replace(/\*/g,'%')));const f=found.filter(r=>mine.has(r.book+'\t'+r.pat));
 const o=run(OLD,C,f),n=run(NEW,C,f);const om=new Map(o.items.map(i=>[K(i),i])),nm=new Map(n.items.map(i=>[K(i),i]));
 out.push(tok[id]+' old checked='+o.checked+' mism='+o.mismatches+' | new checked='+n.checked+' mism='+n.mismatches);
 for(const [k,i] of nm){const p=om.get(k);if(!p){added++;out.push('  ADDED '+(i.load_bearing?'LB ':'')+i.side+' '+i.round+' '+i.ref+' ['+i.status+'] "'+i.quote.slice(0,70)+'"');}
  else if(p.status!==i.status){changed++;out.push('  STATUS '+i.side+' '+i.round+' '+i.ref+' ['+p.status+' -> '+i.status+'] "'+i.quote.slice(0,70)+'"');}}
 for(const k of om.keys())if(!nm.has(k)){removed++;out.push('  REMOVED '+k);}}
out.push('TOTAL added='+added+' status_changed='+changed+' removed='+removed);
fs.writeFileSync('t3.out',out.join('\n'));console.log(out.join('\n'));
