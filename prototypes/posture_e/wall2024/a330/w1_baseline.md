# ASK 330 / 331 grading baseline, rev 2 (W1, session_01H1X3ANxr57MZvsu7fHB9kh)

Eric approved both at 14:56Z on 11-15 ("approved. proceed and assign"). The form agreed by the team is set out on the Wall: 6920, 6924, 6925, 6926, 6927 and 6928.
Everything below comes from debate_enforcer_log, debate_judgments and debate_results, read 2026-11-15. Nothing is from training knowledge.

## ASK 330: the K-UNX gate accepts an assumed fact with no row

Agreed form (W3 6928):
- STEP: verbatim from the side's own round. Checked by code.
- ASSUMES: written by the judge. It names ONE fact the step takes as given. It is never the contested conclusions, which would be a dependency, and never an inferred act. This is the live ruling 421 bar.
- ROWS GIVE: verbatim from the cited verses. Checked by code.
- The charge fails when the side has laid out a chain to that fact, with the links shown. This is the judge's call.
- The K-UNX cure check can CURE an answer written in this form (W2 6921 b).

### Replay baseline (expected: no seat moves, no count moves)

37281 (9b0dbce3):
- luna row 40038 (E-REREAD, record-only) reads: "CONCEDED LINKS: 2 -- Premise 5: UNEXHIBITED (assumed Davidic descent through Mary, with no quoted row establishing it); Premise 6: UNEXHIBITED (same assumed fact)."
- That line has no STEP quote, so the form does not apply. The stored corrected count of 0 stands (W4 6922 item 4, 6927 item 2). Luna's seat is unchanged. The outcome is unchanged: panel_split 3-0 BROKEN.

37372 (6c62698b):
- luna's premise 6 is counted on borrowed footing ("[L4] footing borrowed from contested Links 1-5"), not on an assumed fact. Unchanged.
- luna's line "ASSUMES: the contested conclusions of Links 1-5 -- ROWS GIVE: 'Matthew 1:18; Matthew 1:20; Luke 1:35.'" must NOT cure or count as an assumed-fact UNEXHIBITED. Its ROWS GIVE gives references, not quoted verse words, so it fails the code check. Its ASSUMES is a dependency.
- sol's K-UNX row 41073 (G2, GATE KEEP, record-only) is unchanged.

### Plants (all required)
P1. Well formed. The STEP quote stands in the side's round. ROWS GIVE quotes words that stand in the cited verse. ASSUMES names one fact. Expected: the K-UNX item CURES, and the UNEXHIBITED count stands.
P2. The STEP quote is not found verbatim in the side's rounds. Expected: handled as today. No cure on this ground.
P3. A ROWS GIVE quote is not in the cited verse, or it is only a reference. Expected: handled as today (as in luna 37372).
P4. ASSUMES names the contested conclusions ("the contested conclusions of Links 1-5"). Expected: no cure on the assumed-fact ground. If the code does not test this and leaves it to the judge, the builder must say so plainly.
P5. Lowercase or bold labels ("assumes:", "**ROWS GIVE:**"). Expected: the same result as P1 (the earlier UNXA_ASM case-sensitivity defect).
P6. A K-UNX item answered with a named missing layer. Expected: exactly as today.
P7. The [Ln] tokens inside an ASSUMES clause are still not read as a named missing layer (pkgKGA, ASK 323). Expected: unchanged.

### Byte-identical
On every stored run with no K-UNX item, judge prompts, enforcer inputs and stored rows are identical. The ruling 421 judge-prompt text is unchanged, unless the build names a prompt edit and Eric approved that edit.

## ASK 331: Option A, a single grade-or-count test

The test (W1 6924, W3 6925, W4 6926 and 6927):
- An UNCURED counted removal item does NOT remove the seat when the grade word and every count field of the judge's line equal those of the send-back's line. In that case the send-back line replaces the judge's line, and the row stays recorded as UNCURED.
- If the test cannot be computed (no send-back line or grade to compare), the seat is removed as today (fail-safe).
- Record-only rows (E-REREAD; GATE KEEP marked "RECORD-ONLY") are not removal items, and they stay out of the test.

### Replay baseline

