# pkgCDF rev 1 (W1): record-only follow-on to pkgCDR rev 11 (coordinator 05:10Z; W2 and W3 notes on rev 11). No ruling changes.

Built on pkgCDR rev 11's write file: `node pkgCDF/build_CDF.cjs pkgCDR/parent_s103_CDR.json pkgCDF/parent_s103_CDR11_CDF.json`.
Against rev 11 only Close Enforcer Build and Close Enforcer Record differ.

Changes
1. Hint cap fills from the latest earlier round (round 3, then 2, then 1), so padding in round 1 cannot take hints away from round 3 (W3).
2. A hint's link is read from the round text when no "LINK n" stands before it: a side link mark (D3 for the defender, C3 for the challenger) in
   the sentence, else the last one before it in that round (W2). "LINK ?" hints on the stored debates: 124 to 72 of 366 (51 resolved).
   Graders please spot-check: a wrong resolved link is shown to the enforcer as a hint; Record checks only that a CONFIRMED link is declared.
3. Record reads any word after LINK ("LINK unknown", "LINK none") as LINK ?, so such an answer is read by its id, not left NO ANSWER (W3).
4. A CONFIRMED answer refused only because its link is ? (both quotations found word for word) stays NOT CONFIRMED (form) and breaks nothing;
   its note adds "RECORD-ONLY FOR REVIEW: ..." so the scoreboard can count it (W2). A refusal for any other reason gets no such note.

Checks
- record_CDF.txt: 10 OK (pkgCDR's 7, plus R7 LINK unknown read, R8 link-only refusal marked for review, R9 other refusals not marked).
- Rolled-back insert of a RECORD-ONLY row: rows 1, recorded true.
- reach_CDF.txt: 213 of 214 labeled true drops hinted (W150, past rev 11's cap from round 1, is now hinted; W131 "concede" is not, and reaches
  the enforcer in the full rounds).
- corpus_CDF.txt: 366 hints, 72 LINK ?. size_CDF.txt: prompt size as rev 11 (mean +4,914 characters, 3.4%).
- pkgCEC probe 62 OK, 8 FAIL (the same 8).
