// Citation chain harness (Worker_E): Citation Scan -> Quote Compare -> Quote Report from one node directory, on stored rounds, KJV rows from a file.
// Cited Verses = the rows of the groups Citation Scan names; Find Words = rows of the item's book whose text matches the ilike pattern Quote Compare builds.
const fs=require('fs');const [,,dir,roundsFile,kjvFile]=process.argv;
const R=JSON.parse(fs.readFileSync(roundsFile,'utf8'));const KJV=JSON.parse(fs.readFileSync(kjvFile,'utf8'));
const F={cr1:R.cr1,gr1:R.gr1,cr2:R.cr2,gr2:R.gr2,cr3:R.cr3,dr3:R.dr3};
const run=(file,$)=>new Function('$',fs.readFileSync(dir+'/'+file,'utf8'))($)[0].json;
const S=run('Citation_Scan.js',n=>({isExecuted:false,first:()=>({json:F})}));
const groups=[...new Set([...S.items.map(i=>i.book+'|'+i.chapter+'|'+i.v1+'|'+i.v2),...S.items.filter(i=>i.alt).map(i=>i.alt.book+'|'+i.alt.chapter+'|'+i.alt.verse+'|'+i.alt.verse)])].slice(0,90);
const cited=KJV.filter(r=>groups.some(g=>{const [b,c,a,z]=g.split('|');return r.book===b&&r.chapter===+c&&r.verse>=+a&&r.verse<=+z;}));
const C=run('Quote_Compare.js',n=>({first:()=>({json:S}),all:()=>cited.map(r=>({json:r}))}));
const conds=decodeURIComponent((C.url_find.split('&or=')[1]||'')).replace(/^\(|\)$/g,'');
const pats=[...conds.matchAll(/and\(book\.eq\."([^"]+)",text\.ilike\.\*([^)]*)\*\)/g)].map(m=>({book:m[1],ws:m[2].split('*').filter(Boolean)}));
const found=KJV.filter(r=>pats.some(p=>{if(p.book!==r.book)return false;let at=0;const t=r.text.toLowerCase();for(const w of p.ws){const k=t.indexOf(w.toLowerCase(),at);if(k<0)return false;at=k+w.length;}return true;})).slice(0,500);
const Q=run('Quote_Report.js',n=>n==='Quote Compare'?{first:()=>({json:C})}:{all:()=>found.map(r=>({json:r}))});
const out={checked:Q.checked,matches:Q.matches,mismatches:Q.mismatches,not_checked:Q.not_checked,
 flagged:Q.items.filter(i=>i.status!=='MATCHES'&&i.status!=='NOT CHECKED').map(i=>({side:i.side,round:i.round,ref:i.ref,link:i.link,load_bearing:i.load_bearing,status:i.status,quote:i.quote})),
 keys:Q.items.map(i=>i.side+'|'+i.round+'|'+i.ref+'|'+i.status)};
console.log(JSON.stringify(Q));
