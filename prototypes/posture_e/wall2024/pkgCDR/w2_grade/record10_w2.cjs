// W2 grade of pkgCDR rev 10: Close Enforcer Record on NEW lines for drops the hints do not carry (split forms), plus a forged closing quote. Labels fixed before the run.
process.chdir(__dirname+'/../..');const fs=require('fs');const {harness}=require('../../pkgGSL/harness.cjs');
const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};const CAND=g('pkgCDR/parent_s103_CDR.json');const code=n=>CAND.nodes.find(z=>z.name===n).parameters.jsCode;
const J=x=>({json:x});const FO=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/inputs/34108_Final_Output.json','utf8'))[0].data.main[0];
const fo=JSON.parse(JSON.stringify(FO));fo[0].json.cr3+='\nI drop the following wording:\n- the register stops at Joseph\nI drop it.\nThe cloud of Luke 9:34 was my wording there.';fo[0].json.cr4+='\nThe register stops at Joseph.\nThe cloud of Luke 9:34 is the Spirit himself.';
const run=async(c,over,inp)=>(await harness('34108',Object.assign({'Final Output':fo},over||{}))('return (async()=>{\n'+c+'\n})();',inp||'Quote Report'))[0].json;
const reply=t=>[J({choices:[{message:{role:'assistant',content:t},finish_reason:'stop'}]})];let ok=0,bad=0;const T=(n,c,i)=>{if(c)ok++;else bad++;console.log((c?'OK   ':'FAIL ')+n+(i?': '+i:''));};
(async()=>{const B=await run(code('Close Enforcer Build'));const U=B.body.messages[1].content;
 T('X0 the added rounds text is in the prompt word for word',U.includes('I drop the following wording:\n- the register stops at Joseph')&&U.includes('The register stops at Joseph.'));
 const rec=async t=>run(code('Close Enforcer Record'),{'Close Enforcer Build':[J(B)],'Close Enforcer Call deepseek':reply(t)},'Close Enforcer Call deepseek');
 const N1='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "the register stops at Joseph" -- CLOSING [CR4] "The register stops at Joseph." -- The defender gave up this wording in [CR3] and asserts it again in the close.';
 const R1=await rec(N1);T('X1 NEW CONFIRMED for the bullet-line drop (not hinted with its wording) breaks the link',R1.cec.confirmed.length===1&&R1.cec.confirmed[0].side==='DEFENDER',JSON.stringify(R1.cec.rows.map(r=>r.id+' '+r.status)));
 const N2='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "I drop it." -- CLOSING [CR4] "The cloud of Luke 9:34 is the Spirit himself." -- The defender dropped this in [CR3] and asserts it again.';
 const R2=await rec(N2);T('X2 NEW CONFIRMED quoting the split verb sentence is read (quotes found word for word)',R2.cec.confirmed.length===1,JSON.stringify(R2.cec.rows.map(r=>r.id+' '+r.status)));
 const N3='CLOSE-CONTRADICTION: NEW -- DEFENDER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "the register stops at Joseph" -- CLOSING [CR4] "The register stops at Joseph alone." -- forged closing quote.';
 const R3=await rec(N3);T('X3 a CONFIRMED line whose closing quote is not in [CR4] breaks nothing',R3.cec.confirmed.length===0,JSON.stringify(R3.cec.rows.map(r=>r.id+' '+r.status)));
 const N4='CLOSE-CONTRADICTION: NEW -- CHALLENGER -- LINK 6 -- CONFIRMED -- EARLIER [CR3] "the register stops at Joseph" -- CLOSING [CR4] "The register stops at Joseph." -- wrong side.';
 const R4=await rec(N4);T('X4 a CONFIRMED line naming the wrong side for defender rounds breaks nothing for the challenger',!R4.cec.confirmed.some(c=>c.side==='CHALLENGER'),JSON.stringify(R4.cec.rows.map(r=>r.id+' '+r.status+' '+(r.side||''))));
 console.log(ok+' OK, '+bad+' FAIL');})();
