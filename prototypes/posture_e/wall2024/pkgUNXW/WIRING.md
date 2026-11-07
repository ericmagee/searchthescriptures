# pkgUNXW: a judge's own K-UNX count withdrawal is written (W3 2738 item 2)

**Gap (33249).** All 4 K-UNX items were cured by the judges withdrawing the concede. chatgpt gave CORRECTED COUNT 0, and grok's CORRECTED COUNT 1 took premises 2 and 5 out. None of it was written, because cureSet writes a CORRECTED COUNT only for the K-G and other count rules it lists. So grok's final count still read 3 and chatgpt's 2, which are Oracle concedes the judges themselves had withdrawn.

Grok's premise 5 was also "cured" by a STATEMENT saying the block HAS [L2] ("The block exhibits [L1] and [L2] patēr and [L3]"). The reason is that unxNamed takes any layer tag the reader did not find as a named missing layer.

**Edits (19 cure and gate nodes; base pkgUNXS/patched).**
1. cureSet: a K-UNX item (plain, K-UNX-A or E-ASM, all rule K-UNX) CURED by "CORRECTED COUNT n takes the premise out" joins the count items of its side. So the side's single CORRECTED COUNT is written to the count line and columns, and the seat is recomputed (judge_fix4 F1), as for K-G1 and K-G3. The rule that every count item of the side must be CURED still holds. K-UNX items are not added to cureCountHeld, so an uncured TRIAL item never blocks another rule's write. TRIAL status is unchanged and no seat is removed.
2. The plain K-UNX STATEMENT cure uses unxLack instead of unxNamed. A tag counts as named missing only with a lack word before it on its clause (no, not, lacks, without, missing, absent, never, nor, fails), or with "is missing / absent / not exhibited", "does not ..." or "fails" after it. The raise test (unxNamed in kunxLines) is unchanged, so raising is not affected.

**Bases.** The pkgUNXS bases equal live 5a710187 (fetchback_live_s22.json; A2 checks this). Write order: UNXS, then UNXW.

**Test.** `node pkgUNXW/test_UNXW.cjs` gives 15 OK:
- 33249, Panel Cure Check: chatgpt's challenger count goes from 2 to 0. The CORRECTED STANDING and RECOMPUTED audit lines are written, and the result stays HELD, DEFENDER WINS.
- 33249, Alternate Merge Seat: grok's count goes from 3 to 1, and premise 5 is now cured by its CORRECTED COUNT.
- 33249: the other seats are unchanged.
- 33218 and 33222: both nodes give output identical to UNXS.
- 4 unit cases for unxLack.
