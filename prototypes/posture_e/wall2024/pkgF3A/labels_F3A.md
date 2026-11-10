# pkgF3A sketch labels (W2), written before the first test run. Offline on s110, execution 34626. Not for writing until the operator chooses.
- F0 s110 Second Alternate? rerun equals the stored output.
- F1 34626 (haiku "JSON did not parse"): round 2 runs for luna, offering haiku again; a2r.retry names it; nothing else changes.
- F2 R2 Alternate Build builds the haiku body for luna (not refused by G5), same max_tokens as round 1.
- F3 planted "content null" and "no JSON object": retry offered.
- F4 planted "uncured items" (the rules refused a usable reply) and "no pool model passes the guards": no retry.
- F5 at most one retry: Second Alternate? runs only after round 1.
- F6 only Second Alternate? changes.

## Amendment (after the first run, before any result is counted): the first run showed Second Alternate? applies G1 without the haiku exemption
(pkgJGR rev 6) that R2 Alternate Build applies, so in 34626 (both debaters Anthropic) round 2 could never offer haiku. The sketch adds the same
exemption to Second Alternate?. F1 to F6 unchanged.

## Rev 2 (W3 FAIL, Wall 4231). Written before rev 2 is built or run.
- R1 (closing condition A) a retry's round 2 ALTERNATE TRIED line is written in the removed judge's row even when its text equals round 1's:
  luna's row carries two lines after an unusable reply twice (plant: the stored unparseable reply again in round 2).
- R2 (closing condition B, and D) a2r.tried keeps naming every model tried in round 1, the retried one included; a2r.retry and a2r.retry_for
  name the retried model and its seat; the final record alternate_round2 carries tried and retry.
- R3 (C) a retried model is offered only to the seat whose reply was unusable (plant: two removed seats, the unusable reply on the second):
  R2 Alternate Build offers it to that seat and refuses it for the other with a G5 (pkgF3A) reason.
- R4 F0 to F6 and the split cases C1 to C3 as before; no retry of a usable reply; at most one retry.
- R5 size measured separately: G1 alone, RETRY alone, both; prompt none.

## Rev 2s (smaller form, bloat rule), written before it is built or run. Meets W3's closing condition only (A, and the record names the retry).
- S1 = R1: a retry's round 2 ALTERNATE TRIED line is kept (2 lines for luna in the plant); non-retry round 2 lines as s110 (control plant:
  round 2 tries a different model; the line set equals s110's).
- S2: the final record alternate_round2.retry names the retried model.
- S3: C1 to C3 split cases as before (with the family exemption).
- Not closed by 2s, stated: C (retried model may go to the first failed seat in panel order when two seats are unfilled), D (a2r.tried omits the
  retried model; a2r.retry names it).
