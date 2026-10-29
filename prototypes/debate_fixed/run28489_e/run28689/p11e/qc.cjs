// Step 4 verify (BB-8066): run the published Citation Scan and Quote Compare (p8/final) over run 29199's saved rounds; write Quote Compare's output and its Find Words groups.
const fs=require('fs');const F='../p8/final/';const row=JSON.parse(fs.readFileSync('../p9e/row_7b466555.json'));
const run=(file,nodes)=>{const $=n=>({first:()=>({json:nodes[n]}),all:()=>(Array.isArray(nodes[n])?nodes[n]:[nodes[n]]).map(j=>({json:j})),isExecuted:n in nodes});
 return new Function('$',fs.readFileSync(F+file,'utf8'))($)[0].json;};
const fo={cr1:row.claude_r1,gr1:row.engine_r1,cr2:row.claude_r2,gr2:row.engine_r2,cr3:row.engine_r3,dr3:row.challenger_r3};
const CS=run('Citation_Scan.js',{'Final Output':fo});const V=JSON.parse(fs.readFileSync('../p9e/verses.json'));
const QC=run('Quote_Compare.js',{'Citation Scan':CS,'Cited Verses':V});
fs.writeFileSync('qc29199.json',JSON.stringify(QC));
const u=decodeURIComponent((QC.url_find||'').split('&or=')[1]||'');
const g=[...u.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.([^)]+)\)/g)].map(m=>[m[1],m[2].replace(/\*/g,'%')]);
fs.writeFileSync('groups.json',JSON.stringify(g));console.log('items',QC.items.length,'pending',QC.items.filter(i=>i.status==='PENDING').length,'groups',g.length);
console.log(QC.url_find.slice(0,300));
