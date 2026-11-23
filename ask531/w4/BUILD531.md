# ASK 531 BUILD (W4): status, and one plan finding for W3 and W2

Plan: ask531/w3/plan531.md, rev 1a, de0e843c. W2 passed it at Wall 10594 and 10599.

Base: the live engine moMxiV4Irg1uRBZN, version 48513907, and the live child MqQHRl7mQQ0z8QdT, version ac517c41. I read both versions again at 09:2x CST on 11-23 (updatedAt 08:52 CST). Time read from the DB: ⏱ 09:31 CST | 2026-11-23.

**STATUS: NOT READY FOR GRADING.** Applying a cured CHANGE collides with an existing gate rule (section F). The plan must settle this first.

## A. Files (ask531/w4/; none are in git, so W3 is asked to commit)

| file | md5 | what |
|---|---|---|
| build/patch531.py | d90e4cb7 | the build |
| write/body531.py | bcca8552 | builds the PUT bodies from a fresh fetch and asserts that only the named nodes differ |
| write/write531.sh | 82891d9a | asserts patch531.py d90e4cb7 and body531.py bcca8552 |
| write/revert531.sh | 7e1e1c94 | |
| build/target_engine_531.json | 2c7d0743 | |
| build/target_child_531.json | 08da2757 | |
| build/compile531.js, src531.js | | |
| /mnt/project-files/ask523/w4/build/replay523.js | | replays criteria 1 and 2 |
| build/mut524.js, build/fidelity531.js, build/acxdiff.js | | replays criteria 1 and 2 |
| build/synth531.js, synth531b.js, synth531c.js | | criterion 3, and the apply path |
| build/psg531.js | | criterion 4 |
| build/alt531.js, altnode531.js | | the alternate path |
| build/survey531.sql | 4e49d5ef | the WRONG-IF measurement |

The outputs are build/out_*.txt. Run data is in ask531/w4/41418/, ask523/w4/41418/ and ask531/w4/41440/ (child, named nodes only).

The Library LIB sha is daef7f1f6621242e, the same in the engine and the child.

## B. What changes

1. **Nodes that differ.**
   - Engine: Assume Check Record, Send Back Build, Send Back Record, Alt Send Back Build, Alt Send Back Record, and Shared Library.
   - Child: R2 Alt Send Back Build, R2 Alt Send Back Record, and Shared Library.
   - Connections and settings are unchanged.
   - The child's Assume Check Record is a pass-through, so it does not change.
2. **Library lines changed.**
   - 1376 and 1382: psGrades(l,wide).
   - 1435: the apply path, acx531Apply.
   - 2642, 2781, 2785, 2803, 2815 and 2844: the ACXM cure and its status lines.
   - 2929, 2947, 2956 and 2959: the item rule text.
3. **Library lines appended.**
   - 3563 (ACX_FN).
   - 3564 (SBB_BLOCK), placed before "const MAX=60" so that existing sids keep their numbers.
   - 3565 (CNT_LOOP, "AUDIT v65 ASSUMPTION UNCURED").
4. **MAP and stubs.** 21 MAP entries change. The stubs of the 6 Send Back Build and Record nodes gain $("Assume Check Record").
5. **Everything is gated.** Every change in Assume Check Record is gated by M524, which is set when the E-ASSUME prompt holds "EVERY VERSE THE".
6. **A fix since my first draft: the alternate seat set.**
   - The earlier SBB_BLOCK took alternates only from enforcer rows (E421 and E428 with seat_role "alternate"). An alternate with no other enforcer item would have got no E-ASSUME item.
   - It now also takes the seats that Alt Seated / R2 Alt Seated names in alt_seats.
   - With the enforcer rows emptied, the build without the fix gave qwen4max no E-ASSUME item, and the build with it gives one (out_altnode531_noenf.txt).

## C. Criteria 1, 2, 4 and 5

**Criterion 1, the engine on 41418 as stored** (out_crit1.txt). I replayed it from the stored Assume Check Build, so its prompt has no marker.
- Assume Check Record, Send Back Build, Send Back Record and Gate Record are equal to the live replay apart from the empty fields (acx:null, acx_counted:[]).
- Reread and Gate Build are byte-equal.
- Every drv_uncured is unchanged.
- This depends on the prompt. If Assume Check Build is replayed with today's code, which carries the 524 marker, over the stored old reply, items are made and chatgpt counts 3. That is the 524 scope working as designed, not a stored run.

**Criterion 1, the child on 41440 as stored** (out_altnode531.txt).
- The live R2 Alt Send Back Build is byte-equal to its recorded output.
- The target is equal apart from acx:null on each item.

