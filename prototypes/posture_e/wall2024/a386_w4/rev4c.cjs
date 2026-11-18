// ASK 386 rev 4 part 3 (W1 8499 item 2, 8519 item 1): a retracted link still counts, with its grade, when v25 regraded it in place (1314 to 1316).
// 1314 never gives a LINK BROKEN grade (8484 item 8a), so rd386 leaves out a listed link only while its line still reads LINK BROKEN (the replace missed, case B).
const fs=require('fs');const p=__dirname+'/build386.cjs';let s=fs.readFileSync(p,'utf8');
const R=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));s=s.replace(a,()=>b);};
R("const col=(i.col||[]).filter(z=>!ex.has(K(z.link)));","const col=(i.col||[]).filter(z=>!(ex.has(K(z.link))&&/LINK BROKEN$/.test(String(z.grade||'')))); /* ASK 386 rev 4 (W1 8499 item 2, 8519): a retracted link that v25 regraded in place (1314; never LINK BROKEN) counts with that grade; one still reading LINK BROKEN is left out */");
fs.writeFileSync(p,s);console.log('rev 4 part 3 edit applied');
