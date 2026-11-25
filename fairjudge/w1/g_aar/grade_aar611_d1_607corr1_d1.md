# W1 grades: ASK 611 AAR row draft 1 (aar/w3/aar_row_611_draft1.sql bb7f161d) and ASK 607 correcting row draft 1 (aar/w3/aar_row_607_corr1_draft1.sql 8a2054ad)

## A. ASK 611 row draft 1: PASS WITH N1, N2
RULES READ: the ASK AAR row method (ASK 497); my g611 files; Wall 11651, 11653, 11654, 11657, 11675, 11783, 11797.
OBJECTIVE MET: yes; 'no' is the right value (42283 failed on the change, 42373 lost every panel send-back to it, fix 2 not yet exercised).
STANDARD (ASK 599): not applicable (a record).
CHECKED:
- md5s (md5sum this turn): the targets b15ab82f, afc58aff, b7950f11, 54ea737d, 755e6aed; the reverts 2b51ed3f, ffe11645, abd37b0d, b4b44aea, 902fac62; build611 f191ae10; notes611 7c902eb9; writef2_run 447e1e7c. All equal.
- Run evidence (SQL): 42373 has 58 panel send_back rows (sol 29, sol62 15, spark 14), 53 "no panel request for this seat", 5 TRIAL, 0 answered. All equal. 42071 has 87 panel rows and 0 not sent; both equal.
- The revert note is right. revert_eng_f2 / revert_child_f2 return to 3afa1c1f / cd97165c (611 with fix 1 and the defect). The three earlier files are STALE because 608, 607, 623 and 579 were written after them. No file restores "before 611" with the later ASKs kept.
N1 (W3's question on b15ab82f): a better grade exists. Wall 11654 is my grade of the re-cut itself: "ASK 611 re-cut (b15ab82f, afc58aff, df88e616): my rev 1 PASS stands", with rev 1 to re-cut differing only in Init Seats and Resolve Seats. Use wall_id 11654 for the b15ab82f grades element (verdict "PASS (re-cut of build rev 1 on 21316a8e)"). Keep 11657 in readbacks, where it already is. The readback is not wrong as a source, but 11654 is the grade.
N2: "68 answered" for run 42071. My count of rows with a non-empty response_line is 73 of 87 (SENDBACK 49, ENFORCER 18, GATE 4, KEYSTONE 1, CONCEDED LINKS 1). Either state the definition behind 68 or use 73. The value comes from the 42373 AAR I confirmed, so this is my miss too.

## B. ASK 607 correcting row draft 1: FAIL, F1
RULES READ: diff against aar_row_607_draft3.sql 4375abf7; debate_enforcer_log; the live Library (gateCure2024, the ASK 549 reader).
OBJECTIVE MET: no, until F1 is fixed: the row still holds the defect it corrects.
CHECKED:
- The diff from draft 3 from BEGIN on is four lines (rev, prior_row, run_evidence, sources), as W3 says.
- SQL: 0 rows in the table whose cure_reason holds "pkgFRM refused the gate change"; 42373 has 1 E-GATE row.
- The mark text is right. Live Library: why = rfs + " refused the gate change; the judge's line before the change stands (recorded, no seat removed): " ...; it stays uncured and is record-only.
- Rows 48615 and 34323 have the form "GATE CHANGE TO: ... | ENGINE: ... | pkgRCT refused the gate change ...". They are pkgRCT rows with status CURED, so they show the text form only; the draft's wording "of the same reader" is acceptable.
F1: objective_met_reason was left as in draft 3 and still holds both errors:
- "the mark of the change in a run is an E-GATE row whose result reads \"pkgFRM refused the gate change ... (RECORD-ONLY)\"", the same "result" error the row exists to correct;
- "Not shown by a run: no run since the write.", which run 42373 has now made false.
Fix: in objective_met_reason, replace "Not shown by a run: no run since the write." with "Not shown by a run: run 42373, the one run since the write, held no gate form refusal (UNEXERCISED)." Replace "whose result reads ... (RECORD-ONLY)" with "whose cure_reason holds \"pkgFRM refused the gate change\" (record-only, see run_evidence)". The header must then name five changed values, not four.
W3's MANUAL QUESTION (11.2 "whose reason begins pkgFRM refused the gate change"): the engine's reason does begin so, but the stored cure_reason begins "GATE CHANGE TO:", and a seat that runs cure_reason LIKE 'pkgFRM%' will find nothing. I would revise it with one pair naming cure_reason and the "| pkgFRM refused the gate change" segment, on the 611 manual card as you propose.
