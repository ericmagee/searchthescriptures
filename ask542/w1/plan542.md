# ASK 542 plan (W1, seat 34), rev 0, 2026-11-23. A PLAN ONLY; nothing is written.
Source: W1 Wall 10721 item 2 and 3 (E10, the cause of sol's count cut from 3 to 1 in run 41418); coordinator: "E10 is ASK 542; plan it, W2 grades"; "Proceed with 533, then 542." Rulings: 372 (the answer rule: "before the defender was winning rounds by not responding... this was a gap we closed. I see no reason to undo it"), 411 (a link may fail by meaning even when the witness was answered: the FORCED line), 428 (record-only until it passes a known case; the judge keeps its decision), 383, the 11-19 18:28 CST scope rule. Prior work: ASK 520 (plan ask520/w3/plan520_rev2.md; written 08:07 CST 11-23, W4 10556).

## 1. OBJECTIVE
The ASK 520 exemption works on the ANSWER CHECK lines judges actually write. Today it reads an ANSWER CHECK only when the round tag after the reference is the block's own round 3 ([CR3] or [DR3]). Judges also tag the round where the answer stands, round 4 or round 2. Then the exemption does not act, and the engine raises a K-UNX item ("the count names no layer the block lacks") against a count that ruling 372 allows: the judge's own ANSWER CHECK grades every answer to that press MISSES or FAILS, so the witness stands unanswered.

Expected effect, stated before the build: for 41418 sol (gpt 6.1), defender premises 2 and 3 are not raised at the general K-UNX raise. Sol's own ANSWER CHECKs grade their presses MISSES or FAILS, tagged [CR4] or [CR2], never [CR3] (enforcer row 51422, sol's later full reply). In the run, both items (rows 51202 and 51203) were cured by "CORRECTED COUNT 1 takes the premise out of the count": sol lowered its defender count to 1 in answer to the items.

THE BOUNDARY BETWEEN RULINGS 372 AND 411, as this plan applies it:
- 372: when the judge's own ANSWER CHECK grades the side's answer to a press MISSES or FAILS, the witness is unanswered, and a count of the premise as UNEXHIBITED stands. No K-UNX item asks to drop it. This is the ASK 520 exemption.
- 411: when the answer MEETS, the witness is answered. A link may still fail by meaning, but that failure is graded at the collision as a FORCED line, not counted as a missing layer. So any MEETS for that press keeps today's K-UNX item, which offers the FORCED line.
- So this plan widens only which round tags are read. It never exempts a press that the judge graded MEETS in any round.

## 2. ROLES
Planner W1. Builder W4. Grader W2 (one non-builder grader). Write card: W4's thread.

## 3. SCOPE
SEARCH (W1, 11-23, live engine daf5da98, fetch ask536/w4/build/live536_engine.json md5 3a001d95, through ask516/w4/b/lib.py; and SQL, ask542/w1/measure542.sql):
- Library 453 (unxAcFail) and its byte-equal second copy at 3461 (the code before the comment is identical). It builds the pattern "ANSWER CHECK: <ref> -- [<RK>" with RK inserted as regex text, then counts MISSES or FAILS against MEETS, and returns true only when at least one fails and none meets.
- Its callers: 460 (unxaCheck, the UNANSWERED path, with RK = the block round) and 480 (the ASK 520 exemption on the general raise, with rk = 'CR3' for the DEFENDER and 'DR3' for the CHALLENGER, set at 463). The presses read at 480 are those of round 3 (PR) and round 2 (unxPresses of the opposing round 2).
- MAP: line index 479 (0-based) is in 15 packages (Panel Payloads, Extract Independent Verdict, Gate Build, Gate Record, the Alternate, R2 Alternate, Alt Gate and Late Gate packages). A change inside the line changes no MAP key and no line count.
- debate_judgments, every judgment (measure542.sql, out_measure542.txt):
  - 18,328 ANSWER CHECK lines in 348 judgments of 117 runs. Round tag after the reference: round 3 15,191; round 4 2,341; round 2 786; round 1 10.
  - Per (judgment, side, reference): 1,037 groups pass today's test. With rounds 2 to 4 also read, as in section 4, 374 more pass, in 85 judgments of 49 runs. None that passes today stops passing.
- debate_enforcer_log, the general raise (480 to 482): 87 stored K-UNX rows in 36 runs (11-07 to 11-23). 79 were cured by a CORRECTED COUNT.
- 41418 sol: rows 51202 and 51203 (flagged lines and cures read); row 51422's ANSWER CHECK lines read in full (out_measure542.txt (C)).
NOT SEARCHED: the judge text each of the 87 rows was raised on. The stored verdict_raw is the final, post-cure text, and sol's first text in 41418 is not stored. W4's replay uses the stored text and says so.

IN SCOPE: Library line 480, the one call unxAcFail(text,p.ref,rk), in both Library copies. No other line.
NOT IN SCOPE (scope rule):
- (a) Line 460 (the UNANSWERED path), which calls the same function with the block round. It has no failed run behind it.
- (b) unxAcFail itself, and its reading per reference rather than per premise. Example: in sol's reply, Matthew 1:20 is graded MEETS under premise 1 and MISSES under premise 3, so that reference never passes. That is a separate gap.
- (c) The second tag in a line such as "[CR2; CR4; defender premise 5]". Only the first tag is read, as today.
- (d) The K-UNX rule text, its count consequence, and the ASK 536 change (unxLack, 427 to 430), which raises at 474 to 478 and is a different path.

