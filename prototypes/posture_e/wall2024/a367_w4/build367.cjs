// ASK 367 (coordinator 13:09 CST 11-17; W1 7720 item 3, W4 7727 trace, W1 7732 item 4 option (a)): K-LYR re-read on the final text in Alternate Merge, the one node every path passes before Write Judgment.
// Usage: node build367.cjs <base.json> <out.json>
const fs=require('fs');const w=JSON.parse(fs.readFileSync(process.argv[2]));
const P=fs.readFileSync(__dirname+'/patch.js','utf8').replace('/*LYR*/',()=>fs.readFileSync(__dirname+'/lyr2024.js','utf8')).trim();
const n=w.nodes.find(x=>x.name==='Alternate Merge');const A='return __AMOUT; /* pkgACL v51 here, ASK 287 */';const c=n.parameters.jsCode;
if(c.split(A).length!==2)throw new Error('anchor count');n.parameters.jsCode=c.replace(A,()=>P+'\n'+A);
fs.writeFileSync(process.argv[3],JSON.stringify(w));console.log('patched Alternate Merge',c.length,'->',n.parameters.jsCode.length);
