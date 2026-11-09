# pkgVP3 grade (W1, 11-09): FAIL

Reproduced: probe_VP3.cjs 29 OK 0 FAIL; probe_VP3_multi.cjs 42 node runs equal except notes, 17 agree, 11 would remove; parent_s89_VP3.json 414 nodes, only Send Back Record, Alt Send Back Record, R2 Alt Send Back Record changed, connections equal to s89; rolled-back insert of two annotated rows through record_enforcer_log: {"rows":2,"recorded":true}, rolled back.

## Hand count of the 11 would-remove listings: 11 of 11 would be wrong removals

Each judge's reply names a substantive defender answer that exists word for word in the record (each quote found once in the stored round text; rounds from <run>_Panel_Cure_Normalize_1 cure.rounds). The live cure reader already reads 10 of the 11 rows CURED.

| Run | Seat | Item | Defender's answer the code did not read | Live cure reading | Removal right? |
|---|---|---|---|---|---|
| 33461 | sol | E-ANS Matthew 1:18 [CR3] | CR3, same block, [L4]: "The angel removes the alarm by giving the source, \"of the Holy Ghost.\""; LINK 1 bullets: "The source is stated before the taking and independent of it." | UNCURED (the reply joined two real quotes, so not word for word) | No |
| 33461 | terra | E-ANS Matthew 1:18 [CR3] | CR4: "Whether it names the taking or the union, \"before\" puts the finding and its source ahead of it." | CURED, fuller answer found in [CR4] | No |
| 33798 | terra | E-ANS Job 14:1 [CR3] | CR2: "I accept it as a phrase said of all men, and I make no claim from Galatians 4:4 alone." / "The claim stands on the chain Romans 1:3, Luke 1:35 and Galatians 4:4."; CR3 line before it: "I rest on the verb that is the same as Romans 1:3's" | CURED, fuller answer found in [CR2] | No |
| 33798 | sol | E-ANS Job 14:1 [CR3] | CR4 [L4]: "Job 14:1 states what its phrase carries ... a common frailty." | CURED, fuller answer found in [CR4] | No |
| 34016 | terra | E-ANS Matthew 1:25 [CR3] | CR4: "Matthew 1:25 puts \"knew her not\" after the taking." | CURED, [CR4] | No |
| 34016 | sol | E-ANS Matthew 1:25 [CR3] | CR3 LINK 1 head: "NARROWED TO: the child was conceived before they came together (Matthew 1:18), and Joseph \"knew her not\" from the taking till the birth ... I drop the claim that 1:25 alone covers the span from the finding." | CURED, [CR3] | No |
| 34016 | terra | E-ANS Luke 2:44 [CR3] | CR4 [L4]: "Luke 2:44's \"supposing\" shows the verb carrying a mistaken view." | CURED, [CR4] | No |
| 34016 | sol | E-ANS Luke 2:44 [CR3] | CR3 LINK 5 head: "I drop the claim that the verb always marks an error."; footing [L3] Luke 2:44 | CURED, [CR3] | No |
| 34108 | terra | E-ANS Luke 1:34 [CR3] | The deferral "I answer it fully under LINK 4" points to CR3 LINK 4: footing [L1] Luke 1:34, [L2] epei and ginosko, [L4] "A question of means ... is answered by a means"; and "I grant the conception is future to the angel's words. The answer of 1:35 is given to that future conception." | CURED, KEEP quoting the round | No |
| 34108 | sol | E-ANS Luke 1:34 [CR3] | same as above | CURED, [CR3] | No |
| 34108 | sol | E-HOLD D1 vs C1 | code evidence is the same Luke 1:34 "bare" answer, which is not bare (above) | CURED (pkgUND) | No |

## Causes in the code half
1. A deferral ("I answer it fully under LINK 4") is counted as bare without reading the place it names.
2. Only bullets headed by the verse, in the one round named by the item, are read. Missed: [Ln] lines naming the verse, NARROWED TO heads, other bullets of the same block, and the side's answers in other rounds (CR2, CR4) that the live reader already accepts.
3. The cure test lists a seat whose reply the live reader reads CURED (KEEP quoting the round; CHANGE TO MEETS with a fuller answer found word for word). VP3 overrides that reading.

Also: the 6 two-reader agreements listed CURED (judges changed to MISSES) are on the same answered witnesses; under enforcement P3 would push judges to MISSES where the defender answered.

## Fix asked
- WOULD REMOVE only when the row's live cure reading is UNCURED.
- Code half reads the side's whole answer: follow "under LINK n" / "in [CRn]" to that block, read every line in the round that names the verse (layer lines and NARROWED TO heads included), and the side's later rounds.
- Rerun the 11 listings: expected 0 would-remove, or each remaining one shown with the answer text.
