const {body,am,out}=require('./g.cjs');const L=am.enforcer_log;
// 1 struck rows
const t0=body(0).t;for(const q of ['ek (out of/from) is the same preposition','I drop any claim that Psalms 2:7','I grant it is applied at the occasions below','set there at the raising','I grant the priesthood occasion'])console.log('luna final has',JSON.stringify(q),t0.includes(q));
const a=t0.indexOf('OUT-OF-ROUND CONCESSIONS');console.log(t0.slice(a,a+1500));
// 2 K-W
console.log('## K-W cure rows with REASSERTED');
L.filter(x=>x.kind==='cure'&&x.rule==='K-W').forEach(x=>{const r=(x.response_line||'');if(/REASSERT/i.test(r)||/reassert/i.test(x.cure_reason||''))console.log(x.seat,'|',x.item,'|',r.slice(0,420),'|',(x.cure_reason||'').slice(0,160));});
const kw={};L.filter(x=>x.kind==='cure'&&x.rule==='K-W').forEach(x=>{const k=x.seat+'|'+(x.cure_reason||'').slice(0,70);kw[k]=(kw[k]||0)+1});console.log(kw);
// 3 K-C lines
console.log('## quotation / does not assert lines');
for(let i=0;i<3;i++){const {p,t}=body(i);t.split('\n').forEach(l=>{if(/does not assert|quotation/i.test(l)&&/VOID|Commitment 6|not counted|set aside/i.test(l))console.log(p.judge_seat,':',l.slice(0,420));});}
// 4 DeepSeek disagree E-ANS/E-HOLD reasons
console.log('## E-ANS/E-HOLD DISAGREE');
L.filter(x=>x.kind==='enforcer_check'&&/E-ANS|E-HOLD/.test(x.rule)&&/DISAGREE/.test(x.response_line||'')).forEach(x=>console.log(x.seat,x.rule,x.item,'|',(x.response_line||'').slice(0,330)));
