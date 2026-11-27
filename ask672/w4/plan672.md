# ASK 672 PLAN rev 4 (W4, 11-27; rev 2 graded B PASS, C FAIL ON C4 by W1, Wall 12821): the E-ASSUME KEEP check with no quote form per model
Rev 1 (a2121513, kept as plan672_rev1.md) is WITHDRAWN on the operator's word, 12:56 CST 11-27: "we can't hard code for every model and it different versions." Its write card is held and must not be pressed.

## ROLES
W4 builds and writes; W1 grades; W3 drafts the manual entry and AAR row. The operator chooses B or C on the card.

## THE DEFECT (run 43103)
Sonnet's KEEP on item 93 quoted "Behold, a virgin shall be with child, and shall bring forth a son". The challenger's rounds hold those words written as "quote" (Matthew 1:23). The harvest (vp524Verses, Assume Check Build) reads only Reference "quote", so the check refused the KEEP and Sonnet, the only HELD seat, was removed.

## THREE OPTIONS FOR THE CARD (replayed on run 43103's 12 KEEP rows; inputs/keeps43103.json)
Option A (drop the check) is OFF: the operator withdrew it, 12:59 CST ("request withdrawn ... we need another solution"). The K-KJV check (a quoted verse is real KJV text) is separate and unchanged in both options.
B. PLAIN-TEXT SEARCH (W3's proposal, Wall 12815). Accept the KEEP when the judge's quoted words (4 or more in a row, normalized) appear anywhere in the side's stored rounds 1 to 3. No quote forms are read. Replay: 12 of 12 cured. Cost: 4 of those were cured by quoting the side's own prose, not verse words: chatgpt 94 "Mary states she knows not a man"; chatgpt 96.1 and 96.2 "his flesh was made of the seed of David of a woman,"; chatgpt 96.3 "legal reckoning in the house of Joseph his supposed father" (b2/w3form_out.txt 205964c1).
C. ONE RULE FOR ANY ORDER (recommended), rev 4 (b4/new_vp524.js 205b506f). The text is read left to right. A quotation takes the reference just before it (only spaces, brackets or punctuation between, 12 characters at most), unless an earlier quotation already took that reference. Otherwise it takes a reference in parentheses just after it: "quote" (Ref). A reference in parentheses that closes a quotation is never offered to the next one (W1 C4). A bare reference after a quotation belongs to the next quotation. No pattern per model.
Rev 3 (the C4 fix alone) left the bare after-reference in. Measured against the KJV text on 439 runs, bare after-joins were off-verse 20 percent of the time (clean quotations of 4 or more words; for example Mark 6:3 given to "Is not this the carpenter's son?"). Parenthesized after-joins were off-verse 1.5 percent. Rev 4 keeps only the parenthesized ones.
Join tests (b4/t672.cjs 8e69f7ed): 9 of 9 PASS. They include W1's '"a virgin shall be with child" (Matthew 1:23); "I know not a man" (Luke 1:34)' and 'Isaiah 7:14 "q1" (Isaiah 7:14); "q2" (Luke 1:34)'.
43103 KEEP replay: 8 of 12 cured, including Sonnet 93, the removal (b4/c2_out.txt 26df6464). The 4 refused are the prose quotations above. Bad-match tests: 0 of 4 (b4/replay_out.txt 9d93f54d). On 10 earlier runs, 1 old entry is not kept, the nested-quote Luke 2:49 (b4/c3c4_out.txt e403b246). W1 C5: the 43103 dr3 John 6:42 entry is a quotation inside a longer one of the same verse, not a loss.
WRONG JOINS, KJV TEXT TEST, 439 runs (SQL port; clean quotations of 4 or more words, no ellipsis, gloss or bracket):
- old reader: 34,200 checked, 332 off-verse (1.0 percent);
- rev 4 before-joins: 40,472 checked, 648 off-verse (1.6 percent);
- rev 4 after-joins: 7,698 checked, 119 off-verse (1.5 percent).
An off-verse join is a wrong join or a misquote by the writer; the test cannot tell the two apart.

ALL-MODEL TEST, rev 4 (W3's test set): every debate_results row with rounds 1 to 3 on both sides, 439 runs, both sides, 23 challenger and 20 defender model names (W1 C5). SQL port of the two readers.
- Challenger: old 26,598, rev 4 39,732. Defender: old 19,887, rev 4 29,672.
- Rounds where the old reader found none and rev 4 finds some: 247 challenger, 252 defender.
- Rounds where rev 4 finds fewer than the old reader: 10 (4 challenger, 6 defender), not yet examined. My guess, not checked: a closing "(Ref)" that the old reader gave to the next quotation.
Rev 2 figures, for the record (b2/allmodels_out.tsv 4ac5536c):
- Verses found: old 46,485; option C 77,841.
- Rounds where C finds fewer than the old reader: 0.
- Rounds where the old reader found none and C finds some: 634.
- Example: gpt-6.1-sol as challenger, old 33, C 217.
B builds no list. It reads every word of the side's rounds, so it never misses a verse, but it also accepts the side's prose (the 4 rows above).
Trade-off of C: it finds more, and some of what it finds may be a gloss or a phrase quoted next to a reference. The verse list in the enforcer prompt grows: on 10 earlier runs by 178 to 8,653 characters (b2/c3c4_out.txt). The KEEP test still needs 4 words in a row.

Recommendation C: it fixes the removal with one rule for every model and still requires the judge to quote verse words the side quoted. B is the simpler code, but a judge can keep a grade by quoting the side's argument.

## CHANGE (C)
Engine, Assume Check Build only: vp524Verses replaced by b4/new_vp524.js (205b506f). B would instead change acx531Cure in the Shared Library; A would remove the KEEP verse test there. Child: no copy of vp524Verses (checked at build).

## WRONG-IF
A run shows a KEEP refused whose quoted verse words stand in the side's rounds 1 to 3 next to their reference.

## STEPS
On the operator's choice: build the chosen option, W1 grades, write card, poll runs, fresh fetch, check live = base, PUT the one node, fetch back, W1 readback. Revert: PUT the base node.