## 4. CRITERIA and DONE
CHANGE (line 480):
1. The call unxAcFail(text,p.ref,rk) becomes unxAcFail(text,p.ref,rk)||unxAcFail(text,p.ref,rk.slice(0,2)+'[2-4]').
   - The first call is today's test, unchanged.
   - The second reads every ANSWER CHECK whose first tag is the side's own round 2, 3 or 4 ([CR2], [CR3] or [CR4] for the DEFENDER; [DR2] to [DR4] for the CHALLENGER). It passes only when at least one is MISSES or FAILS and none is MEETS.
   - So a press passes if either test does. No press that passes today stops passing. A press with a MEETS anywhere in rounds 2 to 4 is never newly exempted (the 372/411 boundary above).
2. RK is inserted into the regex as text, so '[2-4]' is a character class. The existing "(?![A-Za-z0-9])" after the tag still applies, so "[CR4; defender premise 2]" and "[CR4]" both match and "[CR40" does not.
3. Nothing else changes: unxAcFail at 453 and 3461, line 460 and the comment at 480 stay byte-equal, except that the 480 comment gains "ASK 542: or any of the side's round 2 to 4 tags".

TESTS (W4, OLD against NEW):
- Known bad, 41418 sol defender premises 2 and 3, on the text of row 51422 with the 41418 rounds: NEW passes the exemption for each (premise 2 through Luke 1:34 [CR4] MISSES, Luke 1:31 [CR4] FAILS and others; premise 3 through Matthew 1:18 [CR4] MISSES, Matthew 1:16 [CR2] MISSES and others). OLD passes neither. No K-UNX item is raised for either premise under NEW.
- Known good, unchanged (the ASK 520 plan's own cases):
  - 41117 sol 6.1 defender premises 4 and 5 stay exempted (the first call alone passes them, as today).
  - 41117 sol 6.1 premise 2 (row 48777, the "saying the block lacks" path at 474) stays raised; that path does not call unxAcFail.
- Known good, new: the 12 groups where a round-3 answer is MISSES and a round-2 or round-4 answer MEETS (judgments 943, 955, 997, 1006, 1048, 1093, 1236, 1240, 1249, 1260, 1261) keep today's result, through the first call.

DONE:
4. W4's replay on the live engine and child (daf5da98 or later):
   - (a) All 87 stored rows of the general raise are re-run through 479 to 482 with the stored judgment text, OLD against NEW. Each row that NEW would not raise is listed, with the press and the ANSWER CHECK lines (round tag and grade) that exempt it. Every listed row must have a press of its premise that the judge graded MISSES or FAILS, and none MEETS, in rounds 2 to 4. KNOWN BAD by name: 51202 and 51203.
   - (b) For each listed row, its stored cure (CURED by a CORRECTED COUNT or otherwise) is reported, so the card can say how many judge counts were lowered in answer to items that NEW would not raise.
   - (c) Every stored judgment is run through the K-UNX raise (463 to 482), OLD against NEW. No item is newly raised anywhere, and every item NEW drops is at the general raise only.
   - (d) Lines 460 and 474 to 478 give the same results OLD and NEW on every stored judgment.
5. Both Library copies hold the same text. Library Check passes on both, and the ASK 539 map check is unchanged.
6. RULING 428: the change only stops a TRIAL item that asked the judge to drop a count that ruling 372 allows. It adds no item and no count. In 41418 the item drew a count correction from sol (51202 and 51203), so the change can leave a judge's own count higher than it was in such a run. That is the judge's count as first written, not one the engine sets. The card states this. If 4(c) or 4(d) shows any other change, the plan returns to W1 before any card.

## 5. WRONG-IF
1. NEW drops an item for a premise where the judge graded any press of that premise MEETS in rounds 2 to 4, and no other press passes either test.
2. NEW raises any K-UNX item that OLD did not.
3. Any result at line 460 or at 474 to 478 changes.
4. The two Library copies differ after the build.

## 6. RUN EVIDENCE
NO PROBE (ASK 417): a judge's tags and grades cannot be forced. UNEXERCISED until a released run in which a judge counts a premise UNEXHIBITED and grades its press MISSES or FAILS under a round 4 or round 2 tag. Since 2,341 round-4 and 786 round-2 tags are stored, this is likely in the next run. The proof is that no K-UNX row of the general raise is written for that premise, and the judge's count stands as written.

## 7. INPUTS IN GIT
This plan, ask542/w1/measure542.sql, ask542/w1/out_measure542.txt, and a unit test of the call: t542.cjs run on uaf_live453.cjs (Library 453 verbatim, before its comment), output out_t542.txt (Luke 1:34 [CR4] MISSES: OLD false, NEW true; Matthew 1:16 [CR2] MISSES: OLD false, NEW true; Matthew 1:20 with a [CR4] MEETS: false both; Acts 2:30 [CR3] MISSES with [CR4] MEETS: true both; "[CR40]": false both). All in git and at /mnt/project-files/ask542/w1/. The build's replay and outputs go under ask542/w4/.

## 8. STEPS
1. W2 grades this plan. No card.
2. W4 builds both Library copies on the live engine and child, and runs criteria 4 and 5. No card.
3. W2 grades the build. No card.
4. The operator's write card in W4's thread names the change: the engine reads a judge's ANSWER CHECK whatever round it tags, so it no longer asks a judge to drop a count that the judge's own answer check supports. The card states that in 41418 two such items led sol to lower its defender count from 3 to 1, and that without them the judge keeps the count it wrote. It gives the 4(b) count over all stored runs.
5. W4 writes. W2 reads back. No run is released for this ASK alone.
