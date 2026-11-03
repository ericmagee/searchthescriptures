// Every changed node compiles: new Function on the file's text (n8n Code nodes run as a function body). Base too, for comparison.
const fs=require('fs');let bad=0,n=0;
for(const d of ['base','new','add']){const D=__dirname+'/../'+d+'/';for(const f of fs.readdirSync(D).filter(f=>f.endsWith('.js'))){try{new Function(fs.readFileSync(D+f,'utf8'));if(d!=='base'){n++;console.log('OK  ',f);}}catch(e){bad++;console.log('FAIL',d,f,e.message);}}}
console.log('new files',n,'| compile failures',bad);process.exitCode=bad?1:0;
