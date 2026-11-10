const fs=require('fs');let L=fs.readFileSync(process.argv[2],'utf8').trim();
// turn "{const c0=...;if(COND)return res(...);} /* ..." into a predicate
const m=L.match(/^\{const c0=(.*?);if\((.*)\)return res\('CURED'/);if(!m)throw new Error('shape');
const F=new Function('rp','const c0='+m[1]+';return !!('+m[2]+');');
const T=[
['COUNTED: D6 does not stand.',1],['COUNTED. The defender withdrew D6 in CR4.',1],['COUNTED: retracted the keystone.',1],['COUNTED, though the grant came late.',1],
['COUNTED: the defender no longer holds that Christ had a biological father.',1],['COUNTED: by this grant D6 is not true as declared.',1],
['COUNTED: D6 is no longer correct after the CR3 grant.',1],['COUNTED: the defender does not agree with its own D6 any more.',1],
['COUNTED: the grant means the keystone link is not accurate.',1],['COUNTED: the defender cannot keep D6.',1],['COUNTED: I do not dispute it.',1],
['COUNTED: That is not right.',0],['COUNTED: it should not be counted.',0],['COUNTED: this is not a concession.',0],['COUNTED: not as a concession.',0],['COUNTED: I do not agree.',0],
['COUNTED? No.',0],['COUNTED, but I disagree.',0],['COUNTED: I refuse to count it.',0],['COUNTED: wrong.',0],['COUNTED: it is not.',0],
];let ok=0;for(const [t,e] of T){const g=F(t)?1:0;console.log((g===e?'OK  ':'BAD ')+(g?'CURED  ':'UNCURED')+' '+t);if(g===e)ok++;}console.log(ok+'/'+T.length);
