# ASK 531 BUILD (W4), for W2's grade

**Plan.** ask531/w3/plan531.md, rev 1b (text fix 0d641e7b, commit 7c0f50c8). W2 passed it at Wall 10629.

**Base.** The live engine moMxiV4Irg1uRBZN, version 48513907, and the live child MqQHRl7mQQ0z8QdT, version ac517c41. Both were last changed at 08:52 CST on 11-23, and I read them again this morning.

**Status.** Ready for grading. Nothing is written. The write waits on the operator's card in W4's thread, once the coordinator clears it.

## A. Files (ask531/w4/)

Changes since the earlier version of this file are marked "new" or "rerun".

| file | md5 | what |
|---|---|---|
| build/patch531.py | d73ad624 | the build (new) |
| write/body531.py | bcca8552 | |
| write/write531.sh | e2de8e50 | asserts patch531.py d73ad624 and body531.py bcca8552 |
| write/revert531.sh | 7e1e1c94 | |
| build/target_engine_531.json | fa7711aa | |
| build/target_child_531.json | 577679a6 | |
| build/crit6_531.js | 9eb3de64 | output out_crit6_531.txt, 2dcf442d |
| build/bkc531.js | ec5b7077 | output out_bkc531.txt, d495c305 |
| build/kunx531.js | | |
| build/out_fid531_gate.txt | be7b4872 | |

- **Replay tools.** /mnt/project-files/ask523/w4/build/replay523.js, build/mut524.js, fidelity531.js and acxdiff.js replay criteria 1 and 2. synth531.js, synth531b.js and synth531c.js cover criterion 3 and the apply path. psg531.js covers criterion 4. alt531.js and altnode531.js cover the alternate path. survey531.sql (4e49d5ef) is the WRONG-IF measurement.
- **Outputs.** build/out_*.txt, all rerun on this build.
- **Run data.** In ask531/w4/41418/, ask523/w4/41418/ and ask531/w4/41440/. The child data is named nodes only.
- **Library LIB sha.** cf88f4765f035f23, the same in the engine and the child (runcheck OK on both).

## B. What changes

1. **Nodes that differ.**
   - Engine: Assume Check Record, Send Back Build, Send Back Record, Alt Send Back Build, Alt Send Back Record, Shared Library.
   - Child: R2 Alt Send Back Build, R2 Alt Send Back Record, Shared Library.
   - Connections and settings are unchanged. The child's Assume Check Record is a pass-through.
2. **Library lines changed.**
   - 461: pkgBKC, change 5b.
   - 466: the RANGE check pkgBFX, change 5a. This is line 467 on 0e05fc55.
   - 1376 and 1382: psGrades(l,wide).
   - 1435: acx531Apply.
   - 2642, 2781, 2785, 2803, 2815 and 2844: ACXM.
   - 2929, 2947, 2956 and 2959: the item text.
3. **Library lines appended.**
   - 3563: ACX_FN, which now also holds acx531R2Charge.
   - 3564: SBB_BLOCK, before "const MAX=60".
   - 3565: CNT_LOOP.
4. **MAP.** 25 MAP entries change. ACX_FN goes first in every node that holds the apply path, a send-back node, or bkcKeep2024. The last group adds Panel Payloads, Alternate Payloads, R2 Alternate Payloads and Extract Independent Verdict, which hold the K-UNX lines.
5. **Stubs.** The 6 Send Back Build and Record stubs gain $("Assume Check Record").
6. **Gating.** Assume Check Record changes only under M524, that is, when the prompt holds "EVERY VERSE THE".
7. **Alternates.** They are taken from Alt Seated alt_seats as well as from the enforcer rows. Without this, an alternate with no other enforcer item got no E-ASSUME item. With the enforcer rows emptied, the old build gives 0 items and this build gives 1 (out_altnode531_noenf.txt).
8. **Change 5a.** `if(mx&&j>mx){if(acx531R2Charge(side,j))continue;...}`. A CHALLENGER premise of 91 or more passes when acx.facts holds an r2, both_not_stated fact with that number. Any other number beyond the list is flagged as today.
9. **Change 5b.** In bkcKeep2024, F (same number) is joined by the both_not_stated facts of the same side under another number that acx531Same ties to the ASSUMES clause. The existing word test then runs on F unchanged: 2 or more shared words, one of them not a proper name.

## C. Criteria 1 to 5 (all rerun on fa7711aa / 577679a6)

1. **41418 as stored** (from its stored Assume Check Build, so no marker; out_crit1.txt). Assume Check Record, Send Back Build, Send Back Record, Gate Build and Gate Record are equal apart from the empty acx fields. Reread is byte-equal. Every drv_uncured is unchanged.
2. **Child 41440 as stored.**
   - Live R2 Alt Send Back Build is byte-equal to the recorded output, and the target is equal apart from acx:null.
   - R2 Alt Gate Build, R2 Alt Gate Record and R2 Alt Late Gate Build on the target are byte-equal to the recorded output (out_fid531_gate.txt).
