# pkgCFP labels (W1), committed before any build. W3 enforcer gaps study, Proposal 1, anti-cheat part. Shelf only; no write request.

Change under test: Judge Contradiction Build adds each anti-cheat pair that Anticheat Record SHOWS to the judges (REVERSED, both quotes found) as a
candidate for the post-panel enforcer, with its earlier round found by the same quote test the Record uses. Nothing else changes.

L1 For each stored run whose Anticheat Record shows pairs, the candidate list holds one candidate per shown pair, side and closing round right:
   33218 D3; 33371 D1 C1; 33430 D1; 33442 D1; 33461 D1; 33482 D1; 33530 C1; 33592 D2; 33644 D1; 33705 D1; 33798 D3; 33846 D6
   (24 pairs). A pair whose earlier quote stands in no single round 1 to 3 is dropped; each drop is reported, not counted a pass.
L2 Every stored run with no shown anti-cheat pair: Judge Contradiction Build output byte-equal to live s105's.
L3 A pair a judge also named becomes one candidate, named by both.
L4 A run where Anticheat Record did not execute: output byte-equal to live.
L5 Judge Contradiction Record, given a CONFIRMED answer to an anti-cheat candidate, confirms it by code exactly as for a judge candidate (planted reply).
L6 Size: code growth measured and reported; the prompt text does not grow.

## Amendment (W1, before any rerun; my error, reported)
My L1 list was read with a faulty scan (a shell loop that hid parse errors) and missed four runs whose Anticheat Record shows pairs. Read again through
the harness, the shown pairs are: 33218 D3; 33222 C1; 33261 D2 C1; 33299 D6; 33345 D1; 33371 D1 C1; 33430 D1; 33442 D1; 33461 D1; 33482 D1;
33530 C1; 33592 D2; 33644 D1; 33705 D1; 33798 D3; 33846 D6 (16 runs, 34 pairs). L1 and L2 use this list. A pair a judge also named counts under L1
when the merged candidate names the anti-cheat check (L3). The skip reason text is not changed (A4 dropped before the rerun).
