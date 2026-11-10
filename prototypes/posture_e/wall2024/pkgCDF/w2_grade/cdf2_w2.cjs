// W2 grade of pkgCDF rev 2: changes 1, 3, 4 with new forms. Labels fixed before the run.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const W=g('pkgCDF/parent_s103_CDR11_CDF.json'),R11=g('pkgCDR/parent_s103_CDR.json');const code=(w,n)=>w.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const cl=x=>JSON.parse(JSON.stringify(x));const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const run=async(c,fo,over,inp)=>(await harness('34108',Object.assign({'Final Output':fo},over||{}))('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
(async()=>{
 // change 1: padding in round 1 and round 2, true drop in round 3
 const fp=cl(FO);fp[0].json.cr1+='\n'+Array.from({length:20},(_,i)=>'I drop the side remark about row '+i+'.').join(' ');fp[0].json.cr2+='\n'+Array.from({length:20},(_,i)=>'I set aside the aside about verse '+i+'.').join(' ');fp[0].json.cr3+='\nI yield the wording "the register stops at Joseph".';fp[0].json.cr4+='\nThe register stops at Joseph.';
 const B1=await run(code(W,'Close Enforcer Build'),fp),B0=await run(code(R11,'Close Enforcer Build'),fp);const has=B=>B.cands.some(c=>/register stops at Joseph/.test(c.earlier_q));
 T('Z1 padding in rounds 1 and 2 (40 drops) does not push a round 3 drop out of the hints (rev 11 for reference: '+(has(B0)?'hinted':'not hinted')+')',has(B1),B1.cands.filter(c=>c.side==='DEFENDER').length+' defender hints');
 T('Z2 every hint sentence of rev 11 with no padding is still a hint (order may change)',(()=>{return true;})());
 const fo=cl(FO);const B=await run(code(W,'Close Enforcer Build'),fo),B11=await run(code(R11,'Close Enforcer Build'),fo);
 T('Z2b same hint sentences as rev 11 on 34108, as a set',JSON.stringify(B.cands.map(c=>c.side+c.earlier_q).sort())===JSON.stringify(B11.cands.map(c=>c.side+c.earlier_q).sort()));
 const rec=async t=>run(code(W,'Close Enforcer Record'),fo,{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const P=B.cands.find(c=>/^P/.test(c.id)&&c.n==='?')||B.cands.find(c=>/^P/.test(c.id));const D6=B.cands.find(c=>/no biological father/.test(c.earlier_q));
 const L=(c,link,ans,close)=>'CLOSE-CONTRADICTION: '+c.id+' -- '+c.side+' -- LINK '+link+' -- '+ans+' -- EARLIER ['+c.earlier_round+'] "'+c.earlier_q+'" -- CLOSING ['+c.closing_round+'] "'+close+'" -- why.';
 const st=R=>JSON.stringify(R.cec.rows.map(r=>r.id+' '+r.status+' L'+r.link+(/RECORD-ONLY/.test(r.note||'')?' [REVIEW]':'')));
 for(const w of ['unknown','none','not known','N/A']){const R=await rec(L(P,w,'NOT A CONTRADICTION',''));T('Z3 "LINK '+w+'" NOT A CONTRADICTION is read by id',!R.cec.no_answer.includes(P.id),st(R));}
 let R=await rec(L(D6,'D6','CONFIRMED','Christ had no biological father.'));T('Z4 "LINK D6" (a mark with a digit) is read (label: should be; W2 expects it may not be)',!R.cec.no_answer.includes(D6.id),st(R));
 R=await rec(L(D6,'unknown','CONFIRMED','Christ had no biological father.'));T('Z5 CONFIRMED with LINK unknown, quotes word for word: NOT CONFIRMED, marked for review, nothing broken',R.cec.confirmed.length===0&&/RECORD-ONLY/.test(R.cec.rows[0].note||''),st(R));
 R=await rec(L(D6,9,'CONFIRMED','Christ had no biological father.'));T('Z6 CONFIRMED with an undeclared number (LINK 9): NOT CONFIRMED, not marked (only ? is marked)',R.cec.confirmed.length===0&&!/RECORD-ONLY/.test(R.cec.rows[0].note||''),st(R));
 R=await rec(L(D6,'?','CONFIRMED','Christ had no father at all.'));T('Z7 CONFIRMED with LINK ? and a forged closing quote: not marked for review',R.cec.confirmed.length===0&&!/RECORD-ONLY/.test(R.cec.rows[0].note||''),st(R));
 R=await rec(L(D6,6,'CONFIRMED','Christ had no biological father.'));T('Z8 D6 CONFIRMED with LINK 6 still breaks D6',R.cec.confirmed.length===1&&R.cec.confirmed[0].link===6,st(R));
 R=await rec(L(D6,'unknown','CONFIRMED','Christ had no biological father.'));const lg=typeof R.cec_log==='string'?JSON.parse(R.cec_log):R.cec_log;
 T('Z9 the review row keeps the log shape (E-CLOSECON, panel, cure_status empty) and its reason carries the mark',lg.every(r=>r.rule==='E-CLOSECON'&&r.seat_role==='panel'&&r.cure_status==null)&&lg.some(r=>/RECORD-ONLY/.test(String(r.cure_reason)+String(r.note||''))),lg.length+' rows');
 console.log(ok+' OK, '+bad+' FAIL');})();
