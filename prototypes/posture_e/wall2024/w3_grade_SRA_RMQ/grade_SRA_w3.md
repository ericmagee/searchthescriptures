# pkgSRA (W1; ASK 166, "count an answer in the same round under another verse") : W3 grade

File graded: wall2024/parent_s173_SRA.json, sha256 3c2e4e227dbe1865 (on s173; live is s174, a rebase is owed before any write).

## Verdict: NOT PASSED (one finding, F1). The rest holds.

## What holds (MEASURED this turn)
- Identity against fetchback_live_s173.json: one node differs, Shared Library, code +2,414; connections equal; 443 nodes.
- Packing check (ASK 120): 43 stubs, 2 throwing (Alternate Build, Early Alternate Build); library sha ab7efdff97f2d8ac, 3,472 lines.
- The built Judge Enforcer Build run on the stored export of run 34852: 90 answer-check items, 56 carry the new text; the Alt node 1 of 1. Item B13 (Matthew 1:20, the naming) is served the Luke 1:13 line holding "Naming is not the father's alone". The case of ASK 166 is reached.
- Verse forms (trailing space, lower case, range, brackets, null, empty): no throw.

## F1 (NOT PASSED): the press's own stated meaning is served as the answering side's line
Rule as posted: a line is left out if it "is a press or MEANS line". MEASURED on run 34852, Judge Enforcer Build: 17 of 84 served lines come from the round's press material, in two forms the filter does not know:
1. "MEANS [CR3] P1.1: "<the stated meaning>"" : the answering side's round [DR3] repeats the meaning of the press it answers. Items B30, B31, B33, B34, B38, B40. In B34 (Matthew 1:20) the ONLY served line is the item's own stated meaning, word for word: "the stated source of the begetting is the Holy Ghost". These lines win the pick by construction, because they hold every word of the meaning.
2. "N. The inference that ..." : the side's own numbered challenge lines, which restate the other side's claim (B1, B18, B19).
Effect: the new rule sentence says an answer counts "when in its own words it meets the stated meaning". A check that is handed the meaning itself, labelled as the side's own line in the same round, can read a miss as MEETS. This is the direction that excuses a debater, and it is silent.
Also not as labelled, harmless: in B30 the second served line is the answer's own block (the answer sentence stands in it with "So 7:16" before it; the six-word test does not see it, and the line names "7:16", not "Hebrews 7:16").

## Fix asked (planted by me first; p.cjs in w3/grade_SRA/)
- Leave out any line that begins with MEANS (after marks), and any line of the round's numbered press list ("N. The inference that").
- Leave out any line that holds the stated meaning itself (normalised text of the meaning inside the normalised line).
- Leave out a line that holds the answer sentence anywhere, not only at its start.

## Limits to carry (not grounds of the verdict)
- (a) A restated claim of the other side or a grant under another verse is served when it shares the words (my plants D and E); the check judges.
- (b) The same answer in other words is not served (plant C). Builder's limit 1.
- (c) An answering sentence past the 400-character cut is lost; the cut is marked " ..." (plant B).
- (d) "One word found in three lines or fewer": a fourth line holding the key word in the round stops every pick for that word (seen on an earlier copy of the 34852 round text: nothing served for B13).
- (e) On an error the text is left out without a mark (try/catch returns empty); the item is then checked as on live.
- (f) Size as measured by the builder: DeepSeek answer-check prompt +546,526 characters over 13 stored exports (about +9%); about half the runs gain one call. Whether DeepSeek's grade changes is shown only by a paid call.
