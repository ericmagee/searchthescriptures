// W3 v2 (rev 3, the trigger carried at 7406 item 2): per counted panel judge and side, fires when that side's conceded count is 0
// and the PRESSED-WITNESS LEDGER sent to the judges marks a verse of a premise listed against that side NOT NAMED.
// Counts are read from each judge's header lines ("N links conceded"); the ledger from the first sent text. Reads the report only.
const md=require('fs').readFileSync(process.argv[2],'utf8');
const i=md.indexOf('AGAINST THE DEFENDER, answered in [CR3]:');const j=md.indexOf('AGAINST THE CHALLENGER, answered in [DR3]:',i);const k=md.indexOf('A verse marked NOT NAMED',j);
const nn=s=>s.split('\n').filter(l=>/^premise \d+/.test(l)&&!/NOT NAMED: none\s*$/.test(l)).length;
const L={DEFENDER:i<0?0:nn(md.slice(i,j)),CHALLENGER:j<0?0:nn(md.slice(j,k))};
const judges=[...md.matchAll(/^## Panel judge \d+: (\w+) [^\n]*\n[\s\S]*?\*\*Defense standing:\*\* [A-Z-]+, (\d+) links? conceded[\s\S]*?\*\*Challenge standing:\*\* [A-Z-]+, (\d+) links? conceded/gm)].map(m=>({j:m[1],d:+m[2],c:+m[3]}));
console.log('ledger premises with a NOT NAMED verse: defender',L.DEFENDER,'challenger',L.CHALLENGER);let f=0;
for(const x of judges){const fd=x.d===0&&L.DEFENDER>0,fc=x.c===0&&L.CHALLENGER>0;if(fd||fc)f++;console.log(x.j,'defender count',x.d,fd?'FIRES':'silent','| challenger count',x.c,fc?'FIRES':'silent');}
console.log('W3 fired on',f);
