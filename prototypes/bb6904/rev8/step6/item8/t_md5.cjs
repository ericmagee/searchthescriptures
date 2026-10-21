const src=require('fs').readFileSync('item8_block.js','utf8');const i=src.indexOf('const MD5');const j=src.indexOf('const sentMsgs');
const MD5=new Function(src.slice(i,j)+';return MD5;')();const c=require('crypto');
const tests=['','a','abc','message digest','The quick brown fox jumps over the lazy dog','ἐγεννήθη — Ἰωσὴφ “quoted”','x'.repeat(55),'x'.repeat(56),'y'.repeat(64),'z'.repeat(1000)+'é',require('fs').readFileSync('../s6/composed/Panel_Build.js','utf8')];
let ok=true;for(const s of tests){const a=MD5(s),b=c.createHash('md5').update(s,'utf8').digest('hex');if(a!==b){ok=false;console.log('FAIL',JSON.stringify(s.slice(0,20)),a,b);}}console.log(ok?'MD5 PASS on '+tests.length:'MD5 FAIL');
