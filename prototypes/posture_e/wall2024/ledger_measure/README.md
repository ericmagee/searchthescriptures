# Witness ledger: how often does kg4Split call a pressed witness "named" when the side did not answer it? (W2, 11-08)

Eric approved W3's ASK 2 (witness ledger) at 07:42 CST, staged: W2 first measures this rate on all saved runs.

## Method
- Engine test: kg4Split's naming rule, loaded unchanged from live s60 Gate Record (`lib.cjs`, rebuilt with pkgLIB/unpack.cjs; set GR to the rebuilt file). A witness is NAMED when any later round of the pressed side cites its verse (cureRefs, scoped).
- Presses (27 saved runs, 33197 to 33644):
  - Challenger: the C3 press list and the engine's own press_check, which tracks an answer section per press id.
  - Defender: the first verse of each PRESSED WITH row in CR1/CR2.
  - Total: 346 challenger and 879 defender presses.
- What is true:
  - Challenger: press_check (answered = an answer section exists).
  - Defender: no engine press_check exists. Each hit is classed by where it sits: under an answer label (a bullet or bold label that starts with the verse, or a MEANS [..] header), only restating the press, or other text. 25 of the 302 "other text" cases were read by hand (fixed seed).

## Result
- Challenger: 344 of 346 NAMED. All 346 have an answer section (press_check ok), so the engine called **0** witnesses named that were not answered. The 2 NOT NAMED witnesses were answered under their MEANS header without the verse being cited.
- Defender: 877 of 879 NAMED.
  - 575 are named under an answer label.
  - 302 are named only in other text. By hand, 21 of the 25 sampled are real answers (a grant with a fit, or the verse inside an answer paragraph). 4 are the defender's own footing or chain, with no answer to the press.
  - Estimate: about 16% of the 302, which is about 48 of 877, or **about 5% false-NAMED on the defender side**. This is an estimate from a 25-case sample, not a count.
- Verse ranges ("Ezra 2:61-62") are not a source of error: there are 2 cases, and both are answers.
- The terra cases check out. In 33644 the witnesses (Hebrews 7:14, Isaiah 7:16, Luke 1:35) are each named inside an answer section.

## What this means for the ledger
1. NAMED from kg4Split is right about 95% of the time on the defender side and 100% on the challenger side, so it is usable.
2. For the ledger, NAMED should come from the answer sections, not from any mention:
   - Challenger: use press_check, which already exists.
   - Defender: the D rounds have no press check, so the ledger needs one. It would find a section that starts with the pressed verse under an "Answer..." heading.
   - The remaining defender cases (own footing only) would then read NOT NAMED IN AN ANSWER, which keeps the judge's ruling-392 route open.
3. The gate has the same leniency. kg4Split rules a judge's "unanswered" claim false (unanswered-false, UNCURED) on any mention, so roughly 5% of defender witnesses could make a true "unanswered" claim read false. No saved removal has been checked against this yet. That check is the next step if W3 wants it.

## Item (b): recheck of saved "unanswered-false" rulings (W2, 11-08)
- Scan (`recheck_uf.cjs <file regex>`) of every saved Gate Record, Alt Gate Record, Gate Build, Alt Gate Build, Panel Cure Check, Cure Check, Alternate Merge Seat and Final Output: 4 distinct unanswered-false findings, all chatgpt (terra), all on D-links whose witness was pressed in [DR2] and named in [CR3]/[CR4]:
  - 33040 Matthew 1:24. Not checkable: no debate texts are saved for 33040.
  - 33506 Deuteronomy 20:7. A real answer: [L3] under MEANS [CR3] P4.4, and again in CR4.
  - 33617 Genesis 4:1. A real answer: [L1] under MEANS [CR3] P1.5, and granted at G8.
  - 33617 Isaiah 8:4. A real answer: [L4] in CR3 ("Isaiah 8:4 repeats the same measure ... It fits the link"), and granted at G15 in CR4.
- None rests on a witness the defender must answer, which is where the ~5% false-NAMED estimate applies. On the checked side, no saved ruling wrongly made a true "unanswered" claim read false.
- Wording fault found: the message reads "a later defender round names ..." while the rounds searched are the challenger's ([CR3]/[CR4]). kg4Split searches CR rounds for side DEFENDER, and the text prints x.side.
