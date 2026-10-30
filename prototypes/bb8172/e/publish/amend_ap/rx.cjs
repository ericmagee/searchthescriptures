const fs=require('fs');
const a=fs.readFileSync(process.argv[2],'utf8'),b=fs.readFileSync(process.argv[3],'utf8');
const grab=t=>{const i=t.indexOf('pre.split(');return t.slice(i+10,t.indexOf(').pop()',i));};
const ra=eval(grab(a)),rb=eval(grab(b));
console.log('file  regex text:',JSON.stringify(grab(a)),'source',JSON.stringify(ra.source));
console.log('amend regex text:',JSON.stringify(grab(b)),'source',JSON.stringify(rb.source));
const T=['a; b','a. b','a.b','a -- b','a — b','a - b','a–b','a―b','no; witness was. left -- un — x','plain'];
console.log('split equal on',T.length,'samples:',T.every(x=>JSON.stringify(x.split(ra))===JSON.stringify(x.split(rb))));
