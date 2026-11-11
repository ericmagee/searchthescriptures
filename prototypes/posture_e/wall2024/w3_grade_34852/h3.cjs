const K=JSON.parse(require('fs').readFileSync('keep.json','utf8'));const S=(v,n=400)=>JSON.stringify(v).slice(0,n);const T=(s,n)=>String(s==null?'':s).replace(/\s+/g,' ').slice(0,n);
const am=K['Alternate Merge'][0];const L=am.enforcer_log;
// tally by seat/kind/rule/status
const t={};for(const r of L){const k=[r.seat,r.kind,r.rule,r.cure_status||r.verdict||''].join(' | ');t[k]=(t[k]||0)+1;}
for(const k of Object.keys(t).sort())if(/haiku/.test(k)||/UNCURED|DISAGREE|NO ANSWER|NO VERDICT/.test(k))console.log(t[k],k);
console.log('keys of a row',Object.keys(L[0]).join(','));
const jc=K['Judge Contradiction Record'][0];console.log('JCR keys',Object.keys(jc).join(','));
for(const k of Object.keys(jc))if(/jcc|log|rows|report/i.test(k))console.log(k,S(jc[k],3500));
