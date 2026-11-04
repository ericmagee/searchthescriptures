# Run 32643: the three reviews consolidated (Worker_A3, Worker_G1, Worker_C), checked by Worker_E

Worker_E, session_014Qy67bHv8uBmRXbWGSrghm, 2026-11-04. This document is private; it is not posted.

**How it was checked.** Each claim marked "checked" was re-run against the stored run (ex32643.json and the produced document) or against kjv_verses, lexicon_words and kb_sights in this session. Where a review was wrong, that is said.

## A. Corrections to the reviews and to my own reports
1. **A3 is right that all three judges voided the Oracle's charge** "This assumes Mary is of David's house, which no quoted row gives". Grok's words: "Premise 5 VOID: the charge adds NO". My earlier report named only ChatGPT and Gemini.
2. **WITHDRAWN 4 Nov (journal 2061): C's table is right; this correction was wrong.** ChatGPT's line on the Oracle's answer at [DR3] reads: Matthew 1:19 ... ANSWER: "No verb of knowing stands in the verse." -- MISSES. The MEETS line I read is on the defender's [CR4] answer, a press the ledger marks unproven. ChatGPT does not contradict itself in 32643, so problem 7 has no case here. B7 was still built, and it compares only lines of the same side.
3. **C is right on DG-18, and my check missed it** (journal 2059). The Oracle quoted "this day have I begotten thee" in rounds 1, 2 and 4, with Acts 13:33 and Hebrews 5:5 and without Hebrews 1:5. My Psalm 2:7 check looked for the reference only.
   - **Fixed and live** (version 425d5fbc, log 26617). The check now reads the words as well as the reference.
   - **Tested:** 32643 now flags Hebrews 1:5; 32510 still flags both verses; 32595 and 32605 stay silent.
4. **The other key claims checked true:**
   - A3's Grok count fault: the cure adds premise 4, but the stored count reads [6].
   - C's Deuteronomy 22:23-24: the offender is "a man", and the verse names "his neighbour's wife".
   - G1's Sight 266 exists ("Matthew 1:19 - dikaios as Torah-Compliant Legal Actor Under Evidentiary Constraint").

## B. Problems, each with one solution
1. **The void rule voids a true charge of a missing fact** (A3 1). The keystone collision turned on it.
   - **Solution:** a charge in the form ASSUMES: ... ROWS GIVE: ... is never voided for its words. The judge checks it against the rows instead.
   - **Needs the operator's word:** it changes the void rule as ruled (BB-8172 C3).
   - The Oracle's side is already done: its charge is now positive-only (version 95442a89), but no live run has exercised it yet.
