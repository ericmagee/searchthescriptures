const O=require('./load.cjs')('live.json','Gate Record'),N=require('./load.cjs')('target.json','Gate Record');const D=require('./deb.json');
let tot=0,diff=0;for(const d of D){const R={CR3:d.cr3,DR3:d.dr3};for(const j of (d.js||[]))for(const l of (j.lines||[])){tot++;
 const k=f=>{try{return f.kunxLines(l,R).items.map(x=>x.link+' '+(x.a||'LACK')).join('; ')}catch(e){return 'ERR '+e.message}};const a=k(O),b=k(N);
 if(a!==b){diff++;console.log(d.run_token,j.seat,'\n old:',a,'\n new:',b,'\n ',l.slice(0,220));}}}
console.log('lines',tot,'differ',diff);
