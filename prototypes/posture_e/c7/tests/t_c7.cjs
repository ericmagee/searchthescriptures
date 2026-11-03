const fs=require('fs');const file=process.argv[2];const c=fs.readFileSync(file,'utf8');
const a=c.indexOf('const POSTURE=(()=>{');const b=c.indexOf(' // the reply envelope of a chat call',a);
const body=c.slice(a+'const POSTURE=(()=>{'.length,b)+'\nreturn {HEADS,check,PROMPT};';
const P=new Function(body)();
const h=P.HEADS;console.log('headings',h.length,'| last:',h[h.length-1]);
const reply=n=>h.slice(0,n).map(x=>x+'\nI hold to this.').join('\n')+'\nI ACCEPT THIS POSTURE AND WILL BE HELD TO IT.';
const r7=P.check(reply(7)),r6=P.check(reply(6));console.log('7-heading reply:',r7.status,r7.faults.join('; ')||'');console.log('6-heading reply:',r6.status,r6.faults.join('; ')||'');
const ok=h.length===7&&r7.status==='ACCEPT'&&r6.status==='FAULT'&&/heading 7 missing/.test(r6.faults.join(';'))&&P.PROMPT.includes('Commitment 7. I judge; I do not only count.');
console.log(ok?'PASS':'FAIL');
