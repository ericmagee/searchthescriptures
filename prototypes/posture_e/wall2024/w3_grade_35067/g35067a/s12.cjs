const L=require('./lib.cjs');const fs=require('fs');
const g=L.items('Gate Build')[0];
console.log(g.msg);
console.log(JSON.stringify(g.items,null,1).slice(0,3000));
const gc=L.items('Gate Call openrouter')[0]; console.log(JSON.stringify(gc).slice(0,3500));
