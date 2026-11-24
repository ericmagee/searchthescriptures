# W1 GRADE: ASK 591 build rev 0 (Wall 11539, W4 commit 70d4ec64)
GRADE: PASS WITH F1, F2 on every part I could run; T3 NOT RUN (database approval prompt timed out at my seat too). COMMIT: this file. Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: 512 (live, not trial), 518, 519, 383, scope rule, plan591 rev 4 and my rev 4 ruling on L3. OBJECTIVE MET: yes for the engine and page; the save rule differs from the plan (F1).
STANDARD (ASK 599): met on the files read (no dead code found, one copy of the order, checks on what comes back, read raises, no silent catch); F2 is a rule 7 point.

## Inputs (md5 checked)
build591.cjs 761b21b7, mig591.sql 4cb26b1b, t3_sql.sql 0b2ea1bb, t591.cjs 62af78eb, write591.sh 3f8be5a8, revert591.sql bbff66e6, judge591.js 7a2bbdd7, odv1.js 4f3935d8, patch.js e7454625.
target_engine_591.json e8a3c37a, target_engine_591_onj3.json b5c17750, base J3-on-J2 target_engine_j3_onj2.json 63b4fa34.
W4's base_eng.json nodes equal my own live fetch of v489b977b (rb3/live_489b977b.json).

## Reruns at my seat
- t591 base C (my live 489b977b) -> target_engine_591: ALL PASS 8 (T1 360 cases, T2.js 1800, T4.1-T4.4, T5, T6 422 -> 423).
- t591 base D (J3-on-J2) -> target_engine_591_onj3: ALL PASS 8. (With base C against the onj3 target, T6 lists the J3 nodes, as it should.)
- cmp.js, both bases: 422/423, diffs only Init Seats, Build Save Body, Accept Build parameters, extra Judge Order Read, connections.
- Standing set: 29 PASS, 0 FAIL on both targets. Library Check pair (target C with live child e086bb3a): PASS, LIB unchanged.
- Dashboard: odv1.js differs from live only by haiku out of ODV1_PICK (completes 593 on the page); patch.js adds judge591.js to the loader and one comment line. judge591.js 78 lines; one write path, judge_order_save.
- dash_api patch raises if its anchor is absent. It does not check the anchor occurs once (replace would double a second copy). Not read on the live function this turn (DB tool blocked).

## Deviations
- Stated: panel minimum three, not four. ACCEPTED: the seed (the live order) has three panel seats; four would refuse it.
- F1 (UNSTATED): plan L3 as ruled in my rev 4 grade was "warn on the pairs present in the seeded order (fixed at seed time), refuse an order that adds a new pair", with T3 testing the warning naming the 2 pairs and a third pair refused. The build instead refuses any seat not named in odv1_record_panel_substitution. With ASK 594 live (qwen4max on the recorder list) the seeded order has no such pair, so the warning would be empty and the stricter rule saves the seed; I accept the substance. W4 must state the change in notes591.md and on the migration card, and T3 tests 1 and 9 stand in for the plan's warning tests.
- F2: the list check is position('''seat''' in prosrc) of the recorder. A seat quoted anywhere in that function text (a comment, a message) passes. Guess, not checked on the live text: no false pass today. Fix or state it: read the list from one named place (rule 2, one copy), or accept with the reason on the card.
- Minor: in the save function v_before is read before the LOCK; two saves at once could log a stale "before". No fix needed for a one-operator page; noted.

## Owed before the migration card
- T3 run (temp tables only). It needs the database tool's approval at a seat. Both W4's and my run timed out.
- F1 stated in notes and on the card; F2 fixed or stated.
