// reads PART2 from each new/ node (and base/), evaluates it, and prints the commitment headings the acceptance check derives (HEADS regex as live)
const fs=require('fs');const H=s=>[...s.matchAll(/^### (Commitment \d\. [^\n]+)$/gm)].map(m=>m[1]);
for(const d of ['base','new']){const out={};for(const f of fs.readdirSync(__dirname+'/../'+d)){const c=fs.readFileSync(__dirname+'/../'+d+'/'+f,'utf8');const m=c.match(/const PART2=("(?:[^"\\]|\\.)*");/);const p=eval(m[1]);out[f]=JSON.stringify(H(p))+' len '+p.length;}
 const v=[...new Set(Object.values(out))];console.log(d,'distinct PART2 forms:',v.length);v.forEach(x=>console.log('  ',x.slice(0,60),'...',x.slice(-160)));}
