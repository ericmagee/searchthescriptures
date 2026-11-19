const fs=require('fs');const R=JSON.parse(fs.readFileSync('rows14.json'));
const mk=f=>new Function(fs.readFileSync(f,'utf8')+'\nreturn __gca;')();const O=mk('gca_old.js'),N=mk('gca_new.js');
for(const r of R){const a=O(r.raw),b=N(r.raw);console.log(r.id,r.seat,'old',a.length,'new',b.length,b.filter(x=>!a.includes(x)).join(' | ')||'-');}
// mirror and controls
const T=[['plant retracted','KEYSTONE: D4 -- BROKEN -- D4 vs C1 fails\nD4 vs C1 (Matthew 1:18): UNDERDETERMINED -- retracted in the cure\nDEFENSE STANDING: x (RETRACTED D4 vs C1 (DEFENDER LINK BROKEN to UNDERDETERMINED))'],
['plant agree','KEYSTONE: D4 -- BROKEN -- D4 vs C1 fails\nD4 vs C1 (Matthew 1:18): DEFENDER LINK BROKEN -- x'],
['plant derived','KEYSTONE: D4 -- BROKEN -- derived by the engine from the collision grade D4 vs C1\nD4 vs C1: UNDERDETERMINED -- x'],
['plant other D','KEYSTONE: D4 -- BROKEN -- see D3 vs C1\nD3 vs C1: UNDERDETERMINED -- x'],
['mirror STANDS (existing GCA)','KEYSTONE: D4 -- STANDS -- D4 vs C1 does not break it\nD4 vs C1: DEFENDER LINK BROKEN -- x']];
for(const [k,t] of T)console.log(k,'old',JSON.stringify(O(t)),'new',JSON.stringify(N(t)));
