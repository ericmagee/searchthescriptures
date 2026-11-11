const K=JSON.parse(require('fs').readFileSync('keep.json','utf8'));const am=K['Alternate Merge'][0];const L=am.enforcer_log;const T=(s,n)=>String(s==null?'':s).replace(/\s+/g,' ').slice(0,n);
const want=process.argv[2].split(',');const [seat,kind,rule,st]=want;
for(const r of L){if(r.seat!==seat||r.kind!==kind||(rule&&r.rule!==rule)||(st&&r.cure_status!==st))continue;
 console.log('###',r.seat,r.rule,r.cure_status,'| item:',T(r.item,200),'\n FLAGGED:',T(r.flagged_line,+process.argv[3]||900),'\n RESPONSE:',T(r.response_line,+process.argv[3]||900),'\n REASON:',T(r.cure_reason,700));}
