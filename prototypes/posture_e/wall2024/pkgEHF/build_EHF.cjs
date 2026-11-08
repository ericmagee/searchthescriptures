// pkgEHF (W1, W3 3109 lane 1 (b); 33617 terra): an E-HOLD ask on a witness the answering side answered names the FORCED line.
// 1. DeepSeek (Judge Enforcer Build, Alt Judge Enforcer Build, on pkgEKD = s59 as staged): RULE E-HOLD gains one sentence: a BROKEN reading on an
//    answered witness is a meaning break; the reason names the FORCED line, never a plain LINK BROKEN line.
// 2. Send-back ask (Send Back Build, Send Back Record, Alt Send Back Build, Alt Send Back Record, on live s58): the pkgUND option "CHANGE TO the
//    BROKEN line in its counted layers" adds the FORCED form for an answered witness, so it no longer reads against the K-G4 rule below it.
// Run from wall2024/: node pkgEHF/build_EHF.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s58.json','utf8'));
const A1="AGREE when the judge\\'s grade is right; DISAGREE when it is not.\\n'\n +'RULE E-KEY (the keystone line).";
const B1="AGREE when the judge\\'s grade is right; DISAGREE when it is not. When the right grade is BROKEN and the answering side answered the pressed verse (an ANSWER CHECK line given you quotes its answer, graded MISSES or FAILS), the break is one of meaning and counts only as a FORCED line for the pair (ruling 421; the gate checks it, K-G4): your reason says so and names it, FORCED: <Dn vs Cm> -- MEANS [<round>]: \"<the pressing sentence>\" -- ANSWER [<round>]: \"<the answer\\'s words>\" -- FAILS: \"<the words that cannot agree>\". Never ask for a plain LINK BROKEN line on a witness the side answered (pkgEHF).\\n'\n +'RULE E-KEY (the keystone line).";
const A2="Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13, or a STANDS line";
const B2="Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13 (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: \"...\" -- ANSWER [<round>]: \"...\" -- FAILS: \"...\"), or a STANDS line";
const A3="A CHANGE TO here replaces only this line and cannot add the FORCED line.";
const B3="A CHANGE TO here replaces only this line: on a witness the side answered, CHANGE TO the BROKEN line that names the meaning the answer fails, and give the FORCED line when the gate asks for it (K-G4, ruling 421); never write that the witness was left unanswered.";
const plan={base:'Judge Enforcer Build: pkgEKD/patched; Alt Judge Enforcer Build: pkgEAK/patched (s59 as staged); Send Back nodes: live s58 (fetchback_live_s58.json)',nodes:{}};
for(const f of ['Judge_Enforcer_Build','Alt_Judge_Enforcer_Build']){const s0=fs.readFileSync((f==='Alt_Judge_Enforcer_Build'?'pkgEAK':'pkgEKD')+'/patched/'+f+'.js','utf8');if(s0.split(A1).length!==2)throw new Error(f+' A1');const s=s0.replace(A1,()=>B1);new Function('$','$input',s);fs.writeFileSync('pkgEHF/patched/'+f+'.js',s);plan.nodes[f.replace(/_/g,' ')]={base:h(s0),patched:h(s)};}
for(const n of ['Send Back Build','Send Back Record','Alt Send Back Build','Alt Send Back Record']){const s0=W.nodes.find(z=>z.name===n).parameters.jsCode;if(s0.split(A2).length!==2)throw new Error(n+' A2 '+(s0.split(A2).length-1));let s=s0.replace(A2,()=>B2);const k3=s0.split(A3).length-1;if(k3>1)throw new Error(n+' A3');if(k3===1)s=s.replace(A3,()=>B3);new Function('$','$input',s);fs.writeFileSync('pkgEHF/patched/'+n.replace(/ /g,'_')+'.js',s);plan.nodes[n]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgEHF/plan_EHF.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
