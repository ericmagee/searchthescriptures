# ASK 526 plan, rev 1 (W3). Replaces rev 0 (md5 02795c52), which failed on form at Wall 10543 (W1). Plan only: nothing is built or written until the grade passes and the operator presses W4's write card. Times are CST.

## 1. OBJECTIVE
A judge's stored counted-premise arrays agree with its final count lines, whenever those lines name the counted premises.

Expected effect: in 41418, qwen 4 max's counted_premises_defender reads [2,5,6], which is what its final CONCEDED LINKS line names. Today it reads [1,2,5,6] against a count of 3.

What the findings show (stored debate_judgments 1263 to 1265, read by SQL; W1 checked them at 10543):
1. The count, standings, clause and RESULT already come from the cured lines (the recompute, Shared Library lines 1316 to 1369). The one stored value that disagrees with the final lines is the counted-premise array.
2. qwen 4 max's lines changed in this order (SUPERSEDED LINE records):
   - The cure restated D2 vs C6 to UNDERDETERMINED, and the engine wrote its own count line, "CONCEDED LINKS: 3 -- recomputed ... -- grounds: premise 4 BROKEN AT THE COLLISION D3 vs C5 (K-G7)". cpdSync could not derive from that line, because it names one premise for a count of 3.
   - A later applied change by the judge set D2 vs C6 back to BROKEN and wrote its own count line, naming premises 2, 5 and 6, still with a count of 3.
3. THE CAUSE. cpdSync (line 1537) runs in cureRewrite after every applied change (lines 1596 and 2470). But line 1541 skips a side when the count did not change ("pre[ck]===n"). The second count line kept the count at 3, so the array was never derived from it.
4. Measured: run on qwen 4 max's stored final text (cpd_qwen_test.js), cpdSync with the count marked unchanged writes nothing. With the skip removed, it writes "COUNTED PREMISES DERIVED ... WAS: [1,2,5,6]; NOW: [2,5,6]".

## 2. ROLES
- Planner: W3.
- Builder: W4.
- Grader: W1 (not the builder).
- Card: W4's write card in W4's thread, pressed by the operator.

## 3. SCOPE
The change is one condition, in one function: cpdSync, Shared Library line 1541, in the engine copy and in the child copy.
- CHANGE: drop the clause "pre[ck]===n" from the skip test. A side is derived whenever its array length differs from its count, whether or not the count just changed.
- Everything else in cpdSync is kept: the "!pre || pre[ck]==null" guard, the rule that the line must give the count, and the rule that the named COUNTED set must equal the count. A line that names fewer premises than its count stays NOT DERIVED, as for sol 6.2.

Not changed:
- Fields, standings, the clause, the RESULT, and every count.
- psGrades, which rev 0 change 2 would have touched. It is moved out: no stored case shows it changing an array (W1 10543 item 3).
- Prompts and model settings.

Moved out of 526:
- The stale reason on qwen 4 max's DEFENSE STANDING line ("recomputed ... (RESTATED D2 vs C6 (DEFENDER LINK BROKEN to UNDERDETERMINED) ...)"). The value is right, and the reason names a change that was later undone. This is reader-facing text, so it goes to ASK 529.
- REVIEW THIS ROW lines (B7 and K-G7, record-only by design) go to ASK 528, as a review step that reads them by SQL.
- sol 6.2's "WHICH HOLDS: CHALLENGER" beside "RESULT: UNDERDETERMINED" is not an engine defect. rd386 with challenger premise 3 counted gives UNDERDETERMINED, and WHICH HOLDS is not an input (ASK 507). It goes to ASK 529.

SEARCH (519 fetch-backs on disk, ask519/w4/write/; no n8n call):
- Engine moMxiV4Irg1uRBZN, every Code node, for "cpdSync(" and "pre[ck]===n": Shared Library only (2 and 1).
- Child MqQHRl7mQQ0z8QdT, the same: Shared Library only (2 and 1).
- cpdSync's callers: cureRewrite (line 1557). cureRewrite's callers: the cure, and the send-back apply at lines 1596 (panel) and 2470 (alternate).
- The other workflows the engine reaches (SX4ZWtgHNs96uBOo, c7366RPLb8vdMQg6, and the Panel Judge Call Y1VIsNB6KBrs1znP behind webhook wall2024-panel-judge-call) are NOT SEARCHED by me for "cpdSync". W4 searches them at build time, as for 527 (W4 found no send-back reader there).

## 4. CRITERIA and DONE
Population: every stored judgment whose verdict JSON carries counted_premises_defender, which is 477 rows of debate_judgments, counted by SQL this turn. In 37 of them, an array's length differs from its count. The other 440 cannot move, because the new skip still holds when the length equals the count.

The 37 rows, under the new rule, from their stored final text (cpd37_new_rule.txt, made by cpd37_test.js; the base Library code with the count marked unchanged):
- 19 rows derive on one side or both. Each derived array has as many premises as the count, and each is named on the judge's own final count line. They include 1265 (qwen 4 max, 41418): [1,2,5,6] to [2,5,6].
- 16 rows stay NOT DERIVED, with today's reason, among them 1263 (sol 6.2, 41418).
- 2 rows (1038 and 1202) do not parse as JSON and are untouched.

Criteria:
1. On the build: the same 37 rows give the same 19, 16 and 2.
2. On a sample of the 440 (W4 runs all of them if the time allows): no array changes.
3. Fields, standings, clause and RESULT are unchanged on all 477.
4. Only line 1541 differs in each Library copy, and both copies compile.

"Found nothing" is not a legitimate result on 1265. It is the expected result on the 440.

DONE: criteria 1 to 4 shown offline on the build, the write on W4's card, W4's readback MATCH, and the run evidence in section 6.

## 5. WRONG-IF
The plan is wrong if the judge's final count line does not name the premises its count holds. In that case removing the skip derives nothing, or derives the wrong set.

Measured before posting:
- Known bad, the case to fix: 1265. The final line names 2, 5 and 6 for a count of 3, and it derives [2,5,6]. The wrong-if does not fire.
- Known good: 1263 (sol 6.2). Its line names no premises, and it stays NOT DERIVED. The rule does not invent a set.

## 6. RUN EVIDENCE
- Case: a released run in which a send-back or gate change keeps a seat's count and changes which premises its count line names.
- Mark: an "AUDIT v50: COUNTED PREMISES DERIVED" line whose COUNT reads "n to n".
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
2. W4 builds on the live engine and child at build time, and runs criteria 1 to 4. W1 grades the build. No card.
3. W4 writes, stacked with the other Library ASKs if their timing matches (ASK 445). This waits on the operator's card in W4's thread. The revert is the pre-write fetch.
4. W4 reads back. W3 writes the engine manual entry, which waits on the operator's card in W3's thread.
5. The run evidence is read at the next released run.
