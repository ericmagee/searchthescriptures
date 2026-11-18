// ASK 386 rev 3 (W1 8481 item 2i, 8485 item 1): an empty collision list is a missing input; it gives no tie. In rd386, and the same at 1336 and 1491.
const fs=require('fs');const p=__dirname+'/build386.cjs';let s=fs.readFileSync(p,'utf8');
const R=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));s=s.replace(a,()=>b);};
R("const tie=!!i.dst&&!!i.cst&&typeof i.cd==='number'&&typeof i.cc==='number'&&","const tie=(i.col||[]).length>0&&!!i.dst&&!!i.cst&&typeof i.cd==='number'&&typeof i.cc==='number'&&");
R("every one present; a missing field is not equal)","every one present; a missing field is not equal, and an empty collision list is a missing input)");
R(`"&&!!a1&&!!a2&&typeof n1==='number'`,`"&&cl.length>0&&!!a1&&!!a2&&typeof n1==='number'`);
R(`"&&!!dst&&!!cst&&typeof c.DEFENDER==='number'`,`"&&col.length>0&&!!dst&&!!cst&&typeof c.DEFENDER==='number'`);
fs.writeFileSync(p,s);console.log('rev 3 edits applied');
