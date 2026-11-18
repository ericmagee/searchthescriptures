// ASK 386 rev 4 plants (W1 8499): a collision list whose every line is retracted gives no tie; one line not retracted keeps the tie.
const E3=require('./ert_eval.cjs')(__dirname+'/t386_rev3.json'),E4=require('./ert_eval.cjs')(__dirname+'/t386.json');
const eq={dst:'PROP-DEPENDENT',cst:'PROP-DEPENDENT',cd:1,cc:1};const one=[{link:'D1 vs C1',grade:'STANDS'}],two=[{link:'D1 vs C1',grade:'STANDS'},{link:'D2 vs C2',grade:'STANDS'}];
const P=[['HELD, equal fields, the only line retracted',{verdict:'HELD',...eq,col:one,retracted:['D1 vs C1']}],['BROKEN, equal fields, the only line retracted',{verdict:'BROKEN',...eq,col:one,retracted:['D1 vs C1']}],
 ['BROKEN, equal fields, two lines, one retracted (tie kept)',{verdict:'BROKEN',...eq,col:two,retracted:['D1 vs C1']}],['BROKEN, equal fields, no line retracted (tie kept)',{verdict:'BROKEN',...eq,col:one}]];
const out=P.map(([n,i])=>({plant:n,rev3:E3.rd386(i).word,rev4:E4.rd386(i).word}));require('fs').writeFileSync(__dirname+'/plants4_out.json',JSON.stringify(out,null,1));out.forEach(o=>console.log(JSON.stringify(o)));
