const {r,out}=require('./x.cjs');
const sb=out('Send Back Build');const s=sb.find(x=>x.seat==='sol');const m=s.msg;
console.log(m.slice(0,3800));console.log('.....');
let i=m.indexOf('S4');console.log(m.slice(m.indexOf('\nS4')>0?m.indexOf('\nS4'):i, (m.indexOf('\nS4')>0?m.indexOf('\nS4'):i)+1500));
console.log('not_sent',JSON.stringify(sb.map(x=>[x.seat,x.sb_not_sent])).slice(0,1500));
