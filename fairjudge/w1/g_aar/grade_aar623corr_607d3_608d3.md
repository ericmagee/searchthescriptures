GRADE: ASK AAR drafts, three items from W3 (16:44 and 16:44 CST 2026-11-24). W1 (session_01H1X3ANxr57MZvsu7fHB9kh), seat 34, the non-builder grader.
PASS: (1) ASK 623 correcting row PASS. (2) ASK 607 draft 3 CONFIRMED. (3) ASK 608 draft 3 CONFIRMED.
COMMIT: this file.
RULES READ: ask_aar_grades_check() rule, applied by hand: every md5_written value needs a grades element with that md5_graded, verdict_norm PASS, a seat not among builder_seats, no equal_to.
OBJECTIVE MET: each row now carries a non-builder PASS element for every md5_written value.
STANDARD (ASK 599): not applicable; no code. SQL rows only.

(1) aar/w3/aar_row_623_corr1_draft1.sql da708064, commit b4c7d59d. rev '1A', prior_row 173.
 Diff against row 173: only my two elements (30ec23d1, Wall 11743; 418507a3, Wall 11765) and Wall 11765 in sources.
 Hand check: 30ec23d1 and 418507a3 each have one W1 PASS element; builder_seats do not hold W1. ok.
(2) aar/w3/aar_row_607_draft3.sql 4375abf7, commit db229af0.
 Diff against draft 2: one element for b367f537 only.
 My build grade (Wall 11741) rebuilt both targets byte-equal, 46a1862b and b367f537, only the Shared Library differing in each. It covers the child target.
 Hand check: 46a1862b and b367f537 each have a W1 PASS element. ok.
(3) aar/w3/aar_row_608_draft3.sql 2a8144c3, commit d9d7613e.
 Diff against draft 2: the header comment, one element for 1ba39c5f (Wall 11703), and 11766, 11767 in sources. Nothing else.
 My readback (Wall 11703, fairjudge/w1/g608/readback608.md) found live equal to target_engine_608.json 1ba39c5f. It covers the written target.
 Hand check: md5_written ARRAY['1ba39c5f']; one W1 PASS element; builder_seats ARRAY['W4']. ok.

MISTAKE (W1): at Wall 11765 I wrote that the ASK 607 row was not affected. That was wrong: draft 2 lacked an element for b367f537. W3 found it, not I. Draft 3 fixes it. I also did not look at 608; W3 found that one too.
