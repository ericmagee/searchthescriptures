// Restack ASK 367 rev 2, ASK 368 step 2 and ASK 373 on panel change rev 3 (base s252).
const fs=require('fs');const cp=x=>JSON.parse(JSON.stringify(x));
const P3=JSON.parse(fs.readFileSync('pnl/tpnl3_on252.json'));const S367=JSON.parse(fs.readFileSync('stk/t367_on_pnl252.json'));const S368=JSON.parse(fs.readFileSync('stk/t368_on_367pnl252.json'));const P2=JSON.parse(fs.readFileSync('stk/tpnl2_on252.json'));
const nd=(w,n)=>w.nodes.find(x=>x.name===n);const diff=(a,b)=>a.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(nd(b,n.name))).map(n=>n.name);
if(diff(P2,S367).join()!=='Alternate Merge')throw new Error('367 diff '+diff(P2,S367));if(diff(S367,S368).sort().join()!=='Close Enforcer Build,Judge Contradiction Build')throw new Error('368 diff '+diff(S367,S368));
const T367=cp(P3);nd(T367,'Alternate Merge').parameters=cp(nd(S367,'Alternate Merge').parameters);
const T368=cp(T367);for(const n of ['Close Enforcer Build','Judge Contradiction Build'])nd(T368,n).parameters=cp(nd(S368,n).parameters);
fs.writeFileSync('stk/t367_on_pnl3.json',JSON.stringify(T367));fs.writeFileSync('stk/t368_on_367pnl3.json',JSON.stringify(T368));
console.log('367 vs pnl3',diff(P3,T367).join(', '),'| 368 vs 367',diff(T367,T368).join(', '));
