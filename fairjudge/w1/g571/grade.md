# ASK 571 plan draft 1 (W4, Wall 11070): GRADE PASS with C1 (W1, seat 34)

GRADE: PASS with condition C1. Plan ask571/w4/ASK571_plan.md md5 a66d9dba. COMMIT: this file.
RULES READ: op doc s29 (THE ASK FORM, one grader, BEFORE THE BUILD); s27 (validate against stored inputs); Wall manual s7.1; ruling 506 (leave nothing to chance); scope rule (change only what addresses the issue).
OBJECTIVE MET: yes. One stored copy of the L2C code, served as 7 MAP entries to the 30 engine nodes; texts unchanged except the 6 Builds, which gain 565+568 as approved.

## Checks run by W1 (independent, scratch copy of W4's scripts)
1. Base: W4 base_engine.json equals W1's own d8292f62 base (fairjudge/w1/a573/base_engine_d8292f62.json) on all 397 node parameters and connections. Child base equals W1's de9efc4e base on all nodes.
2. Rebuild: build571.js on the base gives target_engine f570e06e and target_child dd870a8c, the same md5s as the plan.
3. test571.js rerun: 106 PASS, 0 FAIL; output equal to out_test571.txt apart from sizes.
4. W1 chk.cjs (g549), engine: header sha c1c1b7db87542c3a equals the computed sha; 56 MAP modules rebuild with 0 bad; only the 7 new L2C entries change source; LIB lines changed are 3567 to 3581 only (15 appended); 31 nodes change (the 30 plus the Shared Library); 397 nodes; connections equal. Child: 54 modules, 0 bad; only the Shared Library changes; same 15 lines.
5. W1 libpair.cjs (ASK 573): the engine Library Sha node on the target gives lib c1c1b7db87542c3a, map 5a8cca206846330f; the child Library Check passes (same: true).
6. 565+568 fold: the graded target ask565/w4/build/target_engine_563_565_568.json differs from the base only inside the L2C block of the 6 Builds (outside text equal in all 6; no other node differs). So carrying 565+568 inside the L2C Build entry loses nothing.
7. Free names (W1 free.cjs, acorn) in the 7 served texts: Build, Extract, Count Plan use $ and REFP; Citation Scan uses REFP; the other 3 use none. Matches the plan.
8. REFP use in the texts is REFP.keys(), REFP.parse() and REFP.BOOKS (read). No assignment to REFP. The proxy's get trap covers all three uses.

## Condition C1 (before the write card)
write571.sh exits if the engine PUT fails, but if the CHILD PUT fails after the engine PUT succeeded, it carries on. The engine and child libraries would then differ, and the child's Library Check would throw pkgLIB1 on the next run. Add: if the child PUT is not HTTP 200, PUT revert_engine.json back at once, fetch back, and stop. Repost the script md5.

## Observations (no change asked)
O1. L2 Gloss Plan declares no REFP, but its text (Count Plan) uses REFP.keys and REFP.parse. Behaviour is the same before and after (a ReferenceError at the same call, if that path is reached), so it is not a 571 matter. The test supplies REFP to both sides, so it does not show the absence. Noted for the record only.
O2. Write order: ASK 573 (graded PASS, Wall 11075) and ASK 575 also append MAP entries. Whichever is written second is re-cut on the first's fetch-back, as W4 states. build571 cuts by text and rebuilds on the fresh fetch, so it does not depend on 573 going first or second.
