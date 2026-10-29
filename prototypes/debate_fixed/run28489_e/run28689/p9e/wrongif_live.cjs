// Wrong-if of P2D BB-8004 on the live run 29199 (row 7b466555): MATCHES items whose quote segment (split at the ellipsis, folded)
// is not contiguous in its folded cited verse. Code: the published Citation Scan and Quote Compare (p8/final); verses from kjv_verses (verses.json).
const fs=require('fs');const F='../p8/final/';const row=JSON.parse(fs.readFileSync('row_7b466555.json'));
const run=(file,nodes)=>{const $=n=>({first:()=>({json:nodes[n]}),all:()=>(Array.isArray(nodes[n])?nodes[n]:[nodes[n]]).map(j=>({json:j})),isExecuted:n in nodes});
 return new Function('$',fs.readFileSync(F+file,'utf8'))($)[0].json;};
const fo={cr1:row.claude_r1,gr1:row.engine_r1,cr2:row.claude_r2,gr2:row.engine_r2,cr3:row.engine_r3,dr3:row.challenger_r3};
const CS=run('Citation_Scan.js',{'Final Output':fo});
if(process.argv[2]==='groups'){const g=decodeURIComponent(CS.url_cited.split('&or=')[1]||'');console.log(g);process.exit(0);}
const V=JSON.parse(fs.readFileSync('verses.json'));
const QC=run('Quote_Compare.js',{'Citation Scan':CS,'Cited Verses':V});
const st={};QC.items.forEach(i=>{st[i.status]=(st[i.status]||0)+1;});
console.log('scanned',CS.scanned,'items',CS.items.length,'Quote Compare statuses',JSON.stringify(st));
const fold=s=>' '+String(s).toLowerCase().replace(/\[[^\]]*:[^\]]*\]/g,' ').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()+' ';
let bad=0,m=0;for(const i of QC.items.filter(x=>x.status==='MATCHES')){m++;const cv=fold(i.cited);
 const segs=(i.segs&&i.segs.length?i.segs:[i.quote]).map(s=>fold(String(s).replace(/\[([^\]]*)\]|\(([^)]*)\)/g,(a,x,y)=>{const n=fold(x!==undefined?x:y);return cv.includes(n)?' '+n+' ':' ';}))).filter(s=>s.trim());
 let at=0,ok=segs.length>0;for(const g of segs){const k=cv.indexOf(g,at);if(k<0){ok=false;break;}at=k+g.length-1;}
 if(!ok){bad++;console.log('NOT CONTIGUOUS:',i.side,i.round,i.ref,JSON.stringify(i.quote).slice(0,160));}}
console.log('MATCHES',m,'| wrong-if count (MATCHES not contiguous):',bad);
for(const i of QC.items.filter(x=>x.status!=='MATCHES'))console.log(i.status,i.side,i.round,i.ref,'cite_form',i.cite_form,'opp',i.opp_words,i.opp_short,'q',JSON.stringify(i.quote).slice(0,140),'score',i.score);
const h=QC.items.find(x=>x.ref==='Haggai 2:23');if(h){console.log('Haggai url_find pattern:',decodeURIComponent(QC.url_find).match(/Haggai[^)]*\)/g));}
