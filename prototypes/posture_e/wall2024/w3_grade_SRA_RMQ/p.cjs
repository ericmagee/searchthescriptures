const fs=require('fs');eval(fs.readFileSync('../fc4/prototypes/posture_e/wall2024/pkgSRA/helper.js','utf8').replace('function sraSame','global.sraSame=function'));
const T=fs.readFileSync('CR3_34852.txt','utf8');
const M20="four verses after 1:16 the angel greets the husband of 1:16 as David’s son and gives him the child’s naming",A20="It is Joseph’s address, and the same verse states the source of the child.";
const show=(n,s)=>console.log('['+n+']',JSON.stringify(s).slice(0,900),'\n');
show('A real B13',sraSame(T,'Matthew 1:20',M20,A20,''));
// B: answering sentence pushed past the 400 cut
const L42=T.split('\n').find(l=>l.includes('Naming therefore does not mark'));
const pad=L42.replace('Naming is given to Joseph here.','Naming is given to Joseph here. '+'The verse stands in the birth account and is read with the verses around it in the same chapter of the same book. '.repeat(3));
const TB=T.replace(L42,pad).split('\n').filter(l=>!/Naming is not the father's alone/.test(l)).join('\n');
const rb=sraSame(TB,'Matthew 1:20',M20,A20,'');show('B answer sentence past 400 (pos '+pad.indexOf('Naming therefore')+')',rb);console.log('  B holds the answering sentence:',rb.includes('Naming therefore does not mark'));
// C: same answer in other words (no shared stem with the meaning)
const TC=T.split('\n').filter(l=>!/Naming|naming|call his name/.test(l)).concat(['- **Matthew 1:21** The right to give the title to a child is shared by the mother in Luke 1:31, so it does not single out a begetter.']).join('\n');
show('C other words',sraSame(TC,'Matthew 1:20',M20,A20,''));
// D: a line where the side QUOTES the opponent's claim and does not answer
const TD=T.split('\n').filter(l=>!/Naming|naming|call his name/.test(l)).concat(['- **Luke 2:21** The defender says the naming given to the husband marks him as the father of the child, and repeats it twice.']).join('\n');
show('D opponent claim restated',sraSame(TD,'Matthew 1:20',M20,A20,''));
// E: a grant under another verse
const TE=T.split('\n').filter(l=>!/Naming|naming|call his name/.test(l)).concat(['- **Luke 2:21** I grant that the naming was given to the husband by the angel in the dream.']).join('\n');
show('E grant line',sraSame(TE,'Matthew 1:20',M20,A20,''));
// F: line names the verse by abbreviation / verse range
const TF=T.split('\n').filter(l=>!/Naming|naming|call his name/.test(l)).concat(['- **Matt. 1:20-21** The naming is given to the husband and also to the mother, so naming does not mark a father.','- **Matthew 1:18-25** Across the account the naming is shared, so the naming of the child marks no father.']).join('\n');
show('F abbreviation and range',sraSame(TF,'Matthew 1:20',M20,A20,''));
// G: ol already holds line 42
show('G already served',sraSame(T.split('\n').filter(l=>!/Naming is not the father's alone/.test(l)).join('\n'),'Matthew 1:20',M20,A20,L42));
// H: verse with odd forms
for(const v of ['Matthew 1:20 ','matthew 1:20','Matthew 1:20-21','(Matthew 1:20)',null,undefined,''])try{console.log('H',JSON.stringify(v),JSON.stringify(sraSame(T,v,M20,A20,'')).slice(0,90));}catch(e){console.log('H THROW',v,e.message);}
