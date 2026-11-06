// sbApply2024 pkgCP2 GR: a collision line with a grade (case-sensitive grade words, colon required). Returns {form, grade} or null.
const {L}=require('./_util.cjs');
module.exports={name:'sbApply2024: GR (pkgCP2)',form:'COLLISION',scope:'line',read(l){const m=String(l).match(L.GR);if(!m)return null;
 const g=String(l).slice(0,m[0].length).match(/(DEFENDER LINK BROKEN|CHALLENGER LINK BROKEN|UNDERDETERMINED|STANDS|WITHDRAWN)$/);return {form:'COLLISION',grade:g?g[1]:null};}};
