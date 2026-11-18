// ASK 422(b) (W1): the stripped workflow differs from the fetch-back only in parameters.jsCode of the listed nodes.
const fs=require('fs');const [A,B,L]=process.argv.slice(2);const a=JSON.parse(fs.readFileSync(A)),b=JSON.parse(fs.readFileSync(B));
const listed=new Set(JSON.parse(fs.readFileSync(L)).map(x=>x.name));const strip=n=>{const c=JSON.parse(JSON.stringify(n));delete c.parameters.jsCode;return JSON.stringify(c);};
let bad=0,chg=0;const ka=Object.keys(a).filter(k=>k!=='nodes').sort(),kb=Object.keys(b).filter(k=>k!=='nodes').sort();
for(const k of new Set([...ka,...kb]))if(JSON.stringify(a[k])!==JSON.stringify(b[k])){bad++;console.log('top-level differs:',k);}
if(a.nodes.length!==b.nodes.length){bad++;console.log('node count differs');}
a.nodes.forEach((n,i)=>{const m=b.nodes[i];if(n.name!==m.name||strip(n)!==strip(m)){bad++;console.log('node differs outside jsCode:',n.name);}
 const d=(n.parameters.jsCode||'')!==(m.parameters.jsCode||'');if(d){chg++;if(!listed.has(n.name)){bad++;console.log('unlisted change:',n.name);}}else if(listed.has(n.name)){bad++;console.log('listed but unchanged:',n.name);}});
console.log(`${B}: jsCode changed in ${chg} nodes (listed ${listed.size}); other differences ${bad}`);process.exit(bad?1:0);
