# ASK 526 plan, rev 2 (W3). Replaces rev 1 (md5 f8c54c39), which failed at Wall 10554 (W1): miscount, unnamed array readers, new NOT DERIVED rows. Rev 0 (02795c52) failed on form at 10543. Plan only: nothing is built or written until the grade passes and the operator presses W4's write card. Times are CST.

## 1. OBJECTIVE
A judge's stored counted-premise arrays agree with its final count lines, whenever those lines name the counted premises.

Expected effect: in 41418, qwen 4 max's counted_premises_defender reads [2,5,6], which is what its final CONCEDED LINKS line names. Today it reads [1,2,5,6] against a count of 3.

What the findings show (stored debate_judgments 1263 to 1265, read by SQL; W1 checked them at 10543):
1. The count, standings, clause and RESULT already come from the cured lines (the recompute, Shared Library lines 1316 to 1369). The one stored value that disagrees with the final lines is the counted-premise array.
2. qwen 4 max's lines changed in this order (SUPERSEDED LINE records):
   - The cure restated D2 vs C6 to UNDERDETERMINED, and the engine wrote its own count line, "CONCEDED LINKS: 3 -- recomputed ... -- grounds: premise 4 BROKEN AT THE COLLISION D3 vs C5 (K-G7)". cpdSync could not derive from that line, because it names one premise for a count of 3.
   - A later applied change by the judge set D2 vs C6 back to BROKEN and wrote its own count line, naming premises 2, 5 and 6, still with a count of 3.
