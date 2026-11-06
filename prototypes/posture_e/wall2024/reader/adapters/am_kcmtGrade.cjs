// K-CMT kcmtGrade2024: whether a line carries a grade word that needs a (Commitment N) tag. Case-sensitive upper-case words.
const {L}=require('./_util.cjs');
module.exports={name:'K-CMT: kcmtGrade2024',form:'ANY',scope:'line',read(l){return L.kcmtGrade2024(String(l))?{graded:true}:null;}};
