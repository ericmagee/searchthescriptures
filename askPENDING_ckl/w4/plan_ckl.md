PLAN rev 0, ASK (number pending the operator): close ENFORCER confirms a contradiction against a link the same round kept (pkgCKL). Anchor WALL-10868 (reviews 10869, 10871, 10873, correction 10874).

1. OBJECTIVE: a closing sentence that restates what the debater's own earlier round kept under that link is no longer charged as a CLOSE-CONTRADICTION because a different link was narrowed or dropped. Expected effect: in run 41736, D2 vs C1 and D3 vs C1 are not cured to CHALLENGER LINK BROKEN, and each seat's RESULT reads as its judge wrote it (AUDIT v25 ORIGINAL: CHALLENGER WINS); a confirm whose drop and close sit in the same link (41024 row 47150) still applies.

2. ROLES: planner W4 (coordinator's request); builder W4; grader one non-builder seat (W1 or W2); the write card is in the W4 thread.

3. SCOPE: one engine node, Close Enforcer Record (code only). It adds one post-check beside pkgCLK and pkgOPC. A CONFIRMED row is set to NOT CONFIRMED (kept link), recorded and not applied, when all four hold: (a) the EARLIER quotation stands in the block headed for LINK m in its round (cecBlk); (b) the named LINK n is not m; (c) the same round's LINK n heading reads SUPPORTED; (d) at least 0.75 of the closing sentence's content words stand in that round's LINK n block. The 0.75 is a figure this package sets; it is measured on the cases below and is otherwise a guess. There is no change to the prompt, the model or its settings, the Library, or the child.
   SEARCH: CLOSE-CONTRADICTION in the engine 5a2b6a75: Shared Library (10 hits; lines 1323-1325 and 1485-1486 apply c.cec cures; 1608 reads results), Close Enforcer Build (2), Close Enforcer Record (7), Judge Contradiction Build (2), Judge Contradiction Record (8). Child 160a67e3: Shared Library only (same text). Close Enforcer Record builds its confirmed list (cec.confirmed) only from rows whose status is CONFIRMED, and the Library cures only from that list. So a row set NOT CONFIRMED reaches no cure, and no Library line changes. The new check runs before the one-check and confirmed-list steps. Judge Contradiction (the judges' own candidates) is out of scope.

4. CRITERIA and DONE:
   C1: a replay of Close Enforcer Record on stored 41736 replies sets rows 51653 and 51655 to NOT CONFIRMED (kept link). Every other row is byte-equal.
   C2: the same replay on every luna-era run with an E-CLOSECON CONFIRMED row (population: debate_enforcer_log rule E-CLOSECON, CONFIRMED, runs 40891, 40995, 41024, 41102, 41117, 41736; 12 challenger NEW rows plus the defender rows) changes only 51653, 51655 and 48277 (41102: a drop under LINK 6, a close in LINK 1 SUPPORTED, 8 of 10 words in the DR3 LINK 1 block). "Found nothing else" is a legitimate result.
   C3: 47150 (41024, LINK 6 drop and close in LINK 6) stays CONFIRMED.
   C4: a Library replay of the 41736 cure gives each seat's RESULT as AUDIT v25 ORIGINAL.
   C5: the Library Check pair and runcheck pass on the targets.
   DONE: graded PASS, written on a card, read back MATCH, and exercised by a run (see 6).

5. WRONG-IF: the plan aims at the wrong thing if a stored CONFIRMED that a reader judges right would be cleared. Check run before posting:
   - Known-bad 51653 (41736) meets (a) LINK 3, (b) n=1, (c) "LINK 1: SUPPORTED", and (d) 10 of 11 words. It is cleared.
   - Known-good 47150 (41024) has m = n = 6 and fails (b), so it is kept.
   - NULL case: rows whose earlier block is unresolved (40891 45542/45543, cecBlk null) fail (a) and are kept unchanged.
   Measured in askPENDING_ckl/w4/out_blk.txt.

6. RUN EVIDENCE: the E-CLOSECON row's cure_reason carries "pkgCKL" when the check fires. Its registry entry is case "cross-link confirm cleared", mark pkgCKL. NO PROBE on a run where no cross-link confirm arises: the path is then UNEXERCISED.

7. INPUTS IN GIT: NONE yet. The container has no git clone, so W3 commits askPENDING_ckl/w4/ (blk.py 83bbf33b, cls.py 0c1dcafe, rounds.py 9a57b89a, out_blk.txt 94a06a61, node copies Close_Enforcer_Record.js ed6c406e and Build 0c662833).

8. STEPS:
   (1) This plan is graded. It waits on no card.
   (2) Build patch_ckl.js on a fresh live readback, then run the replays C1 to C5.
   (3) The build is graded.
   (4) Write, on a card in the W4 thread. This step cannot be undone except by the revert file, which is kept.
   (5) Read back.
   (6) Run evidence on the operator's next released run.
