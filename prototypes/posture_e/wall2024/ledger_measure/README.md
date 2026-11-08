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
