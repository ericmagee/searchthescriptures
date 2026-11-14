const O=require('./load.cjs')('live.json','Gate Record'),N=require('./load.cjs')('target.json','Gate Record');const D=require('./deb.json')[0];
const raw=require('fs').readFileSync('luna_raw.txt','utf8');const RD={CR3:D.cr3,DR3:D.dr3};
const cur='CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure from the cured lines (CORRECTED COUNT CHALLENGER 0).';
const to='CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED ([L4] footing borrowed from contested Link 1); Premises 1, 4, 5 and 6 spared; Premise 2 VOID.';
const plain='CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED (assumed knowing) -- ASSUMES: Joseph knew Mary; Premises 1, 4, 5 and 6 spared; Premise 2 VOID.';
const C=[['borrowed, no reason',to,''],['borrowed, reason names premise 3',to,'Premise 3 footing borrowed from contested Link 1'],
['plain, no reason',plain,''],['plain, reason names other premise 5',plain,'Premise 5: footing borrowed from contested Link 1'],
['plain, reason names premise 3',plain,'Premise 3: footing borrowed from contested Link 1'],['plain, reason names no premise',plain,'the step rests on footing borrowed from contested Link 1'],
['borrowed with no link number',to.replace('contested Link 1','contested Links'),'']];
for(const [n,t,w] of C){const r=f=>{try{const v=f.rctCheck(t,{why:w},raw,RD,cur);return v?'REFUSE':'accept'}catch(e){return 'ERR '+e.message}};console.log(n.padEnd(40),'old',r(O),'| new',r(N));}