3. **The other runs.** 41117's stored E-ASSUME prompt has no marker. 41102, 41090 and 41043 were not read; they ran before 524.
4. **Criterion 2, 41418 under 524** (W1's reply; out_crit2.txt).
   - Items go to chatgpt (S11) and sol (S8). sol62 gets none: it is COUNTED, with same_fact_premise 3. Defender premise 5 gives no item.
   - Each item is silent. At Send Back Record, chatgpt and sol go from 0 to 1. At Gate Record, they go from 1 to 2. sol62 stays at 1.
   - **The record on removal.** sol62 left Gate Record at 1 in the replay, but its stored final drv_uncured is 0 and it judged. sol was removed with 6. So a count above 0 at Gate Record does not by itself remove a seat. What chatgpt's 2 leads to is NOT ESTABLISHED.
5. **Alternate qwen4max** (node replay of child 41440 R2 Alt Send Back Build with criterion 2's acx). It gets S22, E-ASSUME premise 91, with the rule text (out_altnode531.txt).
6. **Criterion 3.** Cases A to F give the planned cure rows (out_synth531.txt).
7. **Criterion 4.** psGrades: 91 is read only in wide mode, and the one-digit forms match the live Library (out_psg531.txt).
8. **Criterion 5.** body531.py on the live fetch gives both targets byte for byte. All MAP entries compile (engine 49, child 47), and runcheck is OK.

**Apply path, plan 3.3 last bullet** (W2 10632; synth531d.js, output out_synth531d.txt). This is the E-APPLY output: sbApply2024's result inside gateItems2024 at Gate Build, for chatgpt, with the Library instrumented in memory only.

| case | S11 | applied CHALLENGER CONCEDED LINKS line | challenger_conceded_links | challenge_standing | result |
|---|---|---|---|---|---|
| A, count 91 | APPLIED | "CHALLENGER CONCEDED LINKS: 1 -- Premise 91: UNEXHIBITED ..." | 1 | PROP-DEPENDENT | UNDERDETERMINED (was CHALLENGER WINS) |
| B, count premise 3, same fact | APPLIED | "CHALLENGER CONCEDED LINKS: 1 -- Premise 3: UNEXHIBITED ... ASSUMES: Mary is in David's line ..." | 1 | PROP-DEPENDENT | UNDERDETERMINED (was CHALLENGER WINS) |
| C, count both | NOT APPLIED: the same fact is counted twice | the line stays at 0 | 0 | SELF-SUPPORTED | CHALLENGER WINS |

The payload after Gate Record still reads 0 in A and B, because the replay serves the stored gate replies, which were written before any 531 change. At Gate Build, A and B each raise RESULT DIFFERS (E-APPLY): "the judge wrote RESULT: CHALLENGER WINS; the result derived from its corrected lines is UNDERDETERMINED". C raises no such item.

## D. Criterion 6 and the K-UNX rows

**Gate path** (out_crit6_531.txt; synthetic CHANGE lines for Terra S11, 41418 under 524):

| case | K-UNX gate item |
|---|---|
| R1: premise 91, acx fact 91 | none |
| R2: premise 92, no fact 92 | RANGE raised, as today |
| R3: premise 7 against the list 1 to 6 | RANGE raised, as today |
| K1: premise 3, "ASSUMES: Mary is in David's line" | none |

Cases A and B (synth531c) now raise no K-UNX item. On the previous build both did.

**pkgBKC at function level** (out_bkc531.txt). The fact is 91 "Mary is of David's line". Both tests are shown, per W2 10629 item 2.

| case | same-fact test | word test | result |
|---|---|---|---|
| K1 "Mary is in David's line" | true | true (mary, david, line) | exempt |
| K2 "the mother descends from Jesse" | false | false | flagged, as today |
| K3 sol62's premise 3, "the woman ... is in David's bodily line" | true | true (david, line) | exempt |
| K4 "Mary and David" | true | false (names only) | flagged |

K4 shows that the word test still binds.

RANGE acx531R2Charge: CHALLENGER 91 is true. CHALLENGER 92, CHALLENGER 7 and DEFENDER 91 are false.

**41418 K-UNX rows, before and after** (W3's request).

1. **Payload stage.** The stored rows are debate_enforcer_log 51161 to 51164 (sol62: DEFENDER premises 1, 2 and 3, and CHALLENGER premise 3) and 51202 to 51203 (sol). They come from Panel Payloads.
   - Panel Payloads runs before Assume Check Record: executionIndex 229 against 236 on 41418. So bkcKeep2024 reads no acx there, and change 5 cannot touch these rows.
   - sol62's CHALLENGER premise 3 (51164) stays as recorded. It is CURED through the assumed-fact form (pkgAFF, ruling 460).
   - I could not replay Panel Payloads, because Panel Check's data is not fetched. "Unchanged" therefore rests on the execution order.
2. **Gate stage.**
   - 41418 as stored: Gate Build and Gate Record are equal apart from the empty acx fields, and kunx531.js counts 0 K-UNX gate items before and after.
   - Under 524 with the stored replies: 0 before and after.
   - The child's G1 RULE K-UNX for qwen4max (row 51644, on DEFENDER premise 2): R2 Alt Gate Build and R2 Alt Gate Record are byte-equal on the target, so the row is unchanged.
3. **Under a 531 cure.** On the previous build, case A (count 91) and case B (count premise 3, same fact) each raised a K-UNX gate item. Now neither does.

## E. WRONG-IF measurement (survey531.sql)

- 11 runs, with 24 round 2 facts (claude_r2).
- 13 counted challenger segments.
- 9 pairs share a content word: 6 pass, all of them truly the same fact; 3 fail, all of them truly different facts.
- No miss and no false match.
- The limits are as stated before: a rewording that shares no word cannot be seen, and the test is a SQL copy.

## F. Searches

SX4Z, c7366 and Y1VIsNB6 (ask531/w4/search/) have no hit for "acx", "E-ASSUME", "VP4" or "assume check".

## G. Write

write531.sh does the following:
1. Checks both versions.
2. Saves the revert copies.
3. Asserts the md5s.
4. Builds from the fresh fetch, PUTs, and compares the fetch-back.

The audit row is written by hand SQL with truth.card.

RUN EVIDENCE: UNEXERCISED until a released run.
