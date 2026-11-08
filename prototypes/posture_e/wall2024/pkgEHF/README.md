# pkgEHF: an E-HOLD ask on a witness the side answered names the FORCED line (W3 3109 lane 1 (b))

DeepSeek fix (Judge Enforcer Build, Alt Judge Enforcer Build, on pkgEKD = s59 as staged), plus the matching send-back wording (Send Back Build/Record and the Alt copies, on live s58).

## Fault (33617 terra, the engine share; terra's failure itself is TRUE, W3 3106)
- DeepSeek E-HOLD ruled terra's D2 vs C1 and D4 vs C4 UNDERDETERMINED lines "right: BROKEN" from terra's own MISSES answer checks. The witnesses were answered in [CR3], so under ruling 421 (W3 3093 item 2) a break there is a meaning break that counts only as a FORCED line.
- The send-back ask (pkgUND) said "Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13, ...)". The K-G4 rule naming the FORCED form only came after it. Terra wrote a plain BROKEN line, and the gate's K-G4 then raised that same line.

## Change
1. RULE E-HOLD (DeepSeek) gains one sentence: when the right grade is BROKEN and an ANSWER CHECK line given to DeepSeek quotes the answering side's answer (MISSES or FAILS), the break is one of meaning and counts only as a FORCED line. The reason must say so and name the line in the form FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "...". It must never ask for a plain LINK BROKEN line on a witness the side answered.
2. The send-back option reads "CHANGE TO the BROKEN line in its counted layers, Commitment 13 (on a witness the side answered, the FORCED line, below)". It is kept short on purpose: the long form pushed the RETRACTED/keep options past the ask's cut limit (checked: on 33261, 33461, 33490, 33506 and 33617, base and patched both keep all 105 option texts).

## Test (node pkgEHF/test_EHF.cjs): 3 OK, 0 FAIL
- 143 node runs. Judge Enforcer Build (20) and Alt (13) differ only by the sentence. Send Back Build (20) and Alt (6) differ only by the added words, including asks cut at their limit. Send Back Record and Alt Record do not change in any run.
- 33617 Send Back Build terra S9: the option names the FORCED line, and the K-G4 rule with "FORCED: D2 vs C1" follows.

## Shas (plan_EHF.json)
Judge Enforcer Build 2cb78eabaca7 -> be497440a9c8; Alt 79898dee1307 -> 8234032a8929 (both on pkgEKD). Send Back Build fce7a381bd93 -> 56ffd3ed6fbb; Send Back Record bbc6947a54ec -> bcb326a3eadd; Alt Send Back Build dc902df8e797 -> 5f3d43725104; Alt Send Back Record 51d3b2d94d44 -> 76401169de4d.

## Live bar
An E-HOLD DISAGREE (right: BROKEN) on a witness answered in a later round names the FORCED line in its reason, and no judge is removed by K-G4 for following an E-HOLD ask.
