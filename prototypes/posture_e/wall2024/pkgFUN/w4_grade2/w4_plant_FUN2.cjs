const fs=require('fs');let L=fs.readFileSync(process.argv[2],'utf8').trim();
const m=L.match(/^\{const c0=(.*?);if\((.*)\)return res\('CURED'/);if(!m)throw new Error('shape');
const F=new Function('rp','const c0='+m[1]+';return !!('+m[2]+');');
const T=[
// correct answers: CURED
['COUNTED, but only from CR4 on, where D6 is given up.',1],['COUNTED, although the defender never used the word concede.',1],['COUNTED; yet the grant stands only for D6.',1],['COUNTED, except that C2 is untouched.',1],['COUNTED: D6 does not stand.',1],['COUNTED. The defender withdrew D6 in CR4.',1],['COUNTED: retracted the keystone.',1],['COUNTED, though the grant came late.',1],
['COUNTED: the defender no longer holds that Christ had a biological father.',1],['COUNTED: by this grant D6 is not true as declared.',1],
['COUNTED: D6 is no longer correct after the CR3 grant.',1],['COUNTED: the defender does not agree with its own D6 any more.',1],
['COUNTED: the grant means the keystone link is not accurate.',1],['COUNTED: the defender cannot keep D6.',1],['COUNTED: I do not dispute it.',1],
['COUNTED: the defender withdrew "closes the espousal to any knowing" in CR3.',1],['COUNTED: it is not a mere title; it is the grant of D6.',1],
['COUNTED: the challenger is right that D6 falls.',1],['COUNTED: the defender cannot hold D6 once Genesis 4:1 is the ordinary means.',1],
['COUNTED: that grant is a concession, though the defender did not label it.',1],['COUNTED: I could not count it before; it is counted now.',1],
['COUNTED: it is not wrong to count it.',1],['COUNTED: the defender says "I do not concede D6" in CR2 but grants it in CR4.',1],
// refusals: UNCURED
['COUNTED: That is not right.',0],['COUNTED: it should not be counted.',0],['COUNTED: this is not a concession.',0],['COUNTED: not as a concession.',0],['COUNTED: I do not agree.',0],
['COUNTED? No.',0],['COUNTED, but I disagree.',0],['COUNTED: I refuse to count it.',0],['COUNTED: wrong.',0],['COUNTED, but that is wrong.',0],['COUNTED (under protest).',0],
['COUNTED: that would be incorrect.',0],['COUNTED: it does not apply.',0],
// refusals outside the closed list (expected misses, stated limit)
['COUNTED: it is not.',0],['COUNTED: no.',0],['COUNTED: that cannot stand.',0],['COUNTED: I reject this.',0],
];let ok=0,miss=[];for(const [t,e] of T){const g=F(t)?1:0;console.log((g===e?'OK  ':'BAD ')+(g?'CURED  ':'UNCURED')+' '+t);if(g===e)ok++;}console.log(ok+'/'+T.length);
