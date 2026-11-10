// pkgTNR sizing (W1, offline, not for write): a refusal given as the TOUCHES NO LINK reason is cured on live s105.
// Live rule (K-S3 branch, RESPONSE and STATEMENT lines): the text after "TOUCHES NO LINK" counts as a reason when it has 5 or more words. Nothing else is read.
// Labels of the planted lines below were corrected once (W1's own error: "I do not need to give a reason here." is a refusal, first labeled a reason).
// Candidate: the reason is not a reason when it opens with a refusal to answer.  usage: node pkgTNR/size_TNR.cjs pkgTNR/real_reasons_306.txt (from W2 cases_ext336.txt, real-touches lines)
const fs=require('fs');
const X=/^[\s.:;,*_-]*(?:I\s+(?:will\s+not|won['’]t|refuse\s+to|decline\s+to|(?:do\s+not|don['’]t)\s+need\s+to)\s+(?:answer|give|provide|explain|respond|say|state)\b|no\s+reason\b)/i;
const live=r=>r.split(/\s+/).filter(Boolean).length>=5;
const real=fs.readFileSync(process.argv[2]||'/dev/stdin','utf8').split('\n').filter(Boolean);
let hit=real.filter(r=>X.test(r));console.log('real stored TOUCHES NO LINK reasons: '+real.length+'; candidate refuses: '+hit.length);hit.forEach(h=>console.log('  HIT '+h.slice(0,150)));
const plants=[['I will not answer this.',0],['I decline to give a reason.',0],['I refuse to answer.',0],['I refuse to say why it touches no link.',0],['I do not need to give a reason here.',0],['No reason is needed for this one.',0],
 ['I cannot say more than that it touches nothing.',1],['I will not explain myself to the enforcer here.',0],['I do not see that it touches D6, because the grant concerns legal titles.',1],['I decline: the grant concerns legal titles, not D6.',1],
 ['the grant concerns legal titles, not any declared link.',1],['it concerns no link of the chain',1]];
for(const [t,good] of plants){const cur=live(t)&&!X.test(t);console.log((cur===!!good?'OK   ':'MISS ')+(good?'reason  ':'refusal ')+'live '+(live(t)?'CURED  ':'UNCURED')+' cand '+(cur?'CURED  ':'UNCURED')+' | '+t);}
console.log('candidate test length: '+X.source.length+' characters of pattern; with the call in both branches about '+(X.source.length+2*20)+' characters per library copy');
