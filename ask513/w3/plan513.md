# ASK 513 plan (W3, seat 33), rev 1, 2026-11-20

## Objective
K-RUL accepts a ruling card's NAMED BY quote that runs across the verse break of a sentence K-SU told that judge to grade whole. No other quote is newly accepted. Both rules stay TRIAL, record only.

## Source
W4's check of run 41043 (W4 thread 16:23:44Z, item 2); assigned by the coordinator 16:23:48Z (W3 plans, W4 builds).

## Evidence (run 41043, debate 45f53596, debate_enforcer_log, read 11-20)
1. K-SU told sol62 (47489, SENTENCE D5 vs C2) and terra (47513, SENTENCE D3 vs C2): "The sentence, Matthew 1:24-25, reads "Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife: And knew her not till she had brought forth her firstborn son: and he called his name JESUS."... Grade the link ... on the whole sentence." Both CURED.
2. K-RUL then rejected the cards that quoted that sentence: 47505 (sol62, D5 vs C2) "the NAMED BY quote "and took unto him his wife: And knew her not till she had brought forth her firstborn son: and he called his name JESUS" does not stand in the record"; 47532 (terra, D3 vs C2, restated in the cure) "took unto him his wife: And knew her not till she had brought forth her firstborn son" the same.
3. Cause: krulFound(q,src) (live library L624) needs each ellipsis part of the quote as one run of words in SRC, and SRC is the round texts joined (L654 krulCure, L663 the restated-line check). The rounds quote 1:24 and 1:25 apart, so the joined sentence is never one run in SRC. One rule asks for the whole sentence; the other refuses it.

## The change (cure paths only)
C1. At the two cure-time NAMED BY checks (krulCure, L654; the restated-line check, L663), the source a quote is searched in becomes SRC plus the whole-sentence text of each K-SU item put to the same judge in the same cure set (the sentence the item quotes, which krulNorm already strips of punctuation). Nothing else is added to the source.
C2. krulFound itself is unchanged: each ellipsis part must still stand as one unbroken run of words, in the rounds or in one K-SU sentence. Option (b), passing a quote whose parts are each found somewhere, is NOT taken: it would let a card splice words that stand nowhere together.
C3. The first-pass check (L2262, before any K-SU item is sent) is unchanged: there the judge has not yet been told to read the sentence whole.

## Not changed
krulNorm, krulFound, krulQs, the CLAIM/RULE/APPLIED checks, K-SU itself, all statuses (TRIAL, recorded only), the debater and judge prompts.

## Checks (W4)
- Offline: replay the 41043 cure items with the target library. Expected: 47505's and 47532's quotes pass the NAMED BY check (the card is then judged on its other lines as before). A control quote that splices 1:24 to a verse no K-SU item named still fails. A judge with no K-SU item sees no change.
- Confirm where the K-SU items of the same seat are reachable at L654 (for example __XK_ITEMS, set by cureVerdicts) and at L663 (items); W4 names the field that holds the sentence text.
- Library parses; every stub rebuilds; only the K-RUL cure check nodes change.

## Revert
Write back the pre-513 engine and child (saved by W4), on the operator's word.

## Roles
W3 plans; W4 builds, checks and posts the card in W4's thread. Grade: a non-builder (W3 at W4's request, as for 510); second grade held (W1 and W2 asleep).
