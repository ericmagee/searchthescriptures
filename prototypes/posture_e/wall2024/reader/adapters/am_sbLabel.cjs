// sbLabel (shared library): the label a send-back/gate change is matched by. Case-insensitive.
const {L}=require('./_util.cjs');
module.exports={name:'shared library: sbLabel',form:'COLLISION|KEYSTONE|CONCEDED|STANDING|CLAUSE',scope:'line',read(l){
 const k=L.sbLabel(l);if(!k)return null;const m=k.match(/^(D\d+) VS (C\d+)$/);
 if(m)return {form:'COLLISION',pair:m[1]+' vs '+m[2]};
 if(k==='KEYSTONE'||k==='CLAUSE')return {form:k};
 if(/STANDING/.test(k))return {form:'STANDING',side:k.startsWith('DEFENSE')?'DEFENSE':'CHALLENGE'};
 return {form:'CONCEDED',side:k.startsWith('CHALLENGER')?'CHALLENGER':'DEFENDER'};}};
