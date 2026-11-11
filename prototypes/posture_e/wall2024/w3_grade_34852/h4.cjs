const K=JSON.parse(require('fs').readFileSync('keep.json','utf8'));const T=(s,n)=>String(s==null?'':s).replace(/\s+/g,' ').slice(0,n);
const am=K['Alternate Merge'][0];const L=am.enforcer_log;
for(const r of L){if(r.seat!=='haiku'||r.cure_status!=='UNCURED')continue;console.log('###',r.kind,r.rule,'|',T(r.item,160),'\n FL:',T(r.flagged_line,500),'\n RE:',T(r.response_line,500),'\n WHY:',T(r.cure_reason,200),'...',T(String(r.cure_reason||'').slice(-350),350));}
const d=K['Derive Outcome'][0];console.log(JSON.stringify(d).slice(0,5000));
