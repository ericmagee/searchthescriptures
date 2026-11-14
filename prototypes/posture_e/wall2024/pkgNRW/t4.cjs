const O=require('./load.cjs')('../k4/live.json','Gate Record'),N=require('./load.cjs')('./target.json','Gate Record');const D=require('../bfx/deb.json')[0];
const raw=require('fs').readFileSync('../bfx/luna_raw.txt','utf8');const RD={CR3:D.cr3,DR3:D.dr3};
const cur='CHALLENGER CONCEDED LINKS: 0 -- recomputed after the cure from the cured lines (CORRECTED COUNT CHALLENGER 0).';
const F='(UNEXHIBITED: the kept claim takes as given the knowing before the taking, which its rows do not give and its [L4] does not reach)';
const bor='CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED ([L4] footing borrowed from contested Link 1); Premises 1, 4, 5 and 6 spared; Premise 2 VOID.';
const nrw='CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED '+F+'; Premises 1, 4, 5 and 6 spared; Premise 2 VOID.';
const plain='CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED (assumed knowing) -- ASSUMES: Joseph knew Mary; Premises 1, 4, 5 and 6 spared; Premise 2 VOID.';
const C=[['borrowed (control)',bor,''],['nrw, no reason',nrw,''],['nrw, reason names premise 3',nrw,'Premise 3 '+F],['plain, no reason',plain,''],['plain, reason NRW names premise 3',plain,'Premise 3: '+F],['plain, reason NRW names premise 5',plain,'Premise 5: '+F]];
for(const [n,t,w] of C){const r=f=>{try{const v=f.rctCheck(t,{why:w},raw,RD,cur);return v?'REFUSE':'accept'}catch(e){return 'ERR '+e.message}};console.log(n.padEnd(36),'old',r(O),'| new',r(N));}
const k=(f,l)=>{try{return f.kunxLines(l,RD).items.map(x=>x.link+' '+(x.a||'LACK')).join('; ')||'(none)'}catch(e){return 'ERR '+e.message}};
for(const [n,l] of [['bor',bor],['nrw',nrw],['plain',plain]])console.log('kunxLines',n,'old:',k(O,l),'| new:',k(N,l));
