const K=JSON.parse(require('fs').readFileSync('keep.json','utf8'));const S=(v,n=400)=>JSON.stringify(v).slice(0,n);
const je=K['Judge Enforcer Record'][0],am=K['Alternate Merge'][0];
console.log('FIRST');je.summary.forEach(s=>console.log(' ',S(s,420)));console.log('FINAL');am.summary.forEach(s=>console.log(' ',S(s,420)));
// package markers in enforcer_log reasons and audit marks (not prompts)
const txt=[];for(const r of am.enforcer_log){txt.push(String(r.cure_reason||''),String(r.item||''));}
for(const b of (am.bodies||[])){txt.push(JSON.stringify(b.final_text||b.text||b.verdict_raw||''));}
const all=txt.join('\n');const c={};for(const m of all.matchAll(/pkg[A-Z0-9]{2,6}[a-z0-9]*/g))c[m[0]]=(c[m[0]]||0)+1;console.log('markers in cure reasons/items:',S(c,2000));
console.log('AM keys',Object.keys(am).join(','));
// E-PREM rows
const ep=am.enforcer_log.filter(r=>r.rule==='E-PREM'&&r.kind==='enforcer_check');console.log('E-PREM checks',ep.length);
const dis=am.enforcer_log.filter(r=>r.kind==='enforcer_check'&&/DISAGREE/.test(String(r.response_line||r.cure_reason||'')));const t={};dis.forEach(r=>{const k=r.seat+' '+r.rule;t[k]=(t[k]||0)+1;});console.log('DISAGREE by seat/rule',S(t,900));
