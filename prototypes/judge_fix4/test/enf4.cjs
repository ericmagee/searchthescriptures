// Every enforcer-log row of 32255 and 32266 re-checked on the seat's own stored full reply: stored status and reason -> new status and reason
// (new Panel Cure Check library; rounds from the stored row). A K-DG8 row has no item in new (F2). The malformed-line part of a reason is shown.
const fs=require('fs');const L=require('./lib4.cjs');const RL=require('./replay_lib.cjs');const D=L.D;
const C=L.lib('new','Panel Cure Check');
for(const n of ['32255','32266']){const E=JSON.parse(fs.readFileSync(D+'data/enforcer_log_'+n+'.json','utf8'));const r=JSON.parse(fs.readFileSync(D+'data/run'+n+'.json','utf8'));const R=RL.rounds(r);
 console.log('\nENFORCER LOG '+n+': id seat rule item | stored -> new | malformed line reported (stored -> new)');
 for(const e of E){if(e.kind!=='cure'){console.log(String(e.id).padStart(2)+' '+e.seat+' '+e.kind+' '+(e.item||'')+' | not a cure row');continue;}
  const it={rule:e.rule,link:e.item,line:e.flagged_line,side:'CHALLENGER'};const g=String(e.flagged_line||'').toUpperCase().match(/(DEFENDER|CHALLENGER) LINK BROKEN/);if(g&&/^K-G[147]$|^K-B$/.test(e.rule))it.side=g[1];
  if(e.rule==='K-G6'){it.side=e.item.split(' ')[0];}if(e.rule==='K-G3'){it.side=e.item.split(' ')[0];it.link=null;}
  if(e.rule==='K-DG8'){console.log(String(e.id).padStart(2)+' '+e.seat.padEnd(8)+' '+e.rule.padEnd(6)+' '+String(e.item).padEnd(22)+' | '+e.cure_status+' -> NO ITEM (F2: K-DG8 removed)');continue;}
  // the seat's whole item set as stored, so the retraction and RESULT rules see the same reply
  const all=E.filter(x=>x.seat===e.seat&&x.kind==='cure'&&x.rule!=='K-DG8').map(x=>{const y={rule:x.rule,link:x.item,line:x.flagged_line,side:'CHALLENGER'};const h=String(x.flagged_line||'').toUpperCase().match(/(DEFENDER|CHALLENGER) LINK BROKEN/);if(h&&/^K-G[147]$|^K-B$/.test(x.rule))y.side=h[1];if(x.rule==='K-G6')y.side=x.item.split(' ')[0];return y;});
  const v=C.cureVerdicts(all,{ok:true,text:e.full_reply},null,R).find(x=>x.rule===it.rule&&x.link===it.link);
  const mo=s=>{const m=String(s||'').match(/malformed line: (.{0,40})/);return m?m[1]:'-';};
  console.log(String(e.id).padStart(2)+' '+e.seat.padEnd(8)+' '+e.rule.padEnd(6)+' '+String(e.item).padEnd(22)+' | '+e.cure_status+' -> '+v.status+' ('+String(v.why||'').slice(0,80)+') | '+mo(e.cure_reason)+' -> '+mo(v.why));}}
