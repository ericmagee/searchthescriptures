# ASK 586-F plan rev 1 (W4, 11-23 23:04 CST): engine form fixes of run 42071, split from ASK 586

The coordinator will give this split its own ASK number. ASK 586 itself is being rebuilt around the judges' reasoning (operator, 23:00 CST, W3's thread: "this next fix will mostly be around the judges reasoning..."; W1 Wall 11336 F2).

Rev 1 takes in the following:
- W1's grade of rev 0 (Wall 11330: A, B, C1, C2, E and section 7 PASS; D FAIL, F1);
- W3's consolidation (Wall 11329: B1 to B4, C5 to C8, D);
- W1's grade of that consolidation (Wall 11335).

Rev 0 (ask586/w4/plan586.md, md5 4a9ecc3e, commit 9831c30c) is kept as plan586_rev0_combined.md. Its section 3 (SCOPE AND SEARCH, items a to d and f to g) and the exact text of A1 to A3, B, C1, C2 and E stand unchanged. They are not repeated here.

## 1. OBJECTIVE
A judge is not sent back, counted, or removed for a defect of the engine's own making, and a judge's RESULT is not raised to a challenger win past a counted challenger break. Five such defects were found in run 42071:
1. the 1,500-character cut and the splice;
2. the own-words check;
3. the keystone label that cannot exist;
4. the second reading reversing the first;
5. the RESULT written as CHALLENGER WINS beside a counted challenger break.

A real fault of the same kind is still raised.

## 2. ROLES
1. W4 plans and builds.
2. W1 grades.
3. The card goes in W4's thread. It is one write of the engine and the child together, because Library Check requires the same LIB in both.

## 3. WHAT CHANGED FROM REV 0
**D is rebuilt (W1 11330 F1).**
1. Rev 0 changed stand() at LIB 1345. That reversed ASK 517 and the operator's word on run 41117 ("by rulebook definition, L=6, c=0 is SELF-SUPPORTED, never PROP-DEPENDENT"). I withdraw it, and LIB 1345 is now unchanged.
2. The fault of 42071 sits in the RESULT:
   - rd386 (LIB 1351) receives `col:__c400` only;
   - a counted closing-contradiction break that no collision line names (`__cecX`, LIB 1325; part 09.3: it "counts as one broken line") never reaches the 08.0 clause on a collision graded CHALLENGER LINK BROKEN.
3. New D1 (LIB 1351): `col:__c400.concat(Array.from({length:__cecX.CHALLENGER||0},()=>({link:'CLOSE-CONTRADICTION (no collision line names it)',grade:'CHALLENGER LINK BROKEN'})))`.
4. Only the challenger side is added. A defender entry would change the tie rule on BROKEN beyond what 42071 needs.
5. New D2 (LIB 1363): the AUDIT v25 line prints `STANDING INPUTS: DEFENDER conceded <c>, CHALLENGER conceded <c>; RESULT INPUTS: counted breaks no collision line names: DEFENDER <n>, CHALLENGER <n>`.
6. Ruling note for the card: this is a reading of 08.0 together with 09.3, not a new rule. If W1 or the operator holds it to be a rule change, D goes to its own ASK and the rest is carded without it.
7. Limit (W3 C6; W1 11335 item 2): a false closing-contradiction flag now also blocks CHALLENGER WINS on BROKEN, and gives DEFENDER WINS on HELD by the same 08.0 clause. The 42071 flag (row 52867) is one W1 and W4 read as not a contradiction. That flag is G8, a question for the operator.

**A3, what NOT READ does (W3 C8).** Target LIB 2880 runs `continue` before ECL.check. No E-COL item is made for a cut-marked line, so nothing is stored UNCURED, and drv_uncured gains 0 from it.

**B, the case each design gets wrong (W3 C7; W1 11335 item 3).**
- This plan's B: a 6-word run that the answering side wrote only inside its own quotation marks, and that the other side also quoted, is still skipped. Verse words that the answering side wrote unquoted count as its own.
- W1 11296 7b (exclude verse rows only): a quoted non-verse source, such as a lexicon row the answering side quoted, would count as its own words.
- W1 accepts B as the closer reading of "own words", with the narrower error.

## 4. W3's B1 TO B4: ONE LINE EACH
**B1. ASK 550 ("[REMOVED SEAT" line): a defect, SPLIT OUT to its own ASK. Code read.**
1. Build Save Body writes review_notes at row creation. It writes the 550 lines only `if($('Alternate Merge').isExecuted)`.
2. The connections show that Build Save Body runs before Alternate Merge (a path exists from Build Save Body to Alternate Merge, and none back). So the block never fires. The AUDIT v36 "PANEL SEAT LEFT UNFILLED" block beside it never fires either.
3. SQL: no run since 11-20 holds either line, although 41822, 41736, 41418, 41155, 41102 and 41090 had removals in the debate_removals view.
4. The only reader of these lines is Format Markdown, which runs after Alternate Merge and reads review_notes from the row.
5. The fix needs a design choice: Format Markdown builds the section from Alternate Merge, or a later node patches review_notes. Hence its own ASK.

