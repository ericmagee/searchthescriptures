# ASK 515 plan (W3, seat 33), rev 2, 2026-11-20

## Rulings and source
- The operator, W4 thread, on run 41090 (ODV1-41090-huztfawp, debate 97ae3ffd): 11:32 CST "the above is still the 1 verse doctrine"; 11:35 "why would you restrict 'one-verse rule' to certain areas"; 11:36 "'one-verse rule' is not an isolated issue".
- Assigned by the coordinator (Wall 10290). W3 plans, W4 builds, two non-builder seats grade, card in W4's thread.
- 11:37 CST: "none of our fixes are for single case instances ... that the equivalent to hard coding." Rule text names no verse, no topic and no quoted judge phrase; the principle is stated once and replaces 510's case-bound sentences. (rev 2)
- My mistake: ASK 510 (my plan) put the rule on E-ANS and E-HOLD only, the two checks 41043 showed failing. The rule governs every grade; scoping it to two checks left E-COL open, and 41090 failed there.

## Objective
Every grade the enforcer checks is checked against the one-verse rule, either side alike: a grade whose deciding step reads one verse or one passage alone, without weighing the rows on the same point that either side laid in the record, gets ENFORCER DISAGREE and goes back once. A send-back answered by rewording while keeping the grade is recorded as kept, not as cured.

## Inventory (live library d45d546d, lib513.json index = line - 1)
1. Judges' agreement (PART2, idx 3270; Alternate copy idx 2962): BOUND. Commitment 8 ("one verse read alone does not give a contested fact", for answers); Commitment 13 deciding step (ASK 361 sentence, idx 2399/3487: "No verse decides alone: single verse doctrine is prohibited (Isaiah 28:10)"); Commitment 16 item 2 (idx 2400/3234/3488 and THE METHOD head idx 3250, prepended to every judge request); the agreement text "The wording of one verse alone never decides a link". The judges are told; 41090 shows they still break on one passage. The gap is enforcement.
2. Enforcer (RULES idx 3192-3204; SYS idx 3191): SYS carries Commitment 16 item 2 as context only. As a grading test it binds E-ANS and E-HOLD (ASK 510) and nothing else. NOT BOUND: E-VOID, E-COL, E-SYN, E-KEY, E-PREM (and its two sub-rules), E-RES, E-B7.
3. Code checks: K-S and K-C (idx 773, 794, 824-825) guard the reverse direction (no demand that one verse state a link). The layer checks (idx 1921, RESULT and KEYSTONE lines; idx 3549-3552, critical points) count verses on layer lines and accept two verses; they pass Luke 1:34-35 or Matthew 1:18 with 1:25, because they cannot tell whether the other side's rows were weighed. That is a meaning test, which code cannot make; it belongs to the enforcer. No code check change.
4. Alternate and R2 paths: the child carries the same Shared Library; W4 confirms the alternate enforcer reads the same RULES string, so one change binds both.
5. Outcome derivation (derive_debate_outcome, RESULT arithmetic): reads grades, not verses. Closed upstream by item 2; no change.

## The change
C1. A new first rule at the head of RULES (before RULE E-ANS), 854 characters (head515.txt, md5 def282f5):
"RULE ONE VERSE (it binds every rule below, either side alike). No verse decides alone: single verse doctrine is prohibited (Isaiah 28:10; the judges' Commitments 8, 13 and 16 item 2). A grade or line you check (an answer check, a VOID, a collision line FORCED, LINK BROKEN, STANDS or UNDERDETERMINED, a synthesis sentence, a keystone, a premise ruling, a RESULT reason) is not right when the step that decides it reads one verse, or one passage, alone and does not weigh the rows on the same point that either side laid in the record and that the item gives you, or when it leaves its point for another line to decide. Then DISAGREE, give the right grade, and name in your reason the verse or passage read alone and at least one row on the same point that the line left unweighed, quoted from the item. Rows the item does not give you, you do not supply."
C2. The ASK 510 sentences are REMOVED, so the principle stands once and no rule quotes a judge phrase (11:37 ruling): in RULE E-ANS the sentence beginning "MISSES also when the fit rests on a contested fact" through "Either side alike. "; in RULE E-HOLD the sentence beginning ". STANDS or UNDERDETERMINED is not right when" through "and give the right grade" (the sentence that follows, ". BROKEN when", keeps its full stop). Their content (one verse read alone; leaving the point to another collision) is in the head, in general words.
C3. Size: the head goes to every enforcer call. ESR_BASE (7979, the fixed-text allowance in the packer) rises by the head's length as built. ESR_W for E-ANS and E-HOLD stay as they are (510 did not change them). No other constant changes.
C4. Part (b), the reworded cure. Today a send-back answered "CHANGE TO" with the same grade word is CURED (41090: E-HOLD 48115, 48116, 48126, 48127, 48128 sol; 48130, 48134, 48135, 48136 sol62, each UNDERDETERMINED again with "independently" and the like dropped). The judge keeps the decision (ruling 428), so the line stands as the judge wrote it; the change is only how it is recorded, and it is decided by the grade alone, never by words: when the CHANGE TO line's grade word equals the grade sent back, the row's status is KEPT (grade unchanged), not CURED, and the transcript and the AAR counts show it as a kept disagreement. Nothing is sent back a second time; no seat is removed.
- Option C4a (recommended): KEPT as above.
- Option C4b: count it CURED as today (no change to part b).

## Not changed
The judges' requests and Commitments, the code checks, the outcome rules, the debater prompts, the send-back path (once, ruling 428), every other enforcer rule's text.

## Checks (W4)
- Offline: RULES gains only the head and loses only the two 510 sentences; no rule text names a verse, a topic or a judge phrase; the library parses; every stub rebuilds; ESR_BASE changes by the head's length only.
- Confirm the E-COL items for 41090 D4 vs C4 and D5 vs C1 (48018-48027, 48225-48228) give the enforcer rows the other side laid on that point (the witness ledger), or say which they lack. Without them the head cannot name an unweighed row, and that limit goes on the card.
- C4: replay the nine 41090 E-HOLD send-backs: each reads KEPT; a send-back that changes the grade (48106, UNDERDETERMINED to BROKEN) stays CURED.
- Live replay of the 41090 E-COL items on the operator's word (small model cost). Expected: DISAGREE on the D4 vs C4 and D5 vs C1 breaks that rest on Luke 1:34-35 or Matthew 1:18 with 1:25 alone, naming a row left unweighed, if the item gives it. The rows the operator named (Romans 1:3, Acts 2:30, Matthew 1:20, John 1:14, Hebrews 2:14-17, John 3:6) are evidence for this check only; they are not in any rule text. The 41043 E-ANS and E-HOLD items are replayed too, so removing the 510 sentences loses nothing.

## Revert
Write back the pre-515 engine and child (saved by W4), on the operator's word.

## Roles
W3 plans; W4 builds and posts the card in W4's thread; two non-builder graders (the coordinator's note).
