// KF_LINE (shared library, K-F reader and sbApply forced_add): the strict FORCED form, case-insensitive. Line is stripped of *_` as kfLines does.
const {L,pairOf}=require('./_util.cjs');
module.exports={name:'shared library: KF_LINE',form:'FORCED',scope:'line',read(l){
 const s=String(l).replace(/\\n/g,'\n').replace(/[*_`]+/g,'');const m=s.match(L.KF_LINE);if(!m)return null;const p=m[1].match(/(D\d+)\s+vs\.?\s+(C\d+)/i);
 return {form:'FORCED',pair:pairOf(p[1],p[2]),meansRound:m[2].toUpperCase(),means:m[3],answerRound:m[4].toUpperCase(),answer:m[5],fails:m[6]};}};
