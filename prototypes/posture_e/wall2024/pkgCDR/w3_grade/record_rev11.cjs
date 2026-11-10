// W3 regrade of pkgCDR rev 11: Close Enforcer Record on answers that use "LINK ?", and the cap of 30 hints per side.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g('pkgCDR/parent_s103_CDR.json');const code=n=>CAND.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const run=async(c,over,inp)=>(await harness('34108',over||{})('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+n+(i?'\n       '+i:''));};
(async()=>{const B=await run(code('Close Enforcer Build'));const rec=async(t,b)=>run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(b||B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const Q=B.cands.find(c=>c.n==='?'),D6=B.cands.find(c=>/no biological father/.test(c.earlier_q));const CQ='Christ had no biological father.';
 const st=(R,id)=>(R.cec.rows.find(r=>r.id===id)||{status:R.cec.no_answer.includes(id)?'NO ANSWER':'absent'}).status;const conf=R=>JSON.stringify(R.cec.confirmed.map(c=>c.side+' LINK '+c.link));
 const L=(c,link,verdict,close)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+link+' -- '+verdict+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+close+'" -- test.';
 console.log('hint with LINK ?: '+Q.id+' ['+Q.earlier_round+'] '+Q.earlier_q.slice(0,80));
 let R=await rec(L(Q,'?','NOT A CONTRADICTION',''));T('Y1 NOT A CONTRADICTION with LINK ? to a LINK ? hint is read as answered',st(R,Q.id)==='NOT A CONTRADICTION'&&!R.cec.no_answer.includes(Q.id),st(R,Q.id)+' confirmed '+conf(R));
 R=await rec(L(Q,'?','CONFIRMED',CQ));T('Y2 CONFIRMED with LINK ? breaks nothing',R.cec.confirmed.length===0,st(R,Q.id)+' confirmed '+conf(R));
 R=await rec(L(D6,'?','NOT A CONTRADICTION',''));T('Y3 NOT A CONTRADICTION with LINK ? to a hint whose link is known is read as answered',st(R,D6.id)==='NOT A CONTRADICTION',st(R,D6.id));
 R=await rec('CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK ? -- CONFIRMED -- EARLIER [CR3] "I grant that this is the ordinary means." -- CLOSING [CR4] "'+CQ+'" -- test.');T('Y4 a NEW line CONFIRMED with LINK ? breaks nothing',R.cec.confirmed.length===0,JSON.stringify(R.cec.rows.map(r=>r.id+' '+r.status))+' confirmed '+conf(R));
 R=await rec(L(Q,'3','CONFIRMED',CQ));T('Y5 a LINK ? hint CONFIRMED under a declared link, both quotations word for word, is CONFIRMED on that link',R.cec.confirmed.length===1&&R.cec.confirmed[0].link===3,st(R,Q.id)+' confirmed '+conf(R));
 R=await rec(L(D6,'99','CONFIRMED',CQ));T('Y6 CONFIRMED under a link that is not declared breaks nothing',R.cec.confirmed.length===0,st(R,D6.id)+' confirmed '+conf(R));
 R=await rec(L(D6,'6','CONFIRMED',CQ));T('Y7 the D6 hint CONFIRMED on LINK 6 breaks LINK 6',R.cec.confirmed.length===1&&R.cec.confirmed[0].link===6&&R.cec.confirmed[0].side==='DEFENDER',conf(R));
 R=await rec(L(Q,'? (cannot be told)','NOT A CONTRADICTION',''));console.log('NOTE Y8 "LINK ? (cannot be told)" on a NOT A CONTRADICTION answer reads: '+st(R,Q.id));
 R=await rec(L(Q,'unknown','NOT A CONTRADICTION',''));console.log('NOTE Y9 "LINK unknown" on a NOT A CONTRADICTION answer reads: '+st(R,Q.id));
 // cap: 40 padding drop sentences in CR1, the true drop after them in CR3
 const fo=cl(FO);const pad=Array.from({length:40},(_,i)=>'I drop the side remark numbered '+(i+1)+' about the census rolls.').join('\n');fo[0].json.cr1=fo[0].json.cr1+'\n'+pad;
 const B2=await run(code('Close Enforcer Build'),{'Final Output':fo});const d=B2.cands.filter(c=>c.side==='DEFENDER'&&/^P/.test(c.id));const U=B2.body.messages[1].content;
 T('Z1 with 40 padding drops in CR1 the defender has 30 hints and every round is still in the prompt in full',d.length===30&&U.includes(fo[0].json.cr1)&&U.includes(fo[0].json.cr3)&&U.includes(fo[0].json.cr4),'defender hints '+d.length+'; rounds of the hints: '+[...new Set(d.map(c=>c.earlier_round))].join(',')+'; D6 drop among the hints: '+d.some(c=>/no biological father/.test(c.earlier_q))+'; prompt says the list is cut: '+/not complete/i.test(U));
 R=await rec('CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "'+D6.earlier_q+'" -- CLOSING [CR4] "'+CQ+'" -- test.',B2);T('Z2 past the cap, the D6 drop reported as NEW is CONFIRMED on LINK 6',R.cec.confirmed.length===1&&R.cec.confirmed[0].link===6,conf(R)+' no answer count '+R.cec.no_answer.length);
 console.log(ok+' OK, '+bad+' FAIL');})();
