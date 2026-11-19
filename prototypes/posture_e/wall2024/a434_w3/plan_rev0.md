# ASK 434 plan rev 0 (W3; the coordinator moved it from W4 to W3, 21:28 CST 11-18): the "SUPERSEDED BY" label names the step that changed the verdict

1. OBJECTIVE. The first line the engine writes into a judge's stored reasoning when its verdict changes names the step that made the change: CURE, SEND-BACK or RECOMPUTE. Today it always reads "SUPERSEDED BY CURE: verdict X to Y; see the cure lines below", even when the change came from a send-back apply (Wall 8034 item 3; W4 8037). Run 38593, sonnet: the line reads "SUPERSEDED BY CURE: verdict HELD to BROKEN", but the cure left sonnet HELD and the send-back apply (AUDIT v37) made it BROKEN. Expected effect: after the build, that case reads "SUPERSEDED BY SEND-BACK: verdict HELD to BROKEN; see the send-back lines below". No verdict, count, standing, RESULT, tag or prompt changes; only the wording of this one engine-written line.

2. ROLES. Planner W3. Builder W3 (the coordinator moved the item off W4). Graders W1 and W2. Write: W4, on the operator's card in W4's thread (libw.py, both workflows, since the Shared Library is shared).

3. SCOPE. Shared Library only (engine and child carry the same library; measured equal on live engine 06967796 and child e1f2b1c4):
- line 1284, cureSupHead(raw,o,n): gains a 4th argument, the step. The written line becomes "SUPERSEDED BY <STEP>: verdict o to n; see the <step> lines below", where STEP is CURE, SEND-BACK or RECOMPUTE. Its removal pattern H widens to remove an earlier line of any of the three forms, so a text never holds two.
- its three callers: line 1595 (panel send-back apply, in Alternate Merge Seat and R2 Alternate Merge Seat) passes SEND-BACK; line 2470 (Alt Apply, in Alternate Merge 1 and R2 Alternate Merge) passes SEND-BACK; line 1609 (alternate seat, after line 1600 to 1608) passes CURE when the alternate had uncured items (r.drv not empty, the cure path) and RECOMPUTE when it had none (line 1608, the TIE or keystone recompute with no cure).
- line 605, kcmtGrade2024: the reader that skips engine-written lines skips all three forms (today /^SUPERSEDED BY CURE\s*:/).
SEARCH (W3, on fresh fetches of live engine 06967796 and child e1f2b1c4, 11-19 03:3xZ): "cureSupHead" occurs only in the Shared Library (7 places: the definition and its regex, 3 calls); "SUPERSEDED BY CURE" occurs only in the Shared Library (3: line 605 and twice in line 1284); no other Code node in the engine or the child holds either. The library MAP runs line 1284 in Alternate Merge 1, Alternate Merge Seat, Cure Check, Panel Cure Check, R2 Alternate Merge and R2 Alternate Merge Seat. No database function holds "SUPERSEDED BY CURE" (pg_proc search). Stored rows: 15 debate_judgments rows carry the line (11-06 to 11-18); 14 of them carry a v37 send-back tag, 5 a v25 recompute tag. Owed by the builder at step 1: a search of every prompt builder in both workflows that reads a judge's verdict_raw after the merge nodes, to say whether this line reaches any model; every hit posted.

4. CRITERIA and DONE.
- C1. The target differs from live only in the Shared Library lines 605, 1284, 1595, 1609 and 2470 (and the MAP and lib_sha that follow); the library is identical in engine and child; ASK 385 check PASS; the reasoning guard shows no model-setting change; every stub rebuilds.
- C2. Unit run of the built cureSupHead on the 15 stored rows' verdict_raw: for each row, with the step the record shows (v37 last: SEND-BACK; cure lines with no v37: CURE; v25 with no cure items: RECOMPUTE), the output differs from the input only in the label line; the old line is removed and exactly one new line is written. Run twice, it gives the same text (idempotent). On 38593 sonnet it gives "SUPERSEDED BY SEND-BACK: verdict HELD to BROKEN; see the send-back lines below".
- C3. Replay of the three merge nodes (old and built code) on stored n8n execution data with a verdict change, at least one per step that the stored data holds: the outputs are equal except the label line. The count of changed labels is above zero.
- C4. kcmtGrade2024 returns false for each of the three forms (unit), and its output is equal old against built on the 15 stored rows.
- C5. Live after the write: rbx 0 diffs on both workflows against the graded targets; W1 and W2 read back.
DONE when C1 to C5 pass and the engine manual carries the entry.

5. WRONG-IF. Wrong if a reader keys on the exact text "SUPERSEDED BY CURE" and the new forms escape it: the step 1 search must list every such reader; a planted judge line "SUPERSEDED BY SEND-BACK: ..." fed to kcmtGrade2024 on the old code is graded as a judge line (shows the check can fail), and on the built code is skipped. Wrong if the step is not knowable at a caller (for example a seat where a cure and a later send-back both change the verdict): then the label names the last step, with its own from and to, and the v21, v25 and v37 tags keep the full chain; the planted case (cure HELD to BROKEN, then send-back BROKEN to HELD) must show one line, SEND-BACK, BROKEN to HELD.

6. RUN EVIDENCE. ASK 417 registry entry (W3 adds it at the write): case = a run where a judge's verdict changes in the merge nodes; mark = the stored verdict_raw of that judgment holds "SUPERSEDED BY SEND-BACK:" or "SUPERSEDED BY RECOMPUTE:" when its last change was a v37 or a no-cure recompute, and no row written after the write holds "SUPERSEDED BY CURE:" together with a v37 tag that postdates its cure lines.

7. INPUTS IN GIT. This plan at a434_w3/plan_rev0.md. Build in a434_w3/ (targets, unit and replay scripts, outputs).

8. STEPS.
1. W3: the step 1 prompt search, posted. (No card.)
2. W1 and W2 grade this plan. (No card.)
3. W3 builds on fresh fetch-backs, on top of ASK 429 if 429 is written first (both change the Shared Library; ASK 412 stacking). (No card.)
4. W1 and W2 grade the build. (No card.)
5. W4 posts the write card in W4's thread and writes; W1 and W2 read back. (Waits on the operator's card.)
6. W3 writes the engine manual entry. (Waits on the operator's card in W3's thread.)
