const LD=require('../a336/loadcs.cjs');const S={pre:LD('../rdf/fetchback_s226_341.json'),post:LD('../a342/target_342.json')};
const H1='[L1] Matthew 1:18 "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const H1b='[L1] Matthew 1:24 "Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:"';
const HL='[L1] Luke 1:35 "The Holy Ghost shall come upon thee"';
const HC='[L1] Matthew 2:11 "they saw the young child with Mary his mother"';
const P=[
 ['Q1 (1:24)',[H1],'[L2] *synelthein* (G4905) is answered by *parelabe* (G3880) (1:24).'],
 ['Q2 v. 24',[H1],'[L2] *synelthein* (G4905) is answered by *parelabe* (G3880) in v. 24.'],
 ['Q3 verse 24',[H1],'[L2] *synelthein* (G4905) is answered by *parelabe* (G3880) in verse 24.'],
 ['Q4 vv. 18-24',[H1],'[L2] *synelthein* (G4905) and *parelabe* (G3880) stand in vv. 18-24.'],
 ['Q5 count H5959',[H1],'[L2] *synelthein* (G4905), count H5959: 7 verses, no reference.'],
 ['Q6 two books, 1:24',[H1,HL],'[L2] *synelthein* (G4905) is answered by *parelabe* (G3880) at 1:24.'],
 ['Q7 two chapters, v. 24',[H1,HC],'[L2] *synelthein* (G4905) is answered by *parelabe* (G3880) in v. 24.'],
 ['Q8 bad verse 1:95',[H1],'[L2] *synelthein* (G4905) at 1:95.'],
 ['Q9 no own ref (336 today)',[H1],'[L2] *synelthein* (G4905, "to come together").'],
 ['Q10 1:18 and 1:24',[H1,H1b],'[L2] *synelthein* (G4905) at 1:18 and *parelabe* (G3880) at 1:24.'],
 ['Q11 7 verses only',[H1],'[L2] *synelthein* (G4905) occurs in 7 verses.'],
];
for(const [nm,hs,l2] of P){const t=hs.join('\n\n')+'\n\n'+l2+'\n';const ra=[['CHALLENGER','DR1',t]];
 const f=V=>V.tags(ra).filter(x=>/G4905|synelthein/.test(JSON.stringify(x))).map(x=>x.verses.join(', ')).join(' | ');
 console.log(nm.padEnd(26),'PRE ['+f(S.pre)+']  POST ['+f(S.post)+']');}
