const fs=require('fs');const R=JSON.parse(fs.readFileSync('sim36212.json','utf8')).rounds;
const src=fs.readFileSync('lib179/D2B Build.js','utf8');const imp=src.slice(src.indexOf('const IMP='),src.indexOf('const BAR='));
const run=c=>new Function(c+';return IMP;')();
const a0="const ANS=/\\banswers?\\s+to\\b|";
const cand=imp.replace('\\bno\\s+(?:verse|row|text|word|witness)s?\\s+(?:states?','\\bno\\s+(?:verse|row|text|word|witness)s?\\s+(?:(?:that|which)\\s+)?(?:states?').replace(a0,a0+"\\bagainst\\s+[CD]\\d|");
const L=run(imp),C=run(cand);
for(const [k,key] of [['CR2','cr2'],['DR2','gr2']]){const o={[k]:R[key]};
 console.log(k,'live',L.harvest(o).map(h=>h.sentence.slice(0,90)),'cand',C.harvest(o).map(h=>h.sentence.slice(0,90)));}
