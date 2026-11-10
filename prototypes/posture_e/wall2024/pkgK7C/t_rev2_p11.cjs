// W2 rev 2 check: what P11 K-G4 on D6 reads, and haiku keeping its own line (RETRACTED D6 removed)
const {cmp,srcs}=require('./w3_grade/h.cjs');const H=srcs.haiku;
const show=(a,b)=>{for(const [n,r] of [['live',a],['rev2',b]])console.log('   '+n,JSON.stringify(r.v.filter(x=>/^D6\b/.test(String(x.link))).map(x=>[x.rule,x.link,x.status,String(x.why).slice(0,140)])))};
cmp('P11 rule K-G4 on D6',H,null,(items)=>{const x=items.find(x=>x.rule==='K-G7');x.rule='K-G4'},show);
cmp('H1 haiku keeps its lines: RETRACTED on D6 removed',H,null,(items,reply)=>{const n=reply.text.split('\n').length;reply.text=reply.text.split('\n').filter(l=>!/^RETRACTED:\s*D6\b/.test(l)).join('\n');console.log('   removed lines:',n-reply.text.split('\n').length)},show);
