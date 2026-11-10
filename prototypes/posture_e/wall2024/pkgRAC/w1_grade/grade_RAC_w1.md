# W1 grade: pkgRAC rev 1 (W3, commit dc79629e): FAIL (one silent drop), with three notes

Labels: pkgRAC/w1_grade/labels_RAC_w1.md (c3abd2ee, before running). Runner: node pkgRAC/w1_grade/w1_plants_RAC.cjs (output w1_plants_RAC.txt).
W3's own test_RAC.cjs also reran: see the README; I did not repeat its 57 checks.

## Result: 6 of 7 as labeled; G3 FAILS
- G1 OK: challenger pair A94 (33222) confirmed: the challenger link breaks, its ANTI-CHEAT block leaves, CONFIRMED CLOSING CONTRADICTIONS shows it.
- G2 OK: the same pair confirmed only by a NEW line: the link breaks, A94 is logged NO ANSWER, the A94 block stays (second sentence only).
- G3 FAIL: two anti-cheat pairs of one side with different quotations (33846 A13 and A57) both CONFIRMED on the same link. A13 breaks the link.
  A57 is recorded CONFIRMED with the note "the same link is already broken" and kept out of cec.confirmed. Panel Build's rac() reads
  status CONFIRMED and so removes A57's ANTI-CHEAT block, but A57 is not in the CONFIRMED CLOSING CONTRADICTIONS block either:
  the pair leaves the judges' prompt entirely (it stays only in the log). On live s106 the A57 block is always shown.
  The same holds for an R pair, and for any A or R pair confirmed after an Oracle X or NEW line on the same link.
  First test of G3 used A13 and A19, which carry the same two sentences (the anti-cheat call keys pairs by verse; X13, X19, X21 in 33846
  share one pair), so A19 looked visible through A13; I changed G3 to A57 and say so here.
  Fix (small): rac() returns 2 only when the id is in cec.confirmed (a repeat then keeps its block with the second sentence), or the
  CONFIRMED block also lists the repeats.
- G4 OK only by accident: A73, confirmed after a NEW line on the same link, is dropped like A57, but A75 (not confirmed) carries the same two
  sentences, so the text stays visible. Same defect as G3.
- G5 OK: lower-case "a94" read as A94.
- G6 OK: one pair NOT A CONTRADICTION (approved two-sentence ending), another confirmed on a different link (its block leaves).
- G7 OK: an anti-cheat row with an empty earlier quotation is logged NOT SENT, NOT CHECKED.

## Notes (not part of the FAIL)
1. Wrongful-break risk grows. Today an anti-cheat or reversal pair only prints a paragraph; with pkgRAC a confirmed one breaks a link. The
   candidate line hands the enforcer a conclusion as the reason ("the close reverses this side's own earlier reading of <verse>"; "the close
   asserts more than this side's earlier grant left"). Set B showed a printed answer can turn the enforcer; a printed conclusion can turn it
   the other way. Both stored reversal pairs read to me (my reading, not a ruling) as NOT contradictions:
   - 34108 R11: "Genesis 4:1 ... I grant that this is the ordinary means." against "Genesis 4:1 therefore cannot supply the sequence for
     Matthew, because Matthew 1:23 sets the virgin as the one with child."
   - 33575 R11: "Joseph's house, naming and legal place are granted" against "... Matthew 1:25, with Matthew 1:18 and Luke 1:34, excludes it
     for this birth."
   Suggest: a neutral reason on code-found candidates ("named by a code check; answer CONFIRMED or NOT A CONTRADICTION on the words"), which
   is also shorter, and add these two R pairs to the owed replay with pass = NOT A CONTRADICTION in both sends.
2. The 34 anti-cheat pairs (16 debates) have not been read by hand for truth; the owed replay covers 5 of those debates. Each A pair now
   breaks a link when confirmed, so the replay pass line ("each CONFIRMED is true by a hand reading") should cover every pair it sends.
3. Order change widens an existing stop: Anticheat Build and Anticheat Record have no try/catch (33055 stopped at "Anticheat Only?",
   debate_errors 11-06). Today a failure there stops the panel; after pkgRAC it also stops the closing enforcer and the single judge.
   Wrapping both nodes like pkgCEC rev 5 would keep the debate running.
