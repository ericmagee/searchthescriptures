const fs=require('fs'),acorn=require('acorn'),cr=require('crypto');
const [lf,tf]=process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(lf)),T0=JSON.parse(fs.readFileSync(tf));const T=T0.nodes?T0:(T0.data||T0);
const ln=Object.fromEntries(L.nodes.map(n=>[n.name,n])),tn=Object.fromEntries(T.nodes.map(n=>[n.name,n]));
const st=o=>JSON.stringify(o,Object.keys(o).sort());
function lex(src){const toks=[],cm=[];
 const wrap='(async function(){\n'+src+'\n})';
 acorn.parse(wrap,{ecmaVersion:'latest',allowAwaitOutsideFunction:true,allowReturnOutsideFunction:true,onToken:t=>toks.push(t.type.label+':'+(t.value===undefined?'':String(t.value instanceof RegExp?t.value:t.value))),onComment:c=>cm.push(c)});
 return {toks,cm};}
const refs=s=>[...new Set((s.match(/\$\(\s*(['"])(.*?)\1\s*\)/g)||[]))].sort().join('|');
let changed=0,bad=[],fieldDiff=[],removed=0,leftC=0;
if(Object.keys(ln).length!==Object.keys(tn).length)bad.push('node count');
for(const k in ln){const a=ln[k],b=tn[k];if(!b){bad.push('missing '+k);continue;}
 for(const f of new Set([...Object.keys(a),...Object.keys(b)])){if(f==='position'||f==='id')continue;
  if(f==='parameters'){const pa={...a.parameters},pb={...b.parameters};delete pa.jsCode;delete pb.jsCode;if(JSON.stringify(pa)!==JSON.stringify(pb))fieldDiff.push(k+':params');}
  else if(JSON.stringify(a[f])!==JSON.stringify(b[f]))fieldDiff.push(k+':'+f);}
 const ca=a.parameters.jsCode,cb=b.parameters.jsCode;if(ca===cb)continue;changed++;
 try{const x=lex(ca),y=lex(cb);if(x.toks.join('\u0001')!==y.toks.join('\u0001'))bad.push('tokens '+k);leftC+=y.cm.length;removed+=ca.length-cb.length;}catch(e){bad.push('parse '+k+' '+e.message.slice(0,60));}
 if(refs(ca)!==refs(cb))bad.push('refs '+k);}
const conn=JSON.stringify(L.connections)===JSON.stringify(T.connections);
console.log(JSON.stringify({changed,removed,leftComments:leftC,bad:bad.slice(0,10),nbad:bad.length,fieldDiff:fieldDiff.slice(0,10),conn}));
