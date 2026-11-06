// sbApply2024 keyChecks (Rule 0): the KEYSTONE line as rcLines found it (first only), read with the inline regex.
const {L,lines,nOf}=require('./_util.cjs');
module.exports={name:'sbApply2024: keyChecks KEYSTONE',form:'KEYSTONE',scope:'text',read(raw){
 const ls=lines(raw);const P=L.rcLines(ls.join('\n'));if(!P.key)return [];const m=P.key.u.match(L.KEY_RX);
 return [{n:nOf(ls,P.key.raw),fields:m?{form:'KEYSTONE',link:m[1],grade:m[2]}:null}];}};
