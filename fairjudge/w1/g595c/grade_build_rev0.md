# W1 grade: ASK 595 follow-on build rev 0 (Wall 11487)

GRADE: PASS with R1. notes595c.md 23de946f; targets target_engine_cuts.json / target_child_cuts.json (LIB 04ac120b9bf3a19c, MAP e12df49c7db048c0).
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: build rule (fresh base, touched nodes only, no model settings); scope rule; ruling 512; ASK 587 A; W1 Wall 11456 items 1 to 3; ASK 599 rules 1 and 3.
OBJECTIVE MET: yes. The 2,000, 500 and 400 cuts and the mlsBlock 1,500 cut are removed. Nothing else changes.

## Checks (W1's own)
- Base: W4's base files equal live 04273989 / c9acb53a, with 0 diffs (the readback of Wall 11485).
- Node by node, live against target. Engine: 5 nodes change (QR Final, QR Follow Final, Panel Build, Build Independent Verdict, Shared Library). Child: Shared Library only. Connections are equal, and the node counts are 422 and 156.
- Character walk (del.js): every change is ONLY the deletion of a `.slice(0,N)`:
  - QR Final: 2 x `.slice(0,2000)` (first_reply, second_reply).
  - QR Follow Final: 1 x `.slice(0,2000)` (reply).
  - Panel Build and Build Independent Verdict: 4 x `.slice(0,500)` each (closing_q and earlier_q, in the verse form and the link form).
  - LIB 2277: 1 x `.slice(0,1500)` (mlsBlock return).
  - LIB 3564: 2 x `.slice(0,400)` (closing_q, earlier_q).
  - The child's LIB 2277 and 3564 are the same.
- Database: odv1_record_question_round has no left, substr or substring call, and odv1_question_round_log has no length-limited column.
- tcuts.cjs run by W1 on the live base: ALL PASS (20).
- Library Check pair: lib and map as W4 states (test run by W4; the hashes are carried in the target).

## Standard (ASK 599)
- Rule 3 (no cut on a judge's or debater's words): 13 engine cuts and 3 child cuts are removed, and none is added.
- Rule 1: Build Independent Verdict is a dead node, and it is edited only so the twins stay equal. This is acceptable until ASK 598 stage B removes it.
- No other rule is touched.

## Ruling asked (the older TRIAL block, r.close_q and r.earlier_q cut to 400)
It does NOT join this build. It sits in __ACX of Panel Build and Build Independent Verdict, and it returns '' unless Anticheat Record ran; nothing reaches Anticheat Record since ASK 590. It shows nothing to any judge, so making it whole changes nothing. It is dead code, so ASK 598 stage A removes it, with its reader in Panel Build. Do not make it whole.

## R1 (before the card)
The mlsBlock output is no longer only shown text. mlsCarried(p, blk, I) reads it in the pkgMLS check (Panel Payloads, Alternate Payloads, R2 Alternate Payloads). A point that stands past character 1,500 of a MEANS block is now found, so a pkgMLS "not carried" item that was raised before may not be raised now. This is a change in what reaches a judge. Before the card, W4 states on stored runs 37203, 41822 and 42071 how many MEANS blocks run past 1,500 characters and whether any pkgMLS result differs between base and target. The card says so in plain words, with the count (the same rule as ASK 597 plan section 4.4).
