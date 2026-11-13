const fs=require('fs');
const L=fs.readFileSync('lib189.txt','utf8').split('\n').find(l=>l.includes('const OPEN='));
const src=L.slice(L.indexOf('const OPEN=')+11, L.lastIndexOf(';'));
const A='|both\\s+readings|';
const B='|both\\s+readings|both\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){1,6}and\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,6}(?:readings?|senses?|meanings?|uses?)\\b|(?:two|rival|competing)\\s+(?:(?!--)[^\\s.;:,!?()—–]+\\s+){0,2}(?:readings|senses|meanings)|';
const OLD=eval(src), NEW=eval(src.replace(A,B));
console.log('anchor once:', src.split(A).length===2);
const P=[
['T luna D5','D5 vs C5 (Luke 3:23): UNDERDETERMINED -- the record gives both a mistaken-supposition use and a household-usage reading of the sonship -- GROUND: [L1] Luke 3:23 "being (as was supposed) the son of Joseph."'],
['T two readings stand','UNDERDETERMINED -- the rows sustain two competing readings of the verb'],
['F one side wins (both..and..reading)','UNDERDETERMINED -- both the verse and the context support the challenger\'s reading'],
['F of the two readings only one fits','UNDERDETERMINED -- of the two readings, only the defender\'s fits the verse'],
['F rival readings rejected','UNDERDETERMINED -- the rival readings are both refuted by Matthew 1:18'],
['F both ... and ... use (single use)','UNDERDETERMINED -- both Luke and Acts use the verb in its usage sense'],
['F dash boundary','UNDERDETERMINED -- both -- and a reading'],
['F no open','UNDERDETERMINED -- the challenger is right'],
];
for(const [n,l] of P)console.log((OLD.test(l)?'old PASS':'old fail').padEnd(9),(NEW.test(l)?'new PASS':'new fail').padEnd(9),n);
