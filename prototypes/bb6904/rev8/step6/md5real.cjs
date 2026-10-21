// E's check (7237): the MD5 coded in the composed Format Markdown against Node crypto, on the real texts sent in 27433.
const fs=require('fs'),crypto=require('crypto');const [FM,DIR]=process.argv.slice(2);
const src=fs.readFileSync(FM,'utf8');const a=src.indexOf('const MD5 = (str) =>');const b=src.indexOf('const sentMsgs');
const MD5=new Function(src.slice(a,b)+';return MD5;')();
let ok=true;for(const f of fs.readdirSync(DIR).filter(f=>f.endsWith('.txt'))){const t=fs.readFileSync(DIR+'/'+f,'utf8');
 const c=crypto.createHash('md5').update(t,'utf8').digest('hex'),m=MD5(t);ok&=c===m;console.log((c===m?'PASS ':'FAIL ')+f+' '+t.length+' '+m.slice(0,8)+' '+c.slice(0,8)+(/[^\x00-\x7f]/.test(t)?' non-ASCII':''));}
console.log(ok?'MD5 PASS':'MD5 FAIL');
