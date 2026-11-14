const O=require('./load.cjs')('../k4/live.json','Gate Record'),N=require('./load.cjs')('./target.json','Gate Record');const d=require('./d37032.json');const R={CR3:d.cr3,DR3:d.dr3};
const F='(UNEXHIBITED: the kept claim takes as given Mary of the house of David, which its rows do not give and its [L4] does not reach)';
const lines={nrw:'CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED '+F+' -- KEPT: “the child\'s flesh is David\'s by the one of whom he was born”. Premises 1 to 5 spared.',
 plainAssumes:'CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED (assumed house descent) -- ASSUMES: Mary is of David\'s house -- ROWS GIVE: “of the house and lineage of David” (Luke 2:4). Premises 1 to 5 spared.',
 lacksL1:'CONCEDED LINKS: 1 -- Premise 6: UNEXHIBITED (lacks [L1]). Premises 1 to 5 spared.'};
const k=(f,l)=>{try{return f.kunxLines(l,R).items.map(x=>x.link+' '+(x.a||'LACK')).join('; ')||'(none)'}catch(e){return 'ERR '+e.message}};
for(const [n,l] of Object.entries(lines))console.log('kunxLines',n.padEnd(13),'old:',k(O,l),'| new:',k(N,l));
const cur='CONCEDED LINKS: 0 -- recomputed after the cure from the cured lines (CORRECTED COUNT DEFENDER 0).';
for(const [n,l] of Object.entries(lines))for(const w of ['','Premise 6 '+F]){const r=f=>{try{return f.rctCheck(l,{why:w},'',R,cur)?'REFUSE':'accept'}catch(e){return 'ERR '+e.message.slice(0,60)}};console.log('rctCheck',n.padEnd(13),(w?'reason NRW':'no reason').padEnd(11),'old',r(O),'| new',r(N));}
