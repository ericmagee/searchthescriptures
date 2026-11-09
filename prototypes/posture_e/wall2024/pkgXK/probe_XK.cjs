// pkgXK probe: the exact-key pick on real data (run 34016, terra Panel 2) and on K-RUL cards.
// Run from wall2024/: node pkgXK/probe_XK.cjs
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const A='pkgLIB/strip_FUM/patched/',B='pkgLIB/strip_XK/patched/';const R=f=>fs.readFileSync(f,'utf8');
let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
const c0=JSON.parse(R('/mnt/project-files/wall2024/inputs/34016_Panel_Cure_Call_2_openrouter.json'))[0].data.main[0][0].json;const t0=c0.choices[0].message.content;
/* terra wrote its reply as JSON {"reasoning": "..."}: the probe edits the reasoning text and writes the JSON back, so the reply stays valid */
const J0=JSON.parse(t0.trim().replace(/^```(?:json)?\s*|\s*```$/g,""));const r0=J0.reasoning;const wrap=txt=>JSON.stringify(Object.assign({},J0,{reasoning:txt}));
const run=(D,reasoning)=>{const c=JSON.parse(JSON.stringify(c0));c.choices[0].message.content=reasoning===r0?t0:wrap(reasoning);const H=harness('34016',{'Panel Cure Call 2 openrouter':[{json:c}]});
 const n=H(R(D+'Panel_Cure_Normalize_2.js'),'Panel Cure Call 2 openrouter');return harness('34016',{'Panel Cure Normalize 2':n})(R(D+'Panel_Cure_Check.js'),'Panel Cure Normalize 3')[0].json.enforcer_log.filter(r=>r.judge_model==='openai/gpt-6.1-terra');};
const g=(L,it)=>L.find(r=>r.item===it)||{};const sr=x=>JSON.stringify(x,(k,v)=>(k==='at'||k==='full_reply')?undefined:v);
// 0. the reply as stored: byte-equal status for every item
{const a=run(A,r0),b=run(B,r0);T(sr(a)===sr(b),'stored terra reply: every item reads the same on live and on pkgXK ('+a.length+' rows)');}
// 1. a two-item line written BEFORE D2 #2's own line: live gives D2 #2 the two-item line; pkgXK gives it its own line
{const add='RESPONSE: K-W DEFENDER CR2 D3 #3, K-W DEFENDER CR2 D2 #2 | ACCEPTED: both withdrawals stand.\n';const t=add+r0;
 const a=run(A,t),b=run(B,t),base=run(A,r0);console.log('  D2 #2 stored: '+g(base,'DEFENDER CR2 D2 #2').cure_status+' | live with the line first: '+g(a,'DEFENDER CR2 D2 #2').cure_status+' | pkgXK: '+g(b,'DEFENDER CR2 D2 #2').cure_status);
 T(g(b,'DEFENDER CR2 D2 #2').cure_status===g(base,'DEFENDER CR2 D2 #2').cure_status&&g(b,'DEFENDER CR2 D2 #2').cure_reason===g(base,'DEFENDER CR2 D2 #2').cure_reason,'two-item line first: D2 #2 is read from its own line on pkgXK');
 T(g(a,'DEFENDER CR2 D2 #2').cure_status!==g(base,'DEFENDER CR2 D2 #2').cure_status||g(a,'DEFENDER CR2 D2 #2').cure_reason!==g(base,'DEFENDER CR2 D2 #2').cure_reason,'control: on live the same reply moves D2 #2 (the defect pkgXK closes)');}
// 2. a two-item line that is the ONLY line for both items: both still read it (the judge answered both)
{const strip=r0.split('\n').filter(l=>!/DEFENDER CR2 D5 #4|DEFENDER CR2 D7 #5/.test(l)).join('\n');const add='\nRESPONSE: K-W DEFENDER CR2 D5 #4 / K-W DEFENDER CR2 D7 #5 | ACCEPTED: both withdrawals stand.';
 const a=run(A,strip+add),b=run(B,strip+add);T(sr(a)===sr(b),'a two-item line that is the only line for both items: both read it, same as live ('+g(b,'DEFENDER CR2 D5 #4').cure_status+', '+g(b,'DEFENDER CR2 D7 #5').cure_status+')');}
// 3. K-RUL cards (function level): a grouped card first, then the item's own card
{const s=R(B+'Panel_Cure_Check.js');const grab=n=>{const i=s.indexOf('function '+n+'(');return s.slice(i,s.indexOf('\nfunction ',i+10));};
 const f=new Function('var __XK_ITEMS=null;'+['krulCards','krulMatch','xkCard'].map(grab).join('\n')+';return {set:v=>{__XK_ITEMS=v;},krulCards,xkCard};')();
 const card=(h)=>[h,'CLAIM: c.','NAMED BY: "six words of quote here now."','RULE: r.','APPLIED: a.'].join('\n');
 const T2=card('RULING: D1, D2 vs C2 -- BROKEN')+'\n'+card('RULING: D2 vs C2 -- STANDS')+'\n'+card('RULING: keystone D3 vs C1 -- BROKEN')+'\n'+card('RULING: keystone -- STANDS');
 const I=[{rule:'K-RUL',link:'D1 vs C2',ruling:'D1 vs C2'},{rule:'K-RUL',link:'D2 vs C2',ruling:'D2 vs C2'},{rule:'K-RUL',link:'keystone',ruling:'keystone'},{rule:'K-RUL',link:'D3 vs C1',ruling:'D3 vs C1'}];f.set(I);const C=f.krulCards(T2);
 const hd=x=>(f.xkCard(C,x)||{}).head;
 T(hd(I[1])==='RULING: D2 vs C2 -- STANDS','D2 vs C2 takes its own card, not the grouped "D1, D2 vs C2" card above it');
 T(hd(I[0])==='RULING: D1, D2 vs C2 -- BROKEN','D1 vs C2 still takes the grouped card (its only card)');
 T(hd(I[2])==='RULING: keystone -- STANDS','keystone takes its own card, not "keystone D3 vs C1"');
 T(hd(I[3])==='RULING: keystone D3 vs C1 -- BROKEN','D3 vs C1 takes the only card that names it');
 f.set(null);T(hd(I[1])==='RULING: D1, D2 vs C2 -- BROKEN','with no item list (a node outside cureVerdicts) the first matching card is taken, as live');}
console.log('TOTAL '+ok+' OK, '+bad+' FAIL');
