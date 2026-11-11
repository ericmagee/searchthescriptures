const {body,am,out}=require('./g.cjs');const L=am.enforcer_log;const gr=out('Gate Record')[0];
const DEF=/\b(?:under|at|in|see)\s+(?:LINK|premise)\s+\d|answered\s+(?:at|under|in)\b|answer it fully|pointer|defers/i;
const rows=L.filter(x=>x.kind==='enforcer_check'&&/^E-(ANS|HOLD)$/.test(x.rule));
const dis=rows.filter(x=>/DISAGREE/.test(JSON.stringify([x.response_line,x.cure_reason,x.cure_status])));
console.log('E-ANS/E-HOLD rows',rows.length,'disagree',dis.length);
dis.forEach(x=>console.log(x.seat,x.rule,x.item,'| DEFERRAL:',DEF.test((x.response_line||'')+(x.cure_reason||'')),'|',((x.response_line||x.cure_reason||'')).slice(0,300)));
console.log('sb_items with deferral words:',gr.sb_items.filter(x=>/^E-(ANS|HOLD)$/.test(x.rule)&&DEF.test(x.reason||'')).map(x=>x.seat+' '+x.sid+' '+x.item+' :: '+(x.reason||'').slice(0,260)));
const jr=out('Judge Contradiction Record')[0].jcc_log[0].prompt_sent;console.log('supporting verse only in rounds:',jr.split('It is a supporting verse only.').length-1);
// chain marks
for(let i=0;i<3;i++){const {p,t}=body(i);t.split('\n').filter(l=>/CHAIN MARK/.test(l)&&!/AUDIT/.test(l)).forEach(l=>console.log(p.judge_seat,l.slice(0,230)));}
// QR
for(const n of ['QR Ask Build','QR Check','QR Final','QR Answer','QR Merge']){const o=out(n);console.log('==',n,o?o.length:'none',o?Object.keys(o[0]).join(',').slice(0,300):'');}
