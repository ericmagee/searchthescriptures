// kagRow (K-AG): an ANSWER CHECK row: verse, round label, ANSWER NONE, grade word after the answer (upper-cased).
const {L}=require('./_util.cjs');
module.exports={name:'K-AG: kagRow',form:'ANSWER CHECK',scope:'line',read(l){const r=L.kagRow(l);return r?{form:'ANSWER CHECK',verse:r.verse,round:r.rk,none:r.none,grade:r.grade||null}:null;}};
