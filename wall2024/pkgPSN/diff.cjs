const o=require('./old.js'),n=require('./new.js');const L=require('./lines.json');let d1=0,d2=0;const out=[];
for(const x of L){for(const [k,a,b] of [['P1',o.P1,n.P1],['P2',o.P2,n.P2]]){const A=JSON.stringify(a(x.l)),B=JSON.stringify(b(x.l));if(A!==B){k==='P1'?d1++:d2++;out.push(x.id+' '+x.judge_seat+' '+k+'\n  old '+A+'\n  new '+B+'\n  '+x.l.slice(0,260));}}}
console.log('lines',L.length,'P1 differs',d1,'P2 differs',d2);console.log(out.join('\n'));
