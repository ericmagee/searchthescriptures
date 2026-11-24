// W1 grade check: rebuild every MAP module of a target and the live engine; length vs n; which modules change; other nodes changed; sha header.
const fs=require('fs'),cr=require('crypto');
const [,,LIVE,TGT]=process.argv;
const ld=f=>JSON.parse(fs.readFileSync(f));
const lib=w=>{const c=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;const L=JSON.parse(c.slice(c.indexOf('\n/*LIB*/')+8,c.lastIndexOf('\n/*MAP*/')));const M=JSON.parse(c.slice(c.lastIndexOf('\n/*MAP*/')+8,c.lastIndexOf('\n/*END*/')));const sha=(c.match(/library sha ([0-9a-f]{16})/)||[])[1];return {c,L,M,sha,calc:cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16)}};
const build=(L,p)=>p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
const a=ld(LIVE),b=ld(TGT);const A=lib(a),B=lib(b);
console.log('live sha hdr',A.sha,'calc',A.calc,'| target sha hdr',B.sha,'calc',B.calc,'| LIB lines',A.L.length,B.L.length);
let bad=0;const changed=[];
for(const k of Object.keys(B.M)){const s=build(B.L,B.M[k].p);if(s.length!==B.M[k].n){bad++;console.log('LENGTH MISMATCH',k,s.length,B.M[k].n)}
 try{new Function('$','$input','items',"return (async()=>{"+s+"\n})")}catch(e){bad++;console.log('PARSE FAIL',k,e.message)}
 const so=A.M[k]?build(A.L,A.M[k].p):null;if(so!==s)changed.push(k+' '+(so?so.length:'new')+'->'+s.length)}
console.log('MAP modules',Object.keys(B.M).length,'bad',bad);console.log('modules whose source changes:',changed.join('; '));
const ln=[];for(let i=0;i<Math.max(A.L.length,B.L.length);i++)if(A.L[i]!==B.L[i])ln.push(i);console.log('LIB lines changed:',ln.join(','));
const on={};for(const n of a.nodes)on[n.name]=JSON.stringify(n);const diffN=b.nodes.filter(n=>on[n.name]!==JSON.stringify(n)).map(n=>n.name);console.log('nodes changed:',diffN.join(', '),'| node count',a.nodes.length,b.nodes.length,'| connections equal',JSON.stringify(a.connections)===JSON.stringify(b.connections));
