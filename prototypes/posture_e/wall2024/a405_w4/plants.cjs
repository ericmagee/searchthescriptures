// ASK 405 and ASK 406 plants: synthetic rounds through the replayed live chain, live 4435dd09 against t405 / t406.
const fs=require('fs');const {replay,save}=require('./chain.cjs');
const live=JSON.parse(fs.readFileSync('../rdf/fetchback_w407.json')),T5=JSON.parse(fs.readFileSync('t405.json')),T6=JSON.parse(fs.readFileSync('../a406/t406.json'));
const deb=txt=>({run_token:'PLANT',claude_r1:txt,engine_r1:'The record stands. [L1] (Matthew 1:18)',claude_r2:'x',engine_r2:'x'});
const P5=[
 ['A G pair whose word spells a row of a bound Old Testament verse (W1 8723)','"In the beginning God created the heaven and the earth." [L1] (Genesis 1:1) "That which is born of the flesh is flesh." [L1] (John 3:6)\nThe verb is bara (G1254), to create [L2]'],
 ['Both spans hold tag words (W2 8724): reads as today','"That which is born of the flesh is flesh." [L1] (John 3:6)\n"Of" is ek (G1537), out of [L2] and sarx (G4561) "flesh".'],
 ['A pair that is one row in a bound verse passes','"And knew her not till she had brought forth her firstborn son" [L1] (Matthew 1:25)\n"Knew" is *ginosko* (G1097), to know [L2]'],
 ['First [L2] preceded only by another [L] mark with no tag word between (limit, W1 8723 A3): reads as today','"That which is born of the flesh is flesh." [L1] (John 3:6)\n"Of" is ek (G1537) [L1] [L2] out of, from'],
 ['Mark after its claim, two marks on one line (8722 A2b form)','"Thou shalt not let thy cattle gender with a diverse kind" [L1] (Leviticus 19:19)\n"Gender" is raba (H7250), to lie down [L2]; "diverse kind" is kilayim (H3610), two kinds [L2]'],

 ['rev 3 (a): phobeomai (G5399) bound to Matthew 1:20 passes','"But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife" [L1] (Matthew 1:20)\n"Fear not" is *phobeomai* (G5399) [L2] in the angel\'s word.'],
 ['rev 3 (b): an English word before the number passes','"That which is born of the flesh is flesh." [L1] (John 3:6)\nThe numeral (G1520) does not stand here; "flesh" is sarx (G4561) [L2].'],
 ['rev 3 (c): ek (G1536) where the verse holds ek as G1537 fails and names both numbers','"That which is born of the flesh is flesh." [L1] (John 3:6)\n"Of" is ek (G1536), out of [L2] in this verse.'],
];
for(const [name,txt] of P5){const r=deb(txt);const A=replay(live,r)['L2 Count Plan'][0].json,B=replay(T5,r)['L2 Count Plan'][0].json;const o=B.l2_t405;const same=JSON.stringify({...A})===JSON.stringify((({l2_t405,...x})=>x)(B));
 console.log('== 405 PLANT: '+name+'\n  live output unchanged: '+same+' | '+JSON.stringify(o.n)+(o.error?' ERROR '+o.error:''));o.changes.forEach(c=>console.log('  CHANGE '+c.round+' '+c.from+' -> '+c.to+' (today: '+(c.was||'none')+'; re-read: '+(c.now||'none')+')'));o.pairs.forEach(p=>console.log('  PAIR NOT ONE ENTRY '+p.word+' ('+p.num+', stands as '+p.as+') in '+p.verses+' -- '+p.why));}
const P6=[
 ['word (Gnnnn), meaning "gloss"','"That which is born of the flesh is flesh." [L1] (John 3:6)\n[L2] "Flesh" is sarx (G4561), meaning "the body, the meat".'],
 ['word (Gnnnn), "gloss"','"That which is born of the flesh is flesh." [L1] (John 3:6)\n[L2] "Flesh" is sarx (G4561), "the body, the meat".'],
 ['word (Gnnnn): "gloss"','"That which is born of the flesh is flesh." [L1] (John 3:6)\n[L2] "Flesh" is sarx (G4561): "the body, the meat".'],
 ['word Gnnnn "gloss", no parentheses','"That which is born of the flesh is flesh." [L1] (John 3:6)\n[L2] "Flesh" is sarx G4561 "the body, the meat".'],
 ['a parenthesis inside the quoted gloss','"And knew her not till she had brought forth her firstborn son" [L1] (Matthew 1:25)\n[L2] "Knew" is ginosko (G1097), "to know (absolutely), to perceive".'],
 ['today\'s form word (Gnnnn, gloss) is unchanged','"That which is born of the flesh is flesh." [L1] (John 3:6)\n[L2] "Flesh" is sarx (G4561, the body, the meat).'],
 ['a quote that does not follow at once is not read','"That which is born of the flesh is flesh." [L1] (John 3:6)\n[L2] "Flesh" is sarx (G4561) in the verse, as "the body, the meat" shows.'],
];
for(const [name,txt] of P6){const r=deb(txt);const MA=replay(live,r),MB=replay(T6,r);const ga=MA['L2 Gloss Plan'][0].json,gb=MB['L2 Gloss Plan'][0].json;
 const ea=(MA['L2 Count Plan'][0].json.e340||{}).gloss||[],eb=(MB['L2 Count Plan'][0].json.e340||{}).gloss||[];
 const tagsSame=JSON.stringify(MA['L2 Count Plan'][0].json.tags)===JSON.stringify(MB['L2 Count Plan'][0].json.tags);
 console.log('== 406 PLANT: '+name+'\n  tags unchanged: '+tagsSame+' | live glosses: '+(ga.none?0:ga.meta.gloss.length)+' | target glosses: '+(gb.none?0:gb.meta.gloss.length)+' (new form '+(gb.none?0:gb.meta.n406)+')');
 (gb.none?[]:gb.meta.gloss).forEach(g=>console.log('  GLOSS '+g.word+' '+g.nums.join(',')+' parts: '+g.parts.join(' | ')));eb.forEach(x=>console.log('  E340 '+x.num+' "'+x.part+'" '+x.status));}
save();
