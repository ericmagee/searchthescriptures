# E-GATE B screen: the 15 stored first-pass items, W1 07:45 CST 11-07

Source: debate_enforcer_log, rule E-GATE, item ~ '^G[0-9]+ CONTRADICTION \(E-GATE B\)' (15 rows; all first-pass, all LIVE).
gateAnsGround2024 reads an ANSWER CHECK graded MISSES on verse V for side X as "X's press on V stands", then raises an item for any X LINK BROKEN line with V in its tail. It never compares the press MEANS with the broken line's ground.

Classes:
- REAL: the press MEANS and the broken ground read the same words of V in opposite directions.
- SHARED: the ground uses a different point of V (an answer can miss a press while the verse still carries another point).
- NO PRESS: MEANS: NONE (the ledger holds the press unproven, not a witness). No press stands, so nothing can contradict it.
- NO MEANS: the check line carries no MEANS, so nothing can be compared.

| run | seat | item | V | press MEANS (short) | broken ground point (short) | class | stored |
|---|---|---|---|---|---|---|---|
| 32998 | grok | G2 | Luke 1:32 [CR3] | covenant son set on David's throne | Luke 1:35 "therefore" cannot reach back to 1:32 (V only named) | SHARED | CURED |
| 33006 | chatgpt | G1 | Matthew 1:19 [CR3] | (none on line) | challenger did not meet the defender's "whose child" press | NO MEANS | CURED |
| 33006 | grok | G4 | Matthew 1:20 [CR3] | names Joseph, son of David, and his wife in one breath | Holy Ghost is the source of what is conceived | SHARED | CURED |
| 33006 | grok | G5 | Matthew 1:20 [CR3] | same | mercy of 1:19 fits a child not his | SHARED | UNCURED |
| 33006 | grok | G6 | Matthew 1:20 [CR3] | same | origin named is the Holy Ghost | SHARED | UNCURED |
| 33006 | grok | G7 | Matthew 1:19 [CR3] | intent, justness and mercy, "her husband" | mercy fits a child not his | SHARED (near) | CURED |
| 33020 | gemini | G1 | Matthew 1:20 [CR3] | names husband and wife, answers his fear | Holy Ghost conception dated before coming together | SHARED | CURED |
| 33020 | gemini | G2 | Matthew 1:18 [CR3] | finding dated before the joining = the taking | "before they came together" = before any union | REAL | CURED |
| 33020 | grok | G2 | Matthew 1:18 [CR3] | same | "before they came together" leaves no knowing | REAL | CURED |
| 33025 | grok | G2 | Matthew 1:25 [CR3] | "till" limits abstinence to after the taking | not-knowing until the birth excludes espousal knowing | REAL | UNCURED |
| 33025 | grok | G3 | Matthew 1:20 [CR4] | Spirit-origin row names Joseph of David and Mary his wife | Holy Ghost conception | SHARED | UNCURED |
| 33083 | gemini | G1 | Matthew 1:20 [CR4] | "of the Holy Ghost" row names Joseph and his wife together | Holy Ghost is the source of the physical conception | SHARED | CURED |
| 33149 | chatgpt | G1 | Matthew 1:19 [CR3] | NONE (unproven, not a witness) | proven press left unanswered | NO PRESS | CURED |
| 33299 | chatgpt | G1 | Luke 1:27 [DR2] | NONE (unproven) | pressed relation to Elisabeth unanswered | NO PRESS | CURED |
| 33311 | gemini | G13 | Matthew 1:18 [CR3] | finding dated before the coming together = the taking of v24 | "before they came together" excludes espousal knowing | REAL | CURED |

Tally: REAL 4, SHARED 8, NO PRESS 2, NO MEANS 1. Uncured (counted) items: 4, of which 1 is REAL (33025 grok G2) and 3 are SHARED (33006 grok G5, G6; 33025 grok G3).

## What a code test can and cannot separate
- NO PRESS is exact: the check line says "-- MEANS: NONE". pkgEGB-1 skips it (below).
- REAL vs SHARED is not separable by word overlap. Content words of MEANS against the ground (verse quotes removed): REAL 33025 G2 shares none, 33311 G13 none; SHARED 33020 G1 shares holy/ghost/husband/wife. The overlap runs backwards. A meaning test would need the judge to say it.

## pkgEGB-1 (built, enforcer accuracy fix, side-neutral)
In gateAnsGround2024 (6 nodes: Alternate Merge Seat, Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge), after the MISSES test:
`if(/(?:--|—)\s*MEANS\s*:\s*NONE\b/i.test(l))continue;`
- test_EGB.cjs: 8 OK (both NO PRESS rows drop; REAL, SHARED, NO MEANS rows unchanged; a quoted MEANS starting "none of" still fires; MEETS never fires).
- replay_EGB.cjs on s39 saved inputs: 36 identical, 1 differs = 33299 Gate Build, where the only gate item (chatgpt G1 Luke 1:27 [DR2], NO PRESS) is gone, so the gate is skipped ("no seat has a gate item"). 9 node runs skip for missing input (33276, 33289 Record nodes), the same as in earlier replays.

## SHARED items (proposal only, for W3 to rule; nothing built)
3 SHARED items went uncured and counted against grok (33006 G5, G6; 33025 G3). Proposed cure path: in the E-GATE B gate prompt, add a third answer, "DIFFERENT POINT: the press holds <words of V>; my ground uses <other words of V>". The cure test accepts it when both quoted spans are words of V (kjv_verses) and do not overlap. A judge who cannot name two distinct spans still must change a line. This is a judge-visible prompt change.