**B2. enforcer_pushes_by_side 0 rows: NOT A DEFECT.**
1. The view counts only E-HOLD rows where the enforcer said "right: BROKEN" and the judge wrote UNDERDETERMINED.
2. Run 42071 holds 22 E-HOLD rows, and none is of that kind. Its two "right: BROKEN" rows (53288, 53340) are argon on a STANDS line.
3. enforcer_rulings_by_collision reads every E-COL and E-HOLD ruling, hence its 40 rows.

**B3. Gemini's three results: SPLIT OUT, with W3's criterion.**
1. A removes the splice that broke gemini's retraction (row 53240).
2. Three places disagree: judgment 1272 BROKEN / CHALLENGER WINS; AUDIT v61 UNDERDETERMINED; applier row 53239 HELD / DEFENDER WINS. That is a separate write-back question: which of the three the stored judgment carries after a retraction is applied. I have not read that code path.
3. It goes to its own ASK, with W3's criterion: "a replay of 1272 with the retraction applied gives one result in all three places".

**B4. Gate refusal "no line form the engine reads" counted UNCURED (row 53202): SPLIT OUT, a rule question.**
1. ASK 549 makes only pkgPS and pkgSGA refusals record-only.
2. Whether a judge's own bad form at the gate should cost the seat is the operator's ruling.

## 5. CHANGES AND NODES
The text of A1 to A3, B, C1, C2 and E is unchanged from rev 0. D is as in section 3. The script is build/build586.cjs (md5 cb036331).

| Workflow | Node | Before | After |
|---|---|---|---|
| Engine | Shared Library | d749630c, 1,171,824 | eb4582bd, 1,172,862 |
| Engine | Reread Record | 3f7bdf9e | 9d506a0f |
| Engine | Alt Reread Record | e56f5714 | 4283a2e0 |
| Child | Shared Library | 6d92bf4e | 2636529c, 1,172,683 |
| Child | R2 Alt Reread Record | 36a70121 | f6e6bbaa |

The Library Check pair is LIB 305a1bcec07773d3, MAP b6df4839319b6633, and it PASSES (out_pair586.txt). Target md5s: target_engine_586 5ce76ff6, target_child_586 d36047cf.

## 6. CRITERIA (build/t586.cjs bd8d6b04; out_t586.txt dc3770ab: ALL PASS; syn586: 195 sources parse)
**C1 to C4 and C6** are as in rev 0, and all PASS.

**C5 (D), replaced per W1 11330 item 5d.**
1. The standing stays SELF-SUPPORTED in live and target (LIB 1345 is unchanged).
2. LIB 1351 with rd386: live writes RESULT CHALLENGER WINS. This is the known-bad, as stored on 1273 and 1274.
3. The target writes UNDERDETERMINED, each judge's own word.
4. Control: with no counted unnamed break, live and target agree.
5. The D2 inputs line is present.

**C7.** Every library source parses. The Library Check pair PASSES.

**C8. At the write:**
1. fresh fetch, with the bases engine 196402d0 and child f900375e;
2. rebuild on the fetch, and t586;
3. PUT the engine, then the child;
4. fetch back;
5. per-node diff: only the five nodes, with the md5s above;
6. the pair on the fetch-backs;
7. no model setting touched.

**DONE:** C1 to C8 met, and W1's readback.

## 7. WRONG-IF
As in rev 0: the whole 1272 and 1274 lines pass dec504, and the 1,500-character cut fails. For D: if LIB 1351 with the counted break still gave CHALLENGER WINS, D would aim at the wrong place. t586 shows that it gives UNDERDETERMINED.

## 8. EXPECT LINES FOR THE NEXT RUN'S OBJECTIVE SHEET (W3 D)
- **A:** any debate_enforcer_log row whose flagged_line is over 1,500 characters is stored whole. No E-COL send-back reads "no deciding step" on a line that carries "-- WHY IT FAILS:".
- **A3:** no E-COL item for a line ending " [...]". In practice none should appear.
- **B:** an E-COL KEEP that quotes the answering side's own unquoted sentence, also quoted by the other side, is CURED with "quotes the answer".
- **C1:** no pkgLAY KEYSTONE item "names no collision line of D<k>" when the judge wrote no "D<k> vs C" line.
- **C2:** an E-REREAD row whose changed line carries the first reading's grade reads RECORD-ONLY and adds nothing to drv_uncured.
- **D:** an AUDIT v25 line with "counted as one CHALLENGER LINK BROKEN" carries RESULT INPUTS CHALLENGER >= 1, and its RECOMPUTED RESULT is not CHALLENGER WINS.
- **E:** removed_rules carries no "UNREAD COUNTED LINE" from a SEND-BACK ITEM line.

Each line stays UNEXERCISED until a run holds that case.

## 9. INPUTS IN GIT
Branch claude/untitled-9jle0o, folder a586_w4/: this plan; the rev 0 plan; build/ (build586.cjs, libpatch.js, syn586.cjs, t586.cjs, out_t586.txt, out_pair586.txt, out_build586.txt, data/*.json). The four workflow JSON files stay in the project folder ask586/w4/build/ and are named by md5.

## 10. STEPS AND REVERT
1. W1 regrades rev 1.
2. The ASK number comes from the coordinator.
3. The operator's card goes in W4's thread.
4. On the press, with no run live, follow C8, then the audit row, the Wall post and W1's readback.
5. Revert: put back the engine 196402d0 and the child f900375e together, as saved before the write.
