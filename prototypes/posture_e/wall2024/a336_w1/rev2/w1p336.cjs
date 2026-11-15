// W1 independent plants for ASK 336: PRE = fresh live s222 readback, POST = target_336.json
const fs=require('fs');const LD=require('../a336/loadcs.cjs');
const PREP=process.argv[2];const PRE=LD(PREP),POST=LD(process.argv[3]);
const CK=require('../a329/l2c_load.cjs')(process.argv[3]);
const OD=JSON.parse(fs.readFileSync('../a336/data336.json'));
const a='[L1] Matthew 1:18 — "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const b='[L1] Matthew 1:20 — "But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream."';
const l2='[L2] standing in these rows: sunerchomai (G4905), prin (G4250), heuriskō (G2147), gastēr (G1064).';
const R=JSON.parse(fs.readFileSync('../a336/r37510.json'))[0];
const P={
 W7_stored37510_CR2:R.claude_r2,
 W8_bold_heads:'Footing exhibited:\n\n**[L1]** Matthew 1:18 — "Now the birth"\n\n[L1] **Matthew 1:20** — "But while he thought"\n\n'+l2,
 W9_bold_premise_line_stops:'**LISTED PREMISE 1 — LINK 2 ("x"): SUPPORTED.**\n\n'+a+'\n\n**Second premise head**\n\n'+b+'\n\n'+l2,
 W10_inside_LINK_block:'LINK 2: the stated source\n'+a+'\n'+b+'\n'+l2,
 W11_press_line:'PRESSED WITH:\nMatthew 1:20 "But while he thought" -- MEANS: m -- [L2] gennao (G1080) | PROVEN IN [DR1]',
 W12_pipe_form:'Footing exhibited:\n\n'+a+'\n\n'+b+'\n\n[L2] sunerchomai (G4905) | [L3] 1 Corinthians 7:5 "come together again"',
 W13_one_paragraph:'Footing exhibited:\n\n'+a+'\n'+b+'\n\n'+l2,
 W14_list_names_ref_inline:'Footing exhibited:\n\n'+a+'\n\n'+b+'\n\n[L2] standing in these rows (as Luke 1:35 also has it): sunerchomai (G4905).',
 W15_L4_between:'Footing exhibited:\n\n'+a+'\n\n[L4] an inference\n\n'+b+'\n\n'+l2,
 W16_list_mid_paragraph:'Footing exhibited:\n\n'+a+'\n\n'+b+'\nSee these words. [L2] standing in these rows: sunerchomai (G4905).'
};
for(const [k,t] of Object.entries(P)){console.log(k);for(const [nm,V] of [['PRE',PRE],['POST',POST]]){const tg=V.tags([['DEFENDER','CR2',t]]);
 const keys=new Set(tg.flatMap(x=>x.verses));const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));let c=[];try{c=CK.check(tg,ow,OD.lex,[...keys]);}catch(e){c=tg.map(()=>({status:'?',words:[]}));}
 console.log('  '+nm+': '+tg.map((x,j)=>'['+x.verses.join(', ')+'] '+(c[j]?c[j].status:'')+' '+(c[j]?c[j].words.filter(w=>w.kind==='strongs').map(w=>w.w+(w.ok?'=':'!')).join(' '):'')).join(' || '));}}
// rev 2 extra: M1 shape and a mixed paragraph
{const Q={W17_two_L2_lines:'Footing exhibited:\n\n'+a+'\n\n'+b+'\n\n[L2] sunerchomai (G4905)\n[L2] prin (G4250)',
 W18_text_line_then_L2:'Footing exhibited:\n\n'+a+'\n\n'+b+'\n\nThese words stand:\n[L2] sunerchomai (G4905)'};
for(const [k,t] of Object.entries(Q)){console.log(k);for(const [nm,V] of [['PRE',PRE],['POST',POST]])console.log('  '+nm+': '+V.tags([['DEFENDER','CR2',t]]).map(x=>'['+x.verses.join(', ')+']').join(' || '));}}
