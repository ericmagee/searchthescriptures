const fs=require('fs');const D=require('./t5_diff.json');
const dr=o=>{const m=(o||'').match(/WHAT THE BLOCK DROPS OR DISOWNS: ([\s\S]*?)\. Rule it/);return m?m[1]:null;};
for(const d of D){if(!d.o2)continue;const a=dr(d.o2),b=dr(d.o3);console.log('==',d.id,d.sd,'\n R2:',a.slice(0,500),'\n R3:',b.slice(0,700));}
