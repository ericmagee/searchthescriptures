const {out}=require('./x.cjs');
const f=out('QR Final');f.forEach((x,i)=>{console.log(i,x.judge,x.side,x.round,'| Q:',(x.quote||'').slice(0,140),'| EARLIER',x.earlier_round,(x.earlier_quote||'').slice(0,140),'| QUESTION:',(x.question||'').slice(0,260));});
const c=f.findIndex(x=>x.earlier_quote);if(c>=0){const b=f[c].body;const m=b.messages?b.messages[b.messages.length-1].content:JSON.stringify(b);console.log('--- ASK TAIL',String(m).slice(-1300));}
const qm=out('QR Merge')[0];const i=qm.qa_text.indexOf('CONTRADICTION QUESTION');console.log('--- QA',qm.qa_text.slice(i,i+1800));
const qc=out('QR Check');qc.forEach(x=>console.log('CHECK',x.seat,JSON.stringify(x.faults).slice(0,300),x.retry,x.why));
