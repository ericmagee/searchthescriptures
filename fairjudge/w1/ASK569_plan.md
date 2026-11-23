# ASK 569 plan, draft 1 (W1, seat 34): must a summary line carry its own verse?

## QUESTION
The D1 to D4 summary lines draw LAYERS CHECK items:
- the Oracle opening's DECLARED CHAIN (41822 CR1);
- the challenger's closing list of answers to D1 to D4 (41822 DR1);
- the Oracle close's DECLARED CHAIN (41822 CR4, with 567 live).

Must such a line carry its own verse? This decides ASK 561 (LAY on the challenger's round 1) and W4 11029 item 3.

## ANSWER PROPOSED (a reading of rulings already made; no new doctrine)
1. A summary line is a critical point. It states a deliverable, or a side's verdict on one.
   - Ruling 399: "force proven structure on all critical points of the debate".
   - Ruling 397: "PROVE YOUR POSITIONS".
   - So a summary line carries its proof, with two verses and an [L1] among them (Isaiah 28:10; single verse doctrine is prohibited).
2. It need not quote the verse again. Ruling 399 lets a point carry its proof by reference to where the same layers were already exhibited. LAY already credits that form: a tag-first segment "[L1] <ref>, quoted above" counts when the round quotes that verse with its layer elsewhere (BK and Q in verses()). It does not count for a verse never quoted.
3. For the Oracle seat, the Oracle gate's [L2] and [L4] lines apply to a summary block as to any block. Nothing changes here.

## MEASURED (live LAY, engine f63b73de, library f24a5192; harness fairjudge/w1/a569/t1.js, t2.js)
1. As written in 41822: CR1 draws 4 items (the 4 DECLARED CHAIN lines), DR1 draws 4 (the 4 conclusion bullets), and CR4 with the Oracle gate draws 4 on the D lines plus 24 on ANSWER blocks.
2. Rewritten in the by-reference form, using only the references each line already names:
   - CR1 goes from 4 items to 2.
     - D2 names Luke 2:48 and John 6:42; neither is quoted with a layer in CR1.
     - D4 names Hebrews 7:14, which is not quoted in CR1.
   - DR1 goes from 4 items to 2.
     - D1 names one verse only (Genesis 3:15).
     - D4 names one verse only (Romans 1:3).
   - All 4 remaining items are true gaps under rulings 397 and 399 and Isaiah 28:10. The other 4 lines pass with no new quotation.
3. Forms (DR1, D3 line):
   - F1, tag-first by reference ("[L1] Luke 1:35, quoted above; [L3] Isaiah 7:14, quoted above"): 0 items.
   - F2, tag after the reference ("Luke 1:35 [L1], quoted above"): 1 item, because only one verse is credited. Hence the note says "tag first".
   - F3, by reference to a verse the round never quotes (Ruth 1:1): still sent back.
   - F4, as written in 41822: sent back.

## CHANGE (one sentence; Shared Library LIB line 3552, engine and child; one sha reset)
The models are not told today that the by-reference form exists. The send-back note asks them to quote each verse, which pads the round or leaves the line bare. The change:
- Anchor (once in the library, inside LAY.note): `a conclusion drawn from it is a point.`
- After it, insert the text of fairjudge/w1/a569/add569.txt (482 characters):
  > A summary line that restates a point (a line of a DECLARED CHAIN, or a line of a closing list such as "D1: ...") is a point too. It may carry its verses by reference instead of quoting them again: write the tag first, then the reference and the words "quoted above", as in "[L1] Romans 1:3, quoted above; [L3] Galatians 4:4, quoted above". This counts only for a verse quoted with its layer elsewhere in this same round, and the line still needs two verses with an [L1] among them.
- Effect: LAY n goes from 12,859 to 13,341, and the library sha from f24a5192c60cbc55 to e6de6ac1b20a59e3 (offline, on the 566+567 library). If written with other library changes, the sha is computed once on the combined target.

## TESTS (t2.js)
1. The items are identical before and after on all 8 rounds of 41822, both with and without the Oracle gate. The change is note text only.
2. The note holds the sentence once.
3. The forms in MEASURED 3 behave as listed.

## EFFECT ON OTHER ASKS
1. ASK 561 needs no new check rule. It can be released with this note sentence. Its 4 DR1 items are then fixable: 2 by reference, and 2 that are true single-verse lines.
2. W4 11029 item 3 (CR4 summary lines): by this reading these are true items under the Oracle gate, not a defect.

## NOT CHANGED
CP, structure(), verses(), BAR, IMP, the prompts (no Oracle-facing prompt text is added; the send-back note is the only text), judges.

## FOR THE OPERATOR
Two things:
1. The reading in ANSWER 1 and 2: summary lines are critical points, and proof by reference is allowed.
2. The one-sentence note change.
