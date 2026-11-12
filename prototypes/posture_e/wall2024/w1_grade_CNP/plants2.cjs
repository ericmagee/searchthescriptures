const fs=require('fs');const cecDeny=require('./run.cjs');const d=JSON.parse(fs.readFileSync(__dirname+'/F_31032.json','utf8'));
console.log('links',JSON.stringify(d.links));
const base=d.F.cr4.replace('I keep D1 to D6 as numbered.','').replace('I narrow nothing and concede nothing.','');
const P=[
 ['R1 range D1-D4','I keep D1 to D4 as numbered.',[]],
 ['R2 range D1-D6','I keep D1 to D6 as numbered.',['5','?']],
 ['R3 range D4-D6','I keep D4 to D6 as numbered.',['5']],
 ['N1 D5 as narrowed','D5 stands as narrowed, and nothing else is conceded.',[]],
 ['N2 D2 as narrowed','D2 stands as narrowed, and nothing else is conceded.',['5']],
 ['E1 apart from LINK 5','Apart from LINK 5, I keep every link as I declared it.',[]],
 ['E2 except for D5','Except for D5, nothing is conceded.',[]],
 ['E3 except D2','Except for D2, nothing is conceded.',['5']],
 ['E4 exception after','Nothing is conceded, apart from LINK 5.',[]],
 ['W a','My chain stands entire.',['5','?']],
 ['W b','Every link stands as I first gave it.',['5','?']],
 ['W c','D1 through D6 remain exactly as stated.',['5','?']],
 ['W d','Not one link has been narrowed.',['5','?']],
 ['W e','None of my links is narrowed or withdrawn.',['5','?']],
 ['W f','No concession has been made.',['5','?']],
 ['B1 bold','**I narrow nothing and concede nothing.**',['5','?']],
 ['B2 two sentences','I keep D1 to D6 as numbered. Apart from the idiom, nothing more is conceded.',['5','?']],
 ['Q1 question','Has nothing been narrowed? The record shows LINK 5 narrowed.',[]],
 ['Q2 conditional','If nothing had been narrowed, the chain would stand.',[]],
 ['Q3 quoting opponent','The challenger says "I narrow nothing" of my chain; that is false.',[]],
];
let ok=0;for(const [nm,s,want] of P){const F={...d.F,cr4:base+'\n\n'+s};const out=cecDeny(F,d.links,[]).filter(c=>c.side==='DEFENDER'&&s.includes(c.closing_q.replace(/\*/g,'').slice(0,10)));const got=[...new Set(out.map(c=>String(c.n)))].sort();const w=[...want].sort();const g=JSON.stringify(got)===JSON.stringify(w);if(g)ok++;console.log(g?'OK  ':'DIFF',nm,'want',w.join(',')||'none','got',got.join(',')||'none');}
console.log('plants',ok,'of',P.length);
