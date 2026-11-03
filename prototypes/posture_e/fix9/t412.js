const fs=require('fs');let pass=0,fail=0;const ok=(c,m)=>{if(c){pass++;console.log('PASS',m)}else{fail++;console.log('FAIL',m)}};
const F=JSON.parse(fs.readFileSync('../run32373/F.json','utf8'));
// C4P + C4X from Panel Build, with REFP
const pb=fs.readFileSync('new/Panel Build.js','utf8');
const cut=(s,a,end)=>{const i=s.indexOf(a);const j=s.indexOf(end,i)+end.length;return s.slice(i,j);};
const refp=cut(pb,'const REFP=(()=>','\n return {parse,keys,book,BK,BOOKS};})();');
const c4p=cut(pb,'const C4P=(()=>{','return {refs,fresh,of,note,ofD,noteD,renum,noteR,declared,dlinks,cblocks,press,noteP,noteL,all,storeLine,stored};})();');
const c4x=cut(pb,'const C4X=(()=>{','return {newToSide,reversal,note};})();');
const L=new Function(refp+'\n'+c4p+'\n'+c4x+'\nreturn {C4P,C4X};')();
const nD=L.C4X.newToSide(F,'D'),nC=L.C4X.newToSide(F,'C');console.log('new to defender in close:',nD.join(', ')||'none','| new to challenger:',nC.join(', ')||'none');
ok(nD.some(x=>/Ezra 2:61/.test(x)),'defender close: Ezra 2:61 flagged as new to the defender (Worker_G1 item 4)');
const vD=L.C4X.reversal(F,'D');console.log('defender reversals:');vD.forEach(x=>console.log('   CLOSE:',x.close.slice(0,160),'\n   EARLIER:',x.grant.slice(0,160)));
ok(vD.some(x=>/1:25/.test(x.close)||/gap/i.test(x.close)),'defender close: Matthew 1:25 "no gap" flagged against the link-round grant (Worker_G1 item 5)');
const vC=L.C4X.reversal(F,'C');console.log('challenger reversals:',vC.length);vC.forEach(x=>console.log('   CLOSE:',x.close.slice(0,160),'\n   EARLIER:',x.grant.slice(0,160)));
console.log(L.C4X.note(F,'D').slice(0,600));
// rulebook texts
for(const n of ['Panel Build','Build Independent Verdict']){const s=fs.readFileSync('new/'+n+'.js','utf8');
 ok(/ruling 411/.test(s)&&/close round \[CR4\], itself states/.test(s)&&/ANSWER CHECK \(ruling 412\)/.test(s)&&/BINDING \(ruling 412\)/.test(s),n+': rulebook carries 411 and 412 texts');}
// ruling 411 in the checker: a FORCED line stops K-G4
const pp=fs.readFileSync('new/Panel Payloads.js','utf8');ok(/__kfHas\(text,id\)/.test(pp),'Panel Payloads: K-G4 not raised on a FORCED-line grade');
console.log(pass,'pass',fail,'fail');
