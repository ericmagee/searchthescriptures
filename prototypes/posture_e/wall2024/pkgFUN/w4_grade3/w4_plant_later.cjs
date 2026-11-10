const fs=require('fs');let L=fs.readFileSync(process.argv[2],'utf8').trim();
const m=L.match(/^\{const c0=(.*?);if\((.*)\)return res\('CURED'/s);if(!m)throw new Error('shape');
const F=new Function('rp','const c0='+m[1]+';return !!('+m[2]+');');
const T=[['COUNTED. The defender said in CR2 that it was not right to count D6, but CR4 grants it.',1],['COUNTED. In CR2 the defender wrote "this is not a concession"; CR4 grants it.',1],
['COUNTED. The challenger was right: D6 falls.',1],['COUNTED. It applies to D6 only.',1],['COUNTED. Withdrawn by the defender in CR4.',1],['COUNTED. The defender retracted the keystone.',1],
['COUNTED. That is not right.',0],['COUNTED. I withdraw the count.',0],['COUNTED. On reflection, I reverse this.',0],['COUNTED. Strike that.',0],['COUNTED. Not accepted.',0],['COUNTED. This was never a concession.',0]];
let ok=0;for(const [t,e] of T){const g=F(t)?1:0;console.log((g===e?'OK  ':'DIFF')+' '+(g?'CURED  ':'UNCURED')+' '+t);if(g===e)ok++;}console.log(ok+'/'+T.length);
