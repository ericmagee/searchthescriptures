# ASK 633 PLAN (W4), rev 0: the row's re-call line names why the round was sent back

Source: W4 Wall 11934 (cause and fix), corrected by Wall 11935; the 42528 AAR (Wall 11938, item 2a); the coordinator's assignment, 05:58 CST 11-25.
Live base: engine 3b72583c (after ASK 632). Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a prompt, what a seat is sent, or when a round is sent back.

## 1. OBJECTIVE
Every round re-call is recorded in the row as "[AUDIT v47: BARRED MOVE RE-CALL (pkgBAR) ... SENT BACK: <n> sentence(s) ...]". Here n is the barred-sentence count alone. But a round is sent back for any of these causes:
- barred sentences (pkgBAR), in all seven B Build nodes;
- Oracle layer points (pkgLAYB), in all seven;
- on D4B only, pressed verses with no ANSWER line (ASK 628).
So a re-call sent for layer points or pressed verses reads as "a barred-move re-call that sent back 0 sentences". The record says the wrong thing about why the seat was sent back.
- Change: the line names the re-call by all its causes and gives each count:
  "[AUDIT v47: ROUND RE-CALL (pkgBAR, pkgLAYB) -- SEAT: ...; ROUND: [..]; SENT BACK: <n> barred sentence(s); <m> layer point(s)[; <k> pressed verse(s) with no ANSWER line]; KEPT: ...; VOID: ...]".
  - The pressed-verse part is printed only for the D4 round (CR4), the one round that checks it.
  - Every other part of the line is unchanged.
- Expected effect on 42517 DR1: "SENT BACK: 0 barred sentence(s); 4 layer point(s)" instead of "SENT BACK: 0 sentence(s)". On 42517 DR2: "1 barred sentence(s); 1 layer point(s)".
- Scale: of the 59 re-call lines stored since 11-20, 30 read "SENT BACK: 0 sentence(s)" (SQL, 06:0x CST 11-25).

## 2. ROLES
- Plans and builds: W4.
- Grades: W1 (one seat that is not the builder).
- Writes: W4, on W4's card to the operator. It is an engine change, so it is infrastructure.
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: Build Save Body only, the one FF.push of the re-call line inside `for(const b of __BARB)`:
- m = `((b.layers&&b.layers.first&&b.layers.first.items)||[]).length`. Every B Extract stores `layers.first` = its B Build's lay_check, on both the keep path and the re-call path (read from C1B Extract and D4B Extract code).
- k (CR4 only) = the length of D4B Build's `press_open`, read once by the same isExecuted guard Build Save Body uses for the B Extract nodes. D4B Extract does not carry press_open, so it is read from D4B Build.
- The label changes from "BARRED MOVE RE-CALL (pkgBAR)" to "ROUND RE-CALL (pkgBAR, pkgLAYB)".
- Each new statement is tagged ASK 633.
Not changed:
- The BARRED MOVE VOID line (voids come only from barred sentences).
- The KEPT clause. It carries the Extract's own why, for example "barred sentences 0 -> 0". It compares barred counts only. Adding a layer comparison would be a separate change and is not asked.
- Every B Build and B Extract node, the note a seat receives, and when a re-call is sent.

SEARCH:
- Engine 3b72583c and child aad0ad9c, text search for "BARRED MOVE RE-CALL" and "SENT BACK": the line is built only in Build Save Body. Shared Library's "SENT BACK" strings are enforcer labels, unrelated. Wall 11935 already corrected my claim that Format Markdown has the line.
- The seven B Build nodes: why = "<n> barred sentence(s)" and/or "<m> layer point(s)". D4B Build adds "<k> pressed verse(s) with no ANSWER line" and press_open.
- The B Extract nodes: bar = {applies, round, node, seat, side, first (bar_check), resent, kept, why, void, layers {first, after, bare_written}, ...}.
- DB functions: none names "BARRED MOVE RE-CALL" or pkgBAR. enforcer_status_stored matched only on "SENT BACK", in unrelated text.
- 42517 node outputs (node-filtered, nothing running): C1B Extract DR1 resent, hits 0, layers 4, kept second; C2B Extract DR2 resent, hits 1, layers 1; the rest not resent; D4B Build press_open 0.

NOT SEARCHED:
- Dashboard pages that may parse the line's text. The label change would show there as text.
- The engine manual's description of the line. W3 updates it.

## 4. CRITERIA AND DONE
- C1. Replay of the changed statement on the 42517 bars (fixture: the seven B Extract outputs and D4B Build, node-filtered). DR1 prints "0 barred sentence(s); 4 layer point(s)". DR2 prints "1 barred sentence(s); 1 layer point(s)". Nothing else is printed for rounds not resent.
- C2. Synthetic bars:
  - barred only (layers 0);
  - layers only;
  - both;
  - CR4 with press_open 3 and the other counts 0, which prints the pressed part;
  - CR4 with D4B Build not run, which prints "0 pressed verse(s)" (the guard gives an empty list);
  - a bar with no layers field (an older form), which prints m = 0.
  The SEAT, ROUND, KEPT and VOID parts are byte-equal to the old line in every case.
- C3. Engine: only Build Save Body changes, by that statement and the one guarded read; every other node is byte-equal to 3b72583c; connections are equal; standing 31/0; S4 compile; Library Check pair PASSES.
- C4. ASK 599: the new statements are tagged ASK 633; no dead code; no catch beyond the guard pattern already used for the B Extract reads.
- DONE: W1 PASS on the plan and the build; the operator presses W4's card; W4 writes; W1 reads back; two clean live runs in which a round is re-called (marked as in section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if the "0 sentence(s)" re-calls were in fact sent for barred sentences that the count lost. Then the fix would hide a counting defect behind a new label.
  - Known-bad case: 42517 DR1. Its Build why was layer points (bar hits 0, layers 4), and the Extract shows "barred sentences 0 -> 0". So the re-call was for layers, and the count is right; only the label is wrong.
- A second wrong-if: a reader parses "BARRED MOVE RE-CALL" to count barred-move re-calls. None is in the DB or the engine (searched); the dashboard is not searched.

## 6. RUN EVIDENCE
- Case: the first live run with any round re-call (every run since 11-20 has had at least one).
- Mark: the row carries "ROUND RE-CALL (pkgBAR, pkgLAYB)" lines whose barred and layer counts equal that round's B Build why. No line reads "SENT BACK: 0 sentence(s)".
- Cost: nil. NO PROBE: the stored node outputs are the test.

## 7. INPUTS IN GIT
ask633/w4/plan633.md (this file). The build goes in ask633/w4/b1/: the build script, the target engine, the tests and the 42517 fixture (node-filtered).

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C4 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 633 (the row names why each round was sent back)?"
4. W4 writes the engine; fetch back; audit row; Wall post; W1 readback.
5. W3: the engine manual entry and the AAR rows.
6. Two clean live runs with a re-call.
