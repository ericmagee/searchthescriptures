const fs=require('fs');const vm=require('vm');
// smallest slice from "function NAME(" ending at a "}" that parses as a complete function declaration
function fnText(s,name){const i=s.indexOf('function '+name+'(');if(i<0)return null;
 for(let k=s.indexOf('}',i);k>=0;k=s.indexOf('}',k+1)){const t=s.slice(i,k+1);try{new vm.Script(t);return t;}catch(e){}}
 return null;}
module.exports={fnText};
if(require.main===module){const [f,n]=process.argv.slice(2);const t=fnText(fs.readFileSync(f,'utf8'),n);console.log(t?t.length:null);}
