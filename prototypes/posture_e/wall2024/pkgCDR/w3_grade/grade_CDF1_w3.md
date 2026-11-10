# W3 grade of pkgCDF rev 1 (W1, commit 8b8d6313; write file pkgCDF/parent_s103_CDR11_CDF.json): FAIL on change 2 (link read from a mark). Changes 1, 3 and 4 pass.

## Change 2 is not record-only, and it can put a break on the wrong link
Close Enforcer Record breaks whatever declared link the enforcer writes; it does not compare it with the hint. The prompt tells the enforcer "Use the link the earlier sentence belongs to", and the hint line shows a link. On pkgCDR rev 11 a round 1 or 2 hint shows "LINK ?"; an enforcer that copies it and answers CONFIRMED breaks nothing (record-only). On pkgCDF the same hint shows a number taken from the last "D<n>" or "C<n>" before the sentence.
Two plants (record_cdf2.txt), a real drop in [CR2] restated in [CR4], the enforcer copying the hint's link:
| plant | rev 11 | pkgCDF |
|---|---|---|
| drop after "The challenger sets this against D5." and "On the genealogy, which is my D2 ground, ..." | LINK ?: NOT CONFIRMED (form), nothing broken | LINK 2: CONFIRMED, DEFENDER LINK 2 broken |
| drop after "The challenger presses D5 hardest; my answer on D5 is above." (the drop is about the genealogy) | LINK ?: nothing broken | LINK 5: CONFIRMED, DEFENDER LINK 5 broken, the wrong link |
So a link now resolved does let a CONFIRMED break a link that rev 11 would not have broken, and the link is whichever mark stood last.

## The stored debates show the marks are often the wrong link (cdf_links.cjs / .txt)
366 hints; 72 still "LINK ?"; 52 newly numbered, all 52 from "the last mark before it", none from a mark in the sentence; 29 are challenger hints, 23 defender. Read by eye, with the text before each:
- The challenger's rounds 1 and 2 are organised under the DEFENDER's links ("**LINK D3:**", "**5. LINK D5.**"), and the code reads the challenger's "C<n>" marks. Hints standing under a defender-link heading get an unrelated number: 33411 DR1 under "8. **LINK D5:**" shows LINK 1; 33705 DR1 under "1. **LINK D1.**" shows LINK 4; 33627 DR1 under "3. **LINK D3:**" shows LINK 1; 33430 DR1 under "**5. LINK D5.**" shows LINK 1; 33442 DR1 under "4. **LINK D4:**" shows LINK 2.
- The enforcer prompt says the challenger's links are the numbers of its LINK blocks in [DR3]. A "C<n>" in [DR1] or [DR2] is not shown to be that numbering.
- Defender hints under a "**D4.**" or "**D5 (...)**" heading are right (33592, 33644); those after a passing mention of another link are not checkable by code.
No numbered hint of rev 11 changed number. The hint set is the same as rev 11 in all but one debate (order of the cap).

## Changes that pass (record_cdf.txt, 8 OK)
1. Cap order: with 40 padding drops in [CR1], the defender's 30 hints keep all of round 3 (6), round 2 (1), then round 1 (23); the D6 drop is among them.
3. "LINK unknown" and "LINK not known to me" on a NOT A CONTRADICTION answer are read as answered. "LINK six" CONFIRMED breaks nothing.
4. RECORD-ONLY note: present on a CONFIRMED whose only fault is the link ("LINK unknown" with both quotations word for word); absent when the closing quotation is also not found, and absent for an undeclared link 99. The D6 hint CONFIRMED on LINK 6 still breaks LINK 6.

## Ask (idea only)
Remove change 2 and keep changes 1, 3 and 4. With the RECORD-ONLY note, a CONFIRMED the enforcer could not tie to a link is already visible for review, which is the safe outcome for a hint whose link the code does not know. If a link is wanted, the only mark I found reliable on the stored record is the defender's own paragraph heading ("**D4.**" opening the paragraph the sentence stands in); nothing for the challenger before [DR3].

Not done because of the FAIL: rolled-back insert of the RECORD-ONLY row (W1's is reported; mine follows on the rebuild).

## pkgQRA
The top that passed is pkgCDR rev 11; pkgQRA rev 2 on it is pkgQRA/parent_s103_CDR11_QRA.json (probe 23 OK, Wall 4033). pkgCDF does not change Judge Contradiction Build; pkgQRA also applies to pkgCDF's file (pkgQRA/parent_s103_CDR11_CDF_QRA.json, probe result in pkgQRA/probe_QRA_on_CDF.txt), kept only for when pkgCDF passes.
