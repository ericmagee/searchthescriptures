# W3 grade of pkgCDL rev 2 (W1, commit 82b5269b; write file pkgCDL/parent_s103_CDR11_CDF_CDL.json): change 1 PASS; change 2 FAIL as built (it can drop a rightful break)

Tests: record_cdl_rev2.txt (my rev 1 set on rev 2: 62 OK, 0 FAIL) and record_cdl2.cjs / .txt (new). Only Close Enforcer Record differs from pkgCDF rev 2.

## Change 1, link text of any length: PASS
- T1 a CONFIRMED with a link text of 110 characters is read by its id, LINK ?, nothing broken, RECORD-ONLY note (pkgCDF rev 2 could not read the line).
- T2 the same text on NOT A CONTRADICTION is read as answered.
- T3 a link text that itself holds " -- CONFIRMED -- " before a NOT A CONTRADICTION verdict breaks nothing.
- All 24 short forms and the challenger forms of my rev 1 grade read as before.

## Change 2, two CONFIRMED lines on one candidate: FAIL as built
The rule refuses the second line whenever its link differs, whatever its closing quotation. Two different cases get the same treatment:
- T6, the SAME closing sentence answered on LINK 6 and then LINK 5: the enforcer could not decide the link. One break is right. Rev 2 keeps the first and marks the second: correct.
- T4, TWO DIFFERENT closing sentences, each word for word in [CR4], each holding the dropped wording, answered on LINK 6 and LINK 5: these are two restatements, each a contradiction in its own right. pkgCDF rev 2 breaks both links; pkgCDL rev 2 breaks only the first and marks the second for review. A hint has no closing sentence named, so one hint is exactly where a second restatement under another link is answered under the same id (the prompt says NEW only for what is not among the candidates).
- T5, the same two lines in the other order: the link kept is whichever line came first, so the break that survives depends on the order of the enforcer's lines.
So the answer to the coordinator's question is yes: a true contradiction that touches two declared links can lose a rightful break. It is marked RECORD-ONLY FOR REVIEW, but the operator's rule is that a confirmed closing contradiction breaks the link.
Also: the rule is not limited to hints. It applies to X and J candidates, which are live; there it changes a live ruling (two lines, two links, both broken today). That needs the operator's approval as an enforced change, in the direction of fewer breaks.
Unchanged and correct: two NEW lines with different pairs both break (T7); a refused first line does not block a good second line (T8, T9); a NOT A CONTRADICTION and a CONFIRMED for the same hint remain "conflicting answers", nothing broken (T10).

## Ask (idea only)
Refuse the second line only when its closing quotation is the same sentence as the first line's (T6). When the closing quotation is a different sentence, keep both breaks, as pkgCDF rev 2 does. Then the change removes only the enforcer's indecision about one sentence and can never drop a second contradiction.
