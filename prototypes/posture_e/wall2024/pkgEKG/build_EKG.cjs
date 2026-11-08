// pkgEKG (W1, 11-08): DeepSeek K-W prompt: the flagged grant or withdrawal sentence never counts as the side "still claiming" the fact.
// Fault: on K-W, DeepSeek decides NEEDS from "does the side still claim that same fact?" and then quotes the flagged grant itself as the claim,
// e.g. 33490 "The side still claims "I grant Mary says "thy father""", 33575 "The side still claims it, "I grant he is called husband"". It then
// requires the judge's layer to carry the OTHER side's granted point and writes DISAGREE with STANDS WITHOUT IT. Saved runs: 19 of the 31 K-W
// "DISAGREE: NEEDS: YES" rows quote the flagged sentence as the still-claim (33575 10, 33490 7, 33218 1, 33371 1).
// Change: one added passage in the K-W rule text, after "still claim that same fact?". Nothing else changes.
// Base: pkgESH patched (live s55 + pkgESH). Run from wall2024/: node pkgEKG/build_EKG.cjs
const fs=require('fs');const crypto=require('crypto');const h=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const s0=fs.readFileSync('pkgESH/patched/Enforcer_Build.js','utf8');
const A="Does the side, anywhere in its blocks for this link, still claim that same fact? ";
const ADD="The flagged sentence itself never counts as the side still claiming the fact. For a grant (I grant X), X is the other side\\'s point: the fact at risk is the footing of this link that X answers, and the side still claims it only when other words of its own, outside the grant, still assert that footing; quoting the grant or restating X is not such a claim, and the judge\\'s layer is never required to carry X itself. For a withdrawal (I withdraw X), the side still claims X only when other words of its own assert X again (pkgEKG). ";
if(s0.split(A).length!==2)throw new Error('anchor '+(s0.split(A).length-1));const s=s0.replace(A,()=>A+ADD);new Function('$','$input',s);
fs.writeFileSync('pkgEKG/patched/Enforcer_Build.js',s);fs.writeFileSync('pkgEKG/plan_EKG.json',JSON.stringify({base:'live s55 + pkgESH',nodes:{'Enforcer Build':{base_ESH:h(s0),patched:h(s)}}},null,1));console.log(h(s0),'->',h(s));
