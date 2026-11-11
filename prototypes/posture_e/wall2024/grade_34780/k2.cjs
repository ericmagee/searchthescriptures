const {r,out}=require('./x.cjs');
const sb=out('Send Back Build');const s=sb.find(x=>x.seat==='sol');const m=s.msg;
const a=m.indexOf('ITEM S4');const b=m.indexOf('ITEM S6');const seg=m.slice(a,b);
const i=seg.indexOf('THE RULE');console.log(seg.slice(i,i+1800));console.log('=====S5 rule same?', seg.indexOf('ITEM S5'));
const e=m.indexOf('ITEM S13');console.log(m.slice(m.indexOf('\n\n',e+800)).slice(0,2500));
