// W1 grade of pkgQRC: edge cases on QR Check / QR Final / QR Merge with empty earlier fields. Reuses probe_QRC.cjs's harness.
const fs=require('fs');let src=fs.readFileSync(__dirname+'/../probe_QRC.cjs','utf8');
src=src.replace(/console\.log\('\\n'\+ok[\s\S]*$/,'');src=src.split("__dirname+'/").join("__dirname+'/../");
src+=`
console.log('--- W1 edge cases ---');
const E=(lbl,d)=>{const n=chk(neu('QR Check'),d,OQ).faults.defender, l=chk(live('QR Check'),{round:d.round,quote:d.quote,question:d.question},OQ).faults.defender;console.log(lbl+'\\n   QRC faults: '+JSON.stringify(n)+'\\n   live faults (same question without earlier fields): '+JSON.stringify(l));return n;};
const ORD={round:'CR3',quote:'I grant that this is the ordinary means.',question:'Explain what "ordinary" means here.'};
const e1=E('E1 ordinary question, earlier fields as empty strings',{...ORD,earlier_round:'',earlier_quote:''});
const e2=E('E2 ordinary question, earlier fields null',{...ORD,earlier_round:null,earlier_quote:null});
const e3=E('E3 ordinary question, earlier fields "none"',{...ORD,earlier_round:'none',earlier_quote:'none'});
const e4=E('E4 contradiction question, round written "[CR4]" and earlier "[CR3]"',{...CQ,round:'[CR4]',earlier_round:'[CR3]'});
const e5=E('E5 contradiction question, earlier round lower case "cr3"',{...CQ,earlier_round:'cr3'});
// QR Final / Merge on a passing ordinary question that carries empty strings: does the label stay ordinary?
const ckE=chk(neu('QR Check'),{...ORD,earlier_round:'',earlier_quote:''},OQ);
console.log('E1 retry flag: '+ckE.retry);
T('E1 an ordinary question with empty earlier fields is NOT refused',e1.length===0,JSON.stringify(e1));
T('E2 null earlier fields: no new fault',e2.length===0);
T('E4 bracketed rounds accepted',e4.length===0,JSON.stringify(e4));
T('E5 lower-case earlier round accepted',e5.length===0,JSON.stringify(e5));
console.log('\\n'+ok+' OK, '+bad+' FAIL');`;
fs.writeFileSync(__dirname+'/_run.cjs',src);require(__dirname+'/_run.cjs');
