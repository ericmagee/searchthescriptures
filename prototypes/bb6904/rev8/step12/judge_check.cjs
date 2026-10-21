// Worker_E step 12 judge-node check (J1-J6 of FALSIFIERS_12.txt). Reads the files as text; J5 rebuilds the base by reversing the six
// replacements and compares bytes.
const fs=require('fs');
const OLD=["[CR3] (defender) and [DR3] (challenger). The POST","in a round before this link round (against the defender","is ANSWERED only when this link round quotes it","broken side's link round left any of those witnesses UNANSWERED","only when the link round answered every such witness","a witness the link round leaves unanswered is graded"];
const NEW=["[CR3] (defender) and [DR3] (challenger); an ANSWER to a pressed witness is read from any later round of the side that holds the link, its round 2 or its link round. The POST","in an earlier round (against the defender","is ANSWERED when any later round of the side that holds the link (for the defender: [CR2] or [CR3]; for the challenger: [DR2] or [DR3]) quotes it","broken side's later rounds left any of those witnesses UNANSWERED","only when the side's later rounds answered every such witness","a witness the side's later rounds leave unanswered is graded"];
const J1="grade and COUNT only from the two LINK ROUND blocks above, [CR3] (defender) and [DR3] (challenger); an ANSWER to a pressed witness is read from any later round of the side that holds the link, its round 2 or its link round.";
const check=(t)=>({J1:t.split(J1).length===2,J2:!t.includes("only when this link round quotes")&&t.split(NEW[2]).length===2&&t.includes(NEW[1]),J3:t.split(NEW[3]).length===2&&t.split(NEW[4]).length===2,J4:t.split(NEW[5]).length===2,old_absent:OLD.slice(1).every(o=>!t.includes(o))});
for(const f of ['Build_Independent_Verdict.js','Panel_Build.js']){const b=fs.readFileSync('base/'+f,'utf8'),n=fs.readFileSync('new/'+f,'utf8');
 const PAIRS=JSON.parse(fs.readFileSync('j_pairs.json','utf8'));let r=n;for(let i=PAIRS.length-1;i>=0;i--)r=r.split(PAIRS[i][1]).join(PAIRS[i][0]);
 const c=check(n);console.log(f,JSON.stringify(c),'| J5 reverse of all '+'patch pairs (j_pairs.json) equals base:',r===b,'| parse:',(()=>{try{new Function(n);return true}catch(e){return false}})());
 // J6 one-anchor misedit: J1 applied, the answer clause left old
 const m=b.replace(OLD[0],NEW[0]);const cm=check(m);console.log('  J6 mutant (J1 only): J2',cm.J2,'old_absent',cm.old_absent,'-> caught:',!(cm.J2&&cm.old_absent));
 console.log('  base:',JSON.stringify(check(b)));}
