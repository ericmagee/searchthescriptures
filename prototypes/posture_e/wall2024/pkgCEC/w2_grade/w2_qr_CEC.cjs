// W2 regrade of pkgCEC rev 3: item C (pkgQRC) contradiction questions reach the post-panel Judge Contradiction Build.
//   node pkgCEC/w2_grade/w2_qr_CEC.cjs   (from wall2024/)
const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const PAR=JSON.parse(fs.readFileSync(__dirname+'/../parent_s83_CEC.json','utf8'));
const code=(d,n)=>d.nodes.find(x=>x.name===n).parameters.jsCode;const J=x=>({json:x});
const run=async(c,over,inp)=>await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report');
let ok=0,bad=0;const T=(n,c,i)=>{if(c){ok++;console.log('OK   '+n+(i?': '+i:''));}else{bad++;console.log('FAIL '+n+(i?': '+i:''));}};
const D6E='I drop the wording "no biological father" as a bare statement.',D6C='Christ had no biological father.';
const QM=qa=>[J({qa,record:[],qa_text:''})];
const base={judge:'sol',side:'defender',round:'CR4',quote:D6C,question:'q?',answer:'a'};
(async()=>{
const B0=(await run(code(PAR,'Judge Contradiction Build'),{}))[0].json;const n0=(B0.cands||[]).length;
let B=(await run(code(PAR,'Judge Contradiction Build'),{'QR Merge':QM([{...base,earlier_round:'CR3',earlier_quote:D6E}])}))[0].json;
const q=(B.cands||[]).filter(c=>/question/.test(String(c.by))||c.closing_q===D6C);
T('Q1 an item C contradiction question (QR Final form: side lower case, round CR4) becomes a defender candidate with both quotes',q.length===1&&q[0].side==='DEFENDER'&&q[0].earlier_round==='CR3'&&q[0].earlier_q===D6E,JSON.stringify(q.map(c=>c.id+' '+c.side+' '+c.earlier_round+'>'+c.closing_round+' by '+c.by)));
B=(await run(code(PAR,'Judge Contradiction Build'),{'QR Merge':QM([{...base,earlier_round:null,earlier_quote:null}])}))[0].json;
T('Q2 an ordinary question (earlier fields null, as QR Final writes them) adds no candidate',(B.cands||[]).length===n0,n0+' vs '+(B.cands||[]).length);
B=(await run(code(PAR,'Judge Contradiction Build'),{'QR Merge':QM([{...base,round:'CR3',earlier_round:'CR2',earlier_quote:'some earlier words here'}])}))[0].json;
T('Q3 a question whose later quote is not the closing round adds no candidate',(B.cands||[]).length===n0);
B=(await run(code(PAR,'Judge Contradiction Build'),{'QR Merge':QM([{...base,earlier_round:'CR3',earlier_quote:D6E},{...base,judge:'luna',earlier_round:'CR3',earlier_quote:D6E}])}))[0].json;
const q2=(B.cands||[]).filter(c=>c.closing_q===D6C);
T('Q4 the same pair asked by two judges is one candidate naming both',q2.length===1&&/sol/.test(q2[0].by)&&/luna/.test(q2[0].by),JSON.stringify(q2.map(c=>c.by)));
console.log('\n'+ok+' OK, '+bad+' FAIL');})().catch(e=>console.log('ERROR '+e.stack));
