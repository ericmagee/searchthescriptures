// usage: node run_pwl.cjs <pwl.js> <F.json>  -> prints the LEDGER block exactly as Panel Build builds it
const fs=require('fs');
const src=fs.readFileSync(process.argv[2],'utf8');
const PWL=new Function(src+'\nreturn PWL;')();
const F=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const out=PWL.judgeBlock({cr1:F.cr1,gr1:F.gr1,cr2:F.cr2,gr2:F.gr2,cr3:F.cr3,dr3:F.dr3})+(t=>t?String.fromCharCode(10,10)+t:'')((()=>{try{return PWL.cList({dr3:F.dr3});}catch(e){return '';}})());
process.stdout.write(out);
