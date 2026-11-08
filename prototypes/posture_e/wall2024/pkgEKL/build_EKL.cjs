// pkgEKL (W1, W3 ruling 3167 item 1 (a); 33644 and saved runs): DeepSeek RULE K-W turned a judge's wrong layer into CONCEDED when the side's
// own words outside the grant or withdrawal still carry the fact. K-W asks whether the side still claims the fact; a wrong layer is not a
// concession. Change, in RULE K-W of Enforcer Build and Alt Judge Enforcer Build (base pkgEKN/patched = s61):
// 1. Still claims, and its own kept words carry the fact: STANDS WITHOUT IT is right; a layer carrying only the granted or withdrawn point is
//    DISAGREE with the sentence "right: STANDS WITHOUT IT because <the side's kept words, quoted>". CONCEDED only when no words of the side
//    outside the flagged sentence carry the fact.
// 2. NOT HELD (pkgEKN) is graded on the same line.
// Run from wall2024/: node pkgEKL/build_EKL.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const A1="If it still claims it, STANDS WITHOUT IT is right only when the layer the judge names carries that same fact in its own words; if the named layer does not carry it, the right answer is CONCEDED: AGREE with CONCEDED and DISAGREE with STANDS WITHOUT IT.";
const B1="If it still claims it, the question is whether words of the side outside the flagged sentence carry that fact, that is, rest it on a verse they quote (a bare restatement of the claim carries nothing). If they do, the link stands on them and STANDS WITHOUT IT is right: AGREE when the layer the judge names carries that same fact; when the named layer carries only the granted or withdrawn point, DISAGREE and write in your sentence \"right: STANDS WITHOUT IT because <the side\\'s own kept words, quoted>\" (a wrong layer, not a concession). Only when no words of the side outside the flagged sentence carry the fact is CONCEDED right: AGREE with CONCEDED and DISAGREE with STANDS WITHOUT IT (pkgEKL).";
const A2="DISAGREE when the right answer is CONCEDED (the side still claims the fact and neither the reason nor the words it quotes carry it), or when the reason supplies footing the side never gave.";
const B2="DISAGREE when the right answer is CONCEDED (the side still claims the fact and no words of the side outside the flagged sentence rest it on a verse they quote), or when the reason supplies footing the side never gave; when the side\\'s kept words carry the fact but the reason does not quote them, DISAGREE and write \"right: STANDS WITHOUT IT because <the side\\'s own kept words, quoted>\" (pkgEKL).";
const plan={base:'pkgEKN/patched (live s61)',nodes:{}};
for(const f of ['Enforcer_Build','Alt_Judge_Enforcer_Build']){const s0=fs.readFileSync('pkgEKN/patched/'+f+'.js','utf8');for(const a of [A1,A2])if(s0.split(a).length!==2)throw new Error(f+' anchor '+a.slice(0,30)+' x'+(s0.split(a).length-1));
 const s=s0.replace(A1,()=>B1).replace(A2,()=>B2);new Function('$','$input',s);fs.writeFileSync('pkgEKL/patched/'+f+'.js',s);plan.nodes[f]={base:h(s0),patched:h(s)};}
fs.writeFileSync('pkgEKL/plan_EKL.json',JSON.stringify(plan,null,1));console.log(plan.nodes);
