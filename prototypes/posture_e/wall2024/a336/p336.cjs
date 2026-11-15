// ASK 336 plants P1-P6 (W2 7013), through Citation Scan's L2C tags() and check() PRE and POST.
const fs=require('fs');const LD=require('./loadcs.cjs');const CK=require('../a329/l2c_load.cjs')('target_336.json');const PRE=LD('../rdf/fetchback_s222_333_335.json'),POST=LD('target_336.json');
const OD=JSON.parse(fs.readFileSync('data336.json'));
const L1a='[L1] Matthew 1:18 — "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost."';
const L1b='[L1] Matthew 1:20 — "But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream..."';
const L2x='[L2] standing in these rows: sunerchomai (G4905), prin (G4250), heuriskō (G2147), gastēr (G1064).';
const P={
 P1:'**PREMISE 1**\n\nFooting exhibited:\n\n'+L1a+'\n\n'+L1b+'\n\n'+L2x,
 P2:'Footing exhibited:\n\n'+L1a+'\n\n[L3] 1 Corinthians 7:5 — "come together again"\n\n'+L1b+'\n\n'+L2x,
 P2b:'Footing exhibited:\n\n'+L1a+'\n\n'+L1b+'\n\n[L3] 1 Corinthians 7:5 — "come together again"\n\n'+L2x,
 P3:L1a+'\n\n## Heading\n\n'+L1b+'\n\n'+L2x,
 P4:'Footing exhibited:\n\n'+L1a+'\n\n'+L1b+'\n\n[L2] standing in these rows: parthenos (G3933).',
 P5:'Footing exhibited:\n\n[L1] Isaiah 7:14 — "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive"\n\n[L1] Matthew 1:23 — "Behold, a virgin shall be with child"\n\n[L2] standing in these rows: parthenos (G3933), almah (H5959).',
 P5b:'Footing exhibited:\n\n[L1] Isaiah 7:14 — "Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive"\n\n[L1] Matthew 1:23 — "Behold, a virgin shall be with child"\n\n[L2] standing in these rows: harah (H2029), G2029.',
 P6:'Footing exhibited:\n\n'+L1a+'\n\n'+L1b+'\n\n[L2] in Matthew 1:20: sunerchomai (G4905), prin (G4250).'};
for(const [k,t] of Object.entries(P)){const r=[];for(const [nm,V] of [['PRE',PRE],['POST',POST]]){const tg=V.tags([['DEFENDER','CR2',t]]).filter(x=>/standing|in Matthew 1:20:/.test(x.seg));const keys=new Set(tg.flatMap(x=>x.verses));
  const ow=OD.ow.filter(w=>keys.has(w.book+' '+w.chapter+':'+w.verse));const lex=OD.lex;const c=CK.check(tg,ow,lex,[...keys]);
  r.push(nm+': bound '+(tg[0]?tg[0].verses.join(', '):'none')+' | '+c.map(x=>x.status+' ['+x.words.filter(w=>w.kind==='strongs').map(w=>w.w+(w.ok?'=':'!')).join(' ')+']').join(' '));}
 console.log(k+'\n  '+r.join('\n  '));}
