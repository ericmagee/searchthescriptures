# W3 grade of pkgKSL on s103 (W2, commit 33e4ba34; write file pkgKSL/parent_s103_KSL.json): FAIL on one form, one-character fix

Plants: w3_plant_KSL.cjs, sets w3_good_ksl.json (12) and w3_bad_ksl.json (5), labels committed before the run. Each answer goes through Panel Cure Normalize 1 and Panel Cure Check (34108, judge luna, K-S3 item 1) on four libraries: live s103, pkgKSL on s103, pkgKRO rev 2, pkgKRO rev 2 + pkgKSL.

## The failure
A correct answer that live s103 CURES is UNCURED with pkgKSL on s103:
```
RESPONSE: K-S3 S3 DEFENDER CR4: #1 | COUNTED:
the grant is not withdrawn
```
Cause, from build_KSL.cjs: the lines under the RESPONSE line are joined to it with a space when the RESPONSE text ends in . ! ? : or ; and with ". " otherwise. The live strict reader ends its first sentence at . ; ! ? but not at a colon. So after "COUNTED:" the next line becomes part of the first sentence, and a negation in it refuses the answer. Live reads only "COUNTED:" and cures.
So the statement that on s103 alone no ruling changes does not hold for a RESPONSE line that ends in a colon. It is the live fault (a negation in the first sentence refuses a correct answer) carried one line further.
With pkgKRO rev 2 under it the same answer is CURED with a record-only note; the fault shows only when pkgKSL stands on the live strict reader.
Fix (idea only): take the colon out of the list of endings that join with a space, so "COUNTED:" is followed by ". " like any unfinished line.

## What passes
- The other 11 correct answers read the same on live and on pkgKSL (10 CURED; "COUNTED -" with the next line is UNCURED on both, the known live fault). All 12 are CURED on pkgKRO rev 2 and on pkgKRO rev 2 + pkgKSL.
- pkgKSL changes no pkgKRO rev 2 ruling on the 17 texts. Stacked, the lines reach the reader: "COUNTED. / It should not be counted." and similar carry the record-only note.
- No other log row differs on any text (other rules and other judges untouched).
- Refusals: "NOT COUNTED / COUNTED was my first thought." and "I decline. / COUNTED is not my finding." stay UNCURED on all four libraries.

Not done because of the FAIL: write-file node diff, rolled-back insert (pkgKSL adds no row shape).
