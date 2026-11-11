const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex34852_full.json','utf8'));
const find=(o)=>{if(o&&typeof o==='object'){if(o.runData)return o.runData;for(const k in o){const r=find(o[k]);if(r)return r}}return null};
const rd=find(X);const o=n=>rd[n]&&rd[n][rd[n].length-1].data.main;
for(const n of ['Close Enforcer Record','Anticheat Record']){const m=o(n);console.log(n,rd[n].length,'runs; main',JSON.stringify(m).length);const j=m[0][0].json;console.log(JSON.stringify(j.cec||j.acx,(k,v)=>typeof v==='string'&&v.length>150?v.slice(0,150)+'…':v,1).slice(0,5000));}
for(const n of ['Panel Build','Build Independent Verdict'])console.log(n,!!rd[n],rd[n]&&JSON.stringify(o(n)).length);
console.log(JSON.stringify(o('Anticheat Record')[0][0].json.acx.reversed,null,1));