**Criterion 1, runs 41117, 41102, 41090 and 41043.**
- 41117: I read its stored Assume Check Build prompt, and it has no marker.
- 41102, 41090 and 41043: I did not read them. They ran before 524, so the claim rests on the M524 gate.

**Criterion 2, the engine on 41418 under 524** (W1's fixed reply; out_crit2.txt).
- Items go to chatgpt (S11) and sol (S8).
- sol62 gets no item (COUNTED, same_fact_premise 3).
- Defender premise 5 gives no item to any seat.
- With the stored replies, each item is silent. At Send Back Record, chatgpt goes 0 to 1 and sol 0 to 1. At Gate Record, chatgpt goes 1 to 2, sol 1 to 2, and sol62 stays at 1.

**Removal, as the record shows it** (debate_judgments and debate_results for f333ef24):
- sol62 left Gate Record at 1 in the replay, but its stored final drv_uncured is 0 and it judged. So a count above 0 at Gate Record does not by itself remove a seat; a later cure stage runs first.
- sol was removed with 6. The judges were chatgpt, qwen4max and sol62.
- What the later stages would do with chatgpt at 2 needs model calls. NOT ESTABLISHED.

**Criterion 2, alternate qwen4max: a node-level replay of child 41440 R2 Alt Send Back Build, with criterion 2's acx put into Assume Check Record** (out_altnode531.txt).
- qwen4max gets 23 items against 22 stored. The new one is S22 E-ASSUME, premise 91, "Mary is of David's line", with the rule text in its message.
- The KEEP cure in the child reads acx.vq from the pass-through. The send-back record nodes of the child were not replayed.

**Criterion 4, psGrades** (out_psg531.txt):
- "Premise 91" and "Premises 5 and 91" read 91 COUNTED in wide mode only.
- The one-digit forms read the same as the live Library.

**Criterion 5.**
- body531.py run on the live fetch gives the target byte for byte.
- Every MAP entry compiles: engine 49, child 47, problems 0.
- runcheck passes on both.

## D. Criterion 3, synthetic cures (out_synth531.txt)

The six cure rows read as planned:
- A: CURED.
- B: CURED.
- C: UNCURED, counted twice.
- D: UNCURED, pkgPS.
- E: CURED.
- F: UNCURED.

## E. WRONG-IF measurement (survey531.sql)

The record:
- 11 runs, with 24 round 2 facts, taken from claude_r2, which holds the defender's list on 41418.
- 14 judgments that count challenger premises, giving 13 counted segments.
- 9 fact and premise pairs that share a content word:
  - 6 pass the test, and all 6 are truly the same fact, Mary's Davidic line, in 6 wordings.
  - 3 fail, and all 3 are truly different facts.
- No miss and no false match.

Limits:
- The filter of one shared word or more cannot see a rewording that shares none, such as "the mother descends from Jesse".
- It is a SQL copy of the test.
- It includes facts carried into round 3.

## F. PLAN FINDING: the cure the item asks for is flagged by K-UNX (out_synth531b.txt and out_synth531c.txt)

I carried cases A and B through Reread and Gate Record (plan section 3.3, last bullet).

The CHANGE reaches the gate re-read, and in both cases the gate's K-UNX rule raises a new item against it:
- **A** (counts premise 91, as the item tells the judge to do). "RULE K-UNX ... CHALLENGER premise 91: counted UNEXHIBITED in CHALLENGER CONCEDED LINKS as premise 91, but the list against the challenger has premises 1 to 6 (pkgBFX, ASK 266)". This is Library line 466, the RANGE check: a counted premise number past the round 3 list is flagged. Every judge that follows the 531 item by counting 91 will be flagged.
- **B** (counts premise 3 with the same fact). "RULE K-UNX ... CHALLENGER premise 3: counted UNEXHIBITED ... on an ASSUMES ground, but its [DR3] block exhibits L1 and L2 and L3 ...". This is the existing ASSUMES-ground check, the same one sol62's real count of premise 3 meets. It may be the subject of ASK 536 (the false K-UNX flag). I have not read that plan.

With the stored gate replies, the challenger CONCEDED LINKS line stays "0" after Gate Record, with count 0 and standing SELF-SUPPORTED, in every case. The rewrite happens only when the gate answers, so I cannot show the count and the standing following.

What W3 must decide (the build changes nothing until then):
1. Should the RANGE check (pkgBFX) accept a premise number 91 and up that is a round 2 charge in acx.facts under M524? This is the smallest change, inside 531.
2. Does the ASSUMES-ground check need a rule for the same-fact path? This may belong to 536.
