const L=require('./lib.cjs');const fs=require('fs');
const pb=L.items('Panel Build'); console.log(pb.length, JSON.stringify(L.shape(pb[0],0,1)).slice(0,800));
const s=JSON.stringify(pb[0]); console.log(s.length);
fs.writeFileSync('panelbuild.json',s);
