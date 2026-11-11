const {am}=require('./g.cjs');const L=am.enforcer_log;
const pr=(x,W)=>console.log(JSON.stringify({seat:x.seat,rule:x.rule,item:x.item,cs:x.cure_status,line:(x.flagged_line||'').slice(0,W),resp:(x.response_line||'').slice(0,W),why:(x.cure_reason||'').slice(0,W)}));
console.log('## UNCURED send_back');L.filter(x=>x.kind==='send_back'&&x.cure_status==='UNCURED').forEach(x=>pr(x,330));
console.log('## E-OOR send_back');L.filter(x=>x.kind==='send_back'&&x.rule==='E-OOR').forEach(x=>pr(x,300));
console.log('## single');L.filter(x=>x.seat==='single').forEach(x=>pr(x,300));
console.log('## E-APPLY/K-RECHK no status');L.filter(x=>x.kind==='send_back'&&/E-APPLY|K-RECHK|K-S3/.test(x.rule)&&!x.cure_status).forEach(x=>pr(x,300));
