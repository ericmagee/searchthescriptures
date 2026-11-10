# pkgCDF rev 2 (W1): record-only follow-on to pkgCDR rev 11 (coordinator 05:10Z; W2 and W3 notes on rev 11). No ruling changes.

Built on pkgCDR rev 11's write file: `node pkgCDF/build_CDF.cjs pkgCDR/parent_s103_CDR.json pkgCDF/parent_s103_CDR11_CDF.json`.
Against rev 11 only Close Enforcer Build and Close Enforcer Record differ.

Changes
1. Hint cap fills from the latest earlier round (round 3, then 2, then 1), so padding in round 1 cannot take hints away from round 3 (W3).
2. (Rev 1's link read from D/C marks is REMOVED in rev 2, W2 FAIL: a wrong link would let Record break the wrong link.) The link stays
   as pkgCDR rev 11: the last "LINK n" before the sentence, else ?.
3. Record reads any word after LINK ("LINK unknown", "LINK none") as LINK ?, so such an answer is read by its id, not left NO ANSWER (W3).
4. A CONFIRMED answer refused only because its link is ? (both quotations found word for word) stays NOT CONFIRMED (form) and breaks nothing;
   its note adds "RECORD-ONLY FOR REVIEW: ..." so the scoreboard can count it (W2). A refusal for any other reason gets no such note.

Checks
- record_CDF.txt: 10 OK (pkgCDR's 7, plus R7 LINK unknown read, R8 link-only refusal marked for review, R9 other refusals not marked).
- Rolled-back insert of a RECORD-ONLY row: rows 1, recorded true.
- reach_CDF.txt: 213 of 214 labeled true drops hinted (W150, past rev 11's cap from round 1, is now hinted; W131 "concede" is not, and reaches
  the enforcer in the full rounds).
- corpus_CDF.txt: 366 hints, 123 LINK ? (rev 11: 124; the cap order moves one hint). size_CDF.txt: prompt size as rev 11 (mean +4,914 characters, 3.4%).
- pkgCEC probe 62 OK, 8 FAIL (the same 8).

Rev 2 (coordinator 05:16Z): change 2 dropped; changes 1, 3, 4 kept; record, reach and corpus rerun on rev 2 (record 10 OK, reach unchanged); size and the pkgCEC probe are from rev 1 (the removed change did not touch them).
