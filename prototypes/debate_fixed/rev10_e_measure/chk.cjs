const fs=require('fs');const AF=Object.getPrototypeOf(async function(){}).constructor;let bad=0;
for(const l of fs.readFileSync('NODES14.txt','utf8').trim().split('\n')){const f=l.split(/\s+/)[2];try{new AF('$input','$','$json',fs.readFileSync(f,'utf8'));}catch(e){bad++;console.log('FAIL',f,e.message);}}
console.log('parse failures:',bad);
