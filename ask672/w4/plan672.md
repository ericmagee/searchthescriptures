# ASK 672 PLAN rev 2 (W4, 11-27): the E-ASSUME KEEP check with no quote form per model
Rev 1 (a2121513, kept as plan672_rev1.md) is WITHDRAWN on the operator's word, 12:56 CST 11-27: "we can't hard code for every model and it different versions." Its write card is held and must not be pressed.

## ROLES
W4 builds and writes; W1 grades; W3 drafts the manual entry and AAR row. The operator chooses B or C on the card.

## THE DEFECT (run 43103)
Sonnet's KEEP on item 93 quoted "Behold, a virgin shall be with child, and shall bring forth a son". The challenger's rounds hold those words written as "quote" (Matthew 1:23). The harvest (vp524Verses, Assume Check Build) reads only Reference "quote", so the check refused the KEEP and Sonnet, the only HELD seat, was removed.

## THREE OPTIONS FOR THE CARD (replayed on run 43103's 12 KEEP rows; inputs/keeps43103.json)
Option A (drop the check) is OFF: the operator withdrew it, 12:59 CST ("request withdrawn ... we need another solution"). The K-KJV check (a quoted verse is real KJV text) is separate and unchanged in both options.
B. PLAIN-TEXT SEARCH (W3's proposal, Wall 12815). Accept the KEEP when the judge's quoted words (4 or more in a row, normalized) appear anywhere in the side's stored rounds 1 to 3. No quote forms are read. Replay: 12 of 12 cured. Cost: 4 of those were cured by quoting the side's own prose, not verse words: chatgpt 94 "Mary states she knows not a man"; chatgpt 96.1 and 96.2 "his flesh was made of the seed of David of a woman,"; chatgpt 96.3 "legal reckoning in the house of Joseph his supposed father" (b2/w3form_out.txt 205964c1).
C. ONE RULE FOR ANY ORDER (recommended). Keep the verse list. A quotation is joined to the reference that stands next to it, before or after, with only spaces, brackets or punctuation between (12 characters at most). No per-model or per-form pattern: it reads quote marks and an adjacent reference, in either order. Replay: 8 of 12 cured, including Sonnet 93, sonnet 95 and sol62 95. The 4 refused are the 4 prose quotations above (b2/c2_out.txt 26df6464). On 10 earlier runs every old list entry is kept but 1 (b2/c3c4_out.txt 07b6b215): Luke 2:49 inside a quotation of the other side's sentence (nested quotes). Bad-match tests: 0 of 4 (b2/replay_out.txt 359234a0).

ALL-MODEL TEST (W3's test set): every debate_results row with rounds 1 to 3 on both sides, 439 runs, both sides, 23 challenger and 19 defender model names (b2/allmodels_sql.txt 6d55a1db, b2/allmodels_out.tsv 4ac5536c). This is an SQL port of the two readers.
- Verses found: old 46,485; option C 77,841.
- Rounds where C finds fewer than the old reader: 0.
- Rounds where the old reader found none and C finds some: 634.
- Example: gpt-6.1-sol as challenger, old 33, C 217.
B builds no list. It reads every word of the side's rounds, so it never misses a verse, but it also accepts the side's prose (the 4 rows above).
Trade-off of C: it finds more, and some of what it finds may be a gloss or a phrase quoted next to a reference. The verse list in the enforcer prompt grows: on 10 earlier runs by 178 to 8,653 characters (b2/c3c4_out.txt). The KEEP test still needs 4 words in a row.

Recommendation C: it fixes the removal with one rule for every model and still requires the judge to quote verse words the side quoted. B is the simpler code, but a judge can keep a grade by quoting the side's argument.

## CHANGE (C)
Engine, Assume Check Build only: vp524Verses replaced by b2/new_vp524.js (e3187790). B would instead change acx531Cure in the Shared Library; A would remove the KEEP verse test there. Child: no copy of vp524Verses (checked at build).

## WRONG-IF
A run shows a KEEP refused whose quoted verse words stand in the side's rounds 1 to 3 next to their reference.

## STEPS
On the operator's choice: build the chosen option, W1 grades, write card, poll runs, fresh fetch, check live = base, PUT the one node, fetch back, W1 readback. Revert: PUT the base node.