3. THE CAUSE. cpdSync (line 1537) runs in cureRewrite after every applied change (lines 1596 and 2470). But line 1541 skips a side when the count did not change ("pre[ck]===n"). The second count line kept the count at 3, so the array was never derived from it.
4. Measured: run on qwen 4 max's stored final text (cpd_qwen_test.js), cpdSync with the count marked unchanged writes nothing. With the count marked changed, it writes "COUNTED PREMISES DERIVED ... WAS: [1,2,5,6]; NOW: [2,5,6]".
5. Why not simply drop the skip (rev 1): cpdSync runs inside the cure and the send-back apply (Library MAP entries Panel Cure Check, Cure Check, Alternate Merge 1, Alternate Merge Seat and the child's R2 copies). With no skip, every applied change on a seat whose line cannot be derived would add a NOT DERIVED REVIEW row (W1 10554 item 3). So rev 2 keeps the skip and derives once, at the end, after every reader in the run has read the arrays.

## 2. ROLES
- Planner: W3.
- Builder: W4.
- Grader: W1 (not the builder).
- Card: W4's write card in W4's thread, pressed by the operator.

## 3. SCOPE
The change is one addition, in one node: the end of the engine's Alternate Merge, the last Code node before Record Substitution, Record Alternates and Write Judgment 1 to 3 store the panel judgments.
- CHANGE: for each judge body it outputs, Alternate Merge runs cpdSync once more, with the count marked as changed, so the skip at line 1541 does not apply. It keeps the result only for a side that DERIVES. That side's array is replaced, and the one "COUNTED PREMISES DERIVED" audit line is appended. A side that does not derive is left exactly as it was, with no new line.
- Line 1541 and every other Library line are unchanged. The child workflow is unchanged, because its results reach the engine through Pass Accumulate, which Alternate Merge reads.

Not changed:
- Fields, standings, the clause, the RESULT, and every count.
- psGrades, which rev 0 change 2 would have touched. It is moved out: no stored case shows it changing an array (W1 10543 item 3).
- Every in-run reader of the arrays reads them before Alternate Merge's end, so it sees today's arrays. That covers K-G7 (line 2102), K-G8 (lines 825 and 2091), K-RUL (lines 1736 and 2259), drvLedger for drv_uncured (lines 2426 to 2428), and line 2971 in the judge enforcer builds. By the Library MAP, those lines are built into Panel Payloads, Alternate Payloads, Extract Independent Verdict, R2 Alternate Payloads, and Judge Enforcer Build, Alt Judge Enforcer Build and R2 Alt Judge Enforcer Build. Each runs upstream of Alternate Merge. So no count, no drv_uncured and no seat removal can change.
- Prompts and model settings.

Moved out of 526:
- The stale reason on qwen 4 max's DEFENSE STANDING line ("recomputed ... (RESTATED D2 vs C6 (DEFENDER LINK BROKEN to UNDERDETERMINED) ...)"). The value is right, and the reason names a change that was later undone. This is reader-facing text, so it goes to ASK 529.
- REVIEW THIS ROW lines (B7 and K-G7, record-only by design) go to ASK 528, as a review step that reads them by SQL.
- sol 6.2's "WHICH HOLDS: CHALLENGER" beside "RESULT: UNDERDETERMINED" is not an engine defect. rd386 with challenger premise 3 counted gives UNDERDETERMINED, and WHICH HOLDS is not an input (ASK 507). It goes to ASK 529.

SEARCH (519 fetch-backs on disk, ask519/w4/write/; no n8n call):
- Engine moMxiV4Irg1uRBZN, every Code node, for "cpdSync(" and "pre[ck]===n": Shared Library only (2 and 1).
- Child MqQHRl7mQQ0z8QdT, the same: Shared Library only (2 and 1).
- cpdSync's callers: cureRewrite (line 1557). cureRewrite's callers: the cure, and the send-back apply at lines 1596 (panel) and 2470 (alternate).
- Readers of counted_premises_defender and counted_premises_challenger, from the Library (W1 10554 item 2, checked against the MAP): lines 825 and 2091 (K-G8), 2102 (K-G7), 1736 and 2259 (K-RUL), 2426 to 2428 (drvLedger), and 2971. Each is built into the upstream nodes named under Not changed.
- Node readers outside the Library: Panel Build (upstream), Build Save Body (the single-judge save path, which Alternate Merge does not feed), and Format Markdown (the transcript, downstream of the stored row).
- After Alternate Merge (engine connections): Dry?, Record Substitution, Record Alternates, Write Judgment 1 to 3, Write Enforcer Log and Derive Outcome. No database function reads counted_premises (pg_proc searched this turn: none).
- The other workflows the engine reaches (SX4ZWtgHNs96uBOo, c7366RPLb8vdMQg6, and the Panel Judge Call Y1VIsNB6KBrs1znP behind webhook wall2024-panel-judge-call) are NOT SEARCHED by me for "cpdSync". W4 searches them at build time, as for 527 (W4 found no send-back reader there).

## 4. CRITERIA and DONE
Population: every stored judgment whose verdict JSON carries counted_premises_defender, which is 477 rows of debate_judgments, counted by SQL this turn. In 37 of them, an array's length differs from its count. The other 440 cannot move, because the new skip still holds when the length equals the count.

The 37 rows, run through cpdSync with the count marked as changed, on their stored final text (cpd37_new_rule.txt, made by cpd37_test.js on the base Library code):
- 20 rows derive on at least one side, and every derived array has as many premises as the count. They include 1265 (qwen 4 max, 41418), which goes from [1,2,5,6] to [2,5,6]. Row 971 derives its defender side and not its challenger side.
- 15 rows derive on neither side. Under this plan they stay exactly as they are, with no new line. 1263 (sol 6.2, 41418) is among them.
- 2 rows (1038 and 1202) do not parse as JSON and are untouched.

Criteria:
1. On the build, the final pass gives the same 20 derived rows, and the 15 and the 2 are byte-equal before and after.
2. On the 20 rows, the only differences are the array (or arrays) and one appended DERIVED line per derived side.
3. On all 477, the fields, standings, clause, RESULT, drv_uncured and every stored count are unchanged. The in-run readers are upstream, as listed in SCOPE.
4. Format Markdown, rendered for 41418 before and after, differs only where it shows qwen 4 max's array. W4 lists each differing line.
5. Only Alternate Merge differs in the engine, and it compiles. The child is byte-equal.

"Found nothing" is not a legitimate result on 1265. It is the expected result on the 15, the 2 and the 440.

DONE: criteria 1 to 5 shown offline on the build, the write on W4's card, W4's readback MATCH, and the run evidence in section 6.

## 5. WRONG-IF
The plan is wrong if the judge's final count line does not name the premises its count holds. In that case removing the skip derives nothing, or derives the wrong set.

Measured before posting:
- Known bad, the case to fix: 1265. The final line names 2, 5 and 6 for a count of 3, and it derives [2,5,6]. The wrong-if does not fire.
- Known good: 1263 (sol 6.2). Its line names no premises, and it stays NOT DERIVED. The rule does not invent a set.

## 6. RUN EVIDENCE
- Case: a released run in which a send-back or gate change keeps a seat's count and changes which premises its count line names.
- Mark: an "AUDIT v50: COUNTED PREMISES DERIVED" line appended by the final pass. W4 names its distinguishing text in the build.
- NO PROBE: whether a judge makes such a change is its own choice.

## 7. INPUTS IN GIT
ask526/w3/ on claude/untitled-9jle0o (commit given in the Wall post):
- plan526.md
- cpd_qwen_test.js
- cpd37_test.js
- cpd37_new_rule.txt
The base is the 519 fetch-backs, ask519/w4/write/. The test builds its source from the Library's own MAP entry for Alternate Merge 1 (181,859 characters, length check passed).

## 8. STEPS
1. W1 grades this plan. No card.
2. W4 builds on the live engine at build time, and runs criteria 1 to 5. W1 grades the build. No card.
3. W4 writes the engine, stacked with the other ASKs if their timing matches (ASK 445). This waits on the operator's card in W4's thread. The revert is the pre-write fetch.
4. W4 reads back. W3 writes the engine manual entry, which waits on the operator's card in W3's thread.
5. The run evidence is read at the next released run.
