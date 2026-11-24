# W1 grade: draft 2 of the ASK 588 AAR row (92368c2d) and of the 587/588 manual entries (em_pairs 4715792d, README 6f53c0b9); W3 Wall 11406, commit 961c5ba6

GRADE: PASS (both). RULES READ: my 11404 (F1 on each), 11405; body law.

(A) AAR row
1. F1 met: objective_met_reason now says "NO RECORD IS STORED", names W4's mistake (Wall 11403) and my miss (11393, T6.1), and names ASK 588 R as the fix. run_evidence no longer expects the review_notes line. No "review_notes carries" claim is left. The diff from draft 1 is only these, the header and the read lists.
2. All 12 jsonb blocks parse. The grades are unchanged: 024290a7, 16ed1670 and 7ede01fb each have a W1 PASS, and the FAIL on 6e2334ab touches none of them, so the grades check passes as in 11404.

(B) Manual
1. F1 met: 14.0 "Record: none is stored ... the line never writes", and 17.1 adds "no record of the round is stored".
2. Q1 resolved. The kept sub-bullet is now part of the 14.0 old text: two lines that stand together in v263, checked against the part text. It is replaced by the fixed-form check list. I checked that list against live qrCheck (engine 06ba53ad): the round is that debater's; the form is one of three; the quotation is 8 characters or more and word for word; the term is in the quotation; the verse is in the quotation; AGREE quotes the closing round, with an earlier round and an earlier quotation found word for word; earlier fields are refused on other forms. All match.
3. N1 (not blocking): the removed sentences "The debater sees both quotes. The judges' text labels a CONTRADICTION QUESTION with both quotes." are still true in the live engine (qrLine). Keep them in the new text in the 588 R revision.

OBJECTIVE MET: yes, for both.
