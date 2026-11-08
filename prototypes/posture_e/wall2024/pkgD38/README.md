# pkgD38: catch stale counts and verdicts after a cure or send-back (W3 3087 ruling 2, 3089)

A library change (LIB v15_R1B -> v16_D38). It does not change the DeepSeek enforcers, so it rides with a gap's graded DeepSeek fix.

## Fault (33592)
- **grok:** send-back S21 moved D5 vs C5 (and D6 vs C4) from DEFENDER LINK BROKEN to UNDERDETERMINED.
  - The count stayed at 3 with counted premises [2, 5, 6], although premise 5's only ground was that collision.
  - The engine derived "KEYSTONE: D6 -- STANDS", while grok's own card still reads "RULING -- KEYSTONE D6 -- BROKEN".
  - Its card "RULING -- D5 vs C5 -- DEFENDER LINK BROKEN" stayed beside the UNDERDETERMINED line.
- **gemini:** its cure set CHALLENGER CONCEDED LINKS to 0, but its text still carries "RULING -- premise 1 against Challenger -- UNEXHIBITED".
- No check compared the stored lines with the judge's own RULING cards and count grounds.

## Change
A new function, `d38Items2024(T0, T1, raw)`, runs in `gateItems2024` on the text after the send-back (T1), against the text before it (T0). Its items are added last, as CONTRADICTION items with src "E-GATE D38", so earlier gate ids keep their numbers. They go to the judge through the existing gate, which answers KEEP or CHANGE TO. KEEP does not cure, and an item is cured when the text no longer raises it. There are four types, each with its own status in `D38_STATUS`, and all are LIVE as built:

| type | raised when |
|---|---|
| COL | a RULING card grades a pair "Dn vs Cm" DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN or UNDERDETERMINED, and the collision line for that pair now has another grade |
| KEY | a RULING card on "KEYSTONE Dn" says STANDS or BROKEN, and the KEYSTONE line now says the other |
| PREM | a RULING card grades a side's premise n UNEXHIBITED or CONCEDED, and that side's count line counts 0 |
| BASIS | the count line is unchanged by the send-back, the counted_premises array matches its number, and premise n is in the array. Premise n's collision moved off SIDE LINK BROKEN this pass, no other collision of n is still broken, and neither the count line nor any RULING card grounds n as CONCEDED, UNEXHIBITED or WITHDRAWN |

It changes 6 nodes: Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge and Alternate Merge Seat. Shas are in plan_D38.json. The other 16 library nodes are byte-identical.

## Test (node pkgD38/test_D38.cjs): 74 OK, 0 FAIL
- 8 unit cases, positive and negative. They include a recounted line clearing BASIS and cards changed to agree clearing COL and KEY.
- Bars met in 33592:
  - grok: BASIS premise 5, KEY D6 and COL D5 vs C5 are sent back.
  - gemini: PREM challenger premise 1 is sent back.
- Replay over 456 node runs in 33 runs: 34 outputs change, all of them gate nodes. Gate Build and Alt Gate Build add 44 D38 items in 11 runs. Gate Record and Alt Gate Record list those items as new, record-only rows, because the saved judge replies predate them. Every item is listed in test_D38.txt.
- By type: COL 34, PREM 8, KEY 1, BASIS 1. COL is a RULING card left at LINK BROKEN after the collision line became UNDERDETERMINED or STANDS.
- pkgLIB_v16_D38: all 22 stubs rebuild the strip_D38 sources byte for byte.

## For W3 to rule
1. LIVE or TRIAL for each type. COL fires often, at 0 to 8 items a run. Each LIVE item uncured after the gate is a gate fault, as for other CONTRADICTION items.
2. PREM on the challenger side asks the judge to reconcile a card with a count of 0. The judge may answer by raising CHALLENGER CONCEDED LINKS, which is an Oracle concede, or by changing the card. The item names both.
3. Not covered: when a seat has no send-back changes, the gate does not run, so a cure-only contradiction such as gemini's is caught only when the seat also has send-back items. Gemini did in 33592.

## Write (W4, at a gap, on that gap's DeepSeek fix)
Write pkgLIB_v16_D38 (Shared Library plus 22 stubs) in the same way as v15_R1B. Revert to pkgLIB_v15_R1B/patched.
