// krulRulings (K-RUL): the collision lines that need a ruling card. Case-sensitive grade words; STANDS/UNDERDETERMINED not read.
const {L,pairOf,lines}=require('./_util.cjs');
const fs=require('fs');const src=fs.readFileSync(L.SOURCE,'utf8');const fn=src.slice(src.indexOf('function krulRulings('));
const mm=fn.match(/let m=l\.match\((\/\^(?:\\\/|[^/\n])+\/[a-z]*)\)/);if(!mm)throw new Error('krulRulings collision regex not found');const RX=eval(mm[1]);
module.exports={name:'K-RUL: krulRulings collision',form:'COLLISION',scope:'line',read(l){const m=String(l).match(RX);return m?{form:'COLLISION',pair:pairOf(m[1],m[2]),grade:m[3]}:null;}};
