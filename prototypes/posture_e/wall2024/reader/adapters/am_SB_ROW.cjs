// sbApply2024 SB_ROW: an OUT-OF-ROUND CONCESSIONS row (SIDE | [round] | sentence [-- tag]).
const {L}=require('./_util.cjs');
module.exports={name:'sbApply2024: SB_ROW',form:'OUT-OF-ROUND',scope:'line',read(l){const s=String(l).replace(/\\+/g,'').replace(/[*_`]+/g,'').replace(/\s+/g,' ').trim();const m=s.match(L.SB_ROW);if(!m)return null;const k=m[3].match(/["\u201c][^"\u201d]+["\u201d]/); /* live sbApply rq() (pkgGK c): the row's first quoted span, else the text before a TOUCHES NO LINK / COUNTED tag */
 return {form:'OUT-OF-ROUND',side:m[1].toUpperCase(),round:m[2].toUpperCase(),sentence:k?k[0]:m[3].replace(/\s+(?:TOUCHES NO LINK|COUNTED)\b[\s\S]*$/i,'').trim()};}};
