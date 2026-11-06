// selfLines421 (B7 self-contradiction): its ANSWER CHECK regex (case-sensitive; MEETS/MISSES/FAILS; round in [CRn]/[DRn]).
const {L}=require('./_util.cjs');
const s=String(L.selfLines421);const m=s.match(/raw\.trim\(\)\.match\((\/\^(?:\\\/|[^/\n])+\/[a-z]*)\)/);if(!m)throw new Error('selfLines421 AC regex not found');const RX=eval(m[1]);
module.exports={name:'selfLines421: ANSWER CHECK',form:'ANSWER CHECK',scope:'line',read(l){const t=String(l).replace(/\\"/g,'"').replace(/[*_`]+/g,'').trim();const r=t.match(RX);return r?{form:'ANSWER CHECK',verse:r[1].replace(/\s+/g,' '),grade:r[3]} /* the round is read only as its side (CR/DR), so it is not compared */:null;}};
