# ASK 672 PLAN rev 5 (W4, 11-27; rev 4 graded PASS WITH C6, C7 by W1, Wall 12832): the E-ASSUME KEEP check with no quote form per model
Rev 1 (a2121513, kept as plan672_rev1.md) is WITHDRAWN on the operator's word, 12:56 CST 11-27: "we can't hard code for every model and it different versions." Its write card is held and must not be pressed.

## ROLES
W4 builds and writes; W1 grades; W3 drafts the manual entry and AAR row. The operator chooses B or C on the card.

## THE DEFECT (run 43103)
Sonnet's KEEP on item 93 quoted "Behold, a virgin shall be with child, and shall bring forth a son". The challenger's rounds hold those words written as "quote" (Matthew 1:23). The harvest (vp524Verses, Assume Check Build) reads only Reference "quote", so the check refused the KEEP and Sonnet, the only HELD seat, was removed.

## THREE OPTIONS FOR THE CARD (replayed on run 43103's 12 KEEP rows; inputs/keeps43103.json)
Option A (drop the check) is OFF: the operator withdrew it, 12:59 CST ("request withdrawn ... we need another solution"). The K-KJV check (a quoted verse is real KJV text) is separate and unchanged in both options.
B. PLAIN-TEXT SEARCH (W3's proposal, Wall 12815). Accept the KEEP when the judge's quoted words (4 or more in a row, normalized) appear anywhere in the side's stored rounds 1 to 3. No quote forms are read. Replay: 12 of 12 cured. Cost: 4 of those were cured by quoting the side's own prose, not verse words: chatgpt 94 "Mary states she knows not a man"; chatgpt 96.1 and 96.2 "his flesh was made of the seed of David of a woman,"; chatgpt 96.3 "legal reckoning in the house of Joseph his supposed father" (b2/w3form_out.txt 205964c1).
C. ONE RULE FOR ANY ORDER (recommended), rev 5 (b5/new_vp524.js f5df65ac). Each verse reference is read where it stands. There is no scan of quote marks from the top, so one stray quote mark cannot shift the rest (this was rev 4's fault in 4 rounds; see C6).
(a) A reference followed by a quotation, with only spaces, brackets or punctuation between (12 characters at most), takes it: Ref "quote".
(b) A reference in parentheses right after a quotation takes it, "quote" (Ref), unless a reference before the quotation already took it. It is never offered to the next quotation (W1 C4).
A bare reference after a quotation is read as (a) for the next quotation. No pattern per model.
TESTS (b5/t672.cjs bc91462f, out 1210e335): 11 of 11 PASS. They include W1's C4 case, the C7 case, and the 3ee68a78 stray-mark text.
43103 KEEP REPLAY: 8 of 12 cured, Sonnet 93 included (b5/c2_out.txt 26df6464). Bad-match tests: 0 of 4 (b5/replay_out.txt a1999a4a). On 10 earlier runs every old entry is kept, uncovered 0 (b5/c3c4_out.txt 0d1c3f74).
ALL-MODEL AND KJV TEXT TEST, 439 runs (b5/allmodels_rev5_sql.txt d973d6a5, out b5/allmodels_rev5_out.txt 895aca57; SQL port):
- Verses found: challenger old 26,598, rev 5 39,110; defender old 19,887, rev 5 28,650 (23 and 20 model names).
- Rounds where rev 5 finds fewer than the old reader: 0. Rounds where the old reader found none and rev 5 finds some: 228 challenger, 238 defender.
- Off-verse joins, clean quotations of 4 or more words: old 332 of 34,200 (1.0 percent); rev 5 (a) 564 of 39,399 (1.4 percent); rev 5 (b) 119 of 7,804 (1.5 percent). Off-verse means a wrong join or the writer's misquote.
C6, THE 10 REV 4 ROUNDS: 6 were the old reader taking a stray emphasis mark as a quotation, not a verse. 4 were real verses that rev 4 lost to a shifted quote scan. Rev 5 removes the scan (details in the out file).
C7, KNOWN RESIDUAL: in 43103's Oracle round 1, '"his parents," Luke 2:41; "Joseph and his mother," Luke 2:33' puts "Joseph and his mother," under Luke 2:41, and Luke 2:33 gets nothing. The writer put each reference after its quotation without parentheses, so (a) reads Luke 2:41 as the next quotation's reference. KEEP results do not change (the KEEP test reads words only). The verse list the checker sees does change.

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
Engine, Assume Check Build only: vp524Verses replaced by b5/new_vp524.js (f5df65ac). B would instead change acx531Cure in the Shared Library; A would remove the KEEP verse test there. Child: no copy of vp524Verses (checked at build).

## WRONG-IF
A run shows a KEEP refused whose quoted verse words stand in the side's rounds 1 to 3 next to their reference.

## STEPS
On the operator's choice: build the chosen option, W1 grades, write card, poll runs, fresh fetch, check live = base, PUT the one node, fetch back, W1 readback. Revert: PUT the base node.
