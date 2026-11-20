# ASK 510 plan (W3, seat 33), rev 1, 2026-11-20

## Objective
The enforcer checks every MEETS, STANDS and UNDERDETERMINED grade against the judges' own rule that one verse read alone does not give a contested fact (Commitment 8; Commitment 13, "No verse decides alone: single verse doctrine is prohibited (Isaiah 28:10)"), and against a grade that leaves its point for another collision to decide. Either side alike (ruling 364).

## Source
The operator, 14:57Z 2026-11-20, W4's thread, on run 41043: "how can debate guidelines be ignored over and over. we are still on the single verse doctrine. and the judges continue to ignore the Davidic seed. and didn't prove mixing seed is lawful. Sonnet's rebuttal alone can't carry weight." Assigned by the coordinator 14:58Z (Wall 10264).

## Evidence (run 41043, debate 45f53596; debate_enforcer_log, read 11-20)
1. The enforcer upheld the one-verse grades. E-ANS "ANSWER CHECK Leviticus 19:19 [DR3]" (answer: "The child is of the woman's kind, and the Highest's part is power..."; judges' MEETS rest on "thy cattle" and "thy field"): ENFORCER AGREE (right: MEETS) for sol (47674), sol62 (47673) and chatgpt (47707). E-ANS "[CR4]": AGREE MEETS for sol (47647) and chatgpt (47691).
2. The enforcer pushed a judge toward the one-verse grade. sol62 graded [CR4] MISSES; the enforcer wrote DISAGREE (right: MEETS) (47646); sol62 kept MISSES on send-back (47811, "does not show that 'the power of the Highest shall overshadow thee' is an instance of the keeper letting 'thy cattle gender'...").
3. Deferral upheld. E-HOLD "COLLISION D5 vs C5", all three UNDERDETERMINED, grounds "do not of themselves fix the last generation" (sol62), "The lineage comparison does not independently establish the immediate begetter" (sol): ENFORCER AGREE (47755, 47759, 47762), "do not settle the intervening route".
4. Cause: the enforcer's rule text (Shared Library, RULE E-ANS line 3192; RULE E-HOLD line 3196, live engine c6e630a4) carries the absence rule but not Commitment 8's one-verse rule or Commitment 13's "No verse decides alone". MISSES is defined only as an absence or not addressing the meaning; STANDS and UNDERDETERMINED have no test for a ground that reads witnesses alone. The code checks K-S, K-S2, K-C and K-LYR read only the retired "no verse states it" form.

## The change (enforcer rule text only)
C1. RULE E-ANS gains, after its MISSES sentence: "MISSES also when the fit rests on a contested fact that one verse read alone gives and the rows the record lays beside it, read together, do not give: for example an answer that holds a verse's own words narrower than the meaning pressed and shows no other row for the narrowing (Commitment 8: one verse read alone does not give a contested fact; Isaiah 28:10). Your reason names the fact and the one verse it rests on. Either side alike."
C2. RULE E-HOLD gains, after its UNDERDETERMINED sentence: "STANDS or UNDERDETERMINED is not right when its ground reads the pair's witnesses alone (they 'do not of themselves', 'do not independently' fix the point) or leaves the point for another collision to decide: a pair is graded on its verses read together with the rows the rounds lay beside them, and no verse decides alone (Commitment 13; Isaiah 28:10). Read the grade again with them together, and give the right grade."
C3. Effect (for the card): a DISAGREE goes back to the judge once with its quoted reason, through the existing send-back path, and the judge keeps the decision (ruling 428). C3a ENFORCED as above (recommended: the operator asked for the enforcer to act). C3b recorded only (a TRIAL note, not sent back).

## Not changed
The judges' Commitments (8 and 13 already say it), the code checks K-S, K-S2, K-C, K-LYR, the outcome rules, the send-back apply path, the debater prompts. Both library copies carry the same lines (W4 confirms where).

## Checks (W4)
- Offline: the two strings change and nothing else; the library parses; the enforcer prompt size (ESR_W weights for E-ANS and E-HOLD) still fits under ESR_CAP.
- Live replay (needs the operator's word, small model cost): the enforcer on the 41043 items above. Expected: [DR3] Leviticus 19:19 MEETS by sol, sol62, chatgpt gets DISAGREE (right: MISSES) naming the fact and Leviticus 19:19; sol62's [CR4] MISSES gets AGREE; D5 vs C5 UNDERDETERMINED gets DISAGREE with the right grade read from Acts 2:30, Hebrews 7:10 and Romans 1:3 together.

## Revert
Write back the pre-510 engine and child (saved by W4), on the operator's word.

## Roles
W3 plans and grades; W4 builds, checks, and posts the card in W4's thread. Second grade held (W1 and W2 asleep).
