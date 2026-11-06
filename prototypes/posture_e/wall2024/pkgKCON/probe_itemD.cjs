const L=require('../pkgR2/lib.cjs')(process.argv[2]||'merged_PWQA/Panel_Cure_Check.js');
const Q='the angel told Joseph that the child was conceived of the Holy Ghost';
const x={rule:'K-CON',side:'CHALLENGER',link:'K1',line:'[R3] the engine marked a withdrawn premise reasserted, and no CONTRADICTION, NOT HELD or REASSERTED IN line of this judge quotes it: "'+Q+'"'};
const V={
 'A RESPONSE | NOT HELD, reason only':'RESPONSE: K1 | NOT HELD: the later round restates the verse, it does not reassert the withdrawn premise.',
 'B RESPONSE | NOT HELD, with quote':'RESPONSE: K1 | NOT HELD -- K1 -- "'+Q+'" -- it quotes the verse, not the premise.',
 'C bare NOT HELD, reason only':'NOT HELD -- K1 -- the later round restates the verse only.',
 'D bare NOT HELD, with quote':'NOT HELD -- K1 -- "'+Q+'" -- it quotes the verse, not the premise.',
 'E STATEMENT NOT HELD, with quote':'STATEMENT: NOT HELD -- K1 -- "'+Q+'" -- verse only.',
 'F bare NOT HELD, 6-word part of quote':'NOT HELD -- K1 -- "that the child was conceived of" -- verse only.',
 'G CONTRADICTION with quote':'CONTRADICTION -- CHALLENGER -- EARLIER (R1, "x") -- LATER (R3, "'+Q+'")',
};
for(const [k,t] of Object.entries(V)){const r=L.krulCure(x,t,{},t.startsWith('RESPONSE')?t:'');console.log(k,'=>',r.st,'|',r.why);}
