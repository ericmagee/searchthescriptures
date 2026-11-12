# pkgGDC: the dash rewrite keeps a CHANGE TO line whole (builder W2, 2026-11-11; built on live s147)

## What it fixes
- pkgGDS (W3 3362) rewrites a gate or send-back reply line that uses "--" where the form needs "||".
- To find where the corrected line ends and the reason begins, it took the LAST dash followed by a round tag ([CR3], (DR2), CR4) or a quote mark.
- In an ANSWER CHECK line, the dash before the round tag ("Ezra 2:59 -- [CR4] -- MEANS: ...") is such a dash. When the judge's reason did not open with a quote mark, it was the last one.
- So the CHANGE TO was cut to "ANSWER CHECK: Ezra 2:59" and read UNCURED: "the CHANGE TO is not an ANSWER CHECK line".
- A collision line ("D5 vs C1 (Hebrews 7:14): UNDERDETERMINED -- CR3 and CR4 answer ...") was cut the same way.
- Run 35296: sol's S2, S8, S9, S10 and S11. These were all four of sol's counted items (ABSENCE GRADE UNCURED x3, COLLISION GRADE UNCURED x1); W2 Wall 5095, W3 confirmed.

## The change (Shared Library line 1757, inside gdsDash2024; one line; prompt 0)
- For a CHANGE TO reply only, the code finds the corrected line's last field.
- A field is a dash followed by one of these: a round tag; MEANS:; ANSWER:; GROUND:; FAILS:; [L1] to [L4]; or a grade word (MEETS, MISSES, FAILS, BROKEN, STANDS, UNDERDETERMINED, WITHDRAWN, FORCED, SPARED, VOID, COUNTED, UNEXHIBITED, CONCEDED, NOT HELD, DEFENDER or CHALLENGER LINK BROKEN). Matching is case-sensitive.
- The reason bar may go only at a dash after that field, and the old test (a round tag or a quote mark next) still chooses it.
- If no dash qualifies, the whole rest stays the corrected line, as live already does for premise lines (sol S3 to S7).
- KEEP replies and lines that already carry "||" are unchanged.

## Size (measured)
- Code: +645 characters on the one library line; the Shared Library node jsCode is +666 (JSON escaping); the six rebuilt nodes' map lengths are each +645.
- Rebuilt nodes: Send Back Record, Gate Record, and their Alt and R2 Alt copies.
- Prompt: 0.
- No other node changes.

## Checks (measured, offline)
- The six record nodes, run on all 13 stored exports, live s147 against the package: 51 of 52 node runs are equal.
- The one difference is run 35296 Send Back Record. Sol's five cut items change from UNCURED to CURED: Ezra 2:59 S2 and S8, Luke 3:23 S9 and Luke 2:49 S10 under pkgABS, and the D5 vs C1 collision under pkgUND. No other row changes status.
- Unit test on sol's 11 reply lines and 6 planted forms:
  - Every line that the old rule split correctly gives the same output.
  - A KEYSTONE line with a ground keeps its ground.
  - A collision line with layers keeps its layers.

## Limits
- a. With no qualifying dash, the reason sentence stays inside the corrected line, so the reply has no separate reason. Live already does this for lines with no marker, and the cure readers parse the line from its start. A reader that needs a KEEP reason is not affected, because KEEP is not changed.
- b. A reason that itself holds an upper-case grade word after a dash ("-- MISSES because ...") would move the boundary. None was found in stored text.
- c. Effect on run 35296's outcome (ESTIMATE): sol's 4 counted items are cured. Gate Build then raises one new item for sol (G6 CONTRADICTION, E-GATE M) from the now-readable changes, so sol would face one gate question it did not face. Whether sol stays seated is NOT KNOWN without a paid gate call.
- d. Only a live run with a dash-written reply shows the path ran.
