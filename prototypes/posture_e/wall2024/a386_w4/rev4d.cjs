// ASK 386 rev 4 part 3 comment fix (W1 8522; limit per W1 after 8523): the rd386 comment named an all-retracted list a missing input; since part 3 that holds only while the retracted lines still read LINK BROKEN. Comment only.
const fs=require('fs');const p=__dirname+'/build386.cjs';let s=fs.readFileSync(p,'utf8');
const R=(a,b)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(n+' x '+a.slice(0,90));s=s.replace(a,()=>b);};
R("or one whose every line is retracted, is a missing input)","or one whose every line is retracted and still reads LINK BROKEN, is a missing input)");
R("one still reading LINK BROKEN is left out */","one still reading LINK BROKEN is left out. LIMIT (closes under ASK 399): a retracted line that neither v25 nor a restated line rewrote, still reading STANDS or UNDERDETERMINED, also counts; 0 of 624 stored judgments */");
fs.writeFileSync(p,s);console.log('rev 4 comment edit applied');
