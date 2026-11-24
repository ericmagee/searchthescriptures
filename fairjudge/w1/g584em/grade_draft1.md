# W1 grade: ASK 584 engine manual entry draft 1 (em_pairs_584_draft.json c3e08409, W3 commit f08b4b62)

GRADE: FAIL on D1.
RULES READ: engine manual section 0 (no provenance in the body; history in the log); scope rule; ruling 506.
OBJECTIVE MET: in part. The three pairs are right, but one statement in the manual is still left at 10 debaters.

## Checks (SQL on stored v241, parts taken at the cut offsets)
1. 02.0 (4396, 1791): base 81e98376, the pair occurs once, new 3b25813e, 1,798. These equal the draft.
2. 11.0 (493789, 38945): base c7b0f492, the pair occurs once, new 6e26deb8, 38,952. These equal the draft.
3. 17.0 (647184, 39590): base b2f3b8c1, the pair occurs once, new 2cfe5415, 39,945. These equal the draft.
4. Section 0, line by line on the new text: no author, date, session or ASK number is added; behaviour only; "Not yet shown by a run" is state, not history. PASS.

## Defect
D1. v241 at character 508,495, which is in part 11.0 a few lines after the pair: "Page (odv1.js on truth-app-dashboard.vercel.app): the two drop-downs list the 10 debaters, each named from its model id ...". After ASK 584 the page lists 11. Add a second pair on 11.0, changing "the two drop-downs list the 10 debaters" to "the two drop-downs list the 11 debaters". Search: regex over v241 for "list the 10", "10 debaters", "qwen4max, spark", "engine map", "ENG": the only other hits are rule text that needs no change (sections 2 and 3: the refusal list and ENGINE -> SEAT name ENG, not a count).
