const {am}=require('./g.cjs');
for(const s of am.summary){const c={};(s.cure||[]).forEach(x=>{const k=x.rule+'|'+x.status;c[k]=(c[k]||0)+1});console.log(s.seat,JSON.stringify(c));
 (s.cure||[]).filter(x=>!/^K-(S3|W)$/.test(x.rule)||x.status!=='CURED').forEach(x=>console.log('   ',x.rule,x.side,x.link,x.status,'::',(x.why||'').slice(0,260)));}
const t={};am.enforcer_log.forEach(x=>{const k=[x.seat,x.kind,x.rule,x.cure_status||'-',x.reply_error||'-'].join('|');t[k]=(t[k]||0)+1});
console.log(Object.entries(t).sort().map(([k,v])=>v+' '+k).join('\n'));
