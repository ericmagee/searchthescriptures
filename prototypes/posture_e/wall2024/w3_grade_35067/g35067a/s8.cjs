const L=require('./lib.cjs');const fs=require('fs');
const an=L.items('Alternate Needed?')[0];
['luna','chatgpt','sol'].forEach((s,i)=>fs.writeFileSync('body_'+s+'.txt',an.bodies[i]));
