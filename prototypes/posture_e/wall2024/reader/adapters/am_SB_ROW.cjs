// sbApply2024 SB_ROW: an OUT-OF-ROUND CONCESSIONS row (SIDE | [round] | sentence [-- tag]).
const {L}=require('./_util.cjs');
module.exports={name:'sbApply2024: SB_ROW',form:'OUT-OF-ROUND',scope:'line',read(l){const s=String(l).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();const m=s.match(L.SB_ROW);return m?{form:'OUT-OF-ROUND',side:m[1].toUpperCase(),round:m[2].toUpperCase(),sentence:m[3]}:null;}};
