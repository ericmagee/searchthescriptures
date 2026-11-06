// sbApply2024 pkgCP PR/FR: the pair of a collision or FORCED line (case-insensitive).
const {L,pairOf}=require('./_util.cjs');
module.exports={name:'sbApply2024: PR/FR (pkgCP)',form:'COLLISION|FORCED',scope:'line',read(l){const s=String(l);const m=s.match(L.PR);if(!m)return null;return {form:L.FR.test(s)?'FORCED':'COLLISION',pair:pairOf(m[1],m[2])};}};
