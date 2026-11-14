const L=require('./load.cjs')('live.json','Gate Record');const D=require('./deb.json');
for(const d of D){const R={CR3:d.cr3,DR3:d.dr3};const have={};for(const rk of ['CR3','DR3']){have[rk]=[];for(let j=1;j<=9;j++)if(L.lbBlockText(R[rk],j))have[rk].push(j);}
 const named={};for(const j of (d.js||[]))for(const l of (j.lines||[])){const g=L.psGrades(l);if(!g)continue;const rk=g.side==='CHALLENGER'?'DR3':'CR3';for(const [n,v] of Object.entries(g.g))if(v==='COUNTED'&&!have[rk].includes(+n))(named[j.seat+' '+g.side]=named[j.seat+' '+g.side]||new Set()).add(+n);}
 console.log(d.run_token,'CR3',have.CR3.join(''),'DR3',have.DR3.join(''),'| COUNTED outside blocks:',JSON.stringify(Object.fromEntries(Object.entries(named).map(([k,v])=>[k,[...v]]))));}
