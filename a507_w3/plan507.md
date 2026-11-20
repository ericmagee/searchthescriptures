# ASK 507 plan rev 0 (W3, seat 33, 11-20; live base engine 783e9f44, child d6908ec6, library 680dd2af97c187be, manual v224 f56bd34a): at the verdict, each judge weighs each side's whole position and says which one holds

Team: W3 plans, W4 checks against live and builds (the operator, 03:45:05Z: "Just you two."). The second non-builder grade is HELD.

## 1. THE OPERATOR'S WORDS (W4's thread, 01:43 and 01:45 CST 11-20)
- "The problem we have is that these judges are not considering the link. They are not considering Isaiah 28 and 10 because we are pointing at scriptures that talk about the divine seed and scripture that talks about flesh and, you know, different types of seeds, celestial and flesh, that they and the law about mixing seeds. So how can they conclude that or dismiss that? In addition to, there's another paradox here. The judges ruled that both sides were prop supported. Either one side is right or wrong. Either Christ had a biological father or he didn't. So there is something majorly wrong going on here outside of what we may potentially have wrong. The judges are in a paradox and their judging is not logical."
- "The judges must be clearly told at the point of the verdict that they have to look at each side's complete position or link and judge to see which one holds. Are they saying both sides gave incompetent testimonies?"
- Opening rule (manual section 1): "The DEFENDER holds a declared chain on the topic; the CHALLENGER presses the opposing view and wins only by breaking that chain."

## 2. WHAT RUN 41024 SHOWS (W3 read debate_judgments 1245, 1246, 1247 and their AUDIT v25 lines from SQL)
| seat | own verdict | own standings (D / C) | own RESULT | after the close-contradiction recount |
|---|---|---|---|---|
| sol62 | BROKEN | PROP-DEPENDENT c=2 / SELF-SUPPORTED c=0 | UNDERDETERMINED | C: PROP-DEPENDENT c=0; RESULT UNDERDETERMINED |
| terra (seat chatgpt) | HELD | SELF-SUPPORTED c=0 / SELF-SUPPORTED c=0 | UNDERDETERMINED | C: PROP-DEPENDENT c=0; RESULT DEFENDER WINS |
| sol | BROKEN | PROP-DEPENDENT c=3 / SELF-SUPPORTED c=0 | CHALLENGER WINS | C: PROP-DEPENDENT c=0; RESULT UNDERDETERMINED |
- Correction to W4's fact (a): sol62 graded the CHALLENGE SELF-SUPPORTED. In all three seats the challenger's PROP-DEPENDENT came from the recount, not from the judge. ("ORIGINAL: ... CHALLENGE SELF-SUPPORTED 0" in each AUDIT v25.)
- The recount: the challenger's closing contradiction broke C6 (D2 vs C6, UNDERDETERMINED to CHALLENGER LINK BROKEN) in all three seats. Shared Library L1346-1347, stand(): a side with any link graded BROKEN (brk) or a count of 1 or more is PROP-DEPENDENT. That matches the judges' own rule ("A side with any link graded BROKEN here cannot be SELF-SUPPORTED", Panel Build and Build Independent Verdict). It does not match the manual's STANDINGS definition, which names the count only ("PROP-DEPENDENT when the count is 1 or more"), and it prints "L=6 c=0" beside PROP-DEPENDENT, which a reader cannot add up.
- The two judges who wrote UNDERDETERMINED themselves did so with only one side weakened: terra held the chain and found both sides SELF-SUPPORTED; sol62 broke the keystone and found the challenge SELF-SUPPORTED, then wrote "[L4] those conception rows overturn the proposed prior union without settling the route of ...". Neither said which complete position holds.
- The cause, as W3 reads it: every grade is made link by link (COLLISION POINTS), and each STANDING is a count for one side alone. Nothing in the judgment ever sets the two whole positions side by side. So "both sides PROP-DEPENDENT" and "both sides SELF-SUPPORTED" are both reachable, and both answer nothing about the topic. The Isaiah 28:10 method is already in the judges' text 11 times (THE METHOD, CHAIN SCOPE, Commitment 8, Commitment 16), but it is applied inside one collision at a time. A single collision (Matthew 1:20, Matthew 1:18) can break a link without the defender's whole witness on the seed being read against it.

## 3. OBJECTIVE
At the verdict, every judge states each side's whole position, reads each one with all of its witnesses together (Isaiah 28:10), and names the one that holds, in layers, meeting the other side's strongest witness. The judge's grades must agree with that finding. Expected effect: no judgment ends with both positions standing or both propped and no side named; a reader sees which position the judge found holds and why.

