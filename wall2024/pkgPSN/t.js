const L=require('fs').readFileSync('/dev/stdin','utf8');
for(const m of ['./old.js','./new.js']){const x=require(m);console.log(m,JSON.stringify(x.P1(L)),JSON.stringify(x.P2(L)));}
