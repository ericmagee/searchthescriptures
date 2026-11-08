# pkgEHF: an E-HOLD ask on a witness the side answered names the FORCED line (W3 3109 lane 1 (b))

DeepSeek fix (Judge Enforcer Build on pkgEKD; Alt Judge Enforcer Build on pkgEAK; both s59 as staged), plus the matching send-back wording (Send Back Build/Record and the Alt copies, on live s58).

## Fault (33617 terra, the engine share; terra's failure itself is TRUE, W3 3106)
- DeepSeek E-HOLD ruled terra's D2 vs C1 and D4 vs C4 UNDERDETERMINED lines "right: BROKEN" from terra's own MISSES answer checks. The witnesses were answered in [CR3], so under ruling 421 (W3 3093 item 2) a break there is a meaning break that counts only as a FORCED line.
- The send-back ask (pkgUND) said "Either regrade it (CHANGE TO the BROKEN line in its counted layers, Commitment 13, ...)". The K-G4 rule naming the FORCED form only came after it. Terra wrote a plain BROKEN line, and the gate's K-G4 then raised that same line.

## Change (rebuilt on pkgEAK with W3 3122 and W2 3123 fixes)
1. RULE E-HOLD (DeepSeek) gains one sentence: when the right grade is BROKEN and an ANSWER CHECK line given to DeepSeek quotes the answering side's answer (MISSES or FAILS), the break is one of meaning and counts only as a FORCED line. The reason must say so and name the line in the form FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "...". It must never ask for a plain LINK BROKEN line on a witness the side answered.
2. The send-back option names the form inline (W2 3123: in 406 of 570 asks, no FORCED form followed a "below"): "CHANGE TO the BROKEN line in its counted layers, Commitment 13 (on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "..."), ...".
3. __kg4R (Send Back Build, Alt Send Back Build; W3 3122): "A CHANGE TO here replaces only this line and cannot add the FORCED line." becomes "A CHANGE TO here replaces only this line: on a witness the side answered, CHANGE TO the BROKEN line that names the meaning the answer fails, and give the FORCED line when the gate asks for it (K-G4, ruling 421); never write that the witness was left unanswered."

## Test (node pkgEHF/test_EHF.cjs): 5 OK, 0 FAIL
- 143 node runs. Judge Enforcer Build (20) and Alt (13) differ only by the sentence. Send Back Build (20) and Alt (6) differ only by the added words and the replaced __kg4R sentence, including asks cut at their limit. Send Back Record and Alt Record do not change in any run.
- 371 send-back options carry the FORCED form inline; 0 asks say "cannot add the FORCED line"; the RETRACTED/keep options survive the cut limit as in base (371 -> 371).
- 33617 Send Back Build terra S9: the option names the FORCED form, and "cannot add" is gone.

## Shas (plan_EHF.json)
Judge Enforcer Build 2cb78eabaca7 (pkgEKD) -> 1b91af370950; Alt Judge Enforcer Build e80c75967029 (pkgEAK) -> 5bb9b1a348f2. Send Back Build fce7a381bd93 -> 3b0b1c0487e0; Send Back Record bbc6947a54ec -> 07d2ed148f57; Alt Send Back Build dc902df8e797 -> 499f2893ae5c; Alt Send Back Record 51d3b2d94d44 -> 270c08efcf5f (send-back bases = live s58).

## Live bar
An E-HOLD DISAGREE (right: BROKEN) on a witness answered in a later round names the FORCED line in its reason, and no judge is removed by K-G4 for following an E-HOLD ask.
