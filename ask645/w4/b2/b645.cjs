// ASK 645 build (W4): qfCheck faults a follow-up whose open words are the whole question (trailing punctuation set aside, W1 N1). QR Merge, QR Follow Build and QR Follow Final, one statement each. node b645.cjs base_eng.json out_target.json
const fs=require('fs');const [,,BE,OUT]=process.argv;const E=JSON.parse(fs.readFileSync(BE,'utf8'));
const A="fl.push('the open words are not found word for word in Q'+n+' or its quoted passage');";
const NEW=String.raw`else if(x&&o.replace(/[\s?.!,;:'"]+$/,'')===qrNorm(x.question).replace(/[\s?.!,;:'"]+$/,''))fl.push('the open words are the whole of Q'+n+'; a follow-up names the part its answer left open'); /* ASK 645: the whole question is not a part its answer left open (ruling 515); trailing punctuation is set aside on both sides */`;
const names=['QR Merge','QR Follow Build','QR Follow Final'];
for(const nm of names){const n=E.nodes.find(k=>k.name===nm);const c=n.parameters.jsCode;if(c.split(A).length!==2)throw new Error('ASK 645 build: anchor not found once in '+nm);n.parameters.jsCode=c.replace(A,()=>A+NEW);}
fs.writeFileSync(OUT,JSON.stringify(E));console.log('ASK 645 built:',OUT,'| nodes changed:',names.join(', '));