## 4. THE CHANGE (W4 locates every copy from fresh live reads; touched text only; no model settings; reasoning untouched)
C1. WHOLE POSITIONS, a new section of reasoning after COLLISION POINTS and before the RESULT line (all judge requests: Panel Build, Build Independent Verdict, Reserve, Alternate; and every cure or send-back form that restates the judgment), both sides alike (ruling 364):
   `DEFENDER'S POSITION: "<the whole declared chain on the topic, in plain words>" -- RESTS ON: <each link's own witnesses, [L1]/[L2]/[L3] by reference, read together>`
   `CHALLENGER'S POSITION: "<the opposing view as the challenger pressed it, in plain words>" -- RESTS ON: <its witnesses, read together>`
   `WHICH HOLDS: DEFENDER | CHALLENGER -- DECIDES [L4]: "<the inference, one sentence>" -- FROM: <the lower layers of both positions, read together> -- MEETS: [<round>] "<the strongest witness of the position that does not hold, quoted>" -- WHY IT FAILS: <the lower layer it cannot agree with>`
   The rule text: the two positions answer one question on the topic and cannot both hold. Read each position whole, every witness together, precept upon precept (Isaiah 28:10); a verse that seems to decide one link does not overrule a position's whole witness unless, read with it, it cannot agree. Name the one that holds. A position's standing (how it was argued) is not the finding of which one holds. The DECIDES form is ASK 504's, so the enforcer and dec504() read it unchanged.
C2. Agreement with the grades: WHICH HOLDS: CHALLENGER requires the verdict BROKEN (k >= 1, or BROKEN-2); WHICH HOLDS: DEFENDER requires the verdict not BROKEN. A mismatch, a missing WHICH HOLDS, or a WHICH HOLDS without its DECIDES form goes back once on the existing E-COL send-back path with both cures: regrade the collision lines the finding contradicts, or change the finding (the judge keeps the decision, ruling 428). Uncured: as ASK 504 R1 (the grade stays, drv_uncured, alt_needed).
C3. Commitment 13 (one text, byte-identical in every copy): "At the verdict I set the two whole positions side by side, read each with all its witnesses together, and name the one that holds; my grades agree with it."
C4. The seat's RESULT word: unchanged in this build (rd386, rulings 494, 404, 488; ASK 505 C0). WHICH HOLDS is written, checked and shown, not counted. Whether WHICH HOLDS should decide the seat's RESULT word is a separate card line for the operator, because it revisits ruling 494 and his 22:29 CST 11-19 ruling (a side PROP-DEPENDENT on two or more judges cannot win). W3 recommends asking it only after a run shows WHICH HOLDS in use.
C5. The recount W4 asked about (pkgCEC close contradiction, then cureRecompute stand(), L1346-1347): no change to the rule in this ASK. It does what the judges' rule says. The defect a reader sees is "L=6 c=0" printed beside PROP-DEPENDENT. That belongs with ASK 505 C3 (the standing words beside their numbers), which still waits on which transcript members read. For 505 C3, W3 recommends the gloss name the break: "PROP-DEPENDENT (no premise conceded; link 6 broken by its own closing contradiction)".

## 5. QUESTIONS
For the operator, one at a time, on W4's cards:
1. The build card for C1 to C3 (the operator's words in section 1 are the request).
2. Later, only after a run: should WHICH HOLDS decide the seat's RESULT word (C4)? The card quotes ruling 494 and his 22:29 ruling.
Not for the operator: the form, the Commitment's home, and C5's placement (design, the team's).

## 6. CHECKS
- B1 (W4, offline): changed nodes and sizes; the added prompt text (about 1k characters per request); the added reply length (three short lines per judge).
- B2 (W4, offline): the C2 code check on hand-written judgments: conforming DEFENDER with HELD, conforming CHALLENGER with BROKEN, CHALLENGER with HELD (flagged), DEFENDER with BROKEN (flagged), missing WHICH HOLDS (flagged), WHICH HOLDS with a bare [L4] (flagged by dec504). The 40995 and 41024 judgments, run through it as stored, are flagged as missing WHICH HOLDS and nothing else changes (fields, readers, labels equal live).
- Q1 (the operator's release): every judgment carries both POSITION lines and WHICH HOLDS with DECIDES; the count of C2 send-backs and cures; whether each WHICH HOLDS meets the other side's strongest witness (W3 reads, quoted).

## 7. WRONG-IF
1. Judges write WHICH HOLDS and then regrade their lines only to match it, with no new layers: report it with the lines; do not loosen C2.
2. Judges name a side but MEETS quotes a weak witness, not the strongest: the enforcer item reads MEETS for meaning; if it does not flag it, report before changing text.
3. The section pushes replies past their limits: tighten the form before any limit change (no model setting without the operator's word).

## 8. STEPS
1. W4 checks this plan against live (all judge forms and copies, Commitment 13 copies, the E-COL path, dec504 reuse).
2. W4 builds; B1, B2; W3 grades; W4 tells the operator the second grade is held; his card; write; fetchback.
3. Q1 on his release. Manual entry (W3) on its own card after.
