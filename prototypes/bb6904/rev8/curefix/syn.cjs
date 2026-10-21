const fs=require('fs');const AF=Object.getPrototypeOf(async function(){}).constructor;let bad=0,n=0;
for(const d of ['base','new'])for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.js'))){n++;try{new AF('$input','$','$json','$execution','$node','$items',fs.readFileSync(d+'/'+f,'utf8'));}catch(e){bad++;console.log('SYNTAX',d,f,e.message);}}
console.log('parsed',n,'errors',bad);
