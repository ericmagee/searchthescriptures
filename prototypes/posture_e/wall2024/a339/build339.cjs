// ASK 339 build on live s227 (or on a given base): Format Markdown only. Inserts the S-C note function before the synthesis is drawn and wraps the drawn synthesis text.
const fs=require('fs');const IN=process.argv[2]||'../rdf/fetchback_s227_342.json',OUT=process.argv[3]||'target_339.json';
const d=JSON.parse(fs.readFileSync(IN));const SITE=fs.readFileSync(__dirname+'/scn339.js','utf8').trim();
const once=(s,a,b,tag)=>{const k=s.split(a).length-1;if(k!==1)throw new Error(tag+' count '+k);return s.replace(a,()=>b);};
const n=d.nodes.find(x=>x.name==='Format Markdown');let s=n.parameters.jsCode;
s=once(s,"const SP = synthParts(r.synthesis);\nt += '## Synthesis\\n\\n**Analyst:** ' + SJN + ', gives no verdict\\n\\n' + (r.synthesis ? synthClean(SP[0]) : '(not recorded)') + '\\n\\n';",
 SITE+"\nconst __SCN=x=>{try{let q=null;try{q=$('Quote Report').first().json;}catch(e){q=null;}return __SCNmk(r,q,(v&&v.text)||'',null)(x);}catch(e){return x;}};\nconst SP = synthParts(r.synthesis);\nt += '## Synthesis\\n\\n**Analyst:** ' + SJN + ', gives no verdict\\n\\n' + (r.synthesis ? __SCN(synthClean(SP[0])) : '(not recorded)') + '\\n\\n';",'FM synthesis');
n.parameters.jsCode=s;
const acorn=require('../tools/node_modules/acorn');acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true});
fs.writeFileSync(OUT,JSON.stringify(d));console.log('ok');
