const fs=require('fs');const d='/mnt/project-files/wall2024/inputs/';const lab=(r,n)=>{const j=JSON.parse(fs.readFileSync(d+r+'_'+n+'_Extract.json'));const x=(Array.isArray(j)?j[0]:j);return (x.data||x).main[0][0].json.labelled||'';};
const Q=[['33530','1:24'],['33575','1:13'],['33605','7:14'],['33617','1:18'],['33617','1:32'],['33617','1:35']];
for(const [r,cv] of Q){const t=lab(r,'D4B');let i=-1;while((i=t.indexOf(cv,i+1))>=0){console.log('==',r,cv,'CR4 ...'+t.slice(Math.max(0,i-220),i+60).replace(/\s+/g,' '));}
 const E=['D1','C1B','D2B','C2B','D3B','C3B'].map(n=>[n,lab(r,n)]);for(const [n,t] of E){const m=[...t.matchAll(new RegExp('([1-3] )?[A-Z][a-z]+\\.? '+cv.replace(':','\\:')+'(?!\\d)','g'))].map(x=>x[0]);if(m.length)console.log('   earlier',n,[...new Set(m)].join(', '));}}
