// ASK 436 plants (W1): the kjv expression of p436.cjs on planted rendering sets.
const {R}=require('./p436.cjs');const expr=R[3][1].replace(/^kjv:/,'');const fn=new Function('R0','return '+expr+';');
const mk=(o)=>({W:new Set(Object.keys(o)),CT:o});
const words30={};for(let i=0;i<30;i++)words30['w'+String(i).padStart(2,'0')]=100-i;words30.gloss=76.5;// between w23 (77) and w24 (76): the gloss word is 25th by count
const C=[['H1121-like: son first',mk({son:1898,children:1542,sons:1033,a:2,age:1,also:1})],['30 renderings, gloss word 25th by count (must not be shown; "and 6 more")',mk(Object.fromEntries(Object.entries(words30).slice(0,29).concat([['gloss',words30.gloss]])))],['exactly 24: no "more" entry',mk(Object.fromEntries(Array.from({length:24},(_,i)=>['v'+i,i+1])))],['ties: alphabetical',mk({b:5,a:5,c:9})],['no CT (old REN shape): alphabetical',{W:new Set(['b','a'])}]];
for(const [why,R0] of C){const o=fn(R0);console.log(why+' -> '+o.length+' entries: '+o.slice(0,4).join(', ')+(o.length>4?' ... '+o.slice(-2).join(', '):'')+' | gloss shown: '+o.includes('gloss'));}
