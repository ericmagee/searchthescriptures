const fs=require('fs');
const raw=fs.readFileSync('/root/.claude/projects/-home-user-searchthescriptures/b26695b3-56b9-5f42-92b7-63fcf7fb72c9/tool-results/mcp-supbase-fix-execute_sql-1793250379433.txt','utf8');
let t=raw;try{const o=JSON.parse(raw);if(o.result)t=o.result;}catch(e){}
const a=t.indexOf('[{"j"');const b=t.lastIndexOf('}]')+2;const verses=JSON.parse(t.slice(a,b))[0].j;
fs.writeFileSync('verses.json',JSON.stringify(verses));console.log('verses',verses.length);
const scan=JSON.parse(fs.readFileSync('scan.json'));const src=fs.readFileSync('Quote_Compare.js','utf8');
const comp={};const conds=new Set();
for(const id in scan){const map={'Citation Scan':{items:scan[id]}};
 const $=n=>n==='Cited Verses'?{all:()=>verses.map(json=>({json}))}:{first:()=>({json:map[n]})};
 const r=new Function('$',src)($)[0].json;comp[id]=r;
 const u=decodeURIComponent(r.url_find.split('&or=')[1]||'');
 for(const m of u.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.([^)]+)\)/g))conds.add(m[1]+'\t'+m[2]);}
fs.writeFileSync('comp.json',JSON.stringify(comp));
const vals=[...conds].map(c=>{const [bk,p]=c.split('\t');return "('"+bk.replace(/'/g,"''")+"','"+p.replace(/\*/g,'%').replace(/'/g,"''")+"')";});
fs.writeFileSync('find.sql',"SELECT json_agg(json_build_object('book',k.book,'chapter',k.chapter,'verse',k.verse,'text',k.text,'pat',k.p)) j, repeat('#',120000) pad FROM (SELECT DISTINCT v.book,v.chapter,v.verse,v.text,n.p FROM kjv_verses v JOIN (VALUES "+vals.join(',')+") n(b,p) ON v.book=n.b AND v.text ILIKE n.p) k;");
console.log('conds',conds.size);
