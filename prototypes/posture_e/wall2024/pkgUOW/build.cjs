// pkgUOW: the UNDERDETERMINED "what the record leaves open" pattern (UND.OPEN, used by undOk: pkgUND send-back cure, E-HOLD on UNDERDETERMINED, pkgUNA)
// takes up to 8 words between "leave(s)" and "open|disputed|...", any word without . ; : , (so curly apostrophes count). Base: live s140 (fetchback_live_s140.json).
const fs=require('fs'),crypto=require('crypto');const W='/mnt/project-files/wall2024/';
const D=JSON.parse(fs.readFileSync(W+'fetchback_live_s140.json','utf8'));if(D.versionId!=='5062d21e-5b22-4ca6-9a4c-2468dc869540')throw new Error('base is not s140');
const P=JSON.parse(JSON.stringify(D));
const A=String.raw`leaves?\\s+(?:\\w+\\s+){0,3}(?:open|`, B=String.raw`leaves?\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,8}(?:open|`;
const ln=P.nodes.find(n=>n.name==='Shared Library');const c=ln.parameters.jsCode;const k=c.split(A).length-1;if(k!==1)throw new Error('anchor x'+k);
ln.parameters.jsCode=c.replace(A,()=>B);
fs.writeFileSync(W+'parent_s140_UOW2.json',JSON.stringify(P));
const code=x=>x.nodes.reduce((s,n)=>s+(n.parameters.jsCode||'').length,0);
console.log('Shared Library code',ln.parameters.jsCode.length-c.length,'total code',code(P)-code(D),'prompt 0');
const diff=P.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(D.nodes.find(z=>z.name===n.name))).map(n=>n.name);
console.log('nodes changed',diff,'node count',P.nodes.length,D.nodes.length,'connections equal',JSON.stringify(P.connections)===JSON.stringify(D.connections));
// the library still parses and the new OPEN is the replay candidate
let pe=0;try{new Function(c)}catch(e){pe++};try{new Function(ln.parameters.jsCode)}catch(e){pe+=10};console.log("parse as plain JS: base fails",pe%10===1,"candidate fails",pe>=10,"(the library is a packed map, not plain JS; same result both sides)");const i=ln.parameters.jsCode.indexOf('const OPEN=/'),j=ln.parameters.jsCode.indexOf('/i;',i);
console.log('OPEN equals replay candidate',JSON.parse('"'+ln.parameters.jsCode.slice(i+12,j)+'"')===fs.readFileSync(W+'uow_newsrc.txt','utf8'));
console.log('sha256',crypto.createHash('sha256').update(fs.readFileSync(W+'parent_s140_UOW2.json')).digest('hex').slice(0,16));
