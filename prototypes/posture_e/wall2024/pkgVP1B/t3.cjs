const fs=require('fs');const {run,live,cand}=require('./t1.cjs');const P=fs.readFileSync('luna_pregate.txt','utf8').split('\n');
const i30=P.findIndex(x=>x.startsWith('ANSWER CHECK: Matthew 1:20 -- [CR3] -- MEANS: “four verses'));const Q=P.slice();Q[i30]=Q[i30].replace(/MEANS: “[^”]*”/,'MEANS: “thou shalt call his name JESUS”');
const f=k=>k.filter(x=>/1:20/.test(x)).join(' ; ');console.log('R3 MEANS = words of LINK 4 [L3] layer only\n live:',f(run(live,Q.join('\n'))),'\n cand:',f(run(cand,Q.join('\n'))));
