const fs=require('fs');const {first}=require('../r34726/load.cjs');const src=fs.readFileSync('pkgLIB/strip_S113L/patched/Panel_Cure_Check.js','utf8');
const OLD='const kwRe=t=>/\\bREASSERTED\\s+IN\\s+\\[?[CD]R\\d+\\]?\\s*(?:[:,]|--|\\u2014)?\\s*["\\u201c][^"\\u201d]{6,}["\\u201d]/i.test(t);';
if(!src.includes(OLD))throw new Error('anchor');const NEW=OLD.replace('["\\u201c][^"\\u201d]{6,}["\\u201d]',"[\"\\u201c'\\u2018][^\"\\u201d]{6,}[\"\\u201d'\\u2019]");
const mk=s=>new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts};')(()=>{throw 0},null);
const O=mk(src),N=mk(src.replace(OLD,NEW));const c=first('Alternate Cure Normalize');
const run=M=>M.cureVerdicts(JSON.parse(JSON.stringify(c.cure.items)),c.reply,c.cure.broken,c.cure.rounds);
const a=run(O),b=run(N);console.log('items',a.length,'uncured live',a.filter(x=>x.status==='UNCURED').length,'uncured cand',b.filter(x=>x.status==='UNCURED').length);
a.forEach((x,i)=>{if(x.status!==b[i].status)console.log(' ',c.cure.items[i].rule,c.cure.items[i].link,x.status,'->',b[i].status,'|',b[i].why);});
module.exports={OLD,NEW};
