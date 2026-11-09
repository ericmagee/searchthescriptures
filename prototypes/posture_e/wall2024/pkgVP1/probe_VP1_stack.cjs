// pkgVP1 probe 4 (W3; W1's condition, Wall 3755): on the library stacked on pkgCEC (live s84), a link broken by a confirmed closing contradiction raises no ANSWER OPEN item.
const fs=require('fs'),path=require('path');const W=path.resolve(__dirname,'..');const H=require('./harness.cjs');const S=process.argv[2]||'pkgLIB/strip_VP1_s84';const RUN='34108';
const src=f=>fs.readFileSync(W+'/'+S+'/patched/'+f,'utf8');let ok=0,bad=0;const T=(c,m)=>{console.log((c?'OK   ':'FAIL ')+m);c?ok++:bad++;};
const rec=(k,conf)=>[[{json:{[k]:{confirmed:conf}}}]];const c=(side,link)=>({id:'X1',side,link,earlier_round:'CR3',earlier_q:'q1',closing_round:'CR4',closing_q:'q2',why:'probe'});
const items=o=>{const lu=o.find(x=>x.json.seat==='luna');return lu?lu.json.items:[];};
(async()=>{
 let o=await H.run(src('Gate_Build.js'),RUN,'Send Back Record');T(items(o).length===1&&items(o)[0].key==='ANSWER OPEN|LUKE 1:34|CR3|D1','1 no closing contradiction record: luna has the one ANSWER OPEN item on D1 (as on s83)');
 o=await H.run(src('Gate_Build.js'),RUN,'Send Back Record',{'Close Enforcer Record':rec('cec',[c('DEFENDER',1)])});
 T(!items(o).some(x=>x.src==='E-GATE M'),'2 a confirmed closing contradiction on DEFENDER LINK 1 (pre-panel record): no ANSWER OPEN item for D1 ('+JSON.stringify(items(o).map(x=>x.src+' '+x.key))+')');
 o=await H.run(src('Gate_Build.js'),RUN,'Send Back Record',{'Judge Contradiction Record':rec('jcc',[c('DEFENDER',1)])});
 T(!items(o).some(x=>x.src==='E-GATE M'),'3 the same break confirmed after the panel (judge contradiction record): no ANSWER OPEN item for D1');
 o=await H.run(src('Gate_Build.js'),RUN,'Send Back Record',{'Close Enforcer Record':rec('cec',[c('DEFENDER',6)])});
 T(items(o).some(x=>x.key==='ANSWER OPEN|LUKE 1:34|CR3|D1'),'4 a confirmed break on another link (D6) leaves the D1 item raised');
 o=await H.run(src('Gate_Build.js'),RUN,'Send Back Record',{'Close Enforcer Record':rec('cec',[c('CHALLENGER',1)])});
 console.log('     5 a confirmed break on CHALLENGER LINK 1 (D1 vs C1 becomes CHALLENGER LINK BROKEN): items '+JSON.stringify(items(o).map(x=>x.src+' '+x.key)));
 T(!items(o).some(x=>x.key==='ANSWER OPEN|LUKE 1:34|CR3|D1'),'5 with D1 vs C1 broken for the challenger, D1 has no UNDERDETERMINED line left: no ANSWER OPEN item');
 console.log('\nprobe_VP1_stack: '+ok+' OK, '+bad+' FAIL');})();
