// Lists the KJV rows the citation chain reads for a rounds file that the KJV fixture lacks: cited groups and Find Words patterns by book.
const fs=require('fs');const [,,dir,roundsFile,kjvFile]=process.argv;
const R=JSON.parse(fs.readFileSync(roundsFile,'utf8'));const KJV=JSON.parse(fs.readFileSync(kjvFile,'utf8'));const have=new Set(KJV.map(r=>r.book));
const F={cr1:R.cr1,gr1:R.gr1,cr2:R.cr2,gr2:R.gr2,cr3:R.cr3,dr3:R.dr3};
const run=(file,$)=>new Function('$',fs.readFileSync(dir+'/'+file,'utf8'))($)[0].json;
const S=run('Citation_Scan.js',n=>({isExecuted:false,first:()=>({json:F})}));
const groups=[...new Set([...S.items.map(i=>i.book+'|'+i.chapter+'|'+i.v1+'|'+i.v2),...S.items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+i.alt.verse)])].slice(0,90);
console.log('missing books in groups:',JSON.stringify(groups.filter(g=>!have.has(g.split('|')[0]))));
const cited=KJV.filter(r=>groups.some(g=>{const [b,c,a,z]=g.split('|');return r.book===b&&r.chapter===+c&&r.verse>=+a&&r.verse<=+z;}));
const C=run('Quote_Compare.js',n=>({first:()=>({json:S}),all:()=>cited.map(r=>({json:r}))}));
const conds=decodeURIComponent((C.url_find.split('&or=')[1]||'')).replace(/^\(|\)$/g,'');
const pats=[...conds.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.\*([^)]*)\*\)/g)].map(m=>({book:m[1],ws:m[2]}));
console.log('missing books in patterns:',JSON.stringify(pats.filter(p=>!have.has(p.book))));
