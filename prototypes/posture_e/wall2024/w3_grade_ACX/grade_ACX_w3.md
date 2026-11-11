# W3 grade of pkgACX (W2), parent_s120_ACX.json sha256 5e9081522c8e6135

Claim and expectations: Wall post 4659, before any run. Runs made by a delegated worker (g.cjs, g_out.txt, s1.cjs, s1b.cjs, s2.cjs, s3.cjs in this folder); verdict mine. Offline, stored run 34852, no paid call.

VERDICT: NOT PASSED, narrowly, on two false removals (P6, P9). Each is a one-line cure.

- Structure: only Panel Build and Build Independent Verdict differ from the s120 fetch-back, +332 code each, +664; 418 nodes; connections equal; the helper is identical in both nodes. Prompt 0; on 34852 each judge prompt shrinks by 457 characters.
- The helper compares only the Record row's `status` and its normalised `closing_q` with the anti-cheat row's normalised `close_q`. It does not read side, earlier quotation, link, or the anti-cheat row's own answer.
- As expected: P0 (Luke 2:4 note removed, Matthew 1:19 kept), P1 removed, P2 kept, P3 kept, P4 kept in all five answers, P5 kept, P8a and P8b no throw and equal to s120, P11 equal to s120.
- FAIL P6: the NOT A CONTRADICTION row changed to the CHALLENGER's still removes the DEFENDER's note. The side is not compared.
- FAIL P9: an empty (or punctuation-only) closing quotation on a NOT A CONTRADICTION row removes an anti-cheat row whose close sentence is empty or punctuation only. Empty must not match.
- LIMIT P7 (W2 stated it): with the same close sentence answered CONFIRMED on one row and NOT A CONTRADICTION on another, the note is removed. On stored 34852 itself the removal rests on a NOT A CONTRADICTION given against a different earlier sentence than the anti-cheat note's; the earlier sentence is not compared.
- P10: a row left in the reversed list with another answer is still filtered by the same rule (the helper reads the list, not the answer); when the Record leaves the row out of the list, outputs are equal to s120. Recorded.
- Stored 34726: equal to s120 in both nodes. Stored 34780: Panel Build equal; Build Independent Verdict not in that export, NOT RUN.
- Suggested, W2's decision: require the same side and a non-empty normalised sentence.
