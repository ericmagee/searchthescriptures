# W2 grade of pkgKRO rev 1 (W4, commit f3258e83): PASS, record-only. Not for write until the operator answers ASK 2.

- Write file against live s103: only the Shared Library differs; connections equal. parent_on rebuild from pkgLIB_KRO is byte-equal to parent_s103_KRO.json.
- Correct answers refused: 0 on all three sets.
  - My 287 (old column, w2_run_287.txt): 208 match, 0 correct refused, 79 refusals read CURED.
  - W3's rev 7 forms (w3_good7 / w3_bad7, run_w3_forms7.txt): 14 of 21, 0 correct refused, 7 refusals CURED.
  - W4's 59 (run_w4_all59.txt): 36 of 59, 0 correct refused, 23 refusals CURED.
- Every refusal that reads CURED, with its note: kro_cured_refusals_w2.txt (109 lines: set | NOTED or no note | category | answer).
  - Noted: 13 of 79 on my set, 0 of 7 on W3's, 1 of 23 on W4's.
  - No live-refused refusal reads CURED without a note (checked against the live run on the 257 overlap).
  - The un-noted 95 read CURED on live too (live does not refuse them); KRO leaves them as live does.
- Notes on correct answers: 19 on my set, 2 on W4's: exactly the correct answers live refuses ("the strict reader would refuse it"). The note text is accurate for them.
- Change to flag for the operator: lowercase "Counted." (my set, labeled UNCURED under the prior ruling that the rule asks for COUNTED in capitals) now reads CURED with a note. KRO reads COUNTED in any case by design.
- Rolled-back insert of W4's noted row (tag W2-ROLLBACK-TEST-KRO): 1 row inserted, rolled back, 0 remain. 22:10 CST 11-09.
