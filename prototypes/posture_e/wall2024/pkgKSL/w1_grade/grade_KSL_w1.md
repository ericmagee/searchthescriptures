# W1 grade of pkgKSL on s103 (W2, commit 33e4ba34): PASS (non-builder), with one hazard for an enforced reader stacked on it

Method: w1_grade_KSL.cjs runs each plant through Panel Cure Normalize 1 and Panel Cure Check (34108 luna, K-S3 #1) on four libraries:
live s103 (strip_KCB_base), KSL alone (strip_s103_KSL), KRO2 alone, KRO2+KSL. Labels committed before each run (4c863eba, 71ea1ce1).
Every plant also checks: KSL alone changes no live ruling; KSL changes no KRO2 ruling; no other item's row differs across the four libraries.

Reach (w1_grade_KSL_reach.txt, 9 of 9 as labeled), with a refusal sentence KRO2's reader is known to note ("It should not be counted."):
- noted on line 2, line 3, the third line under the RESPONSE line, after a blank line, and after a bullet;
- not noted on the fourth line under it (limit 3), nor after a labeled RESPONSE line for #2 or a labeled STATEMENT line for #1.
- KSL alone: 0 rulings differ from live. KRO2+KSL: 0 rulings differ from KRO2 (record-only). Other items' rows equal in every plant.

Hazard (R7, and O2/O4/O5 in w1_grade_KSL.txt): an UNLABELED line about another item ("As for #2: it should not be counted.", "#2: not
counted, ...", "- #2 is not counted either.") is attached to #1's answer. KSL cannot tell the item. On KRO2 (record-only) that is only a
wrong note; under an enforced reader (pkgFUN rev 8, ASK 2 option 1) a correct COUNTED for #1 would be refused. Suggestion: a continuation
line that names another item number ("#2", "item 2") ends the run. Not required for KSL's own spec.

Plants with my own refusal wording (w1_grade_KSL.txt, 8 of 14 as labeled): B1 "On reflection I do not count it.", B2 "...does not stand.
It is not counted.", B3 "..., so it is not counted." reach the reader but KRO2's reader does not note them; that is the reader's vocabulary
(KRO2 rev 2 notes only the forms it knows), not KSL. My "note yes" labels on B1-B3 and O2/O4/O5 assumed the reader would recognize them;
the reach set above separates the two.
