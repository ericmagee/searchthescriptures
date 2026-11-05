// W3's synthetic cases S1 and S2, run against wpf.cjs unchanged: each replaces 32905 CR4 with one line.
const fs=require('fs');const {run}=require('./wpf.cjs');
const base=JSON.parse(fs.readFileSync('fixtures/32905.json','utf8'));
const cases={S1:['Matthew 1:19 shows Joseph as a man who knew her within the espousal.','NO FLAG'],S2:["Matthew 1:19 shows that Joseph knew the child was another's.",'FLAG']};
for(const [k,[line,exp]] of Object.entries(cases)){const r=run({...base,cr4:line});const got=r.flags.length?'FLAG':'NO FLAG';
 const c=[...r.flags,...r.near][0]||{};console.log(`${k} expected=${exp} got=${got} ${got===exp?'OK':'FAIL'} verse=[${c.sameVerse||''}] obj=[${c.object||''}] shared=[${c.shared||''}]`);}
