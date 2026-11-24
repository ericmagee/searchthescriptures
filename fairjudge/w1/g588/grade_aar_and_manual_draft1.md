# W1 grade: (A) ASK 588 AAR row draft 1 (aar_row_588_draft1.sql b695960b) and (B) engine manual entries 587/588 draft 1 (em_pairs 811684e9, README 0a3eb547); W3 Wall 11402, commit a55fee4f

## (A) AAR row. GRADE: PASS with F1.
1. Grades check logic, run on the row's own grades and md5_written (builder W4): 024290a7 ok (W1 PASS 11393), 16ed1670 ok (W1 PASS 11393), 7ede01fb ok (W1 PASS 11397). The FAIL element is on 6e2334ab, which is neither written nor a target, so it does not touch them. All 12 jsonb blocks parse.
2. All 32 file md5s in build_files, plan and revert checked by me with md5sum: all match, including revert_eng588 = put_eng587 fa65147f and revert_child588 = put_child587 94519e1b.
3. The facts agree with my 11393, 11395, 11397 and 11401.
4. F1: W4 reported at 00:33 CST that the "[QUESTION ROUND v1: ...]" line never writes on a live run, because Build Save Body runs before the round (fix ASK 588 R, commit e3e84ce4, not graded yet). The row states that review_notes carries the line (objective_met_reason, the run_evidence EXPECT). Correct it:
   - state the defect and that ASK 588 R is its fix;
   - change the EXPECT to read from the new record (or say that no record exists until 588 R is written);
   - add W4's mistake.
   My 11393 grade missed it too: T6.1 tested Build Save Body's text, not where it sits in the live path. That is my mistake.

## (B) Manual entries. GRADE: PASS with F1.
1. Every old text occurs once in its part's latest version: 11.1 v275 2bd146c1 34,704; 14.0 v263 5901894e 2,954 (both pairs); 17.1 v242 816523d5 20,347; 09.2 v242 7b81e93a 39,649. This matches the README.
2. The 11.1 entry agrees with plan587 rev 3 and my 11357 and 11361. The 14.0 entry agrees with the 588 and D7 builds as graded.
3. F1: the 14.0 "Record" sub-bullet ("review_notes carries one line ...") is false on a live run until ASK 588 R is written. Change it to what the engine does now, and add the gap to the 17.1 limits line. Rewrite it when 588 R is written.
4. Q4 confirmed. In the live library (engine 06ba53ad), the run test is `ownRun` (find it by the text "ASK 586 B: the answering side's own words outside its quotation marks"; the test is on the next line, 2681 in this version, not 2679 or 2680). A 6-word run found inside quotation marks in a round is skipped only when it is not in the answering side's own words outside its quotation marks. That is the 11.1 item 2 wording. Cite the line by its text.
5. Q1, partly: live QR Ask Build still carries "Watch the closing rounds for contradictions ... uses AGREE", and QR Check still checks earlier_round. But "qrCheck keeps ruling 415's checks" must be checked against the fixed forms (D2 dropped the framing-word list). W4 gives the true sentence. Q2 and Q3 are W4's.

OBJECTIVE MET: (A) and (B) yes, once F1 is applied in each.
