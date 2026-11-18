// ASK 386 rev 4 (W1 8499 on W2 8496 item 4): a collision list whose every line is retracted gives no tie in rd386. The test now uses the list after the retracted links are left out.
const fs=require('fs');const p=__dirname+'/build386.cjs';let s=fs.readFileSync(p,'utf8');
const R=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));s=s.replace(a,()=>b);};
R("const tie=(i.col||[]).length>0&&!!i.dst","const tie=col.length>0&&!!i.dst");
R("and an empty collision list is a missing input)","and an empty collision list, or one whose every line is retracted, is a missing input)");
fs.writeFileSync(p,s);console.log('rev 4 edit applied');