37281, sol (panel):
- Its one counted UNCURED row is 40025, E-ANS, "ANSWER CHECK Luke 2:48 [CR4]". The judge line grades MEETS and the send-back CHANGE TO grades MEETS. The line carries no count field. Result: equal, so sol is NOT removed.
- The send-back line replaces sol's line. Row 40025 stays UNCURED in the log.
- The expected panel is chatgpt, luna and sol, all BROKEN, and hydrogen is not called. The outcome, CHALLENGER PREVAILS 3-0, is unchanged.
- The stored drv_removed entry for sol (removed_rules ["ABSENCE GRADE UNCURED x1"], in debate_removals) would not exist on a fresh run. A replay compares the in-flow removal decision only. It does not rewrite stored rows.

37281, hydrogen (alternate), CORRECTED in rev 1 (Wall 6934):
- Rows 40161, 40162 and 40163 are E-PREM, UNCURED, but their cure_reason reads "RECORD-ONLY TRIAL, ruling 428 ... CURE (record-only until promoted): UNCURED".
- Hydrogen's stored drv_uncured is 0. These rows are record-only, not removal items, so the 331 test never sees them. Hydrogen would NOT be removed under Option A, Option B or the current rule.
- Each row's count does change (CHALLENGER CONCEDED LINKS 0 to 1), so the shape still serves as plant P8 when applied to a COUNTED row.

37372, sol (panel; stored REMOVED FOR "K-C (cure) x1; E-GATE CONTRADICTION x1"):
- Row 41074 (E-GATE G3 CONTRADICTION). The judge line grades MISSES and the gate CHANGE TO grades MISSES. Equal, so taken alone it would pass.
- Row 40694 (K-C, D1 vs C1). cure_reason reads "no RESTATED line for D1 vs C1". There is no send-back grade to compare, so the test cannot be computed, and the fail-safe applies: REMOVE.
- Result: sol stays removed, and the outcome DEFENDER PREVAILS is unchanged. No re-derive.
- REV 2 (E-GATE included, Wall 6942 and 6944): row 41074 now takes the test. It is MISSES against MISSES, so it is not counted, and sol's drv_uncured goes from 2 to 1. The K-C row 40694 still counts under the fail-safe. panel_split keeps "2-0 (1 not counted: debate rule)". REMOVED FOR should then read K-C only. The builder states the exact text.
- Row 41073 (G2 GATE KEEP, RECORD-ONLY) is not a removal item and is ignored.

37281, luna:
- Row 40038 (E-REREAD) is RECORD-ONLY ("nothing is sent back, nothing is counted, no seat is removed"). Luna is unchanged.

### Plants (all required)
P8. A COUNTED row in which a count field differs (the 40161 shape, 0 to 1). Expected: REMOVE. The record-only E-PREM rows themselves stay out of the test.
P9. The grade word differs (MEETS to MISSES). Expected: REMOVE.
P10. No send-back grade (K-C "no RESTATED line"). Expected: REMOVE (fail-safe).
P11. Two counted items: one equal, one that cannot be computed (the 37372 sol shape). Expected: REMOVE.
P12. Two counted items, both equal. Expected: KEEP. Both lines are replaced, and both rows stay UNCURED.
P13. A record-only row only (E-REREAD, GATE KEEP RECORD-ONLY). Expected: KEEP, unchanged from today.
P15 to P19 (E-GATE, rev 2): an equal CHANGE TO (not counted); a different grade (counted); a different count field (counted); no readable grade (counted, fail-safe); a GATE KEEP marked RECORD-ONLY (out of the test).
P14. The grade word is equal, but a STANDING field (defense or challenge standing) differs. Expected: REMOVE. The builder must state which fields count as "count fields", and the list must include the CONCEDED LINKS integers and the standing words.

### Criteria
- The 37281 and 37372 replays match the above. All 14 plants match.
- drv_uncured, removed_rules and the REMOVED FOR text are unchanged for every removed seat.
- The alternate path (Alternate Merge Seat) uses the same test, so a panel seat and an alternate seat are treated alike (W3 6925 mistake 3).
- Runs with drv_uncured 0 at every seat are byte-identical.
- reasoning_guard passes, and no model setting is touched. Shared Library MAP lengths are updated.
- Ruling 383: both changes compare judge text with send-back text and round or verse text only. No guard text is read.
