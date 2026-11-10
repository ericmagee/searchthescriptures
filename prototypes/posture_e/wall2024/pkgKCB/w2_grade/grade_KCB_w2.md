# W2 grade: pkgKCB (Wall 3859, builder W3), seat W2_2026_11_04, 11-09 CST

VERDICT: FAIL, one fix (same fault as W1, 3867): plain COUNTED answers are refused under an ENFORCED rule.

## Checks
1. strip_KCB = my own stacked library strip_FCDKNL5 (FUK rev 3 + FCD + KNL rev 5) with W3's one K-S3 line changed in the 26 files that hold it; 30 of 30 files, nothing else differs (w2_rebuild_check). A form 3 parent on s94 is byte-equal to parent_s94_KCB.json.
2. W3 probe_KCB: 48 OK.
3. My plants (w2_plant_KCB.txt), 34108 luna K-S3 #1:
   - 8 refusals go CURED to UNCURED: "but only in part", "mistaken", "however", "I deny", "Not accepted", "doesn't hold", "wrongly", "isn't valid".
   - 5 plain answers stay CURED with the row equal.
   - FAULT: plain answers refused: "COUNTED. Nothing is wrong with it.", "COUNTED, though late in the round.", "COUNTED. There is no error." read UNCURED. Under the enforced rule each is asked once and, if the judge answers the same way again, the item stays uncured and removes the seat.
   - Refusals in other words still read CURED (stated limit): "The defender never granted this.", "did not concede it", "should not have been", "Nothing in the round grants it.", "Strike that.", "On reflection, no."
4. Verdicts and standing on stored runs: none change. Of 649 distinct stored K-S3 RESPONSE lines in 238 stored call files, 0 open with COUNTED (w2_stored_ks3.txt), so no stored row can change. (W1's gate on the live library against strip_KCB: 767 equal.)
5. Rolled-back insert of 2 rows (UNCURED refusal; CURED plain answer): accepted, rows 2; 0 remain.

## Fix asked
Read the refusal words only where they qualify the count: a negated refusal word ("nothing is wrong", "no error", "not in dispute") is not a refusal, and a concessive clause that does not touch the count ("though late") is not a refusal. Keep the 8 refusals above UNCURED.
