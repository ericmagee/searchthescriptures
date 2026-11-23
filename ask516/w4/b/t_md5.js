const fs=require('fs');eval(fs.readFileSync(__dirname+'/md5.js','utf8')+';globalThis.M5=M5;');const cr=require('crypto');
const tests=['','a','abc','message digest','x'.repeat(55),'x'.repeat(56),'x'.repeat(64),'é—“”\u{1F600}Σ','\ud800 lone'];
for(const s of [...tests, fs.readFileSync('/tmp/claude-0/-home-user/86d59483-62fd-5fa0-b8c4-6322500f4823/scratchpad/R41117.json','utf8')]){const a=M5(s),b=cr.createHash('md5').update(s,'utf8').digest('hex');if(a!==b)console.log('DIFF',JSON.stringify(s.slice(0,20)),a,b);}
console.log('done');
