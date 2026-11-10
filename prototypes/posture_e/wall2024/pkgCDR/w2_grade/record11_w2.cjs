// W2 grade of pkgCDR rev 11: LINK ? reading in Close Enforcer Record, cap with rounds in full, prompt passage. Labels fixed before the run.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g('pkgCDR/parent_s103_CDR.json'),LIVE=g('/mnt/project-files/wall2024/fetchback_live_s103.json');
const code=(W,n)=>W.nodes.find(z=>z.name===n).parameters.jsCode;const J=x=>({json:x});
const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];const cl=x=>JSON.parse(JSON.stringify(x));
const run=async(c,fo,over,inp)=>(await harness('34108',Object.assign({'Final Output':fo},over||{}))('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
(async()=>{const fo=cl(FO);const B=await run(code(CAND,'Close Enforcer Build'),fo);const U=B.body.messages[1].content;
 const rec=async t=>run(code(CAND,'Close Enforcer Record'),fo,{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const st=R=>JSON.stringify(R.cec.rows.map(r=>r.id+' '+r.status+' L'+r.link));
 const Q=B.cands.find(c=>c.n==='?'),N=B.cands.find(c=>c.n!=='?'&&/^P/.test(c.id));T('Y0 34108 has a LINK ? hint and a numbered hint',!!Q&&!!N,(Q&&Q.id)+' '+(N&&N.id+' L'+N.n));
 const line=(c,link,ans,close)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+link+' -- '+ans+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+close+'" -- why.';
 let R=await rec(line(N,'?','NOT A CONTRADICTION',''));T('Y1 a numbered hint answered NOT A CONTRADICTION with LINK ? is read, not NO ANSWER',!R.cec.no_answer.includes(N.id)&&R.cec.confirmed.length===0,st(R));
 R=await rec(line(N,'?','CONFIRMED','Christ had no biological father.'));T('Y2 a numbered hint answered CONFIRMED with LINK ? is NOT CONFIRMED, nothing broken',R.cec.confirmed.length===0,st(R));
 R=await rec(line(Q,'?','NOT A CONTRADICTION','').replace('LINK ?','LINK?'));T('Y3 "LINK?" with no space is read',!R.cec.no_answer.includes(Q.id),st(R));
 R=await rec(line(Q,' ? ','NOT A CONTRADICTION',''));T('Y4 "LINK  ?  " with extra spaces is read',!R.cec.no_answer.includes(Q.id),st(R));
 R=await rec('CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK ? -- CONFIRMED -- EARLIER [CR3] "I drop the wording \\"no biological father\\" as a bare statement." -- CLOSING [CR4] "Christ had no biological father." -- why.');
 T('Y5 a NEW CONFIRMED line with LINK ? breaks nothing',R.cec.confirmed.length===0,st(R));
 const D6=B.cands.find(c=>/no biological father/.test(c.earlier_q));R=await rec(line(D6,6,'CONFIRMED','Christ had no biological father.')+'\n'+line(Q,'?','NOT A CONTRADICTION',''));
 T('Y6 D6 CONFIRMED with LINK 6 still breaks D6 when a LINK ? row stands beside it',R.cec.confirmed.length===1&&R.cec.confirmed[0].link===6,st(R));
 const L=typeof R.cec_log==='string'?JSON.parse(R.cec_log):R.cec_log;T('Y7 log rows for the LINK ? answer keep the row shape (rule E-CLOSECON, panel, cure_status empty)',L.every(r=>r.rule==='E-CLOSECON'&&r.seat_role==='panel'&&r.cure_status==null),L.length+' rows');
 // cap
 const fp=cl(FO);fp[0].json.cr3+='\n'+Array.from({length:300},(_,i)=>'I drop the side remark about row '+i+'.').join(' ')+'\nI yield the wording "the register stops at Joseph".';fp[0].json.cr4+='\nThe register stops at Joseph.';
 const BP=await run(code(CAND,'Close Enforcer Build'),fp),BL=await run(code(LIVE,'Close Enforcer Build'),fp);const UP=BP.body.messages[1].content,UL=BL.body.messages[1].content;
 const nd=BP.cands.filter(c=>c.side==='DEFENDER'&&/^P/.test(c.id)).length;
 T('Y8 cap: at most 30 defender hints with 300 padding drops',nd<=30,nd+' defender hints');
 T('Y9 cap: the padded round and the true drop past the cap are in the prompt word for word',UP.includes(fp[0].json.cr3.trim().split('\n').pop())&&UP.includes('I drop the side remark about row 299.'));
 T('Y10 cap: prompt growth over live with 300 padding drops is bounded (under 15,000 characters)',UP.length-UL.length<15000,(UP.length-UL.length)+' characters added; live '+UL.length);
 let i=0;while(i<UL.length&&UL[i]===UP[i])i++;let j=0;while(j<UL.length-i&&UL[UL.length-1-j]===UP[UP.length-1-j])j++;T('Y11 cap: no live text removed (only the candidate block differs)',UL.slice(i,UL.length-j).endsWith('none')&&UL.length-(i+j)<600,(i+j)+' of '+UL.length+' unchanged');
 // prompt passage
 const want=["Each thing given up that the same side's closing round asserts again as its own, in the same words or in other words, is a contradiction","The rule above on a closing sentence that differs only in wording covers a restatement of what the side still holds; it never covers a restatement of what the side gave up.","where a hint shows LINK ? and you cannot tell the link, write LINK ? (a CONFIRMED answer needs one of the side's declared links)."];
 T('Y12 prompt holds the three new sentences word for word',want.every(w=>U.includes(w)));
 T('Y13 the "differs only in wording" rule it refers to stands above it',U.indexOf('or differs only in wording')>-1&&U.indexOf('or differs only in wording')<U.indexOf('The rule above on a closing sentence'));
 console.log(ok+' OK, '+bad+' FAIL');})();
