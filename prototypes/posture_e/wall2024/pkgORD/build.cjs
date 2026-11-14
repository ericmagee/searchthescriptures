// ASK 278 (pkgORD), option (A) per W1 6358, W2, W3 6359: record-only list of order statements with no verse in the sentence, with the paragraph's cited rows. Build Save Body only.
const fs=require('fs');const [, , fin, fout]=process.argv;const raw=JSON.parse(fs.readFileSync(fin,'utf8'));const W=(raw.data||raw).workflow||(raw.data||raw);
const B=W.nodes.find(x=>x.name==='Build Save Body');let b=B.parameters.jsCode;const A="for(const x of __L2RV)FF.push(x);";
if(b.split(A).length!==2)throw new Error('anchor');const b0=b.length;const ORD=fs.readFileSync(__dirname+'/ord.js','utf8').trim();
b=b.replace(A,()=>ORD+' /* pkgORD, ASK 278 */\n'+A);B.parameters.jsCode=b;new Function('$','d','FF',b.slice(b.indexOf(ORD),b.indexOf(ORD)+ORD.length));
console.log('Build Save Body',b0,'->',b.length);fs.writeFileSync(fout,JSON.stringify(W));