2. **Gemini retracts every meaning break in the cure** (C 1). Two runs in a row; ChatGPT and Grok write FORCED lines instead.
   - **Solution** (C's recommendation 1): when a BROKEN line's ground is a meaning conflict, the K-G4 cure accepts only a FORCED line. RETRACTED stays a cure only when the ground says the verse went unanswered.
   - **Needs the operator's word:** a judge that still retracts is left uncured and not counted, which removes a seat (ruling 411 and ruling 419 set the cures).
3. **A verdict contradicts its own lines** (C 2, G1 2). After its retractions, Gemini had every collision UNDERDETERMINED and 0 conceded on each side, yet it still read HELD, "DEFENDER WINS". Its reasoning paragraph was not regenerated.
   - **Solution:** a computed check over the stored text. When every collision is UNDERDETERMINED and the standings are equal, a RESULT of "DEFENDER WINS" or "CHALLENGER WINS" is flagged and sent back once (KB-0030, "a tie is not a HELD"). The reasoning paragraph is regenerated with the cure.
   - **Build;** it changes no ruling.
4. **The two sides' absence answers are graded unequally** (C 3, A3 2). Commitment 3 bars "no verse states it" for both sides. But judges marked the defender's "Nothing in them names Joseph as the begetter" MEETS in two of three seats, and the Mary route "carried ... through Mary" MEETS in two of three.
   - **Solution:** a code mark, for review only, on every ANSWER CHECK graded MEETS whose quoted answer rests on an absence form. The forms are "names no", "no verb of", "nothing in them names", "no row", "nowhere" and "no verse". It applies to both sides alike.
   - **Build** as a mark (it removes no seat).
5. **Narrowing still costs nothing, and close grants go uncounted** (A3 3, G1 1 and 4). S2 was applied by one judge of three. S3's flag marked 15 lines; only Grok counted any.
   - **Solution:** the S3 close-concession flag becomes a TRIAL cure item. The judge must either COUNT the grant or state in one line why it touches no declared link or listed premise. TRIAL means it removes no seat.
   - **Build.**
6. **The count does not match the cure** (A3 4). Grok's cure added premise 4, but the stored count kept [6].
   - **Solution:** after a cure, counted_premises is rebuilt from the cured lines.
   - **Build;** this is a defect fix.
7. **A judge contradicts itself** (A3 6). **No case in 32643 (journal 2061):** ChatGPT graded the Oracle's Matthew 1:19 answer MISSES, which agrees with its UNEXHIBITED count. The check below guards future runs.
   - **Solution:** a computed check that flags a premise counted UNEXHIBITED for a verse whose own ANSWER CHECK line, by the same judge, reads MEETS.
   - **Build.**
8. **Glosses are not checked** (C 5, A3 5.4 and 7).
   - **The defender:** parthenos given as "a maiden who has not known a man". The lexicon: "a maiden; by implication, an unmarried daughter:--virgin".
   - **The Oracle:** goneis given as "parents, those who begat". The lexicon: "a parent".
   - **Solution:** a citation-check line comparing each gloss given with a Strong's number against lexicon_words.anchor_gloss, flagging added words. Both sides alike.
   - **Build.**
9. **Deuteronomy 22:24 was misread, and the close reversed it** (C 4).
   - **Needs the operator's ruling:** does a close that reverses its link-round reading of a pressed verse fall under ruling 412, item 3?
10. **The record has a gap at Matthew 1:19** (G1 3). Sight 266 reads Joseph as unable to lawfully start the capital case. Sight 32 holds the union at [L4]. No row joins the two, and Sight 266 was not served.
    - **Doctrine:** for the operator and the Wall.
11. **The Oracle answered a press with an absence** (C 3 and recommendation 5). At Matthew 1:19 it answered "No verb of knowing stands in the verse". It had the fit available: Matthew 1:20's "for" grounds the command to take her.
    - **Solution:** add to the Oracle's own strategy block: "Answer a press with the fit your rows show, never with an absence; the absence form is barred to both sides."
    - **Build;** this is Oracle strategy.
12. **The Oracle's own errors** (A3 5).
    - **The errors:**
      - A false parity with Luke 1:13: Matthew 1:21 has no "bear thee".
      - Ezra 2:61-62 overstated: the text says only "they were not found".
      - A miscount of the "seed of a woman" rows.
      - Matthew 1:20 cut to its clause, once in each of the four rounds (DG-8).
    - **Solution:** the DG-8 cut becomes a code check. It flags any Oracle round that quotes "that which is conceived in her is of the Holy Ghost" without "Joseph, thou son of David" in the same round. It goes with S-G, as S-H.
    - **Build.**
13. **The synthesis faults** (A3 8, C 7): misattributions, DG-63 wording that is not in the transcript, and an absence claim not counted.
    - **Lower priority.** These go to the synthesis checks after the items above.
14. **The single judge's audit floods its output** (C 6): about 50 false "NOT READ" flags.
    - **Lower priority.** Ruling 402 already places the single judge outside the debate.

## C. Order
1. Build 6, 3, 7, 4, 5, 8, 11 and 12. These are defect fixes, computed checks, marks and TRIAL items, and none removes a seat. Test them by a re-grade of 32643, then one live run.
2. The operator's rulings: 1 (the void rule), 2 (no retraction for a meaning break), 9 (a reversal in the close), and 10 (doctrine, Matthew 1:19).
3. Then 13 and 14.
