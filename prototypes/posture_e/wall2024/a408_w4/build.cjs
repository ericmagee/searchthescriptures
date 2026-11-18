// ASK 408 build (W3 8732, rev 2 8737; W1 8736, W2 8734, W4 8735). One edit to Init with Guards: the line goes inside GUARDHOLD after the "It fits the link" sentence. Offline.
// Usage: node a408/build.cjs IN OUT
const fs=require('fs');const acorn=require('../tools/node_modules/acorn');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const L0=fs.readFileSync(__dirname+'/'+(process.argv[4]||'line_rev3.txt'),'utf8').replace(/\n$/,'');if(/[\\\n]/.test(L0))throw new Error('line holds a backslash or newline');const L=L0.replace(/"/g,'\\"'); /* inside the GUARDHOLD double-quoted string */
const n=d.nodes.find(x=>x.name==='Init with Guards');const A='Write \\"It fits the link\\" only after the words that show the fit.';const s=n.parameters.jsCode;
const k=s.split(A).length-1;if(k!==1)throw new Error('anchor count '+k);if(!s.slice(s.indexOf(A)+A.length).startsWith(' ANSWER LUKE 1:35 AT THE WORD (DG-18)'))throw new Error('anchor not followed by the Luke 1:35 rule');
n.parameters.jsCode=s.replace(A,()=>A+' '+L);acorn.parse(n.parameters.jsCode,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));console.log('Init with Guards: code +'+(L.length+1)+' characters; prompt line '+L0.length+' characters');
