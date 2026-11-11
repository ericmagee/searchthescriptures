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

## Option B (parent_s120_ACXB.json, sha256 e4358f7c940ae296; claim Wall post 4676)

Runs by a delegated worker (gB.cjs, gB_out.txt); expectations posted first; verdict mine.

VERDICT: NOT PASSED, on the wording (B5). The code does exactly what it states.

- B0: only Panel Build and Build Independent Verdict differ, +72 each, the same insertion in both; connections equal.
- B1, B2, B4: on stored 34852, 34726 and 34780 every anti-cheat note carries the phrase once, the phrase stands nowhere else, and with the phrase taken out the outputs equal s120 (only the number transcript_chars differs, by 72 per note). Build Independent Verdict is not in the 34780 export, NOT RUN there.
- B3: no anti-cheat row, and Anticheat Record not run: equal to s120.
- B5 FAIL: in 34852 the Matthew 1:19 note now reads "The close sentence is disregarded (this note breaks no link; it is not a confirmed closing contradiction)" on the pair "A man who knew himself the father would have no cause to put her away..." against "I drop the claim that a father would never have thought of putting her away." The next block of the same prompt, CONFIRMED CLOSING CONTRADICTIONS, lists the same two sentences as confirmed and D3 as BROKEN. The judge is told of one pair that it is not a confirmed closing contradiction and, a few lines on, that it is one. The phrase is false whenever the closing enforcer confirmed the note's pair.
- Suggested, W2's decision: wording that is true in both cases, for example "(this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed)".

## Option B rev 2 (parent_s120_ACXB2.json, sha256 56cd7e51ea9b4e59; claim Wall post 4691)

Runs by a delegated worker (gB2.cjs, gB2_out.txt); expectations posted first; verdict mine. The wording is the one I suggested.

VERDICT: PASS, one case NOT REACHED.

- C0: only Panel Build and Build Independent Verdict differ from s120, +109 each, the same insertion; connections equal.
- C1: on stored 34852, 34726, 34780 each note carries the phrase once, the phrase stands nowhere outside a note, and with it taken out the outputs equal s120 but for transcript_chars (+109 per note). Build Independent Verdict is not in the 34780 export, NOT RUN there.
- C2: no anti-cheat row, and Anticheat Record not run: equal to s120.
- C3: in 34852 the title "[CONFIRMED CLOSING CONTRADICTIONS" stands once in each prompt, after the notes.
- C4 NOT REACHED: no stored prompt has a note without the confirmed block, so the phrase naming an absent block was not read on stored text.
- Does not cure (W2 stated it): the anti-cheat note and the closing enforcer can still disagree on a pair; the phrase only tells the judge which of the two is a confirmed contradiction.
