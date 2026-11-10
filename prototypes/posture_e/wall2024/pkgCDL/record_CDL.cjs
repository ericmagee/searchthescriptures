// pkgCDL rev 1 (W1; W2's note on pkgCDF rev 2, coordinator 05:20Z): Close Enforcer Record reads the enforcer's own "LINK D<n>" / "LINK C<n>" as link n
// when the side letter matches the side ruled on; any other non-number LINK form is read as LINK ? and, on a CONFIRMED with both quotations
// standing, carries the RECORD-ONLY FOR REVIEW note instead of being lost as an unreadable line. Labels written before the first run.
// Runs pkgCDF's 10 record checks on the pkgCDL file, then C1 to C8; rev 2 adds C9 to C11; rev 3 relabels C10 (both links break, W2 FAIL of rev 2) (W2 FAIL of rev 1, coordinator 05:24Z).
process.chdir(__dirname+'/..');const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g(process.env.CAND||'pkgCDL/parent_s103_CDR11_CDF_CDL.json');const code=n=>CAND.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const run=async(c,over,inp)=>(await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
const EQ='EARLIER [CR3] "I drop the wording "no biological father" as a bare statement." -- CLOSING [CR4] "Christ had no biological father." -- test.';
(async()=>{const B=await run(code('Close Enforcer Build'));const D6=B.cands.find(c=>c.earlier_q==='I drop the wording "no biological father" as a bare statement.');
 const rec=async t=>run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const row=(R,id)=>R.cec.rows.find(r=>r.id===id)||{};const sh=r=>(r.answer||'')+' | link '+r.link+' | '+(r.status||'')+' | '+String(r.note||'').slice(0,220);
 const C1=await rec('CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK D6 -- CONFIRMED -- '+EQ);const c1=row(C1,D6.id);
 T('C1 DEFENDER "LINK D6" CONFIRMED with both quotations standing: read as link 6, breaks D6, note says how it was read',C1.cec.confirmed.length===1&&C1.cec.confirmed[0].link===6&&c1.status==='CONFIRMED'&&/LINK D6, read as LINK 6/.test(c1.note||''),sh(c1));
 const C2=await rec('CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK C6 -- CONFIRMED -- '+EQ);const c2=row(C2,D6.id);
 T('C2 DEFENDER "LINK C6" (side letter wrong): read as LINK ?, breaks nothing, NOT CONFIRMED (form), RECORD-ONLY FOR REVIEW, note names the side letter',C2.cec.confirmed.length===0&&c2.link==='?'&&c2.status==='NOT CONFIRMED (form)'&&/RECORD-ONLY FOR REVIEW/.test(c2.note||'')&&/side letter/.test(c2.note||''),sh(c2));
 const C3=await rec('CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK N/A -- CONFIRMED -- '+EQ);const c3=row(C3,D6.id);
 T('C3 DEFENDER "LINK N/A" CONFIRMED: read by its id (not UNREADABLE, not NO ANSWER), breaks nothing, RECORD-ONLY FOR REVIEW, note quotes N/A',C3.cec.confirmed.length===0&&c3.link==='?'&&!C3.cec.no_answer.includes(D6.id)&&!C3.cec.rows.some(r=>r.answer==='UNREADABLE')&&/RECORD-ONLY FOR REVIEW/.test(c3.note||'')&&/LINK N\/A/.test(c3.note||''),sh(c3));
 const C4=await rec(B.cands.map(c=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+(c.n==='?'?'N/A':(c.side==='DEFENDER'?'D':'C')+c.n)+' -- NOT A CONTRADICTION -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "" -- not again.').join('\n'));
 T('C4 every hint answered NOT A CONTRADICTION with LINK D<n>/C<n>/N/A: all read, none NO ANSWER, none UNREADABLE, nothing confirmed',C4.cec.no_answer.length===0&&!C4.cec.rows.some(r=>r.answer==='UNREADABLE')&&C4.cec.confirmed.length===0&&C4.cec.rows.length===B.cands.length,JSON.stringify(C4.cec.no_answer));
 const Ch=B.cands.find(c=>c.side==='CHALLENGER'&&c.n!=='?');const C5=await rec(Ch?'CLOSE-CONTRADICTION: '+Ch.id+' -- CHALLENGER -- LINK C'+Ch.n+' -- NOT A CONTRADICTION -- EARLIER ['+Ch.earlier_round+'] "'+Ch.earlier_q+'" -- CLOSING [DR4] "" -- not again.':'');
 T('C5 CHALLENGER "LINK C<n>" is read as link n',!!Ch&&row(C5,Ch.id).link===Ch.n,Ch?Ch.id+' n '+Ch.n+' -> '+sh(row(C5,Ch.id)):'no challenger hint with a link');
 const C6=await rec(Ch?'CLOSE-CONTRADICTION: '+Ch.id+' -- CHALLENGER -- LINK D'+Ch.n+' -- NOT A CONTRADICTION -- EARLIER ['+Ch.earlier_round+'] "'+Ch.earlier_q+'" -- CLOSING [DR4] "" -- not again.':'');
 T('C6 CHALLENGER "LINK D<n>" (side letter wrong) is read as LINK ?',!!Ch&&row(C6,Ch.id).link==='?',Ch?sh(row(C6,Ch.id)):'');
 const C7=await rec('CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK D99 -- CONFIRMED -- '+EQ);const c7=row(C7,D6.id);
 T('C7 DEFENDER "LINK D99" (not declared): read as 99, NOT CONFIRMED (form), breaks nothing, no RECORD-ONLY note (same as LINK 99)',C7.cec.confirmed.length===0&&c7.link===99&&c7.status==='NOT CONFIRMED (form)'&&!/RECORD-ONLY/.test(c7.note||''),sh(c7));
 const C8=await rec('CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK 6 -- CONFIRMED -- '+EQ);const c8=row(C8,D6.id);
 T('C8 plain "LINK 6" unchanged: CONFIRMED, breaks D6, no pkgCDL note',C8.cec.confirmed.length===1&&c8.status==='CONFIRMED'&&!/pkgCDL/.test(c8.note||''),sh(c8));
 const C9=await rec('CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK the keystone link of the whole chain as declared -- CONFIRMED -- '+EQ);const c9=row(C9,D6.id);
 T('C9 rev 2: a LINK text of any length (over 24 characters) is read by the id as LINK ?, breaks nothing, RECORD-ONLY FOR REVIEW, note quotes it',C9.cec.confirmed.length===0&&c9.link==='?'&&!C9.cec.rows.some(r=>r.answer==='UNREADABLE')&&/RECORD-ONLY FOR REVIEW/.test(c9.note||'')&&/keystone link of the whole chain/.test(c9.note||''),sh(c9));
 const C10=await rec(['6','5'].map(n=>'CLOSE-CONTRADICTION: '+D6.id+' -- DEFENDER -- LINK '+n+' -- CONFIRMED -- '+EQ).join('\n'));const c10=C10.cec.rows.filter(r=>r.id===D6.id);
 T('C10 rev 3: two CONFIRMED lines on one candidate naming links 6 then 5, quotations standing: both links break, as in pkgCDR rev 11; no refusal',C10.cec.confirmed.length===2&&C10.cec.confirmed.map(x=>x.link).sort().join()==='5,6'&&c10.every(r=>r.status==='CONFIRMED'),c10.map(sh).join(' || '));
 const C11=await rec(['NEW 1|6','NEW 2|5'].map(x=>'CLOSE-CONTRADICTION: '+x.split('|')[0]+' -- DEFENDER -- LINK '+x.split('|')[1]+' -- CONFIRMED -- '+EQ).join('\n'));
 T('C11 rev 2: NEW lines are not one candidate; two NEW lines naming links 6 and 5 each break their link (unchanged)',C11.cec.confirmed.length===2,C11.cec.rows.map(sh).join(' || '));
 console.log(ok+' OK, '+bad+' FAIL');})();
