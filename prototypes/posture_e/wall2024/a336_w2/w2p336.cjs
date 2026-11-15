// W2 extra plants for ASK 336 (M1-M5), same harness as p336.cjs: Citation Scan L2C tags() PRE (live s222) and POST (target_336), check() from target.
const fs=require('fs');const LD=require('./loadcs.cjs');const CK=require('../a329/l2c_load.cjs')('target_336.json');const PRE=LD('../rdf/fetchback_s222_333_335.json'),POST=LD('target_336.json');
const OD=JSON.parse(fs.readFileSync('data336.json'));
const A='[L1] Matthew 1:18 — "When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const B='[L1] Matthew 1:20 — "fear not to take unto thee Mary thy wife"';
const P={
 M1_two_L2_lines_one_para:'Footing exhibited:\n\n'+A+'\n\n'+B+'\n\n[L2] sunerchomai (G4905) means come together.\n[L2] prin (G4250) means before.',
 M2_two_L2_paras:'Footing exhibited:\n\n'+A+'\n\n'+B+'\n\n[L2] sunerchomai (G4905) means come together.\n\n[L2] prin (G4250) means before.',
 M3_bold_heads:'Footing exhibited:\n\n**[L1]** Matthew 1:18: "before they came together, she was found with child"\n\n**[L1]** Matthew 1:20: "fear not"\n\n**[L2]** *prin* (G4250) means before.',
 M4_L1_para_with_L3_second_line:'Footing exhibited:\n\n'+A+'\n[L3] 1 Corinthians 7:5 — "come together again"\n\n'+B+'\n\n[L2] sunerchomai (G4905).',
 M5_L2_not_para_start:'Footing exhibited:\n\n'+A+'\n\n'+B+'\n\nThe words: [L2] sunerchomai (G4905).',
};
for(const [k,t] of Object.entries(P)){const r=[];for(const [nm,V] of [['PRE',PRE],['POST',POST]]){const tg=V.tags([['DEFENDER','CR2',t]]).filter(x=>/G4905|G4250/.test(x.seg));
  for(const x of tg){const keys=new Set(x.verses);const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));const c=CK.check([x],ow,OD.lex,[...keys]);
  r.push(nm+': ['+x.seg.slice(0,30).replace(/\n/g,' ')+'] bound '+x.verses.join(', ')+' | '+c.map(z=>z.status+' ['+z.words.filter(w=>w.kind==='strongs').map(w=>w.w+(w.ok?'=':'!')).join(' ')+']').join(' '));}}
 console.log(k+'\n  '+r.join('\n  '));}
