# ASK 526 plan, rev 0 (W3). Plan only: nothing is built or written until the grade passes and the operator presses W4's write card.

## Objective
After the last change applied to a judge's lines, the stored judgment's counted-premise arrays and the engine's own "recomputed" lines agree with that judge's final lines. Times are CST.

## Findings (run 41418; stored debate_judgments, read by SQL this turn)
1. THE CHANGES RAN IN THIS ORDER for qwen 4 max. The engine's own SUPERSEDED LINE records show it:
   - The cure restated D2 vs C6 from DEFENDER LINK BROKEN to UNDERDETERMINED.
   - The engine wrote "CONCEDED LINKS: 3 -- recomputed after the cure from the cured lines (RESTATED D2 vs C6 ...; CORRECTED COUNT DEFENDER 3) -- grounds: premise 4 BROKEN AT THE COLLISION D3 vs C5 (K-G7)".
   - A later applied change by the judge set D2 vs C6 back to DEFENDER LINK BROKEN, and replaced the count line with its own "CONCEDED LINKS: 3 -- Premise 2 ... Premise 5 ... Premise 6 ...".
2. STALE ARRAY. pkgCPD (cpdSync, Shared Library line 1537) ran inside the cure rewrite, on the engine's count line. That line names "premise 4 BROKEN AT THE COLLISION", and psGrades does not read it as counted. So it wrote "COUNTED PREMISES NOT DERIVED ... ARRAY: [1,2,5,6] (kept)". cpdSync never ran again on the judge's final count line, which names 2, 5 and 6. The stored counted_premises_defender is still [1,2,5,6], against a count of 3.
3. STALE REASON. The stored DEFENSE STANDING line still reads "recomputed after the cure from the cured lines (RESTATED D2 vs C6 (DEFENDER LINK BROKEN to UNDERDETERMINED) ...)". The final D2 vs C6 line reads DEFENDER LINK BROKEN. The value (PROP-DEPENDENT, c=3) is right; the reason names a change that a later change undid. The recompute rewrites that line only when the value changes (line 1358).
4. sol 6.2: "CONCEDED LINKS: 2 -- recomputed ... -- grounds: the cure names none (the cure lowered the count from 3 and does not say which premises it keeps)". No array can be derived; today it is recorded NOT DERIVED and kept. This plan does not change that case.

## Change
1. ONE FINAL PASS PER SEAT. After the last step that applies a change to a seat's lines (send-back, gate, or the gate's K re-read), run cpdSync once more on the seat's final text. W4 names the node and line in the build.
2. THE ENGINE'S GROUNDS ARE READ. psGrades reads the engine's own ground "premise p BROKEN AT THE COLLISION Dk vs Cm" as premise p COUNTED. That is the form __crg writes (line 1329).
3. A STALE REASON IS REWRITTEN. In that final pass, an engine-written STANDING or CONCEDED LINKS line ("recomputed after the cure from the cured lines (...)") whose trigger list names a collision grade that the seat's final collision line does not carry is rewritten. The new reason names the final grade. Its value is recomputed as today and is not otherwise changed.

## Not changed
- Fields, standings, the clause and the RESULT derivation (stand(), rd386): no change in what decides.
- The sol 6.2 case in finding 4 stays NOT DERIVED.
- No prompt text, no model settings.

## Moved out of 526
- REVIEW THIS ROW lines (B7 on Genesis 3:15 and K-G7 on D3 vs C5 for qwen 4 max) are record-only by design. Listing them for the seats is a review step, which goes to ASK 528 (the review reads them by SQL). There is no engine change.
- sol 6.2's "WHICH HOLDS: CHALLENGER" beside "RESULT: UNDERDETERMINED" is not an engine defect. RESULT follows rd386: BROKEN with the challenge PROP-DEPENDENT (sol 6.2 counted challenger premise 3) gives UNDERDETERMINED. WHICH HOLDS is the judge's weighing (ASK 507) and is not an input. How a reader sees the two belongs to ASK 529.

## DONE (offline, before any write card)
1. 41418 qwen 4 max: from the stored final text, the final pass gives counted_premises_defender [2,5,6]. The DEFENSE STANDING reason no longer names the undone restatement. Every field is unchanged.
2. 41418 sol 6.2: unchanged (NOT DERIVED, kept).
3. 41418 terra: unchanged.
4. Regression on 41024, 41043, 41090, 41102 and 41117: no field, standing, clause, RESULT or outcome changes. Every array or reason text that does change is listed with its seat and the line it came from.
5. A count line that names fewer premises than its count is still NOT DERIVED.

## Not yet
A live run.

## Owners
Build W4. Grade W1. Write: W4's card in W4's thread, pressed by the operator.
